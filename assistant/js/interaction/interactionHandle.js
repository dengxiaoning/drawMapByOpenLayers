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
					width: 2
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
}