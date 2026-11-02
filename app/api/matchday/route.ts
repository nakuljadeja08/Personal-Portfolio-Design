import { getMatchday } from "@/lib/matchday";

export const dynamic = "force-dynamic";

// Always a 200: a 4xx would put an error in the visitor's console for a widget that just hides.
export async function GET() {
  return Response.json(
    { match: await getMatchday() },
    { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" } },
  );
}
