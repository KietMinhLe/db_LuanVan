import express from "express";
import { createDanhMuc, deleteDanhMuc, getAllDanhMuc, getDanhMucById, updateDanhMuc } from "../controllers/danhMuc.controller.js";
const danhMucRouter = express.Router();

danhMucRouter.get("/", getAllDanhMuc)
danhMucRouter.get("/:id", getDanhMucById)
danhMucRouter.post("/", createDanhMuc)
danhMucRouter.put("/:id", updateDanhMuc)
danhMucRouter.delete("/:id", deleteDanhMuc)


export default danhMucRouter;