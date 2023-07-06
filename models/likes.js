class Likes{
    constructor(id,blogId,author)
    {
        this.id = id;
        this.blogId = blogId;
        this.author = author;
    }
    addLike(db,callBackFn,response)
    {
        db.collection('blog').updateOne({_id:this.blogId},{$push:{likes: this}}).then(res=>{console.log("response",res)
        callBackFn(response,{status:true,messaage:'Blog liked successfully',body:res})})
        .catch(err=>{callBackFn(response,{status:false,message:'error in liking the blog',data:err})});
    }
}

module.exports.Likes = Likes;