# Resolute Agency website

A responsive, multi-page static website for Resolute Agency.

## Pages

- Home (`index.html`)
- About (`about.html`)
- Services (`services.html`)
- AI & Automation (`ai-automation.html`)
- Industries (`industries.html`)
- Our Work (`work.html`)
- Contact (`contact.html`)
- Consultation (`consultation.html`)
- Six service detail pages (`service-*.html`)

## Run locally

Open `index.html` in a browser, or serve this folder with any static file server. For example, from this folder run `python3 -m http.server 8000`, then open `http://localhost:8000`.

## Deploy

Upload the extracted `resolute_agency_website` folder to a static host such as Netlify Drop or Cloudflare Pages, or deploy it from a Git repository using Vercel or GitHub Pages. The folder containing `index.html` must be the published root.

## Recent refinements

- Added an animated, layered CSS 3D sphere and orbital rings to the homepage hero.
- Added a responsive binary-matrix canvas and scrolling “ATTRACT, ACCUMULATE, ASCEND.” statement to the final homepage visual.
- Improved mobile navigation, keyboard support, accessible labels, skip-to-content navigation, and active-page semantics.
- Added reduced-motion support and a fallback for browsers without IntersectionObserver.
- Hardened the canvas animation for high-density screens and background-tab visibility.
- Checked all 14 HTML pages for broken local asset/page links and duplicate IDs; checked JavaScript syntax.

## Contact forms — important

The Contact and Consultation forms currently validate in the browser and prepare a `mailto:` email to `agency.resolute@gmail.com`. They do not submit to or store data on a server. For reliable submissions, connect a form backend or hosted form service before launch. The consultation form is a request, not a confirmed calendar booking.

## Before public launch

- Connect and test a form backend or scheduling integration.
- Add a privacy policy and any required legal notices.
- Add a favicon and social sharing image.
- Connect the production domain and verify HTTPS.
- Test all pages on current iOS Safari, Android Chrome, and desktop browsers.
- Confirm analytics and cookie/privacy requirements for the regions you serve.

Google Fonts are loaded from Google Fonts when online; the site falls back to system fonts if the service is unavailable.
