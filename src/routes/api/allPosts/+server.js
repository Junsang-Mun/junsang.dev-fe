import { PrismaClient } from "@prisma/client";
import { json } from "@sveltejs/kit";

const prismaAll = new PrismaClient();

const sessionCookie = cookies.get("session");

if (!sessionCookie) {
  return new Response("Unauthorized", { status: 403 });
}

export async function GET() {
  const posts = await prismaAll.post.findMany({
    orderBy: { createdAt: "desc" },
  });

  const parsed = posts.map((post) => ({
    ...post,
    tags: JSON.parse(post.tags),
  }));

  return json(parsed);
}
