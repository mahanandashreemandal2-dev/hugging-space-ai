import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, User, BookOpen, GraduationCap } from "lucide-react";

const LMSProfile = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [subjectProgress, setSubjectProgress] = useState<{ title: string; total: number; completed: number }[]>([]);

  useEffect(() => {
    if (user) fetchProfile();
  }, [user]);

  const fetchProfile = async () => {
    const { data: profile } = await supabase.from("profiles").select("name").eq("user_id", user!.id).single();
    if (profile) setName(profile.name);

    // Fetch all subjects progress
    const { data: subjects } = await supabase.from("subjects").select("*").eq("is_published", true);
    if (subjects) {
      const progressList = [];
      for (const subject of subjects) {
        const { data: sections } = await supabase.from("sections").select("id").eq("subject_id", subject.id);
        if (sections && sections.length > 0) {
          const { data: videos } = await supabase.from("videos").select("id").in("section_id", sections.map(s => s.id));
          const total = videos?.length || 0;
          let completed = 0;
          if (total > 0) {
            const { data: cp } = await supabase
              .from("video_progress")
              .select("id")
              .eq("user_id", user!.id)
              .eq("is_completed", true)
              .in("video_id", videos!.map(v => v.id));
            completed = cp?.length || 0;
          }
          progressList.push({ title: subject.title, total, completed });
        }
      }
      setSubjectProgress(progressList);
    }
    setLoading(false);
  };

  const handleSave = async () => {
    const { error } = await supabase.from("profiles").update({ name }).eq("user_id", user!.id);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else toast({ title: "Profile updated" });
  };

  return (
    <div className="dark min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-4xl items-center gap-4 px-6">
          <Link to="/subjects"><Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button></Link>
          <GraduationCap className="h-5 w-5 text-primary" />
          <span className="font-semibold text-foreground">Profile</span>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-10 space-y-8">
        {loading ? (
          <div className="flex justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" /></div>
        ) : (
          <>
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><User className="h-5 w-5 text-primary" /> Personal Info</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input value={name} onChange={e => setName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input value={user?.email || ""} readOnly className="text-muted-foreground" />
                </div>
                <Button onClick={handleSave}>Save Changes</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><BookOpen className="h-5 w-5 text-primary" /> Learning Progress</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                {subjectProgress.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No subjects available.</p>
                ) : (
                  subjectProgress.map((sp, i) => {
                    const pct = sp.total > 0 ? Math.round((sp.completed / sp.total) * 100) : 0;
                    return (
                      <div key={i} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium text-foreground">{sp.title}</span>
                          <span className="text-muted-foreground">{sp.completed}/{sp.total} ({pct}%)</span>
                        </div>
                        <Progress value={pct} className="h-2" />
                      </div>
                    );
                  })
                )}
              </CardContent>
            </Card>

            <Button variant="outline" onClick={signOut} className="w-full">Sign Out</Button>
          </>
        )}
      </main>
    </div>
  );
};

export default LMSProfile;
