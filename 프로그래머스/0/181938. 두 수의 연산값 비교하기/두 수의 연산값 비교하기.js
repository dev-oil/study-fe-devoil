function solution(a, b) { 
    return Math.max(Number(`${a}${b}`), Number(`${2 * a * b}`))
}