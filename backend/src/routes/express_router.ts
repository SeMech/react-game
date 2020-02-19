import { Router } from 'express';
import colors from 'colors';

import { createNewRoom } from "../models/Room";

const router = Router();

router.use(function(req, res, next) {
    console.log(colors.green(' INFO request: '));
    console.log(colors.blue(` request IP: ${req.ip}`));
    console.log(colors.blue(` request BODY: ${JSON.stringify(req.body)}`));
    next();
});

router.post('/rooms', async (req, res) => {
    try {
        const room = createNewRoom(req.body.name);
        await room.save();
        res.statusCode = 200;
        res.json(room);
    } catch (e) {
        console.log(colors.red(JSON.stringify(e)));
        res.statusCode = 400;
        res.send(e);
    }
});

export default router;
