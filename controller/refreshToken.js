import User from '..//model/UserModel.js'
import jwt from "jsonwebtoken";
export const handleRefreshToken = async (req, res) => {
  try {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.status(401);
    let refreshToken = cookies.jwt;
    // find users exists
    const FoundUser = await User.findOne({
      refreshToken: `${refreshToken}`,
    }).exec();
    if (!FoundUser) return res.status(403);
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err, decoded) => {
        if (err || FoundUser.email !== decoded.email)
          return res.sendStatus(403);
        const roles = Object.values(FoundUser.roles);
        const accessToken = jwt.sign(
          {
            UserInfor: { email: FoundUser.email, roles: roles },
          },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "30s" }
        );
        res.json({ accessToken });
      }
    );
  } catch (err) {
    res.json({ Message: err });
  }
};
