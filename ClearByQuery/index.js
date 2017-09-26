var DocumentDBClient = require('documentdb').DocumentClient;
var config = require('config');
// var config = require('./../config/config');
// var databaseId = config.names.database;
// var collectionId = config.names.collection;
// var host = config.connection.endpoint;
// var databaseUrl  = `dbs/${databaseId}`;
// var masterKey = config.connection.authKey;

var databaseId = config.get("dictionaryDB.database");
var host = config.get("dictionaryDB.endpoint");
var masterKey = config.get("dictionaryDB.authKey");
var databaseUrl  = `dbs/${databaseId}`;

// TODO: use config package instead of config above.

module.exports = function (context, req) {   
    
    if (req.query.colname && req.body.q) {
       
        var colname = req.query.colname;
        var query   = req.body.q;

        deleteFromCollection(colname, query, context.log)
            .then((result) => {           
                context.res = {
                    body : "done!"
                };
                context.done();
            })
            .catch((err) => {
          
                context.res = {
                    body : err
                };
                context.done();
            });      
    }
    else {
        context.res = {
            status: 400,
            body: "Please pass a query in the body (q) and a collection name as a request parameter"
        };
        context.done();
    }
};

function deleteFromCollection(collectionName, query,  log) {

    return new Promise((resolve, reject) => {
       	
		var collectionUrl = `${databaseUrl}/colls/${collectionName}`;
		var client = new DocumentDBClient( host, {masterKey: masterKey});
        var q = query;

        client.queryDocuments(collectionUrl, q).toArray((err, results) => {
                if (err) {
                    log("an error occured ", err);
                    reject(err);
                }
                else {
                    for (var queryResult of results) {

                        client.deleteDocument(queryResult._self, () => docuDeleted(log));                        
                        let resultString = JSON.stringify(queryResult);
                        log(`\tQuery returned ${resultString}`);
                       
                    }

                    resolve("results");
                }
        });
    });
}

function docuDeleted(log) {
    log("document deleted");
}


