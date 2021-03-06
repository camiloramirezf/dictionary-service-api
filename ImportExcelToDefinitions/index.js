var xlsxj = require("xlsx-to-json");

module.exports = function (context, req) {

    context.log("dir is ", __dirname);
    
    convertFile(context.log, __dirname + "//finance.xlsx")
           .then((results) => {
                context.bindings.outputDocument = results;
                context.res = {
                    status: 200,
                    body: "empty ok"
                }
                context.done();
            })
            .catch((error) => {
                context.log("error ", error);
                context.res = {
                    status: 400,
                    body: error
                }
                context.done();
            });

};

var convertFile = (logger, fileName) => new Promise((resolve, reject) => {

    xlsxj({
        input: fileName,
        output: null,
		sheet: "Fincance"
    }, function(err, result) {
        logger("result length: ", result.length);
        if(err) {
            reject(err);
        }
        
		// TODO: change language and area depending on file
		var lang = "en";
        var area = "Finance";
        var arr = [];               
        
        result.forEach((item) => {
            
            var json = {};
			json.src = lang;
            json.area= area;
            json.key = item["Key word"] || "wrongkey";
            json.definition = item["Definition"] || "nodef";            
            //json.tags = item["Target group"] || "";     

            if(area === "Finance")  {            
                if(item['Area']) json.tags ="Finance;";
                if(item['Theme']) json.tags += item['Theme'] + ";"; 
            }   
            arr.push(json);
        });

        resolve(arr);
     
    });

})