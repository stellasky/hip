import { LocationClient, SearchPlaceIndexForTextCommand } from "@aws-sdk/client-location";
import outputs from "../../amplify_outputs.json";
import { fetchAuthSession } from "aws-amplify/auth";

// Expect AWS credentials via Amplify Auth (federated through Cognito Identity Pool).
// The Location client will pick up default credentials from the environment when running in the browser via Amplify.

const REGION = outputs?.auth?.aws_region ?? "us-east-1";

export async function geocodeText(indexName: string, text: string) {
  const { credentials } = await fetchAuthSession();
  const client = new LocationClient({ region: REGION, credentials: credentials ?? undefined });
  const cmd = new SearchPlaceIndexForTextCommand({
    IndexName: indexName,
    Text: text,
    MaxResults: 1,
  });
  const res = await client.send(cmd);
  const first = res.Results?.[0]?.Place;
  if (!first?.Geometry?.Point) return undefined;
  const [lng, lat] = first.Geometry.Point;
  return {
    lat,
    lng,
    label: first.Label,
  };
}
