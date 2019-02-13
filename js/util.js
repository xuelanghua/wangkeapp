$ajaxUrl = 'https://wangke.ynhost.cn/app/index.php?i=2&c=entry&m=longbing_card&do=';
$uploadUrl = 'https://wangke.ynhost.cn/app/index.php?i=2&c=utility&a=file&do=upload&type=image&thumb=0';
var getUserInfo = function() {
	return JSON.parse(localStorage.getItem('user'));
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
