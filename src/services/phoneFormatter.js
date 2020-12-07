export default function phoneFormatter(phone) {
  let x = phone.replace(/\D/g, '')
  x = /^['8']/.test(x) ? x.replace(/^['8']/, '7') : !/^['7']/.test(x) ? '7' + x : x
  x = x.match(/(\d{0,1})(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})/)

  if (x[5]) {
    return `+7 (${x[2]}) ${x[3]} ${x[4]} ${x[5]}`
  } else if (x[4]) {
    return `+7 (${x[2]}) ${x[3]} ${x[4]}`
  } else if (x[3]) {
    return `+7 (${x[2]}) ${x[3]}`
  } else if (x[2]) {
    return `+7 (${x[2]}`
  }
  return `+7 (`
}
