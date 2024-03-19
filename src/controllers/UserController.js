import {User} from "../models/User.js";
import {Response} from "../models/Response.js";

export const registerUser = async (req, res) => {
    const username = req.body.username;
    const user = new User(username);
    try {
        await user.registerUser();
        return res.json(new Response("ok", "User registered", user.toJSON()));
    } catch (err) {
        return res.json(new Response("err", err.message));
    }
};

export const getUser = async (req, res) => {
    const user_id = req.body.user_id;
    try {
        const user = await User.findUser(user_id);
        if (!user) return res.json(new Response("err", "User not found"));
        return res.json(new Response("ok", "User found", user.toJSON()));
    } catch (err) {
        return res.json(new Response("err", err.message));
    }
};
