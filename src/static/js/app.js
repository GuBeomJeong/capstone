
var $new_form = $('#form-container');
var $new_form_crawl = $('#form-container-crawl');
var $crawl_list = $('#crawl_list');
var $google_list = $('#google_list');
var $todo_list = $('#todo_list');

// 할일을 입력해서 post로 보내는 함수 입니다.
function crawlData() {

	var context_data = $('#context_crawl').val();

	if(context_data == ""){
		alert("빈 문장은 가능하지 않습니다");
		return false;
	}

	var data = {'context_data':context_data};

	$.ajax({
		url : "http://localhost:5000/crawl",
		contentType:"application/json",
		type: "POST",
		data: JSON.stringify(data),
		//data:data,
		success : function(data){
			console.log(data);
			datas=JSON.parse(data)
			for(var i=0;i<datas.length;i++) {
                $crawl_list.prepend('<li><div class="view">' +
                    '<input class="toggle">' +
                    '<label><a href ="'+datas[i][0]+'">' + datas[i][1] + '</a></label></div>' +
                    '</li><li><div class="view"><input class="toggle"><label>' +
					''+"similarity: "+datas[i][2]+'</label></div></li>')
				$google_list.append('<li><div class="view">' +
                    '<input class="toggle">' +
                    '<label><a href="'+datas[i][3]+'">' + datas[i][4] + '</a></label></div>' +
                    '</li><li><div class="view"><input class="toggle"><label>' +
					''+"similarity: "+datas[i][5]+'</label></div></li>')
            }
		}
});

	return false;
}

function compareData() {

	var context_data1 = $('#context_data1').val();
	var context_data2 = $('#context_data2').val();
	if(context_data1 == ""){
		alert("빈 문장은 가능하지 않습니다");
		return false;
	}

	var data = {'context_data1':context_data1 ,'context_data2':context_data2};

	$.ajax({
		url : "http://localhost:5000/data",
		contentType:"application/json",
		type: "POST",
		data: JSON.stringify(data),
		//data:data,
		success : function(data){
			datas=JSON.parse(data)
			$('#similarity').text(datas.similarity)
		}
});


	//$('#new_todo1').val("");
	//$('#new_todo2').val("");


	return false;
}


$new_form.submit(compareData); // 엔터를 눌렀을 경우
$new_form_crawl.submit(crawlData);
