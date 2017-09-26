// fetch the full documentdb of akelius definitions.

module.exports = function (context, req, inputDocument) {
    
        var result = [];
    
        if(inputDocument && inputDocument.length > 0) {
    
            result = inputDocument.map((item) => {
                var oItem = {
                    id: item.id,                
                    key: item.key,
                    definition: item.definition,
                    area: item.area,
                    tags: item.tags
                };
    
                return oItem;
            });
        }
    
        context.res = {
            status: 200,
            body: {
                definitions: result
            }
        };
    
        context.done();
       
    };