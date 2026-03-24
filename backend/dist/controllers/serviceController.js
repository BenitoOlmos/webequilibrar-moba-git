"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getServiceBySlug = exports.getAllServices = void 0;
const mock_1 = require("../data/mock");
const getAllServices = (req, res) => {
    const response = {
        success: true,
        data: mock_1.services,
        timestamp: new Date().toISOString()
    };
    res.json(response);
};
exports.getAllServices = getAllServices;
const getServiceBySlug = (req, res) => {
    const { slug } = req.params;
    const service = mock_1.services.find(s => s.slug === slug);
    if (!service) {
        res.status(404).json({
            success: false,
            data: null,
            timestamp: new Date().toISOString()
        });
        return;
    }
    const response = {
        success: true,
        data: service,
        timestamp: new Date().toISOString()
    };
    res.json(response);
};
exports.getServiceBySlug = getServiceBySlug;
