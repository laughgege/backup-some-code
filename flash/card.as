package 
{
	import flash.display.*;
	import flash.events.MouseEvent;
	import flash.events.Event;
	import flash.text.TextField;
	import flash.net.URLRequest;
	import flash.text.TextFormat;
	import flash.text.AntiAliasType;
	import flash.utils.Timer;
	import flash.geom.Rectangle;
	public class card extends Sprite
	{
		public var shaw:Sprite;
		private var head:Bitmap;
		private var _loader:Loader;
		private var _timer:Timer;
		private var bg_temp:Object;
		private var X:int,Y:int;
		private var tx:Number = 0,ty:Number = 0;
		private var speedX:Number = 0,speedY:Number = 0;
		private var speedR:Number = 0;

		private var last_x:Number,last_y:Number,last_r:Number;
		private var $status:String = "normal";
		private var f:Number = 0.05;
		private var index:int = 0;

		const W:int = 222;
		const H:int = 86;

		public function card(x:int,y:int,rot:int,info:XML)
		{
			this.alpha = 0;
			this.rotationZ = rot;
			this.x = X = x;
			this.y = Y = y;
			this.buttonMode = true;
			this.mouseChildren = false;

			createShadow();
			createBackground(info.title);
			bg_temp = new Roller(this);

			loadHead(info.img);
			addEventListener(MouseEvent.MOUSE_DOWN,handleMouseDown);
		}
		private function handleMouseUp(evt:MouseEvent):void
		{
			var bound:Rectangle = this.getBounds(stage);
			var c_x:Number = bound.x + bound.width/2,
			c_y:Number = bound.y + bound.height/2;
			bg_temp.setCenter(c_x,c_y,true);
			$status = "mouseup";
			stage.removeEventListener(MouseEvent.MOUSE_UP,handleMouseUp);
			bound = null;
		}
		private function handleMouseDown(evt:MouseEvent):void
		{
			tx = stage.mouseX;
			ty = stage.mouseY;
			last_x = this.x;
			last_y = this.y;
			bg_temp.setCenter(tx,ty,true);
			speedX = speedY = speedR = 0;
			$status = "mousemove";
			stage.addEventListener(MouseEvent.MOUSE_UP,handleMouseUp);
			addEventListener(Event.ENTER_FRAME,handleCardEnter);
			
			parent.setChildIndex(shaw,parent.numChildren-1);
			parent.setChildIndex(this,parent.numChildren-1);
		}
		private function handleCardEnter(evt:Event):void
		{
			index++;
			var m_x:Number = stage.mouseX,m_y:Number = stage.mouseY;
			var bound:Rectangle = this.getBounds(stage);
			var c_x:Number = bound.x + bound.width/2,
			c_y:Number = bound.y + bound.height/2;
			var fix_x:Number = this.x - bound.x,
			fix_y:Number = this.y - bound.y;

			var lenA2:Number = Math.pow(tx - c_x,2) + Math.pow(ty - c_y,2),
			lenB2:Number = Math.pow(m_x - c_x,2) + Math.pow(m_y - c_y,2),
			lenC2:Number = Math.pow(m_x - tx,2) + Math.pow(m_y - ty,2);

			switch ($status)
			{
				case "normal" :
					if (hasEventListener(Event.ENTER_FRAME))
					{
						removeEventListener(Event.ENTER_FRAME,handleCardEnter);
					}
					break;

				case "mousemove" :
					bg_temp.setCenter(m_x,m_y);

					speedX = (m_x - tx)*stage.frameRate;
					speedY = (m_y - ty)*stage.frameRate;

					var speed:Number = Math.acos((lenA2+lenB2-lenC2)/(Math.sqrt(lenA2*lenB2)*2))*180/Math.PI;

					if ((m_y - c_y)/(m_x - c_x) < (ty - c_y)/(tx - c_x))
					{
						speed =  -  speed;
					}

					tx = m_x;
					ty = m_y;


					f = (speed*speedR >= 0) ? 0.05 : 0.02;
					speedR += (speed - speedR)*f;

					if (Math.abs(speedR)<f)
					{
						speedR=0;
					}
					bg_temp.rotate(speedR*Math.sqrt(lenA2)/20);
					
					shaw.x = last_x;
					shaw.y = last_y;
					shaw.rotation = last_r;
					
					if (! Boolean(index%1))
					{
						last_x=this.x;
						last_y=this.y;
						last_r=this.rotation;
					}
					break;

				case "mouseup" :
					this.x+=speedX/stage.frameRate;
					this.y+=speedY/stage.frameRate;

					speedR-=speedR*.1;

					if (Math.abs(speedR)<f)
					{
						speedR=0;
					}

					speedX*=0.95;
					speedY*=0.95;
					if (Math.abs(speedX)<1&&Math.abs(speedY)<1&&Math.abs(speedR)<f)
					{
						$status="normal";
						speedX=speedY=speedR=0;
					}

					if (c_x<0)
					{
						if (speedX<0)
						{
							speedX=- speedX;
						}
						this.x=Math.ceil(fix_x-bound.width/2);
					}
					else if (c_x > stage.stageWidth)
					{
						if (speedX>0)
						{
							speedX=- speedX;
						}
						this.x=Math.floor(stage.stageWidth+fix_x-bound.width/2);
					}

					if (c_y<0)
					{
						if (speedY<0)
						{
							speedY=- speedY;
						}
						this.y=Math.ceil(fix_y-bound.height/2);
					}
					else if (c_y > stage.stageHeight)
					{
						if (speedY>0)
						{
							speedY=- speedY;
						}
						this.y=Math.floor(stage.stageHeight+fix_y-bound.height/2);
					}
					var _bound:Rectangle=this.getBounds(stage);
					var xxx:Number = _bound.x + _bound.width/2,
						yyy:Number = _bound.y + _bound.height/2;
					bg_temp.setCenter(xxx,yyy,true);
					bg_temp.rotate(speedR*Math.sqrt(lenA2)/20);
					
					shaw.x = last_x;
					shaw.y = last_y;
					shaw.rotation = last_r;
					
					_bound=bound=null;
					if (! Boolean(index%1))
					{
						last_x=this.x;
						last_y=this.y;
						last_r=this.rotation;
					}
					break;

				default :
			}
		}

		private function createShadow():void
		{
			shaw = new Sprite();
			shaw.graphics.beginFill(0x000000,0.5);
			shaw.graphics.drawRect(0,0,W,H);
			shaw.graphics.endFill();
			shaw.x=X;
			shaw.y=Y;
		}
		private function createBackground(txt:String):void
		{
			var _back:BitmapData=new card1(W,H);
			graphics.beginBitmapFill(_back,null,false,true);
			graphics.drawRect(0,0,W,H);
			graphics.endFill();

			var _txt:TextField = new TextField();
			_txt.background=false;
			_txt.selectable=false;
			_txt.x=90;
			_txt.height=50;
			_txt.y=8;
			_txt.styleSheet=main.css;
			_txt.htmlText=txt;


			addChild(_txt);
		}
		private function loadHead(url:String):void
		{
			_loader = new Loader();
			_loader.contentLoaderInfo.addEventListener(Event.COMPLETE,handleLoader);
			_loader.load(new URLRequest(url));
		}
		private function handleLoader(evt:Event):void
		{
			head=new Bitmap(Bitmap(_loader.content).bitmapData,"auto",true);
			head.y=6;
			head.x=6;
			addChild(head);
			_loader=null;
			_timer=new Timer(10);
			_timer.addEventListener("timer",handleTimer);
			_timer.start();
		}
		private function handleTimer(evt:Event):void
		{
			this.alpha+=0.02;
			if (this.alpha>=1)
			{
				this.alpha=1;
				_timer.stop();
				_timer=null;
			}
		}
	}
}