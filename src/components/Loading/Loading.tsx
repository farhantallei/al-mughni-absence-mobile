import { ActivityIndicator, View } from 'react-native';
import styles from './Loading.styles';

function Loading({ isLoading }: { isLoading: boolean }) {
  if (!isLoading) return null;

  return (
    <View style={styles.loading}>
      <View style={styles.frame}>
        <ActivityIndicator size="large" />
      </View>
    </View>
  );
}

export default Loading;
