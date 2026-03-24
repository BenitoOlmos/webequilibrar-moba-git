"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const programController_1 = require("../controllers/programController");
const router = (0, express_1.Router)();
router.get('/', programController_1.getAllPrograms);
router.get('/:slug', programController_1.getProgramBySlug);
exports.default = router;
