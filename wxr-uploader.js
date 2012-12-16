var casper = require("casper").create();

if (casper.cli.args.length != 4) {
   console.log("Usage: wxr-importer.js http://wordpress/installation/ username password /path/to/data.wxr");
   phantom.exit(1);
}

var baseUrl = casper.cli.args[0].replace(/\/$/, "");
var username = casper.cli.args[1];
var password = casper.cli.args[2];
var wxr = casper.cli.args[3];

// 1. Login
casper.start(baseUrl + "/wp-login.php", function() {
   this.fill("form#loginform", {"log": username, "pwd": password}, true);
});

// 2. Upload the file
casper.thenOpen(baseUrl + "/wp-admin/import.php?import=wordpress", function() {
   // Print any update messages
   var message = this.evaluate(function() {
      return document.querySelector(".error").innerText
   });
   if (message != null) {
      console.log("Wordpress says: " + message.trim());
   }

   this.fill("form#import-upload-form", {
      "import": wxr,
   }, true);
});

// 3. Import authors
casper.then(function() {
   this.fill("#wpbody-content form", {"fetch_attachments": true}, true);
});

// 4. Print the results
casper.run(function() {
   // Print import notes
   var messages = this.evaluate(function() {
      var par = document.getElementById("wpbody-content").getElementsByTagName("h2")[0].parentNode;
      var rtn = "";
      Array.prototype.forEach.call(par.childNodes, function(itm) {
         if (itm.nodeType === Node.TEXT_NODE) {
            rtn += itm.nodeValue;
         }
         else if (itm.nodeType === Node.ELEMENT_NODE && itm.tagName.toLowerCase() === "br") {
            rtn += "\n";
         }
      });
      return rtn;
   });
   console.log(messages);

   this.exit();
});
