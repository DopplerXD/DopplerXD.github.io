## 1 两数之和

[题目链接](https://leetcode.cn/problems/two-sum/description/?envType=study-plan-v2&envId=top-100-liked)

::: code-tabs
@tab cpp
```cpp
class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        const int n = nums.size();
        unordered_map<int, int> mp;
        for (int i = 0; i < n; i++) {
            int j = target - nums[i];
            if (mp.count(j)) {
                return {i, mp[j]};
            } else {
                mp[nums[i]] = i;
            }
        }
        return {-1, -1};
    }
};
```

@tab java
```java
class Solution {
    public int[] twoSum(int[] nums, int target) {
        int n = nums.length;
        Map<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < n; i++) {
            int x = nums[i];
            int y = target - x;
            if (map.get(y) != null) {
                return new int[]{map.get(y), i};
            } else {
                map.put(x, i);
            }
        }
        return null;
    }
}
```

@tab python
```python
class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        mp = {}
        for i, num in enumerate(nums):
            j = target - num
            if j in mp:
                return [i, mp[j]]
            else:
                mp[num] = i
        return [-1, -1]
```

@tab go
```go
func twoSum(nums []int, target int) []int {
    mp := map[int]int{}
    for i, num := range nums {
        j := target - num
        if index, ok := mp[j]; ok {
            return []int{i, index}
        } else {
            mp[num] = i
        }
    }
    return []int{-1, -1}
}
```
:::

## 49 字母异位词分组

[题目链接](https://leetcode.cn/problems/group-anagrams/?envType=study-plan-v2&envId=top-100-liked)

::: code-tabs
@tab cpp
```cpp
class Solution {
public:
    vector<vector<string>> groupAnagrams(vector<string>& strs) {
        vector<vector<string>> res;
        map<string, vector<string>> mp;
        for (string s : strs) {
            string t = s;
            sort(t.begin(), t.end());
            mp[t].push_back(s);
        }
        for (auto& [k, v] : mp) {
            res.push_back(v);
        }
        return res;
    }
};
```

@tab java
```java
class Solution {
    public List<List<String>> groupAnagrams(String[] strs) {
        List<List<String>> res = new ArrayList<>();
        Map<String, List<String>> map = new HashMap<>();

        for (String s : strs) {
            char[] charArray = s.toCharArray();
            Arrays.sort(charArray);
            String sortedStr = new String(charArray);

            if (!map.containsKey(sortedStr)) {
                map.put(sortedStr, new ArrayList<>());
            }
            map.get(sortedStr).add(s);
        }

        for (List<String> list : map.values()) {
            res.add(list);
        }

        return res;
    }
}
```

@tab python
```python
class Solution:
    def groupAnagrams(self, strs: List[str]) -> List[List[str]]:
        res = []
        mp = defaultdict(list)

        for s in strs:
            sorted_s = ''.join(sorted(s))
            mp[sorted_s].append(s)

        for value in mp.values():
            res.append(value)

        return res
```

@tab go
```go
func groupAnagrams(strs []string) [][]string {
    res := [][]string{}
    mp := make(map[string][]string)

    for _, s := range strs {
        // 将字符串转换为字符数组并排序
        chars := strings.Split(s, "")
        sort.Strings(chars)
        sortedStr := strings.Join(chars, "")

        mp[sortedStr] = append(mp[sortedStr], s)
    }

    for _, v := range mp {
        res = append(res, v)
    }

    return res
}
```
:::

## 128 最长连续序列

[题目链接](https://leetcode.cn/problems/longest-consecutive-sequence/?envType=study-plan-v2&envId=top-100-liked)

::: code-tabs
@tab cpp
```cpp
class Solution {
public:
    int longestConsecutive(vector<int>& nums) {
        if (nums.empty()) return 0;
        sort(nums.begin(), nums.end());
        nums.erase(unique(nums.begin(), nums.end()), nums.end());
        int ans = 1;
        int pre = nums[0], len = 1;
        for (int i = 1; i < nums.size(); i++) {
            if (nums[i] == pre + 1) {
                len++;
            } else {
                ans = max(ans, len);
                len = 1;
            }
            pre = nums[i];
        }
        ans = max(ans, len);
        return ans;
    }
};
```

@tab java
```java
class Solution {
    public int longestConsecutive(int[] nums) {
        if (nums.length == 0) {
            return 0;
        }
        // 利用 TreeSet 自动排序并去重
        TreeSet<Integer> set = new TreeSet<>();
        for (int num : nums) {
            set.add(num);
        }
        int ans = 1;
        int pre = set.first();
        int len = 1;
        // 从第二个元素开始遍历
        for (Integer num : set.tailSet(set.first(), false)) {
            if (num == pre + 1) {
                len++;
            } else {
                ans = Math.max(ans, len);
                len = 1;
            }
            pre = num;
        }
        ans = Math.max(ans, len);
        return ans;
    }
}
```

@tab python
```python
class Solution:
    def longestConsecutive(self, nums: List[int]) -> int:
        if not nums:
            return 0
        # 去重并排序
        nums = sorted(set(nums))
        ans = 1
        pre = nums[0]
        len_val = 1
        for num in nums[1:]:
            if num == pre + 1:
                len_val += 1
            else:
                ans = max(ans, len_val)
                len_val = 1
            pre = num
        ans = max(ans, len_val)
        return ans
```

@tab go
```go
func longestConsecutive(nums []int) int {
    if len(nums) == 0 {
        return 0
    }
    // 排序
    sort.Ints(nums)
    // 去重
    j := 0
    for i := 1; i < len(nums); i++ {
        if nums[i] != nums[j] {
            j++
            nums[j] = nums[i]
        }
    }
    nums = nums[:j+1]

    ans := 1
    pre := nums[0]
    lenVal := 1
    for i := 1; i < len(nums); i++ {
        if nums[i] == pre+1 {
            lenVal++
        } else {
            if lenVal > ans {
                ans = lenVal
            }
            lenVal = 1
        }
        pre = nums[i]
    }
    if lenVal > ans {
        ans = lenVal
    }
    return ans
}
```
:::

