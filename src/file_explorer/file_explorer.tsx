import { Button } from '@tcn/ui-controls';
import { FileExplorerPresenter } from './file_explorer_presenter.ts';
import { FlexBox, HStack, Spacer, VStack } from '@tcn/ui-layout';
import { useSignalValue } from '@tcn/state';
import { PanelHeader } from '../panel_header.tsx';
import styles from './file_explorer.module.css';
import { RootDirectory } from './root_directory.tsx';
import FilePlusIcon from "../icons/file_plus.svg?react";
import FolderPlusIcon from "../icons/folder_plus.svg?react";
import RefreshCCWIcon from "../icons/refresh_ccw.svg?react";
import moduleStyles from '../app.module.css';

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
          <Button className={moduleStyles["icon-button"]} onClick={startFileCreation}>
            <FilePlusIcon className={moduleStyles["icon"]}/>
          </Button>
          <Spacer width="8px" />
          <Button className={moduleStyles["icon-button"]} onClick={startDirectoryCreation}>
            <FolderPlusIcon className={moduleStyles["icon"]}/>
          </Button>
          <Spacer width="8px" />
          <Button className={moduleStyles["icon-button"]} onClick={refresh}>
            <RefreshCCWIcon className={moduleStyles["icon"]}/>
          </Button>
        </HStack>
      </PanelHeader>
      <FlexBox className={styles['panel-body']}>
        <RootDirectory directory={directory} presenter={presenter} />
      </FlexBox>
    </VStack>
  );
}
