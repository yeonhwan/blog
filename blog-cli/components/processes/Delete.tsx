import React from "react";
import { Box, Newline, Text, useInput } from "ink";
import { getAllPosts } from "../../utils/files";
import { deletePostAndUpdate } from "../../utils/commands";
import OptionSelector, { OptionDefault } from "../OptionSelector";
import { PostMetaWithExtra } from "../../types";

type DeleteOptionItem = PostMetaWithExtra<OptionDefault>;
export const Delete = () => {
  const [stageIdx, setStageIdx] = React.useState<number>(1);
  const [posts, setPosts] = React.useState<DeleteOptionItem[] | null>(null);
  const [selected, setSelected] = React.useState<DeleteOptionItem | null>(null);
  const [yn, setYN] = React.useState<string>("");

  React.useEffect(() => {
    if (stageIdx === 1) {
      const allPosts = getAllPosts();
      const promptData = allPosts.map((post) => ({ ...post, prompt: post.data.title }));
      setPosts(promptData);
    }
    if (stageIdx === 3) {
      if (yn === "y" && selected) {
        deletePostAndUpdate(selected.fileName);
      }

      if (yn === "n") {
        setTimeout(() => {
          process.exit(0);
        }, 500);
      }
    }
  }, [stageIdx, selected, yn]);

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
    <>
      <Newline />
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
      {stageIdx >= 2 && selected && (
        <>
          <Newline />
          <Text color="yellowBright">선택한 포스트를 삭제합니다.</Text>
          <Box flexDirection="column">
            <Text color="yellowBright">title : {selected.data.title}</Text>
            <Text color="yellowBright">file-name : {selected.fileName}</Text>
            <Text color="yellowBright">slug : {selected.data.slug}</Text>
          </Box>
          <Newline />
          <Text color="red">해당 작업은 되돌릴 수 없습니다.</Text>
          <Text>삭제 하시겠습니까? y/n {yn}</Text>
        </>
      )}
      {stageIdx >= 3 && yn === "y" ? (
        <>
          <Newline />
          <Text color="greenBright">포스트가 삭제 되었습니다.</Text>
          <Newline />
        </>
      ) : yn === "n" ? (
        <>
          <Newline />
          <Text>포스트 삭제를 취소합니다.</Text>
          <Text>프로세스를 종료합니다.</Text>
          <Newline />
        </>
      ) : null}
    </>
  );
};
