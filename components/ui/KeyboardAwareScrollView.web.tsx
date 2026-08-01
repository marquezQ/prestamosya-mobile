import React from 'react';
import { ScrollView, type ScrollViewProps } from 'react-native';

export type KeyboardAwareScrollViewProps = ScrollViewProps & {
  bottomOffset?: number;
  disableScrollOnKeyboardHide?: boolean;
  enabled?: boolean;
  extraKeyboardSpace?: number;
};

export function KeyboardAwareScrollView(props: KeyboardAwareScrollViewProps) {
  return <ScrollView {...props} />;
}
