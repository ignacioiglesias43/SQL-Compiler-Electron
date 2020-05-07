import rules from "./utils/rules";
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
      prodStack.push(200);
      do {
        x = prodStack.pop();
        k = "" + tokens[apun].code;
        if (this.isTerminal(x) || x == 199) {
          if (x == k) {
            apun++;
          } else {
            let linea = tokens[apun].line;
            if (tokens[apun].code == 199) {
              linea = tokens[apun - 1].line;
            }
            console.log("acá");
            errors.push({
              id: 2,
              value: `Error sintáctico: ${tokens[apun].value}`,
              line: linea,
              code: 201,
              type: 2,
            });
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
            console.log("aqui");
            errors.push({
              id: 2,
              value: `Error sintáctico: ${tokens[apun].value}`,
              line: linea,
              code: 201,
              type: 2,
            });
            return errors;
          }
        }
        if (x == 199) {
          done = true;
        }
      } while (!done);
    }
    if (done) {
      errors.push({
        id: 2,
        value: "Sin error",
        line: ":)",
        code: 200,
        type: 2,
      });
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
    let term = this.getTerminal(k);
    let index = 0;
    prod >= 300 ? (index = (prod % 300) + 16) : (index = prod % 200);
    console.log("return: ", rules[index][term]);
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
      default:
        return -1;
    }
  },
};
