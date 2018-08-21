import * as React from 'react';
import { storiesOf } from '@storybook/react';
import Spinner from '../Spinner';

storiesOf('Spinner', module)
  .addDecorator(story => (
    <div style={{ height: 150, width: 200, padding: 4 }}>{story()}</div>
  ))
  .add('Normal', () => <Spinner />)
  .add('Big', () => <Spinner type="big" />)
  .add('Mini', () => <Spinner type="mini" />)
  .add('Mini dimmed', () => <Spinner type="mini" dimmed />);
