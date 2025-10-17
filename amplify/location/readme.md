# AWS Location scaffolding notes

This app uses AWS Location Service for geocoding (Place Index) and maps.

Integration plan:
- Add a custom stack in Amplify Gen 2 that provisions:
  - Amazon Location Place Index (e.g., `HipPlaceIndex`)
  - Amazon Location Map (e.g., `HipVectorMap`)
- Expose their names via outputs so the client can use them with Amplify Geo or AWS SDK v3.

Next steps:
1) Create `amplify/location/resource.ts` and register it in `amplify/backend.ts` using `defineBackend({ auth, data, location })`.
2) In `resource.ts`, use CDK to define `CfnPlaceIndex` and `CfnMap` from `aws-cdk-lib/aws-location`.
3) Update the frontend with a tiny geocode helper that calls the Place Index (via AWS SDK v3 `LocationClient` + `SearchPlaceIndexForTextCommand`).
4) Gate API usage behind authenticated users per constitution.

Security & limits:
- Enforce auth; never expose credentials in the client outside Amplify’s config.
- Limit batch size to 100 addresses per trip; dedupe by normalized text.
- Consider caching normalized results in `Place` records.
