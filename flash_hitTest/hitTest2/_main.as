package {
	import flash.display.*;
	import flash.text.*;
	import flash.display.BitmapData;
	import flash.events.MouseEvent;
	import flash.geom.ColorTransform;
	import flash.geom.Rectangle;
	import flash.geom.Matrix;
	public class _main extends Sprite {
		private var bmd1:BitmapData, bmd2:BitmapData;
		public function _main() {
			mc2.gotoAndStop(1);
			mc1.addEventListener(MouseEvent.MOUSE_DOWN,handleMouseDown);
		}
		private function handleMouseDown(evt:MouseEvent):void{
			mc1.startDrag();
			mc1.addEventListener(MouseEvent.MOUSE_MOVE,handleMouseMove);
		}
		private function handleMouseMove(evt:MouseEvent):void{
			trace(hitTestExactly(mc1,mc2));
		}
		public function hitTestExactly(o1:DisplayObject, o2:DisplayObject, p_alphaTolerance:Number = 255):Boolean{
			if(!o1.hitTestObject(o2))
				return false;
		
			// get bounds:
			var bounds1:Object = o1.getBounds(root);
			var bounds2:Object = o2.getBounds(root);
		
			// determine test area boundaries:
			var bounds:Object = {};
			bounds.xMin = Math.max(bounds1.x,bounds2.x);
			bounds.xMax = Math.min(bounds1.x+bounds1.width,bounds2.x+bounds2.width);
			bounds.yMin = Math.max(bounds1.y,bounds2.y);
			bounds.yMax = Math.min(bounds1.y+bounds1.height,bounds2.y+bounds2.height);
			
			if((bounds.xMax < bounds.xMin) || (bounds.yMax < bounds.yMin))
				return false;

			// set up the image to use:
			var img:BitmapData = new BitmapData(bounds.xMax-bounds.xMin,bounds.yMax-bounds.yMin,false);
			
			// draw in the first image:
			var mat:Matrix = o1.transform.matrix;
			mat.tx -= bounds.xMin;
			mat.ty -= bounds.yMin;
			img.draw(o1,mat, new ColorTransform(255,-255,-255,p_alphaTolerance));
		
			// overlay the second image:
			mat = o2.transform.matrix;
			mat.tx -= bounds.xMin;
			mat.ty -= bounds.yMin;
			img.draw(o2,mat, new ColorTransform(255,255,255,p_alphaTolerance),"difference");
		
			// find the intersection:
			var intersection:Rectangle = img.getColorBoundsRect(0xFFFFFFFF,0xFF00FFFF);
		
			// if there is no intersection, return null:
			if (intersection.width == 0) { return false; }
		
			// adjust the intersection to account for the bounds:
			intersection.x += bounds.xMin;
			intersection.y += bounds.yMin;
			
			return true;
		}
	}	
}