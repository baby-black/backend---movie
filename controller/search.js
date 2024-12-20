import User from "../model/UserModel.js";

export const searchUsers = async (req, res) => {
  const { query } = req.query;  // Lấy từ query string, ví dụ: ?query=someone
  if (!query) {
    return res.status(400).json({ Message: "Vui lòng nhập từ khóa tìm kiếm" });
  }

  try {
    // Tìm kiếm người dùng dựa trên email hoặc username
    const users = await User.find({
      $or: [
        { email: { $regex: query, $options: 'i' } },
        { username: { $regex: query, $options: 'i' } },
      ],
    }).exec();

    if (users.length === 0) {
      return res.status(404).json({ Message: "Không tìm thấy người dùng nào" });
    }

    res.status(200).json({ data: users });
  } catch (err) {
    console.log(err);
    res.status(500).json({ Message: "Lỗi khi tìm kiếm", Error: err.message });
  }
};
