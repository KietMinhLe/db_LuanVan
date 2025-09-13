import baiVietRouter from "./baiViet.route.js";

const Routes = (app) => {
    app.use('/api/baiViet', baiVietRouter);
}

export default Routes;