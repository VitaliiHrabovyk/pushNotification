const express = require('express');
const webpush = require('web-push');

var app = express();

app.get("/", function(request, response){
    response.send("send service alive");
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



app.route('/api/send').post(sendNewsletter);

function sendNewsletter(req, res) {
    console.log(req.query.title)
    console.log(req.query.body)
    console.log(typeof(req.query.subscribe))

    let subscribe = JSON.parse(req.query.subscribe)

    const allSubscriptions = [subscribe]

    console.log('Total subscriptions', allSubscriptions.length);

    const notificationPayload = {
        "notification": {
            "title":req.query.title,
            "body": req.query.body,
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
        .then(() => res.status(200).json({message: 'Newsletter sent successfully.'}))
        .catch(err => {
            console.error("Error sending notification, reason: ", err);
            res.sendStatus(500);
        });
}


// app.listen(5000, function () {

//     console.log("Started application on port %d", 5000);
    
//     });