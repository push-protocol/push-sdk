export  const resolvePromisesSeq = async (tasks:any) => {
    const results = [];
    for (const task of tasks) {
      results.push(await task);
    }
    return results;
  };