import type { Locale } from './config'

const dictionaries = {
  en: () => import('./dictionaries/en.json').then((module) => module.default),
  fr: () => import('./dictionaries/fr.json').then((module) => module.default),
  es: () => import('./dictionaries/es.json').then((module) => module.default),
  de: () => import('./dictionaries/de.json').then((module) => module.default),
  it: () => import('./dictionaries/it.json').then((module) => module.default),
}

export type Dictionary = Awaited<ReturnType<typeof dictionaries.en>>

export const getDictionary = async (locale: Locale): Promise<Dictionary> => {
  return dictionaries[locale]()
}
