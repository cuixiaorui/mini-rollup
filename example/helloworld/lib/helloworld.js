function bar() {
  return "bar";
}
function foo() {
  bar();
  return "foo";
}
console.log("hello world - index.js");
console.log(foo());