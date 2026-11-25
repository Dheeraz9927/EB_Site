// Business details and page copy. Edit text here; components only handle layout.
// Only publish details the brokerage has confirmed.

export const business = {
  name: 'Elaena Brokers Inc.',
  shortName: 'Elaena Brokers',
  locality: 'Hamilton',
  region: 'Ontario',
  regionCode: 'ON',
  country: 'CA',
  network: 'UniBrokers',
  owner: 'Aayush Khatri',
};

export const contact = {
  phoneDisplay: '+1 647-917-2693',
  phoneHref: 'tel:+16479172693',
  email: 'akhatri@unibrokers.ca',
  hours: 'Monday to Friday, 9 am – 7 pm',
  // Used for search-engine structured data (24-hour clock).
  openingHours: { days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '09:00', closes: '19:00' },
};

export const nav = [
  { href: '#coverage', label: 'Your coverage' },
  { href: '#story', label: 'Our story' },
  { href: '#team', label: 'Our people' },
  { href: '#answers', label: 'FAQs' },
  { href: '#contact', label: 'Contact' },
];

export const hero = {
  eyebrow: 'ROOTED IN HAMILTON. FOCUSED ON YOU.',
  title: ['Life moves.', 'We help you'],
  titleEmphasis: 'move protected.',
  body: 'The everyday drives. The place you call home. The business you’re building. Insurance that starts with understanding you.',
  primaryCta: { href: '#coverage', label: 'Find your coverage' },
  secondaryCta: { href: '#contact', label: 'Talk to a broker' },
  footLine: 'Personal advice. Real people.',
  footSub: 'A proud UniBrokers franchise.',
  imageAlt: 'A welcoming contemporary home with warmly lit windows at dusk',
  caption: { label: 'FOR EVERYTHING YOU’RE BUILDING', lines: ['A little more certainty.', 'A lot more living.'] },
  note: { title: 'Big moments. Everyday peace of mind.', sub: 'We’re here for both.' },
  index: '01 / YOUR NEXT CHAPTER',
};

export const trust = [
  { title: '10 years', text: 'of P&C experience behind our founder' },
  { title: 'One dedicated team', text: 'for your home, your car and your business' },
  { title: 'Hamilton, Ontario', text: 'local roots and a personal approach' },
];

export const approach = {
  eyebrow: 'THE ELAENA APPROACH',
  title: 'Less jargon.',
  titleEmphasis: 'More “I’ve got this.”',
  intro: ['You don’t need to be an insurance expert.', 'You just need someone who takes the time.'],
  steps: [
    { title: 'First, we listen.', text: 'Your priorities, your plans and your questions. That’s where a useful insurance conversation begins.' },
    { title: 'Then, we make it clear.', text: 'We walk through the options, explain the details and help you understand the trade-offs.' },
    { title: 'We stay in your corner.', text: 'As life changes, your insurance needs can too. Our brokers and support team help you navigate what’s next.' },
  ],
};

export const story = {
  artEyebrow: 'EXPERIENCE WITH A PERSONAL SIDE',
  years: '10',
  yearsLabel: ['YEARS IN P&C', 'INSURANCE'],
  careerPath: ['Allstate', 'All-Risks', 'Elaena'],
  artQuote: ['A decade of experience.', 'A new chapter built around you.'],
  eyebrow: '02 / OUR STORY',
  title: 'Built on experience.',
  titleEmphasis: 'Driven by people.',
  paragraphs: [
    'After 10 years in property and casualty insurance, including experience with Allstate and All-Risks, Aayush Khatri founded Elaena Brokers Inc. as a franchise under UniBrokers.',
    'Based in Hamilton, Elaena brings that experience to the things that matter in everyday life: your car, your home and your business.',
    'Our approach is personal. We take time to understand your situation, bring clarity to your options and help you make informed choices.',
  ],
  signoff: { initials: 'AK', name: 'Aayush Khatri', role: 'Owner · Elaena Brokers Inc.' },
};

export const contactSection = {
  eyebrow: '04 / TALK TO US',
  title: 'Ready when',
  titleEmphasis: 'you are.',
  body: 'Call or email the Elaena team to talk through your auto, home or commercial insurance. If you’ve used our call planner, you’ll already know what to have ready.',
  note: 'Please don’t email driver’s licence, banking or payment details. A broker will let you know what’s needed and how to share it.',
};

export const closing = {
  eyebrow: 'YOUR NEXT CHAPTER STARTS WITH A CONVERSATION',
  title: 'More living.',
  titleEmphasis: 'Less second-guessing.',
  body: 'Let’s make sense of what you need to protect.',
  cta: 'Get ready for your call',
  small: 'See what to have ready, then call or email us when it suits you.',
};

export const footer = {
  tagline: ['Personal advice. Real people.', 'Hamilton, Ontario · A UniBrokers franchise'],
  motto: 'Auto. Home. Commercial. You.',
  legal: 'Information on this website is general in nature. Insurance coverage is subject to the applicable policy’s terms, conditions and exclusions. This website does not bind or change coverage.',
};

// The call planner dialog. It never sends anything itself.
export const planner = {
  eyebrow: 'A LITTLE PREPARATION. A BETTER CONVERSATION.',
  title: 'What’s on',
  titleEmphasis: 'your mind?',
  intro: 'Choose what you’d like to protect. Tick things off as you find them, then get in touch when you’re ready.',
  empty: 'Choose a category to see what to have ready.',
  readyTitle: 'Ready to talk?',
  emailLabel: 'Email us about this',
  note: 'Nothing here is saved or sent. The email button opens a draft in your own email app, which you can edit before sending. Contacting us doesn’t request a quote or arrange coverage.',
};
