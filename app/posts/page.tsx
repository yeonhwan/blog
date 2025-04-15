import { getAllPosts } from "@/actions/getPosts";

export default async function Posts() {
  const posts = await getAllPosts({ page: 1, sort: "DESC" });
  // console.log("posts", posts);

  return <div>Post Page</div>;
}
