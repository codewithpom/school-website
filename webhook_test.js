const url = "https://discord.com/api/webhooks/889017148255641621/XR_E0dtF9D9Q2ecUknzHxnoq8UNDM_trWUepTGJ4hqpwczko-F9NqxjlUfj-rFzJwKqs"
const webhook = require("webhook-discord")

const Hook = new webhook.Webhook(url)

Hook.info("Announcements bot","A **new** announcement made")

