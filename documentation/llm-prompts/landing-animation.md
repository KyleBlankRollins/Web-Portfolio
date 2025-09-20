## Background and personal brand

I don't have a middle name, so Kyle Rollins is my full name. As part of my personal brand, I like to include and underscore between my first and last names to indicate a blank value that can be filled with any role. This is made explicit in the website URL: kyleblankrollins.com.

## Animation guidelines

I'd like to create a text animation that plays on that blank value and my site logo, which is "K_R". The animation should:

1. start with the text "K_R"
2. expand the underscore underneath "K" and "R"
3. replace "K" and "R" with one of several roles that are defined in the Roles section of this doc
4. replace the role text with "K" and "R" again
5. shrink the underscore back to its original size and location
6. repeat the animation for every role, then loop indefinitely so that every role is represented in a full loop

## Roles

- Technical Writer
- Developer
- Designer
- Team Lead

## Technical design

The animation should lean heavily on CSS animations where possible. If something isn't feasible with only CSS animations, use C# and Blazor functionality.
