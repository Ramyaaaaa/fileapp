import _ from 'lodash';
export default class S3{

    constructor(app,response)   {
        this.app = app;
        this.response = response;
    }

    download(file){
        const s3 = this.app.s3;

        const response = this.response;
        //get object from s3 service

        const filename = _.get(file,'originalName');
        response.attachment(filename)

        const options = {
            Bucket : 'ramyafileapp',
            Key : _.get(file,'name')
        }
        const file1 = s3.getObject(options).createReadStream();
        file1.pipe(response);
    }

    getFileObject(file){
        const s3 = this.app.s3;

        const options = {
            Bucket : 'ramyafileapp',
            Key : _.get(file,'name')
        }
        return s3.getObject(options).createReadStream();


    }

    getDownloadUrl(file)    {
        const s3 = this.app.s3;
        const options = {
            Bucket : 'ramyafileapp',
            Key : _.get(file,'name'),
            Expires : 3600*24*30, //one hour
        }

        const url = s3.getSignedUrl('getObject',options);
        return url;
    }
}