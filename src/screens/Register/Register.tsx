import { Loading } from '@app/components';
import { Button, TextInput } from '@app/components/ui';
import { useGlobalState } from '@app/hooks';
import { register } from '@app/services/pelajar';
import { getProgramList } from '@app/services/program';
import { RootStackScreenProps } from '@app/types';
import { toTitleCase } from '@app/utils';
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
import styles from './Register.styles';

type form = 'username' | 'name';
type formProps<T> = Record<form, T>;

function Register({ navigation }: RootStackScreenProps<'Register'>) {
  const [error, setError] = useState<formProps<boolean>>({
    username: false,
    name: false,
  });
  const [errorMessage, setErrorMessage] = useState<formProps<string>>({
    username: '',
    name: '',
  });
  const [form, setForm] = useState<formProps<string>>({
    username: '',
    name: '',
  });
  const [userId, setUserId] = useGlobalState<number | null>(['userId']);
  const [username, setUsername] = useGlobalState<string | null>(['username']);
  const [name, setName] = useGlobalState<string | null>(['name']);
  const usernameInputRef = useRef<TextInputRN>(null);
  const nameInputRef = useRef<TextInputRN>(null);
  const toastRef = useRef<Toast>(null);
  const errorToastRef = useRef<Toast>(null);
  const queryClient = useQueryClient();

  const { mutate, isLoading } = useMutation(
    () =>
      register({
        username: form.username,
        name: toTitleCase(form.name.trim()),
      }),
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
    if (form.username != '') {
      setError(prevError => ({ ...prevError, username: false }));
      setErrorMessage(prevMessage => ({ ...prevMessage, username: '' }));
      return;
    }
    setError(prevError => ({ ...prevError, username: true }));
    setErrorMessage(prevMessage => ({
      ...prevMessage,
      username: 'isi username',
    }));
  }, [form.username]);

  useEffect(() => {
    if (form.name != '') {
      setError(prevError => ({ ...prevError, name: false }));
      setErrorMessage(prevMessage => ({ ...prevMessage, name: '' }));
      return;
    }
    setError(prevError => ({ ...prevError, name: true }));
    setErrorMessage(prevMessage => ({
      ...prevMessage,
      name: 'isi nama antum',
    }));
  }, [form.name]);

  function resetError() {
    setError({ username: false, name: false });
    setErrorMessage({ username: '', name: '' });
  }

  function handleChangeForm(key: form, text: string) {
    setForm(prevForm => ({ ...prevForm, [key]: text }));
  }

  function handleSubmit() {
    if (error.username) {
      usernameInputRef.current?.focus();
      toastRef.current?.show('isi formnya dulu');
      return;
    }
    if (error.name) {
      nameInputRef.current?.focus();
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
          <Text style={{ color: error.username ? 'red' : undefined }}>
            {error.username ? errorMessage.username : 'Username'}
          </Text>
          <TextInput
            placeholder="Username"
            onChangeText={text => handleChangeForm('username', text)}
            error={error.username}
            autoCapitalize="none"
            onSubmitEditing={() => nameInputRef.current?.focus()}
            returnKeyType="next"
            ref={usernameInputRef}
          />
          <Text style={{ color: error.name ? 'red' : undefined }}>
            {error.name ? errorMessage.name : 'Nama'}
          </Text>
          <TextInput
            placeholder="Nama"
            onChangeText={text => handleChangeForm('name', text)}
            error={error.name}
            autoCapitalize="words"
            ref={nameInputRef}
          />
          <Button marginBottom={12} onPress={handleSubmit}>
            Submit
          </Button>
          <Button
            backgroundColor="green"
            onPress={() => navigation.navigate('Login')}>
            Login
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

export default Register;
