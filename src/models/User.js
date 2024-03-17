import {b56gen} from "../utils/random_gen.js";
import {db} from "../db.js";

export class User {
    constructor(data, user_id = b56gen(6), powerups = []) {
        if (data === undefined || data === null) {
            return null;
        }

        if (data !== undefined && data !== null && data.constructor == Object) {
            this.user_id = data.user_id;
            this.username = data.username;
            this.powerups = data.powerups;
            return;
        }

        this.user_id = user_id;
        this.username = data;

        if (powerups !== undefined && powerups !== null && powerups.constructor == Array) {
            this.powerups = JSON.stringify(powerups);
        } else {
            this.powerups = powerups;
        }
    }

    toJSON() {
        return {
            user_id: this.user_id,
            username: this.username,
            powerups: JSON.parse(this.powerups),
        };
    }

    get getUsername() {
        return this.username;
    }

    get getUserId() {
        return this.user_id;
    }

    get getPowerups() {
        return JSON.parse(this.powerups);
    }

    set setUsername(username) {
        this.username = username;
    }

    registerUser() {
        return new Promise((resolve, reject) => {
            db("users").where("user_id", this.user_id).first().then((row) => {
                if (row) return reject(new Error("User already exists"));
                db("users").insert(this).then((row) => {
                    resolve(row);
                }).catch((err) => {
                    reject(err);
                });
            }).catch((err) => {
                return reject(err);
            });
        });
    }
}


export const findUser = async (user_id) => {
    return new Promise((resolve, reject) => {
        db("users").where("user_id", user_id).first().then((row) => {
            resolve(row ? new User(row) : null);
        }).catch((err) => {
            reject(err);
        });
    });
};
