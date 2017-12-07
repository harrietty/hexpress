# Express Reimplementation: Hexpress

Express is the most common NodeJS framework for serverside application development. It is commonly used for building REST APIs, single page and multi-page web applications following an MVC pattern and can be used with view engines such as EJS and Pug. 

Express leverages Node's HTTP module whilst greatly simplifying backend workflow.

In this project I reimplement some features of Express. For fun!

## Running the project

Make sure [NodeJS](https://docs.npmjs.com/getting-started/installing-node) is installed on your machine.

Clone the project

Move into the directory and install dependencies.

`cd hexpress && npm install`

Run the test suite:

`npm test`

## TODO

- Can get a new Hexpress app &#10003;
- Default 404 error handling &#10003;
- Basic GET routing &#10003;
- PUT, POST, DELETE routing &#10003;
- Support parameterised routes &#10003;
- Support queries
- Support custom middleware &#10003;
- Support custom error middleware &#10003;
- Support serving static files
- Support using a template engine
- Hexpress.Router ?