# Thanathorn (Tammy) Sukprasert - Personal Website

Personal academic website for Thanathorn Sukprasert, PhD student at UMass Amherst specializing in carbon-aware computing and sustainable systems.

## 🌐 Live Site

Visit: [https://tsukprasert.github.io](https://tsukprasert.github.io) (replace with your actual GitHub username)

## ✨ Features

- **Home Page**: Professional bio and research interests
- **Research**: Publications, presentations, and podcast appearances
- **CV**: Interactive PDF viewer with download option
- **Running Map**: Interactive Strava-powered map showing running routes

## 🛠️ Technology Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Mapping**: Leaflet.js with OpenStreetMap tiles
- **Data Source**: Strava API v3 (OAuth 2.0)
- **Hosting**: GitHub Pages
- **No Build Process**: Pure static site, edit and deploy directly

## 🚀 Setup Instructions

### 1. Clone Repository

```bash
git clone https://github.com/[your-username]/[your-username].github.io.git
cd [your-username].github.io
```

### 2. Configure Strava API (Required for Running Map)

1. Go to [https://www.strava.com/settings/api](https://www.strava.com/settings/api)
2. Create a new application
3. Set **Authorization Callback Domain** to: `[your-username].github.io`
4. Copy your **Client ID** and **Client Secret**
5. Edit `assets/js/strava-auth.js`:
   - Replace `YOUR_CLIENT_ID_HERE` with your Client ID on line 10
   - Replace `YOUR_CLIENT_SECRET_HERE` with your Client Secret on line 69

   **⚠️ SECURITY WARNING**: For production, the Client Secret should NOT be in client-side code. Consider using a serverless function (Netlify Functions, AWS Lambda, etc.) or accept that tokens will need manual refresh every 6 hours.

### 3. Add Your Content

- **Profile Photo**: Replace `assets/images/profile.jpg` with your photo
- **CV**: Add your PDF resume to `assets/cv/sukprasert_cv.pdf`
- **Publications**: Edit `research.html` to add your papers, update links
- **Bio**: Update personal information in `index.html`

### 4. Deploy to GitHub Pages

1. Push to GitHub:
   ```bash
   git add .
   git commit -m "Initial commit: Personal website"
   git push origin main
   ```

2. Enable GitHub Pages:
   - Go to repository Settings → Pages
   - Source: Deploy from branch `main`, folder `/ (root)`
   - Wait 2-3 minutes for deployment

3. Visit: `https://[your-username].github.io`

## 📝 Updating Content

See [UPDATES.md](UPDATES.md) for detailed instructions on:
- Updating your CV
- Adding new publications
- Refreshing Strava data
- Modifying personal information

## 🗂️ File Structure

```
.
├── index.html              # Home page
├── research.html           # Publications
├── cv.html                 # CV viewer
├── running.html            # Running map
├── assets/
│   ├── css/
│   │   ├── main.css       # Core styles
│   │   └── responsive.css # Mobile styles
│   ├── js/
│   │   ├── strava-auth.js # OAuth flow
│   │   ├── strava-data.js # API calls
│   │   └── map.js         # Map rendering
│   ├── images/            # Photos, icons
│   ├── cv/                # Resume PDFs
│   └── papers/            # Publication PDFs
├── .gitignore
├── README.md              # This file
└── UPDATES.md             # Update instructions
```

## 🔧 Local Development

To test locally:

```bash
# Python 3
python -m http.server 8000

# Or Python 2
python -m SimpleHTTPServer 8000

# Then visit: http://localhost:8000
```

**Note**: Strava OAuth redirect must be updated to `localhost:8000/running.html` for local testing.

## 🔐 Privacy & Security

- **Strava Data**: Stored only in your browser's localStorage, never sent to any server
- **No Analytics**: No tracking or analytics by default
- **HTTPS Only**: GitHub Pages enforces HTTPS

## 📄 License

Content © 2025 Thanathorn Sukprasert. All rights reserved.
Code licensed under MIT License.

## 🐛 Issues & Support

For issues or questions:
- Check [UPDATES.md](UPDATES.md) for common tasks
- Review browser console for errors
- Verify Strava API configuration

## 🙏 Acknowledgments

- [Leaflet](https://leafletjs.com/) for mapping
- [OpenStreetMap](https://www.openstreetmap.org/) for tiles
- [Strava](https://www.strava.com/) for activity data
- [GitHub Pages](https://pages.github.com/) for hosting
