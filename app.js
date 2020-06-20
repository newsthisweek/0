// jshint esversion:6
const express = require("express");
const app = express();
const bodyparser = require("body-parser");
const request = require("request");
const https = require("https");
app.use(bodyparser.urlencoded({ extended: true }));

app.use(express.static("public")); // so that our css file and images can load with html inside public folder there will be css and images


app.get("/", function(req, res) {
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res) {
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const email = req.body.email;
    //  console.log(firstname, lastname, email);

    const data = {
        members: [{
            email_address: email,
            status: "subscribed",
            merge_fields: {
                FNAME: firstname,
                LNAME: lastname,
            }
        }]
    };

    const jasondata = JSON.stringify(data);
    const url = "https://us10.api.mailchimp.com/3.0/lists/faa88be1ef"; //to post the data to the api 
    const options = {
        method: "POST",
        auth: "prashant:ed649697e3ec7a0706dd293fac323926-us10"
    }

    const request = https.request(url, options, function(response) {

        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html");

        } else {
            res.sendFile(__dirname + "/failure.html");
        }

        response.on("data", function(data) {
            console.log(JSON.parse(data));
        })
    })

    request.write(jasondata);
    request.end();



});

app.post("/failure", function(req, res) {
    res.redirect("/");
});
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running at port ` + port);
});
//app.listen(process.env.PORT || 3000, function() { //to deploy our server to globally with heroku
//  console.log("post is runing on port 3000");
//});


//ed649697e3ec7a0706dd293fac323926-us10   //usx=us10 int he url above
//faa88be1ef