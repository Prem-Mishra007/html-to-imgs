const axios=require("axios");

let headersList = {
 "Accept": "*/*",
 "User-Agent": "Thunder Client (https://www.thunderclient.com)",
 "Content-Type": "application/json" 
}
const start=Date.now()
for(let i=0;i<100;i++){
let bodyContent = JSON.stringify({
  "data": {
      "template":"temp1",
    "content": {
      "name": (Math.random() + 1).toString(36).substring(2),
      "place": (Math.random() + 1).toString(36).substring(2),
      "company": (Math.random() + 1).toString(36).substring(2),
      "desg": (Math.random() + 1).toString(36).substring(2),
      "followers": Math.random(),
      "following": Math.random(),
      "work": Math.random(),
      "articles": Math.random()
    }
  }
});
const reqOptions = {
    url: "http://localhost:3000/getSS",
    method: "POST",
    headers: headersList,
    data: bodyContent,
  }



axios.request(reqOptions).then(function (response) {
    const end=Date.now();
  console.log(end-start);
  //console.log(response.data);
})
}
