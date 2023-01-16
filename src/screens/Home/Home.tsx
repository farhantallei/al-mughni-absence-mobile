import { Button, Container } from '@app/components/ui';
import { useGlobalState } from '@app/hooks';
import { RootStackScreenProps } from '@app/types';
import React, { useMemo } from 'react';
import { Text, View } from 'react-native';
import styles from './Home.styles';

function Home({ navigation }: RootStackScreenProps<'Home'>) {
  const [user] = useGlobalState<string | null>(['user']);
  const userDisplay = useMemo((): string => {
    if (user != null) {
      return `${user.charAt(0).toUpperCase()}${user.split('_')[0].slice(1)}`;
    }
    return 'guest';
  }, [user]);

  function absence(subject: 'baca kitab' | 'tahfizh') {
    navigation.push('Absence', { subject });
  }

  return (
    <Container>
      <View style={styles.top}>
        <Text style={styles.greet}>Hi, {userDisplay}</Text>
      </View>
      <View style={styles.bottom}>
        <Button
          onPress={() => absence('baca kitab')}
          marginBottom={16}
          height={75}>
          Baca Kitab
        </Button>
        <Button onPress={() => absence('tahfizh')} height={75}>
          Tahfizh
        </Button>
      </View>
    </Container>
  );
}

export default Home;
