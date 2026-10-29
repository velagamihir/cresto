# Cresto — Vision-to-Code Studio

> **Transform PNG screenshots, Figma exports, and UI mockups into clean, production-ready React, React Native, or Angular code powered by Google Gemini Vision AI.**

---

## ⚡ Features

- **Multi-Framework Synthesis**:
  - ⚛️ **React**: Modern functional components (React 18/19), TypeScript, responsive layouts, interactive hooks (`useState`), and custom styling (CSS / Tailwind / CSS Modules).
  - 📱 **React Native**: Authentic mobile components (`View`, `Text`, `StyleSheet.create`, `TouchableOpacity`, `ScrollView`, `SafeAreaView`), mobile layout hierarchy, and simulated smartphone preview.
  - 🅰️ **Angular**: Angular 17+ standalone components (`@Component`), TypeScript signals, semantic HTML templates, and scoped styles.
- **Multimodal AI Vision Powered by Gemini**:
  - Supports `gemini-2.5-flash`, `gemini-1.5-pro`, `gemini-2.0-flash`, and `gemini-1.5-flash`.
  - Analyzes geometry, typography, color palettes, visual hierarchy, and interactive states from images.
- **Instant Testing with Pre-loaded Mockups**:
  - **Mobile Crypto / Fintech Wallet** (React Native / React)
  - **SaaS KPI Metrics & Analytics Dashboard** (React / Angular)
  - **E-Commerce Sneaker Product Detail Card** (Angular / React)
- **Multi-File Workspace & Syntax Highlighter**:
  - File tabs for primary component, styles, types, and documentation.
  - Line numbers and syntax highlighting via PrismJS.
  - **One-Click ZIP Export**: Download complete, ready-to-use component packages with JSZip.
  - **Interactive Live Preview**:
    - Web browser frame for React & Angular.
    - Realistic smartphone bezel mockup (iPhone 16 Pro styling) for React Native.
- **Iterative Refinement**:
  - Natural language chat bar to request changes (e.g. *"Make the cards darker"*, *"Add a search bar"*, *"Change accent color to emerald"*).
- **Secure & Offline Friendly**:
  - API keys are stored solely in your browser's `localStorage` and never transmitted to third-party proxy servers.
  - Built-in **Demo / Mock Mode** to test generation instantly without requiring an API key.

---

## 🚀 Getting Started

### 1. Start the Development Server
```bash
npm install
npm run dev
```
Open **[http://localhost:5173](http://localhost:5173)** in your browser.

### 2. Build for Production
```bash
npm run build
npm run preview
```

---

## ⚙️ Configuration

Click the **API Key** button in the top navigation bar to either:
1. Enter your **Google Gemini API Key** (obtain free from [Google AI Studio](https://aistudio.google.com/app/apikey)), or
2. Keep **Demo / Mock Mode** toggled on for instant zero-config testing.
