require("dotenv").config();

const password = process.env.PASSWORD;

const passwordEncoded = encodeURIComponent(password);

console.log(`[] PASSWORD : ${passwordEncoded}`);
