import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TouchableHighlight
} from 'react-native';

import { theme } from './colors';

// Click TouchableOpacity -> Transparent
// Click TouchableHighlight -> Background light
// TouchableWithoutFeedback -> No UI Change
// Pressable -> Many expansion

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <TouchableOpacity
          activeOpacity={0}
          onPress={() => {
            console.log('Work')
          }
        }>
          <Text style={styles.btnText}>Work</Text>
        </TouchableOpacity>
        <TouchableHighlight
          underlayColor="#DDDDDD"
          onPress={() => {
            console.log('Travel');
          }
        }>
          <Text style={styles.btnText}>Travel</Text>
        </TouchableHighlight>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.bg,
    paddingHorizontal: 20
  },
  header: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginTop: 100
  },
  btnText: {
    fontSize: 44,
    fontWeight: '600',
    color: 'white'
  }
});
