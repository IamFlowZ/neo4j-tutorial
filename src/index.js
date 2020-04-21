// 1. Load our dependencies
const fs = require("fs");
const path = require("path");
const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const { makeAugmentedSchema } = require("neo4j-graphql-js");
const neo4j = require("neo4j-driver");

// 2. Generate our complete schema
const modifiedSchema = makeAugmentedSchema({
  typeDefs: fs
    .readFileSync(path.join(__dirname, "./schema.graphql"))
    .toString(),
});

// 3. Connect to the database
const driver = neo4j.driver(
  "bolt://localhost:7687",
  neo4j.auth.basic("neo4j", "letmein")
);

// 4. Create our server
const server = new ApolloServer({
  schema: modifiedSchema,
  context: { driver },
});

const app = express();
server.applyMiddleware({ app });

// 5. Start accepting connections
app.listen({ port: 4000 }, () => {
  console.log("Listening on port 4000");
});
