import { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

import { theme } from './colors';
import ToDoItem from './ToDoItem';

// Click TouchableOpacity -> Transparent
// Click TouchableHighlight -> Background light
// TouchableWithoutFeedback -> No UI Change
// Pressable -> Many expansion

// TextInput

const STORAGE_KEY = '@toDos';
const MODE_KEY = '@working';

export default function App() {
  const [status, setStatus] = useState({
    working: true,
    text: '',
    toDos: {},
    loadComplete: false
  });

  const saveMode = async (newWorking) => {
    try {
      const workingStr = JSON.stringify(newWorking);
      await AsyncStorage.setItem(MODE_KEY, workingStr);
      //console.log(`Saved workingMode: ${workingStr}`);
    } catch (error) {
      console.log('An error occured saving mode');
    }
  };

  const travel = async () => {
    setStatus({
      ...status,
      working: false
    });
    await saveMode(false);
  };

  const work = async () => {
    setStatus({
      ...status,
      working: true
    });
    await saveMode(true);
  };

  const onChangeText = (payload) => {
    setStatus({
      ...status,
      text: payload
    });
  };

  const saveToDos = async (newToDos) => {
    try {
      const toDoStr = JSON.stringify(newToDos);
      await AsyncStorage.setItem(STORAGE_KEY, toDoStr);
    } catch (error) {
      console.log('An error occured saving todos');
    }
  };

  const loadToDosAndMode = async () => {
    try {
      const toDoStr = await AsyncStorage.getItem(STORAGE_KEY);
      const savedMode = await AsyncStorage.getItem(MODE_KEY);

      //console.log(toDoStr, savedMode);

      const toDoJson = toDoStr !== null ? JSON.parse(toDoStr) : {};
      const initWorking = savedMode !== null ? JSON.parse(savedMode) : true;

      setStatus({
        ...status,
        toDos: toDoJson,
        working: initWorking,
        loadComplete: true
      });
    } catch (e) {
      console.log('An error occured loading todos');
    }
  };

  // useEffect means...
  // When the Component finished rendering, the function as a parameter invokes.
  useEffect(() => {
    if (!status.loadComplete) {
      console.log('Loading saved todos and modes');
      loadToDosAndMode();
    }
  }, []);

  const addToDo = async () => {
    if (status.text === '') {
      return;
    }

    //console.log(status.text);
    const newToDos = {
      ...status.toDos,
      [Date.now()]: {
        text: status.text,
        work: status.working,
        finished: false
      }
    };

    setStatus({
      ...status,
      toDos: newToDos,
      text: ''
    });
    await saveToDos(newToDos);
  };

  const deleteToDo = async (key) => {
    Alert.alert(
      `Delete ${status.toDos[key].text}`,
      'Are you sure?',
      [
        {
          text: 'No',
          style: 'cancel'
        },
        {
          text: 'Yes',
          onPress: async () => {
            const newToDos = {
              ...status.toDos
            };
            delete newToDos[key];
        
            setStatus({
              ...status,
              toDos: newToDos
            });
            await saveToDos(newToDos);
          },
        }
      ]
    );
  };

  const finishToDo = async (key) => {
    const newToDos = {
      ...status.toDos
    };
    newToDos[key].finished = !newToDos[key].finished;

    setStatus({
      ...status,
      toDos: newToDos
    });
    await saveToDos(newToDos);
  };

  const updateToDo = async (key, newText) => {
    const newToDos = {
      ...status.toDos
    };
    newToDos[key].text = newText;

    setStatus({
      ...status,
      toDos: newToDos
    });
    await saveToDos(newToDos);
  };

  //console.log(status.toDos);

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
            color: status.working ? 'white' : 'grey'
          }}>Work</Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={travel}
        >
          <Text style={{
            ...styles.btnText,
            color: status.working ? 'grey' : 'white'
          }}>Travel</Text>
        </TouchableOpacity>
      </View>
      <View>
        <TextInput
          style={styles.textInput}
          placeholder={status.working ? 'Add a to do.' : 'Where do you want to go?'}
          returnKeyType="done"
          value={status.text}
          onChangeText={onChangeText}
          onSubmitEditing={addToDo}
        ></TextInput>
      </View>
      <ScrollView>
        {
          Object.keys(status.toDos).filter((toDoKey) => {
            return (status.toDos[toDoKey].work === status.working);
          }).map((toDoKey) => {
            return (
              <ToDoItem
                key={toDoKey}
                id={toDoKey}
                text={status.toDos[toDoKey].text}
                work={status.toDos[toDoKey].work}
                finished={status.toDos[toDoKey].finished}
                onClickFinished={() => {
                  finishToDo(toDoKey);
                }}
                onUpdate={(newText) => {
                  updateToDo(toDoKey, newText);
                }}
                onClickDelete={() => {
                  deleteToDo(toDoKey);
                }}
              />
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
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  toDoText: {
    color: 'white',
    fontSize: 18
  },
  todoFinishedText: {
    color: 'grey',
    fontSize: 18,
    textDecorationLine: 'line-through'
  },
  toDoConfig: {
    flexDirection: 'row'
  }
});
