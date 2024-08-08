const jwt = require("jsonwebtoken");
const { User } = require("../models/User");
const { Admin } = require("../models/Admin");
require("dotenv").config();

module.exports = async (req,res,next)=>{
    const authHeader = req.headers['authorization'];
    const jwtToken = authHeader && authHeader.split(' ')[1];
    

    console.log("jwtoken0: "+authHeader)
    if(jwtToken){
        console.log("jwtoken1: "+jwtToken)
        try {
            console.log("jwtoken2: "+jwtToken)
            
            const decoded = await jwt.verify(jwtToken,process.env.jwtSecret);
            let idUser = decoded.userId;
            req.user = await User.findById(idUser)
            req.admin = await Admin.findById(idUser)

            if(req.user || req.admin){
                req.userId = idUser;
                req.adminId = idUser
                next();
            }else{
                throw new Error("Utilisateur n'existe pas")
            }
        } catch (error) {
            res.status(401).json("erreur not autorise");
        }
    }else{
        res.status(401).json({code:50000,callback:"Not authorized, no token"});
    }
}