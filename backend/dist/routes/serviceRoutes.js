"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const serviceController_1 = require("../controllers/serviceController");
const router = (0, express_1.Router)();
router.get('/', serviceController_1.getAllServices);
router.get('/:slug', serviceController_1.getServiceBySlug);
exports.default = router;
