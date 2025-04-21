import React, { useEffect } from "react";
import { CLIStep } from "./cliOptions";
import { Create } from "./processes/Create";
import { Exit } from "./processes/Exit";
import { Update } from "./processes/Update";
import { Delete } from "./processes/Delete";

export default function Processors({ step }: { step: CLIStep }) {
  switch (step) {
    case "create":
      return <Create />;

    case "delete":
      return <Delete />;

    case "update":
      return <Update />;

    default:
      return <Exit />;
  }
}
