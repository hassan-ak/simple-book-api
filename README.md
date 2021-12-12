# BootCamp2021 Project04: Simple Book API

By doing this project we are able to learn following:-

- How to create a cdk app
- How to create a lambda function
  - Define lambda handler code
- How to crate a rest api using api gateway
  - Define api lambda integration
  - Add resources to the root
  - Add methods
- Test API using postman
  - Get request

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

### 3. Create path to check status

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
