// Given an id and a definiton as input, try to find the document and modify 
// the definition. If the document id does not exist. create a new one with the
// given definition.

var fetch = require('node-fetch');

module.exports = function (context, req, inputDocument) {

    context.log(" haaa" ,req.params.id);
    context.log("inut document: ", inputDocument);

    var doc = {};
    var diffDoc = {};
    if(inputDocument[0]) {
        
		context.log("body is only this..", req.body);
        if(req.body.definition) {
            inputDocument[0].definition = req.body.definition;
            diffDoc.definition = req.body.definition;
        }

        if(req.body.area) {
            inputDocument[0].area = req.body.area;
            diffDoc.area = req.body.area;
        }

        if(req.body.tags) {
            inputDocument[0].tags = req.body.tags;
            diffDoc.tags = req.body.tags;
        }
      
        doc = inputDocument;

        context.bindings.outputDocument = doc;
        context.log("document modified...");

        // Update index to synchronize search
        updateIndex(req.params.id, diffDoc, context.log)
            .then((response) => {
                    context.res = {
                    status: 200,
                    body: {
                        props: {
                            id: inputDocument[0].id,
                            key: inputDocument[0].key,
                            area: inputDocument[0].area,
                            definition: inputDocument[0].definition,
                            tags: inputDocument[0].tags
                            }
                        } 
                    };

                    context.done();        
            });    

    } else {

        // TODO: Check body properties

        //var tags = req.body.tags.split(";");
        var newDoc = {
            src: "en",
            key: req.body.key,
            definition: req.body.definition,
            area: req.body.area,
            tags: req.body.tags
        } 

        context.bindings.outputDocument = newDoc; 
        context.log("no input data...");
        context.res = {
            status: 200,
            msg: "new added"
        };        
    }     
};

const updateIndex = (id, doc, log) => {

    return new Promise((resolve, reject) => {

        var uploadUrl = "https://akelius-dictionary-search.search.windows.net/indexes/akelius-dictionary-definitions-index-test/docs/index?api-version=2016-09-01";
        var apiKey = "0160D2442C601B507FC9F70AB6CEB6CB";
        var newDocument = doc;

        newDocument["@search.action"] = "mergeOrUpload";
        newDocument["id"] = id;

        fetch(uploadUrl, {
                        method: "POST",                       
                        headers:{                            
                            "api-key": apiKey,
                            "Content-Type":"application/json"
                        },
                        body: JSON.stringify({
                            value: [newDocument]
                        })
                    })  
                    .then( response => {
                        return response.json();
                    })                 
                    .then(json => {
                        log("total response ", json);
                        resolve();
                    }).catch(error => {
                        log("error", error);
                        reject(error);
                    })
    });
} 