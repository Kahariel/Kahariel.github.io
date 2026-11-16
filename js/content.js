/*
 * Everything the site says lives here. Edit this file, refresh, done.
 *
 * A link or image set to null shows up on the page as a dashed [PLACEHOLDER],
 * so it's easy to spot what's still missing. Replace null with a real value
 * (a URL, an image path like 'assets/me.jpg', etc.) to fill it in.
 */
window.CONTENT = {
  name: { first: 'Karl', middle: 'Daven', last: 'Talib', full: 'Karl Daven P. Talib' },
  role: 'Full-Stack Developer',
  focus: 'AI, Automation & Integrations',
  location: 'Davao City, Philippines',
  email: 'pioloulo123@gmail.com',
  phone: '+63 991 844 4532',

  photo: 'assets/portrait.webp',
  // `lead` is the one-liner under the name; `bio` opens the About section
  lead: 'I design systems and automate the work around them.',
  bio: 'I architect multi-tenant platforms, connect them through APIs, webhooks and workflow automation, and bring AI into both the products and the way I build them — across healthcare, CRM and business operations.',

  // the list under the intro: each row links to a project card (`to` is the project's id).
  // Put *asterisks* around the part of the line to show in bold.
  shipped: {
    title: 'In production now',
    items: [
      { name: 'Syncro', text: 'Clinic management, live at *multiple dental clinics*', to: 'syncro' },
      { name: 'One Shot Imaging', text: 'Imaging clinic operations, running across *multiple branches*', to: 'one-shot-imaging' },
      { name: 'Syncro Hub', text: 'The control plane behind Syncro: plans, analytics, *one-click clinic setup*', to: 'syncro-hub' },
      { name: 'SMB Solutions CRM', text: 'CRM for a US client, wired to *Zapier, PandaDoc and Notion*', to: 'smb-solutions-crm' },
    ],
  },

  links: {
    github: 'https://github.com/Kahariel',
    linkedin: 'https://ph.linkedin.com/in/karl-daven-talib-022047245',
    resume: 'assets/Karl-Daven-Talib-CV.pdf',
  },

  experience: [
    {
      company: 'SMB Solutions',
      role: 'Full-Stack Developer',
      years: '2026',
      where: 'Remote · US client',
      points: [
        'CRM and business workflow features with Lovable, wired to backend services, APIs and external platforms',
        'Automation workflows across Zapier, PandaDoc and Notion — data sync, document flows, automated triggers',
        'API integrations and webhooks that replaced manual operational work',
      ],
    },
    {
      company: 'Syncro',
      role: 'Chief Technology Officer / Full-Stack Developer',
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
        'Payment gateway and third-party integrations; production deployments with Docker',
      ],
    },
  ],

  education: { school: 'Assumption College of Davao', degree: 'B.S. Information Technology', years: 'Graduated 2026' },
  certs: [
    { name: 'TOPCIT', detail: 'Level 4 Certification of Proficiency' },
    { name: 'DICT', detail: 'Certificate of Proficiency in Office Productivity' },
  ],

  /*
   * Projects. Every repo is private, so `private: true` shows
   * "Private codebase · walkthrough on request" instead of a source link.
   * `image` is null for every project: the screenshots are confidential, so cards are text-only.
   * (Setting a path, e.g. 'assets/projects/x.webp', brings a screenshot back for that card.)
   * `featured: true` gives a project a full-width row at the top of the Work section;
   * the rest sit in a two-column grid below.
   */
  projects: [
    {
      id: 'syncro', // stable link: #work/syncro
      featured: true,
      name: 'Dental Clinic Management Platform',
      kicker: 'Healthcare · SaaS · AI',
      year: '2025 — now',
      role: 'Co-lead developer',
      status: 'In production at multiple dental clinics',
      summary: 'Syncro — clinic management for single and multi-branch dental practices: records, appointments, prescriptions, billing and patient messaging. Live at multiple clinics from one codebase; AI booking live, AI voice receptionist in development.',
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
      facts: [['Migrations', '134'], ['Models', '60+']],
      stack: ['Laravel', 'PHP', 'MySQL', 'OpenAI API', 'LiveKit Agents', 'Deepgram', 'Dialogflow', 'Queues', 'GitHub Actions', 'Twilio'],
      image: null,
      live: null,
      repo: null,
      private: true,
    },
    {
      id: 'syncro-hub', // stable link: #work/syncro-hub
      featured: true,
      name: 'SaaS Control Plane for Syncro',
      kicker: 'SaaS · Automation · DevOps',
      year: '2026',
      role: 'Lead developer',
      status: 'In production · internal platform',
      summary: 'Syncro Hub — the internal platform that runs Syncro as a business: every clinic, its plan and subscription, revenue and usage analytics, and one-click setup of a new clinic site on the server.',
      highlights: [
        'One-click clinic provisioning: DNS through the GoDaddy API, a GitHub branch, aaPanel site and database, .env, SSL, nginx, queue worker and deploy webhook. Failed runs resume from the last finished step',
        'Privilege-separated by design: the web app only queues provisioning requests and a root cron runner validates and executes them, streaming the server log back to the page live',
        'Subscription API that clinics read their plan from, with a cached last answer for outages and a fail-open default, replacing per-clinic .env edits',
        'Drift detection: an hourly job compares every clinic\'s config with the hub (In Sync / Out of Sync / Unreachable); writes are backed up first and replaced atomically',
        'Nightly usage analytics read from each clinic\'s own database in READ ONLY sessions, counting exactly like the clinic app, plus MRR history, plan mix, renewals and inactive-clinic alerts',
        'Self-deploying: a cron script pulls main, backs up the database, rebuilds only what changed and migrates, rolling back automatically if it fails before migrations',
        'Three roles (Super Admin, Owner, Manager), forced password change on first sign-in, per-route rate limits and a branded onboarding email to each new clinic',
      ],
      facts: [['Tests', '120'], ['Roles', '3'], ['New clinic', 'One click']],
      stack: ['Laravel', 'Inertia', 'React', 'TypeScript', 'Tailwind CSS', 'MySQL', 'Bash', 'aaPanel', 'Nginx', 'REST APIs', 'Webhooks', 'RBAC'],
      image: null,
      live: null,
      repo: null,
      private: true,
    },
    {
      id: 'one-shot-imaging', // stable link: #work/one-shot-imaging
      featured: true,
      name: 'Imaging Clinic Operations System',
      kicker: 'Healthcare · Real-time',
      year: '2026',
      role: 'Lead developer',
      status: 'Live since October 2026 · multi-tenant, multi-branch',
      summary: 'One Shot Imaging — runs every visit at a dental-imaging clinic, from registration and queueing to imaging, checkout and billing, with live handoff between front desk and imaging room. Now multi-tenant, running across multiple branches.',
      highlights: [
        'Multi-tenant architecture serving multiple branches, built out from the single-practice system that went into production first',
        'Visit state machine (waiting → in progress → checking out → completed / cancelled) with an active-visit pointer kept in sync by model events to block double registration',
        'Real-time Receptionist ↔ Technician updates over self-hosted Laravel Reverb WebSockets, broadcast from model observers on a private channel',
        'BIR-compliant billing: VAT backed out of inclusive prices at checkout, 0%-VAT handling for PWD and Senior discounts, voids instead of deletes, doctor commissions locked at billing',
        'One shared login that routes each role to its own Filament panel, with permissions managed by Filament Shield',
        'Streamed exports that rebuild the clinic\'s paper daily forms, plus an audit log of every financial and queue write',
        'Deployed on aaPanel with a Supervisor-managed queue worker and Reverb server behind an Nginx WebSocket proxy',
      ],
      facts: [['Test files', '60'], ['Migrations', '49'], ['Panels', '4']],
      stack: ['Laravel', 'Filament', 'Livewire', 'Laravel Reverb', 'MySQL', 'Multi-Tenancy', 'Tailwind CSS', 'aaPanel'],
      image: null,
      live: null,
      repo: null,
      private: true,
    },
    {
      id: 'smb-solutions-crm', // stable link: #work/smb-solutions-crm
      name: 'CRM with Workflow Automation',
      kicker: 'Business · Automation · AI-built',
      year: '2026',
      role: 'Full-stack developer',
      status: 'In production',
      summary: 'SMB Solutions CRM — B2B and B2C customer, sales and operations workflows, built with Lovable and connected to Zapier, PandaDoc and Notion.',
      highlights: [
        'Built AI-first with Lovable, with the generated interface wired to backend services, APIs and external platforms',
        'Integrated with Zapier, PandaDoc and Notion through APIs, webhooks and automated workflows',
        'Automations for data synchronisation, document workflows and process triggers that replaced manual operational work',
        'Translated business requirements into customer-management, sales and operations flows',
      ],
      facts: [['Built with', 'Lovable'], ['Integrations', '3']],
      stack: ['Lovable', 'Webhooks', 'Zapier', 'PandaDoc', 'Notion', 'Workflow Automation'],
      image: null,
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
      image: null,
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
      image: null,
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
      image: null,
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
      image: null,
      live: null,
      repo: null,
      private: true,
    },
  ],

  /*
   * Analytics — off until set. Both options are privacy-friendly (no cookies, no banner needed):
   *   GoatCounter (free for personal sites): sign up at goatcounter.com → analytics: { goatcounter: 'your-code' }
   *   Plausible (paid):                                                  analytics: { plausible: 'kahariel.github.io' }
   * Besides page views it records: which sections visitors reach, email / link copies,
   * résumé downloads, screenshot zooms and clicks on live project links.
   */
  analytics: { goatcounter: 'parziv4l' },

  skills: {
    'AI & Automation': ['OpenAI API', 'LiveKit Agents', 'Deepgram', 'LLM Tool Calling', 'Dialogflow', 'AI-Assisted Development', 'Lovable', 'Workflow Automation', 'GitHub Actions'],
    'System Design': ['Multi-Tenancy', 'Database Design', 'State Machines', 'Real-Time / WebSockets', 'Server-Driven UI', 'RBAC', 'Queues'],
    'Services & APIs': ['PHP', 'Laravel', 'Python', 'REST APIs', 'Webhooks', 'Livewire', 'Laravel Reverb'],
    'Frontend & Mobile': ['Next.js', 'React', 'React Native', 'Expo', 'TypeScript', 'JavaScript', 'Inertia', 'TALL Stack', 'AdminLTE', 'Filament'],
    'Data': ['MySQL', 'PostgreSQL', 'Supabase', 'Firebase'],
    'Integrations': ['Zapier', 'PandaDoc', 'Notion', 'Payment Gateways', 'Third-Party APIs'],
    'DevOps & Infra': ['Docker', 'Linux', 'Nginx', 'aaPanel', 'VPS Administration', 'Apache', 'Bash', 'Git'],
  },
};
