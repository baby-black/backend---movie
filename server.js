import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import path from "path";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import users from "./routes/users.js";
import RefreshToken from "./routes/RefreshToken.js";
import { fileURLToPath } from "url";
import ConnectDB from "./config/connectMgoDb.js";
import { credentials } from "./Middleware/credential.js";
import { corsOptions } from "./config/corOptions.js";
import { searchUsers } from "./controller/search.js";
import UserModel from "./model/UserModel.js";
import bcrypt from "bcrypt";


dotenv.config(); // Nạp biến môi trường từ file .env

// Setup các thông số cơ bản
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = 3000; // Port mặc định nếu không có trong .env

// Middleware
app.use(credentials); // Xử lý kiểm tra credentials
app.use(cors(corsOptions)); // Cấu hình CORS
app.use(bodyParser.json()); // Phân tích dữ liệu JSON
app.use(bodyParser.urlencoded({ extended: true })); // Phân tích dữ liệu từ form
app.use(cookieParser()); // Xử lý cookie

// Static Files
app.use(express.static(path.join(__dirname, "public"))); // Đường dẫn tới file tĩnh

// Routes
app.use("/refresh", RefreshToken); // Đường dẫn refresh token
app.use("/user", users); // Đường dẫn liên quan đến người dùng
app.use("/search", searchUsers);
app.get('/', (req, res) => {
  res.send('Hello World');
});
// Kết nối tới MongoDB
ConnectDB(); // Thực hiện kết nối database
mongoose.connection.once("open",async () => {
  console.log("Connected to MongoDB");
  // Kiểm tra xem đã có user admin chưa
  const adminExist = await UserModel.findOne({ username: "admin" });

  if (!adminExist) {
    // Nếu chưa có user admin, tạo user admin mới
    const salt = await bcrypt.genSalt(10); // Mã hóa password
    const hashedPassword = await bcrypt.hash("admin123", salt); // Mã hóa password

    const adminUser = new UserModel({
      username: "admin",
      email: "admin@example.com",
      password: hashedPassword,
      role: "admin" // Giả sử bạn có trường `role` trong model User để phân biệt admin và user bình thường
    });

    await adminUser.save();
    console.log("Admin user created");
  }
  // Khởi chạy server sau khi kết nối MongoDB thành công
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
