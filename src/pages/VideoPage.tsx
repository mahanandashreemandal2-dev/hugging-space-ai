import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import YouTube, { type YouTubeEvent } from "react-youtube";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Lock,
  Play,
  GraduationCap,
} from "lucide-react";

interface Video {
  id: string;
  title: string;
  description: string | null;
  youtube_url: string;
  order_index: number;
  section_id: string;
  duration_seconds: number | null;
}

interface Section {
  id: string;
  title: string;
  order_index: number;
  videos: Video[];
}

const extractYouTubeId = (url: string): string => {
  const match = url.match(/(?:youtu\.be\/|v=|embed\/|watch\?v=)([^&?\s]+)/);
  return match ? match[1] : url;
};

const VideoPage = () => {
  const { subjectId, videoId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const playerRef = useRef<any>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const [video, setVideo] = useState<Video | null>(null);
  const [sections, setSections] = useState<Section[]>([]);
  const [completedVideos, setCompletedVideos] = useState<Set<string>>(new Set());
  const [startPosition, setStartPosition] = useState(0);
  const [subjectTitle, setSubjectTitle] = useState("");
  const [loading, setLoading] = useState(true);

  const allVideos = sections.flatMap(s => s.videos);
  const currentIdx = allVideos.findIndex(v => v.id === videoId);
  const prevVideo = currentIdx > 0 ? allVideos[currentIdx - 1] : null;
  const nextVideo = currentIdx < allVideos.length - 1 ? allVideos[currentIdx + 1] : null;

  useEffect(() => {
    if (subjectId && videoId) fetchData();
    return () => {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
  }, [subjectId, videoId]);

  const fetchData = async () => {
    setLoading(true);
    // Fetch subject
    const { data: subjectData } = await supabase.from("subjects").select("title").eq("id", subjectId!).single();
    if (subjectData) setSubjectTitle(subjectData.title);

    // Fetch video
    const { data: videoData } = await supabase.from("videos").select("*").eq("id", videoId!).single();
    if (!videoData) { navigate(`/subjects/${subjectId}`); return; }
    setVideo(videoData);

    // Fetch full tree for sidebar
    const { data: sectionsData } = await supabase
      .from("sections")
      .select("*")
      .eq("subject_id", subjectId!)
      .order("order_index");

    if (sectionsData) {
      const sectionIds = sectionsData.map(s => s.id);
      const { data: videosData } = await supabase
        .from("videos")
        .select("*")
        .in("section_id", sectionIds)
        .order("order_index");

      setSections(sectionsData.map(s => ({
        ...s,
        videos: (videosData || []).filter(v => v.section_id === s.id),
      })));

      // Fetch progress
      if (user && videosData) {
        const videoIds = videosData.map(v => v.id);
        const { data: progressData } = await supabase
          .from("video_progress")
          .select("video_id")
          .eq("user_id", user.id)
          .eq("is_completed", true)
          .in("video_id", videoIds);
        setCompletedVideos(new Set((progressData || []).map(p => p.video_id)));
      }
    }

    // Fetch resume position
    if (user) {
      const { data: progressRow } = await supabase
        .from("video_progress")
        .select("last_position_seconds")
        .eq("user_id", user.id)
        .eq("video_id", videoId!)
        .maybeSingle();
      if (progressRow) setStartPosition(Math.max(0, progressRow.last_position_seconds - 3));
      else setStartPosition(0);
    }
    setLoading(false);
  };

  const saveProgress = useCallback(async (position: number, completed = false) => {
    if (!user || !videoId) return;
    await supabase.from("video_progress").upsert(
      {
        user_id: user.id,
        video_id: videoId,
        last_position_seconds: Math.floor(position),
        is_completed: completed,
        ...(completed ? { completed_at: new Date().toISOString() } : {}),
      },
      { onConflict: "user_id,video_id" }
    );
  }, [user, videoId]);

  const onPlayerReady = (event: YouTubeEvent) => {
    playerRef.current = event.target;
    if (startPosition > 0) event.target.seekTo(startPosition, true);
  };

  const onPlayerStateChange = (event: YouTubeEvent) => {
    const state = event.data;
    // 1 = playing
    if (state === 1) {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = setInterval(async () => {
        if (playerRef.current) {
          const time = playerRef.current.getCurrentTime();
          await saveProgress(time);
        }
      }, 10000);
    } else {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      // Save on pause
      if (playerRef.current) {
        const time = playerRef.current.getCurrentTime();
        saveProgress(time);
      }
    }
    // 0 = ended
    if (state === 0) {
      handleVideoCompleted();
    }
  };

  const handleVideoCompleted = async () => {
    if (!videoId) return;
    await saveProgress(video?.duration_seconds || 0, true);
    setCompletedVideos(prev => new Set([...prev, videoId]));
    toast({ title: "Video completed! 🎉", description: nextVideo ? "Moving to next video..." : "You've completed this section!" });
    if (nextVideo) {
      setTimeout(() => navigate(`/subjects/${subjectId}/video/${nextVideo.id}`), 1500);
    }
  };

  const isUnlocked = (vid: string) => {
    const idx = allVideos.findIndex(v => v.id === vid);
    if (idx === 0) return true;
    return completedVideos.has(allVideos[idx - 1].id);
  };

  if (loading) {
    return (
      <div className="dark flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="dark flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="hidden w-80 shrink-0 overflow-y-auto border-r border-border/50 bg-card/50 lg:block">
        <div className="sticky top-0 z-10 border-b border-border/50 bg-card/80 px-4 py-4 backdrop-blur-sm">
          <Link to={`/subjects/${subjectId}`} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            <span className="truncate">{subjectTitle}</span>
          </Link>
        </div>
        <div className="p-4 space-y-6">
          {sections.map((section, sIdx) => (
            <div key={section.id}>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {section.title}
              </p>
              <div className="space-y-1">
                {section.videos.map(v => {
                  const unlocked = isUnlocked(v.id);
                  const completed = completedVideos.has(v.id);
                  const active = v.id === videoId;
                  return (
                    <button
                      key={v.id}
                      onClick={() => unlocked && navigate(`/subjects/${subjectId}/video/${v.id}`)}
                      disabled={!unlocked}
                      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-all ${
                        active
                          ? "bg-primary/10 text-primary font-medium"
                          : completed
                          ? "text-success hover:bg-accent"
                          : unlocked
                          ? "text-foreground hover:bg-accent"
                          : "cursor-not-allowed text-muted-foreground/40"
                      }`}
                    >
                      {completed ? (
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-success" />
                      ) : unlocked ? (
                        <Play className="h-4 w-4 shrink-0" />
                      ) : (
                        <Lock className="h-3.5 w-3.5 shrink-0" />
                      )}
                      <span className="truncate">{v.title}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-4xl px-6 py-6">
          {/* Mobile back link */}
          <div className="mb-4 lg:hidden">
            <Link to={`/subjects/${subjectId}`} className="flex items-center gap-2 text-sm text-muted-foreground">
              <ArrowLeft className="h-4 w-4" /> Back to subject
            </Link>
          </div>

          {/* Video Player */}
          <div className="aspect-video w-full overflow-hidden rounded-2xl bg-black">
            {video && (
              <YouTube
                videoId={extractYouTubeId(video.youtube_url)}
                opts={{
                  width: "100%",
                  height: "100%",
                  playerVars: { autoplay: 1, rel: 0, modestbranding: 1, start: Math.floor(startPosition) },
                }}
                onReady={onPlayerReady}
                onStateChange={onPlayerStateChange}
                className="h-full w-full"
                iframeClassName="h-full w-full"
              />
            )}
          </div>

          {/* Video Info */}
          <div className="mt-6">
            <h1 className="text-2xl font-bold text-foreground">{video?.title}</h1>
            {video?.description && (
              <p className="mt-3 text-muted-foreground">{video.description}</p>
            )}
          </div>

          {/* Navigation */}
          <div className="mt-8 flex items-center justify-between">
            <Button
              variant="outline"
              onClick={() => prevVideo && navigate(`/subjects/${subjectId}/video/${prevVideo.id}`)}
              disabled={!prevVideo}
            >
              <ChevronLeft className="mr-1 h-4 w-4" /> Previous
            </Button>
            <Button
              onClick={() => {
                if (nextVideo && isUnlocked(nextVideo.id)) {
                  navigate(`/subjects/${subjectId}/video/${nextVideo.id}`);
                }
              }}
              disabled={!nextVideo || !isUnlocked(nextVideo.id)}
            >
              Next <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default VideoPage;
