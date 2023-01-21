import { Loading } from '@app/components';
import { Button, TextInput } from '@app/components/ui';
import { useGlobalState } from '@app/hooks';
import { login } from '@app/services/pelajar';
import { getProgramList } from '@app/services/program';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput as TextInputRN,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import Toast from 'react-native-easy-toast';
import styles from './Login.styles';

function Login() {
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [usernameForm, setUsernameForm] = useState('');
  const [userId, setUserId] = useGlobalState<number | null>(['userId']);
  const [username, setUsername] = useGlobalState<string | null>(['username']);
  const [name, setName] = useGlobalState<string | null>(['name']);
  const usernameInputRef = useRef<TextInputRN>(null);
  const toastRef = useRef<Toast>(null);
  const errorToastRef = useRef<Toast>(null);
  const queryClient = useQueryClient();

  const { mutate, isLoading } = useMutation(
    () => login({ username: usernameForm }),
    {
      onMutate: resetError,
      onError(error) {
        if (error instanceof Error) errorToastRef.current?.show(error.message);
        else if (error instanceof String) errorToastRef.current?.show(error);
        else errorToastRef.current?.show('ada kesalahan teknis');
      },
      onSuccess: async data => {
        await queryClient.prefetchQuery({
          queryKey: ['program'],
          queryFn: () => getProgramList(data.id),
          retry: 1,
        });

        await AsyncStorage.setItem('username', data.username);
        setUserId(data.id);
        setUsername(data.username);
        setName(data.name);
      },
    },
  );

  useEffect(() => {
    if (usernameForm != '') {
      setError(false);
      setErrorMessage('');
      return;
    }
    setError(true);
    setErrorMessage('isi username');
  }, [usernameForm]);

  function resetError() {
    setError(false);
    setErrorMessage('');
  }

  function handleSubmit() {
    if (error) {
      usernameInputRef.current?.focus();
      toastRef.current?.show('isi formnya dulu');
      return;
    }
    mutate();
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.inner}>
          <Text style={{ color: error ? 'red' : undefined }}>
            {error ? errorMessage : 'Username'}
          </Text>
          <TextInput
            placeholder="Username"
            onChangeText={text => setUsernameForm(text)}
            error={error}
            autoCapitalize="none"
            ref={usernameInputRef}
          />
          <Button marginBottom={12} onPress={handleSubmit}>
            Submit
          </Button>
          <Loading isLoading={isLoading} />
          <Toast ref={toastRef} opacity={0.6} />
          <Toast
            ref={errorToastRef}
            opacity={0.6}
            style={{ backgroundColor: 'red' }}
          />
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

export default Login;
