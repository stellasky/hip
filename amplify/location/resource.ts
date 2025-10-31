import { CfnMap, CfnPlaceIndex } from 'aws-cdk-lib/aws-location';
import { Stack } from 'aws-cdk-lib';
import { MAP_NAME, PLACE_INDEX_NAME } from './constants';

/**
 * Define and configure AWS Location Service resources (Place Index + Map)
 * @param stack The CDK stack to add resources to
 */
export function defineLocation(stack: Stack) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const placeIndex = new CfnPlaceIndex(stack, 'HipPlaceIndex', {
    dataSource: 'Esri',
    indexName: PLACE_INDEX_NAME,
    dataSourceConfiguration: { intendedUse: 'SingleUse' },
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const vectorMap = new CfnMap(stack, 'HipVectorMap', {
    mapName: MAP_NAME,
    configuration: { style: 'VectorEsriStreets' },
  });

  // Return any outputs or references if needed (e.g., for IAM policies)
  return { placeIndex, vectorMap };
}
