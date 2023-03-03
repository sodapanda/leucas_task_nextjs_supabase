import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import { useState, useEffect } from 'react';
import { ActionIcon, Text } from '@mantine/core';

const TimeFormat = require('hh-mm-ss');

export default function History() {
  const supabase = useSupabaseClient();
  const user = useUser();

  const [historyList, setHistory] = useState<any>([]);

  useEffect(() => {
    supabase
      .from('daily_product_count')
      .select('*')
      .then((rst) => {
        rst.data?.map((historyItem) => {
          const totalCountSeconds = TimeFormat.toS(historyItem.total_count);
          historyItem.isDone = true;
          if (totalCountSeconds < 8 * 3600) {
            historyItem.isDone = false;
          }
          return historyItem;
        });
        setHistory(rst.data);
      });
  }, []);

  return (
    <div className="w-full">
      {historyList.map((historyItem: any) => {
        return (
          <div
            key={historyItem.task_date}
            className="flex flex-row justify-between items-center mt-2 mb-2"
          >
            <Text fw={500} className="ml-2">
              {historyItem.task_date}
            </Text>
            <Text fw={700} c={historyItem.isDone ? 'blue' : 'red'} className="mr-2">
              {historyItem.total_count}
            </Text>
          </div>
        );
      })}
    </div>
  );
}
