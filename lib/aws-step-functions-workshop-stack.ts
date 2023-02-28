import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as sfn from "aws-cdk-lib/aws-stepfunctions";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as nodejs from "aws-cdk-lib/aws-lambda-nodejs";
import { join } from "path";

export class AwsStepFunctionsWorkshopStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const lambdaFunctions = new nodejs.NodejsFunction(this, "Lambda1", {
      entry: join(__dirname, "../src/lambda/lambda1.ts"),
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: "handler",
    });

    new sfn.StateMachine(this, "StateMachine", {
      definition: sfn.Chain.start(new sfn.Pass(this, "Pass")),
    });
  }
}
