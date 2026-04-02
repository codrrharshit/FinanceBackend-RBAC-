const User= require('../models/user');

// update (promote or demote ) user role and status 
const updateUser= async (req,res)=>{
    try {
        // we have to find that user by id and update their role and status 
       const {role}=req.body;
       const validRoles=["admin","viewer","analyst"];
       if(!validRoles.includes(role)){
        return res.status(400).json({message:"Invalid role"});
       }

       const user = await User.findByIdAndUpdate(req.params.id,{role},{new:true});
       if(!user){
        return res.status(404).json({message:"User not found"});
       }

       return res.status(200).json({message:"role updated successfully",user});
    } catch (error) {
        return res.status(500).json({message:"Internal server error"});
    }
}

module.exports=updateUser;