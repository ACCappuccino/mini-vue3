/*
 * @Author: Mocha
 * @Date: 2022-07-31 14:18:47
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-08-14 15:41:07
 * @Description:
 */

import { hasChanged, isObject } from "../shared";
import { trackEffects, triggerEffect, isTracking } from "./effect";
import { reactive } from "./reactive";
class RefImpl {
    private _value: any;
    public dep;
    private _rawValue: any; //用于记录没有被reactive之前的原始值
    public __v_isRef = true;
    constructor(value) {
        this._rawValue = value;
        this._value = convert(value);
        this.dep = new Set();
    }
    get value() {
        trackRefValue(this);
        return this._value;
    }
    set value(newValue) {
        // 判断是否相同的值要用rawValue判断
        if (hasChanged(this._rawValue, newValue)) {
            this._rawValue = newValue;
            this._value = convert(newValue);
            triggerEffect(this.dep);
        }
    }
}

// 重构： 抽离tracking逻辑
function trackRefValue(ref) {
    if (isTracking()) {
        // 处于tracking的时候才搜集依赖，不然会多次触发
        trackEffects(ref.dep);
    }
}

// 赋值value的时候根据是否对象分别赋值reactive(value)或value
function convert(value) {
    return isObject(value) ? reactive(value) : value;
}
export function ref(value) {
    return new RefImpl(value);
}
export function isRef(ref) {
    return !!ref.__v_isRef;
}
export function unRef(ref) {
    // 是否ref对象
    // ref对象 返回ref.value
    return isRef(ref) ? ref.value : ref;
}
export function proxyRefs(objectWithRefs) {
    // get set
    return new Proxy(objectWithRefs, {
        get(target, key) {
            return unRef(Reflect.get(target, key));
        },
        set(target, key, value) {
            if (isRef(target[key]) && !isRef(value)) {
                return (target[key].value = value);
            } else {
                return Reflect.set(target, key, value);
            }
        },
    });
}
