# Node Crash Course

[Node Crash Course by Traversy Media](https://youtu.be/32M1al-Y6Ag)


- Node is a runntime engine that runs js.
- V8 Js Engine(build in C++)
- Non-Blocking I/O operations(file system, database, computations)
- Single Threaded
- Event Loop, event queue(Intensive operation)
- APIs, server-rendered apps, serve html rendered dynamic pages(ejs mustache), real time applications(chat, games), microservices, command line tools, bots, web scraping, web servers

- Not good for CPU-intensive operations(heavy computations)


```js
npm init -y
console.log(window) -> window is not defined
console.log(document) -> document is not defined
console.log(global)
console.log(process)

```

- setInterval, setTimeout, fetch they are not part of js, they are part of web API in the browser but also available in node js through global object.


##### Commonjs Require

we can import functions, objects, arrays and other types of data.

```js
utils.js
module.exports = <name> // This is called default export.
module.exports = {<name1>, <name2>} // If you want to do multiple exports

index.js
const <name> = require('./utils') // don't have to do .js at the end
const {<name1>, <name2>} = require('./utils')

```


##### ES Modules

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

#### Node Modules

##### Internal Node modules

###### http (express, koa, fastify)


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


##### gitignore file
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
--env-file =.env
nodemon --env-file =.env server.js

process.env.PORT




##### postman

## Express Crash Course



## Hono