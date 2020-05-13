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
              : this.findAttrib(index, tokens[tokens.indexOf(token) + 5].value),
            index,
            type === 1 ? "-" : index
          )
        );
      }
      if (token.code == 26) {
        index = tables.findIndex((t) => t.name == token.value.toUpperCase());
        restrictions[index].table_number = index;
        restrictions[index].attribute = this.findAttrib(
          index,
          tokens[tokens.indexOf(token) + 3].value
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
      if (attributes.find((a) => a.name === token.value.toUpperCase())) {
        attrib.push(token);
        return null;
      } else {
        console.log("atributo no compa");
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
    let index = table.findIndex((t) => t.value == token.value);
    if (this.findAttrib(index, token.value)) {
      return null;
    }
    console.log("atrib in teibol dans");
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
      let index = tables.findIndex((t) => t.name == token.value);
      for (let i = 0; i < attrib.length; i++) {
        if (this.findAttrib(index, attrib[i].value.toUpperCase()) !== null) {
          if (!aux.includes(token.value.toUpperCase()))
            aux.push(token.value.toUpperCase());
          else
            return {
              id: 3,
              value: `El nombre del atributo ${attrib[i].value} es ambigüo`,
              line: attrib[i].line,
              code: 312,
              type: 3,
            };
        }
      }
    }
  },
  table(token) {
    if (tables.find((t) => t.name === token.value.toUpperCase())) {
      subQuery ? tablas.push(token) : subTabla.push(token);
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
    let tableName = aliasList.find((alias) => alias == table.value);
    if (tables.find((t) => t.name == token.value.toUpperCase())) {
      let index = tables.findIndex(
        (t) => t.name == tableName.value.toUpperCase()
      );
      if (this.findAttrib(index, token.value.toUpperCase())) {
        return null;
      }
      console.log("tabla atributo");
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
    this.defType(x);
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
    console.log("tipos: ", token);
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
