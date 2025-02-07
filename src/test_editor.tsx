import { FlexBox, HStack, Spacer, VStack, ZStack } from "@tcn/ui-layout";
import { TestEditorPresenter } from "./test_editor_presenter.ts";
import { Select } from "@tcn/ui-controls";
import { useSignalValue } from "@tcn/state";
import { useLayoutEffect } from "react";
import { BodyText } from "@tcn/ui-core";
import { Editor } from "./monaco_editor/editor.tsx";

export interface TestEditorProps {
  presenter: TestEditorPresenter;
}

export function TestEditor({ presenter }: TestEditorProps) {
  const patterns = useSignalValue(presenter.patternsBroadcast);
  const selectedPatternName = useSignalValue(
    presenter.selectedPatternBroadcast
  );
  const options = Object.keys(patterns).map((key, index) => {
    return <option key={index}>{key}</option>;
  });
  const parseDuration = useSignalValue(presenter.parseDurationBroadcast);

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
  }, [presenter]);

  return (
    <ZStack>
      <VStack>
        <Select value={String(selectedPatternName)} onChange={selectPattern}>
          {options}
        </Select>
        <FlexBox>
          <Editor presenter={presenter.textEditor} />
        </FlexBox>
      </VStack>
      <VStack style={{ pointerEvents: "none" }}>
        <Spacer />
        <HStack height="auto" padding="8px">
          <BodyText variant="small">{`Parse Time: ${parseDuration}ms`}</BodyText>
          <Spacer width="150px" />
        </HStack>
      </VStack>
    </ZStack>
  );
}
