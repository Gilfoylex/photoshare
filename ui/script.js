var AllImageKeys = [];

$( window ).on( "load", function(){
    GetInitDatas();
    window.onscroll=function(){
        if(checkscrollside()){
            $.each( dataInt.data, function( index, value ){
                var $oPin = $('<div>').addClass('pin').appendTo( $( "#main" ) );
                var $oBox = $('<div>').addClass('box').appendTo( $oPin );
                $('<img>').attr('src','./images/' + $( value).attr( 'src') ).appendTo($oBox);
                $('<div>').text("Shot By YJX").addClass('descript').appendTo($oBox);
            });
            waterfall();
        };
    }
});

function GetInitDatas()
{
    $.ajax({
        url:"http://localhost:8080/getalldata",
        dataType: "json",
        async: true,
        type: "GET",
        success: function (data)
        {
            AllImageKeys = data.allkeys;
        },
        headers: {
            Accept: "application/json; charset=utf-8"
        },
    })
}

/*
    parend 父级id
    pin 元素id
*/
function waterfall(){
    var $aPin = $( "#main>div" );
    var iPinW = $aPin.eq( 0 ).width();// 一个块框pin的宽
    var num = Math.floor( $( window ).width() / iPinW );//每行中能容纳的pin个数【窗口宽度除以一个块框宽度】
    num = Math.min(num, 3); //最多三行
    var spaceWith = ($(window).width() - num * (iPinW + 15)) / 2;
    var strSpaceWith = spaceWith + 'px';
    $( "#main" ).css({
        'width:' : iPinW * num,
        'position': 'absolute',
        'min-width': iPinW * num,
        'margin-left': strSpaceWith,
    });

    var pinHArr=[];//用于存储 每列中的所有块框相加的高度。

    $aPin.each( function( index, value ){
        var pinH = $aPin.eq( index ).height();
        if( index < num ){
            pinHArr[ index ] = pinH; //第一行中的num个块框pin 先添加进数组pinHArr
            $( value ).css({
                'position': 'absolute',
                'left': (iPinW+15) * index
            });
        }else{
            var minH = Math.min.apply( null, pinHArr );//数组pinHArr中的最小值minH
            var minHIndex = $.inArray( minH, pinHArr );
            $( value ).css({
                'position': 'absolute',
                'top': minH + 15,
                'left': $aPin.eq( minHIndex ).position().left
            });
            //数组 最小高元素的高 + 添加上的aPin[i]块框高
            pinHArr[ minHIndex ] += $aPin.eq( index ).height() + 15;//更新添加了块框后的列高
        }
    });
}

function checkscrollside(){
    var $aPin = $( "#main>div" );
    var lastPinH = $aPin.last().get(0).offsetTop + Math.floor($aPin.last().height()/2);//创建【触发添加块框函数waterfall()】的高度：最后一个块框的距离网页顶部+自身高的一半(实现未滚到底就开始加载)
    var scrollTop = $( window ).scrollTop()//注意解决兼容性
    var documentH = $( document ).width();//页面高度
    return (lastPinH < scrollTop + documentH ) ? true : false;//到达指定高度后 返回true，触发waterfall()函数
}