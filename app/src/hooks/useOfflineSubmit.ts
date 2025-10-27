import { useAsyncStorage } from '@/hooks/useAsyncStorage';

import { FormDataDto, ISaveResponse } from '@/@types/form';


export const useOfflineSubmit = () => {
  const { getAsyncStorage, setAsyncStorage } = useAsyncStorage();

  const handleSaveOffline = async (data: FormDataDto): Promise<ISaveResponse> => {
    const formDataFile = await getAsyncStorage('formData') as FormDataDto[] | null;

    setAsyncStorage('formData', formDataFile ? [...formDataFile, data] : [data]);

    return {
      status: true
    }
  }

  return { handleSaveOffline }
};

export default useOfflineSubmit;
