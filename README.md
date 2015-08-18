# Napolleon
#### Lightweight polling integration for Slack teams

Slack is a great collaborative tool, but many people have noticed that it lacks native support for the humble poll, king of hive-mind data-collection and Decider of Lunches. Sure, you can whip one up by posting a question, listing some choices, giving each one an emoji, and adding those same emoji as reactions (whew!), but wouldn't it be nice if you could simply use a slash command to do all that pesky formatting for you?

Now you can!

`/poll Where should we go for lunch? -Henry's Hunan -Suppenküche -Nopa`
<img src="http://nickbrombal.com/projects/napolleon/Example 1.png" width="450px" />

`/poll How much wood could a woodchuck chuck? -None -One tree's worth -A forest's worth! -What's a woodchuck?`
<img src="http://nickbrombal.com/projects/napolleon/Example 2.png" width="450px" />

With a little effort on your part, Napolleon will do the heavy lifting of formatting a pretty poll for you--all you'll have to type is a basic slash command. Finally, no more walking around and actually *interacting* with people to get consensus on pressing matters. Gross.

## How it Works
As you can see from the examples above, Napolleon takes a simple slash command and returns a lovely formatted response, with each choice assigned an emoji to identify it. It then adds those same emoji as reactions to the poll, which users can click to cast their vote. It's easy *and* effective!

Napolleon...
* Allows for up to ten options on a single poll,
* Can be configured with a custom name and icon,
* Can be used in Channel, Private Groups, and Direct Messages, and
* Displays reaction emoji in random order, preventing the possibility of "First is Best" bias.

## Setting Up
As you can probably guess, Napolleon can't do much on its own. It is merely text, awash in a sea of repos. But you can fix that, and help it blossom into a fully functioning app to use at your leisure!

#### 1. Configuring Slack
First things first: Let's set up within Slack ways to send data to Napolleon and display the data he returns to you. We'll accomplish this with a **slash command** and an **incoming webhook**, respectively.

> **Note:** This part of the setup will happen within your Slack admin. If you're not the admin, get that savory tech-savant to help you out with this process (you can ask them how their experience was later with your slick new poll integration). 

Let's start by [**configure a slash command**](https://slack.com/services/new/slash-commands). Pick a name for your slash command (might I humbly suggest `/poll`?), then click through to the following page where you'll see a few other fields to fill out.
* The *URL* field will be your deployed app's URL; for now, just use `http://test.com/api` until after we've set that up.
* The *Method* field should be changed to `GET`.
* The *Token* field has a randomly generated security token for your team; copy this value and paste it into Napolleon's `server.js` file as the value for the `slackSlashToken` variable.
* The *Autocomplete help text* fields can be set to help school your teammates on Napolleon's syntax. For example, you could set the *Description* to `Create a poll` and the *Usage hint* to `/poll [Question] -[Option 1] -[Option 2] ... -[Option 10]`.
* The *Descriptive label* is just for reference within the Slack admin--feel free to set it for your own benefit.

Once that's saved, it's time to [**create an incoming webhook**](https://slack.com/services/new/incoming-webhook). You'll first need to pick a default channel, but anything will do; Napolleon will override this setting so your polls show up wherever you start them. #random is a good choice... or you could make an entirely new channel called #polls!

On the next page, scroll down to the Settings area and copy the *Webhook URL*, which will be generated for you. You'll want to plug this into the `server.js` file as the value for the variable named `slackWebhookURL`. Once that's done, you can feel free to add a *Descriptive Label* and customize Napolleon's *name* and *icon*, which you'll see inside Slack, before saving.

#### 2. Configuring Napolleon
Before we deploy Napolleon, there are a few configuration variables within its `server.js` file that need to be set for your team's specific Slack environment. The good news is that, if you followed the steps in the Configuring Slack section, you've already done most of it! Either way, just double check these three variables:
* **slackSlashToken**, whose value can be found in the *Token* field in your [Slash Command integration](https://slack.com/services).
* **slackWebhookURL**, whose value can be found in the *Webhook URL* field in your [Incoming Webhook integration](https://slack.com/services).
* **slackAPIToken**, whose value can be found in [Slack's API documentation](https://api.slack.com/web).

You can find and set those variables within the `server.js` file, in the small area marked `Configuration variables`.

#### 3. Deploying Napolleon
Now that Slack and Napolleon are configured, we need to deploy Napolleon so your Slack integrations actually have somewhere to send and receive data from!

To do this, I recommend using [Heroku](https://www.heroku.com/). If you've never used it before, it's an app hosting service that works for a multitude of projects--it's definitely easiest to simply set up an account and let them walk you through deploying your first app. If you're not familiar with using Git or Github to deploy apps to a service like Heroku, don't worry! As of this writing they also support Dropbox integration, which should work for those with even a modicum of technical expertise.

If you've successfully deployed Napolleon to Heroku (or a similar service), you'll be able to visit the `/api` endpoint and see him reporting for duty! In the case of Heroku, this would be `<your-app's-name>.herokuapp.com/api`.

The last step in this saga is to tell Slack what your Napolleon deployment's URL ended up being. Swing back to [your integrations list](https://slack.com/services), select Slash Commands, and edit the one you set up earlier for Napolleon. Plug your deployment's URL with the `/api/napolleon` endpoint (e.g. `<your-app's-name>.herokuapp.com/api/napolleon`) into the *URL* field, and click Save. You're done!

## Vive le sondage!
That's it--get out there and start polling! What's your team's favourite animal? What's the best ice cream flavour? Is it honourable to spell these words with a 'u'? Find out today!

#### Troubleshooting
What can I say? Nothing's perfect. I'd recommend walking through the instructions again and double checking all of your variables in `server.js`. If you notice a real problem, feel free to get in touch or even make a pull request!

#### Worth Noting 
Napolleon is essentially a "baby's first API" project. I've never really used Node.js, nor written any kind of API endpoint before. So, here we are, with a lightweight project that lets me practice both while making something fun for my team (and yours!) to use in Slack. Contructive criticism is always welcome!
