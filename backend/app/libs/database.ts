import { JsonDB, Config } from 'node-json-db';

export const depilacjaSiteDb = new JsonDB(new Config('db', true, false, '/'));
