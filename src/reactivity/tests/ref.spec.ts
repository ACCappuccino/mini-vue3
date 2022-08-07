/*
 * @Author: Mocha
 * @Date: 2022-07-31 14:17:57
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-08-07 14:58:32
 * @Description:
 */
import { effect } from "../effect";
import { reactive } from "../reactive";
import { ref, isRef, unRef } from "../ref";

describe("ref", () => {
    it("happy path", () => {
        const a = ref(1);
        expect(a.value).toBe(1);
    });
    it("should be reactive", () => {
        const a = ref(1);
        let dummy;
        let calls = 0;
        effect(() => {
            calls++;
            dummy = a.value;
        });
        expect(calls).toBe(1);
        expect(dummy).toBe(1);
        a.value = 2;
        expect(calls).toBe(2);
        expect(dummy).toBe(2);
        // same value should not trigger
        a.value = 2;
        expect(calls).toBe(2);
        expect(dummy).toBe(2);
    });
    it("should be a nested properties reactive", () => {
        const a = ref({
            count: 1,
        });
        let dummy;
        effect(() => {
            dummy = a.value.count;
        });
        expect(dummy).toBe(1);
        a.value.count = 2;
        expect(dummy).toBe(2);
    });

    //isRef unRef
    it("isRef", () => {
        const a = ref(1);
        const user = reactive({
            age: 1,
        });
        expect(isRef(a)).toBe(true);
        expect(isRef(1)).toBe(false);
        expect(isRef(user)).toBe(false);
    });
    // unRef
    it("unRef", () => {
        const a = ref(1);
        expect(unRef(a)).toBe(1);
        expect(unRef(1)).toBe(1);
    });
});
