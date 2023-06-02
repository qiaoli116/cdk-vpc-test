import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { Fn } from 'aws-cdk-lib';
export class MyVpcConstruct extends Construct {
    private readonly Vpc: ec2.Vpc;
    private readonly Subnets: ec2.Subnet[] = [];

    constructor(scope: Construct, id: string, props: MyVpcConstructProps) {
        super(scope, id);

        // Create a VPC with a CIDR of 10.x.0.0/16
        this.Vpc = new ec2.Vpc(this, 'MyVpc', {
            ipAddresses: ec2.IpAddresses.cidr(props.cidr),
            maxAzs: 10,
        });


        // Get the list of AZs in the current region
        const azs = this.Vpc.availabilityZones;
        const cidrBlock = Fn.cidr(props.cidr, azs.length, '8');
        for (let i = 0; i < azs.length; i++) {
            console.log(`AZ ${i} = ${azs[i]}`);
            this.Subnets.push(new ec2.Subnet(this, `Subnet-${i}`, {
                vpcId: this.Vpc.vpcId,
                availabilityZone: azs[i],
                cidrBlock: Fn.select(i, cidrBlock),
                mapPublicIpOnLaunch: true,
            }));
        }

    }
}

export interface MyVpcConstructProps {
    cidr: string;
}