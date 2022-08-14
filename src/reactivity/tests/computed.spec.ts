/*
 * @Author: Mocha
 * @Date: 2022-08-14 16:12:14
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-08-14 18:30:48
 * @Description:
 */
import { computed } from "../computed";
import { reactive } from "../reactive";

describe("computed", () => {
    it("happy path", () => {
        const user = reactive({
            age: 10,
        });
        const age = computed(() => {
            return user.age;
        });
        expect(age.value).toBe(10);
    });
    // compute lazily
    it("should be compute lazily", () => {
        const value = reactive({
            foo: 1,
        });
        const getter = jest.fn(() => {
            return value.foo;
        });
        const cValue = computed(getter);
        // lazy
        // 创建computed值的时候，getter是没有被调用的
        expect(getter).not.toHaveBeenCalled();

        expect(cValue.value).toBe(1);
        expect(getter).toBeCalledTimes(1);

        // should not compute again
        // 值没变化的情况下不会再次被调用
        cValue.value;
        expect(getter).toHaveBeenCalledTimes(1);

        // should not compute until needed
        value.foo = 2; // trigger -> effect -> get 重新执行
        expect(getter).toHaveBeenCalledTimes(1);

        // now it should be compute
        expect(cValue.value).toBe(2);
        expect(getter).toHaveBeenCalledTimes(2);

        // should compute again
        cValue.value; // get
        expect(getter).toHaveBeenCalledTimes(2);
    });
});
