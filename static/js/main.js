let timer;

$(function(){

    $('#night').hide();
    $('#cancel').hide();
    $('#set_time').hide();

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
        
        let audio_alarm = document.getElementById('alarm');
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
        if(am_or_pm == 'pm'){
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
})