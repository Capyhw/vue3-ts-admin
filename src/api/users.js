import request from "./request";

//获取用户列表
export const users = (params) => {
  return request({
    url: "/users",
    method: "GET",
    params,
  });
};

//根据id获取用户信息(未使用)
export const user = (id) => {
  return request({
    url: `/users/${id}`,
    method: "GET",
  });
};

//改变用户状态
export const changeUserStatus = (uid, type) => {
  return request({
    url: `/users/${uid}/state/${type}`,
    method: "PUT",
  });
};

//添加用户
export const addUser = (data) => {
  return request({
    url: "users",
    method: "POST",
    data,
  });
};

//编辑用户
export const editUser = (data) => {
  return request({
    url: `users/${data.id}`,
    method: "PUT",
    data,
  });
};

//删除用户
export const deleteUser = (uid) => {
  return request({
    url: `users/${uid}`,
    method: "DELETE",
  });
};

//分配角色
export const setUserRoles = (uid, rid) => {
  return request({
    url: `users/${uid}/role`,
    method: "PUT",
    data: { rid },
  });
};
