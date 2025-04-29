import fs from "fs";

// prettier-ignore
const testMarkdown = `---
title: 테스트 합니다.
excerpt: 테스트 게시물 입니다.
publish: true
date: 2024-04-24
slug: 테스트-합니다
tags: [테스트, test]
---`;

const testMarkdown2 = `---
title: lets test
excerpt: Its a second test post.
publish: false
date: 2024-04-23
slug: lets-test
tags: [test, react]
---`;

const createStubs = (dir: string) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    // create for getPost & getPosts
    fs.writeFileSync(`${dir}/test-post.md`, testMarkdown);
    fs.writeFileSync(`${dir}/test-post-2.md`, testMarkdown2);
    fs.writeFileSync(
      `${dir}/index.json`,
      JSON.stringify(
        {
          slugs: ["test-post", "test-post-2"],
          tags: ["test", "react", "테스트"],
        },
        null,
        2,
      ),
    );
  }
};

export default createStubs;
