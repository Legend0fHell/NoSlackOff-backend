import * as user_ctrl from "./controllers/UserController.js";
import * as session_ctrl from "./controllers/SessionController.js";
import * as debug_ctrl from "./controllers/DebugController.js";

export const initWebRoutes = (app, debug) => {
    app.route("/user/register")
        .post(user_ctrl.registerUser);

    app.route("/user/get")
        .get(user_ctrl.getUser);

    app.route("/session/create")
        .post(session_ctrl.createSession);

    app.route("/session/get")
        .get(session_ctrl.getSession);

    app.route("/session/end")
        .post(session_ctrl.endSession);

    app.route("/session/get_user")
        .get(session_ctrl.getUserSessions);

    app.route("/session/get_user_length")
        .get(session_ctrl.getUserSessionLength);

    if (debug) {
        app.route("/debug/db/drop")
            .get(debug_ctrl.debugDropAllTables);

        app.route("/debug/db/create")
            .get(debug_ctrl.debugCreateAllTables);

        app.route("/debug/db/reset")
            .get(debug_ctrl.debugResetAllTables);
    }
};
