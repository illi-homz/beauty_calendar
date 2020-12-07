'use strict';

export default function colorGenerator() {
	const colorLength = 6
  const symbolsCode = [0,1,2,3,4,5,6,7,8,9,'a','b','c','d','e','f']
  let color = '#'

  function rnd(a, b) {
    return Math.floor((b - a + 1) * Math.random()) + a
  }

	for(let i=0; i<colorLength; i++){
    color += symbolsCode[rnd(0, symbolsCode.length - 1)]
  }

  return color
}
