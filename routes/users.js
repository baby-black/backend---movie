import express from "express";
import { RegisterUser } from "../controller/registerUser.js";
import { authUser } from "../controller/authController.js";
import { handleLogout } from "../controller/LogoutController.js";
import { getUser, EditUser } from "../controller/UserControllers.js";
import { verifyJWT } from "..//Middleware/verifyJwt.js";
const Router = express.Router();
// ------------ GET USER----------------
Router.post("/register", RegisterUser);
Router.get("/:id", verifyJWT, getUser);
Router.put("/edit/:id", verifyJWT, EditUser);
Router.post("/login", authUser);
Router.post("/logout", handleLogout);


export default Router;
