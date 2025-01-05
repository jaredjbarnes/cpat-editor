import { Box, FlexBox, HStack, Spacer, VStack } from '@tcn/ui-layout';
import { AppPresenter } from './app_presenter.ts';
import { Diagram } from './diagram.tsx';
import { Ast } from './ast.tsx';
import { useSignalValue } from '@tcn/state';
import { TestEditor } from './test_editor.tsx';
import { GrammarEditor } from './grammar_editor.tsx';
import styles from './app.module.css';
import { IconButton } from '@tcn/ui-controls';
import { Header } from '@tcn/ui-core';
import { SnippetsSidePanel } from './snippets_side_panel.tsx';
import { FileExplorer } from './file_explorer.tsx';
import { useLayoutEffect } from 'react';

export interface AppProps {
  presenter: AppPresenter;
}

export function App({ presenter }: AppProps) {
  const ast = useSignalValue(presenter.testEditor.astBroadcast);
  const isDocumentationOpen = useSignalValue(presenter.isDocumentationOpenBroadcast);

  function toggleDocumentation() {
    presenter.toggleDocumentation();
  }

  useLayoutEffect(() => {
    presenter.initialize();
  }, [presenter]);

  return (
    <VStack>
      <HStack zIndex={2} className={styles.toolbar}>
        <HStack width="auto">
          <Spacer width="8px" />
          <IconButton iconSize="20px" iconName="menu" />
        </HStack>
        <Spacer />
        <Header>CPAT Playground</Header>
        <Spacer />
        <HStack width="auto">
          <IconButton
            iconSize="20px"
            onClick={toggleDocumentation}
            iconName="learning_center_real"
          />
          <Spacer width="8px" />
        </HStack>
      </HStack>
      <HStack flex zIndex={1}>
        <Box
          zIndex={2}
          className={styles.examples}
          minWidth="100px"
          width="33%"
          enableResizeOnEnd
        >
          <FileExplorer presenter={presenter.fileExplorer} />
        </Box>
        <VStack zIndex={1} flex overflowX="hidden">
          <HStack flex className={styles.top}>
            <FlexBox className={styles.left}>
              <GrammarEditor presenter={presenter.grammarEditor}></GrammarEditor>
            </FlexBox>
            <Box width="50%" enableResizeOnStart>
              <Diagram presenter={presenter.diagramPresenter}></Diagram>
            </Box>
          </HStack>
          <Box height="50%" enableResizeOnTop>
            <HStack>
              <FlexBox className={styles.left}>
                <TestEditor presenter={presenter.testEditor} />
              </FlexBox>
              <Box width="50%" enableResizeOnStart>
                <Ast text={ast}></Ast>
              </Box>
            </HStack>
          </Box>
        </VStack>
        {isDocumentationOpen && (
          <Box
            className={styles.examples}
            minWidth="100px"
            width="33%"
            enableResizeOnStart
          >
            <SnippetsSidePanel />
          </Box>
        )}
      </HStack>
    </VStack>
  );
}
