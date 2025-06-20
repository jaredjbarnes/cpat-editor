export const operatorPrecedence = `# Examples

add-sub-operator = "+" + "-"
mul-div-operator = "*" + "/" + "%"
add-sub-expression = expression + spaces? + add-sub-operator + spaces? + expression
mul-div-expression = expression + spaces? + mul-div-operator + spaces? + expression
group-expression = "(" + expression + ")"
exponent-expression = expression + "^" + expression 

expression = exponent-expression | mul-div-expression | add-sub-expressoin | negate-expression | increment-expression | group | integer


`;