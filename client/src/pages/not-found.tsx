import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="font-script text-6xl mb-4 text-foreground">Lost in Space</h1>
      <p className="text-muted-foreground mb-8">This celestial body doesn't exist in our universe.</p>
      <Button onClick={() => setLocation("/")} data-testid="button-home">
        Return to Origin
      </Button>
    </div>
  );
}
