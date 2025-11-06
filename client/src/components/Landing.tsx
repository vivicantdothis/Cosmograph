import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import cosmicImage from "@assets/image_1762457507336.png";

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

          <div className="grid md:grid-cols-2 gap-8 p-12 bg-[#C85A54]">
            <div className="bg-[#F4EFD3] p-8 rounded-lg">
              <h3 className="font-serif italic text-2xl text-[#C85A54] mb-4">Who We Are</h3>
              <p className="text-gray-700 leading-relaxed">
                We're a community-driven initiative where curiosity can be a passionate connector of local explorers and cosmic enthusiasts. Together, we've created a space where data structures, mathematical elegance, and interstellar wonders gather to celebrate the beauty of numerical discovery.
              </p>
            </div>

            <div className="bg-[#F4EFD3] p-8 rounded-lg">
              <h3 className="font-serif italic text-2xl text-[#C85A54] mb-4">Our Mission</h3>
              <p className="text-gray-700 leading-relaxed">
                Our aim is to provide a platform for exploration of the cosmos through numbers. We believe in making the mysteries of data structures, algorithms, and their cosmic connections accessible to all—inviting you to discover, learn, and marvel at the universe within mathematics.
              </p>
            </div>
          </div>

          <div className="py-12 bg-white">
            <h3 className="font-serif italic text-4xl text-center text-[#C85A54] mb-12">
              Ways to Support Us
            </h3>
            
            <div className="grid md:grid-cols-2 gap-6 px-12 max-w-5xl mx-auto">
              <div className="bg-[#E8F4FF] border-2 border-[#6B9BD1] rounded-xl p-6">
                <div className="mb-4 text-[#6B9BD1]">
                  <svg className="w-16 h-16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h4 className="text-[#6B9BD1] font-bold text-xl mb-2">Become an Explorer</h4>
                <p className="text-gray-700 text-sm mb-4">
                  Join our community of cosmic explorers. Share discoveries, contribute insights, and help map the numerical universe.
                </p>
                <div className="flex gap-4 text-xs text-[#6B9BD1]">
                  <span>✦ FLEXIBLE TIME</span>
                  <span>✦ DISCOVERY FOCUSED</span>
                </div>
              </div>

              <div className="bg-[#E8F4FF] border-2 border-[#6B9BD1] rounded-xl p-6">
                <div className="mb-4 text-[#6B9BD1]">
                  <svg className="w-16 h-16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h4 className="text-[#6B9BD1] font-bold text-xl mb-2">Share Knowledge</h4>
                <p className="text-gray-700 text-sm mb-4">
                  Document your explorations, teach others about cosmic patterns, and contribute to our growing library of numerical discoveries.
                </p>
                <div className="flex gap-4 text-xs text-[#6B9BD1]">
                  <span>✦ EDUCATIONAL</span>
                  <span>✦ COMMUNITY DRIVEN</span>
                </div>
              </div>

              <div className="bg-[#E8F4FF] border-2 border-[#6B9BD1] rounded-xl p-6">
                <div className="mb-4 text-[#6B9BD1]">
                  <svg className="w-16 h-16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h4 className="text-[#6B9BD1] font-bold text-xl mb-2">Explore Patterns</h4>
                <p className="text-gray-700 text-sm mb-4">
                  Discover the connections between numbers. Find prime constellations, trace algorithmic pathways, and uncover hidden structures.
                </p>
                <div className="flex gap-4 text-xs text-[#6B9BD1]">
                  <span>✦ DATA DRIVEN</span>
                  <span>✦ VISUAL INSIGHTS</span>
                </div>
              </div>

              <div className="bg-[#E8F4FF] border-2 border-[#6B9BD1] rounded-xl p-6">
                <div className="mb-4 text-[#6B9BD1]">
                  <svg className="w-16 h-16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h4 className="text-[#6B9BD1] font-bold text-xl mb-2">Build Connections</h4>
                <p className="text-gray-700 text-sm mb-4">
                  Create your own numerical universe. Map relationships, build networks, and visualize the cosmic web of mathematical connections.
                </p>
                <div className="flex gap-4 text-xs text-[#6B9BD1]">
                  <span>✦ INTERACTIVE</span>
                  <span>✦ CREATIVE FREEDOM</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
