$(document).ready(function(){

    //獲得原始的URL 
    var url = $('#url').val();
    console.log(url);

    //新增聯絡人的按鈕，點擊會跳出新增的Modal 
    $('#btn_add').click(function(){
        $('.modal-title').text("新增聯絡人"); //Modal視窗的標題會判斷改為"新增聯絡人"
        $('#btn-save').val("新增");
        $('#frmMembers').trigger("reset");
        $('#myModal').modal('show');
    });

    //編輯聯絡人的按鈕，點擊後會跳出編輯的Modal，利用ajax帶出資料
    $(document).on('click','.open_modal',function(){
        var member_id = $(this).val();
        console.log(member_id);
        // 點"編輯"按鈕時會跳出Modal
        $.ajax({
            type: "GET",
            url: url + '/' + member_id,
            success: function (data) {
                console.log(data);
                $('#member_id').val(data.id);
                $('#name').val(data.name);
                $('#ename').val(data.ename);
                $('#phone').val(data.phone);
                $('#email').val(data.email);
                $('#sex').val(data.sex);
                $('#city').val(data.city);
                $('#township').val(data.township);
                $('#postcode').val(data.postcode);
                $('#address').val(data.address);
                $('#notes').val(data.notes);
                $('.modal-title').text("編輯聯絡人"); //判斷Moal視窗上的標題，並改為"編輯聯絡人"標題
                $('#btn-save').val("編輯");
                $('#myModal').modal('show');
            },
            error: function (data) {
                console.log('Error:', data);
            }
        });
    });


    //判斷"新增聯絡人"/"編輯現有聯絡人"要存檔時的按鈕是"新增"或"修改"
    $("#btn-save").click(function (e) {
        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="_token"]').attr('content')
            }
        })

        e.preventDefault(); 
        var formData = {
            name: $('#name').val(),
            ename: $('#ename').val(),
            phone: $('#phone').val(),
            email: $('#email').val(),
            sex: $('#sex').val(),
            city: $('#city').val(),
            township: $('#township').val(),
            postcode: $('#postcode').val(),
            address: $('#address').val(),
            notes: $('#notes').val(),
        }

        //取"存檔"的按鈕值， [add=POST] 新增, [update=PUT] 編輯
        var state = $('#btn-save').val();
        var type = "POST"; //新增
        var member_id = $('#member_id').val();;
        var my_url = url;
        if (state == "編輯"){

            Swal.fire( { 
                position: 'top-end',
                type: 'success',
                title: '你的修改已成功保存!', 
                showConfirmButton: false, 
                timer: 2000 
                })//編輯成功彈出的提示視窗

            type = "PUT"; //編輯
            my_url += '/' + member_id;
        }
        console.log(formData);
        $.ajax({
            type: type,
            url: my_url,
            data: formData,
            dataType: 'json',
            
            success: function (data) {
                // for (var x in data){
                //     if(data[x] === null){
                //         data[x] ='';
                //     }
                // };//將撈到的null值改成空字串
                console.log(data);

                var member = '<tr id="member' + data.id + '"><td>' + data.name + '</td><td>' + data.phone + '</td><td>' + data.email + '</td><td>' + data.city+ '' + data.postcode + '' + data.township + '' + data.address + '</td>' ;
                member += '<td><button class="btn btn-warning btn-detail open_modal" value="' + data.id + '" style="border-Radius: 0px;">編輯</button></td>';
                member += '<td><button class="btn btn-danger btn-delete delete-member" value="' + data.id + '" style="border-Radius: 0px;">刪除</button></td></tr>';
    
                if (state == "新增"){ 
                    $('#members-list').append(member);

                    Swal.fire({
                        type: 'success',
                        title: '資料已新增成功!',
                        showConfirmButton: false, 
                        timer: 1000
                    })//新增成功，彈出的提示視窗

                }else{ 
                    $("#member" + member_id).replaceWith( member );
                }
                $('#frmMembers').trigger("reset");
                $('#myModal').modal('hide')
            },
            error: function (data) {
                console.log('Error:', data);
            }
        });
    });


    //刪除聯絡人的資料
    $(document).on('click','.delete-member',function(){
        var member_id = $(this).val();

         $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="_token"]').attr('content')
            }
        })

        //點刪除按鈕後彈出的提示視窗
        Swal.fire({
            title: '確定要刪除此筆資料嗎?',
            text: "資料刪除後將無法復原!",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: '刪除',
            cancelButtonText: '取消',
            showConfirmButton: true 
        }).then((result) => {
            if (result.value) {
                Swal.fire({
                    title:'資料刪除成功!',
                    type:'success',
                    showConfirmButton:false,
                    timer: 1000
                })

                $.ajax({
                    type: "DELETE",
                    url: url + '/' + member_id,
                    success: function (data) {
                        console.log(data);
                        $("#member" + member_id).remove();
                    },
                    error: function (data) {
                        console.log('Error:', data);
                    }
                });
            }
        })        
    });
});