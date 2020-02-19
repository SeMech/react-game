import colors from 'colors';

import { server } from "./app";
import { LISTEN_PORT, LISTEN_ADDRESS } from "./config/server_config";

server.listen(LISTEN_PORT, () => {
    console.log(colors.green.bold(`Start server, address: ${LISTEN_ADDRESS}:${LISTEN_PORT} / localhost:${LISTEN_PORT}`));
});
