import { useSignalValue } from '@tcn/state';
import { Directory, FileExplorerPresenter } from './file_explorer_presenter.ts';
import { ContextMenu, MenuItem } from '@tcn/ui-controls';
import { PendingFileCreation } from './pending_file_creation.tsx';
import { FileItem } from './file_item.tsx';
import { PendingDirectoryCreation } from './pending_directory_creation.tsx';
import styles from './directory_item.module.css';
import moduleStyles from '../app.module.css';
import { Position, BodyText } from '@tcn/ui-core';
import { HStack, VStack } from '@tcn/ui-layout';
import { useLayoutEffect, useState } from 'react';
import ChevronDownIcon from "../icons/chevron_down.svg?react";
import ChevronRightIcon from "../icons/chevron_right.svg?react";

export interface DirectoryItemProps {
  directory: Directory;
  presenter: FileExplorerPresenter;
}

export function DirectoryItem({ directory, presenter }: DirectoryItemProps) {
  const focusedItem = useSignalValue(presenter.focusedItemBroadcast);
  const isFocused = directory.path === focusedItem?.path;
  const [isContextMenuOpen, setContextMenuOpen] = useState(false);
  const [position, setPosition] = useState<Position | null>(null);

  const openMap = useSignalValue(presenter.openDirectoriesBroadcast);
  const pendingFileCreation = useSignalValue(presenter.pendingFileCreationBroadcast);
  const pendingDirectoryCreation = useSignalValue(
    presenter.pendingDirectoryCreationBroadcast
  );

  const isPending = pendingDirectoryCreation != null || pendingFileCreation != null;
  const isOpen = openMap.get(directory.path);
  const path = directory.path;

  const children = directory.items.map((i, index) => {
    if (i.type === 'directory') {
      return <DirectoryItem key={index} directory={i} presenter={presenter} />;
    } else {
      return <FileItem key={index} file={i} presenter={presenter} />;
    }
  });

  if (pendingFileCreation != null && pendingFileCreation.directory === directory.path) {
    children.unshift(<PendingFileCreation key={-1} presenter={pendingFileCreation} />);
  }

  if (
    pendingDirectoryCreation != null &&
    pendingDirectoryCreation.directory === directory.path
  ) {
    children.unshift(
      <PendingDirectoryCreation key={-1} presenter={pendingDirectoryCreation} />
    );
  }

  function selectItem(event: React.MouseEvent<HTMLElement>) {
    presenter.toggleDirectory(directory.path);
    presenter.focus(directory.path);
    event.stopPropagation();
    event.preventDefault();
  }

  function placeMenu(event: React.MouseEvent<HTMLElement>) {
    setPosition({ x: event.clientX, y: event.clientY });
    setContextMenuOpen(true);
    event.preventDefault();
  }

  function close() {
    setContextMenuOpen(false);
  }

  function deleteFile() {
    presenter.deleteFile(directory.path);
  }

  useLayoutEffect(() => {
    if (isPending) {
      presenter.openDirectory(path);
    }
  }, [isPending, presenter, path]);

  const padding = path.split('/').length * 5;

  return (
    <>
      <HStack
        height="auto"
        data-is-focused={isFocused}
        onContextMenu={placeMenu}
        onClick={selectItem}
        className={styles['directory-item']}
        paddingInlineStart={`${padding}px`}
      >
        {
          isOpen 
            ? <ChevronDownIcon className={`${moduleStyles["icon"]} ${moduleStyles["black"]}`}/> 
            : <ChevronRightIcon className={`${moduleStyles["icon"]} ${moduleStyles["black"]}`}/>
        }
        <BodyText variant="large">{directory.name}</BodyText>
      </HStack>
      {isOpen && <VStack height="auto">{children}</VStack>}
      <ContextMenu open={isContextMenuOpen} position={position} onClose={close}>
        <MenuItem label="Delete" onClick={deleteFile} />
      </ContextMenu>
    </>
  );
}
