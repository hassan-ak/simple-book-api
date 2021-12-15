# BootCamp2021 Project04: Simple Book API

By doing this project we are able to learn following:-

- How to create a cdk app
- How to create a lambda function
  - Define lambda handler code
- How to crate a rest api using api gateway
  - Define api lambda integration
  - Add resources to the root
  - Add methods
- Test REST API using postman
  - Get request
    - Request Parameters
  - Post request
    - Request body
  - User Auth
- How to create DynamoDB table
  - Put data in table
  - Scan table for data

## Steps to code "Simple Book API"

### 1. Create a basic cdk app

Create and navigate to new directory using `mkdir simple-book-api && cd simple-book-api`. Create a new cdk project using `cdk init app --language typescript`. As typescript is used for coding so transcribing the code to javascript is necessary, one way is to build the app in the end other is to use `npm run watch` to auto compile the code whenever any file is changed so use the latter option. To synthesize the app use `cdk synth` this will output the cloud formation template. Bootstrap the app using `cdk bootstrap`, bootstrapping is necessary only in case when app is deployed for the first time. Deploy the app using `cdk deploy`.

### 2. Create a basic REST API

Purpose of this project is to create a rest api where one can send different requests. So the very first step is to make a rest api (root path) from where one can send different requests. For the very first step create a welcome message lambda function in the stack by updating "lib/simple-book-api-stack.ts". As this project is created using "cdk 2" so no need to install aws modules separately, all of them can be imported from "aws-cdk-lib", for any older version all modules to be installed separately.

```js
import { aws_lambda as lambda } from "aws-cdk-lib";
const welcomeFunction = new lambda.Function(this, "welcomeFunction", {
  functionName: "Welcome-Function-Simple-Book-Api",
  runtime: lambda.Runtime.NODEJS_14_X,
  code: lambda.Code.fromAsset("lambdas"),
  handler: "welcome.handler",
  memorySize: 1024,
});
```

Rest api's can be created using api gateway. Update "lib/simple-book-api-stack.ts" for creating a rest api using api gateway. This will create a new rest api and results in a URL whihc is going to work as the base path for the api.

```js
import { aws_apigateway as apigw } from "aws-cdk-lib";
const api = new apigw.RestApi(this, "simpleBookApi", {
  restApiName: "Simple Book Api",
});
```

When ever one sends a request to the api some lambda function is to be invoked, so create api integration for the lambda function by updating "lib/simple-book-api-stack.ts".

```js
const welcomeFunctionIntegration = new apigw.LambdaIntegration(welcomeFunction);
```

Api is already defined which creates a base URL. Now there is a need of a method on the root path so one is able to send a request and invoke the lambda function. Thus update "lib/simple-book-api-stack.ts" to add GET method to the root path and attach welcome function integration to it.

```js
api.root.addMethod("GET", welcomeFunctionIntegration);
```

Create "lambdas/welcome.ts" to define handler for the welcome lambda function. This will return simple message as response.

```js
export async function handler() {
  try {
    return {
      statusCode: 201,
      body: `{ "message": "Welcome to Simple Book API" }`,
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: `{ "Error": "Error with Simple Book API - Try again later" }`,
    };
  }
}
```

Deploy the app using `cdk deploy`. This will deploy the app on aws and returns the api base URL on console. Deployed stack can be seen in the cloudformation console, lambda in the lambda console and rest api in the apigateway console. API url can also be accessed in api settings in the consoel which will be of the following form

```
https://**********.execute-api.*********.amazonaws.com/prod/
```

Rest API's can be tested by various ways. One is to use "postman". Create a new collection in a postman workspace. Create a new GET request in the collection and provide API URL in it. One can make a new varibale to store the URL so it is easy to use while creating new requests. Send request and after successful execution reponse will be as follows.

![Welcome Request](./snaps/step02-01.PNG)

While adding methods "GET" option is selected so in case one send any request other than GET will results in a "Missing Authentication Token" message.

### 3. Create resource to check status

Now add a subpath to the root path of the api to check status if the api is working fine or facing any error. For that first update "lib/simple-book-api-stack.ts" and create a new lambda function, create api lambda function integration, add status resource to root path (new path defination) and add a get method on the lambda integartion. Also add CORS options to resource.

```js
const statusFunction = new lambda.Function(this, "statusFunction", {
  functionName: "Status-Function-Simple-Book-Api",
  runtime: lambda.Runtime.NODEJS_14_X,
  code: lambda.Code.fromAsset("lambdas"),
  handler: "status.handler",
  memorySize: 1024,
});
const statusFunctionIntegration = new apigw.LambdaIntegration(statusFunction);
const status = api.root.addResource("status");
status.addMethod("GET", statusFunctionIntegration);
addCorsOptions(status);
```

Cross-origin resource sharing (CORS) is a browser security feature that restricts cross-origin HTTP requests that are initiated from scripts running in the browser. So there is need to define CORS function.

```js
export function addCorsOptions(apiResource: apigw.IResource) {
  apiResource.addMethod(
    "OPTIONS",
    new apigw.MockIntegration({
      integrationResponses: [
        {
          statusCode: "200",
          responseParameters: {
            "method.response.header.Access-Control-Allow-Headers":
              "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent'",
            "method.response.header.Access-Control-Allow-Origin": "'*'",
            "method.response.header.Access-Control-Allow-Credentials":
              "'false'",
            "method.response.header.Access-Control-Allow-Methods":
              "'OPTIONS,GET,PUT,POST,DELETE'",
          },
        },
      ],
      passthroughBehavior: apigw.PassthroughBehavior.NEVER,
      requestTemplates: {
        "application/json": '{"statusCode": 200}',
      },
    }),
    {
      methodResponses: [
        {
          statusCode: "200",
          responseParameters: {
            "method.response.header.Access-Control-Allow-Headers": true,
            "method.response.header.Access-Control-Allow-Methods": true,
            "method.response.header.Access-Control-Allow-Credentials": true,
            "method.response.header.Access-Control-Allow-Origin": true,
          },
        },
      ],
    }
  );
}
```

Create "lambdas/status.ts" to define handler for the status lambda function. This will return simple message as response.

```js
export async function handler() {
  try {
    return {
      statusCode: 201,
      body: `{ "Status": "Success" }`,
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: `{ "Status": "Failure" }`,
    };
  }
}
```

Deploy the app using `cdk deploy` and then test the api using postman. For testing create new GET request with `/status` path and send the request.

![Status Request](./snaps/step03-01.PNG)

### 4. Create resource to add new book

Next step is to create a resource so we can add new books to the database. In this project DynamoDB is used as database. Update "lib/simple-book-api-stack.ts" to define a new dynamodb table for storing books.

```js
import { aws_dynamodb as ddb } from "aws-cdk-lib";
const allBooksTable = new ddb.Table(this, "AllBooksTable", {
  tableName: "Simple_Book_Api_All_Books",
  partitionKey: {
    name: "bookID",
    type: ddb.AttributeType.STRING,
  },
});
```

Create a lambda function to add new book to database and grant read write permission for ddb table. Also create lambda integration, resource, method and Cors options. One thing to keep in mind POST method is to be used here as we are adding data to ddb table.

```js
const addBooksFunction = new lambda.Function(this, "addBooksFunction", {
  functionName: "Add-Books-Function-Simple-Book-Api",
  runtime: lambda.Runtime.NODEJS_14_X,
  code: lambda.Code.fromAsset("lambdas"),
  handler: "addBooks.handler",
  memorySize: 1024,
  environment: {
    PRIMARY_KEY_ALL: "bookID",
    TABLE_NAME_ALL: allBooksTable.tableName,
  },
});
allBooksTable.grantReadWriteData(addBooksFunction);
const addBooksFunctionIntegration = new apigw.LambdaIntegration(
  addBooksFunction
);
const books = api.root.addResource("books");
books.addMethod("POST", addBooksFunctionIntegration);
addCorsOptions(books);
```

Install "aws-sdk" using `npm i aws-sdk` as we need to use AWS resources in the lambda function. Create "lambdas/addBooks.ts" to define the handler for addBooks function so new book can be added into the database. New book can be added by provding book data in the request body. There are multiple checks to be implemented.

```js
import * as AWS from "aws-sdk";
import { randomBytes } from "crypto";
const db = new AWS.DynamoDB.DocumentClient();

// enivronment variables
const PRIMARY_KEY_ALL = process.env.PRIMARY_KEY_ALL || "";
const TABLE_NAME_ALL = process.env.TABLE_NAME_ALL || "";

export const handler = async (event: any = {}): Promise<any> => {
  // Check if body parameters are given and number of parameters are as required for the request
  if (!event.body || Object.keys(JSON.parse(event.body)).length > 7) {
    return {
      statusCode: 400,
      body: `Invalid Request, Body parameters are missing or too many parameters are given. Give parameters in the following format.\n{
          "book": "Book Name", 
          "author": "Authos's Name", 
          "isbn": "Book isbn", 
          "book_type": "Book Type (fiction/non-fiction)",
          "price": Book Price, 
          "stock": Number of books to be added, 
          "available": true
        }`,
    };
  }
  // Get book parameters from request body and store them in a varibale
  const item =
    typeof event.body == "object" ? event.body : JSON.parse(event.body);
  // Check if body parameters are in correct form
  if (
    !item.book ||
    !item.author ||
    !item.isbn ||
    !(item.book_type === "fiction" || item.book_type === "non-fiction") ||
    !!(isNaN(item.price) || item.price < 0) ||
    !!(isNaN(item.stock) || item.stock % 1 != 0 || item.stock < 0) ||
    !item.available
  ) {
    return {
      statusCode: 400,
      body: `Invalid Request, Few body parameters are missing or parameters are in wrong format. Give parameters correctly .\n{
        "book": ${item.book || "Parameter Missing"}, 
        "author": ${item.author || "Parameter Missing"}, 
        "isbn": ${item.isbn || "Parameter Missing"}, 
        "book_type": ${
          !item.book_type
            ? "Parameter Missing"
            : !(
                item.book_type === "fiction" || item.book_type === "non-fiction"
              )
            ? `Give "fiction" or "non-fiction" for book_type`
            : item.book_type
        },
        "price": ${
          !item.price
            ? "Parameter Missing"
            : !!(isNaN(item.price) || item.price < 0)
            ? "Give a positive number for price"
            : item.price
        }, 
        "stock": ${
          !item.stock
            ? "Parameter Missing"
            : !!(isNaN(item.stock) || item.stock % 1 != 0 || item.stock < 0)
            ? "Give a positive whole number for stock"
            : item.price
        }, 
        "available": ${item.available || "Parameter Missing"}
      }`,
    };
  }
  // Asign book_id and set params to be passed to ddb operation
  item[PRIMARY_KEY_ALL] = randomBytes(32).toString("hex");
  const params = {
    TableName: TABLE_NAME_ALL,
    Item: item,
  };
  // When all conditions are good to go, put data in the table and return item as output
  // in case of error return error
  try {
    await db.put(params).promise();
    return {
      statusCode: 200,
      body: `Book with following detail success-fully added to the database.\n{
        "book": ${item.book}, 
        "author": ${item.author}, 
        "bookID":${item.bookID},
        "isbn": ${item.isbn}, 
        "book_type": ${item.book_type},
        "price": ${item.price}, 
        "stock": ${item.stock}, 
        "available": ${item.available}
      }`,
    };
  } catch (err) {
    console.log("DynamoDB error: ", err);
    return { statusCode: 500, body: err };
  }
};
```

Deploy the app using `cdk deploy`, this all our changes will be deployed and a new DynamoDB table will be created as well. For testing create new POST request on postman with sub path `/books`.

When no body is given sending this request will return an error In case more than requiered parameters are given in body again same error will occur.

![AddBook Request with no body](./snaps/step04-01.PNG)

If some of the parameters are missing or in wrong format another error will be encountered.

![AddBook Request with wrong/missing parameters](./snaps/step04-02.PNG)

If all the conditions are staisfied book will be added to table.

![AddBook Request](./snaps/step04-03.PNG)

If there is some error with DynamoDB it will be returned as well.

### 5. Create resource to list all books

Next step is to create a resource so we can get all books from the database. Update "lib/simple-book-api-stack.ts" to create a lambda function to get all books from database and grant read write permission for ddb table. Also create lambda integration and method.. One thing to keep in mind GET method is to be used here as we are getting data from ddb table. While defining lambda function need to define environment variables and request parameters while adding a method to books resource.

```js
const allBooksFunction = new lambda.Function(this, "allBooksFunction", {
  functionName: "All-Books-Function-Simple-Book-Api",
  runtime: lambda.Runtime.NODEJS_14_X,
  code: lambda.Code.fromAsset("lambdas"),
  handler: "allBooks.handler",
  memorySize: 1024,
  environment: {
    TABLE_NAME_ALL: allBooksTable.tableName,
  },
});
allBooksTable.grantReadWriteData(allBooksFunction);
const allBooksFunctionIntegration = new apigw.LambdaIntegration(
  allBooksFunction
);
books.addMethod("GET", allBooksFunctionIntegration, {
  requestParameters: {
    "method.request.querystring.book_type": false,
    "method.request.querystring.limit": false,
  },
});
```

Create "lambdas/allBooks.ts" to define the handler for allBooks function so books can be listed from database. When no query parameters are given all books will be rturned. We can also query based on book type and number of books.

```js
import * as AWS from "aws-sdk";

const TABLE_NAME_ALL = process.env.TABLE_NAME_ALL || "";

const db = new AWS.DynamoDB.DocumentClient();

export const handler = async (event: any, context: any): Promise<any> => {
  const params = {
    TableName: TABLE_NAME_ALL,
    ProjectionExpression: "book, bookID, book_type",
  };
  try {
    const response = await db.scan(params).promise();
    // In case there is no book in data base
    if (response.Count === 0) {
      return {
        statusCode: 200,
        body: `{ "message": "No Books currently available" }`,
      };
    }
    // When there is limit in the query
    if (
      event.queryStringParameters &&
      event.queryStringParameters.limit &&
      !event.queryStringParameters.book_type
    ) {
      if (!parseInt(event.queryStringParameters.limit)) {
        return {
          statusCode: 200,
          body: `{ "message": "Enter Limit in numeric form or greater than 0" }`,
        };
      } else {
        if (response.Items) {
          return {
            statusCode: 200,
            body: JSON.stringify(
              response.Items.slice(
                0,
                Math.abs(event.queryStringParameters.limit)
              )
            ),
          };
        }
      }
    }
    // When there is book_type in query
    if (
      event.queryStringParameters &&
      !event.queryStringParameters.limit &&
      event.queryStringParameters.book_type
    ) {
      if (
        event.queryStringParameters.book_type.toLowerCase() !== "fiction" &&
        event.queryStringParameters.book_type.toLowerCase() !== "non-fiction"
      ) {
        return {
          statusCode: 200,
          body: `{ "message": "Type should be 'fiction' or 'non-fiction'" }`,
        };
      } else {
        if (response.Items) {
          if (
            response.Items.filter(
              (item) =>
                item.book_type ===
                event.queryStringParameters.book_type.toLowerCase()
            ).length === 0
          ) {
            return {
              statusCode: 200,
              body: `{ "message": "There is no book of type ${event.queryStringParameters.book_type.toLowerCase()}" }`,
            };
          }
          return {
            statusCode: 200,
            body: JSON.stringify(
              response.Items.filter(
                (item) =>
                  item.book_type ===
                  event.queryStringParameters.book_type.toLowerCase()
              )
            ),
          };
        }
      }
    }
    // When there is both limit and book_type in the query
    if (
      event.queryStringParameters &&
      event.queryStringParameters.limit &&
      event.queryStringParameters.book_type
    ) {
      if (
        event.queryStringParameters.book_type.toLowerCase() !== "fiction" &&
        event.queryStringParameters.book_type.toLowerCase() !== "non-fiction"
      ) {
        return {
          statusCode: 200,
          body: `{ "message": "Type should be 'fiction' or 'non-fiction'" }`,
        };
      } else {
        if (response.Items) {
          if (
            response.Items.filter(
              (item) =>
                item.book_type ===
                event.queryStringParameters.book_type.toLowerCase()
            ).length === 0
          ) {
            return {
              statusCode: 200,
              body: `{ "message": "There is no book of type ${event.queryStringParameters.book_type.toLowerCase()}" }`,
            };
          } else {
            const results = response.Items.filter(
              (item) =>
                item.book_type ===
                event.queryStringParameters.book_type.toLowerCase()
            );
            console.log(results);
            if (!parseInt(event.queryStringParameters.limit)) {
              return {
                statusCode: 200,
                body: `{ "message": "Enter Limit in numeric form or greater than 0" }`,
              };
            } else {
              if (results) {
                return {
                  statusCode: 200,
                  body: JSON.stringify(
                    results.slice(
                      0,
                      Math.abs(event.queryStringParameters.limit)
                    )
                  ),
                };
              }
            }
          }
        }
      }
    }
    // No query parameters
    return { statusCode: 200, body: JSON.stringify(response.Items) };
  } catch (err) {
    console.log("DynamoDB error: ", err);
    return { statusCode: 500, body: err };
  }
};
```

Deploy the app using `cdk deploy` and then test it using postman.For testing create new GET request on postman with sub path `/books`.

When there are no books stored in the dynamoDB table a message will be returned stating no books in table. And if there are books in the database all books will be displayed

![All Books with empty database](./snaps/step05-01.PNG)

![All Books](./snaps/step05-02.PNG)

We can also add query parameters and when query parameters are given but book_type mismatch or limit not numeric again an error will be returned.

![book_type in query is incorrect](./snaps/step05-03.PNG)

![limit in query is not numeric](./snaps/step05-04.PNG)

Adding correct query parameters in correct format will return results as requested and one more thing any query other than book_type and limit will not be processed.

![Query prameters with request](./snaps/step05-05.PNG)

### 6. Create resource to list one book

Next step is to create a resource so we can get one book from the database. Update "lib/simple-book-api-stack.ts" to create a lambda function to get one book from database and grant read write permission for ddb table. Also create lambda integration and method. One thing to keep in mind GET method (with sub uri)is to be used here as we are getting data from ddb table. While defining lambda function need to define environment variables.

```js
const oneBookFunction = new lambda.Function(this, "oneBookFunction", {
  functionName: "One-Book-Function-Simple-Book-Api",
  runtime: lambda.Runtime.NODEJS_14_X,
  code: lambda.Code.fromAsset("lambdas"),
  handler: "oneBook.handler",
  memorySize: 1024,
  environment: {
    PRIMARY_KEY_ALL: "bookID",
    TABLE_NAME_ALL: allBooksTable.tableName,
  },
});
allBooksTable.grantReadWriteData(oneBookFunction);
const oneBookFunctionIntegration = new apigw.LambdaIntegration(oneBookFunction);
const oneBook = books.addResource("{id}");
oneBook.addMethod("GET", oneBookFunctionIntegration);
addCorsOptions(oneBook);
```

Create "lambdas/oneBook.ts" to define the handler for oneBook function so one book can be listed from database. Need a book_id in request path.

```js
import * as AWS from "aws-sdk";
const TABLE_NAME_ALL = process.env.TABLE_NAME_ALL || "";
const PRIMARY_KEY_ALL = process.env.PRIMARY_KEY_ALL || "";
const db = new AWS.DynamoDB.DocumentClient();
export const handler = async (event: any = {}): Promise<any> => {
  const requestedItemId = event.pathParameters.id;
  const params = {
    TableName: TABLE_NAME_ALL,
    Key: {
      [PRIMARY_KEY_ALL]: requestedItemId,
    },
  };
  try {
    const response = await db.get(params).promise();
    // No books with requested ID
    if (!response.Item) {
      return {
        statusCode: 200,
        body: `{ "Message": "No book with requested ID - Try Again" }`,
      };
    }
    // Book present in ddb with requested ID
    return { statusCode: 200, body: JSON.stringify(response.Item) };
  } catch (err) {
    console.log("DynamoDB error: ", err);
    return { statusCode: 500, body: err };
  }
};
```

Deploy the app using `cdk deploy` and then test it using postman.For testing create new GET request on postman with sub path `/books/:book_id`. If there is no book in the database with requested id a message telling about no book will be returned as in step05. And if book is present it will be returned.

![Single book](./snaps/step06-01.PNG)

### 7. Create resource for user Auth.

Next step is to create a resource so we can register a user as we need to manage orders thus a user should be registered with the api. Update "lib/simple-book-api-stack.ts" to create a DynamoDb table to store user data and lambda function to register user in database and grant read write permission for ddb table. Also create lambda integration, resource and method. One thing to keep in mind POST method is to be used here as we are putting data to ddb table. While defining lambda function need to define environment variables.

```js
const usersTable = new ddb.Table(this, "UsersTable", {
  tableName: "Simple_Book_Api_Users",
  partitionKey: {
    name: "userEmail",
    type: ddb.AttributeType.STRING,
  },
});
const userAuthFunction = new lambda.Function(this, "userAuthFunction", {
  functionName: "User-Auth-Function-Simple-Book-Api",
  runtime: lambda.Runtime.NODEJS_14_X,
  code: lambda.Code.fromAsset("lambdas"),
  handler: "userAuth.handler",
  memorySize: 1024,
  environment: {
    PRIMARY_KEY_USER: "userEmail",
    TABLE_NAME_USER: usersTable.tableName,
  },
});
usersTable.grantReadWriteData(userAuthFunction);
const userAuthFunctionIntegration = new apigw.LambdaIntegration(
  userAuthFunction
);
const userAuth = api.root.addResource("api-clients");
userAuth.addMethod("POST", userAuthFunctionIntegration);
addCorsOptions(userAuth);
```

Create "lambdas/userAuth.ts" to define the handler for userAuth function so user can b registered

```js
import * as AWS from "aws-sdk";
import { randomBytes } from "crypto";
const PRIMARY_KEY_USER = process.env.PRIMARY_KEY_USER || "";
const TABLE_NAME_USER = process.env.TABLE_NAME_USER || "";
const db = new AWS.DynamoDB.DocumentClient();
export const handler = async (event: any = {}): Promise<any> => {
  // If no body given or extra values given
  if (!event.body || Object.keys(JSON.parse(event.body)).length >= 3) {
    return {
      statusCode: 400,
      body: `Invalid Request, Body parameters are missing or too many parameters are given. Give parameters in the following format.\n{
          "userName": "User's Name",
          "userEmail": "User's Email"
        }`,
    };
  }
  // Get data from request body
  const item =
    typeof event.body == "object" ? event.body : JSON.parse(event.body);
  item["user_ID"] = randomBytes(32).toString("hex");
  // Check if email in correct format
  if (
    !(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(item.userEmail)
      ? true
      : false)
  ) {
    return {
      statusCode: 400,
      body: `{"Invalid Request": "Enter Email in valid format"}`,
    };
  }
  // Params to add user
  const params1 = {
    TableName: TABLE_NAME_USER,
    Item: item,
  };
  // Check if all parameters are given
  if (!item.userEmail || !item.userName) {
    return {
      statusCode: 400,
      body: `Invalid Request, You are missing some parameters in body. Give missing parameters.\n{
          "userName": ${item.userName || "Missing"}, 
          "userEmail": ${item.userEmail || "Missing"}
        }`,
    };
  }
  // params to check registered user
  const params2 = {
    TableName: TABLE_NAME_USER,
    Key: {
      [PRIMARY_KEY_USER]: item.userEmail,
    },
  };
  try {
    const response = await db.get(params2).promise();
    // Check if user is already registered
    if (response.Item) {
      return {
        statusCode: 401,
        body: `User already registered. Copy user_ID to be used for Auth.\n${JSON.stringify(
          response.Item
        )}`,
      };
    }
    // Register new user
    await db.put(params1).promise();
    return {
      statusCode: 200,
      body: `Following user success-fully registered. Copy user_ID to be used for Auth. \n{
        "userName": ${item.userName}, 
        "userEmail": ${item.userEmail},
        "user_ID":${item.user_ID}
      }`,
    };
  } catch (err) {
    console.log("DynamoDB error: ", err);
    return { statusCode: 500, body: err };
  }
};
```

Deploy the app using `cdk deploy`. Test user Auth functionality by adding new Post request with `/api-clients` to register new user. If there is no request body, more or less than necessary parameters we will recieve an error same as in the adding book step. If while registering email is given in wrong format an error message will be returned.

![Wrong email format](./snaps/step07-01.PNG)

If user is already registered user details will be displayed with relevent message.

![Already registered user](./snaps/step07-02.PNG)

If every thing goes well user will be registered

![register user](./snaps/step07-03.PNG)

### 8. Create resource to place order

Next step is to create a resource so we can place an order. Update "lib/simple-book-api-stack.ts" to create a DynamoDb table to store all orders and lambda function to place order and save in database and grant read write permission for ddb table. Also create lambda integration, resource and method. One thing to keep in mind POST method is to be used here as we are putting data to ddb table. While defining lambda function need to define environment variables.

```js
const allOrdersTable = new ddb.Table(this, "AllOrdersTable", {
  tableName: "Simple_Book_Api_All_Orders",
  partitionKey: {
    name: "orderID",
    type: ddb.AttributeType.STRING,
  },
});
const placeOrderFunction = new lambda.Function(this, "placeOrderFunction", {
  functionName: "Place-Order-Function-Simple-Book-Api",
  runtime: lambda.Runtime.NODEJS_14_X,
  code: lambda.Code.fromAsset("lambdas"),
  handler: "placeOrder.handler",
  memorySize: 1024,
  environment: {
    TABLE_NAME_USER: usersTable.tableName,
    PRIMARY_KEY_ALL: "bookID",
    TABLE_NAME_ALL: allBooksTable.tableName,
    PRIMARY_KEY_ORDER: "orderID",
    TABLE_NAME_ORDER: allOrdersTable.tableName,
  },
});
allBooksTable.grantReadWriteData(placeOrderFunction);
usersTable.grantReadWriteData(placeOrderFunction);
allOrdersTable.grantReadWriteData(placeOrderFunction);
const placeOrderFunctionIntegration = new apigw.LambdaIntegration(
  placeOrderFunction
);
const orders = api.root.addResource("orders");
orders.addMethod("POST", placeOrderFunctionIntegration);
addCorsOptions(orders);
```

Create "lambdas/placeOrder.ts" to define the handler for placeOrder function so order can be placed

```js
import * as AWS from "aws-sdk";
import { randomBytes } from "crypto";
const db = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME_USER = process.env.TABLE_NAME_USER || "";
const TABLE_NAME_ALL = process.env.TABLE_NAME_ALL || "";
const PRIMARY_KEY_ALL = process.env.PRIMARY_KEY_ALL || "";
const PRIMARY_KEY_ORDER = process.env.PRIMARY_KEY_ORDER || "";
const TABLE_NAME_ORDER = process.env.TABLE_NAME_ORDER || "";
export async function handler(event: any) {
  if (
    !event.headers.Authorization ||
    !event.headers.Authorization.split(" ")[1]
  ) {
    return {
      statusCode: 400,
      body: `{ "Error": "Provide Authentication token" }`,
    };
  }
  if (!event.body || Object.keys(JSON.parse(event.body)).length >= 3) {
    return {
      statusCode: 400,
      body: `Invalid Request, Body parameters are missing or too many parameters are given. Give parameters in the following format.\n{
          "bookID": "ID of Book to order", 
          "noOfBooks": "No. of Books to Order"
        }`,
    };
  }
  const item =
    typeof event.body == "object" ? event.body : JSON.parse(event.body);
  if (!item.bookID || !item.noOfBooks || isNaN(item.noOfBooks)) {
    return {
      statusCode: 400,
      body: `Invalid Request, You are missing some parameters in body. Give missing parameters.\n{
              "bookID": ${item.bookID || "Missing"}, 
              "noOfBooks": ${
                isNaN(item.noOfBooks)
                  ? "Not a Number or Missing"
                  : item.noOfBooks
              }
            }`,
    };
  }
  item["user_ID"] = event.headers.Authorization.split(" ")[1];
  const params1 = {
    TableName: TABLE_NAME_USER,
  };
  try {
    const response = await db.scan(params1).promise();
    if (response.Count === 0) {
      return {
        statusCode: 200,
        body: `{"message": "You are not a registered user. Register Yourself or provide correct user Key"}`,
      };
    } else {
      if (response.Items) {
        if (
          response.Items.filter(
            (userItem) => userItem.user_ID === item["user_ID"]
          ).length === 0
        ) {
          return {
            statusCode: 200,
            body: `{ "message": "You are not a registered user. Register Yourself or provide correct user Key" }`,
          };
        } else {
          const userResponse = response.Items.filter(
            (userItem) => userItem.user_ID === item["user_ID"]
          );
          item["userName"] = userResponse[0].userName;
          item["userEmail"] = userResponse[0].userEmail;
          const params2 = {
            TableName: TABLE_NAME_ALL,
            Key: {
              [PRIMARY_KEY_ALL]: item.bookID,
            },
          };
          const response2 = await db.get(params2).promise();
          if (!response2.Item) {
            return {
              statusCode: 200,
              body: `{ "message": "No book with requested ID - Try Again" }`,
            };
          }
          item["book_type"] = response2.Item.book_type;
          item["book"] = response2.Item.book;
          item["isbn"] = response2.Item.isbn;
          item["price"] = response2.Item.price;
          item["author"] = response2.Item.author;
          item[PRIMARY_KEY_ORDER] = randomBytes(32).toString("hex");
          const params3 = {
            TableName: TABLE_NAME_ORDER,
            Item: item,
          };
          await db.put(params3).promise();
          return {
            statusCode: 200,
            body: `Order with following details success-fully placed.\n {
                "orderID": ${item.orderID},
                "userName":${item.userName},
                "userEmail":${item.userEmail},
                "book": ${item.book},
                "author": ${item.author},
                "book_type": ${item.book_type},
                "price": ${item.price}, 
                "noOfBooks": ${item.noOfBooks},
                "user_ID":${item.user_ID},
                "isbn": ${item.isbn}, 
                "bookID": ${item.bookID}
            }`,
          };
        }
      } else {
        return {
          statusCode: 200,
          body: `{ "message": "You are not a registered user. Register Yourself or provide correct user Key" }`,
        };
      }
    }
  } catch (error) {
    console.log("Error = ", error);
    return {
      statusCode: 500,
      body: error,
    };
  }
}
```

Deploy the app using `cdk deploy`. Test place order functionality by adding new Post request with `/orders` to place new order.

If there is no auth token or given with wrong configartion an error will return in such case. To add Auth token from collection settings select bearer token and add user Id there.

![Auth Error](./snaps/step08-01.PNG)

![Add Auth](./snaps/step08-02.PNG)

After providing auth token if no body is provided or body parameters in wrong format or more than required parameters are provided again error message will be recieved same as above steps. If there are no users in the database or the provided Auth is not from a registered users we recieve following message.

![Not a user](./snaps/step08-03.PNG)

If there is no book with provided Id following message will be recieved

![No such book](./snaps/step08-04.PNG)

While successful execution will place the order

![Order Placed](./snaps/step08-05.PNG)

### 9. Create resource to list all orders

Next step is to create a resource so we can list aall orders. Update "lib/simple-book-api-stack.ts" to create a lambda function to get all orders grant read write permission for ddb table. Also create lambda integration, resource and method. One thing to keep in mind GET method is to be used here as we are getting data from ddb table. While defining lambda function need to define environment variables.

```js
const allOrdersFunction = new lambda.Function(this, "allOrdersFunction", {
  functionName: "All-Orders-Function-Simple-Book-Api",
  runtime: lambda.Runtime.NODEJS_14_X,
  code: lambda.Code.fromAsset("lambdas"),
  handler: "allOrders.handler",
  memorySize: 1024,
  environment: {
    TABLE_NAME_USER: usersTable.tableName,
    TABLE_NAME_ORDER: allOrdersTable.tableName,
  },
});
usersTable.grantReadWriteData(allOrdersFunction);
allOrdersTable.grantReadWriteData(allOrdersFunction);
const allOrdersFunctionIntegration = new apigw.LambdaIntegration(
  allOrdersFunction
);
orders.addMethod("GET", allOrdersFunctionIntegration);
```

Create "lambdas/allOrders.ts" to define the handler for allOrder function so all orders can be scanned

```js
import * as AWS from "aws-sdk";
const db = new AWS.DynamoDB.DocumentClient();

const TABLE_NAME_USER = process.env.TABLE_NAME_USER || "";
const TABLE_NAME_ORDER = process.env.TABLE_NAME_ORDER || "";

export async function handler(event: any) {
  if (
    !event.headers.Authorization ||
    !event.headers.Authorization.split(" ")[1]
  ) {
    return {
      statusCode: 400,
      body: `{ "Error": "Provide Authentication token" }`,
    };
  }
  const params1 = {
    TableName: TABLE_NAME_USER,
  };
  try {
    const response = await db.scan(params1).promise();
    if (response.Count === 0) {
      return {
        statusCode: 200,
        body: `{ "message": "You are not a registered user. Register Yourself or provide correct user Key" }`,
      };
    }
    if (
      response.Items &&
      response.Items.filter(
        (userItem) =>
          userItem.user_ID === event.headers.Authorization.split(" ")[1]
      ).length === 0
    ) {
      return {
        statusCode: 200,
        body: `{ "message": "You are not a registered user. Register Yourself or provide correct user Key" }`,
      };
    }
    const params2 = {
      TableName: TABLE_NAME_ORDER,
      ProjectionExpression: "user_ID, orderID, book, noOfBooks",
    };
    const response2 = await db.scan(params2).promise();
    if (response2.Count === 0) {
      return {
        statusCode: 200,
        body: `{ "message": "Currently No orders in place" }`,
      };
    }
    if (
      response2.Items &&
      response2.Items.filter(
        (orderItem) =>
          orderItem.user_ID === event.headers.Authorization.split(" ")[1]
      ).length === 0
    ) {
      return {
        statusCode: 200,
        body: `{ "message": "Currently No orders in place" }`,
      };
    }
    if (response2.Items) {
      return {
        statusCode: 200,
        body: JSON.stringify(
          response2.Items.filter(
            (orderItem) =>
              orderItem.user_ID === event.headers.Authorization.split(" ")[1]
          )
        ),
      };
    } else {
      return {
        statusCode: 200,
        body: `{ "message": "Currently No orders in place" }`,
      };
    }
  } catch (error) {
    return { statusCode: 500, body: error };
  }
}
```

Deploy the app using `cdk deploy`. Test all orders functionality by adding new GET request with `/orders` to get all orders.
If there is no auth token or given with wrong configartion an error will return in such case. To add Auth token from collection settings select bearer token and add user Id there. If there are no users in the database or the provided Auth is not from a registered users we recieve error message. If there is no order with provided Id or with given userID again message will be returned. These condotions are documented in above cases. If all conditions rae fullfilled results are as follows.

![All Orders](./snaps/step09-01.PNG)

### 10. Create resource to list one order

Next step is to create a resource so we can list one order. Update "lib/simple-book-api-stack.ts" to create a lambda function to get one order grant read write permission for ddb table. Also create lambda integration, resource and method. One thing to keep in mind GET method is to be used here as we are getting data from ddb table. While defining lambda function need to define environment variables.

```js
const oneOrderFunction = new lambda.Function(this, "oneOrderFunction", {
  functionName: "One-Order-Function-Simple-Book-Api",
  runtime: lambda.Runtime.NODEJS_14_X,
  code: lambda.Code.fromAsset("lambdas"),
  handler: "oneOrder.handler",
  memorySize: 1024,
  environment: {
    TABLE_NAME_USER: usersTable.tableName,
    TABLE_NAME_ORDER: allOrdersTable.tableName,
    PRIMARY_KEY_ORDER: "orderID",
  },
});
usersTable.grantReadWriteData(oneOrderFunction);
allOrdersTable.grantReadWriteData(oneOrderFunction);
const oneOrderFunctionIntegration = new apigw.LambdaIntegration(
  oneOrderFunction
);
const oneOrder = orders.addResource("{id}");
oneOrder.addMethod("GET", oneOrderFunctionIntegration);
addCorsOptions(oneOrder);
```

Create "lambdas/oneOrder.ts" to define the handler for oneOrder function so one order can be obtained from database

```js
import * as AWS from "aws-sdk";
const db = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME_USER = process.env.TABLE_NAME_USER || "";
const TABLE_NAME_ORDER = process.env.TABLE_NAME_ORDER || "";
const PRIMARY_KEY_ORDER = process.env.PRIMARY_KEY_ORDER || "";
export async function handler(event: any) {
  if (
    !event.headers.Authorization ||
    !event.headers.Authorization.split(" ")[1]
  ) {
    return {
      statusCode: 400,
      body: `{ "Error": "Provide Authentication token" }`,
    };
  }
  const params1 = {
    TableName: TABLE_NAME_USER,
  };
  try {
    const response = await db.scan(params1).promise();
    if (response.Count === 0) {
      return {
        statusCode: 200,
        body: `{ "message": "You are not a registered user. Register Yourself or provide correct user Key" }`,
      };
    }
    if (
      response.Items &&
      response.Items.filter(
        (userItem) =>
          userItem.user_ID === event.headers.Authorization.split(" ")[1]
      ).length === 0
    ) {
      return {
        statusCode: 200,
        body: `{ "message": "You are not a registered user. Register Yourself or provide correct user Key" }`,
      };
    }
    const requestedItemId = event.pathParameters.id;

    const params2 = {
      TableName: TABLE_NAME_ORDER,
      Key: {
        [PRIMARY_KEY_ORDER]: requestedItemId,
      },
    };
    const response2 = await db.get(params2).promise();
    if (!response2.Item) {
      return {
        statusCode: 200,
        body: `{ "Error": "No Order with requested ID - Try Again" }`,
      };
    }
    if (
      response2.Item &&
      response2.Item.user_ID === event.headers.Authorization.split(" ")[1]
    ) {
      return { statusCode: 200, body: JSON.stringify(response2.Item) };
    } else {
      return {
        statusCode: 200,
        body: `{ "Error": "No Order with requested ID - Try Again" }`,
      };
    }
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      body: `{ "Error": "Internal Server Error" }`,
    };
  }
}
```

Deploy the app using `cdk deploy`. Test all orders functionality by adding new GET request with `/orders/:orderID` to get one order.
If there is no auth token or given with wrong configartion an error will return in such case. To add Auth token from collection settings select bearer token and add user Id there. If there are no users in the database or the provided Auth is not from a registered users we recieve error message. If there is no order with provided Id or with given userID again message will be returned. These condotions are documented in above cases. If all conditions rae fullfilled results are as follows.

![One Order](./snaps/step10-01.PNG)

### 11. Create resource to delete one order

Next step is to create a resource so we can delete one order. Update "lib/simple-book-api-stack.ts" to create a lambda function to delete one order grant read write permission for ddb table. Also create lambda integration, resource and method. One thing to keep in mind DELETE method is to be used here as we are deleting data from ddb table. While defining lambda function need to define environment variables.

```js
const deleteOneOrderFunction = new lambda.Function(
  this,
  "deleteOneOrderFunction",
  {
    functionName: "Delete-One-Order-Function-Simple-Book-Api",
    runtime: lambda.Runtime.NODEJS_14_X,
    code: lambda.Code.fromAsset("lambdas"),
    handler: "deleteOneOrder.handler",
    memorySize: 1024,
    environment: {
      TABLE_NAME_USER: usersTable.tableName,
      TABLE_NAME_ORDER: allOrdersTable.tableName,
      PRIMARY_KEY_ORDER: "orderID",
    },
  }
);
usersTable.grantReadWriteData(deleteOneOrderFunction);
allOrdersTable.grantReadWriteData(deleteOneOrderFunction);
const deleteOneOrderFunctionIntegration = new apigw.LambdaIntegration(
  deleteOneOrderFunction
);
placeOrder.addMethod("DELETE", deleteOneOrderFunctionIntegration);
oneOrder.addMethod("DELETE", deleteOneOrderFunctionIntegration);
```

Create "lambdas/deleteOneOrder.ts" to define the handler for deleteOneOrder function so one order can be delete from database

```js
import * as AWS from "aws-sdk";
const db = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME_USER = process.env.TABLE_NAME_USER || "";
const TABLE_NAME_ORDER = process.env.TABLE_NAME_ORDER || "";
const PRIMARY_KEY_ORDER = process.env.PRIMARY_KEY_ORDER || "";
export const handler = async (event: any = {}): Promise<any> => {
  if (
    !event.headers.Authorization ||
    !event.headers.Authorization.split(" ")[1]
  ) {
    return {
      statusCode: 400,
      body: `{ "Error": "Provide Authentication token" }`,
    };
  }
  if (!event.pathParameters || !event.pathParameters.id) {
    return {
      statusCode: 400,
      body: `{ "Error": "You are missing the path parameter id" }`,
    };
  }
  const params1 = {
    TableName: TABLE_NAME_USER,
  };
  try {
    const response1 = await db.scan(params1).promise();
    if (response1.Count === 0) {
      return {
        statusCode: 200,
        body: `{ "message": "You are not a registered user. Register Yourself or provide correct user Key" }`,
      };
    }
    if (
      response1.Items &&
      response1.Items.filter(
        (userItem) =>
          userItem.user_ID === event.headers.Authorization.split(" ")[1]
      ).length === 0
    ) {
      return {
        statusCode: 200,
        body: `{ "message": "You are not a registered user. Register Yourself or provide correct user Key" }`,
      };
    }
    const requestedItemId = event.pathParameters.id;
    const params2 = {
      TableName: TABLE_NAME_ORDER,
      Key: {
        [PRIMARY_KEY_ORDER]: requestedItemId,
      },
    };
    const response2 = await db.get(params2).promise();
    if (!response2.Item) {
      return {
        statusCode: 200,
        body: `{ "Error": "No Order with requested ID - Try Again" }`,
      };
    }
    if (
      response2.Item &&
      response2.Item.user_ID === event.headers.Authorization.split(" ")[1]
    ) {
      await db.delete(params2).promise();
      return {
        statusCode: 200,
        body: `{ "Message": "Requested Order deleted" }`,
      };
    } else {
      return {
        statusCode: 200,
        body: `{ "Error": "No Order with requested ID - Try Again" }`,
      };
    }
  } catch (err) {
    console.log("DynamoDB error: ", err);
    return { statusCode: 500, body: err };
  }
};
```

Deploy the app using `cdk deploy`. Test all orders functionality by adding new DELETE request with `/orders/:orderID` to get one order.
If there is no auth token or given with wrong configartion or no path id an error will return in such case. To add Auth token from collection settings select bearer token and add user Id there. If there are no users in the database or the provided Auth is not from a registered users we recieve error message. If there is no order with provided Id or with given userID again message will be returned. These condotions are documented in above cases. If all conditions rae fullfilled results are as follows.
![Delete One Order](./snaps/step11-01.PNG)
