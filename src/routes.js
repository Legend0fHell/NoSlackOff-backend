import * as user_ctrl from "./controllers/UserController.js";

export const initWebRoutes = (app) => {
    app.route("/user/register")
        .post(user_ctrl.registerUser);

    app.route("/user/get")
        .get(user_ctrl.getUser);
};
