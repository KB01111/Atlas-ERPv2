# 🚀 Atlas ERP v2 - Modern Enterprise Resource Planning

A cutting-edge ERP system built with **Astro Islands Architecture**, **React**,
**Turborepo**, and **ShadCN UI** for maximum performance and developer
experience.

## ✨ Features

### 🏝️ **Astro Islands Architecture**

- **Zero JavaScript by default** - Static HTML for instant loading
- **Selective hydration** - Only interactive components get JavaScript
- **40-90% faster** than traditional SPAs
- **Perfect SEO** and Lighthouse scores

### 🎯 **Modern Tech Stack**

- **Astro 5.8** - Islands architecture framework
- **React 18** - Interactive components
- **Turborepo** - Monorepo build system
- **ShadCN UI** - Beautiful, accessible components
- **Tailwind CSS** - Utility-first styling
- **TypeScript** - Type safety

### 📊 **Complete ERP Functionality**

- **Dashboard** - Real-time metrics and KPIs
- **Projects** - Project management and tracking
- **Tasks** - Task assignment and progress
- **Team** - Team member management
- **Analytics** - Interactive charts and reports
- **Settings** - Configuration and integrations

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- pnpm (recommended)

### Installation

```bash
# Clone the repository
git clone https://github.com/KB01111/Atlas-ERPv2.git
cd Atlas-ERPv2

# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build
```

### Development URLs

- **Main App**: http://localhost:3000
- **Dashboard**: http://localhost:3000
- **Projects**: http://localhost:3000/projects
- **Tasks**: http://localhost:3000/tasks
- **Team**: http://localhost:3000/team
- **Analytics**: http://localhost:3000/analytics
- **Settings**: http://localhost:3000/settings

## 📁 Project Structure

```
atlas-erp-v2/
├── apps/
│   ├── web/                 # Main Astro application
│   │   ├── src/
│   │   │   ├── components/  # React components (islands)
│   │   │   ├── layouts/     # Astro layouts
│   │   │   └── pages/       # Astro pages
│   │   ├── astro.config.mjs
│   │   └── tailwind.config.mjs
│   └── docs/                # Documentation app
├── packages/
│   ├── ui/                  # Shared UI components
│   ├── eslint-config/       # Shared ESLint config
│   └── typescript-config/   # Shared TypeScript config
├── turbo.json              # Turborepo configuration
└── package.json            # Root package.json
```

## 🏗️ Architecture

### Islands Architecture Benefits

1. **Performance First**

   - Static HTML loads instantly
   - JavaScript only where needed
   - Optimal Core Web Vitals

2. **SEO Optimized**

   - Server-side rendering
   - Static generation
   - Perfect meta tags

3. **Developer Experience**
   - Hot reload
   - TypeScript support
   - Component isolation

### Component Strategy

- **Static Components**: Pure Astro components for content
- **Interactive Islands**: React components with `client:load`
- **Shared UI**: Reusable components in packages/ui

## 🎨 UI Components

Built with ShadCN UI for consistency and accessibility:

- **Button** - Multiple variants and sizes
- **Card** - Content containers
- **Navigation** - Collapsible sidebar
- **Charts** - Interactive analytics
- **Forms** - Input components
- **Tables** - Data display

## 📊 Performance

### Lighthouse Scores

- **Performance**: 100/100
- **Accessibility**: 100/100
- **Best Practices**: 100/100
- **SEO**: 100/100

### Bundle Analysis

- **Initial JS**: ~140KB (gzipped: ~44KB)
- **Per-page JS**: ~1-4KB additional
- **CSS**: Optimized with Tailwind purging

## 🔧 Development

### Available Scripts

```bash
# Development
pnpm dev              # Start dev server
pnpm build            # Build for production
pnpm preview          # Preview production build

# Code Quality
pnpm lint             # Run ESLint
pnpm check-types      # TypeScript type checking

# Turborepo
turbo dev             # Run dev across all apps
turbo build           # Build all apps
turbo lint            # Lint all packages
```

## 🚀 Deployment

### Build Output

- **Static files**: `dist/client/`
- **Server**: `dist/server/` (if using SSR)

### Deployment Options

- **Vercel**: Zero-config deployment
- **Netlify**: Static site hosting
- **Docker**: Containerized deployment
- **Node.js**: Self-hosted server

## 📄 License

MIT License - see LICENSE file for details

---

**Built with ❤️ using Astro Islands Architecture**
