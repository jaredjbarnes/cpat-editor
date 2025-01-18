import { Pattern } from "clarity-pattern-parser";
import { HistoryRecord } from "clarity-pattern-parser/dist/patterns/CursorHistory";

export interface DebuggerStep {
    type: "move" | "match" | "error";
    pattern: Pattern;
    path: string;
    record: HistoryRecord
}

export function generateSteps(rootPattern: Pattern, records: HistoryRecord[]) {
    const steps: DebuggerStep[] = [];
    let currentPattern = rootPattern;

    records.forEach((record) => {
        const from = currentPattern;
        const to = record.pattern;
        const path = getPathFromPatternToPattern(from, to);
        const isSibling = to.parent === from.parent;
        currentPattern = to;

        if (!isSibling) {
            path.forEach((pattern) => {
                if (pattern.type === "repeat" ||
                    pattern.type === "infinite-repeat" ||
                    pattern.type === "finite-repeat" ||
                    pattern.type === "optional" ||
                    pattern.type === "reference" ||
                    (pattern.parent?.type === "optional" && record.error != null)
                ) {
                    return;
                }

                steps.push({
                    type: "move",
                    pattern,
                    record,
                    path: generatePath(pattern)
                });

                if (pattern === to) {
                    steps.push({
                        type: record.ast == null ? "error" : "match",
                        pattern,
                        record,
                        path: generatePath(pattern)
                    });
                }
            });

        } else {
            steps.push({
                type: "move",
                pattern: to,
                record,
                path: generatePath(to)
            }, {
                type: record.ast == null ? "error" : "match",
                pattern: to,
                record,
                path: generatePath(to)
            });
        }
    });

    return steps;
}

export function generatePath(fromPattern: Pattern) {
    const pathParts: string[] = [];
    let pattern: Pattern | null = fromPattern;

    while (pattern != null) {
        pathParts.unshift(pattern.id);
        pattern = pattern.parent;
    }

    return pathParts.join("/");
}

export function getPatternDepth(pattern: Pattern | null) {
    let depth = 0;

    while (pattern != null) {
        depth++;
        pattern = pattern.parent;
    }

    return depth;
}

export function getPathFromPatternToPattern(from: Pattern, to: Pattern) {
    const fromPatternPath: Pattern[] = [];
    const fromAncestorMap = new Map<Pattern, boolean>();

    const toPatternPath: Pattern[] = [];
    const toAncestorMap = new Map<Pattern, boolean>();

    let onPattern: Pattern | null = from.parent;
    while (onPattern != null) {
        fromAncestorMap.set(onPattern, true);
        fromPatternPath.push(onPattern);
        onPattern = onPattern.parent;
    }

    onPattern = to;
    while (onPattern != null) {
        toAncestorMap.set(onPattern, true);

        if (fromAncestorMap.has(onPattern)) {
            const index = fromPatternPath.indexOf(onPattern);
            const patternPath = fromPatternPath.slice(0, index);
            patternPath.push(...toPatternPath);

            return patternPath;
        }

        toPatternPath.unshift(onPattern);
        onPattern = onPattern.parent;
    }

    return [];
}
