import { useState, useEffect, useRef } from 'react';
import { ActionIcon, Text } from '@mantine/core';
import { format } from 'date-fns';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import { useStopwatch } from 'react-timer-hook';

import {
  IconBrandVolkswagen,
  IconRefreshDot,
  IconPlayerPlay,
  IconPlayerPause,
} from '@tabler/icons';
const statusRuning = 'runing';
const statusStoped = 'stoped';
const statusDisabled = 'disabled';
const actionClickRun = 'clickRun';
const actionClickStop = 'clickStop';

const TimeFormat = require('hh-mm-ss');

export default function Clock() {
  const supabase = useSupabaseClient();
  const user = useUser();
  const [selectedTasks, setSelectedTasks] = useState<any[]>([]);
  const [todayDuration, setDuration] = useState('00:00:00');
  const [showGenBtn, setShowGenBtn] = useState(false);
  const formattedDate = format(new Date(), 'yyyy/MM/dd');
  const tickCount = useRef(0);

  const { days, hours, minutes, seconds, isRunning, start, pause, reset } = useStopwatch({
    autoStart: false,
  });

  useEffect(() => {
    getHistory();
    supabase
      .from('daily_product_count')
      .select('*')
      .eq('task_date', formattedDate)
      .then(({ error, data }) => {
        if (!error && data.length > 0) {
          setDuration(data[0].total_count);
        }
      });

    return () => {
      if (isRunning) {
        pause();
      }
    };
  }, []);

  useEffect(() => {
    tickCount.current = tickCount.current + 1;
    setSelectedTasks((tasks) => {
      const cTasks = tasks.slice();
      const target = cTasks.find((task) => task.status === statusRuning);
      if (target) {
        const runDuration = hours * 3600 + minutes * 60 + seconds;
        const currentDuration = target.clickDuration + runDuration;
        target.duration = TimeFormat.fromS(currentDuration, 'hh:mm:ss');

        let totalS = 0;
        for (const task of cTasks) {
          totalS = totalS + TimeFormat.toS(task.duration);
        }
        setDuration(TimeFormat.fromS(totalS, 'hh:mm:ss'));

        if (tickCount.current >= 10) {
          tickCount.current = 0;
          const deepCopiedTaskList = JSON.parse(JSON.stringify(cTasks)) as any[];
          deepCopiedTaskList.map((item) => {
            item.status = undefined;
            item.clickDuration = undefined;
            return item;
          });
          supabase
            .from('task_history')
            .upsert(deepCopiedTaskList, { onConflict: 'id' })
            .then((res) => {
              console.log(res);
            });
        }
      }
      return cTasks;
    });
  }, [seconds]);

  useEffect(() => {
    // console.log(selectedTasks);
    if (selectedTasks && selectedTasks.length > 0) {
      setShowGenBtn(false);
    } else {
      setShowGenBtn(true);
    }
  }, [selectedTasks]);

  function getHistory() {
    supabase
      .from('task_history')
      .select('*')
      .eq('task_date', formattedDate)
      .then(({ error, data }) => {
        if (!error && data.length > 0) {
          data.map((item) => {
            item.status = 'stoped';
            return item;
          });
          // console.log(data);
          setSelectedTasks(data);
        }
      });
  }

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
    data.map((item) => (item.status = 'stoped'));
    // console.log(JSON.stringify(data));

    shuffleArray(data);
    // console.log(JSON.stringify(data));
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

    const taskList = [];
    for (const taskItem of selectedTasks) {
      taskList.push({
        task_date: formattedDate,
        task_id: taskItem.id,
        task_category: taskItem.category_name,
        task_name: taskItem.task_name,
        duration: '00:00:00',
        user_id: user?.id,
      });
    }

    const history = await supabase.from('task_history').insert(taskList);
    if (history.error) {
      console.log(history.error);
    }

    getHistory();
  }

  function timerClick(id: number, action: string) {
    const taskList = selectedTasks.slice();
    const target = taskList.find((item) => item.id === id);
    if (target) {
      if (action === actionClickRun) {
        target.status = statusRuning;
        target.clickDuration = TimeFormat.toS(target.duration);
        reset();
      } else if (action === actionClickStop) {
        target.status = statusStoped;
        pause();
      }
    }

    const anyOneRuning = taskList.some((item) => item.status === statusRuning);
    if (anyOneRuning) {
      for (const item of taskList) {
        if (item.status !== statusRuning) {
          item.status = statusDisabled;
        }
      }
    } else {
      for (const item of taskList) {
        item.status = statusStoped;
      }
    }

    setSelectedTasks(taskList);
  }

  return (
    <div className="w-full">
      <div className="w-full flex flex-row items-center justify-around bg-blue-50">
        <h4>{formattedDate}</h4>
        <Text>今日总时长{todayDuration}</Text>

        {showGenBtn && (
          <ActionIcon color="blue" variant="filled" onClick={handleSelectTasks}>
            <IconRefreshDot size={18} />
          </ActionIcon>
        )}
      </div>

      {selectedTasks.length > 0 &&
        selectedTasks.map((task) => (
          <div key={task.id} className="flex flex-row justify-between mb-2">
            <Text className="ml-2">
              {task.task_category} {task.task_name}
            </Text>
            <Text>{task.duration}</Text>
            {task.status === statusStoped && (
              <ActionIcon
                className="mr-2"
                color="blue"
                variant="filled"
                onClick={() => {
                  console.log('start');
                  timerClick(task.id, actionClickRun);
                }}
              >
                <IconPlayerPlay size={18} />
              </ActionIcon>
            )}
            {task.status === statusRuning && (
              <ActionIcon
                className="mr-2"
                color="blue"
                variant="filled"
                onClick={() => {
                  console.log('start');
                  timerClick(task.id, actionClickStop);
                }}
              >
                <IconPlayerPause size={18} />
              </ActionIcon>
            )}
            {task.status === statusDisabled && (
              <ActionIcon
                disabled
                className="mr-2"
                color="blue"
                variant="filled"
                onClick={() => {
                  console.log('start');
                }}
              >
                <IconPlayerPlay size={18} />
              </ActionIcon>
            )}
          </div>
        ))}
    </div>
  );
}
