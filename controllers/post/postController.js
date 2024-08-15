const { Post } = require("../../models/Post");
const { User } = require("../../models/User");
const axios = require('axios');

exports.create = async (req, res) => {
    try {
        const {message , img} = req.body;
        const userId = req.userId;

        const user = await User.findById(userId);
        
        if (!user) {
            throw new Error("User not found");  
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

        const post = new Post({
            message: message,
            status: status,
            img: img,
            idUser: userId,
        });

        await post.save();

        user.posts.push(post._id);
        await user.save();

        res.send({ callback: "post crée avec succès" });
    } catch (error) {
        let statusCode = 500;
        let errorCode = "#000";
        let errorMessage = error.message;

        res.status(statusCode).json({ code: errorCode, callback: "hello"+error });
    }
}

exports.getAll = async (req, res) => {
    try {
        const posts = await Post.aggregate([
            {
                $lookup: {
                    from: 'users',
                    localField: 'idUser',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            {
                $lookup: {
                    from: 'comments',
                    localField: 'comments',
                    foreignField: '_id',
                    as: 'comments'
                }
            },
            {
                $lookup: {
                    from: 'appreciations',
                    localField: 'appreciations',
                    foreignField: '_id',
                    as: 'appreciations'
                }
            },
            {
                $project: {
                    _id: 1,
                    message: 1,
                    img: 1,
                    user: { $arrayElemAt: ['$user', 0] },
                    appreciationTrueCount: {
                        $size: {
                            $filter: {
                                input: '$appreciations',
                                cond: { $eq: ['$$this.isAppreciate', true] }
                            }
                        }
                    },
                    appreciationFalseCount: {
                        $size: {
                            $filter: {
                                input: '$appreciations',
                                cond: { $eq: ['$$this.isAppreciate', false] }
                            }
                        }
                    },
                    commentCount: { $size: '$comments' }
                }
            },
            {
                $sort: { _id: -1 } // Sort by _id in descending order
            }
        ]).option({ maxTimeMS: 30000 });;

        // const posts = await Post.find()

        const formattedPosts = posts.map(post => ({
            id: post._id,
            message: post.message,
            img: post.img,
            user: post.user.username,
            appreciationTrueCount: post.appreciationTrueCount,
            appreciationFalseCount: post.appreciationFalseCount,
            commentCount: post.commentCount
        }));

        console.log("posts:",formattedPosts)
        
        if(posts.length == 0){
            res.status(200).send({ callback: "Aucun post pour le moment" });
        }else{
            res.status(200).send({ callback: formattedPosts });
        }

    } catch (error) {
        let statusCode = 500;
        let errorCode = "#000";
        let errorMessage = error.message;

        res.status(statusCode).json({ code: errorCode, callback: errorMessage });
    }
}
