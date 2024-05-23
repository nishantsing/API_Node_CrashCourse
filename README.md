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

## REST API

- app.get('/api/v1/posts') - get all the posts
- app.post('/api/v1/posts') - create a new post
- app.get('/api/v1/posts/:id') - get a single post
- app.patch('/api/v1/posts/:id') - update post
- app.delete('/api/v1/posts/:id') - delete post


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

// node
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


//bun

import { serve } from 'bun'

serve({
    fetch(request){
        const url = new URL(request.url);
        if(url.pathname === '/'){
            return new Response('Hello World', {status: 200})
        }else if(url.pathname === '/ice-tea'){
            return new Response('Ice tea is a good option', {status: 200})
        }else{
            return new Response('404 Not found', {status: 404})
        }
    },
    port:3000,
    hostname:'127.0.0.1'
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

- dark mode(settings > Themes > Dark)
- create Collection (Post Manager)
- create new request(Get All Posts) and save to collection
- setting up global variable - 2 ways either set Environment as dev and there set the variable or click on eye and set variable
URL http://localhost:5000/api/v1
{{URL}}/posts
- and do the same for all the routes
body - raw -json

- Dynamically setting authorization Header
    - goto login user route in postman repeating same in register
    - In Tests tab
    ```js
    const jsonData = pm.response.json()
    pm.globals.set("accessToken", jsonData.token)

    ```
    - goto create job route in postman
    - In Authorization tab - Type Bearer instead of inherit - Token - {{accessToken}}
    

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

const {getAllPosts, createPost, getPost, updatePost, deletePost}= require('../controllers/postsController'); // getting controller method

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

// route chaining
// router.route('/').get(getAllPosts).post(createPost);
// router.route('/:id').get(getPost).patch(updatePost).delete(deletePost);

export default router
module.exports = router;

```

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

#### mongodb - ORM mongoose, sql - ORM sequelize, prisma(postgress), drizzle

- [Mongodb Atlas](https://www.mongodb.com/docs/atlas/getting-started/)
- Login - Create Cluster - Database Access(Add User) - Network Access(0.0.0.0/0) - Connect(connect your appplication - URI)
mongodb+srv://<username>:<password>@xarvis.dxmnjif.mongodb.net/<databasename>?retryWrites=true&w=majority&appName=Xarvis

- Collection - Database(Store) - Collection(Products)


- npm i mongoose
- create a new folder models and create file favYoutubeModel.js / Posts.js/ postModel.js
- create a new folder db for connection

```js
// models/favYoutubeModel
import {Schema, model} from "mongoose";

export interface IFavYoutubeVideosSchema {
    title: string;
    description: string;
    thumbnailUrl?: string;
    watched: boolean;
    youtuberName: string; 
}

const FavYoutubeVideoSchema = new Schema<IFavYoutubeVideosSchema>({ //PostSchema = new Schema({title: String, watched: Boolean})
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


const FavYoutubeVideosModel = model('fav-youtube-videos',FavYoutubeVideoSchema)// model('Post', PostSchema)
// model(<collectionName in singular>, <Schema>)
// when something is run on the edge you don't know whether this is the first time the calling of the schema or the schema is already made and we want to grab it.

export default FavYoutubeVideosModel


// db/connect

import mongoose from 'mongoose'

export default async function dbConnect(){
    // use try catch
    await mongoose.connect(String(process.env.MONGODB_URI)) // In URI take care os user pass and move to .env and change default databasename
    console.log("MongoDB Connected Successfully...")
}

// mongoose.connect().then(()=>console.log()).catch((err)=> )

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

// Post.create(req.body)

isValidObjectId(<id>)
const document = await FavYoutubeVideosModel.findById(<id>)
return c.json(document.toObject(), 200) // .toObject not required in case of express(it takes care internally)


FavYoutubeVideosModel.findByIdAndUpdate(<id>, <data>, {new: true})
return c.json(document?.toObject(), 200)

FavYoutubeVideosModel.findByIdAndDelete(<id>)

```

- if mongodb not connected then we don't want to start the server
```js
// db/connect
const dbConnect = (URI)=>[
    return mongoose.connect(URI) // returns a promise
]

// server

const start = async()=>{
    try{
        await dbConnect()
        app.listen(PORT, console.log())
    }catch(err){
        console.log(err)
    }
}

start()

```

## Hono (Aware library)
[Building backend with Hono, MongoDB and postman - by Hitesh](https://youtu.be/AcQm4x5dxeU)
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

## Task Management Simple API

[Node & Express Projects](https://youtu.be/qwfE7fSVaZM)

- public if static pages with minimal interaction
- views if template engine is used.


- app.get('/api/v1/tasks') - get all the tasks
- app.post('/api/v1/tasks') - create a new task
- app.get('/api/v1/tasks/:id') - get a single task
- app.patch('/api/v1/tasks/:id') - update task
- app.delete('/api/v1/tasks/:id') - delete task


- set basic routes and controllers and test them using postman
- then setup db connection and test connection

- only the properties mentioned in schema are set in database rest are ignored
- empty objects can be added in the collection so we need to apply some validations

[Mongoose Validation](https://mongoosejs.com/docs/validation.html)

```js
// Schema validators
name: {
        type: String,
        required:[true, 'must provide a name'],
        trim:true,
        minlength:3
        maxlength:[20,'name can not be more than 20 characters']
},
email:{
    match:[/<regex>/, 'Please provide a valid email'],
    unique:true,
}

```

- how to make try and catch block generic as we are going to use them in all controller functon
- how to show more precise error

- queries are not promise, its just for convinence.
[Mongoose Queries](https://mongoosejs.com/docs/queries.html)

- Task.find({})
- Task.create({})
- Task.findOne({_id:}) - always check whethere the task with the id exists
- findOneAndUpdate({_id:}, {}) - gets oldOne and doesn't run validator
- update options findOneAndUpdate({_id:}, req.body, {new:true, runValidators: true}) 
- Task.findOneAndDelete({_id:}) - always check whethere the task with the id exists

- To use static file
app.use(express.static('./public'))


#### Making API better

##### put vs patch
- put try to overwrite with the passed object
- update options findOneAndUpdate({_id:}, req.body, {new:true, runValidators: true, overwrite: true})

- patch trying to update the part of the object
- update options findOneAndUpdate({_id:}, req.body, {new:true, runValidators: true}) 

##### Different Response style
- res.status(200).json({tasks})
- res.status(200).json({tasks, amount:tasks.length})
- res.status(200).json({success:true, data:{tasks, nbHits:tasks.length}})
- res.status(200).json({status:'success', data:{tasks, nbHits:tasks.length}})

- stay consistent


##### Middlewares
###### Route Not Found
- setting custom 404 page.

```js
// middlewares/notFound

const notFound = (req,res)=>{
    res.status(404).send('Route does not exist')
}

module.exports = notFound

// server

const notFound = require("./middlewares/notFound.js");


app.use(notFound);

```

###### Async Wrappers for try and catch

```js
// middlewares/async
const asyncWrapper = (fn)=>{
    return async(req, res, next)=>{
        try{
            await fn(req, res, next)
        }catch(err){
            next(err) // handled by built in express handler but we can make our custom error handler
        }
    }
}

module.exports = asyncWrapper

// controllers/ taskController.js
const asyncWrapper = require('../middleware/async')

const getAllTasks = asyncWrapper(async (req, res) => {
    // try {
        const tasks = await Task.find({});
        res.status(200).json({ tasks });
    // // } catch (err) {
    //     res.status(500).json({ msg: err });
    // }
    // res.send("all tasks");
})

```
###### Catching Errors

```js
// middlewares/errorHandler
const errorHandler = (err, req, res, next)=>{
    return res.status(500).json({msg: err})
}

module.exports = errorHandler

// server

const errorHandler = require("./middlewares/errorHandler.js");
app.use(errorHandler);

```



###### 404 Custom Errors

```js

// errors/customError.js

class CustomError extends Error {
    constructor(message, statusCode) {
        super(message); // invokes constructor of parent class
        this.statusCode = statusCode;
    }
}

const createCustomError = (msg, statusCode) => {
    return new CustomAPIError(msg, statusCode);
};

module.exports = { createCustomError, CustomError };


// controllers/ taskController.js

const {createCustomError} = require('../errors/customError')
const getTask = asyncWrapper(async (req, res, next) => {
   
        const { id: taskID } = req.params;
        const task = await Task.findOne({ _id: taskID });
        if (!task) {
            return next(createCustomError(`No task with id: ${taskID}`, 404));
        }
        res.status(200).json({ task });
});

// middlewares/errorHandler
const { CustomError } = require("../errors/customError");

const errorHandler = (err, req, res, next) => {
    if (err instanceof CustomError) {
        return res.status(err.statusCode).json({ msg: err.message });
    }
    return res
        .status(500)
        .json({ msg: `Something went wrong, please try again` });
};

module.exports = errorHandler;
```

## Checklist to create node API
- Express SetUp
- Connect to database
- Controllers and Routes Setup
- Postman Setup
- express-async-errors

```js
// server
require('express-async-errors')

// controller/productController
const getAllProducts = async(req, res)=>{ // no need for try catch
    throw new Error('testing async errors')
}
```
- Schema models

```js
const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "product name must be provided"],
    },
    price: {
        type: Number,
        required: [true, "product price must be provided"],
    },
    featured: {
        type: Boolean,
        default: false,
    },
    rating: {
        type: Number,
        default: 4.5,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    company: {
        type: String,
        enum: {
            values: ["ikea", "liddy", "caressa", "marcos"],
            message: "{VALUE} is not supported",
        },
        // enum: ['ikea', 'liddy', 'caressa', 'marcos'],
    },
});

module.exports = mongoose.model("Product", ProductSchema);
```
- Automating adding to database
```js
// product.json which will have data

// populate.js to add data from product.json to database
require("dotenv").config();

const connectDB = require("./db/connect");
const Product = require("./models/productModel");

const jsonProducts = require("./products.json");

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI);
        await Product.deleteMany();
        await Product.create(jsonProducts);
        console.log("Success!!!!");
        process.exit(0);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

start();

```
## Extra Opertions in mongoose

### Mongoose Filter Methods

- Product.deleteMany()
- Product.find({})
- Product.create(jsonProducts) //Array of product objects

// Hard Coded filter values
- Product.find({ featured: true, price:{ $gt:30} }).sort('-name price').select('name price featured').limit(4).skip(1);
res.status(200).json({ products, nbHits: products.length });

- Product.find({ name: 'vase table' });

// Filtering values based on request

#### query params

```js

//{{URL}}/products?name=john&featured=true

const products = await Product.find(req.query);
res.status(200).json({ products, nbHits: products.length });

```
- if we pass something which property doesn't exist in schema

```js
// pulling out only the values that you require
const {featured, company, name} = req.query
const queryObject = {}
if(featured){
    queryObject.featured = featured === 'true'? true: false
}
if(company){
    queryObject.company = company
}
if(name){
    queryObject.name = { $regex: name, $options:'i'} // regex setup
}
const products = await Product.find(queryObject);

```
### Mongoose sort filter

```js
//{{URL}}/products?sort=-name,price
const {featured, company, name, sort} = req.query

let query = Product.find(queryObject); // we cant await as we want to chain sort with the query
if(sort){
    const sortList = sort.split(',').join(' ');
    query = query.sort(sortList);
}else{
     query = query.sort('createAt');
}

const products = await query
```
### Mongoose select filter

```js
//{{URL}}/products?sort=-name,price
const {featured, company, name, sort, select} = req.query

let query = Product.find(queryObject); // we cant await as we want to chain sort with the query

//select
if(select){
    const selectList = select.split(',').join(' ');
    query = query.select(selectList);
}
const products = await query
```

### Mongoose skip and limit filter

```js
//{{URL}}/products?sort=-name,price&limit=10&page=2
const {featured, company, name, sort, select} = req.query

const page = Number(req.query.page) || 1
const limit = Number(req.query.limit) || 10

const skip = (page -1) * limit;

query = query.skip(skip).limit(limit)
//23
//4 7 7 7 2

```

### Mongoose numeric filter
```js
//{{URL}}/products?numericFilters=price>40,ratings>=4
const {featured, company, name, sort, select, numberFilters} = req.query

if(numberFilters){
    const operatorMap = {
        '>':'$gt',
        '>=':'$gte',
        '=':'$eq',
        '<':'$lt',
        '<=':'$lte',
    }
    const regEX = /\b(<|>|>=|=|<|<=)\b/g
    let filters = numberFilters.replace(regEx, (match)=>`-${operatorMap[match]}-`);
    const options = ['price', 'rating'];
    filters = filters.split(',').forEach((item=>{
        const [field, operator, value] = items.split('-')
        if(options.include(field)){
            queryObject[field] = {[operator]:Number(value)}
        }
    }))

}

```

## JWTBasics

- jsonwebtoken npm package

### Postman Setup
### Jsonwebtoken Explanation and Setup

[JWT Introduction](https://jwt.io/introduction)
[JWT Debugger](https://jwt.io/#debugger-io)
- In login route create the token

```js
// inside login route
// try to keep payload small, better experience for user
  // just for demo, in production use long, complex and unguessable string value!!!!!!!!!
  const token = jwt.sign({ id, username }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  })

```
### authorization header setup
- once you access the login route you get the secret token add it to the autorization header of dashboard route.

### auth middleware
- In middleware which can be used in every route we extract the token from req.headers.authorization

```js
const authenticationMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new UnauthenticatedError('No token provided')
  }

  const token = authHeader.split(' ')[1]

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const { id, username } = decoded
    req.user = { id, username }
    next()
  } catch (error) {
    throw new UnauthenticatedError('Not authorized to access this route')
  }
}

// routes/main
router.route('/dashboard').get(authMiddleware, dashboard) // adding auth middleware for the route
```

### Creating Admin Auth Middleware


```js
const adminAuthMiddleware = async (req, res, next)=>{
    const userId = req.user // coming from the auth middleware
    const user = await User.findById(userId);

    if(!user.isAdmin){// isAdmin a property of User Schema
        return res.status(404).send({message: 'Not Authorized' })
    } 
    next();

}

// routes/main
router.route('/dashboard').get(authMiddleware, adminAuthMiddleware, dashboard) // Now only the admin can access the dashboard route

```

### Error Handler Middleware

```js
// middleware/error-handler
const { CustomAPIError } = require('../errors')
const { StatusCodes } = require('http-status-codes')
const errorHandlerMiddleware = (err, req, res, next) => {
  if (err instanceof CustomAPIError) {
    return res.status(err.statusCode).json({ msg: err.message })
  }
  return res
    .status(StatusCodes.INTERNAL_SERVER_ERROR)
    .send('Something went wrong try again later')
}

module.exports = errorHandlerMiddleware

// middleware/not-found.js

const notFound = (req, res) => res.status(404).send('Route does not exist')

module.exports = notFound


// app.js
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);


```


### Status codes
- npm library for status codes -  http-status-codes

### Handling Errors

```js

// errors/custom-error
class CustomAPIError extends Error {
  constructor(message) {
    super(message)
  }
}

module.exports = CustomAPIError


// errors/bad-request
const CustomAPIError = require('./custom-error')
const { StatusCodes } = require('http-status-codes')
class BadRequest extends CustomAPIError {
  constructor(message) {
    super(message)
    this.statusCode = StatusCodes.BAD_REQUEST
  }
}
module.exports = BadRequest


// errors/unauthenticated
const CustomAPIError = require('./custom-error')
const { StatusCodes } = require('http-status-codes')

class UnauthenticatedError extends CustomAPIError {
  constructor(message) {
    super(message)
    this.statusCode = StatusCodes.UNAUTHORIZED
  }
}

module.exports = UnauthenticatedError


// controller or middleware
throw new BadRequestError('Please provide email and password')
throw new UnauthenticatedError("No token provided");

```

### Notes

- No cors required if you are triggering the public files using the express server itself because the origin is same but if you try to host them using vscode live server, you might face some cors issue because you will need to run them on different ports which is different origin.
which can be easily fixed using the npm package cors

```js
const cors = require('cors')
app.use(cors())
```
- Changing the URL path for static files
app.use('/static',express.static("./public")); 


## Heroku Deployment (Vercel, Netlify, Firebase Hosting, AWS Free tier, Render, Cyclic, Deta)


## Swagger API Documentation


## Github Page - Deploying your code
- only supports static file and doesnt support any server side languages
- SQLite
sql js

## Astro Starlight Documentation




## Creating a jobs API

### Database Connection

1. Import connect.js
2. Invoke in start()
3. Setup .env in the root
4. Add MONGO_URI with correct value

### Routers

- auth.js
- jobs.js

### User Model


- Email Validation Regex

```/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/```
```js
// schema
email:{
    match:[/<regex>/, 'Please provide a valid email'],
    unique:true,
}

```

### Register User

- Validate - name, email, password - with Mongoose
- Hash Password (with bcryptjs)
```js
// components/user.js
const register = async(req, res)=>{
    const { name, email, password} = req.body
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt)
    const tempUser = {name, email, password:hashedPassword} 
    const user = await User.create({...tempUser})
    res.status(201).json({user})
}
```


### Hashing can be refractored using mongoose internal middleware, these are different from the ones we create
```js
// model/ user.js
UserSchema.pre('save', async function(next){ // dont use arrow function due to "this" keyword scope
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(password, salt) // this in scope refers to the model
    // next() no need to use next as we are using async await
})

// components/user.js
const register = async(req, res)=>{
    const user = await User.create({...req.body})
    res.status(201).json({user})
}


```
- before any save call it will hash the password, so while creating as well it will do the same
- Save User
- Generate Token
### Schema instance method

```js

UserSchema.methods.getName = function(){
    return this.name
}

const user = await User.create({...req.body})
console.log(user.getName())


UserSchema.methods.createJWT = function(){
    return jwt.sign({userId:this._id, name:this._name}, 'jwtSecret',{expiresIn:'30d'})
}

const user = await User.create({...req.body})
const token = user.createJWT()
res.status(201).json({user:{name: user.name}, token})

```
- Send Response with Token

### Login User

- Validate - email, password - in controller
- If email or password is missing, throw BadRequestError
- Find User
- Compare Passwords

```js



UserSchema.methods.comparePassword = async function(candidatePassword){
    const isMatch = await bcrypt.compare(candidatePassword, this.password)
    return isMatch
}

const {email, password} = req.body
const user = await User.findOne({email})
const isPasswordCorrect = await user.comparePassword(password)

const token = user.createJWT()
res.status(200).json({user:{name:user.name}, token})
```
- If no user or password does not match, throw UnauthenticatedError
- If correct, generate Token
- Send Response with Token

- auth middleware

```js
const payload = jwt.verify(token,process.env.JWT_SECRET)

// Not using this because currently we don't have functionality to remove the user, if it was there we would have to do this way.
// const user = User.findById(payload.id).select('-password') // removes password column
// req.user = user

req.user = {userId: payload.userId, name:payload.name} // since token was created using id and name we can get it directly from the jwt token.
next()

```


```js
const authenticateUser = require('./middleware/authentication')

app.use('/api/v1/jobs', authenticateUser, jobsRouter)
```

### Joining 2 schemas (foreign key concept) | Tieing Job and User model
- In JobSchema
```js
JobSchema = mongoose.Schema({
    ...company, position, status...
    createdBy:{
    type:mongoose.Types.ObjectId,
    ref:'User', // model name - collection name
    required:[true, 'Please provide user']
    }
},{timestamps:true})

```

- using it in job controllers
```js
const createJob = async(req,res)=>{
    req.body.createdBy = req.user.userId // getting this from auth middleware
    const job = await Job.create(req.body)
    res.status(201).json({job})
}

// const {user:{userId}, params:{id:jobId}} = req
// In above code we are trying to get userId from user key and jobId from param key inside the req object and giving alias to the jobID as id

```

### Mongoose Errors

- Validation Errors
- Duplicate (Email)
- Cast Error

### Security

- helmet
- cors
- xss-clean
- express-rate-limit

### Swagger UI

```
/jobs/{id}:
  parameters:
    - in: path
      name: id
      schema:
        type: string
      required: true
      description: the job id
```