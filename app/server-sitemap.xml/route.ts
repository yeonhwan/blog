import { getServerSideSitemap } from "next-sitemap";
import { getAllPosts } from "@/actions/posts";

export async function GET() {
  const { data } = await getAllPosts({ ssg: true });
  const slugs = data.map((item) => item.post.data.slug);

  const sitemaps = slugs.map((slug) => ({
    loc: `https://yeonhwandev.com/posts/${slug}`,
  }));

  return getServerSideSitemap(sitemaps);
}
