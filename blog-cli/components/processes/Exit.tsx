import React from "react";
import { Text } from "ink";
import { useEffect } from "react";

export const Exit = () => {
  useEffect(() => {
    process.exit(0);
  }, []);
  return <Text color="yellowBright">프로세스를 종료합니다.</Text>;
};
