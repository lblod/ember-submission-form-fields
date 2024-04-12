import { NamedNode } from 'rdflib';

export function valueToType(value, returnType) {
  if (returnType == 'string') {
    return `${value}`;
  }

  if (returnType == 'boolean') {
    if (typeof value == 'string') {
      return value == '1';
    }
    if (typeof value == 'boolean') {
      return value;
    }

    return false;
  }

  if (returnType == 'node') {
    return new NamedNode(`${value}`);
  }

  return value;
}
