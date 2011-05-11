package 
{
  import flash.display.DisplayObject;
  public class Roller
  {
    private var box:DisplayObject;
    private var __x:Number;
    private var __y:Number;
    public function Roller(tgt:DisplayObject)
    {
      box = tgt;
    }
    public function setCenter(_x_:Number,_y_:Number,first:Boolean = false):void
    {
      if(!first){
        box.x += (_x_ - __x);
        box.y += (_y_ - __y);
      }
		__x = _x_;
		__y = _y_;
    }
    public function rotate(dig:Number):void
    {
      var ox:Number = box.x, oy:Number = box.y,r:Number = box.rotation,
      c:Number = Math.sqrt(Math.pow((ox - __x),2) + Math.pow((oy - __y),2)),
      a:Number = Math.sin(dig*Math.PI/360)*c,
      sm:Number = Math.atan((oy - __y)/(ox - __x))*180/Math.PI || 0;

      if (oy >= __y && ox >= __x || oy < __y && ox >= __x)
      {
        sm += 180;
      }

      var ke:Number = (90 - dig/2) - sm;


      box.rotationZ+=dig;
      box.x += (2*a * Math.cos(ke*Math.PI/180));
      box.y -= (2*a * Math.sin(ke*Math.PI/180));
    }
  }
}