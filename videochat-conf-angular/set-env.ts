const fs = require('fs');
const path = require('path');
const {argv} = require('yargs');
// read environment variables from .env file
require('dotenv').config();
// read the command line arguments passed with yargs
const environment = argv.environment;
const isProduction = environment === 'prod';
const targetPath = isProduction
  ? `./src/environments/environment.prod.ts`
  : `./src/environments/environment.ts`;

const prodPath = './src/environments/environment.prod.ts';
const devPath = './src/environments/environment.ts';
// we have access to our environment variables
// in the process.env object thanks to dotenv
const environmentFileContent = `
export const environment = {
   production: ${isProduction},
   APP_ID: '${process.env.APP_ID}',
   AUTH_KEY: "${process.env.AUTH_KEY}",
   AUTH_SECRET: "${process.env.AUTH_SECRET}",
   SERVER: "${process.env.SERVER}",
   CHAT_ENDPOINT: "${process.env.CHAT_ENDPOINT}",
   API_ENDPOINT: "${process.env.API_ENDPOINT}"
};
`;
fs.promises.mkdir(path.dirname(prodPath), {recursive: true})
  .then(() => {
    fs.promises.writeFile(prodPath, environmentFileContent, function (err: any) {
      if (err) {
        console.log(err);
      }
      console.log(`Wrote variables to ${prodPath}`);
    })
  })
fs.promises.mkdir(path.dirname(devPath), {recursive: true})
  .then(() => {
    fs.promises.writeFile(devPath, environmentFileContent, function (err: any) {
      if (err) {
        console.log(err);
      }
      console.log(`Wrote variables to ${devPath}`);
    })
  })

// write the content to the respective file

