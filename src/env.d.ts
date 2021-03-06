/// <reference types="vite/client" />

declare module '*.vue' {
  import { DefineComponent } from 'vue'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<any, {}, any>
  export default component
}

interface ImportMetaEnv extends Readonly<Record<string, string>> {
  // Only string type here to avoid hard to debug cast problems in your components!
  readonly VITE_APP_VERSION: string
  readonly VITE_APP_BUILD_EPOCH?: string
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module 'click-outside-vue3';

/**
 * Makes all properties in T optional, excluding the ones you define in the type K.
 */
type PartialBy<T, K extends keyof T> = Partial<T> & Required<Pick<T, K>>

/**
 * Modifies some values of a type. E.g. `Modify<{ a: number, b: number }, { a: string }>`.
 */
type Modify<T, R> = Omit<T, keyof R> & R;
