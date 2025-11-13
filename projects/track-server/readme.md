

## Installations
- bcrypt, express, jsonwebtoken, mongoose, nodemon, dotenv


## Setup DB conneciton / routes / schema

- mogoose is an ORM to connect to mongodb, you can directly use mongodb package as well


## res

- **res.send** - Sends a response of various types, including HTML, plain text, JSON, or buffers. It automatically sets the Content-Type header based on the type of data provided.
- Offers versatility in sending different data formats without explicit header setting.
```js

    res.send('Hello, world!'); // Sends plain text
    res.send({ message: 'Success' }); // Sends JSON
    res.send('<h1>Welcome</h1>'); // Sends HTML

```
- **res.render** - Renders a view template using a specified template engine (e.g., EJS, Pug, Handlebars) and sends the resulting HTML to the client.
- Designed for server-side rendering of dynamic web pages by combining data with a template.
```js

    res.render('index', { title: 'My App', data: someData });
```

- **res.json** - Sends a JSON response. It automatically sets the Content-Type header to application/json and converts the provided JavaScript object or array into a JSON string.
- Specifically tailored for sending JSON data, often used in API development. It also handles JSON.stringify options like json replacer and json spaces.
```js

    res.json({ name: 'Alice', age: 30 });
    res.json(['item1', 'item2']);
```
- **res.end** - Terminates the response process without sending any data, or sends a small piece of data and then terminates the response. It does not automatically set Content-Type or other headers.
-  A low-level method primarily used for manually controlling the response stream, especially when streaming large files or data chunks with res.write(). It requires manual header setting if needed.
 
```js

   res.end(); // Simply ends the response
    res.end('Some raw data'); // Sends raw data and ends
```

## 🚀 How to Deploy Your API for Free (2025 Guide)

If you’ve built a Node.js, Express, or similar backend, here are the best **free deployment options** available in 2025.

---

## 🧭 Summary — Best Free Hosting Options

| Platform              | Type                                    | Free Tier                  | Pros                                  | Limitations                   |
| --------------------- | --------------------------------------- | -------------------------- | ------------------------------------- | ----------------------------- |
| **Render**            | Full-stack (Node, Express, Flask, etc.) | ✅ Always Free              | Easy setup, auto HTTPS, GitHub deploy | Spins down after 15 mins idle |
| **Railway**           | Full-stack                              | ✅ Free tier (500 hours/mo) | Simple UI, instant deploy             | May sleep or stop after quota |
| **Deno Deploy**       | Edge runtime (JS/TS)                    | ✅ Free                     | Global low-latency edge network       | Limited Node APIs             |
| **Vercel**            | Frontend + serverless API routes        | ✅ Free                     | Great for Next.js apps                | 10s serverless timeout        |
| **Netlify Functions** | Serverless                              | ✅ Free                     | Fast for small APIs                   | Limited runtime               |
| **Glitch / Replit**   | Full-stack sandbox                      | ✅ Free                     | Great for testing                     | Sleeps on inactivity          |
| **Fly.io**            | Docker-based                            | ✅ Free allowance           | Full control                          | Slightly more setup           |

---

## 🏆 Recommended Option: **Render.com**

Render is the easiest and most reliable free hosting for typical Node.js APIs.

