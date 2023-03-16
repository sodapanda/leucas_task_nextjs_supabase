import {
  TextInput,
  Button,
  Select,
  Text,
  NumberInput,
  Group,
  Checkbox,
  Box,
  Divider,
} from '@mantine/core';
import { ActionIcon } from '@mantine/core';
import { IconTrash } from '@tabler/icons';
import { useState, useEffect } from 'react';
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react';

export default function TaskList() {
  const user = useUser();
  const supabase = useSupabaseClient();

  const [addTaskType, setAddTaskType] = useState('');
  const [selectedTaskType, setSelectedTaskType] = useState('');
  const [taskTypeList, setTaskTypeList] = useState([]);
  const [addTaskName, setAddTaskName] = useState('');
  const [rank, setRank] = useState(5);
  const [taskList, setTaskList] = useState([]);

  useEffect(() => {
    updateTaskTypeList();
    updateTaskList();
  }, []);

  async function updateTaskTypeList() {
    let { data: tasktype, error } = await supabase.from('tasktype').select('*');
    if (error) {
      alert(error.message);
    }

    tasktype.forEach((element) => {
      element.label = element.tasktypename;
      element.value = element.tasktypename;
    });

    setTaskTypeList(tasktype);
  }

  async function updateTaskList() {
    const { data: taskListd, error } = await supabase.from('tasks').select('*');
    console.log(taskListd);
    if (!error && taskListd) {
      const segment = taskListd.reduce((acc, cur) => {
        const exist = acc.find((item) => item.tasktype === cur.tasktype);
        if (exist) {
          exist.list.push(cur);
        } else {
          acc.push({ tasktype: cur.tasktype, list: [cur] });
        }
        return acc;
      }, []);

      console.log(segment);

      setTaskList(segment);
    }
  }

  return (
    <div className="w-ful mt-4">
      <TextInput
        placeholder="添加任务类型"
        value={addTaskType}
        onChange={(event) => {
          setAddTaskType(event.currentTarget.value);
        }}
      />
      <Button
        disabled={!addTaskType}
        onClick={async () => {
          const { data, error } = await supabase
            .from('tasktype')
            .insert([{ tasktypename: addTaskType, user_id: user.id }]);
          if (error) {
            alert(error.message);
          }
          setAddTaskType('');
          updateTaskTypeList();
        }}
      >
        add
      </Button>
      <Divider my="sm" variant="dashed" />

      <Select
        label="选择任务类型"
        value={selectedTaskType}
        data={taskTypeList}
        onChange={setSelectedTaskType}
      />
      <TextInput
        label="任务"
        value={addTaskName}
        onChange={(event) => {
          setAddTaskName(event.currentTarget.value);
        }}
      />
      <NumberInput label="优先级" value={rank} onChange={setRank} />
      <Button
        disabled={!selectedTaskType || !addTaskName}
        onClick={async () => {
          await supabase.from('tasks').insert([
            {
              power: rank,
              task_name: addTaskName,
              user_id: user.id,
              tasktype: selectedTaskType,
            },
          ]);

          setSelectedTaskType('');
          setAddTaskName('');
          updateTaskList();
        }}
      >
        add
      </Button>

      <Divider my="sm" variant="dashed" />

      {taskList.map((taskTypeItem) => (
        <Box component="div" key={taskTypeItem.tasktype}>
          <Text>{taskTypeItem.tasktype}</Text>
          {taskTypeItem.list.map((task) => (
            <Group key={task.id} position="apart" mt="xs" mx="xs">
              <Checkbox
                label={task.task_name}
                checked={task.active}
                onChange={async (event) => {
                  const flag = event.currentTarget.checked;
                  console.log(`task id ${task.id} checked ${flag}`);
                  await supabase.from('tasks').update({ active: flag }).eq('id', task.id);
                  updateTaskList();
                }}
              />
              <ActionIcon
                color="blue"
                radius="xl"
                variant="light"
                onClick={async () => {
                  await supabase.from('tasks').delete().eq('id', task.id);
                  updateTaskList();
                }}
              >
                <IconTrash size="1.125rem" />
              </ActionIcon>
            </Group>
          ))}
        </Box>
      ))}
    </div>
  );
}
