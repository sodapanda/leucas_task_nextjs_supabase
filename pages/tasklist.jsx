import {
  TextInput,
  Button,
  Select,
  Text,
  NumberInput,
  Group,
  Checkbox,
  Box,
  Card,
  Flex,
  Modal,
  Divider,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { ActionIcon } from '@mantine/core';
import { IconTrash, IconPencil } from '@tabler/icons';
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
  const [opened, { open, close }] = useDisclosure(false);
  const [inEditTask, setInEditTask] = useState({});

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
    const { data: taskListd, error } = await supabase
      .from('tasks')
      .select('*')
      .order('id', { ascending: false });
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
    <>
      <Modal opened={opened} onClose={close}>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <NumberInput
            value={inEditTask.power}
            onChange={async (event) => {
              setInEditTask({ ...inEditTask, power: event });
            }}
          />
          <TextInput
            value={inEditTask.step}
            label="当前步骤"
            onChange={(event) => {
              const newStep = event.currentTarget.value;
              setInEditTask({ ...inEditTask, step: newStep });
            }}
          />

          <Button
            variant="light"
            color="blue"
            fullWidth
            mt="md"
            radius="md"
            onClick={async () => {
              await supabase
                .from('tasks')
                .update({ power: inEditTask.power, step: inEditTask.step })
                .eq('id', inEditTask.id);
              updateTaskList();
              close();
            }}
          >
            save
          </Button>
        </Card>
      </Modal>
      <div className="w-ful mt-4">
        {taskTypeList.map((typeItem) => (
          <Group key={typeItem.id} mb="xs" ml="xs">
            <ActionIcon
              color="blue"
              radius="xl"
              variant="light"
              onClick={async () => {
                const { data, error } = await supabase
                  .from('tasktype')
                  .delete()
                  .eq('id', typeItem.id);
                if (error) {
                  alert(`${error.message}`);
                }
                updateTaskTypeList();
              }}
            >
              <IconTrash size="1rem" />
            </ActionIcon>
            <Text fz="sm">{typeItem.tasktypename}</Text>
          </Group>
        ))}
        <TextInput
          placeholder="添加任务类型"
          value={addTaskType}
          onChange={(event) => {
            setAddTaskType(event.currentTarget.value);
          }}
        />

        <Flex mt="xs" gap="sm" justify="flex-end" align="center" direction="row" wrap="nowrap">
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
        </Flex>
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
        <Flex mt="xs" gap="sm" justify="flex-end" align="center" direction="row" wrap="nowrap">
          <Button
            disabled={!selectedTaskType || !addTaskName}
            onClick={async () => {
              await supabase.from('tasks').insert([
                {
                  power: rank,
                  task_name: addTaskName,
                  user_id: user.id,
                  tasktype: selectedTaskType,
                  step: 'init',
                },
              ]);

              setSelectedTaskType('');
              setAddTaskName('');
              updateTaskList();
            }}
          >
            add
          </Button>
        </Flex>

        <Divider my="sm" variant="dashed" />

        {taskList.map((taskTypeItem) => (
          <Box component="div" key={taskTypeItem.tasktype}>
            <Text mt="sm" fz="lg" fw={500} c="dimmed">
              {taskTypeItem.tasktype}
            </Text>
            {taskTypeItem.list.map((task) => (
              <Box component="div" key={task.id}>
                <Flex justify="flex-start" gap="xs" align="center" direction="row" wrap="nowrap">
                  <ActionIcon
                    color="blue"
                    radius="xl"
                    variant="light"
                    onClick={() => {
                      setInEditTask({ ...task });
                      open();
                    }}
                  >
                    <IconPencil size="1rem" />
                  </ActionIcon>
                  <ActionIcon
                    color="blue"
                    radius="xl"
                    variant="light"
                    onClick={async () => {
                      await supabase.from('tasks').delete().eq('id', task.id);
                      updateTaskList();
                    }}
                  >
                    <IconTrash size="1rem" />
                  </ActionIcon>
                  <Text fz="sm" fw={700} c="blue">
                    {task.power}
                  </Text>
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
                </Flex>
                <Text fz="xs" c="dimmed" mx="xl" truncate lineClamp={1}>
                  {task.step}
                </Text>
              </Box>
            ))}
          </Box>
        ))}
      </div>
    </>
  );
}
