import User from "../model/UserModel.js"; // Đảm bảo rằng bạn có đúng đường dẫn
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const authUser = async (req, res) => {
  const { email, pwd } = req.body;

  // Kiểm tra nếu email hoặc mật khẩu trống
  // if (!email || !pwd)
  //   return res.status(400).json({ Message: "Email và Mật Khẩu không bỏ trống" });

  // Tìm người dùng trong database
  const FoundUser = await User.findOne({ email }).exec();

  // Nếu không tìm thấy người dùng
  if (!FoundUser) return res.status(401).json({ Message: "Email không đúng" });

  try {
    // Kiểm tra mật khẩu
    const result = await bcrypt.compare(pwd, FoundUser.password);

    if (result) {
      const roles = Object.values(FoundUser.roles); // Lấy danh sách roles của người dùng

      // Tạo AccessToken
      const AccessToken = jwt.sign(
        {
          UserInfor: { email: FoundUser.email, roles: roles },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "30s" }
      );

      // Tạo refreshToken
      const refreshToken = jwt.sign(
        { email: FoundUser.email },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "1d" }
      );

      // Lưu refreshToken vào người dùng
      FoundUser.refreshToken = refreshToken;
      await FoundUser.save(); // Lưu người dùng với refreshToken

      // Cấu hình cookie cho refresh token
      res.cookie("jwt", refreshToken, {
        httpOnly: true,
        secure: true, // Đảm bảo bạn chỉ sử dụng secure cookie khi có HTTPS
        maxAge: 24 * 60 * 60 * 1000, // Thời gian hết hạn của cookie (1 ngày)
      });

      // Trả về AccessToken, refreshToken, roles và id người dùng
      res.status(200).json({
        AccessToken,
        refreshToken,
        roles,
        userid: FoundUser._id,
      });
    } else {
      res.status(401).json({ Message: "Mật khẩu không đúng" });
    }
  } catch (err) {
    // Xử lý lỗi
    console.log(err);
    res.status(500).json({ Message: "Server bị lỗi", Error: err.message });
  }
};
