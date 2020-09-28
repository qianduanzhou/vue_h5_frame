class Test {
    static count = 1;
    constructor(val) {
        this.val = val;
    }
    install() {
        console.log('Test-install');
        this.init();
    }
    init() {
        console.log('Test-init');
        this.sayVal();
        this.sayCount();
    }
    sayVal() {
        console.log('sayVal', this.val);
    }
    sayCount() {
        console.log('sayCount', Test.count);
    }
}
export default Test;