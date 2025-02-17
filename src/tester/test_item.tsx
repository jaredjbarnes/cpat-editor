import { useState } from "react";
import { useSignalValue } from "@tcn/state";
import { ContextMenu, MenuItem } from "@tcn/ui-controls";
import { Position, BodyText } from "@tcn/ui-core";
import { HStack } from "@tcn/ui-layout";
import styles from "./test_item.module.css";
import { Test, TestSuitePresenter } from "./test_suite_presenter.ts";
import { PendingTestRenaming } from "./pending_test_renaming.tsx";

export interface TestItemProps {
  test: Test;
  presenter: TestSuitePresenter;
}

export function TestItem({ test, presenter }: TestItemProps) {
  const focusedItem = useSignalValue(presenter.focusedTestBroadcast);
  const renamingTest = useSignalValue(presenter.pendingTestRenamingBroadcast);
  const isFocused = test.name === focusedItem?.name;
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState<Position | null>(null);
  const isRenaming = renamingTest?.name === test.name;
console.log(renamingTest);
  function selectItem(event: React.MouseEvent<HTMLElement>) {
    presenter.focus(test);
    event.preventDefault();
    event.stopPropagation();
  }

  function placeMenu(event: React.MouseEvent<HTMLElement>) {
    setPosition({ x: event.clientX, y: event.clientY });
    setIsOpen(true);
    event.preventDefault();
  }

  function close() {
    setIsOpen(false);
  }

  function deleteTest() {
    presenter.deleteTest(test.name);
  }

  function renameTest() {
    presenter.startRenamingTest(test);
  }

  if (isRenaming) {
    return <PendingTestRenaming presenter={renamingTest} />;
  }

  return (
    <>
      <HStack
        className={styles["test-item"]}
        data-is-focused={isFocused}
        height="auto"
        onContextMenu={placeMenu}
        onClick={selectItem}
      >
        <BodyText variant="medium">{test.name}</BodyText>
      </HStack>
      <ContextMenu open={isOpen} position={position} onClose={close}>
        <MenuItem label="Rename" onClick={renameTest} />
        <MenuItem label="Delete" onClick={deleteTest} />
      </ContextMenu>
    </>
  );
}
