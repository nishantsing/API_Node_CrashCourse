# Node Crash Course

[Node Crash Course by Traversy Media](https://youtu.be/32M1al-Y6Ag)
[Paid - Node.js API Masterclass by Traversy](https://www.udemy.com/course/nodejs-api-masterclass/)
[NodeJS Tutorial and Projects Course - John Smilga](https://www.udemy.com/course/nodejs-tutorial-and-projects-course/?couponCode=LETSLEARNNOWPP)

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

- npm package morgan can be used for logger
```js
const morgan = require("morgan");
app.use(morgan("tiny"));

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
- const task = Task.findOne({_id:}) - always check whethere the task with the id exists
- task.save() // triggers pre and post hooks so keep that in mind.
- findOneAndUpdate({_id:}, {}) - gets oldOne and doesn't run validator
- update options findOneAndUpdate({_id:}, req.body, {new:true, runValidators: true}) 
- Task.findOneAndDelete({_id:}) - always check whethere the task with the id exists
- Task.countDocuments({})

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

- declaring array of string in schema
```js
 colors: {
            type: [String],
            // default: ["#222"],
            required: true,
        },
```

- creating a schema for a property in some schema

```js
const { required } = require("joi");
const mongoose = require("mongoose");

const SingleOrderItemSchema = mongoose.Schema({
    name: { type: String, required: true },
    imgage: { type: String, required: true },
    price: { type: Number, required: true },
    amount: { type: Number, required: true },
    product: {
        type: mongoose.Schema.ObjectId,
        ref: "Product",
        required: true,
    },
});

const OrderSchema = mongoose.Schema(
    {
        tax: {
            type: Number,
            required: true,
        },
        shippingFee: {
            type: Number,
            required: true,
        },
        subtotal: {
            type: Number,
            required: true,
        },
        total: {
            type: Number,
            required: true,
        },
        orderItems: [SingleOrderItemSchema],
        status: {
            type: String,
            enum: ["pending", "failed", "paid", "delivered", "canceled"],
            default: "pending",
        },
        user: {
            type: mongoose.Schema.ObjectId,
            ref: "User",
            required: true,
        },
        clientSecret: {
            type: String,
            required: true,
        },
        paymentIntentId: {
            type: String,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);



```

- Order Controller
```js
const Order = require("../models/OrderModel");
const Product = require("../models/ProductModel");

const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const { checkPermissions } = require("../utils");

const fakeStripeAPI = async ({ amount, currency }) => {
    const client_secret = "someRandomValue";
    return { client_secret, amount };
};

const createOrder = async (req, res) => {
    const { items: cartItems, tax, shippingFee } = req.body;
    if (!cartItems || cartItems.length < 1) {
        throw new CustomError.BadRequestError("No cart items provided");
    }
    if (!tax || !shippingFee) {
        throw new CustomError.BadRequestError(
            "Please provide tax and shipping fee"
        );
    }

    let orderItems = [];
    let subtotal = 0;

    for (const item of cartItems) {
        const dbProduct = await Product.findOne({ _id: item.product });
        if (!dbProduct) {
            throw new CustomError.NotFoundError(
                `No product with id: ${item.product}`
            );
        }
        const { name, price, image, _id } = dbProduct;
        const singleOrderItem = {
            amount: item.amount,
            name,
            price,
            image,
            product: _id,
        };
        orderItems = [...orderItems, singleOrderItem];

        subtotal += item.amount * price;
    }
    const total = tax + shippingFee + subtotal;

    // get client secret
    // you will be using real stripe API
    const paymentItent = await fakeStripeAPI({
        amount: total,
        currency: "usd",
    });

    const order = await Order.create({
        orderItems,
        total,
        subtotal,
        tax,
        shippingFee,
        clientSecret: paymentItent.client_secret,
        user: req.user.userId,
    });

    res.status(StatusCodes.CREATED).json({
        order,
        clientSecret: order.clientSecret,
    });
};

//only allowed to admin
const getAllOrders = async (req, res) => {
    const orders = await Order.find({});
    res.status(StatusCodes.OK).json({
        orders,
        count: orders.length,
    });
};

// allowed to everyone but can see theirs only
const getSingleOrder = async (req, res) => {
    const { id: orderId } = req.params;
    const order = await Order.findOne({ _id: orderId });

    if (!order) {
        throw new CustomError.NotFoundError(`No order with id: ${orderId}`);
    }

    checkPermissions(req.user, order.user);
    res.status(StatusCodes.OK).json({
        order,
    });
};

// get all the order associated with one user
const getCurrentUserOrders = async (req, res) => {
    const orders = await Order.find({ user: req.user.userId });
    res.status(StatusCodes.OK).json({
        orders,
        count: orders.length,
    });
};
const updateOrder = async (req, res) => {
    const { id: orderId } = req.params;
    const { paymentIntentId } = req.body;
    const order = await Order.findOne({ _id: orderId });

    if (!order) {
        throw new CustomError.NotFoundError(`No order with id: ${orderId}`);
    }

    checkPermissions(req.user, order.user);

    order.paymentIntentId = paymentIntentId;
    order.status = "paid";

    await order.save();
    res.status(StatusCodes.OK).json({
        order,
    });
};

module.exports = {
    getAllOrders,
    getSingleOrder,
    getCurrentUserOrders,
    createOrder,
    updateOrder,
};


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

### populate method (multiple links)

- gets data regarding other models as well
- get all the reviews and in the response instead of just productId it will also give other details of that product and same can be concatinated for user.
- but this can be done if they are connected while creating the schema.
```js
const reviews = await Review.find({}).populate({
        path: "product",
        select: "name company price",
}).populate({
            path: "user",
            select: "name",
});

// {
//     "reviews": [
//         {
//             "_id": "6659ee203f33ed78996574ea",
//             "rating": 2,
//             "title": "review 1 updated",
//             "comment": "better product",
//             "user": {
//                 "_id": "665618d7fb05a8eed0bb7dea",
//                 "name": "shubham"
//             },
//             "product": {
//                 "_id": "6659819870337b3a1dbba4dd",
//                 "name": "testing product",
//                 "price": 0,
//                 "company": "ikea"
//             },
//             "createdAt": "2024-05-31T15:34:56.856Z",
//             "updatedAt": "2024-05-31T15:38:03.324Z",
//             "__v": 0
//         }
//     ],
//     "count": 1
// }

```
- If not connected, we have to use mongoose virtual

```js
const ProductSchema = mongoose.Schema({
    ...
},{timestamps:true, toJSON:{virtuals: true}, toObject:{virtuals: true}})

 ProductSchema.virtual('reviews',{
    ref: 'Review',
    localFields:'_id',
    foreignField:'product',
    justOne:false,
    // match:{rating:5}
 })

const products = await Product.find({}).populate({
        path: "reviews"
})

```
- Its a virtual property, so we cannot query to get specific reviews, it gets all the data.

- so for querying, alternative to virtuals we can  

```js
//controllers/reviewController
const getSingleProductReviews = async (req, res) => {
    const { id: productId } = req.params;
    const reviews = await Review.find({ product: productId });
    res.status(StatusCodes.OK).json({ reviews, count: reviews.length });
};

//routes/productRoutes
router.route("/:id/reviews").get(getSingleProductReviews);
module.exports = router;

```

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
const totalProducts = await Product.countDocuments(queryObject);
const numOfPages = Math.ceil(totalProducts / limit);
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
    // restricting certain option on a test user
    // const testUser = id === '62efdsfsdklj24342njksd';// even check with the username
    // req.user = { id, username, testUser }
    req.user = { id, username }
    next()
  } catch (error) {
    throw new UnauthenticatedError('Not authorized to access this route')
  }
}

// routes/main
router.route('/dashboard').get(authMiddleware, dashboard) // adding auth middleware for the route
```
- Note: If in some route we are updating username or id we need to create a new JWT token from that updated values.

- authentication in case of cookies

```js
//utils
const createJWT = ({ payload }) => {
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_LIFETIME,
    });
    return token;
};

const isTokenValid = ({ token }) => {
    return jwt.verify(token, process.env.JWT_SECRET);
};

const attachCookiesToResponse = ({ res, user }) => {
    const token = createJWT({ payload: user });
    const oneDay = 1000 * 60 * 60 * 24;
    res.cookie("token", token, {
        httpOnly: true,
        expires: new Date(Date.now() + oneDay),
        secure: process.env.NODE_ENV === "production",
        signed: true,
    });
    // res.status(201).json({ user });
};

//auth middleware
const authenticateUser = async (req, res, next) => {
    const token = req.signedCookies.token;

    if (!token) {
        throw new CustomError.UnauthenticatedError("Authentication Invalid");
    }
    try {
        const { name, userId, role } = isTokenValid({ token });
        req.user = { name, userId, role };
        next();
    } catch (e) {
        throw new CustomError.UnauthenticatedError("Authentication Invalid");
    }
};

```

### authorize middleware

- This middleware will run after the authentication middleware.

- Checks whether the user is authorize to access the route.

```js
const authorizePermissions = (req, res, next) => {
    if (req.user.role !== "admin") {
        throw new CustomError.UnauthorizedError(
            "Unauthorized to access this route"
        );
    }
    console.log("admin route");
    next();
};

router.route("/").get(authenticateUser, authorizePermissions, getAllUsers);

```
- we can make this authorizePermissions method more dynamic to take roles as arguments which will be valid for specific routes.

```js
// Way 1
router.route("/").get(authenticateUser, authorizePermissions('admin','owner'), getAllUsers); // expects a callback function but we are calling a fn instead so we need to return a function which will act as callback fn.

const authorizePermissions = (...rest) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            throw new CustomError.UnauthorizedError(
                "Unauthorized to access this route"
            );
        }
        next();
    };
};

// way 2 Not correct but try if you have time
router.route("/").get(authenticateUser, (req, res, next)=>{authorizePermissions('admin','owner')}, getAllUsers); // expects a callback function but we are calling a fn instead so we need to return a function which will act as callback fn.


const authorizePermissions = (...rest) => {
        if (!roles.includes(req.user.role)) {
            throw new CustomError.UnauthorizedError(
                "Unauthorized to access this route"
            );
        }
        next();
};
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
which can be easily fixed using the npm package cors and having absolute route in frontend rather than relative one.

absolute: 'http:localhost:3000/api/v1/auth' - if server and frontend are hosted on different domain, you need to provide the absolute path in frontend.

relative: '/api/v1/auth' - both server and frontend are triggered at same origin using static file path or template engine.
```js
const cors = require('cors')
app.use(cors())
```
- Changing the URL path for static files
app.use('/static',express.static("./public")); 

### Other ways of handling error

```js
// middleware/error-handler
const errorHandlerMiddleware = (err, req, res, next) => {
  let customError = {
    // set default
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || 'Something went wrong try again later',
  }

  // if (err instanceof CustomAPIError) {
  //   return res.status(err.statusCode).json({ msg: err.message })
  // }

  if (err.name === 'ValidationError') {
    customError.msg = Object.values(err.errors)
      .map((item) => item.message)
      .join(',')
    customError.statusCode = 400
  }
  if (err.code && err.code === 11000) {
    customError.msg = `Duplicate value entered for ${Object.keys(
      err.keyValue
    )} field, please choose another value`
    customError.statusCode = 400
  }
  if (err.name === 'CastError') {
    customError.msg = `No item found with id : ${err.value}`
    customError.statusCode = 404
  }

  return res.status(customError.statusCode).json({ msg: customError.msg })
}

```

## Security

- npm packages helmet, cors, xss-clean, express-rate-limit, express-mongo-sanitize

```js

app.set('trust proxy', 1) // Since API is behind heroku
// this for whole app(all routes) we can have for specific routes as well
app.use(rateLimiter({
    windowMs: 15*60*1000,
    max:100
}))

app.use(helmet())
app.use(cors()) // no need if you just want your express frontend to use it. Needed if you want some other url to access the api
app.use(xss())
app.use(mongoSanitize())
```


- Rate limiter for simgle route
```js
const apiLimiter = rateLimiter({
    windowMs: 15*60*1000, // 15 minutes
    max:10,
    message:{
        msg:'Too many requests from this IP, please try again after 15 minutes'
    }

})

router.post('/register', apiLimiter, register);
router.post('/login', apiLimiter, login);

```

## Heroku Deployment (Vercel, Netlify, Firebase Hosting, AWS Free tier, Render, Cyclic, Deta)
[Herouku Docs for deploying nodejs](https://devcenter.heroku.com/articles/deploying-nodejs)
- In monodb atlas allow access from anywhere.
- sign in to heroku
- install heroku cli
- heroku -v
- package.json "start":"node app.js"
- package.json changes for engines and start
- setup procfile "web: node app.js"
- remove existing git repo
    - rm -rf .git

- git and heroku push
    - make sure to have .gitignore
    - git init, git add ., git commit -m "initial commit"
    - herkou login
    - heroku create "App Name"
    - git remote -v
- setting env variables in heroku GUI
- git push heroku master/main
- restarting dynamo

- once deployed to heroku we dont need some stuff.
    - morgan package
    - docs.json and relace local URL with the production URL
    - docgen uses inline js but helmet blocks that creating issues.
        - from docgen index.html in public separate html and inline script tag to a separate file browser-app.js and refer it in the index.html file
    - pushing updates to heroku
        - git add ., git commit -m "added new fixes"
        - git push heroku master/ main

### Deployig to Render
    - remove existing git repo
    - setup new one in git
    - setup new repo in github
    - push everything to github
    - goto render new web service latest service
    - fill advance .env file

## Swagger API Documentation
- postman if we publish the docs it gives some random url
- collection(make sure urls are all the same in all the requests) - export
- apimatic - import(your postman collection) - edit api
- npm package 

- export (OpenAPI v3.0 yaml )
- swagger ui editor - paste that yaml

- once tested in swagger ui
- we need to add it in our application - npm packages (swagger-ui-express, yamljs)
- create new file swagger.yaml and paste the working swagger documentation that we tested
- In app.js
```js
const swaggerUI = require('swagger-ui-express')
const YAML = require('yamljs')

const swaggerDocument = YAML.load('./swagger.yaml')


app.get('/',(req, res)=>{
    res.send('<h1>Jobs API</h1><a href="/api-docs">Documentation</a>)
})
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument))


```
- on local you can see basic setup but there would be bunch of errors

## Docgen Documentation
- install docgen
    - export postman collection(json)
    - {{URL}} - localhost, later on heroku one
    - docgen build -i filename.json -o index.html
    - put index.html generated into public one

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
},
lastName:{
    type:String,
    trim:true,
    maxlength:20,
    default:'lastName'
}

```

#### Custom Validation

- npm package validator
```js

const validator = require("validator")
email:{
    type:String,
    validate:{
        validator:validator.isEmail,
        message:'Please provide valid email'
    }
    unique:true,
}
```

### Register User

- Validate - name, email, password - with Mongoose
- Hash Password (with bcryptjs)
```js
// components/user.js
// async await way of using it
const register = async(req, res)=>{
    const { name, email, password} = req.body
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt)
    const tempUser = {name, email, password:hashedPassword} 
    const user = await User.create({...tempUser})
    res.status(201).json({user})
}
```


```js
// callback way of doing it
bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(password, salt, function(err, hash) {
        // Store hash in your password DB.
        const tempUser = {name, email, password:hashedPassword} 
        const user = await User.create({...tempUser})
        res.status(201).json({user})
    });
});
```

- can also use promises to do the same

- create and save triggers pre and post save hooks

- Find and Update Operations: Methods like updateOne(), updateMany(), findByIdAndUpdate(), etc., do not trigger pre and post save hooks. For these methods, you can use pre and post hooks for update operations (pre('updateOne'), pre('findOneAndUpdate'), etc.).


### Hashing can be refractored using mongoose internal middleware, these are different from the ones we create
```js
// model/ user.js
UserSchema.pre('save', async function(next){ // dont use arrow function due to "this" keyword scope
    if(this.isModified('password')) return;// if somewhere you are updating and used findOne and save this pre hook will get triggered and hash the password again which we don't want so unless and until password is changed we don't want to hash password.
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


```js
UserSchema.pre("save", async function () {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.comparePassword = async function (candidatePassword) {
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    return isMatch;
};

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

// you can also add these in separate util files or in the controller itself
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
    type:mongoose.Types.ObjectId,// mongoose.Schema.ObjectId - mostly use this as its used for foreign key purposes
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
- express-mongo-sanitize

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


- You can create a react app separately and build it to get static files and use it in express using express.static middleware like we do for static files.


``js
app.get('*', (req,res)=>{
    res.send(path.resolve(__dirname, './client/build','index.html'))
})

```

- In frontend create a model object that keep tracks of various fields on a form.

## Fake data
- Mackaroo website
    - use same exact field names as your schema (for date selectt iso 8601) and  custom lists for enums
    - save as json(mock-data.json)
    - add to database using "Automating adding to database" section


## Restrictin a test user from CRUD operations


- middleware/authentication.js
```js
 // restricting certain option on a test user
    const { id, username } = decoded
    const testUser = id === '62efdsfsdklj24342njksd';// even check with the username
    req.user = { id, testUser }

```
- creating testingUser in middleware

```js
const testUser = (req, res, next)=>{
    if(req.user.testUser){
        throw new BadRequestError('Test User. Read Only!')
    }
    next();
}

```

- add to auth routes (updateUser) -> route for updating user details
```js
router.patch('/updateUser', authenticateUser, testUser, updateUser)

```

## Mongodb Aggregation pipeline(grouping- avg, total max)

- npm i moment

```js
// jobs controller

const showStats = async(req, res)=>{
    // req.user.userId is string we want to pass object
    let stats = await Job.aggregate([
        {$match:{ createdBy: mongoose.Types.ObjectId(req.user.userId)}}, // all the jobs created by the user id that is logged in
        {$group: {_id: '$status',count:{$sum:1}}} // property name you want to group based on, _id can be set according to the need.
    ])

    /*
    stats = [{_id:'declined', count:22},{_id:'interview', count:25},{_id:'pending', count:28}]
    */

    //    we want to convert the above object into something where status is key and count is value

    /*
    stats = {declined: 22},{interview: 25},{pending:28}
    */

    stats = stats.reduce((acc, curr)=>{
        const {_id:title, count} = curr; // giving title alias to _id
        acc[title] = count;
        return acc
    },{})

    const defaultStats = {
        pending:  stats.pending || 0,
        interview: stats.interview || 0,
        declined: stats.declined || 0
    }

    let monthlyApplications = await Job.aggregate([
        {$match:{ createdBy: mongoose.Types.ObjectId(req.user.userId)}},
        {
            $group: {
                _id: {year: {$year: '$createdAt'}, month:{$month: '$createdAt'}},
                count:{$sum:1}
            } // gives all
        },
        { $sort: {'_id.year':-1, '_id.month':-1}}, // sorts them
        {$limit: 6} // gets only latest 6
    ]);

    /*
    monthlyApplications = [{_id: {year:2022, month:8 }, count: 5},{_id: {year:2022, month:7 }, count: 6},{_id: {year:2022, month:6 }, count: 5}, {_id: {year:2022, month:5 }, count: 4}, {_id: {year:2022, month:3 }, count: 6}, {_id: {year:2022, month:1 }, count: 8}]
    */

    monthlyApplications = monthlyApplications.map((item)=>{
        const{
            _id:{year, month},
            count
        }= item;
        const date = moment().month(month - 1).year(year).format('MMM Y')
        return {date,count}
    }).reverse();

    /*
    monthlyApplications = [{date: 'Aug 2022', count: 5},{date: 'July 2022', count: 6}...]
    */


    res.status(StatusCodes.OK).json({defaultStats, monthlyApplications})


}

```

## File and Image upload(Product)

- npm package express-fileupload

```js
// app.js
const fileUpload = require('express-fileupload')
app.use(express.static('./public'))
app.use(fileUpload())


```

```js
//models/Product
image:{
    type:String,
    required:true,
    default: "/uploads/example.jpeg",
}
```

- 3 routes createProduct, getAllProducts, uploadImage
        post(/products)   get(/products)   post(products/upload)
- we need uploadImage route to upload the image on the server first and the path to the image folder should be publically accessible.

```js
//controllers/productController
const createProduct = async(req, res)=>{
    const product = await Product.create(req.body)
    res.status(StatusCode.CREATED).json({product})
}
const getAllProducts = async(req, res)=>{
    const products = await Product.find({})
    res.status(StatusCode.OK).json({products})
}

//controllers/uploadController
const path = require('path');
const uploadProductImageLocal = async(req, res)=>{
    if(!req.files) throw new CustomError.BadRequestError('No File Uploaded')
    const productImage = req.files.image;
    if(!productImage.mimetype.startsWith('image')) throw some error...
    const maxSize = 1024 * 1024
    if(productImage.size > maxSize) throw some error...
    const imagePath = path.join(__dirname,'../public/uploads/'+`${productImage.name}`);
    await productImage.mv(imagePath)
    return res.status(StatusCodes.OK).json({image:{src:`/uploads/${productImage.name}`}})
    // small path because frontend already points to the server

}
```
- postman - body - form-data KEY:image  value-pick file

- storing image in cloud rather than our server (cloudinary)
    - create account and get 3 values(Cloud name, API Key, API Secret) add them to .env
    - npm package cloudinary
    - we use express-fileupload package to upload file on temp location and add to cloudinary and then removing the temp file.

```js
//app.js
const cloudinary = require('cloudinary').v2
cloudinary.confirm({
    cloud_name: process.env.CLOUD_NAME,
    api_key:process.env.CLOUD_API_KEY,
    api_secret:process.env.CLOUD_API_SECRET
})
const fileUpload = require('express-fileupload')
app.use(express.static('./public'))
app.use(fileUpload({useTempFiles:true}))

//controllers/uploadController
const cloudinary = require('cloudinary').v2
const fs = require('fs');
const uploadProductImageCloud = async(req, res)=>{
    // 2 ways, either get the images stored on our servers or use stream, we are using first
    const result = await cloudinary.uploader.upload(req.files.image.tempFilePath,{
        use_filename:true
        folder:'file-upload' // create this folder in cloudinary
    });
    //removing temp files after successfull upload
    fs.unlinkSync(req.files.image.tempFilePath)
    return res.status(StatusCode.OK).json({image:{src:result.secure_url}})

}

```

## Sending Emails
- npm package Nodemailer
- ethereal(mailtrap, production: sendGrid, mailthen) // SMTP service
    - create account
-  sendGrid - create account - create a single sender
```js
// controllers/sendEmail

const nodemailer = require('nodemailer');
const sgMail = require('@sendgrid/mail');

const sendEmailEthereal = async (req, res) => {
  let testAccount = await nodemailer.createTestAccount();

  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email', // create values in .env
    port: 587,
    auth: {
      user: 'marlene.legros@ethereal.email', //.env
      pass: 'va4q5BKKtry7aq58Gv', //.env
    },
  });

  let info = await transporter.sendMail({
    from: '"Coding Addict" <codingaddict@gmail.com>',
    to: 'bar@example.com',
    subject: 'Hello',
    html: '<h2>Sending Emails with Node.js</h2>',
  });

  res.json(info);
};

const sendEmail = async (req, res) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  const msg = {
    to: 'learncode@mail.com', // Change to your recipient
    from: 'learncodetutorial@gmail.com', // Change to your verified sender
    subject: 'Sending with SendGrid is Fun',
    text: 'and easy to do anywhere, even with Node.js',
    html: '<strong>and easy to do anywhere, even with Node.js</strong>',
  };
  const info = await sgMail.send(msg);
  res.json(info);
};

module.exports = sendEmail;


```

## Stripe Payment

- create free stripe account
    - developers - apikey
- npm package stripe
- public key in frontend js file

```js

ap.post('/stripe', stripeController);

//controllers/stripeController.js
const stripe = require('stripe')(process.env.STRIPE_KEY);

const stripeController = async (req, res) => {
  const { purchase, total_amount, shipping_fee } = req.body;

  const calculateOrderAmount = () => {
    //always check from database the price
    return total_amount + shipping_fee;
  };

  const paymentIntent = await stripe.paymentIntents.create({
    amount: calculateOrderAmount(),
    currency: 'usd',
  });

  res.json({ clientSecret: paymentIntent.client_secret });
};

module.exports = stripeController;

```


## Auth using passport

- npm init (express ejs bcrypt passport passport-local express-session express-flash method-override) (nodemon dotenv)
- using template engine like ejs
- To extend it connect to db and do it

```js
//app.js
if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const initializePassport = require('./passport-config')
const methodOverride = require('method-override')
initializePassport(
    passport, 
    email=> users.find(user=>user.email===email)
     id => users.find(user => user.id === id)
)

const users = []
app.set('view-engine','ejs')
app.use(express.urlencoded({extended: false})) // get form data in req variable

app.use(flash())
app.use(session({
    secret: something// add this to .env file
    resave:false,
    saveUninitialized:false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))

app.get('/', checkAuthenticated, (req,res)=>{
    res.render('index.ejs', {name: req.user.name})
})

app.get('/login', checkNotAuthenticated, (req,res)=>{
    res.render('login.ejs')
})

app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}))

app.get('/register', checkNotAuthenticated, (req,res)=>{
    res.render('register.ejs')
})

app.post('/register', checkNotAuthenticated, async (req,res)=>{
    try{
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        users.push({
            id:Date.now().toString(),
            name: req.body.name
            email: req.body.email
            password: hashedPassword
        })
        res.redirect('/login')
    }catch{
        res.redirect('/register')
    }
    

})

app.delete('/logout', (req, res) => {
  req.logout() //in passport 0.6 and above it expects a callback function so might give error use carefully
  res.redirect('/login')
})



function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }

  res.redirect('/login')
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/')
  }
  next()
}

// index.ejs


<h1>Hi <%= name %> </h1>
<form action="/logout?_method=DELETE" method="POST">
  <button type="submit">Log Out</button>
</form>


// login.ejs

<% if(messsages.error) { %>
<%= messages.error %>
<% } %>

// resgister.ejs
<h1>Register</h1>
<form action="/register" method="POST">
// ..name email password input fields
</form>

// passport-config.js
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')

 function initialize(passport, getUserByEmail, getUserById) {
  const authenticateUser = async (email, password, done) => {
    const user = getUserByEmail(email)
    if (user == null) {
      return done(null, false, { message: 'No user with that email' })
    }

    try {
      if (await bcrypt.compare(password, user.password)) {
        return done(null, user)
      } else {
        return done(null, false, { message: 'Password incorrect' })
      }
    } catch (e) {
      return done(e)
    }
  }

  passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser))
  passport.serializeUser((user, done) => done(null, user.id)) // to store inside session
  passport.deserializeUser((id, done) => {
    return done(null, getUserById(id))
  })
}

module.exports = initialize
```

## Difference between JWT and Passport

- JWT is a Stateless authentication while passport is a flexible and modular approach to implementing various authentication strategies(e.g., local, OAuth, JWT).
    - Stateless authentication
        - The server does not store any session data about the client between requests. Each request from the client must contain all the information needed to verify the user's identity and permissions.
        - The most common form of stateless authentication uses tokens. When a user logs in, the server issues a token that the client stores (e.g., in local storage or a cookie). The client then sends this token with each subsequent request.
        - Tokens like JWTs are self-contained, meaning they carry all the necessary information about the user, such as their identity and any claims (permissions). The token is signed by the server to prevent tampering.
- JWT is scalable and in passport a JWT strategy can be used to implement the same. 


## Cookies

- we were managing jwt tokens by sending jwt tokens in response and storing it in frontend using local storage.
and then attaching those jwt tokens to our requests.

- we will attach a cookie to a response and store the jwt in it. its gonna be hhtp only so only browser can access that token and will send it automatically with the next request.

- for parsing cookie we need np package cookie-parser

```js
//app.js
const cookieParser = require("cookie-parser")
// app.use(cookieParser())// use this if you are sending cookie without signed flag
app.use(cookieParser(process.env.JWT_SECRET))

// controller
// sending the cookies
const oneDay = 1000 * 60 * 60 * 24
res.cookie('token', token, {
    httpOnly:true,
    expires: new Date(Date.now() + oneDay),
    secure:process.env.NODE_ENV === 'production',
    signed:true
})

// parsing the cookies
// req.cookies// if no signed flag 
req.signedCookies // if signed flag true
const token = req.signedCookies.token
```
- frontend application dosen't need to worry about cookies. browser does all the work.
- unlike local storage you cannot access cookies the client side js
- There is a maxsize of cookie, so you need to think before sending the amount of data.

- can only use cookies in the same domain but if you are using react and running the frontend in different domain(http://localhost:3000), go to package.json

```js

//package.json
"proxy":"http://localhost:5000"// path where server is running.

```
- Before proxy the request goes to the domain where react is runnning.
- After adding proxy every request from frontend will be redirected to proxy path, so change and set relative path instead of absolute path in frontend.

- Lets assume you host your react frontend on netlify and backend on heroku, In production you also need to set proxy and reroute from netlify to heroku for each request and it depends on the service we use.

## logout

```js
const logout = async (req, res) => {
    res.cookie("token", "logout", {
        httpOnly: true,
        expires: new Date(Date.now() + 5 * 1000),
    });
    res.status(StatusCodes.OK).json({ msg: "user logged out" });
};

```

### More on Auth(email verification, refresh token, Reseting password)
- Big picture
    - Since we are asking to verify email, we are sending verificationToken to email somehow
    - add one more route for verifyEmail
- Things to keep in my mind, 
    - once we register dont send jwt token with response as we want to allow user to login only after email verification.
    - Also dont send the jwt token after login as well, if user tries to login without verifying we dont allow the user to login.

- adding 3 properties to user Model

```js
user, email, password, role
verificationToken: String,
isVerified:{
    type:Boolean,
    default:false
},
verified:Date
``` 

- auth controller
    - register
    ```js

    const crypto = require('crypto')
        <!-- code... remove the jwt creation and sending part from the code -->
        const verificationToken = crypto.randomBytes(40).toString('hex')// unique token for each user
        const user = await User.create({name, email, password, role, verificationToken})
        res.status(StatusCodes.CREATED).json({msg: 'Success! Please check your email to verify account'})
    ```
    - login
    ```js
        <!-- code... let the jwt creation part there but before that add this check -->
        if(!user.isVerified){
            throw new error...
        } 


    ```

- authRoute
router.post('/verify-email', verifyEmail)
- adding verifyEmail controller in authController

```js
const verifyEmail = async(req, res)=>{
    const {verificationToken, email} = req.body

    const user = await User.findOne({email});
    
    if(!user){
        throw new error...
    }

    if(user.verificationToken !== verificationToken){
        throw new error...
    }

    user.isVerified = true,
    user.verified = Date.now();
    user.verificationToken = ''

    await user.save()
    res.status(StatusCodes.OK).json({msg: 'Email Verified'})
}
```

- Sending Emails
    - Ethereal and nodemailer npm package
    - create files(nodemailerConfig.js, sendEmail, sendResetPassword, sendVerificationEmail) in utils

    - add these in index file of util  for easay imports
    -nodemailerConfig

    ```js
    // setup all the variables in .env
    module.exports = {
            host: "smtp.ethereal.email",
            port: 587,
            secure: false, // Use `true` for port 465, `false` for all other ports
            auth: {
                user: "maddison53@ethereal.email",
                pass: "jn7jnAPss4f63QBp6D",
            },
        }

    ```
    - In send email
    ```js   
    const nodemailer = require('nodemailer')
    const nodemailerConfig = require('nodemailerConfig')

    const sendEmail = async({to, subject, html})=>{
        let testAccount = await nodemailer.createTestAccount();

        
        const transporter = nodemailer.createTransport(nodemailerConfig);

        // setup all the variables in .env
        return transporter.sendMail({
            from: '"Maddison Foo Koch 👻" <maddison53@ethereal.email>', // sender address
            to,
            subject,
            html
        });
    }

    module.exports = sendEmail

    // utils/sendVerificationEmail
    const sendEmail = require('./sendEmail')

    const sendVerificationEmail = async({name, email, verificationToken, origin})=>{

        const verifyEmail = `${origin}/user/verify-email?token=${verificationToken}&email=${email}`
        const message = `<p>Please confirm your email by clicking on the following link : <a href="${verifyEmail}">Verify Email</a> </p>`
        return sendEmail({to:email, subject:'Email confirmation', html:`<h4> Hello, ${name}</h4>${message}`} )
    }

    module.exports = sendVerificationEmail

    <!-- authController -->
    const sendEmail = require('../utils/sendEmail')
    const {sendVerificationEmail} = require('../utils')


    <!-- code... remove the jwt creation and sending part from the code -->
    const verificationToken = crypto.randomBytes(40).toString('hex')// unique token for each user
    const user = await User.create({name, email, password, role, verificationToken})
    const origin = 'http://localhost:3000'

    <!-- const tempOrigin = req.get('origin')
    const protocol = req.protocol;
    const host = req.get('host')
    const forwardedHost = req.get('x-forwarded-host')
    const forwardedProtocol = req.get('x-forwarded-proto') -->



    await sendVerificationEmail({name:user.name, email:user.email, verificationToken:user.verificationToken, origin})
    res.status(StatusCodes.CREATED).json({msg: 'Success! Please check your email to verify account'})


    ```
- refresh token
    access token - short lifespan
    refresh token
    - create token model
    ```js
    {
        refreshToken: {type:String, required:true}
        ip: {type:String, required:true}
        userAgent: {type:String, required:true}
        isValid: {type:Boolean, default:true}
        user:{
            type:mongoose.Types.ObjectId,
            ref:'User',
            required:true
        }
    }, {timestamps:true}

    // authController login controller
    const tokenUser = createTokenUser(user);

    //create refresh token
    let refreshToken = ''
    //check for existing token

    const existingToken = await Token.findOne({ user: user._id });

    if (existingToken) {
        const { isValid } = existingToken;
        if (!isValid) {
        throw new CustomError.UnauthenticatedError('Invalid Credentials');
        }
        refreshToken = existingToken.refreshToken;
        attachCookiesToResponse({ res, user: tokenUser, refreshToken });
        res.status(StatusCodes.OK).json({ user: tokenUser });
        return;
    }

    refreshToken = crypto.randomBytes(40).toString('hex')

    const userAgent = req.headers['user-agent']
    const ip = req.ip

    const userToken = {refreshToken, ip, userAgent, user: user._id}

    // invoking schema Token create
    await Token.create(userToken)

    attachCookiesToResponse({res, user: tokenUser, refreshToken})


    res.status(StatusCodes.OK).json({user:tokenUser, token})

    //jwt - createJWT 

    const createJWT = ({payload})=>{
        const token = jwt.sign(payload, process.env.JWT_SECRET); // remove expires
        return token
    }

    const isTokenValid = (token) => jwt.verify(token, process.env.JWT_SECRET);
    //jwt - attachCookiesToResponse

    const attachCookiesToResponse = ({res, user, refreshToken})=>{
         const accessTokenJWT = createJWT({payload:{user}})
         const refreshTokenJWT = createJWT({payload:{user, refreshToken}})

         const oneDay = 1000 * 60 * 60 * 24;
        const longerExp = 1000 * 60 * 60 * 24 * 30;

        res.cookie('accessToken', accessTokenJWT, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            signed: true,
            expires: new Date(Date.now() + oneDay),
            //maxAge:1000
        });

        res.cookie('refreshToken', refreshTokenJWT, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            signed: true,
            expires: new Date(Date.now() + longerExp),
        });
    }
    // authentication middleware

    const authenticateUser = async (req, res, next) => {
    const { refreshToken, accessToken } = req.signedCookies;

    try {
        if (accessToken) {
        const payload = isTokenValid(accessToken);
        req.user = payload.user;
        return next();
        }
        const payload = isTokenValid(refreshToken);

        const existingToken = await Token.findOne({
        user: payload.user.userId,
        refreshToken: payload.refreshToken,
        });

        if (!existingToken || !existingToken?.isValid) {
        throw new CustomError.UnauthenticatedError('Authentication Invalid');
        }

        attachCookiesToResponse({
        res,
        user: payload.user,
        refreshToken: existingToken.refreshToken,
        });

        req.user = payload.user;
        next();
    } catch (error) {
        throw new CustomError.UnauthenticatedError('Authentication Invalid');
    }
    };
    //authRoute
    router.delete('/logout', authenticateUser, logout);

    //authController logout 
    const logout = async (req, res) => {
    await Token.findOneAndDelete({ user: req.user.userId });

    res.cookie('accessToken', 'logout', {
        httpOnly: true,
        expires: new Date(Date.now()),
    });
    res.cookie('refreshToken', 'logout', {
        httpOnly: true,
        expires: new Date(Date.now()),
    });
    res.status(StatusCodes.OK).json({ msg: 'user logged out!' });
    };
    ```

- Forget Password and Reset Password
    - Update user model
    ```js
    const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide name'],
        minlength: 3,
        maxlength: 50,
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'Please provide email'],
        validate: {
        validator: validator.isEmail,
        message: 'Please provide valid email',
        },
    },
    password: {
        type: String,
        required: [true, 'Please provide password'],
        minlength: 6,
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user',
    },
    verificationToken: String,
    isVerified: {
        type: Boolean,
        default: false,
    },
    verified: Date,
    passwordToken: {
        type: String,
    },
    passwordTokenExpirationDate: {
        type: Date,
    },
    });
    ```
    - authRoutes
    ```js
    router.post('/reset-password', resetPassword);
    router.post('/forgot-password', forgotPassword);
    ```
    - utils/sendResetPasswordEmail
    ```js
    const sendEmail = require('./sendEmail');

    const sendResetPassswordEmail = async ({ name, email, token, origin }) => {
    const resetURL = `${origin}/user/reset-password?token=${token}&email=${email}`;
    const message = `<p>Please reset password by clicking on the following link : 
    <a href="${resetURL}">Reset Password</a></p>`;

    return sendEmail({
        to: email,
        subject: 'Reset Password',
        html: `<h4>Hello, ${name}</h4>
    ${message}
    `,
    });
    };

    module.exports = sendResetPassswordEmail;

    ```
    - utils create Hash

    ```js
    const crypto = require('crypto');

    const hashString = (string) =>
    crypto.createHash('md5').update(string).digest('hex');

    module.exports = hashString;

    ```

    - authController
    ```js
    const forgotPassword = async (req, res) => {
    const { email } = req.body;
    if (!email) {
        throw new CustomError.BadRequestError('Please provide valid email');
    }

    const user = await User.findOne({ email });

    if (user) {
        const passwordToken = crypto.randomBytes(70).toString('hex');
        // send email
        const origin = 'http://localhost:3000';
        await sendResetPasswordEmail({
        name: user.name,
        email: user.email,
        token: passwordToken,
        origin,
        });

        const tenMinutes = 1000 * 60 * 10;
        const passwordTokenExpirationDate = new Date(Date.now() + tenMinutes);

        user.passwordToken = createHash(passwordToken);
        user.passwordTokenExpirationDate = passwordTokenExpirationDate;
        await user.save();
    }

    res
        .status(StatusCodes.OK)
        .json({ msg: 'Please check your email for reset password link' });
    };
    const resetPassword = async (req, res) => {
    const { token, email, password } = req.body;
    if (!token || !email || !password) {
        throw new CustomError.BadRequestError('Please provide all values');
    }
    const user = await User.findOne({ email });

    if (user) {
        const currentDate = new Date();

        if (
        user.passwordToken === createHash(token) &&
        user.passwordTokenExpirationDate > currentDate
        ) {
        user.password = password;
        user.passwordToken = null;
        user.passwordTokenExpirationDate = null;
        await user.save();
        }
    }

    res.send('reset password');
    };

    ```



### Creation route with multiple links

- We have three schemas users, product which is linked to user in product schema and review which is linked to user and product in review schema.

#### Schema with multiple links

```js
const mongoose = require("mongoose");

const ReviewSchema = mongoose.Schema(
    {
        rating: {
            type: Number,
            min: 1,
            max: 5,
            required: [true, "Please provide a product review rating"],
        },
        title: {
            type: String,
            trim: true,
            required: [true, "Please provide a product review title"],
            maxlenght: 100,
        },
        comment: {
            type: String,
            required: [true, "Please provide a product review comment"],
        },
        user: {
            type: mongoose.Types.ObjectId,
            ref: "User",
            required: true,
        },
        product: {
            type: mongoose.Types.ObjectId,
            ref: "Product",
            required: true,
        },
    },
    { timestamps: true }
);

// user can leave only on review per product
// 2 ways indexing and in controller
// indexing way

ReviewSchema.index({ product: 1, user: 1 }, { unique: true });

module.exports = mongoose.model("Review", ReviewSchema);



```

- We see below how to create virtuals to create links between product and review from review.

```js
const createReview = async (req, res) => {
    const { product: productId } = req.body;

    // Checking whether the product is valid for which we want to give review
    const isValidProduct = await Product.findOne({ _id: productId });

    if (!isValidProduct) {
        throw new CustomError.NotFoundError(`No product with id: ${productId}`);
    }

    // Checking if user has already given review for the product
    const alreadyubmitted = await Reveiew.findOne({
        product: productId,
        user: req.user.userId,
    });

    if (alreadyubmitted) {
        throw new CustomError.BadRequestError(
            `Already submitted review for this product`
        );
    }

    req.body.user = req.user.userId; // from auth middleware
    const review = await Review.create(req.body);
    res.status(StatusCodes.CREATED).json({ review });
};

```

#### Removing interrelated models which are not required.
- What happens if a remove a product, related reviews should also get deleted. we will create a hook.

```js
ProductSchema.pre("remove", async function (next) {
    await this.model("Review").deleteMany({ product: this._id });
});

```
- Things to take care: since we are using pre hook for remove we need to make sure that we use models remove method to remove the product and trigger the hook instead of using "findOneAndDelete"

#### Aggregate Pipeline with interrelated data.

- scenario: How to update the average rating and number of reviews in the product schema when we remove, create or update review.

- make sure while creating, updating or removing a review we use create, save and remove model methods instead of using findOneAndUpdate or findOneAndRemove because we will be creating post hooks for save and remove(called on create as well) for ReviewSchema

- we can create static method on the instance or on the schema

```js
// static method on schema instead of instance to create instance one we use ReviewSchema.methods
ReviewSchema.statics.calcaulateAverageRating = async function (productId) {
        const result = await this.aggregate([
        { $match: { product: productId } },
        {
            $group: {
                _id: null,
                averageRating: { $avg: "$rating" },
                numOfReviews: { $sum: 1 },
            },
        },
    ]);
    console.log(result);
    try {
        await this.model("Product").findOneAndUpdate(
            { _id: productId },
            {
                averageRating: Math.ceil(result[0]?.averageRating || 0),
                numOfReviews: result[0]?.numOfReviews || 0,
            }
        );
    } catch (e) {
        console.log(e);
    }
};

ReviewSchema.post("save", async function () {
    await this.constructor.calcaulateAverageRating(this.product);
});

ReviewSchema.post("remove", async function () {
    await this.constructor.calcaulateAverageRating(this.product);
});

```

- doing aggregation in GUI
    - goto database and review collection there will be a tab named aggregation click on that then click on create stage and select match in dropdown.
    - in query add 
    ```js  
    {
        product:ObjectId('665a17a057e34300f04be585')
    }

    ```
    - add stage 2 group
    ```js
    {
        _id:null, // If you have something the value is changing you need to pass id but for our use case product id remains same
        averageRating:{$avg:'$rating'},
        numOfReviews:{$sum: 1}
    }

    // grouping on the basis of rating
    {
        _id:'$rating', 
        amount:{$sum:1}
        
    }
    ```
     - we can export pipeline in node to get the code



### Utiltiy Functions
- Some functions that can be created at earlier stages becuase they are used at various places.

```js
//utils
//utils/jwt

const jwt = require("jsonwebtoken");

const createJWT = ({ payload }) => {
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_LIFETIME,
    });
    return token;
};

const isTokenValid = ({ token }) => {
    return jwt.verify(token, process.env.JWT_SECRET);
};

const attachCookiesToResponse = ({ res, user }) => {
    const token = createJWT({ payload: user });
    const oneDay = 1000 * 60 * 60 * 24;
    res.cookie("token", token, {
        httpOnly: true,
        expires: new Date(Date.now() + oneDay),
        secure: process.env.NODE_ENV === "production",
        signed: true,
    });
    // res.status(201).json({ user });
};

module.exports = {
    createJWT,
    isTokenValid,
    attachCookiesToResponse,
};

// utils/createTokenUser
const createTokenUser = (user) => {
    return { name: user.name, userId: user._id, role: user.role };
};

module.exports = createTokenUser;

// utils/checkPermissions

const CustomError = require("../errors");

// To check the permission if admin then on he can view other users, no other user can view other user using getSingleUser route and passing id
const checkPermissions = (requestUser, resourceUserId) => {
    if (requestUser.role === "admin") return; // continue and send res
    if (requestUser.userId === resourceUserId.toString()) return; // continue and send res
    throw new CustomError.UnauthorizedError(
        "Not authorized to access this user"
    );
};

module.exports = checkPermissions;

// middleware/authentication

const CustomError = require("../errors");
const { isTokenValid } = require("../utils");

const authenticateUser = async (req, res, next) => {
    const token = req.signedCookies.token;

    if (!token) {
        throw new CustomError.UnauthenticatedError("Authentication Invalid");
    }
    try {
        const { name, userId, role } = isTokenValid({ token });
        req.user = { name, userId, role };
        next();
    } catch (e) {
        throw new CustomError.UnauthenticatedError("Authentication Invalid");
    }
};

const authorizePermissions = (...rest) => {
    return (req, res, next) => {
        if (!rest.includes(req.user.role)) {
            throw new CustomError.UnauthorizedError(
                "Unauthorized to access this route"
            );
        }
        next();
    };
};

module.exports = {
    authenticateUser,
    authorizePermissions,
};

// models/userModel


UserSchema.pre("save", async function () {
    // console.log(this.modifiedPaths());
    // console.log(this.isModified("name"));
    if (!this.isModified("password")) return; // if you use save for update it hashes password twice
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.comparePassword = async function (candidatePassword) {
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    return isMatch;
};

```

- delete later
```js
// index.js
const userData = require('../model/users.json')
const postData = require('../model/posts.json')


console.log(userData);
console.log(postData);

const express = require('express');
const app = express();

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
// const crypto = require('crypto')
//middlewares
app.use(express.json()) // to get json data in req.body

app.get('/posts', function(req,res){
   res.json(postData)
});

app.get('/users', function(req,res){
   res.json({userData})
})

app.post('/register', async function(req, res){
   const {name, password} = req.body
   const hashedPassword = await bcrypt.hash(password, 10)
   const user = {name, password: hashedPassword, id: Math.floor(Math.random() * 100 + 4)}
   userData[`user${user.id}`] = user


   // generate JWT Token
   const token = jwt.sign({name}, "secretkey")

   res.status(201).json({user, token})
})

app.post('/login', async(req, res)=>{
   try{
      const {name ,password} = req.body

      if(!name || ! password){
         throw new Error('please enter name and password')
      }
    
      let ourUser = null;
      for(let user in userData){
         let singleUser =  userData[user]
         if(singleUser.name === name){
            ourUser = singleUser
         }
      }
      console.log(ourUser)
      if(!ourUser){
         throw new Error('Please enter correct credentials')
      }
   
      const isPasswordCorrect = await bcrypt.compare(password, ourUser.password);
   
      if(!isPasswordCorrect){
         throw new Error('Please enter correct credentials')
      }
      console.log('Successfully verified credentials')
      
      // generate JWT Token
      const token = jwt.sign({name}, "secretkey")

      res.status(200).json({user: {name: ourUser.name, id:ourUser.id}, token})
   }catch(e){
      console.log(e)
   }
  
})



app.listen(3000, console.log(`Server Listening at http://localhost:3000/`));

```
