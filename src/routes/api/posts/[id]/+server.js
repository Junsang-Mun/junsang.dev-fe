import { PrismaClient } from "@prisma/client";
import { json } from "@sveltejs/kit";

const prismaId = new PrismaClient();

export async function GET({ params }) {
  const id = Number(params.id);
  const post = await prismaId.post.findUnique({
    where: { id },
  });

  if (!post) {
    return new Response("Not found", { status: 404 });
  }

  return json({
    ...post,
    tags: JSON.parse(post.tags),
  });
}

export async function PATCH({ request, params }) {
  const id = Number(params.id);
  const data = await request.json();

  const updated = await prismaId.post.update({
    where: { id },
    data: {
      ...data,
      tags: JSON.stringify(data.tags),
    },
  });

  return json({
    ...updated,
    tags: JSON.parse(updated.tags),
  });
}

export async function DELETE({ params }) {
  const id = Number(params.id);

  await prismaId.post.delete({
    where: { id },
  });

  return new Response(null, { status: 204 });
}
