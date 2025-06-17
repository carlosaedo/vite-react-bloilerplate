const cleanLocalStorage = () => {
  const keepKeys = ['appBuildVersion', 'appLanguage'];

  for (const key of Object.keys(localStorage)) {
    if (!keepKeys.includes(key)) {
      localStorage.removeItem(key);
    }
  }
};

export default cleanLocalStorage;
