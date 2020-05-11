const tokens = [
  {
    regex: /^\SELECT$/,
    value: "SELECT",
    code: 10,
    type: 1,
  },
  {
    regex: /^FROM$/,
    value: "FROM",
    code: 11,
    type: 1,
  },
  {
    regex: /^WHERE$/,
    value: "WHERE",
    code: 12,
    type: 1,
  },
  {
    regex: /^IN$/,
    value: "IN",
    code: 13,
    type: 1,
  },
  {
    regex: /^AND$/,
    value: "AND",
    code: 14,
    type: 1,
  },
  {
    regex: /^OR$/,
    value: "OR",
    code: 15,
    type: 1,
  },
  {
    regex: /^CREATE$/,
    value: "CREATE",
    code: 16,
    type: 1,
  },
  {
    regex: /^TABLE$/,
    value: "TABLE",
    code: 17,
    type: 1,
  },
  {
    regex: /^CHAR$/,
    value: "CHAR",
    code: 18,
    type: 1,
  },
  {
    regex: /^NUMERIC$/,
    value: "NUMERIC",
    code: 19,
    type: 1,
  },
  {
    regex: /^NOT$/,
    value: "NOT",
    code: 20,
    type: 1,
  },
  {
    regex: /^NULL$/,
    value: "NULL",
    code: 21,
    type: 1,
  },
  {
    regex: /^CONSTRAINT$/,
    value: "CONSTRAINT",
    code: 22,
    type: 1,
  },
  {
    regex: /^KEY$/,
    value: "KEY",
    code: 23,
    type: 1,
  },
  {
    regex: /^PRIMARY$/,
    value: "PRIMARY",
    code: 24,
    type: 1,
  },
  {
    regex: /^FOREIGN$/,
    value: "FOREIGN",
    code: 25,
    type: 1,
  },
  {
    regex: /^REFERENCES$/,
    value: "REFERENCES",
    code: 26,
    type: 1,
  },
  {
    regex: /^INSERT$/,
    value: "INSERT",
    code: 27,
    type: 1,
  },
  {
    regex: /^INTO$/,
    value: "INTO",
    code: 28,
    type: 1,
  },
  {
    regex: /^VALUES$/,
    value: "VALUES",
    code: 29,
    type: 1,
  },
  {
    regex: /^GO$/,
    value: "GO",
    code: 30,
    type: 1,
  },
  {
    regex: /^PROCEDURE$/,
    value: "PROCEDURE",
    code: 31,
    type: 1,
  },
  {
    regex: /^CREATE$/,
    value: "CREATE",
    code: 16,
    type: 1,
  },
  {
    regex: /^VARCHAR$/,
    value: "VARCHAR",
    code: 32,
    type: 1,
  },
  {
    regex: /^IF$/,
    value: "IF",
    code: 34,
    type: 1,
  },
  {
    regex: /^AS$/,
    value: "AS",
    code: 33,
    type: 1,
  },
  {
    regex: /^EXIST$/,
    value: "EXIST",
    code: 35,
    type: 1,
  },
  {
    regex: /^BEGIN$/,
    value: "BEGIN",
    code: 36,
    type: 1,
  },
  {
    regex: /^PRINT$/,
    value: "PRINT",
    code: 37,
    type: 1,
  },
  {
    regex: /^END$/,
    value: "END",
    code: 38,
    type: 1,
  },
  {
    regex: /^ELSE$/,
    value: "ELSE",
    code: 39,
    type: 1,
  },
  {
    regex: /^,$/,
    value: ",",
    code: 50,
    type: 5,
  },
  {
    regex: /^\.$/,
    value: ".",
    code: 51,
    type: 5,
  },
  {
    regex: /^\($/,
    value: "(",
    code: 52,
    type: 5,
  },
  {
    regex: /^\)$/,
    value: ")",
    code: 53,
    type: 5,
  },
  {
    regex: /^'$/,
    value: "'",
    code: 54,
    type: 5,
  },
  {
    regex: /^;$/,
    value: ";",
    code: 55,
    type: 5,
  },
  {
    regex: /^\+$/,
    value: "+",
    code: 70,
    type: 7,
  },
  {
    regex: /^-$/,
    value: "-",
    code: 71,
    type: 7,
  },
  {
    regex: /^\*$/,
    value: "*",
    code: 72,
    type: 7,
  },
  {
    regex: /^\/$/,
    value: "/",
    code: 73,
    type: 7,
  },
  {
    regex: /^>$/,
    value: ">",
    code: 8,
    type: 81,
  },
  {
    regex: /^<$/,
    value: "<",
    code: 8,
    type: 82,
  },
  {
    regex: /^=$/,
    value: "=",
    code: 8,
    type: 83,
  },
  {
    regex: /^>=$/,
    value: ">=",
    code: 8,
    type: 84,
  },
  {
    regex: /^<=$/,
    value: "<=",
    code: 8,
    type: 85,
  },
  {
    regex: /^\d*([.,])?\d+$|^\d+[.,]?\d+$/gm,
    value: "n",
    code: 61,
    type: 6,
  },
  {
    regex: /^•/,
    value: "n",
    code: 62,
    type: 6,
  },
  {
    regex: /^[A-Za-z _]\w*[#]?$/,
    value: "n",
    code: 4,
    type: 400,
  },
];

export { tokens };
/***
 * 10: Palabras reservadas
 * 5: Delimitadores
 * 7: Operadores
 * 8: Operadores relacionales
 * 61: Constante numerica
 * 62: Constante alfanumerica
 * 4: Identificadores
 */
