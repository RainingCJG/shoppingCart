window.onload = function(){
	function supportClassList(){
		//ie9支持classList
		if (!("classList" in document.documentElement)) {  
	        Object.defineProperty(HTMLElement.prototype, 'classList', {  
	            get: function() {  
	                var self = this;  
	                function update(fn) {  
	                    return function(value) {  
	                        var classes = self.className.split(/\s+/g),  
	                            index = classes.indexOf(value);  
	                          
	                        fn(classes, index, value);  
	                        self.className = classes.join(" ");  
	                    }  
	                }  
	                  
	                return {                      
	                    add: update(function(classes, index, value) {  
	                        if (!~index) classes.push(value);  
	                    }),  
	                      
	                    remove: update(function(classes, index) {  
	                        if (~index) classes.splice(index, 1);  
	                    }),  
	                      
	                    toggle: update(function(classes, index, value) {  
	                        if (~index)  
	                            classes.splice(index, 1);  
	                        else  
	                            classes.push(value);  
	                    }),  
	                      
	                    contains: function(value) {  
	                        return !!~self.className.split(/\s+/g).indexOf(value);  
	                    },  
	                      
	                    item: function(i) {  
	                        return self.className.split(/\s+/g)[i] || null;  
	                    }  
	                };  
	            }  
	        });  
	    }  
	}
	
	//ie9支持classList
	supportClassList();
	
	//通过类名获取dom元素
	var tbody = getClass("ul","tbody"),        //列表集合
		check = getClass("input","check"),     //选择框集合
		checkonly = getClass("input","radio"), //单选框集合
		price = getClass("li","price"),        //单价
	    count = getClass("input","count"),     //数量
		total = getClass("li","total-price"),  //总价
		arrow = getClass("span","arrow-icon"), //箭头图标
		goods = getClass("li","goods"),        //商品列表
		delAll = getClass("a","del-all")[0],   //删除所有
	    selectedCount = getClass("span","selectedTotal")[0], //全选框
	    totalprice = getClass("span","priceTotal")[0],      //合计
	    seleted = getClass("div","selected")[0],             //已选商品
	    seleted_view = getClass("div","selected-view")[0];   //已选商品视图

	var i,num = 0; 
	
	//删除节点
	function removeNode(pNode){
		pNode.parentNode.removeChild(pNode);
	}
	
	//刷新结算信息
	function caculate_total(){
		var sum = 0;
		goodsNum = 0;
		while(seleted_view.firstChild){
			seleted_view.removeChild(seleted_view.firstChild);
		}
		
		for(var k=0; k < checkonly.length; k++){
			if(checkonly[k].checked){
				goodsNum++;
				sum += parseFloat(total[k].innerText);
				var elem = document.createElement("div");
				elem.setAttribute("class","selectedViewList clearfix");
				elem.innerHTML = "<div><img src="+ goods[k].childNodes[0].src +"><span index='"+ k +"'>取消选择</span></div>";
				seleted_view.appendChild(elem);
			}
			total[k].innerText = (parseFloat(price[k].innerText) * parseFloat(count[k].value)).toFixed(2);
		}
		if(num == checkonly.length){
			check[0].checked = true;
			check[check.length-1].checked = true;
		}else{
			check[0].checked = false;
			check[check.length-1].checked = false;
		}	
		selectedCount.innerHTML = goodsNum;	
		totalprice.innerHTML = sum.toFixed(2);
	}
	
	//选择框点击事件
	for(i in check){
		check[i].onclick = function(){
	    	if(this === check[0] || this === check[check.length-1])
	    	{
	    		if(this.checked){
	    			for(var j in check){
	    				check[j].checked = true;
	    			}
	    			num = checkonly.length;
	    		}else{
	    			for(var j in check){
	    				check[j].checked = false;
	    			}
	    			num = 0;
	    		}
	    	}else{
	    		if(this.checked){
	    			num++;
	    		}else{
	    			num--;
	    		}
	    	}
	    	caculate_total();
	    }
	}
	
	//全部删除事件
	delAll.onclick = function(){
		var conf = "";
		if(num == 0){
			conf = confirm("请选择商品！");
		}else{
			conf = confirm("确定删除所选的商品吗？");
		}
		if(conf){
			for(var j=0; j < checkonly.length ;j++){
				if(checkonly[j].checked){
					removeNode(checkonly[j].parentNode.parentNode);
					j--;
					num--;
					caculate_total();
				}
			}
		}
	}
	
	//已选商品点击事件
	seleted.onclick = function(){
		if(seleted_view.className !== "selected-view"){
			if(num > 0){
				seleted_view.classList.remove("none");
				arrow[0].classList.remove("none");
			}	
		}else{
			seleted_view.classList.add("none");
			arrow[0].classList.add("none");
		}
		
	}
	
	//列表内点击事件（事件冒泡机制）
	for(i in tbody){
		tbody[i].onclick = function(e){
			e = getTarget(e);
			var count = this.getElementsByTagName("input")[1];
			var reduce = this.getElementsByTagName("span")[1];
			switch(e.className){
				case "delete" :  //删除
				var conf = confirm('确定删除此商品吗？');
	            if (conf) {
	                removeNode(this);
	                if(this.getElementsByTagName("input")[0].checked){
	                	num--;
	                }
	            }
	            break;
	            
	            case "add" :   //+
				count.value++;
				reduce.innerHTML = "-";
	            break;
	            
	            case "reduce" : //-
				if(count.value > 1){
					count.value--;
				}
				if(count.value == 1){
					e.innerHTML = "";
				}
	            break;
	            
	            default: break;
			}
			caculate_total();
		}
	}
    
    //已选商品视图点击事件（事件冒泡机制）
	seleted_view.onclick = function(e){
		e = getTarget(e);
		if(e.innerHTML === "取消选择"){
			removeNode(e.parentNode.parentNode);
			checkonly[e.getAttribute("index")].checked = false;
			num-- ;
			if(!num){
				seleted_view.classList.add("none");
				arrow[0].classList.add("none");
			}
			caculate_total();
		}
	}
	
	//默认全选
	check[0].checked = true;
	check[0].onclick();
}


//通过类名获取对象
function getClass(tagName,ClassName){
	if(document.getElementsByClassName) //支持这个函数
    {        
    	return document.getElementsByClassName(ClassName);
    }else{
    	var obj = document.getElementsByTagName(tagName);
    	var arr =[];
    	var aRes=[];
		for(var i=0; i < obj.length;i++){
			arr = obj[i].className.split(" ");
			for(var j=0; j < arr.length;j++){
				if(arr[j] === ClassName){
					aRes.push(obj[i]);
				}
			}
		}
		return aRes;
    }
};

//事件委托
function getTarget(e){
	e = e || window.event;
	return (e.target || e.srcElement);
}
