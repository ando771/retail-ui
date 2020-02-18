import React from 'react';

import { ThemeFactory } from '../../lib/theming/ThemeFactory';

export const ThemeContext = React.createContext(ThemeFactory.getDefaultTheme());
