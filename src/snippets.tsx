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
          <span className="syntax-name">jane</span>
          <span> | </span>
          <span className="syntax-name">john</span>
        </div>
      </div>
    </VStack>
  );
}

function Sequence() {
  return (
    <VStack height="auto" horizontalAlignment="start">
      <GrammarExampleHeader text="Sequence" />
      <div className={styles['snippet-code']}>
        <div>
          <span className="syntax-name">prefix</span>
          <span> </span>
          <span>=</span>
          <span> </span>
          <span className="syntax-literal">"I am "</span>
        </div>
        <div>
          <span className="syntax-name">adjective</span>
          <span> </span>
          <span>=</span>
          <span> </span>
          <span className="syntax-literal">"happy"</span>
        </div>
        <div>
          <span className="syntax-name">mood</span>
          <span> </span>
          <span>=</span>
          <span> </span>
          <span className="syntax-name">prefix</span>
          <span> + </span>
          <span className="syntax-name">adjective</span>
        </div>
      </div>
    </VStack>
  );
}

function Repeat() {
  return (
    <VStack height="auto" horizontalAlignment="start">
      <GrammarExampleHeader text="Repeat" />
      <div className={styles['snippet-code']}>
        <div>
          <span className="syntax-name">name</span>
          <span> </span>
          <span>=</span>
          <span> </span>
          <span className="syntax-literal">"John"</span>
        </div>
        <div>
          <span className="syntax-name">comma</span>
          <span> </span>
          <span>=</span>
          <span> </span>
          <span className="syntax-literal">", "</span>
        </div>
        <div>
          <span className="syntax-name">repeat</span>
          <span> </span>
          <span>=</span>
          <span> </span>(<span className="syntax-name">name</span>, <span className="syntax-name">comma</span>)
        </div>
        <div>
          <span className="syntax-name">zero-or-more</span>
          <span> </span>
          <span>=</span>
          <span> </span>(<span className="syntax-name">name</span>, <span className="syntax-name">comma</span>)*
        </div>
        <div>
          <span className="syntax-name">at-least-one-entry</span>
          <span> </span>
          <span>=</span>
          <span> </span>(<span className="syntax-name">name</span>, <span className="syntax-name">comma</span>)+
        </div>
        <div>
          <span className="syntax-name">at-least-two-entries</span>
          <span> </span>
          <span>=</span>
          <span> </span>
          (<span className="syntax-name">name</span>, <span className="syntax-name">comma</span>)
          {`{2,}`}
        </div>
        <div>
          <span className="syntax-name">between-two-and-four-entries</span>
          <span> </span>
          <span>=</span>
          <span> </span>
          (<span className="syntax-name">name</span>, <span className="syntax-name">comma</span>)
          {`{2,4}`}
        </div>
        <div>
          <span className="syntax-name">trim-divider</span>
          <span> </span>
          <span>=</span>
          <span> </span>(<span className="syntax-name">name</span>, <span className="syntax-name">comma</span> trim)
        </div>
      </div>
    </VStack>
  );
}

function NegativeLookahead() {
  return (
    <VStack height="auto" horizontalAlignment="start">
      <GrammarExampleHeader text="Negative Lookahead" />
      <div className={styles['snippet-code']}>
        <div>
          <span className="syntax-name">bob</span>
          <span> </span>
          <span>=</span>
          <span> </span>
          <span className="syntax-literal">"Bob"</span>
        </div>
        <div>
          <span className="syntax-name">james</span>
          <span> </span>
          <span>=</span>
          <span> </span>
          <span className="syntax-literal">"James"</span>
        </div>
        <div>
          <span className="syntax-name">name</span>
          <span> = !</span>
          <span className="syntax-name">james</span> + <span className="syntax-name">bob</span>
        </div>
      </div>
    </VStack>
  );
}

function Import() {
  return (
    <VStack height="auto" horizontalAlignment="start">
      <GrammarExampleHeader text="Import" />
      <div className={styles['snippet-code']}>
        <div>
          <span className="syntax-keyword">import</span>
          <span> {"{"} </span>
          <span className="syntax-name">another-test</span>
          <span> {"}"} </span>
          <span className="syntax-keyword">from </span>
          <span className="syntax-literal">"./test.cpat"</span>
        </div>

        <div>
          <span className="syntax-name">another-test</span>
          <span> </span>
          <span>=</span>
          <span> </span>
          <span className="syntax-name">test</span> | <span className="syntax-literal">"something else"</span>
        </div>
      </div>
    </VStack>
  );
}

function UseParams() {
  return (
    <VStack height="auto" horizontalAlignment="start">
      <GrammarExampleHeader text="Use Parameters" />
      <div className={styles['snippet-code']}>
        <div>
          <span className="syntax-keyword">use params </span>
          <span> {"{"} </span>
          <span className="syntax-name">customer-names</span>
          <span> {"}"} </span>
        </div>

        <div>
          <span className="syntax-name">name</span>
          <span> </span>
          <span>=</span>
          <span> </span>
          <span className="syntax-name">customer-names</span> | <span className="syntax-literal">"Billy"</span>
        </div>
      </div>
    </VStack>
  );
}

function DefineImportParams() {
  return (
    <VStack height="auto" horizontalAlignment="start">
      <GrammarExampleHeader text="Define Parameters on Import" />
      <div className={styles['snippet-code']}>
        <div>
          <span className="syntax-keyword">import</span>
          <span> {"{"} </span>
          <span className="syntax-name">name</span>
          <span> {"}"} </span>
          <span className="syntax-keyword">from </span>
          <span className="syntax-literal">"./names.cpat"</span>
          <span className="syntax-keyword"> with params </span>
          <span>{"{"}</span>
        </div>
        <div>
          <span className="syntax-name" style={{whiteSpace: 'pre'}}>  customer-names</span>
          <span> = </span>
          <span className="syntax-literal">"Anakin"</span>
          <span> | </span>
          <span className="syntax-literal">"Yoda"</span>
        </div>
        <div>
          <span>{"}"}</span>
        </div>

        <div>
          <span className="syntax-name">name-list</span>
          <span> </span>
          <span>=</span>
          <span> </span>(<span className="syntax-name">name</span>, <span className="syntax-name">comma</span> trim)
        </div>

      </div>
    </VStack>
  );
}

function Comment() {
  return (
    <VStack height="auto" horizontalAlignment="start">
      <GrammarExampleHeader text="Comment" />
      <div className={styles['snippet-code']}>
        <span className="syntax-comment"># Describe your patterns</span>
      </div>
    </VStack>
  );
}

function GreedyOptions() {
  return (
    <VStack height="auto" horizontalAlignment="start">
      <GrammarExampleHeader text="Greedy Options" />
      <div className={styles['snippet-code']}>
        <div>
          <span className="syntax-comment"># Will traverse each option and take the longest one</span>
        </div>

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
          <span className="syntax-name">jane</span>
          <span> {"<|>"} </span>
          <span className="syntax-name">john</span>
        </div>

        <div>
          <span className="syntax-comment"># Potentially computationally expensive, use with care</span>
        </div>
        <div>
          <span className="syntax-comment"># Do not use in circular patterns</span>
        </div>
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
      <Sequence />
      <Repeat />
      <NegativeLookahead />
      <Import />
      <UseParams />
      <DefineImportParams />
      <Comment />
      <GreedyOptions />
    </VStack>
  );
}
