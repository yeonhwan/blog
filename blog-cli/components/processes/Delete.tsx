import React from "react";
import { Box, Newline, Text, useInput } from "ink";
import { deletePost, updateIndex } from "root/blog-cli/lib/actions";
import { getAllPosts } from "root/blog-cli/lib/fetch";
import OptionSelector from "../OptionSelector";
import StagePrompt from "../StagePrompt";

type DeleteOptionItem = { prompt: string; fileName: string };
export const Delete = () => {
  const [stageIdx, setStageIdx] = React.useState<number>(1);
  const [posts, setPosts] = React.useState<DeleteOptionItem[] | null>(null);
  const [selected, setSelected] = React.useState<DeleteOptionItem | null>(null);
  const [yn, setYN] = React.useState<string>("");

  React.useEffect(() => {
    if (stageIdx === 1) {
      const allPosts = getAllPosts();
      const promptData = allPosts.map((data) => ({
        fileName: data.fileName,
        prompt: data.post.data.title,
      }));
      setPosts(promptData);
    }
    if (stageIdx === 3) {
      if (yn === "y" && selected) {
        deletePost(selected.fileName);
        const allPosts = getAllPosts();
        updateIndex(allPosts);
      }

      if (yn === "n") {
        setTimeout(() => {
          process.exit(0);
        }, 500);
      }
    }
  }, [stageIdx]);

  const onSelectedConfirm = (confirmed: DeleteOptionItem) => {
    setSelected(confirmed);
    setStageIdx(2);
  };

  useInput(
    (input) => {
      if (input.toLowerCase() === "y") {
        setYN("y");
        setStageIdx(3);
      } else if (input.toLowerCase() === "n") {
        setYN("n");
        setStageIdx(3);
      }
    },
    { isActive: stageIdx === 2 },
  );

  return (
    <StagePrompt stage={stageIdx}>
      <Box flexDirection="column">
        <Text color="redBright">포스트를 삭제합니다.</Text>
        <Text color="yellowBright">삭제 할 포스트를 선택하세요.</Text>
        {posts?.length && (
          <OptionSelector
            key="posts-select"
            isActive={!!!selected}
            options={posts}
            onConfirm={onSelectedConfirm}
          />
        )}
      </Box>
      <Box flexDirection="column">
        <Newline />
        <Text color="yellowBright">선택한 포스트를 삭제합니다.</Text>
        <Box flexDirection="column">
          <Text color="yellowBright">title : {selected?.prompt}</Text>
          <Text color="yellowBright">file-name : {selected?.fileName}</Text>
        </Box>
        <Newline />
        <Text color="red">해당 작업은 되돌릴 수 없습니다.</Text>
        <Text>삭제 하시겠습니까? y/n {yn}</Text>
      </Box>
      <Box flexDirection="column">
        {yn === "y" ? (
          <Box flexDirection="column">
            <Text color="greenBright">포스트가 삭제 되었습니다.</Text>
          </Box>
        ) : yn === "n" ? (
          <Box flexDirection="column">
            <Text>포스트 삭제를 취소합니다.</Text>
            <Text>프로세스를 종료합니다.</Text>
          </Box>
        ) : null}
      </Box>
    </StagePrompt>
  );
};
