# API-Assessment

#### curently I cant send messeges from sendgrid because my account has reached the free mail limit.. but all the POST mails will be added to __sendgrids Queue__ . the webhook url has also reached its timelimit and since the sendgrid has stoped working as expected (all mails are added to queue) the response will be allways added to queue..

## I tried to create 2 new sendgrid accounts, but sendgrid did not allow me to verify a sender... 

## In __Screenshot Folder__ there are some examples... (before updating the code now it will show the response from API in the terminal).

##Steps to run the code
1. __Download__ the ziped code from github and open it with __vsCode__.
2. Open a new terminal in vsCode after opening the downloaded code in vs code.
3. In terminal type and enter: __npm i nodemon__
4. Then to start the localhost, in terminal type and enter: __npm start__
5. open google chrome and serch: __http://localhost:2010/v1/emails/__ (html page will open and from here you can send a mail, get a mail and delete a mail, for the response of the api you have to look at __vsCode__)
6. __OR__ you can use __postman__ to check the API.
7. To run the __API tests__,
  1. Open a __new terminal in vsCode__.
  2.  In terminal type and enter: __npm test__( in the test 1st time it will show 2 passes , 2nd time only 1 will bw passed because of the DELETE request, you can use given other id s to check it again or , you can use POST request again in localhost and get that id and past it in the code)
   
