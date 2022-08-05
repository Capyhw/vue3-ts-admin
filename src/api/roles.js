import request from "./request";

//角色列表
export const getRoles = () => {
  return request({
    url: `roles`,
    method: "GET",
  });
};

//角色添加
export const addRole = (data) => {
  return request({
    url: `roles`,
    method: "POST",
    data,
  });
};

//删除角色
export const deleteRole = (id) => {
  return request({
    url: `roles/${id}`,
    method: "DELETE",
  });
};

//编辑角色
export const editRole = (id, data) => {
  return request({
    url: `roles/${id}`,
    method: "PUT",
    data,
  });
};

//删除某个角色的某个权限
export const deleteRolePermission = (roleId, rightId) => {
  return request({
    url: `roles/${roleId}/rights/${rightId}`,
    method: "DELETE",
  });
};

//权限列表
export const getPermissions = (type) => {
  return request({
    url: `rights/${type}`,
    method: "GET",
  });
};

//角色授权
export const grantRolePermission = (roleId, rids) => {
  return request({
    url: `roles/${roleId}/rights`,
    method: "POST",
    data: {
      rids,
    },
  });
};

//分配用户角色
export const setRoles = (uid, rid) => {
  return request({
    url: `users/${uid}/role`,
    method: "PUT",
    data: {
      rid,
    },
  });
};
