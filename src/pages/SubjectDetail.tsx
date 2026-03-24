import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Play, Lock, CheckCircle2, GraduationCap } from "lucide-react";

interface Video {
  id: string;
  title: string;
  order_index: number;
  duration_seconds: number | null;
}

interface Section {
  id: string;
  title: string;
  order_index: number;
  videos: Video[];
}

interface Subject {
  id: string;
  title: string;
  description: string | null;
}

const SubjectDetail = () => {
  const { subjectId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [subject, setSubject] = useState<Subject | null>(null);
  const [sections, setSections] = useState<Section[]>([]);
  const [completedVideos, setCompletedVideos] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (subjectId) fetchSubjectTree();
  }, [subjectId]);

  const fetchSubjectTree = async () => {
    const { data: subjectData } = await supabase.from("subjects").select("*").eq("id", subjectId!).single();
    if (!subjectData) { navigate("/subjects"); return; }
    setSubject(subjectData);

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

      const tree: Section[] = sectionsData.map(s => ({
        ...s,
        videos: (videosData || []).filter(v => v.section_id === s.id),
      }));
      setSections(tree);

      // Fetch user progress
      if (user && videosData && videosData.length > 0) {
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
    setLoading(false);
  };

  // Build flat ordered list for locking logic
  const allVideos = sections.flatMap(s => s.videos);
  const isUnlocked = (videoId: string) => {
    const idx = allVideos.findIndex(v => v.id === videoId);
    if (idx === 0) return true;
    return completedVideos.has(allVideos[idx - 1].id);
  };

  const totalVideos = allVideos.length;
  const completedCount = completedVideos.size;
  const pct = totalVideos > 0 ? Math.round((completedCount / totalVideos) * 100) : 0;

  if (loading) {
    return (
      <div className="dark flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="dark min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-6">
          <Link to="/subjects">
            <Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button>
          </Link>
          <div className="flex items-center gap-3">
            <GraduationCap className="h-5 w-5 text-primary" />
            <span className="font-semibold text-foreground">{subject?.title}</span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-10">
        {subject?.description && (
          <p className="mb-6 text-muted-foreground">{subject.description}</p>
        )}

        <div className="mb-8 space-y-2">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>{completedCount}/{totalVideos} completed</span>
            <span>{pct}%</span>
          </div>
          <Progress value={pct} className="h-2" />
        </div>

        <div className="space-y-8">
          {sections.map((section, sIdx) => (
            <div key={section.id}>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Section {sIdx + 1} — {section.title}
              </h3>
              <div className="space-y-2">
                {section.videos.map(video => {
                  const unlocked = isUnlocked(video.id);
                  const completed = completedVideos.has(video.id);
                  return (
                    <button
                      key={video.id}
                      onClick={() => unlocked && navigate(`/subjects/${subjectId}/video/${video.id}`)}
                      disabled={!unlocked}
                      className={`flex w-full items-center gap-4 rounded-xl border p-4 text-left transition-all ${
                        completed
                          ? "border-success/20 bg-success/5"
                          : unlocked
                          ? "border-border/50 bg-card hover:border-primary/30 hover:bg-accent"
                          : "cursor-not-allowed border-border/30 bg-muted/30 opacity-50"
                      }`}
                    >
                      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                        completed ? "bg-success/10" : unlocked ? "bg-primary/10" : "bg-muted"
                      }`}>
                        {completed ? (
                          <CheckCircle2 className="h-5 w-5 text-success" />
                        ) : unlocked ? (
                          <Play className="h-5 w-5 text-primary" />
                        ) : (
                          <Lock className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{video.title}</p>
                        {video.duration_seconds && (
                          <p className="text-xs text-muted-foreground">
                            {Math.floor(video.duration_seconds / 60)}:{String(video.duration_seconds % 60).padStart(2, "0")}
                          </p>
                        )}
                      </div>
                      {!unlocked && (
                        <span className="text-xs text-muted-foreground">Complete previous video</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default SubjectDetail;
