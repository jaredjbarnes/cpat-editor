import Tree from "react-d3-tree";
import { Node } from "clarity-pattern-parser";
import { useEffect, useRef, useState } from "react";

export interface AstTreeProps {
  ast: Node | null;
}

export function AstTree({ ast }: AstTreeProps) {
  const clone = ast?.toCycleFreeObject() || null;
  const finalAst = clone == null ? [] : (clone as any);
  const treeContainer = useRef<HTMLDivElement | null>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

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
        pathFunc={"step"}
        separation={{ siblings: 2, nonSiblings: 2.5 }}
      ></Tree>
    </div>
  );
}
