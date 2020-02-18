import React from 'react';
import shallowEqual from 'shallowequal';

import { InternalDate } from '../../lib/date/InternalDate';
import { InternalDateGetter } from '../../lib/date/InternalDateGetter';
import { Calendar, CalendarDateShape } from '../Calendar';
import { locale } from '../Locale/decorators';
import { Nullable } from '../../typings/utility-types';
import { isGreater, isLess } from '../Calendar/CalendarDateShape';
import { cx } from '../../lib/theming/Emotion';
import { ThemeContext } from '../ThemeContext';

import { jsStyles } from './Picker.styles';
import { DatePickerLocale, DatePickerLocaleHelper } from './locale';
import styles from './Picker.module.less';

interface Props {
  maxDate?: CalendarDateShape;
  minDate?: CalendarDateShape;
  value: Nullable<CalendarDateShape>;
  onPick: (date: CalendarDateShape) => void;
  onSelect?: (date: CalendarDateShape) => void;
  enableTodayLink?: boolean;
  isHoliday?: (day: CalendarDateShape & { isWeekend: boolean }) => boolean;
}

interface State {
  date: CalendarDateShape;
  today: CalendarDateShape;
}

const getTodayCalendarDate = () => {
  const d = new Date();
  return {
    date: d.getDate(),
    month: d.getMonth(),
    year: d.getFullYear(),
  };
};

@locale('DatePicker', DatePickerLocaleHelper)
export class Picker extends React.Component<Props, State> {
  public static __KONTUR_REACT_UI__ = 'Picker';

  public static contextType = ThemeContext;
  public context!: React.ContextType<typeof ThemeContext>;

  private calendar: Calendar | null = null;
  private readonly locale!: DatePickerLocale;

  constructor(props: Props) {
    super(props);
    const today = getTodayCalendarDate();
    this.state = {
      date: this.getInitialDate(today),
      today,
    };
  }

  public componentDidUpdate(prevProps: Props) {
    const { value } = this.props;
    if (value && !shallowEqual(value, prevProps.value)) {
      this.scrollToMonth(value.month, value.year);
    }
  }

  public render() {
    const theme = this.context;
    const { date } = this.state;

    return (
      <div className={cx(styles.root, jsStyles.root(theme))} onMouseDown={e => e.preventDefault()}>
        <Calendar
          ref={c => (this.calendar = c)}
          value={this.props.value}
          initialMonth={date.month}
          initialYear={date.year}
          onSelect={this.props.onPick}
          minDate={this.props.minDate}
          maxDate={this.props.maxDate}
          isHoliday={this.props.isHoliday}
        />
        {this.props.enableTodayLink && this.renderTodayLink()}
      </div>
    );
  }

  private scrollToMonth = (month: number, year: number) => {
    this.calendar?.scrollToMonth(month, year);
  };

  private renderTodayLink() {
    const theme = this.context;
    const { order, separator } = this.locale;
    const today = new InternalDate({ order, separator }).setComponents(InternalDateGetter.getTodayComponents());
    return (
      <button
        className={cx(styles.todayWrapper, jsStyles.todayWrapper(theme))}
        onClick={this.handleSelectToday(today)}
        tabIndex={-1}
      >
        {`${this.locale.today} ${today.toString({ withPad: true, withSeparator: true })}`}
      </button>
    );
  }

  private handleSelectToday = (today: InternalDate) => () => {
    this.props.onSelect?.(today.toNativeFormat()!);
    if (this.calendar) {
      const { month, year } = this.state.today;
      this.calendar.scrollToMonth(month, year);
    }
  };

  private getInitialDate = (today: CalendarDateShape) => {
    if (this.props.value) {
      return this.props.value;
    }

    if (this.props.minDate && isLess(today, this.props.minDate)) {
      return this.props.minDate;
    }

    if (this.props.maxDate && isGreater(today, this.props.maxDate)) {
      return this.props.maxDate;
    }

    return today;
  };
}
