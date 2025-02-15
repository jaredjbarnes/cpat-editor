import { VStack } from "@tcn/ui-layout";
import { Input } from "@tcn/ui-controls";
import { useSignalValue } from "@tcn/state";
import { useEffect, useRef } from "react";
import { TestPresenter } from "./test_presenter.ts";

export interface PendingTestCreationProps {
  presenter: TestPresenter;
}

export function PendingTestCreation({ presenter }: PendingTestCreationProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const test = useSignalValue(presenter.testBroadcast);
  const name = test.name;

  function checkForEnter(event: React.KeyboardEvent) {
    if (event.key === "Enter") {
      presenter.commit();
    } else if (event.key === "Escape") {
      presenter.abort();
    }
  }

  function updateName(value: string) {
    presenter.updateName(value);
  }

  function abort() {
    presenter.abort();
  }

  useEffect(() => {
    const input = inputRef.current;
    if (input != null) {
      input.focus();
    }
  }, []);

  return (
    <VStack height="auto" gap="8px" paddingBlock="6px 6px">
      <Input
        ref={inputRef}
        value={name}
        onKeyDown={checkForEnter}
        onChange={updateName}
        onBlur={abort}
      />
    </VStack>
  );
}
