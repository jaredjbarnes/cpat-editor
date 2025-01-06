import { FlexBox, VStack } from '@tcn/ui-layout';
import { TestEditorPresenter } from './test_editor_presenter.ts';
import { Select } from '@tcn/ui-controls';
import { TextEditor } from './text_editor.tsx';
import { useSignalValue } from '@tcn/state';
import { useLayoutEffect } from 'react';

export interface TestEditorProps {
  presenter: TestEditorPresenter;
}

export function TestEditor({ presenter }: TestEditorProps) {
  const patterns = useSignalValue(presenter.patternsBroadcast);
  const selectedPatternName = useSignalValue(presenter.selectedPatternBroadcast);
  const options = Object.keys(patterns).map((key, index) => {
    return <option key={index}>{key}</option>;
  });

  function selectPattern(value: string) {
    presenter.selectPattern(value);
  }

  options.unshift(<option key="null" value="null">-- Choose Pattern To Test --</option>);

  useLayoutEffect(() => {
    presenter.initialize();
  }, [presenter]);

  return (
    <VStack>
      <Select value={String(selectedPatternName)} onChange={selectPattern}>
        {options}
      </Select>
      <FlexBox>
        <TextEditor presenter={presenter.textEditor} />
      </FlexBox>
    </VStack>
  );
}
