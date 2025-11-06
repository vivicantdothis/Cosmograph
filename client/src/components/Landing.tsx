import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import cosmicImage from "@assets/image_1762457883939.png";
import calendarIcon from "@assets/generated_images/Calendar_stamp_icon_aae7fb01.png";
import ticketIcon from "@assets/generated_images/Ticket_stamp_icon_9c791844.png";

export default function Landing() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-[#6B9BD1]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
      <div className="max-w-6xl mx-auto">
        <header className="bg-[#7D8C5E] py-3 px-8 flex items-center justify-between border-b-4 border-black">
          <div className="bg-[#F4EFD3] rounded-full px-6 py-3 border-2 border-black">
            <h1 className="font-script text-3xl text-[#7D8C5E]" style={{ textShadow: '1px 1px 0px rgba(0,0,0,0.3)' }}>Cosmograph</h1>
          </div>
          
          <Button
            onClick={() => setLocation("/universe")}
            className="bg-[#F4EFD3] text-[#7D8C5E] hover:bg-[#E8E2C6] rounded-full px-6 font-bold border-2 border-black"
            data-testid="button-enter-universe-header"
          >
            ENTER THE UNIVERSE
          </Button>
        </header>

        <div className="bg-white/90 backdrop-blur-sm border-4 border-black">
          <div className="grid md:grid-cols-2 gap-0">
            <div className="relative bg-[#F4EFD3] p-8 border-r-4 border-black" style={{
              backgroundImage: `repeating-linear-gradient(0deg, #6B9BD1 0px, #6B9BD1 20px, transparent 20px, transparent 40px)`,
              backgroundBlendMode: 'overlay',
              backgroundSize: '100% 100%',
            }}>
              <div className="relative">
                <img
                  src={cosmicImage}
                  alt="Cosmic Universe"
                  className="w-full h-[400px] object-cover rounded-lg shadow-lg border-3 border-black"
                  data-testid="img-cosmic-graphic"
                />
                <div className="absolute bottom-4 right-4 bg-white/95 rounded-full p-3 border-3 border-[#C85A54] shadow-lg">
                  <p className="text-xs font-bold text-[#C85A54] text-center leading-tight">
                    100% LOCAL<br/>GALAXIES
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-[#F4EFD3] p-8 flex flex-col justify-center">
              <h2 className="font-serif italic text-4xl text-[#C85A54] mb-4 leading-tight font-bold" style={{ textShadow: '1px 1px 0px rgba(0,0,0,0.2)' }}>
                The Largest<br/>
                Cosmically Discovered<br/>
                Number Galaxy<br/>
                on the East Coast
              </h2>
              
              <div className="mb-6">
                <p className="uppercase text-[#7D8C5E] font-bold text-sm mb-3 tracking-wide">
                  WELCOME TO THE CENTER OF THE COSMOGRAPH
                </p>
                <p className="text-gray-800 leading-relaxed font-medium">
                  Cosmograph brings together data structures, algorithms, and the fragility of the cosmic balance all in one tiny segment of the universe. Come enter a number and explore how planets correlate to one another.
                </p>
              </div>

              <Button
                onClick={() => setLocation("/universe")}
                className="bg-[#6B9BD1] text-white hover:bg-[#5A8BC0] rounded-full px-8 py-5 font-bold border-2 border-black shadow-lg"
                data-testid="button-enter-universe-main"
              >
                ENTER THE UNIVERSE
              </Button>

              <div className="mt-6 flex gap-3">
                <div className="bg-[#C85A54] p-3 rounded-lg border-2 border-black shadow-md">
                  <img src={calendarIcon} alt="Calendar" className="w-8 h-8" />
                </div>
                <div className="bg-[#6B9BD1] p-3 rounded-lg border-2 border-black shadow-md">
                  <img src={ticketIcon} alt="Ticket" className="w-8 h-8" />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#C85A54] text-white py-3 text-center border-t-4 border-black">
            <p className="text-sm uppercase tracking-wider font-bold" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }}>
              Owned & Operated by a Committee of Local Galaxy Explorers and Telescope Owners
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
