Table of contents:

- what is prisma
- how does prisma works
- how to setup/connect prisma

Prerequisites:

- vscode
- node js
- npm (node package manager)
- terminal

## what is prisma?

prisma is a next gen tool that abstract the low level sql(structured query language) code to high level with intuitive data modelling, automated migrations, type-safety & auto-completion. to seammlessly interact with databases.

## how does prisma works?

To easily grasp how prisma does it thing, we need to understand these 3 essntial tool kits below:

- prisma client
- prisma migrate
- prisma studio

prisma is an orm(object relational mapper) tool that serves as the middleman between a web app and a database.

after setting up prisma.schema which contains the db source connection and data models, we would have to migrate our schema.

_Migrating does two essential things!_

1. It structures the database in a tabular form with the neccesary headers that matched the schema we defined
2. It generate a proper prisma client query code based on the predefined schema

With the above conditions in place, we can use prisma studio to perform crud operations directly to our data base.

## how to set up prisma for db connection

**1. install dependencies**

```bash
mkdir newproject && cd newproject
npm install prisma @prisma/client
npx prisma init
```

_what this does:_

- created a new project and navigated to it,
- prisma: CLI and tools for schema/migrations.
- @prisma/client — the generated runtime client your code calls.
- while running npx prisma init: create a prisma/schema.prisma folder, env file

**2) Configure datasource (prisma/schema.prisma)**

```schema.prisma

datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}

generator client {
  provider = "prisma-client-js"
}
```

_what this does_

- provider = "sqlite" — Prisma will use SQLite (file-based) for development.

- url = "file:./dev.db" — where the SQLite file will live. Important: path is resolved relative to schema.prisma (so usually prisma/dev.db), not necessarily project root.

- generator instructs Prisma to produce the JS client (@prisma/client) you use from code.

**3) Define models (schema)**

```

model Prompt {
  id               Int     @id @default(autoincrement())
  emotionCategory  String
  text             String
}
```

_What each piece does_

- model = SQL table definition.

- id Int @id @default(autoincrement()) = primary key integer auto-increment.

- Field types (String, Int) translate to column types in SQLite.

**4) creating a database**

run

```bash
npx prisma migrate dev --name init
```

_What it does (two outcomes)_

- Generates migration SQL under prisma/migrations/<timestamp>\_init/ so you have a history of schema changes.

- Applies those SQL migrations to the database (creates the dev.db file and the Prompt tables).

- Regenerates Prisma Client so @prisma/client reflects the new models.

**5) src/db.js (Prisma client bootstrap)**

Example:

```js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
module.exports = { prisma };
```

_What this does_

- Imports the generated Prisma client class.

- Instantiates a single PrismaClient that your app reuses across modules.

- Exports the instance so other files call prisma.resource.findMany() etc.

**6) src/index.js (Express entrypoint)**

```js
const express = require("express");
const { prisma } = require("./db.js");

const app = express();
app.use(express.json());

app.get("/prompts", async (req, res) => {
  const data = await prisma.prompt.findMany();
  res.json(data);
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
```

_what this does_

- express() — creates the HTTP server.

- app.use(express.json()) — parses JSON request bodies.

- /prompts route — returns all Resource rows (test endpoint).

- app.listen(3000) — server starts on port 3000.

note: you have to run npm install express for the above code to work!

**7) Run server**

run:

```bash
node src/index.js
```

What to expect and verification

Console prints Server running on http://localhost:3000.

Open http://localhost:3000/resources in browser to see running server

**Note**

Inspect DB with Prisma Studio:

runnig

```bash
npx prisma studio
```

opens a browser UI to view/edit rows (default port shown in terminal).
