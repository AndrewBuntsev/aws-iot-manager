const iotApi = require("./iotApi");
const logger = require('./logger');


// display all things
async function listThings() {
    try {
        return iotApi.listThings();
    } catch (err) {
        logger.error(err);
        console.error(err);
    }
}

// create new thing
async function createThing(thingName) {
    try {
        const billingGroupName = 'test_items_billing_group';
        const thingTypeName = 'test_items';
        await iotApi.createBillingGroup(billingGroupName);
        await iotApi.createThingType(thingTypeName);
        const result = await iotApi.createThing(thingName, {}, billingGroupName, thingTypeName);
        logger.info(`Thing created: ${JSON.stringify(result)}`);
        return result;
    } catch (err) {
        logger.error(err);
        console.error(err);
    }
}

// get thing detailed info
async function describeThing(thingName) {
    try {
        const result = await iotApi.describeThing(thingName);
        return result;
    } catch (err) {
        logger.error(err);
    }
}

// delete the thing
async function deleteThing(thingName) {
    try {
        const result = await iotApi.deleteThing(thingName);
        logger.info(`The thing ${thingName} has been deleted`);
        return result;
    } catch (err) {
        logger.error(err);
        console.error(err);
    }
}

module.exports = {
    listThings,
    createThing,
    describeThing,
    deleteThing
};

