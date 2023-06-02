#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { MyvpcStack } from '../lib/myvpc-stack';

const envUSA = {
    region: 'us-east-1',
    account: '456662197705',
};
const app = new cdk.App();
new MyvpcStack(app, 'MyvpcStack', { env: envUSA });
