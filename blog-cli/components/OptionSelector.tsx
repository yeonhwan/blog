import React, { useState, useEffect } from "react";
import { Box, type Key, useInput, Text } from "ink";

export type OptionDefault = {
  prompt: string;
};

type SelectorOption = {
  color?: string;
};

type SelectorProps<T extends OptionDefault> = {
  options: readonly T[] | T[];
  selctorOption?: SelectorOption;
  onConfirm: (option: T) => void;
  isActive?: boolean;
};

export default function OptionSelector<T extends OptionDefault>({
  options,
  selctorOption = {},
  onConfirm = () => {},
  isActive = true,
}: SelectorProps<T>) {
  const [optionIndex, setOptionIndex] = useState(0);
  const [confirmed, setConfirmed] = useState<(typeof options)[number] | null>(null);
  const selectedOption = options[optionIndex];
  const selectedColor = selctorOption.color || "greenBright";

  useEffect(() => {
    confirmed && onConfirm(confirmed as T);
  }, [confirmed]);

  const inputHandler = (input: string, key: Key) => {
    if (key.leftArrow) {
      // Left arrow key pressed
      setOptionIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : prevIndex));
    }

    if (key.rightArrow) {
      // Right arrow key pressed
      setOptionIndex((prevIndex) => (prevIndex < options.length - 1 ? prevIndex + 1 : prevIndex));
    }

    if (key.upArrow) {
      // Up arrow key pressed
      setOptionIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : prevIndex));
    }

    if (key.downArrow) {
      // Down arrow key pressed
      setOptionIndex((prevIndex) => (prevIndex < options.length - 1 ? prevIndex + 1 : prevIndex));
    }

    if (key.return) {
      // Enter key pressed
      setConfirmed(selectedOption);
    }
  };

  useInput(inputHandler, { isActive });

  return (
    <Box width="50%" borderStyle="classic" flexDirection="column" padding={1} marginTop={1}>
      {options.map((option, index) => (
        <Text backgroundColor={optionIndex === index ? selectedColor : ""} key={index}>
          {option.prompt}
        </Text>
      ))}
    </Box>
  );
}
