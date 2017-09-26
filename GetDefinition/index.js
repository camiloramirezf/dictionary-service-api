// Given a source language and a term, return a definition from a documentdb colllection.

module.exports = function (context, req, inputDocument) {   
    
    if(inputDocument[0]) {

        context.res = {
            status: 200,
            body : { 
                id: inputDocument[0].id,
                title: inputDocument[0].key,               
                definition: inputDocument[0].definition,
                area: inputDocument[0].area,
                tags: inputDocument[0].tags
            }
        };

    } else {
        context.res = {
            status: 400,
            body: {
                msg: "term not found"
            }
        };
    } 

    context.done();
  
};