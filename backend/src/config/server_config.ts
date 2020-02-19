import os from "os";

const LISTEN_PORT = 3000;
const LISTEN_ADDRESS = os.networkInterfaces().wlo1 ? os.networkInterfaces().wlo1[0].address : '127.0.0.1';

export { LISTEN_PORT, LISTEN_ADDRESS };
