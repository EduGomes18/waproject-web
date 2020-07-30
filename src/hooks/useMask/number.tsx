import { IMaskFunction } from '.';

const number: IMaskFunction = {
  apply: (value: number | string) => {
    if (value === null || value === undefined || value === '') return '';
    return new Intl.NumberFormat('pt-BR').format(Number(value) || 0);
  },
  clean: value => {
    if (value === null || value === undefined || value === '') return '';

    return parseInt(value);
  }
};

export default number;
