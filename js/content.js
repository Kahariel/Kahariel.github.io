/*
 * Everything the site says lives here. Edit this file, refresh, done.
 *
 * Any value set to null shows up on the page as a dashed [PLACEHOLDER] box,
 * so it's easy to spot what's still missing. Replace null with a real value
 * (a URL, an image path like 'assets/me.jpg', etc.) to fill it in.
 */
window.CONTENT = {
  name: { first: 'Karl', middle: 'Daven', last: 'Talib', full: 'Karl Daven P. Talib' },
  role: 'Full-Stack Software Engineer',
  focus: 'AI, Automation & System Design',
  location: 'Davao City, Philippines',
  email: 'pioloulo123@gmail.com',
  phone: '+63 916 154 2709',

  // words the particle name cycles through when clicked
  words: ['KARL', 'SYSTEMS', 'AUTOMATE', 'AI', 'TALIB'],

  photo: 'assets/portrait.webp',
  bio: 'Full-stack engineer who designs systems and automates the work around them. I architect multi-tenant platforms, connect them through APIs, webhooks and workflow automation, and bring AI into both the products and the way I build them — across healthcare, CRM and business operations.',

  links: {
    github: 'https://github.com/Kahariel',
    linkedin: 'https://ph.linkedin.com/in/karl-daven-talib-022047245',
    resume: 'assets/Karl-Daven-Talib-CV.pdf',
  },

  experience: [
    {
      company: 'SMB Solutions',
      role: 'Full-Stack Software Engineer',
      years: '2026',
      where: 'Remote',
      points: [
        'CRM and business workflow features with Lovable, wired to backend services, APIs and external platforms',
        'Automation workflows across Zapier, PandaDoc and Notion — data sync, document flows, automated triggers',
        'API integrations and webhooks that replaced manual operational work',
      ],
    },
    {
      company: 'Syncro',
      role: 'Chief Technology Officer / Full-Stack Engineer',
      years: '2023 — 2026',
      where: 'Davao City, PH',
      points: [
        'Led architecture of healthcare platforms: dental practice management & diagnostic imaging',
        'Tenant-aware data access, auth, RBAC, REST APIs, webhooks, automated workflows',
        'Server-driven interfaces with Laravel, Livewire and Filament',
        'Prototyped an AI voice receptionist that reads and manages appointments through the platform API',
        'Ran VPS infrastructure on aaPanel — deploys, databases, domains, SSL',
      ],
    },
    {
      company: 'Freelance',
      role: 'Full-Stack Web Developer',
      years: '2023 — now',
      where: 'Remote',
      points: [
        'Custom business & institutional web apps, from requirements to database-driven systems',
        'Laravel, PHP, Livewire, MySQL, WordPress, JavaScript — built, deployed, maintained',
      ],
    },
  ],

  education: { school: 'Assumption College of Davao', degree: 'B.S. Information Technology', years: '2022 — 2026' },
  certs: [{ name: 'TOPCIT', detail: 'Level 4 Certification of Proficiency' }],

  /*
   * Projects. Every repo is private, so `private: true` shows
   * "Private codebase · walkthrough on request" instead of a source link.
   * `image` takes a screenshot path — use demo data only, never real patient records.
   */
  projects: [
    {
      id: 'syncro', // stable link: #work/syncro
      name: 'Dental Clinic Management Platform',
      kicker: 'Healthcare · SaaS · AI',
      year: '2025 — now',
      role: 'Co-lead engineer',
      status: 'In production at 7 dental clinics',
      summary: 'Syncro — clinic management for single and multi-branch dental practices: records, appointments, prescriptions, billing and patient messaging. Live at 7 clinics from one codebase; AI booking live, AI voice receptionist in development.',
      highlights: [
        'Automated multi-client delivery: a GitHub Actions workflow merges main into every clinic\'s branch, with a dry-run mode that checks for conflicts before pushing',
        'AI voice receptionist, a prototype I built: a LiveKit voice agent with Deepgram speech-to-text tuned on dental vocabulary and an OpenAI model that calls the platform API as tools to look up and manage appointments',
        'Dialogflow booking chatbot on the clinic site — doctor lists, open slots, booking and cancellation through a Laravel webhook',
        'Four-tier subscription system (Freemium → Premium): a SubscriptionService and middleware gate features and enforce user, patient and appointment limits',
        'Company-scoped data access — middleware binds each request to a company and blocks route-model access across companies',
        'SmartChart / SmartNote: interactive tooth charting with a diagnosis-aware treatment picker and a draft → finalize workflow with permission enforcement',
        'Role and permission matrix on Spatie Permission, gating patient-detail tabs and actions per role',
        'Patient notes with templates, revision history, comments and letterhead PDF export',
        'Queued SMS (Twilio, Plivo) and email campaign jobs; Excel bulk import for patients, medicines and diagnoses',
      ],
      facts: [['Clinics', '7'], ['Migrations', '134'], ['Models', '60+']],
      stack: ['Laravel', 'PHP', 'MySQL', 'OpenAI API', 'LiveKit Agents', 'Deepgram', 'Dialogflow', 'Queues', 'GitHub Actions', 'Twilio'],
      image: 'assets/projects/syncro.webp',
      live: null,
      repo: null,
      private: true,
    },
    {
      id: 'one-shot-imaging', // stable link: #work/one-shot-imaging
      name: 'Imaging Clinic Operations System',
      kicker: 'Healthcare · Real-time',
      year: '2026',
      role: 'Lead engineer',
      status: 'Live since October 2026 · multi-tenant version in development',
      summary: 'One Shot Imaging — runs every visit at a dental-imaging clinic, from registration and queueing to imaging, checkout and billing, with live handoff between front desk and imaging room. Multi-tenant version in development.',
      highlights: [
        'Multi-tenant architecture in active development, building on the single-practice system already in production',
        'Visit state machine (waiting → in progress → checking out → completed / cancelled) with an active-visit pointer kept in sync by model events to block double registration',
        'Real-time Receptionist ↔ Technician updates over self-hosted Laravel Reverb WebSockets, broadcast from model observers on a private channel',
        'BIR-compliant billing: VAT backed out of inclusive prices at checkout, 0%-VAT handling for PWD and Senior discounts, voids instead of deletes, doctor commissions locked at billing',
        'One shared login that routes each role to its own Filament panel, with permissions managed by Filament Shield',
        'Streamed exports that rebuild the clinic\'s paper daily forms, plus an audit log of every financial and queue write',
        'Deployed on aaPanel with a Supervisor-managed queue worker and Reverb server behind an Nginx WebSocket proxy',
      ],
      facts: [['Test files', '60'], ['Migrations', '49'], ['Panels', '4']],
      stack: ['Laravel', 'Filament', 'Livewire', 'Laravel Reverb', 'MySQL', 'Multi-Tenancy', 'Tailwind CSS', 'aaPanel'],
      image: 'assets/projects/one-shot-imaging.webp',
      live: null,
      repo: null,
      private: true,
    },
    {
      id: 'smb-solutions-crm', // stable link: #work/smb-solutions-crm
      name: 'CRM with Workflow Automation',
      kicker: 'Business · Automation · AI-built',
      year: '2026',
      role: 'Full-stack engineer',
      status: null,
      summary: 'SMB Solutions CRM — B2B and B2C customer, sales and operations workflows, built with Lovable and connected to Zapier, PandaDoc and Notion.',
      highlights: [
        'Built AI-first with Lovable, with the generated interface wired to backend services, APIs and external platforms',
        'Integrated with Zapier, PandaDoc and Notion through APIs, webhooks and automated workflows',
        'Automations for data synchronisation, document workflows and process triggers that replaced manual operational work',
        'Translated business requirements into customer-management, sales and operations flows',
      ],
      facts: [['Built with', 'Lovable'], ['Integrations', '3']],
      stack: ['Lovable', 'Webhooks', 'Zapier', 'PandaDoc', 'Notion', 'Workflow Automation'],
      image: 'assets/projects/smb-solutions-crm.webp',
      live: null,
      repo: null,
      private: true,
    },
    {
      id: 'bloodseek', // stable link: #work/bloodseek
      name: 'Blood Donation Mobile App',
      kicker: 'Healthcare · Mobile',
      year: '2025',
      role: 'Lead developer',
      status: null,
      summary: 'BloodSeek — Android and iOS app that helps donors find facilities and open blood requests on a map, check eligibility, and book a donation.',
      highlights: [
        'React Native on Expo with file-based routing (Expo Router) and the new architecture enabled',
        'Supabase Postgres backend with generated TypeScript types and typed API modules for appointments, events, facilities, requests and questionnaires',
        'Mapbox maps with device location for nearby facilities and blood requests',
        'Eligibility pre-assessment questionnaire that gates the donation flow',
        'Google Sign-In, push notifications and EAS builds',
      ],
      facts: [['Platforms', 'Android · iOS'], ['Screens', '20+']],
      stack: ['React Native', 'Expo', 'TypeScript', 'Supabase', 'Mapbox', 'Firebase'],
      image: 'assets/projects/bloodseek.webp',
      imageFit: 'contain', // phone screens: show whole, don't crop
      live: null,
      repo: null,
      private: true,
    },
    {
      id: 'bloodseek-admin', // stable link: #work/bloodseek-admin
      name: 'Blood Bank Admin Dashboard',
      kicker: 'Healthcare · Web',
      year: '2025',
      role: 'Lead developer',
      status: null,
      summary: 'BloodSeek Admin — the staff console behind the app: donations, blood requests, donation drives and blood-component inventory.',
      highlights: [
        'Next.js App Router with Server Actions for every read and write, and Supabase SSR auth',
        'Separate inventory tracking for packed red blood cells, platelets and plasma',
        'Activity feed aggregating donations, requests, events and inventory changes, with search, type filters and daily stats',
        'TanStack Table data grids, Recharts dashboards and Zod-validated forms',
      ],
      facts: [['Inventory types', '3'], ['Shared DB', 'with the app']],
      stack: ['Next.js', 'React', 'TypeScript', 'Supabase', 'Tailwind CSS', 'Zod'],
      image: 'assets/projects/bloodseek-admin.webp',
      live: null,
      repo: null,
      private: true,
    },
    {
      id: 'klnw', // stable link: #work/klnw
      name: 'Streetwear E-commerce Store',
      kicker: 'E-commerce · Web',
      year: '2026',
      role: 'Full-stack developer',
      status: 'Live',
      summary: 'KLNW — online store for a Filipino streetwear brand: storefront, cart and guest checkout, plus an admin for products, orders and site content.',
      highlights: [
        'Next.js and React 19 on Vercel, with Firebase Auth and Firestore',
        'Firestore security rules separating public storefront reads from admin-only writes; guest orders are create-only',
        'Admin CMS for the hero slideshow and banners, drag-to-reorder with dnd-kit, and a revenue dashboard',
        'Cloudinary image delivery, EmailJS order notifications, and SEO: sitemap, robots and generated Open Graph images',
        'AI-assisted development: agent guidelines (AGENTS.md / CLAUDE.md) live in the repo, alongside a feature-branch and pull-request workflow',
      ],
      facts: [['Hosting', 'Vercel'], ['Database', 'Firestore']],
      stack: ['Next.js', 'TypeScript', 'Firebase', 'Cloudinary', 'Tailwind CSS'],
      image: 'assets/projects/klnw.webp',
      live: 'https://klnwglobalmovement.com',
      repo: null,
      private: true,
    },
    {
      id: 'pistamp', // stable link: #work/pistamp
      name: 'Library Attendance Kiosk',
      kicker: 'Education · Kiosk',
      year: '2024 — 2025',
      role: 'Lead developer',
      status: null,
      summary: 'PiStamp — students scan their ID barcode at a kiosk to log library time-in and time-out, with manual entry and guest registration.',
      highlights: [
        'Scanner-driven kiosk: barcode input auto-submits after a short idle debounce, so no keyboard is needed',
        'Per-library sessions for College, Senior High, Junior High and Elementary',
        'JSON endpoints for time logging and guest creation, using PDO prepared statements',
        'PHP and MySQL with an AdminLTE dashboard',
      ],
      facts: [['Libraries', '4']],
      stack: ['PHP', 'MySQL', 'JavaScript', 'AdminLTE'],
      image: 'assets/projects/pistamp.webp',
      live: null,
      repo: null,
      private: true,
    },
  ],

  /*
   * Analytics — off until set. Both options are privacy-friendly (no cookies, no banner needed):
   *   GoatCounter (free for personal sites): sign up at goatcounter.com → analytics: { goatcounter: 'your-code' }
   *   Plausible (paid):                                                  analytics: { plausible: 'kahariel.github.io' }
   * Besides page views it records: which sections visitors reach, tour starts, email / link copies,
   * résumé downloads and clicks on live project links.
   */
  analytics: null,

  /*
   * Guided tour. `at` is a section (index, experience, stack, about, work, contact)
   * or a project as work/<slug> — the slug is the project name in lowercase-with-dashes.
   * The same values work as shareable links: yoursite.com/#work/syncro
   */
  tour: [
    { at: 'index', title: 'Karl Daven Talib', text: 'Full-stack engineer focused on AI, automation and system design. This site is a map — the tour drives, or drag anywhere to explore on your own.' },
    { at: 'experience', title: 'Experience', text: 'CTO at Syncro, full-stack at SMB Solutions, and freelance since 2023. The cards can be dragged around the desk.' },
    { at: 'work/syncro', title: 'Dental Clinic Management Platform', text: 'Syncro — in production at 7 clinics — automated per-clinic delivery, AI booking, and an AI voice receptionist in development.' },
    { at: 'work/one-shot-imaging', title: 'Imaging Clinic Operations System', text: 'One Shot Imaging — real-time handoff between the front desk and the imaging room. Live since October 2026; multi-tenant version in development.' },
    { at: 'work', title: 'Selected work', text: 'Seven projects — healthcare platforms, a CRM, a mobile app and its admin console, e-commerce and a kiosk system. Each card lists the technical details.' },
    { at: 'stack', title: 'Stack', text: 'Every tool, grouped by domain and linked to the projects that used it. Select any node to inspect it.' },
    { at: 'contact', title: 'Get in touch', text: 'Copy the email or download the résumé from the top-right bar — it stays on screen wherever you are on the map.' },
  ],

  skills: {
    'AI & Automation': ['OpenAI API', 'LiveKit Agents', 'Deepgram', 'LLM Tool Calling', 'Dialogflow', 'AI-Assisted Development', 'Lovable', 'Workflow Automation', 'GitHub Actions'],
    'System Design': ['Multi-Tenancy', 'Database Design', 'State Machines', 'Real-Time / WebSockets', 'Server-Driven UI', 'RBAC', 'Queues'],
    'Services & APIs': ['PHP', 'Laravel', 'Python', 'REST APIs', 'Webhooks', 'Livewire', 'Laravel Reverb'],
    'Frontend & Mobile': ['Next.js', 'React', 'React Native', 'Expo', 'TypeScript', 'JavaScript', 'TALL Stack', 'AdminLTE', 'Filament'],
    'Data': ['MySQL', 'PostgreSQL', 'Supabase', 'Firebase'],
    'Integrations': ['Zapier', 'PandaDoc', 'Notion', 'Third-Party APIs'],
    'DevOps & Infra': ['Linux', 'Nginx', 'aaPanel', 'VPS Administration', 'Apache', 'Bash', 'Git'],
  },
};
