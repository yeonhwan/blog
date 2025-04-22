import React from "react";
import { Newline, Text } from "ink";
import TextInput from "ink-text-input";
import { createNewPost } from "../../utils/commands";
import { NameWithPath } from "../../types";

// create new posts with pre-filed front-matter template
export const Create = () => {
  const [stageIdx, setStageIdx] = React.useState(1);
  const [title, setTitle] = React.useState<string>("");
  const [excerpt, setExcerpt] = React.useState<string>("");
  const [postInfo, setPostInfo] = React.useState<NameWithPath | null>(null);

  React.useEffect(() => {
    if (stageIdx === 3) {
      const newPostInfo = createNewPost({ title, excerpt });
      setPostInfo(newPostInfo);
      setStageIdx(4);
    }

    if (stageIdx === 4) {
      setTimeout(() => {
        process.exit(0);
      }, 500);
    }
  }, [stageIdx, excerpt, title]);

  return (
    <>
      <Text color="greenBright">포스트를 생성합니다.</Text>
      {stageIdx >= 1 && (
        <>
          <Text color="greenBright">포스트의 제목을 입력해주세요.</Text>
          <TextInput
            value={title}
            focus={stageIdx === 1}
            onChange={setTitle}
            onSubmit={() => setStageIdx(2)}
          />
        </>
      )}
      {stageIdx >= 2 && (
        <>
          <Text color="greenBright">포스트의 요약을 입력해주세요.</Text>
          <TextInput
            value={excerpt}
            focus={stageIdx === 2}
            onChange={setExcerpt}
            onSubmit={() => setStageIdx(3)}
          />
        </>
      )}
      {stageIdx >= 3 && (
        <>
          <Newline />
          <Text color="greenBright">포스트를 생성합니다.</Text>
          <Text color="yellowBright">title : {title}</Text>
          <Text color="yellowBright">excerpt : {excerpt}</Text>
        </>
      )}
      {stageIdx >= 4 && postInfo && (
        <>
          <Newline />
          <Text color="greenBright">포스트가 생성 되었습니다.</Text>
          <Text color="yellowBright">post-name : {postInfo.fileName}</Text>
          <Text color="yellowBright">post-path : {postInfo.postPath}</Text>
        </>
      )}
    </>
  );
};
