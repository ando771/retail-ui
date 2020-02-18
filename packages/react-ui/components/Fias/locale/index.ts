import { LangCodes } from '../../Locale';
import { LocaleHelper } from '../../Locale/LocaleHelper';

import  { componentsLocales as ru_RU } from './locales/ru';
import { FiasLocale } from './types';

export * from './types';

export const FiasLocaleHelper = new LocaleHelper<FiasLocale>({ ru_RU }, LangCodes.ru_RU);
