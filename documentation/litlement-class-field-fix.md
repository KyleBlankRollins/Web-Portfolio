# LitElement Class Field Shadowing Fix

## Issue

When using LitElement with TypeScript decorators, class field initialization can shadow the reactive property accessors, preventing updates from triggering.

### Error Message

```
Uncaught (in promise) Error: The following properties on element admin-kanban-board
will not trigger updates as expected because they are set using class fields:
posts, loading, error, syncing.
```

## Root Cause

The issue is caused by TypeScript's `useDefineForClassFields` compiler option. When set to `true` (the default for ES2022+ targets), TypeScript uses `Object.defineProperty()` to define class fields, which overwrites LitElement's reactive property accessors.

LitElement uses property accessors (getters/setters) to detect changes. The `useDefineForClassFields: true` setting makes class fields shadow these accessors, breaking reactivity.

## Solution

**Change the tsconfig.json compiler option:**

```jsonc
{
  "compilerOptions": {
    "useDefineForClassFields": false // ✅ Required for LitElement
    // ... other options
  }
}
```

With this setting, you can use the simpler class field syntax:

```typescript
@state()
private loading = true;  // ✅ Now works correctly!
```

## Alternative Solution (Not Recommended)

If you can't change `useDefineForClassFields`, use the constructor pattern:

```typescript
@state()
private loading!: boolean;

constructor() {
  super();
  this.loading = true;
}
```

However, this is more verbose and the tsconfig fix is preferred.

## Pattern to Follow (With useDefineForClassFields: false)

### For `@state()` properties:

```typescript
@state()
private myState = false;  // ✅ Simple and clean
```

### For `@property()` with defaults:

```typescript
@property({ type: Array })
myProp: string[] = [];  // ✅ Works great
```

### For `@property()` without defaults (required props):

```typescript
@property({ type: String })
requiredProp!: string;  // ✅ Use ! for required props
```

## Why This Works

With `useDefineForClassFields: false`, TypeScript uses the older class field behavior that's compatible with decorators. The decorated properties are initialized on the prototype, not as own properties, allowing LitElement's accessors to work correctly.

## Impact on Other Code

This change affects how all class fields work in your TypeScript project:

- Class fields will be initialized on the prototype chain
- This is the behavior TypeScript had before version 3.7
- It's compatible with decorator-based frameworks like LitElement
- Most code won't notice the difference

## References

- [LitElement: Avoiding Class Field Shadowing](https://lit.dev/msg/class-field-shadowing)
- [TypeScript useDefineForClassFields](https://www.typescriptlang.org/tsconfig#useDefineForClassFields)
- [LitElement Reactive Properties](https://lit.dev/docs/components/properties/)
