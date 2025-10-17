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

const placeIndex = new CfnPlaceIndex(locationStack, 'HipPlaceIndex', {
  dataSource: 'Esri',
  indexName: 'HipPlaceIndex',
});

const vectorMap = new CfnMap(locationStack, 'HipVectorMap', {
  mapName: 'HipVectorMap',
  configuration: { style: 'VectorEsriStreets' },
});

// Attach IAM permissions for authenticated users to use the Place Index (and map, when needed)
// Best practice per constitution: gate Location usage behind authenticated users
// Attempt to access the authenticated role from the realized auth resource
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const authResources: any = (backend as any)?.resources?.auth;
const authRole: iam.IRole | undefined = authResources?.authenticatedUserIamRole;

if (authRole) {
  const region = Stack.of(locationStack).region;
  const account = Stack.of(locationStack).account;
  const placeIndexArn = `arn:aws:geo:${region}:${account}:place-index/${placeIndex.indexName}`;
  const mapArn = `arn:aws:geo:${region}:${account}:map/${vectorMap.mapName}`;

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
