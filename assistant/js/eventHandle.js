function EventHandle(map) {
	this.map = map;
}
EventHandle.prototype = {
	createMask() {
		var popup = new ol.Overlay({
			element: document.getElementById('popup1'),
			positioning: 'bottom-center',
			stopEvent: false,
			offset: [0, -20]
		});
		return popup;
	},
	mapSingleClick(popup) {
		var me = this;
		let commStyle = new CommonStyle();
		//地图单击事件
		this.map.on('click', function(evt) {
			$('#collapseListGroup1').removeClass('in');
			var element = popup.getElement();
			var pixel = map.getEventPixel(evt.originalEvent);
			var featureObj = map.forEachFeatureAtPixel(pixel, function(feature, layer) {
				return {
					feature: feature,
					layer: layer
				};
			});
			if (State.redraw) {
				$(element).popover('destroy');
				if (featureObj) {
					me.makePopupAndShow(featureObj.feature, popup);
				}else{// 点击非 feature 区域
					if(State.enableFeature){ 
						let type = State.enableFeature.get('type')
						if(type =='icon'){ // 恢复feature为红色
							let level = State.enableFeature.get('level');
							State.enableFeature.setStyle(Conf.setStyleByLevel(level));
						}else if(type && type !== 'undefined'){
							State.enableFeature.setStyle(function(){
								return commStyle.styleFunctionDefault(type,this)
							});
						}
						// 重置 激活 feature 样式
						State.enableFeature = null;
					}					
				}
			}
		});
	},
	makePopupAndShow(feature, popup) {
		var element = popup.getElement();
		var coordinate = feature.getGeometry();
		coordinate = coordinate.A;
		let type = feature.get('type');
		let idNum = feature.getId();

		if(type && type !== 'undefined' && idNum && idNum !== 'undefined'){
			State.selectedObj = '';
			State.selectedObj = feature;
		}
		let commStyle = new CommonStyle();
		if(State.enableFeature ){
			if(type =='icon'){ // 恢复feature为红色
				let level = State.enableFeature.get('level');
				State.enableFeature.setStyle(Conf.setStyleByLevel(level));
			}else if(type && type !== 'undefined'){
				State.enableFeature.setStyle(function(){
					return commStyle.styleFunctionDefault(type,this)
				});
			}			
		}
		
		//鼠标移入事件 1、设置interaction 为false 2、设置标识 map事件是否注销popover
		inputmouseover = function() {
			if(State.draw)State.draw.setActive(false);
			State.redraw = false;
		}
		// 鼠标离开事件 
		inputmouseout = function() {
			if(State.draw)State.draw.setActive(true);
			State.redraw = true;
		}
		if (State.redraw) {
			$(element).popover('destroy');
		}
		if (feature) {
			popup.setPosition(coordinate);
			if (!feature.get('name')) {
				$(element).popover({
					trigger: 'manual',
					'placement': 'top',
					'animation': false,
					'html': true,
					'content': `<p onmouseover="inputmouseover()" onmouseout="inputmouseout()"> \
					<textarea placeholder="自定义标注名称" class="form-control"></textarea><br/>坐标：<span class="coordinate">${coordinate}\ 
					</span><span class="type hidden">${type}</span><span class="idNum hidden">${idNum}</span>\
					<button class="btn btn-info confirmBtn" >确定</button><button class="btn btn-default cancelBtn" \
					 style="float:right;">取消</button></p>`
				});
			} else {
				$(element).popover({
					'trigger': 'manual',
					'placement': 'top',
					'animation': false,
					'html': true,
					'content': `<p onmouseover="inputmouseover()" onmouseout="inputmouseout()"><textarea>${feature.get('name')} \ 
					</textarea><span class="modifyAddr">修改</span>坐标：<span class="coordinate">${coordinate}</span> \
					<span class="type hidden">${type}</span><span class="idNum hidden">${idNum}</span> \
					<button class="btn btn-info confirmBtn" disabled >确定</button><button class="btn btn-danger delBtn" \
					style="float:right;">删除</button> </p>`
				});
			}
	
			if(type =='icon'){
				//设置feature 激活样式
				feature.setStyle(Conf.getStyle_icon_changeProp({src: "static/imgs/marker_green.png"})); 
			}else if(type && type !== 'undefined'){
				feature.setStyle(function(){
					return commStyle.styleFunction(type,this)
				});
			}
			$(element).popover('show');
			State.enableFeature = null;
			State.enableFeature = feature;
		}
	}
}
