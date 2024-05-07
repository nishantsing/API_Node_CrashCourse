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

###### http
