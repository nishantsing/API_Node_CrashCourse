# generic-api-node

### Installation

- To install node modules used in this project
`npm install`

- rename .env_ax as .env and add the correct values instead of the example values, for PORT and CONNECTION.

- add your api configs in productConfig.json to create a api according to your product needs

- example is for product : customers

### Running

- Not using nodemon as if your node version is greater than Node.js 18.11.0, you can directly use --watch flag(else add nodemon as dev dependency using node install -D nodemon, and then run using nodemon index.js or npx nodemon)

- `node --watch index.js`
- `node --watch-path=./src --watch-path=./tests app.js`(or if specific parts)

- faced some issue with watch, so for start script currently using "npx nodemon src index.js"


- npm run start || npm start
- [Localhost](http://localhost:5000/)

### Terminal Commands used

```js
npm i mongodb express mongoose dotenv

```

- If no databaseName is given in connection string, test is created as default.

### Query Parameter and Parameterized URLs

- passing the additional information to the web server by customizing the URL we are visiting.

* /api/v1/customers/1234 - /api/v1/customers/:id --- Query Parameter
* /api/v1/customers?id=1234 --- Query String

* /api/v1/customers?id=1234&industry=something --- filtering & sorting

### Important req and res properties

* req.body to use this middleware this need to be added app.use(express.json());
* req.params
* req.query

* res.json({})
* res.send()
* res.status(200)


### Update (post or put)
* put - replacing the entire object(Idempotent : meaning that making the same request multiple times has the same effect as making it once.)
* patch - replacing the part(may not be idempotent : meaning that making the same request multiple times may result in different outcomes.)


### connecting frontend 
- avoid cors issue using cors npm package


### patching nested objects in mongodb


- when you try to patch orders array and just change 1st object it will replace the complete orders array with only that - to fix this find individual order and using the orders route we can modify that individual order.


### Moving to Typescript
npm i -D typescript
tsc -- init

change the file name from index.js to index.ts
rename other files to ts inside components, routes, models

tsc src/index.ts - // @ts-nocheck(meaning ignore ts compile errors) add this on top of files to let them compile
tsc -p tsconfig.json --watch 

add scripts in package.json 
"watch":"tsc -p tsconfig.json --watch "


change all the cjs import statement to es6 import statements and also exports.
const mongoose = require('mongoose') - import {Schema, model} from 'mongoose'
module.exports = {} - export const customer = {} or export default {} - with default any name can be used while import whereas other same name need to be used as of export.


we you want to stop import compile errors from ts
goto tsconfig.json set noImplicitAny: false, useUnknownInCatchVariables: false

keep changing import statements and assigning types to convert it to ts.


npm i @types/express - install types needed for express
import {Request, Response} from 'express'
req:Request, res: Response
 

- creating interface for model
```ts
    import {Schema, model, HydratedDocument} from 'mongoose'
    interface IOrder {
        description:string,
        amountInRs?:number
    }
    interface ICustomer {
    name:string,
    industry?:string,
    orders?: IOrder[]
    }

    new Schema<ICustomer>


    const c:HydratedDocument<ICustomer> = new Customer({
        name:'test',
        industry:'test'
    })

    console.log(c.name);
```



- chrome://flags/#enable-experimental-web-platform-features