import React, { useState, useEffect } from "react";
import { Box, type Key, useInput, Text } from "ink";

export type OptionDefault = {
  [key: string]: any;
  prompt: string;
};

type SelecterExtendOption = {
  selectedColor?: string;
};

type SelectorContainerProps = React.ComponentProps<typeof Box>;

type SelectorProps<T extends OptionDefault> = {
  options: readonly T[] | T[];
  selctorOption?: SelectorContainerProps & SelecterExtendOption;
  onConfirm: (option: T) => void;
  isActive?: boolean;
};

const defaultSelectorOption = {
  width: "50%",
  borderStyle: "classic",
  flexDirection: "column",
  overflowY: "visible",
  padding: 1,
} as SelectorContainerProps;

export default function OptionSelector<T extends OptionDefault>({
  options,
  selctorOption = { selectedColor: "greenBright" },
  onConfirm = () => {},
  isActive = true,
}: SelectorProps<T>) {
  const [optionIndex, setOptionIndex] = useState(0);
  const [confirmed, setConfirmed] = useState<(typeof options)[number] | null>(null);
  const selectedOption = options[optionIndex];
  const boxProps = { ...defaultSelectorOption, ...selctorOption };
  const { selectedColor } = selctorOption;

  useEffect(() => {
    if (confirmed) {
      onConfirm(confirmed);
    }
  }, [confirmed, onConfirm]);

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
    <Box {...boxProps}>
      {options.map((option, index) => (
        <Text backgroundColor={optionIndex === index ? selectedColor : ""} key={index}>
          {option.prompt}
        </Text>
      ))}
    </Box>
  );
}
