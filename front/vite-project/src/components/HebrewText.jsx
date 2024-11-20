import React from 'react';
import { Text } from '@react-pdf/renderer';

//import React from 'react';

export const HebrewText = ({ children }) => {
  return <span style={{ fontFamily: 'Assistant' }}>{children}</span>;
};
