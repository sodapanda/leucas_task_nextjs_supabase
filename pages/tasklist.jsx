import {
  TextInput,
  Button,
  Select,
  Text,
  NumberInput,
  Group,
  Checkbox,
  Stack,
  Box,
  Card,
  Flex,
  Textarea,
  Modal,
  Divider,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { ActionIcon } from '@mantine/core';
import { IconTrash, IconPencil, IconPlaylistAdd, IconChevronsRight } from '@tabler/icons';
import { useState, useEffect } from 'react';
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/router';

export default function TaskList() {
  const user = useUser();
  const supabase = useSupabaseClient();
  const router = useRouter();

  const [addTaskType, setAddTaskType] = useState('');
  const [selectedTaskType, setSelectedTaskType] = useState('');
  const [taskTypeList, setTaskTypeList] = useState([]);
  const [addTaskName, setAddTaskName] = useState('');
  const [rank, setRank] = useState(5);
  const [taskList, setTaskList] = useState([]);
  const [opened, { open, close }] = useDisclosure(false);
  const [inEditTask, setInEditTask] = useState({});
  const [showStackModal, setShowStackModal] = useState(false);
  const [stackNote, setStackNote] = useState('');
  const [currentStackTask, setCurrentStackTask] = useState({});
  const [taskStack, setTaskStack] = useState([]);
  const [ideaList, setIdeaList] = useState([]);
  const [selectedIdea, setSelectedidea] = useState({});

  useEffect(() => {
    updateTaskTypeList();
    updateTaskList();
    updateTaskStack();
    updateIdeaList();
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

  async function updateTaskStack() {
    const { data, error } = await supabase
      .from('task_stack_view')
      .select('*')
      .order('id', { ascending: false });
    if (error) {
      alert(error.message);
      return;
    }

    setTaskStack(data);
  }

  async function updateIdeaList() {
    const { data, error } = await supabase.from('idea').select('*');
    if (error) {
      alert(error.message);
      return;
    }

    data.forEach((element) => {
      element.label = element.idea_name;
      element.value = element.idea_name;
    });

    setIdeaList(data);
  }

  return (
    <>
      <Modal opened={opened} onClose={close}>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <TextInput
            placeholder="task name"
            value={inEditTask.task_name}
            onChange={(event) => {
              setInEditTask({ ...inEditTask, task_name: event.target.value });
            }}
          />
          <NumberInput
            value={inEditTask.power}
            onChange={async (event) => {
              setInEditTask({ ...inEditTask, power: event });
            }}
          />
          <Select
            label="哪个idea"
            data={ideaList}
            value={ideaList.find((ideaItem) => ideaItem.id === inEditTask.idea_id)?.idea_name || ''}
            onChange={(item) => {
              const mIdea = ideaList.find((ideaItem) => ideaItem.idea_name === item);
              setInEditTask({ ...inEditTask, idea_id: mIdea.id });
            }}
          />
          <Divider my="sm" variant="dashed" />
          <Textarea
            placeholder="Your comment"
            label="随手记录"
            autosize
            minRows={2}
            maxRows={10}
            value={inEditTask.step}
            onChange={(event) => {
              const newStep = event.currentTarget.value;
              setInEditTask({ ...inEditTask, step: newStep });
            }}
          />
          <Textarea
            placeholder="功能列表"
            label="功能和好处列表为了推广文案用"
            autosize
            minRows={2}
            maxRows={10}
            value={inEditTask.features ? inEditTask.features : ''}
            onChange={(event) => {
              const newFeatures = event.currentTarget.value;
              setInEditTask({ ...inEditTask, features: newFeatures });
            }}
          />
          <Textarea
            placeholder="最新进展"
            label="当前"
            autosize
            minRows={2}
            maxRows={10}
            value={inEditTask.current_frame}
            onChange={(event) => {
              const new_current_frame = event.currentTarget.value;
              setInEditTask({ ...inEditTask, current_frame: new_current_frame });
            }}
          />
          <Divider my="sm" variant="dashed" />

          <Button
            variant="light"
            color="blue"
            fullWidth
            mt="md"
            radius="md"
            onClick={async () => {
              await supabase
                .from('tasks')
                .update({
                  power: inEditTask.power,
                  step: inEditTask.step,
                  current_frame: inEditTask.current_frame,
                  task_name: inEditTask.task_name,
                  idea_id: inEditTask.idea_id,
                  features: inEditTask.features,
                })
                .eq('id', inEditTask.id);
              updateTaskList();
              close();
            }}
          >
            save
          </Button>
        </Card>
      </Modal>

      <Modal
        opened={showStackModal}
        onClose={() => {
          setShowStackModal(false);
          setCurrentStackTask({});
        }}
      >
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Stack>
            <TextInput
              label="note"
              placeholder="卡在哪了"
              value={stackNote}
              onChange={(event) => {
                setStackNote(event.target.value);
              }}
            />
            <Button
              onClick={async () => {
                await supabase.from('task_stack').insert([
                  {
                    note: stackNote,
                    task_id: currentStackTask.id,
                    user_id: user.id,
                  },
                ]);
                setShowStackModal(false);
                updateTaskStack();
              }}
            >
              add
            </Button>
          </Stack>
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
        <Select
          label="哪个idea"
          data={ideaList}
          value={selectedIdea.idea_name ? selectedIdea.idea_name : ''}
          onChange={(item) => {
            const mIdea = ideaList.find((ideaItem) => ideaItem.idea_name === item);
            setSelectedidea(mIdea);
          }}
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
                  idea_id: selectedIdea.id,
                  step: 'init',
                },
              ]);

              setSelectedTaskType('');
              setAddTaskName('');
              setSelectedidea({});
              updateTaskList();
            }}
          >
            add
          </Button>
        </Flex>

        <Divider my="sm" variant="dashed" />

        <Stack>
          {taskStack.map((taskFrame, index) => (
            <Flex
              key={taskFrame.id}
              gap="xs"
              justify="center"
              align="center"
              direction="row"
              wrap="nowrap"
            >
              {index === 0 && (
                <ActionIcon
                  color="blue"
                  radius="xl"
                  variant="light"
                  onClick={async () => {
                    await supabase.from('task_stack').delete().eq('id', taskFrame.id);
                    updateTaskStack();
                  }}
                >
                  <IconTrash size="1rem" />
                </ActionIcon>
              )}
              <Text fz="xs">{`${taskFrame.task_name} / ${taskFrame.current_frame} / ${taskFrame.note}`}</Text>
            </Flex>
          ))}
        </Stack>

        <Divider my="sm" variant="dashed" />

        {taskList.map((taskTypeItem) => (
          <Box component="div" mt="md" mb="sm" key={taskTypeItem.tasktype}>
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
                      setCurrentStackTask(task);
                      setShowStackModal(true);
                    }}
                  >
                    <IconPlaylistAdd size="1rem" />
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
                  <ActionIcon
                    color="blue"
                    radius="xl"
                    variant="light"
                    onClick={async () => {
                      router.push({
                        pathname: '/story',
                        query: { taskid: task.id },
                      });
                    }}
                  >
                    <IconChevronsRight size="1rem" />
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
                <Divider my="sm" variant="dashed" />
              </Box>
            ))}
          </Box>
        ))}
      </div>
    </>
  );
}
