import { mount, ReactWrapper } from 'enzyme';
import React from 'react';

import { LangCodes, LocaleContext } from '../../Locale';
import { defaultLangCode } from '../../Locale/constants';
import { LogotypeLocaleHelper } from '../locale';
import { Logotype } from '../Logotype';

describe('Logotype', () => {
  describe('Locale', () => {
    let wrapper: ReactWrapper;
    const getActual = () => ({
      actualPrefix: wrapper
        .find('span')
        .at(1)
        .text(),
      actualSuffix: wrapper
        .find('span')
        .at(3)
        .text(),
    });

    it('render without LocaleProvider', () => {
      wrapper = mount(<Logotype />);
      const { prefix, suffix } = LogotypeLocaleHelper.get(defaultLangCode);

      const { actualPrefix, actualSuffix } = getActual();
      expect(prefix).toBe(actualPrefix);
      expect(suffix).toBe(actualSuffix);
    });

    it('render default locale', () => {
      wrapper = mount(<Logotype />);
      const { prefix, suffix } = LogotypeLocaleHelper.get(defaultLangCode);

      const { actualPrefix, actualSuffix } = getActual();
      expect(prefix).toBe(actualPrefix);
      expect(suffix).toBe(actualSuffix);
    });

    it('render correct locale when set langCode', () => {
      wrapper = mount(
        <LocaleContext.Provider value={{ langCode: LangCodes.en_GB }}>
          <Logotype />
        </LocaleContext.Provider>,
      );
      const { prefix, suffix } = LogotypeLocaleHelper.get(LangCodes.en_GB);

      const { actualPrefix, actualSuffix } = getActual();
      expect(prefix).toBe(actualPrefix);
      expect(suffix).toBe(actualSuffix);
    });

    it('render custom locale', () => {
      const customPrefix = 'custom prefix';
      wrapper = mount(
        <LocaleContext.Provider
          value={{
            langCode: defaultLangCode,
            locale: { Logotype: { prefix: customPrefix } }
          }}
        >
          <Logotype />
        </LocaleContext.Provider>,
      );

      const actualPrefix = wrapper
        .find('span')
        .at(1)
        .text();
      expect(customPrefix).toBe(actualPrefix);
    });

    it('updates when langCode changes', () => {
      wrapper = mount(
        <LocaleContext.Provider value={{ langCode: defaultLangCode }}>
          <Logotype />
        </LocaleContext.Provider>,
      );
      const { prefix, suffix } = LogotypeLocaleHelper.get(LangCodes.en_GB);

      wrapper.setProps({ value: { langCode: LangCodes.en_GB }});

      const { actualPrefix, actualSuffix } = getActual();
      expect(prefix).toBe(actualPrefix);
      expect(suffix).toBe(actualSuffix);
    });
  });
});
