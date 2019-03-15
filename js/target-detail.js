// 显示我的目标
mui(".mui-bar-nav").on("tap", ".my-target-menu", function(e) {
	$(".target-modal-frame").addClass("active");
})
// 关闭我的目标
mui(".my-target-card .mui-card-footer").on("tap", ".close-btn", function() {
	var audio = document.getElementById("audio");
	$(".target-modal-frame").removeClass("active");
	$(".play-control .play-status").removeClass("active");
	$("#audio-control").addClass("play").removeClass("pause");
	getSong();
})
// 切换播放状态图标
mui(".target-modal-frame .target-list").on("tap", ".play-control", function() {
	$(this).find(".play-status").toggleClass("active");
	clicks();
})
$(function() {
	// 获取音频
	getSong();
	// 防止样式未加载完的时候页面错乱
	// 渐变进度条
	var progres = [90, 60, 70, 80, 60, 110];
	var className = ["exposure", "toker", "evolve", "communicate", "reporting", "deal"];
	mui.each(className, function(i, names) {
		var p = 0;
		var myVar = setInterval(function() {
			p += 1;
			mui('.progress-items.' + names + ' .progress-section').progressbar().setProgress(p);
			if (p == progres[i]) {
				p = 0;
				clearInterval(myVar);
			}
		}, 20);
	});
	// 年月日切换
	mui(".target-detail-heade").on("tap", ".mui-col-xs-4", function(e) {
		var typs = this.getAttribute('timeType');
		$(this).siblings('.mui-col-xs-4').children('i').removeClass("active");
		$(this).children('i').addClass('active');
		if (typs == "year") {
			document.getElementById("result").setAttribute('data-options', '{"type":"date","beginYear":2019,"endYear":2525}');
			var jike = document.getElementById("result").getAttribute('data-options');
			console.log(jike, "1");
		} else if (typs == "month") {
			document.getElementById("result").setAttribute('data-options','{"type":"month","beginYear":2019,"endYear":2525}');
			var jike = document.getElementById("result").getAttribute('data-options');
			console.log(jike, "2");
		} else {
			document.getElementById("result").setAttribute('data-options', '{"type":"date","beginYear":2019,"endYear":2525}');
			var jike = document.getElementById("result").getAttribute('data-options');
			console.log(jike, "3");
		}
	})
	// 日期选择器
	var btns = document.getElementById("result");
	btns.addEventListener('tap', function() {
		var _self = this;
		if (_self.picker) {
			_self.picker.show(function(rs) {
				console.log(rs);
				result.innerText =rs.text;
				_self.picker.dispose();
				_self.picker = null;
			});
		} else {
			var optionsJson = this.getAttribute('data-options') || '{}';
			var options = JSON.parse(optionsJson);
			var id = this.getAttribute('id');
			_self.picker = new mui.DtPicker(options);
			_self.picker.show(function(rs) {
				console.log(rs);
				result.innerText =rs.text;
				_self.picker.dispose();
				_self.picker = null;
			});
		}
	}, false);
})
//获取歌曲链接并插入dom中
function getSong() {
	var audio = document.getElementById("audio");
	audio.src = "https://wangke.ynhost.cn/attachment/images/longbing_card_upload/2/5810912501639961.mp3";
	// audio.loop = true;
	playCotrol();
}

//点击播放/暂停
function clicks() {
	var audio = document.getElementById("audio");
	if ($("#audio-control").hasClass("play")) {
		$("#audio-control").addClass("pause").removeClass("play");
		audio.play();
	} else {
		$("#audio-control").addClass("play").removeClass("pause");
		audio.pause();
	}
}

//播放事件监听
function playCotrol() {
	audio.addEventListener("loadeddata",
		function() {
			$("#control").addClass("play").removeClass("color_gray");
			var allTime = parseInt(audio.duration);
			$(".right-info span").text(allTime);
			// console.log(allTime)
			// console.log(audio.currentTime)
		}, false);
	audio.addEventListener("pause",
		function() {
			if (audio.currentTime == audio.duration) {
				audio.stop();
				audio.currentTime = 0;
			}
		}, false);
	audio.addEventListener("ended", function() {
		$("#audio-control .play-status").removeClass("active");
	}, false)
}
