## 88 合并两个有序数组

题目链接 [link](https://leetcode.cn/problems/merge-sorted-array/description/?envType=study-plan-v2&envId=top-interview-150)

给定的数组是有序的，那么逐个对比放到一个新数组中，最后复制给 nums1 即可。

时间复杂度 $O(m+n)$

::: code-tabs
@tab cpp
```cpp
class Solution {
public:
    void merge(vector<int>& nums1, int m, vector<int>& nums2, int n) {
        vector<int> all;
        int i = 0, j = 0;
        while (i < m && j < n) {
            if (nums1[i] < nums2[j]) {
                all.push_back(nums1[i]);
                i++;
            } else {
                all.push_back(nums2[j]);
                j++;
            }
        }
        while (i < m) all.push_back(nums1[i++]);
        while (j < n) all.push_back(nums2[j++]);
        nums1 = all;
    }
};
```

@tab java
```java
class Solution {
    public void merge(int[] nums1, int m, int[] nums2, int n) {
        int[] all = new int[m + n];
        int i = 0, j = 0;
        while (i < m && j < n) {
            if (nums1[i] < nums2[j]) {
                all[i + j] = nums1[i];
                i++;
            } else {
                all[i + j] = nums2[j];
                j++;
            }
        }
        while (i < m) {
            all[i + j] = nums1[i];
            i++;
        }
        while (j < n) {
            all[i + j] = nums2[j];
            j++;
        }
        System.arraycopy(all, 0, nums1, 0, m + n); // 高效复制数组
    }
}
```
:::

