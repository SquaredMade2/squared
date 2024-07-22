import axios from 'axios';

export const deletingUserFromWorkspace = async (memberId: string, workspaceId: string) => {
  try {
    const { data } = await axios({
      method: 'DELETE',
      url: `${process.env.NEXT_PUBLIC_SERVER}/workspace/delete-user`,
      data: {
        workspaceId: workspaceId,
        userId: memberId,
      },
    });
    return data;
  } catch (err) {
    console.error(err);
  }
};

export const updateTheUsersRole = async (memberId: string, workspaceId: string, role: string) => {
  try {
    const { data } = await axios({
      method: 'PUT',
      url: `${process.env.NEXT_PUBLIC_SERVER}/workspace/update-role`,
      withCredentials: true,
      data: {
        userId: memberId,
        workspaceId: workspaceId,
        role: role,
      },
    });
    return data;
  } catch (error) {
    console.error(error);
  }
};

export const updateUsersInfo = async (id: string, username: string, name: string) => {
  const { data } = await axios({
    method: 'PUT',
    url: `${process.env.NEXT_PUBLIC_SERVER}/auth/updateProfile`,
    withCredentials: true,
    params: {
      id,
      username,
      name,
    },
  });
  return data;
};
