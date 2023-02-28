import { Welcome } from '../components/Welcome/Welcome';
import { ColorSchemeToggle } from '../components/ColorSchemeToggle/ColorSchemeToggle';
import { Auth } from '@supabase/auth-ui-react';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import Account from '../components/Account/Account';

export default function HomePage() {
  const session = useSession();
  const supabase = useSupabaseClient();

  return (
    <>
      <Welcome />
      <ColorSchemeToggle />
      <h1 className="text-3xl font-bold underline">Hello world!</h1>

      <div className="container" style={{ padding: '50px 0 100px 0' }}>
        {!session ? <Auth supabaseClient={supabase} /> : <Account session={session} />}
      </div>
    </>
  );
}
