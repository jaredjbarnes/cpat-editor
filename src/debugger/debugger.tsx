import { Box, FlexBox, HStack, Spacer, VStack } from "@tcn/ui-layout";
import { DebuggerPresenter } from "./debugger_presenter.ts";
import { Diagram } from "../diagram.tsx";
import { Button } from "@tcn/ui-controls";
import styles from "./debugger.module.css";
import { TextEditor } from "../text_editor.tsx";
import { useLayoutEffect } from "react";
import { useSignalValue } from "@tcn/state";

export interface DebuggerProps {
  presenter: DebuggerPresenter;
  onComplete: () => void;
}

export function Debugger({ presenter, onComplete }: DebuggerProps) {
  const isPlaying = useSignalValue(presenter.isPlayingBroadcast);

  useLayoutEffect(() => {
    presenter.initialize();
  }, [presenter]);

  function next() {
    presenter.next();
  }

  function prev() {
    presenter.previous();
  }

  function start() {
    presenter.start();
  }

  function end() {
    presenter.end();
  }

  function stop() {
    presenter.stop();
  }

  function play() {
    presenter.play();
  }

  return (
    <VStack zIndex={2}>
      <HStack
        height="40px"
        className={styles["debugger-header"]}
        horizontalAlignment="center"
        padding="8px"
      >
        <Spacer />
        <Button onClick={start}>Start</Button>
        <Spacer width="8px" />
        <Button onClick={prev}>Previous</Button>
        <Spacer width="8px" />
        {!isPlaying ? (
          <Button onClick={play}>Play</Button>
        ) : (
          <Button onClick={stop}>Stop</Button>
        )}
        <Spacer width="8px" />
        <Button onClick={next}>Next</Button>
        <Spacer width="8px" />
        <Button onClick={end}>End</Button>
        <Spacer />
        <Spacer width="8px" />
        <Button onClick={onComplete}>Close</Button>
      </HStack>
      <HStack flex>
        <FlexBox>
          <TextEditor presenter={presenter.textEditorPresenter} />
        </FlexBox>
        <Box width="50%" enableResizeOnStart>
          <Diagram
            presenter={presenter.diagramPresenter}
            onPatternClick={(patternPath) => {
              presenter.diagramPresenter.togglePatternPath(patternPath);
            }}
          />
        </Box>
      </HStack>
    </VStack>
  );
}
