// async function main() {
//   await new Promise(resolve => setTimeout(1000, resolve));
//   console.log('done');
// }

// main();

import { add } from './utilities/add';
import { subtract } from './utilities/subtract';

console.log(`2 + 2 = ${add(2, 2)}`);
console.log(`2 - 2 = ${subtract(2, 2)}`);

setInterval(() => console.log('It works.'), 5000);
