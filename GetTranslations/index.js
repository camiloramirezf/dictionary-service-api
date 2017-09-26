// fetch queried list of Akelius Translations from "translations" documentdb collection 

module.exports = function (context, req, inputTranslations) {

    var src     = req.query.src;
    var target  = req.query.target;
       
    var response = inputTranslations.map((item) => {
        var json = {
            [src] : item[src],
            [target] : item[target],
            "usage": item["usage"]
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