import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';

interface IamStackProps extends cdk.StackProps {
  target: string,
}

export class IamStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: IamStackProps) {
    super(scope, id, props);

    const { target } = props;

    new cdk.aws_iam.Role(this, 'PowerUserRole', {
      roleName: 'PowerUserRole',
      assumedBy: new cdk.aws_iam.AccountPrincipal(target),
      managedPolicies: [
        cdk.aws_iam.ManagedPolicy.fromAwsManagedPolicyName('arn:aws:iam::aws:policy/PowerUserAccess'),
        cdk.aws_iam.ManagedPolicy.fromAwsManagedPolicyName('arn:aws:iam::aws:policy/IAMFullAccess'),
      ],
    });

    new cdk.aws_iam.Group(this, 'UserGoorp', {
      groupName: 'PowerUsers',
      managedPolicies: [
        new cdk.aws_iam.ManagedPolicy(this, 'AssumePolicy', {
          statements: [
            new cdk.aws_iam.PolicyStatement({
              actions: [
                'sts:AssumeRole',
              ],
              resources: [
                `arn:aws:iam::${target}:role/PowerUserRole`,
              ],
            }),
          ],
        }),
      ],
    });

    new cdk.aws_iam.ManagedPolicy(this, 'CdkAssumeRolePolicy', {
      managedPolicyName: 'CdkAssumeRolePolicy',
      document: new cdk.aws_iam.PolicyDocument({
        minimize: true,
        statements: [
          new cdk.aws_iam.PolicyStatement({
            effect: cdk.aws_iam.Effect.ALLOW,
            actions: [
              'sts:AssumeRole',
            ],
            resources: [
              `arn:aws:iam::${this.account}:role/cdk-*`,
            ],
          }),
        ],
      }),
    });
  }
}
