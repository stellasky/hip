import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { CfnMap, CfnPlaceIndex } from 'aws-cdk-lib/aws-location';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Stack } from 'aws-cdk-lib';

// Define Amplify backend resources
const backend = defineBackend({
  auth,
  data,
});

// Custom stack for AWS Location Service (Place Index + Map)
const locationStack = backend.createStack('location');

// Derive unique names per Amplify env to avoid name collisions in the AWS account/region
const stackName = Stack.of(locationStack).stackName;
const indexName = `${stackName}-index`.toLowerCase().replace(/[^a-z0-9-]/g, '').slice(0, 100);
// Sanitize and shorten mapName for AWS Location
const mapName = `${stackName}-map`.toLowerCase().replace(/[^a-z0-9-]/g, '').slice(0, 50);

const placeIndex = new CfnPlaceIndex(locationStack, 'HipPlaceIndex', {
  dataSource: 'Esri',
  indexName,
  dataSourceConfiguration: { intendedUse: 'SingleUse' },
});

const vectorMap = new CfnMap(locationStack, 'HipVectorMap', {
  mapName,
  configuration: { style: 'VectorEsriStreets' },
});

// Attach IAM permissions for authenticated users to use the Place Index (and map, when needed)
// Best practice per constitution: gate Location usage behind authenticated users
// Attempt to access the authenticated role from the realized auth resource
const authRole: iam.IRole | undefined = (backend as any)?.resources?.auth?.authenticatedUserIamRole;

if (authRole) {
  const region = Stack.of(locationStack).region;
  const account = Stack.of(locationStack).account;
  const placeIndexArn = `arn:aws:geo:${region}:${account}:place-index/${indexName}`;
  const mapArn = `arn:aws:geo:${region}:${account}:map/${mapName}`;

  authRole.addToPrincipalPolicy(
    new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: [
        'geo:SearchPlaceIndexForText',
        // Map permissions can be used later when rendering maps
        'geo:GetMapStyleDescriptor',
        'geo:GetMapGlyphs',
        'geo:GetMapSprites',
        'geo:GetMapTile',
      ],
      resources: [placeIndexArn, mapArn],
    })
  );
}

// Note: expose names to the client by aligning frontend defaults or through future addOutput support.
