import prisma from "../models/primsa.model.js";

//Lây tất cả thông báo
export const getAllThongBao = async (req, res) => {
    try {
        const data = await prisma.thongbao.findMany();
        return res.status(200).json({ mess: "Thành Công", data: data });
    } catch (error) {
        res.status(500).json({ mess: "Thất Bại !!!", error: error.message });
    }
};

// Lấy thông báo theo ID
export const getThongBaoById = async (req, res) => {
    try {
        const { id } = req.params

        // Kiểm tra ID hợp lệ
        if (!id || isNaN(id)) {
            return res.status(400).json({ mess: "ID không hợp lệ hoặc không tồn tại" });
        }

        const data = await prisma.thongbao.findUnique({
            where: {
                id: parseInt(id)
            }
        });

        return res.status(200).json({ mess: "Thành Công", data: data });
    } catch (error) {
        return res.status(500).json({ mess: "Thất Bại !!!", error: error.message });
    }
}

// Tạo thông báo mới
export const createThongBao = async (req, res) => {
    try {
        const { denNguoiDung, tieuDe, noiDung, ngayGui } = req.body;
        // Kiểm tra dữ liệu đầu vào
        if (!denNguoiDung || !tieuDe || !noiDung) {
            return res.status(400).json({ mess: "Thiếu dữ liệu đầu vào" });
        }
        // Kiểm tra tiêu đề đã tồn tại chưa (dùng findFirst thay vì findUnique)
        const existingThongBao = await prisma.thongbao.findFirst({
            where: { tieuDe: tieuDe }
        });
        // Nếu tiêu đề đã tồn tại, trả về lỗi
        if (existingThongBao) {
            return res.status(409).json({ mess: "Tiêu đề đã tồn tại" });
        }
        // Tạo thông báo mới
        const data = await prisma.thongbao.create({
            data: {
                denNguoiDung,
                tieuDe,
                noiDung,
                ngayGui
            }
        });
        return res.status(201).json({ mess: "Tạo thông báo thành công", data: data });
    } catch (error) {
        return res.status(500).json({ mess: "Thất Bại !!!", error: error.message });
    }
};

// Cập nhật thông báo
export const updateThongBao = async (req, res) => {
    try {
        const { id } = req.params;
        const { denNguoiDung, tieuDe, noiDung, ngayGui } = req.body;
        const baiVietId = parseInt(id);
        // Kiểm tra dữ liệu đầu vào
        if (!denNguoiDung || !tieuDe || !noiDung) {
            return res.status(400).json({ mess: "Thiếu dữ liệu đầu vào" });
        }
        // Kiểm tra bài viết có tồn tại không
        const existingBaiViet = await prisma.baiviet.findFirst({
            where: { id: baiVietId }
        });
        if (!existingBaiViet) {
            return res.status(404).json({ mess: "Bài viết không tồn tại" });
        }
        // Cập nhật bài viết
        const data = await prisma.baiviet.update({
            where: { id: baiVietId },
            data: {
                denNguoiDung,
                tieuDe,
                noiDung,
                ngayGui
            }
        });
        return res.status(200).json({ mess: "Cập nhật bài viết thành công", data: data });
    } catch (error) {
        return res.status(500).json({ mess: "Thất Bại !!!", error: error.message });
    }
};

// Xóa thông báo
export const deleteThongBao = async (req, res) => {
    try {
        const { id } = req.params;
        const baiVietId = parseInt(id);
        // Kiểm tra bài viết có tồn tại không
        const existingBaiViet = await prisma.baiviet.findFirst({
            where: { id: baiVietId }
        });
        if (!existingBaiViet) {
            return res.status(404).json({ mess: "Bài viết không tồn tại" });
        }
        // Xóa bài viết
        await prisma.baiviet.delete({
            where: { id: baiVietId }
        });
        return res.status(200).json({ mess: "Xóa bài viết thành công" });
    } catch (error) {
        return res.status(500).json({ mess: "Thất Bại !!!", error: error.message });
    }
};

//Tìm thong báo theo tiêu đề
export const searchThongBaoByTieuDe = async (req, res) => {
    try {
        const { tieuDe } = req.query;
        if (!tieuDe) {
            return res.status(400).json({ mess: "Thiếu tiêu đề để tìm kiếm" });
        }
        const data = await prisma.thongbao.findMany({
            where: {
                tieuDe: {
                    contains: tieuDe,
                    mode: 'insensitive' // Tìm kiếm không phân biệt chữ hoa thường
                }
            }
        });
        return res.status(200).json({ mess: "Thành Công", data: data });
    } catch (error) {
        return res.status(500).json({ mess: "Thất Bại !!!", error: error.message });
    }
};  
