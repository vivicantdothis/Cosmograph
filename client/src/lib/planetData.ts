import type { Planet } from "@shared/schema";

const colors = [
  "#B8C5B0",
  "#D4A5A5",
  "#C7B8E6",
  "#E0C992",
  "#A8C5D6",
  "#C9B5A0",
  "#B5D4C8",
  "#E6C8B8",
];

function getPrimeFactors(n: number): number[] {
  const factors: number[] = [];
  let divisor = 2;
  let num = n;

  while (num >= 2) {
    if (num % divisor === 0) {
      factors.push(divisor);
      num = num / divisor;
    } else {
      divisor++;
    }
  }
  return factors;
}

function isPrime(n: number): boolean {
  if (n < 2) return false;
  for (let i = 2; i <= Math.sqrt(n); i++) {
    if (n % i === 0) return false;
  }
  return true;
}

function getDigitSum(n: number): number {
  return n.toString().split('').reduce((sum, digit) => sum + parseInt(digit), 0);
}

function getCategory(n: number): string {
  if (isPrime(n)) return "Prime Celestial";
  if (n % 10 === 0) return "Decimal Giant";
  if (n % 5 === 0) return "Quintuple Star";
  if (n % 2 === 0) return "Binary World";
  return "Odd Wanderer";
}

const descriptions = [
  "a crystalline ice world with shimmering auroras",
  "a volcanic storm planet with rivers of molten minerals",
  "a water-bound tempest world of endless waves",
  "a forest moon covered in bioluminescent vegetation",
  "a desert world with ruby-red sand dunes",
  "a gas giant with swirling emerald clouds",
  "a frozen tundra with crystal spire formations",
  "a rocky planet scarred by ancient meteor impacts",
  "a humid jungle world teeming with exotic life",
  "a barren moon with magnetic dust storms",
  "a twilight planet perpetually bathed in golden light",
  "a nebula-shrouded world of eternal mist",
  "a ringed planet with iridescent halos",
  "a volcanic archipelago of floating islands",
  "a glacial world with deep ice canyons",
  "a storm-tossed ocean planet",
  "a savanna world with crystalline grass plains",
  "a coral reef planet of vast shallow seas",
  "a canyon world carved by ancient rivers",
  "a prismatic world refracting stellar light",
];

const explorerNames = [
  "Esker", "Riebeck", "Chert", "Feldspar", "Gabbro",
  "Captain Vela", "Navigator Orion", "Scout Lyra", "Pioneer Andromeda",
  "Traveler Cassiopeia", "Wanderer Phoenix", "Seeker Draco", "Voyager Cygnus",
  "Explorer Aquila", "Ranger Perseus", "Surveyor Centaurus", "Pilot Vega",
  "Observer Sirius", "Cartographer Polaris", "Pathfinder Altair",
];

const quoteTemplates = [
  "said to be like \"${metaphor}\" by wayward explorer ${name}",
  "described as \"${metaphor}\" by the daring ${name}",
  "called \"${metaphor}\" by intrepid traveler ${name}",
  "known as \"${metaphor}\" according to ${name}",
  "reminiscent of \"${metaphor}\" per explorer ${name}",
];

const metaphors = [
  "a tsunami wave amidst the stars",
  "a jewel in the cosmic crown",
  "nature's gentle whisper in the void",
  "a lighthouse in the celestial sea",
  "a symphony frozen in time",
  "the universe's secret garden",
  "a tempest caught in amber",
  "a dance of light and shadow",
  "the cosmos's forgotten dream",
  "a pearl in the stellar oyster",
  "infinity's quiet contemplation",
  "stardust crystallized into wonder",
  "the void's colorful rebellion",
  "a story written in geology",
  "time's patient sculpture",
  "chaos wearing harmony's mask",
  "the galaxy's hidden treasure",
  "serenity amid the stellar winds",
  "a paradox of beauty and danger",
  "the universe painting with atmosphere",
];

export function generatePlanetData(): Planet[] {
  const planets: Planet[] = [];
  
  for (let i = 1; i <= 100; i++) {
    const primeFactors = getPrimeFactors(i);
    const prime = isPrime(i);
    const digitSum = getDigitSum(i);
    
    const baseSize = 20 + (i % 30);
    const size = prime ? baseSize + 8 : baseSize;
    
    const orbitRadius = 150 + (i * 8) + (Math.sin(i) * 30);
    const orbitSpeed = 15 + (i / 10) + (Math.random() * 10);
    
    const color = colors[i % colors.length];
    
    const descIndex = (i * 7) % descriptions.length;
    const explorerIndex = (i * 3) % explorerNames.length;
    const quoteIndex = (i * 5) % quoteTemplates.length;
    const metaphorIndex = (i * 11) % metaphors.length;
    
    const explorerName = explorerNames[explorerIndex];
    const quote = quoteTemplates[quoteIndex]
      .replace("${metaphor}", metaphors[metaphorIndex])
      .replace("${name}", explorerName);
    
    planets.push({
      number: i,
      name: `P-${i}`,
      size,
      color,
      orbitRadius,
      orbitSpeed,
      description: descriptions[descIndex],
      explorerQuote: quote,
      explorerName,
      properties: {
        primeFactors,
        isPrime: prime,
        isEven: i % 2 === 0,
        digitSum,
        category: getCategory(i),
      },
    });
  }
  
  return planets;
}

export const allPlanets = generatePlanetData();
