import { useState } from 'react';
import {
  StyleProp,
  Text,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
} from 'react-native';
import useStyles, { ButtonStyleProps } from './Button.styles';

interface ButtonProps extends ButtonStyleProps {
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
  onPress?: () => void;
  children: React.ReactNode;
}

function Button(props: ButtonProps) {
  const styles = useStyles(props);
  const { disabled = false, onPress, children } = props;
  const [press, setPress] = useState(false);

  function onPressIn() {
    setPress(true);
  }

  function onPressOut() {
    setPress(false);
  }

  return (
    <View style={[styles.container, props.style]}>
      <TouchableWithoutFeedback
        disabled={disabled}
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}>
        <View style={styles.button}>
          <View
            style={
              disabled
                ? { ...styles.height, ...styles.heightPress }
                : press
                ? { ...styles.height, ...styles.heightPress }
                : styles.height
            }>
            <View
              style={
                disabled
                  ? [styles.inner, { backgroundColor: '#ccc' }]
                  : styles.inner
              }>
              <Text style={styles.label}>{children}</Text>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
}

export default Button;
