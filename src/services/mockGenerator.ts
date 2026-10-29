import { Framework, GenerationResult } from '../types';

export function getMockGeneration(framework: Framework, componentName: string, imageTitle?: string): GenerationResult {
  const comp = componentName.trim() || (framework === 'react-native' ? 'MobileScreen' : 'DashboardCard');

  if (framework === 'react-native') {
    return {
      framework: 'react-native',
      componentName: comp,
      timestamp: Date.now(),
      promptNotes: 'Synthesized React Native component with native StyleSheet, vector iconography, and mobile touch interactions.',
      previewHtml: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
            body { background: #0F172A; color: #F8FAFC; padding: 20px; display: flex; flex-direction: column; gap: 16px; }
            .header { display: flex; justify-content: space-between; align-items: center; padding-top: 10px; }
            .user-info { display: flex; align-items: center; gap: 12px; }
            .avatar { width: 44px; height: 44px; border-radius: 22px; background: #6366F1; display: grid; place-items: center; font-weight: bold; color: white; }
            .badge { background: #1E293B; border-radius: 12px; padding: 8px; border: 1px solid #334155; }
            .balance-card {
              background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 50%, #EC4899 100%);
              border-radius: 24px; padding: 24px; color: white; position: relative; overflow: hidden;
              box-shadow: 0 12px 28px rgba(79, 70, 229, 0.35);
            }
            .balance-card h4 { font-size: 13px; font-weight: 500; opacity: 0.85; margin-bottom: 8px; }
            .balance-card .amount { font-size: 34px; font-weight: 800; margin-bottom: 12px; letter-spacing: -0.5px; }
            .pill { display: inline-flex; align-items: center; background: rgba(255,255,255,0.22); padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: 700; color: #4ADE80; }
            .actions-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-top: 8px; }
            .action-btn { background: #1E293B; border: 1px solid #334155; border-radius: 18px; padding: 14px 8px; text-align: center; color: white; cursor: pointer; transition: 0.2s; }
            .action-btn:hover { background: #273549; }
            .action-icon { width: 36px; height: 36px; border-radius: 12px; margin: 0 auto 6px; display: grid; place-items: center; font-size: 16px; }
            .send-icon { background: #312E81; color: #818CF8; }
            .rec-icon { background: #064E3B; color: #34D399; }
            .swap-icon { background: #78350F; color: #FBBF24; }
            .more-icon { background: #374151; color: #94A3B8; }
            .action-btn span { font-size: 11px; font-weight: 600; display: block; }
            .section-title { font-size: 17px; font-weight: 700; display: flex; justify-content: space-between; align-items: center; margin-top: 10px; }
            .asset-item { background: #1E293B; border: 1px solid #283548; border-radius: 16px; padding: 14px 16px; display: flex; justify-content: space-between; align-items: center; }
            .asset-left { display: flex; align-items: center; gap: 12px; }
            .asset-icon { width: 40px; height: 40px; border-radius: 20px; display: grid; place-items: center; font-weight: 800; font-size: 15px; color: white; }
            .asset-right { text-align: right; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="user-info">
              <div class="avatar">AM</div>
              <div>
                <div style="font-size: 11px; color: #94A3B8;">Welcome back,</div>
                <div style="font-weight: 700; font-size: 15px;">Alex Morgan</div>
              </div>
            </div>
            <div class="badge">🔔</div>
          </div>
          <div class="balance-card">
            <h4>Total Portfolio Balance</h4>
            <div class="amount">$48,259.40</div>
            <div class="pill">▲ +14.8% (24h)</div>
          </div>
          <div class="actions-grid">
            <div class="action-btn"><div class="action-icon send-icon">↗</div><span>Send</span></div>
            <div class="action-btn"><div class="action-icon rec-icon">↙</div><span>Receive</span></div>
            <div class="action-btn"><div class="action-icon swap-icon">⇄</div><span>Swap</span></div>
            <div class="action-btn"><div class="action-icon more-icon">•••</div><span>More</span></div>
          </div>
          <div class="section-title">
            <span>Watchlist &amp; Assets</span>
            <span style="font-size: 12px; color: #6366F1; cursor: pointer;">See All</span>
          </div>
          <div class="asset-item">
            <div class="asset-left">
              <div class="asset-icon" style="background: #F7931A;">₿</div>
              <div><div style="font-weight: 600;">Bitcoin</div><div style="font-size: 12px; color: #94A3B8;">0.642 BTC</div></div>
            </div>
            <div class="asset-right">
              <div style="font-weight: 700;">$43,180.20</div>
              <div style="font-size: 11px; color: #10B981; font-weight: 600;">+4.25%</div>
            </div>
          </div>
          <div class="asset-item">
            <div class="asset-left">
              <div class="asset-icon" style="background: #627EEA;">Ξ</div>
              <div><div style="font-weight: 600;">Ethereum</div><div style="font-size: 12px; color: #94A3B8;">4.18 ETH</div></div>
            </div>
            <div class="asset-right">
              <div style="font-weight: 700;">$13,594.10</div>
              <div style="font-size: 11px; color: #10B981; font-weight: 600;">+7.12%</div>
            </div>
          </div>
        </body>
        </html>
      `,
      files: [
        {
          name: `${comp}.tsx`,
          language: 'typescript',
          description: 'Main React Native component with TypeScript and safe area handling',
          content: `import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface CryptoAsset {
  id: string;
  symbol: string;
  name: string;
  amount: string;
  value: string;
  change: string;
  color: string;
}

export const ${comp}: React.FC = () => {
  const [balance] = useState('$48,259.40');
  const [assets] = useState<CryptoAsset[]>([
    { id: '1', symbol: '₿', name: 'Bitcoin', amount: '0.642 BTC', value: '$43,180.20', change: '+4.25%', color: '#F7931A' },
    { id: '2', symbol: 'Ξ', name: 'Ethereum', amount: '4.18 ETH', value: '$13,594.10', change: '+7.12%', color: '#627EEA' },
    { id: '3', symbol: 'S', name: 'Solana', amount: '38.5 SOL', value: '$6,842.00', change: '-1.42%', color: '#14F195' },
  ]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" />
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header Bar */}
        <View style={styles.header}>
          <View style={styles.userSection}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>AM</Text>
            </View>
            <View>
              <Text style={styles.greeting}>Welcome back,</Text>
              <Text style={styles.userName}>Alex Morgan</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.bellButton} activeOpacity={0.7}>
            <Text style={styles.bellIcon}>🔔</Text>
            <View style={styles.notificationDot} />
          </TouchableOpacity>
        </View>

        {/* Portfolio Balance Card */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceTitle}>Total Portfolio Balance</Text>
          <Text style={styles.balanceAmount}>{balance}</Text>
          <View style={styles.trendBadge}>
            <Text style={styles.trendText}>▲ +14.8% (24h)</Text>
          </View>
          <View style={styles.cardFooter}>
            <Text style={styles.cardSub}>Visa Platinum •••• 9821</Text>
            <Text style={styles.cardBrand}>💳 Virtual</Text>
          </View>
        </View>

        {/* Quick Actions Grid */}
        <View style={styles.actionsGrid}>
          <TouchableOpacity style={styles.actionButton} activeOpacity={0.8}>
            <View style={[styles.actionIconContainer, { backgroundColor: '#312E81' }]}>
              <Text style={[styles.actionIcon, { color: '#818CF8' }]}>↗</Text>
            </View>
            <Text style={styles.actionLabel}>Send</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} activeOpacity={0.8}>
            <View style={[styles.actionIconContainer, { backgroundColor: '#064E3B' }]}>
              <Text style={[styles.actionIcon, { color: '#34D399' }]}>↙</Text>
            </View>
            <Text style={styles.actionLabel}>Receive</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} activeOpacity={0.8}>
            <View style={[styles.actionIconContainer, { backgroundColor: '#78350F' }]}>
              <Text style={[styles.actionIcon, { color: '#FBBF24' }]}>⇄</Text>
            </View>
            <Text style={styles.actionLabel}>Swap</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} activeOpacity={0.8}>
            <View style={[styles.actionIconContainer, { backgroundColor: '#374151' }]}>
              <Text style={[styles.actionIcon, { color: '#94A3B8' }]}>•••</Text>
            </View>
            <Text style={styles.actionLabel}>More</Text>
          </TouchableOpacity>
        </View>

        {/* Assets Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Watchlist &amp; Assets</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>

        {assets.map((item) => (
          <TouchableOpacity key={item.id} style={styles.assetCard} activeOpacity={0.7}>
            <View style={styles.assetLeft}>
              <View style={[styles.assetSymbolCircle, { backgroundColor: item.color }]}>
                <Text style={styles.symbolText}>{item.symbol}</Text>
              </View>
              <View>
                <Text style={styles.assetName}>{item.name}</Text>
                <Text style={styles.assetHolding}>{item.amount}</Text>
              </View>
            </View>
            <View style={styles.assetRight}>
              <Text style={styles.assetValue}>{item.value}</Text>
              <Text
                style={[
                  styles.assetChange,
                  { color: item.change.startsWith('+') ? '#10B981' : '#EF4444' },
                ]}
              >
                {item.change}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  container: {
    padding: 20,
    gap: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#6366F1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
  greeting: {
    fontSize: 12,
    color: '#94A3B8',
  },
  userName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  bellButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#334155',
    position: 'relative',
  },
  bellIcon: {
    fontSize: 18,
  },
  notificationDot: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
  },
  balanceCard: {
    backgroundColor: '#6366F1',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 8,
  },
  balanceTitle: {
    color: '#E0E7FF',
    fontSize: 14,
    fontWeight: '500',
  },
  balanceAmount: {
    color: '#FFFFFF',
    fontSize: 34,
    fontWeight: '800',
    marginVertical: 8,
    letterSpacing: -0.5,
  },
  trendBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  trendText: {
    color: '#4ADE80',
    fontWeight: '700',
    fontSize: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.15)',
    paddingTop: 12,
  },
  cardSub: {
    color: '#E0E7FF',
    fontSize: 12,
  },
  cardBrand: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  actionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    marginVertical: 4,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    gap: 6,
  },
  actionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionIcon: {
    fontSize: 18,
    fontWeight: '700',
  },
  actionLabel: {
    color: '#F8FAFC',
    fontSize: 12,
    fontWeight: '600',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  seeAllText: {
    color: '#818CF8',
    fontSize: 13,
    fontWeight: '600',
  },
  assetCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 16,
    padding: 16,
  },
  assetLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  assetSymbolCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  symbolText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  assetName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#F8FAFC',
  },
  assetHolding: {
    fontSize: 12,
    color: '#94A3B8',
  },
  assetRight: {
    alignItems: 'flex-end',
  },
  assetValue: {
    fontSize: 15,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  assetChange: {
    fontSize: 12,
    fontWeight: '600',
  },
});

export default ${comp};
`,
        },
        {
          name: 'README.md',
          language: 'markdown',
          description: 'Quick start guide for React Native / Expo',
          content: `# ${comp} — React Native Screen

## Quick Start
1. Drop \`${comp}.tsx\` into your React Native or Expo project:
\`\`\`bash
# If using Expo
npx expo install react-native-safe-area-context
\`\`\`

2. Render it in your navigation stack or root:
\`\`\`tsx
import ${comp} from './${comp}';

export default function App() {
  return <${comp} />;
}
\`\`\`
`,
        },
      ],
    };
  }

  if (framework === 'angular') {
    return {
      framework: 'angular',
      componentName: comp,
      timestamp: Date.now(),
      promptNotes: 'Synthesized modern Angular 17+ standalone component with signals, template, and scoped styles.',
      previewHtml: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
            body { background: #F8FAFC; color: #1E293B; padding: 24px; display: flex; justify-content: center; }
            .product-card {
              background: #FFFFFF; border-radius: 24px; max-width: 420px; width: 100%;
              box-shadow: 0 10px 30px rgba(0,0,0,0.08); overflow: hidden; border: 1px solid #E2E8F0;
            }
            .hero-box { background: #F1F5F9; padding: 30px; text-align: center; position: relative; }
            .badge { position: absolute; top: 16px; left: 16px; background: #EF4444; color: white; padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: 700; }
            .sneaker-art { font-size: 72px; line-height: 1; }
            .content { padding: 24px; display: flex; flex-direction: column; gap: 16px; }
            .subtitle { font-size: 12px; font-weight: 700; color: #64748B; letter-spacing: 1px; }
            .title { font-size: 22px; font-weight: 800; color: #0F172A; }
            .ratings { display: flex; align-items: center; gap: 8px; font-size: 13px; color: #F59E0B; }
            .color-chips { display: flex; gap: 10px; margin-top: 6px; }
            .color-dot { width: 24px; height: 24px; border-radius: 12px; cursor: pointer; border: 2px solid transparent; }
            .color-dot.active { border-color: #3B82F6; }
            .size-grid { display: flex; gap: 8px; margin-top: 6px; }
            .size-btn { border: 1px solid #E2E8F0; background: #F8FAFC; padding: 8px 14px; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; }
            .size-btn.active { background: #0F172A; color: white; border-color: #0F172A; }
            .footer-row { display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #E2E8F0; padding-top: 18px; margin-top: 8px; }
            .price { font-size: 24px; font-weight: 800; color: #0F172A; }
            .add-cart-btn { background: #0F172A; color: white; border: none; padding: 12px 24px; border-radius: 30px; font-weight: 700; cursor: pointer; font-size: 14px; transition: 0.2s; }
            .add-cart-btn:hover { background: #334155; }
          </style>
        </head>
        <body>
          <div class="product-card">
            <div class="hero-box">
              <span class="badge">NEW 2026</span>
              <div class="sneaker-art">👟</div>
            </div>
            <div class="content">
              <div>
                <div class="subtitle">RUNNING COLLECTION</div>
                <h2 class="title">Nike Air VaporMax Apex</h2>
              </div>
              <div class="ratings">
                <span>★★★★★</span>
                <span style="color: #64748B; font-weight: 600;">4.9 (328 reviews)</span>
              </div>
              <div>
                <div style="font-size: 13px; font-weight: 600; color: #475569; margin-bottom: 6px;">Select Color</div>
                <div class="color-chips">
                  <div class="color-dot active" style="background: #111827;"></div>
                  <div class="color-dot" style="background: #EF4444;"></div>
                  <div class="color-dot" style="background: #10B981;"></div>
                  <div class="color-dot" style="background: #6366F1;"></div>
                </div>
              </div>
              <div>
                <div style="font-size: 13px; font-weight: 600; color: #475569; margin-bottom: 6px;">Size (US)</div>
                <div class="size-grid">
                  <button class="size-btn">8.5</button>
                  <button class="size-btn active">9.0</button>
                  <button class="size-btn">9.5</button>
                  <button class="size-btn">10.0</button>
                </div>
              </div>
              <div class="footer-row">
                <div class="price">$219.99</div>
                <button class="add-cart-btn">Add to Cart</button>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
      files: [
        {
          name: `${comp.toLowerCase()}.component.ts`,
          language: 'typescript',
          description: 'Angular 17+ Standalone Component TypeScript file',
          content: `import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-${comp.toLowerCase()}',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './${comp.toLowerCase()}.component.html',
  styleUrls: ['./${comp.toLowerCase()}.component.css']
})
export class ${comp}Component {
  product = signal({
    badge: 'NEW 2026',
    category: 'RUNNING COLLECTION',
    name: 'Nike Air VaporMax Apex',
    rating: 4.9,
    reviewsCount: 328,
    price: 219.99,
  });

  selectedColor = signal<string>('#111827');
  availableColors = ['#111827', '#EF4444', '#10B981', '#6366F1'];

  selectedSize = signal<string>('9.0');
  availableSizes = ['8.5', '9.0', '9.5', '10.0', '10.5'];

  isAddedToCart = signal<boolean>(false);

  selectColor(color: string): void {
    this.selectedColor.set(color);
  }

  selectSize(size: string): void {
    this.selectedSize.set(size);
  }

  addToCart(): void {
    this.isAddedToCart.set(true);
    setTimeout(() => this.isAddedToCart.set(false), 2000);
  }
}
`,
        },
        {
          name: `${comp.toLowerCase()}.component.html`,
          language: 'html',
          description: 'Angular Component Template HTML',
          content: `<div class="product-card">
  <!-- Hero Showcase -->
  <div class="hero-container">
    <span class="badge">{{ product().badge }}</span>
    <div class="image-wrapper">
      <div class="sneaker-graphic">👟</div>
    </div>
  </div>

  <!-- Content Details -->
  <div class="details-body">
    <div class="header-group">
      <span class="category-tag">{{ product().category }}</span>
      <h2 class="title">{{ product().name }}</h2>
      <div class="rating-bar">
        <span class="stars">★★★★★</span>
        <span class="rating-text">{{ product().rating }} ({{ product().reviewsCount }} reviews)</span>
      </div>
    </div>

    <!-- Color Selector -->
    <div class="option-section">
      <label class="section-label">Select Color</label>
      <div class="color-list">
        <button
          *ngFor="let color of availableColors"
          class="color-pill"
          [style.backgroundColor]="color"
          [class.selected]="selectedColor() === color"
          (click)="selectColor(color)"
        ></button>
      </div>
    </div>

    <!-- Size Selector -->
    <div class="option-section">
      <label class="section-label">Size (US)</label>
      <div class="size-grid">
        <button
          *ngFor="let size of availableSizes"
          class="size-button"
          [class.active]="selectedSize() === size"
          (click)="selectSize(size)"
        >
          {{ size }}
        </button>
      </div>
    </div>

    <!-- Pricing and Action -->
    <div class="action-footer">
      <div class="price-display">
        <span class="currency">$</span>{{ product().price | number:'1.2-2' }}
      </div>
      <button class="cta-button" (click)="addToCart()" [class.success]="isAddedToCart()">
        {{ isAddedToCart() ? 'Added to Bag!' : 'Add to Cart' }}
      </button>
    </div>
  </div>
</div>
`,
        },
        {
          name: `${comp.toLowerCase()}.component.css`,
          language: 'css',
          description: 'Angular Scoped Styles',
          content: `.product-card {
  max-width: 440px;
  background: #ffffff;
  border-radius: 28px;
  overflow: hidden;
  box-shadow: 0 16px 36px rgba(15, 23, 42, 0.08);
  border: 1px solid #e2e8f0;
  margin: 0 auto;
  font-family: 'Inter', system-ui, sans-serif;
}

.hero-container {
  background: #f1f5f9;
  position: relative;
  padding: 40px 24px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.badge {
  position: absolute;
  top: 18px;
  left: 18px;
  background: #ef4444;
  color: #ffffff;
  font-size: 11px;
  font-weight: 700;
  padding: 5px 12px;
  border-radius: 20px;
  letter-spacing: 0.5px;
}

.sneaker-graphic {
  font-size: 80px;
  filter: drop-shadow(0 15px 15px rgba(0, 0, 0, 0.15));
}

.details-body {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.category-tag {
  font-size: 12px;
  font-weight: 700;
  color: #64748b;
  letter-spacing: 1px;
}

.title {
  font-size: 22px;
  font-weight: 800;
  color: #0f172a;
  margin: 4px 0 8px;
}

.rating-bar {
  display: flex;
  align-items: center;
  gap: 8px;
}

.stars {
  color: #f59e0b;
  font-size: 14px;
}

.rating-text {
  font-size: 13px;
  font-weight: 600;
  color: #475569;
}

.section-label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: #334155;
  margin-bottom: 8px;
}

.color-list {
  display: flex;
  gap: 12px;
}

.color-pill {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 2px solid transparent;
  cursor: pointer;
  transition: transform 0.15s ease;
}

.color-pill.selected {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
  transform: scale(1.1);
}

.size-grid {
  display: flex;
  gap: 8px;
}

.size-button {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 8px 14px;
  font-size: 13px;
  font-weight: 600;
  color: #334155;
  cursor: pointer;
  transition: all 0.15s ease;
}

.size-button.active {
  background: #0f172a;
  color: #ffffff;
  border-color: #0f172a;
}

.action-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid #f1f5f9;
  padding-top: 18px;
}

.price-display {
  font-size: 26px;
  font-weight: 800;
  color: #0f172a;
}

.currency {
  font-size: 18px;
  vertical-align: top;
}

.cta-button {
  background: #0f172a;
  color: #ffffff;
  border: none;
  padding: 12px 24px;
  border-radius: 24px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s ease;
}

.cta-button.success {
  background: #10b981;
}
`,
        },
        {
          name: 'README.md',
          language: 'markdown',
          description: 'Angular integration guide',
          content: `# ${comp}Component — Angular

## How to use
In your standalone Angular 17+ template:
\`\`\`html
<app-${comp.toLowerCase()}></app-${comp.toLowerCase()}>
\`\`\`

Import in your parent component:
\`\`\`typescript
import { ${comp}Component } from './${comp.toLowerCase()}.component';

@Component({
  imports: [${comp}Component],
  // ...
})
\`\`\`
`,
        },
      ],
    };
  }

  // Default: React
  return {
    framework: 'react',
    componentName: comp,
    timestamp: Date.now(),
    promptNotes: 'Synthesized modern React + TypeScript dashboard component with interactive tabs, KPIs, and SVG chart.',
    previewHtml: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
          body { background: #0D1117; color: #F0F6FC; padding: 24px; }
          .navbar { display: flex; justify-content: space-between; align-items: center; background: #161B22; border: 1px solid #30363D; border-radius: 12px; padding: 12px 20px; margin-bottom: 24px; }
          .logo { font-weight: 800; font-size: 17px; color: #58A6FF; display: flex; align-items: center; gap: 8px; }
          .metrics-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; margin-bottom: 24px; }
          .card { background: #161B22; border: 1px solid #30363D; border-radius: 14px; padding: 20px; }
          .card-title { font-size: 13px; color: #8B949E; margin-bottom: 8px; font-weight: 500; }
          .card-val { font-size: 28px; font-weight: 800; color: #F0F6FC; margin-bottom: 6px; }
          .card-trend { font-size: 12px; font-weight: 600; color: #3FB950; }
          .main-grid { display: grid; grid-template-columns: 2fr 1fr; gap: 20px; }
          @media (max-width: 768px) { .main-grid { grid-template-columns: 1fr; } }
          .chart-box { background: #161B22; border: 1px solid #30363D; border-radius: 14px; padding: 22px; }
          .chart-title { font-size: 16px; font-weight: 700; margin-bottom: 16px; }
          .chart-svg { width: 100%; height: 200px; }
          .activity-item { display: flex; align-items: center; gap: 12px; padding: 12px 0; border-bottom: 1px solid #21262D; }
          .badge-dot { width: 32px; height: 32px; border-radius: 8px; background: #1F6FEB; display: grid; place-items: center; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="navbar">
          <div class="logo">⚡ MetricsPulse</div>
          <button style="background: #238636; color: white; border: none; padding: 8px 16px; border-radius: 8px; font-weight: 600; cursor: pointer;">+ New Report</button>
        </div>
        <div class="metrics-grid">
          <div class="card">
            <div class="card-title">Monthly Recurring Revenue</div>
            <div class="card-val">$124,500</div>
            <div class="card-trend">▲ +18.2% vs last month</div>
          </div>
          <div class="card">
            <div class="card-title">Active Subscribers</div>
            <div class="card-val">14,289</div>
            <div class="card-trend">▲ +8.4% new signups</div>
          </div>
          <div class="card">
            <div class="card-title">Churn Rate</div>
            <div class="card-val">1.24%</div>
            <div class="card-trend">▼ -0.3% low risk</div>
          </div>
        </div>
        <div class="main-grid">
          <div class="chart-box">
            <div class="chart-title">Revenue Growth Trend</div>
            <svg class="chart-svg" viewBox="0 0 500 200">
              <defs>
                <linearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stop-color="#388BFD" stop-opacity="0.4"/>
                  <stop offset="100%" stop-color="#388BFD" stop-opacity="0.0"/>
                </linearGradient>
              </defs>
              <polygon points="20,180 80,140 160,150 240,90 320,110 400,50 480,30 480,180 20,180" fill="url(#grad)" />
              <polyline points="20,180 80,140 160,150 240,90 320,110 400,50 480,30" fill="none" stroke="#58A6FF" stroke-width="3" />
            </svg>
          </div>
          <div class="chart-box">
            <div class="chart-title">Live Conversions</div>
            <div class="activity-item">
              <div class="badge-dot" style="background: #1F6FEB;">💼</div>
              <div><div style="font-size: 13px; font-weight: 600;">Enterprise Deal</div><div style="font-size: 11px; color: #8B949E;">Acme Corp • $12,000</div></div>
            </div>
            <div class="activity-item">
              <div class="badge-dot" style="background: #238636;">🚀</div>
              <div><div style="font-size: 13px; font-weight: 600;">Team Upgrade</div><div style="font-size: 11px; color: #8B949E;">Stripe Inc • $2,400</div></div>
            </div>
          </div>
        </div>
      </body>
      </html>
    `,
    files: [
      {
        name: `${comp}.tsx`,
        language: 'typescript',
        description: 'React TypeScript Component',
        content: `import React, { useState } from 'react';
import './${comp}.css';

interface MetricItem {
  id: string;
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
}

export const ${comp}: React.FC = () => {
  const [metrics] = useState<MetricItem[]>([
    { id: '1', title: 'Monthly Recurring Revenue', value: '$124,500', change: '+18.2% vs last month', isPositive: true },
    { id: '2', title: 'Active Subscribers', value: '14,289', change: '+8.4% new signups', isPositive: true },
    { id: '3', title: 'Churn Rate', value: '1.24%', change: '-0.3% low risk', isPositive: true },
  ]);

  const [activeTab, setActiveTab] = useState<'overview' | 'analytics' | 'customers'>('overview');

  return (
    <div className="dashboard-container">
      {/* Top Navbar */}
      <header className="dashboard-nav">
        <div className="nav-brand">
          <div className="brand-badge">⚡</div>
          <span className="brand-name">MetricsPulse</span>
        </div>
        <nav className="nav-links">
          {(['overview', 'analytics', 'customers'] as const).map((tab) => (
            <button
              key={tab}
              className={\`nav-link-btn \${activeTab === tab ? 'active' : ''}\`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>
        <button className="create-report-btn">+ New Report</button>
      </header>

      {/* KPI Metrics */}
      <section className="metrics-grid">
        {metrics.map((m) => (
          <div key={m.id} className="metric-card">
            <span className="metric-label">{m.title}</span>
            <div className="metric-value">{m.value}</div>
            <div className={\`metric-trend \${m.isPositive ? 'trend-up' : 'trend-down'}\`}>
              {m.isPositive ? '▲' : '▼'} {m.change}
            </div>
          </div>
        ))}
      </section>

      {/* Main Insights Grid */}
      <div className="insights-layout">
        {/* Chart Column */}
        <div className="chart-panel">
          <div className="panel-header">
            <div>
              <h3 className="panel-title">Revenue Growth Trend</h3>
              <p className="panel-subtitle">Jan 2026 - Present</p>
            </div>
            <span className="timeframe-tag">Quarterly</span>
          </div>
          <div className="chart-svg-wrapper">
            <svg viewBox="0 0 500 200" className="chart-svg" preserveAspectRatio="none">
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#388BFD" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#388BFD" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <polygon points="20,180 80,140 160,150 240,90 320,110 400,50 480,30 480,180 20,180" fill="url(#chartGradient)" />
              <polyline points="20,180 80,140 160,150 240,90 320,110 400,50 480,30" fill="none" stroke="#58A6FF" strokeWidth="3" />
              <circle cx="480" cy="30" r="5" fill="#58A6FF" stroke="#161B22" strokeWidth="2" />
            </svg>
          </div>
        </div>

        {/* Live Feed Column */}
        <div className="feed-panel">
          <h3 className="panel-title">Live Conversions</h3>
          <div className="feed-list">
            <div className="feed-item">
              <div className="feed-badge blue">💼</div>
              <div className="feed-info">
                <span className="feed-lead">Enterprise Deal</span>
                <span className="feed-sub">Acme Corp • $12,000</span>
              </div>
            </div>
            <div className="feed-item">
              <div className="feed-badge green">🚀</div>
              <div className="feed-info">
                <span className="feed-lead">Team Upgrade</span>
                <span className="feed-sub">Stripe Inc • $2,400</span>
              </div>
            </div>
            <div className="feed-item">
              <div className="feed-badge purple">⚡</div>
              <div className="feed-info">
                <span className="feed-lead">Pro Subscription</span>
                <span className="feed-sub">Vercel User • $490</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ${comp};
`,
      },
      {
        name: `${comp}.css`,
        language: 'css',
        description: 'Styles for React Component',
        content: `.dashboard-container {
  background-color: #0d1117;
  color: #f0f6fc;
  padding: 24px;
  border-radius: 16px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);
}

.dashboard-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #161b22;
  border: 1px solid #30363d;
  border-radius: 12px;
  padding: 12px 20px;
  margin-bottom: 24px;
}

.nav-brand {
  display: flex;
  align-items: center;
  gap: 10px;
}

.brand-badge {
  background: #2563eb;
  padding: 6px 8px;
  border-radius: 8px;
  font-size: 14px;
}

.brand-name {
  font-weight: 700;
  font-size: 16px;
  color: #f0f6fc;
}

.nav-links {
  display: flex;
  gap: 16px;
}

.nav-link-btn {
  background: none;
  border: none;
  color: #8b949e;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  padding: 6px 12px;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.nav-link-btn.active, .nav-link-btn:hover {
  color: #58a6ff;
  background: rgba(56, 139, 253, 0.1);
}

.create-report-btn {
  background-color: #238636;
  color: #ffffff;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.create-report-btn:hover {
  background-color: #2ea043;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.metric-card {
  background-color: #161b22;
  border: 1px solid #30363d;
  border-radius: 12px;
  padding: 20px;
}

.metric-label {
  font-size: 13px;
  color: #8b949e;
  font-weight: 500;
}

.metric-value {
  font-size: 28px;
  font-weight: 800;
  color: #f0f6fc;
  margin: 6px 0;
}

.metric-trend {
  font-size: 12px;
  font-weight: 600;
}

.trend-up {
  color: #3fb950;
}

.trend-down {
  color: #f85149;
}

.insights-layout {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 20px;
}

@media (max-width: 860px) {
  .insights-layout {
    grid-template-columns: 1fr;
  }
}

.chart-panel, .feed-panel {
  background-color: #161b22;
  border: 1px solid #30363d;
  border-radius: 12px;
  padding: 20px;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.panel-title {
  font-size: 16px;
  font-weight: 700;
  color: #f0f6fc;
}

.panel-subtitle {
  font-size: 12px;
  color: #8b949e;
  margin-top: 2px;
}

.timeframe-tag {
  background: #21262d;
  border: 1px solid #30363d;
  color: #8b949e;
  font-size: 11px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 20px;
}

.chart-svg-wrapper {
  height: 200px;
  width: 100%;
}

.chart-svg {
  width: 100%;
  height: 100%;
}

.feed-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 14px;
}

.feed-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 0;
  border-bottom: 1px solid #21262d;
}

.feed-badge {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: grid;
  place-items: center;
  font-size: 16px;
}

.feed-badge.blue { background-color: #1f6feb; }
.feed-badge.green { background-color: #238636; }
.feed-badge.purple { background-color: #8957e5; }

.feed-info {
  display: flex;
  flex-direction: column;
}

.feed-lead {
  font-size: 13px;
  font-weight: 600;
  color: #f0f6fc;
}

.feed-sub {
  font-size: 11px;
  color: #8b949e;
  margin-top: 2px;
}
`,
      },
      {
        name: 'README.md',
        language: 'markdown',
        description: 'React usage instructions',
        content: `# ${comp} — React Component

## Usage
Import into your React app:
\`\`\`tsx
import ${comp} from './${comp}';

export default function App() {
  return <${comp} />;
}
\`\`\`
`,
      },
    ],
  };
}
