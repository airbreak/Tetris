(function () {

    /*
    *时间计时器
    */
    var Timer = function () {
        this.width = 200;
        this.height = 100;
        this.canvas = new Canvas('timer', this.width, this.height);
        this.originTime = 0;
        this.canvas.drawHead('rgb(147,255,36)', 'Timer');
        this.setTimer();
    };

    Timer.prototype = {
        setTimer: function () {
            var that = this;
            this.timeInterval = window.setInterval(function () {
                that.originTime++;
                that.renderTimerInfo();
            }, 10);
        },

        /*时间格式化*/
        timeFormat: function () {
            var ot = this.originTime,
                fn = this.dealWithNum,
                h = Math.floor(ot / 3600),
                m = Math.floor((ot - h * 3600) / 60),
                s = ot - (h * 3600) - m * 60;
            return fn(h) + ':' + fn(m) + ':' + fn(s);
        },

        /*
        *处理时间格式，小于10 前面加0
        *para：
        * num -{int}时间信息
        */
        dealWithNum: function (num) {
            if (num < 10) {
                return '0' + num;
            }
            return num;
        },

        /*信息渲染到画布上*/
        renderTimerInfo: function () {
            this.canvas.drawText(this.timeFormat(this.originTime));
        },

    };

    /*
    *砖块对象
    */
    var Block = function () {
        this.w = $(document).width() * 0.33;
        this,h = $(document).height();
        this.canvas = new Canvas('block', this.w, this.h);
        this.lineNumH = 12;
    }
    Block.prototype = {
        init: function () { },

        /*
        *绘制水平线，总条数为12根
        */
        drawBgLineH: function () {

        },

        /*
        *绘制竖直线，总条数为n根
        */
        drawBgLineH: function () {

        },

        /*
        *正常下落
        */
        downForNarmal: function () { },



    };

    /*
    *canvas 类对象
    */
    var Canvas = function (id, width, height) {
        this.el = document.getElementById(id);
        this.ctx = this.el.getContext('2d');
        this.width = width;
        this.height = height;
    };
    Canvas.prototype = {
        setSize: function () {
            this.el.height = this.height;
            this.el.width = this.width;
        },

        /*绘制画布的头部*/
        drawHead: function (color, text) {
            this.ctx.fillStyle = color;
            this.ctx.fillRect(0, 0, this.width, 50);
            this.ctx.font = '25px Arial';
            this.ctx.fillStyle = 'black';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(text, this.width / 2, 34);
        },

        /*绘制画布的头部*/
        drawText: function (text) {
            this.clearRect(0, 50);
            this.ctx.font = '25px Arial';
            this.ctx.fillStyle = 'white';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(text, this.width / 2, 84);
        },

        /*清除画布*/
        clearRect: function (fx, fy, tx, ty) {
            fx = fx || 0;
            fy = fy || 0;
            tx = tx || this.width;
            ty = ty || this.height;
            this.ctx.clearRect(fx, fy, tx, ty);
        }
    }

    new Timer();

})();