import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { aws_lambda as lambda } from "aws-cdk-lib";
import { aws_apigateway as apigw } from "aws-cdk-lib";

export class SimpleBookApiStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // ********************************
    // ***     Lambda Functions     ***
    // ********************************
    // Lambda function to display welcome message
    const welcomeFunction = new lambda.Function(this, "welcomeFunction", {
      functionName: "Welcome-Function-Simple-Book-Api",
      runtime: lambda.Runtime.NODEJS_14_X,
      code: lambda.Code.fromAsset("lambdas"),
      handler: "welcome.handler",
      memorySize: 1024,
    });
    // Lmbda function to check API status
    const statusFunction = new lambda.Function(this, "statusFunction", {
      functionName: "Status-Function-Simple-Book-Api",
      runtime: lambda.Runtime.NODEJS_14_X,
      code: lambda.Code.fromAsset("lambdas"),
      handler: "status.handler",
      memorySize: 1024,
    });

    // ********************************
    // ***         Rest API         ***
    // ********************************
    // Rest API using API gateway
    const api = new apigw.RestApi(this, "simpleBookApi", {
      restApiName: "Simple Book Api",
    });

    // ********************************
    // ***  API Lambda Integration  ***
    // ********************************
    // Lambda integration for welcome function
    const welcomeFunctionIntegration = new apigw.LambdaIntegration(
      welcomeFunction
    );
    // Lambda integration for status function
    const statusFunctionIntegration = new apigw.LambdaIntegration(
      statusFunction
    );

    // ********************************
    // ***     Resources of API     ***
    // ********************************
    // Status resources
    const status = api.root.addResource("status");

    // ********************************
    // ***      Methods on API      ***
    // ********************************
    // Method for root path ("/")
    api.root.addMethod("GET", welcomeFunctionIntegration);
    // Method for status path ("/status")
    status.addMethod("GET", statusFunctionIntegration);

    // ********************************
    // *** CORS option for resource ***
    // ********************************
    addCorsOptions(status);
  }
}

// ********************************
// ***   CORS Option Function   ***
// ********************************
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
