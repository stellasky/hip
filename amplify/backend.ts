import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { defineLocation } from './location/resource';
import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';

// Define Amplify backend resources
const backend = defineBackend({
  auth,
  data,
});

// Custom stack for AWS Location Service (Place Index + Map)
const locationStack = backend.createStack('location');

// Define Location resources in the stack and get the names
const { placeIndexName, mapName } = defineLocation(locationStack);

// Attach IAM permissions for authenticated users to use the Place Index and Map
const authRole = (backend.auth as any).resources.authenticatedUserIamRole;
if (authRole) {
  const region = locationStack.region;
  const account = locationStack.account;

  // Attach Place Index permissions (scoped to the specific name now)
  authRole.addToPrincipalPolicy(
    new PolicyStatement({
      effect: Effect.ALLOW,
      actions: [
        'geo:SearchPlaceIndexForText',
        'geo:SearchPlaceIndexForSuggestions',
        'geo:SearchPlaceIndexForPosition',
      ],
      resources: [`arn:aws:geo:${region}:${account}:place-index/${placeIndexName}`],
    })
  );

  // Attach Map permissions (scoped to the specific name now)
  authRole.addToPrincipalPolicy(
    new PolicyStatement({
      effect: Effect.ALLOW,
      actions: [
        'geo:GetMapStyleDescriptor',
        'geo:GetMapGlyphs',
        'geo:GetMapSprites',
        'geo:GetMapTile',
      ],
      resources: [`arn:aws:geo:${region}:${account}:map/${mapName}`],
    })
  );
}

// Keep your outputs as-is (Amplify Gen 2 style)
backend.addOutput({
  custom: {
    locationPlaceIndexName: placeIndexName,
    locationMapName: mapName,
  },
});