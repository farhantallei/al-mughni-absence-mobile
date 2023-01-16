import { SafeAreaView } from 'react-native-safe-area-context';
import styles from './Container.styles';

function Container({ children }: { children: React.ReactNode }) {
  return <SafeAreaView style={styles.container}>{children}</SafeAreaView>;
}

export default Container;
