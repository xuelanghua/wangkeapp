$ajaxUrl = 'https://app.wangkeapp.cn/app/index.php?i=2&c=entry&m=longbing_card&do='; //服务器数据请求接口
$uploadUrl = 'https://app.wangkeapp.cn/app/index.php?i=2&c=utility&a=file&do=upload&type=image&thumb=0'; //图片上传接口
// $voiceUrl = 'https://wangke.ynhost.cn/web/index.php?c=utility&a=file&do=upload&upload_type=voice&uniacid=2'; //音频上传接口
$voiceUrl = 'https://app.wangkeapp.cn/app/index.php?i=2&c=entry&m=longbing_card&do=upload'; //音频上传接口

//获取用户信息
var getUserInfo = function() {
	return JSON.parse(localStorage.getItem('user'));
}

//检查是否开通会员
function checkMember() {
	var userInfo = getUserInfo();
	var statusBarStyle = plus.navigator.getStatusBarStyle();
	if (userInfo.is_activation == 0) {
		// 		plus.nativeUI.confirm('此功能需要开通VIP会员才可使用,前往开通?', function(e) {
		// 			if (e.index == 0) {
		// 				fnOpenWin('activation.html', 'activation', '', {
		// 					statusBarStyle: statusBarStyle
		// 				}, 'slide-in-bottom');
		// 				setStatusBar('', 'light');
		// 			}
		// 		});
		var tips = plus.webview.create("tipsmodel/opening_model.html", "opening_model", {
			background: "transparent"
		}, "");
		tips.show();
		return false;
	} else if (userInfo.is_activation == 1 && userInfo.expire_time < parseInt(new Date().getTime() / 1000)) {
		plus.nativeUI.confirm('您的会员已到期,前往续费?', function() {
			if (e.index == 0) {
				fnOpenWin('activation.html', 'activation', '', {
					statusBarStyle: statusBarStyle
				}, 'slide-in-bottom');
			}
		});

		return false;
	}
	return true;
}

//获取用户信息
function updateUserInfo() {
	var userInfo = getUserInfo();
	mui.post($ajaxUrl + 'member&action=info', {
		token: userInfo.token
	}, function(res) {
		localStorage.setItem('user', JSON.stringify(res.data));
	}, 'json')
}

//设置顶部状态栏
function setStatusBar(color, style) {
	plus.navigator.setStatusBarBackground(color);
	plus.navigator.setStatusBarStyle(style);
}

//打开窗口
function fnOpenWin(url, id, style, extra, aniShow) {
	var page = plus.webview.create(url, id, style, extra);
	page.show(aniShow);
}

//关闭指定窗口
function fnCloseWin(id) {
	plus.webview.close(id);
}

//toast消息
function message(text, position) {
	plus.nativeUI.toast(text, {
		verticalAlign: position
	});

}

//判断两个数据是否相等
function isEqual(a, b) {
	//如果a和b本来就全等
	if (a === b) {
		//判断是否为0和-0
		return a !== 0 || 1 / a === 1 / b;
	}
	//判断是否为null和undefined
	if (a == null || b == null) {
		return a === b;
	}
	//接下来判断a和b的数据类型
	var classNameA = toString.call(a),
		classNameB = toString.call(b);
	//如果数据类型不相等，则返回false
	if (classNameA !== classNameB) {
		return false;
	}
	//如果数据类型相等，再根据不同数据类型分别判断
	switch (classNameA) {
		case '[object RegExp]':
		case '[object String]':
			//进行字符串转换比较
			return '' + a === '' + b;
		case '[object Number]':
			//进行数字转换比较,判断是否为NaN
			if (+a !== +a) {
				return +b !== +b;
			}
			//判断是否为0或-0
			return +a === 0 ? 1 / +a === 1 / b : +a === +b;
		case '[object Date]':
		case '[object Boolean]':
			return +a === +b;
	}
	//如果是对象类型
	if (classNameA == '[object Object]') {
		//获取a和b的属性长度
		var propsA = Object.getOwnPropertyNames(a),
			propsB = Object.getOwnPropertyNames(b);
		if (propsA.length != propsB.length) {
			return false;
		}
		for (var i = 0; i < propsA.length; i++) {
			var propName = propsA[i];
			//如果对应属性对应值不相等，则返回false
			if (a[propName] !== b[propName]) {
				return false;
			}
		}
		return true;
	}
	//如果是数组类型
	if (classNameA == '[object Array]') {
		if (a.toString() == b.toString()) {
			return true;
		}
		return false;
	}
}

//打印日志
function logs(data) {
	console.log(JSON.stringify(data));
}


//打开裁剪窗口
function cropperImg(img, id) {
	fnOpenWin('cropper.html', 'cropper', {
		statusbar: {
			background: '#000'
		}
	}, {
		image: img,
		wid: id
	}, '');
}

//日期格式化
function formatDate(format, date) {
	if (date.length != 0) {
		var date = new Date(date);
	} else {
		var date = new Date();
	}
	var year = date.getFullYear();
	var month = date.getMonth() + 1;
	if (month < 10) {
		month = '0' + month;
	}
	var day = date.getDate();
	if (day < 10) {
		day = '0' + day;
	}
	var hour = date.getHours();
	if (hour < 10) {
		hour = '0' + hour;
	}
	var minute = date.getMinutes();
	if (minute < 10) {
		minute = '0' + minute;
	}
	var second = date.getSeconds();
	if (second < 10) {
		second = '0' + second;
	}
	format = format.replace('y', year);
	format = format.replace('m', month);
	format = format.replace('d', day);
	format = format.replace('H', hour);
	format = format.replace('i', minute);
	format = format.replace('s', second);
	return format;
}
