import { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { theme } from './colors';

// Click TouchableOpacity -> Transparent
// Click TouchableHighlight -> Background light
// TouchableWithoutFeedback -> No UI Change
// Pressable -> Many expansion

// TextInput

const STORAGE_KEY = '@toDos';

export default function App() {
  const [working, setWorking] = useState(true);
  const [text, setText] = useState('');
  const [toDos, setToDos] = useState({});
  const [loadComplete, setLoadComplete] = useState(false);

  const travel = () => {
    setWorking(false);
  };
  const work = () => {
    setWorking(true);
  };

  const onChangeText = (payload) => {
    setText(payload);
  };
  const saveToDos = async (newToDos) => {
    try {
      const toDoStr = JSON.stringify(newToDos);
      await AsyncStorage.setItem(STORAGE_KEY, toDoStr);
    } catch (error) {
      console.log('An error occured saving todos');
    }
  };
  const loadToDos = async () => {
    try {
      const toDoStr = await AsyncStorage.getItem(STORAGE_KEY);
      //console.log(toDoStr);
      const toDoJson = toDoStr !== null ? JSON.parse(toDoStr) : {};
      setToDos(toDoJson);
      setLoadComplete(true);
    } catch (e) {
      console.log('An error occured loading todos');
    }
  };
  useEffect(() => {
    if (!loadComplete) {
      loadToDos();
    }
  });

  const addToDo = async () => {
    if (text === '') {
      return;
    }

    //console.log(text);
    const newToDos = {
      ...toDos,
      [Date.now()]: {
        text: text,
        work: working
      }
    }

    setToDos(newToDos);
    await saveToDos(newToDos);
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
