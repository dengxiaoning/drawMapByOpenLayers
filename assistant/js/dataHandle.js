function DataHandle(map,VectorHandle,cacheVector,eventHandle,popup){
	this.map = map;
	this.VectorHandle = VectorHandle;
	this.cacheVector = cacheVector;
	this.eventHandle = eventHandle;
	this.popup = popup;
}

DataHandle.prototype = {
	_getData(callback){
		$.getJSON("assistant/json/testGeo.json",function (data) {
			callback && callback(data);
		});
	},
	_bindMenuClick(e){
		$('.list-group-item').unbind('click').on('click',(e) => {
			if (this.cacheVector) {
				// 清除矢量图层 this.map.removeOverlay(this.cacheVector);
				var lng = e.target.dataset.lng;
				var lat = e.target.dataset.lat
				//遍历 feature 
				this.cacheVector.getSource().forEachFeature((f) => {
					let coordinates = f.getGeometry().A;
					if(coordinates[0] == lng && coordinates[1] == lat){
						//重置 map 中心点
						this.map.getView().setZoom(11);
						this.map.getView().setCenter(coordinates);
						setTimeout(() => {
							this.eventHandle.makePopupAndShow(f,this.popup);
						},200);
						return false;
					}
				});
			};
		});
	},
	createList(){
		var menuUi = document.getElementById('menuUi');
		this._getData((data) => {
			var coordinateArr = [];//缓存所有 坐标数据
			var featureName = [];
			data.forEach((obj,index) => {
				var coordinateChild = [];
				var menuChild = document.createElement('li');
				menuChild.setAttribute('class', 'list-group-item');
				menuChild.setAttribute('data-lat', obj.lat);
				menuChild.setAttribute('data-lng', obj.lng);
				menuChild.innerHTML = obj.name;
				menuUi.appendChild(menuChild);				
				coordinateChild.push(+obj.lng);
				coordinateChild.push(+obj.lat);
				coordinateArr.push(coordinateChild);
				featureName.push(obj.name);
			});
			this._bindMenuClick();
			this._showVectorAll(coordinateArr,featureName);
		});
	},
	_showVectorAll(coordinateArr,featureName){//渲染所有 矢量图标
		this.VectorHandle.setCoordinate(coordinateArr);
		this.VectorHandle.setFeatureName(featureName)
		this.cacheVector = this.VectorHandle.createVector();
		State.cacheVector = this.cacheVector;
	},
	addMenuSingle(coordinate,addrName){
		var menuUi = document.getElementById('menuUi');
		this.VectorHandle.setCoordinate(coordinate);
		this.VectorHandle.setFeatureName(addrName)
		//新增 、 修改之前 判断是否已经存在
		var existEl = this._existElement(menuUi,coordinate[0],coordinate[1]);

		if(existEl){
			existEl.innerHTML = addrName;
			this.VectorHandle.updateFeate(this.cacheVector);
		}else{
			var menuChild = document.createElement('li');
			menuChild.setAttribute('class', 'list-group-item');
			menuChild.setAttribute('data-lat', coordinate[1]);
			menuChild.setAttribute('data-lng', coordinate[0]);
			menuChild.innerHTML = addrName;
			menuUi.appendChild(menuChild);
			this._bindMenuClick();
			this.VectorHandle.addFeature(this.cacheVector);
		}
	},
	delElement(coordinate){
		var menuUi = document.getElementById('menuUi');
		var existEl = this._existElement(menuUi,coordinate[0],coordinate[1]);
		if(existEl){
			menuUi.removeChild(existEl);
			this.VectorHandle.setCoordinate(coordinate);
			this.VectorHandle.delFeature(this.cacheVector);
		}
	},
	_existElement(menuUi,lng,lat){
		var elChild = $(menuUi).children('li');
		for(var i=0;i<elChild.length;i++){
			if(elChild[i].getAttribute('data-lng') == lng && elChild[i].getAttribute('data-lat') == lat){
				return elChild[i];
			}
		}
		return null;
	}
}