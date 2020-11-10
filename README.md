## 基于localStroage二次扩展

> 你在项目中还在使用  `localStorage.setItem`、`localStorage.setItem` 频繁操作吗？
>
> 换成下面试试呢？

### 1.1 解决了哪些问题？

- [x] 1.无法批量增、删、改；
- [x] 2.数据未做任何处理就直接存入, 没有存入信息比如（创建时间、过期时间、数据加密）等包装操作;
- [x] 3.可对数据增、删、改等操作进行监控处理；
- [x] 4.采用OOP思想就行封装，结构更加清晰明了；
- [x] 5.采用单例模式，杜绝了一个项目存在多个store实例问题；

------



### 1.2 使用

1. 引入库文件

   ```html
   <script src="./local-store.js"></script>
   ```

2. 调用 `window.installStore()` 方法安装store，默认进来IIFE就会在window上挂载一个installStore 方法

   ```javascript
   var localStore = window.installStore(window); //安装插件,参数为需要挂载到某个实例上，现在默认安装在window上，如果传入其他实例，则挂载到对应实例；
   //localStore === window.localStore(window); //true
   //如果installStore第一个参数传递的是window，那么调用则是 window.localStore;
   
   //批量存值
   localStore.set({
       userName: "张三",
       age: 30,
       sex: "男",
       job: "java开发",
       workAddress: "Chengdu"
   });
   
   //设置1分钟过期时间
   localStore.set("userId", "xxxx-xxx-xxx-xx", 1000 * 60);
   
   //单个删除
   localStore.del("userId");
   
   //批量删除
   localStore.del(["userId", "userName"]);
   
   //批量取值
   let {userName, userInfo, userId} = localStore.get(["userName", "userInfo", "userId"]);
   ```



### 1.3 完整代码实例

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<title></title>
		<script src="./local-store.js"></script>
	</head>
	<body>
		<script>
			window.installStore(window); //安装插件
			var localStore = window.localStore;
            
			//批量存值
			localStore.set({
				userName: "张三",
				age: 30,
				sex: "男",
				job: "java开发",
				workAddress: "Chengdu"
			});
			
			//单个删除
			localStore.del("userId");
			
			//批量删除
			localStore.del(["userId", "userName"]);

			//设置1分钟过期时间
			localStore.set("userId", "xxxx-xxx-xxx-xx", 1000 * 60);
			
			//批量取值
			let {userName, userInfo, userId} = localStore.get(["userName", "userInfo", "userId"]);
		</script>
	</body>
</html>

```

------

> 备注： 本项目采用ES5的语法编写，更多功能持续开发中，如：发布、订阅、数据签名存储...