import { StatusBar } from 'expo-status-bar';
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Logo from "../assets/logo.png";
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons'

export default function LoginScreen({ navigation }) {
  const [showPassword, setShowPassword] = useState(false); // controla visibilidade da senha
  const [email, setEmail] = useState('');                  // armazena o e-mail digitado
  const [password, setPassword] = useState('');            // armazena a senha digitada
  const [token, setToken] = useState(null);                // armazena o token recebido após login

  function handleLogin() {
  // Bypass de login para desenvolvimento
  const fakeUser = {
    accessToken: 'dev-token-123',
    firstName: 'Usuário',
    username: email || 'dev',
  };
  setToken(fakeUser.accessToken);
  navigation.navigate('Home', { token: fakeUser.accessToken, user: fakeUser });
}

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Image source={Logo} style={styles.logo} />
      <View>
        <Text style={styles.textlogo}>
          <Text style={styles.textlogoWhite}>My</Text>
          <Text style={styles.textlogoBlue}>Currency</Text>
        </Text>
      </View>
      <View style={styles.form}>
        <TextInput style={styles.input}
          placeholder="E-mail"
          placeholderTextColor='#FFF'
          onChangeText={setEmail} />
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholderTextColor='#FFF'
            placeholder="Senha"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setShowPassword(!showPassword)}>
            <Ionicons
              name={showPassword ? "eye-outline" : "eye-off-outline"}
              size={22}
              color="#666"
            />
          </TouchableOpacity>

        </View>
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.textlink}>Esqueci a Senha</Text>
      <Text style={styles.textlink}>Criar Conta</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F1521',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 32,
    paddingHorizontal: 32,
  },
  header: {
    alignItems: 'center',
    gap: 12,
  },
  logo: {
    width: 140,
    height: 140,
  },
  textlogo: {
    fontSize: 34,
    fontWeight: 'bold',
  },
  textlogoWhite: {
    color: '#CCCCCC',
    fontSize: 34,
    fontWeight: 'bold',
  },
  textlogoBlue: {
    color: '#4A8FD4',
    fontSize: 34,
    fontWeight: 'bold',
  },
  form: {
    width: '100%',
    gap: 16,
  },
  input: {
    backgroundColor: '#1E2431',
    borderRadius: 14,
    padding: 16,
    color: '#FFF',
    fontSize: 16,
    height: 54,

  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E2431',
    borderRadius: 14,
  },
  passwordInput: {
    flex: 1,
    padding: 16,
    color: '#FFF',
    fontSize: 16,
    height: 54,
  },
  eyeIcon: {
    paddingHorizontal: 16,
  },
  button: {
    backgroundColor: '#4A8FD4',
    borderRadius: 14,
    padding: 18,
    alignItems: 'center',
    marginTop: 4,
    height: 54,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 17,
    fontWeight: '600',
  },
  textlink: {
    color: '#4A8FD4',
    fontSize: 16,
  },
});