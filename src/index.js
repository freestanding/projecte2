const app = require("./app");
const port = 3131;
async function main() {
  await app.listen(port);
  console.log("Server on port", port);
}

main();
