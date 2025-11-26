import { User } from '~/types/types';

declare module 'h3' {
  interface H3EventContext {
    user?: User;
  }
}

export {};
