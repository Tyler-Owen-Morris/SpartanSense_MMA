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

function writeJson(jsonData, alg) {
  var now = Date.now();
  var entry = {};
  entry[now] = jsonData;
  fs.appendFile(
    "./data/" + alg + ".json",
    JSON.stringify(entry) + `\n`,
    (err) => {
      if (err) {
        throw err;
      }
      console.log("SAVED!");
    }
  );
}

async function getData(algo) {
  let url = `https://api2.nicehash.com/main/api/v2/hashpower/orders/summaries?algorithm=${algo}`;

  let option = { json: true };

  let resp = request(url, option, (error, res, body) => {
    if (error) {
      return console.log(error);
    }

    if (res.statusCode == 200) {
      writeJson(body, algo);
      /*
      body.datetime = Date.now();
      let flat_json = flatten(body);
      console.log("200", flat_json);
      writeCsv(flat_json, algo);
      */
    } else {
      console.log("Not 200 code!", res);
    }
  });
}

let algos = ["SCRYPT", "SHA256", "KAWPOW"];

algos.forEach(async (alg) => {
  //getData(alg);
});

algos.forEach((alg) => {
  let rawdata = fs.readFileSync("./data/" + alg + ".json");
  console.log(alg, "rawdata", rawdata);
  let result = JSON.parse(rawdata);
  console.log(alg, "result:", result);
});
