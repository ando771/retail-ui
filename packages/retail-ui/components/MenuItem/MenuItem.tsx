import * as React from 'react';
import * as PropTypes from 'prop-types';
import warning from 'warning';
import { isFunction } from '../../lib/utils';
import styles from './MenuItem.less';
import { cx as classNames } from '../../lib/theming/Emotion';
import jsStyles from './MenuItem.styles';
import { ThemeConsumer } from '../internal/ThemeContext';
import { ITheme } from '../../lib/theming/Theme';
export type MenuItemState = null | 'hover' | 'selected' | void;
export type MenuItemElement = HTMLAnchorElement | HTMLSpanElement;

export interface MenuItemProps {
  /** @ignore */
  _enableIconPadding?: boolean;

  /** @ignore */
  alkoLink?: boolean;
  comment?: React.ReactNode;
  disabled?: boolean;
  icon?: React.ReactElement<any>;
  link?: boolean;

  /** @ignore */
  loose?: boolean;

  /** @ignore */
  state?: MenuItemState;
  onClick?: (event: React.SyntheticEvent<HTMLElement>) => void;
  children?: React.ReactNode | ((state: MenuItemState) => React.ReactNode);
  target?: React.AnchorHTMLAttributes<HTMLAnchorElement>['target'];
  title?: React.AnchorHTMLAttributes<HTMLAnchorElement>['title'];
  href?: React.AnchorHTMLAttributes<HTMLAnchorElement>['href'];
  onMouseEnter?: React.MouseEventHandler;
  onMouseLeave?: React.MouseEventHandler;

  component?: React.ComponentType<any>;
}

/**
 * Элемент меню.
 */
export default class MenuItem extends React.Component<MenuItemProps> {
  public static __MENU_ITEM__ = true;

  public static propTypes = {
    alkoLink: PropTypes.bool,

    comment: PropTypes.node,

    disabled: PropTypes.bool,

    href: PropTypes.string,

    icon: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),

    loose: PropTypes.bool,

    state: PropTypes.string,

    target: PropTypes.string,

    onClick: PropTypes.func,
  };

  private theme!: ITheme;

  public render() {
    return (
      <ThemeConsumer>
        {theme => {
          this.theme = theme;
          return this.renderMain();
        }}
      </ThemeConsumer>
    );
  }

  private renderMain() {
    const {
      alkoLink,
      link,
      comment,
      icon,
      loose,
      state,
      children,
      _enableIconPadding,
      component,
      ...rest
    } = this.props;

    warning(alkoLink === undefined, "[MenuItem]: Prop 'alkoLink' was deprecated please use 'link' instead");

    const hover = state === 'hover' && !this.props.disabled;

    let iconElement = null;
    if (icon) {
      iconElement = <div className={styles.icon}>{icon}</div>;
    }

    const className = classNames({
      [styles.root]: true,
      [styles.disabled]: !!this.props.disabled,
      [styles.loose]: !!loose,
      [jsStyles.hover(this.theme)]: hover,
      [jsStyles.selected(this.theme)]: state === 'selected',
      [jsStyles.link(this.theme)]: !!link || !!alkoLink,
      [jsStyles.withIcon(this.theme)]: Boolean(iconElement) || !!_enableIconPadding,
      [jsStyles.disabled(this.theme)]: !!this.props.disabled,
    });

    let content = children;
    if (isFunction(children)) {
      content = children(this.props.state);
    }

    const Component = this.getComponent();

    return (
      <Component {...rest} className={className} tabIndex={-1}>
        {iconElement}
        {content}
        {this.props.comment && (
          <div
            className={classNames({
              [styles.comment]: true,
              [styles.commentHover]: hover,
            })}
          >
            {comment}
          </div>
        )}
      </Component>
    );
  }

  private getComponent = () => {
    const { disabled, component, href } = this.props;

    if (disabled) {
      return 'button';
    }

    if (component) {
      return component;
    }

    if (href) {
      return 'a';
    }

    return 'button';
  };
}

export const isMenuItem = (child: React.ReactChild): child is React.ReactElement<MenuItemProps> => {
  return React.isValidElement<MenuItemProps>(child) ? child.type.hasOwnProperty('__MENU_ITEM__') : false;
};
