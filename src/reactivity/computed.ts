/*
 * @Author: Mocha
 * @Date: 2022-08-14 16:12:37
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-08-14 19:01:00
 * @Description:
 */

import { ReactiveEffect } from "./effect";

class ComputedRefImpl {
    private _getter: any;
    private _dirty: boolean = true;
    private _value: any;
    private _effect: any;

    constructor(getter) {
        this._getter = getter;
        // 维护一个自己的effect
        this._effect = new ReactiveEffect(getter, () => {
            if (!this._dirty) {
                this._dirty = true;
            }
        });
    }
    get value() {
        // getter是用户自定义的取值方法
        if (this._dirty) {
            this._dirty = false;
            // 重新执行getter后的值
            this._value = this._effect.run();
        }
        return this._value;
    }
}
export function computed(getter) {
    // getter传进来的是一个方法
    return new ComputedRefImpl(getter);
}
