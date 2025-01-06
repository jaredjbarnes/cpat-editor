import {
  Accordion,
  ContextMenu,
  FreeformMultiselect,
  IconButton,
  MenuItem,
  Multiselect,
} from '@tcn/ui-controls';
import { Directory, File, FileExplorerPresenter } from './file_explorer_presenter.ts';
import { FlexBox, HStack, Spacer, VStack } from '@tcn/ui-layout';
import { useSignalValue } from '@tcn/state';
import { PanelHeader } from './panel_header.tsx';
import styles from './file_explorer.module.css';
import { BodyText, Icon, Position } from '@tcn/ui-core';
import { useState } from 'react';
import { PendingFileCreation } from './pending_file_creation.tsx';

export interface FileExplorerProps {
  presenter: FileExplorerPresenter;
}

interface DirectoryItemProps {
  directory: Directory;
  presenter: FileExplorerPresenter;
}

function DirectoryItem({ directory, presenter }: DirectoryItemProps) {
  const openMap = useSignalValue(presenter.openDirectoriesBroadcast);
  const pendingFileCreation = useSignalValue(presenter.pendingFileCreationBroadcast);
  const isOpen = openMap.get(directory.path);

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

  return (
    <Accordion open={isOpen} label={directory.name}>
      {children}
    </Accordion>
  );
}

interface FileItemProps {
  file: File;
  presenter: FileExplorerPresenter;
}

function FileItem({ file, presenter }: FileItemProps) {
  const focusedItem = useSignalValue(presenter.focusedItemBroadcast);
  const isFocused = file.path === focusedItem?.path;
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState<Position | null>(null);

  function selectItem(event: React.MouseEvent<HTMLElement>) {
    console.log('CLICK');
    presenter.focus(file.path);
    event?.preventDefault();
  }

  function placeMenu(event: React.MouseEvent<HTMLElement>) {
    console.log('RIGHT_CLICK');
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
        <BodyText variant="large">{file.name}</BodyText>
      </HStack>
      <ContextMenu open={isOpen} position={position} onClose={close}>
        <MenuItem label="Delete" onClick={deleteFile} />
      </ContextMenu>
    </>
  );
}

function Root({ directory, presenter }: DirectoryItemProps) {
  const pendingFileCreation = useSignalValue(presenter.pendingFileCreationBroadcast);

  const children = directory.items.map((i, index) => {
    if (i.type === 'directory') {
      return <DirectoryItem key={index} directory={i} presenter={presenter} />;
    } else {
      return <FileItem key={index} file={i} presenter={presenter} />;
    }
  });

  if (pendingFileCreation != null && pendingFileCreation.directory === '/') {
    children.unshift(<PendingFileCreation key={-1} presenter={pendingFileCreation} />);
  }

  return <>{children}</>;
}

export function FileExplorer({ presenter }: FileExplorerProps) {
  const directory = useSignalValue(presenter.directoryBroadcast);

  function startFileCreation() {
    presenter.startFileCreation();
  }

  return (
    <VStack
      className={styles['file-explorer-side-panel']}
      horizontalAlignment="start"
      overflowY="hidden"
    >
      <PanelHeader className={styles['panel-header']}>
        <HStack>
          FILE EXPLORER <Spacer />
          <IconButton iconSize="25px" onClick={startFileCreation} iconName="file_plus" />
          <Spacer width="8px" />
          <IconButton iconSize="25px" iconName="folder_plus" />
          <Spacer width="8px" />
          <IconButton iconSize="22px" iconName="refresh_ccw" />
        </HStack>
      </PanelHeader>
      <FlexBox className={styles['panel-body']}>
        <Root directory={directory} presenter={presenter} />
      </FlexBox>
    </VStack>
  );
}
