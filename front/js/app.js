// 부스트캠프 웹 과제
// 정구범

var $new_form = $('#form-container');
var $todo_list = $('#todo_list');
var $todo_count = $('#todo_count');
var $active = $('#active_a');
var $completed = $('#completed_a');
var $all = $('#all_a');
var $clear_completed = $('#clear_completed');
var todo_count=0;

// db에 현재 시간을 넣어 주었습니다
function getTimeStamp() {
	var d = new Date();
	var s =
		leadingZeros(d.getFullYear(), 4) + '-' +
		leadingZeros(d.getMonth() + 1, 2) + '-' +
		leadingZeros(d.getDate(), 2) + ' ' +

		leadingZeros(d.getHours(), 2) + ':' +
		leadingZeros(d.getMinutes(), 2) + ':' +
		leadingZeros(d.getSeconds(), 2);

	return s;
}

function leadingZeros(n, digits) {
	var zero = '';
	n = n.toString();

	if (n.length < digits) {
		for (var i = 0; i < digits - n.length; i++)
			zero += '0';
	}
	return zero + n;
}

// 할일을 입력해서 post로 보내는 함수 입니다.
function submitData() {

	var todo_data = $('#new_todo').val();
	if(todo_data == ""){
		alert("빈 문장은 가능하지 않습니다");
		return false;
	}

	var data = {'todo':todo_data };

	$.ajax({
		type: "POST",
		url: "example.py",
		data: { param: todo_data}
	}).done(function( data ) {
		$todo_list.prepend('<li><div class="view">' +
			'<input name="completed_checkbox" class="toggle" type="checkbox">' +
			'<label>'+data+'</label><button class="destroy"></button></div>' +
			'<input class="edit" value="Rule the web"></li>')
	});


	$('#new_todo').val("");


	return false;
}

// 처음에 db에 저장되어 있는 할일들을 다 불러옵니다
function loadData() {
	var URL = "http://localhost:8080/api/todo";

	$.ajax({
		url : URL,
		contentType:"application/json",
		type: "get",
		success : function(data){

			for(var i=0;i<data.length;i++){
				console.log(data[i].id);
				if(data[i].completed){
					$todo_list.prepend('<li class = "completed"><div class="view">' +
						'<input name="completed_checkbox" id="'+data[i].id+'" class="toggle" type="checkbox" checked>' +
						'<label>'+data[i].todo+'</label><button class="destroy"></button></div>' +
						'<input class="edit" value="Rule the web"></li>')
				}else{
					todo_count++;
					$todo_list.prepend('<li><div class="view">' +
						'<input name="completed_checkbox" id="'+data[i].id+'" class="toggle" type="checkbox">' +
						'<label>'+data[i].todo+'</label><button class="destroy"></button></div>' +
						'<input class="edit" value="Rule the web"></li>')
				}

			}

			$todo_count.text(todo_count);

		}
	});

	return false;
}

// 버튼을 눌렀을 때 해당 할일을 completed 상태로 바꿔줍니다.
function completeData(){
	$(this).parent().parent().toggleClass('completed');
	console.log($(this).attr('id'));
	console.log($(this).is(":checked"));

	var checked = $(this).is(":checked") ? 1:0;

	var id = $(this).attr('id');
	var URL = "http://localhost:8080/api/todo/"+id;
	var data = {'completed': checked};

	$.ajax({
		url : URL,
		contentType:"application/json",
		type: "put",
		data: JSON.stringify(data),
		success : function(data){

		}
	});

	if(checked) {
		todo_count--;
		$todo_count.text(todo_count);
	}else{
		todo_count++;
		$todo_count.text(todo_count);
	}

}


// 할일 옆에 x버튼을 눌렀을 경우 해당 할일을 지웁니다.
function deleteData(){

	var id = $(this).parent().find("input").attr('id');
	var URL = "http://localhost:8080/api/todo/"+id;

	var checked = $(this).parent().find("input").is(":checked");
	$(this).parent().parent().remove();

	$.ajax({
		url : URL,
		contentType:"application/json",
		type: "delete",
		success : function(){

		}
	});

	if(!checked){
		todo_count--;
		$todo_count.text(todo_count);
	}
}

// completed 누르면 completed만 나오게 합니다.
function filterCompleted(){

	$completed.addClass('selected');
	$active.removeClass('selected');
	$all.removeClass('selected');

	$todo_list.children().each(function() {
		if($(this).children().find("input").is(":checked")){
			$(this).show();
		}else{
			$(this).hide();
		}
	});
}

// 마찬가지로 active한 할일들만 나오게 합니다
function filterActive(){

	$active.addClass('selected');
	$completed.removeClass('selected');
	$all.removeClass('selected');

	$todo_list.children().each(function() {
		if($(this).children().find("input").is(":checked")){
			$(this).hide();
		}else{
			$(this).show();
		}
	});
}

// 모든 할일이 다 나오게 합니다.
function filterAll(){

	$all.addClass('selected');
	$active.removeClass('selected');
	$completed.removeClass('selected');

	$todo_list.children().each(function() {
		$(this).show();
	});
}

// 해당 id를 지웁니다.
function deleteDataById(_id){

	var id = _id;
	var URL = "http://localhost:8080/api/todo/"+id;

	$.ajax({
		url : URL,
		contentType:"application/json",
		type: "delete",
		success : function(){

		}
	});
}

// comlpeted 된 할일들만 찾아서 지웁니다.
function deleteCompletedAll(){
	$('input:checkbox[name="completed_checkbox"]:checked').each(function() {
		var id=$(this).attr('id');
		$(this).parent().parent().remove();
		deleteDataById(id);
	});
}

loadData(); // 시작하면 할일 data를 불러옵니다.
$new_form.submit(submitData); // 엔터를 눌렀을 경우
$todo_list.on('change','input',completeData); // complete 버튼을 눌렀을 경우
$todo_list.on('click','button',deleteData); // x 버튼을 눌렀을 경우
$completed.on('click',filterCompleted); // completed를 눌렀을 경우
$active.on('click',filterActive); // active를 눌렀을 경우
$all.on('click',filterAll); // all 을 눌렀을 경우
$clear_completed.on('click',deleteCompletedAll);  // clear completed를 눌렀을 경우


