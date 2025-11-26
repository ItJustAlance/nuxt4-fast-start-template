declare module '@nuxt/schema' {
  // interface RuntimeConfig {
  //   cookieTokenName: string;
  //   public: {
  //     apiUrl: string;
  //   };
  // }
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  middleName: string;
  snils: string | null;
  email: string | null;
  phone: string | null;
  avatar: string;
  token: string;
  permissions: string[];
  emailVerifiedAt: string | null;
  roles: string[];
  isRegistrationCompleted: boolean;
  orgDirId: number | null;
  orgDirUuid: string | null; // для запроса ЛК директоров списка работников
}

export interface Filter {
  title: string;
  name: string;
  queryParam?: string;
  sliderData?: boolean;
  filters: object;
}

export type FiltersList = Record<string, Filter[]>;

export type SelectedFiltersList = Record<string, []>;

// TODO: удалить и оставить TCourse (точнее, наоборот)
export interface Course {
  id: number;
  title: string;
  duration: string;
  price: string;
  format: string;
  date: string;
  startDate: string;
  code: string;
  url: string;
  isSignUp: boolean;
  isFavorite: boolean;
}

export interface EventItem {
  id: number;
  title: string;
  date: string;
  price: string;
  image: string;
  url: string;
  category: string;
  isSignUp: boolean;
  isFavorite: boolean;
}

export interface NewsCategory {
  id: number;
  name: string;
  slug: string;
}

export interface NewsItem {
  id: number;
  name: string;
  slug: string;
  cover: string;
  previewText: string;
  body: string;
  views: number;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
  categories: NewsCategory[];
  references?: Array<{
    name: string;
    url: string;
  }>;
}

export interface Application {
  id: number;
  name?: string;
  code?: string;
  status: {
    code: string;
    name: string;
  };
  course: Course;
}

export type TMenuItem = {
  id: number;
  enabled?: boolean;
  name?: string;
  title: string;
  iconName: string;
  link: string;
};

export type TMenuGroup = {
  groupCode: string;
  groupTitle: string;
  defaultLink: string;
  items: TMenuItem[];
};

export interface Notifications {
  /** временно пока не известны данные **/
  [key: string]: any;
}

export interface UserData {
  auth: User | null;
  applications: Application[];
  favoriteCourses: Set<number>;
  personalMenu: TMenuGroup[];
}
