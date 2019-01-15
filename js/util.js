$ajaxUrl = 'https://wangke.wxschool.net/app/index.php?i=2&c=entry&m=longbing_card&do=';
var getUserInfo = function() {
	return JSON.parse(localStorage.getItem('user'));
}