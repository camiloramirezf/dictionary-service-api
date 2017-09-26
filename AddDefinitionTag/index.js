module.exports = function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    if ((req.body && req.body.tags)) {

        var tags = req.body.tags;
        tags = tags.split(";");
        // TODO: check that tags are not repeated. 

        if(Array.isArray(tags)) {
             tags = tags.map((item) => ({key: item}));
             context.bindings.outputDocument = tags;
        } else {
            context.log("single tag uploaded");
             context.bindings.outputDocument = {key: tags}
        }
        context.res = {
            // status: 200, /* Defaults to 200 */
            body: tags
        };
        
    }
    else {
        context.res = {
            status: 400,
            body: "Please pass a name on the query string or in the request body"
        };
    }
    context.done();
};