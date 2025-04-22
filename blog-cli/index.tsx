import React from "react";
import { render, useInput, Text } from "ink";
import OptionSelector from "./components/OptionSelector";
import { CLI_OPTIONS } from "./components/cliOptions";
import Processors from "./components/Processors";
import { Update } from "./components/processes/Update";

const args = process.argv.slice(2);

const Index = () => {
  const [selectedOption, setSelectedOption] = React.useState<(typeof CLI_OPTIONS)[number] | null>(
    null,
  );

  useInput(
    (input) => {
      if (input === "q") {
        setSelectedOption(CLI_OPTIONS.find((option) => option.step === "exit") || null);
      }
      if (input === "c") {
        setSelectedOption(CLI_OPTIONS.find((option) => option.step === "create") || null);
      }

      if (input === "d") {
        setSelectedOption(CLI_OPTIONS.find((option) => option.step === "delete") || null);
      }

      if (input === "l") {
        setSelectedOption(CLI_OPTIONS.find((option) => option.step === "list") || null);
      }

      if (input === "u") {
        setSelectedOption(CLI_OPTIONS.find((option) => option.step === "update") || null);
      }
    },
    { isActive: !!!selectedOption },
  );

  if (args.includes("-u")) return <Update />;

  return (
    <>
      <Text color="whiteBright">블로그 관련 작업을 실행합니다.</Text>
      <Text color="blue">옵션을 선택하세요.</Text>
      <OptionSelector
        key="cli-options"
        options={CLI_OPTIONS}
        onConfirm={(option) => setSelectedOption(option)}
        isActive={!!!selectedOption}
      />
      {selectedOption && <Processors step={selectedOption.step} />}
    </>
  );
};

render(<Index />);
