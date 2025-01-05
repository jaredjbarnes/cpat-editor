import { Accordion } from '@tcn/ui-controls';
import { Directory, File, FileExplorerPresenter } from './file_explorer_presenter.ts';
import { FlexBox, HStack, VStack } from '@tcn/ui-layout';
import { useSignalValue } from '@tcn/state';
import { PanelHeader } from './panel_header.tsx';
import styles from './file_explorer.module.css';
import { BodyText } from '@tcn/ui-core';

export interface FileExplorerProps {
  presenter: FileExplorerPresenter;
}

interface DirectoryItemProps {
  directory: Directory;
  presenter: FileExplorerPresenter;
}

function DirectoryItem({ directory, presenter }: DirectoryItemProps) {
  const openMap = useSignalValue(presenter.openDirectoriesBroadcast);
  const isOpen = openMap.get(directory.path);

  const children = directory.items.map((i, index) => {
    if (i.type === 'directory') {
      return <DirectoryItem key={index} directory={i} presenter={presenter} />;
    } else {
      return <FileItem key={index} file={i} presenter={presenter} />;
    }
  });

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

function FileItem({ file }: FileItemProps) {
  return (
    <HStack className={styles["file-item"]} height="auto">
      <BodyText variant="large">{file.name}</BodyText>
    </HStack>
  );
}

function Root({ directory, presenter }: DirectoryItemProps) {
  const children = directory.items.map((i, index) => {
    if (i.type === 'directory') {
      return <DirectoryItem key={index} directory={i} presenter={presenter} />;
    } else {
      return <FileItem key={index} file={i} presenter={presenter} />;
    }
  });

  return <>{children}</>;
}

export function FileExplorer({ presenter }: FileExplorerProps) {
  const directory = useSignalValue(presenter.directoryBroadcast);

  return (
    <VStack
      className={styles['file-explorer-side-panel']}
      horizontalAlignment="start"
      overflowY="hidden"
    >
      <PanelHeader className={styles['panel-header']}>FILE EXPLORER</PanelHeader>
      <FlexBox className={styles['panel-body']}>
        <Root directory={directory} presenter={presenter} />
      </FlexBox>
    </VStack>
  );
}
