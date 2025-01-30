import Tree from "react-d3-tree";
import { Node } from "clarity-pattern-parser";
import { useEffect, useRef, useState } from "react";

export interface AstTreeProps {
  ast: Node | null;
}

function walk(node: any, callback: (node: any) => void) {
  callback(node);

  const children = node.children?.slice();

  if (children == null) {
    return;
  }

  for (let x = 0; x < children.length; x++) {
    walk(children[x], callback);
  }
}

export function AstTree({ ast }: AstTreeProps) {
  const clone = ast?.toCycleFreeObject() || null;
  const finalAst = clone == null ? [] : (clone as any);
  const treeContainer = useRef<HTMLDivElement | null>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

  if (finalAst != null) {
    walk(finalAst, (n) => {
      if (n.children && n.children.length === 0) {
        n.name = n.value;
      } else if (n.children && n.children.length === 1) {
        n.name = n.value;
        n.children.length = 0;
      }
    });
  }

  useEffect(() => {
    if (treeContainer.current) {
      const { width, height } = treeContainer.current.getBoundingClientRect();
      setDimensions({ width, height });
    }
  }, []);

  if (finalAst.length === 0) {
    return null;
  }

  return (
    <div ref={treeContainer} style={{ width: "100%", height: "100%" }}>
      <Tree
        data={[finalAst]}
        orientation="vertical"
        translate={{ x: dimensions.width / 2, y: 100 }}
        separation={{ siblings: 2, nonSiblings: 2.5 }}
      ></Tree>
    </div>
  );
}
