/* 
	*1、上传视频和图片，单图单视频上传 使用默认参数
	*2、上传视频和图片，图片多张上传，视频单个上传 wangke.init({multiple: true, separate: true});
	* 
*/

var wangke = {
	options: {
		type: 'none',
		multiple: false,
		maximum: 9,
		message: '最多只能选择9张图片',
		separate: false
	},
	files: []
};

(function(w) {
	w.init = function(options) {
		for (var index in options) {
			if (options[index]) {
				w.options[index] = options[index];
			}
			if (index == 'maximum') {
				w.options.message = "最多只能选择" + options[index] + "张图片"
			}
		}
	}
	w.checkSpecialModel = function() {
		var deviceModel = plus.device.model.toLocaleLowerCase();
		// var specialModel = ['vivo', 'nx531j'];
		var specialModel = ['vivo'];
		var flag = false;
		for (var i in specialModel) {
			if (deviceModel.indexOf(specialModel[i]) > -1) {
				flag = true;
				break;
			}
		}
		return flag;
	}
	w.chooseMedia = function(success, fail) {
		if (mui.os.plus) {
			var isSpecialModel = w.checkSpecialModel();
			var buttonTitle = [{
				title: "从相册选择",
				style: 'default'
			}];
			if (w.options.type == "none" || w.options.type == 'image') {
				var option = {
					title: "拍照",
					style: "default"
				};
				buttonTitle.unshift(option);
			}
			if (isSpecialModel || w.options.separate) {
				var vivoOption = {
					title: "选择视频",
					style: 'default'
				}
				buttonTitle.push(vivoOption);
			}
			plus.nativeUI.actionSheet({
				cancel: "取消",
				buttons: buttonTitle
			}, function(b) { /*actionSheet 按钮点击事件*/
				switch (b.index) {
					case 0:
						fail({code: 100, message: "用户取消!"})
						break;
					case 1:
						if (w.options.type == 'video')
							w.galleryImg(w.options.type, success, fail); /*打开相册*/
						else
							w.takePhoto(success, fail); /*拍照*/
						break;
					case 2:
						if (isSpecialModel || w.options.separate)
							w.galleryImg('image', success, fail); /*打开相册选择图片*/
						else
							w.galleryImg(w.options.type, success, fail); /*打开相册*/
						break;
					case 3:
						w.galleryImg('video', success, fail); /*打开相册选择视频*/
						break;
					default:
						break;
				}
			})
		}
	}
	w.takePhoto = function(success, fail) {
		var camera = plus.camera.getCamera();
		camera.captureImage(function(e) {
			plus.io.resolveLocalFileSystemURL(e, function(entry) {
				w.files.push(e);
				showload(false, false, '图片上传中...', "rgba(0,0,0,0.5)");
				w.resizeImage(entry.toLocalURL(), success, fail);
			}, function(e) {
				fail(e);
			});
		}, function(s) {
			fail(s);
		}, {
			filename: "_doc/camera/"
		})
	}
	
	w.galleryImg = function (type, success, fail) {
		// 从相册中选择图片
		w.options.type = type;
		if ((w.options.type == 'none' && !w.options.separate) || w.options.type == 'video') {
			w.options.multiple = false;
		}
		plus.gallery.pick(function(e) {
			var imageExt = ["jpg", "jgeg", "png", "gif", "bmp", "webp"];
			if (!w.options.multiple || w.options.type == "video" || (w.options.type == "none" && !w.options.separate)) {
				w.files.push(e);
				var ext = e.substring(e.lastIndexOf(".") + 1).toLocaleLowerCase();
				if (imageExt.indexOf(ext) != -1) {
					showload(false, false, '图片上传中...', "rgba(0,0,0,0.5)");
					w.resizeImage(e, success, fail);
				} else {
					showload(false, false, '视频上传中...', "rgba(0,0,0,0.5)");
					w.verifyVideo(e, success, fail);
				}
			} else {
				var filesList = e.files;
				showload(false, false, '图片上传中...', "rgba(0,0,0,0.5)");
				for (var i in filesList) {
					w.files.push(e);
					w.resizeImage(filesList[i], success, fail);
				}
			}
		}, function(e) {
			fail({code: 99, message: "用户取消选择"});
		}, {
			filter: type,
			multiple: w.options.multiple,
			maximum: w.options.maximum,
			system: false,
			onmaxed: function() {
				fail({code: 105, message: w.options.message});
			}
		});
	}
	w.resizeImage = function (src, success, fail) {
		var filename = src.substring(src.lastIndexOf('/') + 1);
		var direction = 0;
		plus.io.getImageInfo({
			src: src,
			success: function(res) {
				var orientation = res.orientation;
				if (orientation == 'right') {
					direction = 90;
				} else if (orientation == 'left') {
					direction = 270;
				} else if (orientation == 'down') {
					direction = 180;
				}
				plus.zip.compressImage({
					src: src,
					dst: '_doc/' + filename,
					overwrite: true,
					// width: '1024px', //这里指定了宽度，同样可以修改  
					format: 'jpg',
					quality: 100, //图片质量不再修改，以免失真  
					rotate: direction
				}, function(e) {
					w.upload(e.target, "image", success, fail);
				}, function(err) {
					fail(err);
				})
			},
			fail: function(error) {
				showload(1);
				fail(error);
			}
		});
	}
	w.verifyVideo = function(src, success, fail) {
		plus.io.getVideoInfo({
			filePath: src,
			success: function(res) {
				if (res.size < $videoMaxSize) {
					w.upload(src, 'video', success, fail);
				} else {
					fail({code: 101, message: "选择视频文件过大"});
				}
			},
			fail: function(error) {
				showload(1);
				fail(error);
			}
		});
	}
	w.upload = function(file, type, success, fail) {
		var uploadUrl = "";
		if (type == 'image') {
			uploadUrl = $uploadUrl;
		} else {
			uploadUrl = $videoUrl;
		}
		var task = plus.uploader.createUpload(uploadUrl, {
				method: "POST",
				blocksize: 614400,
				priority: 100
			},
			function(t, status) { //上传完成
				if (status == 200) {
					var res = JSON.parse(t.responseText);
					if (res.error) {
						fail({code: 102, message: res.error.message})
					} else {
						res["type"] = type;
						success(res);
					}
				} else {
					fail({code: 103, message: "上传失败"})
				}
				w.files.shift();
				if (w.files.length == 0) {
					showload(1);
				}
			}
		);
		// 页面中要上传的 图片路径
		task.addFile(file, {
			key: 'file'
		});
		task.start();
		setTimeout(function() {
			showload(1);
		}, 60000);
	}
})(wangke);
