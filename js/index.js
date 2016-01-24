var MyTetris = (function () {
    var cols = 13,
      rows = 16,
      bw = 32,
      speed=800,
      interval=null,
      gameOver = false;

    /*
    *时间计时器
    */
    function Timer() {
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

        /*信息渲染到画布上 */
        renderTimerInfo: function () {
            this.canvas.drawText(this.timeFormat(this.originTime));
        },

    };

    /*
    *砖块对象
    */
    function Board() {
        this.grid;
        this.cols = cols;
        this.rows = rows;
        this.bw = bw;
        this.w = this.cols * bw;
        this.h = this.rows * bw;
        this.canvas = new Canvas('board', this.w, this.h);
        this.shape = new Shape();
        this.nextShape = new Shape();
        this.ctx = this.canvas.ctx;
    };
    Board.prototype = {
        init: function () {
            this.drawBgLine();
            this.drawRandomShapeInBoard();  
            this.drawRandomShapeInNext(this.nextShape.init());//得到全新的形状 和上一个没有关系 
            this.initGrid();
        },

        /*初始化整个游戏主网格对应的虚拟数据*/
        initGrid:function(){
            this.list=[];
            for(var y=0;y<rows;y++){
                this.list[y]=[];
                for(var x=0;x<rows;x++) {
                    this.list[y][x]=0;
                }
            }
        },

        /*在主要的游戏面板上绘制一个随机的形状*/
        drawRandomShapeInBoard: function () {
            this.shape.init().draw(this.ctx);
        },

        /*在下一个预览框板上绘制一个随机的形状*/
        drawRandomShapeInNext: function (shape) {
            window.MyTetris.nextShape.draw(shape);
        },

        /*
        *绘制水平线，总条数为13，16根
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
                this.ctx.moveTo(0, this.bw * i);
                this.ctx.lineTo(this.w, this.bw * i);
                this.ctx.stroke();
            }
            this.grid=this.ctx.getImageData(0,0,this.w,this.h);  //复制画布的信息 方便后面刷新的时候进行粘贴
        },

        /*
        *自动下落下落计时器  将砖块的y坐标修改
        *如果是正常情况下，（没有到达边界），正常下落
        *否则落到相应的位置放好。
        */
        timeTick: function () {
            //正常下落
            if (this.validMove(0, 1)) {
                this.shape.currentY++;
            }

            //位置放好
            else {
                this.addBlocksToBoard();  //更改list对应的值，方便绘制“死”砖块

                //消去 填满的行 并相应的加分
                this.clearLine();

                //游戏结束
                if (gameOver) {
                    window.MyTetris.endGame();
                    return false;
                }
               
                //得到一个全新的砖块
                var tempShape = this.shape.init();

                //游戏框中  使用上一个预览框中的形状
                this.shape = this.nextShape;

                //重新使新的开始坐标
                this.shape.setDeafaultPos();

                //重新生成一个新的砖块 预览框中
                this.nextShape = tempShape;
                this.drawRandomShapeInNext(tempShape);

            }
            this.refresh(); //刷新游戏主面板
            this.shape.draw(this.ctx);   //y坐标修改
        },

        /*
        *刷新画布，并复制背景线
        */
        refresh: function() {
            this.canvas.clearRect();
            this.ctx.putImageData(this.grid, 0, 0);  //背景线的粘贴
            this.drawBlocks();
        },

        /*
        *绘制砖块 已经“死”的砖块
        */
        drawBlocks: function () {
            for(var y=0;y<this.rows;y++){
                for(var x=0;x<this.cols;x++){
                    if(this.list[y][x]){
                        this.shape.block.draw(this.ctx,x,y,this.list[y][x]);
                    }
                }
            }
        },

        /*
        *判断砖块是否到底部
        *判断区域的几个语句：
        *1.通过y 方向确定是否到达底部
        *2.通过y方向确定，其下部有无其他的砖块
        *3.x方向上不能小于 0
        *4.x方向上不能大于横向最大格数
        *5.y方向上不能大于纵向最大格数
        */
        validMove: function (x,y) {
            var shape = this.shape,
                ox = shape.currentX + x,
                oy = shape.currentY + y,
                len1 = shape.layout.length,
                len2 = shape.layout[0].length;
            for (var y = 0; y < len1; y++) {
                for (var x = 0; x < len2; x++) {
                    if (shape.layout[y][x]) {
                        if (typeof this.list[oy + y] === 'undefined'
                            || this.list[oy+y][ox+x]
                            || ox +x<0
                            || ox+x>=this.cols
                            || oy+y>=this.rows
                            ) {
                            return false;
                        }
                    }
                }
            }
            return true;
        },

        /* 添加 已经 “死”的砖块到游戏主面板中*/
        addBlocksToBoard: function () {
            var len1 = this.shape.layout.length,
                len2 = this.shape.layout[0].length,
                boradX, boradY;
            loop1:
                for (var y = 0; y < len1; y++) {
                    loop2:
                for (var x = 0; x < len2; x++) {
                    if (this.shape.layout[y][x]) {
                        boradX = this.shape.currentX + x;
                        boradY = this.shape.currentY + y;

                        //堆满，游戏结束  当前的下一个 的网格的值就是1 说明到了顶部
                        if (this.list[boradY][boradX]) {
                            gameOver = true;
                            break loop1;
                        }

                        //没有堆满
                        else {
                            this.list[boradY][boradX] = this.shape.layout[y][x];
                        }
                    }
                }
            }
        },

        //变换图像
        rotate:function(){
            var newLayout=[];
            for(var y=0;y<this.shape.layout[0].length;y++){
                newLayout[y]=[];
                for(var x=0;x<this.shape.layout.length;x++){
                    newLayout[y][x]=this.shape.layout[this.shape.layout.length-1-x][y];
                }
            }
            this.shape.layout=newLayout;
        },

        //消除行
        clearLine:function(){
            var line=0;
            for(var y=this.rows-1;y>=0;y--){
                var filled=true;
                for(var x=0;x<this.cols;x++){
                    if(!this.list[y][x]){
                        filled=false;
                        break;
                    }
                }
                if(filled && y){
                    for(var yy=y;yy>0;yy--){
                        for(var xx=0;xx<this.cols;xx++){
                            this.list[yy][xx]=this.list[yy-1][xx]; //将当前行信息改成下一行，实现消行
                        }
                    }
                    line++;
                    y++;  //因为消了一行所以加一
                }

            }
        },

    };


    /*单个砖块*/
    function Block() {
        this.spriteImg = new SpriteLoader();
        this.img = this.spriteImg.image;
        this.size = this.spriteImg.imageSize;
        this.total = this.spriteImg.total;
    }

    Block.prototype = {
        random: function () {
            return Math.floor(Math.random() * this.total) + 1;
        },

        /*
        *绘制图形
        *para：
        *ctx -{javscript object} 画布 context
        *x - {float} 在第几个格放置图片 x方向
        *y - {float} 在第几个格放置图片 y方面
        *blockType - {int} 砖块的类型 ，1-7
        */
        draw: function (ctx, x, y, blockType) {
            var type = blockType || this.random();
            var s = this.size;
            ctx.drawImage(this.img,
                s * (type - 1), 0, //开始位置
                s, s,  //高度和宽度
                s * x, s * y, //放置的位置
                s, s //要使用的大小
                );
        }
    };

    /*
    *下一个砖块对象
    */
    function NextShape() {
        this.width = 200;
        this.height = 150;
        this.canvas = new Canvas('next', this.width, this.height);
        this.ctx = this.canvas.ctx;
        this.init();
    };

    NextShape.prototype = {
        init: function () {
            this.canvas.drawHead('rgb(0,240,255)', 'Next');
        },

        //绘制砖块
        draw: function (nextShape) {
            this.canvas.clearRect(0, 50);
            nextShape.currentX = 2;
            nextShape.currentY = 2;
            nextShape.draw(this.ctx);
        },

    };

    /*图片对象，读取砖块基本图片*/
    function SpriteLoader() {
        var path = 'images/blocks.png';
        this.image = new Image();
        this.image.src = path;
        this.imageSize = 32;
        this.total = 7;
    }

    /**********************形状对象**************************/
    function Shape() {
        this.block = new Block();
        this.layout;
        this.blockType;
        this.currentX = 0;
        this.currentY = 0;
        this.init();
    }

    Shape.prototype = {

        init: function () {
            this.getBasicLayout();
            this.random();
            this.setDeafaultPos();
            return this;
        },

        /*
        *定义七种基本的形状 包括7种基本形状 类似数组的 形式，1表示这个矩形中图片，0表示没有
        */
        getBasicLayout: function () {
            this.layouts = [
            [
                [1, 1, 1, 1]  //传说中最牛逼的  长条
            ],
            [
                [1, 1],     //正方形
                [1, 1]
            ],
            [
                [1, 0, 0],
                [1, 1, 1]  //正 L 形
            ],
            [
                [0, 0, 1],
                [1, 1, 1]  //反 L 形
            ],
            [
                [1, 1, 0],
                [0, 1, 1]  //正 Z 形
            ],
            [
                [0, 1, 1],
                [1, 1, 0]  //反 Z 形

            ],
            [
                [0, 1, 0],
                [1, 1, 1]  // 山 形
            ]
            ];
        },

        /*
        *设置基本的原始位置
        *包括x是中间，y是0的位置
        */
        setDeafaultPos: function () {
            this.currentX = Math.floor((cols - this.layout[0].length) / 2);
            this.curretnY = 0;
        },

        /*
        *得到一个随机的形状
        *根据随机生成的 形状 数组，将其中为1 的赋值
        */
        random: function () {
            var index = Math.floor(Math.random() * this.layouts.length),
                 layout = this.layouts[index];
            this.blockType = this.block.random();
            for (var y = 0; y < layout.length; y++) {
                for (var x = 0; x < layout[0].length; x++) {
                    //如果相应的数字为1 ，则赋值上 颜色块对应的数值，方便后面的图片加载
                    if (layout[y][x]) {
                        layout[y][x] = this.blockType;
                    }
                }
            }
            this.layout = layout;

        },

        /*
        *绘制相应的砖块
        *para :
        *ctx - {object} 画布2d对象
        */
        draw: function (ctx) {
            for (var y = 0; y < this.layout.length; y++) {
                for (var x = 0; x < this.layout[0].length; x++) {
                    if (this.layout[y][x]) {
                        this.block.draw(ctx, x + this.currentX, y + this.currentY, this.blockType);
                    }
                }
            }
        },
    };


    /***************canvas 类对象***********************/
    function Canvas(id, width, height) {
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
    };

    /*＊左右按钮控制砖块的方向＊*/
    function KeyBoard(){
        var keyCode={
                37:'left',
                38:'top',
                39:'right',
                40:'down',
            },
            that=this;
        this.eventHandlers=function(){
            document.addEventListener('keydown',this.keyPressEvent,true);
        };
        this.keyPressEvent=function(event){
            var code=event.keyCode;
            if(code>=37 && code<=40){
                that.keypress(keyCode[code]);
            }

        };

        this.keypress=function(type){
            var refresh=false;
            switch (type){
                case 'left':
                    if(this.board.validMove(-1,0)){
                        this.board.shape.currentX--;
                        refresh=true;
                    }
                    break;
                case 'top'://变换
                    if(this.board.validMove(0,0)){
                        this.board.rotate();
                        refresh=true;
                    }
                    break;
                case 'right':
                    if(this.board.validMove(1,0)){
                        this.board.shape.currentX++;
                        refresh=true;
                    }
                    break;
                case 'down':
                    break;
            }
            //刷新整个面板
            if(refresh){
                this.board.refresh();
                this.board.shape.draw(this.board.ctx);   //y坐标修改
            }
        };

    };

    function MyTetris() {
        this.timer = new Timer();
        this.nextShape = new NextShape();
        this.board = new Board();
        KeyBoard.call(this);
        this.init();
    }
    MyTetris.prototype = {
        init: function () {
            this.newGame();
            this.eventHandlers();
        },

        /*开始新游戏*/
        newGame: function () {
            var that = this;
            var sprite = this.board.shape.block.spriteImg.image;
            sprite.onload = function () {
                that.board.init();
                interval=window.setInterval(function(){
                    that.board.timeTick();
                },speed);
            };
        },

        /*结束游戏*/
        endGame: function () {
            window.clearInterval(interval);  //清除下落计时器
            window.clearInterval(this.timer.timeInterval);  //清除总时间计时器
            alert("Game Over");
        },
    };
    return new MyTetris();
})();