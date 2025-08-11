# GitHub Pages Setup Instructions

After the PR is merged, you'll need to configure GitHub Pages settings:

1. Go to your repository settings: https://github.com/herman925/minutes-master/settings
2. Scroll down to "Pages" in the left sidebar
3. Under "Source", select "GitHub Actions" (not "Deploy from a branch")
4. Save the settings

The workflow will then automatically:
- Build the React app when code is pushed to main
- Deploy the built files to GitHub Pages
- Make the site available at: https://herman925.github.io/minutes-master/

## Changes Made

### 1. Fixed Vite Configuration (`vite.config.ts`)
- Added `base: '/minutes-master/'` to ensure asset paths work on GitHub Pages
- GitHub Pages serves repositories at `username.github.io/repo-name/`
- Without this, assets would try to load from the root domain

### 2. Added GitHub Actions Workflow (`.github/workflows/deploy.yml`)
- Automatically builds the React app on every push to main
- Uses Node.js 18 and npm for reliable builds
- Uploads the built `/dist` folder to GitHub Pages
- Includes proper permissions for Pages deployment

## Testing Results
- App builds successfully with new configuration
- Asset paths now correctly reference `/minutes-master/` base
- Local preview server shows app working correctly at `http://localhost:4173/minutes-master/`
- All main functionality tested (home page, setup wizard navigation)

The blank GitHub Pages issue should now be resolved!