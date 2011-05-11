﻿/**
* GTween by Grant Skinner. Aug 1, 2005
* Visit www.gskinner.com/blog for documentation, updates and more free code.
*
*
* Copyright (c) 2005 Grant Skinner
* 
* Permission is hereby granted, free of charge, to any person
* obtaining a copy of this software and associated documentation
* files (the "Software"), to deal in the Software without
* restriction, including without limitation the rights to use,
* copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the
* Software is furnished to do so, subject to the following
* conditions:
* 
* The above copyright notice and this permission notice shall be
* included in all copies or substantial portions of the Software.
* 
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
* EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
* OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
* NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
* HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
* WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
* FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
* OTHER DEALINGS IN THE SOFTWARE.
**/


import flash.display.BitmapData;
import flash.geom.ColorTransform;
import flash.geom.Matrix;
import flash.geom.Rectangle;

class com.gskinner.sprites.CollisionDetection {
	static public function checkForCollision(p_clip1:MovieClip,p_clip2:MovieClip,p_alphaTolerance:Number):Rectangle {
		// set up default params:
		if (p_alphaTolerance == undefined) { p_alphaTolerance = 255; }
		
		// get bounds:
		var bounds1:Object = p_clip1.getBounds(_root);
		var bounds2:Object = p_clip2.getBounds(_root);
		
		// rule out anything that we know can't collide:
		if (((bounds1.xMax < bounds2.xMin) || (bounds2.xMax < bounds1.xMin)) || ((bounds1.yMax < bounds2.yMin) || (bounds2.yMax < bounds1.yMin)) ) {
			return null;
		}
		
		// determine test area boundaries:
		var bounds:Object = {};
		bounds.xMin = Math.max(bounds1.xMin,bounds2.xMin);
		bounds.xMax = Math.min(bounds1.xMax,bounds2.xMax);
		bounds.yMin = Math.max(bounds1.yMin,bounds2.yMin);
		bounds.yMax = Math.min(bounds1.yMax,bounds2.yMax);
		
		// set up the image to use:
		var img:BitmapData = new BitmapData(bounds.xMax-bounds.xMin,bounds.yMax-bounds.yMin,false);
		
		// draw in the first image:
		var mat:Matrix = p_clip1.transform.concatenatedMatrix;
		mat.tx -= bounds.xMin;
		mat.ty -= bounds.yMin;
		img.draw(p_clip1,mat, new ColorTransform(1,1,1,1,255,-255,-255,p_alphaTolerance));
		
		// overlay the second image:
		mat = p_clip2.transform.concatenatedMatrix;
		mat.tx -= bounds.xMin;
		mat.ty -= bounds.yMin;
		img.draw(p_clip2,mat, new ColorTransform(1,1,1,1,255,255,255,p_alphaTolerance),"difference");
		
		// find the intersection:
		var intersection:Rectangle = img.getColorBoundsRect(0xFFFFFFFF,0xFF00FFFF);
		
		// if there is no intersection, return null:
		if (intersection.width == 0) { return null; }
		
		// adjust the intersection to account for the bounds:
		intersection.x += bounds.xMin;
		intersection.y += bounds.yMin;
		
		return intersection;
	}
	
	
}