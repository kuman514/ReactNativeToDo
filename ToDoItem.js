import { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { theme } from './colors';

export default function ToDoItem(props) {
  /*
    props of ToDoItem
    - id
    - text
    - work
    - finished
    = onClickFinished
    = onUpdate
    = onClickDelete
  */

  const [status, setStatus] = useState({
    editing: false,
    editText: props.text
  });

  const onClickUpdate = () => {
    setStatus({
      ...status,
      editing: true
    });
  };

  const onCloseUpdate = () => {
    if (status.editText === '' || status.editText === props.text) {
      setStatus({
        ...status,
        editing: false
      });
      return;
    }

    // Execute onUpdate (Updating this todo)
    props.onUpdate(status.editText);
    setStatus({
      ...status,
      editing: false
    });
  };

  const onChangeText = (payload) => {
    setStatus({
      ...status,
      editText: payload
    });
  };

  return (
    <View style={styles.toDo}>
      {
        status.editing ? (
          <TextInput
            style={styles.toDoTextInput}
            placeholder={props.text}
            returnKeyType="done"
            value={status.editText}
            onChangeText={onChangeText}
            onSubmitEditing={onCloseUpdate}
          ></TextInput>
        ) : (
          <Text style={
            props.finished ? styles.todoFinishedText : styles.toDoText
          }>
            { props.text }
          </Text>
        )
      }

      {
        status.editing ? (
          <View style={styles.nothing} />
        ) : (
          <View style={styles.toDoConfig}>
            <TouchableOpacity onPress={() => {
              props.onClickFinished();
            }}>
              {
                props.finished ? (
                  <Ionicons name="checkbox" size={24} color="white" />
                ) : (
                  <Ionicons name="md-square-outline" size={24} color="white" />
                )
              }
            </TouchableOpacity>

            <TouchableOpacity onPress={() => {
              onClickUpdate();
            }}>
              <Ionicons name="build" size={24} color="white" />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => {
              props.onClickDelete();
            }}>
              <Ionicons name="trash" size={24} color="white" />
            </TouchableOpacity>
          </View>
        )
      }
    </View>
  );
}

const styles = StyleSheet.create({
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
  toDoTextInput: {
    flex: 1,
    color: 'white',
    fontSize: 18,
    padding: 0,
    borderBottomWidth: 1,
    borderBottomColor: 'white'
  },
  todoFinishedText: {
    color: 'grey',
    fontSize: 18,
    textDecorationLine: 'line-through'
  },
  toDoConfig: {
    flexDirection: 'row'
  },
  nothing: {
    display: 'none'
  }
});
