/**点、面、线、圆 操作
 * 1、使用extends parent class
 * 2、页面渲染时 初始化 Point 、 LineString、Circle、Polygon 实例
 * 3、在select onchange 事件中根据不同值调用不同的实例对象 （调用前先清除所有draw），
 * 调用addInteractions（typeSelect） 传入typeSelect 作为 type 类型值
 * 4、将draw 、snap 同步保存于State 类中；popover进行控制，新增数据到左边列表
 */
window.onload = function() {
	let pointObj = new Point(map);
	let polygonObj = new Polygon(map);
	let lineStringObj = new LineString(map);
	let circleObj = new Circle(map);
	let lengthMeasureObj = new LengthMeasure(map);
	let areaMeasureObj = new AreaMeasure(map);
	let iconVectorObj = State.cacheVector;
	let commStyle =  new CommonStyle();
	const typeMap = new Map([
		['Point', pointObj],
		['LineString', lineStringObj],
		['Polygon', polygonObj],
		['Circle', circleObj],
		['Length', lengthMeasureObj],
		['Area', areaMeasureObj],
		['icon', iconVectorObj]
	]);
	let typeSelect = document.getElementById('geometryType');
	var currentCtrlObj;

	let removeInteraction = () => {
		currentCtrlObj && currentCtrlObj.removeInteractions();
	}
	let addInteractions = () => {
		removeInteraction();
		let value = typeSelect.value;
		if (value !== 'None') {
			currentCtrlObj = typeMap.get(value);
			currentCtrlObj.addInteractions(value);
			let setcheckbock = `#checkPanel input[data-type="${value}"]`
			$(setcheckbock).prop('checked', true).trigger('change');
		}
	}

	/**
	 * Handle change event.
	 */
	typeSelect.onchange = function() {
		addInteractions();
	};
	addInteractions();

	// checkbox change
	$('#checkPanel').on('change', 'input[type="checkbox"]', function(e) {
		let selectType = this.getAttribute('data-type');
		let isChecked = this.checked;

		if (Object.is(selectType, 'layer')) {
			if (isChecked) {
				map.addLayer(raster);
				map.addOverlay(State.cacheVector);
			} else {
				map.removeLayer(raster);
				map.removeOverlay(State.cacheVector);
			}
		} else {
			let ctrlObj = typeMap.get(selectType);
			isChecked ? ctrlObj.addVector() : ctrlObj.removeVector();
		}
	});
	
	// 移除选择的矢量图标
	var mvFeature = (e) => {
		let idNum,type,ctrlObj,source;
		// 直接从行列选择图标，无法使用interaction 的点击事件中的全局对象
		if(State.selectedObj){
			idNum = State.selectedObj.getId();
			type = State.selectedObj.get('type');
		}else{
			type = $(e.currentTarget).siblings('span.type').text();
			idNum = $(e.currentTarget).siblings('span.idNum').text();
		}

		if (idNum && type) {
			// 获取对应的矢量图层
			 ctrlObj = typeMap.get(type);
			// icon 类型直接获取 source
			 source = type === 'icon'?ctrlObj.getSource():ctrlObj.getVector().getSource();
			let feature = source.getFeatureById(idNum);
			source.removeFeature(feature);
			$(`div.${type+idNum}`).remove();
			if(type === 'icon'){
				DataHandle.delElement(feature);
			}
		} else {
			alert('未能获取信息，请重新选择！')
		}
	}

	// 新增矢量图标(此处就不涉及检测重复矢量图标，因这里是取地图已存在图标)
	var addDataToLeftMenu = e => {
		let idNum,type,ctrlObj,source,fName;
		fName = $(e.currentTarget).siblings('textarea').val();
		// 直接从行列选择图标，无法使用interaction 的点击事件中的全局对象
		if(State.selectedObj){
			idNum = State.selectedObj.getId();
			type = State.selectedObj.get('type');
		}else{
			type = $(e.currentTarget).siblings('span.type').text();
			idNum = $(e.currentTarget).siblings('span.idNum').text();
		}
	
		if (idNum && type) {
			// 获取对应的矢量图层
			 ctrlObj = typeMap.get(type);
			// icon 类型直接获取 source
			 source = type === 'icon'?ctrlObj.getSource():ctrlObj.getVector().getSource();
			let feature = source.getFeatureById(idNum);
			// 设置 feature 名字
			feature.set('name',fName);
			// 对应新增到列表数据
			DataHandle.addMenuList(feature);
		} else {
			alert('未能获取信息，请重新选择！')
		}
	}
	
	// 为 popover 的取消 button 绑定事件, 关闭popover
	$('body').on('click', 'div.popover button.cancelBtn', (e) => {
		mvFeature(e);
		var element = popup.getElement();
		$(element).popover('destroy');
		State.redraw = true;
		if (State.draw) State.draw.setActive(true);
	});

	// 为 popover 的删除按钮 绑定事件
	$('body').on('click', 'div.popover button.delBtn', (e) => {
		mvFeature(e);
		$('#collapseListGroup1').addClass('in');
		var element = popup.getElement();
		$(element).popover('destroy');
		State.redraw = true;
	});
	
	// 为 popover 的确定 button 绑定事件, 实现坐标数据新增
	$('body').on('click', 'div.popover button.confirmBtn', e => {
		// 获取input 值
		var addrName = $(e.currentTarget).siblings('textarea').val();
		if (!addrName) {
			alert('请输入地址名称');
			return false;
		}
		addDataToLeftMenu(e);
	
		var element = popup.getElement();
		$(element).popover('destroy');
		State.redraw = true;
		if (State.draw) State.draw.setActive(true);
	});
	
		
	// 绑定 menu list 点击事件
	$('body').on('click', 'div.left-panel ul.list-group>li', e => {
		State.selectedObj = '';
		let ctrlObj,source;
		// 根据 type 判断操作的矢量图层对象，id 查询该矢量图层中对应的feature
		var fid = e.target.dataset.fid;
		var ftype = e.target.dataset.ftype
		
		// 获取对应的矢量图层
		 ctrlObj = typeMap.get(ftype);
		// icon 类型直接获取 source
		 source = ftype === 'icon'?ctrlObj.getSource():ctrlObj.getVector().getSource();
		let feature = source.getFeatureById(fid);
		let coordinate = feature.getGeometry();
		coordinate = coordinate.A;
		if(feature){
			//重置 map 中心点
			map.getView().setZoom(11);
			map.getView().setCenter(coordinate);
			
			if(State.enableFeature ){ // 恢复其他被激活的样式
				let type = State.enableFeature.get('type')
				if(type =='icon'){
					let level = State.enableFeature.get('level');				
					State.enableFeature.setStyle(Conf.setStyleByLevel(level));
				}else if(type && type !== 'undefined'){
					State.enableFeature.setStyle(function(){
						return commStyle.styleFunctionDefault(type,this)
					});
				}			
			}
			setTimeout(() => {
				// 提示框 控制 
				eventHandle.makePopupAndShow(feature,popup);
			},200);			
		}

	});	
}
