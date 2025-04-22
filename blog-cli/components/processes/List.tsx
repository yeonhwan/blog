import React from "react";
import { Box, Newline, Text, useInput } from "ink";
import { getAllPosts } from "../../utils/files";
import { updatePostsState } from "../../utils/commands";
import MultiSelector from "../MultiSelector";
import { OptionDefault } from "../OptionSelector";
import { PostMeta } from "../../types";

// List posts and unpublish / publish posts
export const List = () => {
  const [stageIdx, setStageIdx] = React.useState(1);
  const [items, setItems] = React.useState<any>(null);
  const [selected, setSelected] = React.useState<any>(null);
  const [answer, setAnswer] = React.useState<string>("");

  const onConfimHandler = (confirmed: any) => {
    setSelected(confirmed);
    setStageIdx(2);
  };

  React.useEffect(() => {
    if (stageIdx === 1) {
      const allPosts = getAllPosts();
      const promptData = allPosts.map((post) => ({ ...post, prompt: post.data.title }));
      setItems(promptData);
    }
    if (stageIdx === 2 && !selected.length) {
      process.exit(0);
    }
    if (stageIdx === 3) {
      const postFileNames = selected.map((item: PostMeta) => item.fileName);
      if (answer === "p") {
        updatePostsState(postFileNames, true);
      } else if (answer === "u") {
        updatePostsState(postFileNames, false);
      }
      setTimeout(() => {
        process.exit(0);
      }, 500);
    }
  }, [stageIdx]);

  useInput(
    (input) => {
      if (input.toLowerCase() === "p") {
        setAnswer("p");
      } else if (input.toLowerCase() === "u") {
        setAnswer("u");
      } else if (input.toLowerCase() === "q") {
        setAnswer("q");
      }
      setStageIdx(3);
    },
    { isActive: stageIdx === 2 },
  );

  return (
    <>
      {stageIdx >= 1 && (
        <>
          <Newline />
          <Text color="greenBright">포스트를 표시합니다.</Text>
          <Text color="greenBright">🟢 : 공개</Text>
          <Text color="greenBright">🔴 : 비공개</Text>
          <Newline />
          <Text color="greenBright">Tab to select</Text>
          <Text color="blueBright">Return to confirm</Text>
          {items?.length && (
            <MultiSelector
              modifier={(item: OptionDefault & PostMeta) => {
                return item.data.publish ? `🟢 ${item.prompt}` : `🔴 ${item.prompt}`;
              }}
              items={items}
              onConfirm={onConfimHandler}
              isActive={!!!selected}
            />
          )}
        </>
      )}
      {stageIdx >= 2 && !!selected.length && (
        <>
          <Text color="yellowBright">선택한 포스트들에 대해서 일괄적으로</Text>
          <Newline />
          <Box width="50%" borderStyle="round" flexDirection="column">
            {selected.map((item) => (
              <Text color="yellowBright">title : {item.data.title}</Text>
            ))}
          </Box>
          <Text>공개하려면 p </Text>
          <Text>비공개하려면 u </Text>
          <Text>취소하려면 q </Text>
          <Text>{answer}</Text>
          <Newline />
        </>
      )}
      {stageIdx >= 3 && answer === "p" ? (
        <>
          <Newline />
          <Text color="greenBright">포스트가 공개처리 되었습니다.</Text>
          <Newline />
        </>
      ) : answer === "u" ? (
        <>
          <Newline />
          <Text color="redBright">포스트가 비공개처리 되었습니다.</Text>
          <Newline />
        </>
      ) : answer === "q" ? (
        <>
          <Newline />
          <Text>포스트 업데이트를 취소합니다.</Text>
          <Text>프로세스를 종료합니다.</Text>
          <Newline />
        </>
      ) : (
        ""
      )}
    </>
  );
};
