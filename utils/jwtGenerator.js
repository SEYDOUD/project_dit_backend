const jwt = require("jsonwebtoken");
require("dotenv").config();

const jwtGenerator = (res,userId)=>{
    const token = jwt.sign({userId},process.env.jwtSecret,{
        expiresIn: '1hr'
    });

    return token;
}

module.exports = jwtGenerator;