export const coverageKeys = ['auto', 'home', 'commercial'] as const;
export type CoverageKey = typeof coverageKeys[number];
export interface Coverage { label:string; title:string[]; description:string; cta:string; points:string[][]; image:{ src:string; alt:string }; }
export const coverage: Record<CoverageKey,Coverage> = {
  "auto": {
    "label": "AUTO / EVERY JOURNEY MATTERS",
    "title": [
      "For the road ahead.",
      "And the unexpected turns."
    ],
    "description": "From your daily commute to the weekend escape, let’s find coverage that reflects how you drive and what you need.",
    "cta": "Plan my auto coverage",
    "image": { "src": "/assets/photos/auto", "alt": "A family gathered around the open boot of their car" },
    "points": [
      [
        "Your vehicle & your routine",
        "How you use your car, who drives it, and the journeys you make."
      ],
      [
        "Protection that makes sense",
        "Liability, vehicle damage options, deductibles and the details worth discussing."
      ],
      [
        "Changes along the way",
        "A new vehicle, another driver, or a different commute. Keep your broker in the loop."
      ]
    ]
  },
  "home": {
    "label": "HOME / YOUR OWN LITTLE WORLD",
    "title": [
      "For your favourite place.",
      "And what makes it yours."
    ],
    "description": "Whether you own a house, live in a condo or rent your home, we’ll help you explore protection for your space and the things you value.",
    "cta": "Plan my home coverage",
    "image": { "src": "/assets/photos/home", "alt": "A family laughing together in their kitchen" },
    "points": [
      [
        "The place you call home",
        "Tell us about your property, how you use it and whether you own or rent."
      ],
      [
        "The details behind the door",
        "Discuss your belongings, property features, liability needs and any special items."
      ],
      [
        "Room for life to change",
        "Renovations, a move or a change in occupancy are all good reasons to review your policy."
      ]
    ]
  },
  "commercial": {
    "label": "COMMERCIAL / AMBITION, PROTECTED",
    "title": [
      "For what you’re building.",
      "And where you go next."
    ],
    "description": "You put a lot into your business. Let’s understand your operations and explore insurance options that reflect the work you do.",
    "cta": "Plan my business coverage",
    "image": { "src": "/assets/photos/commercial", "alt": "A small business owner preparing orders in her workshop" },
    "points": [
      [
        "Your business, understood",
        "Your industry, operations, premises and people shape the insurance conversation."
      ],
      [
        "Risks worth discussing",
        "Explore property, liability and other coverage needs with a broker who takes time to understand."
      ],
      [
        "Support as you grow",
        "New equipment, services, locations or vehicles can mean it’s time to revisit your coverage."
      ]
    ]
  }
};
export const checklists: Record<CoverageKey,{title:string; items:string[]}> = {
  "auto": {
    "title": "Auto insurance",
    "items": [
      "Current insurance policy and renewal date, if applicable",
      "Vehicle year, make, model and VIN",
      "Driver details and how the vehicle is used",
      "Questions about coverage limits and deductibles"
    ]
  },
  "home": {
    "title": "Home insurance",
    "items": [
      "Current policy and renewal date, if applicable",
      "Property address and whether you own, rent or own a condo",
      "Property details, renovations and occupancy",
      "Questions about belongings, special items and coverage needs"
    ]
  },
  "commercial": {
    "title": "Commercial insurance",
    "items": [
      "Description of your business and its operations",
      "Business locations, equipment and property details",
      "Current policies and renewal dates, if applicable",
      "Changes to your business and risks you want to discuss"
    ]
  }
};
export function isCoverageKey(value:string): value is CoverageKey { return coverageKeys.some(key => key === value); }

// Dedicated pages for each coverage type (search-friendly URLs).
export const coveragePages: Record<CoverageKey,{slug:string; navLabel:string; metaTitle:string; metaDescription:string; heading:string}> = {
  auto: {
    slug: 'auto-insurance',
    navLabel: 'Auto insurance',
    metaTitle: 'Auto insurance broker in Hamilton | Elaena Brokers Inc.',
    metaDescription: 'Talk to Elaena Brokers Inc., a Hamilton-based UniBrokers franchise, about auto insurance for your vehicle, drivers and daily routine.',
    heading: 'Auto insurance in Hamilton',
  },
  home: {
    slug: 'home-insurance',
    navLabel: 'Home insurance',
    metaTitle: 'Home, condo and tenant insurance broker in Hamilton | Elaena Brokers Inc.',
    metaDescription: 'Explore home, condo and tenant insurance options with Elaena Brokers Inc., a Hamilton-based UniBrokers franchise.',
    heading: 'Home insurance in Hamilton',
  },
  commercial: {
    slug: 'commercial-insurance',
    navLabel: 'Commercial insurance',
    metaTitle: 'Commercial insurance broker in Hamilton | Elaena Brokers Inc.',
    metaDescription: 'Discuss commercial insurance for your operations, premises and people with Elaena Brokers Inc. in Hamilton, Ontario.',
    heading: 'Commercial insurance in Hamilton',
  },
};
