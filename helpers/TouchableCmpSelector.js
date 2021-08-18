//Funkce pro výběr správného TouchableCmp
import {
  TouchableOpacity,
  TouchableNativeFeedback,
  Platform,
} from 'react-native';

const TouchableCmpSelector = () => {
  let TouchableCmp = TouchableOpacity;
  if (Platform.OS === 'Android' && Platform.Version >= 21) {
    TouchableCmp = TouchableNativeFeedback;
  }
  return TouchableCmp;
};

export default TouchableCmpSelector;
