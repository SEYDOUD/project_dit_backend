const { User } = require("../models/User");
const bcrypt = require("bcrypt");
const jwtGenerator = require("../utils/jwtGenerator");
const { Admin } = require("../models/Admin");

exports.login = async(req,res) =>{
    try {
        const {username , password} = req.body;
        const user = await User.findOne({username:username})
        console.log("hellllllllllllloooooooooooo")
        
        if(!user){
            res.status(404).send("Utilisateur introuvable")
        }else{
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if(isPasswordValid){
                const userId = user._id.toString();
                const token = jwtGenerator(res, userId);
                return res.status(200).send({ callback: "Connexion réussie avec succès", token: token });
            }else{
                res.status(403).send("Identifiants incorrects")
            }
        }
    } catch (error) {
        let statusCode = 500;
        let errorCode = "#000";
        let errorMessage = error.message;

        if (error.message === "Utilisateur introuvable") {
            statusCode = 404;
            errorMessage = "Utilisateur introuvable";
        }else if(error.message === "Identifiants incorrects"){
            statusCode = 403;
            errorMessage = "Identifiants incorrects";
        }

        res.status(statusCode).json({ code: errorCode, callback:"" +errorMessage });
    }
}

exports.loginAdmin = async(req,res) =>{
    try {
        const {username , password} = req.body;
        const admin = await Admin.findOne({username:username})
        
        if(!admin){
            res.status(404).send("Admin introuvable")
        }else{
            const isPasswordValid = await bcrypt.compare(password, admin.password);
            if(isPasswordValid){
                const adminId = admin._id.toString();
                const token = jwtGenerator(res, adminId);
                return res.status(200).send({ callback: "Connexion réussie avec succès", token: token });
            }else{
                res.status(403).send("Identifiants incorrects")
            }
        }
    } catch (error) {
        let statusCode = 500;
        let errorCode = "#000";
        let errorMessage = error.message;

        if (error.message === "Utilisateur introuvable") {
            statusCode = 404;
            errorMessage = "Utilisateur introuvable";
        }else if(error.message === "Identifiants incorrects"){
            statusCode = 403;
            errorMessage = "Identifiants incorrects";
        }

        res.status(statusCode).json({ code: errorCode, callback: errorMessage });
    }
}

exports.logout = async(req,res) => {
    try {
        res.clearCookie('jwt');
        res.removeHeader('authorization');

        res.status(200).json({ callback: "Déconnexion réussie" });
    } catch (error) {
        let statusCode = 500;
        let errorCode = "#000";
        let errorMessage = error.message;

        res.status(statusCode).json({ code: errorCode, callback: errorMessage });
    }
}