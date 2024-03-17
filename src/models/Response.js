export class Response {
    constructor(status = "ok", message = null, data = null) {
        this.status = status;
        this.message = message;
        this.data = data;
    }

    toJSON() {
        return {
            status: this.status,
            message: this.message,
            data: this.data,
        };
    }
}
