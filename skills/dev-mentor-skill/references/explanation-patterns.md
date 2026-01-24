# Code Explanation Patterns

## Standard Explanation Format

### For Code Blocks

```
[Introduction: Context and purpose - 1-2 sentences]

\`\`\`[language]
[code]
\`\`\`

**What this does:**
[High-level description of the code's purpose]

**How it works:**
- Line [X]: [explanation]
- Lines [X-Y]: [explanation]
- [pattern name]: [how it's applied here]

**Why this approach:**
- [Reason 1]
- [Reason 2]

**Alternatives considered:**
- [Alternative]: [why not chosen]
```

---

## Explanation Depth by Level

### Beginner Explanations

```javascript
// Creating a constant to store user data
const user = {
  name: "Alice",  // Property: stores the user's name
  age: 25         // Property: stores the user's age
};
```

**What this does:**
Creates a container (object) that holds information about a user.

**How it works:**
- `const`: A keyword that creates a variable that cannot be reassigned
- `user`: The name we give to this container
- `{ }`: Curly braces define an object (a collection of related data)
- `name: "Alice"`: A property with key "name" and value "Alice"
- `,`: Separates properties inside the object

**Why this approach:**
Objects group related data together. Instead of having separate variables for `userName` and `userAge`, we keep them organized in one place.

---

### Intermediate Explanations

```javascript
const fetchUser = async (id) => {
  try {
    const response = await fetch(`/api/users/${id}`);
    if (!response.ok) throw new Error('User not found');
    return await response.json();
  } catch (error) {
    console.error('Fetch failed:', error);
    throw error;
  }
};
```

**What this does:**
Retrieves user data from an API endpoint with error handling.

**How it works:**
- `async`: Marks the function as asynchronous, enabling `await`
- Template literal constructs the URL dynamically
- `await fetch()`: Pauses execution until the HTTP request completes
- `response.ok`: Boolean indicating success (status 200-299)
- Re-throwing the error allows calling code to handle it

**Why this approach:**
- `try/catch` provides centralized error handling
- Checking `response.ok` catches HTTP errors that `fetch` doesn't reject on
- Re-throwing maintains error propagation to callers

**Alternative:**
Using `.then()` chains instead of async/await. Chosen async/await for readability.

---

### Advanced Explanations

```javascript
const memoize = (fn) => {
  const cache = new Map();
  return (...args) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key);
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
};
```

**What this does:**
Higher-order function that adds caching to any pure function.

**How it works:**
- Closure captures `cache` Map in the returned function's scope
- `JSON.stringify(args)` creates a unique key from arguments
- Map provides O(1) lookup for cached results
- Rest/spread operators handle variable argument counts

**Why this approach:**
- Map over object: better performance, any value as key
- JSON.stringify: simple serialization, works for most primitive arguments

**Trade-offs:**
- Memory: cache grows unbounded (consider LRU for production)
- Limitations: doesn't work with non-serializable arguments (functions, circular refs)
- Assumption: function must be pure (same input → same output)

---

## Concept Introduction Pattern

When introducing a new concept:

1. **Name it**: "This pattern is called [X]"
2. **Define it**: One sentence definition
3. **Analogy**: Real-world comparison (if helpful)
4. **Show it**: Code example
5. **Explain it**: Break down the example
6. **Apply it**: How it solves the current problem
7. **Extend it**: When else to use this pattern

---

## Error Explanation Pattern

When learner encounters an error:

1. **Read the error**: Quote the exact message
2. **Translate it**: What it means in plain language
3. **Locate it**: Where in the code it originates
4. **Explain cause**: Why this error occurred
5. **Show fix**: The corrected code
6. **Prevent future**: How to avoid similar errors
