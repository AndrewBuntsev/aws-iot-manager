// .env initialize
require('dotenv').config();

const logger = require('./logger');
const thingManager = require("./thingManager");
const shadowManager = require("./shadowManager");


// collect all the CLI arguments
const cliArgs = process.argv;

// no arguments - error
if (cliArgs.length < 3) {
    console.log('No parameters provided. See "node tronacAWSIot.js help"');
    logger.error('Invalid arguments call: no arguments');
    return;
}

logger.trace(`CLI arguments:   ${JSON.stringify(cliArgs)}`);

// show help
if (cliArgs[2] == 'help') {
    console.warn(` 
    node tronacAWSIot.js help                                                       display help
    node tronacAWSIot.js list                                                       list all things
    node tronacAWSIot.js init                                                       create a new thing named “tronacTestThing“
    node tronacAWSIot.js init <thing_name>                                          create a new thing named <thing_name>
    node tronacAWSIot.js info <thing_name>                                          display information about the thing <thing_name>
    node tronacAWSIot.js delete <thing_name>                                        delete the thing <thing_name>
    node tronacAWSIot.js showshadow <thing_name>                                    display the shadow state for the thing <thing_name>
    node tronacAWSIot.js setshadowvalue <thing_name> <field_name> <field_value>     set the <field_name> to the <field_value> specified for the specified thing <thing_name>
    node tronacAWSIot.js monitor <thing_name>                                       print the shodowstate for the specified thing, and monitor the <thing_name> 
                                                                                     thing shadow state for any changes and print the changes as it occurs. 
                                                                                     The application shall continue running until the user chooses to terminate it. 
`);

    return;
}

// list things
if (cliArgs[2] == 'list') {
    thingManager.listThings().then(data => {
        console.log(data);
    });
    return;
}

// init default thing
if (cliArgs[2] == 'init' && cliArgs.length == 3) {
    thingManager.createThing('tronacTestThing').then(data => {
        console.log('New thing created:');
        console.log(data);
    });
    return;
}

// init named thing
if (cliArgs[2] == 'init' && cliArgs.length > 3) {
    thingManager.createThing(cliArgs[3]).then(data => {
        console.log('New thing created:');
        console.log(data);
    });
    return;
}

// delete thing
if (cliArgs[2] == 'delete' && cliArgs.length > 3) {
    thingManager.deleteThing(cliArgs[3]).then(data => {
        console.log(`The thing ${cliArgs[3]} has been deleted`);
    });
    return;
}

// display thing info
if (cliArgs[2] == 'info' && cliArgs.length > 3) {
    thingManager.describeThing(cliArgs[3]).then(result => {
        if (result) {
            console.log(result);
        } else {
            console.log(`Thing ${cliArgs[3]} not found.`);
        }
    });
    return;
}

// show shadow
if (cliArgs[2] == 'showshadow' && cliArgs.length > 3) {
    shadowManager.showShadow(cliArgs[3]);
    return;
}

// set shadow value
if (cliArgs[2] == 'setshadowvalue' && cliArgs.length > 5) {
    shadowManager.setShadowValue(cliArgs[3], cliArgs[4], cliArgs[5]);
    return;
}

// start monitor
if (cliArgs[2] == 'monitor' && cliArgs.length > 3) {
    shadowManager.startShadowMonitor(cliArgs[3]);
    return;
}

// invalid arguments
console.log('Invalid arguments. See "node tronacAWSIot.js help"');
logger.error('Invalid arguments call');
