import { VStack } from '@tcn/ui-layout';
import { Input } from '@tcn/ui-controls';
import { useSignalValue } from '@tcn/state';
import { BodyText } from '@tcn/ui-core';
import { useEffect, useRef } from 'react';
import { DirectoryCreation } from './directory_creation.ts';

export interface PendingDirectoryCreationProps {
  presenter: DirectoryCreation;
}

export function PendingDirectoryCreation({ presenter }: PendingDirectoryCreationProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const name = useSignalValue(presenter.nameBroadcast);
  const error = useSignalValue(presenter.errorBroadcast);

  function checkForEnter(event: React.KeyboardEvent) {
    if (event.key === 'Enter') {
      presenter.commit();
      console.log('Committed');
    } else if (event.key === 'Escape') {
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

  const padding = (presenter.directory.split('/').length + 2) * 8;

  return (
    <VStack
      height="auto"
      paddingInlineStart={`${padding}px`}
      paddingBlock="6px 6px"
      gap="8px"
    >
      <Input
        ref={inputRef}
        value={name}
        onKeyDown={checkForEnter}
        onChange={updateName}
        onBlur={abort}
      />
      {error && <BodyText color="--default-error-color">{error}</BodyText>}
    </VStack>
  );
}
