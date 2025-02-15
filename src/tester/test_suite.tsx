import { Box, FlexBox, HStack, Spacer, VStack } from "@tcn/ui-layout";
import { TestSuitePresenter } from "./test_suite_presenter.ts";
import { Editor } from "../monaco_editor/editor.tsx";
import { PanelHeader } from "../panel_header.tsx";
import { Button } from "@tcn/ui-controls";
import { useSignalValue } from "@tcn/state";
import { TestItem } from "./test_item.tsx";
import styles from "./test_suite.module.css";
import { PendingTestCreation } from "./pending_test_creation.tsx";
import { useLayoutEffect } from "react";

export interface TestSuiteProps {
  presenter: TestSuitePresenter;
}

export function TestSuite({ presenter }: TestSuiteProps) {
  const tests = useSignalValue(presenter.testsBroadcast);
  const pendingTestCreation = useSignalValue(
    presenter.pendingTestCreationBroadcast
  );
  const showPendingCreation = pendingTestCreation != null;

  function updateSize() {
    presenter.updateSize();
  }

  function add() {
    presenter.startTestCreation();
  }

  useLayoutEffect(() => {
    presenter.initialize();
    return () => presenter.dispose();
  }, [presenter]);

  return (
    <HStack>
      <Box width="200px" enableResizeOnEnd onWidthResize={updateSize}>
        <VStack className={styles["test-suite-side-panel"]}>
          <PanelHeader className={styles["panel-header"]}>
            <HStack>
              TESTS <Spacer />
              <Button onClick={add}>Add</Button>
            </HStack>
          </PanelHeader>
          <FlexBox className={styles["panel-body"]}>
            {showPendingCreation && (
              <PendingTestCreation presenter={pendingTestCreation} />
            )}
            {tests.map((t, index) => {
              return <TestItem key={index} test={t} presenter={presenter} />;
            })}
          </FlexBox>
        </VStack>
      </Box>
      <FlexBox>
        <Editor presenter={presenter.editorPresenter} />
      </FlexBox>
    </HStack>
  );
}
