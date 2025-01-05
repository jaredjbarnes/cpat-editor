import Quill from "quill";

const Inline = Quill.import('blots/inline') as any;

class SyntaxHighlightBlot extends Inline {
  static create(value) {
    let node = super.create();
    if (value) {
      node.classList.add(value);
    }
    return node;
  }

  static formats(node) {
    return node.className || null;
  }

  format(name, value) {
    if (name === this.statics.blotName && value) {
      this.domNode.classList.add(value);
    } else if (name === this.statics.blotName && !value) {
      this.domNode.classList.remove("syntax-error");
      this.domNode.classList.remove("syntax-keyword");
      this.domNode.classList.remove("syntax-literal");
      this.domNode.classList.remove("syntax-comment");
      this.domNode.classList.remove("syntax-name");
      this.domNode.classList.remove("syntax-structure");
      this.domNode.classList.remove("syntax-regex");
    } else {
      super.format(name, value);
    }
  }
}

SyntaxHighlightBlot.blotName = 'syntax-highlight';
SyntaxHighlightBlot.tagName = 'span';

Quill.register(SyntaxHighlightBlot);
