import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import fs from "fs";
import path from "path";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Load the 42dot Sans font
const fontPath = path.resolve("./src/lib/fonts/42dotSans.ttf");
const fontData = fs.readFileSync(fontPath);

export const GET = async ({ params }) => {
  const { slug } = params;

  // Fetch the blog post data
  const post = await getPostData(slug);
  if (!post) {
    return new Response("Post not found", { status: 404 });
  }

  const { title, content, tags } = post;

  // Generate the SVG using satori
  const svg = await satori(
    {
      type: "div",
      props: {
        style: {
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "center",
          width: "1200px",
          height: "630px",
          backgroundColor: "#18181b", // Dark background (zinc-900)
          color: "#ffffff", // White text
          fontFamily: "42dot Sans",
          padding: "50px",
          boxSizing: "border-box",
        },
        children: [
          {
            type: "div",
            props: {
              style: {
                width: "100%",
                height: "100%",
                backgroundColor: "#1e1e20",
                borderRadius: "32px",
                boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
                padding: "60px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              },
              children: [
                // Title
                {
                  type: "div",
                  props: {
                    style: {
                      fontSize: "64px",
                      fontWeight: 700,
                      color: "#ffffff",
                      textAlign: "center",
                      lineHeight: "1.2",
                      marginBottom: "24px",
                    },
                    children: title,
                  },
                },
                // Description
                {
                  type: "div",
                  props: {
                    style: {
                      fontSize: "32px",
                      color: "#a1a1aa",
                      textAlign: "center",
                      marginBottom: "32px",
                      lineHeight: "1.5",
                      maxWidth: "90%",
                    },
                    children:
                      content?.slice(0, 100) || "No description available.",
                  },
                },
                // Tags
                {
                  type: "div",
                  props: {
                    style: {
                      display: "flex",
                      gap: "12px",
                      flexWrap: "wrap",
                      justifyContent: "center",
                    },
                    children: tags.map((tag) => ({
                      type: "span",
                      props: {
                        style: {
                          fontSize: "20px",
                          backgroundColor: "#06b6d4",
                          color: "#fff",
                          padding: "6px 16px",
                          borderRadius: "9999px",
                          fontWeight: 500,
                        },
                        children: `#${tag}`,
                      },
                    })),
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: "42dot Sans",
          data: fontData,
          weight: 400,
          style: "normal",
        },
      ],
    },
  );

  // Convert the SVG to PNG using Resvg
  const resvg = new Resvg(svg, {
    fitTo: {
      mode: "width",
      value: 1200,
    },
  });
  const png = resvg.render();
  const pngBuffer = png.asPng();

  // Return the PNG as a response
  return new Response(pngBuffer, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000",
    },
  });
};

// Fetch post data from the database
async function getPostData(slug) {
  // Fetch the post from the database using Prisma
  const post = await prisma.post.findUnique({
    where: { id: parseInt(slug) }, // Assuming `id` is an integer
    select: {
      title: true,
      content: true, // Use content for description
      tags: true, // Tags are stored as JSON string
    },
  });

  if (post) {
    // Parse the tags from JSON string to array
    post.tags = JSON.parse(post.tags || "[]");
  }

  return post;
}
