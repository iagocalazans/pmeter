# Performance Meter
pmeter is a function performance meter.

## How to use

### This is a sample express server running pmeter at some of it functions.
If you use "import"
```
import { pmbind } from 'pmeter';
```
If you use "require"
```
const express = require('express');
const app = express();

const pmbind = require('pmeter').pmbind;

app.get('/', (req, res) => {
    pmbind(myLoopOneParam, 5000);

    pmbind(myLoopMultipleParams, 3000, 5000);

    res.status(201).send({ some: { crazy: 'Object' }})
})

const myLoopOneParam = (ms) => {
    let i = 0;
    
    while(i < ms) {
        console.log(i);
        i++
    }
    return i;
}

const myLoopMultipleParams = (params) => { 
    let [i, ms] = params;

    while(i < ms) {
        console.log(i);
        i++
    }
    return i;
}


app.listen(3000, () => {
    console.log('Listening p;ort 3000')
})
```

### You can pass many parameters as you wish
Just input your parameters separateds by comma and deconstruct them on the function.

```
pmbind(function, ...params);
```

### You can measure more complex functions too
For more complex functions, call them as anonymous functions retuns.

```
pmbind(() => function(...params));
```

### This is how it will be printed
You will receive 2 blocks of info, SERVER USAGE and PERFORMANCE.

```
 FUNCTION  myLoopOneParam 

 SERVER USAGE 

[CPU] 19%
[RAM] 0 MB
[RSS] 5.07 MB
[EXT] 0 MB
[BUFFER] 0 MB

 PERFORMANCE 

[EXEC TIME] 2080ms

 CLOSE 



 FUNCTION  myLoopMultipleParams 

 SERVER USAGE 

[CPU] 21%
[RAM] 1.96 MB
[RSS] 0 MB
[EXT] 0 MB
[BUFFER] 0 MB

 PERFORMANCE 

[EXEC TIME] 664ms

 CLOSE 
 ```