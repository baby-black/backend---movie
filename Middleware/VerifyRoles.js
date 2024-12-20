export const VerifyRoles = (...allowRoles) => {
    return (req, res, next) => {
      if (!req?.roles) res.sendStatus(401); // unauthorization
      const result = req.roles
        .map((role) => ArrRoles.includes(role))
        .find((val) => val === true);
      if (!result) return res.sendStatus(401);
      next();
    }
}