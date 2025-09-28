import express from "express";
import { createThongBao, deleteThongBao, getAllThongBao, getThongBaoById, updateThongBao } from "../controllers/thongBao.controller.js";

const thongBaoRouter = express.Router();

thongBaoRouter.get("/", getAllThongBao)
thongBaoRouter.get("/:id", getThongBaoById)
thongBaoRouter.post("/", createThongBao)
thongBaoRouter.put("/:id", updateThongBao)
thongBaoRouter.delete("/:id", deleteThongBao)

export default thongBaoRouter;