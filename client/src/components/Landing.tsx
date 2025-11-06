import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import cosmicImage from "@assets/image_1762457883939.png";

export default function Landing() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="max-w-7xl mx-auto px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="font-['Montserrat'] text-7xl font-bold text-white mb-4 tracking-tight">
            COSMOGRAPH
          </h1>
          <p className="text-purple-200 text-lg font-light tracking-widest uppercase">
            A Synesthetic Number Universe
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 overflow-hidden shadow-2xl">
          <div className="grid md:grid-cols-2 gap-0">
            <div className="relative overflow-hidden">
              <img
                src={cosmicImage}
                alt="Cosmic Universe"
                className="w-full h-full object-cover"
                data-testid="img-cosmic-graphic"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>

            <div className="p-12 flex flex-col justify-center bg-gradient-to-br from-slate-800/50 to-purple-900/30">
              <h2 className="font-['Montserrat'] text-4xl font-bold text-white mb-6 leading-tight">
                The Largest Cosmically Discovered Number Galaxy on the East Coast
              </h2>
              
              <p className="text-purple-100 text-lg leading-relaxed mb-8">
                Cosmograph brings together data structures, algorithms, and the fragility of the cosmic balance all in one tiny segment of the universe. Come enter a number and explore how planets correlate to one another.
              </p>

              <Button
                onClick={() => setLocation("/universe")}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-full px-10 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all self-start"
                data-testid="button-enter-universe-main"
              >
                ENTER THE UNIVERSE
              </Button>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 text-center">
            <p className="text-sm font-medium tracking-wide px-4">
              Owned & Operated by a Committee of Local Galaxy Explorers and Telescope Owners
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
