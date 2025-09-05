import express from "express";
import userAuth from "../middleware/user-auth.js";

import { getMsgOfConvo, sendMsg } from "../controllers/message-controllers.js";

const msgRouter = express.Router();


// POST /api/messages
msgRouter.post("/", userAuth, sendMsg);


// GET /api/messages/:conversationId
msgRouter.get("/:conversationId", userAuth, getMsgOfConvo);


export default msgRouter;