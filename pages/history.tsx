import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import { useState, useEffect } from 'react';

export default function History() {
  const supabase = useSupabaseClient();
  const user = useUser();

  const [historyList, setHistory] = useState<any>([]);

  useEffect(() => {
    supabase
      .from('daily_product_count')
      .select('*')
      .then((rst) => {
        setHistory(rst.data);
      });
  }, []);

  return (
    <div className="w-full">
      {historyList.map((historyItem: any) => {
        return (
          <div key={historyItem.task_date}>
            <span>{historyItem.task_date}</span>
            <span className="ml-2">{historyItem.total_count}</span>
          </div>
        );
      })}
    </div>
  );
}
