import express from 'express';
import cors from 'cors';
import http from 'http';
import io from './routes/sokets_router';
import router from "./routes/express_router";

const app = express();
const server = http.createServer(app);
const socket = io.attach(server, {
    origins: '*:*',
    path: '/socket',
    serveClient: false,
});

app.use(cors());
app.use(express.json());

app.use('/api', router);

export { app, server, socket };


