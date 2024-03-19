import {Session} from "../models/Session.js";
import {Response} from "../models/Response.js";

export const createSession = async (req, res) => {
    const user_id = req.body.user_id;
    const tmpSession = await Session.findActiveSession(user_id);
    if (tmpSession) {
        return res.json(new Response("err", "User already has an active session", tmpSession.toJSON()));
    }
    const session = new Session(user_id);
    try {
        await session.registerSession();
        return res.json(new Response("ok", "Session created", session.toJSON()));
    } catch (err) {
        return res.json(new Response("err", err.message));
    }
};

export const getSession = async (req, res) => {
    const session_id = req.body.session_id;
    try {
        const session = await Session.findSession(session_id);
        if (!session) return res.json(new Response("err", "Session not found"));
        return res.json(new Response("ok", "Session found", session.toJSON()));
    } catch (err) {
        return res.json(new Response("err", err.message));
    }
};

export const endSession = async (req, res) => {
    try {
        let session;
        if (req.body.user_id) {
            const user_id = req.body.user_id;
            session = await Session.findActiveSession(user_id);
            if (!session) return res.json(new Response("err", "No active session found"));
        } else if (req.body.session_id) {
            const session_id = req.body.session_id;
            session = await Session.findSession(session_id);
            if (!session) return res.json(new Response("err", "Session not found"));
        } else {
            return res.json(new Response("err", "No user_id or session_id provided"));
        }
        await session.endSession();
        return res.json(new Response("ok", "Session ended", session.toJSON()));
    } catch (err) {
        return res.json(new Response("err", err.message));
    }
};

export const getUserSessions = async (req, res) => {
    const user_id = req.body.user_id;
    const limit = req.body.limit || undefined;
    const offset = req.body.offset || undefined;
    const start_at = req.body.start_at || undefined;
    const end_at = req.body.end_at || undefined;
    try {
        const sessions = await Session.findUserSessions(user_id, start_at, end_at, limit, offset);
        return res.json(new Response("ok", "Sessions found", sessions.map((session) => session.toJSON())));
    } catch (err) {
        return res.json(new Response("err", err.message));
    }
};

export const getUserSessionLength = async (req, res) => {
    const user_id = req.body.user_id;
    const start_at = req.body.start_at || undefined;
    const end_at = req.body.end_at || undefined;
    try {
        const results = await Session.calculateUserSessionLength(user_id, start_at, end_at);
        return res.json(new Response("ok", "Sessions calculated", results));
    } catch (err) {
        return res.json(new Response("err", err.message));
    }
};
