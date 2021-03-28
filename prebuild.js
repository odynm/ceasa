function doUpdate() {
  const fs = require("fs");

  const date = new Date();
  const configJs = "./app/src/config/index.js";
  const buildGradle = "./app/android/app/build.gradle";

  function pad(str) {
    const pad = "00";
    return pad.substring(0, pad.length - str.length) + str;
  }

  const version = `${pad(date.getFullYear().toString().substring(2, 4))}.${pad(
    (date.getMonth() + 1).toString()
  )}.${pad(date.getDate().toString())}`;

  //;
  // UPDATE CONFIG.JS
  //

  //VERSION
  fs.readFile(configJs, "utf8", function (err, data) {
    if (err) {
      return console.log(err);
    }

    const result = data.replace(
      /\t*VERSION:.+/gm,
      `	VERSION: 'Beta ${version}',`
    );

    fs.writeFile(configJs, result, "utf8", function (err) {
      if (err) return console.log(err);
    });

    // SET THE CORRECT URL
    // Comment local
    fs.readFile(configJs, "utf8", function (err, data) {
      if (err) {
        return console.log(err);
      }

      const localUrl = data.match(/^\s*API_URL:\s'http:\/\/192\..+/gm)[0];

      if (localUrl && localUrl.length > 0) {
        const result = data.replace(
          /^\s*API_URL:\s'http:\/\/192\..+/gm,
          `	// ${localUrl.trim()}`
        );

        // Uncomment PRD
        fs.writeFile(configJs, result, "utf8", function (err) {
          if (err) return console.log(err);
        });

        fs.readFile(configJs, "utf8", function (err, data) {
          if (err) {
            return console.log(err);
          }

          const serverUrl = "https://ceasa-estoque.herokuapp.com";
          const result = data.replace(
            /^\s*\/*\s*API_URL: 'https:\/\/ceasa-estoque\.herokuapp\.com'/gm,
            `	API_URL: '${serverUrl}'`
          );
          fs.writeFile(configJs, result, "utf8", function (err) {
            if (err) return console.log(err);
          });
        });
      }
    });
  });

  //
  // UPDATE BUILD.GRADLE
  //
  fs.readFile(buildGradle, "utf8", function (err, data) {
    if (err) {
      return console.log(err);
    }

    const curVersion = data.match(/^\s*versionCode\s+(\d+)/m)[1];

    const result = data.replace(
      /^\s*versionCode.+/gm,
      `        versionCode ${parseInt(curVersion) + 1},`
    );

    fs.writeFile(buildGradle, result, "utf8", function (err) {
      if (err) return console.log(err);
    });
  });
}

doUpdate();
