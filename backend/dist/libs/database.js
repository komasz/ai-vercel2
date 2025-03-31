"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.depilacjaSiteDb = void 0;
const node_json_db_1 = require("node-json-db");
exports.depilacjaSiteDb = new node_json_db_1.JsonDB(new node_json_db_1.Config('db', true, false, '/'));
