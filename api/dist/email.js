'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

var _nodemailer = require('nodemailer');

var _nodemailer2 = _interopRequireDefault(_nodemailer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Email = function () {
    function Email(app) {
        _classCallCheck(this, Email);

        this.app = app;
    }

    _createClass(Email, [{
        key: 'sendDownloadLink',
        value: function sendDownloadLink(post) {
            var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {};


            //         var nodemailer = require('nodemailer');

            var email = _nodemailer2.default.createTransport({
                // host: 'smtp.sendgrid.net',
                //  host: 'mail.traversymedia.com',

                // port: 587,
                // secure: false, 
                service: 'gmail',

                auth: {

                    user: 'ramyas2898@gmail.com', // generated ethereal user
                    pass: 'googlechrome!'

                    // user: 'apikey', // generated ethereal user
                    // pass: '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'  // generated ethereal password

                }
                // proxy: 'http://proxy-host:1234',

                // tls:{
                //     rejectUnauthorized:false
                // }
            });

            // let email = nodemailer.createTransport(smtp);

            var from = _lodash2.default.get(post, 'from');
            var to = _lodash2.default.get(post, 'to');
            var message = _lodash2.default.get(post, 'message', '');
            var postId = _lodash2.default.get(post, '_id');

            var downloadLink = 'http://localhost:3006/share/' + postId;

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
            var mailOptions = {
                from: from,
                to: to,
                subject: 'Download invitation',
                text: message,
                html: '<p>Hiiii!  Message from ' + from + ' : ' + message + '  Click <a href = "' + downloadLink + '"> here to download the files sent by ' + from + '.  </p>'
            };

            email.sendMail(mailOptions, function (err, info) {
                console.log("sending an email with callback", err, info);
                return callback(err, info);
            });
        }
    }]);

    return Email;
}();

exports.default = Email;
//# sourceMappingURL=email.js.map