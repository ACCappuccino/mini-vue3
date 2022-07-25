/*
 * @Author: Mocha
 * @Date: 2022-07-24 22:53:20
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-07-24 23:04:33
 * @Description:shallow readonly
 */

import { isReadonly, shallowReadonly } from "../reactive";

describe("shallowReadonly", () => {
    test("should not make non-reactive properties reactive", () => {
        const props: any = shallowReadonly({ n: { foo: 1 } });
        expect(isReadonly(props)).toBe(true);
        expect(isReadonly(props.n)).toBe(false);
    });
    it("warn then call set", () => {
        // console.log()
        console.warn = jest.fn();
        const user = shallowReadonly({
            age: 10,
        });
        user.age = 11;
        expect(console.warn).toBeCalled();
    });
});
