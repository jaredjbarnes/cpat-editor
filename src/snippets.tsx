import classNames from 'classnames';
import styles from './snippets.module.css';
import { VStack } from '@tcn/ui-layout';

function GrammarExampleHeader({ text }: { text: string }) {
  return <h1 className={styles['snippet-header']}>{text}</h1>;
}

function Literal() {
  return (
    <VStack height="auto" horizontalAlignment="start">
      <GrammarExampleHeader text="Literal" />
      <div className={styles['snippet-code']}>
        <span className="syntax-name">john</span>
        <span> </span>
        <span>=</span>
        <span> </span>
        <span className="syntax-literal">"John"</span>
      </div>
    </VStack>
  );
}

function Regex() {
  return (
    <VStack height="auto" horizontalAlignment="start">
      <GrammarExampleHeader text="Regular Expression" />
      <div className={styles['snippet-code']}>
        <span className="syntax-name">space</span>
        <span> </span>
        <span>=</span>
        <span> </span>
        <span className="syntax-regex">/\s+/</span>
      </div>
    </VStack>
  );
}

function Options() {
  return (
    <VStack height="auto" horizontalAlignment="start">
      <GrammarExampleHeader text="Options" />
      <div className={styles['snippet-code']}>
        <div>
          <span className="syntax-name">john</span>
          <span> </span>
          <span>=</span>
          <span> </span>
          <span className="syntax-literal">"John"</span>
        </div>
        <div>
          <span className="syntax-name">jane</span>
          <span> </span>
          <span>=</span>
          <span> </span>
          <span className="syntax-literal">"Jane"</span>
        </div>
        <div>
          <span className="syntax-name">name</span>
          <span> </span>
          <span>=</span>
          <span> </span>
          <span>jane</span>
          <span> | </span>
          <span>john</span>
        </div>
      </div>
    </VStack>
  );
}

function Repeat() {
  return (
    <VStack height="auto" horizontalAlignment="start">
      <GrammarExampleHeader text="Regular Expression" />
      <div className={styles['snippet-code']}>
        <span className="syntax-name">list</span>
        <span> </span>
        <span>=</span>
        <span> </span>(<span className="syntax-literal"></span>)
      </div>
    </VStack>
  );
}

export interface SnippetsProps {
  className?: string;
  style?: React.CSSProperties;
}

export function Snippets({ className, style }: SnippetsProps) {
  return (
    <VStack
      flex
      horizontalAlignment="start"
      overflowY="auto"
      className={classNames(styles['snippets'], className)}
      style={style}
    >
      <Literal />
      <Regex />
      <Options />
      <Repeat />
    </VStack>
  );
}
