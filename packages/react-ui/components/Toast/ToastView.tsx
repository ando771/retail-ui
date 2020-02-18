import React from 'react';

import { CrossIcon } from '../internal/icons/CrossIcon';
import { ZIndex } from '../ZIndex';
import { cx } from '../../lib/theming/Emotion';
import { ThemeContext } from '../ThemeContext';

import { jsStyles } from './ToastView.styles';
import styles from './ToastView.module.less';

export interface ToastViewProps {
  /**
   * Toast content
   */
  children?: string;
  /**
   * Adds action handling and close icon for toast
   */
  action?: {
    label: string;
    handler: () => void;
  } | null;
  onClose?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export class ToastView extends React.Component<ToastViewProps> {
  public static contextType = ThemeContext;
  public context!: React.ContextType<typeof ThemeContext>;

  public render() {
    const { children, action, onClose, ...rest } = this.props;
    const theme = this.context;

    const link = action ? (
      <span className={cx(styles.link, jsStyles.link(theme))} onClick={action.handler}>
      {action.label}
    </span>
    ) : null;

    const close = action ? (
      <span className={styles.closeWrapper}>
      <span className={cx(styles.close, jsStyles.close(theme))} onClick={onClose}>
        <CrossIcon/>
      </span>
    </span>
    ) : null;

    return (
      <ZIndex priority="Toast" className={styles.wrapper}>
        <div className={cx(styles.root, jsStyles.root(theme))} {...rest}>
          <span>{children}</span>
          {link}
          {close}
        </div>
      </ZIndex>
    );
  }
}
