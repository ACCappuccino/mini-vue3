/*
 * @Author: Mocha
 * @Date: 2022-06-29 14:26:39
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-08-14 18:54:14
 * @Description:
 */

import { extend } from "../shared";

let activeEffective; // 全局变量activeEffective
let shouldTrack; // 是否应该搜集依赖
export class ReactiveEffect {
    private _fn: any;
    deps = [];
    active = true; // stop状态
    onStop?: () => void;
    constructor(fn, public scheduler?: Function) {
        this._fn = fn;
        this.scheduler = scheduler;
    }
    run() {
        // 会搜集依赖
        // 用shouldTrack 来做区分
        if (!this.active) {
            // 处于stop状态
            return this._fn();
        }
        // 不是stop状态
        activeEffective = this;
        shouldTrack = true;

        const result = this._fn();
        // reset shouldTrack
        shouldTrack = false;
        return result;
    }
    stop() {
        if (this.active) {
            cleanupEffect(this);
            if (this.onStop) {
                this.onStop();
            }
            this.active = false;
        }
    }
}

function cleanupEffect(effect) {
    // 找到所有依赖这个 effect 的响应式对象
    // 从这些响应式对象里面把 effect 给删除掉
    effect.deps.forEach((dep) => {
        dep.delete(effect);
    });
    effect.deps.length = 0; // 清空依赖后 长度归0
}
const targetMap = new Map();

// 依赖搜集
export function track(target, key) {
    if (!isTracking()) return; // 如果不是一个正在搜集依赖的状态 不需要走下边的逻辑
    // target ->  key -> dep
    let depsMap = targetMap.get(target);
    // 初始化的时候depsMap不存在，则创建
    if (!depsMap) {
        depsMap = new Map();
        targetMap.set(target, depsMap);
    }
    // 如果存在则取到dep
    let dep = depsMap.get(key);

    // 刚开始dep不存在，也初始化
    if (!dep) {
        dep = new Set();
        // 创建完了存到depsMap中
        depsMap.set(key, dep);
    }
    trackEffects(dep);
}

// 抽离封装依赖收集 ref那边也会用到
export function trackEffects(dep) {
    // 如果已经在dep中 就不需要搜集了
    if (dep.has(activeEffective)) return;
    dep.add(activeEffective);
    // 反向搜集依赖 用于stop的时候从effect中的deps取出
    activeEffective.deps.push(dep);
}

// 依赖触发
export function trigger(target, key) {
    let depsMap = targetMap.get(target);
    let dep = depsMap.get(key);
    triggerEffect(dep);
}
export function triggerEffect(dep) {
    for (const effect of dep) {
        if (effect.scheduler) {
            effect.scheduler();
        } else {
            effect.run();
        }
    }
}
export function effect(fn, options: any = {}) {
    const _effect = new ReactiveEffect(fn, options.scheduler);
    _effect.run();
    // 重构点
    // refactor 1 options上的参数赋值给_effect
    // _effect.onStop = options.onStop;
    // Object.assign(_effect, options);
    extend(_effect, options);
    const runner: any = _effect.run.bind(_effect);
    runner.effect = _effect;
    return runner;
}

export function stop(runner) {
    // stop方法在effect实例上
    runner.effect.stop();
}

export function isTracking() {
    return shouldTrack && activeEffective !== undefined;
}
