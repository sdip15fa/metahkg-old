require("dotenv").config();
const system = require("system-commands");
const { MongoClient } = require("mongodb");
const { mongouri } = require("./server/common");
const fs = require("fs");
const { exit } = require("process");
const isInteger = require("is-sn-integer");
async function build() {
  const start = performance.now();
  const client = new MongoClient(mongouri);
  await client.connect();
  console.log("getting categories from mongodb...");
  const categories = await client
    .db("metahkg-threads")
    .collection("category")
    .find()
    .project({ _id: 0 })
    .toArray();
  if (!categories.length) {
    console.error(
      "Have you followed the instructions to import templates/server/category.json into mongodb?"
    );
    exit(1);
  }
  console.log(`retrieved ${categories.length} categories.`);
  const c = {};
  for (const i of categories) {
    if (!i.name || !isInteger(i.id) || typeof i.name !== "string") {
      console.error(
        "Format error. Please make sure the documents are in the format {id: integer, name: string}"
      );
      exit(1);
    }
    c[i.id] = i.name;
  }
  fs.readFile(".env", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      exit(1);
    }
    const d = data.split("\n");
    d.forEach((i, index) => {
      i.startsWith("REACT_APP_categories") && d.splice(index, 1);
    });
    d.push(`REACT_APP_categories=${JSON.stringify(c)}`);
    console.log("writing REACT_APP_categories to .env...");
    fs.writeFile(".env", d.join("\n"), async (err) => {
      if (err) {
        console.error(err);
        exit(1);
      }
      console.log("successfully written.");
      console.log("building with react-scripts...");
      system("npx react-scripts build")
        .then(() => {
          console.log(
            `done in ${Math.round((performance.now() - start) / 1000)} seconds`
          );
          exit(0);
        })
        .catch((err) => {
          console.error(err);
          console.error(
            "Some error occurred while building. Try npx react-scripts build."
          );
          exit(1);
        });
    });
  });
}
if (
  !(
    process.env.DB_URI &&
    process.env.mailgun_key &&
    process.env.domain &&
    process.env.port &&
    process.env.hcaptchasecret &&
    process.env.s3Bucket &&
    process.env.awsRegion
  )
) {
  console.error(
    "Please config .env properly according to templates/template.env!"
  );
  console.log("Aborting!");
  exit(1);
}
build();
