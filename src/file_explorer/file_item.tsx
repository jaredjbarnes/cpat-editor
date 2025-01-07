import { useSignalValue } from '@tcn/state';
import { ContextMenu, MenuItem } from '@tcn/ui-controls';
import { Position, BodyText, Icon } from '@tcn/ui-core';
import { HStack } from '@tcn/ui-layout';
import { useState } from 'react';
import { FileExplorerPresenter } from './file_explorer_presenter.ts';
import { File } from './file_explorer_presenter.ts';
import styles from './file_item.module.css';

export interface FileItemProps {
  file: File;
  presenter: FileExplorerPresenter;
}

export function FileItem({ file, presenter }: FileItemProps) {
  const focusedItem = useSignalValue(presenter.focusedItemBroadcast);
  const isFocused = file.path === focusedItem?.path;
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState<Position | null>(null);

  function selectItem(event: React.MouseEvent<HTMLElement>) {
    presenter.focus(file.path);
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

  function deleteFile() {
    presenter.deleteFile(file.path);
  }

  return (
    <>
      <HStack
        className={styles['file-item']}
        data-is-focused={isFocused}
        height="auto"
        onContextMenu={placeMenu}
        onClick={selectItem}
      >
        <Icon name="file" size="25px" />
        <BodyText variant="large">{file.name}</BodyText>
      </HStack>
      <ContextMenu open={isOpen} position={position} onClose={close}>
        <MenuItem label="Delete" onClick={deleteFile} />
      </ContextMenu>
    </>
  );
}
