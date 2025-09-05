import express from "express";
import { acceptRequest, followRequest, getFollowRequests, isAuthenticated, loginUser, logoutUser, registerUser, searchUsers, userData, userDataForOther } from "../controllers/user-controllers.js";
import userAuth from "../middleware/user-auth.js";


const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/logout", logoutUser);
userRouter.get("/is-auth", userAuth, isAuthenticated);
userRouter.get("/user-data", userAuth, userData);
// user data for other users

userRouter.get("/search", userAuth, searchUsers);
userRouter.get("/:id", userDataForOther)


userRouter.get("/:userId/requests", userAuth, getFollowRequests);




// follow, following, 

userRouter.post("/:id/follow-request", userAuth, followRequest);
userRouter.post("/:id/accept-request", userAuth, acceptRequest);
userRouter.post("/:id/reject-request", userAuth, registerUser);





export default userRouter;