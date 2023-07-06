class Comment{
    constructor(id,blogId, author, message){
        this.id = id;
        this.blogId = blogId;
        this.author = author;
        this.message = message;
    }

    addComment(db,callBackFn,response)
    {

        db.collection('blog').updateOne({_id:this.blogId},{$push:{comments: this}}).then(res=>{console.log("response",res)
        callBackFn(response,{status:true,messaage:'comment added successfully',body:res})})
        .catch(err=>{callBackFn(response,{status:false,message:'error in adding comment',data:err})});
    }
}

module.exports.Comment = Comment;