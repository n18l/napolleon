// server.js

// BASE SETUP
// =============================================================================

// Define required packages
var express    = require('express');        // Call express
var app        = express();                 // Define our app using express
var request    = require('request');        
var _          = require('underscore');

var port = process.env.PORT || 8080;        // Set operating port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // Get an instance of the express Router

// Test route (GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });   
});

// Pollcat route (GET http://localhost:8080/api/napolleon)
router.get('/napolleon', function(req, res) {
    // if (req.query.token != '4ofROgiGBbMVk1ibnDOflQVU')
    //     return;

    var userChoices       = req.query.text.split(' -');
    var userQuestion      = userChoices.shift();
    var userChannelID     = req.query.channel_id;
    var userChannelPrefix = userChannelID[0] == 'D' ? '@' : '#';
    var userChannelName   = userChannelPrefix + req.query.channel_name;
    var pollAnnouncement  = req.query.user_name + ' asks: "' + userQuestion + '"';
    var slackToken        = "xoxp-3148856461-3909050702-9148379030-c5d7d2";

    res.json({message:userChannelID});

    // Define which emoji to use for options
    var optionEmoji = ['one','two','three','four','five','six','seven','eight','nine'];

    // Add numbered emoji to each poll choice
    _.each(userChoices, function(element, index, list) {
        userChoices[index] = ':' + optionEmoji[index] + ':  ' + userChoices[index];
    });

    // Output each poll choice on a new line
    var pollChoices = userChoices.join('\n');


    // Function to get recent channel history and find the poll's timestamp
    var getHistory = function() {
        request.get({
            url: 'https://slack.com/api/' + (userChannelID[0]) + '.history',
            qs: {
                "token":   slackToken,
                "channel": userChannelID,
                "count":   "5"
            }
        }, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                var lastMessage = _.findWhere(JSON.parse(body).messages, {"bot_id": "B0943D5MX"})
                var lastTimestamp = lastMessage.ts;

                _.each(userChoices.reverse(), function(element, index, list) {
                    addReaction(optionEmoji[index], lastTimestamp);
                });
            }
        });
    };

    // Function to add poll choice icons as reactions to be clicked
    var addReaction = function(emoji, timestamp) {
        request.get({
            url: 'https://slack.com/api/reactions.add',
            qs: {
                "token":     slackToken,
                "name":      emoji,
                "channel":   userChannelID,
                "timestamp": timestamp
            }
        }, function (error, response, body) {
            console.log(body);
        });
    };

    // Function to post poll to Slack
    request.post({
        url: 'https://hooks.slack.com/services/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', 
        json: {
            "channel": userChannelName,
            "attachments":[{
                "fallback": pollAnnouncement,
                "pretext":  pollAnnouncement,
                "color":    "#E5E5E5",
                "fields":[{
                    "value": pollChoices,
                    "short": false
                }]
            }]
        }
    }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log(body, userChannelName);
            getHistory();
        }
    });

    // Determine if user is posting to a Channel or Direct Message
    // request.get({
    //     url: 'https://slack.com/api/channels.list',
    //     qs: {
    //         "token": slackToken,
    //         "exclude_archived": 1
    //     }
    // }, function(error, response, body) {
    //     if (!error && response.statusCode == 200) {
    //         var postingToChannel = _.findWhere(JSON.parse(body).channels, {"id": userChannelID});
    //         userChannelPrefix = postingToChannel ? '#' : '@';
    //         postToSlack();
    //     }
    // });
});

// REGISTER ROUTES ---------------------------------------------
// Prefix all routes with /api
app.use('/api', router);

// START SERVER ================================================
app.listen(port);
console.log('The magic happens on port ' + port);