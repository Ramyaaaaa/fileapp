'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var S3 = function () {
    function S3(app, response) {
        _classCallCheck(this, S3);

        this.app = app;
        this.response = response;
    }

    _createClass(S3, [{
        key: 'download',
        value: function download(file) {
            var s3 = this.app.s3;

            var response = this.response;
            //get object from s3 service

            var filename = _lodash2.default.get(file, 'originalName');
            response.attachment(filename);

            var options = {
                Bucket: 'ramyafileapp',
                Key: _lodash2.default.get(file, 'name')
            };
            var file1 = s3.getObject(options).createReadStream();
            file1.pipe(response);
        }
    }, {
        key: 'getFileObject',
        value: function getFileObject(file) {
            var s3 = this.app.s3;

            var options = {
                Bucket: 'ramyafileapp',
                Key: _lodash2.default.get(file, 'name')
            };
            return s3.getObject(options).createReadStream();
        }
    }, {
        key: 'getDownloadUrl',
        value: function getDownloadUrl(file) {
            var s3 = this.app.s3;
            var options = {
                Bucket: 'ramyafileapp',
                Key: _lodash2.default.get(file, 'name'),
                Expires: 3600 * 24 * 30 //one hour
            };

            var url = s3.getSignedUrl('getObject', options);
            return url;
        }
    }]);

    return S3;
}();

exports.default = S3;
//# sourceMappingURL=s3.js.map