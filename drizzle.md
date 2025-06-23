# Using Drizzle

- [Drizzle ORM Docs](https://orm.drizzle.team/docs/overview)
## Other ORMS
- prisma
- sequalize
- mongoose

### When to use params or body

###### Use Query Params when:
- You are filtering, sorting, or searching for resources.
- You are using GET requests.
- The data is part of the URL.
- The values are non-sensitive (they will be visible in browser history and logs).

###### Use Request Body when:
- You are creating or updating a resource (POST, PUT, PATCH).
- You need to send structured data like JSON, arrays, or nested objects.
- The data should not be exposed in the URL (e.g., passwords).


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


#### Adding Routes
src/server.js
import express from "express";
import { ENV } from "./config/env.js";
import { db } from "./config/db.js";
import { favoritesTable } from "./db/schema.js";
import { and, eq } from "drizzle-orm";
import job from "./config/cron.js";

```js
app.post("/api/favorites", async (req, res) => {
  try {
    const { userId, recipeId, title, image, cookTime, servings } = req.body;

    if (!userId || !recipeId || !title) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newFavorite = await db
      .insert(favoritesTable)
      .values({
        userId,
        recipeId,
        title,
        image,
        cookTime,
        servings,
      })
      .returning();

    res.status(201).json(newFavorite[0]);
  } catch (error) {
    console.log("Error adding favorite", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.get("/api/favorites/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const userFavorites = await db
      .select()
      .from(favoritesTable)
      .where(eq(favoritesTable.userId, userId));
    // res.json(userFavorites); // - If no status passed by default its 200.
    res.status(200).json(userFavorites);
  } catch (error) {
    console.log("Error fetching the favorites", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.delete("/api/favorites/:userId/:recipeId", async (req, res) => {
  try {
    const { userId, recipeId } = req.params;

    await db
      .delete(favoritesTable)
      .where(
        and(eq(favoritesTable.userId, userId), eq(favoritesTable.recipeId, parseInt(recipeId)))
      );

    res.status(200).json({ message: "Favorite removed successfully" });
  } catch (error) {
    console.log("Error removing a favorite", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

```

#### Deploying API to render

- render free plan active for 15 mins
- we will use cron job, at every 14 mins we will send request.

```js
src/config/cron.js

import cron from "cron";
import https from "https";

const job = new cron.CronJob("*/14 * * * *", function () {
  https
    .get(process.env.API_URL, (res) => {
      if (res.statusCode === 200) console.log("GET request sent successfully");
      else console.log("GET request failed", res.statusCode);
    })
    .on("error", (e) => console.error("Error while sending request", e));
});

export default job;

// CRON JOB EXPLANATION:
// Cron jobs are scheduled tasks that run periodically at fixed intervals
// we want to send 1 GET request for every 14 minutes so that our api never gets inactive on Render.com

// How to define a "Schedule"?
// You define a schedule using a cron expression, which consists of 5 fields representing:

//! MINUTE, HOUR, DAY OF THE MONTH, MONTH, DAY OF THE WEEK

//? EXAMPLES && EXPLANATION:
//* 14 * * * * - Every 14 minutes
//* 0 0 * * 0 - At midnight on every Sunday
//* 30 3 15 * * - At 3:30 AM, on the 15th of every month
//* 0 0 1 1 * - At midnight, on January 1st
//* 0 * * * * - Every hour


src/server.js

import job from "./config/cron.js"

if(ENV.NODE_ENV === "production")job.start()
```
