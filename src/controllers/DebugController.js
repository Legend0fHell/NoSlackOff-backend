import * as DbController from "../db.js";
import {Response} from "../models/Response.js";

export const debugDropAllTables = async (req, res) => {
    try {
        await DbController.dropAllTables();
        return res.json(new Response("ok", "All tables dropped harder than a beat in a rap song."));
    } catch (err) {
        return res.json(new Response("err", err.message));
    }
};

export const debugCreateAllTables = async (req, res) => {
    try {
        await DbController.initKnex();
        return res.json(new Response("ok", "All tables created. You can now start using the API."));
    } catch (err) {
        return res.json(new Response("err", err.message));
    }
};

export const debugResetAllTables = async (req, res) => {
    try {
        await DbController.dropAllTables();
        await DbController.initKnex();
        return res.json(new Response("ok", "All tables reset. You can now start using the API."));
    } catch (err) {
        return res.json(new Response("err", err.message));
    }
};
