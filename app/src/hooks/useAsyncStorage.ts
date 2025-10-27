import AsyncStorage from "@react-native-async-storage/async-storage";

interface AsyncStorageType {
    getAsyncStorage: (type: string) => Promise<null | {}>;
    setAsyncStorage: (type: string, value: {} | null) => void;
    removeAsyncStorage: (type: string) => void;
}

export const useAsyncStorage = (): AsyncStorageType => {
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

    const removeAsyncStorage = (type: string) => {
        AsyncStorage.removeItem(type);
    }

    return { getAsyncStorage, setAsyncStorage, removeAsyncStorage };
};
