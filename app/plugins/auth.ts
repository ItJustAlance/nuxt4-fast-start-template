export default defineNuxtPlugin(async (nuxtApp) => {
  // первое открытие страницы - проверяем куки, нет ли уже авторизации
  const { me } = useAuth();
  const user = await me();
  const ssrUser = useState('ssr-user', () => user.value);
});
