# IOTA Project
[IOTA](https://iota.org/) is a distributed ledger that uses bundles of transactions. IOTA is based on a directed acyclic graph (DAG) called the Tangle. Transactions are directly posted to the network, once the sender has confirmed two other transactions already placed in the network. This allows to send transactions without any fees. Thus, this can be also used to send messages or to transfer value.

In this project, we try to design and implement a system to display real-time information on the IOTA Tangle.  In our website, we display node graph which shows information and relations between transactions. The system is able to display statistics about the Tangle such as the number of current tips, information about transactions, mean confirmation time, and value transfer per second.

**The whole project is divided into two folders**
 - **server**: our main http server, dealing with requests and responses with client side.
 - **database**: interacting with IOTA api and database. Insert data into database, update the data and add more new data.

## Server
To run the server, go into server folder initialize project and run npm start:

    cd server
    npm install
    npm start
Notice:  We have git-ignored file config_neo4j.js and config_mongo.js which contains connection username and password of our database in azure. Please ask for these two files and put them in server folder before you run the file to test.

## Database
To begin database updating, go into the database folder:

    cd database
    npm install
    npm start
Suggestion: We have git-ignored the config_neo4j.js and config_mongo.js.  Please ask for these two files and put them in subfolder 'config' before you run the file to test.

IMPORTANT: if you would like to test the database functions, please modify the file config_mongo.js and config_neo4j.js to your local database. (Firstly install these two databases into your local machine)

![ScreenShot](https://lh3.googleusercontent.com/dZ9vo78-VukeKudwWEaqxQMuQnZCAqFsS-B2vt1VmMzMg2yrUxqkI7HosHfIcxbSgRAAvgRjrZU "IOTA")

   


