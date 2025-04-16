import type { MDXProvider } from "@mdx-js/react";
import { MDXRemote, type MDXRemoteProps } from "next-mdx-remote/rsc";
import rehypePrettyCode from "rehype-pretty-code";

type MDXComponentOption = React.ComponentProps<
  typeof MDXProvider
>["components"];

export const MarkdownRenderer = ({ source, ...props }: MDXRemoteProps) => {
  const components: MDXComponentOption = {
    h1: (props) => (
      <h1 className="text-3xl font-fira text-amber-800" {...props}>
        {props.children}
      </h1>
    ),
    pre: (props) => (
      <pre {...props}>
        <button className="text-amber-800">Click ME!</button>
        {props.children}
      </pre>
    ),
  };

  const shikiCodeOptions = {
    theme: "nord",
  };

  return (
    <MDXRemote
      options={{
        mdxOptions: {
          rehypePlugins: [[rehypePrettyCode, shikiCodeOptions]],
        },
      }}
      components={{ ...components }}
      source={source}
      {...props}
    />
  );
};
