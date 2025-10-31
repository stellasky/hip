import { CfnMap, CfnPlaceIndex } from 'aws-cdk-lib/aws-location';
import { Stack } from 'aws-cdk-lib';

/**
 * Define and configure AWS Location Service resources (Place Index + Map)
 * @param stack The CDK stack to add resources to
 * @returns The computed names for outputs
 */
export function defineLocation(stack: Stack) {
  // Derive unique names per Amplify env/stack to avoid name collisions
  const stackName = Stack.of(stack).stackName;
  const placeIndexName = `${stackName}-place-index`.toLowerCase().replace(/[^a-z0-9-]/g, '').slice(0, 100);
  const mapName = `${stackName}-map`.toLowerCase().replace(/[^a-z0-9-]/g, '').slice(0, 50);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const placeIndex = new CfnPlaceIndex(stack, 'HipPlaceIndex', {
    dataSource: 'Esri',
    indexName: placeIndexName,
    dataSourceConfiguration: { intendedUse: 'SingleUse' },
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const vectorMap = new CfnMap(stack, 'HipVectorMap', {
    mapName,
    configuration: { style: 'VectorEsriStreets' },
  });

  // Return the names for use in outputs/policies
  return { placeIndexName, mapName };
}