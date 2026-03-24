#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { IamStack } from '../lib/iam-stack.js';

const app = new cdk.App();
const target = app.node.tryGetContext('target') as string;

new IamStack(app, 'iam-role-stack', {
  target,
});