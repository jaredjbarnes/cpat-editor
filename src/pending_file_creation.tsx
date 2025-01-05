import { HStack } from '@tcn/ui-layout';
import { FileCreation } from './file_creation.ts';
import { Input } from '@tcn/ui-controls';
import { useSignalValue } from '@tcn/state';
import { BodyText } from '@tcn/ui-core';
import { useEffect, useRef } from 'react';

export interface PendingFileCreationProps {
  presenter: FileCreation;
}

export function PendingFileCreation({ presenter }: PendingFileCreationProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const name = useSignalValue(presenter.nameBroadcast);
  const error = useSignalValue(presenter.errorBroadcast);

  function checkForEnter(event: React.KeyboardEvent) {
    if (event.key === 'Enter') {
      presenter.commit();
      console.log('Committed');
    }
  }

  function updateName(value: string) {
    presenter.updateName(value);
  }

  useEffect(() => {
    const input = inputRef.current;
    if (input != null) {
      input.focus();
    }
  }, []);

  return (
    <HStack height="auto">
      <Input
        ref={inputRef}
        value={name}
        onKeyDown={checkForEnter}
        onChange={updateName}
      />
      {error && <BodyText color="--default-error-color">{error}</BodyText>}
    </HStack>
  );
}
