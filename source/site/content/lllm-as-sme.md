---
title: "LLM as SME"
description: "While an LLM can't replace a truly knowledgeable human, its a better tool than not having an SME at all."
keywords: "technical writing, documentation, research, process, AI, LLM"
date: "2025-09-25"
tags: [technical writing, research, LLM]
---

# LLM as SME

tl;dr: skip to [Example workflow](#example-workflow).

Interacting with subject matter experts (SMEs) is a primary responsibility for most technical writers. Even if you happen to be an SME in a product or domain, you should have another SME validate your information and review documentation you write.

SME roles can range from product manager to customer support to CEO. Unfortunately, many SMEs are often in demand and have little time for reviewing documentation, even it's important to them. This can create a bottleneck in your documentation processes, as you might be blocked until you can get specific information from an SME.

This is an area where LLMs can streamline your documentation authoring process. You can feed them project docs that project managers and engineers create and have them simulate being an SME. Specifically, Google's NotebookLM is great at this.

There are limitations and you should still get reviews from real, human, SMEs. However, NotebookLM can get you most of the way there - especially if your SMEs aren't often available to answer questions.

In this post, I'll talk about:

- [What NotebookLM can do](#what-notebooklm-can-do)
- [What NotebookLM can't do](#what-notebooklm-cant-do)
- [Why I like it](#why-i-like-notebooklm)

I'll also provide an [example workflow](#example-workflow) that you can adapt to your process.

> [!CAUTION]
> Before you start using NotebookLM or any other LLM or AI tool, you should make sure that you won't be breaking any company policies. Even if NotebookLM is allowed by company policy, you may need to look closely and the various level of confidentiality the policy defines. Your company may determine that certain types of documents should not be used with AI tools.

## NotebookLM set up for this post

I created a notebook to show a real example of how this all can come together. This notebook is not for a real project at MongoDB and is meant only for demonstration purposes. The notebook is centered around Field-Level Encryption for MongoDB.

### Sources

Sources are the most important part of setting up a notebook. The quality and content do much to inform the quality of the responses NotebookLM will give you. For this demonstration, I included some technical articles from non-MongoDB authors. I also included most of the MongoDB documentation for Field-Level Encryption.

### Access

The demonstration notebook is public and anyone should be able to access it. All sources and information are public. If you would like to see the notebook, follow this link: https://notebooklm.google.com/notebook/4d865419-ac0f-4bd7-bb03-8692efc8dd01.

### A note on LLM prompting

I don't claim to be an expert on LLM prompts and getting them to provide the best output. The examples I provide in this post should be considered as starting points.

## What NotebookLM can do

When NotebookLM has access to enough resources related to your project, it can synthesize information and create some useful artefacts.

> [!IMPORTANT]
> Never trust and always verify LLM output.

### Simulate an SME

I can't emphasize enough that getting a human SME to review your documentation is important. However, sometimes you need to make progress and can't wait on others. And SMEs tend to be more helpful when they have something to react to rather than answering a smattering of questions.

NotebookLM can simulate an SME. Prompt it to take on a specific role. Then ask it your questions about the product or project you're working on. The answers may not be completely accurate because LLMs are probabilistic. You should never trust and always verify LLM output. However, NotebookLM generally gets close enough to give you something real to work with.

Say I'm curious about using field-level encryption in an embedded system, I can ask the notebook LLM

Prompt:

```
Is it possible to use field level encryption in embedded systems? Please keep your response as concise as possible.
```

The LLM highlighted a potential area of improvement for the documentation. This response would give a great starting place for a conversation with a human SME.

Response:

```
Based on the sources provided, it is not explicitly stated whether MongoDB's Client-Side Field Level Encryption (CSFLE) can be used in embedded systems.

The documentation describes using CSFLE in client applications, such as web applications or server-side code, which then connect to a MongoDB database. The installation requirements mention standard operating systems and dependencies like the Automatic Encryption Shared Library, which might pose challenges for resource-constrained embedded environments.

While one use case mentioned is "Edge and Mobile," the details provided focus on securing data in standard client-server architectures and do not elaborate on implementation within typical embedded systems.
```

### Generate timelines

// TODO: add image

Understanding the history of a project is sometimes just as important as understanding its current state. NotebookLM is excellent at creating a historical timeline of events based on the information available in your sources. You need to prompt the LLM to do this, as there aren't any dedicated timeline tools.

Prompt:

```
Create a detailed timeline of the main events covered in these sources, followed by a cast of characters listing the principle people mentioned in the sources, with brief bios for each.
```

The timeline is a little contrived due to the nature of this notebook and its sources. However, it still provides an intriguing view into the history of field level encryption.

Truncated response:

```
*   **Circa 1990**: Guy Harrison, working as an Oracle DBA, notes that database information was stored in plain text, making it vulnerable to anyone with read access to the database files.
*   **MongoDB Version 3.2**: MongoDB introduces support for "encryption at rest" and "encryption in transit" (TLS/SSL). Encryption at rest prevents attackers from reading data directly from disk files, while encryption in transit secures data moving between the client and server.
*   **June 20, 2019**: MongoDB announces version 4.2, introducing Client-Side Field Level Encryption (CSFLE) as a primary new feature. This feature was developed with guidance from third-party cryptography experts from academia and industry.
```

### Generate outlines

// TODO: add image

Many people suffer from blank page syndrome and struggle to get the first words on a page. NotebookLM can help you overcome this by generating outlines for you. In your prompt, explain at a high level what your goal is and highlight important concepts. Then ask NotebookLM to create an outline.

Prompt:

```
I want to create a new tutorial page for field level encryption that's aimed at early career developers who are new to MongoDB and databases in general. This tutorial will need to explain basic concepts more often than one meant for more experienced developers. Please generate an outline for this tutorial page.
```

The LLM responded with a large 6 part outline that I will not include here. Instead, you can see the first part below. This is a great starting point, even if it is to say "well, that's not where I would begin". It's enough to get the creative side of the brain running.

In your prompt, you can specify how verbose you would like the outline to be.

Truncated response:

```
#### **Part 1: Introduction - What is Field-Level Encryption and Why Use It?**

*   **1.1. Welcome to Data Security in MongoDB**
    *   Brief, encouraging introduction to the importance of data security, especially for sensitive user information.
    *   Introduce the concept of protecting data at multiple levels: on disk (at rest), over the network (in transit), and while it's being used (in-use).

*   **1.2. What is Client-Side Field Level Encryption (CSFLE)?**
    *   **Core Concept:** Explain that CSFLE is a feature allowing your application (the "client") to encrypt specific fields in a document *before* sending them to the MongoDB database.
    *   **Analogy for Beginners:** Use an analogy like sending a valuable item in a locked box through the mail. The postal service (the database) can handle the box, but only you (the client application) have the key to open it. The database server never sees the unencrypted, sensitive data.
    *   **Key Benefit:** This approach means that sensitive data remains encrypted everywhere except within the authorized application—protecting it from database administrators, network snoops, or anyone with access to the server's memory or backup files.
```

### Create mind maps and concept explainers

When you're new to a project, product, or feature, it can be difficult to really understand what it's all about. What's the goal, how does it help users, what does it even do? I've found NotebookLM's mind map and concept explainers to be very helpful here. These built-in tools don't require any extra work from you, other than clicking a couple of buttons.

The mind map is interactive and as you click on concepts, the LLM explains them. The concept explainer does something similar, but puts the explanatory content in a document that you can reference later.

If you want to see the mind map and concept explainer, you can access them in my [demonstration notebook](https://notebooklm.google.com/notebook/4d865419-ac0f-4bd7-bb03-8692efc8dd01).

### Audit one or more documents

NotebookLM is an excellent tool for conducting a content audit - whether it's one document or 20 documents. For example, if a new feature is coming out and you want to figure out where you should mention the feature in your documentation, ask the robot to help you identify those places.

You could also provide NotebookLM with a style guide and ask it to audit one or more documents.

For example, I used the following prompt to generate a report called "Report: Strategic Enhancements for Client-Side Field Level Encryption (CSFLE) Documentation".

```
You are a product manager at MongoDB and and expert in field level encryption. Review the MongoDB documentation sources and identify areas of improvement. Specifically areas where we can edit or add documentation to highlight aspects of field level encryption that don't have much documentation coverage. Generate a report with your findings.
```

While the report is rather verbose, it does hit on some high-level improvements we could evaluate. If you want to see the report, you can access it in my [demonstration notebook](https://notebooklm.google.com/notebook/4d865419-ac0f-4bd7-bb03-8692efc8dd01).

## What NotebookLM can't do

While LLMs and AI tools like NotebookLM can be useful, they can't replace human reasoning. In order for these tools to be worthwhile, you need to do the hard parts for them: defining the problem space, specifying important connections, and planning the work to be done.
NotebookLM can't know what's important to you, your SMEs, or your audience because it can't know anything. You need to direct it.

There are some other things that NotebookLM can't do and you should now about:

- **Automate work in a repeatable way.** If you need repeatable and consistent results, you're better off having another AI tool help you write a program or simple script.
- **Pull in data from Google Sheets.** This is a major frustration for me. NotebookLM has no way to parse Google Sheets data. This would have been very useful to me in many situations.
- **Be 100% reliable.** As with all LLMs, you need to be careful and review everything NotebookLM gives you.

## Why I like NotebookLM

I've tried various LLM and AI tools. NotebookLM is one of the most useful for me because it helps me deal with ambiguity. There are a couple of specific reasons that I like the way NotebookLM, specifically, works:

- **Citing source.** NotebookLM cites its sources in a clear, clean way. This is important to me. It makes verifying the output significantly easier and reduces the odds that I let a hallucination get through.
- **Crafting context.** You can provide NotebookLM with a massive list of documents to provide it with context. Then, you can add and remove documents from that context at any time in a non-destructive way. This lets you create smaller contexts for specific questions without having to change to a completely different notebook or tool.
- **Multiple languages.** NotebookLM can parse many different written languages and generate responses and content in those languages.

## Example workflow

For NotebookLM to be useful, you need to give it access to as many resources as possible. Here's a workflow that works well for me:

1. [Define your scope](#define-your-scope)
2. [Gather sources](#gather-sources)
3. [Set expectations](#set-expectations)
4. [Interview the robot](#interview-the-robot)
5. [Give it something to react to](#give-it-something-to-react-to)

### Define your scope

Before you start uploading documents, be clear about what you're trying to accomplish. Are you writing a tutorial, updating existing documentation, or trying to understand a new feature? The clearer you are about your goals, the better you can curate your sources and craft your prompts.

For example, if you're documenting a new API endpoint, your scope might be: "Create comprehensive documentation for the new user authentication endpoint, including code examples for JavaScript and Python developers."

### Gather sources

This is the whole point of NotebookLM. Upload everything relevant you can find:

- **Product descriptions** or whatever document type your product managers use to define projects
- **Technical specifications and design documents** from engineers
- **Existing documentation** for related features
- **Support tickets and FAQs** that show common user pain points
- **Release notes** and changelogs for historical context
- **Third-party articles** or blog posts about similar features

The key is quality over quantity. A few well-chosen, comprehensive documents will serve you better than dozens of tangential ones.

### Set expectations

This step is important. You need to tell NotebookLM what role you want it to play. Don't immediately start asking questions. Establish the context first.

Try prompts like:

- "You are a senior product engineer who has worked on this feature for two years. Answer my questions from that perspective."
- "Act as a technical writing expert who specializes in API documentation. Help me identify gaps in our current docs."
- "You are a customer support specialist who deals with user questions about this feature daily."

This priming makes a difference in the quality and focus of the responses you'll get.

### Interview the robot

Now comes the fun part. Treat NotebookLM like you would an SME. Ask thoughtful, specific questions. But unlike human SMEs, the robot has infinite patience for your questions.

Start broad, then get specific:

- "What are the three most important things developers need to know about this feature?"
- "What are the most common implementation mistakes users make?"
- "How does this feature compare to similar offerings from competitors?"
- "What edge cases should I document?"

Don't be afraid to ask follow-up questions or challenge the responses. If something doesn't make sense, dig deeper.

### Give it something to react to

Just like real SMEs, NotebookLM reacts best when it has something concrete to work with. Once you've gathered initial information, create a rough draft. This could be an outline or only bullet points. Then ask NotebookLM to review it.

Try prompts like:

- "Here's my first draft of the getting started guide. What important information am I missing?"
- "Review this code example. Are there any errors or better practices I should show instead?"
- "I've outlined the main workflow. What steps would confuse a new user?"

This approach often surfaces insights you wouldn't get from direct questioning. The LLM can spot inconsistencies, suggest improvements, and identify gaps in your logic.

Remember: this workflow isn't meant to replace human SME review. It's meant to get you to a point where your human SMEs can provide more valuable, targeted feedback on a more complete draft rather than starting from scratch.
