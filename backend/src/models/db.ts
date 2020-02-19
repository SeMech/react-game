import mongoose from 'mongoose';
import colors from 'colors';

import CONFIG_DB from "../config/db_config";

const db = mongoose;
db.connect(CONFIG_DB.uris, CONFIG_DB.options).then(() => {
    console.log(colors.green.bold('DataBase connected success'));
});

export default db;
