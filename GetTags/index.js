module.exports = function (context, req, inputTags) {
    
        context.log('JavaScript HTTP trigger function processed a request.');
    
        if (inputTags.length > 0) {
    
            var tags = inputTags.map((item) => item.key);
    
            context.res = {
                // status: 200, /* Defaults to 200 */
                body: {tags: tags}
            };
        }
        else {
            context.res = {
                status: 400,
                body: "No tags found"
            };
        }
        context.done();
    };