const rndCounter = (q) => {
    const numbers = [];

    for (let i = 0; i < q; i++) {
        let rand = Math.floor(Math.random() * 1000)
        numbers.push(rand)
    };

    const counted = {};

    for (let num of numbers){
        counted[num] = counted[num] ? counted[num] + 1 : 1
    };

    return counted
}

process.on("message", (msg) => {
    const numbers = rndCounter(msg);
    process.send(numbers)
})