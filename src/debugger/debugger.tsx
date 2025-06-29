import { Box, FlexBox, HStack, Spacer, VStack } from "@tcn/ui-layout";
import { DebuggerPresenter } from "./debugger_presenter.ts";
import { Diagram } from "../diagram.tsx";
import { Button, ButtonGroup, Slider } from "@tcn/ui-controls";
import styles from "./debugger.module.css";
import { useLayoutEffect } from "react";
import { useSignalValue } from "@tcn/state";
import { Editor } from "../monaco_editor/editor.tsx";

export interface DebuggerProps {
  presenter: DebuggerPresenter;
  onComplete: () => void;
}

export function Debugger({ presenter, onComplete }: DebuggerProps) {
  const isPlaying = useSignalValue(presenter.isPlayingBroadcast);
  const playbackSpeed =
    1000 - useSignalValue(presenter.playbackSpeedBroadcast) + 300;

  useLayoutEffect(() => {
    presenter.initialize();
    () => {
      presenter.stop();
    };
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

  function close() {
    presenter.stop();
    onComplete();
  }

  function nextError() {
    presenter.nextError();
  }

  function previousError() {
    presenter.previousError();
  }

  function firstError() {
    presenter.firstError();
  }

  function lastError() {
    presenter.lastError();
  }

  function updatePlaybackSpeed(value: string) {
    const numberValue = Number(value);
    presenter.setPlaybackSpeed(1000 - numberValue + 300);
  }

  return (
    <VStack zIndex={2}>
      <HStack
        height="40px"
        className={styles["debugger-header"]}
        horizontalAlignment="center"
        padding="8px"
      >
        <ButtonGroup>
          <Button onClick={firstError}>First Error</Button>
          <Button onClick={previousError}>Previous Error</Button>
          <Button onClick={nextError}>Next Error</Button>
          <Button onClick={lastError}>Last Error</Button>
        </ButtonGroup>
        <Spacer />
        <ButtonGroup>
          <Button onClick={start}>Start</Button>
          <Button onClick={prev}>Previous</Button>
          {!isPlaying ? (
            <Button onClick={play}>Play</Button>
          ) : (
            <Button onClick={stop}>Stop</Button>
          )}
          <Button onClick={next}>Next</Button>
          <Button onClick={end}>End</Button>
        </ButtonGroup>
        <HStack flex horizontalAlignment="center">
          <Slider
            min="300"
            max="1000"
            value={String(playbackSpeed)}
            onChange={updatePlaybackSpeed}
            style={{ pointerEvents: "auto", width: "200px" }}
          />
        </HStack>
        <Button onClick={close}>Close</Button>
      </HStack>
      <HStack flex>
        <FlexBox>
          <Editor presenter={presenter.textEditor} />
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
