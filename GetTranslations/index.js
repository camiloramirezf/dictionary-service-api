// fetch queried list of Akelius Translations from "translations" documentdb collection 

module.exports = function (context, req, inputTranslations) {

    var src     = req.query.src;
    var target  = req.query.target;

    var response = inputDocument.map((item) => {
        var json = {
            [src] : inputDocument[src],
            [target] : inputDocument[target],
            "usage": inputDocument["usage"]
        }

        return json;
    });
    context.log('JavaScript HTTP trigger function processed a request.');    
    context.res = {
        // status: 200, /* Defaults to 200 */
        body: {
            list: response
        }
    };    
    
    context.done();
};