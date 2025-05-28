import { useMutation } from '@tanstack/react-query'
import { addUserAccount, loginUserAccount } from '../rest_api/authPOST';

export const useAddUserAccount = () => {
  return useMutation({
    mutationFn: ( data: Record<string, any>) => addUserAccount(data)
  })
}

export const useLoginUserAccount = () => {
  return useMutation({
    mutationFn: ({ email_or_username, password} : {
      email_or_username: string;
      password: string;
    }) => loginUserAccount(email_or_username, password)
  })
}