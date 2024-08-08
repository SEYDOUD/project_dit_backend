const { User } = require("../../models/User");
const bcrypt = require("bcrypt")
const jwtGenerator = require("../../utils/jwtGenerator");

exports.create = async(req,res) => {
    try {
        const {prenom , nom , username , password , email} = req.body;

        const user = await User.findOne({
            "username":username
        })
        if(user){
            throw new Error("L'utilisateur existe deja")
        }else{
            const saltRound = 10;
            const salt = await bcrypt.genSalt(saltRound);
            const bcryptPassword = await bcrypt.hash(password,salt);
            const user = new User({prenom: prenom , nom: nom, username: username, password: bcryptPassword, email: email})
            await user.save();
            const userId = user._id.toString();
            const token = jwtGenerator(res, userId);
            res.status(200).send({callback:"Utilisateur crée avec succès",token:token})
        }
    } catch (error) {
        let statusCode = 500;
        let errorCode = "#000";
        let errorMessage = error.message;

        if (error.message === "L'utilisateur existe deja") {
            statusCode = 403;
            errorMessage = "L'utilisateur existe deja";
        }

        res.status(statusCode).json({ code: errorCode, callback: errorMessage });
    }
}