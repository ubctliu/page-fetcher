const fs = require('fs');
const request = require('request');
const readline = require('readline');
const input = process.argv.slice(2);
const url = input[0];
const localPath = input[1];

// downloads data from the url link to the local path provided
const downloadToLocalPath = (urlLink, path) => {
  
  pathExists(path, (result) => {
    // if user decides to not overwrite
    if (!result) {
      return;
    }

    request(urlLink, (error, response, body) => {
      // if error occurred in retrieving info from the website
      if (error) {
        console.log("Error occurred. Error message:", error);
        return;
      } else { // if successful, asynchronously retrives file size and writes file to path
        console.log("Success! Response code:", response && response.statusCode);
        fs.writeFile(path, body, (err) => {
          fs.stat(path, (err, stats) => {
            if (err) {
              console.log("Error occurred when retrieving file size. Error:", err);
              return;
            }
            console.log(`Downloaded and saved ${stats.size} bytes to path`);
          });
  
          if (err) {
            console.log("Error occurred during writing process! Error:", error);
            return;
          }
        });
      }
    });
  });
};

const pathExists = (path, callback) => {
  if (fs.existsSync(path)) {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    rl.question("File already exists in the directory. Overwrite existing file? Y / N\n", (overwrite) => {
      rl.close();
      if (overwrite === "N" || overwrite === "n") {
        callback(false);
      } else
      if (overwrite === "Y" || overwrite === "y") {
        callback(true);
      } else {
        console.log("Must enter Y or N. Invalid character entered.");
        pathExists(path, callback);
      }
    });
  } else {
    callback(true);
  }
};

downloadToLocalPath(url, localPath);