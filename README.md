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
  - Delete Request
  - Patch Request
- How to create DynamoDB table
  - Put data in table
  - Scan table for data
  - Delete data from table
  - Update data in table

## Usage

<table>
  <thead>
    <tr>
      <th>Sr. No.</th>
      <th>Description</th>
      <th>Method</th>
      <th>Path</th>
      <th>Auth.</th>
      <th>Request Body</th>
      <th>Query</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td rowspan=1>1</td>
      <td rowspan=1>API base URL</td>
      <td rowspan=1>GET</td>
      <td rowspan=1>/</td>
      <td rowspan=1>No</td>
      <td rowspan=1></td>
      <td rowspan=1></td>
    </tr>
    <tr>
      <td rowspan=1>2</td>
      <td rowspan=1>Check Status of API</td>
      <td rowspan=1>GET</td>
      <td rowspan=1>/status</td>
      <td rowspan=1>No</td>
      <td rowspan=1></td>
      <td rowspan=1></td>
    </tr>
    <tr>
      <td rowspan=1>3</td>
      <td rowspan=1>Add book</td>
      <td rowspan=1>POST</td>
      <td rowspan=1>/books</td>
      <td rowspan=1>No</td>
      <td rowspan=1><sub>{<br>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp"book": "Book Name",<br>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp"author": "Authos's Name",<br>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp"isbn": "Book isbn",<br>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp"book_type": "type",<br>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp"price": Book Price,<br>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp"stock": Number of books,<br>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp"available": true<br>}</sub></td>
      <td rowspan=1></td>
    </tr>
    <tr>
      <td rowspan=1>4</td>
      <td rowspan=1>Get all books</td>
      <td rowspan=1>GET</td>
      <td rowspan=1>/books</td>
      <td rowspan=1>No</td>
      <td rowspan=1></td>
      <td rowspan=1><sub>book_type<br>limit</sub></td>
    </tr>
    <tr>
      <td rowspan=1>5</td>
      <td rowspan=1>Get one book</td>
      <td rowspan=1>GET</td>
      <td rowspan=1>/books/:bookID</td>
      <td rowspan=1>No</td>
      <td rowspan=1></td>
      <td rowspan=1></td>
    </tr>
    <tr>
      <td rowspan=1>6</td>
      <td rowspan=1>Register User</td>
      <td rowspan=1>POST</td>
      <td rowspan=1>/api-clients</td>
      <td rowspan=1>No</td>
      <td rowspan=1><sub>{<br>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp"userName": "User's Name",<br>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp"userEmail": "User's Email"<br>}</sub></td>
      <td rowspan=1></td>
    </tr>
    <tr>
      <td rowspan=1>7</td>
      <td rowspan=1>Place Order</td>
      <td rowspan=1>POST</td>
      <td rowspan=1>/orders</td>
      <td rowspan=1>Yes</td>
      <td rowspan=1><sub>{<br>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp"bookID": "ID of Book",<br>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp"noOfBooks": "No. of Books"<br>}</sub></td>
      <td rowspan=1></td>
    </tr>
    <tr>
      <td rowspan=1>8</td>
      <td rowspan=1>Get all Orders</td>
      <td rowspan=1>GET</td>
      <td rowspan=1>/orders</td>
      <td rowspan=1>Yes</td>
      <td rowspan=1></td>
      <td rowspan=1></td>
    </tr>
    <tr>
      <td rowspan=1>9</td>
      <td rowspan=1>Get one Order</td>
      <td rowspan=1>GET</td>
      <td rowspan=1>/orders/:orderID</td>
      <td rowspan=1>Yes</td>
      <td rowspan=1></td>
      <td rowspan=1></td>
    </tr>
    <tr>
      <td rowspan=1>10</td>
      <td rowspan=1>Delete an Order</td>
      <td rowspan=1>DELETE</td>
      <td rowspan=1>/orders/:orderID</td>
      <td rowspan=1>Yes</td>
      <td rowspan=1></td>
      <td rowspan=1></td>
    </tr>
    <tr>
      <td rowspan=1>11</td>
      <td rowspan=1>Update an Order</td>
      <td rowspan=1>PATCH</td>
      <td rowspan=1>/orders/:orderID</td>
      <td rowspan=1>Yes</td>
      <td rowspan=1><sub>{<br>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp"noOfBooks": "No of Books"<br>}</sub></td>
      <td rowspan=1></td>
    </tr>
  </tbody>
</table>

## Steps to code "Simple Book API"

### 1. Create a basic cdk app

Create and navigate to new directory using `mkdir simple-book-api && cd simple-book-api`. Create a new cdk project using `cdk init app --language typescript`. As typescript is used for coding so transcribing the code to javascript is necessary, one way is to build the app in the end other is to use `npm run watch` to auto compile the code whenever any file is changed so use the latter option. To synthesize the app use `cdk synth` this will output the cloud formation template. Bootstrap the app using `cdk bootstrap`, bootstrapping is necessary only in case when app is deployed for the first time. Deploy the app using `cdk deploy`.

### 2. Create a basic REST API

Purpose of this project is to create a rest api where one can send different requests. So the very first step is to make a rest api (root path) from where one can send different requests. Create a welcome message lambda function in the stack by updating "lib/simple-book-api-stack.ts". As this project is created using "cdk 2" so no need to install aws modules separately, all of them can be imported from "aws-cdk-lib", for any older version all modules to be installed separately.

```js
// Lambda Function
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
// New Rest Api
import { aws_apigateway as apigw } from "aws-cdk-lib";
const api = new apigw.RestApi(this, "simpleBookApi", {
  restApiName: "Simple Book Api",
});
```

When ever one sends a request to the api some lambda function is to be invoked, so create api integration for the lambda function by updating "lib/simple-book-api-stack.ts".

```js
// Lambda integration
const welcomeFunctionIntegration = new apigw.LambdaIntegration(welcomeFunction);
```

Api is already defined which creates a base URL. Now there is a need of a method on the root path so one is able to send a request and invoke the lambda function. Thus update "lib/simple-book-api-stack.ts" to add a GET method to the root path and attach welcome function integration to it.

```js
// Add method to api
api.root.addMethod("GET", welcomeFunctionIntegration);
```

Create "lambdas/welcome.ts" to define handler for the welcome lambda function. This will return simple welcome message when the function is invoked successfuly or an error message in-case of failure.

```js
// lambda handler
export async function handler() {
  try {
    return {
      statusCode: 201,
      body: `{ "message": "Welcome to Simple Book API" }`,
    };
  } catch (error) {
    return { statusCode: 500, body: error };
  }
}
```

For all the upcomming steps, methods to create a lambda function, integrating lambda function,adding a method and creating handler code will always remain the same so for checking out the detailed code refer to respective file.

Deploy the app using `cdk deploy`. This will deploy the app on aws and returns the api base URL on console. Deployed stack can be seen in the cloudformation console, lambda in the lambda console and rest api in the apigateway console. API url can also be accessed in api settings in the console which will be of the following form

```
https://**********.execute-api.*********.amazonaws.com/prod
```

Rest API's can be tested by various ways. One is to use "postman". Create a new collection in a postman workspace. Create a new GET request in the collection and provide API URL in it. One can make a new varibale to store the URL so it is easy to use while creating new requests. Send request and after successful execution reponse will be as follows. While adding methods "GET" option is selected so in case one send a request other than GET will results in a "Missing Authentication Token" message.

![Welcome Message](./snaps/step0201.PNG)

### 3. Create method to check status

Create a method to check status of the api by adding a subpath to the API. For that first update "lib/simple-book-api-stack.ts" and create a new lambda function, create api lambda integration, add status resource to root path (new path defination) and add a get method on the lambda integartion for status resource. Also add CORS options to resource.

```js
// Add resource
const status = api.root.addResource("status");
// Method for resource
status.addMethod("GET", statusFunctionIntegration);
// CORS options for the resource
addCorsOptions(status);
```

Cross-origin resource sharing (CORS) is a browser security feature that restricts cross-origin HTTP requests that are initiated from scripts running in the browser. So there is need to define CORS function.

```js
// CORS options function
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

Create "lambdas/status.ts" to define handler for the status lambda function. This will return simple message as response both in case of success or failure.

Deploy the app using `cdk deploy` and then test the api using postman. For testing create new GET request with `/status` path and send the request. After successful execution reponse will be as follows

![API Status Ok](./snaps/step0301.PNG)

### 4. Create method to add new book

This api is about orders for a book so first of all we need a method to add books to the database. In this project DynamoDB is used as database. Update "lib/simple-book-api-stack.ts" to define a new dynamodb table for storing books.

```js
// DynamoDB Table
import { aws_dynamodb as ddb } from "aws-cdk-lib";
const allBooksTable = new ddb.Table(this, "AllBooksTable", {
  tableName: "Simple_Book_Api_All_Books",
  partitionKey: {
    name: "bookID",
    type: ddb.AttributeType.STRING,
  },
});
```

Create a lambda function to add new book to database need to define environment variables and grant read write permission for all books table. Also create lambda integration, resource, method and Cors options. One thing to keep in mind POST method is to be used here as we are adding data to ddb table.

```js
// Lambda function
const addBooksFunction = new lambda.Function(this, "addBooksFunction", {
  ---
  ---
  ---
  environment: {
    PRIMARY_KEY_ALL: "bookID",
    TABLE_NAME_ALL: allBooksTable.tableName,
  },
});
// DynamoDb table permissions
allBooksTable.grantReadWriteData(addBooksFunction);
```

Install "aws-sdk" using `npm i aws-sdk` as we need to use AWS resources in the lambda function. Create "lambdas/addBooks.ts" to define the handler for addBooks function so new book can be added into the database. New book can be added by provding book data in the request body. Before adding a book to the database there are multiple checks such as is the body is provided with correct number of parameters in the request and all required parameters are given in correct format. Deploy the app using `cdk deploy`. All our changes will be deployed and a new DynamoDB table will be created as well.

For testing create new POST request on postman with sub path `/books`. When no body is given sending this request will return an invalid request message. In case more than required parameters are given in body again same invalid request message will be returned.

![No Request body](./snaps/step0401.PNG)

![More than required params.](./snaps/step0402.PNG)

If some of the parameters are missing or in wrong format another error message will be recieved.

![Missing params or invalid format](./snaps/step0403.PNG)

If all the conditions are staisfied book will be added to table.

![Book Added](./snaps/step0404.PNG)

If there is some error with DynamoDB it will be returned as well.

### 5. Create method to list all books

Create a method so we can get all books from the database. Update "lib/simple-book-api-stack.ts" to create a lambda function to get all books from database and set environment variables, grant read write permission for all books table, lambda integration and a method. One thing to keep in mind GET method is to be used here as we are getting data from ddb table. We need to define request parameters while adding a method to books resource.

```js
// Method with request parameters
books.addMethod("GET", allBooksFunctionIntegration, {
  requestParameters: {
    "method.request.querystring.book_type": false,
    "method.request.querystring.limit": false,
  },
});
```

Create "lambdas/allBooks.ts" to define the handler for allBooks function so books can be listed from database. When there is no book in db a message will be returned, if format for query parameter is wrong message to be returned.When no query parameters are given all books will be rturned. We can also query based on book type and number of books. If there is no book of such type relevent message to be returned again. Deploy the app using `cdk deploy`.

Test the API using postman.For testing create new GET request on postman with sub path `/books`.
When there are no books stored in the dynamoDB table a message will be returned stating no books available.

![All Books with empty database](./snaps/step0501.PNG)

We can also add query parameters and when query parameters are given but book_type mismatch or limit not numeric again an error will be returned.

![book_type in query is incorrect](./snaps/step0502.PNG)

![limit in query is not numeric](./snaps/step0503.PNG)

If there is no book with requested book type again a message will be returned as follows.

![No book with requested type](./snaps/step0504.PNG)

Adding correct query parameters in correct format will return results as requested and one more thing any query other than book_type and limit will not be processed.

![Query prameters with request](./snaps/step0505.PNG)

If there are books in database and no query all books will be returned

![All Books](./snaps/step0506.PNG)

### 6. Create method to list one book

Create a method so we can get one book from the database. Update "lib/simple-book-api-stack.ts" to create a lambda function to get one book from database and set environment variables, grant read write permission for all books table, lambda integration, resource to books resource a method and CORS options.. One thing to keep in mind GET method is to be used here as we are getting data from ddb table.

```js
// Resource to another resource
const oneBook = books.addResource("{id}");
```

Create "lambdas/oneBook.ts" to define the handler for oneBook function so one book can be listed from database. Need a book_id in request path and if no book with requested id will returns a message. Deploy the app using `cdk deploy`.

Test the API using postman.For testing create new GET request on postman with sub path `/books/:book_id`. If there is no book in the database with requested id a message telling about no book will be returned.

![Single book not in database](./snaps/step0601.PNG)

And if book is present it will be returned.

![Single book](./snaps/step0602.PNG)

### 7. Create method for user Auth.

Create a method so we can register a user as we need to manage orders thus a user should be registered with the api. Update "lib/simple-book-api-stack.ts" to create a DynamoDb table to store user data and lambda function to register user in database and grant read write permission for users table. Also create lambda integration, resource to root a method and CORS options.. One thing to keep in mind POST method is to be used here as we are putting data to ddb table. While defining lambda function need to define environment variables. Create "lambdas/userAuth.ts" to define the handler for userAuth function so user can b registered. If no body is given or more than required parameters given or few parameters are missing or email is in wrong format invalid request message will be returned. If there is already registered user with same email user data will be displayed and in case every thing goes well user will be registered. Deploy the app using `cdk deploy`.

Test user Auth functionality by adding new Post request with `/api-clients` to register new user. If there is no request body, more or less than necessary parameters are given we will recieve an invalid request message as in step 04 (add new book). If while registering email is given in wrong format an invalid request message will be returned.

![Wrong email format](./snaps/step0701.PNG)

If user is already registered user details will be displayed with relevent message.

![Already registered user](./snaps/step0702.PNG)

If every thing goes well user will be registered

![register user](./snaps/step0703.PNG)

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

### 12. Create resource to update one order

Next step is to create a resource so we can update one order. Update "lib/simple-book-api-stack.ts" to create a lambda function to update one order grant read write permission for ddb table. Also create lambda integration, resource and method. One thing to keep in mind PATCH method is to be used here as we are updating data from ddb table. While defining lambda function need to define environment variables.

```js
const updateOneOrderFunction = new lambda.Function(
  this,
  "updateOneOrderFunction",
  {
    functionName: "Update-One-Order-Function-Simple-Book-Api",
    runtime: lambda.Runtime.NODEJS_14_X,
    code: lambda.Code.fromAsset("lambdas"),
    handler: "updateOneOrder.handler",
    memorySize: 1024,
    environment: {
      TABLE_NAME_USER: usersTable.tableName,
      TABLE_NAME_ORDER: allOrdersTable.tableName,
      PRIMARY_KEY_ORDER: "orderID",
    },
  }
);
usersTable.grantReadWriteData(updateOneOrderFunction);
allOrdersTable.grantReadWriteData(updateOneOrderFunction);
const updateOneOrderFunctionIntegration = new apigw.LambdaIntegration(
  updateOneOrderFunction
);
orders.addMethod("PATCH", updateOneOrderFunctionIntegration);
oneOrder.addMethod("PATCH", updateOneOrderFunctionIntegration);
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
  if (!event.body || Object.keys(JSON.parse(event.body)).length >= 2) {
    return {
      statusCode: 400,
      body: `Invalid Request, You are missing the parameter body or giving too many parameters. Give parameters in the following format.\n {
        "noOfBooks": "No of Books to order"
        }`,
    };
  }
  const item =
    typeof event.body == "object" ? event.body : JSON.parse(event.body);
  if (
    !item.noOfBooks ||
    isNaN(item.noOfBooks) ||
    !Number.isInteger(item.noOfBooks) ||
    item.noOfBooks < 1
  ) {
    return {
      statusCode: 400,
      body: `Invalid Request, Give No. of books to order in the following format.\n{
          "noOfBooks": "No of Books to order"
        }`,
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
  const editedItemProperties = Object.keys(item);
  const firstProperty = editedItemProperties.splice(0, 1);
  const params2: any = {
    TableName: TABLE_NAME_ORDER,
    Key: {
      [PRIMARY_KEY_ORDER]: requestedItemId,
    },
    UpdateExpression: `set ${firstProperty} = :${firstProperty}`,
    ExpressionAttributeValues: {},
    ReturnValues: "UPDATED_NEW",
  };
  params2.ExpressionAttributeValues[`:${firstProperty}`] =
    item[`${firstProperty}`];
  editedItemProperties.forEach((property) => {
    params2.UpdateExpression += `, ${property} = :${property}`;
    params2.ExpressionAttributeValues[`:${property}`] = item[property];
  });
  const response2 = await db.get(params2).promise();
  if (!response2.Item) {
    return {
      statusCode: 400,
      body: `{ "Error": "No Order with requested ID - Try Again" }`,
    };
  }
  try {
    if (
      response2.Item &&
      response2.Item.user_ID === event.headers.Authorization.split(" ")[1]
    ) {
      await db.update(params2).promise();
      return {
        statusCode: 200,
        body: `{ "Message": "Order Updated" }`,
      };
    } else {
      return {
        statusCode: 200,
        body: `{ "Error": "No Order with requested ID - Try Again" }`,
      };
    }
  } catch (error) {
    return { statusCode: 500, body: error };
  }
};
```

Deploy the app using `cdk deploy`. Test all orders functionality by adding new PATCH request with `/orders/:orderID` to get one order.
If there is no auth token or given with wrong configartion or no path id or wrong format in body an error will return in such case. To add Auth token from collection settings select bearer token and add user Id there. If there are no users in the database or the provided Auth is not from a registered users we recieve error message. If there is no order with provided Id or with given userID again message will be returned. These condotions are documented in above cases. If all conditions rae fullfilled results are as follows.

![Delete One Order](./snaps/step12-01.PNG)

## Reading Material

- [Simple Book Api](https://github.com/vdespa/introduction-to-postman-course/blob/main/simple-books-api.md)
