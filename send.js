const express = require('express');
const webpush = require('web-push');
var app = express();
var cors = require('cors');
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors({ origin: 'http://localhost:4200'})); // change on deploy

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:4200");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, PATCH, PUT, POST, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Credentials", true);
    next();  
  });

app.get("/", function(request, response){
    response.send("send service work");
})


const vapidKeys = {
    "publicKey":"BIfaMt6Al-C8JO_RnianWKQYU36viXtLooTyWvSF6f8qZJb339Dt3CXokd0xXarhyHuQqJp8BV2-SwQg5HuDJsk",
    "privateKey":"LnSxJTvO0b6MUAw-osLFHW2qyY4IXq_xImzaEDfpqPM"
};

webpush.setVapidDetails(
    'mailto:example@yourdomain.org',
    vapidKeys.publicKey,
    vapidKeys.privateKey
);



app.post("/api/send", function (req, res) {
    res.header("Access-Control-Allow-Origin", "http://localhost:4200");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, PATCH, PUT, POST, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Credentials", true);

    console.log(req.body)
    console.log(req.body.title)
    console.log(req.body.body)
    console.log(typeof(req.body.subscribe))

    
    let subscribe = JSON.parse(req.body.subscribe)

    const allSubscriptions = [subscribe]

    console.log('Total subscriptions', allSubscriptions.length);

    const notificationPayload = {
        "notification": {
            "title":req.body.title,
            "body": req.body.body,
            "icon": "./images/badge.png",
            "vibrate": [100, 50, 100],
            "data": {
                "dateOfArrival": Date.now(),
                "primaryKey": 1
            },
            "actions": [{
                "action": "explore",
                "title": "Go to the app"
            }]
        }
    };

    Promise.all(allSubscriptions.map(sub => webpush.sendNotification(
        sub, JSON.stringify(notificationPayload) )))
        .then(() => res.status(200).json({message: 'Push sent successfully.'}))
        .catch(err => {
            console.error("Error sending notification, reason: ", err);
            res.sendStatus(500);
        });
})




let port = process.env.PORT;
if (port == null || port == "") {
  port = 5000;
}
app.listen(port, function () {

    console.log("Started application on port %d", port);
    
    });