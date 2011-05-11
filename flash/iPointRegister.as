package
{
	import flash.display.DisplayObject;
	import flash.geom.Point;
	import flash.utils.Dictionary;

	public class iPointRegister 
	{
		static private var _target:Dictionary;
		public function iPointRegister() 
		{
			
		}
		static public function register(target:DisplayObject, __x:int, __y:int):void
		{
			if (!_target)_target = new Dictionary();
			_target[target] = { };
			var s:Object = _target[target];
			s["x"] = __x;
			s["y"] = __y;
			s["r"] = Point.distance(new Point(target.x, target.y), new Point(s["x"], s["y"]));
			s["d"] = Math.asin(Math.abs(s["y"] - target.y)/s["r"])/(Math.PI / 180);
			if (s["x"] > target.x && s["y"] < target.y)
			{
				s["d"] = 180 - s["d"];
			}else if (s["x"] > target.x && s["y"] > target.y)
			{
				s["d"] += 180;
			}else if (s["x"] < target.x && s["y"] > target.y)
			{
				s["d"] = 360 - s["d"];
			}
		}
		
		static public function unregister(target:DisplayObject):void
		{
			if (!_target) return;
			if (!_target[target]) return;
			_target[target] = null;
		}
		
		static public function rotate(target:DisplayObject,rotation:Number):void
		{
			if (!_target) return;
			if (!_target[target]) return;
			var s:Object = _target[target];
			var r:Number = rotation - target.rotation;
			target.rotationZ = rotation;
			s["d"] += r;
			target.x = s["x"] + s["r"] * Math.cos((s["d"]) * Math.PI / 180);
			target.y = s["y"] + s["r"] * Math.sin((s["d"]) * Math.PI / 180);
		}
	}
	
}