const User = require("../model/user");
const { body, validationResult } = require("express-validator");
const jwt = require('jsonwebtoken');
const { expressjwt: expressJwt } = require("express-jwt");


exports.signup = (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ 
        errors: errors.array()[0].msg,
        param: errors.array()[0].param,
     });
  }

  const user = new User(req.body);
  user.save()
  .then((user)=>{
    res.json({
      name: user.name,
      email: user.email,
      id: user._id,
    });
  })
  .catch((err)=>{
    console.log(err);
  })
};

exports.signin = (req,res)=>{
  const {email, password} = req.body;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ 
        errors: errors.array()[0].msg,
        param: errors.array()[0].param,
     });
  }

  User.findOne({email})
  .then((user)=>{
    if(!user.authenticate(password)){
      return res.status(401).json({
        error: "password and email does not match"
      })
    }
       //creating token
       const token = jwt.sign({ _id: user._id }, process.env.SECRET);

       //put token in cookie
       res.cookie("token",token,{expire: new Date() + 9999});
   
       //send response to frontend
       const {_id,name,email,role} = user;
       return res.json({token, user:{_id,name,email,role}});
  })
  .catch((err)=>{
    return res.status(400).json({error:"email not found"})
  })
}

//protected routes
exports.isSignedIn = expressJwt({
  secret: process.env.SECRET,
  algorithms: ["HS256"],
  userProperty: "auth"  
})
