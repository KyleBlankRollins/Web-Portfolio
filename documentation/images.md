# Blog image standard

How to capture, store, and optimize images for blog posts. `npm run images:check` enforces the parts marked **(checked)**.

## Where images go

Put a post's images in a `media/` folder in the post's directory:

```
__drafts/my-post/
├── my-post.md
└── media/
    └── ci-annotation.png
```

- A post with images must be a directory post. Move a standalone `my-post.md` into `my-post/my-post.md` first.
- The build copies `media/` to `/my-post/media/` when the post is published. Drafts are never copied.
- File names are lowercase kebab-case and say what the image shows, like `ci-annotation.png`, not `screenshot-2.png`. **(checked)**

## Formats

| Content                                       | Format |
| --------------------------------------------- | ------ |
| Screenshots, and anything with text or UI     | PNG    |
| Photos                                        | JPEG   |
| Diagrams drawn as vectors                     | SVG    |
| Short animations, when a still image won't do | GIF    |

Other formats fail the check. **(checked)** PNG stays lossless: lossy compression blurs small text, which is usually the point of a screenshot. WebP and AVIF aren't used yet; they're worth adding for photos, not screenshots.

## Capturing screenshots

- **Light color scheme.** Posts show images unchanged in both site themes, and the image style adds a border so a light screenshot keeps its edge.
- **2x device scale, about 1280 CSS pixels wide.** Text stays sharp on high-density screens.
- **Crop to what the reader needs.** The post column is about 740 CSS pixels wide, so a wide image shrinks its text. A crop with the important part and a little context reads better than a full window. PNGs are at most 1600 pixels wide. **(checked)**
- **Real output, not mock-ups.** Capture the actual tool. Use demo projects and throwaway repos, never real credentials, private repositories, personal email, or notifications.
- **Keep files small.** Images over 300 KB get a warning. **(checked)** A large screenshot usually needs a tighter crop.

## Using an image in a post

Use Markdown image syntax with a path relative to the post:

```markdown
![The pull request's changed include line, with the check failure beneath it](media/ci-annotation.png)
```

- The builder rewrites relative paths to the published URL, and a path that doesn't match a file in `media/` fails the build. A supplement uses `../media/...`.
- Raw HTML `<img>` tags aren't rewritten, so don't use them for media files.
- Every image has alt text. **(checked)** Describe what the reader should take from the image, including any text that matters, such as an error message. Don't start with "Screenshot of."

## Optimizing

Run the optimizer before committing images:

```bash
npm run images:optimize
```

It runs [oxipng](https://github.com/oxipng/oxipng) on every PNG in a `media/` folder, published and draft, in place and losslessly (`-o 4 --strip safe`), then runs the checks. Re-running it on optimized files changes nothing.

`npm run images:check` runs the same checks without changing files, and fails if a PNG could still be made more than 1% smaller.

oxipng must be on your `PATH`:

```bash
brew install oxipng
```
