"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const programRoutes_1 = __importDefault(require("./routes/programRoutes"));
const serviceRoutes_1 = __importDefault(require("./routes/serviceRoutes"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Routes
app.use('/api/programs', programRoutes_1.default);
app.use('/api/services', serviceRoutes_1.default);
// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'C.O.R.E. Nervous System Online' });
});
// 2. Servir Archivos Estáticos (Frontend)
// El build de Vite se genera en la carpeta 'dist' en la raíz del proyecto.
// Desde 'server/dist' (producción) o 'server/src' (dev), subimos 2 niveles para llegar a la raíz.
const frontendPath = path_1.default.join(__dirname, '../../dist');
app.use(express_1.default.static(frontendPath));
// 3. SPA Fallback (Cualquier ruta no-API devuelve index.html)
app.get('*', (req, res) => {
    res.sendFile(path_1.default.join(frontendPath, 'index.html'));
});
app.listen(PORT, () => {
    console.log(`⚡️[server]: C.O.R.E. Backend running at http://localhost:${PORT}`);
});
