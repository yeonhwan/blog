import React from "react";
import { Box, Newline, Text } from "ink";
import { updatePostsIndexes } from "../../utils/commands";

// Update all index maps with current map
export const Update = () => {
  const [newIndexes, setNewIndexes] = React.useState<any>(null);

  React.useEffect(() => {
    const updated = updatePostsIndexes();
    setNewIndexes(updated);
    setTimeout(() => {
      process.exit(0);
    }, 500);
  }, []);

  return (
    <>
      <Newline />
      <Text color="greenBright">인덱스 데이터를 업데이트 합니다.</Text>
      {newIndexes && (
        <>
          <Text color="greenBright">업데이트가 완료 되었습니다.</Text>
          <Box width="50%" borderStyle="round" flexDirection="column">
            <Text color="yellow">tag.json</Text>
            <Newline />
            <Text>{JSON.stringify(newIndexes.tags, null, 2)}</Text>
          </Box>
          <Box width="50%" borderStyle="round" flexDirection="column">
            <Text color="yellow">slug.json</Text>
            <Newline />
            <Text>{JSON.stringify(newIndexes.slugs, null, 2)}</Text>
          </Box>
        </>
      )}
      <Newline />
    </>
  );
};
