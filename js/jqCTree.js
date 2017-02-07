(function($) {
	$.fn.jqCTree = function(settings) {
		settings = $.extend({
			onExpand : null,
			onCollapse : null,
			onCheck : null,
			onUnCheck : null,
			onHalfCheck : null,
			onLabelHoverOver : null,
			onLabelHoverOut : null,
			onLabelClick : null,
			labelAction : "expand",
			debug : false
		}, settings);

		var $tree = this;
		$tree
				.find("li")
				.find("ul")
				.hide()
				.end()
				.find(":checkbox")
				.change(
						function() {
							// alert("change: this object code:" +
							// $(this).attr("node"));
							// var $all =
							// $(this).siblings("ul").find(":checkbox");
							// var $checked = $all.filter(":checked");
							var $all = $(this).siblings("ul").find(".checkbox");
							var $checked = $all.filter(".checked");
							var $half_checked = $all.filter(".half_checked");
							var allchecked = $checked.length
									+ $half_checked.length;
							// var $checked =
							// $(this).siblings("ul").find("input[type='checkbox']:checked");

							// alert($all.length + " " + allchecked);
							if ($all.length > 0) {
								if ($all.length == allchecked) {
									// $(this).attr("checked", true).siblings(
									// ".checkbox")
									// .removeClass("half_checked").addClass(
									// "checked");
									$(this).siblings(".checkbox").removeClass(
											"half_checked").addClass("checked");
									// alert("$all.length == $checked.length");
									if (settings.onCheck) {
										alert("onCheck");
										settings.onCheck($(this).parent());
									}
								} else if (allchecked == 0) {
									// alert("$checked.length == 0");
									// $(this).attr("checked", false).siblings(
									// ".checkbox").removeClass("checked")
									// .removeClass("half_checked");
									$(this).siblings(".checkbox").removeClass(
											"checked").removeClass(
											"half_checked");
									if (settings.onUnCheck)
										settings.onUnCheck($(this).parent());
								} else {
									// alert("else 3");
									if (settings.onHalfCheck
											&& !$(this).siblings(".checkbox")
													.hasClass("half_checked"))
										settings.onHalfCheck($(this).parent());
									// $(this).attr("checked", false).siblings(
									// ".checkbox").removeClass("checked")
									// .addClass("half_checked");
									$(this).siblings(".checkbox").removeClass(
											"checked").addClass("half_checked");
								}
							} else {
								//
							}
						})
				// .attr("checked", false)
				.hide()
				.end()
				.find("label")
				.click(function() {
					// alert("label click");
					var action = settings.labelAction;
					switch (settings.labelAction) {
					case 'expand':
						$(this).siblings(".arrow").click();
						break;
					case 'check':
						// alert("cccc");
						$(this).siblings(".checkbox").click();
						break;
					default:
						break;
					}
					if (settings.onLabelClick)
						settings.onLabelClick($(this));
				})
				.hover(function() {
					$(this).addClass("hover");
					if (settings.onLabelHoverOver)
						settings.onLabelHoverOver($(this).parent());
				}, function() {
					$(this).removeClass("hover");
					if (settings.onLabelHoverOut)
						settings.onLabelHoverOut($(this).parent());
				})
				.end()
				.each(
						function() {
							// alert("1-"+$(this).html());
							var $arrow = $('<div class="arrow"></div>');
							if ($(this).is(":has(ul)")) {
								$arrow.addClass("collapsed");
								$arrow
										.click(function() {
											$(this).siblings("ul").toggle();
											if ($(this).hasClass("collapsed")) {
												$(this).addClass("expanded")
														.removeClass(
																"collapsed");
												if (settings.onExpand)
													settings.onExpand($(this)
															.parent());
											} else {
												$(this)
														.addClass("collapsed")
														.removeClass("expanded");
												if (settings.onCollapse)
													settings.onCollapse($(this)
															.parent());
											}
										});
							}
							// alert("add checkbox div");
							var $checkbox = $('<div class="checkbox"></div>');
							if ($(this).hasClass("half")) {
								$checkbox = $('<div class="checkbox half_checked"></div>');
							} else if ($(this).hasClass("all")) {
								$checkbox = $('<div class="checkbox checked"></div>');
							}
							$checkbox
									.click(function() {
										$(this).removeClass("half_checked")
												.toggleClass("checked");
										// .siblings(":checkbox").click();
										// alert("fadsfadsf");
										// alert("click, class:" +
										// $(this).attr("class"));
										if ($(this).hasClass("checked")) {
											// alert("hasClass checked");
											if (settings.onCheck)
												settings.onCheck($(this)
														.parent());

											$(this)
													.siblings("ul")
													.find(".checkbox")
													// .not(".checked")
													.removeClass("half_checked")
													.addClass("checked")
													.each(
															function() {
																if (settings.onCheck)
																	settings
																			.onCheck($(
																					this)
																					.parent());
															});
											// .siblings(":checkbox").attr("checked",true);
										} else {
											// alert("no Class checked");
											if (settings.onUnCheck)
												settings.onUnCheck($(this)
														.parent());
											$(this)
													.siblings("ul")
													.find(".checkbox")
													.filter(".checked")
													.removeClass("half_checked")
													.removeClass("checked")
													.each(
															function() {
																if (settings.onUnCheck)
																	settings
																			.onUnCheck($(
																					this)
																					.parent());
															});
											// .siblings(":checkbox").attr("checked",
											// false);
										}
										$(this).siblings(":checkbox").change();
										// alert("exec parents");
										$(this).parents("ul").siblings(
												":checkbox").change();
									});
							// alert("2-"+$(this).html());
							$(this).prepend($checkbox).prepend($arrow);
							// alert("3-"+$(this).html());
						});
		var doOneExpand = function() {
			$tree.find("li").find("ul").show().end().find(".collapsed")
					.addClass("expanded").removeClass("collapsed");
		};

		var doOneCollaps = function() {
			$tree.find("li").find("ul").hide().end().find(".expanded")
					.addClass("collapsed").removeClass("expanded");
		};

		var doSelectAll = function() {
			$tree.find("li").find("[class^='checkbox']").parent().show().end()
					.addClass("checked").removeClass("half_checked");
		};

		var doPreview = function() {
			doContinue();
			$tree.find("li").find("[class='checkbox']").parent().hide();
		};

		var doContinue = function() {
			$tree.find("li").find("[class^='checkbox']").parent().show();
		};

		var doReset = function() {
			$tree.find("li").find("[class^='checkbox']").parent().show().end()
					.removeClass("checked").removeClass("half_checked");
		};

		var doGetChecked = function() {
			var vals = $tree.find("li").find("[class$='checked']").nextAll(
					":checkbox");
			return vals;
		};
		return {
			oneExpand : doOneExpand,
			oneCollaps : doOneCollaps,
			selectAll : doSelectAll,
			preview : doPreview,
			continues : doContinue,
			reset : doReset,
			getChecked : doGetChecked
		};
	};
})(jQuery);