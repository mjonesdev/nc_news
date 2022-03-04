# News API

## Link to hosted API

https://secure-news.herokuapp.com/api

## Summary of project

This API has been created to supply a front-end application with data regarding articles and their sub information such as comments and topics.

## Local project setup instructions

### Clone the repository

You can clone the repository from GitHub by selecting the green code button on the code page of the repository. You can either use HTTPS or SSH to pull the repo down.  
### Install dependencies

Once a copy of the code is held locally on your machine you can run "npm install" to install the dependencies listing in the package.json file (assuming you already have Node installed on your machine).
### Seed local database

You will need PostgreSQL installed for this part.

To seed the local database first you will need to created the development and test databases using "npm run setup-dbs".

Once the databases have been created you can seed the development database with "npm run seed".

The test database will be seeded when you run the Jest testing suites.
### Run tests

To run tests for this application you can run "npm test" for all the test files to be used or "npm test __tests__/app.test.js" to run just the app test file.
## Development .env files that need to be created

In order for the database files to be successfully setup on a development machine you will need to create the following list of files on the top level of the app directory:

.env.development
.env.test

These will enable to the correct seeding of the PostgreSQL database.

## Minimum versions of software

Node.JS: 17.1.0
PostgreSQL: 14.2

Not tested on earlier versions