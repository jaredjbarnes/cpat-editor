import { Box, FlexBox, HStack, Spacer, VStack, ZStack } from "@tcn/ui-layout";
import { TestEditorPresenter } from "./test_editor_presenter.ts";
import { Button, Select, SelectGroup } from "@tcn/ui-controls";
import { useSignalValue } from "@tcn/state";
import { useLayoutEffect } from "react";
import { BodyText } from "@tcn/ui-core";
import { Editor } from "../monaco_editor/editor.tsx";
import { TestSuite } from "./test_suite.tsx";

export interface TestEditorProps {
  presenter: TestEditorPresenter;
}

export function TestEditor({ presenter }: TestEditorProps) {
  const patterns = useSignalValue(presenter.patternsBroadcast);
  const errorMessage = useSignalValue(presenter.errorMessageBroadcast);
  const testSuitePresenter = useSignalValue(
    presenter.testSuitePresenterBroadcast
  );
  const selectedPatternName = useSignalValue(
    presenter.selectedPatternBroadcast
  );
  const options = Object.keys(patterns).map((key, index) => {
    return <option key={index}>{key}</option>;
  });
  const parseDuration = useSignalValue(presenter.parseDurationBroadcast);
  const view = testSuitePresenter == null ? "quick-test" : "test-suite";
  function selectPattern(value: string) {
    presenter.selectPattern(value);
  }

  options.unshift(
    <option key="null" value="null">
      -- Choose Pattern To Test --
    </option>
  );

  useLayoutEffect(() => {
    presenter.initialize();
    return () => presenter.dispose();
  }, [presenter]);

  function showQuickTest() {
    presenter.showQuickTest();
  }

  function showTestSuite() {
    presenter.showTestSuite();
  }

  function debug(){
    presenter.debug();
  }

  return (
    <VStack >
      <HStack
        height="auto"
        padding="8px"
        minHeight="40px"
        style={{ borderBottom: "1px solid var(--border-primary-color)" }}
        zIndex={2}
      >
        <Select
          value={String(selectedPatternName)}
          onChange={selectPattern}
          width="auto"
        >
          {options}
        </Select>
        <Spacer />
        <SelectGroup
          value={[view]}
          onChange={(value) => {
            if (value.includes("quick-test")) {
              showQuickTest();
            } else {
              showTestSuite();
            }
          }}
        >
          <option value="quick-test">Quick Test</option>
          <option value="test-suite">Test Siute</option>
        </SelectGroup>
        <Spacer />
        <Button onClick={debug}>Debug</Button>
      </HStack>
      <FlexBox zIndex={1}>
        <ZStack>
          <Editor presenter={presenter.textEditor} />
          {testSuitePresenter && <TestSuite presenter={testSuitePresenter} />}
        </ZStack>
      </FlexBox>
      <Box
        height="auto"
        padding="4px"
        style={{ background: "var(--surface-secondary-color)" }}
      >
        <HStack
          height="auto"
          padding="4px"
          style={{ boxShadow: "var(--inset-box-shadow)" }}
        >
          {errorMessage && (
            <BodyText variant="small">{`${errorMessage}`}</BodyText>
          )}
          <Spacer />
          <BodyText variant="small">{`Parse Time: ${parseDuration}ms`}</BodyText>
        </HStack>
      </Box>
    </VStack>
    // <ZStack>
    //   <VStack>
    //     <Select value={String(selectedPatternName)} onChange={selectPattern}>
    //       {options}
    //     </Select>
    //     <FlexBox>
    //       <ZStack>
    //         <Editor presenter={presenter.textEditor} />
    //         {testSuitePresenter && <TestSuite presenter={testSuitePresenter} />}
    //       </ZStack>
    //     </FlexBox>
    //   </VStack>
    //   <VStack style={{ pointerEvents: "none" }}>
    //     <Spacer />
    //     <HStack height="auto" padding="8px">
    //       <BodyText variant="small">{`Parse Time: ${parseDuration}ms`}</BodyText>
    //       <Spacer width="150px" />
    //       <ButtonGroup style={{ pointerEvents: "auto" }}>
    //         <Button onClick={showQuickTest}>Quick Test</Button>
    //         <Button onClick={showTestSuite}>Test Suite</Button>
    //       </ButtonGroup>
    //       <Spacer width="150px" />
    //     </HStack>
    //   </VStack>
    // </ZStack>
  );
}
