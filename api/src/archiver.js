import archiver from 'archiver'
import _ from 'lodash'
import path from 'path'
import S3 from './s3'
export default class FileArchiver {
    constructor(app,files = [],response){
        this.app = app;
        this.files = files;
        this.response = response
    }

    download(){

        const app = this.app;
        const uploadDir = app.get('storageDir');
        const files = this.files;
        const zip = archiver('zip')
        const response = this.response

        const s3Downloader = new S3(app,response);

        
        response.attachment('download.zip');
        zip.pipe(response);
        _.each(files,(file)=>{
            

            const fileObject = s3Downloader.getFileObject(file);
            zip.append(fileObject,{name:_.get(file,'originalName')})

            // const filePath = path.join(uploadDir,_.get(file,'name'));
            // zip.file(filePath,{name:_.get(file,'originalName')})
        })

        zip.finalize();

        return  this;
    }
}