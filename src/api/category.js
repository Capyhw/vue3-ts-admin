import request from "./request";

//获取商品列表
export const getGoodsList = (params) => {
  return request({
    url: "categories",
    method: "GET",
    params,
  });
};

//添加分类
export const addCategory = (data) => {
  return request({
    url: "categories",
    method: "POST",
    data,
  });
};

//删除分类
export const deleteCategory = (id) => {
  return request({
    url: `categories/${id}`,
    method: "DELETE",
  });
};

//编辑分类
export const editCategory = (id, cat_name) => {
  return request({
    url: `categories/${id}`,
    method: "PUT",
    data: {
      cat_name,
    },
  });
};
