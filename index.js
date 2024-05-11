const axios = require("axios");
const cheerio = require("cheerio");
const xlsx = require("xlsx");

const fs = require("node:fs");

const pageUrl =
  "https://www.amazon.in/s?k=mobile+phones&crid=3P3KGSJE5GDO6&sprefix=mobile+phones%2Caps%2C377&ref=nb_sb_noss_1";

const headers = {
  "content-type": "text/html",
};

const getWebPageData = async (url) => {
  try {
    const response = await axios.get(url, {
      headers,
    });
    const strData = response.data;
    fs.writeFileSync("webpagedata.txt", strData);
    // console.log(JSON.stringify(response.data));
  } catch (err) {
    console.log("ERROR_OCCURED", err);
  }
};

getWebPageData(pageUrl);

const getDataFromFile = () => {
  return fs.readFileSync("webpagedata.txt", { encoding: "utf-8" });
};

// console.log(getDataFromFile());
const pageHtmlString = getDataFromFile();

const $ = cheerio.load(pageHtmlString);
const mobiles = [];
const body = $("body");

const productDivs = $("div[data-asin]")
  .each((index, product) => {
    const name = $(product).find("span.a-size-medium.a-color-base.a-text-normal").text();
    const price = $(product).find("span.a-price-whole").text();
    const availability = $(product).find("span.a-size-base a-color-price").text();
    const rating = $(product).find("span.a-icon-alt").text();

    mobiles.push({ 
        name,
        price,
        availability,
        rating
    });
    // console.log(product.text());
  });
console.log(mobiles);

// const products = [];
// const productCards = $("div[data-asin]")
//   .find("span.a-size-medium.a-color-base.a-text-normal")
//   .each((index, element) => {
//     products.push({
//       name: $(element).text(), // document.getElementsByClassName("abc")[0].innerText (Vanilla JS Version)
//     });
//     // console.log($(element).text());
//   });

// // console.log(products);
const workbook = xlsx.utils.book_new();
const worksheet = xlsx.utils.json_to_sheet(mobiles);

xlsx.utils.book_append_sheet(workbook, worksheet, "Sheet1");
xlsx.writeFile(workbook, "products.xlsx");
