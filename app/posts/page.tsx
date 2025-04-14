import { getAllPosts } from "@/actions/getPosts";

export default async function Posts() {
  const posts = await getAllPosts();

  return <div>Post Page</div>;
}
