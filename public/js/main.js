var flag = true;//是否加载完成

var page = 0; // 分页页数

window.addEventListener('scroll', function () {
    // console.log((document.querySelector("body").clientHeight - window.pageYOffset).toString().split(".")[0], window.innerHeight);
    if ((document.querySelector("body").clientHeight - window.pageYOffset).toString().split(".")[0] == window.innerHeight) {
        getDatas();
    }
})
getDatas();
var arr = [];

function getDatas() {
    if (!flag) {
        return;
    }
    flag = false;
    page++;
    $.ajax({
        url: "/getDatas",
        data: "page=" + page,
        dataType: "json",
        success: function (data) {
            var list_box = document.querySelector(".list-box");
            flag = true;
            if (data.mes == 'err') {
                message("网络出现故障");
                return;
            }
            console.log(data);
            data.forEach(function (val) {
                if (page === 1) {
                    arr.push(val.mblog.id);
                }
                var str = `
                    <li class="list">
                <div class="list-top">
                    <div class="list-profile-photo">
                        <img src="${val.mblog.user.avatar_hd}" alt="">
                    </div>
                    <div class="content">
                        <div class="other-name"><span>${val.mblog.user.screen_name}</span></div>
                        <div class="desc">
                            ${val.mblog.text}
                            `
                if (val.mblog.pics) {

                    str += `
                            <ul>`
                    if (val.mblog.pics.length == 1) {
                        str += `
                            <ul>
                                <li style="position: relative;width: 5.5rem;height: 3.08rem;background: url(${val.mblog.pics[0].url}) no-repeat center center /100% auto;">
                                </li>
                            </ul>
                        `;
                    } else {
                        val.mblog.pics.forEach(function (ele) {
                            str += `
                                    <li><img src="${ele.url}" alt=""></li>
                                    `
                        });
                    }

                    str += `   
                            </ul>
                            `
                } else if (val.mblog.page_info) {
                    if (val.mblog.page_info.type == "video") {
                        str += `
                            <ul>
                                <li style="position: relative;width: 5.5rem;height: 3.08rem;background: url(${val.mblog.page_info.page_pic.url}) no-repeat center center /100% auto;display: flex;justify-content: center;align-items: center">
                                    <i class="iconfont" style="display: block;width: 0.5rem;height: 0.5rem;background: rgba(0,0,0,.4);border-radius: 50%;text-align: center;line-height: 0.5rem;font-size: 0.3rem;color: #fff">&#xe80f;</i>
                                </li>
                            </ul>
                        `;
                    } else {
                        str += `
                            <ul>
                                <li style="position: relative;width: 5.5rem;height: 3.08rem;background: url(${val.mblog.page_info.page_pic.url}) no-repeat center center /100% auto;">
                                </li>
                            </ul>
                        `;
                    }

                }
                str += `
                        </div>
                        <div class="list-bottom">
                            <span class="time">${val.mblog.created_at}</span>
                            <i class="iconfont">&#xe619;</i>
                        </div>
                    </div>
                </div>
            </li>
            <div class="line"></div>
                `;
                list_box.innerHTML = list_box.innerHTML + str;
            });
        },
        error: function (data) {
            message("网络出现故障");
            flag = false;
        }
    });

}

var socket = io.connect('http://localhost:8888');

socket.on('frist', function (data) {
    var data = JSON.parse(unescape(data));
    console.log(data.data);
})
socket.on('receive', function (data) {
    var list_box = document.querySelector(".list-box");
    var data = JSON.parse(unescape(data));
    data = data.filter(function (val) {

        var flag = true;

        arr.every(function (ele) {
            if (ele == val.mblog.id) {
                flag = false;

                return false;
            }
            return true;
        })
        return flag;
    });
    data.forEach(function (val) {
        if (page === 1) {
            arr.push(val.mblog.id);
        }
        var str = `
                    <li class="list">
                <div class="list-top">
                    <div class="list-profile-photo">
                        <img src="${val.mblog.user.avatar_hd}" alt="">
                    </div>
                    <div class="content">
                        <div class="other-name"><span>${val.mblog.user.screen_name}</span></div>
                        <div class="desc">
                            ${val.mblog.text}
                            `
        if (val.mblog.pics) {

            str += `
                            <ul>`
            if (val.mblog.pics.length == 1) {
                str += `
                            <ul>
                                <li style="position: relative;width: 5.5rem;height: 3.08rem;background: url(${val.mblog.pics[0].url}) no-repeat center center /100% auto;">
                                </li>
                            </ul>
                        `;
            } else {
                val.mblog.pics.forEach(function (ele) {
                    str += `
                                    <li><img src="${ele.url}" alt=""></li>
                                    `
                });
            }

            str += `   
                            </ul>
                            `
        } else if (val.mblog.page_info) {
            if (val.mblog.page_info.type == "video") {
                str += `
                            <ul>
                                <li style="position: relative;width: 5.5rem;height: 3.08rem;background: url(${val.mblog.page_info.page_pic.url}) no-repeat center center /100% auto;display: flex;justify-content: center;align-items: center">
                                    <i class="iconfont" style="display: block;width: 0.5rem;height: 0.5rem;background: rgba(0,0,0,.4);border-radius: 50%;text-align: center;line-height: 0.5rem;font-size: 0.3rem;color: #fff">&#xe80f;</i>
                                </li>
                            </ul>
                        `;
            } else {
                str += `
                            <ul>
                                <li style="position: relative;width: 5.5rem;height: 3.08rem;background: url(${val.mblog.page_info.page_pic.url}) no-repeat center center /100% auto;">
                                </li>
                            </ul>
                        `;
            }

        }
        str += `
                        </div>
                        <div class="list-bottom">
                            <span class="time">${val.mblog.created_at}</span>
                            <i class="iconfont">&#xe619;</i>
                        </div>
                    </div>
                </div>
            </li>
            <div class="line"></div>
                `;
        list_box.innerHTML = str+list_box.innerHTML;
    });


})

function message(str = '操作失败', time = 700) {

    var box = document.createElement("div");
    box.style.cssText = `
            position: fixed;
            padding: 13px 23px;
            font-size: 0.34rem;
            background: #fff;
            z-index: 10000;
            top: -50px;
            left:50%;
            margin: auto;
            transform: translateX(-50%);
            background: orange;
            border-radius: 5px;
            color:#fff;
    `;
    box.innerHTML = str;

    document.querySelector("body").insertBefore(box, document.querySelector("body").children[0]);

    setTimeout(function () {
        box.style.top = '25px';
    }, 0)
    box.style.transition = 'top 0.5s';

    setTimeout(function () {
        box.style.top = '-50px';
        setTimeout(function () {
            document.querySelector("body").removeChild(box);
        }, time + 500)
    }, time)

}