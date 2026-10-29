import { SampleImage } from '../types';

// Crisp, high-fidelity SVG mockups encoded as base64 data URLs for seamless instant testing
const svgToDataUrl = (svgString: string): string => {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svgString.trim())}`;
};

const cryptoWalletSvg = `
<svg width="600" height="850" viewBox="0 0 600 850" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="600" height="850" rx="40" fill="#0F172A"/>
  <!-- Status Bar -->
  <text x="45" y="42" fill="#94A3B8" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="14" font-weight="600">9:41</text>
  <circle cx="530" cy="38" r="4" fill="#94A3B8"/>
  <circle cx="542" cy="38" r="4" fill="#94A3B8"/>
  <rect x="554" y="33" width="18" height="10" rx="3" stroke="#94A3B8" stroke-width="2"/>
  
  <!-- Header -->
  <circle cx="50" cy="90" r="24" fill="#1E293B"/>
  <circle cx="50" cy="85" r="9" fill="#6366F1"/>
  <path d="M37 104C37 97 43 93 50 93C57 93 63 97 63 104" fill="#6366F1"/>
  
  <text x="90" y="86" fill="#94A3B8" font-family="-apple-system, sans-serif" font-size="13">Welcome back,</text>
  <text x="90" y="106" fill="#F8FAFC" font-family="-apple-system, sans-serif" font-size="18" font-weight="700">Alex Morgan</text>
  
  <rect x="506" y="66" width="48" height="48" rx="16" fill="#1E293B"/>
  <circle cx="530" cy="90" r="8" stroke="#F8FAFC" stroke-width="2"/>
  <circle cx="538" cy="82" r="4" fill="#EF4444"/>

  <!-- Card Balance -->
  <defs>
    <linearGradient id="cardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#4F46E5"/>
      <stop offset="50%" stop-color="#7C3AED"/>
      <stop offset="100%" stop-color="#EC4899"/>
    </linearGradient>
    <linearGradient id="glowGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#10B981" stop-opacity="0.2"/>
      <stop offset="100%" stop-color="#10B981" stop-opacity="0"/>
    </linearGradient>
  </defs>

  <rect x="40" y="140" width="520" height="230" rx="28" fill="url(#cardGrad)"/>
  <circle cx="500" cy="180" r="100" fill="#FFFFFF" fill-opacity="0.06"/>
  <circle cx="100" cy="330" r="80" fill="#FFFFFF" fill-opacity="0.08"/>

  <text x="75" y="185" fill="#E0E7FF" font-family="-apple-system, sans-serif" font-size="15" font-weight="500">Total Portfolio Balance</text>
  <text x="75" y="240" fill="#FFFFFF" font-family="-apple-system, sans-serif" font-size="42" font-weight="800">$48,259.40</text>
  
  <rect x="75" y="260" width="130" height="32" rx="16" fill="#FFFFFF" fill-opacity="0.2"/>
  <text x="92" y="281" fill="#4ADE80" font-family="-apple-system, sans-serif" font-size="13" font-weight="700">+14.8% (24h)</text>

  <text x="75" y="340" fill="#E0E7FF" font-family="-apple-system, sans-serif" font-size="13">Visa Platinum •••• 9821</text>
  <circle cx="500" cy="335" r="14" fill="#F59E0B" fill-opacity="0.8"/>
  <circle cx="518" cy="335" r="14" fill="#EF4444" fill-opacity="0.8"/>

  <!-- Quick Actions -->
  <g transform="translate(40, 395)">
    <!-- Send -->
    <rect x="0" y="0" width="115" height="85" rx="20" fill="#1E293B"/>
    <circle cx="57" cy="30" r="18" fill="#312E81"/>
    <path d="M57 23V37M57 23L51 29M57 23L63 29" stroke="#818CF8" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
    <text x="57" y="66" fill="#F8FAFC" font-family="-apple-system, sans-serif" font-size="13" font-weight="600" text-anchor="middle">Send</text>

    <!-- Receive -->
    <rect x="135" y="0" width="115" height="85" rx="20" fill="#1E293B"/>
    <circle cx="192" cy="30" r="18" fill="#064E3B"/>
    <path d="M192 37V23M192 37L186 31M192 37L198 31" stroke="#34D399" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
    <text x="192" y="66" fill="#F8FAFC" font-family="-apple-system, sans-serif" font-size="13" font-weight="600" text-anchor="middle">Receive</text>

    <!-- Swap -->
    <rect x="270" y="0" width="115" height="85" rx="20" fill="#1E293B"/>
    <circle cx="327" cy="30" r="18" fill="#78350F"/>
    <path d="M320 28H334M334 28L330 24M334 28L330 32M334 34H320M320 34L324 30M320 34L324 38" stroke="#FBBF24" stroke-width="2" stroke-linecap="round"/>
    <text x="327" y="66" fill="#F8FAFC" font-family="-apple-system, sans-serif" font-size="13" font-weight="600" text-anchor="middle">Swap</text>

    <!-- More -->
    <rect x="405" y="0" width="115" height="85" rx="20" fill="#1E293B"/>
    <circle cx="462" cy="30" r="18" fill="#374151"/>
    <circle cx="454" cy="30" r="2.5" fill="#94A3B8"/>
    <circle cx="462" cy="30" r="2.5" fill="#94A3B8"/>
    <circle cx="470" cy="30" r="2.5" fill="#94A3B8"/>
    <text x="462" y="66" fill="#F8FAFC" font-family="-apple-system, sans-serif" font-size="13" font-weight="600" text-anchor="middle">More</text>
  </g>

  <!-- Assets Section -->
  <text x="45" y="525" fill="#F8FAFC" font-family="-apple-system, sans-serif" font-size="19" font-weight="700">Watchlist &amp; Assets</text>
  <text x="515" y="525" fill="#6366F1" font-family="-apple-system, sans-serif" font-size="14" font-weight="600">See All</text>

  <!-- Asset 1: Bitcoin -->
  <rect x="40" y="545" width="520" height="74" rx="18" fill="#1E293B"/>
  <circle cx="80" cy="582" r="22" fill="#F7931A"/>
  <text x="80" y="588" fill="#FFFFFF" font-family="-apple-system, sans-serif" font-size="17" font-weight="800" text-anchor="middle">₿</text>
  <text x="115" y="576" fill="#F8FAFC" font-family="-apple-system, sans-serif" font-size="16" font-weight="600">Bitcoin</text>
  <text x="115" y="595" fill="#94A3B8" font-family="-apple-system, sans-serif" font-size="13">0.642 BTC</text>
  <text x="525" y="576" fill="#F8FAFC" font-family="-apple-system, sans-serif" font-size="16" font-weight="700" text-anchor="end">$43,180.20</text>
  <text x="525" y="595" fill="#10B981" font-family="-apple-system, sans-serif" font-size="13" font-weight="600" text-anchor="end">+4.25%</text>

  <!-- Asset 2: Ethereum -->
  <rect x="40" y="630" width="520" height="74" rx="18" fill="#1E293B"/>
  <circle cx="80" cy="667" r="22" fill="#627EEA"/>
  <text x="80" y="674" fill="#FFFFFF" font-family="-apple-system, sans-serif" font-size="17" font-weight="800" text-anchor="middle">Ξ</text>
  <text x="115" y="661" fill="#F8FAFC" font-family="-apple-system, sans-serif" font-size="16" font-weight="600">Ethereum</text>
  <text x="115" y="680" fill="#94A3B8" font-family="-apple-system, sans-serif" font-size="13">4.18 ETH</text>
  <text x="525" y="661" fill="#F8FAFC" font-family="-apple-system, sans-serif" font-size="16" font-weight="700" text-anchor="end">$13,594.10</text>
  <text x="525" y="680" fill="#10B981" font-family="-apple-system, sans-serif" font-size="13" font-weight="600" text-anchor="end">+7.12%</text>

  <!-- Asset 3: Solana -->
  <rect x="40" y="715" width="520" height="74" rx="18" fill="#1E293B"/>
  <circle cx="80" cy="752" r="22" fill="#14F195"/>
  <text x="80" y="759" fill="#000000" font-family="-apple-system, sans-serif" font-size="15" font-weight="900" text-anchor="middle">S</text>
  <text x="115" y="746" fill="#F8FAFC" font-family="-apple-system, sans-serif" font-size="16" font-weight="600">Solana</text>
  <text x="115" y="765" fill="#94A3B8" font-family="-apple-system, sans-serif" font-size="13">38.5 SOL</text>
  <text x="525" y="746" fill="#F8FAFC" font-family="-apple-system, sans-serif" font-size="16" font-weight="700" text-anchor="end">$6,842.00</text>
  <text x="525" y="765" fill="#EF4444" font-family="-apple-system, sans-serif" font-size="13" font-weight="600" text-anchor="end">-1.42%</text>

  <!-- Bottom Navigation Bar -->
  <rect x="40" y="800" width="520" height="35" rx="17" fill="#0F172A"/>
  <rect x="235" y="828" width="130" height="4" rx="2" fill="#64748B"/>
</svg>
`;

const saasDashboardSvg = `
<svg width="800" height="560" viewBox="0 0 800 560" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="800" height="560" rx="16" fill="#0D1117"/>
  
  <!-- Navigation Top -->
  <rect width="800" height="64" fill="#161B22"/>
  <line x1="0" y1="64" x2="800" y2="64" stroke="#30363D"/>
  
  <rect x="24" y="18" width="28" height="28" rx="8" fill="#2563EB"/>
  <text x="64" y="37" fill="#F0F6FC" font-family="-apple-system, sans-serif" font-size="17" font-weight="700">MetricsPulse</text>
  
  <text x="210" y="37" fill="#58A6FF" font-family="-apple-system, sans-serif" font-size="14" font-weight="600">Overview</text>
  <text x="290" y="37" fill="#8B949E" font-family="-apple-system, sans-serif" font-size="14">Analytics</text>
  <text x="370" y="37" fill="#8B949E" font-family="-apple-system, sans-serif" font-size="14">Customers</text>
  <text x="460" y="37" fill="#8B949E" font-family="-apple-system, sans-serif" font-size="14">Settings</text>
  
  <rect x="640" y="16" width="136" height="32" rx="8" fill="#238636"/>
  <text x="708" y="37" fill="#FFFFFF" font-family="-apple-system, sans-serif" font-size="13" font-weight="600" text-anchor="middle">+ New Report</text>

  <!-- Metric Card 1 -->
  <rect x="24" y="88" width="232" height="116" rx="12" fill="#161B22" stroke="#30363D"/>
  <text x="44" y="118" fill="#8B949E" font-family="-apple-system, sans-serif" font-size="13" font-weight="500">Monthly Recurring Revenue</text>
  <text x="44" y="156" fill="#F0F6FC" font-family="-apple-system, sans-serif" font-size="28" font-weight="800">$124,500</text>
  <text x="44" y="182" fill="#3FB950" font-family="-apple-system, sans-serif" font-size="12" font-weight="600">▲ +18.2% vs last month</text>

  <!-- Metric Card 2 -->
  <rect x="284" y="88" width="232" height="116" rx="12" fill="#161B22" stroke="#30363D"/>
  <text x="304" y="118" fill="#8B949E" font-family="-apple-system, sans-serif" font-size="13" font-weight="500">Active Subscribers</text>
  <text x="304" y="156" fill="#F0F6FC" font-family="-apple-system, sans-serif" font-size="28" font-weight="800">14,289</text>
  <text x="304" y="182" fill="#3FB950" font-family="-apple-system, sans-serif" font-size="12" font-weight="600">▲ +8.4% new signups</text>

  <!-- Metric Card 3 -->
  <rect x="544" y="88" width="232" height="116" rx="12" fill="#161B22" stroke="#30363D"/>
  <text x="564" y="118" fill="#8B949E" font-family="-apple-system, sans-serif" font-size="13" font-weight="500">Churn Rate</text>
  <text x="564" y="156" fill="#F0F6FC" font-family="-apple-system, sans-serif" font-size="28" font-weight="800">1.24%</text>
  <text x="564" y="182" fill="#3FB950" font-family="-apple-system, sans-serif" font-size="12" font-weight="600">▼ -0.3% low risk</text>

  <!-- Main Chart Card -->
  <rect x="24" y="228" width="492" height="300" rx="12" fill="#161B22" stroke="#30363D"/>
  <text x="48" y="262" fill="#F0F6FC" font-family="-apple-system, sans-serif" font-size="16" font-weight="700">Revenue Growth Trend</text>
  <text x="48" y="282" fill="#8B949E" font-family="-apple-system, sans-serif" font-size="12">Jan 2026 - Present</text>
  
  <!-- Line Chart Graph Graphic -->
  <defs>
    <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#388BFD" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="#388BFD" stop-opacity="0.0"/>
    </linearGradient>
  </defs>
  <path d="M50 480 L110 440 L180 450 L250 390 L320 405 L390 340 L470 310 L470 490 L50 490 Z" fill="url(#areaGrad)"/>
  <path d="M50 480 L110 440 L180 450 L250 390 L320 405 L390 340 L470 310" stroke="#58A6FF" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="470" cy="310" r="5" fill="#58A6FF" stroke="#161B22" stroke-width="2"/>

  <!-- Activity Feed Side Card -->
  <rect x="536" y="228" width="240" height="300" rx="12" fill="#161B22" stroke="#30363D"/>
  <text x="556" y="262" fill="#F0F6FC" font-family="-apple-system, sans-serif" font-size="16" font-weight="700">Live Conversions</text>
  
  <circle cx="568" cy="300" r="14" fill="#1F6FEB"/>
  <text x="592" y="298" fill="#F0F6FC" font-family="-apple-system, sans-serif" font-size="13" font-weight="600">Enterprise Deal</text>
  <text x="592" y="314" fill="#8B949E" font-family="-apple-system, sans-serif" font-size="11">Acme Corp • $12,000</text>
  
  <circle cx="568" cy="355" r="14" fill="#238636"/>
  <text x="592" y="353" fill="#F0F6FC" font-family="-apple-system, sans-serif" font-size="13" font-weight="600">Team Upgrade</text>
  <text x="592" y="369" fill="#8B949E" font-family="-apple-system, sans-serif" font-size="11">Stripe Inc • $2,400</text>
  
  <circle cx="568" cy="410" r="14" fill="#8957E5"/>
  <text x="592" y="408" fill="#F0F6FC" font-family="-apple-system, sans-serif" font-size="13" font-weight="600">Pro Subscription</text>
  <text x="592" y="424" fill="#8B949E" font-family="-apple-system, sans-serif" font-size="11">Vercel User • $490</text>
</svg>
`;

const sneakerEcommerceSvg = `
<svg width="450" height="680" viewBox="0 0 450 680" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="450" height="680" rx="28" fill="#FFFFFF"/>
  
  <!-- Image Card Container -->
  <rect x="20" y="20" width="410" height="340" rx="24" fill="#F3F4F6"/>
  
  <!-- Sneaker Silhouette Graphic -->
  <path d="M100 240 C140 230 180 210 220 180 C260 150 310 160 340 190 C360 210 360 250 330 260 C290 270 200 275 110 270 C80 268 70 245 100 240 Z" fill="#111827"/>
  <path d="M120 270 C160 272 260 272 340 260 L345 280 C270 290 170 290 115 285 Z" fill="#EF4444"/>
  <circle cx="370" cy="55" r="20" fill="#FFFFFF"/>
  <!-- Heart Icon -->
  <path d="M363 51 C361 48 357 48 355 51 C352 54 353 59 356 62 L370 73 L384 62 C387 59 388 54 385 51 C383 48 379 48 377 51 L370 57 L363 51 Z" fill="#EF4444" transform="translate(-5, -5) scale(0.7)"/>

  <!-- Tag -->
  <rect x="40" y="40" width="80" height="28" rx="8" fill="#EF4444"/>
  <text x="80" y="58" fill="#FFFFFF" font-family="-apple-system, sans-serif" font-size="12" font-weight="700" text-anchor="middle">NEW 2026</text>

  <!-- Details -->
  <text x="32" y="395" fill="#6B7280" font-family="-apple-system, sans-serif" font-size="13" font-weight="600">RUNNING COLLECTION</text>
  <text x="32" y="425" fill="#111827" font-family="-apple-system, sans-serif" font-size="24" font-weight="800">Nike Air VaporMax Apex</text>
  
  <!-- Ratings -->
  <text x="32" y="455" fill="#F59E0B" font-family="-apple-system, sans-serif" font-size="14">★★★★★</text>
  <text x="105" y="455" fill="#4B5563" font-family="-apple-system, sans-serif" font-size="13" font-weight="600">4.9 (328 reviews)</text>
  
  <!-- Color Options -->
  <text x="32" y="495" fill="#374151" font-family="-apple-system, sans-serif" font-size="14" font-weight="600">Select Color:</text>
  <circle cx="140" cy="491" r="12" fill="#111827" stroke="#3B82F6" stroke-width="2.5"/>
  <circle cx="175" cy="491" r="12" fill="#EF4444"/>
  <circle cx="210" cy="491" r="12" fill="#10B981"/>
  <circle cx="245" cy="491" r="12" fill="#6366F1"/>

  <!-- Sizes -->
  <text x="32" y="540" fill="#374151" font-family="-apple-system, sans-serif" font-size="14" font-weight="600">Size (US):</text>
  <rect x="32" y="555" width="46" height="38" rx="10" fill="#F3F4F6"/>
  <text x="55" y="579" fill="#374151" font-family="-apple-system, sans-serif" font-size="14" font-weight="600" text-anchor="middle">8.5</text>
  
  <rect x="88" y="555" width="46" height="38" rx="10" fill="#111827"/>
  <text x="111" y="579" fill="#FFFFFF" font-family="-apple-system, sans-serif" font-size="14" font-weight="700" text-anchor="middle">9.0</text>
  
  <rect x="144" y="555" width="46" height="38" rx="10" fill="#F3F4F6"/>
  <text x="167" y="579" fill="#374151" font-family="-apple-system, sans-serif" font-size="14" font-weight="600" text-anchor="middle">9.5</text>
  
  <rect x="200" y="555" width="46" height="38" rx="10" fill="#F3F4F6"/>
  <text x="223" y="579" fill="#374151" font-family="-apple-system, sans-serif" font-size="14" font-weight="600" text-anchor="middle">10.0</text>

  <!-- Bottom Price and CTA -->
  <line x1="32" y1="615" x2="418" y2="615" stroke="#E5E7EB"/>
  <text x="32" y="648" fill="#111827" font-family="-apple-system, sans-serif" font-size="26" font-weight="800">$219.99</text>
  
  <rect x="228" y="625" width="190" height="46" rx="23" fill="#111827"/>
  <text x="323" y="654" fill="#FFFFFF" font-family="-apple-system, sans-serif" font-size="15" font-weight="700" text-anchor="middle">Add to Cart</text>
</svg>
`;

export const SAMPLE_IMAGES: SampleImage[] = [
  {
    id: 'crypto-wallet',
    title: 'Mobile Crypto & Banking Wallet',
    category: 'Mobile / React Native',
    description: 'High-contrast dark mode card with balance, send/receive actions, and watchlist.',
    dataUrl: svgToDataUrl(cryptoWalletSvg),
    suggestedFramework: 'react-native',
    suggestedName: 'CryptoWalletScreen',
  },
  {
    id: 'saas-dashboard',
    title: 'SaaS Metrics & Analytics Dashboard',
    category: 'Web / React / Angular',
    description: 'Executive KPI metrics, revenue area chart trend, and live conversions feed.',
    dataUrl: svgToDataUrl(saasDashboardSvg),
    suggestedFramework: 'react',
    suggestedName: 'AnalyticsDashboard',
  },
  {
    id: 'sneaker-store',
    title: 'E-Commerce Sneaker Product Card',
    category: 'Universal / Angular / React',
    description: 'Product photo mockup, badge, ratings, color selector, size selector, and Add to Cart.',
    dataUrl: svgToDataUrl(sneakerEcommerceSvg),
    suggestedFramework: 'angular',
    suggestedName: 'ProductCardComponent',
  },
];
