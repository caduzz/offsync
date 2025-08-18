import AsyncStorage from "@react-native-async-storage/async-storage";

export const useAsyncStorage = () => {
    const getAsyncStorage = async (type: string) => {
        const res = await AsyncStorage.getItem(type)
        if(res){
            const data = JSON.parse(res);
            return data;
        }
        return null
    }

    const setAsyncStorage = (type: string, value: {} | null) => {
        const data = JSON.stringify(value);
        AsyncStorage.setItem(type, data);
    }

    return { getAsyncStorage, setAsyncStorage };
};
