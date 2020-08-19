const awsIot = require('aws-iot-device-sdk');
const logger = require('./logger');
const thingManager = require("./thingManager");
const { SHOW_METADATA } = require('./settings');


// show the thing shadow
async function showShadow(thingName) {
    try {
        const thing = await thingManager.describeThing(thingName);

        //Check if the thing exists first
        if (!thing) {
            console.log(`The thing ${thingName} does not exist. Create the thing first`);
            logger.info(`Attempt to show shadow for nonexistent thing ${thingName}`);
            return;
        }

        const thingShadows = awsIot.thingShadow({
            clientId: 'showShadowClient',
            host: process.env.HOST,
            protocol: 'wss',
            debug: false,
            accessKeyId: process.env.ACCESS_KEY_ID,
            secretKey: process.env.SECRET_ACCESS_KEY
        });

        thingShadows.on('connect', function () {
            thingShadows.register(thingName, {}, function () {
                thingShadows.get(thingName);
            });
        });

        thingShadows.on('status',
            function (thingName, stat, clientToken, stateObject) {
                if (!stateObject || stateObject.code == 404) {
                    // shadow does not exist, let's create it!
                    thingShadows.update(thingName, { state: { desired: {} } });
                } else {
                    const displayableState = SHOW_METADATA ? stateObject :
                        stateObject.state.desired ? stateObject.state.desired : stateObject.state;
                    console.log(displayableState);
                    thingShadows.unregister(thingName);
                    thingShadows.end();
                }
            });
    } catch (err) {
        console.error(err);
        logger.error(err);
    }
}

// set shadow value
async function setShadowValue(thingName, fieldName, fieldValue) {
    try {
        const thing = await thingManager.describeThing(thingName);

        //Check if the thing exists first
        if (!thing) {
            console.log(`The thing ${thingName} does not exist. Create the thing first`);
            logger.info(`Attempt to update shadow for nonexistent thing ${thingName}`);
            return;
        }

        const thingShadows = awsIot.thingShadow({
            clientId: 'setShadowValueClient',
            host: process.env.HOST,
            protocol: 'wss',
            debug: false,
            accessKeyId: process.env.ACCESS_KEY_ID,
            secretKey: process.env.SECRET_ACCESS_KEY
        });

        thingShadows.on('connect', function () {

            thingShadows.register(thingName, {}, function () {
                const stateUpdateObject = {};
                stateUpdateObject[fieldName] = fieldValue;
                thingShadows.update(thingName, { state: { desired: stateUpdateObject } });

                console.log(`The shadow ${thingName} has been updated`);
                logger.info(`The shadow ${thingName} has been updated`);
            });
        });

        thingShadows.on('status',
            function (thingName, stat, clientToken, stateObject) {
                thingShadows.unregister(thingName);
                thingShadows.end();
            });

        thingShadows.on('delta',
            function (thingName, stat) {
                thingShadows.unregister(thingName);
                thingShadows.end();
            });

    } catch (err) {
        console.error(err);
        logger.error(err);
    }
}

// start shadow monitor
async function startShadowMonitor(thingName) {
    try {
        const thing = await thingManager.describeThing(thingName);

        //Check if the thing exists first
        if (!thing) {
            console.log(`The thing ${thingName} does not exist. Create the thing first`);
            logger.info(`Attempt to monitor shadow for nonexistent thing ${thingName}`);
            return;
        }

        const thingShadows = awsIot.thingShadow({
            clientId: 'monitorShadowClient',
            host: process.env.HOST,
            protocol: 'wss',
            debug: false,
            accessKeyId: process.env.ACCESS_KEY_ID,
            secretKey: process.env.SECRET_ACCESS_KEY
        });

        thingShadows.on('connect', function () {
            thingShadows.register(thingName, {}, function () {
                console.log(`Monitor started for the thing shadow ${thingName} ...`);
                logger.info(`Monitor started for the thing shadow ${thingName}`);
                thingShadows.get(thingName);

                process.on('SIGINT', function () {
                    console.log(`Stopping monitor for the thing shadow ${thingName} ...`);
                    logger.info(`Stopping monitor for the thing shadow ${thingName}`);
                    thingShadows.unregister(thingName);
                    thingShadows.end();
                    console.log(`Monitor stopped for the thing shadow ${thingName}`);
                    logger.info(`Monitor stopped for the thing shadow ${thingName}`);
                });
            });
        });

        thingShadows.on('status',
            function (thingName, stat, clientToken, stateObject) {
                if (!stateObject || stateObject.code == 404) {
                    // shadow does not exist, let's create it!
                    thingShadows.update(thingName, { state: { desired: {} } });
                } else {
                    const displayableState = SHOW_METADATA ? stateObject :
                        stateObject.state.desired ? stateObject.state.desired : stateObject.state;
                    console.log(displayableState);
                }
            });

        thingShadows.on('delta',
            function (thingName, stateObject) {
                console.log(`The shadow ${thingName} has been updated:`);
                logger.info(`The shadow ${thingName} has been updated`);
                console.log(SHOW_METADATA ? stateObject : stateObject.state);
            });

    } catch (err) {
        console.error(err);
        logger.error(err);
    }
}



module.exports = {
    showShadow,
    setShadowValue,
    startShadowMonitor
};
