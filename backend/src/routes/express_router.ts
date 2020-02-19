import { Router } from 'express';
import colors from 'colors';
import { ioEmit } from "./sokets_router";

import {createNewRoom, findRooms, getCountRooms} from "../models/Room";

const router = Router();

router.use(function(req, res, next) {
    console.log(colors.green(' INFO request: '));
    const date = new Date();
    const log = `[${date.toDateString()},${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}]
        request IP: ${req.ip}
        request BODY: ${JSON.stringify(req.body)}
        request QUERY: ${JSON.stringify(req.query)}`;
    console.log(colors.blue(log));
    next();
});

router.get('/rooms', async (req, res) => {
    const rooms = await findRooms(req.query.offset, req.query.limit);
    const lengthRooms = await getCountRooms();
    if (lengthRooms === 0 || !rooms) {
        res.statusCode = 404;
        res.send('Not found rooms');
        return false;
    }
    res.json({
        rooms: rooms,
        length: lengthRooms
    });
});

router.post('/rooms', async (req, res) => {
    try {
        const room = createNewRoom(req.body.name);
        await room.save();
        ioEmit('updateRooms');
        res.statusCode = 200;
        res.end();
    } catch (e) {
        console.log(colors.red(JSON.stringify(e)));
        res.statusCode = 400;
        res.send(e);
    }
});

export default router;
