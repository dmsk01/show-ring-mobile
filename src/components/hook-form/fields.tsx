/**
 * `Field` — namespaced re-export mirroring web's `Field.*` API.
 *
 * Usage: `import { Field } from 'src/components/hook-form'` then
 * `<Field.Text name="email" label="Email" />`.
 *
 * Keeps section code portable between web and mobile.
 */

import { RHFSwitch } from './rhf-switch';
import { RHFCheckbox } from './rhf-checkbox';
import { RHFTextField } from './rhf-text-field';
import { RHFRadioGroup } from './rhf-radio-group';
import { RHFPhoneInput } from './rhf-phone-input';
import { RHFAutocomplete } from './rhf-autocomplete';
import { RHFCountrySelect } from './rhf-country-select';
// TODO(stage-3.C): add UploadAvatar after `npx expo install expo-image-picker`
// import { RHFUploadAvatar } from './rhf-upload';

// ----------------------------------------------------------------------

export const Field = {
  Text: RHFTextField,
  Switch: RHFSwitch,
  Checkbox: RHFCheckbox,
  RadioGroup: RHFRadioGroup,
  Autocomplete: RHFAutocomplete,
  Phone: RHFPhoneInput,
  CountrySelect: RHFCountrySelect,
  // TODO(stage-3.C): UploadAvatar: RHFUploadAvatar,
};
