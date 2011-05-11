package{
	public class Browser{
		import flash.external.ExternalInterface;
		public function Browser(){}
		public static function alert(o:Object):void{
			ExternalInterface.call("window.alert", o.toString());
		}
	}
}