import rules from "./utils/rules";
import semantic from "./semantic.js";
let prodStack = [];
let tokens = [];
let errors = [];
export default {
  algorithm(data) {
    prodStack = [];
    errors = data.errors;
    tokens = data.tokens;
    tokens.push({
      value: "$",
      line: 0,
      type: 0,
      code: 199,
    });
    let done = false;
    if (data.errors[0].code == 100) {
      let x = 0,
        k = 0,
        apun = 0;
      prodStack.push(199);
      prodStack.push(300);
      do {
        x = prodStack.pop();
        k = "" + tokens[apun].code;
        if (x >= 700) {
          let error = semantic.semanticAnalyze(x, tokens[apun - 1], tokens);
          if (error !== null) {
            errors.push(error);
            return errors;
          }
        } else {
          if (this.isTerminal(x) || x == 199) {
            if (x == k) {
              apun++;
            } else {
              let linea = tokens[apun].line;
              if (tokens[apun].code == 199) {
                linea = tokens[apun - 1].line;
              }
              this.errors(x, k, linea);
              return errors;
            }
          } else {
            if (this.checkRules(x, k)) {
              let production = this.getProduction(x, k);
              if (production !== "99") {
                this.insert(production);
              }
            } else {
              let linea = tokens[apun].line;
              if (tokens[apun].code == 199) {
                linea = tokens[apun - 1].line;
              }
              this.errors(x, k, linea);
              return errors;
            }
          }
          if (x == 199) {
            done = true;
          }
        }
      } while (!done);
    }
    if (done) {
      errors.push(
        {
          id: 2,
          value: "Sin errores sintácticos",
          line: ":)",
          code: 200,
          type: 2,
        },
        {
          id: 3,
          value: "Sin errores semánticos",
          line: ":)",
          code: 300,
          type: 3,
        }
      );
    }
    return errors;
  },
  checkRules(prod, k) {
    return this.getProduction(prod, k) !== "0";
  },
  insert(data) {
    let newData = data.split(/(\d+)/);
    for (let i = newData.length - 1; i >= 0; i--) {
      if (!/^\s*$/.test(newData[i]) && newData[i] !== "") {
        prodStack.push(newData[i]);
      }
    }
  },
  getProduction(prod, k) {
    if (k == 10) prod = 300;
    else if (k == 16) prod = 200;
    else if (k == 27) prod = 211;
    let term = this.getTerminal(k);
    let index = 0;
    prod >= 300 ? (index = (prod % 300) + 16) : (index = prod % 200);
    return term !== -1 ? rules[index][term] : "0";
  },
  isTerminal(terminal) {
    return terminal > 0 && terminal < 200;
  },
  getTerminal(terminal) {
    switch (terminal) {
      case "4":
        return 0;
      case "8":
        return 1;
      case "10":
        return 2;
      case "11":
        return 3;
      case "12":
        return 4;
      case "13":
        return 5;
      case "14":
        return 6;
      case "15":
        return 7;
      case "16":
        return 8;
      case "18":
        return 9;
      case "19":
        return 10;
      case "20":
        return 11;
      case "22":
        return 12;
      case "24":
        return 13;
      case "25":
        return 14;
      case "26":
        return 15;
      case "27":
        return 16;
      case "50":
        return 17;
      case "51":
        return 18;
      case "53":
        return 19;
      case "54":
        return 20;
      case "61":
        return 21;
      case "62":
        return 22;
      case "72":
        return 23;
      case "199":
        return 24;
      case "40":
        return 25;
      default:
        return -1;
    }
  },
  errors(x, k, line) {
    if (x < 300) {
      if (
        x == 200 ||
        x == 201 ||
        x == 203 ||
        x == 204 ||
        x == 207 ||
        x == 208 ||
        x == 211 ||
        x == 215
      )
        errors.push({
          id: 2,
          value: "Se esperaba palabra reservada",
          line: line,
          code: 201,
          type: 2,
        });
      else if (x == 202 || x == 206)
        errors.push({
          id: 2,
          value: "Se esperaba identificador",
          line: line,
          code: 204,
          type: 2,
        });
      else if (x == 205 || x == 209 || x == 210 || x == 214 || x == 212)
        errors.push({
          id: 2,
          value: "Se esperaba delimitador",
          line: line,
          code: 205,
          type: 2,
        });
      else if (x == 213)
        errors.push({
          id: 2,
          value: "Se esperaba constante",
          line: line,
          code: 206,
          type: 2,
        });
      else if (x >= 10 && x <= 29)
        errors.push({
          id: 2,
          value: "Se esperaba palabra reservada",
          line: line,
          code: 201,
          type: 2,
        });
      else if (x >= 50 && x <= 55)
        errors.push({
          id: 2,
          value: "Se esperaba delimitador",
          line: line,
          code: 205,
          type: 2,
        });
      else if (x == 61 || x == 62)
        errors.push({
          id: 2,
          value: "Se esperaba constante",
          line: line,
          code: 206,
          type: 2,
        });
      else
        errors.push({
          id: 2,
          value: "Se esperaba identificador",
          line: line,
          code: 204,
          type: 2,
        });
    } else if (x >= 300) {
      if (x == 305 && (k == 4 || k == 62))
        errors.push({
          id: 2,
          value: "Se esperaba delimitador",
          line: line,
          code: 205,
          type: 2,
        });
      else if (x == 316 && (k == 62 || k == 53))
        errors.push({
          id: 2,
          value: "Se esperaba delimitador",
          line: line,
          code: 205,
          type: 2,
        });
      else if (x == 305 && (k == 54 || k == 61))
        errors.push({
          id: 2,
          value: "Se esperaba operador relacional",
          line: line,
          code: 208,
          type: 2,
        });
      else if (x == 305 && k == 52)
        errors.push({
          id: 2,
          value: "Se esperaba palabra reservada",
          line: line,
          code: 201,
          type: 2,
        });
      else if (x == 300 || x == 310 || x == 312 || x == 317)
        errors.push({
          id: 2,
          value: "Se esperaba palabra reservada",
          line: line,
          code: 201,
          type: 2,
        });
      else if (
        x == 301 ||
        x == 302 ||
        x == 304 ||
        x == 305 ||
        x == 306 ||
        x == 308 ||
        x == 309 ||
        x == 311 ||
        x == 313 ||
        (x == 316 && k == 4)
      )
        errors.push({
          id: 2,
          value: "Se esperaba identificador",
          line: line,
          code: 204,
          type: 2,
        });
      else if (x == 303 || x == 307)
        errors.push({
          id: 2,
          value: "Se esperaba delimitador",
          line: line,
          code: 205,
          type: 2,
        });
      else if (x == 314)
        errors.push({
          id: 2,
          value: "Se esperaba operador relacional",
          line: line,
          code: 208,
          type: 2,
        });
      else if (x == 318 || x == 319 || x == 316)
        errors.push({
          id: 2,
          value: "Se esperaba constante",
          line: line,
          code: 206,
          type: 2,
        });
    } else {
      errors.push({
        id: 2,
        value: "Se esperaba delimitador",
        line: line,
        code: 205,
        type: 2,
      });
    }
  },
};
