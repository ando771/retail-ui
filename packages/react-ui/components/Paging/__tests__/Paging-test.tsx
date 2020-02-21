import { mount, ReactWrapper } from 'enzyme';
import React from 'react';

import { emptyHandler } from '../../../lib/utils';
import { defaultLangCode } from '../../../lib/locale/constants';
import { LangCodes, LocaleContext } from '../../../lib/locale';
import { PagingLocaleHelper } from '../locale';
import { Paging } from '../Paging';
import PagingStyles from '../Paging.less';

describe('Pager', () => {
  it('renders', () => {
    mount(<Paging pagesCount={5} activePage={1} onPageChange={emptyHandler} />);
  });

  it('renders links', () => {
    const wrapper = mount(<Paging pagesCount={5} activePage={1} onPageChange={emptyHandler} />);
    expect(wrapper.find(`span.${PagingStyles.pageLink}`)).toHaveLength(5);
  });

  it('renders right dots', () => {
    const wrapper = mount(<Paging pagesCount={10} activePage={1} onPageChange={emptyHandler} />);
    expect(wrapper.find(`span.${PagingStyles.dots}`)).toHaveLength(1);
  });

  it('renders left dots', () => {
    const wrapper = mount(<Paging pagesCount={10} activePage={9} onPageChange={emptyHandler} />);
    expect(wrapper.find(`span.${PagingStyles.dots}`)).toHaveLength(1);
  });

  it('renders left and right dots', () => {
    const wrapper = mount(<Paging pagesCount={12} activePage={6} onPageChange={emptyHandler} />);
    expect(wrapper.find(`span.${PagingStyles.dots}`)).toHaveLength(2);
  });

  it('calls onPageChange', () => {
    const onPageChange = jest.fn();
    const wrapper = mount(<Paging pagesCount={2} activePage={1} onPageChange={onPageChange} />);

    wrapper
      .find(`span.${PagingStyles.pageLink}`)
      .at(1)
      .simulate('click');
    expect(onPageChange).toHaveBeenCalled();
  });

  it('calls onPageChange with right args', () => {
    const onPageChange = jest.fn();
    const wrapper = mount(<Paging pagesCount={2} activePage={1} onPageChange={onPageChange} />);
    wrapper
      .find(`span.${PagingStyles.pageLink}`)
      .at(1)
      .simulate('click');
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it('has forward button', () => {
    const wrapper = mount(<Paging pagesCount={2} activePage={1} onPageChange={emptyHandler} />);
    expect(wrapper.find(`span.${PagingStyles.forwardLink}`)).toHaveLength(1);
  });

  it('calls onPageChange when clicked on forward button', () => {
    const onPageChange = jest.fn();
    const wrapper = mount(<Paging pagesCount={2} activePage={1} onPageChange={onPageChange} />);
    wrapper
      .find(`span.${PagingStyles.forwardLink}`)
      .at(0)
      .simulate('click');
    expect(onPageChange).toHaveBeenCalled();
  });

  it('calls onPageChange on forward button with right args', () => {
    const onPageChange = jest.fn();
    const wrapper = mount(<Paging pagesCount={2} activePage={1} onPageChange={onPageChange} />);
    wrapper
      .find(`span.${PagingStyles.forwardLink}`)
      .at(0)
      .simulate('click');
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it('handles enter key', () => {
    const onPageChange = jest.fn();
    const wrapper = mount(<Paging pagesCount={2} activePage={1} onPageChange={onPageChange} />);
    wrapper.setState({ focusedByTab: true, focusedItem: 2 });
    const root = wrapper.find(`.${PagingStyles.paging}`);
    root.simulate('keydown', { key: 'Enter' });
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it('handles right key', () => {
    const onPageChange = jest.fn();
    const wrapper = mount(<Paging pagesCount={2} activePage={1} onPageChange={onPageChange} />);
    const root = wrapper.find(`span.${PagingStyles.paging}`);
    root.simulate('keydown', { key: 'ArrowRight' });
    root.simulate('keydown', { key: 'Enter' });
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it('handles ctrl + right keys', () => {
    const onPageChange = jest.fn();
    const wrapper = mount(<Paging pagesCount={2} activePage={1} onPageChange={onPageChange} />);
    const root = wrapper.find(`span.${PagingStyles.paging}`);
    root.simulate('keydown', { key: 'ArrowRight', ctrlKey: true });
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it('handles left key', () => {
    const onPageChange = jest.fn();
    const wrapper = mount(<Paging pagesCount={2} activePage={2} onPageChange={onPageChange} />);
    const root = wrapper.find(`span.${PagingStyles.paging}`);
    root.simulate('keydown', { key: 'ArrowLeft' });
    root.simulate('keydown', { key: 'Enter' });
    expect(onPageChange).toHaveBeenCalledWith(1);
  });

  it('handles ctrl + left keys', () => {
    const onPageChange = jest.fn();
    const wrapper = mount(<Paging pagesCount={2} activePage={2} onPageChange={onPageChange} />);
    const root = wrapper.find(`span.${PagingStyles.paging}`);
    root.simulate('keydown', { key: 'ArrowLeft', ctrlKey: true });
    expect(onPageChange).toHaveBeenCalledWith(1);
  });

  it('keyboard control available with global listener', () => {
    const onPageChange = jest.fn();
    const wrapper = mount<Paging>(
      <Paging useGlobalListener pagesCount={2} activePage={2} onPageChange={onPageChange} />,
    );

    expect(wrapper.state('keyboardControl')).toBe(true);
  });

  it('keyboard control available with focus', () => {
    const onPageChange = jest.fn();
    const wrapper = mount<Paging>(<Paging pagesCount={2} activePage={2} onPageChange={onPageChange} />);

    expect(wrapper.state('keyboardControl')).toBe(false);

    wrapper.simulate('focus');

    expect(wrapper.state('keyboardControl')).toBe(true);
  });

  describe('Locale', () => {
    let wrapper: ReactWrapper;
    const getForwardText = () => wrapper.find(`span.${PagingStyles.forwardLink}`).text();
    const PagingContext = () => <Paging pagesCount={5} activePage={1} onPageChange={emptyHandler} />;

    it('render without LocaleProvider', () => {
      wrapper = mount(PagingContext());
      const expectedText = PagingLocaleHelper.get(defaultLangCode).forward;

      expect(getForwardText()).toBe(expectedText);
    });

    it('render default locale', () => {
      wrapper = mount(<LocaleContext.Provider value={{}}>{PagingContext()}</LocaleContext.Provider>);
      const expectedText = PagingLocaleHelper.get(defaultLangCode).forward;

      expect(getForwardText()).toBe(expectedText);
    });

    it('render default locale', () => {
      wrapper = mount(<LocaleContext.Provider value={{ langCode: LangCodes.en_GB }}>{PagingContext()}</LocaleContext.Provider>);
      const expectedText = PagingLocaleHelper.get(LangCodes.en_GB).forward;

      expect(getForwardText()).toBe(expectedText);
    });

    it('render custom locale', () => {
      const customPlaceholder = 'custom forward';
      wrapper = mount(
        <LocaleContext.Provider value={{
          locale:{  Paging: { forward: customPlaceholder } }
        }}>{PagingContext()}</LocaleContext.Provider>,
      );

      expect(getForwardText()).toBe(customPlaceholder);
    });

    it('updates when langCode changes', () => {
      wrapper = mount(<LocaleContext.Provider value={{ langCode: LangCodes.en_GB }}>{PagingContext()}</LocaleContext.Provider>);
      const expectedText = PagingLocaleHelper.get(LangCodes.ru_RU).forward;

      wrapper.setProps({ value: { langCode: LangCodes.ru_RU }});

      expect(getForwardText()).toBe(expectedText);
    });
  });
});
