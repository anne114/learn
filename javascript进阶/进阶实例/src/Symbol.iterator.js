// 通过generator函数实现object对象的iterator接口，然后就可以通过for...of...遍历该对象
const testObj = {
    name: 'anne',
    age: 22,
    // 使用普通函数实现iterator
    [Symbol.iterator]: function() {
        const self = this;
        const keys = Object.keys(self);
        const length = keys.length;
        let index = 0;
        return {
            next: function() {
                return {
                    value: self[keys[index]],
                    done: index++ >= length
                }
            }
        }
    }
    // 使用genetor函数iterator接口
    // [Symbol.iterator]: function*() {
    //     let keys = Object.keys(this);
    //     for (const key of keys) {
    //         yield this[key];
    //     }
    // }
}

for (const item of testObj) {
    console.log(item);
}