import { useLayoutEffect } from 'react';
import { GrammarEditorPresenter } from './grammar_editor_presenter.ts';
import { TextEditor } from './text_editor.tsx';
import "./grammar_editor.css";

export interface GrammarEditorProps {
  presenter: GrammarEditorPresenter;
}

export function GrammarEditor({ presenter }: GrammarEditorProps) {
  useLayoutEffect(() => {
    presenter.initialize();
  }, [presenter]);

  return <TextEditor presenter={presenter.textEditor}></TextEditor>;
}
