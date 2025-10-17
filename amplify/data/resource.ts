import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

/* Trip Planner MVP Data Models */
const schema = a.schema({
  Trip: a
    .model({
      name: a.string().required(),
      // Optionally denormalized counters can be added later (e.g., placesCount)
      places: a.hasMany("Place", "tripId"),
      badges: a.hasMany("Badge", "tripId"),
    })
    .authorization((allow) => [allow.owner()]),

  Place: a
    .model({
      tripId: a.id().required(),
      trip: a.belongsTo("Trip", "tripId"),
      name: a.string().required(),
      description: a.string().required(),
      address: a.string().required(),
      lat: a.float(),
      lng: a.float(),
      visited: a.boolean(),
    })
    .authorization((allow) => [allow.owner()]),

  Badge: a
    .model({
      tripId: a.id().required(),
      trip: a.belongsTo("Trip", "tripId"),
      type: a.string().required(),
      awardedAt: a.datetime(),
    })
    .authorization((allow) => [allow.owner()]),
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

/*
Adding to commment
Client usage example:
"use client"
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";

const client = generateClient<Schema>();
// const { data: trips } = await client.models.Trip.list();
*/
