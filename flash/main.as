package {
	import flash.display.*;
	import flash.display.BitmapData;
	import flash.events.Event;
	import flash.text.StyleSheet;
	import flash.net.URLLoader;
	import flash.net.URLRequest;
	import flash.events.MouseEvent;
	public class main extends Sprite {
		private var bg:BitmapData=new _background(290,730);
		private var _cup:Bitmap = new Bitmap(new cup(600,300));
		private var xml:XML;
		private var cardList:Array = [];
		public static var css:StyleSheet;
		public function main() {
			
			stage.scaleMode=StageScaleMode.NO_SCALE;
			stage.align=StageAlign.TOP_LEFT;
			stage.addEventListener(Event.RESIZE,stageResize);
			
			createCss();
			stageResize();
			
			addChild(_cup);
			
			tuzhi.gotoAndStop(1);
			initData("data.xml");
		}
		private function initData(url:String):void{
			var loader:URLLoader = new URLLoader();
			loader.addEventListener(Event.COMPLETE,handleComplete);
			loader.load(new URLRequest(url));
		}
		private function handleComplete(evt:Event):void{
			xml = new XML(evt.target.data);
			for(var i:int = 0, l = xml.card.length();i<l;i++){
				drawCards(xml.card[i]);
			}
		}
		private function createCss():void{
			main.css = new StyleSheet();
			var _title:Object = {
				color:"#744818",
				textAlign:"left",
				fontSize:14,
				display:"block",
				fontFamily:"Arial,Verdana,Helvetica",
				fontWeight:"bold"
			};
			main.css.setStyle("h3",_title);
		}
		private function stageResize(evt:Event=null):void {
			graphics.beginBitmapFill(bg);
			graphics.drawRect(0,0,stage.stageWidth,stage.stageHeight);
			graphics.endFill();
			
			_cup.x = stage.stageWidth - _cup.width;
		}
		private function drawCards(_xml:XML):void {
			var _card:card = new card(Math.random()*500,Math.random()*500,0,_xml);
			addChild(_card.shaw);
			addChild(_card)
			cardList.push(_card);
		}
	}
}