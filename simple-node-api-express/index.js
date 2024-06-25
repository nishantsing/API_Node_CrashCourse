const { v4: uuidv4 } = require('uuid'); //Commonjs syntax

// import {v4 as uuidv4} from 'uuid'; ES6 syntax works if u add "type":"module" in package.json file
const http = require('http');


const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    res.end('<h1>Welcome to my page!</h1>')
});



console.log(uuidv4())
//npm run <script_name>


server.listen(3000, '127.0.0.1', () => {
    console.log('Server running...')
})