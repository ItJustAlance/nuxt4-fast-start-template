import { getProfile } from '#server/models/profile';

export default defineEventHandler(async () => {
  const fakeProfile = await getProfile();
  return fakeProfile;
});
