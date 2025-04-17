import jsonwebtoken from "jsonwebtoken";

export const generate = (req, res, next) => {
  if (!req.user) {
    return res.unauthorized();
  }

  const payload = {
    email: req.user.email,
  };

  const JWTSECRET = process.env.JWTSECRET;
  const JWTEXPIRE = process.env.JWTEXPIRE;

  const token = jsonwebtoken.sign(payload, JWTSECRET, {
    expiresIn: JWTEXPIRE,
  });

  res.ok({ token });
}

export const verify = (req, res, next) => {
  /*
  #swagger.autoHeaders = false
  #swagger.security = [{
    "bearerAuth": {}
  }]
  */
  const authHeader = req.headers.authorization;

  if (!!authHeader) {
    const token = authHeader.split(" ")[1];

    const JWTSECRET = process.env.JWTSECRET;
    return jsonwebtoken.verify(token, JWTSECRET, (err, payload) => {
      if (err) return res.unauthorized();

      req.payload = payload;
      return next();
    });
  }

  res.unauthorized();
}
