# Web-Portfolio
This is a simple personal web portfolio. If you notice any issues, from gramamr to browser display issues, submit a pull request and I'll see what I can do about it.

I needed to update my online presence and I wanted to mess around with CSS Grid. This site is the result.

## How it's built
From a technical standpoint, it's pretty basic: HTML, CSS, and some vanilla JavaScript. CSS Grid is the site's backbone.

Hosted by Netlify at http://www.rollinsky.com/ and deployed from the "prod" branch. As part of continuous delivery, any changes to "prod" will be reflected in the live site.

## Repository structure
### Branches
* **prod.** This is the Master branch, and the branch Netlify uses to deploy. I don't do any development work here, as I want it to be stable.
* **dev.** Where the magic happens. Here, I sort out bugs and build new features. They get merged with "prod" as they're ready.
* **Single-page.** I'll probably archive this branch at some point. It sprung off as an exploratory path and then became the main show. Active development should mostly happen in "dev". I know, capitalization isn't consistent with the other branches. I'll fix it. Maybe. Eventually.
