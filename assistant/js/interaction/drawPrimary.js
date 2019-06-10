/**点、面、线、圆 操作
 * 1、使用extends parent class
 * 2、页面渲染时 初始化 Point 、 LineString、Circle、Polygon 实例
 * 3、在select onchange 事件中根据不同值调用不同的实例对象 （调用前先清除所有draw），
 * 调用addInteractions（typeSelect） 传入typeSelect 作为 type 类型值
 * 4、将draw 、snap 同步保存于State 类中；popover进行控制，新增数据到左边列表
 */
window.onload=function (){
	let pointObj = new Point(map);
	let polygonObj = new Polygon(map);
	let lineStringObj = new LineString(map);
	let circleObj = new Circle(map);
	let lengthMeasureObj = new LengthMeasure(map);
	let areaMeasureObj = new AreaMeasure(map);
	const typeMap = new Map([['Point',pointObj],['LineString',lineStringObj],['Polygon',polygonObj],
		['Circle',circleObj],['Length',lengthMeasureObj],['Area',areaMeasureObj]]);
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
			$(setcheckbock).prop('checked',true).trigger('change');
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
	$('#checkPanel').on('change','input[type="checkbox"]',function(e){
		let selectType = this.getAttribute('data-type');
		let isChecked = this.checked;
		
		if(Object.is(selectType,'layer')){
			if(isChecked){
				map.addLayer(raster);
				map.addOverlay(State.cacheVector);
			}else{
				map.removeLayer(raster);
				map.removeOverlay(State.cacheVector);
			}
		}else{
			let ctrlObj = typeMap.get(selectType);
			isChecked ? ctrlObj.addVector() : ctrlObj.removeVector();
		}
	});
	
	$('#measureBtn').on('click',() => {
		
	//	measureObj.init();
	//	measureObj.addInteraction('LineString');
	measureObj.removeInteractions();
		measureObj.addInteractions();
		
	})
		$('#measureDel').on('click',() => {
		measureObj.removeInteractions();
	})
}