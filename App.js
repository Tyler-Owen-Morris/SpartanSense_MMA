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
    JSON.stringify(entry) + `\r\n`,'utf8',
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
      // console.log(algo,body);
      let EU_N_speed_avail=body.summaries[`EU_N,${algo}`].profs[1].speed;
      let EU_N_price_avail=body.summaries[`EU_N,${algo}`].profs[1].price;
      let EU_speed_avail=body.summaries[`EU,${algo}`].profs[1].speed;
      let EU_price_avail=body.summaries[`EU,${algo}`].profs[1].price;
      let USA_speed_avail=body.summaries[`USA,${algo}`].profs[1].speed;
      let USA_price_avail=body.summaries[`USA,${algo}`].profs[1].price;
      let USA_E_speed_avail=body.summaries[`USA_E,${algo}`].profs[1].speed;
      let USA_E_price_avail=body.summaries[`USA_E,${algo}`].profs[1].price;
      // console.log("THIS",EU_N_speed_avail, EU_N_price_avail)
      let timestamp = Date.now();
      let summary = {
        table: []
      };
      summary.table.push({algo, timestamp,EU_N_speed_avail,EU_N_price_avail,EU_speed_avail,EU_price_avail,USA_speed_avail,USA_price_avail,USA_E_speed_avail,USA_E_price_avail})
      console.log(summary)
      // console.log("SAVING:", algo)
      // writeJson(body, algo);
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
// let algos = ["SHA256"];

algos.forEach(async (alg) => {
  getData(alg);
});

// algos.forEach((alg) => {
//   // let rawdata = JSON.parse(fs.readFileSync("./data/" + alg + ".json", 'utf8'));
//   let rawdata = fs.readFile("./data/" + alg + ".json", 'utf8', function readFileCallback(err, rawdata){
//     if (err){
//         console.log(err);
//     } else {
//       console.log(alg, "rawdata", rawdata);
//     // obj = JSON.parse(rawdata); //now it an object
//     // console.log(alg, "obj", obj);
//     // obj.table.push({id: 2, square:3}); //add some data
//     // json = JSON.stringify(obj); //convert it back to json
//     // console.log(alg, "json", json);
//     fs.writeFile("./data/" + alg + ".json",rawdata, 'utf8', callback); // write it back 
//   }});
//   // console.log(alg, "rawdata", rawdata);
//   // obj = JSON.parse(rawdata); //now it an object
//   // console.log(alg, "obj", obj);
//   // var obj = JSON.parse(fs.readFileSync('file', 'utf8'));
//   // rawdata.overrideMimeType("application/json");
  
//   // let result = JSON.parse(rawdata);
//   // console.log(alg, "result:", result);
// });
