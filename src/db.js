import knex from "knex";
import fs from "fs";

import dotenv from "dotenv";
dotenv.config();

const db_file = process.env.DB_DIR + "/" + process.env.DB_FILE + ".sqlite3";

if (!fs.existsSync(process.env.DB_DIR)) {
    fs.mkdirSync(process.env.DB_DIR);
}
if (!fs.existsSync(db_file)) {
    console.log("[Database] Database file not found. Creating a new one...");
    fs.writeFileSync(db_file, "");
}

const knex_options = {
    client: "better-sqlite3",
    connection: {
        filename: db_file,
    },
    useNullAsDefault: true,
};

export const db = knex(knex_options);

db.raw("PRAGMA journal_mode = WAL;").then(() => {
    console.log("[Database] Connected to " + db_file);
});

import {createUserTable} from "./models/User.js";
import {createSessionTable} from "./models/Session.js";

const createTables = async () => {
    await createUserTable();
    await createSessionTable();
};

export const initKnex = async () => {
    try {
        db.raw("PRAGMA journal_mode = WAL;").then(async () => {
            await createTables();
        });
    } catch (err) {
        console.error(err);
    }
};
