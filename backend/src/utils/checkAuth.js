const InformErr = require("./informErr")
const jwt = require("jsonwebtoken");


const checkAuth = (requiredRoles) => {

  return (req, res, next) => {
    try {
      const token = req.headers?.authorization?.split(" ")[1];

      if (!token) {
        const err = new InformErr("unauthorized", 401);
        return next(err)
      }


      const decoded = jwt.verify(token, process.env.ACCESS_TK_JWT_SECRET);

      
      if (!requiredRoles.includes(decoded.role)) {
        const err = new InformErr("unauthorized", 401);
        return next(err)
      }
      

      req.user = decoded;
      return next();

    } catch (error) {

      const err = new InformErr("unauthorized", 401);
      return next(err)
    }
  };

}


module.exports = checkAuth