import {getCurrentTimestamp} from "../utils.js";
import {db} from "../db.js";

export class Session {
    constructor(data, start_at = getCurrentTimestamp(), end_at = getCurrentTimestamp() + 3155695200000) {
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

    toDB() {
        return {
            user_id: this.getUserId,
            start_at: this.getStartTime,
            end_at: this.getEndTime,
        };
    }

    toJSON() {
        return {
            session_id: this.getSessionId,
            user_id: this.getUserId,
            start_at: this.getStartTime,
            end_at: this.getEndTime,
            length: this.getLength,
        };
    }

    get getSessionId() {
        return this.session_id;
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

    set setSessionId(session_id) {
        this.session_id = session_id;
    }

    set setEndTime(end_at) {
        this.end_at = end_at;
    }

    registerSession() {
        return new Promise((resolve, reject) => {
            db("sessions").insert(this.toDB()).then((row) => {
                this.setSessionId = row[0];
                resolve(row);
            }).catch((err) => {
                reject(err);
            });
        });
    }

    endSession() {
        return new Promise((resolve, reject) => {
            const currentTimestamp = getCurrentTimestamp();
            db("sessions")
                .where("session_id", this.getSessionId)
                .andWhere("end_at", ">", currentTimestamp)
                .update({end_at: currentTimestamp})
                .then((row) => {
                    if (row) {
                        this.setEndTime = currentTimestamp;
                        return resolve();
                    }
                    return reject(new Error("Invalid session or session already ended"));
                }).catch((err) => {
                    return reject(err);
                });
        });
    }

    updateSession(newSession) {
        if (newSession.constructor != Session) {
            return Promise.reject(new Error("Invalid session"));
        }
        return new Promise((resolve, reject) => {
            db("sessions").where("session_id", this.getSessionId).update(this.toDB()).then((row) => {
                Object.assign(this, newSession);
                resolve(row);
            }).catch((err) => {
                reject(err);
            });
        });
    }

    static findActiveSession(user_id) {
        return new Promise((resolve, reject) => {
            db("sessions")
                .where("user_id", user_id)
                .andWhere("end_at", ">", getCurrentTimestamp())
                .first()
                .then((row) => {
                    resolve(row ? new Session(row) : null);
                }).catch((err) => {
                    reject(err);
                });
        });
    }

    static findSession(session_id, activeRequired = false) {
        return new Promise((resolve, reject) => {
            db("sessions")
                .where("session_id", session_id)
                .andWhere("end_at", ">", activeRequired ? getCurrentTimestamp() : 0)
                .first()
                .then((row) => {
                    resolve(row ? new Session(row) : null);
                }).catch((err) => {
                    reject(err);
                });
        });
    }

    static findUserSessions(user_id, from = 0, to = getCurrentTimestamp(), limit = 25, offset = 0) {
        return new Promise((resolve, reject) => {
            db("sessions")
                .where("user_id", user_id)
                .andWhere("start_at", "<=", to)
                .andWhere("end_at", ">=", from)
                .orderBy("end_at", "desc")
                .limit(limit)
                .offset(offset)
                .then((rows) => {
                    resolve(rows.map((row) => new Session(row)));
                }).catch((err) => {
                    reject(err);
                });
        });
    }

    static calculateUserSessionLength(user_id, from = 0, to = getCurrentTimestamp()) {
        return new Promise((resolve, reject) => {
            db("sessions")
                .where("user_id", user_id)
                .select("start_at", "end_at")
                .andWhere("start_at", "<=", to)
                .andWhere("end_at", ">=", from)
                .orderBy("end_at", "desc")
                .then((rows) => {
                    const results = [];
                    let right_bound = new Date(to);
                    let left_bound = new Date(to);
                    left_bound.setHours(0, 0, 0, 0);
                    if (left_bound.getTime() < from) left_bound = new Date(from);
                    let total_length = 0;
                    for (const row of rows) {
                        do {
                            if (row.start_at < left_bound.getTime()) {
                                right_bound = new Date(left_bound);
                                left_bound = new Date(row.end_at);
                                left_bound.setHours(0, 0, 0, 0);
                                if (left_bound.getTime() < from) left_bound = new Date(from);
                                if (total_length > 0) {
                                    results.push({
                                        start_at: left_bound.getTime(),
                                        end_at: right_bound.getTime(),
                                        length: total_length,
                                    });
                                }
                                total_length = 0;
                            }
                            total_length += Math.min(right_bound.getTime(), row.end_at) - Math.max(left_bound.getTime(), row.start_at);
                        }
                        while (row.start_at < left_bound.getTime());
                    }
                    if (total_length > 0) {
                        results.push({
                            start_at: left_bound.getTime(),
                            end_at: right_bound.getTime(),
                            length: total_length,
                        });
                    }
                    resolve(results);
                }).catch((err) => {
                    reject(err);
                });
        });
    }
}

export const createSessionTable = async () => {
    return new Promise((resolve, reject) => {
        db.schema.hasTable("sessions").then((exists) => {
            if (exists) return resolve();
            db.schema.createTable("sessions", (table) => {
                table.increments("session_id");
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
