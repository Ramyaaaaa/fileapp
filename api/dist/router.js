'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _package = require('../package.json');

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _file = require('./models/file');

var _file2 = _interopRequireDefault(_file);

var _post = require('./models/post');

var _post2 = _interopRequireDefault(_post);

var _archiver = require('./archiver');

var _archiver2 = _interopRequireDefault(_archiver);

var _s = require('./s3');

var _s2 = _interopRequireDefault(_s);

var _email = require('./email');

var _email2 = _interopRequireDefault(_email);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _require = require('mongodb'),
    ObjectID = _require.ObjectID;

var AppRouter = function () {
    function AppRouter(app) {
        _classCallCheck(this, AppRouter);

        this.app = app;
        this.setupRouters();
    }

    _createClass(AppRouter, [{
        key: 'setupRouters',
        value: function setupRouters() {
            var _this = this;

            var app = this.app;
            var uploadDir = app.get('storageDir');
            var upload = app.upload;
            var dba = app.get('db');
            var db1 = dba.db('fileapp');

            app.get('/', function (req, res, next) {

                console.log("this is backend /");
                return res.status(200).json({
                    version: _package.version
                });
            });

            //Upload routing
            app.post('/api/upload', upload.array('files'), function (req, res, next) {

                console.log("this is backend /api/upload");
                var files = _lodash2.default.get(req, 'files', []);

                console.log("files sent to s3", files);
                var fileModels = [];
                _lodash2.default.each(files, function (fileObject) {

                    var newFile = new _file2.default(app).initWithObject(fileObject);
                    fileModels.push(newFile);
                });
                if (fileModels.length) {

                    db1.collection('files').insert(fileModels, function (err, result) {
                        if (err) {
                            return res.status(503).json({
                                error: {
                                    message: "Unable to save your file"
                                }
                            });
                        }

                        var post = new _post2.default(app).initWithObject({

                            from: _lodash2.default.get(req, 'body.from'),
                            to: _lodash2.default.get(req, 'body.to'),
                            message: _lodash2.default.get(req, 'body.message'),

                            files: result.insertedIds

                        });
                        console.log("post " + post['from']);

                        db1.collection('posts').insertOne(post, function (err, result) {
                            if (err) {

                                return res.status(503).json({
                                    error: {
                                        message: "Upload could not be saved"
                                    }
                                });
                            }

                            //implement email sending to user with download link

                            var sendEmail = new _email2.default(app).sendDownloadLink(post, function (err, info) {

                                if (err) {
                                    console.log("An error has occured", err);
                                }
                            });
                            //callback to react 

                            return res.json(post);
                        });
                        console.log("save", req.body, result);
                    });
                } else {
                    return res.status(503).json({
                        error: {
                            message: "Files to upload is required"
                        }
                    });
                }
            });
            //Download routing

            app.get('/api/download/:id', function (req, res, next) {
                var fileID = req.params.id;

                db1.collection('files').find({ _id: ObjectID(fileID) }).toArray(function (err, result) {

                    var fileName = _lodash2.default.get(result, '[0].name');
                    console.log("filename" + fileName);

                    if (err || !fileName) {
                        return res.status(503).json({
                            error: {
                                message: "Unable to download your file"
                            }
                        });
                    }

                    console.log("Find file from db", err, result);

                    // const filePath = path.join(uploadDir, fileName);
                    // return res.download(filePath,_.get(result,'[0].originalName'), (err) => {
                    //     if (err) {
                    //         return res.status(404).json({
                    //             error: {
                    //                 message: 'File not found'
                    //             }
                    //         });
                    //     }
                    //     else {
                    //         console.log("File downloaded")
                    //     }
                    // })

                    //Download from S3
                    var file = _lodash2.default.get(result, '[0]');
                    //proxy download from s3
                    // const downloader = new S3(app,res).download(file);
                    //  return downloader;

                    var downloadUrl = new _s2.default(app, res).getDownloadUrl(file);

                    return res.redirect(downloadUrl);
                });
            });

            console.log("The app routing is init");

            app.get('/api/posts/:id/download', function (req, res, next) {

                var id = _lodash2.default.get(req, 'params.id', null);
                _this.getPostById(id, function (err, result) {
                    if (err) {
                        return res.status(404).json({
                            error: {
                                message: 'File not found'
                            }
                        });
                    }

                    var archiver = new _archiver2.default(app, _lodash2.default.get(result, 'files', []), res).download();
                    return archiver;
                });
            });
            // routing for post detail  /api/posts/:id

            app.get('/api/posts/:id', function (req, res, next) {

                var postId = _lodash2.default.get(req, 'params.id');

                _this.getPostById(postId, function (err, result) {
                    if (err) {
                        return res.status(404).json({
                            error: {
                                message: 'File not found'
                            }
                        });
                    }
                    return res.json(result);
                });
            });
        }
    }, {
        key: 'getPostById',
        value: function getPostById(id) {
            var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {};


            var app = this.app;
            var dba = app.get('db');
            var db1 = dba.db('fileapp');

            var postObjectId = null;

            try {
                postObjectId = new ObjectID(id);
            } catch (err) {

                return callback(err, null);
            }

            db1.collection('posts').find({ _id: postObjectId }).limit(1).toArray(function (err, results) {
                var result = _lodash2.default.get(results, '[0]');
                console.log("result" + result);
                if (err || !result) {

                    return callback(err ? err : new Error("File not found"));
                }
                var fileIds = _lodash2.default.get(result, 'files', []);

                var i = void 0,
                    j = void 0;
                var fileIdList = [];
                for (i in fileIds) {
                    fileIdList.push(fileIds[i]);
                }db1.collection('files').find({ _id: { $in: fileIdList } }).toArray(function (err, files) {

                    if (err || !files || !files.length) {
                        return callback(err ? err : new Error("File not found"));
                    }

                    result.files = files;
                    return callback(null, result);
                });
            });
        }
    }]);

    return AppRouter;
}();

exports.default = AppRouter;
//# sourceMappingURL=router.js.map