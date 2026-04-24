/**
 * `Form` — thin wrapper over `FormProvider` that mirrors web's
 * `src/components/hook-form/form-provider.tsx` API.
 *
 * Divergence from web: there is no `<form>` element in RN; submission is
 * wired through the child `Button`'s `onPress` (the caller passes the memoised
 * handler from `handleSubmit(...)` down to the button). Keeping the component
 * name and `methods` / `onSubmit` props identical so section code ports
 * mechanically.
 *
 * Note: `onSubmit` is accepted but not auto-bound — it's exposed so forms can
 * pass it to their submit control. No DOM equivalent to invoke on Enter.
 */

import { FormProvider } from 'react-hook-form';

import type { JSX, ReactNode } from 'react';
import type { FieldValues, UseFormReturn } from 'react-hook-form';

// ----------------------------------------------------------------------

export type FormProps<TFieldValues extends FieldValues = FieldValues> = {
  methods: UseFormReturn<TFieldValues>;
  onSubmit?: () => void;
  children: ReactNode;
};

export function Form<TFieldValues extends FieldValues = FieldValues>({
  methods,
  children,
}: FormProps<TFieldValues>): JSX.Element {
  return <FormProvider {...methods}>{children}</FormProvider>;
}

Form.displayName = 'Form';
