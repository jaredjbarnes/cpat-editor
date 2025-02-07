import { useLayoutEffect, useRef } from "react";
import { EditorPresenter } from "./editor_presenter.ts";
import { Box } from "@tcn/ui-layout";

export interface EditorProps {
  presenter: EditorPresenter;
}

export function Editor({ presenter }: EditorProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    if (ref.current != null) {
      presenter.initialize(ref.current);
    }

    return () => {
      presenter.dispose();
    };
  }, [presenter]);

  useLayoutEffect(() => {
    function updateSize() {
      presenter.updateSize();
    }

    window.addEventListener("resize", updateSize);
    return () => {
      window.removeEventListener("resize", updateSize);
    };
  }, [presenter]);

  return <Box ref={ref}></Box>;
}
