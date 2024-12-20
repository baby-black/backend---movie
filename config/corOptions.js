import { AllowOrigin } from "./allowOrigin.js";

export const corsOptions = {
  origin: (origin, callback) => {
    if (AllowOrigin.includes(origin) || !origin) {
      // Cho phép nếu origin nằm trong danh sách hoặc không có (truy cập từ server)
      callback(null, true);
    } else {
      // Từ chối quyền truy cập
      callback(new Error("Not allowed by CORS"));
    }
  },
  optionsSuccessStatus: 200, // Đảm bảo trạng thái thành công
};
