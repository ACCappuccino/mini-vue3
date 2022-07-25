/*
 * @Author: Mocha
 * @Date: 2022-07-08 17:08:54
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-07-24 21:04:05
 * @Description:
 */
export const extend = Object.assign;

export const isObject = (val) => {
    return val !== null && typeof val === "object";
};
