import { useState, useEffect } from 'react';
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/router';
import { Text, Divider, Group, Button } from '@mantine/core';

export default function Story() {
  const user = useUser();
  const supabase = useSupabaseClient();
  const router = useRouter();
  const [task, setTask] = useState({});
  const [idea, setIdea] = useState({});
  const [ideaMsg, setIdeaMsg] = useState('');

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

  return (
    <div className="w-full">
      <Text>{ideaMsg}</Text>
      <Divider my="sm" variant="dashed" />
      <Text>{task.features}</Text>
      <Divider my="sm" variant="dashed" />
      <Group position="right">
        <Button variant="outline">生成推广tweet</Button>
        <Button variant="outline">生成分镜</Button>
        <Button variant="outline">生成故事</Button>
      </Group>
    </div>
  );
}
