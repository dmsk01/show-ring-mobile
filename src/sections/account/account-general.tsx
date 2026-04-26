/**
 * AccountGeneral — mobile port.
 *
 * Divergence from web:
 *  - `Field.UploadAvatar` replaced with a static `Avatar` + caption.
 *    TODO(stage-3.C upload): restore after `npx expo install expo-image-picker`.
 *  - `Grid` replaced with `Stack` (single-column layout is idiomatic on mobile).
 *  - `isValidPhoneNumber` validator dropped (react-phone-number-input not installed).
 *  - `schemaUtils.file` dropped; `photoURL` is a plain optional string.
 */

import * as z from 'zod';
import * as Burnt from 'burnt';
import { useForm } from 'react-hook-form';
import { sp } from 'src/theme/core/spacing';
import { useMockedUser } from 'src/auth/hooks';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, Field, schemaUtils } from 'src/components/hook-form';
import { Card, Stack, Button, Avatar, Typography } from 'src/components/mui';

import type { JSX } from 'react';

// ----------------------------------------------------------------------

export type UpdateUserSchemaType = z.infer<typeof UpdateUserSchema>;

export const UpdateUserSchema = z.object({
  displayName: z.string().min(1, { error: 'Name is required!' }),
  email: schemaUtils.email(),
  photoURL: z.string().optional(),
  phoneNumber: z.string().optional(),
  country: schemaUtils.nullableInput(z.string().min(1, { error: 'Country is required!' }), {
    error: 'Country is required!',
  }),
  address: z.string().min(1, { error: 'Address is required!' }),
  state: z.string().min(1, { error: 'State is required!' }),
  city: z.string().min(1, { error: 'City is required!' }),
  zipCode: z.string().min(1, { error: 'Zip code is required!' }),
  about: z.string().min(1, { error: 'About is required!' }),
  isPublic: z.boolean(),
});

// ----------------------------------------------------------------------

export function AccountGeneral(): JSX.Element {
  const { user } = useMockedUser();

  const currentUser: UpdateUserSchemaType = {
    displayName: (user?.displayName as string) ?? '',
    email: (user?.email as string) ?? '',
    photoURL: (user?.photoURL as string) ?? '',
    phoneNumber: (user?.phoneNumber as string) ?? '',
    country: (user?.country as string) ?? null,
    address: (user?.address as string) ?? '',
    state: (user?.state as string) ?? '',
    city: (user?.city as string) ?? '',
    zipCode: (user?.zipCode as string) ?? '',
    about: (user?.about as string) ?? '',
    isPublic: (user?.isPublic as boolean) ?? false,
  };

  const defaultValues: UpdateUserSchemaType = {
    displayName: '',
    email: '',
    photoURL: '',
    phoneNumber: '',
    country: null,
    address: '',
    state: '',
    city: '',
    zipCode: '',
    about: '',
    isPublic: false,
  };

  const methods = useForm({
    mode: 'all',
    resolver: zodResolver(UpdateUserSchema),
    defaultValues,
    values: currentUser,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      Burnt.toast({ title: 'Update success!', preset: 'done' });
      console.info('DATA', data);
    } catch (error) {
      console.error(error);
    }
  });

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Stack spacing={3}>
        {/* Avatar card */}
        <Card
          sx={{
            paddingTop: sp(5),
            paddingBottom: sp(3),
            paddingHorizontal: sp(3),
            alignItems: 'center',
          }}
        >
          <Avatar
            src={(user?.photoURL as string) ?? ''}
            sx={{ width: 72, height: 72, marginBottom: sp(2) }}
          />
          <Typography variant="caption" sx={{ color: 'text.disabled', textAlign: 'center' }}>
            Allowed *.jpeg, *.jpg, *.png, *.gif · max 3 MB
          </Typography>

          <Field.Switch name="isPublic" label="Public profile" sx={{ marginTop: sp(3) }} />
        </Card>

        {/* Profile fields */}
        <Card sx={{ padding: sp(3) }}>
          <Stack spacing={3}>
            <Stack direction="row" spacing={2}>
              <Field.Text name="displayName" label="Name" sx={{ flex: 1 }} />
              <Field.Text name="email" label="Email address" sx={{ flex: 1 }} />
            </Stack>

            <Stack direction="row" spacing={2}>
              <Field.Phone name="phoneNumber" label="Phone number" sx={{ flex: 1 }} />
              <Field.Text name="address" label="Address" sx={{ flex: 1 }} />
            </Stack>

            <Field.CountrySelect name="country" label="Country" placeholder="Choose a country" />

            <Stack direction="row" spacing={2}>
              <Field.Text name="state" label="State/region" sx={{ flex: 1 }} />
              <Field.Text name="city" label="City" sx={{ flex: 1 }} />
            </Stack>

            <Field.Text name="zipCode" label="Zip/code" />
            <Field.Text name="about" multiline rows={4} label="About" />

            <Stack sx={{ alignItems: 'flex-end' }}>
              <Button variant="contained" loading={isSubmitting} onClick={onSubmit}>
                Save changes
              </Button>
            </Stack>
          </Stack>
        </Card>
      </Stack>
    </Form>
  );
}

AccountGeneral.displayName = 'AccountGeneral';
