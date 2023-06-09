import { Duration, Stack, StackProps, NestedStack } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { Fn } from 'aws-cdk-lib';
import { MyVpcConstructProps, MyVpcConstruct } from './MyVpcConstruct';

export class VpcStack extends NestedStack {
    public readonly Vpc: ec2.Vpc;
    constructor(scope: Construct, id: string, props?: {}) {
        super(scope, id, props);
        console.log(`VpcStack - AZs: ${this.availabilityZones}`)
        const cidr = "10.10.0.0/16";
        // Create a VPC
        this.Vpc = new ec2.Vpc(this, 'Vpc', {
            ipAddresses: ec2.IpAddresses.cidr(cidr),
            maxAzs: 3,
            subnetConfiguration: [
                {
                    cidrMask: 24,
                    name: 'public-',
                    subnetType: ec2.SubnetType.PUBLIC,
                },
                {
                    cidrMask: 24,
                    name: 'private-isolated-',
                    subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
                }
            ]
        });
        console.log(`number of public subnet ${this.Vpc.publicSubnets.length}`);
        this.Vpc.publicSubnets.forEach((subnet, index) => {
            console.log(`subnet ${index} = ${subnet.subnetId} / ${subnet.availabilityZone} / ${subnet.ipv4CidrBlock}`);
        });
        console.log(`number of isolated subnet ${this.Vpc.isolatedSubnets.length}`);
        this.Vpc.isolatedSubnets.forEach((subnet, index) => {
            console.log(`subnet ${index} = ${subnet.subnetId} / ${subnet.availabilityZone} / ${subnet.ipv4CidrBlock}`);
        });
        console.log(`number of private subnet ${this.Vpc.privateSubnets.length}`);
        this.Vpc.privateSubnets.forEach((subnet, index) => {
            console.log(`subnet ${index} = ${subnet.subnetId} / ${subnet.availabilityZone} / ${subnet.ipv4CidrBlock}`);
        });


        const azs = this.Vpc.availabilityZones
        azs.forEach((az, index) => {
            console.log(`AZ ${index} = ${az}`);
        });

    }
}

export class Ec2Stack extends NestedStack {
    constructor(scope: Construct, id: string, props: Ec2ConstructProps) {
        super(scope, id, props);

        const securityGroup = new ec2.SecurityGroup(this, 'SecurityGroup', {
            vpc: props.vpc,
            allowAllOutbound: true,
        });
        securityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(22), 'allow ssh access from the world');
        securityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(80), 'allow http access from the world');
        const img = ec2.MachineImage.latestAmazonLinux2023();
        console.log(`img: ${img.getImage(this).imageId}`);
        // Create an EC2 instance
        const ec2Instance = new ec2.Instance(this, 'Ec2', {
            instanceType: ec2.InstanceType.of(ec2.InstanceClass.T2, ec2.InstanceSize.MICRO),
            vpc: props.vpc,
            machineImage: img,
            securityGroup: securityGroup,
        });
        // ec2Instance.addSecurityGroup(securityGroup);
    }
}

export class MainStack extends Stack {
    constructor(scope: Construct, id: string, props?: {}) {
        super(scope, id, props);

        // Create a nested VpcStack
        const vpcStack = new VpcStack(this, 'VpcStack');

        // Create an Ec2Stack and pass the subnet ID from the VpcStack
        const ec2Stack = new Ec2Stack(this, 'Ec2Stack', {
            vpc: vpcStack.Vpc,
        });
    }
}


export interface Ec2ConstructProps extends StackProps {
    vpc: ec2.IVpc;
    subnets?: ec2.ISubnet[];
}