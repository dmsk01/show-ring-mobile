import * as z from 'zod';
import * as Burnt from 'burnt';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuthActions } from 'src/auth';
import { StyleSheet, View } from 'react-native';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, RHFTextField } from 'src/components/hook-form';
import { Button, Stack, Typography } from 'src/components/mui';
import { TextInput as PaperTextInput } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { JSX } from 'react';

// ----------------------------------------------------------------------

const SignInSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Email is required!' })
    .email({ message: 'Email must be a valid address!' }),
  password: z
    .string()
    .min(1, { message: 'Password is required!' })
    .min(6, { message: 'Password must be at least 6 characters!' }),
});

type SignInSchemaType = z.infer<typeof SignInSchema>;

const defaultValues: SignInSchemaType = {
  email: '',
  password: '',
};

// ----------------------------------------------------------------------

/**
 * Sign-in screen — MVP. Mirrors `jwt-sign-in-view.tsx` on the web:
 * `react-hook-form` + `zodResolver`, MUI-compatible field wrappers, a single
 * submit button.
 *
 * Divergence from web:
 *  - Demo credential `<Alert>` is dropped (adapter has no Alert — not needed
 *    for real deploys anyway; on transient failure we surface a Burnt toast).
 *  - `forgot-password` link deferred per scope call (plan §1.5, Phase C).
 *  - Password visibility toggle uses Paper's `TextInput.Icon` wrapped through
 *    the adapter's `endAdornment` prop.
 */
export default function SignInScreen(): JSX.Element {
  const { signIn } = useAuthActions();
  const insets = useSafeAreaInsets();
  const [showPassword, setShowPassword] = useState(false);

  const methods = useForm<SignInSchemaType>({
    resolver: zodResolver(SignInSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      await signIn({ email: data.email, password: data.password });
    } catch (error) {
      if (__DEV__) console.error('Sign-in failed:', error);
      const message = error instanceof Error ? error.message : 'Invalid credentials';
      Burnt.alert({ title: 'Sign in failed', message, preset: 'error' });
    }
  });

  return (
    <View style={[styles.root, { paddingTop: insets.top + 32 }]}>
      <Stack spacing={1} sx={styles.head}>
        <Typography variant="h4">Sign in to your account</Typography>
      </Stack>

      <Form methods={methods}>
        <Stack spacing={3}>
          <RHFTextField name="email" label="Email address" type="email" autoFocus fullWidth />

          <RHFTextField
            name="password"
            label="Password"
            placeholder="6+ characters"
            type={showPassword ? 'text' : 'password'}
            fullWidth
            endAdornment={
              <PaperTextInput.Icon
                icon={showPassword ? 'eye' : 'eye-off'}
                onPress={() => setShowPassword((prev) => !prev)}
              />
            }
          />

          <Button
            variant="contained"
            color="primary"
            size="large"
            fullWidth
            loading={isSubmitting}
            onPress={onSubmit}
          >
            Sign in
          </Button>
        </Stack>
      </Form>
    </View>
  );
}

// ----------------------------------------------------------------------

const styles = StyleSheet.create({
  root: {
    flex: 1,
    paddingHorizontal: 24,
  },
  head: {
    marginBottom: 24,
  },
});
