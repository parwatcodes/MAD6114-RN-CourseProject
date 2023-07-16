import React from 'react';
import { View, Text, TextInput, StyleSheet, Image, Pressable, ImageBackground } from 'react-native';

import { getTasks } from '../api/task';
import TaskList from '../components/TaskList';

const TaskListScreen = (props) => {
  const [tasks, setTasks] = React.useState([]);

  React.useEffect(() => {
    getTasks()
      .then(setTasks);
  }, []);

  const handleOnTaskClick = (task) => {
    props.navigation.navigate('Task Details', { task });
  };

  return (
    <TaskList
      data={tasks}
      handleOnTaskClick={handleOnTaskClick}
    />
  );
};

export default TaskListScreen;
