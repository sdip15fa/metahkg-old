require("dotenv").config();
const mongouri = process.env.DB_URI || "mongodb://localhost"; // mongo connection string
const secret = process.env.hcaptchasecret; // hcaptcha secret used to cerify hcaptcha tokens
/*
 * get difference in seconds between now and a time string
 */
function timediff(sdate) {
  const startDate = new Date(sdate);
  const endDate = new Date();
  const diff = endDate.getTime() - startDate.getTime();
  return diff / 1000;
}
/*
arr: [
  {
    id: 1,
    name: "1",
    ...
  },
  {
    id: 3,
    name: "3",
    ...
  },
  ...
]
return obj: {
  1: {
    name: "1",
    ...
  }
  3: {
    name: "3",
    ...
  }
}
*/
function arrtoobj(arr) {
  const obj = {};
  arr.forEach((item) => {
    obj[item.id] = item;
    delete obj[item.id].id;
  });
  return obj;
}
/*
reverted process of above
*/
function objtoarr(obj) {
  const arr = [];
  Object.entries(obj).forEach((item) => {
    const o = item[1];
    o.id = Number(item[0]);
    arr.push(o);
  });
  return arr;
}
const domain = process.env.domain.startsWith(".")
  ? process.env.domain?.replace(".", "")
  : process.env.domain;
function allequal(arr) {
  const first = arr[0];
  for (const i of arr) {
    if (i !== first) return false;
  }
  return true;
}
module.exports = {
  mongouri,
  secret,
  timediff,
  arrtoobj,
  objtoarr,
  domain,
  allequal,
};
