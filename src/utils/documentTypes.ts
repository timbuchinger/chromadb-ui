export type MetadataType = 'string' | 'integer' | 'float' | 'boolean';

export interface MetadataPair {
  key: string;
  value: string;
  type: MetadataType;
}

export const getTypeDescription = (type: MetadataType): string => {
  switch (type) {
    case 'string':
      return 'Text value (e.g., "hello")'
    case 'integer':
      return 'Whole number (e.g., 42)'
    case 'float':
      return 'Decimal number (e.g., 3.14)'
    case 'boolean':
      return 'True or false value'
    default:
      return ''
  }
}

export const getTypePlaceholder = (type: MetadataType): string => {
  switch (type) {
    case 'string':
      return 'Enter text value'
    case 'integer':
      return 'Enter whole number'
    case 'float':
      return 'Enter decimal number'
    case 'boolean':
      return 'Select true or false'
    default:
      return 'Enter value'
  }
}

export const isValidValue = (pair: MetadataPair): boolean => {
  if (!pair.value.trim()) return false;

  switch (pair.type) {
    case 'string':
      return true;
    case 'integer':
      return !isNaN(parseInt(pair.value)) && Number.isInteger(parseFloat(pair.value));
    case 'float':
      return !isNaN(parseFloat(pair.value));
    case 'boolean':
      return pair.value === 'true' || pair.value === 'false';
    default:
      return false;
  }
}

export const parseMetadataValue = (pair: MetadataPair): any => {
  const value = pair.value.trim();
  switch (pair.type) {
    case 'integer':
      return parseInt(value);
    case 'float':
      return parseFloat(value);
    case 'boolean':
      return value === 'true';
    default:
      return value;
  }
}
