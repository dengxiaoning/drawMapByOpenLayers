class LengthMeasure extends Measure {
	constructor(map) {
		super(map);
	}
	removeVector() {
		$('div.tooltip.Length').addClass('hidden');
		this.map.removeOverlay(this.vector);
	}
	addVector() {
		$('div.tooltip.Length').removeClass('hidden');
		if (this.vector) this.map.addOverlay(this.vector);
	}
}
