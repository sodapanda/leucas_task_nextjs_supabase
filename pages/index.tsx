import { ColorSchemeToggle } from '../components/ColorSchemeToggle/ColorSchemeToggle';
import { Auth } from '@supabase/auth-ui-react';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/router';

export default function HomePage() {
  const session = useSession();
  const supabase = useSupabaseClient();
  const router = useRouter();

  if (session) {
    router.push('/clock');

    return (
      <div>
        <h3>已经登陆</h3>
        <ColorSchemeToggle />
      </div>
    );
  } else {
    return (
      <div className="w-full overflow-x bg-red-50">
        <Auth supabaseClient={supabase} />
      </div>
    );
  }
}
