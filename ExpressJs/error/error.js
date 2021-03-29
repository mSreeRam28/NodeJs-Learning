class BaseError extends Error{
    constructor(type='Error', status=400, description='Bad Request'){
        super(description);
        this.type = type;
        this.status = status;
        this.description = description;
        this.timestamp = new Date();

        Error.captureStackTrace(this);
    }
}

class UserNotFoundError extends BaseError{
    constructor(type='User Not Found Error', status=404, description='User not Found'){
        super(type, status, description);
    }
}

class ProductNotFoundError extends BaseError{
    constructor(type='Product Not Found Error', status=404, description='Product not Found'){
        super(type, status, description);
    }
}

module.exports = {
    UserNotFoundError,
    ProductNotFoundError
}