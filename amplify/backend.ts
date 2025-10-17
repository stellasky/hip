import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { CfnMap, CfnPlaceIndex } from 'aws-cdk-lib/aws-location';

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

// Note: expose names to the client by aligning frontend defaults
// or by future support for custom outputs in amplify_outputs.json.
