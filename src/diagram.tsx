import { DiagramPresenter } from "./diagram_presenter.ts";
import { useRef } from "react";
import { useSignalValueEffect } from "@tcn/state";
import { Diagram as RailroadDiagram } from "./railroad_diagrams/railroad.js";
import { StyleBox } from "@tcn/ui-layout";

export interface DiagramProps {
  presenter: DiagramPresenter;
}

export function Diagram({ presenter }: DiagramProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  useSignalValueEffect((diagrams: RailroadDiagram[]) => {
    const div = ref.current;
    if (div != null) {
      div.innerHTML = "";
      diagrams.forEach((diagram) => {
        const wrapper = window.document.createElement("div");
        let id = "";
        try {
          id = diagram.items[1].label.text;
        } catch {}

        wrapper.id = id;
        console.log(wrapper.id);
        diagram.addTo(wrapper);
        div.appendChild(wrapper);
      });
    }
  }, presenter.diagramsBroadcast);

  return (
    <StyleBox
      ref={ref}
      overflow="auto"
      backgroundColor="var(--surface-tertiary-color)"
    ></StyleBox>
  );
}
