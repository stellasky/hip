import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

// Data schema for Fan Appreciation App
// Entities: User, Visit, Comment, Photo
// Notes:
// - Owner-based auth for mutations
// - Public read for comments/photos (listings) while owners can write/delete
// - Relations are minimal for now; can be expanded later with hasMany/belongsTo

const schema = a.schema({
  User: a
    .model({
      cognitoId: a.string().required(),
      email: a.string().required(),
      username: a.string().required(),
      storageUsed: a.integer().default(0),
    })
    .authorization((allow) => [allow.owner()]),

  Visit: a
    .model({
      userId: a.id().required(),
      poiId: a.string().required(),
      visited: a.boolean().required(),
      visitDate: a.datetime(),
      notes: a.string(),
    })
    .authorization((allow) => [allow.owner()]),

  Comment: a
    .model({
      userId: a.id().required(),
      poiId: a.string().required(),
      content: a.string().required(),
    })
    .authorization((allow) => [allow.owner(), allow.publicApiKey().to(["read"])])
    ,

  Photo: a
    .model({
      userId: a.id().required(),
      poiId: a.string().required(),
      filename: a.string().required(),
      s3Key: a.string().required(),
      fileSize: a.integer().required(),
      mimeType: a.string().required(),
      caption: a.string(),
    })
    .authorization((allow) => [allow.owner(), allow.publicApiKey().to(["read"])])
    ,
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    
    defaultAuthorizationMode: "userPool",
    // API Key is used for a.allow.public() rules
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});

/*== STEP 2 ===============================================================
Go to your frontend source code. From your client-side code, generate a
Data client to make CRUDL requests to your table. (THIS SNIPPET WILL ONLY
WORK IN THE FRONTEND CODE FILE.)

Using JavaScript or Next.js React Server Components, Middleware, Server 
Actions or Pages Router? Review how to generate Data clients for those use
cases: https://docs.amplify.aws/gen2/build-a-backend/data/connect-to-API/
=========================================================================*/

/*
"use client"
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";

const client = generateClient<Schema>() // use this Data client for CRUDL requests
*/

/*== STEP 3 ===============================================================
Fetch records from the database and use them in your frontend component.
(THIS SNIPPET WILL ONLY WORK IN THE FRONTEND CODE FILE.)
=========================================================================*/

/* For example, in a React component, you can use this snippet in your
  function's RETURN statement */
// const { data: todos } = await client.models.Todo.list()

// return <ul>{todos.map(todo => <li key={todo.id}>{todo.content}</li>)}</ul>
