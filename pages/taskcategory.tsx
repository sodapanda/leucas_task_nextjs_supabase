import { useForm } from '@mantine/form';
import { useState, useEffect } from 'react';
import { TextInput, Button, Box, Code, Text, Container, ActionIcon } from '@mantine/core';
import { useUser, useSupabaseClient, useSession } from '@supabase/auth-helpers-react';
import { IconTrashX } from '@tabler/icons';

export default function TaskCategory() {
  const supabase = useSupabaseClient();
  const user = useUser();

  const mForm = useForm({
    initialValues: {
      taskCategory: '',
      taskName: '',
      taskPower: '',
    },
  });

  const [taskList, setTaskList] = useState<any>();

  useEffect(() => {
    fetchData();
  }, []);

  function fetchData() {
    supabase
      .from('tasks')
      .select('*')
      .then((rst) => {
        setTaskList(rst.data);
      });
  }

  return (
    <div className="w-full">
      <h3>任务分类</h3>
      <Box className="w-full">
        <form
          onSubmit={mForm.onSubmit(async (values) => {
            console.log(values);

            const { data, error } = await supabase.from('tasks').insert([
              {
                category_name: values.taskCategory,
                power: values.taskPower,
                task_name: values.taskName,
                user_id: user?.id,
              },
            ]);

            console.log(data);
            console.log(error);
            fetchData();
          })}
        >
          <TextInput
            label="任务类别"
            placeholder="不同类别的任务权重不一样"
            {...mForm.getInputProps('taskCategory')}
          />
          <TextInput
            label="任务简介"
            placeholder="该类别当前执行中的任务"
            mt="md"
            {...mForm.getInputProps('taskName')}
          />
          <TextInput
            type="number"
            label="权重"
            placeholder="权重越高被分配的概率越大"
            mt="md"
            {...mForm.getInputProps('taskPower')}
          />
          <Button type="submit" mt="md">
            Submit
          </Button>
        </form>
      </Box>

      {taskList?.map((taskItem: any) => {
        return (
          <div
            className="mt-2 mr-2 pt-2 pb-2 flex flex-row justify-center items-center bg-blue-100 rounded-sm"
            key={taskItem.id}
          >
            <Text span className="mr-2">
              {taskItem.category_name}
            </Text>
            <Text span className="mr-2">
              {taskItem.task_name}
            </Text>
            <Text span className="mr-2">
              {taskItem.power}
            </Text>
            <ActionIcon
              color="red"
              variant="filled"
              onClick={async () => {
                const { data, error } = await supabase.from('tasks').delete().eq('id', taskItem.id);
                console.log(data);
                console.log(error);
                fetchData();
              }}
            >
              <IconTrashX size={16} />
            </ActionIcon>
          </div>
        );
      })}
    </div>
  );
}
