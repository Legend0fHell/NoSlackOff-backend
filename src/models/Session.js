
export class Session {
    constructor(user_id, start, end) {
        this.user_id = user_id;
        this.start = start;
        this.end = end;
    }

    toJSON() {
        return {
            user_id: this.user_id,
            start: this.start,
            end: this.end,
        };
    }

    get getUserId() {
        return this.user_id;
    }

    get getStartTime() {
        return this.start;
    }

    get getEndTime() {
        return this.end;
    }

    set setUserId(user_id) {
        this.user_id = user_id;
    }

    set setStartTime(start) {
        this.start = start;
    }

    set setEndTime(end) {
        this.end = end;
    }
}
