import Vue from 'vue';

let _private = {
	params: {},
	init: function (params, callback) {
		let p = this.params;
		//最短滑动时间（ms）
		p.slipMinTime = params.slipMinTime || 500;
		//最短滑动距离（px）
		p.slipMinDelta = params.slipMinDelta || 20;
		//判断是否有效水平滑动的正切角度，较长滚动页建议设为30
		p.tanAngle = params.tanAngle || 0;
		//绑定容器
		this.core = params.core;
		this.callback = callback;
		//是否冒泡
		this.stopPropagation = !!params.stopPropagation;

		//其它参数初始化
		this.delta = {};
		this.start = {};

		this._bind('touchstart');
		this._bind('touchmove');
		this._bind('touchend');
		this._bind('touchcancel');
	},
	handleEvent: function(e) {
		switch (e.type) {
			case "touchstart": this.touchstart(e); break;
			case "touchmove": this.touchmove(e); break;
			case "touchend":
			case "touchcancel": this.touchend(e); break;
		}
		this.stopPropagation && event.stopPropagation();
	},
	_bind: function(type) { //事件绑定
		this.core.addEventListener(type, this, !1);
	},
	_off: function(type) { //事件注销
		this.core.removeEventListener(type, this, !1);
	},
	touchstart: function(event){
		let touches = event.touches[0];
		this.start = {
			// 初始化触点坐标
			x: touches.pageX,
			y: touches.pageY,
			time: +new Date
		};
		// 初始化isScrolling
		this.isScrolling = undefined;
	},
	touchmove: function(event){
		if (event.touches.length > 1) return;
		let touches = event.touches[0],
			delta = this.delta,
			start = this.start,
			p = this.params;
		delta.x = touches.pageX - start.x;
		delta.y = touches.pageY - start.y;
		//首次滚动判断是否偏垂直方位滚动
		if (typeof this.isScrolling === 'undefined') {
			let x = Math.abs(delta.x),
				y = Math.abs(delta.y);
			if(p.tanAngle){
				this.isScrolling = !!( this.isScrolling || y > x * Math.tan(p.tanAngle/360 * Math.PI) );
			} else {
				this.isScrolling = !!( this.isScrolling || x < y );
			}
		}
	},
	touchend: function(event){
		//如果是垂直滚动或者仅仅是点击，则不作处理
		if (this.isScrolling || typeof this.isScrolling === 'undefined') return;

		let delta = this.delta,
			start = this.start,
			p = this.params;

		// 判断是否为有效滑动
		let duration = +new Date - start.time;
		let isValidSlide =
			Number(duration) < p.slipMinTime        //滑动时间小于500ms
			&& Math.abs(delta.x) > p.slipMinDelta;  // 且滑动距离大于20px

		if (isValidSlide) {
			// delta.x<0 为向左滑动；否则向右
			this.callback && this.callback(delta.x < 0, event);
		}
	},
	remove: function(){
		this._off('touchstart');
		this._off('touchmove');
		this._off('touchend');
		this._off('touchcancel');
	}
};

function clone(object) {
	function F(){}
	F.prototype = object;
	return new F;
}

export default {
	use() {
		Vue.directive("swipe", {
			bind: function (el, binding, vnode, oldVnode) {
				let swpieObj = clone(_private);
				let callback = typeof(binding.value) === "object" ? binding.value.fn : binding.value;
				let params = typeof(binding.value) === "object" ? binding.value : {};
				params.core = el;

				swpieObj.init(params, callback);
			}
		});
	}
}

