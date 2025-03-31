import { sessionUpdate } from '../sessionConfiguration/config';
import * as fs from 'fs';

//Helps to paste whole configuration for Prompt Engineer
fs.writeFileSync(
  'dist/sessionUpdate.json',
  JSON.stringify(sessionUpdate, null, 2),
);

console.log('The sessionUpdate.json file has been generated.');
