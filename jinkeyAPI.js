(function(w, undefined){
	var ver = "24 Challenge version 2014 Winter",

	_jinkey = window.jinkeyAPI,
	document = window.document,
	location = window.location,
	_prevent = true;

	//start by using a selector
	jinkeyAPI = function(selector){
		return new jinkeyAPI.pr.init(selector);

	};

	var debug = {
			active: true,
			calls: 0,
			calledBySelector: 0
	};



	jinkeyAPI.pr = jinkeyAPI.prototype  = {
		jinkey: ver,
		constructor: jinkeyAPI,
		selector: "",

		init: function(selector){
			if(!selector) return this;
			this.selector = selector;

			if(debug.active){ debug.calledBySelector++}

		},

		prevent: function(a){
			if(a){_prevent = true}else{_prevent = false};
		}


	}; // prototype end
	jinkeyAPI.pr.init.prototype = jinkeyAPI.pr;



	jinkeyAPI.input = jinkeyAPI.prototype;
	keysPressed = {},
	jinkeyAPI.input.isDown = function(e){
		if(keysPressed[this.selector]){
			return e();
		}
	}
	jinkeyAPI.input.isUp = function(e){
		if(!keysPressed[this.selector]){
			return e();
		}
	}

	jinkeyAPI.keys = {
		BACKSPACE: 8, TAB: 9, SPACE: 32, LEFT: 37, RIGHT: 39, 
		DOWN: 40, UP: 38, ENTER: 13, SHIFT: 16, CONTROL: 17, 
		ALT: 18, PAUSE: 19, ESCAPE: 27, PAGEUP: 33, PAGEDOWN: 34, 
		END: 35, HOME: 36, INSERT: 45, K_0: 48, K_1: 49, K_2: 50, 
		K_3: 51, K_4: 52, K_5: 53, K_6: 54, K_7: 55, K_8: 56, 
		K_9: 57,A: 65, B: 66, C: 67, D: 68, E: 69, F: 70, G: 71,
		H: 72, I: 73, J: 74, K: 75, L: 76, M: 77, N: 78, O: 79, 
		P: 80, Q: 81, R: 82, S: 83, T: 84, U: 85, V: 86, W: 87, 
		MOD_WIN: 91, MENU: 93, KP_0: 96, KP_1: 97, KP_2: 98, KP_3: 99,
		KP_4: 100, KP_5: 101, KP_6: 102, KP_7: 103, KP_8: 104, KP_9: 105,
		KP_MULTIPLY: 106, KP_PLUS: 107, KP_MINUS: 109, KP_DECIMAL: 110,
		SLASH: 111,  /* / */ DECIMAL: 188, /* , */ PERIOD: 190, /* . */ 
		F1: 112, F2: 113, F3: 114, F4: 115, F5: 116, F6: 117, F7: 118,
		F8: 119, F9: 120, F10: 121, F11: 122, F12: 123, CAPS_LOCK: 20,
		NUM_LOCK: 144, SCROLL_LOCK: 145, LEFT_BRACKET: 219, BACKSLASH: 220, /* \ */ 
		RIGHT_BRACKET: 221 /* ] */
	},

	jinkeyAPI.input.mouse = {xcoord: 0,ycoord:0};

	jinkeyAPI.input.listen = function(){
		document.addEventListener("keydown", function(e){
			e.preventDefault();
			keysPressed[e.keyCode] = true;
		});
		
		document.addEventListener("keyup", function(e){
			e.preventDefault();
			keysPressed[e.keyCode] = false;
		});
		
		document.addEventListener("blur", function(e){
			keysPressed = {};
		});

		window.addEventListener('mousemove', function(e){
			e.preventDefault();
			jinkeyAPI.input.mouse.xcoord = e.clientX;
			jinkeyAPI.input.mouse.ycoord = e.clienty;
		});
		return "listening";
	};



	jinkeyAPI.CartesianCoord = function(x,y,z){
		this.xcoord = x;
		this.ycoord = y;
		this.zcoord = z;
	};
	jinkeyAPI.CartesianCoord.prototype = {
		constructor: jinkeyAPI.CartesianCoord,
		set: function(x,y,z){
			this.xcoord = x;
			this.ycoord = y;
			this.zcoord = z;
		},
		add: function( cartesian ){
			this.xcoord += cartesian.xcoord;
			this.ycoord += cartesian.ycoord;
			this.zcoord += cartesian.zcoord;
		},
		sub: function( cartesian ){
			this.xcoord -= cartesian.xcoord;
			this.ycoord -= cartesian.ycoord;
			this.zcoord -= cartesian.zcoord;
		},
		divide: function( cartesian ){
			this.xcoord /= cartesian.xcoord;
			this.ycoord /= cartesian.ycoord;
			this.zcoord /= cartesian.zcoord;
		},
		multiply: function( cartesian ){
			this.xcoord *= cartesian.xcoord;
			this.ycoord *= cartesian.ycoord;
			this.zcoord *= cartesian.zcoord;
		},
		shiftByCartesian: function( cartesian ){
			this.xcoord &= cartesian.xcoord;
			this.ycoord &= cartesian.ycoord;
			this.zcoord &= cartesian.zcoord;
		}
	};



	jinkeyAPI.Stage = function(){
		this.entityList = [];
		this.lightingList = [];
		this.userObjectList = [];

	};
	jinkeyAPI.Stage.prototype = {
		insertEntity: function(d){
			this.entityList.push(d);
		},
		destroyEntity: function(d){
			var i = this.entityList.indexOf(d);
			if(i !== -1){
				this.entityList.splice(i,1);
			}
			return this;
		},
		insertLight: function(d){
			this.lightingList.push(d);
		},
		destroyLight: function(d){
			var i = this.lightingList.indexOf(d);
			if(i !== -1){
				this.lightingList.splice(i,1);
			}
			return this;
		}

	};


	jinkeyAPI.Display = function(){
		this.dpi = 1;
		this.fullscreen = false;
		
		Object.defineProperties(this,{
			resolution: {
				writable: false,
				value: new Resolution()
			}
		});
		
		function Resolution(height, width){
			this.__height = height || 600;
			this.__width = width || 800;
			return this;
		}
	
	};
	jinkeyAPI.Display.prototype = {
		prototype: jinkeyAPI.Display,
		setResolution: function(width, height, isFullScreen){
			var r = this.resolution;
			r.__height = this.height = height || 600;
			r.__width = this.width = width || 800;
			this.fullscreen = (isFullScreen === undefined) ? false : isFullScreen;
			return this;
		}
	};

	jinkeyAPI.Blitter = function(){

		var _canvas = document.createElement("canvas"),
			_context = _canvas.getContext("2d"),
			_canvasW = _canvas.width,
			_canvasH = _canvas.height,

			_pixelbase,

			_zBuffer = new Array(_canvasH*_canvasW),

			_device = new jinkeyAPI.Display(),



		 	_eol;

		 _canvas.id = "ahoy";
		document.body.appendChild(_canvas);
		window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame || (function(f){window.setTimeout(f, 0);});


		this.blit = function(cam,level){

			var _entities = level.entityList;

			for(var i=0,j=_entities.length;i<j;i++){
				var _entity = _entities[i];

				if(_entity.isVisible === false) continue;

				if(_entity instanceof jinkeyAPI.game.Entity){

						var data = jinkeyAPI(_entity.sprite.url).getData();
					
						blitImage(data,100,100,0,50,50);

				}

				blitPixel(100,100,0);

			}



			// set backbuffer to front buffer
			 _context.putImageData(_pixelbase, 0, 0);

		};

		this.refresh = function(){
			//TULEE AINA EKANA ENNE BLIT
			//_context.clearRect(0,0,_canvasW, _canvasH);
			_pixelbase  = _context.getImageData(0,0,_canvasW, _canvasH);

			// Refresh Z-Buffer
			for(eof=0;eof<_zBuffer.length;eof++){
					_zBuffer[eof] = 100000;
				}
		};
		function coordClipping(x,y){
			//check clipping issue with the viewport;
			if(x >=0 && y >=0 && x < _canvasW && y < _canvasH ) return true;
			return false;
		}

		function blitPixel(x,y,z){
			// blit a pixel on canvas
			var ind, pxldta,
				_x = x >> 0,_y = y >> 0;
			if(coordClipping(x,y)){
				ind = (_x + _y * _canvasW) * 4;

			// check if our pixel is behind another drawn pixel.
				if(_zBuffer[ind] < z) return;
				pxldta = _pixelbase.data;
				pxldta[ind] = 255;
				pxldta[ind+1] = 255;
				pxldta[ind+2] = 255;
				pxldta[ind+3] = 255;


			}	// if end
		} // blitPixel end

		function blitImage(obj,x,y,z,sizea,sizeb){
			var ind,data,
				_x = x >> 0,_y = y >> 0;
			ind = (_x + _y * _canvasW)*4;
			pxldta = _pixelbase.data;
			objdta = obj[2];
			for(var i=0,j=objdta.length;i<j;i+=4,ind+=4){

				pxldta[ind] = 	objdta[i];
					pxldta[ind+1] = objdta[i+1];
					pxldta[ind+2] = objdta[i+2];
					pxldta[ind+3] = objdta[i+3];
	
				

				
	
			}

			
		}
	} // Blitter end

	jinkeyAPI.loader = jinkeyAPI.prototype;

	jinkeyAPI.resources = {
		cache: {},
		pixelCache: {},
		callback: [],
		loading: []

	}

	jinkeyAPI.loader.loadResource = function(){

		if(this.selector instanceof Array){
				this.selector.forEach(function(_url){
					jinkeyAPI.loader.__load__(_url);
				});
			}else{ jinkeyAPI.loader.__load__(this.selector)}
	}

	jinkeyAPI.loader.__load__ = function(url){
		if(jinkeyAPI.resources.cache[url]){
				return jinkeyAPI.resources.cache[url];
			}else{
				var img = new Image();
				img.src = url;
				var context = document.createElement('canvas').getContext('2d');
				context.drawImage(img, 0, 0);
				data = context.getImageData(0, 0, 100, 100).data;

				jinkeyAPI.resources.pixelCache[url] = [img.width,img.height,data];


				img.onload = function(){

					jinkeyAPI.resources.cache[url] = img;

					if(jinkeyAPI.loader.finished()){

						jinkeyAPI.resources.callback.forEach(function(func){ func(); });
					}


				};
				jinkeyAPI.resources.cache[url] = false;
				
			}
	}
	jinkeyAPI.loader.get = function(){
		return jinkeyAPI.resources.cache[this.selector];
	}
	jinkeyAPI.loader.getData = function(){
		return jinkeyAPI.resources.pixelCache[this.selector];
	}
	jinkeyAPI.loader.finished = function(){
		var ready = true;
			for(var k in jinkeyAPI.resources.cache){
				if(jinkeyAPI.resources.cache.hasOwnProperty(k) && !jinkeyAPI.resources.cache[k]){ready = false;}
			}
			return ready;
	}
	jinkeyAPI.loader.complete = function(func){
		jinkeyAPI.resources.callback.push(func);
	}

	jinkeyAPI.game = {};

	

	jinkeyAPI.game.Sprite = function(url,pos,size,speed,frames,dir,once){
		this.pos = pos || new jinkey.CartesianCoord(0,0,0);
		this.size = size;
		this.speed = typeof speed === 'number' ? speed : 0;
		this.frames = frames;
		this._index = 0;
		this.url = url;
		this.dir = dir || 'horizontal';
		this.animateOnce = once;
	}

	jinkeyAPI.game.Sprite.prototype = {
		update: function(dt){
			this._index += this.speed*dt;
		},
		render: function(ct){
			var frame;

			if(this.speed > 0){
				var max = this.frames.length;
				var idx = this._index >> 0;
				frame = this.frames[idx % max];

				if(this.animateOnce && idx >= max){
					this.done = true;
					return;
				}
			}else {
				frame = 0;
			}

			var x = this.pos.xcoord >> 0;
			var y = this.pos.ycoord >> 0;

			if(this.dir == 'vertical'){
				y += frame * this.size.ycoord;
			}else {
				x += frame * this.size.xcoord;
			}

			ct.drawImage(jinkeyAPI(this.url).get(),
				x,y,
				this.size.xcoord,this.size.ycoord,
				0,0,
				this.size.xcoord,this.size.ycoord);
		}
	}


	jinkeyAPI.game.collision = function(a,b,c,d,e,f,g,h){
		return !(c <= e || a > g || d <= f || b > h);
	}
	jinkeyAPI.game.boxCollision =  function(posa,sizea,posb,sizeb){
		return jinkeyAPI.game.collision(posa.xcoord, posa.ycoord,
										posa.xcoord + sizea.xcoord, posa.ycoord+sizea.ycoord,
										posb.xcoord, posb.ycoord,
										posb.xcoord+sizeb.xcoord, posb.ycoord+sizeb.ycoord);
	}

	jinkeyAPI.game.Entity = function(pos, sprite,visible){
		this.pos = pos;
		this.sprite = sprite;
		this.isVisible = visible || true;
	}
	jinkeyAPI.game.Entity.prototype = {
		constructor: jinkeyAPI.game.Entity
	}

	jinkeyAPI.game.loop = function(e){
		function loop(){
			e(); // temp;
			requestAnimationFrame(loop);

		}
		requestAnimationFrame(loop);

	}



})(this);