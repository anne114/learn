"use strict";

var indexFn = function indexFn() {
  var familyName = "张";
  var firstName = "三";
  var name = "\u540D\u5B57\u662F\uFF1A".concat(familyName).concat(firstName);
  console.log(name);
};