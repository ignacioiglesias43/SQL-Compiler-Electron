import { tokens } from "./tokens";
let tokenList = [],
  errorList = [];
var BreakException = {};
export default {
  //TODO: Metodo para cambiar espacios en blanco dentro de una constante alfanumerica
  changeQuoteMarks(data) {
    let dataChanged = data;
    return dataChanged;
  },
  scan(data) {
    tokenList = [];
    errorList = [];
    let renglones = data.split(/\n/);
    let newData = this.changeQuoteMarks(renglones);
    let line = 1;
    newData.forEach(renglon => {
      let cadena = renglon.split(/(\s+|,|\(|\)|')/);
      cadena.forEach(element => {
        element = element.replace(/\s+/, "");
        if (element !== "") {
          let tokens;
          if (element.match(/^[A-Za-z_]+\.(\w+)[#]?/)) {
            tokens = element.split(/(\.)/);
            tokens.forEach(token => {
              this.addTokenToList(token, line);
            });
          }
          this.addTokenToList(element, line);
        }
      });
      line++;
    });
    const result = {
      tokens: tokenList,
      errors:
        Object.keys(errorList).length > 0
          ? errorList
          : [
              {
                id: 1,
                value: "Sin error",
                line: ":)",
                code: 100,
                type: 1
              }
            ]
    };
    return result;
  },
  addTokenToList(token, line) {
    const t = this.getToken(token, line);
    if (Object.keys(t).length > 0) {
      if (!tokenList.includes(t)) {
        tokenList.push(t);
      }
    } else {
      this.addError(token, line);
    }
  },
  getToken(token, line) {
    let Token = {};
    try {
      tokens.forEach(t => {
        if (token.toUpperCase().match(t.regex)) {
          let value;
          if (t.value !== "n") {
            value = t.value;
          } else {
            value = token;
          }
          Token = {
            value: value,
            code: t.code,
            type: t.type,
            line: line
          };
          throw BreakException;
        }
      });
    } catch (e) {
      if (e !== BreakException) throw e;
    }
    return Token;
  },
  addError(token, line) {
    const error = {
      value: "Error léxico: " + token,
      line: line,
      code: 100,
      type: 1
    };
    errorList.push(error);
  },
  getError() {
    return errorList;
  }
};
