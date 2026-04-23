import * as Burnt from 'burnt'; // ты его добавил в package.json
import { useState } from 'react';
import { Button, StyleSheet, TextInput, View } from 'react-native';

import { useAuth } from '../../src/hooks/use-auth';

export default function LoginScreen() {
  const [username, setUsername] = useState('emilys'); // дефолтный юзер dummyjson
  const [password, setPassword] = useState('emilyspass');
  const { login } = useAuth();

  const handleLogin = async () => {
    try {
      await login(username, password);
      Burnt.toast({ title: 'Успешный вход!', preset: 'done' });
    } catch {
      Burnt.alert({ title: 'Ошибка', message: 'Неверный логин или пароль', preset: 'error' });
    }
  };

  return (
    <View style={styles.container}>
      <TextInput value={username} onChangeText={setUsername} placeholder="Логин" />
      <TextInput value={password} onChangeText={setPassword} secureTextEntry placeholder="Пароль" />
      <Button title="Войти" onPress={handleLogin} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, gap: 10, marginTop: 100 },
});
