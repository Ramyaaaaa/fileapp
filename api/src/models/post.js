import _ from 'lodash';
class Post
{
    constructor(app)   {
        this.app = app;
        this.model ={

            from : null,
            to: null,   
            message:null,
            files :[],
            created: new Date(),

        }
    }
    initWithObject(object){
        this.model.from = _.get(object,'from');
        this.model.to = _.get(object,'to');

        
        this.model.message = _.get(object,'message');
        this.model.files = _.get(object,'files');
        this.model.created = _.get(object,'created',new Date());
        return this.model;
    }

}

export default Post;
