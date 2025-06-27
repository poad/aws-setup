import { Stack, StackProps } from 'aws-cdk-lib';
import { AccountPrincipal, Effect, Group, ManagedPolicy, PolicyDocument, PolicyStatement, Role } from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';

interface IamStackProps extends StackProps {
  target: string,
}

export class IamStack extends Stack {
  constructor(scope: Construct, id: string, props: IamStackProps) {
    super(scope, id, props);

    const { target } = props;

    new Role(this, 'PowerUserRole', {
      roleName: 'PowerUserRole',
      assumedBy: new AccountPrincipal(target),
      managedPolicies: [
        {
          managedPolicyArn: 'arn:aws:iam::aws:policy/PowerUserAccess',
        },
        {
          managedPolicyArn: 'arn:aws:iam::aws:policy/IAMFullAccess',
        },
      ],
    });

    new Group(this, 'UserGoorp', {
      groupName: 'PowerUsers',
      managedPolicies: [
        new ManagedPolicy(this, 'AssumePolicy', {
          statements: [
            new PolicyStatement({
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

    new ManagedPolicy(this, 'CdkAssumeRolePolicy', {
      managedPolicyName: 'CdkAssumeRolePolicy',
      document: new PolicyDocument({
        minimize: true,
        statements: [
          new PolicyStatement({
            effect: Effect.ALLOW,
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
