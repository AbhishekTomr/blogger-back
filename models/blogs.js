const userServices = require('../services/user');

class Blog {
    constructor(author,title,body,created_ts,updated_ts,likes,comments)
    {
        this.author=author;
        this.title=title;
        this.body=body;
        this.created_ts=created_ts;
        this.updated_ts=updated_ts;
        this.likes=likes;
        this.comments=comments;
    }
    
    createBlog(db,callBackFn,response){
        db.collection('blog').insertOne(this).
        then((result)=>{
            userServices.pushBlogToUser(this.author,result.insertedId)})
            .then(result=>{
                callBackFn(response,{status:true,message:'Blog Created Successfully', data: result})
            }).catch(err=>callBackFn(response,{status:false,message:'Error In Creating Blog', data: err}));
    }
}

module.exports.Blog = Blog;