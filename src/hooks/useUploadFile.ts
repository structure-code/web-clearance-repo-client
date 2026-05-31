import { useMutation } from '@tanstack/react-query';
import { uploadFile } from '../api/files.api';

export const useUploadFile = () => {
  return useMutation({
    mutationFn: uploadFile,
  });
};
