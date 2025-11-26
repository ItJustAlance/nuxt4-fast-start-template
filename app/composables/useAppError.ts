export const useAppError = (statusCode: number) => {
  const throwFatal = (statusCode: number, message: string, fatal: boolean) => {
    throw createError({ statusCode, message, fatal });
  };

  switch (statusCode) {
    case 404: {
      return throwFatal(404, 'Page not found', true);
    }
    case 500: {
      return throwFatal(500, '', true);
    }
  }
};
