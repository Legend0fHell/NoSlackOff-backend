import knex from "knex";
import fs from "fs";

import dotenv from "dotenv";
dotenv.config();

const db_file = process.env.DB_DIR + "/" + process.env.DB_FILE + ".sqlite3";

const knex_options = {
    client: "better-sqlite3",
    connection: {
        filename: db_file,
    },
    useNullAsDefault: true,
};

export const db = knex(knex_options);
db.raw("PRAGMA journal_mode = WAL;");

const createUserTable = async () => {
    return new Promise((resolve, reject) => {
        db.schema.hasTable("users").then((exists) => {
            if (exists) return resolve();
            db.schema.createTable("users", (table) => {
                table.increments();
                table.string("user_id").notNullable();
                table.string("username").notNullable();
                table.jsonb("powerups").notNullable();
            });
            console.log("[Database] Created users table");
        }).then(() => {
            return resolve();
        }).catch((err) => {
            return reject(err);
        });
    });
};

const createTables = async () => {
    await createUserTable();
};

export const initKnex = async () => {
    return new Promise((resolve, reject) => {
        if (fs.existsSync(db_file)) return resolve();
        try {
            console.log("[Database] Database file not found. Creating a new one...");
            if (!fs.existsSync(process.env.DB_DIR)) {
                fs.mkdirSync(process.env.DB_DIR);
            }
            fs.writeFileSync(db_file, "");
            const db2 = knex(knex_options);
            db2.raw("PRAGMA journal_mode = WAL;").then(async () => {
                createTables().then(() => {
                    resolve();
                }).catch((err) => {
                    reject(err);
                });
            });
        } catch (err) {
            reject(err);
        }
    });
};
