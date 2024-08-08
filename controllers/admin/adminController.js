const { Admin } = require("../../models/Admin");
const bcrypt = require("bcrypt");
const jwtGenerator = require("../../utils/jwtGenerator");
const { User } = require("../../models/User");
const { Post } = require("../../models/Post");
const { Comment } = require("../../models/Comment");
const { Appreciation } = require("../../models/Appreciation");

exports.create = async (req, res) => {
    try {
        const {username , password} = req.body;

        const user = await Admin.findOne({
            "username":username
        })
        if(user){
            throw new Error("L'admin existe deja")
        }else{
            const saltRound = 10;
            const salt = await bcrypt.genSalt(saltRound);
            const bcryptPassword = await bcrypt.hash(password,salt);
            const admin = new Admin({username: username, password: bcryptPassword, role: "admin"})
            await admin.save();
            const adminId = admin._id.toString();
            const token = jwtGenerator(res, adminId);
            res.status(200).send({callback:"Utilisateur crée avec succès",token:token})
        }

    } catch (error) {
        let statusCode = 500;
        let errorCode = "#000";
        let errorMessage = error.message;

        res.status(statusCode).json({ code: errorCode, callback: errorMessage });
    }
};
exports.deleteUser = async (req, res) => {
    try {
        const idUser = req.params.idUser;
        const deletedUser = await User.findOneAndDelete({ _id: idUser });

        if(!deletedUser){
            return res.status(404).send({callback:"Utilisateur non trouvé"})
        }
        res.status(200).send({callback:"Utilisateur supprimé aves succès"})

    } catch (error) {
        let statusCode = 500;
        let errorCode = "#000";
        let errorMessage = error.message;

        res.status(statusCode).json({ code: errorCode, callback: errorMessage });
    }
};
exports.deletePost = async (req, res) => {
    try {
        const idPost = req.params.idPost;
        const deletedPost = await Post.findOneAndDelete({ _id: idPost });

        if(!deletedPost){
            return res.status(404).send({callback:"Post non trouvé"})
        }
        res.status(200).send({callback:"Post supprimé aves succès"})

    } catch (error) {
        let statusCode = 500;
        let errorCode = "#000";
        let errorMessage = error.message;

        res.status(statusCode).json({ code: errorCode, callback: errorMessage });
    }
};
exports.deleteComment = async (req, res) => {
    try {
        const idComment = req.params.idComment;
        const deletedComment = await Comment.findOneAndDelete({ _id: idComment });

        if(!deletedComment){
            return res.status(404).send({callback:"Comment non trouvé"})
        }
        res.status(200).send({callback:"Commentaire supprimé aves succès"})

    } catch (error) {
        let statusCode = 500;
        let errorCode = "#000";
        let errorMessage = error.message;

        res.status(statusCode).json({ code: errorCode, callback: errorMessage });
    }
};
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('_id prenom nom username email');
        
        if(users.length == 0){
            res.status(200).send({ callback: "Aucun utilisateur pour le moment" });
        }else{
            res.status(200).send({ callback: users });
        }

    } catch (error) {
        let statusCode = 500;
        let errorCode = "#000";
        let errorMessage = error.message;

        res.status(statusCode).json({ code: errorCode, callback: errorMessage });
    }
};
exports.getAllPost = async (req, res) => {
    try {
        const posts = await Post.aggregate([
            {
                $lookup: {
                    from: "users",
                    localField: "idUser",
                    foreignField: "_id",
                    as: "user"
                }
            },
            {
                $unwind: "$user"
            },
            {
                $lookup: {
                    from: "appreciations",
                    localField: "_id",
                    foreignField: "idPost",
                    as: "appreciations"
                }
            },
            {
                $addFields: {
                    likes: {
                        $size: {
                            $filter: {
                                input: "$appreciations",
                                as: "appreciation",
                                cond: { $eq: ["$$appreciation.isAppreciate", true] }
                            }
                        }
                    },
                    dislikes: {
                        $size: {
                            $filter: {
                                input: "$appreciations",
                                as: "appreciation",
                                cond: { $eq: ["$$appreciation.isAppreciate", false] }
                            }
                        }
                    },
                    commentCount: { $size: "$comments" } // Ajoute le nombre de commentaires
                }
            },
            {
                $project: {
                    _id: 1, // Ajoute l'identifiant du post
                    idUser: "$user._id", // Ajoute l'identifiant de l'utilisateur
                    username: "$user.username",
                    message: 1,
                    img: 1,
                    likes: 1,
                    dislikes: 1,
                    commentCount: 1
                }
            }
        ]);
       
        
        if(posts.length == 0){
            res.status(200).send({ callback: "Aucun post pour le moment" });
        }else{
            res.status(200).send({ callback: posts});
        }

    } catch (error) {
        let statusCode = 500;
        let errorCode = "#000";
        let errorMessage = error.message;

        res.status(statusCode).json({ code: errorCode, callback: errorMessage });
    }
};

exports.getNumberPost = async (req, res) => {
    try {
        const totalPosts = await Post.countDocuments();
        res.status(200).send({ callback: totalPosts});

    } catch (error) {
        let statusCode = 500;
        let errorCode = "#000";
        let errorMessage = error.message;

        res.status(statusCode).json({ code: errorCode, callback: errorMessage });
    }
};

exports.getNumberUser = async (req, res) => {
    try {
        const totalUser = await User.countDocuments();
        res.status(200).send({ callback: totalUser});

    } catch (error) {
        let statusCode = 500;
        let errorCode = "#000";
        let errorMessage = error.message;

        res.status(statusCode).json({ code: errorCode, callback: errorMessage });
    }
};

exports.getNumberComments = async (req, res) => {
    try {
        const totalComment = await Comment.countDocuments();
        res.status(200).send({ callback: totalComment});

    } catch (error) {
        let statusCode = 500;
        let errorCode = "#000";
        let errorMessage = error.message;

        res.status(statusCode).json({ code: errorCode, callback: errorMessage });
    }
};


exports.getAllComment = async (req, res) => {
    try {
        const comments = await Comment.aggregate([
            {
                $lookup: {
                    from: "users", // Nom de la collection des utilisateurs
                    localField: "idUser",
                    foreignField: "_id",
                    as: "user"
                }
            },
            {
                $unwind: "$user" // Décompose le tableau `user` pour accéder aux détails de l'utilisateur
            },
            {
                $project: {
                    _id: 1, // ID du commentaire
                    message: 1, // Message du commentaire
                    username: "$user.username", // Nom d'utilisateur
                    idPost: 1 // ID du post
                }
            }
        ]);
       
        
        if(comments.length == 0){
            res.status(200).send({ callback: "Aucun commentaire pour le moment" });
        }else{
            res.status(200).send({ callback: comments});
        }

    } catch (error) {
        let statusCode = 500;
        let errorCode = "#000";
        let errorMessage = error.message;

        res.status(statusCode).json({ code: errorCode, callback: errorMessage });
    }
};