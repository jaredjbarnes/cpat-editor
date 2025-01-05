import { HStack, Spacer, VStack } from '@tcn/ui-layout';
import { PanelHeader } from './panel_header.tsx';
import { Snippets } from './snippets.tsx';
import styles from './snippets_side_panel.module.css';
import { IconButton } from '@tcn/ui-controls';

export interface SnippetsSidePanelProps {
  onClose?: () => void;
}

export function SnippetsSidePanel({ onClose }: SnippetsSidePanelProps) {
  function close() {
    onClose && onClose();
  }
  return (
    <VStack
      className={styles['snippets-side-panel']}
      horizontalAlignment="start"
      overflowY="hidden"
    >
      <PanelHeader className={styles['panel-header']}>
        <HStack height="auto">
          SNIPPETS
          <Spacer />
          <IconButton iconSize="22px" iconName="cross" onClick={close} />
        </HStack>
      </PanelHeader>
      <Snippets className={styles['panel-body']} />
    </VStack>
  );
}
