## openlayers 
> 使用 openLayers 绘制地图

*
##### 绘制图形如下
* 1 点
* 2 线
* 3 面
* 4 圆
* 4 测量 线
* 5 测量 面

##### 同步增加控制每个操作面板记录所有的操作记录
##### 删除 draw feature obj 
* 1 在 监听 draw drawend 为每一个 feature setId(), 同时声明变量将其保存到 一个记录数组里，在map.on事件里根据选中
的feature 再获取该对象id 根据对象进行删除操作

