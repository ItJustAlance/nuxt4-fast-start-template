import { getFilters } from '#server/models/filters';

export default defineEventHandler(async () => {
  const fakeFilters = await getFilters();
  return { data: fakeFilters, status: 'success' };
});
