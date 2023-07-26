const axios = require('axios').default

axios.request("https://www.yeaaawdasaxafssdf44").then((test) => {
    console.log(test.status)
}).catch((err) => {
    console.log(err.code)
})