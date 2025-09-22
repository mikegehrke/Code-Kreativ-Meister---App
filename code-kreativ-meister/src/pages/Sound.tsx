import { useEffect } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Music } from "lucide-react";

interface Artist {
  name: string;
  handle: string;
  avatar?: string;
}

const Sound = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const location = useLocation() as { state?: { title?: string; artist?: Artist } };
  const title = location.state?.title || `Sound ${slug}`;
  const artist = location.state?.artist || { name: "Unbekannt", handle: "unknown" };

  useEffect(() => {
    document.title = `${title} | Sound`;
  }, [title]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur border-b">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate(-1)}>Zurück</Button>
          <h1 className="text-lg font-semibold">{title}</h1>
          <div />
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6">
        <section className="rounded-xl border p-6 flex items-center gap-4">
          <div className="h-14 w-14 rounded-lg bg-primary/10 flex items-center justify-center">
            <Music className="h-7 w-7" />
          </div>
          <div>
            <h2 className="text-xl font-bold">{title}</h2>
            <p className="text-muted-foreground">von @{artist.handle}</p>
          </div>
          <div className="ml-auto">
            <Button>Sound verwenden</Button>
          </div>
        </section>
      </main>

      <link rel="canonical" href={`${window.location.origin}/sound/${slug}`} />
    </div>
  );
};

export default Sound;
