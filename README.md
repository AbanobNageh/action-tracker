## Description

A project created using the [Nest](https://github.com/nestjs/nest) framework. This project was created as a backend coding challenge.

## Project structure

This project consists of the following modules:
1. Actions module: Contains endpoints and logic directly related to actions.
2. Core-data: Contains classes that represent entities in the system.
3. Core-utils: Contains common helper functions used throughout the system.
4. Database: Contains database implementation and data-source files used to access different data in the system.
5. Users: Contains endpoints and logic directly related to the users.

## Project setup

1. Install dependencies:
```bash
$ npm install
```
2. Add a `.env` file to the project's root directroy with the following ENVs:
```Shell
# Controls the type of database used. Only local is usable.
DATA_SOUCE_TYPE=local
# Control the solution for getting the referral index for users. Only graph is usable.
REFERRAL_DATA_SOURCE_TYPE=graph
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev
```

## Run tests

```bash
# unit tests
$ npm run test

# test coverage
$ npm run test:cov

# e2e tests
$ npm run test:e2e
```

## Test endpoints manually.

You will find a postman collection inside the `postman` folder which can be used to test the project's endpoints.