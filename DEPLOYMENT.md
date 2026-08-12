# Deployment Guide for CRM Prototype

## Pre-Deployment Checklist

### ✅ Code Quality
- [ ] All features working as expected
- [ ] Responsive design tested on different screen sizes
- [ ] No console errors or warnings
- [ ] Build completes successfully (`npm run build`)
- [ ] Preview works correctly (`npm run preview`)

### ✅ Configuration Files
- [ ] `vercel.json` - Vercel deployment configuration ✓
- [ ] `vite.config.js` - Optimized build settings ✓
- [ ] `.gitignore` - Excludes node_modules, dist, .env ✓
- [ ] `package.json` - Updated with deployment scripts ✓

## Deployment Methods

### Method 1: Vercel CLI (Fastest)

1. **Install Vercel CLI** (one-time setup):
```bash
npm install -g vercel
```

2. **Login to Vercel**:
```bash
vercel login
```

3. **Deploy** (from project root):
```bash
cd crm-prototype
npm run deploy
```

### Method 2: Git Integration (Recommended for continuous deployment)

1. **Initialize Git** (if not already done):
```bash
git init
git add .
git commit -m "Initial commit - CRM Prototype ready for deployment"
```

2. **Push to GitHub**:
```bash
git remote add origin https://github.com/your-username/crm-prototype.git
git branch -M main
git push -u origin main
```

3. **Connect to Vercel**:
   - Go to [vercel.com/dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Vite configuration
   - Click "Deploy"

### Method 3: Drag & Drop

1. **Build the project**:
```bash
npm run build
```

2. **Drag the `dist` folder** to [vercel.com/new](https://vercel.com/new)

## Build Verification

### Local Testing
```bash
# Build for production
npm run build

# Test the production build locally
npm run preview
# Visit http://localhost:4173/

# Test different screen sizes in browser dev tools
```

### Build Output
The successful build should show:
```
✓ 1505 modules transformed.
dist/index.html                   0.62 kB │ gzip:  0.34 kB
dist/assets/index-[hash].css     24.21 kB │ gzip:  4.91 kB
dist/assets/ui-[hash].js         10.29 kB │ gzip:  2.26 kB
dist/assets/index-[hash].js      92.01 kB │ gzip: 20.68 kB
dist/assets/vendor-[hash].js    162.87 kB │ gzip: 53.19 kB
```

## Post-Deployment

### Verification Steps
1. **Check all routes work**:
   - `/` (redirects to `/cockpit`)
   - `/cockpit` (main dashboard)
   - `/seller/:id` (seller detail pages)

2. **Test core functionality**:
   - Search and filtering
   - Task completion with mandatory remarks
   - Communication panel (chat/calls)
   - Responsive design on mobile

3. **Performance Check**:
   - Page load speed
   - Network tab (no 404s)
   - Console (no errors)

### Custom Domain (Optional)
1. In Vercel dashboard, go to your project
2. Go to "Domains" tab
3. Add your custom domain
4. Configure DNS settings as shown

## Troubleshooting

### Common Issues

#### Build Fails
- Check all dependencies are installed: `npm install`
- Clear cache: `rm -rf node_modules dist && npm install`
- Check for ESLint errors: `npm run lint`

#### Routing Issues (404 on refresh)
- Verify `vercel.json` has proper rewrites configuration ✓
- Ensure React Router is properly configured ✓

#### Missing Assets
- Check `vite.config.js` base path configuration ✓
- Verify all imports use relative paths ✓

## Environment Variables

Currently, this is a frontend-only application with no environment variables needed.

For future backend integration, create `.env` files and add to Vercel:

```bash
# In Vercel Dashboard > Project Settings > Environment Variables
VITE_API_URL=https://your-api-endpoint.com
VITE_APP_ENV=production
```

## Monitoring & Analytics

### Recommended Additions
1. **Vercel Analytics** - Built-in performance monitoring
2. **Google Analytics** - User behavior tracking
3. **Error Tracking** - Sentry or similar service
4. **Performance Monitoring** - Web Vitals tracking

---

## Quick Deploy Command

For fastest deployment after setup:
```bash
npm run deploy
```

This will build and deploy to production in one command.