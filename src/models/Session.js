import {getCurrentTimestamp} from "../utils.js";
import {db} from "../db.js";

export class Session {
    constructor(data, start_at = getCurrentTimestamp(), end_at = getCurrentTimestamp() + 315569520000) {
        if (data === undefined || data === null) {
            return null;
        }

        if (data.constructor == Object) {
            Object.assign(this, data);
            return;
        }

        this.user_id = data;
        this.start_at = start_at;
        this.end_at = end_at;
    }

    toJSON() {
        return {
            user_id: this.user_id,
            start_at: this.start_at,
            end_at: this.end_at,
        };
    }

    get getUserId() {
        return this.user_id;
    }

    get getStartTime() {
        return this.start_at;
    }

    get getEndTime() {
        return this.end_at;
    }

    get getLength() {
        return this.end_at - this.start_at;
    }

    set setEndTime(end_at) {
        this.end_at = end_at;
    }
}

export const createSessionTable = async () => {
    return new Promise((resolve, reject) => {
        db.schema.hasTable("sessions").then((exists) => {
            if (exists) return resolve();
            db.schema.createTable("sessions", (table) => {
                table.increments("id");
                table.string("user_id").notNullable();
                table.timestamp("start_at").notNullable();
                table.timestamp("end_at").notNullable();
            }).then(() => {
                console.log("[Database] Created sessions table");
                resolve();
            }).catch((err) => {
                return reject(err);
            });
        }).then(() => {
            return resolve();
        }).catch((err) => {
            return reject(err);
        });
    });
};
