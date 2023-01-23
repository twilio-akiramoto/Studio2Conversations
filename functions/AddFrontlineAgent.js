exports.handler = function(context, event, callback) {

    console.log("reason: " + event.reason);
    console.log("conversationSID: " + event.conversationSID);
    
    const accountSid = context.ACCOUNT_SID;
    const authToken = context.AUTH_TOKEN;
    const client = require('twilio')(accountSid, authToken);
    const chatUser = "Al Kiramoto";
    const conversationSID = event.conversationSID
    const WebhookSid = event.WebhookSid
    console.log("WebhookSid: " + WebhookSid);
    
    let msgBody = "Connecting you to our CAS Coordinator " + chatUser + " to the Conversation. We will be with you shortly.";
   
    console.log(msgBody);

        
    const conversations = async () => {
        //Get the conversation
        await client.conversations.v1.conversations(conversationSID)
        .fetch()
        .then(conversation => console.log(conversation.friendlyName));

        //Send a message to the customer based off what came from the Studio Flow...
        await client.conversations.conversations(conversationSID)
        .messages
        .create({author: chatUser, body: msgBody})
        .then(message => console.log(message.sid))
        .catch(err => console.log("send message error " + err));

      //Put the Frontline user in the conversation
      await client.conversations.conversations(conversationSID)
        .participants
        .create({
           'identity' : "akiramoto@twilio.com"
         })
        .then(participant => console.log(participant.sid))
        .catch(err => console.log(err));

        //Remove Studio from the conversation
      await client.conversations.conversations(conversationSID)
      .webhooks(WebhookSid)
      .remove()
      .then( result => {
        console.log("removed webhook...");
        callback(result);
      })
      .catch(err => console.log(err));           
    }
    
    conversations(callback);
   
};
