/*
 * @Author: Mocha
 * @Date: 2022-07-09 15:09:44
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-07-24 23:02:47
 * @Description: 抽离reactive的handle
 */
// 把reactive和isReadonly的get抽离出来做处理

import { extend, isObject } from "../shared";
import { track, trigger } from "./effect";
import { reactive, ReactiveFlags, readonly } from "./reactive";

const get = createGetter();
const set = createSetter();
const readonlyGet = createGetter(true);
const shallowReadonlyGet = createGetter(true, true);

function createGetter(isReadonly = false, shallow = false) {
    return function get(target, key) {
        if (key === ReactiveFlags.IS_REACTIVE) {
            return !isReadonly;
        } else if (key === ReactiveFlags.IS_READONLY) {
            return isReadonly;
        }
        const res = Reflect.get(target, key);
        // 如果是shallow readonly 不用走嵌套响应式和非readonly的逻辑
        if (shallow) return res;
        // 看看res是不是Object
        if (isObject(res)) {
            return isReadonly ? readonly(res) : reactive(res);
        }
        if (!isReadonly) {
            // 搜集依赖
            track(target, key);
        }
        return res;
    };
}

function createSetter() {
    return function set(target, key, value) {
        const res = Reflect.set(target, key, value);
        trigger(target, key);
        return res;
    };
}

export const mutableHandlers = {
    get,
    set,
};

export const readonlyHandlers = {
    get: readonlyGet,
    set(target, key, value) {
        // readonly 的响应式对象不可以修改值
        console.warn(
            `Set operation on key "${String(key)}" failed: target is readonly.`,
            target
        );
        return true;
    },
};

export const shallowReadonlyHandlers = extend({}, readonlyHandlers, {
    get: shallowReadonlyGet,
});
