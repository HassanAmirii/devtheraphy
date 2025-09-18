const express = require("express");
const { prisma } = require("./db.js");

const app = express();
app.use(express.json());

app.get("/resources", async (req, res) => {
  const data = await prisma.resource.findMany();
  res.json(data);
});

app.get("/prompts", async (req, res) => {
  const data = await prisma.prompt.findMany();
  res.json(data);
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
