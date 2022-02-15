const fs = require('fs');
const parser = require('csv-parser');
const converter = require('json-2-csv');

var inputLabelerFile_1 = 'Part A_labeler_1.csv'
var inputLabelerFile_2 = 'Part A_labeler_2.csv'

function labelerInput(file) {
  let csvData = [];
  return new Promise((resolve, reject) => {
    fs.createReadStream(file)
      .pipe(parser())
      .on('data', function (data) {
        try {
          // Adding data into array
          csvData.push(data);
        }
        catch (err) {
          //error handler
          reject(err)
        }
      })
      .on('end', function () {
        //promise resolving
        resolve(csvData)
      });
  })
}


function labelerOutput(data) {
  return new Promise((resolve, reject) => {
    let json2csvCallback = function (err, csv) {
      if (err) throw err;
      fs.writeFile('finalOutputDesiredResult.csv', csv, 'utf8', function (err) {
        if (err) {
          console.log('Some error occured - file either not saved or corrupted file saved.');
          reject(err)
        } else {
          resolve('It\'s saved!')
        }
      });
    };
  
    converter.json2csv(data, json2csvCallback, {
      prependHeader: false 
    });
  })
}

async function run() {
  const labelerFileData_1 = await labelerInput(inputLabelerFile_1)
  const labelerFileData_2 = await labelerInput(inputLabelerFile_2)
  const finalLaberFileData = labelerFileData_1.filter(leftLabel => !labelerFileData_2.some(rightLabel => (
    leftLabel.correct_label_1 === rightLabel.correct_label_1 &&
    leftLabel.correct_label_2 === rightLabel.correct_label_2 &&
    leftLabel.correct_label_3 === rightLabel.correct_label_3 &&
    leftLabel.correct_label_4 === rightLabel.correct_label_4 &&
    leftLabel.correct_label_5 === rightLabel.correct_label_5
  )));
  console.log(await labelerOutput(finalLaberFileData));
}
run()

