# Web-Portfolio
This is a simple personal web portfolio. If you notice any issues, from grammar to browser display issues, submit a pull request and I'll see what I can do about it.

I needed to update my online presence and I wanted to mess around with new web tech. This site and others are the result.

## How it's built
This site is built with HTML, CSS, and Vue.js.

It's hosted by Netlify at http://www.KyleBlankRollins.com/ and deployed from the "prod" branch. As part of continuous delivery, any changes to "prod" will be reflected in the live site.

Some other branches are deployed alongside "prod."

## Repository structure
### Branches
* **prod.** This is the Master branch, and the branch Netlify uses to deploy. I don't do any development work here, as I want it to be stable.
* **dev.** Where the magic happens. Here, I sort out bugs and build new features for the main portfolio site. They get merged with "prod" as they're ready.
* **DoK-Compare.** This branch is deployed alongside prod as a subdomain. It's a Vue.js app that compares units from the RTS game Homeworld: Deserts of Kharak.
