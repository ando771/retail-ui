import warning from 'warning';
import React, { ReactNode } from 'react';

import { defaultLangCode } from '../../lib/locale/constants';
import { LangCodes, LocaleControls } from '../../lib/locale/types';
import { LocaleContext } from '../../lib/locale';

export interface LocaleProviderProps {
  locale?: LocaleControls;
  langCode: LangCodes;
  children?: ReactNode;
}

export class LocaleProvider extends React.Component<LocaleProviderProps> {
  public static __KONTUR_REACT_UI__ = 'LocaleProvider';

  public static defaultProps = {
    locale: {},
    langCode: defaultLangCode,
  };

  componentDidMount(): void {
    warning(true, "LocaleProvider was deprecated please use 'LocaleContext' instead");
  }

  public render() {
    const { locale, langCode } = this.props;
    return <LocaleContext.Provider value={{ locale, langCode }}>{this.props.children}</LocaleContext.Provider>;
  }
}
