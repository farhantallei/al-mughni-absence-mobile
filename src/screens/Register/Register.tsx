import { Button, TextInput } from '@app/components/ui';
import { useGlobalState } from '@app/hooks';
import { RootStackScreenProps } from '@app/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import styles from './Register.styles';

function Register({}: RootStackScreenProps<'Register'>) {
  const [errorMessage, setErrorMessage] = useState('');
  const [error, setError] = useState(false);
  const [name, setName] = useState('');
  const [user, setUser] = useGlobalState<string | null>(['user']);

  useEffect(() => {
    if (name != '') {
      setError(false);
      setErrorMessage('');
      return;
    }
    setError(true);
    setErrorMessage('isi nama antum');
  }, [name]);

  async function register() {
    if (error || name == '') return;
    const username = name.toLowerCase().replace(/ /g, '_');
    await AsyncStorage.setItem('user', username);
    setUser(username);
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.inner}>
          <Text style={{ color: 'red' }}>{errorMessage}</Text>
          <TextInput
            placeholder="Name"
            onChangeText={text => setName(text)}
            error={error}
          />
          <View style={styles.btnContainer}>
            <Button onPress={() => register()}>Submit</Button>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

export default Register;
