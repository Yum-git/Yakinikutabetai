let timer;
let audio_alarm;

$(function(){

    $('#night').hide();
    $('#cancel').hide();
    $('#set_time').hide();
    $('.camera').hide();

    let timer;
    let flag = true;

    //時刻カウント
    setInterval(function(){
        let now = new Date();
        let hours = now.getHours();
        hours = ('0'+hours).slice(-2);
        let minutes = now.getMinutes();
        minutes = ('0'+minutes).slice(-2);
        let seconds = now.getSeconds();
        seconds = ('0'+seconds).slice(-2);
        
        if(flag){
            $('#time_hours').text(hours);
            $('#time_colon').text(':');
            $('#time_minutes').text(minutes);
            flag = false;
        }
        else{
            $('#time_hours').text(hours);
            $('#time_colon').text('');
            $('#time_minutes').text(minutes);
            flag = true;
        }
    }, 500);

    $('#alarm_set').timeDropper({
        meridians: false,
        setCurrentTime: false
    });
    
    //アラームセット完了
    $('#start').on('click',function(){
        $('#inn').get(0).play();
        
        audio_alarm = document.getElementById('alarm');
        audio_alarm.load();


        $('body').animate({
            backgroundColor: '#000088'
        },3000);

        $('header').animate({
            backgroundColor: '#000033',
            color:'#ffffff'
        },3000);

        $('footer').animate({
            backgroundColor: '#000033',
            color:'#ffffff'
        },3000);

        $('.set_message').animate({
            color: '#ffffff'
        },3000);

        $('#noon').fadeOut(1501);
        $('#start').fadeOut(1501);
        $('#alarm_set').fadeOut(1501);
        
        setTimeout(function(){
            $('#night').fadeIn(1501);
            $('#cancel').fadeIn(1501);
            $('#set_time').fadeIn(1501);
        },1501);

        let now = new Date();
        let year = now.getFullYear();
        let month = now.getMonth();
        let day = now.getDate();
        let set_time=$('#alarm_set').val();
        set_time = set_time.split(/[:\s]/);
        let set_hours = set_time[0];
        let set_minutes = set_time[1];
        let am_or_pm = set_time[2];
        if(am_or_pm == 'pm' && set_hours != '12'){
            set_hours = parseInt(set_hours);
            set_hours += 12;
            set_hours = set_hours.toString();
        }
        let set_time_format = set_hours + ':' + set_minutes;

        $('#set_time').text(set_time_format);
        
        let alarm_time = new Date(year, month, day, set_hours, set_minutes, 0);
        if(am_or_pm == 'am' && (now.getHours() == 0 || now.getHours() >= 13)){
            alarm_time.setDate(alarm_time.getDate()+1);
        };
        
        let between_time = (alarm_time - now);

        timer = setTimeout(function(){
            audio_alarm.play();
            $('#chicken').get(0).play();

            clearInterval(timer);

            $('body').animate({
                backgroundColor: '#d6eaff'
            },1000);

            $('header').animate({
                backgroundColor: '#4aa5ff',
                color: '#000000'
            },1000);

            $('footer').animate({
                backgroundColor: '#4aa5ff',
                color: '#000000'
            },1000);

            $('.set_message').animate({
                color: '#000000'
            },1000);

            $('#night').fadeOut(501);
            $('#cancel').fadeOut(501);
            $('#set_time').fadeOut(501);

            clearTimeout(timer);
            $('#sky_item').hide();
            $('#clock_item').hide();
            $('.alarm_item').hide();
            $('.submit_item').hide();
            $('.camera').show();

            capture();

        },between_time);
    });

    //キャンセル
    $('#cancel').on('click',function(){
        $('#chicken').get(0).play();

        clearInterval(timer);

        $('body').animate({
            backgroundColor: '#d6eaff'
        },3000);

        $('header').animate({
            backgroundColor: '#4aa5ff',
            color: '#000000'
        },3000);

        $('footer').animate({
            backgroundColor: '#4aa5ff',
            color: '#000000'
        },3000);

        $('.set_message').animate({
            color: '#000000'
        },3000);

        $('#night').fadeOut(1501);
        $('#cancel').fadeOut(1501);
        $('#set_time').fadeOut(1501);
        
        setTimeout(function(){
            $('#noon').fadeIn(1501);
            $('#start').fadeIn(1501);
            $('#alarm_set').fadeIn(1501);
        },1501);

        clearTimeout(timer);
    });


    //選択されたファイルをcanvasに貼り付けている処理
    function capture(){

        let context;

        document.getElementById("cameraImage").addEventListener("change", () => {
        
            //canvasを捕捉
            let Cobject = document.getElementById("myCanvas");
            context = Cobject.getContext("2d");
            
            //filereader起動
            let reader = new FileReader();
            reader.onload = () => {
                let imgobj = new Image();
                imgobj.src = reader.result;
                imgobj.onload = () => {
                    context.drawImage(imgobj, 0, 0, Cobject.width, Cobject.height);
                }
            }
    
            let imageFile = document.getElementById("cameraImage").files[0];
            reader.readAsDataURL(imageFile);
        }, false);
    
        let target_items = [
            'refrigerator',
            'microwave',
            'air conditioner',
            'washing machine',
            'remote control',
            'watch',
            'pen',
            'eraser',
            'scissors',
            'bag',
        ]
        let translate={
            'refrigerator':'冷蔵庫',
            'microwave':'電子レンジ',
            'air conditioner':'エアコン',
            'washing machine':'洗濯機',
            'remotecontrol':'リモコン',
            'watch':'腕時計',
            'pen':'ペン',
            'eraser':'消しゴム',
            'scissors':'ハサミ',
            'bag':'カバン',
        }
        let target_items_index = Math.floor(Math.random()*10);
        $('#target_item_message').text(translate[target_items[target_items_index]]);

        $('#change_target').on('click',function(){
            target_items_index = Math.floor(Math.random()*10);
            $('#target_item_message').text(translate[target_items[target_items_index]]);
        });
    
        let result_list = [];
        let success = false;
        //submitが押されたときの処理　画像をbase64に直して送信する
        $('form').submit((event) => {
            event.preventDefault();
            
            //canvasを捕捉
            let canvasdata = document.getElementById("myCanvas");
            //canvasデータをbase64に変換
            let data64 = canvasdata.toDataURL('image/png');
            
            //ajaxに送るformデータを初期化
            let fData = new FormData();
            //post形式で送るので「img:data」となるようにformデータに追記
            fData.append('img', data64);
            
            //ajaxにて処理を送る
            $.ajax({
                url: 'https://hackson-api-20200816.herokuapp.com/object_auth',
                type: 'POST',
                data: fData,
                contentType: false,
                processData: false,
                beforeSend: function(){
                    $('#result').text('-認証中-');
                },
                //正常な値が返ってきた時の処理
                success: function(data, dataType) {
                    result = data.replace(/[\s\n"]/g,'');
                    result = result.match(/name.*?,score:[10]\.\d+/g);
                    
                    for(let i = 0;i < result.length;i++){
                        result[i] = result[i].replace(/name:|score:/g,'');
                        result[i] = result[i].split(',');
                        result_list.push(result[i]);
                    }

                    for(let i = 0;i < result_list.length;i++){
                        if(target_items[target_items_index] == result_list[i][0].toLowerCase()){
                            if(parseFloat(result_list[i][1]) > 0.7){
                                success = true;
                                break;
                            }
                        }
                    }

    
                    if(success){
                        audio_alarm.pause();
                        audio_alarm.currentTime = 0;
                        $('#result').text('認証成功！！');
                        $('#levelup').get(0).play();

                        setTimeout(function(){
                            $('.camera').fadeOut(500);
                            setTimeout(function(){
                                $('#sky_item').fadeIn(500);
                                $('#noon').fadeIn(500);
                                $('#clock_item').fadeIn(500);
                                $('.alarm_item').fadeIn(500);
                                $('#alarm_set').fadeIn(500);
                                $('.submit_item').fadeIn(500);
                                $('#start').fadeIn(500);
                            },501);
                        },3000);

                    }
                    else{
                        $('#result').text('認証失敗...');
                    }

                    setTimeout(function(){
                        $('#result').text('');
                        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
                    },4000);
                    
                },
                //異常な値を返した時の処理
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    console.log('Error : ' + errorThrown);
                }
            });
        })
    }
})