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
        this.cols = 13;
        this.rows = 16;
        this.bw = 32;
        this.w = this.cols * 32;
        this.h = this.rows * 32;
        this.canvas = new Canvas('board', this.w, this.h);
        this.ctx = this.canvas.ctx;
        this.init();
    }
    Block.prototype = {
        init: function () {
            this.drawBgLine();
        },

        /*
        *绘制水平线，总条数为13根
        */
        drawBgLine: function () {
            this.ctx.strokeStyle = 'rgba(40,40,40,.8)';
            this.ctx.lineWidth = '1px';

            //绘制竖直线，总条数为13根
            var len = this.cols;
            for (var i = 0; i < len; i++) {
                this.ctx.moveTo(this.bw * i, 0);
                this.ctx.lineTo(this.bw * i, this.h);
                this.ctx.stroke();
            }
            //绘制横线，总条数为16根
            len = this.rows;
            for (var i = 0; i < len; i++) {
                this.ctx.moveTo(0,this.bw*i);
                this.ctx.lineTo(this.w,this.bw*i);
                this.ctx.stroke();
            }
        },

        /*
        *绘制砖块
        *从基本的图片中读取图片，进行编排
        */
        drawBlock: function () {

        },

        /*
        *正常下落
        */
        downForNarmal: function () { },



    };

    /*
    *下一个砖块对象
    */
    var NextShape = function () {
        this.width = 200;
        this.height = 200;
        this.canvas = new Canvas('next', this.width, this.height);
        this.canvas.drawHead('rgb(0,240,255)', 'Next');
    };

    NextShape.prototype = {
        init: function () {

        },
        drawShape: function () {

        },

    };

    /*
    *canvas 类对象
    */
    var Canvas = function (id, width, height) {
        this.el = document.getElementById(id);
        this.ctx = this.el.getContext('2d');
        this.width = width;
        this.height = height;
        this.setSize();
    };
    Canvas.prototype = {
        setSize: function () {
            this.el.height = this.height;
            this.el.width = this.width;
        },

        /*
        *绘制画布的头部
        *para:
        *color-{string} 颜色字符串，rgba形式，带透明度
        *text - {string} 标题 
        */
        drawHead: function (color, text) {
            this.ctx.fillStyle = color;
            this.ctx.fillRect(0, 0, this.width, 50);
            this.ctx.font = '25px Arial';
            this.ctx.fillStyle = 'black';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(text, this.width / 2, 34);
        },

        /*绘制画布的头部
         *para:
        *color-{string} 颜色字符串，rgba形式，带透明度
        *text - {string} 标题
        */
        drawText: function (text) {
            this.clearRect(0, 50);
            this.ctx.font = '25px Arial';
            this.ctx.fillStyle = 'white';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(text, this.width / 2, 84);
        },

        /*
        *清除画布
        *para:
        *fx - {int} 清空区域的起点x坐标
        *fy - {int} 清空区域的起点y坐标
        *tx - {int} 清空区域的终点x坐标
        *ty - {int} 清空区域的终点y坐标
        */
        clearRect: function (fx, fy, tx, ty) {
            fx = fx || 0;
            fy = fy || 0;
            tx = tx || this.width;
            ty = ty || this.height;
            this.ctx.clearRect(fx, fy, tx, ty);
        }
    }

    new Timer();
    new Block();
    new NextShape();

})();