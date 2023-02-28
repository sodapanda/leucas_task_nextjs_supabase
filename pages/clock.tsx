import { useState, useEffect } from 'react';
import { ActionIcon } from '@mantine/core';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { IconBrandVolkswagen } from '@tabler/icons';

export default function Clock() {
  const supabase = useSupabaseClient();
  const [selectedTasks, setSelectedTasks] = useState<any[]>([]);

  function shuffleArray(array: any[]) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  async function handleSelectTasks() {
    let { data, error } = await supabase.from('tasks').select('*');
    if (error || !data || data.length == 0) {
      console.log('no data');
      return;
    }
    console.log(JSON.stringify(data));

    shuffleArray(data);
    console.log(JSON.stringify(data));
    // 复制一份原始任务数组
    const availableTasks = data.slice();
    const selectedTasks: any[] = [];

    for (let i = 0; i < 3; i++) {
      const totalWeight = availableTasks.reduce((sum, task) => sum + task.power, 0);
      const rand = Math.random() * totalWeight;
      let cumulativeWeight = 0;

      for (const task of availableTasks) {
        cumulativeWeight += task.power;
        if (cumulativeWeight >= rand) {
          selectedTasks.push(task);
          availableTasks.splice(availableTasks.indexOf(task), 1);
          break;
        }
      }
    }

    setSelectedTasks(selectedTasks);
  }

  return (
    <div className="w-full">
      <div className="w-full flex flex-row items-center justify-around bg-blue-50">
        <h4>{new Date().toLocaleDateString()}</h4>
        <ActionIcon color="blue" variant="filled" onClick={handleSelectTasks}>
          <IconBrandVolkswagen size={18} />
        </ActionIcon>
      </div>

      {selectedTasks.length > 0 && (
        <ul>
          {selectedTasks.map((task) => (
            <li key={task.id}>{task.task_name}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
