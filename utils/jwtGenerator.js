const jwt = require("jsonwebtoken");
require("dotenv").config();

const jwtGenerator = (res,userId)=>{
    const token = jwt.sign({userId},process.env.jwtSecret,{
        expiresIn: '1hr'
    });

    // res.setHeader('authorization', `Bearer ${token}`);
    // res.cookie('jwt',token,{
    //     httpOnly: true,
    //     sameSite: 'strict',
    //     maxAge: 60 * 60 * 1000, // Durée de vie d'1 heure en millisecondes
    //     secure: true
    // });
    return token;
}

module.exports = jwtGenerator;