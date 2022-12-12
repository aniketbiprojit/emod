import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function Home() {
  const { push } = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) push('/dashboard');
    else push('/login');
  }, []);

  return <h1 className="text-3xl font-bold underline text-center"></h1>;
}
