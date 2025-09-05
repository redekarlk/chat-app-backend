import express from "express";
import { deleteTest, testAll, testCreate, updateTest } from "../controllers/test-controller.js";
import upload from "../middleware/upload.js";


const testRouter = express.Router();

testRouter.get("/all", testAll);
testRouter.post("/create", upload.single("image"), testCreate);
testRouter.delete("/delete/:id", deleteTest);
testRouter.put("/update/:id", updateTest);

export default testRouter;