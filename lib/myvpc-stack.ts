import { Duration, Stack, StackProps } from 'aws-cdk-lib';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as subs from 'aws-cdk-lib/aws-sns-subscriptions';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import { Construct } from 'constructs';
import { MyVpcConstructProps, MyVpcConstruct } from './MyVpcConstruct';
import { Fn } from 'aws-cdk-lib';

export class MyvpcStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    console.log(`region: ${this.region}`);
    console.log(`account: ${this.account}`);
    console.log(`AZs: ${this.availabilityZones}`)
    // Create a VPC with a CIDR of 10.1.0.0/16
    const myVpc = new MyVpcConstruct(this, 'MyVpc', {
      cidr: '10.1.0.0/16',
    });
  }
}
