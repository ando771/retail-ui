import React, { ReactNode, useContext } from 'react';

import { cx } from '../../lib/theming/Emotion';
import { ThemeContext } from '../ThemeContext';

import { jsStyles } from './MenuHeader.styles';
import styles from './MenuHeader.module.less';

export interface MenuHeaderProps {
  _enableIconPadding?: boolean;
  children: ReactNode;
}

/**
 * Заголовок в меню.
 */
function MenuHeader({ _enableIconPadding = false, children}: MenuHeaderProps) {
  const theme = useContext(ThemeContext);

  const classnames: string = cx({
    [styles.root]: true,
    [jsStyles.withLeftPadding(theme)]: _enableIconPadding,
  });

  return <div className={classnames}>{children}</div>;
}

MenuHeader.__KONTUR_REACT_UI__ = 'MenuHeader';
MenuHeader.__MENU_HEADER__ = true;

export { MenuHeader };

// TODO это какая-то фигата
export const isMenuHeader = (child: React.ReactNode): child is React.ReactElement<MenuHeaderProps> => {
  return React.isValidElement<MenuHeaderProps>(child) ? child.type.hasOwnProperty('__MENU_HEADER__') : false;
};
