
const ex3 = () => {
    const a1 = "this is a test";
    const arr = [...a1];

    const a2 = arr.concat();

    console.log(arr);
    console.log(a2);
};

ex3();

const ex2 = () => {
  function* print(): any {
      console.log("A");
      console.log(yield "AAA");
      console.log("B");
      yield "BB";
      console.log("c");
  }

  const obj = print();
  console.log(obj.next("xxx"));
  // console.log(obj.next("zzz"));
  // console.log(obj.next());
  // obj.next();
};
// ex2();

const ex1 = () => {
    // The asterisk after `function` means that
    // `objectEntries` is a generator
    function* objectEntries(obj: any): IterableIterator<any> {
        const propKeys = Reflect.ownKeys(obj);

        for (const propKey of propKeys) {
            // `yield` returns a value and then pauses
            // the generator. Later, execution continues
            // where it was previously paused.
            yield [propKey, obj[propKey]];
        }
    }

    const jane = { first: 'Jane', last: 'Doe', age: 28, city: "NYC" };

    // for (const [key,value] of objectEntries(jane)) {
    //     console.log(`${key}: ${value}`);
    // }

    for (const obj of objectEntries(jane)) {
        console.log(obj);
        console.log(obj.done)
    }
};
// ex1();
