const isJSON = (inputStr: string) => {
  try {
    return JSON.parse(inputStr) && !!inputStr;
  } catch (e) {
    return false;
  }
};

export default isJSON;
