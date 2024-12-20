import User from "../model/UserModel.js";
export const handleLogout = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt)
    return res.status(401).json({ Message: "No token provided" });
  const refreshToken = cookies.jwt;
  try {
    // Find the user with the given refresh token
    const foundUser = await User.findOne({ refreshToken }).exec();
    if (!foundUser) {
      res.clearCookie("jwt", { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
      return res.status(404).json({ Message: "User not found" });
    }
    // Delete refresh token and save the user
    foundUser.refreshToken = "";
    await foundUser.save();
    // Clear the cookie
    res.clearCookie("jwt", { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });

    return res.status(200).json({ Message: "Logout successful" });
  } catch (error) {
    console.error("Error during logout:", error);
    return res.status(500).json({ Message: "Logout failed" });
  }
};
