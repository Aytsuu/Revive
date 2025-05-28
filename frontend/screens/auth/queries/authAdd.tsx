import { useMutation } from '@tanstack/react-query'
import { addUserAccount, loginUserAccount } from '../rest_api/authPOST';

export const useAddUserAccount = () => {
  return useMutation({
    mutationFn: ({username, email, password} : {
      username: string;
      email: string;
      password: string;
    }) => addUserAccount(username, email, password)
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