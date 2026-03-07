import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';

export class ArchIntelStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // 1. S3 Bucket for code artifacts (Free Tier: 5GB Standard)
    const codeBucket = new s3.Bucket(this, 'ArchIntelCodeUploads', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      encryption: s3.BucketEncryption.S3_MANAGED,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
    });

    // 2. DynamoDB Table for Analysis History (Free Tier: 25GB)
    const historyTable = new dynamodb.Table(this, 'ArchIntelHistory', {
      partitionKey: { name: 'userId', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'timestamp', type: dynamodb.AttributeType.NUMBER },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST, // Stay in free tier easily
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    // 3. Lambda Security Scanner (Free Tier: 1M reqs)
    const securityScanner = new lambda.Function(this, 'ArchIntelSecurityScanner', {
      functionName: 'ArchIntelSecurityScanner',
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'index.handler',
      code: lambda.Code.fromInline(`
        exports.handler = async (event) => {
          const body = typeof event.body === 'string' ? JSON.parse(event.body) : event;
          const code = body.code || '';
          
          const issues = [];
          if (/(AKIA[0-9A-Z]{16})/i.test(code)) issues.push("AWS Secret Key Pattern Detected");
          if (/(sk_live_[0-9a-zA-Z]{24})/i.test(code)) issues.push("Stripe Secret Key Detected");
          if (/(password\\s*=\\s*['"][^'"]+['"])/i.test(code)) issues.push("Hardcoded Password Detected");
          
          return {
            statusCode: 200,
            body: JSON.stringify({ 
              is_safe: issues.length === 0, 
              findings: issues 
            }),
            findings: issues
          };
        };
      `),
    });

    // 4. IAM Permissions for Next.js Application User
    const appUser = new iam.User(this, 'ArchIntelAppUser');
    
    // Policy for Bedrock Reasoning (Promotional Credits usage)
    appUser.addToPolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: [
        'bedrock:InvokeModel', 
        'bedrock:InvokeModelWithResponseStream',
        'bedrock:ListFoundationModels'
      ],
      resources: ['*'], 
    }));

    // Policy for Lambda Invocation
    appUser.addToPolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ['lambda:InvokeFunction'],
      resources: [securityScanner.functionArn],
    }));

    // Policy for S3 Access
    codeBucket.grantReadWrite(appUser);

    // Policy for DynamoDB Access
    historyTable.grantReadWriteData(appUser);

    // Outputs for Environment Variables
    new cdk.CfnOutput(this, 'S3BucketName', { value: codeBucket.bucketName });
    new cdk.CfnOutput(this, 'LambdaArn', { value: securityScanner.functionArn });
    new cdk.CfnOutput(this, 'DynamoTableName', { value: historyTable.tableName });
  }
}

