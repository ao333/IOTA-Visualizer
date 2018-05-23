# IOTA Visualizer
www.iotaimperial.com

[IOTA](https://iota.org/) is a distributed ledger that uses bundles of transactions. IOTA is based on a directed acyclic graph (DAG) called the Tangle. Transactions are directly posted to the network, once the sender has confirmed two other transactions already placed in the network. This allows to send transactions without any fees. Thus, this can be also used to send messages or to transfer value.

In this project, we try to design and implement a system to display real-time information on the IOTA Tangle.  In our website, we display node graph which shows information and relations between transactions. The system is able to display statistics about the Tangle such as the number of current tips, information about transactions, mean confirmation time, and value transfer per second.

**The whole project is divided into two folders**
 - **server**: our main http server, dealing with requests and responses with client side.
 - **database**: interacting with IOTA api and database. Insert data into database, update the data and add more new data.

 **Before you run the codes, please make sure newest version of node.js and npm package manager have been installed**

## Server
**in 'server' folder**
To run the server, go into server folder, initialize project and run npm start:

    cd server
    npm install
    npm start
**IMPORTANT**:  There are two files, config_neo4j.js and config_mongo.js, in 'config' folder which contain connection username and password of our database. If these files are missing, please create them in 'config' folder following formats shown below.

## Database
**in 'database' folder**
To begin database updating, go into the database folder:

    cd database
    npm install
    npm start
**IMPORTANT**: There are three configuration files, config_neo4j.js and config_mongo.js and config_sour.js  in 'config' folder which contain connection username and password of our database and iota server. If these files are missing, please create them in 'config' folder following formats shown below.

## Formats of config files

### config_neo4j.js

    const neo4j = require('neo4j-driver').v1;  
    
    let uri = '<url of neo4j database>';  
    let user = '<username>';  
    let password = '<password>';  
  
    const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));  
    module.exports = driver;
**IMPORTANT**: Put it in config folder both in server and in database.

### config_mongo.js

	let constr = {  
	  'mongoUrl':'<url of mongodb>',  
	  //'user':"<username>",  
	  //'password':"<password>"  
	};   
	const mongoose = require('mongoose');  
	mongoose.Promise = require('bluebird');   
	const connect = mongoose.connect(constr.mongoUrl,{  
	  //auth:{  
	  //  user:constr.user,  
	  //  password:constr.password  
	  //},  
	  keepAlive: 120  
	});  
	module.exports = connect;
**IMPORTANT**: Put it in config folder both in server and in database. if you run mongoDb locally, maybe you do not need user and password. If you need user and password configuration for mongodb (remotely or set password locally), please uncomment authentication configures above.

### config_sour.js
	let Source = "https://peanut.iotasalad.org";
	let Port = 14265;
	let Label = "https://peanut.iotasalad.org";  
	module.exports = {
	  Source,
	  Label,
	  Port
	};
**IMPORTANT**: You do not need this file in server config folder. Just need it in database's config folder. Source is address of iota server, port is port of the server. Please change Source, Port, Label when you add more source servers.
**If you want to have multiple iota servers connected to our program, just copy the whole database folder, run another database program with modified config_cour.js**



   


