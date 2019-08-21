//调用图片上传
function chooseMedia(type, success, fail) {
	if (mui.os.plus) {
		var buttonTitle = [{
				title: "从相册选择",
				style: 'default'
			}];
		if (type == "none" || type == 'image') {
			var option = {
				title: "拍照",
				style: "default"
			};
			buttonTitle.unshift(option);
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
					if (type == 'video')
						galleryImg(type, success, fail); /*打开相册*/
					else
						takePhoto(success, fail); /*拍照*/
					break;
				case 2:
					galleryImg(type, success, fail); /*打开相册*/
					break;
				default:
					break;
			}
		})
	}
}

// 拍照获取图片
function takePhoto(success, fail) {
	var camera = plus.camera.getCamera();
	camera.captureImage(function(e) {
		plus.io.resolveLocalFileSystemURL(e, function(entry) {
			resizeImage(entry.toLocalURL(), success, fail);
		}, function(e) {
			fail(e);
		});
	}, function(s) {
		fail(s);
	}, {
		filename: "_doc/camera/"
	})
}

// 从相册中选择图片 
function galleryImg(type, success, fail) {
	// 从相册中选择图片
	plus.gallery.pick(function(e) {
		var ext = e.substring(e.lastIndexOf(".") + 1).toLocaleLowerCase();
		var imageExt = ["jpg", "jgeg", "png", "gif", "bmp", "webp"];
		if (imageExt.indexOf(ext) != -1) {
			resizeImage(e, success, fail);
		} else {
			verifyVideo(e, success, fail);
		}
	}, function(e) {
		fail({code: 99, message: "用户取消选择"});
	}, {
		filter: type,
		multiple: false,
		maximum: 1,
		system: false,
		onmaxed: function() {
			plus.nativeUI.alert('最多只能选择1张图片');
		}
	});
}

//压缩（需要获取本地文件权限）  
function resizeImage(src, success, fail) {
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
				width: '1024px', //这里指定了宽度，同样可以修改  
				format: 'jpg',
				quality: 100, //图片质量不再修改，以免失真  
				rotate: direction
			}, function(e) {
				upload(e.target, "image", success, fail);
			}, function(err) {
				fail(err);
			})
		},
		fail: function(error) {
			fail(error);
		}
	});
}

//视频检查
function verifyVideo(src, success, fail) {
	plus.io.getVideoInfo({
		filePath: src,
		success: function(res) {
			if (res.size < $videoMaxSize) {
				upload(src, 'video', success, fail);
			} else {
				fail({code: 101, message: "选择视频文件过大"});
			}
		},
		fail: function(error) {
			fail(error);
		}
	});
}

// 上传的方法
function upload(file, type, success, fail) {
	var uploadUrl = "";
	if (type == 'image') {
		uploadUrl = $uploadUrl;
		showload(false, false, '图片上传中...', "rgba(0,0,0,0.5)");
	} else {
		uploadUrl = $videoUrl;
		showload(false, false, '视频上传中...', "rgba(0,0,0,0.5)");
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
					// plus.nativeUI.alert(res.error.message, showload(1), '提示', 'OK');
				} else {
					showload(1);
					res["type"] = type;
					success(res);
				}
			} else {
				fail({code: 103, message: "上传失败"})
				console.log("上传失败：" + status);
				// plus.nativeUI.alert('上传失败!', showload(1), '提示', 'OK');
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
	}, 10000);
}