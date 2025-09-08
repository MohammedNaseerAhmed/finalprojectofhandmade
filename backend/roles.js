const userModel=require('./Models/UsersModel')

async function roles(req,res){
let user=req.body
    console.log(user)
    let r1=await userModel.findOne({email:user.email})
   
    if(r1!=null){
        if(user.role===r1.role){
            res.status(200).send({message:user.role,payload:r1})
        }
        else{
            res.status(200).send({message:"Invalid role"})
        }
        
    }
    else{
        let u=new userModel(user)
        let r=await u.save()
        res.status(201).send({payload:r})
    }
}
module.exports = roles;