import React from 'react';
import EnTypoIcon from 'react-native-vector-icons/Entypo';
import AntIcon from 'react-native-vector-icons/AntDesign';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';

import { addTask } from '../api/task';
import TaskForm from './Form/TaskForm';
import { borderColor, btnBgColor, darkBlue, lightBlue, white } from '../helpers/colors';
import { priorityToLabelColor, statusToCardColor, TASK_STATUS } from '../helpers/mappings';

const CardView = ({ task, handleOnTaskClick }) => (
  <Pressable style={styles.card} onPress={handleOnTaskClick}>
    <Text style={styles.name}>{task.name}</Text>
    <Text style={styles.description}>{task.description}</Text>
    <View style={{ borderBottomColor: borderColor, borderBottomWidth: 0.3, marginTop: 10 }} />
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 5 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>

        <EnTypoIcon size={14} color={darkBlue} name="flow-tree" />
        <Text style={{
          fontWeight: 600,
          fontSize: 14,
          marginLeft: 5
        }}>{task?.project?.name}</Text>
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <AntIcon size={14} name="arrowright" />
        <AntIcon size={14} name="user" />
        <Text style={{
          fontWeight: 500,
          fontSize: 14,
          marginLeft: 5
        }}>{task.assigneeName || 'email.holder@gmail.com'}</Text>
      </View>
    </View>
    <View style={{ borderBottomColor: borderColor, borderBottomWidth: 0.5 }} />
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 }}>
      <Text style={{
        paddingHorizontal: 10,
        paddingVertical: 2,
        overflow: 'hidden',
        borderRadius: 5,
        color: white,
        fontWeight: 500,
        backgroundColor: statusToCardColor[task.status || 'todo'],
      }}>{TASK_STATUS[task.status || 'todo']}</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 10 }}>
        <FontAwesomeIcon style={{ marginRight: 10 }} size={20} color={priorityToLabelColor[task.priority || 'low']} name="tag" />
        <MCIcon size={20} name="clock" />
        <Text style={{ fontWeight: 500, marginLeft: 2 }}>{task.startDate || new Date().toLocaleString()}</Text>
      </View>
    </View>
  </Pressable>
);

const TaskList = (props) => {
  const { data } = props;
  const [modalVisible, setModalVisible] = React.useState(false);

  const toggleTaskForm = () => {
    setModalVisible(!modalVisible);
  };

  const handleAddTask = async (task) => {
    let resp = await addTask(task);
    let { message, success } = resp;

    Toast.show({
      type: success ? 'success' : 'error',
      text1: message
    });

    if (resp.success) {
      setTimeout(() => {
        setModalVisible(!modalVisible);
        // props.navigation.navigate('Task List')
      }, 1000)
    }
  };

  return (
    <View style={styles.container}>
      <TaskForm
        onSave={handleAddTask}
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
      />
      <View style={styles.column}>
        <FlatList
          data={data}
          renderItem={({ item }) => <CardView
            task={item}
            handleOnTaskClick={() => props.handleOnTaskClick(item)}
          />}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
      <Pressable style={styles.createBtnWrapper} onPress={toggleTaskForm}>
        <Text style={styles.createBtn}>Create Task</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 10
  },
  column: {
    flex: 1,
    paddingHorizontal: 10,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 20,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    color: '#888',
  },
  createBtnWrapper: {
    position: 'absolute',
    backgroundColor: btnBgColor,
    bottom: 0,
    paddingLeft: 40,
    paddingRight: 40,
    paddingTop: 15,
    paddingBottom: 15,
    zIndex: 1111,
    marginBottom: 10,
    borderRadius: 50,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 5,
    shadowRadius: 2
  },
  createBtn: {
    color: white,
    fontSize: 16,
    fontWeight: 700,
  }
});

export default TaskList;
