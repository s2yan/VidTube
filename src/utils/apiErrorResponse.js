class apiErrorResponse extends Error{
    constructor(message, statusCode, errors = [], stack = "", success = false){
        super(message);
        this.statusCode = statusCode;
        this.errors = errors;
        this.success = success;
        if(this.stack){
            this.stack = stack
        }
    }
}

export { apiErrorResponse };