(function () {

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
                fn = this.dealWithNum;
            if (ot < 60) {
                return '00:00:' + fn(ot);
            } else if (ot < 60 * 60) {
                var m = Math.floor(ot / 60),
                    s = ot % 60;
                return '00:' + fn(m) + ':' + fn(s);
            }
            else {
                var h = Math.floor(ot / (60 * 60)),
                    m = Math.floor((ot - (h * 60 * 60)) / 60),
                    s = (ot - (h * 60 * 60)) % 60;
                console.log(ot);
                console.log(h);
                 return fn(h) +':'+ fn(m) + ':' + fn(s);
            }
        },

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