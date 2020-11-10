/**
 * 本地存储-基于localStorage二次封装
 * author: Haor
 * version: 1.0.0
 * createTime: 2020-11-09
 * updateTime: -
 * 
 */

"use strict";
(function(wrapCtx) {
	var _isJson = function(data) {
		try {
			data = data || null;
			if (typeof data !== 'string') return false;
			var jsonObj = JSON.parse(data);
			return !!(jsonObj && _isObj(jsonObj));
		} catch (error) {
			console.log(error);
			return false;
		}
	}
	var _isObj = function(data) {
		return Object.prototype.toString.call(data) === "[object Object]";
	}

	//创建stoteItm,可对数据进行签名等操作
	var createStoreItm = function(content, expiryTime) {
		var now = new Date().getTime(),
			expTime = expiryTime ? ((Number(expiryTime) || 0) + now) : null;
		return new ItemWrap(now, content || null, expTime);
	}

	//包装Itm构造器
	function ItemWrap(time, content, expiryTime) {
		this.time = time; //创建时间
		this.content = content; //实际内容
		this.expiryTime = expiryTime; //过期时间
	}

	//转为字符
	ItemWrap.prototype.toStr = function() {
		return JSON.stringify(this);
	}

	//Store构造器
	function Store(options) {
		this._options = options || Object.create(null);
	};

	Store.constructor = Store; //reset constructor

	/**
	 * 存储数据
	 * @param {String, Object} key 字段名
	 * @param {*} value 字段值 
	 * @param {Number} expiryTime 失效时间:毫秒
	 * @return {Store}
	 */
	Store.prototype.set = function(key, value, expiryTime) {
		if (!key) return;
		if (typeof key === "string") {
			var oldKey = key;
			key = Object.create(null);
			key[oldKey] = value;
		}

		Object.keys(key).forEach(function(dataKey) {
			var storeItm = createStoreItm(key[dataKey], expiryTime); //生成的item
			localStorage.setItem(dataKey, storeItm.toStr());
		});
		return this;
	};

	/**
	 * 获取数据
	 * @param {String|Array} key 数据key
	 * @param {Boolean} isAll 是否为全部
	 * @return {Srting|Object}
	 */
	Store.prototype.get = function(key, isAll) {
		if (key === '' && !isAll) return null;
		if (key && typeof key === "boolean") isAll = true;
		var _self = this,
			dataKeys = isAll ? _self.getKeys() : (Array.isArray(key) ? key : [key]),
			dataRes = Object.create(null),
			now = new Date().getTime();
		dataKeys.forEach(function(dataKey) {
			let itemData = localStorage.getItem(dataKey) || null;
			dataRes[dataKey] = null;
			if (_isJson(itemData)) {
				let jsonData = JSON.parse(itemData);
				//是否设置过期时间
				if (jsonData.expiryTime) {
					//是否在有效期内
					if (jsonData.expiryTime > now) {
						dataRes[dataKey] = jsonData.content;
					} else {
						console.warn(`Store -> ${dataKey} 已失效！`)
						_slef.del(dataKey); //删除过期数据
					}
				} else {
					dataRes[dataKey] = jsonData.content;
				}
			}
		});
		now = null;
		return ((typeof key) === 'string' ? dataRes[key] : dataRes);
	};

	/**
	 * 删除本地存储
	 * @param {String|Array} key
	 */
	Store.prototype.del = function(key) {
		var removeKeys = Array.isArray(key) ? key : [key];
		removeKeys.forEach(function(dataKey) {
			localStorage.removeItem(dataKey);
		});
		return this;
	};

	/**
	 * 获取所有key
	 * @param {Array}  
	 */
	Store.prototype.getKeys = function() {
		return typeof Object.getOwnPropertyNames === "function" ?
			Object.getOwnPropertyNames(localStorage) : [];
	};

	/**
	 * 获取存储总条数
	 * @return {Number}
	 */
	Store.prototype.getCount = function() {
		if (typeof Object.getOwnPropertyNames === "function") {
			return Object.getOwnPropertyNames(localStorage).length;
		} else {
			return 0;
		}
	};

	/**
	 * 清空
	 */
	Store.prototype.clear = function() {
		localStorage.clear();
		return this;
	};

	/**
	 * 安装:一次实例
	 * @return {Object}
	 */
	Store.install = (function() {
		var storeInstance = null;
		return function onceInstall(options) {
			if (!storeInstance) {
				storeInstance = new Store(options);
			}
			return storeInstance;
		}
	})();

	//export
	wrapCtx.installStore = wrapCtx.installStore || function(ctx) {
		ctx = ctx || wrapCtx;
		//ctx参数必须为一个对象
		if (!_isObj(ctx) && ctx !== wrapCtx) {
			console.warn("The store install method parameter should be an object!");
			return null;
		}
		var args = Array.prototype.slice.call(arguments)[1];
		ctx.localStore = ctx.localStore || Store.install(args);

		//readonly
		Object.defineProperty(wrapCtx, "installStore", {
			configurable: false,
			writable: false
		});
		return ctx.localStore;
	}
})(window);
