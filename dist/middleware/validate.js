"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const BaseController_1 = require("../controllers/BaseController");
const validate = (schemas) => (req, res, next) => {
    try {
        if (schemas.body)
            req.body = schemas.body.parse(req.body);
        if (schemas.query)
            req.query = schemas.query.parse(req.query);
        if (schemas.params)
            req.params = schemas.params.parse(req.params);
        next();
    }
    catch (err) {
        const controller = new BaseController_1.BaseController();
        return res.status(400).json({
            metaData: controller.metaData(400),
            responseMessage: "Please fill in the form correctly",
            errors: (err === null || err === void 0 ? void 0 : err.errors) || err,
        });
    }
};
exports.validate = validate;
