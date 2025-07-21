## 1 set

```cpp
s.earse(it1,it2); 删除 [it1,it2) 这个区间（迭代器）对应位置的元素
iterator lower_bound( const key_type &key ); 返回一个迭代器，指向键值 >= key 的第一个元素。
iterator upper_bound( const key_type &key ); 返回一个迭代器，指向键值 > key 的第一个元素

Set 的定义：
struct T1{
	int key,value;
	bool operator < (const T1 &a) const {
		return key<a.key;//按照升序排列 
	}
};
struct T2{
	int key,value;
};
struct T2cmp{
	bool operator () (const int &a,const int &b){
		if(abs(a-b)<=k)
			return false;
		return a<b;
	}
}; 
int main(){
	int i,j;
	set<T1> s1;
	set<T2,T2cmp> s2;
	set<string> ss1;//等于 set<string,less<int> > ss1; 从小到大
	set<string,greater<string> > ss2;//从大到小
	set<string,greater<string> > ::iterator itsey;
	//set 的遍历
	set<string> :: iterator it; 
	for(it = ss1.begin();it!=ss1.end();it++){
		cout<<*it<<endl;
	}
	return 0;
}
Multiset
c.erase(elem) 删除与 elem 相等的所有元素，返回被移除的元素个数。
c.erase(pos) 移除迭代器 pos 所指位置元素，无返回值。
```

## 2 map

```cpp
mp.find(key): 在 map 中查找 key 并返回其 iterator, 找不到的话返回 mp.end() O(logn)
mp.count(key): 在 map 中找 key 的数量，由于每个 key 都是唯一的，只会返回 0 或 1
mp[key] 可以直接访问到键值队 key---value 中的 value，如果不存在，则 mp[key] 返回的是 value 类型默认构造器所构造的值，并将该键值对插入到 map 中
哈希表：
#include <unordered_map>
unordered_map
```

## 3 pair

```cpp
#include <utility>头文件中
pair<T1, T2> p1; //创建一个空的 pair 对象（使用默认构造），它的两个元素分别是 T1 和 T2 类型，采用值初始化。
pair<T1, T2> p1(v1, v2); //创建一个 pair 对象，它的两个元素分别是 T1 和 T2 类型，其中 first 成员初始化为 v1，second 成员初始化为 v2。
make_pair(v1, v2); // 以 v1 和 v2 的值创建一个新的 pair 对象，其元素类型分别是 v1 和 v2 的类型。
p1 < p2; // 两个 pair 对象间的小于运算，其定义遵循字典次序
// 如 p1.first < p2.first 或者 !(p2.first < p1.first) && (p1.second < p2.second) 则返回 true。
p1 == p2// 如果两个对象的 first 和 second 依次相等，则这两个对象相等；该运算使用元素的==操作符。
```

## 4 vector

```cpp
v.resize(n); // 把 v 的长度重新设定为 n 个元素
v.erase(unique(v.begin(), v.end()), v.end()); // 去重
```

## 5 priority_queue

```cpp
pq.top(): 获取优先级最高的元素 O(1)
优先队列的定义：
priority_queue<int> q1; //默认从大到小，大顶堆 
priority_queue<int ,vector<int>,less<int> > q2; //降序队列，大顶堆 
priority_queue<int ,vector<int>,greater<int> > q3; //升序队列，小顶堆

对于结构体定义：
struct T1{//法一 强烈推荐 
	int x,y;
	friend bool operator < (T1 a,T1 b){
		return a.x<b.x;
	}
};
priority_queue<T1> q1;

struct T1{//法二
	int x,y;
	bool operator < (const T1 &a) const{
		return x<a.x; //大顶堆 
	}
};
priority_queue<T1> q1; 
```

## 6 tuple

```cpp
#include <tuple>
auto t = std::make_tuple(1, 2.5, "Hello");

// get 获取元素
auto t = std::make_tuple(1, 2.5, "Hello");
int i = std::get<0>(t); // 1
double d = std::get<1>(t); // 2.5
const char* s = std::get<2>(t); // "Hello"

// tie 解包获取元素 
int i;
double d;
const char* s;

auto t = std::make_tuple(1, 2.5, "Hello");
std::tie(i, d, s) = t;

// size 获取size
auto t = std::make_tuple(1, 2.5, "Hello");
constexpr size_t size = std::tuple_size<decltype(t)>::value; // 3

// tuple_element 获取某个元素的类型
auto t = std::make_tuple(1, 2.5, "Hello");
using FirstType = std::tuple_element<0, decltype(t)>::type; // int
using SecondType = std::tuple_element<1, decltype(t)>::type; // double

// tuple_cat 连接多个tuple
auto t1 = std::make_tuple(1, 2.5);
auto t2 = std::make_tuple("Hello", 'a');
auto t3 = std::tuple_cat(t1, t2); // t3 is std::tuple<int, double, const char*, char>

// apply 将tuple中的元素作为参数传递给一个函数
void print(int i, double d, const char* s) {
    std::cout << i << ", " << d << ", " << s << std::endl;
}

auto t = std::make_tuple(1, 2.5, "Hello");
std::apply(print, t); // 1, 2.5, Hello

// for_each + index_sequence 遍历并使用元素
template<typename Tuple, std::size_t... I>
void print_tuple(const Tuple& t, std::index_sequence<I...>) {
    ((std::cout << (I == 0 ? "" : ", ") << std::get<I>(t)), ...);
    std::cout << std::endl;
}

template<typename... Args>
void print_tuple(const std::tuple<Args...>& t) {
    print_tuple(t, std::index_sequence_for<Args...>{});
}

int main() {
    auto t = std::make_tuple(1, 2.5, "Hello");
    print_tuple(t); // 1, 2.5, Hello
    return 0;
}

```

## 二分

由于 set 迭代器是单向的，所以一般情况下 std::set.lower_bound() 的性能要优于 std::lower_bound()

```cpp
lower_bound(begin,end,num)：二分查找第一个大于或等于 num 的数字，找到返回该数字的地址，不存在则返回 end
upper_bound(begin,end,num)：二分查找第一个大于 num 的数字
在从大到小的排序数组中，重载 lower_bound() 和 upper_bound()
lower_bound(begin,end,num,greater()): 二分查找第一个小于或等于 num 的数字
upper_bound(begin,end,num,greater()): 二分查找第一个小于 num 的数字
```

## extract (C++17)

extract 复杂度 $log(size())$

**set::extract** 可以移除某个元素

```cpp
std::set<int> cont{1, 2, 3};

// Extract node handle and change key
auto nh = cont.extract(1);
nh.value() = 4;

print("After extract and before insert:", cont); // 2 3

// Insert node handle back
cont.insert(std::move(nh));

print("End:", cont); // 2 3 4
```

**map::extract** 能够修改一组 <key, value> 中的 key

> extract is the only way to change a key of a map element without reallocation

```cpp
std::map<int, char> cont{{1, 'a'}, {2, 'b'}, {3, 'c'}};

// Extract node handle and change key
auto nh = cont.extract(1);
nh.key() = 4;

print("After extract and before insert:", cont); // 2(b) 3(c)

// Insert node handle back
cont.insert(std::move(nh));

print("End:", cont); // 2(b) 3(c) 4(a)
```

