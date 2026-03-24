import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { BookOpen, LogOut, User, Play, GraduationCap } from "lucide-react";

interface Subject {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  thumbnail_url: string | null;
}

interface SubjectProgress {
  total: number;
  completed: number;
}

const Subjects = () => {
  const { user, signOut } = useAuth();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [progress, setProgress] = useState<Record<string, SubjectProgress>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    const { data: subjectsData } = await supabase.from("subjects").select("*").eq("is_published", true);
    if (subjectsData) {
      setSubjects(subjectsData);
      // Fetch progress for each subject
      const progressMap: Record<string, SubjectProgress> = {};
      for (const subject of subjectsData) {
        const { data: sections } = await supabase.from("sections").select("id").eq("subject_id", subject.id);
        if (sections && sections.length > 0) {
          const sectionIds = sections.map(s => s.id);
          const { data: videos } = await supabase.from("videos").select("id").in("section_id", sectionIds);
          const total = videos?.length || 0;
          if (total > 0 && user) {
            const videoIds = videos!.map(v => v.id);
            const { data: completed } = await supabase
              .from("video_progress")
              .select("id")
              .eq("user_id", user.id)
              .eq("is_completed", true)
              .in("video_id", videoIds);
            progressMap[subject.id] = { total, completed: completed?.length || 0 };
          } else {
            progressMap[subject.id] = { total, completed: 0 };
          }
        } else {
          progressMap[subject.id] = { total: 0, completed: 0 };
        }
      }
      setProgress(progressMap);
    }
    setLoading(false);
  };

  return (
    <div className="dark min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary">
              <GraduationCap className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold text-foreground" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>LearnHub</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/profile">
              <Button variant="ghost" size="icon"><User className="h-4 w-4" /></Button>
            </Link>
            <Button variant="ghost" size="icon" onClick={signOut}><LogOut className="h-4 w-4" /></Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-foreground">Your Subjects</h1>
          <p className="mt-2 text-muted-foreground">Pick up where you left off, or start something new.</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        ) : subjects.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <BookOpen className="mb-4 h-12 w-12 text-muted-foreground/50" />
              <h3 className="text-lg font-semibold text-foreground">No subjects yet</h3>
              <p className="mt-1 text-sm text-muted-foreground">Subjects will appear here once they're published.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {subjects.map(subject => {
              const p = progress[subject.id] || { total: 0, completed: 0 };
              const pct = p.total > 0 ? Math.round((p.completed / p.total) * 100) : 0;
              return (
                <Link key={subject.id} to={`/subjects/${subject.id}`}>
                  <Card className="group cursor-pointer border-border/50 transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
                    <div className="aspect-video w-full overflow-hidden rounded-t-lg bg-secondary">
                      {subject.thumbnail_url ? (
                        <img src={subject.thumbnail_url} alt={subject.title} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <BookOpen className="h-10 w-10 text-muted-foreground/30" />
                        </div>
                      )}
                    </div>
                    <CardContent className="p-5">
                      <h3 className="font-semibold text-foreground">{subject.title}</h3>
                      {subject.description && (
                        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{subject.description}</p>
                      )}
                      <div className="mt-4 space-y-2">
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>{p.completed}/{p.total} videos</span>
                          <span>{pct}%</span>
                        </div>
                        <Progress value={pct} className="h-1.5" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default Subjects;
