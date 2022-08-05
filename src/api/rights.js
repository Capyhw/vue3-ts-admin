import request from "./request";

// 获取权限列表
export const getRights = (type) => {
  return request({
    url: `rights/${type}`,
    method: "GET",
  });
};
