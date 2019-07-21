/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
var threeSumClosest = function(nums, target) {
    nums.sort((a, b) => a - b);
    const len = nums.length;
    let a, b, c;
    let p1, p2;
    let result = nums[0] + nums[1] + nums[len - 1];
    let distance = Math.abs(result - target);
    for (let i = 0; i < len - 2; i++) {
        a = nums[i];
        p1 = i + 1;
        p2 = len - 1;
        while (p1 < p2) {
            b = nums[p1];
            c = nums[p2];
            const tr = a + b + c;
            const td = Math.abs(tr - target);
            if (td < distance) {
                result = tr;
                distance = td;
            }
            if (tr < target) p1++;
            else if (tr > target) p2--;
            else {
                return target;
            }
        }
    }
    return result;
};

console.log(threeSumClosest([0, 2, 1, -3], 1));