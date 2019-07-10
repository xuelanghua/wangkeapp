// $ajaxUrl = 'https://app.wangkeapp.cn/app/index.php?i=6&c=entry&m=longbing_card&do='; //服务器数据请求接口
// $uploadUrl = 'https://app.wangkeapp.cn/app/index.php?i=6&c=utility&a=file&do=upload&type=image'; //图片上传接口
// $voiceUrl = 'https://app.wangkeapp.cn/app/index.php?i=6&c=entry&m=longbing_card&do=upload'; //音频上传接口

$ajaxUrl = 'http://app.ynhost.cn/app/index.php?i=6&c=entry&m=longbing_card&do='; //服务器数据请求接口
$uploadUrl = 'http://app.ynhost.cn/app/index.php?i=6&c=utility&a=file&do=upload&type=image'; //图片上传接口
$voiceUrl = 'http://app.ynhost.cn/app/index.php?i=6&c=entry&m=longbing_card&do=upload'; //音频上传接口
//获取用户信息
var getUserInfo = function() {
	return JSON.parse(localStorage.getItem('user'));
}

//检查是否开通会员
function checkMember() {
	var userInfo = getUserInfo();
	var statusBarStyle = plus.navigator.getStatusBarStyle();
	if (userInfo.is_activation == 0) { 
		// plus.nativeUI.confirm('此功能需要开通VIP会员才可使用,前往开通?', function(e) {
		// 	if (e.index == 0) {
		// 		fnOpenWin('activation.html', 'activation', '', {
		// 			statusBarStyle: statusBarStyle
		// 		}, 'slide-in-bottom');
		// 		setStatusBar('', 'light');
		// 	}
		// });
		// var tips = plus.webview.create("tipsmodel/opening_model.html", "opening_model", {
		// 	background: "transparent"
		// }, "");
		// tips.show();
		mui.openWindow({
			url: "tipsmodel/opening_model.html",
			id: "opening_model",
			styles: {
				bounce: 'none',
				scrollsToTop: true,
				popGesture: 'close',
				// background: '#ffffff',
				background: 'transparent',
				statusbar: {
					background: "#000000"
				}
			},
			extras: '',
			createNew: false,
			show: {
				autoShow: true,
				aniShow: 'none',
				duration: 150,
				event: 'titleUpdate',
				extras: {
					acceleration: 'auto',
					capture: '',
					otherCapture: ''
				}
			},
			waiting: {
				autoShow: false
			}
		})
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
function cropperImg(img, id, ratio) {
	fnOpenWin('cropper.html', 'cropper', {
		statusbar: {
			background: '#000'
		}
	}, {
		image: img,
		wid: id,
		ratio: ratio
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

// 打开窗口
function openPage(url, id, color, extras) {
	mui.openWindow({
		url: url,
		id: id,
		styles: {
			bounce: 'none',
			scrollsToTop: true,
			popGesture: 'close',
			statusbar: {
				background: color
			}
		},
		extras: extras,
		createNew: false,
		show: {
			autoShow: true,
			aniShow: 'slide-in-right',
			duration: 300,
			event: 'titleUpdate',
			extras: {
				acceleration: 'auto',
				capture: '',
				otherCapture: ''
			}
		},
		waiting: {
			autoShow: false
		}
	})
}

// 分享操作
function share(param, type) {
	plus.share.getServices(function(s) {
		var shareService = {};
		for (var i in s) {
			var t = s[i];
			shareService[t.id] = t;
		}

		var shareBtns = [];
		// 更新分享列表
		var ss = shareService['weixin'];
		ss && ss.nativeClient && (shareBtns.push({
				title: '微信朋友圈',
				s: ss,
				x: 'WXSceneTimeline'
			}),
			shareBtns.push({
				title: '微信好友',
				s: ss,
				x: 'WXSceneSession'
			}));
		ss = shareService['qq'];
		ss && ss.nativeClient && shareBtns.push({
			title: 'QQ',
			s: ss
		});
		// 弹出分享列表
		shareBtns.length > 0 ? plus.nativeUI.actionSheet({
			title: '分享',
			cancel: '取消',
			buttons: shareBtns
		}, function(e) {
			(e.index > 0) && shareAction(shareBtns[e.index - 1], param, type);
		}) : plus.nativeUI.alert('当前环境无法支持分享链接操作!');

	}, function(e) {
		plus.nativeUI.alert("获取分享服务列表失败：" + e.message);
	});
}

/**
 * 分享到小程序
 * @param param 分享参数
 */
function shareToMiniprogram(param) {
	plus.share.getServices(function(s) {
		var shareService = {};
		for (var i in s) {
			var t = s[i];
			shareService[t.id] = t;
		}

		var shareBtns = [];
		// 更新分享列表
		var ss = shareService['weixin'];
		ss && ss.nativeClient && shareBtns.push({
			s: ss,
			x: 'WXSceneSession'
		});
		shareAction(shareBtns[0], param, 'miniProgram');
	}, function(e) {
		message('分享失败!')
		// plus.nativeUI.alert("获取分享服务列表失败：" + e.message);
	});
}

/**
 * 打开小程序
 * @param param 页面参数
 */
function launchMiniprogram(goodsId, toUid) {
	plus.share.getServices(function(s) {
		var shareService = {};
		for (var i in s) {
			var t = s[i];
			shareService[t.id] = t;
		}
		// 更新分享列表
		var ss = shareService['weixin'];
		ss ? ss.launchMiniProgram({
			id: 'gh_9fa5f42ab939',
			path: '/longbing_card/pages/shop/detail/detail?id=' + goodsId + '&to_uid=' + toUid,
			type: '0', //0-正式版； 1-测试版； 2-体验版
			webUrl: 'https://app.wangkeapp.cn'
		}) : message('打开小程序失败!');
	}, function(e) {
		message('当前环境不支持打开小程序!')
	});
}

/**
 * 分享操作
 * @param {JSON} sb 分享操作对象s.s为分享通道对象(plus.share.ShareService)
 * @param {Boolean} bh 是否分享链接
 */
function shareAction(sb, param, type) {
	if (!sb || !sb.s) {
		plus.nativeUI.alert("无效的分享服务！");
		return;
	}

	var msg = {
		type: type,
		title: '',
		content: '',
		href: '',
		thumbs: [],
		picture: [],
		media: '',
		extra: {
			scene: sb.x ? sb.x : ''
		},
		miniProgram: {}
	};

	if (type == 'web') {
		msg.title = param.title;
		msg.content = param.content;
		msg.thumbs = param.thumbs;
		msg.href = param.href;
	} else if (type == 'text') {
		mgs.content = param.content;
	} else if (type == 'image') {
		msg.pictures = param.pictures;
	} else if (type == 'music' || type == 'video') {
		msg.title = param.title;
		msg.content = param.content;
		msg.thumbs = param.thumbs;
		msg.media = param.media;
	} else if (type == 'miniProgram') {
		msg.title = param.title;
		msg.content = param.content;
		msg.thumbs = param.thumbs;
		msg.miniProgram = param.miniProgram;
	}

	// 发送分享
	if (sb.s.authenticated) {
		//alert("---已授权---");
		shareMessage(msg, sb.s);
	} else {
		//alert("---未授权---");
		sb.s.authorize(function() {
			shareMessage(msg, sb.s);
		}, function(e) {
			plus.nativeUI.alert("认证授权失败：" + e.code + " - " + e.message);
		});
	}
}

/**
 * 发送分享消息
 * @param {JSON} msg
 * @param {plus.share.ShareService}
 */
function shareMessage(msg, s) {
	console.log(JSON.stringify(msg));
	s.send(msg, function() {
		message("分享到\"" + s.description + "\"成功", 'center');
	}, function(e) {
		// plus.nativeUI.alert("分享到\"" + s.description + "\"失败: " + JSON.stringify(e));
		// message("分享到\"" + s.description + "\"失败: " + JSON.stringify(e));
		message("分享失败");
		console.log("分享到\"" + s.description + "\"失败: " + JSON.stringify(e));
	});
}


/**
 * 解析url
 * @param url 要解析的url
 */
function parseUrl(url) {
	var str = url.split("?")[1],
		items = str.split("&");
	var arr, name, value;
	var param = {};
	for (var i = 0, l = items.length; i < l; i++) {
		arr = items[i].split("=");
		name = arr[0];
		value = arr[1];
		param[name] = value;
	}
	return param;
}

/**
 * 获取手机通讯录 
 * 调用方法：nativeCommon.contacts.getContact(function callBack(name, phoneNumber));
 */
var nativeCommon = {
	contacts: {
		getContact: function(callBack) {
			switch (plus.os.name) {
				case "iOS":
					if (plus.device.model === "iPhoneSimulator") {
						//模拟器
						nativeCommon.contacts.ios.visitContacts(function(name, phoneNumber) {
							var phone = phoneNumber.replace('+86', '').replace(/\s/g, '').replace(/-/g, '');
							callBack(name, phone);
						});
					} else {
						//真机
						nativeCommon.contacts.ios.visitAddressBook(function(name, phoneNumber) {
							var phone = phoneNumber.replace('+86', '').replace(/\s/g, '').replace(/-/g, '');
							callBack(name, phone);
						});
					}
					break;
				case "Android":
					nativeCommon.contacts.android.visitContacts(function(name, phoneNumber) {
						var phone = phoneNumber.replace('+86', '').replace(/\s/g, '').replace(/-/g, '');
						callBack(name, phone);
					});
					break;
				default:
					break;
			}
		},
		ios: { //供iOS系统调用
			/**
			 * 访问通讯录，将获取的联系人信息通过callBack返回
			 * 仅限模拟器使用（Native.js 的bug）
			 * @param {Object} callBack回调
			 */
			visitContacts: function(callBack) {
				var contactPickerVC = plus.ios.newObject("CNContactPickerViewController");
				//实现代理方法【- (void)contactPicker:(CNContactPickerViewController *)picker didSelectContact:(CNContact *)contact;】
				//同时生成遵守CNContactPickerDelegate协议的代理对象delegate
				var delegate = plus.ios.implements("CNContactPickerDelegate", {
					"contactPicker:didSelectContact:": function(picker, contact) {
						console.log(JSON.stringify(picker));
						console.log(JSON.stringify(contact));
						//姓名
						var name = "";
						//姓氏
						var familyName = contact.plusGetAttribute("familyName");
						//名字
						var givenName = contact.plusGetAttribute("givenName");
						name = familyName + givenName;
						//电话号码
						var phoneNo = "";
						var phoneNumbers = contact.plusGetAttribute("phoneNumbers");
						if (phoneNumbers.plusGetAttribute("count") > 0) {
							var phone = phoneNumbers.plusGetAttribute("firstObject");
							var phoneNumber = phone.plusGetAttribute("value");
							phoneNo = phoneNumber.plusGetAttribute("stringValue");
						}
						if (callBack) {
							callBack(name, phoneNo);
						}
					}
				});
				//给通讯录控制器contactPickerVC设置代理
				plus.ios.invoke(contactPickerVC, "setDelegate:", delegate);
				//获取当前UIWebView视图
				var currentWebview = plus.ios.currentWebview();
				//根据当前UIWebView视图获取当前控制器
				var currentVC = nativeCommon.contacts.ios.getViewControllerByView(currentWebview);
				//由当前控制器present到通讯录控制器
				plus.ios.invoke(currentVC, "presentViewController:animated:completion:", contactPickerVC, true, null);
			},
			/**
			 * 访问通讯录，将获取的联系人信息通过callBack返回
			 * 仅限真机使用（Native.js 的bug）
			 * @param {Object} callBack
			 */
			visitAddressBook: function(callBack) {
				var peoplePickerNavController = plus.ios.newObject("ABPeoplePickerNavigationController");
				//实现代理方法【- (void)peoplePickerNavigationController:(ABPeoplePickerNavigationController *)peoplePicker didSelectPerson:(ABRecordRef)person;】
				//同时生成遵守ABPeoplePickerNavigationControllerDelegate协议的代理对象peoplePickerDelegate
				var peoplePickerDelegate = plus.ios.implements("ABPeoplePickerNavigationControllerDelegate", {
					"peoplePickerNavigationController:didSelectPerson:": function(peoplePicker, person) {
						//这里的peoplePicker竟然是CNContact实例对象，person是undefined
						console.log(JSON.stringify(peoplePicker));
						console.log(JSON.stringify(person));
						console.log(typeof person);

						//所以之前的代码不用改
						var contact = peoplePicker;
						//姓名
						var name = "";
						//姓氏
						var familyName = contact.plusGetAttribute("familyName");
						//名字
						var givenName = contact.plusGetAttribute("givenName");
						name = familyName + givenName;
						//电话号码
						var phoneNo = "";
						var phoneNumbers = contact.plusGetAttribute("phoneNumbers");
						if (phoneNumbers.plusGetAttribute("count") > 0) {
							var phone = phoneNumbers.plusGetAttribute("firstObject");
							var phoneNumber = phone.plusGetAttribute("value");
							phoneNo = phoneNumber.plusGetAttribute("stringValue");
						}
						if (callBack) {
							callBack(name, phoneNo);
						}
					}
				});
				//给通讯录控制器peoplePickerNavController设置代理
				plus.ios.invoke(peoplePickerNavController, "setPeoplePickerDelegate:", peoplePickerDelegate);
				//获取当前UIWebView视图
				var currentWebview = plus.ios.currentWebview();
				//根据当前UIWebView视图获取当前控制器
				var currentVC = nativeCommon.contacts.ios.getViewControllerByView(currentWebview);
				//由当前控制器present到通讯录控制器
				plus.ios.invoke(currentVC, "presentViewController:animated:completion:", peoplePickerNavController, true, null);
			},
			/**
			 * 根据view获取到当前控制器
			 * @param {Object} view
			 */
			getViewControllerByView: function(view) {
				if (plus.os.name != "iOS") {
					return null;
				}
				//UIViewController类对象
				var UIViewController = plus.ios.invoke("UIViewController", "class");
				while (view) {
					var responder = plus.ios.invoke(view, "nextResponder");
					if (plus.ios.invoke(responder, "isKindOfClass:", UIViewController)) {
						return responder;
					}
					view = plus.ios.invoke(view, "superview");
				}
				return null;
			}
		},
		android: { //供android系统调用
			visitContacts: function(callBack) {
				var REQUESTCODE = 1000;
				main = plus.android.runtimeMainActivity();
				var Intent = plus.android.importClass('android.content.Intent');
				var ContactsContract = plus.android.importClass('android.provider.ContactsContract');
				var intent = new Intent(Intent.ACTION_PICK, ContactsContract.Contacts.CONTENT_URI);
				main.onActivityResult = function(requestCode, resultCode, data) {
					if (REQUESTCODE == requestCode) {
						var phoneNumber = "";
						var resultString = "";
						var context = main;
						plus.android.importClass(data);
						var contactData = data.getData();
						var resolver = context.getContentResolver();
						plus.android.importClass(resolver);
						var cursor = resolver.query(contactData, null, null, null, null);
						plus.android.importClass(cursor);
						cursor.moveToFirst();
						//姓名
						var givenName = cursor.getString(cursor.getColumnIndex(ContactsContract.Contacts.DISPLAY_NAME)) || "";
						var contactId = cursor.getString(cursor.getColumnIndex(ContactsContract.Contacts._ID));
						var pCursor = resolver.query(ContactsContract.CommonDataKinds.Phone.CONTENT_URI, null, ContactsContract.CommonDataKinds
							.Phone.CONTACT_ID + " = " + contactId, null, null);
						if (pCursor.moveToNext()) {
							phoneNumber = pCursor.getString(pCursor.getColumnIndex(ContactsContract.CommonDataKinds.Phone.NUMBER));
						}
						if (callBack) {
							callBack(givenName, phoneNumber);
						}
						cursor.close();
						pCursor.close();
					}
				};
				main.startActivityForResult(intent, REQUESTCODE);
			}
		}
	}
}

//绑定个推clientid
function bindClientId() {
	var clientInfo = plus.push.getClientInfo();
	var clientId = clientInfo.clientid;
	var clientType = plus.os.name;
	var userInfo = getUserInfo();
	mui.post($ajaxUrl + 'member', {
		action: 'bind_client_id',
		token: userInfo.token,
		client_id: clientId,
		client_type: clientType
	}, function(res) {
		// logs(res);
		if (res.errno == 1) {
			setTimeout(function() {
				bindClientId();
			}, 3000)
		}
	}, 'json');
}

//消息推送初始化
function pushInit() {
	// if (plus.os.name == 'iOS') {
	// 	plus.push.clear();
	// }
	plus.push.addEventListener('receive', function(msg) {
		console.log(JSON.stringify(msg));
		try {
			if (!msg.payload) {
				return;
			}
			if (plus.os.name == "Android") {
				msg.payload = JSON.parse(msg.payload);
			}
			pushCallback(msg.payload, 'receive');
		} catch (e) {
			var imei = plus.device.imei;
			var imsi = plus.device.imsi;
			var model = plus.device.model;
			var vendor = plus.device.vendor;
			var uuid = plus.device.uuid;
			var content = '运行发生错误,错误内容:' + e.message + ',错误设备详情:设备身份码' + imei + ',用户识别码' + imsi + ',设备型号' + model + ',生产厂商' +
				vendor + ',唯一标识' + uuid;
			appErrorCollection(content);
			console.log(e.message);
		}
	})

	plus.push.addEventListener('click', function(msg) {
		console.log(JSON.stringify(msg));
		// try {
		// if (plus.os.name == 'iOS') {
		// 	plus.push.clear();
		// }
		if (!msg.payload) {
			return;
		}
		if (plus.os.name == "Android") {
			msg.payload = JSON.parse(msg.payload);
		}
		pushCallback(msg.payload, 'click');
		// } catch (e) {
		// 	console.log(e.message);
		// }
	})
}

/**
 * 消息推送处理
 * event: click,receive
 * type:jump, refren
 * url:dialog, chat
 * chat:crm, customer, friend
 */
function pushCallback(data, event) {
	// try {
	var type = data.type;
	var url = data.url;
	var extra = data.extra;
	logs(type);
	logs(url);
	logs(extra);
	logs(event);
	if (event == 'click') {
		if (type == 'jump') {
			if (url == 'chat') {
				if (data.chat == 'customer') {
					mui.fire(plus.webview.getWebviewById('customer'), 'refreshCustomer');
				} else if (data.chat == 'friend') {
					mui.fire(plus.webview.getWebviewById("friend"), 'refreshFriend');
				} else if (data.chat == 'crm') {
					mui.fire(plus.webview.getWebviewById("crm"), 'refreshCrm');
				}
			} else if (url == 'dialog') {
				// mui.fire(plus.webview.getWebviewById('chat'), 'refreshNotice');
				// mui.fire(plus.webview.getWebviewById('home'), 'refreshNotice');
				// mui.fire(plus.webview.getWebviewById('user'), 'refreshNotice');
				// console.log(33333);
				mui.fire(plus.webview.getWebviewById('H54F3E71F'), 'refreshNotice');
				mui.fire(plus.webview.getWebviewById('message'), 'refreshNotice');
				// fnOpenWin('html/' + url + '.html', url, {
				// 	statusbar: {
				// 		background: '#F7F7F7'
				// 	}
				// }, extra, '');
			} else if (url == 'message') {
				mui.fire(plus.webview.getWebviewById('message'), 'refreshNotice');
				fnOpenWin('html/' + url + '.html', url, {
					statusbar: {
						background: '#FFFFFF'
					}
				}, extra, '');
			} else {
				if (url) {
					logs(url);
					fnOpenWin('html/' + url + '.html', url, '', extra, '');
				}
			}
		} else if (type == 'refresh') {
			if (url == 'activation') {
				updateUserInfo();
				mui.fire(plus.webview.getWebviewById('user'), 'activationSuccess');
				mui.fire(plus.webview.getWebviewById('member'), 'activationSuccess');
				mui.fire(plus.webview.getWebviewById('maker'), 'activationSuccess');
				mui.fire(plus.webview.getWebviewById('agent'), 'activationSuccess');
			} else if (url == 'logout') {
				fnLogout();
			} else {
				mui.fire(plus.webview.getWebviewById(url), 'refresh');
			}
		}
	} else if (event == 'receive') {
		if (url == 'dialog') {
			// plus.device.beep();
			// plus.device.vibrate();
			if (type == 'cancel') {
				mui.fire(plus.webview.getWebviewById('dialog'), 'sendCancel');
			} else {
				mui.fire(plus.webview.getWebviewById('H54F3E71F'), 'refreshNotice');
				mui.fire(plus.webview.getWebviewById('message'), 'refreshNotice');
				playNoticeAudio();
			}
		} else if (url == 'chat') {
			if (data.chat == 'customer') {
				mui.fire(plus.webview.getWebviewById('customer'), 'refreshCustomer');
			} else if (data.chat == 'friend') {
				mui.fire(plus.webview.getWebviewById('H54F3E71F'), 'refreshNotice');
				mui.fire(plus.webview.getWebviewById('friend'), 'refreshFriend');
			} else if (data.chat == 'crm') {
				mui.fire(plus.webview.getWebviewById('crm'), 'refreshCrm');
			}
			playNoticeAudio();
		}  else if (url == 'team_chat') {
			mui.fire(plus.webview.getWebviewById('H54F3E71F'), 'refreshNotice');
			mui.fire(plus.webview.getWebviewById('message'), 'refreshNotice');
			playNoticeAudio();
		} else if (url == 'activation') {
			mui.fire(plus.webview.getWebviewById('user'), 'activationSuccess');
			mui.fire(plus.webview.getWebviewById('member'), 'activationSuccess');
			mui.fire(plus.webview.getWebviewById('maker'), 'activationSuccess');
			mui.fire(plus.webview.getWebviewById('agent'), 'activationSuccess');
			updateUserInfo();
		} else if (url == 'buyGoodsBoothSuccess') {
			updateUserInfo();
			setTimeout(function() {
				mui.fire(plus.webview.getWebviewById('shop_setting'), 'buySuccess');
			}, 2000)
		} else if (url == 'message') {
			mui.fire(plus.webview.getWebviewById('message'), 'refreshNotice');
			playNoticeAudio();
		} else if (url == 'logout') {
			fnLogout();
		} else {
			mui.fire(plus.webview.getWebviewById(url), 'refresh');
		}
	}
	// } catch (e) {
	// 	console.log(e.message);
	// }
	return;
}

function playNoticeAudio() {
	if (plus.os.name == 'Android') {
		var context = plus.android.runtimeMainActivity();
		var RingtoneManager = plus.android.importClass('android.media.RingtoneManager');
		var uri = RingtoneManager.getActualDefaultRingtoneUri(context, RingtoneManager.TYPE_NOTIFICATION);
		if (uri != null) {
			plus.android.importClass(uri);
			if (uri.toString().indexOf('ogg') != -1) {
				uri = '/plugins/music/tim.wav';
			}
			var p = plus.audio.createPlayer(uri.toString());
			p.play(function() {
				logs("System Audio play success!");
			}, function(e) {
				logs("System Audio play error: " + e.message);
			})
		} else {
			var p = plus.audio.createPlayer('/plugins/music/tim.wav');
			p.play(function() {
				logs("APP Audio play success!");
			}, function(e) {
				logs("APP Audio play error: " + e.message);
			})
		}
	} else {
		plus.ios.invoke(null, "AudioServicesPlaySystemSound", 1002);
	}
}

// 设置数字
function setBadge(number) {
	plus.runtime.setBadgeNumber(number);
}
// 清除数字
function clearBadge() {
	if (plus.os.name == 'iOS') {
		plus.runtime.setBadgeNumber(0);
	} else {
		plus.runtime.setBadgeNumber(-1);
		plus.push.clear();
	}
}

//将BASE 64保存为文件
function baseImgFile(uid, base64, quality, callback) {
	quality = quality || 100;
	callback = callback || $.noop;
	var bitmap = new plus.nativeObj.Bitmap();
	// 从本地加载Bitmap图片
	bitmap.loadBase64Data(base64, function() {
		bitmap.save("_doc/" + uid + ".jpg", {
			overwrite: true,
			quality: quality
		}, function(i) {
			callback(i);
			plus.gallery.save(i.target);
			bitmap.clear();
		}, function(e) {
			message("保存失败！");
			console.log('保存图片失败：' + JSON.stringify(e));
		});
	}, function(e) {
		console.log('加载图片失败：' + JSON.stringify(e));
	});
}

function fnLogout() {
	plus.nativeUI.alert('您的账号在其他设备登录,本设备被强制退出!', function() {
		localStorage.removeItem("user");
		// var login = plus.webview.create("login.html", "login", {
		// 	statusbar: {
		// 		background: '#122c9a'
		// 	}
		// }, '');

		// 获取所有Webview窗口
		var curr = plus.webview.currentWebview();
		var wvs = plus.webview.all();
		if (plus.os.name == "iOS") {
			mui.get($ajaxUrl + 'member', {
				action: 'login_setting',
			}, function(res) {
				getAppInfo(function(e) {
					if (res.data.login_type == 2 && res.data.app_version == e.version) {
						for (var i = 0; i < wvs.length; i++) {
							if (wvs[i].getURL() == curr.getURL() || wvs[i].id == 'H54F3E71F') {
								continue;
							} else {
								plus.webview.close(wvs[i]);
							}
						}
						fnOpenWin('mobile_login.html', 'mobile_login', {
							statusbar: {
								background: '#2289FF'
							}
						}, '', 'slide-in-bottom');
						// curr.hide();
						// curr.close();
					} else {
						for (var i = 0; i < wvs.length; i++) {
							if (wvs[i].getURL() == curr.getURL() || wvs[i].id == 'H54F3E71F') {
								continue;
							} else {
								plus.webview.close(wvs[i]);
							}
						}
						fnOpenWin('login.html', 'login', {
							statusbar: {
								background: '#122c9a'
							}
						}, '', 'slide-in-bottom');
						// curr.hide();
						// curr.close();
					}
				})
			}, 'json');
		} else {
			// plus.runtime.restart();
			for (var i = 0; i < wvs.length; i++) {
				if (wvs[i].getURL() == curr.getURL() || wvs[i].id == 'H54F3E71F') {
					continue;
				} else {
					plus.webview.close(wvs[i]);
				}
			}
			fnOpenWin('/html/login.html', 'login', {
				statusbar: {
					background: '#122c9a'
				}
			}, '', 'slide-in-bottom');
			// curr.hide();
			// curr.close();
			// logs(plus.webview.all());
		}
	})
}

//监听网络状态 
function onNetChange() {
	var nt = plus.networkinfo.getCurrentType();
	switch (nt) {
		case 1:
			console.log('offline');
			fnOpenWin('/html/network_outage.html', 'network_outage', {
				statusbar: {
					background: '#FFF'
				}
			}, '', 'slide-in-bottom');
			break;
		case plus.networkinfo.CONNECTION_ETHERNET:
		case plus.networkinfo.CONNECTION_WIFI:
			var web = plus.webview.getWebviewById('network_outage');
			if (web) {
				plus.webview.close('network_outage', 'none');
			}
			break;
		case plus.networkinfo.CONNECTION_CELL2G:
		case plus.networkinfo.CONNECTION_CELL3G:
		case plus.networkinfo.CONNECTION_CELL4G:
			var web = plus.webview.getWebviewById('network_outage');
			if (web) {
				plus.webview.close('network_outage', 'none');
			}
			break;
		default:
			console.log('netchange');
			break;
	}
}

//手机APP错误信息
function appErrorCollection(content) {
	mui.get($ajaxUrl + 'util', {
		action: 'app_error_collection',
		content: content
	}, function(res) {
		console.log(res);
	}, 'json');
}

function getContactsInit() {
	plus.contacts.getAddressBook(plus.contacts.ADDRESSBOOK_PHONE, function(addressbook) {
		// 可通过addressbook进行通讯录操作
		console.log("Get address book success!");
	}, function(e) {
		console.log("Get address book failed: " + e.message);
	});
}

// 下载wgt文件  
function downWgt() {
	var wgtUrl = "https://cdn.wangkeapp.cn/wangke.wgt";
	plus.nativeUI.showWaiting("升级中...");
	// showload(0, 0, "升级中...", "rgba(0,0,0,0.5)");
	plus.downloader.createDownload(wgtUrl, {
		filename: "_doc/update/"
	}, function(d, status) {
		if (status == 200) {
			console.log("下载文件成功：" + d.filename);
			installWgt(d.filename); // 安装wgt包  
		} else {
			console.log("下载文件失败！");
			plus.nativeUI.alert("下载文件失败！");
			// plus.nativeUI.closeWaiting();
			showload(1, 1000);
		}
	}).start();
}

// 更新应用资源  
function installWgt(path) {
	// showload(0, 0, "文件安装中...", "rgba(0,0,0,0.5)");
	plus.runtime.install(path, {}, function() {
		// plus.nativeUI.closeWaiting();
		showload(1, 1000);
		console.log("安装文件成功！");
		plus.nativeUI.alert("应用资源更新完成！", function() {
			plus.runtime.restart();
		});
	}, function(e) {
		showload(1, 1000);
		console.log("安装文件失败[" + e.code + "]：" + e.message);
		plus.nativeUI.alert("安装文件失败[" + e.code + "]：" + e.message);
	});
}

//获取APP信息
function getAppInfo(callback) {
	plus.runtime.getProperty(plus.runtime.appid, function(wgtinfo) {
		callback(wgtinfo);
	});
}

// 做页面数据缓存，key值一定是页面的id，如果有多个id_01、id_02依次类推
function cacheData(key, val) {
	// 默认传入的都是对象
	plus.storage.setItem(key, JSON.stringify(val));
}

//获取缓存数据
function getcache(key) {
	var _cache = plus.storage.getItem(key);
	return JSON.parse(_cache);
}

// 等待框
function showload(status, delay, msg, bgc) {
	if (status) {
		if (delay) {
			setTimeout(function() {
				plus.nativeUI.closeWaiting();
			}, delay);
		} else {
			plus.nativeUI.closeWaiting();
		}
		return;
	}
	plus.nativeUI.showWaiting(msg, {
		background: bgc || "rgba(0,0,0,0)",
		loading: {
			display: 'block',
			height: '70px',
			icon: "../image/jump.png",
			interval: 25
		}
	});
}

//获取支付错误信息
function wxpayErrorMessage(errcode) {
	var messageList = {
		"-1": "一般错误",
		"-2": "用户取消",
		"-3": "发送失败",
		"-4": "认证被否决",
		"-5": "不支持错误",
	};
	if (messageList[errcode]) {
		return messageList[errcode];
	} else {
		return "请求错误";
	}
}
