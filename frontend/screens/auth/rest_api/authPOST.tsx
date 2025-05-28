import { api } from "@/api/api";

export const addUserAccount = async (data: Record<string, any>) => {
  try {
    console.log(data)
    const res = await api.post("app/api/create/user/", data);

    return res.data;
  } catch (err) {
    throw err;
  }
};

export const loginUserAccount = async (
  email_or_username: string,
  password: string
) => {
  try {
    console.log({
      email_or_username: email_or_username,
      password: password
    })
    const res = await api.post('app/api/login/user/', {
      email_or_username: email_or_username,
      password: password
    })

    return res.data
  } catch (err) {
    throw err;
  }
};
