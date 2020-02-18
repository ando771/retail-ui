import React from 'react';

import { CHAR_MASK } from '../../lib/date/constants';
import { InternalDateValidator } from '../../lib/date/InternalDateValidator';
import { InternalDateComponentType, InternalDateFragment } from '../../lib/date/types';
import { cx } from '../../lib/theming/Emotion';
import { ThemeContext } from '../ThemeContext';

import { jsStyles } from './DateFragmentsView.styles';

interface DateFragmentViewProps {
  selected: InternalDateComponentType | null;
  fragments: InternalDateFragment[];
  inputMode: boolean;
  onSelectDateComponent: (type: InternalDateComponentType, e: React.MouseEvent<HTMLSpanElement>) => void;
}

export class DateFragmentsView extends React.Component<DateFragmentViewProps, {}> {
  public static contextType = ThemeContext;
  public context!: React.ContextType<typeof ThemeContext>;

  private rootNodeEl = React.createRef<HTMLSpanElement>();

  public isFragment = (el: HTMLElement | EventTarget): boolean => {
    if (this.rootNodeEl.current) {
      // NOTE: NodeList doesn't support method 'forEach' in IE11
      const fragments: HTMLSpanElement[] = Array.from(this.rootNodeEl.current.querySelectorAll('[data-fragment]'));
      return fragments.some(fragment => fragment === el || fragment.contains(el as HTMLSpanElement));
    }
    return false;
  };

  public getRootNode = () => this.rootNodeEl.current;

  public render() {
    const theme = this.context;
    return (
      <span ref={this.rootNodeEl} className={jsStyles.root(theme)}>
        {this.props.fragments.map((fragment, index) =>
          fragment.type === InternalDateComponentType.Separator
            ? this.renderSeparator(fragment, index)
            : this.renderDateComponent(fragment, index),
        )}
      </span>
    );
  }

  private renderSeparator(fragment: InternalDateFragment, index: number): JSX.Element {
    const theme = this.context;
    const separatorClassName = cx(jsStyles.delimiter(theme), {
      [jsStyles.delimiterFilled(theme)]: this.props.fragments[index + 1].value !== null,
    });

    return (
      <span key={index} className={separatorClassName}>
        {fragment.value}
      </span>
    );
  }

  private renderDateComponent(fragment: InternalDateFragment, index: number): JSX.Element {
    const { inputMode, onSelectDateComponent, selected } = this.props;
    const theme = this.context;
    const { type, value, length, valueWithPad } = fragment;

    const valueMask = value === null || (selected === type && inputMode) ? value : valueWithPad || value;
    const lengthMask = InternalDateValidator.testParseToNumber(valueMask)
      ? Math.max(length - valueMask!.toString().length, 0)
      : length;

    const handleMouseUp = (e: React.MouseEvent<HTMLSpanElement>) => {
      if (document.activeElement && document.activeElement.contains(e.currentTarget)) {
        onSelectDateComponent(type, e);
      }
    };

    return (
      <span key={index} data-fragment="" onMouseUp={handleMouseUp}>
        {valueMask}
        <span className={jsStyles.mask(theme)}>{CHAR_MASK.repeat(lengthMask)}</span>
      </span>
    );
  }
}
