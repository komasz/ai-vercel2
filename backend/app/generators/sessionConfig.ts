import { sessionUpdate } from '../sessionConfiguration/config';
import * as fs from 'fs';

//Helps to paste whole configuration for Prompt Engineer
const jsonString = JSON.stringify(sessionUpdate, null, 2);
const parsedObject = JSON.parse(jsonString);

function replaceQuotesInStrings(obj: any): any {
  if (typeof obj === 'string') {
    return obj.replace(/"/g, "'");
  } else if (Array.isArray(obj)) {
    return obj.map(replaceQuotesInStrings);
  } else if (typeof obj === 'object' && obj !== null) {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [key, replaceQuotesInStrings(value)])
    );
  }
  return obj;
}

const updatedObject = replaceQuotesInStrings(parsedObject);
const updatedJsonString = JSON.stringify(updatedObject, null, 2).replace(/\\n/g, '\n');

fs.writeFileSync('dist/sessionUpdate.json', updatedJsonString);

console.log('The sessionUpdate.json file has been generated.');
