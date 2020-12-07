const path = require("path");
const toped = require("./toped");
require("dotenv").config({ path: path.resolve(__dirname, "./.env") });
(async () => {
  await toped.init();
  await toped.ambilHarga();
  await toped.ambilTanggal();
  await toped.simpanData();
  await toped.closeBrowser();
})();
