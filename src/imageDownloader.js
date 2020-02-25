function httpGetAsync(theUrl)
{
    var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            return(xmlHttp.getResponseHeader);
           }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous 
    xmlHttp.send(null);
    
}

var response = httpGetAsync("https://www.adesso-online.de/sites/adesso.spotlight-verlag.de/files/2018-10/ciao_compleanno.jpg");
var fs = require('fs'); 

fs.appendFile('ciao.jpg', response, function (err) {
    if (err) throw err;
    console.log('Saved!');
  }); 
    