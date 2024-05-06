export const tmdbFetch = (input, init) =>
  fetch(input, {
    headers: {
      Authorization: `Bearer ${process.env.TMDB_API_TOKEN}`
    },
    ...init
  });

export const fetcher = async (url) => {
  const res = await tmdbFetch(url);

  // If the status code is not in the range 200-299,
  // we still try to parse and throw it.
  if (!res.ok) {
    throw Error(`An error occurred while fetching the data for ${url}`);
  }

  return res.json();
};
