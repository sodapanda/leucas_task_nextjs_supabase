import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { Text, ActionIcon } from '@mantine/core';
import { IconArrowLeft } from '@tabler/icons';

export default function ScreenShot() {
  const router = useRouter();
  const supabase = useSupabaseClient();
  const { historyDate } = router.query;
  const [screenshotList, setScreenshotList] = useState([]);

  useEffect(() => {
    updateScreenshot();
  }, []);

  async function updateScreenshot() {
    let { data: screen_shot, error } = await supabase
      .from('screen_shot')
      .select('*')
      .eq('date', historyDate);

    if (error) {
      console.log(error);
      return;
    }

    setScreenshotList(screen_shot);
  }

  return (
    <div className="w-full">
      <div className="flex flex-row items-center mt-2">
        <ActionIcon
          className="ml-2"
          color="blue"
          variant="filled"
          onClick={() => {
            router.push('/history');
          }}
        >
          <IconArrowLeft size={18} />
        </ActionIcon>
        <Text className="ml-2">{historyDate}</Text>
      </div>
      {screenshotList.map((screenshot) => {
        return (
          <div key={screenshot.id} className="w-full">
            <img
              src={`http://192.168.2.102:7080/${screenshot.file_name}`}
              alt="pic"
              className="w-full mt-2"
            />
          </div>
        );
      })}
    </div>
  );
}
