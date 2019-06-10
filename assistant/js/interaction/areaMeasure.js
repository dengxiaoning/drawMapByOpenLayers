class AreaMeasure extends Measure {
	constructor(map) {
		super(map);
	}
	removeVector() {
		$('div.tooltip.areaMeasure').addClass('hidden');
		this.map.removeOverlay(this.vector);
	}
	addVector() {
		$('div.tooltip.areaMeasure').removeClass('hidden');
		if (this.vector) this.map.addOverlay(this.vector);
	}
}
