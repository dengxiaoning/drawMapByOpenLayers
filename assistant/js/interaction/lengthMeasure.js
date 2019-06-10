class LengthMeasure extends Measure {
	constructor(map) {
		super(map);
	}
	removeVector() {
		$('div.tooltip.lineMeasure').addClass('hidden');
		this.map.removeOverlay(this.vector);
	}
	addVector() {
		$('div.tooltip.lineMeasure').removeClass('hidden');
		if (this.vector) this.map.addOverlay(this.vector);
	}
}
