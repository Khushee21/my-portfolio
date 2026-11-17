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
    twitter: 'https://x.com/KhushieRathore',
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
  linkNote?: string // shown instead of a link when there's none yet (e.g. "under construction")
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
    stack: ['React', 'TypeScript', 'TanStack Router', 'TanStack Query', 'Tailwind', 'shadcn/ui', 'MCP', 'Claude'],
    image: '/projects/mydukan/mydukan-1.jpg',
    links: [{ label: 'Visit mydukan.app', href: 'https://mydukan.app/' }],
    summary: 'Billing, stock, IMEI tracking and GST for Indian retail shops — one ERP on the web and on Android.',
    role: 'Developer',
    platform: 'Web app + Android app',
    status: 'Live',
    overview: 'MyDukan runs the day-to-day of a retail shop: sales and purchase invoices, stock across branches, IMEI and serial tracking for phones, payments, dues and GST. Owners see the whole business on one dashboard and bill customers from their phone. We also built in-house usage analytics for the app and exposed it to Claude through an MCP server, so the support team can find and help struggling shops in plain language.',
    challenge: 'Shop owners are busy and not accountants. Every screen had to answer one question fast — what did I sell, what do I have, who owes me — and still keep the books right for GST.',
    built: [
      'Dashboard with today’s sales, stock value, cash flow, receivables and top sellers',
      'Sales and purchase invoices with draft, approved and cancelled states',
      'Stock across all branches, with IMEI / serial search',
      'Alerts like “purchase bill missing” when items are sold without a purchase',
      'Mobile billing flow for the shop counter',
      'In-house usage analytics: the phone detects friction signals like rage taps, dead taps and abandoned forms, and a nightly job turns them into a satisfaction score per user, with plain-language reasons',
      'An MCP server that exposes this data to Claude as tools: a support admin asks in plain language who is struggling and why, and Claude pulls the data, suggests the right training and drafts a push notification',
      'Every send goes through a preview-then-confirm step, so a human always approves it',
      'Product content for MyDukan made with Claude and tools like HyperFrames, FFmpeg, Whisper, yt-dlp, Weavy.ai and ComfyUI',
    ],
    result: 'A live ERP that shops use every day to bill, track stock and stay GST-ready, with usage analytics that Claude can query to help struggling users.',
    gallery: ['/projects/mydukan/mydukan-1.jpg', '/projects/mydukan/mydukan-4.jpg', '/projects/mydukan/mydukan-2.jpg', '/projects/mydukan/mydukan-3.jpg'],
    device: 'web',
  },
  {
    slug: 'dizlie',
    title: 'DIZLIE',
    kind: 'Tiffin subscription & delivery platform',
    stack: ['React Native', 'Next.js', 'Node.js', 'PostgreSQL', 'Prisma', 'Razorpay', 'Google Maps', 'AWS'],
    image: '/projects/dizlie/dizlie-cover.jpg',
    links: [
      { label: 'Customer app · Google Play', href: 'https://play.google.com/store/apps/details?id=com.dizlie.customerapp&hl=en_IN' },
      { label: 'Delivery partner · App Store', href: 'https://apps.apple.com/us/app/dizlie-delivery-partner/id6803077081' },
    ],
    summary: 'An end-to-end tiffin subscription and delivery platform: a customer app, a delivery-partner app and an admin dashboard on one backend, built and shipped by me.',
    role: 'Sole engineer, end to end',
    platform: 'Android + iOS apps, admin web dashboard',
    status: 'Live on Google Play & the App Store',
    overview: 'Dizlie is three apps on one unified backend. Customers sign in with an OTP, build their own tiffin, subscribe to meal plans, pay with Razorpay and watch the order arrive on a live map. Delivery partners get their assigned orders, a route to each address, one-tap calling and a summary of the day. The admin dashboard runs users, orders, subscriptions, delivery partners and delivery zones.',
    challenge: 'Lunch can’t be late. Customers and riders both needed to know exactly where a tiffin is right now, subscriptions and payments had to stay in step, and the rider app had to stay simple enough to use on the move. I was the only engineer, from the database to the App Store release.',
    built: [
      'Three apps (Customer, Delivery, Admin) built with React Native and Next.js on a unified Node.js, PostgreSQL and Prisma backend',
      'OTP authentication, Razorpay payments and subscription-based meal ordering',
      'Google Maps for address management, real-time delivery tracking and delivery-zone partitioning',
      'Customer app: “Make your tiffin” builder, live order tracking and refer & earn rewards',
      'Delivery-partner app: active delivery map, next-up queue, “Arrived at location”, one-tap call or message, and a “Mission complete” day summary',
      'Admin dashboard to manage users, orders, subscriptions, delivery partners and delivery zones',
      'Deployed the complete production stack on AWS and shipped the apps to Google Play and the App Store',
    ],
    result: 'Built and deployed end to end as the sole engineer: the customer app is live on Google Play, the delivery-partner app on the App Store, with the backend and admin dashboard running on AWS.',
    gallery: ['/projects/dizlie/dizlie-5.jpg', '/projects/dizlie/dizlie-6.jpg', '/projects/dizlie/dizlie-2.jpg', '/projects/dizlie/dizlie-3.jpg', '/projects/dizlie/dizlie-4.jpg', '/projects/dizlie/dizlie-1.jpg'],
    device: 'cover',
  },
  {
    slug: 'flexzistay',
    title: 'FLEXZISTAY',
    kind: 'Hourly hotel booking',
    stack: ['Next.js', 'Prisma', 'Pub/Sub', 'REST APIs', 'Zoho CRM', 'WhatsApp API', 'Docker', 'GitHub Actions'],
    image: '/projects/flexzistay/flexzistay-1.jpg',
    links: [{ label: 'Visit flexzistay.in', href: 'https://www.flexzistay.in/' }],
    summary: 'Hotel rooms by the hour — book only the time you need. I worked on the booking backend, the Manager Portal and the release pipeline.',
    role: 'Software developer (Sep 2025 – Feb 2026, remote)',
    platform: 'Website + Manager Portal',
    status: 'Live',
    overview: 'FlexziStay lets guests book a hotel room for a few hours instead of a whole night. Pick a city, a check-in time and how long you need; the site shows hotels with clear prices for 3, 6, 9 or 12 hours, or a full day. Behind it, I worked on the systems that keep bookings, invoices and customer follow-ups running.',
    challenge: 'Hourly stays mean many short bookings landing at the same time. Invoices were racing each other in concurrent booking flows, managers handled bookings and customer messages by hand, and deployments were slow and risky.',
    built: [
      'Redesigned the invoice generation pipeline on a Pub/Sub event-driven architecture with Next.js and Prisma, removing race conditions in concurrent bookings and cutting processing latency by 40%',
      'Built and deployed a Manager Portal (Next.js SSR + REST APIs) to manage bookings, inventory and transactions',
      'Integrated Zoho CRM and the WhatsApp API (AiSensy) to automate customer communication, cutting manual operations by 40% and follow-ups by 60%',
      'Containerised backend services with Docker and set up CI/CD with GitHub Actions, halving deployment time with zero-downtime releases',
      'Guest site: hourly / full-day search, price tiers for 3, 6, 9 and 12 hours, filters and “List your hotel”',
    ],
    result: 'Invoices 40% faster with no race conditions, 40% less manual work and 60% fewer manual follow-ups, and deployments 50% faster with zero downtime.',
    gallery: ['/projects/flexzistay/flexzistay-1.jpg', '/projects/flexzistay/flexzistay-2.jpg', '/projects/flexzistay/flexzistay-3.jpg'],
    device: 'web',
  },
  {
    slug: 'zantalk',
    title: 'ZANTALK',
    kind: 'AI-matched expert consultation platform',
    stack: ['Next.js', 'Node.js', 'Redis', 'Microservices', 'Zoho Voice', 'Grafana', 'AWS'],
    image: '/projects/zantalk/zantalk-cover.jpg',
    links: [],
    linkNote: 'Live link · under construction',
    summary: 'Find a trusted expert, like a chartered accountant, and talk to them by chat, call or booked session, paid per minute from a wallet. Built end to end by me.',
    role: 'Full-stack developer, end to end',
    platform: 'Mobile app + consultant app',
    status: 'Under construction',
    overview: 'Zantalk connects people with verified experts. AI matching recommends consultants based on what the user needs, their preferences and each expert’s trust score, with ratings, languages and fees up front. Users book an appointment, call directly or start a chat. Calls and chats are paid per minute from an in-app wallet, and every session ends with a summary and a way to ask follow-up questions.',
    challenge: 'Paying per minute only works if it feels fair. The timer, the charges and the wallet had to be obvious, nobody should be billed for a call or chat that never really started, and a dropped call or failed payment could never leave money or call state in a mess.',
    built: [
      'Microservices backend on Next.js, Node.js and Redis, built end to end from APIs to the app screens',
      'AI-powered consultant matching on user requirements, preferences and trust scores',
      'Event-driven paid calling with Zoho Voice: async job processing, payment and call-state management, retries and failure handling',
      'Book an appointment, direct call or chat / ask, with timed paid sessions charged from a wallet; nothing is charged if the timer never starts',
      'Session summaries and follow-up questions after a session ends',
      'Consultant account with notifications, bookings and wallet',
      'Grafana monitoring and observability for the production services',
    ],
    result: 'A complete consult-an-expert flow, from AI-matched discovery to paid calls and the summary afterwards. The public launch is under construction.',
    gallery: ['/projects/zantalk/zantalk-2.jpg', '/projects/zantalk/zantalk-1.jpg', '/projects/zantalk/zantalk-3.jpg'],
    device: 'cover',
  },
  {
    slug: 'newral',
    title: 'NEWRAL',
    kind: 'Agri marketplace + LMS',
    stack: ['React.js', 'Node.js', 'MongoDB', 'REST APIs', 'RBAC', 'Web + mobile'],
    image: '/projects/newral/newral-cover.svg',
    links: [{ label: 'Visit newral.in', href: 'https://www.newral.in/' }],
    summary: 'Two products I built at Newral, a Noida-based tech agency: the Earthy Agri-Market marketplace and an end-to-end LMS for web and mobile.',
    role: 'Full-stack developer (May – Sep 2025, remote)',
    platform: 'Web marketplace, LMS on web + mobile',
    status: 'Shipped',
    overview: 'At Newral I worked across two products. Earthy Agri-Market is a full-stack marketplace with role-based access and order tracking from checkout to delivery. The LMS is a learning platform with web and mobile clients that share one backend of REST APIs.',
    challenge: 'The marketplace had to go from nothing to a working product in a single 3-week sprint, with different people seeing different things. The LMS had two clients, web and mobile, and the backend logic must not be written twice.',
    built: [
      'Earthy Agri-Market: a full-stack marketplace with role-based access control, built with React.js, Node.js, MongoDB and REST APIs',
      'End-to-end order tracking, from placing an order to delivery',
      'Shipped the marketplace in a 3-week Agile sprint',
      'An end-to-end LMS spanning web and mobile clients',
      'Designed and shipped 35+ REST APIs consumed by both clients, removing duplicate backend logic across platforms',
    ],
    result: 'A marketplace delivered in one 3-week sprint, and an LMS whose web and mobile apps run on one shared set of 35+ APIs.',
    gallery: [],
    device: 'cover',
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
    gallery: ['/projects/q (1).png', '/projects/q (2).png', '/projects/q (3).png'],
    device: 'web',
  },
  {
    slug: 'confidential',
    title: 'UNDER NDA',
    kind: 'Confidential client work',
    stack: ['Trading', 'E-commerce', 'External API integrations', 'Self-hosted', 'Live charts', 'Wallets'],
    image: '/projects/confidential/confidential-cover.jpg',
    links: [],
    linkNote: 'Under NDA · details on request',
    summary: '4 confidential client projects across trading, e-commerce and more, with several external APIs integrated, all self-hosted, and around 250+ live users every day.',
    role: 'Developer, build to deployment',
    platform: 'Web apps, self-hosted',
    status: 'Live · 250+ daily users',
    overview: 'Alongside the projects above, I have built 4 projects for clients that can’t be shown publicly, in trading, e-commerce and other domains. Each one integrates multiple external APIs, and I self-hosted them in production. Together they are used by around 250+ live users every day. One of them is a trading platform with live market charts, positions, orders and wallet management.',
    challenge: 'Real-time data, money, many third-party APIs and strict confidentiality. These apps had to stay fast, accurate and private, and keep running on infrastructure I host and maintain myself.',
    built: [
      '4 confidential projects across trading, e-commerce and other domains',
      'Integrated several external APIs into each product',
      'Self-hosted and deployed every project in production',
      'Trading dashboard with live candlestick charts and indicators',
      'Positions, orders and portfolio views',
      'Wallet, bank account and ticketing sections',
    ],
    result: 'Around 250+ live users access these apps daily. Happy to walk you through this work in an interview.',
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

