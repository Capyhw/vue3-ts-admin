import request from "./request";

//获取订单列表
export function get(params) {
  return request({
    url: "orders",
    method: "get",
    params,
  });
}
