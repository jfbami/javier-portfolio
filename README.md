# Portfolio - Javier Fernandez-Budiman

A minimal, typographic personal portfolio. Plain HTML, CSS, and JavaScript with
no build step, so it deploys directly to GitHub Pages.

## Structure

```
index.html                       # landing: hero (name + About) and the project grid
projects.js                      # PROJECTS catalog - the single source of truth
main.js                          # renders the landing grid from projects.js
project.js                       # renders a case-study page from projects.js
styles.css                       # shared styles - strictly black-on-white, single typeface
starlight.html                   # one case-study shell per project; <body data-project-id>
jaguar.html                      #   pulls its content from projects.js
unet.html
intersection.html
sales.html
images/projects/                 # project preview images (placeholders to replace)
assets/                          # résumé PDF
.nojekyll                        # tells GitHub Pages to serve files as-is (no Jekyll build)
```

Everything - the landing grid and every case-study page - reads from the single
`PROJECTS` array in `projects.js`. The site is locked to a light (white) theme.

## Run locally

It's a static site - open `index.html` directly, or serve it:

```bash
python -m http.server 8000
# then visit http://localhost:8000
```

## Deploy to GitHub Pages

For a personal site at `https://<username>.github.io`, create a repository named
`<username>.github.io`, then:

```bash
git init
git add .
git commit -m "Initial portfolio"
git branch -M main
git remote add origin https://github.com/<username>/<username>.github.io.git
git push -u origin main
```

GitHub Pages publishes the `main` branch automatically within a minute or two.
For a project repo instead, enable Pages under **Settings → Pages → Source: main**.

## Adding or editing a project

Everything is driven by one object in the `PROJECTS` array (`projects.js`):

```js
{
  id, title, domain, teaser,
  image,                // images/projects/<file>  (replace the placeholder)
  url,                  // <id>.html case-study page
  status,               // "complete" | "in-progress"  (shows the In-Development badge)
  repo,                 // GitHub URL, or null
  facts: [{ label, value }],
  stack: [ ... ],
  caseStudy: {          // narrative sections - strings (paragraphs) or { list: [...] }
    context:     [ ... ],   // "Context & the Why"
    approach:    [ ... ],   // "Technical Approach & Design Choices"
    reflections: [ ... ],   // "Personal Reflections & Engineering Gaps"
  }
}
```

To add a project: drop its picture in `images/projects/`, append an object to the
array, and copy any `*.html` shell (e.g. `jaguar.html`) to `<id>.html`, changing
only `data-project-id` and the static `<title>`/meta tags. The grid card and the
full case-study page are generated automatically.

**Image placeholders:** the files in `images/projects/` are temporary - replace each
`placeholder-*.jpg` with your real photo (keep the filename, or update the `image`
field). Bio lives in the hero's `.hero-about` block; contact details are in `<footer>`.
