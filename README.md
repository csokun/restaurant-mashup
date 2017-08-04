# Code Challenge

Code challenge requirements implementation can be found at `api\commands\index.js` and `api\queries\index.js` which are covered by a few unit tests (try `npm install && npm test`).

## Showcase

To take this code challenge to the next level. I decided to mashup the following stack to showcase code reusabilities.

App Stack:

* Express - MVC + API
* AngularJS 1.6
* Semantic-ui

## API Code Structure

My coding style had changed significantly after I've got exposed to Greg Young Command Query Responsibility Segregation (CQRS).
Most of the time, code can be separate into two groups:

 1) Code that read data (Query)
 2) Code that write data (Command)

###  Start Simple

I prefer to start manage code with basic structure:

* `commands` folder to keep all write operations
* `queries` folder to keep all read operations

Each folder has `index.js` using for exporting public methods.
It is recommend if requirements are simple. However, as the system grow I prefer to split the code by feature:
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

### Requirements

* `Node v8.x.x`  I don't have to go this far; but I can't find a better excuse to make use of `util.promisify`