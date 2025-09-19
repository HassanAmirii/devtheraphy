const fs = require("fs");
const csv = require("csv-parser");
const { prisma } = require("../src/db.js");

const results = [];

fs.createReadStream("resources.csv")
  .pipe(csv())
  .on("data", (row) => {
    results.push({
      emotionCategory: row.emotionCategory,
      title: row.title,
      type: row.type,
      url: row.url,
      tags: row.tags,
    });
  })
  .on("end", async () => {
    for (const data of results) {
      await prisma.resource.create({ data });
    }
    console.log("Import complete");
    process.exit(0);
  });
