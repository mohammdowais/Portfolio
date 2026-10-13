/*
  Add a project by copying one object and putting it at the top of the list (newest first).

  name          Shown on the card and in the menu. Experience entries link to it as [[Name]].
  period        Free text, e.g. 'Sep - Oct 2026'.
  summary       One line.
  stack         Technology tags. The card shows the first three.
  highlights    Short bullets.
  closedSource  true shows a "Private repository" note when there are no links.
  links         Optional: [{ label: 'GitHub', url: '...' }]
  screenshots   Optional: file names inside assets/screenshots/ (or full URLs), e.g. ['my-app/1.webp'].
  placeholders  Optional: number of stock images to show until real screenshots exist.

  In any text, {key|label} becomes a hover definition from data/glossary.js.
*/
export const projects = [
  {
    name: 'Restaurant Management System',
    period: 'Sep - Oct 2026',
    summary: 'Multi-platform restaurant MVP: desktop POS, web app, admin portal and shared cloud backend.',
    stack: ['Tauri', 'React', 'TypeScript', 'Vite', 'SQLite', 'Hono', 'Cloudflare D1'],
    highlights: [
      'Desktop POS: {tauri|Tauri} + React app with local SQLite for orders, menu, inventory and reports',
      'Desktop POS: receipt/{kot|KOT} printing, offline sync queue, authenticated report sync',
      'Desktop POS: activation flow plus everyday local PIN/password unlock',
      'Web app: login, password recovery via one-time reset code, read-only reports, menu and inventory',
      'Admin portal: restaurant creation, POS credentials, activation controls, sync overview',
      'Backend: {hono|Hono} on {workers|Cloudflare Workers} + D1; bearer tokens tie syncs to the activated restaurant',
      'Status: MVP; hardening pending (password hashing, OS keychain, individual admin accounts)',
    ],
    closedSource: true,
    // placeholders: 4,
  },
  {
    name: 'Face Search App',
    period: 'Mar 2026 - Present',
    summary: 'Offline-first Windows face-search POS with a serverless backend, admin dashboard and customer download portal.',
    stack: ['C#', '.NET 8', 'WinUI 3', 'ONNX Runtime', 'Cloudflare Workers', 'Next.js', 'React', 'SQLite'],
    highlights: [
      'POS client: on-device {onnx|ONNX} + OpenCV face search, sub-second matching, fully offline',
      'POS client: print spooler state machine, dual-screen customer display, {argon2|Argon2id} auth, audit logging',
      'Backend: {workers|Cloudflare Workers} + {hono|Hono} API with Countries > Cities > Sites > Terminals tenancy',
      'Backend: hardware-bound license tokens, {presigned|presigned} direct uploads to {r2|R2}, {openapi|OpenAPI} docs',
      'Dashboard: Next.js admin portal with drill-down telemetry, {rbac|RBAC} roles and PDF/Excel exports',
      'Dashboard: remote key generation, terminal deactivation, upload suspension at quota',
      'Download portal: React + Vite, {turnstile|Turnstile}-protected lookups, streaming ZIP downloads, photo claim flow',
      'Release & infra: {cicd|CI/CD} with GitHub Actions, {velopack|Velopack} delta updates, Husky gates, {pbt|property-based tests}',
    ],
    closedSource: true,
    // placeholders: 4,
  },
  {
    name: 'Group Policy Manager',
    period: 'Oct - Nov 2025',
    summary: '{electron|Electron} app that applies local Windows restrictions through a simple UI.',
    stack: ['Electron', 'Node.js', 'PowerShell', 'Windows Registry', 'Winston'],
    highlights: [
      'Controls removable-drive writes, browser/domain allowlists, private browsing and software installs',
      'Validated preload bridge + {ipc|IPC} between UI and main process',
      'PowerShell applies settings to the {registry|Windows Registry}; admin checks built in',
      'Login, password recovery, offline license activation',
      '{nsis|NSIS} x64 installer with admin elevation and cleanup options',
      'Local-machine policies only, not Active Directory',
    ],
    closedSource: true,
  },
  {
    name: 'Image-to-Image Search',
    period: 'Aug 2024',
    summary: 'Visual similarity search over a local image dataset.',
    stack: ['React', 'Vite', 'Node.js', 'Weaviate', 'Docker'],
    highlights: [
      'Upload an image, get nearest neighbours via {emb|vector embeddings} (ResNet-based img2vec)',
      '{vec|Weaviate} schema setup and auto-population when empty',
      'Multer uploads, GraphQL queries, paginated results with response time',
      'Docker Compose runs Weaviate and the embedding service',
    ],
    links: [{ label: 'GitHub', url: 'https://github.com/mohammdowais/image-search-engine' }],
    // placeholders: 2,
  },
  {
    name: 'Cipher Type Identifier',
    period: 'Mar 2024',
    summary: 'ML app that identifies Vigenère, Playfair or substitution ciphers.',
    stack: ['Python', 'Flask', 'TensorFlow', 'Keras', 'scikit-learn'],
    highlights: [
      '12 statistical features incl. {ioc|Index of Coincidence} and digraph patterns',
      'Five scikit-learn models plus a Keras feedforward network; 98.3% accuracy',
      'Flask REST API returns per-model labels and confidence',
      'React UI to compare model predictions',
    ],
    links: [{ label: 'GitHub', url: 'https://github.com/mohammdowais/Cipher-type-Identifier' }],
  },
  {
    name: 'Read For Speed',
    period: 'Aug 2022',
    summary: '{sih|Smart India Hackathon} finalist app for faster, better reading.',
    stack: ['React', 'Node.js', 'Express', 'MongoDB'],
    highlights: [
      'Interactive exercises to improve reading speed and comprehension',
      'MVP presented at the Grand Finale to DRDO judges',
    ],
    links: [{ label: 'Live demo', url: 'https://readforspeed.netlify.app/' }],
    // placeholders: 2,
  },
];
