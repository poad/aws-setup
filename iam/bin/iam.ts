#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { IamStack } from '../lib/iam-stack';

const app = new cdk.App();
const host = app.node.tryGetContext('host') as string;
const target = app.node.tryGetContext('target') as string;

new IamStack(app, 'iam-role-stack', {
  target,
});