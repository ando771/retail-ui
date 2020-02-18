import React from 'react';
import PropTypes from 'prop-types';

import { tabListener } from '../../lib/events/tabListener';
import { cx } from '../../lib/theming/Emotion';
import { ThemeContext } from '../ThemeContext';

import styles from './Toggle.module.less';
import { jsStyles } from './Toggle.styles';

export interface ToggleProps {
  checked?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
  onValueChange?: (value: boolean) => void;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  warning?: boolean;
  error?: boolean;
  loading?: boolean;
  autoFocus?: boolean;
  onFocus?: React.FocusEventHandler<HTMLInputElement>;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  color?: React.CSSProperties['color'];
}

export interface ToggleState {
  checked?: boolean;
  focusByTab?: boolean;
}

export class Toggle extends React.Component<ToggleProps, ToggleState> {
  public static __KONTUR_REACT_UI__ = 'Toggle';

  public static propTypes = {
    checked: PropTypes.bool,
    defaultChecked: PropTypes.bool,
    disabled: PropTypes.bool,
    error: PropTypes.bool,
    loading: PropTypes.bool,
    warning: PropTypes.bool,
    onValueChange: PropTypes.func,
  };

  public static defaultProps = {
    disabled: false,
    loading: false,
  };

  public static contextType = ThemeContext;
  public context!: React.ContextType<typeof ThemeContext>;

  private inputEL = React.createRef<HTMLInputElement>();

  constructor(props: ToggleProps) {
    super(props);

    this.state = {
      focusByTab: false,
      checked: props.defaultChecked,
    };
  }

  public componentDidMount() {
    if (this.props.autoFocus) {
      tabListener.isTabPressed = true;
      this.focus();
    }
  }

  /**
   * @public
   */
  public focus = () => {
    if (this.inputEL.current) {
      tabListener.isTabPressed = true;
      this.inputEL.current.focus();
    }
  };

  public render() {
    const { warning, error, loading, color } = this.props;
    const theme = this.context;
    const disabled = this.props.disabled || loading;
    const checked = this.isUncontrolled() ? this.state.checked : this.props.checked;

    const containerClassNames = cx(styles.container, jsStyles.container(theme), {
      [styles.isLoading]: !!loading,
      [jsStyles.focused(theme)]: !disabled && !!this.state.focusByTab,
      [jsStyles.isLoading(theme)]: !!loading,
      [jsStyles.isWarning(theme)]: !color && !!warning,
      [jsStyles.isError(theme)]: !color && !!error,
    });

    return (
      <label
        className={cx(styles.wrapper, jsStyles.wrapper(theme), {
          [styles.isDisabled]: !!disabled,
        })}
      >
        <input
          type="checkbox"
          checked={checked}
          onChange={this.handleChange}
          className={styles.input}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
          ref={this.inputEL}
          disabled={disabled}
        />
        <div
          className={containerClassNames}
          style={
            checked && color
              ? {
                  backgroundColor: color,
                  borderColor: color,
                }
              : undefined
          }
        >
          <div
            className={cx(styles.activeBackground, jsStyles.activeBackground(theme))}
            style={checked && color ? { backgroundColor: color } : undefined}
          />
        </div>
        <div className={cx(styles.handle, jsStyles.handle(theme))} />
      </label>
    );
  }

  private handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.props.onValueChange?.(event.target.checked);

    if (this.isUncontrolled()) {
      this.setState({
        checked: event.target.checked,
      });
    }

    this.props.onChange?.(event);
  };

  private handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    this.props.onFocus?.(event);

    if (tabListener.isTabPressed) {
      this.setState({ focusByTab: true });
    }
  };

  private handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    this.props.onBlur?.(event);
    this.setState({
      focusByTab: false,
    });
  };

  private isUncontrolled() {
    return this.props.checked === undefined;
  }
}
