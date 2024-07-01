## Backend Technical Challenge: Parking CRUD with Authentication by JWT
## Table of Contents
1. [Description](#description)
2. [Technologies](#technologies)
3. [Installation and Usage](#installation-and-usage)

___
### Description: 

Rest API for the management and control of vehicle parking, the API allows the creation of partners who will manage the entry and exit of vehicles in the parking lots in which they are related. 

The API uses Spring Security and JWT Token to manage an access control system by role (ADMIN and PARTNER) through a token that expires every 6 hours.

#### Roles

The API supports two roles:

- **ADMIN**: This role has extensive permissions across all endpoints. Admins can create users with the "SOCIO" role, perform CRUD operations on parking entities, and manage other administrative tasks.
  
- **SOCIO**: Users with this role can create parking entries and exits and request earnings specific to the parking areas they are associated with.

#### Entity-Relationship Model

The API's entity-relationship model (ERM) is illustrated in the following diagram:

![ERM dbeaver image](https://github.com/BrayanGuerreroXD/parking-crud-nestjs/blob/main/mern.png)

This model outlines the relationships and structure of entities within the database, facilitating the management of parking operations and partner interactions.

___
### Technologies:

- [TypeScript v5.1.3](https://www.typescriptlang.org/ "TypeScript"): TypeScript version 5.1.3 or higher is required for developing and running the API.
- [Node.js v20.15.0](https://nodejs.org/ "Node.js"): Node.js version 20.15.0 or higher runtime is required to use the API.
- [NestJS v10.0.0](https://nestjs.com/ "NestJS"): NestJS version 10.0.0 or higher framework is used to build the API.
- [PostgreSQL v16.3](https://www.postgresql.org/ "PostgreSQL"): PostgreSQL version 16.3 or higher is used as the relational database management system for storing data related to parking operations.

|Backend|
|---|
|![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white) ![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white) ![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white) ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white) ![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens) ![Git](https://img.shields.io/badge/GIT-E44C30?style=for-the-badge&logo=git&logoColor=white)|

___
### Installation and Usage:

1. **Clone the Project Repository**

   Open your terminal and execute the following command to clone the parking-crud-nestjs project repository:

   ```bash
    $ git clone https://github.com/BrayanGuerreroXD/parking-crud-nestjs.git
   ```

2. **Navigate to the Project Directory**

   Change your working directory to the project's root directory:

   ```bash
    $ cd parking-crud-nestjs
   ```

3. **Create and Configure .env File**

   Create a .env file in the root directory of the project with the following content. Replace the placeholder values with actual secrets:

   ```dotenv
     PORT=${APP_PORT}
     DB_HOST=${DB_HOST}
     DB_PORT=${DB_PORT}
     DB_USER=${DB_USER}
     DB_PASSWORD=${DB_PASSWORD}
     DB_NAME=${DB_NAME}
     HASH_SALT=${HASH_SALT}
     JWT_SECRET=${JWT_SECRET_KEY}
     NUMBER_SESSIONS=${NUMBER_OF_SESSIONS}
     EXPIRATION_TIME=${EXPIRATION_TIME}
     URL_API_MAIL=http://localhost:3000/mail-record/send
     MORGAN_FORMAT:${MORGAN_FORMAT}
   ```

   - **PORT**: Specifies the port number on which the server will listen for incoming requests.
   - **DB_HOST**: Specifies the host where the database server is located (e.g., localhost or an IP address).
   - **DB_PORT**: Specifies the port number on which the database server is listening for connections.
   - **DB_USER**: Specifies the username used to authenticate and access the database.
   - **DB_PASSWORD**: Specifies the password associated with the database user for authentication.
   - **DB_NAME**: Specifies the name of the database where data will be stored (e.g., mail-record-db).
   - **HASH_SALT:** Specifies the salt value used for hashing the password.
   - **JWT_SECRET**: Specifies the secret key used to sign JSON Web Tokens (JWTs) for authentication and authorization.
   - **NUMBER_SESSIONS**: Specifies the maximum number of concurrent sessions allowed per user.
   - **EXPIRATION_TIME**: Specifies the expiration time (in seconds) for JWTs after which they are no longer valid.
   - **URL_API_MAIL**: Specifies the URL endpoint for sending emails via an external API (http://localhost:3000/mail-record/send in this case).
   - **MORGAN_FORMAT**: Specifies the morgan format for logging incoming HTTP requests in the server console. (e.g., dev)

     Ensure these values are kept secret and not shared publicly.

5. **Install all dependencies**
   
    ```bash
    $ npm install
    ```

6. **Generate and execute the migrations to create the tables in the database**.

   To generate the migrations of the entities, you must create a folder in src called migrations: `src/migrations` and place the following command:

   ```bash
   $ npm run m:gen -- src/migrations/InitDB
   ```

   Once the migration is generated, run it to apply the changes to the database:

   ```bash
   $ npm run m:run
   ```

   Additionally, to add the default ADMIN user and the ADMIN and PARTNER roles, run the following command:

   ```bash
   $ npm run m:seed
   ```

7. **Running de app**

    ```bash
    # development
    $ npm run start
    
    # watch mode
    $ npm run start:dev
    
    # production mode
    $ npm run start:prod
    ```

8. **Clone the Mail Simulation project repository**

   Open the terminal and type the following command to download the Mail Simulation project

   ```bash
    $ git clone https://github.com/BrayanGuerreroXD/mail-simulator-nestjs.git
   ```

9. **Test postman http request collection**

   After both projects are running, it is time to test the http requests to determine the correct functioning of the API. The order of the Postman collection looks as follows:

   ![postman collection](https://github.com/BrayanGuerreroXD/parking-crud-nestjs/blob/main/postman-collection.png)

   To obtain the authorization token for the ADMIN user is with the Login request, this token is obtained and can be added to each of the other requests in the ADMIN directory in the Bearer Token of type Authorization.

   Likewise with the SOCIO user, in his directory there is the request to obtain his authorization token so that he can use all the collection of requests of the SOCIO user.
