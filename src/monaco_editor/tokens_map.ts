
enum Legends {
    KEYWORD = 0,
    TYPE,
    STRING,
    COMMENT,
    NUMBER,
    OPERATOR,
    VARIABLE,
    REGEXP,
    METHOD,
    PROPERTY,
}

export const tokensMap = {
    // String Literals
    literal: Legends.STRING,
    resource: Legends.STRING,

    // Keywords
    import: Legends.KEYWORD,
    "use-params": Legends.KEYWORD,
    "with-params": Legends.KEYWORD,
    from: Legends.KEYWORD,
    as: Legends.KEYWORD,

    // Comments
    comment: Legends.COMMENT,

    // Decorators
    "decorator-name": Legends.METHOD,
    "decorator-prefix": Legends.METHOD,
    "string-literal": Legends.STRING,
    "number-literal": Legends.NUMBER,
    "boolean-literal": Legends.KEYWORD,
    "object-key": Legends.PROPERTY,
    "null": Legends.KEYWORD,

    // Names
    name: Legends.VARIABLE,
    "alias-literal": Legends.VARIABLE,
    "pattern-name": Legends.VARIABLE,
    "divider-pattern": Legends.VARIABLE,
    "param-name": Legends.VARIABLE,

    // Language Structure
    "open-bracket": Legends.OPERATOR,
    "close-bracket": Legends.OPERATOR,
    "open-paren": Legends.OPERATOR,
    "close-paren": Legends.OPERATOR,
    "quantifier-shorthand": Legends.OPERATOR,
    "is-optional": Legends.OPERATOR,
    "assign-operator": Legends.OPERATOR,
    "options-divider": Legends.OPERATOR,
    "sequence-divider": Legends.OPERATOR,
    not: Legends.OPERATOR,

    // Regex
    "regex-literal": Legends.REGEXP,

    // Types
    "import-name": Legends.TYPE,
    "import-name-alias": Legends.TYPE,
};