import React from "react";
import { Box, Newline, Text } from "ink";
import { updateIndex } from "root/blog-cli/lib/actions";
import { IndexMap } from "root/types";
import { getAllPosts } from "root/blog-cli/lib/fetch";

// Update all index maps with current map
export const Update = () => {
  const [newIndexes, setNewIndexes] = React.useState<IndexMap | null>(null);

  React.useEffect(() => {
    const allPosts = getAllPosts();
    const { data, success } = updateIndex(allPosts);
    if (success) {
      setNewIndexes(data);
    } else {
      process.exit(1);
    }
  }, []);

  return (
    <Box flexDirection="column">
      <Text color="greenBright">인덱스 데이터를 업데이트 합니다.</Text>
      <Newline />
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
    </Box>
  );
};
