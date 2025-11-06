import type { Planet } from "@shared/schema";

const colors = [
  "#FF6B9D", "#FFB5E8", "#B4E7CE", "#A7C7E7", "#E7C6FF", "#FFE5B4",
  "#C1FFC1", "#FFB3BA", "#BAFFC9", "#BAE1FF", "#FFFFBA", "#FFDFBA",
  "#E0BBE4", "#D4F1F4", "#B5EAD7", "#C7CEEA", "#FFDFD3", "#F0E68C",
  "#DDA0DD", "#F0E6FF", "#FFE4E1", "#E6E6FA", "#F0FFF0", "#FFF0F5",
  "#98D8C8", "#F7CAC9", "#92A8D1", "#F4C2C2", "#B2E0E0", "#D5AAFF",
  "#FFB6C1", "#AFEEEE", "#DEB887", "#F5DEB3", "#D8BFD8", "#FFE4B5",
  "#E0E0E0", "#FFE4C4", "#F5F5DC", "#FAEBD7", "#FFE5CC", "#FFDAB9"
];

type PlanetFeature = "rings" | "asteroids" | "spots" | "none";

function getRandomFeature(seed: number): PlanetFeature {
  const features: PlanetFeature[] = ["rings", "asteroids", "spots", "none"];
  return features[seed % 4];
}

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
  "Commander Cassini", "Explorer Kepler", "Astronomer Galileo", 
  "Voyager Hubble", "Surveyor Sagan", "Observer Hawking"
];

const quoteTemplates = [
  "The cosmic winds here whisper ancient secrets.",
  "I've never seen such breathtaking stellar formations.",
  "This world defies all conventional understanding.",
  "The numerical patterns here are extraordinary.",
  "A truly remarkable discovery in the void.",
  "The balance of forces here is mesmerizing.",
  "I could study this celestial body for lifetimes.",
  "The mathematical harmony is beyond description.",
  "This planet holds keys to universal mysteries.",
  "A testament to the beauty of cosmic order.",
];

function generatePlanet(number: number): Planet {
  const baseRadius = 150;
  const radiusIncrement = 35;
  const orbitRadius = baseRadius + (number % 10) * radiusIncrement;
  
  const size = 15 + (number % 7) * 3;
  const color = colors[(number - 1) % colors.length];
  const feature = getRandomFeature(number);
  
  const description = descriptions[(number - 1) % descriptions.length];
  const explorerName = explorerNames[(number - 1) % explorerNames.length];
  const quote = quoteTemplates[(number - 1) % quoteTemplates.length];
  
  const orbitSpeed = 100 + (number % 5) * 20;

  return {
    number,
    color,
    size,
    orbitRadius,
    orbitSpeed,
    description,
    explorerQuote: `"${quote}" - ${explorerName}`,
    feature,
    properties: {
      isPrime: isPrime(number),
      isEven: number % 2 === 0,
      digitSum: getDigitSum(number),
      primeFactors: getPrimeFactors(number),
      category: getCategory(number),
    },
  };
}

export const allPlanets: Planet[] = Array.from({ length: 100 }, (_, i) => 
  generatePlanet(i + 1)
);
