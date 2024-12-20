import User from "..//model/UserModel.js";
import mongoose from "mongoose";
export const getUser = async (req, res) => {
  const userId = req.params.id;
  try {
    const result = await User.findById({ _id: userId });
    if (result) return res.status(200).json({ data: result });
    else res.status(404).json({ Message: "Người dùng không thấy" });
  } catch (err) {
    res.status(500).json({ Message: err });
  }
};

export const EditUser = async (req, res) => {
  const userId = req.params.id;
  const { username, gender, pwd, img } = req.body;
  try {
    const FoundUser = await User.findById({ _id: userId }).exec();
    if (!FoundUser)
      return res.status(404).json({ Message: "Người dùng không thấy" });
    FoundUser.gender = gender;
    if (username && username.trim() !== "") FoundUser.username = username;
    if (pwd && pwd.trim() !== "") FoundUser.password = pwd;
    if (img && img.trim() !== "") FoundUser.image = img;
    const UpdateUser = await FoundUser.save();
    res.status(200).json({ data: UpdateUser });
  } catch (err) {
    console.log(err);
    res.status(500).json({ Message: err });
  }
};
