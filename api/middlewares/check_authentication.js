const jwt = require('jsonwebtoken');
module.exports = {
    checkTokenAdmin:(req,res,next)=>{
        console.log(req.headers.authorization)
        if(req.headers.authorization && req.headers.authorization.startsWith('Bearer ')){
            let token = req.headers.authorization.split('Bearer ')[1];
            if(token){
                //jwt.verify(token, secretOrPublicKey, [options, callback])
                //verify a token symmetric
                jwt.verify(token, process.env.JWT_KEY,(err,result)=>{
                    if(err){
                        res.status(401).json({
                            success:0,
                            message: "Token expired or Unauthorized Status Code"
                        });
                    }else{
                        if(result.role == "admin"){
                            next();
                        }
                        //403 Forbidden, The client doesn't have access rights to the content
                        //So server is refusing to give the requested resource
                        //Unlike 401, the client's identity is known to the server
                        else{
                            res.status(403).json({
                                success:0,
                                message: "You are not authorized for this permission"
                            });
                        }
                    }
                });
            }else{
                res.status(401).json({
                    success:0,
                    message: "Token expired or Unauthorized Status Code"
                });
            }
        } else {
            return res.status(403).json({
                success:0,
                message: "Token expired or Unauthorized Status Code"
            });
        }
    },
}