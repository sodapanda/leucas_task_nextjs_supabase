import { useState, useEffect } from 'react';
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react';
import { Text, Divider, Group, Button, Box, TextInput } from '@mantine/core';
import { Skeleton } from '@mantine/core';

export default function Story() {
  const user = useUser();
  const supabase = useSupabaseClient();
  const [task, setTask] = useState({});
  const [idea, setIdea] = useState({});
  const [ideaMsg, setIdeaMsg] = useState('');
  const [gptResult, setGptResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apikey, setApiKey] = useState('');

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const taskIdParam = searchParams.get('taskid');
    updateTask(taskIdParam);
  }, []);

  useEffect(() => {
    setIdeaMsg(
      `${idea.role_name} ${idea.trouble_name}.因为${idea.superpower_name},所以可以${idea.new_insight},从而${idea.idea_name}.我适合做这个产品因为${idea.advantage}.产品推广关键词如下:${idea.keyword}`
    );
  }, [idea]);

  async function updateTask(taskId) {
    const { data, error } = await supabase.from('tasks').select('*').eq('id', taskId);

    if (error) {
      alert(error.message);
      return;
    }
    console.log(data);
    setTask(data[0]);

    updateIdea(data[0].idea_id);
  }

  async function updateIdea(ideaId) {
    const { data, error } = await supabase.from('idea_view').select('*').eq('id', ideaId);
    console.log(data);
    if (error) {
      alert(error.message);
      return;
    }

    setIdea(data[0]);
  }

  async function callOpenAi(prompt, callback) {
    setIsLoading(true);
    const rst = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apikey}`,
      },
      body: JSON.stringify({
        model: `gpt-3.5-turbo`,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      }),
    });

    const response = await rst.json();
    const result = response.choices[0].message.content;
    callback(result);
    setIsLoading(false);
  }

  return (
    <Box component="div" className="w-full" px="xs">
      <TextInput
        label="api Key"
        placeholder="sk-xxx"
        value={apikey}
        onChange={(event) => {
          setApiKey(event.target.value);
        }}
      />
      <Text>{ideaMsg}</Text>
      <Divider my="sm" variant="dashed" />
      <Text>{task.features}</Text>
      <Divider my="sm" variant="dashed" />
      <Group position="right">
        <Button
          variant="outline"
          onClick={async () => {
            await callOpenAi(
              `产品名字叫做${task.task_name}\n 产品定位${ideaMsg} \n 产品功能 ${task.features} \n 请生成推广Tweet \n要求包含emoji,包含产品关键功能,不要太浮夸,用中文输出:`,
              (result) => {
                setGptResult(result);
              }
            );
          }}
        >
          生成推广tweet
        </Button>
        <Button
          variant="outline"
          onClick={async () => {
            await callOpenAi(
              `产品名字叫做${task.task_name}\n 产品定位${ideaMsg} \n 产品功能 ${task.features} \n请生成推广视频分镜`,
              (result) => {
                setGptResult(result);
              }
            );
          }}
        >
          生成分镜
        </Button>
        <Button
          variant="outline"
          onClick={async () => {
            await callOpenAi(
              `要求使用中文回答。产品名字叫做${task.task_name}\n 产品定位${ideaMsg} \n 产品功能 ${task.features} \n 请以推广${task.task_name}为目的生成一个故事。`,
              (result) => {
                setGptResult(result);
              }
            );
          }}
        >
          生成故事
        </Button>
      </Group>

      {isLoading ? (
        <Box mt="sm" component="div">
          <Skeleton height={8} radius="xl" />
          <Skeleton height={8} mt={6} radius="xl" />
          <Skeleton height={8} mt={6} width="70%" radius="xl" />
        </Box>
      ) : (
        <Text mt="sm">{gptResult}</Text>
      )}
    </Box>
  );
}
