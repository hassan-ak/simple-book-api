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

    // ********************************
    // ***      Methods on API      ***
    // ********************************

    // Method for root path ("/")
    api.root.addMethod("GET", welcomeFunctionIntegration);
  }
}
