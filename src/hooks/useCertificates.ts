import { useQuery } from '@tanstack/react-query';
import { getMyCertificate, verifyCertificate } from '../api/certificates.api';

export const useMyCertificate = () => {
  return useQuery({
    queryKey: ['certificates', 'mine'],
    queryFn: getMyCertificate,
  });
};

export const useVerifyCertificate = (token: string) => {
  return useQuery({
    queryKey: ['certificates', 'verify', token],
    queryFn: () => verifyCertificate(token),
    enabled: !!token,
    retry: false,
  });
};
