const person = {
  name: 'anne',
  age: 22
}
const proxyPerson = new Proxy(person, {
  // target:目标对象
  // property：属性名
  get(target, property) {
    console.log(`获取target对象的${property}属性`);
    return property in target ? target[property] : 'default'
  },
  set(target, property, value) {
    console.log(`设置target对象的${property}属性为${value}`);
    target[property] = value;
  }
})
proxyPerson.name;
proxyPerson.age = 23;