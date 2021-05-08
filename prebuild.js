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

  //
  // UPDATE CONFIG.JS
  //
  fs.readFile(configJs, "utf8", function (err, data) {
    if (err) {
      return console.log(err);
    }

    let result = data.replace(/ *VERSION:.+/gm, `    VERSION: 'Beta ${version}',`);

    const serverUrl = "https://ceasa-estoque.herokuapp.com";
    result = result.replace(
      /^\s*\/*\s*API_URL: 'https:\/\/ceasa-estoque\.herokuapp\.com'/gm,
      `    API_URL: '${serverUrl}'`
    );

    const matchLocalUrl = result.match(/^\s*API_URL:\s'http:\/\/192\..+/gm);
    const localUrl = matchLocalUrl && matchLocalUrl.length > 0 ? matchLocalUrl[0] : null

    if (localUrl && localUrl.length > 0) {
      result = result.replace(
        /^\s*API_URL:\s'http:\/\/192\..+/gm,
        `    // ${localUrl.trim()}`
      );
    }
    console.log(result);
    fs.writeFile(configJs, result, "utf8", function (err) {
      if (err) return console.log(err);
    });
  });

  //
  // UPDATE BUILD.GRADLE
  //
  fs.readFile(buildGradle, "utf8", function (err, data) {
    if (err) {
      return console.log(err);
    }

    const curVersion = data.match(/versionCode\s+(\d+)/m)[1];

    let result = data.replace(
      /versionCode\s\d*/gm,
      `versionCode ${parseInt(curVersion) + 1}`
    );

    result = result.replace(/versionName.+/gm, `versionName 'Beta ${version}'`);

    fs.writeFile(buildGradle, result, "utf8", function (err) {
      if (err) return console.log(err);
    });
  });
}

doUpdate();
