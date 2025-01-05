import { useLayoutEffect, useRef } from 'react';
import { TextEditorPresenter } from './text_editor_presenter.ts';
import { Box } from '@tcn/ui-layout';
import styles from './text_editor.module.css';

export interface TextEditorProps {
  presenter: TextEditorPresenter;
}

export function TextEditor({ presenter }: TextEditorProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    if (ref.current != null) {
      presenter.initialize(ref.current);
    }

    return () => {
      presenter.dispose();
    };
  }, [presenter]);

  return <Box className={styles['text-editor']} ref={ref} ></Box>;
}
