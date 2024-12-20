import User from '..//model/UserModel.js'
import bcrypt from "bcrypt";
export const RegisterUser =async (req, res) => {
  // Extract email and password from request body
  const { email, pwd } = req.body;
  console.log(email, pwd);
  // Check if email or password is missing
  if (!email || !pwd) {
    return res
      .status(400)
      .json({ Message: "Email và Mật khẩu không bỏ trống" });
  }
  // Check for duplicate email
  const duplicateEmail = await User.findOne({ email: email }).exec()
  if (duplicateEmail) return res.status(409).json({ Message: "Email Đã được đăng kí!" });
  try {
    // Add new user to the database
    const username = email.split("@")[0];
    console.log(username);
    const hashPwd = await bcrypt.hash(pwd, 10);
    const newUser = await User.create({
      email: email,
      password: hashPwd,
      username,
    });
    
    console.log(newUser)
    res.status(201).json({ Message: "Đăng kí thành công!" });
  } catch (err) {
    // Handle error
    console.log(err)
    res
      .status(500)
      .json({ Message: "Server bị lỗi", Error: err.message });
  }
};
