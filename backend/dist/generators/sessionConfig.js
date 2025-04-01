"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("../sessionConfiguration/config");
const fs = __importStar(require("fs"));
//Helps to paste whole configuration for Prompt Engineer
const jsonString = JSON.stringify(config_1.sessionUpdate, null, 2);
const parsedObject = JSON.parse(jsonString);
function replaceQuotesInStrings(obj) {
    if (typeof obj === 'string') {
        return obj.replace(/"/g, "'");
    }
    else if (Array.isArray(obj)) {
        return obj.map(replaceQuotesInStrings);
    }
    else if (typeof obj === 'object' && obj !== null) {
        return Object.fromEntries(Object.entries(obj).map(([key, value]) => [key, replaceQuotesInStrings(value)]));
    }
    return obj;
}
const updatedObject = replaceQuotesInStrings(parsedObject);
const updatedJsonString = JSON.stringify(updatedObject, null, 2).replace(/\\n/g, '\n');
fs.writeFileSync('dist/sessionUpdate.json', updatedJsonString);
console.log('The sessionUpdate.json file has been generated.');
