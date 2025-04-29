import React from "react";
import { Box, Newline, Text, useInput } from "ink";
import { getAllPosts } from "root/blog-cli/lib/fetch";
import { updatePostMeta } from "root/blog-cli/lib/actions";
import MultiSelector, { OptionDefault } from "../MultiSelector";
import StagePrompt from "../StagePrompt";
import { PostData } from "root/types";

// List posts and unpublish / publish posts
type ListOptionItem = PostData & OptionDefault;
export const List = () => {
  const [stageIdx, setStageIdx] = React.useState(1);
  const [items, setItems] = React.useState<ListOptionItem[] | null>(null);
  const [selected, setSelected] = React.useState<ListOptionItem[] | null>(null);
  const [answer, setAnswer] = React.useState<string>("");

  const onConfimHandler = (confirmed: any) => {
    setSelected(confirmed);
    setStageIdx(2);
  };

  React.useEffect(() => {
    if (stageIdx === 1) {
      const allPosts = getAllPosts();
      const promptData = allPosts.map((data) => ({
        ...data,
        prompt: data.post.data.title,
      }));
      setItems(promptData);
    }

    if (stageIdx === 2 && !selected?.length) {
      process.exit(0);
    }

    if (stageIdx === 3 && selected?.length) {
      for (const item of selected) {
        if (answer === "p") {
          updatePostMeta(item, "publish", true);
        } else if (answer === "u") {
          updatePostMeta(item, "publish", false);
        } else {
          process.exit(0);
        }
      }
    }
  }, [stageIdx, selected, answer]);

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
    <StagePrompt stage={stageIdx}>
      <Box flexDirection="column">
        <Newline />
        <Text color="greenBright">포스트를 표시합니다.</Text>
        <Text color="greenBright">🟢 : 공개</Text>
        <Text color="greenBright">🔴 : 비공개</Text>
        <Newline />
        <Text color="greenBright">Tab to select</Text>
        <Text color="blueBright">Return to confirm</Text>
        {items?.length && (
          <MultiSelector
            modifier={(item: ListOptionItem) => {
              return item.post.data.publish ? `🟢 ${item.prompt}` : `🔴 ${item.prompt}`;
            }}
            items={items}
            onConfirm={onConfimHandler}
            isActive={!!!selected}
          />
        )}
      </Box>
      <Box flexDirection="column">
        <Text color="yellowBright">선택한 포스트들에 대해서 일괄적으로</Text>
        <Newline />
        <Box width="50%" borderStyle="round" flexDirection="column">
          {selected?.map((item, index) => (
            <Text key={index} color="yellowBright">
              title : {item.post.data.title}
            </Text>
          ))}
        </Box>
        <Text>공개하려면 p </Text>
        <Text>비공개하려면 u </Text>
        <Text>취소하려면 q </Text>
        <Text>{answer}</Text>
        <Newline />
      </Box>
      <Box>
        {answer === "p" ? (
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
      </Box>
    </StagePrompt>
  );
};
