const fs = require("fs");
const http = require("http");
const url = require("url");

///////////////////////////////////////////////////////
//////////////////FILES///////
//blocking ,syncronous way
// const textIn = fs.readFileSync("./txt/input.txt", "utf-8");
// console.log(textIn);

// const textOut = `this is what we know: ${textIn}. \nCreated on ${Date.now()}`;
// fs.writeFileSync("./txt/output.txt", textOut);
// console.log("File written!");
//non blocking async way

// fs.readFile("./txt/start.txt", "utf-8", (err, data1) => {
//   fs.readFile(`./txt/${data1}.txt`, "utf-8", (err, data2) => {
//     console.log(data2);
//     fs.readFile("./txt/append.txt", "utf-8", (err, data3) => {
//       console.log(data3);
//       //writing or creating a file
//       fs.writeFile("./txt/final.txt", `${data2}\n ${data3}`, "utf-8", (err) => {
//         console.log("your file has been written😊");
//       });
//     });
//   });
// });
// console.log("will read this file");

///////////////////////////////////////////////////////
//////////////////SERVER///////

const replaceTemplate = (temp, product) => {
  let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
  output = output.replace(/{%IMAGE%}/g, product.image);
  output = output.replace(/{%PRICE%}/g, product.price);
  output = output.replace(/{%FROM%}/g, product.from);
  output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
  output = output.replace(/{%QUANTITY%}/g, product.quantity);
  output = output.replace(/{%DESCRIPTION%}/g, product.description);
  output = output.replace(/{%ID%}/g, product.id);

  if (!product.organic)
    output = output.replace(/%NOT_ORGANIC%/g, "not-organic");
  return output;
};
//we are using syc here bcs it will be executed once at the begining when itll load once

const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf-8"
);
const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  "utf-8"
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  "utf-8"
);

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataObj = JSON.parse(data);

const server = http.createServer((req, res) => {
  console.log(req.url);
  const pathName = req.url;
  ////overview

  if (pathName === "/" || pathName === "/overview") {
    res.writeHead(200, { "content-type": "text/html" });
    const cardsHtml = dataObj
      .map((el) => replaceTemplate(tempCard, el))
      .join("");
    const output = tempOverview.replace("{%PRODUCT_CARDS%}", cardsHtml);

    res.end(output);
  }
  //productpage
  else if (pathName === "/product") {
    res.end("this is PRODUCT");
  }
  ////api
  else if (pathName === "/api") {
    res.writeHead(200, { "content-type": "application/json" });
    res.end(data);
  }
  //not found
  else {
    res.writeHead(404, {
      "content-type": "text/html",

      "my-own-header": "hello-world",
    });
    res.end("<h1>page not fount</h1>");
  }
});
server.listen(8000, "localhost", () => {
  console.log("listen to req on port 8000");
});
