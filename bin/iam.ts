#!/usr/bin/env node
import { IamStack } from '../lib/iam-stack.js';
import * as cdk from 'aws-cdk-lib';

const app = new cdk.App();
const target = app.node.tryGetContext('target') as string;

// eslint-disable-next-line awscdk/no-construct-stack-suffix
new IamStack(app, 'IamRoleStack', {
  target,
});