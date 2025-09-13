import prisma from "../models/primsa.model.js";

//Lây tất cả bài viết
export const getAllBaiViet = async (req, res) => {
    try {
        const data = await prisma.baiviet.findMany();
        return res.status(200).json({ mess: "Thành Công", data: data });
    } catch (error) {
        res.status(500).json({ mess: "Thất Bại !!!", error: error.message });
    }
};
// Lấy bài viết theo ID
export const getBaiVietById = async (req, res) => {
    try {
        const { id } = req.params
        const data = await prisma.baiviet.findUnique({
            where: {
                id: parseInt(id)
            }
        });
        return res.status(200).json({ mess: "Thành Công", data: data });
    } catch (error) {
        return res.status(500).json({ mess: "Thất Bại !!!", error: error.message });
    }
}

export const createBaiViet = async (req, res) => {
    try {
        const { tenBaiViet, moTa, noiDung, tacGia } = req.body;

        // Kiểm tra dữ liệu đầu vào
        if (!tenBaiViet || !noiDung || !tacGia) {
            return res.status(400).json({ mess: "Thiếu dữ liệu đầu vào" });
        }

        // Kiểm tra tiêu đề đã tồn tại chưa (dùng findFirst thay vì findUnique)
        const existingBaiViet = await prisma.baiviet.findFirst({
            where: { tenBaiViet: tenBaiViet }
        });

        // Nếu tiêu đề đã tồn tại, trả về lỗi
        if (existingBaiViet) {
            return res.status(409).json({ mess: "Tiêu đề đã tồn tại" });
        }

        // Tạo bài viết mới
        const data = await prisma.baiviet.create({
            data: {
                tenBaiViet,
                moTa,
                noiDung,
                tacGia
            }
        });

        return res.status(201).json({ mess: "Tạo bài viết thành công", data: data });
    } catch (error) {
        return res.status(500).json({ mess: "Thất Bại !!!", error: error.message });
    }
};

//Update bài viết
export const updateBaiViet = async (req, res) => {
    try {
        const { id } = req.params;
        const { tenBaiViet, moTa, noiDung, tacGia } = req.body;

        // Ép kiểu ID sang số
        const baiVietId = Number(id);

        if (isNaN(baiVietId)) {
            return res.status(400).json({ mess: "ID không hợp lệ" });
        }

        // Kiểm tra dữ liệu đầu vào
        if (!tenBaiViet || !noiDung || !tacGia) {
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
                tenBaiViet,
                moTa,
                noiDung,
                tacGia,
                ngayCapNhat: new Date() // cập nhật thời gian nếu muốn
            }
        });

        return res.status(200).json({ mess: "Cập nhật thành công", data });
    } catch (error) {
        return res.status(500).json({ mess: "Thất bại !!!", error: error.message });
    }
};

//Xóa bài viết
export const deleteBaiViet = async (req, res) => {
    try {
        const { id } = req.params;
        const baiVietId = Number(id);
        if (isNaN(baiVietId)) {
            return res.status(400).json({ mess: "ID không hợp lệ" });
        }
        const existingBaiViet = await prisma.baiviet.findUnique({
            where: { id: baiVietId }
        });
        if (!existingBaiViet) {
            return res.status(404).json({ mess: "Bài viết không tồn tại" });
        }
        await prisma.baiviet.delete({
            where: { id: baiVietId }
        });
        return res.status(200).json({ mess: "Xóa bài viết thành công" });
    } catch (error) {
        return res.status(500).json({ mess: "Thất bại !!!", error: error.message });
    }
};  