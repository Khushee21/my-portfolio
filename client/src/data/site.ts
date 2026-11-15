// Everything you'd want to edit lives here: name, copy, links, projects.

export const site = {
  name: 'KHUSHI RATHORE',
  short: 'KR',
  role: 'Software developer — Next.js · React Native · Nest.js',
  place: 'India · Remote',
  contactLine: 'Open to full-time roles and freelance projects.',
  links: {
    github: 'https://github.com/Khushee21',
    linkedin: 'https://www.linkedin.com/in/khushi-rathore-5363a8257/',
    email: 'mailto:khushirathore649@gmail.com',
    bookCall: 'https://cal.com/khushi-rathore-06jbko',
    resume: '',
  },
}

export type Project = {
  slug: string
  title: string
  kind: string
  stack: string[]
  image: string // wide cover used in the Work carousel and on the stamp
  links: { label: string; href: string }[]
  // Case-study page (/work/<slug>). Drafted from the screenshots — edit freely.
  summary: string
  role: string
  platform: string
  status: string
  overview: string
  challenge: string
  built: string[]
  result: string
  gallery: string[]
  device: 'web' | 'cover' // web = shown in a browser frame on the case-study page
}

export const projects: Project[] = [
  {
    slug: 'mydukan',
    title: 'MYDUKAN',
    kind: 'Retail ERP for Indian shops',
    stack: ['React', 'TypeScript', 'TanStack Router', 'TanStack Query', 'Tailwind', 'shadcn/ui'],
    image: '/projects/mydukan/mydukan-1.jpg',
    links: [{ label: 'Visit mydukan.app', href: 'https://mydukan.app/' }],
    summary: 'Billing, stock, IMEI tracking and GST for Indian retail shops — one ERP on the web and on Android.',
    role: 'Developer',
    platform: 'Web app + Android app',
    status: 'Live',
    overview: 'MyDukan runs the day-to-day of a retail shop: sales and purchase invoices, stock across branches, IMEI and serial tracking for phones, payments, dues and GST. Owners see the whole business on one dashboard and bill customers from their phone.',
    challenge: 'Shop owners are busy and not accountants. Every screen had to answer one question fast — what did I sell, what do I have, who owes me — and still keep the books right for GST.',
    built: [
      'Dashboard with today’s sales, stock value, cash flow, receivables and top sellers',
      'Sales and purchase invoices with draft, approved and cancelled states',
      'Stock across all branches, with IMEI / serial search',
      'Alerts like “purchase bill missing” when items are sold without a purchase',
      'Mobile billing flow for the shop counter',
    ],
    result: 'A live ERP that shops use every day to bill, track stock and stay GST-ready.',
    gallery: ['/projects/mydukan/mydukan-1.jpg', '/projects/mydukan/mydukan-4.jpg', '/projects/mydukan/mydukan-2.jpg', '/projects/mydukan/mydukan-3.jpg'],
    device: 'web',
  },
  {
    slug: 'dizlie',
    title: 'DIZLIE',
    kind: 'Tiffin delivery apps',
    stack: ['Android', 'iOS', 'Live tracking', 'Maps', 'Referrals'],
    image: '/projects/dizlie/dizlie-cover.jpg',
    links: [
      { label: 'Customer app · Google Play', href: 'https://play.google.com/store/apps/details?id=com.dizlie.customerapp&hl=en_IN' },
      { label: 'Delivery partner · App Store', href: 'https://apps.apple.com/us/app/dizlie-delivery-partner/id6803077081' },
    ],
    summary: 'Fresh, home-style tiffins delivered on time — a customer app to order and track, and a delivery-partner app to run the route.',
    role: 'App developer',
    platform: 'Android + iOS apps',
    status: 'Live on Play Store & App Store',
    overview: 'Dizlie is two apps. Customers build their own tiffin, order it and watch it arrive on a live map. Delivery partners get their assigned orders, a route to each address, one-tap calling, and a summary of the day when they finish.',
    challenge: 'Lunch can’t be late. Both sides needed to know exactly where a tiffin is right now, and the rider app had to stay simple enough to use on the move.',
    built: [
      'Customer app: “Make your tiffin” builder, ordering and live order tracking',
      'Refer & earn rewards with shareable codes',
      'Delivery-partner app: active delivery map, next-up queue and “Arrived at location”',
      'Call or message the customer straight from the delivery card',
      '“Mission complete” day summary: assigned, delivered and tiffins collected',
    ],
    result: 'Both apps are live — customers on Google Play, delivery partners on the App Store.',
    gallery: ['/projects/dizlie/dizlie-5.jpg', '/projects/dizlie/dizlie-6.jpg', '/projects/dizlie/dizlie-2.jpg', '/projects/dizlie/dizlie-3.jpg', '/projects/dizlie/dizlie-4.jpg', '/projects/dizlie/dizlie-1.jpg'],
    device: 'cover',
  },
  {
    slug: 'flexzistay',
    title: 'FLEXZISTAY',
    kind: 'Hourly hotel booking',
    stack: ['Web', 'Hotel search', 'Hourly pricing', 'Filters'],
    image: '/projects/flexzistay/flexzistay-1.jpg',
    links: [{ label: 'Visit flexzistay.in', href: 'https://www.flexzistay.in/' }],
    summary: 'Hotel rooms by the hour — book only the time you need, for work, rest or a quick stopover.',
    role: 'Web developer',
    platform: 'Website',
    status: 'Live',
    overview: 'FlexziStay lets guests book a hotel room for a few hours instead of a whole night. Pick a city, a check-in time and how long you need; the site shows hotels with clear prices for 3, 6, 9 or 12 hours, or a full day.',
    challenge: 'Hotels think in nights; guests often need an afternoon. The search and the prices had to work in hours without confusing anyone.',
    built: [
      'Hourly / full-day search by city, check-in time and guests',
      'Hotel listings with price tiers for 3, 6, 9 and 12 hours',
      'Filters for guest rating, price and more',
      'Explainer pages on how hourly stays work',
      '“List your hotel” for property owners',
    ],
    result: 'A live booking site where an hourly stay is as easy to book as a night.',
    gallery: ['/projects/flexzistay/flexzistay-1.jpg', '/projects/flexzistay/flexzistay-2.jpg', '/projects/flexzistay/flexzistay-3.jpg'],
    device: 'web',
  },
  {
    slug: 'zantalk',
    title: 'ZANTALK',
    kind: 'Talk to experts app',
    stack: ['Mobile app', 'Real-time chat', 'Wallet', 'Bookings'],
    image: '/projects/zantalk/zantalk-cover.jpg',
    links: [],
    summary: 'Find a trusted expert — like a chartered accountant — and talk to them by chat, call or booked session, paid per minute from a wallet.',
    role: 'App developer',
    platform: 'Mobile app',
    status: 'App',
    overview: 'Zantalk connects people with verified experts. Users discover recommended consultants with ratings, languages and fees, then book an appointment, call directly or start a chat. Chats run on a timer and are charged from the in-app wallet, and every session ends with a summary and a way to ask follow-up questions.',
    challenge: 'Paying per minute only works if it feels fair. The app had to make the timer, the charges and the wallet obvious, and never bill for a chat that didn’t really start.',
    built: [
      'Discover experts with AI picks, ratings, languages and response time',
      'Book appointment, direct call or chat / ask',
      'Timed paid chats charged from a wallet — nothing charged if the timer never starts',
      'Session summaries and follow-up questions after a chat ends',
      'Consultant account with notifications, bookings and wallet',
    ],
    result: 'A complete consult-an-expert flow, from finding the right person to the summary after the call.',
    gallery: ['/projects/zantalk/zantalk-2.jpg', '/projects/zantalk/zantalk-1.jpg', '/projects/zantalk/zantalk-3.jpg'],
    device: 'cover',
  },
  {
    slug: 'newral',
    title: 'NEWRAL',
    kind: 'Tech agency website',
    stack: ['Website', 'Landing page', 'Responsive'],
    image: '/projects/newral/newral-1.jpg',
    links: [{ label: 'Visit newral.in', href: 'https://www.newral.in/' }],
    summary: '“We build products that scale beautifully” — the website for Newral, a Noida-based tech agency.',
    role: 'Web developer',
    platform: 'Website',
    status: 'Live',
    overview: 'Newral is a Noida-based tech agency crafting UI/UX design, app development and DevOps systems that help startups and modern businesses scale faster. The site introduces the agency, its services and how to get in touch.',
    challenge: 'An agency site is its own portfolio. It had to feel polished and modern in the first screen and turn visitors into a call or a WhatsApp chat.',
    built: [
      'Bold hero with mixed type and product imagery',
      'About, services and contact pages',
      '“Book a call” and “Chat on WhatsApp” calls to action',
      'Responsive layout for phones and desktops',
    ],
    result: 'A live agency website that leads straight to a conversation.',
    gallery: [],
    device: 'web',
  },
  {
    slug: 'quantum-meet',
    title: 'QUANTUM MEET',
    kind: 'AI meetings SaaS',
    stack: ['Nest.js', 'tRPC', 'Drizzle ORM', 'PostgreSQL', 'Inngest'],
    image: '/projects/q (1).png',
    links: [
      { label: 'Visit the live site', href: 'https://quantum-meet.vercel.app/' },
      { label: 'GitHub', href: 'https://github.com/Khushee21/Quantum-meet' },
    ],
    summary: 'An AI-powered meeting platform: create your own AI agents, host a call, and get the summary, transcript and recording the moment it ends.',
    role: 'Design and full-stack build',
    platform: 'Web app (SaaS)',
    status: 'Live',
    overview: 'Quantum Meet is a SaaS where users create AI agents, invite them into video meetings, and instantly get an AI-generated summary, a full transcript, the recording, and a chat to ask questions about the meeting.',
    challenge: 'Meetings produce a lot of talk and very little memory. The goal was to make everything said in a call searchable and useful a minute after it ends, without anyone taking notes.',
    built: [
      'Custom AI agents with their own instructions that join your meetings',
      'Video meetings with recordings saved automatically',
      'AI summary and full transcript generated in the background with Inngest jobs',
      '“Ask AI” chat to question any past meeting',
      'Type-safe API with tRPC and a PostgreSQL database through Drizzle ORM',
    ],
    result: 'A working, deployed SaaS where a meeting turns into notes, a transcript and answers on its own.',
    gallery: ['/projects/q (1).png', '/projects/q (2).png', '/projects/q (3).png', '/projects/q (4).png', '/projects/q (5).png', '/projects/q (6).png', '/projects/q (7).png', '/projects/q (8).png', '/projects/q (9).png', '/projects/q (10).png', '/projects/q(11).png'],
    device: 'web',
  },
  {
    slug: 'confidential',
    title: 'UNDER NDA',
    kind: 'Confidential client work',
    stack: ['Trading dashboard', 'Live charts', 'Wallets', 'Admin panels'],
    image: '/projects/confidential/confidential-cover.jpg',
    links: [],
    summary: 'Some of my favourite work lives behind NDAs — including a trading platform with live charts, positions and wallets.',
    role: 'Developer',
    platform: 'Web apps',
    status: 'Private',
    overview: 'Alongside the projects above, I have built apps for clients that can’t be shown publicly, among them a trading dashboard with live market charts, positions, orders and wallet management.',
    challenge: 'Real-time data, money and strict confidentiality: these apps had to be fast, accurate and private.',
    built: [
      'Trading dashboard with live candlestick charts and indicators',
      'Positions, orders and portfolio views',
      'Wallet, bank account and ticketing sections',
    ],
    result: 'Happy to walk you through this work in an interview.',
    gallery: [],
    device: 'cover',
  },
]

// The intro card: photo on the front, postcard on the back (flips as you scroll).
export const intro = {
  front: { landscape: '/intro/me.jpeg', portrait: '/intro/me.jpeg' },
  note: ['Psst.', 'check', 'the back'],
  greeting: "Hey, I'm Khushi",
  body:
    'A full-stack developer who ships to production. At R2A Dynamics I build an AI-matched consultant platform and a forex trading app, run the AWS infrastructure and mentor 3 developers. I’ve cut invoice latency by 40% at Flexzistay, made a 500K-record CRM 100× faster, sped up logins by 47%, and self-deployed 6+ freelance apps end to end.',
  lines: ['Khushi Rathore', 'Full Stack Developer', 'R2A Dynamics · 2 yrs exp'],
  badges: [
    { label: 'FULL STACK', glyph: '</>', color: '#2440c8' },
    { label: 'SYSTEMS', glyph: '{ }', color: '#ff6fb1' },
    { label: 'MOBILE', glyph: '▢', color: '#1f9d6b' },
    { label: 'DEVOPS', glyph: '>_', color: '#ffd23f' },
  ],
  postmark: { ring: 'OPEN TO WORK · PORTFOLIO ·', date: 'NOV 15', year: '2026' },
  stamp: '/img/avtar.png',
}

// The sealed letter in the footer ("I wrote you something"). Edit freely.
export const letter = {
  to: ['To: the', 'special', 'person', 'reading this'],
  greeting: 'Hey you,',
  paragraphs: [
    'Thank you for scrolling all the way down here. That already makes you one of my favourite people on the internet.',
    'I started coding because I wanted to build things the people around me could actually use. Somewhere between debugging at 2 a.m. and shipping my first app, it became the thing I love most.',
    'What I care about is the small stuff: a bill a shop owner can make in seconds, a tiffin you can watch arrive on a map, a screen that just makes sense the first time you see it.',
    "If you're building something like that, I'd love to be part of your team.",
  ],
  signoff: 'With sunflowers and a cup of chai,',
  name: '— Khushi',
}

// Photos the instant camera (bottom-right) prints, in order. Put files in public/polaroids/.
export const polaroids = [
  { src: '/polaroids/photo-01.jpg', caption: 'peacock spotting 🦚', pos: '35% 60%' },
  { src: '/polaroids/photo-02.jpg', caption: 'orange skies', pos: '50% 40%' },
  { src: '/polaroids/photo-03.jpg', caption: 'dosa > everything', pos: '50% 50%' },
  { src: '/polaroids/photo-04.jpg', caption: 'made a new friend 🦜', pos: '60% 60%' },
  { src: '/polaroids/photo-05.jpg', caption: 'coding with a view', pos: '30% 55%' },
  { src: '/polaroids/photo-06.jpg', caption: 'sunset through the trees', pos: '50% 45%' },
  { src: '/polaroids/photo-07.jpg', caption: 'hawa mahal evenings', pos: '50% 50%' },
  { src: '/polaroids/photo-08.jpg', caption: 'office debugging hours', pos: '50% 60%' },
  { src: '/polaroids/photo-09.jpg', caption: 'monsoon clouds', pos: '50% 40%' },
  { src: '/polaroids/photo-10.jpg', caption: 'alone, not lonely', pos: '50% 55%' },
  { src: '/polaroids/photo-11.jpg', caption: 'make a wish 🎂', pos: '50% 45%' },
  { src: '/polaroids/photo-12.jpg', caption: 'moon + one star', pos: '62% 55%' },
]

