import { VStack } from '@tcn/ui-layout';
import { PanelHeader } from './panel_header.tsx';
import { Snippets } from './snippets.tsx';
import styles from './snippets_side_panel.module.css';

export function SnippetsSidePanel() {
  return (
    <VStack
      className={styles['snippets-side-panel']}
      horizontalAlignment="start"
      overflowY="hidden"
    >
      <PanelHeader className={styles['panel-header']}>SNIPPETS</PanelHeader>
      <Snippets className={styles['panel-body']} />
    </VStack>
  );
}
