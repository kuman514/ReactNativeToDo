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

// Click TouchableOpacity -> Transparent
// Click TouchableHighlight -> Background light
// TouchableWithoutFeedback -> No UI Change
// Pressable -> Many expansion

// TextInput

const STORAGE_KEY = '@toDos';

export default function App() {
  const [status, setStatus] = useState({
    working: true,
    text: '',
    toDos: {},
    loadComplete: false
  });

  const travel = () => {
    setStatus({
      ...status,
      working: false
    });
  };

  const work = () => {
    setStatus({
      ...status,
      working: true
    });
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

  const loadToDos = async () => {
    try {
      const toDoStr = await AsyncStorage.getItem(STORAGE_KEY);
      //console.log(toDoStr);
      const toDoJson = toDoStr !== null ? JSON.parse(toDoStr) : {};
      setStatus({
        ...status,
        toDos: toDoJson,
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
      console.log('Loading saved todos');
      loadToDos();
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
        work: status.working
      }
    }

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
              <View key={toDoKey} style={styles.toDo}>
                <Text style={styles.toDoText}>
                  { status.toDos[toDoKey].text }
                </Text>
                <TouchableOpacity onPress={() => {
                  deleteToDo(toDoKey);
                }}>
                  <Ionicons name="trash" size={24} color="white" />
                </TouchableOpacity>
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
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  toDoText: {
    color: 'white',
    fontSize: 18
  }
});
