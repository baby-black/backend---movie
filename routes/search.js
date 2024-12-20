import express from "express";
import { searchUsers } from "../controllers/search.js";

const router = express.Router();

// Route tìm kiếm người dùng
router.get('/', searchUsers);

export default router;
