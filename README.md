# Node Crash Course

[Node Crash Course by Traversy Media](https://youtu.be/32M1al-Y6Ag)
[Paid - Node.js API Masterclass by Traversy](https://www.udemy.com/course/nodejs-api-masterclass/)
- Node is a runntime engine that runs js.
- V8 Js Engine(build in C++)
- Non-Blocking I/O operations(file system, database, computations)
- Single Threaded
- Event Loop, event queue(Intensive operation)
- APIs, server-rendered apps, serve html rendered dynamic pages(ejs mustache), real time applications(chat, games), microservices, command line tools, bots, web scraping, web servers

- Not good for CPU-intensive operations(heavy computations)
- other competitors(deno, bun)


```js
npm init -y
console.log(window) -> window is not defined
console.log(document) -> document is not defined
console.log(global)
console.log(process)

```

- setInterval, setTimeout, fetch they are not part of js, they are part of web API in the browser but also available in node js through global object.


### Commonjs Require

we can import functions, objects, arrays and other types of data.

```js
utils.js
module.exports = <name> // This is called default export.
module.exports = {<name1>, <name2>} // If you want to do multiple exports

index.js
const <name> = require('./utils') // don't have to do .js at the end
const {<name1>, <name2>} = require('./utils')

```


### ES Modules

- package.json add "type":"module"
- package.json modify  "scripts": {
    "start": "node server.js",
    "dev":"nodemon server.js",
    "dev_script": "npx nodemon server.js"

}

npm start
npm run dev

```js

postController.js
const posts = [
    {id:1, title:"Post One"},
    {id:2, title:"Post Two"}
]
export const getPosts = ()=> posts;
//or export multiple
export {getPosts};
//or export just default
export default getPosts
// or export default and other non default exports 
export const getPostsLength = ()=>posts.length;
export default getPosts


index.js
import { getPosts } from './postController.js' //currly brances needed as its not exported as default. (without .js extension gives error)
import getPosts from './postController.js' // importing default export, dont add currly braces
import getPosts, {getPostsLength} from './postController.js' // importing default and non default

import * as postController from './postController.js' // import all exports from postController and assign it to postContoller

postController.getPostsLength() or postController.getPosts()
```

### Node Modules

#### Internal Node modules

##### http (express, koa, fastify)
[Vanilla Node REST API | No Framework by Travvesry](https://youtu.be/_1xa8Bsho6A)

```js
import http from 'http'
const PORT = 5000;

const server = http.createServer((req,res)=>{
    // res.setHeader('Content-Type', 'text/html');
    // res.setHeader('Content-Type', 'text/plain');
    // res.statusCode = 404;
    res.writeHead(500, {'Content-Type', 'application/json'})
    res.write('Hello World!');
    //res.end('End'); // dont have responsibility to end or send header type or other stuff if using express
    // res.end('<h1>End</h1>'); 
    res.end(JSON.stringify({"message":"Server Error"}))
})



server.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})

```

###### req object 
- req.url
- req.method 

- To get data from req body
```js
    let body = "";
    // Listen for data
    req.on("data", (chunk) => {
        body += chunk.toString();
    });
    req.on("end", () => {
        const newUser = JSON.parse(body);
        users.push(newUser);
        res.statusCode = 201;
        res.write(JSON.stringify(newUser));
        res.end();
    });
```

```js
const server = http.createServer((req,res)=>{

    try{
        if(req.method === 'GET'){
            if(req.url === '/'){
                res.writeHead(200, {'Content-Type', 'text/html'})
                res.end('<h1>Homepage</h1>')
            } else if(req.url === '/about'){
                res.writeHead(200, {'Content-Type', 'text/html'})
                res.end('<h1>About</h1>')
            }else{
                res.writeHead(404, {'Content-Type', 'text/html'})
                res.end('<h1>Not Found</h1>')
            }
        }else{
            throw new Error('Method not allowed')
        }
    }catch(error){
        res.writeHead(500, {'Content-Type', 'text/plain'})
        res.end('Server Error')
    }
    
});

```
###### Loading files
- create a folder name public "index.html" and "about.html"

```js
import fs from 'fs/prmoises'
import url from 'url'
import path from 'path'

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename)

let filePath = path.join(__dirname, 'public', 'index.html')

const data = await fs.readFile(filePath);
res.setHeader('Content-Type', 'text/html')
res.write(data)
res.end()

```
if you are using common js import then you have some variables 
__filename, __dirname

##### External Node modules / npm modules

###### nodemon

npm i -D nodemon // installs as dev dependencies
- instead nodemon can use node built in functionality
node --watch server.js


###### gitignore file
- create a .gitignore file and add 
node_modules
.env
so that it is not pushed to github.


##### env file

- earlier we used to use dotenv npm package
require('dotenv').config() // import 'dotenv/config'
console.log(process.env)
- create .env file add it to .gitignore
PORT = 8080
--env-file =.env // works for node v(20.0)
nodemon --env-file =.env server.js

process.env.PORT

###### middleware
- A piece of code that can be added in the middle of a request or response.

```js
// Logger middleware
const logger = (req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
};
// JSON middleware
const jsonMiddleware = (req, res, next) => {
    res.setHeader("Content-Type", "application/json");
    next();
};
// Route handler for GET /api/users
const getUsersHandler = (req, res) => {
    res.write(JSON.stringify(users));
    res.end();
};
const server = createServer((req, res) => {
    logger(req, res, () => {
        jsonMiddleware(req, res, () => {
            if (req.url === "/api/users" && req.method === "GET") {
                getUsersHandler(req, res);
            }
        });
    });
});

```

###### postman


##### fs module
- There is a sync(blocks the execution) and async version. Most of the cases we would like to use async version and in async there is a callaback(default) and a promise version.

```js 
import fs from 'fs' // callback and sync version
import fs from 'fs/prmoises' // promise version

// readFile() - callback
fs.readFile('<filelocation>', 'utf8', (err, data)=>{
    if(err) throw err;
    console.log(data);
})

// readFile() - Promise .then() 

fs.readFile('<location>','<encoding>').then((data)=>{
    console.log(data)
}).catch((err)=>{
    console.log(err);
})

// readFile() - Promise async await

const readFile = async()=>{
    try{
        const data = await fs.readFile('<location>','<encoding>')
        console.log(data)
    }catch(err){
        console.log(err)
    }
}
readFile()


//readFileSync() - Synchronous 
const data = fs.readFileSync('<location>','<encoding>')


//writeFile() - override the content 
const writeFile = async()=>{
    try{
        await fs.writeFile('<location>','<content>')
        console.log('File written to...')
    }catch(err){
        console.log(err)
    }
}
writeFile()

// appendFile() - appends the content
const appendFile = async()=>{
    try{
        await fs.appendFile('<location>','\n<content>')
        console.log('File appended to...')
    }catch(err){
        console.log(err)
    }
}
appendFile()
```
- Task: using the file module create a logger file that is updated on logger middleware

##### path module

```js
import path from 'path';
import url from 'url'

const filePath = './dir1/dir2/test.txt';

path.basename(filePath) // text.txt
path.dirname(filePath) // ./dir1/dir2/
path.extname(filePath) // .txt
path.parse(filePath) // object with all of above
path.dirname(filePath)

const __filename = url.fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

path.join(__dirname, 'dir1', 'dir2','test.txt') // puts the correct delimeter according to OS.

path.resolve(__dirname, 'dir1', 'dir2','test.txt')
```
- Below 2 are available in case of commonjs path require
__filename
__dirname

##### os module

```js
import os from 'os'
os.userInfo()
os.totalmem()
os.freemem()
os.cpus()
```

##### url module

```js
import url from 'url'

const urlString = 'https://www.google.com/search?q=hello+world';

const urlObj = new URL(urlString);
url.format(urlObj)

// import.meta.url - file URL file:// 
url.fileURLToPath(import.meta.url);

const params = new URLSearchParams(urlObj.search)
params.get('q')
params.append('limit','5')
params.delete('limit')

```

##### crypto module

```js

import crypto from 'crypto'
 
// hashing before storing password
const hash = crypto.createHash('sha256');
hash.update('password1234')
hash.digest('hex')

// randomBytes
crypto.randomBytes(16, (err, buf)={
    if(err) throw err;
    console.log(buf.toString('hex'))
})

// createCipheriv & createDecipheriv
const algorithm = 'aes-256-cbc';
const key = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);

const cipher = crypto.createCipheriv(algorithm, key, iv);
let encrypted = cipher.update('Hello, this is a secret message', 'utf8', 'hex');
encrypted += cipher.final('hex');
console.log(encrypted);

const decipher = crypto.createDecipheriv(algorithm, key, iv);
let decrypted = decipher.update(encrypted, 'hex', 'utf8');
decrypted += decipher.final('utf8');
console.log(decrypted);

```

##### events module

```js
import { EventEmitter } from 'events';

const myEmitter = new EventEmitter();

function greetHandler(name) {
  console.log('Hello ' + name);
}

function goodbyeHandler(name) {
  console.log('Goodbye ' + name);
}

// Register event listeners
myEmitter.on('greet', greetHandler);
myEmitter.on('goodbye', goodbyeHandler);

// Emit events
myEmitter.emit('greet', 'John');
myEmitter.emit('goodbye', 'John');

// Error handling
myEmitter.on('error', (err) => {
  console.log('An Error Occured:', err);
});

// Simulate error
myEmitter.emit('error', new Error('Something went wrong'));
```

##### process argument
- To create CLIs
```js
// argv
process.argv;
process.argv[3];

// process.env
process.env.LOGNAME;

// pid
process.pid;

// cwd()
process.cwd();

// title
process.title;

// memoryUsage()
process.memoryUsage();

// update()
process.uptime();

process.on('exit', (code) => {
  console.log(`About to exit with code: ${code}`);
});

console.time('Start') // starts the label timer
console.timeLog('Start') // logs the label timer
console.timeEnd('Start') // ends and logs the label timer

// exit()
process.exit(0);

console.log('Hello from after exit'); // doesn't get logs

```


## Express Crash Course
[Express Crash Course by Traversy Media](https://youtu.be/CnH3kAXSrmU)

- opinionated(strict folder structure, offers a lot) - django, nestjs, adonis, ruby on rails, larvel, angular
- unopinionated(freedon, less features) - flask, express, react
- npm i express

```js
const express = require('express');

const app = express();

app.get('/',(req, res)=>{
    res.send('Hello') // we can send any type of data., html, json and we dont need to stringify json, express handles it internally

    res.json() // this can also be used for json data

    
})

app.listen(8000, ()=> console.log(`Server is running on port 8000`));

```

#### status code
res.status(200).json()

#### req params  
```js
app.get('/api/posts/:id', (req,res)=>{
    // req.params.id
    const id = parseInt(req.params.id)
    // res.json(posts.filter((post)=> post.id === id))

    const post = posts.find((post)=>post.id === id);
    if(!post){
        res.status(404).json({msg: ` A post with the id of ${id} was not found`});
    }else{
        res.status(200).json(post)
    }
})

```

#### req query(query strings)

http://localhost:8000/api/posts?limit=2&sort=desc
```js
app.get('/api/posts', (req,res)=>{
    // req.query
    const limit = parseInt(req.query.limit)
    if(!isNaN(limit) && limit > 0){
        return res.json(posts.slice(0, limit))
    }
    // else{
    //     res.json(posts)
    // }
    res.json(posts)
    

})

```


#### req body

```js
app.use(express.json())
app.use(express.urlencoded({extended: false}))

req.body // With plain node get buffer and had to turn it into string
```

- earlier to do this we used a npm package body-parser(middleware)
// Body-parser middleware
app.use(bodyparser.urlencoded({ extended: true }))
app.use(bodyparser.json())

req.body.email

#### route files

- create a folder routes, posts.js

```js
// server.js

const posts = require('./routes/posts')

// Routes
app.use('/api/posts', posts);

// posts.js

const express = require('express')
const router = express.Router();

router.get('/', (req,res)=>{
    // req.query
    const limit = parseInt(req.query.limit)
    if(!isNaN(limit) && limit > 0){
        return res.json(posts.slice(0, limit))
    }
    // else{
    //     res.json(posts)
    // }
    res.json(posts)
    

})

export default router
module.exports = router;

```

#### put vs patch

#### middleware in express
- fns that have access to req and res object, used for logging, authentication
- create middleware folder and create new file logger.js
```js
// logger.js
const logger = (req, res, next)=>{
    console.log(`${req.method} ${req.protocol}://${req.get('host')}${req.originalUrl}`)
    next();
}
export default logger;

const logger from './middleware/logger.js'
// router.js
// middleware added on route level
router.get('/', logger, (req,res)=>{
    // req.query
    const limit = parseInt(req.query.limit)
    if(!isNaN(limit) && limit > 0){
        return res.json(posts.slice(0, limit))
    }
    // else{
    //     res.json(posts)
    // }
    res.json(posts)
})

// server.js
// middleware added on app level
app.use(logger);

```

#### custom error handling in express

- Custom Error Handler
```js
// routes/posts.js
router.get('/:id', (req,res, next)=>{

    if(!post){
        const error = new Error(`A post with the id of ${id} was not found`)
        error.status = 404
        return next(error)
    }
    
})

// middleware/error.js
// due to err parameter it gets called as soon as new Error is called
const errorHandler = (err, req, res, next)=>{
    if(err.status){
        res.status(err.status).json({msg: err.message})
    }else{
        res.status(500).json({msg: err.message})
    }
    
}

export default errorHandler

// server.js
import errorHandler from './middleware/error.js'
app.use(errorHandler) // below routes

```

- Catch all error handler for not existing routes (overriding the default behaviour)

```js
// server.js
app.use('/api/posts', posts)
app.use((req,res,next)=>{
    const error = new Error('Not Found');
    error.status = 404;
    next(error)
})

```

#### Controller

- create a new folder controllers and file postController.js

```js
// controllers/postController.js

// @desc    Get single post
// @route   /api/posts
// @access  public
export const getPosts = (req,res, next)=>{
    // req.query
    const limit = parseInt(req.query.limit)
    if(!isNaN(limit) && limit > 0){
        return res.status(200).json(posts.slice(0, limit))
    }
    // else{
    //     res.json(posts)
    // }
    res.status(200).json(posts)
}


// routes/posts.js
import {getPosts} from '../controllers/postController.js'

router.get('/', getPosts)
```

#### __dirname workaround(as its not in ES module scope its there in common js module scope)


```js
import path from 'path'
import { fileURLToPath } from 'url'

// Get the directory name
const __filename = fileURLToPath(import.meta.url) // file://
const __dirname = path.dirname(__filename)


// setup static folder
app.use(express.static(path.join(__dirname, 'public')))

```

###### use try catch for async calls(database calls)

#### EJS Template Engine setup (handlebars)

- create folder views inside that create file index.ejs

```js
// server.js
app.set("view engine", "ejs")
app.set("views", path.join(__dirname))


app.get('/', (req,res)=>{
    // res.render('index'); // since we are using template engine
    res.render('index',{
        title: 'Welcome',
        message: 'Hello from EJS',
        people: ['John', 'Jane', 'Jack']
    });
})

// index.ejs
<%= title %>
<% people.forEach(person => {%>
<li><%= people %></li>
<%= }); %>
```

- Template partials
- inside views folder create another folder named partials and create file header.ejs

```html
<!-- header.ejs -->
<header> <h1>My Header</h1>   </header>

<!-- index.ejs -->
<%- include('partials/header.ejs') %>
```

- can also have layouts (explore further)

#### Colors package
- adds colors to console
npm i colors

```js
//logger.js

import colors from 'colors'

const methodColors = {
    GET: 'green',
    POST: 'blue',
    PUT: 'yellow',
    DELETE: 'red'
}

const color = methodColors[req.method] || white;

console.log(`${req.method} ${req.protocol}://${req.get('host')}${req.originalUrl}`[color])

```

#### If you want to load html file
- res.sendFile(path.join(__dirname, 'public', 'index.html'))
- express static middleware, we declare 1 of our folder to be static
app.use(express.static(path.join(__dirname, 'public')))
- Template engines which all to load html pages with dynamic data. 

```js
// View Engine Setup
app.set("views", path.join(__dirname))
app.set("view engine", "ejs")
```

#### mongodb - ORM mongoose, sql - ORM sequelize

- npm i mongoose
- create a new folder db and create file favYoutubeModel.js

```js
// db/favYoutubeModel
import {Schema, model} from "mongoose";

export interface IFavYoutubeVideosSchema {
    title: string;
    description: string;
    thumbnailUrl?: string;
    watched: boolean;
    youtuberName: string; 
}

const FavYoutubeVideoSchema = new Schema<IFavYoutubeVideosSchema>({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    thumbnailUrl: {
        type: String,
        required: false
        default: ""
    },
    watched: {
        type: Boolean,
        required: true
        default:false
    },
    youtuberName: {
        type: String,
        required: true
    },
})


const FavYoutubeVideosModel = model('fav-youtube-videos',FavYoutubeVideoSchema)

// when something is run on the edge you don't know whether this is the first time the calling of the schema or the schema is already made and we want to grab it.

export default FavYoutubeVideosModel


// db/connect

import mongoose from 'mongoose'

export default async function dbConnect(){
    await mongoose.connect(String(process.env.MONGODB_URI))
    console.log("MongoDB Connected Successfully...")
}

// server
import dbConnect from './db/connect'
import FavYoutubeVideosModel from './db/favYoutubeModel'

dbConnect()
.then(()=>{
    // GET List
    app.get('/', async(c)=>{
        const documents = await FavYoutubeVideosModel.find()
        return c.json(documents.map((d)=> d.toObject()), 200)
    })
})
.catch((err)=>{
    app.get('/*',(c)=>{
        return c.text(`Failed to connect mongodb: ${err.message}`)
    })
})

const favYoutubeVideosObj = new FavYoutubeVideosModel(formData)
await favYoutubeVideosObj.save()

isValidObjectId(<id>)
const document = await FavYoutubeVideosModel.findById(<id>)
return c.json(document.toObject(), 200) // .toObject not required in case of express(it takes care internally)


FavYoutubeVideosModel.findByIdAndUpdate(<id>, <data>, {new: true})
return c.json(document?.toObject(), 200)

FavYoutubeVideosModel.findByIdAndDelete(<id>)

```

## Hono (Aware library)

- streaming (LLM library)
- slightly differenct for all runtimes such as node, deno, bun, vercel, netlify...you can see more in [docs](https://hono.dev/top).

- terminal
npm create hono .
npm create hono <app_name>


```
npm install
npm i uuid / bun add uuid
npm run dev
```

```
open http://localhost:3000
```

- Basic server

```js
import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { poweredBy } from 'hono/powered-by'
import { logger } from 'hono/logger'


const app = new Hono()

// middlewares
app.use(poweredBy())
app.use(logger())

app.get('/', (c) => {
  return c.text('Hello Hono!')
  // c.html('<h1>Hello world</h1>')
})

app.onError((err, c )=>{
    return c.text(`App Error: ${err.message}`)
})

const port = 3000
console.log(`Server is running on port ${port}`)

serve({
  fetch: app.fetch,
  port
})



```
#### c context 
c.text()
c.html()
c.req.json() // getting body data passed by user
c.json() // for response dont need to mention anything

/video/:id
const {id} = c.req.param()


#### streaming
import {stream, streamText, streamSSE} from 'hono/streaming'

return streamText(c, async(stream)=>{
    for(const post of posts){
        await stream.writeln(JSON.stringify(post))

         // Wait 1 second.
        await stream.sleep(1000)
    }
})

- cloudflare and vercel have there AI so can try streaming on that.

