const express = require("express");
const { prisma } = require("./db.js");

const app = express();
app.use(express.json());

app.post("/reflect", async (req, res) => {
  try {
    const { word } = req.body;
    if (typeof word !== "string")
      return res.status(400).json({ message: "word required" });

    const clean = word.trim().toLowerCase();
    const parts = clean.split(/\s+/);
    if (parts.length !== 1) {
      return res.status(400).json({
        message: "please input only a single word",
      });
    }

    const category = parts[0]; // <-- single string
    const result = await prisma.resource.findMany({
      where: { emotionCategory: category },
    });

    return res.status(200).json({ resources: result });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
});
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
