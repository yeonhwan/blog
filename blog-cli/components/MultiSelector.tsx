import React, { useState, useEffect } from "react";
import { Box, type Key, useInput, Text } from "ink";

export type OptionDefault = {
  prompt: string;
};

type SelecterExtendOption = {
  hoverColor?: string;
  selectedColor?: string;
};

type SelectorContainerProps = React.ComponentProps<typeof Box>;

type MultiSelectorProps<T extends OptionDefault> = {
  items: readonly T[] | T[];
  selctorOption?: SelectorContainerProps & SelecterExtendOption;
  onConfirm: (option: T[]) => void;
  isActive?: boolean;
  modifier?: (item: T) => string;
};

const defaultSelectorOption: SelectorContainerProps = {
  width: "50%",
  borderStyle: "classic",
  flexDirection: "column",
  overflowY: "visible",
  padding: 1,
};

export default function MultiSelector<T extends OptionDefault>({
  items,
  modifier,
  selctorOption = { selectedColor: "greenBright", hoverColor: "yellowBright" },
  onConfirm = () => {},
  isActive = true,
}: MultiSelectorProps<T>) {
  const [curIdx, setCurIdx] = useState(0);
  const [selected, setSelected] = useState<number[]>([]);
  const [confirmed, setConfirmed] = useState<T[] | null>(null);

  const { selectedColor, hoverColor } = selctorOption;
  const boxProps = { ...defaultSelectorOption, ...selctorOption };

  const selectHandler = () => {
    setSelected((prevSelected) => {
      const hasAlreadySelected = prevSelected.some((item) => {
        return item === curIdx;
      });
      if (hasAlreadySelected) {
        return prevSelected.filter((item) => item !== curIdx);
      } else {
        return [...prevSelected, curIdx];
      }
    });
  };

  const confirmHandler = () => {
    setConfirmed(selected.map((index) => items[index]));
  };

  useEffect(() => {
    if (confirmed) {
      onConfirm(confirmed);
    }
  }, [confirmed]);

  const inputHandler = (input: string, key: Key) => {
    if (key.leftArrow) {
      setCurIdx((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : prevIndex));
    }

    if (key.rightArrow) {
      setCurIdx((prevIndex) => (prevIndex < items.length - 1 ? prevIndex + 1 : prevIndex));
    }

    if (key.upArrow) {
      setCurIdx((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : prevIndex));
    }

    if (key.downArrow) {
      setCurIdx((prevIndex) => (prevIndex < items.length - 1 ? prevIndex + 1 : prevIndex));
    }

    if (key.tab) {
      selectHandler();
    }

    if (key.return) {
      confirmHandler();
    }
  };

  useInput(inputHandler, { isActive });

  return (
    <Box {...boxProps}>
      {items.map((item: T, index: number) => {
        const isSelected = selected.some((item) => item === index);
        const isHovered = curIdx === index;
        const backgroundColor = isSelected
          ? selectedColor
          : isHovered && isActive
            ? hoverColor
            : "";
        return (
          <Text backgroundColor={backgroundColor} key={index}>
            {modifier ? modifier(item) : item.prompt}
          </Text>
        );
      })}
    </Box>
  );
}
