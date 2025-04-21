export type CLIOption = {
  prompt: string;
  step: CLIStep;
  key: string;
};

export const CLI_OPTIONS = [
  { prompt: "(c) 📝새 포스트 작성", step: "create", key: "c" },
  { prompt: "(u) 📦 포스트 업데이트", step: "update", key: "u" },
  { prompt: "(d) ❌ 포스트 삭제", step: "delete", key: "d" },
  { prompt: "(q) ↩️ 종료", step: "exit", key: "q" },
] as const;

export type CLIStep = (typeof CLI_OPTIONS)[number]["step"];
