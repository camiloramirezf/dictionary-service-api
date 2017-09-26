// fetch queried list of Akelius Translations from "translations" documentdb collection 

module.exports = function (context, req, inputTranslations) {

    var src     = req.query.src;
    var target  = req.query.target;
       
    var response = inputTranslations.map((item) => {
        var json = {
            [src] : inputTranslations[src],
            [target] : inputTranslations[target],
            "usage": inputTranslations["usage"]
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