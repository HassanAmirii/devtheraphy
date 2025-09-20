# introduction to prisma orm

disclamer: This was written for me to easily read and set up a prisma orm in a future project incase i forget.

for more helpful info please head over to [the prisma documentation](https://www.prisma.io/docs/getting-started)

Table of contents:

- what is prisma
- how does prisma works
- how to setup/connect prisma in a node js environment

Prerequisites:

- vscode
- node js
- npm (node package manager)
- terminal

## what is prisma?

prisma orm (object relational mapper) is a next gen tool that abstract the low level sql(structured query language) code to high level with intuitive data modelling, automated migrations, type-safety & auto-completion. to seammlessly interact with databases.

## how does prisma works?

To easily grasp how prisma does it thing, we need to understand these 3 essential tool kits below:

- prisma client
- prisma migrate
- prisma studio

**The prisma client** is one of the major component of prisma that serves as the interpreter when querying a database. It allows you to perform crud operations, filtering, sorting, and aggregation.

**The prisma schema** is strict structure we planned to organize our data in, it validate the prisma client operation, it is like checking a shape against a fitting hole.

after setting up prisma.schema which contains the db source connection and data models, we would have to migrate our schema, and that is where is **prisma migrate** comes in.

_Migrating does two essential things!_

1. It structures the database in a tabular form with the neccesary headers that matched the schema we defined
2. It regenerate a proper prisma client query code based on the predefined schema

With the above conditions in place, we can then use **prisma studio** to perform crud operations directly to our data base, it is a web based gui that allows you to directly edit your data.

## how to set up prisma for db connection

I'm assuming you have nodejs installed

**1. install dependencies**

```bash
mkdir newproject && cd newproject
npm install prisma @prisma/client express
npx prisma init
```

_what this does:_

- created a new project and navigates to it,
- prisma: CLI and tools for schema/migrations.
- @prisma/client — the generated runtime client your code calls.
- express - for http routing implementation
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

- provider = "sqlite" — Prisma will use SQLite (file-based) for development. note: you can use any db of your choice

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

This opens a browser UI to view/edit rows (default port shown in terminal).

footer:
im a just a mere learner kindly correct on whatever might be wrong or done better by sending me an email: hassanamiri.ai at gmail dot com

thank you.
