/*
 * @Author: Mocha
 * @Date: 2022-06-29 11:52:09
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-07-24 23:03:23
 * @Description: reactive的实现
 */

import {
    mutableHandlers,
    readonlyHandlers,
    shallowReadonlyHandlers,
} from "./baseHandler";

export const enum ReactiveFlags {
    IS_REACTIVE = "__v-isReactive",
    IS_READONLY = "__v-isReadonly",
}
export function reactive(raw) {
    return createActiveObject(raw, mutableHandlers);
}

export function readonly(raw) {
    return createActiveObject(raw, readonlyHandlers);
}
export function shallowReadonly(raw) {
    return createActiveObject(raw, shallowReadonlyHandlers);
}

export function isReadonly(value) {
    return !!value[ReactiveFlags.IS_READONLY];
}

export function isReactive(value) {
    // !!如果是undefined 返回false
    return !!value[ReactiveFlags.IS_REACTIVE];
}

export function createActiveObject(raw: any, baseHandlers) {
    return new Proxy(raw, baseHandlers);
}
