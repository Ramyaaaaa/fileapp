import _ from 'lodash'
import url from './config'
import smtp from './config'
import nodemailer from 'nodemailer'
export default class Email {

    constructor(app)    {
        this.app = app;

    }


    sendDownloadLink(post, callback=()=>{}){


//         var nodemailer = require('nodemailer');

    var email = nodemailer.createTransport({
    // host: 'smtp.sendgrid.net',
  //  host: 'mail.traversymedia.com',
   
    // port: 587,
    // secure: false, 
    service :'gmail',
      
    auth: {
      
      user: 'ramyas2898@gmail.com', // generated ethereal user
      pass: '******'

        // user: 'apikey', // generated ethereal user
        // pass: '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'  // generated ethereal password

    },
    // proxy: 'http://proxy-host:1234',

    // tls:{
    //     rejectUnauthorized:false
    // }
});

        // let email = nodemailer.createTransport(smtp);

        const from = _.get(post,'from');
        const to = _.get(post,'to');
        const message = _.get(post,'message', '');
        const postId = _.get(post,'_id');
        
        const downloadLink = `https://hidden-dawn-10078.herokuapp.com/share/${postId}`
        
        console.log(from + to + message + postId);
        console.log("inside senddownload");



        

    // var helper = require('sendgrid').mail;
    // var fromEmail = new helper.Email(from);
    // var toEmail = new helper.Email(to);
    // var subject = 'Sending with SendGrid is Fun';
    // var content = new helper.Content('text/plain', 'and easy to do anywhere, even with Node.js');
    // var mail = new helper.Mail(fromEmail, subject, toEmail, content);
     
    // var sg = require('sendgrid')(process.env.SENDGRID_API_KEY);
    // var request = sg.emptyRequest({
    //   method: 'POST',
    //   path: '/v3/mail/send',
    //   body: mail.toJSON()
    // });
     
    // sg.API(request, function (error, response) {
    //   if (error) {
    //     console.log('Error response received');
    //   }
    //   console.log(response.statusCode);
    //   console.log(response.body);
    //   console.log(response.headers);
    //   return callback(error,response);
    // });
        let mailOptions ={
            from : from ,
            to : to,
            subject : 'Download invitation',
            text : message,
            html : `<p>Hiiii!  Message from ${from} : ${message}  Click <a href = "${downloadLink}"> here to download the files sent by ${from}.  </p>`
        }

        email.sendMail(mailOptions,(err,info)=>{
            console.log("sending an email with callback",err,info);
            return callback(err,info);
        })
    }
}
