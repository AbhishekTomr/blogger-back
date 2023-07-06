class User{
    constructor(firstName,lastName,email,password,blogs){
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
        this.blogs = blogs;
    }

    signUp(db,callBackFn,response){
        db.collection('user').insertOne(this).
        then((result)=>callBackFn(response,{status:true, message: 'Signed Up Successfully', data: null}))
        .catch(err=>callBackFn(response,{status:true, message: 'Error In Signing Up !!!', data: null}));
    }
}

module.exports.User = User;