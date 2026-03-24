"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProgramBySlug = exports.getAllPrograms = void 0;
const mock_1 = require("../data/mock");
const getAllPrograms = (req, res) => {
    const response = {
        success: true,
        data: mock_1.programs,
        timestamp: new Date().toISOString()
    };
    res.json(response);
};
exports.getAllPrograms = getAllPrograms;
const getProgramBySlug = (req, res) => {
    const { slug } = req.params;
    const program = mock_1.programs.find(p => p.slug === slug);
    if (!program) {
        res.status(404).json({
            success: false,
            data: null,
            timestamp: new Date().toISOString()
        });
        return;
    }
    const response = {
        success: true,
        data: program,
        timestamp: new Date().toISOString()
    };
    res.json(response);
};
exports.getProgramBySlug = getProgramBySlug;
