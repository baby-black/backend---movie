import { AllowOrigin } from "../config/allowOrigin.js";

export const credentials = (req, res, next) => {
  const origin = req.headers.origin;
  if (AllowOrigin.includes(origin)) {
    // Thêm header cho phép cookie
    res.header("Access-Control-Allow-Credentials", "true");
  }
  next(); // Chuyển sang middleware tiếp theo
};
