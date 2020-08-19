
const AWS = require('aws-sdk');
const util = require('util');

// configure the AWS connection
const iot = new AWS.Iot({
    region: process.env.AWS_REGION,
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY
});


//
// API customized 'promisified' functions
//

// create billing group
exports.createBillingGroup = async function (billingGroupName) {
    const params = {
        billingGroupName: billingGroupName,
        billingGroupProperties: {
            billingGroupDescription: 'Test Items Billing Group'
        },
        tags: [
            {
                Key: 'category',
                Value: 'test_items'
            }
        ]
    };

    return (util.promisify(iot.createBillingGroup).bind(iot))(params);
}

// create thing type
exports.createThingType = async function (typeName) {
    const params = {
        thingTypeName: typeName,
        tags: [
            {
                Key: 'category',
                Value: 'test_items'
            }
        ],
        thingTypeProperties: {
            searchableAttributes: [
                'test_items'
            ],
            thingTypeDescription: 'Test Item Type'
        }
    };

    return (util.promisify(iot.createThingType).bind(iot))(params);
}

// create thing
exports.createThing = async function (thingName, attributes, billingGroupName, typeName) {
    const params = {
        thingName: thingName,
        attributePayload: {
            attributes: attributes,
            merge: true
        },
        billingGroupName: billingGroupName,
        thingTypeName: typeName
    };

    return (util.promisify(iot.createThing).bind(iot))(params);
}

// describe thing
exports.describeThing = async function (thingName) {
    const params = {
        thingName: thingName
    };

    return (util.promisify(iot.describeThing).bind(iot))(params);
}

// update thing
exports.updateThing = async function (name, attributes) {
    const params = {
        thingName: name,
        attributePayload: {
            attributes: attributes,
            merge: true
        }
    };

    return (util.promisify(iot.updateThing).bind(iot))(params);
}

// delete thing
exports.deleteThing = async function (name) {
    const params = {
        thingName: name
    };

    return (util.promisify(iot.deleteThing).bind(iot))(params);
}

// list things
exports.listThings = async function () {
    return (util.promisify(iot.listThings).bind(iot))({});
}

// create keys and certificate
exports.createKeysAndCertificate = async function () {
    const params = { setAsActive: true };

    return (util.promisify(iot.createKeysAndCertificate).bind(iot))(params);
}

// attach certificate to the policy
exports.attachPolicy = async function (policyName, certificateArn) {
    const params = {
        policyName: policyName,
        target: certificateArn
    };

    return (util.promisify(iot.attachPolicy).bind(iot))(params);
}

// attach certificate to the thing
exports.attachThingPrincipal = async function (certificateArn, thingName) {
    const params = {
        principal: certificateArn,
        thingName: thingName
    };

    return (util.promisify(iot.attachThingPrincipal).bind(iot))(params);
}

