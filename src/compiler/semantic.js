let tables = [],
  attributes = [],
  restrictions = [];
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
    });
    return {
      tables: tables,
      attributes: attributes,
      restrictions: restrictions,
    };
  },
  findAttrib(table, attrib) {
    let result = -1;
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
