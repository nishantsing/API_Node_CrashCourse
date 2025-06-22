# Using Drizzle

- [Drizzle ORM Docs](https://orm.drizzle.team/docs/overview)
## Other ORMS
- prisma
- sequalize
- mongoose


#### Installations

- npm i drizzle-orm @neondatabase/serverless
- npm i -D drizzle-kit

#### DB Files

```js
src/db/schema.js

import { pgTable, serial, text, timestamp, integer } from "drizzle-orm/pg-core";

// Creating Favorites Table
export const favoritesTable = pgTable("favorites", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  recipeId: integer("recipe_id").notNull(),
  title: text("title").notNull(),
  image: text("image"),
  cookTime: text("cook_time"),
  servings: text("servings"),
  createdAt: timestamp("created_at").defaultNow(),
});

```

#### Using the Schema created above

```js
src/config/db.js

import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { ENV } from "./env.js";
import * as schema from "../db/schema.js";

const sql = neon(ENV.DATABASE_URL);
export const db = drizzle(sql, { schema });

// The DATABASE_URL you get from neon for postgress its similar to mongodb atlas for mongodb
```

#### Connecting local to remote neon

```js
drizzle.config.js

import { ENV } from "./src/config/env.js";

export default {
  schema: "./src/db/schema.js",
  out: "./src/db/migrations",
  dialect: "postgresql",
  dbCredentials: { url: ENV.DATABASE_URL },
};

// To generate migration
npx drizzle-kit generate

// migrate table to remote neon
npx drizzle-kit migrate

```
