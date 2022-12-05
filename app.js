const express = require("express");
const app = express();
const https = require("https");
const bodyParser = require("body-parser");
const { get } = require("request");
const { url } = require("inspector");

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));


app.get("/", function(req, res){
    
    res.sendFile(__dirname + "/signup.html");

});

app.post("/", function(req, res) {
    
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;
    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };
    const jsonData = JSON.stringify(data);
    const url = "https://us21.api.mailchimp.com/3.0/lists/acb1ec199f";
    const options = {
        method: "POST",
        auth:"egeurcu:6b5778ecb2ed65ea40534c2b745642fd-us21"
    };

    const request = https.request(url, options, function(response) {
        
        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html");
        } else {
            res.sendFile(__dirname + "/failure.html");
        }

        response.on("data", function(data){
            console.log(JSON.parse(data));
        });

    });

    request.write(jsonData);
    request.end();

});

app.post("/failure", function(req, res){
    res.redirect("/");
});

app.listen(3000, function(req, res) {

    console.log("Server is running on port 3000.");

});

// API Key
// 6b5778ecb2ed65ea40534c2b745642fd-us21
// List ID
// acb1ec199f