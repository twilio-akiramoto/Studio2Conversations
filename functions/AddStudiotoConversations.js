exports.handler = async function(context, event, callback) {


    const accountSid = context.ACCOUNT_SID;
    const authToken = context.AUTH_TOKEN;
    const client = require('twilio')(accountSid, authToken);
    const customerNumber = event['MessagingBinding.Address'];
    const ConversationSid = event['ConversationSid'];
    
    console.log(customerNumber)
    console.log(ConversationSid)
    console.log(event)
  
    const conversations = async () => {
      //Add Studio
      const response = new Twilio.Response();
      
      await client.conversations.conversations(ConversationSid)
        .webhooks
        .create({
          'configuration.flowSid': 'FWaa3a4a083cb6beecc16515e34369cfcc',
          'configuration.replayAfter': 0,
          target: 'studio' 
         })
          .then(webhook => {
              response.appendHeader('Content-Type', 'application/json');
              response.setBody({webhook:webhook.sid});             
              console.log(webhook.sid)            
              callback(null, response);               
          })
      }
    conversations(callback);
  };