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
  const scale = useSignalValue(presenter.scaleBroadcast);
  const translate = useSignalValue(presenter.translateBroadcast);

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

  function handleScale(event) {
    const scaleFactor = 0.003;
    const minScale = 0.5;
    const maxScale = 3;
    const absDelta = Math.abs(event.deltaY);
    let newScale = scale;

    if (event.deltaY < 0) {
      newScale = scale + scaleFactor * absDelta;
    } else {
      newScale = scale - scaleFactor * absDelta;
    }

    newScale = Math.min(Math.max(minScale, newScale), maxScale);
    presenter.setScale(newScale);
  }

  function startDrag(event) {
    const y = translate.y;
    const x = translate.x;
    const startX = event.clientX;
    const startY = event.clientY;

    function move(event: MouseEvent) {
      const deltaX = event.clientX - startX;
      const deltaY = event.clientY - startY;
      const newX = x + deltaX;
      const newY = y + deltaY;

      presenter.setTranslate(newX, newY);

      event.preventDefault();
    }

    function end(event: MouseEvent) {
      window.document.removeEventListener("mousemove", move);
      window.document.removeEventListener("mouseleave", end);
      window.document.removeEventListener("mouseup", end);
      event.preventDefault();
    }

    window.document.addEventListener("mousemove", move);
    window.document.addEventListener("mouseleave", end);
    window.document.addEventListener("mouseup", end);
  }

  return (
    <div
      className={styles.diagram}
      onClick={handleClick}
      onMouseDown={startDrag}
      onWheel={handleScale}
    >
      <div
        ref={ref}
        style={{
          display: "inline-block",
          transform: `translate(${translate.x}px, ${translate.y}px) scale(${scale})`,
        }}
      ></div>
    </div>
  );
}
