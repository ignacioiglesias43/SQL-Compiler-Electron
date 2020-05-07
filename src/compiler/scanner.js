import { tokens } from "./utils/tokens";
let tokenList = [],
  errorList = [];
var BreakException = {};
export default {
  //Metodo para cambiar espacios en blanco dentro de una constante alfanumerica
  /**data: texto separado por lineas
   * dataChanged: texto nuevo
   * comienzo, fin, medio: definen la regex a comparar
   */
  changeQuoteMarks(data) {
    let dataChanged = data;
    let comienzo = "(?:^|')";
    let fin = "(?:$|')";
    let str = dataChanged.split(/('.*?')/); //Separa por palabras
    str.forEach((s) => {
      //Busca constante alfanumerica
      /**s: palabra
       * newWord: palabra resultante
       * compare: regex a comparar
       */
      if (s.match(/('.*?')/)) {
        let newWord = s;
        newWord = s.replace(/\s/g, "¬");
        newWord = newWord.replace(/'/g, "");
        let medio = "(" + s.replace(/'/g, "") + ")";
        let compare = new RegExp(comienzo + medio + fin);
        dataChanged = dataChanged.replace(compare, " '•" + newWord + "' ");
      }
    });
    //
    dataChanged = dataChanged.replace(/\(/, " ( ");
    dataChanged = dataChanged.replace(/\)/, " ) ");
    dataChanged = dataChanged.replace(/(?<=\w|#)=/, " = ");
    dataChanged = dataChanged.replace(/>=/, " >= ");
    dataChanged = dataChanged.replace(/<=/, " <= ");
    dataChanged = dataChanged.replace(/^</, " < ");
    dataChanged = dataChanged.replace(/^>/, " > ");
    dataChanged = dataChanged.replace(/\+/, " + ");
    dataChanged = dataChanged.replace(/-/, " - ");
    dataChanged = dataChanged.replace(/\*/, " * ");
    dataChanged = dataChanged.replace(/\//, " / ");
    return dataChanged;
  },
  scan(data) {
    tokenList = [];
    errorList = [];
    let renglones = data.split(/\n/);
    let line = 1;
    renglones.forEach((renglon) => {
      let cadena = this.changeQuoteMarks(renglon);
      cadena = cadena.split(/(\s+|,|\(|\)|'|;)/);
      cadena.forEach((element) => {
        element = element.replace(/\s+/, "");
        if (element !== "") {
          let tokens;
          //Ejemplo: A.Alumno
          if (element.match(/^[A-Za-z_]+\.(\w+)[#]?/)) {
            tokens = element.split(/(\.)/);
            tokens.forEach((token) => {
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
                type: 1,
              },
            ],
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
      tokens.forEach((t) => {
        if (token.toUpperCase().match(t.regex)) {
          let value;
          if (t.value !== "n") {
            value = t.value;
          } else {
            value = token.replace(/•/, "");
            value = value.replace(/¬/g, " ");
          }

          Token = {
            value: value,
            code: t.code,
            type: t.type,
            line: line,
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
      code: 101,
      type: 1,
    };
    errorList.push(error);
  },
  getError() {
    return errorList;
  },
};
