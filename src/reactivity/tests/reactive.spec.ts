/*
 * @Author: Mocha
 * @Date: 2022-06-29 11:50:30
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-07-24 21:29:58
 * @Description:
 */
import { isReactive, reactive } from "../reactive";

describe("reactive", () => {
    it("happy path", () => {
        const original = { foo: 1 };
        const observed = reactive(original);
        expect(observed).not.toBe(original);
        expect(observed.foo).toBe(1);
        expect(isReactive(observed)).toBe(true);
        expect(isReactive(original)).toBe(false);
    });
    // 嵌套reactive
    it("nested reactive", () => {
        const original = {
            nested: {
                foo: 1,
            },
            array: [{ bar: 2 }],
        };
        const observed = reactive(original);
        expect(isReactive(observed.nested)).toBe(true);
        expect(isReactive(observed.array)).toBe(true);
        expect(isReactive(observed.array[0])).toBe(true);
    });
});
