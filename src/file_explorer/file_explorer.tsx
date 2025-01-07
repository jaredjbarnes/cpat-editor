import { IconButton } from '@tcn/ui-controls';
import { FileExplorerPresenter } from './file_explorer_presenter.ts';
import { FlexBox, HStack, Spacer, VStack } from '@tcn/ui-layout';
import { useSignalValue } from '@tcn/state';
import { PanelHeader } from '../panel_header.tsx';
import styles from './file_explorer.module.css';
import { RootDirectory } from './root_directory.tsx';

export interface FileExplorerProps {
  presenter: FileExplorerPresenter;
}

export function FileExplorer({ presenter }: FileExplorerProps) {
  const directory = useSignalValue(presenter.directoryBroadcast);

  function startFileCreation() {
    presenter.startFileCreation();
  }

  function startDirectoryCreation() {
    presenter.startDirectoryCreation();
  }

  function refresh() {
    presenter.refresh();
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
          <IconButton
            iconSize="25px"
            onClick={startDirectoryCreation}
            iconName="folder_plus"
          />
          <Spacer width="8px" />
          <IconButton iconSize="22px" onClick={refresh} iconName="refresh_ccw" />
        </HStack>
      </PanelHeader>
      <FlexBox className={styles['panel-body']}>
        <RootDirectory directory={directory} presenter={presenter} />
      </FlexBox>
    </VStack>
  );
}
