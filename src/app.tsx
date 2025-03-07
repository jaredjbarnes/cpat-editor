import { Box, FlexBox, HStack, Spacer, VStack, ZStack } from "@tcn/ui-layout";
import { AppPresenter } from "./app_presenter.ts";
import { Diagram } from "./diagram.tsx";
import { Ast } from "./ast.tsx";
import { useSignalValue } from "@tcn/state";
import { TestEditor } from "./tester/test_editor.tsx";
import { GrammarEditor } from "./grammar_editor.tsx";
import styles from "./app.module.css";
import { Button, ButtonGroup, Checkbox } from "@tcn/ui-controls";
import { BodyText, Header } from "@tcn/ui-core";
import { SnippetsSidePanel } from "./snippets_side_panel.tsx";
import { FileExplorer } from "./file_explorer/file_explorer.tsx";
import { useLayoutEffect } from "react";
import QuestionIcon from "./icons/question.svg?react";
import { Debugger } from "./debugger/debugger.tsx";
import { AstTree } from "./ast_tree.tsx";

export interface AppProps {
  presenter: AppPresenter;
}

export function App({ presenter }: AppProps) {
  useSignalValue(presenter.testEditor.selectedPatternBroadcast);
  useSignalValue(presenter.currentPathBroadcast);

  const astJson = useSignalValue(presenter.testEditor.astJsonBroadcast);
  const ast = useSignalValue(presenter.testEditor.astBroadcast);

  const isDocumentationOpen = useSignalValue(
    presenter.isDocumentationOpenBroadcast
  );
  const debuggerPresenter = useSignalValue(presenter.debuggerPresenter);
  const astView = useSignalValue(presenter.astViewBroadcast);
  const removeSpaces = useSignalValue(
    presenter.testEditor.removeSpacesBroadcast
  );

  function toggleDocumentation() {
    presenter.toggleDocumentation();
  }

  useLayoutEffect(() => {
    presenter.initialize();
  }, [presenter]);

  function closeDocumenation() {
    presenter.toggleDocumentation();
  }

  function closeDebug() {
    presenter.closeDebugger();
  }

  function copyAst() {
    navigator.clipboard.writeText(astJson);
  }

  function showTreeView() {
    presenter.setAstView("tree");
  }

  function showJsonView() {
    presenter.setAstView("json");
  }

  function updateSize() {
    presenter.grammarEditor.textEditor.updateSize();
    presenter.testEditor.updateSize();
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
              minWidth="250px"
              width="300px"
              enableResizeOnEnd
              onWidthResize={updateSize}
            >
              <FileExplorer presenter={presenter.fileExplorer} />
            </Box>
            <VStack zIndex={1} flex overflowX="hidden">
              <HStack zIndex={1} flex className={styles.top}>
                <FlexBox minWidth="200px" className={styles.left}>
                  <GrammarEditor
                    presenter={presenter.grammarEditor}
                  ></GrammarEditor>
                </FlexBox>
                <Box width="50%" enableResizeOnStart onWidthResize={updateSize}>
                  <Diagram
                    presenter={presenter.diagramPresenter}
                    onPatternClick={(path) => {
                      presenter.diagramPresenter.togglePatternPath(path);
                    }}
                  ></Diagram>
                </Box>
              </HStack>
              <Box
                zIndex={2}
                height="50%"
                enableResizeOnTop
                onHeightResize={updateSize}
              >
                <HStack>
                  <FlexBox minWidth="200px" className={styles.left}>
                    <TestEditor presenter={presenter.testEditor} />
                  </FlexBox>
                  <Box
                    width="50%"
                    enableResizeOnStart
                    onWidthResize={updateSize}
                  >
                    <ZStack>
                      {astView === "tree" && <AstTree ast={ast} />}
                      {astView === "json" && (
                        <>
                          <Ast text={astJson}></Ast>

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
                        </>
                      )}
                      <VStack
                        padding="8px"
                        verticalAlignment="start"
                        horizontalAlignment="center"
                        style={{ pointerEvents: "none" }}
                      >
                        <HStack height="auto">
                          <Spacer />
                          <ButtonGroup>
                            <Button
                              onClick={showJsonView}
                              style={{ pointerEvents: "auto" }}
                            >
                              JSON
                            </Button>

                            <Button
                              onClick={showTreeView}
                              style={{ pointerEvents: "auto" }}
                            >
                              Tree
                            </Button>
                          </ButtonGroup>
                          <Spacer />
                          <HStack height="auto" width="auto" gap="4px">
                            <BodyText>Remove Spaces:</BodyText>
                            <Checkbox
                              checked={removeSpaces}
                              style={{ pointerEvents: "auto" }}
                              onClick={() => {
                                presenter.testEditor.toggleRemoveSpaces();
                              }}
                            />
                          </HStack>
                        </HStack>
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
                onResize={updateSize}
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
