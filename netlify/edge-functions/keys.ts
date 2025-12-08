import type { Context } from "@netlify/edge-functions";

export type EdgeKeys = {
  unsplash: { accessKey?: string; secretKey?: string };
};

export default function getKeys(_: Request, { site }: Context) {
  if (site.url !== Netlify.env.get("SITE_URL"))
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 403 });

  const keys: EdgeKeys = {
    unsplash: {
      accessKey: Netlify.env.get("UNSPLASH_ACCESS_KEY"),
      secretKey: Netlify.env.get("UNSPLASH_SECRET_KEY"),
    },
  };

  return new Response(JSON.stringify(keys), { status: 200 });
}
