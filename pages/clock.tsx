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
  const audioRef = useRef<any>();
  const [dayLeft, setDayLeft] = useState({});
  const [timeNeed, setTimeNeed] = useState({});
  const workHours = 8;

  const { days, hours, minutes, seconds, isRunning, start, pause, reset } = useStopwatch({
    autoStart: false,
  });

  useEffect(() => {
    audioRef.current = new Audio('/interface-soft-abbreviated-click-131438.mp3');
    getHistory();
    updateDayLeft();
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

    const cTasks = selectedTasks.slice();
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
        updateHistory(cTasks);
      }
    }
    setSelectedTasks(cTasks);

    updateDayLeft();
  }, [seconds]);

  useEffect(() => {
    updateTimeNeed(todayDuration);
  }, [todayDuration]);

  function updateDayLeft() {
    const remainingPercentage = calculateRemainingPercentage();
    setDayLeft({ width: `${remainingPercentage}%` });
  }

  function updateTimeNeed(todayDuration: string) {
    const workSeconds = workHours * 60 * 60;
    const durationSecond = TimeFormat.toS(todayDuration);
    const percent = Math.round(((workSeconds - durationSecond) * 100) / (24 * 60 * 60));
    // console.log(`percent is ${workSeconds} ${durationSecond} ${percent}`);
    setTimeNeed({ width: `${percent}%` });
  }

  async function updateHistory(cTasks: any[]) {
    tickCount.current = 0;
    let screenshotFileName = await (window as any).versions?.screenshot();
    if (!screenshotFileName) {
      screenshotFileName = 'empty';
    }

    const deepCopiedTaskList = JSON.parse(JSON.stringify(cTasks)) as any[];
    deepCopiedTaskList.map((item) => {
      item.status = undefined;
      item.clickDuration = undefined;
      return item;
    });

    await supabase.from('screen_shot').insert([
      {
        date: formattedDate,
        file_name: screenshotFileName,
        user_id: user?.id,
      },
    ]);

    await supabase.from('task_history').upsert(deepCopiedTaskList, { onConflict: 'id' });

    audioRef.current?.play();
  }

  useEffect(() => {
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
    let { data, error } = await supabase.from('tasks').select('*').eq('active', true);
    if (error || !data || data.length == 0) {
      console.log('no data');
      return;
    }
    data.map((item) => (item.status = 'stoped'));

    shuffleArray(data);
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
        task_category: taskItem.tasktype,
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

  function calculateRemainingPercentage() {
    const now = new Date();
    const percentageRemaining = (1 - (now.getHours() * 60 + now.getMinutes()) / (24 * 60)) * 100;
    return Math.floor(percentageRemaining);
  }

  return (
    <div className="w-full">
      <div className="w-full flex flex-row items-center justify-around bg-blue-50">
        <h4>{formattedDate}</h4>
        <Text c="blue" fz="lg" fw={700}>
          {todayDuration}
        </Text>

        {showGenBtn && (
          <ActionIcon color="blue" variant="filled" onClick={handleSelectTasks}>
            <IconRefreshDot size={18} />
          </ActionIcon>
        )}
      </div>

      <div className="h-8 bg-red-50" style={dayLeft}></div>
      <div className="h-8 bg-green-50" style={timeNeed}></div>

      {selectedTasks.length > 0 &&
        selectedTasks.map((task) => (
          <div key={task.id} className="flex flex-col mb-4 mt-2">
            <Text size="xs" className="ml-2">
              {task.task_category}
            </Text>
            <Text className="ml-2" fw={500}>
              {task.task_name}
            </Text>
            <div className="flex flex-row  justify-between items-center mt-1 bg-blue-50">
              <Text fw={700} c="blue" className="ml-2">
                {task.duration}
              </Text>
              {task.status === statusStoped && (
                <ActionIcon
                  className="mr-2"
                  color="blue"
                  variant="filled"
                  onClick={() => {
                    console.log('start');
                    timerClick(task.id, actionClickRun);
                    audioRef.current?.play();
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
          </div>
        ))}
    </div>
  );
}
