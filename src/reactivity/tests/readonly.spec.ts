/*
 * @Author: Mocha
 * @Date: 2022-07-08 17:22:07
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-07-25 21:29:36
 * @Description: readonly test
 */

import { isReadonly, readonly, isProxy } from "../reactive";

describe("readonly", () => {
    it("happy path", () => {
        const original = { foo: 1, bar: { baz: 2 } };
        const wrapped = readonly(original);
        expect(wrapped).not.toBe(original);
        expect(isReadonly(wrapped)).toBe(true);
        expect(wrapped.foo).toBe(1);
        expect(isProxy(wrapped)).toBe(true);
    });
    it("warn then call set", () => {
        // console.log()
        console.warn = jest.fn();
        const user = readonly({
            age: 10,
        });
        user.age = 11;
        expect(console.warn).toBeCalled();
    });
});
