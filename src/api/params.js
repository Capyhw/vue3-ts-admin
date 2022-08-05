import request from "./request";

// 获取参数列表
export function getParamsList(id, sel) {
  return request({
    url: `categories/${id}/attributes`,
    method: "get",
    params: {
      sel,
    },
  });
}

//添加参数
export function addParams(id, data) {
  return request({
    url: `categories/${id}/attributes`,
    method: "post",
    data,
  });
}

//删除参数
export function delParams(id, attr_id) {
  return request({
    url: `categories/${id}/attributes/${attr_id}`,
    method: "delete",
  });
}

//编辑参数
export function editParams(id, attr_id, data) {
  return request({
    url: `categories/${id}/attributes/${attr_id}`,
    method: "put",
    data,
  });
}
