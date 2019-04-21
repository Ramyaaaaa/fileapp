'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.url = exports.smtp = undefined;

var _xoauth = require('xoauth2');

var _xoauth2 = _interopRequireDefault(_xoauth);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var smtp = exports.smtp = {
    host: 'smtp.sendgrid.net',
    port: 587,
    secure: false,

    auth: {
        user: 'apikey', // generated ethereal user
        pass: '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' // generated ethereal password

    }
    // export const smtp = {
    //     // host: 'smtp.sendgrid.net',
    //     // port: 587,
    //     // secure: false, 

    //     service : 'gmail',
    //     // auth: {
    //     //     user: 'apikey', // generated ethereal user
    //     //     pass: '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'  // generated ethereal password

    //     // }
    //     auth: {
    //         user: 'ramyas2898@gmail.com', // generated ethereal user
    //         pass: 'ramya09!'  // generated ethereal password

    //     }
    // };


};var url = exports.url = 'http://localhost:3006';
//# sourceMappingURL=config.js.map