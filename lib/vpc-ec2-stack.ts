import { Duration, Stack, StackProps, NestedStack } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { Fn } from 'aws-cdk-lib';
import { MyVpcConstructProps, MyVpcConstruct } from './MyVpcConstruct';

export class VpcStack extends NestedStack {
    public readonly Vpc: ec2.Vpc;
    public readonly Subnets: ec2.Subnet[] = [];
    constructor(scope: Construct, id: string, props?: {}) {
        super(scope, id, props);
        console.log(`VpcStack - AZs: ${this.availabilityZones}`)
        const cidr = "10.10.0.0/16";
        // Create a VPC
        this.Vpc = new ec2.Vpc(this, 'Vpc', {
            ipAddresses: ec2.IpAddresses.cidr(cidr),
            maxAzs: 10,
            // subnetConfiguration: [{
            //     cidrMask: 24,
            //     name: 'ingress',
            //     subnetType: ec2.SubnetType.PUBLIC,
            // }]
        });
        console.log(`number of public subnet ${this.Vpc.publicSubnets.length}`);
        console.log(`number of private subnet ${this.Vpc.privateSubnets.length}`);
        const azs = this.Vpc.availabilityZones
        azs.forEach((az, index) => {
            console.log(`AZ ${index} = ${az}`);
        });

    }
}

export class Ec2Stack extends NestedStack {
    constructor(scope: Construct, id: string, props: Ec2ConstructProps) {
        super(scope, id, props);

        const img = new ec2.AmazonLinuxImage({ generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2023 });
        console.log(`img: ${img}`);
        // Create an EC2 instance
        const ec2Instance = new ec2.Instance(this, 'Ec2', {
            instanceType: ec2.InstanceType.of(ec2.InstanceClass.T2, ec2.InstanceSize.MICRO),
            vpc: props.vpc,
            machineImage: img,
        });
    }
}

export class MainStack extends Stack {
    constructor(scope: Construct, id: string, props?: {}) {
        super(scope, id, props);
        console.log(`MainStack - AZs: ${this.availabilityZones}`)

        // Create a nested VpcStack
        const vpcStack = new VpcStack(this, 'VpcStack', props);

        // Create an Ec2Stack and pass the subnet ID from the VpcStack
        // const ec2Stack = new Ec2Stack(this, 'Ec2Stack', {
        //     vpc: vpcStack.Vpc,
        // });
    }
}


export interface Ec2ConstructProps extends StackProps {
    vpc: ec2.IVpc;
}