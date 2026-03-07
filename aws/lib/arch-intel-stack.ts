import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as sfn from 'aws-cdk-lib/aws-stepfunctions';
import * as tasks from 'aws-cdk-lib/aws-stepfunctions-tasks';
import { Construct } from 'constructs';

export class ArchIntelStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    /**
     * 1. STORAGE LAYER
     * DynamoDB for User Progress and Salary Dataset
     */
    const userProgressTable = new dynamodb.Table(this, 'UserProgressTable', {
      partitionKey: { name: 'PK', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'SK', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY, // For demo/development
    });

    const codebaseBucket = new s3.Bucket(this, 'CodebaseUploads', {
      encryption: s3.BucketEncryption.S3_MANAGED,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      lifecycleRules: [{ expiration: cdk.Duration.days(7) }], // Short-lived for hackathon/demo
    });

    /**
     * 2. AI & COMPUTE LAYER
     * Lambda with Bedrock Access
     */
    const bedRockAccessPolicy = new iam.PolicyStatement({
      actions: ['bedrock:InvokeModel', 'bedrock:InvokeModelWithResponseStream'],
      resources: ['*'], // In production, scope to specific model ARNs
    });

    const projectionLambda = new lambda.Function(this, 'ProjectionLambda', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset('aws/lambda/projection'),
      environment: {
        DYNAMO_TABLE: userProgressTable.tableName,
      },
    });
    projectionLambda.addToRolePolicy(bedRockAccessPolicy);
    userProgressTable.grantReadWriteData(projectionLambda);

    /**
     * 3. WORKFLOW LAYER
     * Step Function for Financial Simulator
     */
    const fetchMarketData = new tasks.DynamoGetItem(this, 'FetchMarketData', {
      key: { PK: tasks.DynamoAttributeValue.fromString(sfn.JsonPath.stringAt('$.skillId')) },
      table: userProgressTable,
      resultPath: '$.marketData',
    });

    const invokeBedrock = new tasks.LambdaInvoke(this, 'BedrockSalaryProjection', {
      lambdaFunction: projectionLambda,
      payload: sfn.TaskInput.fromObject({
        marketData: sfn.JsonPath.stringAt('$.marketData'),
        userInput: sfn.JsonPath.stringAt('$.userInput'),
      }),
      resultPath: '$.projectionResult',
    });

    const updateProgress = new tasks.DynamoPutItem(this, 'UpdateUserProgress', {
      item: {
        PK: tasks.DynamoAttributeValue.fromString(sfn.JsonPath.stringAt('$.userId')),
        SK: tasks.DynamoAttributeValue.fromString(sfn.JsonPath.stringAt('$.skillId')),
        projectedSalary: tasks.DynamoAttributeValue.fromString(sfn.JsonPath.stringAt('$.projectionResult.Payload.salary')),
      },
      table: userProgressTable,
    });

    const definition = fetchMarketData.next(invokeBedrock).next(updateProgress);

    const stepFunction = new sfn.StateMachine(this, 'FinancialGrowthOrchestrator', {
      definition,
      timeout: cdk.Duration.minutes(5),
    });

    /**
     * 4. RAG LAYER (Mocked Infrastructure for brevity)
     * Demonstrating OpenSearch Serverless Access Policies
     */
    const openSearchAccess = new iam.PolicyStatement({
      actions: ['aoss:APIAccessAll'],
      resources: ['*'],
    });
    projectionLambda.addToRolePolicy(openSearchAccess);

    // Outputs
    new cdk.CfnOutput(this, 'S3BucketName', { value: codebaseBucket.bucketName });
    new cdk.CfnOutput(this, 'StepFunctionArn', { value: stepFunction.stateMachineArn });
  }
}
