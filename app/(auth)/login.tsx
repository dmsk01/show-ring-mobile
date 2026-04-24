import * as Burnt from 'burnt';
import { useAuthActions } from 'src/auth';
import { useState, type JSX } from 'react';
import { Button, StyleSheet, TextInput, View } from 'react-native';

/**
 * Placeholder sign-in screen — wired to the new `useAuthActions` hook.
 *
 * TODO(stage-1.5-polish): rename file to `sign-in.tsx`, rebuild with
 * `react-hook-form` + `zodResolver` + MUI adapter components per plan §4.1.5.
 * Kept minimal for MVP smoke-test.
 */
export default function LoginScreen(): JSX.Element {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signIn } = useAuthActions();

  const handleSubmit = async (): Promise<void> => {
    try {
      await signIn({ email, password });
      Burnt.toast({ title: 'Signed in', preset: 'done' });
    } catch {
      Burnt.alert({ title: 'Error', message: 'Invalid credentials', preset: 'error' });
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholder="Password"
      />
      <Button title="Sign in" onPress={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, gap: 10, marginTop: 100 },
});
