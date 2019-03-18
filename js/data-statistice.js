// mui("#item2").on("tap",".select-time",function(){
// 	$(this).find(".mui-icon").toggleClass("mui-icon-arrowdown");
// })
$(function(){
	var userPicker = new mui.PopPicker();
	userPicker.setData([{
		value: 1,
		text: '近7天'
	}, {
		value: 2,
		text: '近30天'
	}]);
	var showUserPickerButton = document.getElementById('showUserPicker');
	var selectTitle = document.getElementById('selectTitle');
	showUserPickerButton.addEventListener('tap', function(event) {
		userPicker.show(function(items) {
			selectTitle.innerText = items[0].text;
		});
	}, false);
})