"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseController = void 0;
class BaseController {
    sendSuccess(res, data, message = "Success", code = 200) {
        return res
            .status(code)
            .json({ metaData: this.metaData(code), responseMessage: message, data });
    }
    metaData(code) {
        let message = "OK";
        switch (code) {
            case 200:
                message = "OK";
                break;
            case 201:
                message = "Created";
                break;
            case 204:
                message = "No Content";
                break;
            case 400:
                message = "Bad Request";
                break;
            case 401:
                message = "Unauthorized";
                break;
            case 403:
                message = "Forbidden";
                break;
            case 404:
                message = "Not Found";
                break;
            case 500:
                message = "Internal Server Error";
                break;
            default:
                break;
        }
        return {
            code,
            message,
        };
    }
    sendCreated(res, data, message = "Created") {
        return res
            .status(201)
            .json({ metaData: this.metaData(201), responseMessage: message, data });
    }
    sendError(res, error, code = 500) {
        var _a;
        const message = (error === null || error === void 0 ? void 0 : error.message) || "Internal server error";
        if ((_a = error.message) === null || _a === void 0 ? void 0 : _a.includes("found")) {
            return this.notFound(res);
        }
        if (code === 500) {
            console.error("ERROR : ", message);
        }
        return res
            .status(code)
            .json({ metaData: this.metaData(code), responseMessage: message });
    }
    notFound(res, message = "Not Found") {
        return res
            .status(404)
            .json({ metaData: this.metaData(404), responseMessage: message });
    }
    badRequest(res, message = "Bad Request") {
        return res
            .status(400)
            .json({ metaData: this.metaData(400), responseMessage: message });
    }
    unauthorized(res, message = "Unauthorized") {
        return res
            .status(401)
            .json({ metaData: this.metaData(401), responseMessage: message });
    }
    forbidden(res, message = "Forbidden") {
        return res
            .status(403)
            .json({ metaData: this.metaData(403), responseMessage: message });
    }
    redirect(res, url) {
        return res.redirect(url);
    }
}
exports.BaseController = BaseController;
