const cleanLocalStorage = () => {
  const keepKeys = ['appBuildVersion', 'appLanguage'];

  Object.keys(localStorage).forEach((key) => {
    if (!keepKeys.includes(key)) {
      localStorage.removeItem(key);
    }
  });
};

export default cleanLocalStorage;
