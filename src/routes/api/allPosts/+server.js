import { PrismaClient } from "@prisma/client";
import { json } from "@sveltejs/kit";

const prismaAll = new PrismaClient();

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
