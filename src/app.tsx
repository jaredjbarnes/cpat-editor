import { Box, FlexBox, HStack, Spacer, VStack, ZStack } from "@tcn/ui-layout";
import { AppPresenter } from "./app_presenter.ts";
import { Diagram } from "./diagram.tsx";
import { Ast } from "./ast.tsx";
import { useSignalValue } from "@tcn/state";
import { TestEditor } from "./test_editor.tsx";
import { GrammarEditor } from "./grammar_editor.tsx";
import styles from "./app.module.css";
import { Button, ButtonGroup } from "@tcn/ui-controls";
import { Header } from "@tcn/ui-core";
import { SnippetsSidePanel } from "./snippets_side_panel.tsx";
import { FileExplorer } from "./file_explorer/file_explorer.tsx";
import { useLayoutEffect } from "react";
import QuestionIcon from "./icons/question.svg?react";
import { Debugger } from "./debugger/debugger.tsx";

export interface AppProps {
  presenter: AppPresenter;
}

export function App({ presenter }: AppProps) {
  useSignalValue(presenter.testEditor.selectedPatternBroadcast);
  useSignalValue(presenter.currentPathBroadcast);

  const ast = useSignalValue(presenter.testEditor.astBroadcast);
  const currentPathMetaData = useSignalValue(
    presenter.currentPathMetaDataBroadcast
  );
  const isDocumentationOpen = useSignalValue(
    presenter.isDocumentationOpenBroadcast
  );
  const debuggerPresenter = useSignalValue(presenter.debuggerPresenter);
  const canDebug = presenter.testEditor.selectedPattern != null;
  const canSave = currentPathMetaData && currentPathMetaData.type === "file";

  function toggleDocumentation() {
    presenter.toggleDocumentation();
  }

  useLayoutEffect(() => {
    presenter.initialize();
  }, [presenter]);

  function closeDocumenation() {
    presenter.toggleDocumentation();
  }

  function showDebug() {
    presenter.showDebugger();
  }

  function closeDebug() {
    presenter.closeDebugger();
  }

  function save() {
    presenter.save();
  }

  function copyAst() {
    navigator.clipboard.writeText(ast);
  }

  function copyGrammar() {
    navigator.clipboard.writeText(presenter.grammarEditor.textEditor.getText());
  }

  function copyTest() {
    navigator.clipboard.writeText(presenter.testEditor.textEditor.getText());
  }

  return (
    <>
      <ZStack>
        <VStack zIndex={1}>
          <HStack zIndex={2} className={styles.toolbar}>
            <HStack width="auto">
              <Spacer width="8px" />
            </HStack>
            <Spacer />
            <Header>CPAT Playground</Header>
            <Spacer />
            <HStack width="auto">
              <Button
                className={styles["icon-button"]}
                onClick={toggleDocumentation}
              >
                <QuestionIcon className={styles["icon"]} />
              </Button>
              <Spacer width="8px" />
            </HStack>
          </HStack>
          <HStack flex zIndex={1}>
            <Box
              zIndex={2}
              className={styles.examples}
              minWidth="100px"
              width="300px"
              enableResizeOnEnd
            >
              <FileExplorer presenter={presenter.fileExplorer} />
            </Box>
            <VStack zIndex={1} flex overflowX="hidden">
              <HStack flex className={styles.top}>
                <FlexBox minWidth="200px" className={styles.left}>
                  <ZStack>
                    <GrammarEditor
                      presenter={presenter.grammarEditor}
                    ></GrammarEditor>
                    <VStack
                      padding="8px"
                      verticalAlignment="end"
                      horizontalAlignment="end"
                      style={{ pointerEvents: "none" }}
                    >
                      <ButtonGroup>
                        <Button
                          onClick={copyGrammar}
                          style={{ pointerEvents: "auto" }}
                        >
                          Copy
                        </Button>
                        <Button
                          disabled={!canSave}
                          onClick={save}
                          style={{ pointerEvents: "auto" }}
                        >
                          Save
                        </Button>
                      </ButtonGroup>
                    </VStack>
                    {!canSave && (
                      <ZStack className={styles["select-file"]}>
                        <div className={styles["select-file-message"]}>
                          <Header>Select a File</Header>
                        </div>
                      </ZStack>
                    )}
                  </ZStack>
                </FlexBox>
                <Box width="50%" enableResizeOnStart>
                  <Diagram
                    presenter={presenter.diagramPresenter}
                    onPatternClick={(path) => {
                      presenter.diagramPresenter.togglePatternPath(path);
                    }}
                  ></Diagram>
                </Box>
              </HStack>
              <Box height="50%" enableResizeOnTop>
                <HStack>
                  <FlexBox minWidth="200px" className={styles.left}>
                    <ZStack>
                      <TestEditor presenter={presenter.testEditor} />
                      <VStack
                        padding="8px"
                        verticalAlignment="end"
                        horizontalAlignment="end"
                        style={{ pointerEvents: "none" }}
                      >
                        <ButtonGroup>
                          <Button
                            onClick={copyTest}
                            style={{ pointerEvents: "auto" }}
                          >
                            Copy
                          </Button>
                          <Button
                            disabled={!canDebug}
                            onClick={showDebug}
                            style={{ pointerEvents: "auto" }}
                          >
                            Debug
                          </Button>
                        </ButtonGroup>
                      </VStack>
                    </ZStack>
                  </FlexBox>
                  <Box width="50%" enableResizeOnStart>
                    <ZStack>
                      <Ast text={ast}></Ast>
                      <VStack
                        padding="8px"
                        verticalAlignment="end"
                        horizontalAlignment="end"
                        style={{ pointerEvents: "none" }}
                      >
                        <Button
                          onClick={copyAst}
                          style={{ pointerEvents: "auto" }}
                        >
                          Copy
                        </Button>
                      </VStack>
                    </ZStack>
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
                <SnippetsSidePanel onClose={closeDocumenation} />
              </Box>
            )}
          </HStack>
        </VStack>
        {debuggerPresenter && (
          <Debugger presenter={debuggerPresenter} onComplete={closeDebug} />
        )}
      </ZStack>
    </>
  );
}
