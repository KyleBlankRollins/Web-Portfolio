---
title: "Syntax Highlighting Test"
description: "Testing Prism.js syntax highlighting integration"
keywords: "prism, syntax highlighting, code, test"
date: "2025-09-27"
tags: [test, code]
---

# Syntax Highlighting Test

This page tests the Prism.js syntax highlighting integration with various programming languages.

## JavaScript Example

```javascript
function greetUser(name) {
  const greeting = `Hello, ${name}!`;
  console.log(greeting);

  return {
    message: greeting,
    timestamp: new Date().toISOString(),
    user: name,
  };
}

// Usage example
const result = greetUser("World");
```

## TypeScript Example

```typescript
interface User {
  id: number;
  name: string;
  email: string;
  isActive: boolean;
}

class UserService {
  private users: User[] = [];

  async addUser(userData: Omit<User, "id">): Promise<User> {
    const newUser: User = {
      id: this.generateId(),
      ...userData,
    };

    this.users.push(newUser);
    return newUser;
  }

  private generateId(): number {
    return Math.max(...this.users.map((u) => u.id), 0) + 1;
  }
}
```

## CSS Example

```css
.syntax-highlight-demo {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 8px;
  padding: var(--space-lg);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1), 0 2px 8px rgba(0, 0, 0, 0.06);

  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.syntax-highlight-demo:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15), 0 4px 16px rgba(0, 0, 0, 0.08);
}

@media (prefers-color-scheme: dark) {
  .syntax-highlight-demo {
    background: linear-gradient(135deg, #2d3748 0%, #4a5568 100%);
  }
}
```

## JSON Example

```json
{
  "name": "kbr-portfolio",
  "version": "1.0.0",
  "scripts": {
    "build": "tsc && vite build",
    "dev": "vite"
  },
  "dependencies": {
    "lit": "^3.3.1",
    "marked": "^9.0.0",
    "prismjs": "^1.29.0"
  },
  "keywords": ["portfolio", "blog", "typescript", "lit"],
  "private": true
}
```

## Bash/Shell Example

```bash
#!/bin/bash

# Build and deploy script
set -e

echo "Starting build process..."

# Clean previous build
rm -rf dist/
mkdir -p dist/

# Install dependencies
npm ci

# Run build
npm run build

# Deploy to server
rsync -avz --delete dist/ user@server:/var/www/site/

echo "Deployment complete!"
```

## Python Example

```python
from typing import List, Optional
import datetime

class BlogPost:
    def __init__(self, title: str, content: str, tags: List[str]):
        self.title = title
        self.content = content
        self.tags = tags
        self.created_at = datetime.datetime.now()
        self.published = False

    def publish(self) -> None:
        """Publish the blog post"""
        if not self.title or not self.content:
            raise ValueError("Cannot publish post without title and content")

        self.published = True
        print(f"Published: {self.title}")

    def add_tag(self, tag: str) -> None:
        """Add a tag to the post"""
        if tag not in self.tags:
            self.tags.append(tag)

# Usage
post = BlogPost(
    title="My First Post",
    content="This is the content of my first blog post.",
    tags=["intro", "first-post"]
)

post.add_tag("python")
post.publish()
```

## Plain Text (No Highlighting)

```
This is plain text without any syntax highlighting.
It should appear in the default monospace font
without any special coloring or formatting.

This tests the fallback behavior when no language
is specified or when the language isn't supported.
```

## Test Summary

The above examples should demonstrate:

- ✅ **JavaScript**: Keywords, strings, functions, template literals
- ✅ **TypeScript**: Types, interfaces, classes, generics
- ✅ **CSS**: Properties, values, selectors, media queries
- ✅ **JSON**: Keys, values, syntax structure
- ✅ **Bash**: Commands, comments, variables
- ✅ **Python**: Keywords, types, classes, strings
- ✅ **Fallback**: Plain text when no language specified
