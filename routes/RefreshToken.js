import express from "express";
import { handleRefreshToken } from "../controller/refreshToken.js";
const Router = express.Router();
Router.get("/", handleRefreshToken);
export default Router
