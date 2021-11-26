const fs = require('fs');
const path = require('path');
const {writeFile} = require('fs');
const {argv} = require('yargs');
// read environment variables from .env file
require('dotenv').config();
// read the command line arguments passed with yargs
const environment = argv.environment;
const isProduction = environment === 'prod';
const targetPath = isProduction
  ? `./src/environments/environment.prod.ts`
  : `./src/environments/environment.ts`;
// we have access to our environment variables
// in the process.env object thanks to dotenv
const environmentFileContent = `
export const environment = {
   production: ${isProduction},
   APP_ID: '${process.env.APP_ID}',
   AUTH_KEY: "${process.env.AUTH_KEY}",
   AUTH_SECRET: "${process.env.AUTH_SECRET}",
   SERVER: "${process.env.SERVER}",
};
`;
fs.promises.mkdir(path.dirname(targetPath), {recursive: true})
  .then(()=>{
    fs.promises.writeFile(targetPath, environmentFileContent, function (err: any) {
      if (err) {
        console.log(err);
      }
      console.log(`Wrote variables to ${targetPath}`);
    })
  })
// write the content to the respective file

