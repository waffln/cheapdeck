const TwitchClient = require("twitch").default
const WebHookListener = require("twitch-webhooks").default

const { twitch: { client, userName } } = require("../env.json")

const accessToken = "mk946yh4l7hav7abujkg6d6aoyxon0"
const refreshToken = "r7epgtsbz0yahk707pvu2l8tm7ilpto33cd9thls795lbd6kpt"
const clientId = "gp762nuuoqcoxypju8c569th9wz7q5"

const twitchClient = TwitchClient.withCredentials(clientId, accessToken)

;(async () => {
  const user = await twitchClient.helix.users.getUserByName(userName)

  const listener = await WebHookListener.create(twitchClient, {port: 8090})
  
  await listener.subscribeToSubscriptionEvents(user.id, async event => {
    console.log("event:")
    console.log(event)
    console.log("\n")
  })
})()