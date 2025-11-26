export const useAdmin = () => {
  const authUser = useAuthUser();
  //console.log('authUser', authUser)
  return computed(() => {
    if (!authUser.value) return false;
    // if (!authUser.value) return true;

    return authUser.value.roles.includes('ADMIN');
    // return 'ADMIN';
  });
};
