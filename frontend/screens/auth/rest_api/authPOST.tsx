import { api } from "@/api/api";

export const addUserAccount = async (
  username: string,
  email: string,
  password: string
) => {
  try {
    console.log({
      username: username,
      email: email,
      password: password,
    })
    const res = await api.post("app/api/create/user/", {
      username: username,
      email: email,
      password: password,
    });

    return res;
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
