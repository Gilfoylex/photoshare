var AllKeys = [];
var InitData = [];
var ColNum = 0;
var pinHArr = [];//用于存储 每列中的所有块框相加的高度。
var bLoaded = true;

$(window).on("load", function () {
    $('#view').hide()
    GetInitDatas();
    window.onscroll = function () {
        if (checkscrollside()) {
            GetNewData();
        };
    }
});

function renderImges(images) {
    bLoaded = false;
    var counts = images.length;
    if (counts > 0) {
        $.each(images, function (index, value) {
            var $oPin = $('<div>').addClass('pin').appendTo($("#container"));
            var $oBox = $('<div>').addClass('box').appendTo($oPin);
            $('<img>').attr('src', value.path).attr('id', 'img').appendTo($oBox);
            $('<div>').text(value.des).addClass('descript').appendTo($oBox);
        });
        $('img').load(function () {
            if ((--counts) == 0) {
                waterfall();
                bLoaded = true;
            }
        })
    }
}

function GetInitDatas() {
    $.ajax({
        url: "http://" + window.location.host + "/getalldata",
        dataType: "json",
        async: true,
        type: "GET",
        success: function (result) {
            AllKeys = result.allKeys;
            renderImges(result.images);
        },
        headers: {
            Accept: "application/json; charset=utf-8"
        },
    })
}

function GetPostKeys() {
    var arr = [];
    var num = ColNum;
    if (AllKeys.length > num) {
        arr = AllKeys.slice(AllKeys.length - num, AllKeys.length);
        AllKeys = AllKeys.slice(0, AllKeys.length - num);
    }
    else {
        arr = AllKeys;
        AllKeys = []
    }
    return arr;
}

function GetNewData() {
    let arr = GetPostKeys();
    if (arr.length > 0) {
        $.ajax({
            url: "http://" + window.location.host + "/getimages",
            dataType: "json",
            async: true,
            type: "POST",
            data: { imagkeys: arr },
            success: function (result) {
                renderImges(result.images);
            },
            headers: {
                Accept: "application/json; charset=utf-8"
            },
        })
    }
}

/*
    parend 父级id
    pin 元素id
*/
function waterfall() {
    var $aPin = $("#container>div");
    var iPinW = $aPin.eq(0).width();// 一个块框pin的宽
    ColNum = Math.floor($(window).width() / iPinW);//每行中能容纳的pin个数【窗口宽度除以一个块框宽度】
    ColNum = Math.min(ColNum, 3); //最多三行
    var spaceWith = ($(window).width() - ColNum * (iPinW + 15)) / 2;
    var strSpaceWith = spaceWith + 'px';
    $("#container").css({
        'width:': iPinW * ColNum,
        'position': 'absolute',
        'min-width': iPinW * ColNum,
        'margin-left': strSpaceWith,
    });

    $aPin.each(function (index, value) {
        var pinH = $aPin.eq(index).height();
        if (index < ColNum) {
            pinHArr[index] = pinH; //第一行中的num个块框pin 先添加进数组pinHArr
            $(value).css({
                'position': 'absolute',
                'left': (iPinW + 15) * index
            });
        } else {
            var minH = Math.min.apply(null, pinHArr);//数组pinHArr中的最小值minH
            var minHIndex = $.inArray(minH, pinHArr);
            $(value).css({
                'position': 'absolute',
                'top': minH + 15,
                'left': $aPin.eq(minHIndex).position().left
            });
            //数组 最小高元素的高 + 添加上的aPin[i]块框高
            pinHArr[minHIndex] += $aPin.eq(index).height() + 15;//更新添加了块框后的列高
        }
    });
}


// $(function () {
//     $(document).on('click', 'img#img', function(){
//         var scrollTop = $(document).scrollTop();
//         $('#view-image').attr('src', $(this).attr('src'));
//         $('#view').show();
//         var leftSpace = ($(window).width() - $('#view-image').width()) / 2
//         $("#view").css({
//             'height': $(window).height(),
//             'top': scrollTop
//         });
//         $('#view-image').css({
//             'left': leftSpace
//         })

//         $('body').css({
//             'overflow': 'hidden',
//         })
//      });

//     $('#view').click(function () {
//         $('#view').hide();
//         $('body').css({
//             'overflow': 'visible',
//         })
//     });
// });

function checkscrollside() {
    if (bLoaded) {
        var $aPin = $("#container>div");
        var l = $aPin.length;
        var h1 = $aPin.get(0);
        h1 = h1.offsetTop;
        h1 = Math.min.apply(null, pinHArr);
        var h2 = $aPin.last().height();
        //创建【触发添加块框函数waterfall()】的高度：最后一个块框的距离网页顶部+自身高的一半(实现未滚到底就开始加载)
        //var lastPinH = $aPin.get(l-1).offsetTop + Math.floor($aPin.last().height() / 2);
        var lastPinH = h1 + Math.floor(h2 / 2);
        var scrollTop = $(window).scrollTop()//注意解决兼容性
        var documentH = $(window).height();//页面高度
        return (lastPinH < scrollTop + documentH) ? true : false;//到达指定高度后 返回true，触发waterfall()函数
    }
    else {
        return false;
    }

}