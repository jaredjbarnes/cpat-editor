import { StyleBox } from '@tcn/ui-layout';

export interface AstProps {
  text: string;
}

export function Ast({ text }: AstProps) {
  return (
    <StyleBox
      overflow="auto"
      backgroundColor="var(--surface-tertiary-color)"
      fontSize="14px"
      fontFamily="'Courier New', Courier, monospace"
      fontWeight="bold"
    >
      <pre style={{ padding: '12px' }}>{text}</pre>
    </StyleBox>
  );
}
