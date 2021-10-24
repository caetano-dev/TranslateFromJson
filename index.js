const NLPCloudClient = require("nlpcloud");
const file = require("./phrases.json");
const fs = require("fs");

const client = new NLPCloudClient(
  "opus-mt-en-de",
  "7678ccd9ac3f5eb0192c18a3b0b4db38c32824fb"
);
const englishPhrases = file.phrases;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function translate(phraseIndex) {
  client
    .translation(englishPhrases[phraseIndex])
    .then(function (response) {
      console.log(
        phraseIndex + " translated. " + (375 - phraseIndex) + " left"
      );
      fs.readFile("./sentences.json", "utf8", function (err, data) {
        if (err) {
          console.log(err);
        } else {
          const file = JSON.parse(data);
          file.phrases.push({
            english: englishPhrases[phraseIndex],
            german: response.data.translation_text,
          });

          const json = JSON.stringify(file);
          fs.writeFile("./sentences.json", json, "utf8", (err) => {
            console.log(err);
          });
        }
      });
    })
    .catch(function (err) {
      console.error(err);
      console.log("Limit reached. Trying again in 10 seconds.");
    });
}

async function translateAndWait() {
  for (const phraseIndex in englishPhrases) {
    translate(phraseIndex);
    await sleep(10000);
  }
}
translateAndWait();
