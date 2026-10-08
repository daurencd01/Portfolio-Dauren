const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const files = [
  ['libphonenumber-js/bundle/libphonenumber-max.js', 'libphonenumber-max.js'],
  ['libphonenumber-js/LICENSE', 'libphonenumber.LICENSE'],
  ['zxcvbn/dist/zxcvbn.js', 'zxcvbn.js'],
  ['zxcvbn/LICENSE.txt', 'zxcvbn.LICENSE'],
];
fs.mkdirSync(path.join(root, 'js/vendor'), { recursive: true });
for (const [source, target] of files) fs.copyFileSync(path.join(root, 'node_modules', source), path.join(root, 'js/vendor', target));
console.log('KØZ browser libraries synced, with licenses.');
