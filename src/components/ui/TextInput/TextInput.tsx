import {
  TextInput as RNTextInput,
  TextInputProps as RNTextInputProps,
} from 'react-native';
import { forwardRef } from 'react';
import styles from './TextInput.styles';

interface TextInputProps extends RNTextInputProps {
  error: boolean;
}

const TextInput = forwardRef<RNTextInput, TextInputProps>(
  ({ children, style, error, ...others }, ref) => {
    return (
      <RNTextInput
        ref={ref}
        style={[
          style,
          styles.textInput,
          { borderColor: error ? 'red' : undefined },
        ]}
        {...others}
      />
    );
  },
);

export default TextInput;
