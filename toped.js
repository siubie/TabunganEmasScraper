const puppeteer = require("puppeteer");
const BASE_URL = "https://www.tokopedia.com/emas/harga-hari-ini/";
const moment = require("moment");
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const adapter = new FileSync("db.json");
const db = low(adapter);
const toped = {
  browser: null,
  page: null,
  maxDelay: 5000,
  minDelay: 3000,
  harga: null,
  tanggal: null,
  init: async () => {
    try {
      toped.browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      });
      toped.page = await toped.browser.newPage();

      await toped.page.goto(BASE_URL, { waitUntil: "networkidle2" });
    } catch (error) {
      console.log(error.stack);
      await toped.browser.close();
    }
  },
  ambilHarga: async () => {
    toped.harga = await toped.page.$$eval(".main-price", (element) =>
      element.map((val) => val.textContent.replace(/^Rp/, ""))
    );
  },
  ambilTanggal: async () => {
    toped.tanggal = await toped.page.$eval(
      "time",
      (element) => element.textContent
    );
  },
  simpanData: async () => {
    let dataHarga = {
      tanggal: toped.tanggal,
      beli: toped.harga[0],
      jual: toped.harga[1],
      tanggalScrape: moment().format("YYYY-MM-DD hh:mm:ss"),
    };
    db.set("harga", dataHarga).write();
    db.get("history").push(dataHarga).write();
  },
  closeBrowser: async () => {
    await toped.browser.close();
  },
};
module.exports = toped;
