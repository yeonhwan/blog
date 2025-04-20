import type { MDXProvider } from "@mdx-js/react";
import { MDXRemote, type MDXRemoteProps } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeAddLiDepth from "@/components/base/rehypes/plugins/rehypeAddLiDepth";
import { transformerNotationDiff } from "@shikijs/transformers";

import {
  Anchor,
  BlockQuote,
  Bold,
  Code,
  H1,
  H2,
  H3,
  H4,
  Hr,
  Italic,
  LI,
  OL,
  Pargraph,
  Pre,
  StrThrough,
  UL,
  Image,
  TH,
  TD,
} from "@/components/base/rehypes/MarkdownComponents";

type MDXComponentOption = React.ComponentProps<typeof MDXProvider>["components"];
type RehyepePrettyCodeOptions = Parameters<typeof rehypePrettyCode>[0];

export const MarkdownRenderer = ({ source, ...props }: MDXRemoteProps) => {
  const components: MDXComponentOption = {
    h1: H1,
    h2: H2,
    h3: H3,
    h4: H4,
    hr: Hr,
    p: Pargraph,
    strong: Bold,
    em: Italic,
    del: StrThrough,
    blockquote: BlockQuote,
    ul: UL,
    ol: OL,
    li: LI,
    a: Anchor,
    pre: Pre,
    code: Code,
    img: Image,
    th: TH,
    td: TD,
  };

  const shikiCodeOptions: RehyepePrettyCodeOptions = {
    theme: "everforest-dark",
    grid: true,
    transformers: [transformerNotationDiff()],
  };

  return (
    <MDXRemote
      options={{
        mdxOptions: {
          remarkPlugins: [remarkGfm],
          rehypePlugins: [[rehypePrettyCode, shikiCodeOptions], rehypeAddLiDepth],
        },
      }}
      components={{ ...components }}
      source={source}
      {...props}
    />
  );
};
