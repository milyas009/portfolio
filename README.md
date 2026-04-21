# Portfolio Website Notes

This folder is a standalone git repository for the public portfolio site.

## Repository Mapping

- Local path: `My_CV/Job_Digital_Designer-Southeast_Asia/For_Portfolio/Portfolio_Website`
- Public remote: `git@github.com:milyas009/portfolio.git`
- Live site: `https://milyas009.github.io/portfolio/`

## Daily Update Workflow

1. Open this folder and edit files (`index.html`, `style.css`, `script.js`, assets).
2. Preview locally:
   - Quick open: `file:///.../Portfolio_Website/index.html`
   - Better preview:
     ```bash
     cd "/Volumes/D/pypsa-earth-simulations/PhD_Research_Work/My_CV/Job_Digital_Designer-Southeast_Asia/For_Portfolio/Portfolio_Website"
     python3 -m http.server 5500
     ```
     Then visit `http://localhost:5500`.
3. Check git status:
   ```bash
   git status
   ```
4. Stage and commit:
   ```bash
   git add .
   git commit -m "Describe what changed"
   ```
5. Push to public repo:
   ```bash
   git push origin main
   ```
6. Verify live site after GitHub Pages updates (usually 1-2 minutes).

## Safety Checks Before Push

- Confirm remote is correct:
  ```bash
  git remote -v
  ```
  Must be `git@github.com:milyas009/portfolio.git`.
- Keep test-only files out of commits (for example `test-stats.js`) unless intentionally needed.
- If push is rejected (`fetch first`), run:
  ```bash
  git pull --rebase origin main
  git push origin main
  ```

## Important Structure Note

- This `Portfolio_Website` repo is intentionally separate from the parent private repo (`PhD_Research_Work`).
- Private repo ignores this path, so portfolio changes should be committed and pushed from this folder's git repository.
