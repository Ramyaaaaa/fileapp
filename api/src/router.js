import { version } from '../package.json';
import path from 'path';
import _ from 'lodash';
import File from './models/file';
const { ObjectID } = require('mongodb');
import Post from "./models/post";
import FileArchiver from './archiver'
import S3 from './s3'
import Email from './email'
class AppRouter {

    constructor(app) {
        this.app = app;
        this.setupRouters();
    }

    setupRouters() {

        const app = this.app;
        const uploadDir = app.get('storageDir');
        const upload = app.upload;
        const dba = app.get('db');
        const db1 = dba.db('fileapp');



        app.get('/', (req, res, next) => {

            console.log("this is backend /")
            return res.status(200).json({
                version: version
            });
        });


        //Upload routing
        app.post('/api/upload', upload.array('files'), (req, res, next) => {

            console.log("this is backend /api/upload")
            const files = _.get(req, 'files', []);

            console.log("files sent to s3",files);
            let fileModels = [];
            _.each(files, (fileObject) => {

                var newFile = new File(app).initWithObject(fileObject);
                fileModels.push(newFile);

            })
            if (fileModels.length) {

                db1.collection('files').insert(fileModels, (err, result) => {
                    if (err) {
                        return res.status(503).json({
                            error: {
                                message: "Unable to save your file"
                            }
                        })
                    }


                    let post = new Post(app).initWithObject({

                        from: _.get(req, 'body.from'),
                        to: _.get(req, 'body.to'),
                        message: _.get(req, 'body.message'),

                        files: result.insertedIds,

                    });
                    console.log("post " + post['from']);

                    db1.collection('posts').insertOne(post, (err, result) => {
                        if (err) {

                            return res.status(503).json({
                                error: {
                                    message: "Upload could not be saved"
                                }
                            })
                        }


                        //implement email sending to user with download link

                        const sendEmail = new Email(app).sendDownloadLink(post,(err,info)=>{

                            if(err) {
                                console.log("An error has occured",err);
                            }
                            
                        })
                        //callback to react 

                        return res.json(post);
                    });
                    console.log("save", req.body, result);


                });




            }
            else {
                return res.status(503).json({
                    error:
                    {
                        message: "Files to upload is required"
                    }
                })
            }

        });
        //Download routing

        app.get('/api/download/:id', (req, res, next) => {
            const fileID = req.params.id;


            db1.collection('files').find({ _id: ObjectID(fileID) }).toArray((err, result) => {

                const fileName = _.get(result, '[0].name');
                console.log("filename" + fileName);

                if (err || !fileName) {
                    return res.status(503).json({
                        error: {
                            message: "Unable to download your file"
                        }
                    })
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
                const file = _.get(result,'[0]');
               //proxy download from s3
                // const downloader = new S3(app,res).download(file);
                //  return downloader;

                const downloadUrl = new S3(app,res).getDownloadUrl(file);

                return res.redirect(downloadUrl)
            });

        });

        console.log("The app routing is init");




        app.get('/api/posts/:id/download', (req, res, next) => {

            const id = _.get(req,'params.id',null);
            this.getPostById(id,(err,result)=>{
                if(err){
                    return res.status(404).json({
                        error:
                        {
                            message: 'File not found'
                        }
                    })        
                }

                const archiver = new FileArchiver(app,_.get(result,'files',[]),res).download(); 
                return archiver;

            })
                  })
        // routing for post detail  /api/posts/:id

        app.get('/api/posts/:id', (req, res, next) => {

            const postId = _.get(req,'params.id');

            this.getPostById(postId,(err,result)=>{
                if(err){
                    return res.status(404).json({
                        error:
                        {
                            message: 'File not found'
                        }
                    })        
                }
                return res.json(result);
            })

        })
    }



    getPostById(id, callback = () => { }) {

        const app = this.app;
        const dba = app.get('db');
        const db1 = dba.db('fileapp');


        let postObjectId = null;

        try {
            postObjectId = new ObjectID(id);
        }

        catch (err) {

            return callback(err, null);
        }

        db1.collection('posts').find({ _id: postObjectId }).limit(1).toArray((err, results) => {
            const result = _.get(results, '[0]');
            console.log("result" + result);
            if (err || !result) {

                return callback(err ? err : new Error("File not found"));

            }
            const fileIds = _.get(result, 'files', []);


            let i, j;
            const fileIdList = [];
            for (i in fileIds)
                fileIdList.push(fileIds[i])

            db1.collection('files').find({ _id: { $in: fileIdList } }).toArray((err, files) => {

                if (err || !files || !files.length) {
                    return callback(err ? err : new Error("File not found"));
                }

                result.files = files;
                return callback(null, result)
            })
        })


    }
}

export default AppRouter;