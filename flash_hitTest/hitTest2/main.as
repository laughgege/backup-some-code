package {
	import flash.display.*;
	import flash.filters.*;
	import flash.geom.*;
	import flash.text.*;
	
	public class main extends Sprite{
		private var tx:Number, ty:Number;
		private var bmd1:BitmapData, bmd2:BitmapData;
		private var rect:Rectangle, bc1:BitmapData, bc2:BitmapData, bc;
		
		public function main(){
			//让mc1元件有按钮模式, 并去掉mc3的鼠标事件
			mc1.buttonMode = true; 
			mc3.mouseEnabled = false;
			
			//侦听mc1按下，以便拖拽
			mc1.addEventListener("mouseDown", mousedownHandler); 
			
			//让mc2停止在第一帧上，表示没有碰撞
			mc2.gotoAndStop(1); 
			
			//取得mc1的bitmapdata数据
			bmd1 = new BitmapData(mc1.width, mc1.height, true, 0);
			bmd1.draw(mc1, null, null); 
			
			//取得mc2的bitmapdata数据
			bmd2 = new BitmapData(mc2.width, mc2.height, true, 0);
			bmd2.draw(mc2, null, null); 
		}
		
		private function getMaxRect(){ 
			//得到mc1,mc2的组合在一起的矩形，并生成两个相同新的bitmapdata,bc1,bc2，以便稍后相比较
			var bx = (mc1.x > mc2.x) ? mc2.x : mc1.x;
			var by = (mc1.y > mc2.y) ? mc2.y : mc1.y;
			var bw = (mc1.x > mc2.x) ? Math.abs(mc1.x-mc2.x+mc1.width) : Math.abs(mc2.x-mc1.x+mc2.width);
			var bh = (mc1.y > mc2.y) ? Math.abs(mc1.y-mc2.y+mc1.height) : Math.abs(mc2.y-mc1.y+mc2.height);
			
			bc1 = new BitmapData(bw, bh, true, 0);
			bc2 = new BitmapData(bw, bh, true, 0);
		}
		
		private function compareRect(){ 
			//分别在得到的bc1,bc2中用不同的步骤画上mc1,mc2的bitmapdata
			bc1.copyPixels(bmd1, bmd1.rect, new Point(0, 0), null, null, true);
			bc1.copyPixels(bmd2, bmd2.rect, new Point(mc2.x-mc1.x, mc2.y-mc1.y), null, null, true);
			bc2.copyPixels(bmd2, bmd2.rect, new Point(mc2.x-mc1.x, mc2.y-mc1.y), null, null, true);
			bc2.copyPixels(bmd1, bmd1.rect, new Point(0, 0), null, null, true);
			
			//清除之前的bc,并且比较现在的两个大的bitmapdata，得到新的bc
			if(typeof(bc) == "object") bc.dispose();
			bc = bc1.compare(bc2);
			trace(bc);
			
			//画好后，比较bc1,bc2,如果bc1,bc2有不同的RGB 值,将会返回一个新的bitmapdata,否则返回0
			if(typeof(bc) == "object"){
				//显示这个比较后的相交的bitmapdata,如果要显示相交区域，把下面的注释去掉即可。
				var bmp = new Bitmap(bc);
				bmp.x = mc1.x;
				bmp.y = mc1.y;
				this.addChild(bmp);
				
				//得到相交部分的矩形,并用mc3来显示
				/*var r = bc.getColorBoundsRect(0xFFFFFF, 0x000000, false);
				mc3.x = mc1.x + r.x;
				mc3.y = mc1.y + r.y;
				mc3.width = r.width;
				mc3.height = r.height;*/
				
				//txt.text = "有碰撞, 相对于mc1的位置是: x:" + r.x + " y:" + r.y + " width:" + r.width + " height:" + r.height;
			}else{
				//mc3复原
				mc3.x = -35;
				mc3.y = 35;
				mc3.width = mc3.height = 30;
				txt.text = "无碰撞";
			}
		}
		
		private function removeAllBitmapData(){
			bc1.dispose();
			bc2.dispose();
			bc1 = null;
			bc2 = null;
		}
		
		private function mousedownHandler(e){ //tx,ty为鼠标按下时，mc1的坐标相对原点的位置
			tx = e.stageX - mc1.x;
			ty = e.stageY - mc1.y;
			stage.addEventListener("mouseMove", mousemoveHandler);
			stage.addEventListener("mouseUp", mouseupHandler); //侦听stage的鼠标事件，以便拖拽
		}
		
		private function mousemoveHandler(e){
			mc1.x = e.stageX - tx;
			mc1.y = e.stageY - ty;
			getMaxRect(); //得到两个大的bitmapdata
			compareRect(); //比较这两个大的bitmapdata
			removeAllBitmapData(); //移除这两个大的bitmapdata
		}
		
		private function mouseupHandler(e){
			stage.removeEventListener("mouseMove", mousemoveHandler);
			stage.removeEventListener("mouseUp", mouseupHandler); //之前有侦听这两个事件，当松开鼠标时，需要除去这两个事件
		}
		
	}
}