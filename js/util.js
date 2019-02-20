$ajaxUrl = 'https://wangke.ynhost.cn/app/index.php?i=2&c=entry&m=longbing_card&do=';
$uploadUrl = 'https://wangke.ynhost.cn/app/index.php?i=2&c=utility&a=file&do=upload&type=image&thumb=0';
var getUserInfo = function() {
	return JSON.parse(localStorage.getItem('user'));
}

function checkMember() {
	var userInfo = getUserInfo();
	if (userInfo.is_activation == 0) {
		plus.nativeUI.confirm('此功能需要开通VIP会员才可使用,前往开通?', function(e) {
			if (e.index == 0) {
				fnOpenWin('activation.html', 'activation', '', '', 'slide-in-right');
			}
		});
	} else if (userInfo.is_activation == 1 && userInfo.expire_time < parseInt(new Date().getTime()/1000)) {
		plus.nativeUI.confirm('您的会员已到期,前往续费?', function() {
			if (e.index == 0) {
				fnOpenWin('activation.html', 'activation', '', '', 'slide-in-right');
			}
		});
	}
}

function updateUserInfo(userInfo) {
	mui.post($ajaxUrl + 'member&action=info', {token: userInfo.token}, function(res) {
		localStorage.setItem('user', JSON.stringify(res.data));
	})
}

function setStatusBar(color, style) {
	plus.navigator.setStatusBarBackground(color);
	plus.navigator.setStatusBarStyle(style);
}

function fnOpenWin(url, id, style, extra, aniShow) {
	var page = plus.webview.create(url, id, style, extra);
	page.show(aniShow);
}

function fnCloseWin(id) {
	plus.webview.close(id);
}

function message(text) {
	plus.nativeUI.toast(text);
}
