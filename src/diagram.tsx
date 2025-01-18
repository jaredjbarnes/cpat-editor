import { DiagramPresenter } from "./diagram_presenter.ts";
import { useEffect, useRef } from "react";
import { useSignalValue, useSignalValueEffect } from "@tcn/state";
import { Diagram as RailroadDiagram } from "./railroad_diagrams/railroad.js";
import styles from "./diagram.module.css";

export interface DiagramProps {
  presenter: DiagramPresenter;
  onPatternClick?: (patternPath: string) => void;
}

export function Diagram({ presenter, onPatternClick }: DiagramProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const focusPath = useSignalValue(presenter.focusNodePathBroadcast);

  useSignalValueEffect((diagrams: RailroadDiagram[]) => {
    const div = ref.current;
    if (div != null) {
      div.innerHTML = "";
      diagrams.forEach((diagram) => {
        const wrapper = window.document.createElement("div");
        diagram.addTo(wrapper);
        div.appendChild(wrapper);
      });
    }
  }, presenter.diagramsBroadcast);

  function handleClick(event: React.MouseEvent<HTMLElement>) {
    let target = event.target as any;
    while (target.parentElement != null) {
      if (target.id) {
        if (target.parentElement?.dataset["referencePath"] != null) {
          onPatternClick &&
            onPatternClick(target.parentElement?.dataset["referencePath"]);
        } else {
          onPatternClick && onPatternClick(target.id);
        }
        break;
      }
      target = target.parentElement;
    }
  }

  useEffect(() => {
    const div = ref.current;

    if (div != null && focusPath != null) {
      div.querySelector(`.terminal#${focusPath}`)?.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "center",
      });
    }
  }, [focusPath]);

  return <div onClick={handleClick} ref={ref} className={styles.diagram}></div>;
}
