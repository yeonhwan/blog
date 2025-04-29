import React from "react";
import { Box, Newline, Text } from "ink";
import TextInput from "ink-text-input";
import { createPost } from "../../lib/actions";
import StagePrompt from "../StagePrompt";
import { PostData } from "root/types";

// create new posts with pre-filed front-matter template
export const Create = () => {
  const [stageIdx, setStageIdx] = React.useState(1);
  const [title, setTitle] = React.useState<string>("");
  const [postInfo, setPostInfo] = React.useState<PostData | null>(null);

  React.useEffect(() => {
    if (stageIdx === 2) {
      const { success, data } = createPost(title, new Date());
      if (success) {
        setPostInfo(data);
        setStageIdx(3);
      } else {
        process.exit(1);
      }
    }

    if (stageIdx === 3) {
      setTimeout(() => {
        process.exit(0);
      }, 500);
    }
  }, [stageIdx, title]);

  return (
    <StagePrompt stage={stageIdx}>
      <Box flexDirection="column">
        <Text color="greenBright">포스트의 제목을 입력해주세요.</Text>
        <TextInput
          value={title}
          focus={stageIdx === 1}
          onChange={setTitle}
          onSubmit={() => setStageIdx(2)}
        />
      </Box>
      <Box flexDirection="column">
        <Newline />
        <Text color="greenBright">포스트를 생성합니다.</Text>
        <Text color="yellowBright">title : {title}</Text>
      </Box>
      {postInfo && (
        <Box flexDirection="column">
          <Newline />
          <Text color="greenBright">포스트가 생성 되었습니다.</Text>
          <Text color="yellowBright">post-name : {postInfo.fileName}</Text>
        </Box>
      )}
    </StagePrompt>
  );
};
