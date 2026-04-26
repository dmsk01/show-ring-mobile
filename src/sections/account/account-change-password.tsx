import * as z from 'zod';
import * as Burnt from 'burnt';
import { Pressable } from 'react-native';
import { useForm } from 'react-hook-form';
import { sp } from 'src/theme/core/spacing';
import { Iconify } from 'src/components/iconify';
import { useBoolean } from 'src/hooks/use-boolean';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, Field } from 'src/components/hook-form';
import { Card, Stack, Button } from 'src/components/mui';

import type { JSX } from 'react';

// ----------------------------------------------------------------------

export type ChangePassWordSchemaType = z.infer<typeof ChangePassWordSchema>;

export const ChangePassWordSchema = z
  .object({
    oldPassword: z
      .string()
      .min(1, { error: 'Password is required!' })
      .min(6, { error: 'Password must be at least 6 characters!' }),
    newPassword: z.string().min(1, { error: 'New password is required!' }),
    confirmNewPassword: z.string().min(1, { error: 'Confirm password is required!' }),
  })
  .refine((val) => val.oldPassword !== val.newPassword, {
    error: 'New password must be different than old password',
    path: ['newPassword'],
  })
  .refine((val) => val.newPassword === val.confirmNewPassword, {
    error: 'Passwords do not match!',
    path: ['confirmNewPassword'],
  });

// ----------------------------------------------------------------------

export function AccountChangePassword(): JSX.Element {
  const showPassword = useBoolean();

  const defaultValues: ChangePassWordSchemaType = {
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  };

  const methods = useForm({
    mode: 'all',
    resolver: zodResolver(ChangePassWordSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      reset();
      Burnt.toast({ title: 'Update success!', preset: 'done' });
      console.info('DATA', data);
    } catch (error) {
      console.error(error);
    }
  });

  const eyeToggle = (
    <Pressable onPress={showPassword.onToggle} style={{ padding: sp(0.5) }}>
      <Iconify icon={showPassword.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} width={20} />
    </Pressable>
  );

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Card sx={{ padding: sp(3), gap: sp(3), display: 'flex', flexDirection: 'column' }}>
        <Field.Text
          name="oldPassword"
          label="Old password"
          type={showPassword.value ? 'text' : 'password'}
          endAdornment={eyeToggle}
        />

        <Field.Text
          name="newPassword"
          label="New password"
          type={showPassword.value ? 'text' : 'password'}
          endAdornment={eyeToggle}
          helperText="Password must be minimum 6+ characters"
        />

        <Field.Text
          name="confirmNewPassword"
          label="Confirm new password"
          type={showPassword.value ? 'text' : 'password'}
          endAdornment={eyeToggle}
        />

        <Stack sx={{ alignItems: 'flex-end' }}>
          <Button variant="contained" loading={isSubmitting} onClick={onSubmit}>
            Save changes
          </Button>
        </Stack>
      </Card>
    </Form>
  );
}

AccountChangePassword.displayName = 'AccountChangePassword';
