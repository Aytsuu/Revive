import { api } from "@/api/api";

export const AddUserAccount = async (username: string, email: string, password: string) => {
  try {
    const res = await api.post('app/api/create/user/', {
      username: username,
      email: email,
      password: password
    });

    return res;
  } catch (err) {
    throw err
  }
}