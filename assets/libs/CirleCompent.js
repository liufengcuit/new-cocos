cc.Class({
    extends: cc.Component,
    
    properties: {
        _borderColor: cc.color(),
        _borderWidth: 0,
        _radiuLeftTop: 0,
        _radiuRightTop: 0,
        _radiuRightBottom: 0,
        _radiuLeftBottom: 0,
        _fullColor: cc.color(),
        _drawNode: null,
        borderColor: {
            type: cc.Color,
            get: function (){
                return this._borderColor;
            },
            set: function(val){
                this._borderColor = val;
    
                this._refreshRect();
            },
            tooltip: "边框颜色"
        },
        borderWidth: {
            type: cc.Float,
            get: function (){
                return this._borderWidth;
            },
            set: function(val){
                this._borderWidth = val;
    
                this._refreshRect();
            },
            tooltip: "边框线条宽度"
        },
        radiuLeftTop: {
            type: cc.Float,
            get: function (){
                return this._radiuLeftTop;
            },
            set: function(val){
                this._radiuLeftTop = val;
    
                this._refreshRect();
            },
            tooltip: "左上角圆角半径"
        },
        radiuRightTop: {
            type: cc.Float,
            get: function (){
                return this._radiuRightTop;
            },
            set: function(val){
                this._radiuRightTop = val;
    
                this._refreshRect();
            },
            tooltip: "右上角圆角半径"
        },
        radiuRightBottom: {
            type: cc.Float,
            get: function (){
                return this._radiuRightBottom;
            },
            set: function(val){
                this._radiuRightBottom = val;
    
                this._refreshRect();
            },
            tooltip: "右下角圆角半径"
        },
        radiuLeftBottom: {
            type: cc.Float,
            get: function (){
                return this._radiuLeftBottom;
            },
            set: function(val){
                this._radiuLeftBottom = val;
    
                this._refreshRect();
            },
            tooltip: "左下角圆角半径"
        },
        fullColor: {
            type: cc.Color,
            get: function (){
                return this._fullColor;
            },
            set: function(val){
                this._fullColor = val;
    
                this._refreshRect();
            },
            tooltip: "填充颜色"
        }
    },
    
    // LIFE-CYCLE CALLBACKS:
    
    // onLoad () {},
    
    start () {
        this.node.on("size-changed", this._refreshRect, this);
        this.node.on("anchor-changed", this._refreshRect, this);
    
        this._refreshRect();
    },
    
    _refreshRect(){
        if (!this._drawNode){
            this._drawNode = new cc.DrawNode();
    
            this.node._sgNode.addChild(this._drawNode);
        }
    
        var polies = [],
            isSquare = this.node.width === this.node.height,
            maxRadiuLength = this._isSquare ? this.node.width / 2 : Math.min(this.node.width, this.node.height) / 2;
    
        this._drawNode.x = -(this.node.anchorX * this.node.width);
        this._drawNode.y = +(this.node.anchorY * this.node.height);
    
        this._drawNode.clear();
    
        if (this.radiuLeftTop > maxRadiuLength)
            this.radiuLeftTop = maxRadiuLength;
    
        if (this.radiuLeftBottom > maxRadiuLength)
            this.radiuLeftBottom = maxRadiuLength;
    
        if (this.radiuRightBottom > maxRadiuLength)
            this.radiuRightBottom = maxRadiuLength;
    
        if (this.radiuRightTop > maxRadiuLength)
            this.radiuRightTop = maxRadiuLength;
    
        if (this.radiuLeftTop > 0)
            this._pushRadian(this.radiuLeftTop, cc.p(this.radiuLeftTop, -this.radiuLeftTop), 90, 180, polies);
        else
            polies.push(cc.p(0, 0));
    
        if (this.radiuLeftBottom > 0)
            this._pushRadian(this.radiuLeftBottom, cc.p(this.radiuLeftBottom, -this.node.height + this.radiuLeftBottom), 180, 270, polies);
        else
            polies.push(cc.p(0, -this.node.height));
    
        if (this.radiuRightBottom > 0)
            this._pushRadian(this.radiuRightBottom, cc.p(this.node.width - this.radiuRightBottom, -this.node.height + this.radiuRightBottom), 270, 360, polies);
        else
            polies.push(cc.p(this.node.width, -this.node.height));
    
        if (this.radiuRightTop > 0)
            this._pushRadian(this.radiuRightTop, cc.p(this.node.width - this.radiuRightTop, -this.radiuRightTop), 360, 450, polies);
        else
            polies.push(cc.p(this.node.width, 0));
    
        this._drawNode.drawPoly(polies, this.fullColor, this.borderWidth, this.borderColor);
    },
    
    _pushRadian(r, conter, startAngle, endAngle, polies){
        var proportion = (endAngle - startAngle) / 360,
            segements = parseInt(r * Math.PI * 8 * proportion),
            anglePerStep = Math.PI * 2 * proportion / segements,
            startAngle = Math.PI / 180 * startAngle;
    
        for(var step = 0; step < segements; ++ step) {
            polies.push(cc.p(r * Math.cos(startAngle + anglePerStep * step) + conter.x, r * Math.sin(startAngle + anglePerStep * step) + conter.y));
        }
    
        return polies;
    }
});