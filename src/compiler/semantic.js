import scanner from "./scanner";
import createTables from "./utils/tables";
let tables = [],
  attributes = [],
  restrictions = [];
let attrib = [],
  aliasList = [],
  aux = [],
  tablas = [],
  dmlTokens = [],
  subTabla = [];
let subQuery = false,
  isComp = false;
export default {
  fillTables(tokens) {
    let index = 0;
    tables = [];
    attributes = [];
    restrictions = [];
    tokens.forEach((token) => {
      //Llena las tablas
      token.code == 17 &&
        !tables.includes(tokens[tokens.indexOf(token) + 1]) &&
        tables.push(new Table(tokens[tokens.indexOf(token) + 1].value, 0, 0));
      index = tables.length - 1;
      //Lena atributos
      if (token.code == 18 || token.code == 19) {
        tables[index].attributes++;
        let notNull;
        //Verifica si contiene not null
        tokens[tokens.indexOf(token) + 4].code == 20 &&
        tokens[tokens.indexOf(token) + 5].code == 21
          ? (notNull = true)
          : (notNull = false);
        attributes.push(
          new Attribute(
            index,
            tokens[tokens.indexOf(token) - 1].value,
            token.value,
            tokens[tokens.indexOf(token) - 1].value.length,
            notNull
          )
        );
      }
      //Llena restricciones
      if (token.code == 22) {
        tables[index].restrictions++;
        let type;
        tokens[tokens.indexOf(token) + 2].code == 24 ? (type = 1) : (type = 2);
        restrictions.push(
          new Restriction(
            index,
            type,
            tokens[tokens.indexOf(token) + 1].value,
            type === 1
              ? "-"
              : this.findAttrib(
                  index,
                  tokens[tokens.indexOf(token) + 5].value.toUpperCase()
                ),
            index,
            type === 1 ? "-" : index
          )
        );
      }
      if (token.code == 26) {
        index = tables.findIndex(
          (t) => t.name == tokens[tokens.indexOf(token) + 1].value.toUpperCase()
        );
        restrictions[index].table_number = index;
        restrictions[index].attribute = this.findAttrib(
          index,
          tokens[tokens.indexOf(token) + 3].value.toUpperCase()
        );
      }
    });
    return {
      tables: tables,
      attributes: attributes,
      restrictions: restrictions,
    };
  },
  attrib(token) {
    let p = dmlTokens[dmlTokens.findIndex((d) => d == token) + 1];
    if (!isComp) {
      let cons = attributes.find((a) => {
        return a.name === token.value.toUpperCase();
      });
      if (cons) {
        attrib.push(token);
        return null;
      } else {
        return {
          id: 3,
          value: `El nombre del atributo ${token.value} no es válido`,
          line: token.line,
          code: 311,
          type: 3,
        };
      }
    } else if (p.value !== ".") {
      if (!subQuery) {
        return this.attribTable(token, tablas);
      } else {
        return this.attribTable(token, subTabla);
      }
    }
    return null;
  },
  attribTable(token, table) {
    let index = tables.findIndex((t) => {
      return t.name === table[0].value.toUpperCase();
    });
    if (this.findAttrib(index, token.value.toUpperCase()) !== null) {
      return null;
    }
    return {
      id: 3,
      value: `El nombre del atributo ${token.value} no es válido`,
      line: token.line,
      code: 311,
      type: 3,
    };
  },
  defType(x) {
    if (x == 10) {
      isComp = false;
      attrib = [];
      aux = [];
    }
    if (x == 12) {
      isComp = true;
    }
    if (x == 13) {
      subTabla = [];
      subQuery = true;
      isComp = false;
    }
    if (x == 53) {
      subQuery = false;
    }
  },
  ambiwo(token) {
    if (!subQuery) {
      let index = tables.findIndex((t) => {
        return t.name === token.value.toUpperCase();
      });
      for (let i = 0; i < attrib.length; i++) {
        if (this.findAttrib(index, attrib[i].value.toUpperCase()) !== null) {
          if (!aux.includes(token.value.toUpperCase()))
            aux.push(token.value.toUpperCase());
          else
            return {
              id: 3,
              value: `El nombre del atributo ${attrib[i - 1].value} es ambigüo`,
              line: attrib[i].line,
              code: 312,
              type: 3,
            };
        }
      }
    }
    return null;
  },
  init() {
    subQuery = false;
    isComp = false;
  },
  table(token) {
    if (tables.find((t) => t.name === token.value.toUpperCase())) {
      !subQuery ? tablas.push(token) : subTabla.push(token);
      return this.ambiwo(token);
    } else {
      return {
        id: 3,
        value: `El nombre de la tabla ${token.value} no es válido`,
        line: token.line,
        code: 314,
        type: 3,
      };
    }
  },
  tableAttribute(token) {
    let table = dmlTokens[dmlTokens.indexOf(token) - 2];
    let tableName = table.value.toUpperCase();
    if (aliasList.length > 0) {
      tableName = aliasList.find((alias) => {
        return alias.alias === table.value.toUpperCase();
      });
      typeof tableName !== "undefined" && (tableName = tableName.table);
    }
    let cons = tables.find((t) => {
      return t.name === tableName;
    });
    if (cons) {
      let index = tables.findIndex((t) => t.name == tableName);
      if (this.findAttrib(index, token.value.toUpperCase()) !== null) {
        return null;
      }
      return {
        id: 3,
        value: `El nombre del atributo ${token.value} no es válido`,
        line: token.line,
        code: 311,
        type: 3,
      };
    } else {
      return {
        id: 3,
        value: `El identificador ${token.value} no es válido`,
        line: token.line,
        code: 315,
        type: 3,
      };
    }
  },
  alias(token) {
    let tabla = dmlTokens[dmlTokens.indexOf(token) - 1];
    aliasList.push({
      alias: token.value,
      table: tabla.value,
    });
  },
  semanticAnalyze(x, token, tokens) {
    dmlTokens = tokens;
    const result = this.fillTables(scanner.scan(createTables).tokens);
    tables = result.tables;
    attributes = result.attributes;
    restrictions = result.restrictions;
    if (x == 700) {
      return this.attrib(token);
    } else if (x == 701) {
      return this.table(token);
    } else if (x == 702) {
      this.alias(token);
      return null;
    } else if (x == 703) {
      return this.tableAttribute(token);
    } else if (x == 704) {
      return this.compararTipos(token);
    } else {
      return null;
    }
  },
  compararTipos(token) {
    let isRight = tables.find((t) => {
      return t.name === dmlTokens[dmlTokens.indexOf(token) + 1].value;
    });
    let table = dmlTokens[dmlTokens.indexOf(token) + 1];
    let right = tables.find((t) => {
      return t.name === table.value;
    })
      ? dmlTokens[dmlTokens.indexOf(token) + 3]
      : table;
    let left = dmlTokens[dmlTokens.indexOf(token) - 1];
    let leftTable = null;
    if (!subQuery) {
      leftTable =
        tablas.length < 2 ? tablas[0] : dmlTokens[dmlTokens.indexOf(token) - 3];
    } else {
      leftTable =
        subTabla.length < 2
          ? subTabla[0]
          : dmlTokens[dmlTokens.indexOf(token) - 3];
    }
    let leftType = this.getDataType(leftTable, left);
    let rightType = null;
    if (isRight) {
      rightType = this.getDataType(
        dmlTokens[dmlTokens.indexOf(token) + 1],
        right
      );
      if (rightType === null) return null;
    } else {
      if (right.code === 54) {
        rightType = "CHAR";
      } else if (right.code === 61) {
        rightType = "INT";
      } else {
        return null;
      }
    }
    if (leftType !== rightType && leftType !== null && rightType !== null) {
      return {
        id: 3,
        value: `Error de conversión al convertir el valor del atributo ${left.value} de tipo ${leftType} a ${rightType}`,
        line: token.line,
        code: 313,
        type: 3,
      };
    }
    return null;
  },
  getDataType(table, token) {
    let tableIndx = tables.findIndex((t) => {
      return t.name == table.value;
    });
    let tokenIndex = this.findAttrib(tableIndx, token.value.toUpperCase());
    if (tokenIndex !== null) {
      let type;
      attributes[tokenIndex].type === "NUMERIC"
        ? (type = "INT")
        : (type = "CHAR");
      return type;
    }
    return null;
  },
  findAttrib(table, attrib) {
    let result = null;
    attributes.forEach((a) => {
      if (a.table_number == table) {
        if (a.name === attrib) {
          result = attributes.indexOf(a);
        }
      }
    });
    return result;
  },
};

class Table {
  constructor(name, attributes, restrictions) {
    this.name = name;
    this.attributes = attributes;
    this.restrictions = restrictions;
  }
}
class Attribute {
  constructor(tableNumber, name, type, length, notNull) {
    this.table_number = tableNumber;
    this.name = name;
    this.type = type;
    this.length = length;
    this.not_null = notNull;
  }
}
class Restriction {
  constructor(tableNumber, type, name, associatedAttribute, table, attribute) {
    this.table_number = tableNumber;
    this.type = type;
    this.name = name;
    this.associated_attribute = associatedAttribute;
    this.table = table;
    this.attribute = attribute;
  }
}
