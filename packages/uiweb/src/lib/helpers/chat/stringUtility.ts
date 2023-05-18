export const shortenUsername = (username: string) => {
    if (username?.length > 20) return username.substring(0, 20) + '...';
    else return username;
  };