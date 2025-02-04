const SendEmailCommand  = require( "@aws-sdk/client-ses");
const sesClient  = require( "./sesClient.js") ;

const createSendEmailCommand = (toAddress, fromAddress) => {
    return new SendEmailCommand({
      Destination: {
        /* required */
        CcAddresses: [
          /* more items */
        ],
        ToAddresses: [
          toAddress,
          /* more To-email addresses */
        ],
      },
      Message: {
        /* required */
        Body: {
          /* required */
          Html: {
            Charset: "UTF-8",
            Data: "<h1>Hello from me</h1>",
          },
          Text: {
            Charset: "UTF-8",
            Data: "<p>This is the email body</p>",
          },
        },
        Subject: {
          Charset: "UTF-8",
          Data: "EMAIL_SUBJECT",
        },
      },
      Source: fromAddress,
      ReplyToAddresses: [
        /* more items */
      ],
    });
  };

  const run = async () => {
    const sendEmailCommand = createSendEmailCommand(
        "girishbhargava9202@gmail.com" , 
        "girish@devtinder.store"
    //   "@example.com",
    //   "sender@example.com",
    );
  
    try {
      return await sesClient.send(sendEmailCommand);
    } catch (caught) {
      if (caught instanceof Error && caught.name === "MessageRejected") {
        /** @type { import('@aws-sdk/client-ses').MessageRejected} */
        const messageRejectedError = caught;
        return messageRejectedError;
      }
      throw caught;
    }
  };

  module.exports = {run} ; 