var DocumentDBClient = require('documentdb').DocumentClient;
var config = require('config');

//var config = require('../config/config');
// var databaseId = config.names.database;
// var collectionId = config.names.collection;
// var host = config.connection.endpoint;
// var masterKey = config.connection.authKey;

var databaseId = config.get("dictionaryDB.database");
var host = config.get("dictionaryDB.endpoint");
var masterKey = config.get("dictionaryDB.authKey");
var databaseUrl  = `dbs/${databaseId}`;

module.exports = function (context, req) {  

	var name1 = req.query.colName;	

    context.log("will delete ", name1);
	
	deleteColByName(name1)
		.then( () => createColbyName(name1))
		.then( (res) => {
			context.res = {
				status: 200,
				msg: "Collection " + name1 + " Deleted"
			};

			context.log("deletion succesful");
			context.done();
		})
		.catch((error) => {
			console.log("error ", error);
		});
};

function deleteColByName(collectionName) {
	return new Promise ((resolve, reject) => {
		
		var collectionUrl = `${databaseUrl}/colls/${collectionName}`;
		var client = new DocumentDBClient( host, {masterKey: masterKey});
		
		client.deleteCollection(collectionUrl, (err) => {
			if(err) reject(err);
			else resolve(null);
		});		
	});
}

function createColbyName(collectionName) {
	return new Promise ((resolve, reject) => {		
		
		var client = new DocumentDBClient( host, {masterKey: masterKey});		
		client.createCollection(databaseUrl, { "id": collectionName}, {offerThroughput: 1000}, (err) => {
			if(err) reject(err);
			else resolve(null);
		});		
	});	
}