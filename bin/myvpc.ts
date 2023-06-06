#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { MyvpcStack } from '../lib/myvpc-stack';
import { MainStack } from '../lib/vpc-ec2-stack';

const envUSA = {
    region: 'us-east-1',
    account: '928325183766',
};
const app = new cdk.App();
new MyvpcStack(app, 'MyvpcStack', { env: envUSA });
new MainStack(app, 'MainStack', { env: envUSA })
