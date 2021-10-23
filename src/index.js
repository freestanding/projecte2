const app = require("./app");

async function main() {
  await app.listen(3131);
  console.log("Server on port", 3131);
}

main();
