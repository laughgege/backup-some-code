﻿package 
{
	import flash.display.Sprite;
	import flash.display.StageAlign;
	import flash.display.StageScaleMode;
	import flash.events.Event;
	public class Fountain extends Sprite
	{
		private var count:int = 100;
		private var gravity:Number = 0.5;
		private var wind:Number = .1;
		private var balls:Array;
		public function Fountain()
		{
			init();
		}
		private function init():void
		{
			stage.scaleMode = StageScaleMode.NO_SCALE;
			stage.align = StageAlign.TOP_LEFT;
			balls = new Array();
			for (var i:int = 0; i < count; i++)
			{
				var ball:Ball = new Ball(4,Math.random() * 0xffffff);
				ball.x = stage.stageWidth / 2;
				ball.y = stage.stageHeight;
				ball.vx = Math.random() * 2 - 1;
				ball.vy = Math.random() * -10 - 10;
				addChild(ball);
				balls.push(ball);
			}
			addEventListener(Event.ENTER_FRAME, onEnterFrame);
		}
		private function onEnterFrame(event:Event):void
		{
			for (var i:Number = 0; i < balls.length; i++)
			{
				var ball:Ball = Ball(balls[i]);
				ball.vy += gravity;
				ball.vx += wind;
				ball.x+=ball.vx;
				ball.y+=ball.vy;
				if (ball.x-ball.radius>stage.stageWidth||ball.x+ball.radius<0||ball.y-ball.radius>stage.stageHeight||ball.y+ball.radius<0)
				{
					ball.x=stage.stageWidth/2;
					ball.y=stage.stageHeight;
					ball.vx=Math.random()*2-1;
					ball.vy=Math.random()*-10-10;
				}
			}
		}
	}
}

import flash.display.Sprite;
class Ball extends Sprite
{
	public var radius:Number;
	private var color:uint;
	public var vx:Number=0;
	public var vy:Number=0;
	public function Ball(radius:Number=40, color:uint=0xff0000)
	{
		this.radius=radius;
		this.color=color;
		init();
	}
	public function init():void
	{
		graphics.beginFill(color);
		graphics.drawCircle(0, 0, radius);
		graphics.endFill();
	}
}