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
	createList(){
		var menuUi = document.getElementById('menuUi');
		let idNum;
		this._getData((data) => {
			var coordinateArr = [];//缓存所有 坐标数据
			var featureName = [];
			var idArray = [];
			var levelArray = [];
			data.forEach((obj,index) => {
				idNum=State.drawFeatureAll.length+1;
				var coordinateChild = [];
				var menuChild = document.createElement('li');
				menuChild.setAttribute('class', 'list-group-item');
				menuChild.setAttribute('data-fId', idNum);
				menuChild.setAttribute('data-fType', 'icon');			
				menuChild.innerHTML = obj.name;
				menuUi.appendChild(menuChild);				
				coordinateChild.push(+obj.lng);
				coordinateChild.push(+obj.lat);
				coordinateArr.push(coordinateChild);
				featureName.push(obj.name);
				idArray.push(idNum);
				levelArray.push(obj.level);
				State.drawFeatureAll.push({idNum:idNum,type:'icon'});
			});
			this._showVectorAll(coordinateArr,featureName,idArray,levelArray);
		});
	},
	_showVectorAll(coordinateArr,featureName,idArray,levelArray){//渲染所有 矢量图标
		this.VectorHandle.setCoordinate(coordinateArr);
		this.VectorHandle.setFeatureName(featureName);
		this.VectorHandle.setIdArray(idArray);
		this.VectorHandle.setLevelArray(levelArray);
		this.cacheVector = this.VectorHandle.createVector();
		State.cacheVector = this.cacheVector;
	},
	addMenuList(feature){
		let menuUi = document.getElementById('menuUi');
		let fId = feature.getId();
		let fName = feature.get('name');
		let fType = feature.get('type');// 便于点击列表时 可以分辨操作的矢量图层对象
		let isExist = this._existMenuList(menuUi,fId,fType);
		//存在修改列表，不存在新增列表
		if(isExist){
			isExist.innerHTML = fName;
		}else{
			var menuChild = document.createElement('li');
			menuChild.setAttribute('class', 'list-group-item');
			//menuChild.setAttribute('data-lat', coordinate[1]);
			//menuChild.setAttribute('data-lng', coordinate[0]);
			menuChild.setAttribute('data-fId', fId);
			menuChild.setAttribute('data-fType', fType);
			menuChild.innerHTML = fName;
			menuUi.appendChild(menuChild);
		}
	},
	delElement(feature){
		let menuUi = document.getElementById('menuUi');
		let fId = feature.getId();
		let fName = feature.get('name');
		let fType = feature.get('type');// 便于点击列表时 可以分辨操作的矢量图层对象
		let isExist = this._existMenuList(menuUi,fId,fType);
		if(isExist){
			menuUi.removeChild(isExist);
		}
	},
	_existMenuList(menuUi,fId,fType){
		var elChild = $(menuUi).children('li');
		for(var i=0;i<elChild.length;i++){
			if(elChild[i].getAttribute('data-fId') == fId && elChild[i].getAttribute('data-fType') == fType){
				return elChild[i];
			}
		}
		return null;
	}
}