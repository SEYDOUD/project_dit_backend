const { Post } = require("../../models/Post");
const { User } = require("../../models/User");
const { Comment } = require("../../models/Comment");
const { default: axios } = require("axios");

exports.create = async (req, res) => {
    try {
        const { message } = req.body;
        const userId = req.userId;
        const idPost = req.params.idPost;

        console.log("message:",message)

        // Trouver l'utilisateur et le post
        const user = await User.findById(userId);
        const post = await Post.findById(idPost);
        
        if (!user) {
            return res.status(404).json({ code: "#001", callback: "User not found" });
        }

        if (!post) {
            return res.status(404).json({ code: "#002", callback: "Post not found" });
        }

        const response = await axios.post('http://127.0.0.1:8000/predict', {
            message: req.body.message
        });

        const prediction = response.data.class
        console.log("my prediction:"+prediction)
        let status = "";  // Changement de 'const' à 'let'

        if (prediction >= 2) {
            status = "positive";
        } else {
            status = "negative";  // Ajout d'une condition pour définir la valeur 'negative'
        }

        // Créer le commentaire
        const comment = new Comment({
            message: message,
            status:status,
            idUser: userId,
            idPost: idPost
        });

        // Sauvegarder le commentaire
        await comment.save();

        // Ajouter l'identifiant du commentaire aux documents User et Post
        user.comments.push(comment._id);
        post.comments.push(comment._id);

        // Sauvegarder les modifications dans User et Post
        await user.save();
        await post.save();  // Important pour que les changements prennent effet

        res.send({ callback: "Commentaire créé avec succès" });
    } catch (error) {
        let statusCode = 500;
        let errorCode = "#000";
        let errorMessage = error.message;

        res.status(statusCode).json({ code: errorCode, callback: errorMessage });
    }
}

exports.getAll = async (req, res) => {
    try {
        const idPost = req.params.idPost;

        const comments = await Comment.find({ idPost: idPost });
        
        if(comments.length == 0){
            res.status(200).send({ callback: "Aucun commentaire pour le moment" });
        }else{
            res.status(200).send({ callback: comments });
        }

    } catch (error) {
        let statusCode = 500;
        let errorCode = "#000";
        let errorMessage = error.message;

        res.status(statusCode).json({ code: errorCode, callback: errorMessage });
    }
}

exports.getTotalComments = async (req, res) => {
    try {
        const idPost = req.params.idPost;

        const totalComments = await Comment.countDocuments({ idPost: idPost });
        
        if(totalComments.length == 0){
            res.status(200).send({ callback: 0 });
        }else{
            res.status(200).send({ callback: totalComments });
        }

    } catch (error) {
        let statusCode = 500;
        let errorCode = "#000";
        let errorMessage = error.message;

        res.status(statusCode).json({ code: errorCode, callback: errorMessage });
    }
}