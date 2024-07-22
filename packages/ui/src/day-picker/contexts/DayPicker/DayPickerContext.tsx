import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';

import type { Locale } from 'date-fns';
import type { DayPickerProps } from '../../DayPicker';

import type { CaptionLayout } from '../../components/Caption';
import type { DayPickerBase, DaySelectionMode } from '../../types/DayPickerBase';
import { type DayPickerMultipleProps, isDayPickerMultiple } from '../../types/DayPickerMultiple';
import { type DayPickerRangeProps, isDayPickerRange } from '../../types/DayPickerRange';
import { type DayPickerSingleProps, isDayPickerSingle } from '../../types/DayPickerSingle';
import type { Formatters } from '../../types/Formatters';
import type { Labels } from '../../types/Labels';
import type { Matcher } from '../../types/Matchers';
import type { DayModifiers, ModifiersClassNames } from '../../types/Modifiers';
import type { ClassNames, Styles } from '../../types/Styles';

import { getDefaultContextValues } from './defaultContextValues';
import { parseFromToProps } from './utils';

/**
 * The value of the {@link DayPickerContext} extends the props from DayPicker
 * with default and cleaned up values.
 */
export interface DayPickerContextValue extends DayPickerBase {
  mode: DaySelectionMode;
  onSelect?:
    | DayPickerSingleProps['onSelect']
    | DayPickerMultipleProps['onSelect']
    | DayPickerRangeProps['onSelect'];
  required?: boolean;
  min?: number;
  max?: number;
  selected?: Matcher | Matcher[];

  captionLayout: CaptionLayout;
  classNames: Required<ClassNames>;
  formatters: Formatters;
  labels: Labels;
  locale: Locale;
  modifiersClassNames: ModifiersClassNames;
  modifiers: DayModifiers;
  numberOfMonths: number;
  styles: Styles;
  today: Date;
}

/**
 * The DayPicker context shares the props passed to DayPicker within internal
 * and custom components. It is used to set the default values and perform
 * one-time calculations required to render the days.
 *
 * Access to this context from the {@link useDayPicker} hook.
 */
export const DayPickerContext = createContext<DayPickerContextValue | undefined>(undefined);

/** The props for the {@link DayPickerProvider}. */
export interface DayPickerProviderProps {
  /** The initial props from the DayPicker component. */
  initialProps: DayPickerProps;
  children?: ReactNode;
}
/**
 * The provider for the {@link DayPickerContext}, assigning the defaults from the
 * initial DayPicker props.
 */
export function DayPickerProvider(props: DayPickerProviderProps): JSX.Element {
  const { initialProps } = props;

  const defaultContextValues = getDefaultContextValues();

  const { fromDate, toDate } = parseFromToProps(initialProps);

  let captionLayout = initialProps.captionLayout ?? defaultContextValues.captionLayout;
  if (captionLayout !== 'buttons' && (!fromDate || !toDate)) {
    // When no from/to dates are set, the caption is always buttons
    captionLayout = 'buttons';
  }

  let onSelect = undefined;
  if (
    isDayPickerSingle(initialProps) ||
    isDayPickerMultiple(initialProps) ||
    isDayPickerRange(initialProps)
  ) {
    onSelect = initialProps.onSelect;
  }

  const value: DayPickerContextValue = {
    ...defaultContextValues,
    ...initialProps,
    captionLayout,
    classNames: {
      ...defaultContextValues.classNames,
      ...initialProps.classNames,
    },
    components: {
      ...initialProps.components,
    },
    formatters: {
      ...defaultContextValues.formatters,
      ...initialProps.formatters,
    },
    fromDate,
    labels: {
      ...defaultContextValues.labels,
      ...initialProps.labels,
    },
    mode: initialProps.mode || defaultContextValues.mode,
    modifiers: {
      ...defaultContextValues.modifiers,
      ...initialProps.modifiers,
    },
    modifiersClassNames: {
      ...defaultContextValues.modifiersClassNames,
      ...initialProps.modifiersClassNames,
    },
    onSelect,
    styles: {
      ...defaultContextValues.styles,
      ...initialProps.styles,
    },
    toDate,
  };

  return <DayPickerContext.Provider value={value}>{props.children}</DayPickerContext.Provider>;
}

/**
 * Hook to access the {@link DayPickerContextValue}.
 *
 * Use the DayPicker context to access to the props passed to DayPicker inside
 * internal or custom components.
 */
export function useDayPicker(): DayPickerContextValue {
  const context = useContext(DayPickerContext);
  if (!context) {
    throw new Error('useDayPicker must be used within a DayPickerProvider.');
  }
  return context;
}
