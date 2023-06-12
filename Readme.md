<h3 style="font-weight:bold;"> Run these on terminal before start the project: </h3>
$ npm install -g express-generator <br>
$ npx express --view ejs --git fsw_ch07 <br>

After the initial configuration are created, go to project folder <br>
$ cd fsw_ch07 <br>

Install Dependencies: <br>
To install the existing dependencies : $ npm install <br> 
Additional dependencies: $ npm install crypto-js formidable jquery jsdom pg pg-hstore sequelize jsonwebtoken<br>

Install Dev Dependencies <br>
$ npm install nodemon --save-dev dotenv-load --save-dev <br>

To run the file use: <br>
$ npm start <br>
For local: $ npm run start-local  <br>

Credentials: <br>
Copy env_example.txt as set as .env <br>
To get Superadmin encrypted password, proceed through the Sign Up page with Superadmin email and password. Once it's encrypted and saved to database, copy the password encryption to env. <br>
To get Superadmin token, go to file lib/generateAdminToken.js. This will generate token using the email and password you've input. <br>
Note: the uncrypted password on env is only for reference. Direct encryption might produce different outcome with the one that goes through web. <br>

<br>
For details about workflow and result reference, see file fsw_ch07_workflow.pptx