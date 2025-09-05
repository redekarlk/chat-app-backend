import express from "express";
import userAuth from "../middleware/user-auth.js";
import { createConvo, getAllConvo } from "../controllers/conversation-controllers.js";

const convoRouter = express.Router();

// POST /api/conversations
convoRouter.post("/", userAuth, createConvo);


// GET /api/conversations
convoRouter.get("/", userAuth, getAllConvo);


export default convoRouter;