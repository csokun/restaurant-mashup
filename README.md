# Code Challenge

Code challenge requirements implementation can be found at `api\commands\index.js` and `api\queries\index.js` which are covered by a few unit tests (try `npm install && npm test`).

## Showcase

To take this code challenge to the next level. I decided to mashup the following stack to showcase code reusabilities.

App Stack:

* Express - MVC + API
* AngularJS 1.6 - for handle ui interaction `assets\js\app.js`
* Semantic-ui

Online demo: [https://waiter-table-allotments.herokuapp.com/](https://waiter-table-allotments.herokuapp.com/)

## API Code Structure

My coding style had changed significantly after I've exposed to Greg Young Command Query Responsibility Segregation (CQRS). However, like any other design pattern out there. None of them is designed as a silver bullet. But if you are a Single Responsibility believer then you will love CQRS.

Now, here is what I takes from CQRS. When implementing a particular problem we either write:

 1) Code that read data (Query) or
 2) Code that write data (Command)

With that in mind let start simple.

###  Start Simple

I prefer to manage code with minimal folder structure:

* `commands` folder to keep all write operations
* `queries` folder to keep all read operations

Each folder has `index.js` using for exporting public methods.
It is recommend if requirements are simple. 

However, as the system grow I prefer to re-organise code by feature:
```
. api
+-- feature1
|   +-- commands
|       |-- register.command.js
|       |-- index.js
|   +-- queries
|       |-- findOne.command.js
|       |-- index.js
|   +-- index.js                -> router (endpoints)
+-- feature2
|   +-- commands
|       |-- delete.command.js
|       |-- index.js
|   +-- queries
|       |-- findOne.command.js
|       |-- index.js
|   +-- index.js                -> router (endpoints)
+-- index.js                    -> api entry point
```

## Requirements

* `Node v8.x.x` I don't have to go this far; but I can't find a better excuse to make use of `util.promisify`

# Disclaimer 

The solution implemented here has a single purpose is to demonstrate my thought processes in problem solving. As challenger requests for a simple solution that can be excuted and verify. It is not close to my definition of production ready code as it misses a few things:

* Vigorous sanity checking
* Express API & MVC in the same project increase attack surface and adding complexity to code optimization
* No build task to bundle and optimize angular code
