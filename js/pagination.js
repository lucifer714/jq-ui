(function($) {

	/**
	 * 初始化pagination组件的HTML结构
	 * @param {Object} $pagination
	 */
	function init($pagination) {
		$pagination
			.addClass("pagination")
			.append($('<a href="javascript:;" class="first">首页</a>'))
			.append($('<a href="javascript:;" class="prev">上一页</a>'))
			.append($('<div class="page-container"></div>'))
			.append($('<a href="javascript:;" class="next">下一页</a>'))
			.append($('<a href="javascript:;" class="last">尾页</a>'));
	}

	/**
	 * 绑定事件，包括页码点击事件，和上一页、首页、下一页、尾页点击事件
	 * @param {Object} $pagination
	 */
	function initEvents($pagination) {
		
		// 获取参数配置
		var options = $.data($pagination[0], "pagination");
		// 获取点击事件
		var totalFn = options["click"];

		// 页码点击事件
		$pagination.find(".page-container").delegate(".page-num", "click", function() {
			
			if ($(this).hasClass("current-page")) return;
			
			// 获取目标页码
			var current = parseInt($(this).html());

			// 调用toPage函数进行跳转
			toPage($pagination, current, totalFn(current, options["size"]), options["size"]);
		});
		// 首页、上一页、下一页、尾页点击事件
		$pagination.delegate(".first", "click", function() {
			// 调用toPage函数进行跳转
			toPage($pagination, 1, totalFn(1, options["size"]), options["size"]);
		}).delegate(".prev", "click", function() {
			var current = parseInt($pagination.find(".page-container .current-page").html()) - 1;
			if(current < 1) return;
			// 调用toPage函数进行跳转
			toPage($pagination, current, totalFn(current, options["size"]), options["size"]);
		}).delegate(".next", "click", function() {
			var current = parseInt($pagination.find(".page-container .current-page").html()) + 1;
			if(current > options["total"]) return;
			// 调用toPage函数进行跳转
			toPage($pagination, current, totalFn(current, options["size"]), options["size"]);
		}).delegate(".last", "click", function() {
			// 调用toPage函数进行跳转
			toPage($pagination, options["total"], totalFn(options["total"], options["size"]), options["size"]);
		});
	}

	/**
	 * 获取当前页码
	 * @param {Object} $pagination
	 */
	function getCurrentPage($pagination) {
		return parseInt($pagination.find(".page-container .current-page").html());
	}
	
	/**
	 * 获取每一页的大小
	 * @param {Object} $pagination
	 */
	function getSize($pagination) {
		// 获取参数配置
		var options = $.data($pagination[0], "pagination");
		return options["size"];
	}

	/**
	 * 跳转至指定页码
	 * @param {Object} $pagination
	 * @param {Object} current
	 * @param {Object} total
	 * @param {Object} size
	 */
	function toPage($pagination, current, total, size) {
		
		// 切换不可使用样式
		$($pagination).find(".first, .prev, .next, .last").removeClass("disable-page");
		
		if(current == 1)
			$($pagination).find(".first, .prev").addClass("disable-page");
		if(current == total)
			$($pagination).find(".next, .last").addClass("disable-page");
		
		// 计算开始页码
		var start = current - Math.floor(size / 2);
		if(start < 1)
			start = 1;

		// 计算结束页码
		var end = start + size - 1;
		if(end > total)
			end = total;

		// 重新计算开始页码
		if(end - size + 1 > 0)
			start = end - size + 1;

		// 先清空当前页码
		$pagination.find(".page-container").empty();
		// 填充页码链接
		for(var i = start; i < current; i++) {
			$pagination.find(".page-container").append($('<a href="javascript:;" class="page-num">' + i + '</a>'));
		}
		$pagination.find(".page-container").append($('<a href="javascript:;" class="page-num current-page">' + current + '</a>'));
		for(var i = current + 1; i <= end; i++) {
			$pagination.find(".page-container").append($('<a href="javascript:;" class="page-num">' + i + '</a>'));
		}
	}

	$.fn.pagination = function(options, param) {

		// 对外提供的函数
		if(typeof options == 'string') {
			switch(options) {
				// 获取当前页
				case 'getCurrentPage':
					return this.each(function() {
						getCurrentPage($(this));
					});
				// 跳转至指定页码
				case 'toPage':
					return this.each(function() {
						param = $.extend($.data(this, "pagination"), param);
						toPage($(this), param["current"], param["total"], param["size"]);
					});
				// 获取每一页的size
				case 'getSize':
					return this.each(function() {
						getSize($(this));
					});
			}
		}

		// 默认参数配置
		var defaults = {
			size: 10, 						// 显示的页码数目
			click: function() {return 1;}	// 页码点击事件，需要返回total总页数
		};

		// 合并自定义参数
		var options = $.extend(defaults, options);

		// 创建组件
		return this.each(function() {

			// 缓存配置参数
			$.data(this, "pagination", options);

			// 保存对象
			var pagination = $(this);

			// 初始化组件
			init(pagination);

			// 初始化事件
			initEvents(pagination);
		});
	};
})(jQuery);