import { IFilter, IMatchData } from '../app/interfaces/IFilters';

const filterData = (filters: IFilter[]): IMatchData => {
  const filterMongo: IMatchData = {};
  filters.forEach(filter => {
    const { field, value, regex } = filter;
    if (value) {
      filterMongo[field] = regex;
    }
  });

  return filterMongo;
};

export default filterData;
