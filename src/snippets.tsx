import ReactMarkdown from 'react-markdown';
import snippets from './snippets.md?raw';
import remarkGfm from 'remark-gfm';
import './snippets.css';

export function Snippets() {
  return (
    <div className="markdown-body" style={{ padding: '0px 12px', height: '100%', overflowY: "auto" }}>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{snippets}</ReactMarkdown>
    </div>
  );
}
