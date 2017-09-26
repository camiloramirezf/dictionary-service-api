// fetch records from table storage, remove duplicates and save them as json documents 
// in the translations documentdb Collection.
module.exports = function (context, input, inputDictionary, testInput) {
    
        var dic = [];
        var languages = ['de', 'dk', 'en', 'en_US',  'fr', 'fr_CA', 'ia', 'sv'];
    
        // Only map languages if using google translation service
        // var langMap = {
        //         "de": "de",
        //         "dk": "da",
        //         "en": "en",
        //         "fr": "fr",
        //         "fr_CA": "fr_CA",
        //         "ia": "en",
        //         "sv": "sv"
        //         };    

        var txt = process.env.dictionary_db_NAME;
        var dictConnection = process.env.akelius_dictionary_DOCUMENTDB;
       
        inputDictionary.forEach( (entry) => {
            var json = entry;
            json.application = json.PartitionKey;
            delete json.PartitionKey;
            delete json.RowKey;
            dic.push(json); 
        });
    
        // Remove duplicates
        var seen = {};
        var result = dic.filter( (item) => {
            var k = key(item);
            return seen.hasOwnProperty(k) ? false : (seen[k] = true);
        });  
    
        // write result in documentdb
        context.bindings.outputDictionary = result;    
        context.res = {
            status: 200,
            body: "ok"
        };
        
        context.done();
    };
    
    function key(obj) {
        var  keyProps = ['en', 'usage'];
        var  endKey = "";
    
        keyProps.forEach((prop) => {
            endKey += obj[prop];
        });  
    
        return endKey;
    }