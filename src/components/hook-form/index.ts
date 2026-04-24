/**
 * Hook-form adapter layer.
 *
 * Web's barrel exposes a namespaced `Field.*` object; we re-export individual
 * components for now and add the namespace alias as more wrappers land
 * (stages 2+). Keep import shape compatible: `import { RHFTextField } from
 * 'src/components/hook-form'` works on both projects.
 */

export { Form, type FormProps } from './form-provider';
export { RHFTextField, type RHFTextFieldProps } from './rhf-text-field';
