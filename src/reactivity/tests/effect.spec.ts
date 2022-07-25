/*
 * @Author: Mocha
 * @Date: 2022-06-29 10:43:02
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-07-24 17:29:52
 * @Description:
 */

import { effect, stop } from "../effect";
import { reactive } from "../reactive";

describe("effect", () => {
    it("happy path", () => {
        const user = reactive({
            age: 10,
        });
        let nextAge;
        effect(() => {
            nextAge = user.age + 1;
        });
        expect(nextAge).toBe(11);
        // update
        user.age++;
        expect(nextAge).toBe(12);
    });
    // effect调用后会返回一个runner
    it("effect should return runner", () => {
        let foo = 10;
        const runner = effect(() => {
            foo++;
            return "foo";
        });
        expect(foo).toBe(11);
        const r = runner(); // 第二次执行effect
        expect(foo).toBe(12);
        expect(r).toBe("foo");
    });

    // schedule功能
    it("effect schedule", () => {
        let dummy;
        let run: any;
        const scheduler = jest.fn(() => {
            run = runner;
        });
        const obj = reactive({ foo: 1 });
        const runner = effect(
            () => {
                dummy = obj.foo;
            },
            { scheduler }
        );
        expect(scheduler).not.toHaveBeenCalled();
        expect(dummy).toBe(1);
        // set的时候 scheduler第一次会被调用, 而runner不会执行，dummy还是1
        obj.foo++;
        expect(scheduler).toHaveBeenCalledTimes(1);
        expect(dummy).toBe(1);

        run();
        expect(dummy).toBe(2);
    });

    // effect stop
    it("effect stop", () => {
        let dummy;
        const obj = reactive({ prop: 1 });
        const runner = effect(() => {
            dummy = obj.prop;
        });
        obj.prop = 2;
        expect(dummy).toBe(2);
        // stop后 set不触发trigger
        stop(runner);
        // obj.prop = 3;
        obj.prop++;
        expect(dummy).toBe(2);

        // 重新执行runner后再被恢复
        runner();
        expect(dummy).toBe(3);
    });

    it("onStop", () => {
        const obj = reactive({ foo: 1 });
        const onStop = jest.fn();
        let dummy;
        const runner = effect(
            () => {
                dummy = obj.foo;
            },
            { onStop }
        );
        stop(runner);
        expect(onStop).toBeCalledTimes(1);
    });
});
