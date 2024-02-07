# WhatsApp Bot Google Sheets
What is the functionality of this bot? 
<ul>
<li class="d-flex">Writing information to a table;</li>
<li class="d-flex">Reading information from the table; </li>
<li class="d-flex">Sending messages to numbers from the table;</li>
</ul>

In this source code, the bot sends text from Google Sheets cells to the numbers specified in the cells. It records the status of the sent message, and if the client responds, it records their first response in an additional cell. You can use this source code in your work or as a convenient platform to start your project.

<em>For the bot to work, it is <b>NOT REQUIRED</b> that the phone is turned on or online. Connect the number and test the integration comfortably!</em> <br/> And if you need any help, just write to us in the support chat on any page of the site: https://whapi.cloud/features

## Getting Started
https://support.whapi.cloud/help-desk/getting-started/getting-started
### How to Connect to Whapi.Cloud
Registration. The first step is to register on the Whapi.Cloud website and create an account. <b>It's free and doesn't require you to enter a credit card.</b>
After registration you will immediately have access to a test channel with a small limitation. Wait for it to start (it usually takes about a minute). You will need to connect your phone for Whatsapp automation. It is from the connected phone that messages will be sent. The big advantage of the service is that it takes only a couple of minutes to launch and start working.

To connect your phone, use the QR code available when you click on your trial channel in your personal account. Then open WhatsApp on your mobile device, go to Settings -> Connected devices -> Connect device -> Scan QR code.

In the second and third steps, the service will ask you to customize the channel: write its name for your convenience, set webhooks, change settings. All these steps can be skipped, and we will come back to webhooks a little later. After launching, you will find in the center block under the information about limits, your API KEY, that is Token. This token will be used to authenticate your API requests. Generally, it's added to the request headers as a Bearer Token or simply as a request parameter, depending on the API method you're using.

Working with hooks: https://support.whapi.cloud/help-desk/guides/complete-guide-to-webhooks-on-whatsapp-api
