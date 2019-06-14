class InteractionHandle{
	constructor(map) {
	    this.map = map;
		let source = new ol.source.Vector();
		this.vector = new ol.layer.Vector({
			source: source,
			style: new ol.style.Style({
				fill: new ol.style.Fill({
					color: 'rgba(255, 255, 255, 0.2)'
				}),
				stroke: new ol.style.Stroke({
					color: '#ffcc33',
					width: 4
				}),
				image: new ol.style.Circle({
					radius: 7,
					fill: new ol.style.Fill({
						color: '#ffcc33'
					})
				})
			})
		});
		this.map.addOverlay(this.vector);
		
		var modify = new ol.interaction.Modify({
			source: source
		});
		this.map.addInteraction(modify);
		this.source = source;
	}
	/**
	 * 创建draw
	 * @param {drawType.<String>} 绘制交互类型
	 * @return void
	 */
	addInteractions(drawType='Point') {
		let source = this.source;
		let commStyle = new CommonStyle();
		let draw = new ol.interaction.Draw({
			source: source,
			type: drawType
		});
		
		//添加 interaction
		this.map.addInteraction(draw);
		let snap = new ol.interaction.Snap({
			source: source
		});
		
		//添加 snap
		this.map.addInteraction(snap);
		let eventhandle = new EventHandle(this.map);
		let idNum;
		draw.on('drawend',function(e){
			idNum=State.drawFeatureAll.length+1;
			e.feature.setId(idNum);
			e.feature.set('type',drawType);
			State.drawFeatureAll.push({idNum:idNum,type:drawType});
			// 绘制不同样式
			e.feature.setStyle(function(e) {
				return commStyle.styleFunctionDefault(drawType,this);
			})	
			State.selectedObj = '';
			State.selectedObj =	e.feature;//赋值便于新增操作，不然要二次点击才能获取id
		});
		State.draw = draw;
		State.snap = snap;
	//	return [draw, snap];
	}

	removeInteractions() {
		this.map.removeInteraction(State.draw);
		this.map.removeInteraction(State.snap);
	}
	removeVector(){
		this.map.removeOverlay(this.vector);
	}
	addVector(){
		if(this.vector)this.map.addOverlay(this.vector);
	}
	getVector(){
		return this.vector;
	}
}