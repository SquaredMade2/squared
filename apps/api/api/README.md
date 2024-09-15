# README for Route Generation

This project uses a script (`generate-index.ts`) to automatically generate an `index.ts` file that consolidates all API route handlers. This approach ensures that our routes are dynamically created based on the directory structure, maintaining consistency and reducing manual work.

## How It Works

The `generate-index.ts` script scans the directory structure for `index.ts` files, which are expected to define API route handlers. It generates a single `index.ts` file that imports these handlers and creates an Express router for them.

### Example Route Definition

Here's a basic example of how to define a route handler in your project:

```typescript
type Params = {
  id: string;
};

type Data = {
  id: string;
  name: string;
};

let dataStore: Record<string, Data> = {};

export function createRoute() {
  return {
    GET: async (params: Params) => {
      const { id } = params;
      const data = dataStore[id];
      if (!data) {
        throw new Error(`No data found for id: ${id}`);
      }
      return data;
    },

    PUT: async (params: Params, body: Data) => {
      const { id } = params;
      dataStore[id] = body;
      return body;
    },

    POST: async (params: Params, body: Data) => {
      const { id } = params;
      if (dataStore[id]) {
        throw new Error(`Data with id: ${id} already exists`);
      }
      dataStore[id] = body;
      return body;
    },

    DELETE: async (params: Params) => {
      const { id } = params;
      const data = dataStore[id];
      if (!data) {
        throw new Error(`No data found for id: ${id}`);
      }
      delete dataStore[id];
      return data;
    },
  };
}
```

### How to Use

1. **Define Routes:**
   Place your route handler files in appropriate directories within your project. For example, you might place the above route definition in `api/data/[id]/index.ts`.

2. **Run the Generator:**
   Use the following command to generate the consolidated `index.ts` file:

   ```bash
   pnpm --filter=api2 gen
   ```

3. **Start the Server:**
   Start your Express server normally:

   ```bash
   pnpm --filter=api2 start
   ```

The generated `index.ts` will automatically import your route handlers and set up the Express router accordingly.

---

This README example provides a clear guide for your coworkers to define and use route handlers in the project. It demonstrates the basic GET, PUT, POST, DELETE routes and explains the steps to integrate them with the `generate-index.ts` script.
