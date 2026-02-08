# Website Update Guide

This guide explains how to update different parts of your website. All updates follow the same basic pattern: edit files → commit → push to GitHub.

## 📋 Table of Contents

- [Updating Your CV](#updating-your-cv)
- [Adding a New Publication](#adding-a-new-publication)
- [Updating Personal Information](#updating-personal-information)
- [Refreshing Strava Data](#refreshing-strava-data)
- [Changing Profile Photo](#changing-profile-photo)
- [Git Commands Cheat Sheet](#git-commands-cheat-sheet)
- [Troubleshooting](#troubleshooting)

---

## 📄 Updating Your CV

The easiest update! Just replace the PDF file.

### Steps:

1. **Replace the PDF**:
   ```bash
   cp ~/Downloads/your_new_cv.pdf assets/cv/sukprasert_cv.pdf
   ```

2. **Commit and push**:
   ```bash
   git add assets/cv/sukprasert_cv.pdf
   git commit -m "Update CV - January 2025"
   git push
   ```

3. **Wait 2-3 minutes** for GitHub Pages to rebuild

4. **Verify**: Visit your CV page and hard refresh (Cmd+Shift+R on Mac, Ctrl+Shift+R on Windows)

### Tips:
- Keep filename as `sukprasert_cv.pdf` (or update references in cv.html)
- Recommended PDF size: < 5MB
- Optimize large PDFs at [iLovePDF](https://www.ilovepdf.com/compress_pdf)

---

## 📚 Adding a New Publication

Publications are stored in `research.html`. You'll copy an existing entry and update it.

### Steps:

1. **Open research.html** in your text editor

2. **Find an existing publication** (look for `<div class="publication">`)

3. **Copy the entire div**:
   ```html
   <div class="publication">
     <h3 class="pub-title">Your Paper Title Here</h3>
     <p class="pub-authors">
       <strong>Thanathorn Sukprasert</strong>, Co-Author Name
     </p>
     <p class="pub-venue">
       Conference Name (Short '25), Month Year
     </p>
     <div class="pub-links">
       <a href="assets/papers/yourpaper.pdf" target="_blank">PDF</a>
       <a href="assets/papers/yourpaper-slides.pdf" target="_blank">Slides</a>
       <a href="https://doi.org/YOUR_DOI" target="_blank">DOI</a>
     </div>
   </div>
   ```

4. **Update the content**:
   - Title
   - Authors (make your name bold with `<strong>`)
   - Venue and date
   - Links to PDF, slides, etc.

5. **Add your PDF/slides** to the `assets/papers/` folder:
   ```bash
   cp ~/Downloads/paper.pdf assets/papers/yourpaper.pdf
   ```

6. **Commit and push**:
   ```bash
   git add research.html assets/papers/yourpaper.pdf
   git commit -m "Add publication: Your Paper Title"
   git push
   ```

### Tips:
- Add newest publications at the **top** (reverse chronological order)
- Use consistent naming: `lastname-conference-year.pdf`
- Optional links: Poster, Video, Code, Dataset

---

## 👤 Updating Personal Information

Update bio, contact info, or research interests.

### Steps:

1. **For home page**: Edit `index.html`
   - Bio: Look for `<section id="about">`
   - Research interests: Look for `<section id="interests">`
   - Contact links: Look for `<div class="contact-links">`

2. **For research page**: Edit `research.html`
   - Add podcast appearances in `<section id="podcasts">`
   - Add talks in `<section id="talks">`

3. **Save and commit**:
   ```bash
   git add index.html
   git commit -m "Update bio and research interests"
   git push
   ```

### Common Updates:

**Change email address**:
```html
<!-- In index.html, find: -->
<a href="mailto:tsukprasert@umass.edu">✉ Email</a>

<!-- Update to: -->
<a href="mailto:newemail@example.com">✉ Email</a>
```

**Add a social link**:
```html
<div class="contact-links">
  <a href="mailto:tsukprasert@umass.edu">✉ Email</a>
  <a href="https://linkedin.com/in/yourprofile" target="_blank">💼 LinkedIn</a>
  <a href="https://twitter.com/yourusername" target="_blank">🐦 Twitter</a>  <!-- ADD THIS -->
</div>
```

---

## 🏃 Refreshing Strava Data

Strava activities are cached for 24 hours. To update immediately:

### Option 1: On the Website (Easiest)

1. Visit [your-site.com/running.html](https://tsukprasert.github.io/running.html)
2. Click **"🔄 Refresh Activities"** button
3. Wait a few seconds for new data to load

### Option 2: Clear Browser Cache

1. On the running page, open browser console (F12)
2. Type: `localStorage.clear()`
3. Refresh the page (F5)
4. Re-authenticate with Strava

### Auto-Refresh

Data automatically refreshes every 24 hours when you visit the page. No action needed!

---

## 🖼️ Changing Profile Photo

Replace your profile photo with a new one.

### Steps:

1. **Prepare your photo**:
   - Recommended: Square image (1:1 ratio)
   - Size: 300x300px to 1000x1000px
   - Format: JPG or PNG
   - File size: < 500KB

2. **Replace the file**:
   ```bash
   cp ~/Downloads/new_photo.jpg assets/images/profile.jpg
   ```

3. **Commit and push**:
   ```bash
   git add assets/images/profile.jpg
   git commit -m "Update profile photo"
   git push
   ```

### Tips:
- Use a professional headshot
- Optimize large images: [TinyPNG](https://tinypng.com/)
- Keep the same filename (`profile.jpg`) to avoid updating HTML

---

## 🔧 Git Commands Cheat Sheet

### Basic Workflow

```bash
# 1. Check what files you've changed
git status

# 2. See specific changes
git diff filename.html

# 3. Stage files for commit
git add filename.html          # Add specific file
git add .                      # Add all changed files

# 4. Commit with message
git commit -m "Descriptive message here"

# 5. Push to GitHub
git push

# 6. Check if you're up to date
git pull
```

### Undo Mistakes

```bash
# Undo changes to a file (before commit)
git checkout -- filename.html

# Undo last commit (keep changes)
git reset HEAD~1

# See commit history
git log --oneline
```

### Check Status

```bash
# See current branch and changes
git status

# See recent commits
git log --oneline -5

# See remote URL
git remote -v
```

---

## 🐛 Troubleshooting

### Problem: Changes not appearing on website

**Solution**:
1. Wait 2-3 minutes after pushing (GitHub Pages rebuild time)
2. Hard refresh browser: `Cmd + Shift + R` (Mac) or `Ctrl + Shift + R` (Windows)
3. Check GitHub Actions tab for build status
4. Clear browser cache completely

---

### Problem: PDF not displaying

**Causes**:
- Mobile browsers often don't support iframe PDFs
- File size too large
- Wrong file path

**Solutions**:
1. On mobile, use "Open in New Tab" button
2. Compress PDF if > 5MB: [iLovePDF](https://www.ilovepdf.com/compress_pdf)
3. Verify file path: `assets/cv/sukprasert_cv.pdf` (case-sensitive!)
4. Check browser console (F12) for errors

---

### Problem: Strava map not loading

**Causes**:
- Not authenticated with Strava
- Token expired (after 6 hours)
- API credentials not configured
- Browser blocking localStorage

**Solutions**:
1. Click "Connect Strava" and re-authenticate
2. Check browser console (F12) for errors
3. Verify Client ID is set in `assets/js/strava-auth.js`
4. Try in incognito mode to rule out extensions
5. Check Strava API status: [status.strava.com](https://status.strava.com)

---

### Problem: "Client ID not configured" error

**Solution**:
1. Edit `assets/js/strava-auth.js`
2. Replace `YOUR_CLIENT_ID_HERE` on line 10 with your actual Client ID
3. Get it from: [https://www.strava.com/settings/api](https://www.strava.com/settings/api)
4. Commit and push changes

---

### Problem: Git push asking for password repeatedly

**Solution** (Set up SSH key or token):

**Option 1: SSH Key** (Recommended)
```bash
# Generate SSH key
ssh-keygen -t ed25519 -C "your_email@example.com"

# Copy public key
cat ~/.ssh/id_ed25519.pub

# Add to GitHub: Settings → SSH and GPG keys → New SSH key
```

**Option 2: Personal Access Token**
```bash
# Generate token: GitHub Settings → Developer settings → Personal access tokens
# Use token as password when pushing
```

---

### Problem: Merge conflicts

If you edit files on multiple computers:

```bash
# Pull latest changes first
git pull

# If conflict occurs, edit the file to resolve
# Look for markers: <<<<<<<, =======, >>>>>>>

# After fixing, commit
git add conflicted_file.html
git commit -m "Resolve merge conflict"
git push
```

**Prevention**: Always `git pull` before starting work

---

## 📞 Need More Help?

- **Check browser console**: Press F12 and look at Console tab for errors
- **Verify file paths**: Paths are case-sensitive and relative to project root
- **Test locally**: Run `python -m http.server 8000` and test at localhost:8000

---

## 🎯 Quick Reference

| Task | Command |
|------|---------|
| Update CV | `cp new_cv.pdf assets/cv/sukprasert_cv.pdf` → commit → push |
| Add publication | Edit `research.html` → add PDF to `assets/papers/` → commit → push |
| Change photo | `cp new_photo.jpg assets/images/profile.jpg` → commit → push |
| Update bio | Edit `index.html` → commit → push |
| Refresh Strava | Click "Refresh Activities" button on website |
| Check status | `git status` |
| Push changes | `git add . && git commit -m "message" && git push` |

---

**Last updated**: January 2025
