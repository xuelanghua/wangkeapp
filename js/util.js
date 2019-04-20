$ajaxUrl = 'https://app.wangkeapp.cn/app/index.php?i=6&c=entry&m=longbing_card&do='; //服务器数据请求接口
$uploadUrl = 'https://app.wangkeapp.cn/app/index.php?i=6&c=utility&a=file&do=upload&type=image&thumb=0'; //图片上传接口
// $voiceUrl = 'https://wangke.ynhost.cn/web/index.php?c=utility&a=file&do=upload&upload_type=voice&uniacid=2'; //音频上传接口
$voiceUrl = 'https://app.wangkeapp.cn/app/index.php?i=6&c=entry&m=longbing_card&do=upload'; //音频上传接口

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
		plus.nativeUI.alert("获取分享服务列表失败：" + e.message);
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
 * @param {plus.share.ShareService} s
 */
function shareMessage(msg, s) {
	console.log(JSON.stringify(msg));
	s.send(msg, function() {
		message("分享到\"" + s.description + "\"成功", 'center');
	}, function(e) {
		plus.nativeUI.alert("分享到\"" + s.description + "\"失败: " + JSON.stringify(e));
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
	if (plus.os.name == 'iOS') {
		plus.push.clear();
	}
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
			console.log(e.message)
		}
	})

	plus.push.addEventListener('click', function(msg) {
		console.log(JSON.stringify(msg));
		try {
			if (plus.os.name == 'iOS') {
				plus.push.clear();
			}
			if (!msg.payload) {
				return;
			}
			if (plus.os.name == "Android") {
				msg.payload = JSON.parse(msg.payload);
			}
			pushCallback(msg.payload, 'click');
		} catch (e) {
			console.log(e.message);
		}
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
	try {
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
					if (type == 'customer') {
						mui.fire(plus.webview.getWebviewById(url), 'refreshCustomer');
					} else if (type == 'friend') {
						mui.fire(plus.webview.getWebviewById(url), 'refreshFriend');
					}
				} else if (url == 'dialog') {
					mui.fire(plus.webview.getWebviewById('chat'), 'refreshNotice');
					mui.fire(plus.webview.getWebviewById('home'), 'refreshNotice');
					mui.fire(plus.webview.getWebviewById('user'), 'refreshNotice');
					fnOpenWin('html/' + url + '.html', url, {statusbar: {background: '#F7F7F7'}}, extra, '');
				} else {
					if (url) {
						logs(url);
						fnOpenWin('html/' + url + '.html', url, '', extra, '');
					}
				}
			} else if (type == 'refresh') {
				mui.fire(plus.webview.getWebviewById(url), 'refresh');
			} 
		} else if (event == 'receive') {
			if (url == 'dialog') {
				// plus.device.beep();
				// plus.device.vibrate();
				mui.fire(plus.webview.getWebviewById('chat'), 'refreshNotice');
				mui.fire(plus.webview.getWebviewById('home'), 'refreshNotice');
				mui.fire(plus.webview.getWebviewById('user'), 'refreshNotice');
				
				plus.device.beep();
				playNoticeAudio();
			} else if (url == 'chat') {
				if (data.chat == 'customer') {
					mui.fire(plus.webview.getWebviewById(url), 'refreshCustomer');
				} else if (data.chat == 'friend') {
					logs(data);
					mui.fire(plus.webview.getWebviewById(url), 'refreshFriend');
				}
				
				playNoticeAudio();
			} else {
				mui.fire(plus.webview.getWebviewById(url), 'refresh');
			}
		}
	} catch (e) {
		console.log(e.message);
	}
}

function playNoticeAudio() {
	if (plus.os.name == 'Android') {
		var context = plus.android.runtimeMainActivity();
		var RingtoneManager = plus.android.importClass('android.media.RingtoneManager');  
		var uri = RingtoneManager.getActualDefaultRingtoneUri(context,RingtoneManager.TYPE_NOTIFICATION);
		plus.android.importClass(uri);  
		var p = plus.audio.createPlayer(uri.toString());
		var flag = true;
		p.play(function() {
			flag = false;
			logs("Audio play success!");   
		}, function(e) {  
			logs("Audio play error: " + e.message);
		})
		if (flag) {
			logs(33333);
			plus.device.vibrate();
		}
	} else {
		plus.ios.invoke(null,"AudioServicesPlaySystemSound", 1002);  
	}
}


