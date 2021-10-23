const app = require("./app");
const port = 3000;
async function main() {
  await app.listen(port);
  console.log("Server on port", port);
}

main();
