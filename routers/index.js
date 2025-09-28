import baiVietRouter from "./baiViet.route.js";
import danhMucRouter from "./danhMuc.route.js";
import thongBaoRouter from "./thongBao.route.js";

const Routes = (app) => {
    app.use('/api/baiViet', baiVietRouter);
    app.use('/api/thongBao', thongBaoRouter);
    app.use('/api/danhMuc', danhMucRouter);
}



export default Routes;