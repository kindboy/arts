/**
 * @param {number[]} nums
 * @return {number[][]}
 */
var threeSum = function(nums) {
    nums.sort((a, b) => a - b);
    const resultArr = [];
    let a, b, c;
    let p1, p2;
    for (let i = 0, len = nums.length; i < len - 2; i++) {
        a = nums[i];
        if (a > 0) {
            break;
        }
        if (i > 0 && a === nums[i - 1]) {
            continue;
        }
        p1 = i + 1;
        p2 = len - 1;
        while (p1 < p2) {
            b = nums[p1];
            c = nums[p2];
            if (a + b + c === 0) {
                resultArr.push([a, b, c]);
                while (p1 < p2 && nums[p1] === nums[p1 + 1]) p1++;
                while (p1 < p2 && nums[p2] === nums[p2 - 1]) p2--;
                p1++;
                p2--;
            } else if (a + b + c < 0) {
                p1++;
            } else {
                p2--;
            }
        }
    }
    return resultArr;
};

console.log(threeSum([-4,-2,-2,-2,0,1,2,2,2,3,3,4,4,6,6]));
