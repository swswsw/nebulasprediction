class HelloWorld {
  constructor() {
    LocalContractStorage.defineProperties(this, {
      visitor: null
    });
  }

  init(visitor) {
    this.visitor = visitor;
  }

  greetings(city) {
    Event.Trigger("greetings", "here is " + city + ". hello world! by " + this.visitor + ".")
  }

  who() {
    return this.visitor;
  }
}

module.exports = HelloWorld;
