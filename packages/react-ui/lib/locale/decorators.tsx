import React from 'react';

import { defaultLangCode } from './constants';
import { LocaleContext, LocaleContextProps } from './LocaleContext';
import { LocaleHelper } from './LocaleHelper';
import { LangCodes, LocaleControls } from './types';

export function locale<C>(controlName: keyof LocaleControls, localeHelper: LocaleHelper<C>) {
  return <T extends new (...args: any[]) => React.Component>(constructor: T) => {
    const LocaleDecorator = class extends constructor {
      public localeContext?: LocaleContextProps;
      public controlName: keyof LocaleControls = controlName;
      public localeHelper: LocaleHelper<C> = localeHelper;


      public render() {
        return (
          <LocaleContext.Consumer>
            {localeContext => {
              this.localeContext = localeContext;
              return super.render();
            }}
          </LocaleContext.Consumer>
        );
      }

      public get locale(): C {
        if (this.localeContext === undefined) {
          return {} as C;
        }

        const localeFromContext = this.localeContext.locale?.[this.controlName];
        return Object.assign({}, this.localeHelper.get(this.localeContext.langCode), localeFromContext);
      }

      public set locale(l: C) {
        // TODO альтернативная транспиляция декораторов ломает тесты
      }

      public get langCode(): LangCodes {
        return this.localeContext?.langCode ?? defaultLangCode;
      }
    };
    Object.defineProperty(LocaleDecorator, 'name', { value: constructor.name });
    return LocaleDecorator;
  };
}
