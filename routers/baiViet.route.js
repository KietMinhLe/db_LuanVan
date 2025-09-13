import express from "express";
import { createBaiViet, deleteBaiViet, getAllBaiViet, getBaiVietById, updateBaiViet } from "../controllers/baiViet.controller.js";

const baiVietRouter = express.Router();

baiVietRouter.get("/", getAllBaiViet);
baiVietRouter.get("/:id", getBaiVietById);
baiVietRouter.post("/", createBaiViet);
baiVietRouter.put("/:id", updateBaiViet);
baiVietRouter.delete("/:id", deleteBaiViet);

export default baiVietRouter;