---
title: "Leading Through Change"
description: "What three team reinventions in three years taught me about leading people through uncertainty"
keywords: "leadership, management, technical writing, team building, change management"
date: "2026-07-06"
tags: ["leadership", "management", "career"]
---

In three years at MongoDB, my team has reinvented itself three times. The first two times, we didn't have much choice. This is the story of how we navigated that, and what I've learned about leading people through uncertainty.

## A deliberate regression

In October 2022, I moved from a Senior Technical Writer role at Netlify to a Technical Writer role at MongoDB. While that may look like a step backward, the reasoning was solid. My new role at MongoDB required substantially more programming knowledge and skills.

While I was a strong senior tech writer, my programming skills were not at a senior software engineer level. This new role was an opportunity to grow my programming and engineering skills. And I'm all about learning and growth. I was also excited to work with a larger group of technical writers. The MongoDB docs org had ~45 people when I joined, with the team I joined having 8 people.

My initial scope was limited to documenting the React Native SDK for Realm, a mobile database that was strongly integrated with MongoDB Atlas. It didn't take long before I increased my scope of work to the Node.js SDK, then the Go SDK. And some of the App Services, which was the platform that enabled the mobile database to integrate with Atlas.

## Leading before the title

Less than a year later, in July of 2023, 3 of the 8 people on my team (including my manager) pivoted their focus to creating a new AI chatbot. Chatbots were all the rage at this point in the AI timeline. Their project got a lot of traction and their old docs responsibilities fell to the 5 of us who remained on the team.

By December 2023, it was clear that we needed someone to step up and lead the team, as our official manager's attention was heavily divided and mostly focused on the chatbot project. My colleagues and I discussed it.

I was hesitant to attempt leading the team, as I had just over a year of experience at the company and the products we documented. But the more senior folks on the team weren't interested in being a people manager. And we didn't want someone from outside the team to come in and start telling us how to do our jobs. I had also been considering going into the management track for years by this point.

So, I began unofficially leading our team. Running team standups, setting strategy, and coordinating with stakeholders when there was any uncertainty. By January 2024, I had official buy-in from my leadership chain. But we had a small problem. I was still just a technical writer. Promoting directly from technical writer to lead technical writer (manager) wasn't actually possible due to HR processes.

That meant I first needed to be promoted to Senior Technical Writer, which happened in February 2024. This was a small step in the right direction. But there was still a lot of awkwardness because I couldn't actually handle performance reviews or other things that a people manager does. I didn't officially have the title and we all would have gotten into hot water with HR quickly if I tried to do those things.

This resulted in me working closely with my team to handle both strategic docs projects and the regular day-to-day work. While there was some weirdness and uncertainty, we managed to hit all of our docs deadlines despite the team having 3 fewer people but ever more work as engineers built new SDKs and tools that we needed to document.

I also began participating in strategic planning and initiatives that spanned the ~50-person docs org at MongoDB and building relationships with the other docs leaders and other folks up the management chain. This was still a bit awkward because I wasn't officially a docs team manager, merely on the track to becoming one.

In August 2024, I was finally promoted to Lead Technical Writer and could officially begin handling the people manager tasks. I redoubled my relationship-building efforts, with my direct reports, other docs leadership, and stakeholders. Things were looking really good. My team was already comfortable with me and they responded well to my leadership style for performance management and other people management tasks.

## Product EOLs

About 3 weeks later, in September 2024, I learned that MongoDB was deprecating every product (with one minor exception) that my team documented. I can't overstate how much of a blow this was. I didn't learn about it through my leadership chain, but from the product managers over that product area.

I had navigated my team through nearly a year of awkwardness and we had finally arrived at a good place with a good work cadence. I was building up strong relationships and we were settling in nicely as a team. And it felt like none of that mattered.

Thankfully, our jobs were not directly tied to these products. We reported up to the docs org director, who reported to the Education organization's VP. We didn't need to go looking for new jobs.

But we did need to figure out what we were going to do now that everything we had worked on in the past was going away. There was plenty of docs work to do related to EOL'ing a product. But not enough to keep a team occupied full time.

## Reinventing the team

Immediately after learning about the product deprecations, I found projects that other docs teams needed help with. I committed my team members to those projects for a couple of months. Due to the nature of the work we had done with Realm and App Services, we were all fairly technical at this point. We created apps and tests for the code examples we included in our docs. The projects I loaned my team members out to all dealt directly with code examples and testing, which the other docs teams didn't have as much experience with.

By January 2025, I had a good idea of what our team had to offer. We created a new team charter that focused on developer experience in the docs. The biggest aspect of this was useful code examples that were properly tested. And not the way that engineering teams test code. We focused on testing our code examples in ways that replicate how people actually interact with MongoDB's products. These are generally more akin to integration tests than unit tests.

In short, we took the things that only our team could do and figured out a way to scale that across the docs org instead of just our little piece of it. This took a lot of work. We needed to build robust tools that tech writers could use to create tested code examples. And cater to tech writers that weren't necessarily comfortable with code, let alone testing, which is yet another set of skills and knowledge.

In August 2025, this culminated in us launching a code example test platform that we named Grove. The philosophy behind Grove was to make creating tests for code examples as easy as possible, yet keeping enough friction to make code example contributors think carefully about what, exactly, each code example is trying to accomplish. I won't get into the details here, but the platform launched with support for 5 of the many MongoDB Drivers and we added support for `mongosh` shortly after.

In September 2025, Realm and App Services were officially EOL, though we couldn't stop supporting these products entirely. There were quite a few customers that had received extensions and we needed to keep the docs around for them. But by this point, our old products and ways of working were well and truly behind us - a small part of the work we were doing.

## Choosing the next shift

Once again, a year after we were thrown into chaos, we had settled into a good place. We had a good understanding of the problems we needed to solve and were moving along quickly. Then, in November 2025, we got sucked into the AI agent world. Specifically, we began the long process of figuring out how AI agents consume product documentation. And the role that product documentation serves in various types of AI tools.

The identity and work of the team began to shift again, but this time it was a voluntary and conscious decision. By January 2026, my team was established as AI tool experts, particularly with AI agents and skills. We began advising on many initiatives inside and outside of the docs org.

Our work was noticed. In April 2026, our team was moved to a new AI and Emerging Technology group. I can't talk too much about what this means. Partly because we're still figuring it all out. But our focus on AI agent experience, research, and testing gives us a particular set of skills that we can use in this space.

## What I learned

I'm still early in my career as a people manager. I don't pretend to have this all figured out, but these are the things that mattered for me when facing uncertainty in a leadership role.

### Lead before you have the title

Starting in December 2023, I ran standups, set strategy, and built relationships across the org months before I had any official authority to do so. It was a bit awkward. But doing the work of leading was necessary before anyone would have given me an official promotion to lead. The work of leading and the recognition of leading don't often arrive at the same time.

### Build relationships before you need them

I learned about the product deprecations from a product manager, not my leadership chain. That's not a criticism, but instead a reflection of the relationships I had built outside my immediate team. When I needed to quickly find loan projects for my team, relationships with other leaders made it possible. Relationships built under pressure feel transactional. Built early, they're genuine connections.

### Act immediately, plan later

Within days of the deprecation announcement, I had my team committed to loan projects for other docs teams. I didn't have a long-term plan. I had no idea what the team's future looked like. But finding something concrete for everyone to do kept the team moving and kept morale from totally collapsing while we figured out the rest. The charter and Grove came later.

### Know what makes your team irreplaceable

The reinvention worked because it wasn't a pivot to something entirely new. It was an amplification of what we already were. The technical depth we'd built documenting Realm and App Services became the foundation for a code example testing platform that served the whole docs org. When you're under pressure to change, it's worth looking inward before looking outward.

Some of the best advice I've received is to spend as much time as possible doing the things that only you can do. I think there's a corollary here for teams as a whole, though I haven't completely figured that out yet.

### Voluntary change feels different

The first two reinventions happened to us. The third one, we chose. The distinction between change that finds you and change you move toward matters. The team's energy going into the AI pivot felt different. We were ahead of the changes and not struggling to react to them.

## Personal reflections

From starting as a technical writer in October 2022 to today, my team has gone through at least 3 major reinventions of itself.

Part of me finds it amazing that my team stuck with me through it all. There were long periods of time where our future and the scope and nature of our work were very uncertain. I'm incredibly grateful for the competent, capable, thoughtful, and kind people who weathered every setback and held together even when the ground beneath us shifted.

Over the last ~2.5 years, I've had a crash course in leading a team through change. And navigating shifting priorities and political weirdness in the workplace. In many ways, I still feel like I have no idea what I'm doing. And it scares me that people willingly follow my lead. But I can confidently say that I at least understand how to lead my particular team through difficult times with compassion. Whether that's because of me, them, or a combination, I'm grateful that we've been able to learn and grow together. And do some really cool work along the way.

## Gratitude for the team

I've presented most of this article as things that I did, but the reality is that I wouldn't have been able to do half as much if the people I lead weren't so amazing. They were peers before I stepped into the manager role. Managing that transition is a whole other article.

But whatever success I have had as a leader is a direct result of the people on my team being competent, caring, and incredibly prolific. I am indebted to them and grateful for the opportunity to lead them through some wild changes over a relatively short period of time.

## Concise timeline

- **October 2022.** Join MongoDB as Technical Writer on the DevDocs team.
- **July 2023.** 3 of 8 team members (including manager) pivot to a new AI chatbot project.
- **December 2023.** Begin unofficially leading the team.
- **February 2024.** Promoted to Senior Technical Writer.
- **August 2024.** Promoted to Lead Technical Writer; officially take on people management.
- **September 2024.** MongoDB announces deprecation of every product the team documents.
- **January 2025.** Establish new team charter focused on developer experience and code example testing.
- **August 2025.** Launch Grove, a code example test platform.
- **September 2025.** App Services and Realm officially EOL'd.
- **November 2025.** Team shifts focus to how AI agents consume product documentation.
- **January 2026.** Team establishes itself as AI tool experts, advising on initiatives across the docs org.
- **April 2026.** Team moves to a new AI and Emerging Technology group.
