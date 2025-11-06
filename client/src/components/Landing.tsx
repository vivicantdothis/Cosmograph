import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import cosmicImage from "@assets/image_1762457883939.png";

export default function Landing() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-[#6B9BD1]">
      <div className="max-w-6xl mx-auto">
        <header className="bg-[#7D8C5E] py-3 px-8 flex items-center justify-between">
          <div className="bg-[#F4EFD3] rounded-full px-6 py-3">
            <h1 className="font-script text-3xl text-[#7D8C5E]">Cosmograph</h1>
          </div>
          
          <Button
            onClick={() => setLocation("/universe")}
            className="bg-[#F4EFD3] text-[#7D8C5E] hover:bg-[#E8E2C6] rounded-full px-6 font-semibold"
            data-testid="button-enter-universe-header"
          >
            ENTER THE UNIVERSE
          </Button>
        </header>

        <div className="bg-white/90 backdrop-blur-sm">
          <div className="grid md:grid-cols-2 gap-0">
            <div className="relative bg-[#F4EFD3] p-8 border-8 border-[#6B9BD1] border-r-0">
              <div 
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage: `repeating-linear-gradient(0deg, #6B9BD1, #6B9BD1 20px, transparent 20px, transparent 40px)`,
                }}
              />
              <div className="relative">
                <img
                  src={cosmicImage}
                  alt="Cosmic Universe"
                  className="w-full h-[400px] object-cover rounded-lg shadow-lg"
                  data-testid="img-cosmic-graphic"
                />
                <div className="absolute bottom-4 right-4 bg-white/90 rounded-full p-3 border-2 border-[#C85A54]">
                  <p className="text-xs font-semibold text-[#C85A54] text-center">
                    100% LOCAL<br/>GALAXIES
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-[#F4EFD3] p-8 flex flex-col justify-center">
              <h2 className="font-serif italic text-4xl text-[#C85A54] mb-4 leading-tight">
                The Largest<br/>
                Cosmically Discovered<br/>
                Number Galaxy<br/>
                on the East Coast
              </h2>
              
              <div className="mb-6">
                <p className="uppercase text-[#7D8C5E] font-bold text-sm mb-3 tracking-wide">
                  WELCOME TO THE CENTER OF THE COSMOGRAPH
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Cosmograph brings together data structures, algorithms, and the fragility of the cosmic balance all in one tiny segment of the universe. Come enter a number and explore how planets correlate to one another.
                </p>
              </div>

              <Button
                onClick={() => setLocation("/universe")}
                className="bg-[#6B9BD1] text-white hover:bg-[#5A8BC0] rounded-full px-8 py-5 font-semibold self-start"
                data-testid="button-enter-universe-main"
              >
                ENTER THE UNIVERSE
              </Button>

              <div className="mt-6 flex gap-3">
                <div className="bg-[#C85A54] text-white p-3 rounded-lg text-xs flex items-center justify-center">
                  <span>📅</span>
                </div>
                <div className="bg-[#6B9BD1] text-white p-3 rounded-lg text-xs flex items-center justify-center">
                  <span>🎫</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#C85A54] text-white py-3 text-center">
            <p className="text-sm uppercase tracking-wider font-semibold">
              Owned & Operated by a Committee of Local Galaxy Explorers and Telescope Owners
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
