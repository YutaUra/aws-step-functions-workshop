import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as sfn from "aws-cdk-lib/aws-stepfunctions";
import * as tasks from "aws-cdk-lib/aws-stepfunctions-tasks";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as nodejs from "aws-cdk-lib/aws-lambda-nodejs";
import { join } from "path";

export class AwsStepFunctionsWorkshopStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const parseSitemapLambda = new nodejs.NodejsFunction(
      this,
      "ParseSitemapLambda",
      {
        entry: join(__dirname, "../src/lambda/parse-sitemap.ts"),
        runtime: lambda.Runtime.NODEJS_18_X,
      }
    );

    const pictureSiteLambda = new nodejs.NodejsFunction(
      this,
      "PictureSiteLambda",
      {
        entry: join(__dirname, "../src/lambda/picture-site.ts"),
        runtime: lambda.Runtime.NODEJS_18_X,
        bundling: {
          nodeModules: ["playwright-aws-lambda", "playwright-core"],
        },
        timeout: cdk.Duration.minutes(3),
        memorySize: 1024,
      }
    );

    new sfn.StateMachine(this, "StateMachine", {
      definition: sfn.Chain.start(
        new tasks.LambdaInvoke(this, "ParseSitemap", {
          lambdaFunction: parseSitemapLambda,
          outputPath: "$.Payload",
        })
      ).next(
        new sfn.Map(this, "Map", {
          maxConcurrency: 5,
          parameters: {
            "url.$": "$$.Map.Item.Value",
          },
        }).iterator(
          new tasks.LambdaInvoke(this, "PictureSite", {
            lambdaFunction: pictureSiteLambda,
            outputPath: "$.Payload",
          })
        )
      ),
    });
  }
}
