const request = require("request");
const converter = require("json-2-csv");
const flatten = require("flat");
const fs = require("fs");

function writeCsv(jsonData, alg) {
  converter.json2csv(jsonData, (err, csv) => {
    if (err) {
      throw err;
    }

    //fs.writeFileSync("./data/" + alg + ".csv", csv);
    fs.appendFile("./data/" + alg + ".csv", csv, (err) => {
      if (err) {
        throw err;
      }
      console.log("SAVED!");
    });
  });
}

async function getData(algo) {
  let url = `https://api2.nicehash.com/main/api/v2/hashpower/orders/summaries?algorithm=${algo}`;

  let option = { json: true };

  let resp = request(url, option, (error, res, body) => {
    if (error) {
      return console.log(error);
    }

    if (res.statusCode == 200) {
      body.datetime = Date.now();
      let flat_json = flatten(body);
      console.log("200", flat_json);
      writeCsv(flat_json, algo);
    } else {
      console.log("Not 200 code!", res);
    }
  });
}

let algos = ["SCRYPT", "SHA256", "KAWPOW"];

algos.forEach(async (alg) => {
  let answer = await getData(alg);
});
