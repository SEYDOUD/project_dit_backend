const { Appreciation } = require("../../models/Appreciation");
const { Post } = require("../../models/Post");

exports.appreciate = async (req, res) => {
    try {
        const { isAppreciate } = req.body;
        const idPost = req.params.idPost;
        const idUser = req.userId;
        const post = await Post.findById(idPost);

        const appreciation = await Appreciation.findOneAndUpdate(
            { idUser: idUser, idPost: idPost }, // Conditions pour trouver l'appréciation
            { isAppreciate: isAppreciate }, // Mises à jour à appliquer
            { new: true } // Pour retourner le document mis à jour
        );

        if (!appreciation) {
            const newAppreciation = new Appreciation({ isAppreciate: isAppreciate, idUser: idUser, idPost: idPost });
            await newAppreciation.save();
            post.appreciations.push(newAppreciation._id);
            await post.save();
            res.status(200).send({ callback: "Appréciation reçue avec succès" });
        } else {
            res.status(200).send({ callback: "Appréciation modifiée avec succès" });
        }

    } catch (error) {
        let statusCode = 500;
        let errorCode = "#000";
        let errorMessage = error.message;

        res.status(statusCode).json({ code: errorCode, callback: errorMessage });
    }
};

exports.getTotalLike = async (req, res) => {
    try {
        const idPost = req.params.idPost;

        // Comptage des likes pour un post spécifique
        const totalLikes = await Appreciation.countDocuments({
            idPost: idPost,
            isAppreciate: true
        });

        res.status(200).send({ callback: totalLikes });

    } catch (error) {
        let statusCode = 500;
        let errorCode = "#000";
        let errorMessage = error.message;

        res.status(statusCode).json({ code: errorCode, callback: errorMessage });
    }
}

exports.getTotalDislike = async (req, res) => {
    try {
        const idPost = req.params.idPost;

        // Comptage des likes pour un post spécifique
        const totalDislikes = await Appreciation.countDocuments({
            idPost: idPost,
            isAppreciate: false
        });

        res.status(200).send({ callback: totalDislikes });

    } catch (error) {
        let statusCode = 500;
        let errorCode = "#000";
        let errorMessage = error.message;

        res.status(statusCode).json({ code: errorCode, callback: errorMessage });
    }
}