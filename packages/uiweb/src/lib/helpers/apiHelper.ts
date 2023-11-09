export const pollAPI = async <T>(fetchData: () => Promise<T>, interval: number): Promise<void> => {
  try {
    await fetchData();
    setTimeout(() => pollAPI(fetchData, interval), interval);
  } catch (error) {
    console.error('Error polling API:', error);
    // Handle error if needed
  }
};
