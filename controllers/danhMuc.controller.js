// Import đối tượng prisma để thao tác với cơ sở dữ liệu
import prisma from "../models/primsa.model.js"

// Hàm lấy toàn bộ danh mục
export const getAllDanhMuc = async (req, res) => {
    try {
        // Gọi tới bảng 'danhmuc' và lấy tất cả danh mục
        // - orderBy: sắp xếp theo tên danh mục tăng dần
        // - include: lấy thêm dữ liệu từ bảng 'baiviet' liên kết với danh mục
        const danhMuc = await prisma.danhmuc.findMany({
            orderBy: { tenDanhMuc: 'asc' },
            include: { baiviet: true },
        });

        // Gửi phản hồi thành công về client kèm danh sách danh mục
        res.status(200).json({
            mess: "Lấy danh mục sách thành công",
            data: danhMuc
        });
    } catch (error) {
        // Xử lý lỗi khi có vấn đề xảy ra trong quá trình truy vấn
        res.status(500).json({
            mess: "Lấy danh mục sách thất bại",
            error: error.message
        })
    }
}

// Hàm lấy danh mục theo ID
export const getDanhMucById = async (req, res) => {
    try {
        // Lấy id từ URL (params)
        const { id } = req.params;

        // Kiểm tra tính hợp lệ của id
        if (!id || isNaN(id)) {
            return res.status(400).json({ mess: "ID không hợp lệ hoặc không tồn tại" });
        }

        // Tìm danh mục theo ID trong bảng 'danhmuc'
        // - include: lấy thêm dữ liệu bài viết liên quan
        const data = await prisma.danhmuc.findUnique({
            where: { id: Number(id) },
            include: { baiviet: true },
        });

        // Nếu không tìm thấy danh mục thì trả về lỗi 404
        if (!data) {
            return res.status(404).json({ mess: `Không tìm thấy danh mục với ID = ${id}` });
        }

        // Trả kết quả thành công với dữ liệu danh mục
        return res.status(200).json({ mess: "Lấy theo ID thành công", data });
    } catch (error) {
        // Bắt lỗi khi có sự cố xảy ra trong quá trình truy vấn
        return res.status(500).json({
            mess: "Lấy theo ID không thành công!!!",
            error: error.message,
        });
    }
};

// Hàm tạo mới danh mục
export const createDanhMuc = async (req, res) => {
    try {
        // Lấy dữ liệu gửi từ client qua body
        const { tenDanhMuc, moTa, trangThai, baiViet_id } = req.body;

        // Kiểm tra các trường bắt buộc phải có
        if (!tenDanhMuc || baiViet_id === undefined) {
            return res.status(400).json({ mess: "Vui lòng nhập đầy đủ thông tin bắt buộc: tenDanhMuc và baiViet_id" });
        }

        // Kiểm tra kiểu dữ liệu của trường 'trangThai' nếu có gửi
        if (trangThai !== undefined && typeof trangThai !== "boolean") {
            return res.status(400).json({ mess: "trangThai phải là kiểu boolean" });
        }

        // Kiểm tra 'baiViet_id' có phải là số hay không
        if (isNaN(baiViet_id)) {
            return res.status(400).json({ mess: "baiViet_id phải là một số hợp lệ" });
        }

        // Kiểm tra tên danh mục đã tồn tại chưa (dùng findFirst thay vì findUnique)
        const existingDanhMuc = await prisma.danhmuc.findFirst({
            where: { tenDanhMuc: tenDanhMuc }
        });

        // Nếu tên danh mục đã tồn tại, trả về lỗi
        if (existingDanhMuc) {
            return res.status(409).json({ mess: "Tên danh mục đã tồn tại" });
        }

        // Kiểm tra xem bài viết với baiViet_id có tồn tại không
        const existingBaiViet = await prisma.baiviet.findUnique({
            where: { id: Number(baiViet_id) },
        });

        const data = await prisma.danhmuc.create({
            data: {
                tenDanhMuc,
                moTa,
                trangThai: trangThai !== undefined ? trangThai : true, // Mặc định là true nếu không gửi
                baiViet_id: Number(baiViet_id),
                ngayTao: new Date(), // Gán ngày tạo là thời điểm hiện tại
            },
        });

        // Trả kết quả khi tạo mới thành công
        return res.status(201).json({
            mess: "Tạo mới danh mục thành công",
            data,
        });
    } catch (error) {
        // Xử lý lỗi nếu quá trình tạo mới thất bại
        return res.status(500).json({
            mess: "Tạo mới danh mục không thành công!!!",
            error: error.message,
        });
    }
};

// Hàm cập nhật danh mục theo ID
export const updateDanhMuc = async (req, res) => {
    try {
        // Lấy id từ URL (params)
        const { id } = req.params;

        // Kiểm tra ID hợp lệ
        if (!id || isNaN(id)) {
            return res.status(400).json({ mess: "ID không hợp lệ hoặc không tồn tại" });
        }

        // Kiểm tra xem danh mục có tồn tại trong database hay không
        const existingDanhMuc = await prisma.danhmuc.findUnique({
            where: { id: Number(id) },
        });

        // Nếu không tìm thấy thì trả lỗi 404
        if (!existingDanhMuc) {
            return res.status(404).json({ mess: `Không tìm thấy danh mục với ID = ${id}` });
        }

        // Lấy dữ liệu cập nhật từ body
        const { tenDanhMuc, moTa, trangThai, baiViet_id } = req.body;

        // Kiểm tra baiViet_id nếu có gửi lên
        if (baiViet_id !== undefined && isNaN(baiViet_id)) {
            return res.status(400).json({ mess: "baiViet_id phải là một số hợp lệ" });
        }

        // Thực hiện cập nhật danh mục
        const data = await prisma.danhmuc.update({
            where: { id: Number(id) },
            data: {
                // Nếu người dùng không gửi trường nào thì giữ nguyên giá trị cũ
                tenDanhMuc: tenDanhMuc !== undefined ? tenDanhMuc : existingDanhMuc.tenDanhMuc,
                moTa: moTa !== undefined ? moTa : existingDanhMuc.moTa,
                trangThai: trangThai !== undefined ? trangThai : existingDanhMuc.trangThai,
                baiViet_id: baiViet_id !== undefined ? Number(baiViet_id) : existingDanhMuc.baiViet_id,
                ngayCapNhat: new Date(), // cập nhật lại ngày sửa đổi
            },
        });

        // Trả về kết quả cập nhật thành công
        return res.status(200).json({
            mess: "Cập nhật danh mục thành công",
            data,
        });
    } catch (error) {
        // Xử lý lỗi nếu cập nhật thất bại
        return res.status(500).json({
            mess: "Cập nhật danh mục không thành công!!!",
            error: error.message,
        });
    }
}

export const deleteDanhMuc = async (req, res) => {
    try {
        // Lấy id từ URL (params)
        const { id } = req.params;
        // Kiểm tra ID hợp lệ
        if (!id || isNaN(id)) {
            return res.status(400).json({ mess: "ID không hợp lệ hoặc không tồn tại" });
        }
        // Kiểm tra xem danh mục có tồn tại trong database hay không
        const existingDanhMuc = await prisma.danhmuc.findUnique({
            where: { id: Number(id) },
        });
        // Nếu không tìm thấy thì trả lỗi 404
        if (!existingDanhMuc) {
            return res.status(404).json({ mess: `Không tìm thấy danh mục với ID = ${id}` });
        }
        // Thực hiện xóa danh mục
        await prisma.danhmuc.delete({
            where: { id: Number(id) },
        });
        // Trả về kết quả xóa thành công
        return res.status(200).json({
            mess: "Xóa danh mục thành công",
        });
    } catch (error) {
        // Xử lý lỗi nếu xóa thất bại
        return res.status(500).json({
            mess: "Xóa danh mục không thành công!!!",
            error: error.message,
        });
    }
}