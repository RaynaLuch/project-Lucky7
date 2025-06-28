const parseNumber = (value, defaultValue) => {
  if (typeof value === 'undefined') return defaultValue;

  const parsedNumber = parseInt(value);
  if (Number.isNaN(parsedNumber) === true) {
    return defaultValue;
  }
  return parsedNumber;
};

export const parsePaginationParams = (query) => {
  const {
    page,
    perPage,
    totalItems,
    totalPages,
    hasNextPage,
    hasPreviousPage,
  } = query;

  const parsedPage = parseNumber(page, 1);
  const parsedPerPage = parseNumber(perPage, 12);

  return {
    page: parsedPage,
    perPage: parsedPerPage,
    totalItems,
    totalPages,
    hasNextPage,
    hasPreviousPage,
  };
};
