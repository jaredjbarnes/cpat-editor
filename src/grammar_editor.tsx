import { useLayoutEffect } from "react";
import { GrammarEditorPresenter } from "./grammar_editor_presenter.ts";
import "./grammar_editor.css";
import { Editor } from "./monaco_editor/editor.tsx";

export interface GrammarEditorProps {
  presenter: GrammarEditorPresenter;
}

export function GrammarEditor({ presenter }: GrammarEditorProps) {
  useLayoutEffect(() => {
    presenter.initialize();
  }, [presenter]);

  return <Editor presenter={presenter.textEditor}></Editor>;
}
