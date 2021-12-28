import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView
} from 'react-native';

import { theme } from './colors';

// Click TouchableOpacity -> Transparent
// Click TouchableHighlight -> Background light
// TouchableWithoutFeedback -> No UI Change
// Pressable -> Many expansion

// TextInput

export default function App() {
  const [working, setWorking] = useState(true);
  const [text, setText] = useState('');
  const [toDos, setToDos] = useState({});

  const travel = () => {
    setWorking(false);
  };
  const work = () => {
    setWorking(true);
  };

  const onChangeText = (payload) => {
    setText(payload);
  };
  const addToDo = () => {
    if (text === '') {
      return;
    }

    console.log(text);
    const newToDos = {
      ...toDos,
      [Date.now()]: {
        text: text,
        work: working
      }
    }

    setToDos(newToDos);
    onChangeText('');
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={work}
        >
          <Text style={{
            ...styles.btnText,
            color: working ? 'white' : 'grey'
          }}>Work</Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={travel}
        >
          <Text style={{
            ...styles.btnText,
            color: working ? 'grey' : 'white'
          }}>Travel</Text>
        </TouchableOpacity>
      </View>
      <View>
        <TextInput
          style={styles.textInput}
          placeholder={working ? 'Add a to do.' : 'Where do you want to go?'}
          returnKeyType="done"
          value={text}
          onChangeText={onChangeText}
          onSubmitEditing={addToDo}
        ></TextInput>
      </View>
      <ScrollView>
        {
          Object.keys(toDos).filter((toDoKey) => {
            return (toDos[toDoKey].work === working);
          }).map((toDoKey) => {
            return (
              <View key={toDoKey} style={styles.toDo}>
                <Text style={styles.toDoText}>
                  { toDos[toDoKey].text }
                </Text>
              </View>
            );
          })
        }
      </ScrollView>
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
    fontWeight: '600'
  },
  textInput: {
    backgroundColor: 'white',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginVertical: 10,
    fontSize: 18
  },
  toDo: {
    backgroundColor: theme.toDoBg,
    paddingVertical: 20,
    paddingHorizontal: 40,
    marginVertical: 10,
    borderRadius: 10
  },
  toDoText: {
    color: 'white',
    fontSize: 18
  }
});
