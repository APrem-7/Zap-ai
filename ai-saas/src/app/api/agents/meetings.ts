export const getMeetings = async (page?: number, pageSize?: number) => {
  const url = new URL('http://localhost:8000/meetings');
  if (page) {
    url.searchParams.set('page', page.toString());
  }
  if (pageSize) {
    url.searchParams.set('pageSize', pageSize.toString());
  }

  const res = await fetch(url, {
    method: 'GET',
    credentials: 'include', // IMPORTANT: sends cookies for session
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch agents: ${res.status}`);
  }

  const res_data = await res.json();
  return res_data;
};
