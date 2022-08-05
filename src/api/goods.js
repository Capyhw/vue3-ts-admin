import request from "./request";

//获取商品列表
export const getList = (params) => {
  return request({
    url: "goods",
    method: "GET",
    params,
  });
};

//修改商品
export const update = (id, data) => {
  return request({
    url: `goods/${id}`,
    method: "PUT",
    data,
  });
};
//删除商品
export const deleteGoods = (id) => {
  return request({
    url: `goods/${id}`,
    method: "DELETE",
  });
};

//添加商品
export const add = (data) => {
  return request({
    url: "goods",
    method: "POST",
    data,
  });
};

//编辑商品
export const edit = (id, data) => {
  return request({
    url: `goods${id}`,
    method: "PUT",
    data,
  });
};
