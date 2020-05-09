import { AsyncStorage } from "react-native";

export const getItem = async (USER_KEY) => await AsyncStorage.getItem(USER_KEY);

export const onSignIn = async (USER_KEY,value) => await AsyncStorage.setItem(USER_KEY, value);

export const onSignOut = async (USER_KEY) => {try {await AsyncStorage.removeItem(USER_KEY);
    return 'Selection removed from disk.';
  } catch (error) {
    return error.message;
  }}
