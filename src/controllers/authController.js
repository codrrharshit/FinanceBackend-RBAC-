const User= require('../models/user');
const bcrypt= require('bcryptjs');
const jwt= require('jsonwebtoken');

//Register a new user 
exports.register= async( req,res)=>{
    try {
        const {name, email, password}=req.body;
        // check if user already exists 
        let user = await User.findOne({email});
        if(user){
            return res.status(400).json({message:"user already exists"});
        }

        // if the user is the first user, make them admin 
        const adminExist= await User.findOne({role:"admin"});
        const role= adminExist? "viewer":"admin";

        const hashedPassword= await bcrypt.hash(password,10);

        user = new User({
            name,
            email,
            password:hashedPassword,
            role
        })

        await user.save();
        return res.status(201).json({message:"User registered successfully"});
        
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
}



// login user 

exports.login= async( req, res)=>{
    try {
        const {email, password}= req.body;
        const user= await User.findOne({email});
        if(!user){
             return res.status(400).json({message:"Invalid credentials"});
        }

        if(user.status!=="active"){
            return res.status(400).json({message:"User is not active"});
        }

        const isMatch= await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({message:"Invalid credentials"});
        }


        return res.status(200).json({
            token: jwt.sign({userId: user._id, role: user.role}, process.env.JWT_SECRET, {expiresIn:"1h"}),
            user:{
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        return res.status(500).json({message: error.message});
    }
}