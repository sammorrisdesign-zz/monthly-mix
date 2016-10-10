(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.Phonograph = global.Phonograph || {})));
}(this, function (exports) { 'use strict';

	var Loader;

	if ( window.fetch ) {
		Loader = (function () {
			function FetchLoader ( url ) {
				this.url = url;
				this._cancelled = false;
			}

			FetchLoader.prototype.cancel = function cancel () {
				this._cancelled = true;
			};

			FetchLoader.prototype.load = function load (ref) {
				var this$1 = this;
				var onprogress = ref.onprogress;
				var ondata = ref.ondata;
				var onload = ref.onload;
				var onerror = ref.onerror;

				this._cancelled = false;

				fetch( this.url ).then( function (response) {
					if ( this$1._cancelled ) return;

					if ( !response.ok ) {
						onerror( new Error( ("Bad response (" + (response.status) + " â€“ " + (response.statusText) + ")") ) );
						return;
					}

					var total = +response.headers.get( 'content-length' ) || 0;

					var length = 0;
					onprogress( ( total ? length : 0 ) / total, length, total );

					if ( response.body ) {
						var reader = response.body.getReader();

						var read = function () {
							if ( this$1._cancelled ) return;

							reader.read().then( function (chunk) {
								if ( this$1._cancelled ) return;

								if ( chunk.done ) {
									onprogress( 1, length, length );
									onload();
								} else {
									length += chunk.value.length;
									ondata( chunk.value );
									onprogress( ( total ? length : 0 ) / total, length, total );

									read();
								}
							}).catch( onerror );
						};

						read();
					}

					else {
						// Firefox doesn't yet implement streaming
						response.arrayBuffer().then( function (arrayBuffer) {
							if ( this$1._cancelled ) return;

							var uint8Array = new Uint8Array( arrayBuffer );

							ondata( uint8Array );
							onprogress( 1, uint8Array.length, uint8Array.length );
							onload();
						}).catch( onerror );
					}
				}).catch( onerror );
			};

			return FetchLoader;
		}());
	} else {
		Loader = (function () {
			function XhrLoader ( url ) {
				this.url = url;

				this._cancelled = false;
				this._xhr = null;
			}

			XhrLoader.prototype.cancel = function cancel () {
				if ( this._cancelled ) return;

				this._cancelled = true;

				if ( this._xhr ) {
					this._xhr.abort();
					this._xhr = null;
				}
			};

			XhrLoader.prototype.load = function load (ref) {
				var this$1 = this;
				var onprogress = ref.onprogress;
				var ondata = ref.ondata;
				var onload = ref.onload;
				var onerror = ref.onerror;

				this._cancelled = false;

				var xhr = new XMLHttpRequest();
				xhr.responseType = 'arraybuffer';

				xhr.onerror = onerror;

				xhr.onload = function (e) {
					if ( this$1._cancelled ) return;

					onprogress( e.loaded / e.total, e.loaded, e.total );
					ondata( new Uint8Array( xhr.response ) );
					onload();

					this$1._xhr = null;
				};

				xhr.onprogress = function (e) {
					if ( this$1._cancelled ) return;

					onprogress( e.loaded / e.total, e.loaded, e.total );
				};

				xhr.open( 'GET', this.url );
				xhr.send();

				this._xhr = xhr;
			};

			return XhrLoader;
		}());
	}

	var Loader$1 = Loader;

	function slice ( view, start, end ) {
		if ( view.slice ) {
			return view.slice( start, end );
		}

		var clone = new view.constructor( end - start );
		var p = 0;

		for ( var i = start; i < end; i += 1 ) {
			clone[p++] = view[i];
		}

		return clone;
	}

	// http://www.mp3-tech.org/programmer/frame_header.html
	// frame header starts with 'frame sync' â€“ eleven 1s
	function isFrameHeader ( data, i, metadata ) {
		if ( data[ i + 0 ] !== 255 || ( data[ i + 1 ] & 240 ) !== 240 ) return false;

		var isHeader = (
			( ( data[ i + 1 ] & 6 ) !== 0 ) &&
			( ( data[ i + 2 ] & 240 ) !== 240 ) &&
			( ( data[ i + 2 ] & 12 ) !== 12 ) &&
			( ( data[ i + 3 ] & 3 ) !== 2 ) &&


			( ( data[ i + 1 ] & 8 ) === metadata.mpegVersion ) &&
			( ( data[ i + 1 ] & 6 ) === metadata.mpegLayer ) &&
			( ( data[ i + 2 ] & 12 ) === metadata.sampleRate ) &&
			( ( data[ i + 3 ] & 192 ) === metadata.channelMode )
		);

		return isHeader;
	}

	// http://mpgedit.org/mpgedit/mpeg_format/mpeghdr.htm
	var bitrateLookup = {
		11: [ null, 32, 64, 96, 128, 160, 192, 224, 256, 288, 320, 352, 384, 416, 448 ],
		12: [ null, 32, 48, 56,  64,  80,  96, 112, 128, 160, 192, 224, 256, 320, 384 ],
		13: [ null, 32, 40, 48,  56,  64,  80,  96, 112, 128, 160, 192, 224, 256, 320 ],
		21: [ null, 32, 48, 56,  64,  80,  96, 112, 128, 144, 160, 176, 192, 224, 256 ],
		22: [ null,  8, 16, 24,  32,  40,  48,  56,  64,  80,  96, 112, 128, 144, 160 ]
	};

	bitrateLookup[ 23 ] = bitrateLookup[ 22 ];

	function getFrameLength ( data, i, metadata ) {
		var mpegVersion = metadata.mpegVersion;
		var mpegLayer = metadata.mpegLayer;
		var sampleRate = metadata.sampleRate;

		var bitrateCode = ( data[ i + 2 ] & 240 ) >> 4;
		var bitrate = bitrateLookup[ ("" + mpegVersion + mpegLayer) ][ bitrateCode ] * 1e3;
		var padding = ( data[2] & 2 ) >> 1;

		var length = ~~( mpegLayer === 1 ?
			( 12 * bitrate / sampleRate + padding ) * 4 :
			( 144 * bitrate / sampleRate + padding )
		);

		return length;
	}

	var Chunk = function Chunk (ref) {
		var this$1 = this;
		var clip = ref.clip;
		var raw = ref.raw;
		var onready = ref.onready;
		var onerror = ref.onerror;

		this.clip = clip;
		this.context = clip.context;

		this.raw = raw;
		this.extended = null;

		this.duration = null;
		this.ready = false;

		this._attached = false;
		this._callback = onready;

		this._firstByte = 0;

		var decode = function ( callback, errback ) {
			var buffer = ( this$1._firstByte ? slice( raw, this$1._firstByte, raw.length ) : raw ).buffer;

			this$1.context.decodeAudioData( buffer, callback, function (err) {
				if ( err ) return errback( err );

				this$1._firstByte += 1;

				// filthy hack taken from http://stackoverflow.com/questions/10365335/decodeaudiodata-returning-a-null-error
				// Thanks Safari developers, you absolute numpties
				for ( ; this$1._firstByte < raw.length - 1; this$1._firstByte += 1 ) {
					if ( isFrameHeader( raw, this$1._firstByte, clip._referenceHeader ) ) {
						return decode( callback, errback );
					}
				}

				errback( new Error( "Could not decode audio buffer" ) );
			});
		};

		decode( function () {
			var numFrames = 0;

			for ( var i = this$1._firstByte; i < this$1.raw.length; i += 1 ) {
				if ( isFrameHeader( this$1.raw, i, clip._referenceHeader ) ) {
					numFrames += 1;

					var frameLength = getFrameLength( this$1.raw, i, clip.metadata );
					i += frameLength - Math.min( frameLength, 4 );
				}
			}

			this$1.duration = ( numFrames * 1152 / clip.metadata.sampleRate );
			this$1._ready();
		}, onerror );
	};

	Chunk.prototype.attach = function attach ( nextChunk ) {
		this.next = nextChunk;
		this._attached = true;

		this._ready();
	};

	Chunk.prototype.createSource = function createSource ( timeOffset, callback, errback ) {
			var this$1 = this;

		if ( !this.ready ) {
			throw new Error( 'Something went wrong! Chunk was not ready in time for playback' );
		}

		this.context.decodeAudioData( this.extended.buffer, function (decoded) {
			if ( timeOffset ) {
				var sampleOffset = ~~( timeOffset * decoded.sampleRate );
				var numChannels = decoded.numberOfChannels;

				var offset = this$1.context.createBuffer( numChannels, decoded.length - sampleOffset, decoded.sampleRate );

				for ( var chan = 0; chan < numChannels; chan += 1 ) {
					var sourceData = decoded.getChannelData( chan );
					var targetData = offset.getChannelData( chan );

					for ( var i = 0; i < sourceData.length - sampleOffset; i += 1 ) {
							targetData[i] = sourceData[ i + sampleOffset ];
					}
				}

				decoded = offset;
			}

			var source = this$1.context.createBufferSource();
			source.buffer = decoded;

			callback( source );
		}, errback );
	};

	Chunk.prototype.onready = function onready ( callback ) {
		if ( this.ready ) {
			setTimeout( callback );
		} else {
			this._callback = callback;
		}
	};

	Chunk.prototype._ready = function _ready () {
			var this$1 = this;

		if ( this.ready ) return;

		if ( this._attached && this.duration !== null ) {
			this.ready = true;

			if ( this.next ) {
				var rawLen = this.raw.length;
				var nextLen = this.next.raw.length >> 1; // we don't need the whole thing

				this.extended = new Uint8Array( rawLen + nextLen );

				var p = 0;

				for ( var i = this._firstByte; i < rawLen; i += 1 ) {
					this$1.extended[p++] = this$1.raw[i];
				}

				for ( var i$1 = 0; i$1 < nextLen; i$1 += 1 ) {
					this$1.extended[p++] = this$1.next.raw[i$1];
				}
			} else {
				this.extended = this._firstByte > 0 ?
					slice( this.raw, this._firstByte, this.raw.length ) :
					this.raw;
			}

			if ( this._callback ) {
				this._callback();
				this._callback = null;
			}
		}
	};

	var context;

	function getContext () {
		return context || ( context = new ( window.AudioContext || window.webkitAudioContext )() );
	}

	var mpegVersionLookup = {
		0: 2,
		1: 1
	};

	var mpegLayerLookup = {
		1: 3,
		2: 2,
		3: 1
	};

	var sampleRateLookup = {
		0: 44100,
		1: 48000,
		2: 32000
	};

	var channelModeLookup = {
		0: 'stereo',
		1: 'joint stereo',
		2: 'dual channel',
		3: 'mono'
	};

	function parseMetadata ( metadata ) {
		var mpegVersion = mpegVersionLookup[ metadata.mpegVersion >> 3 ];

		return {
			mpegVersion: mpegVersion,
			mpegLayer: mpegLayerLookup[ metadata.mpegLayer >> 1 ],
			sampleRate: sampleRateLookup[ metadata.sampleRate >> 2 ] / mpegVersion,
			channelMode: channelModeLookup[ metadata.channelMode >> 6 ]
		};
	}

	function warn ( msg ) {
		console.warn(  ("%cðŸ”Š Phonograph.js %c" + msg), 'font-weight: bold;', 'font-weight: normal;' ); //eslint-disable-line no-console
		console.groupCollapsed( "%cðŸ”Š stack trace", 'font-weight: normal; color: #666;' ); //eslint-disable-line no-console
		var stack = new Error().stack.split( '\n' ).slice( 2 ).join( '\n' );
		console.log( ("%c" + stack), 'display: block; font-weight: normal; color: #666;' ); //eslint-disable-line no-console
		console.groupEnd(); //eslint-disable-line no-console
	}

	var CHUNK_SIZE = 64 * 1024;
	var OVERLAP = 0.2;

	var Clip = function Clip (ref) {
		var url = ref.url;
		var loop = ref.loop;
		var volume = ref.volume;

		this.url = url;
		this.callbacks = {};
		this.context = getContext();

		this.loop = loop || false;

		this.buffered = 0;
		this.length = 0;

		this.loader = new Loader$1( url );
		this.loaded = false;
		this.canplaythrough = false;

		this._currentTime = 0;

		this._volume = volume || 1;
		this._gain = this.context.createGain();
		this._gain.gain.value = this._volume;

		this._gain.connect( this.context.destination );

		this._chunks = [];
	};

	var prototypeAccessors = { currentTime: {},duration: {},volume: {} };

	Clip.prototype.buffer = function buffer ( bufferToCompletion ) {
			var this$1 = this;

		if ( !this._loadStarted ) {
			this._loadStarted = true;

			var tempBuffer = new Uint8Array( CHUNK_SIZE * 2 );
			var p = 0;

			var loadStartTime = Date.now();
			var totalLoadedBytes = 0;

			var checkCanplaythrough = function () {
				if ( this$1.canplaythrough || !this$1.length ) return;

				var duration = 0;
				var bytes = 0;

				for ( var i = 0, list = this$1._chunks; i < list.length; i += 1 ) {
					var chunk = list[i];

						if ( !chunk.duration ) break;
					duration += chunk.duration;
					bytes += chunk.raw.length;
				}

				if ( !duration ) return;

				var scale = this$1.length / bytes;
				var estimatedDuration = duration * scale;

				var timeNow = Date.now();
				var elapsed = timeNow - loadStartTime;

				var bitrate = totalLoadedBytes / elapsed;
				var estimatedTimeToDownload = 1.5 * ( this$1.length - totalLoadedBytes ) / bitrate / 1e3;

				// if we have enough audio that we can start playing now
				// and finish downloading before we run out, we've
				// reached canplaythrough
				var availableAudio = ( bytes / this$1.length ) * estimatedDuration;

				if ( availableAudio > estimatedTimeToDownload ) {
					this$1.canplaythrough = true;
					this$1._fire( 'canplaythrough' );
				}
			};

			var drainBuffer = function () {
				var isFirstChunk = this$1._chunks.length === 0;
				var firstByte = isFirstChunk ? 32 : 0;

				var chunk = new Chunk({
					clip: this$1,
					raw: slice( tempBuffer, firstByte, p ),
					onready: this$1.canplaythrough ? null : checkCanplaythrough,
					onerror: function (err) {
						err.url = this$1.url;
						err.phonographCode = 'COULD_NOT_DECODE';
						this$1._fire( 'loaderror', err );
					}
				});

				var lastChunk = this$1._chunks[ this$1._chunks.length - 1 ];
				if ( lastChunk ) lastChunk.attach( chunk );

				this$1._chunks.push( chunk );
				p = 0;

				return chunk;
			};

			this.loader.load({
				onprogress: function ( progress, length, total ) {
					this$1.buffered = length;
					this$1.length = total;
					this$1._fire( 'loadprogress', { progress: progress, length: length, total: total });
				},

				ondata: function ( uint8Array ) {
					if ( !this$1.metadata ) {
						for ( var i = 0; i < uint8Array.length; i += 1 ) {
							// determine some facts about this mp3 file from the initial header
							if ( uint8Array[i] === 255 && ( uint8Array[ i + 1 ] & 240 ) === 240 ) {
								// http://www.datavoyage.com/mpgscript/mpeghdr.htm
								this$1._referenceHeader = {
									mpegVersion: ( uint8Array[ i + 1 ] & 8 ),
									mpegLayer: ( uint8Array[ i + 1 ] & 6 ),
									sampleRate: ( uint8Array[ i + 2 ] & 12 ),
									channelMode: ( uint8Array[ i + 3 ] & 192 )
								};

								this$1.metadata = parseMetadata( this$1._referenceHeader );

								break;
							}
						}
					}

					for ( var i$1 = 0; i$1 < uint8Array.length; i$1 += 1 ) {
						// once the buffer is large enough, wait for
						// the next frame header then drain it
						if ( p > CHUNK_SIZE + 4 && isFrameHeader( uint8Array, i$1, this$1._referenceHeader ) ) {
							drainBuffer();
						}

						// write new data to buffer
						tempBuffer[ p++ ] = uint8Array[i$1];
					}

					totalLoadedBytes += uint8Array.length;
				},

				onload: function () {
					if ( p ) {
						var lastChunk = drainBuffer();
						lastChunk.attach( null );

						totalLoadedBytes += p;
					}

					this$1._chunks[0].onready( function () {
						if ( !this$1.canplaythrough ) {
							this$1.canplaythrough = true;
							this$1._fire( 'canplaythrough' );
						}

						this$1.loaded = true;
						this$1._fire( 'load' );
					});
				},

				onerror: function ( error ) {
					error.url = this$1.url;
					error.phonographCode = 'COULD_NOT_LOAD';
					this$1._fire( 'loaderror', error );
					this$1._loadStarted = false;
				}
			});
		}

		return new Promise( function ( fulfil, reject ) {
			var ready = bufferToCompletion ? this$1.loaded : this$1.canplaythrough;

			if ( ready ) {
				fulfil();
			} else {
				this$1.once( bufferToCompletion ? 'load' : 'canplaythrough', fulfil );
				this$1.once( 'loaderror', reject );
			}
		});
	};

	Clip.prototype.clone = function clone () {
		return new Clone( this );
	};

	Clip.prototype.connect = function connect ( destination, output, input ) {
		if ( !this._connected ) {
			this._gain.disconnect();
			this._connected = true;
		}

		this._gain.connect( destination, output, input );
		return this;
	};

	Clip.prototype.disconnect = function disconnect ( destination, output, input ) {
		this._gain.disconnect( destination, output, input );
	};

	Clip.prototype.dispose = function dispose () {
		if ( this.playing ) this.pause();

		if ( this._loadStarted ) {
			this.loader.cancel();
			this._loadStarted = false;
		}

		this._currentTime = 0;
		this.loaded = false;
		this.canplaythrough = false;
		this._chunks = [];

		this._fire( 'dispose' );
	};

	Clip.prototype.off = function off ( eventName, cb ) {
		var callbacks = this.callbacks[ eventName ];
		if ( !callbacks ) return;

		var index = callbacks.indexOf( cb );
		if ( ~index ) callbacks.splice( index, 1 );
	};

	Clip.prototype.on = function on ( eventName, cb ) {
			var this$1 = this;

		var callbacks = this.callbacks[ eventName ] || ( this.callbacks[ eventName ] = [] );
		callbacks.push( cb );

		return {
			cancel: function () { return this$1.off( eventName, cb ); }
		};
	};

	Clip.prototype.once = function once ( eventName, cb ) {
			var this$1 = this;

		var _cb = function ( data ) {
			cb( data );
			this$1.off( eventName, _cb );
		};

		return this.on( eventName, _cb );
	};

	Clip.prototype.play = function play () {
			var this$1 = this;

		var promise = new Promise( function ( fulfil, reject ) {
			this$1.once( 'ended', fulfil );

			this$1.once( 'loaderror', reject );
			this$1.once( 'playbackerror', reject );

			this$1.once( 'dispose', function () {
				if ( this$1.ended ) return;

				var err = new Error( 'Clip was disposed' );
				err.phonographCode = 'CLIP_WAS_DISPOSED';
				err.url = this$1.url;
				reject( err );
			});
		});

		if ( this.playing ) {
			warn( ("clip.play() was called on a clip that was already playing (" + (this.url) + ")") );
		} else if ( !this.canplaythrough ) {
			warn( ("clip.play() was called before clip.canplaythrough === true (" + (this.url) + ")") );
			this.buffer().then( function () { return this$1._play(); } );
		} else {
			this._play();
		}

		this.playing = true;
		this.ended = false;

		return promise;
	};

	Clip.prototype.pause = function pause () {
		if ( !this.playing ) {
			warn( ("clip.pause() was called on a clip that was already paused (" + (this.url) + ")") );
			return this;
		}

		this.playing = false;
		this._currentTime = this._startTime + ( this.context.currentTime - this._contextTimeAtStart );

		this._fire( 'pause' );

		return this;
	};

	prototypeAccessors.currentTime.get = function () {
		if ( this.playing ) {
			return this._startTime + ( this.context.currentTime - this._contextTimeAtStart );
		} else {
			return this._currentTime;
		}
	};

	prototypeAccessors.currentTime.set = function ( currentTime ) {
		if ( this.playing ) {
			this.pause();
			this._currentTime = currentTime;
			this.play();
		} else {
			this._currentTime = currentTime;
		}
	};

	prototypeAccessors.duration.get = function () {
		var total = 0;
		for ( var i = 0, list = this._chunks; i < list.length; i += 1 ) {
			var chunk = list[i];

				if ( !chunk.duration ) return null;
			total += chunk.duration;
		}

		return total;
	};

	prototypeAccessors.volume.get = function () {
		return this._volume;
	};

	prototypeAccessors.volume.set = function ( volume ) {
		this._gain.gain.value = this._volume = volume;
	};

	Clip.prototype._fire = function _fire ( eventName, data ) {
		var callbacks = this.callbacks[ eventName ];
		if ( !callbacks ) return;

		callbacks.slice().forEach( function (cb) { return cb( data ); } );
	};

	Clip.prototype._play = function _play () {
			var this$1 = this;

		var chunkIndex;
		var time = 0;
		for ( chunkIndex = 0; chunkIndex < this._chunks.length; chunkIndex += 1 ) {
			var chunk$1 = this$1._chunks[ chunkIndex ];

			if ( !chunk$1.duration ) {
				warn( ("attempted to play content that has not yet buffered " + (this$1.url)) );
				setTimeout( function () {
					this$1._play();
				}, 100 );
				return;
			}

			var chunkEnd = time + chunk$1.duration;
			if ( chunkEnd > this$1._currentTime ) break;

			time = chunkEnd;
		}

		this._startTime = this._currentTime;
		var timeOffset = this._currentTime - time;

		this._fire( 'play' );

		var playing = true;
		var pauseListener = this.on( 'pause', function () {
			playing = false;

			if ( previousSource ) previousSource.stop();
			if ( currentSource ) currentSource.stop();
			pauseListener.cancel();
		});

		var i = chunkIndex++ % this._chunks.length;

		var chunk = this._chunks[i];
		var previousSource;
		var currentSource;

		chunk.createSource( timeOffset, function (source) {
			currentSource = source;

			this$1._contextTimeAtStart = this$1.context.currentTime;

			var lastStart = this$1._contextTimeAtStart;
			var nextStart = this$1._contextTimeAtStart + ( chunk.duration - timeOffset );

			var gain = this$1.context.createGain();
			gain.connect( this$1._gain );
			gain.gain.setValueAtTime( 0, nextStart + OVERLAP );

			source.connect( gain );
			source.start( this$1.context.currentTime );

			var endGame = function () {
				if ( this$1.context.currentTime >= nextStart ) {
					this$1.pause()._currentTime = 0;
					this$1.ended = true;
					this$1._fire( 'ended' );
				} else {
					requestAnimationFrame( endGame );
				}
			};

			var advance = function () {
				if ( !playing ) return;

				var i = chunkIndex++;
				if ( this$1.loop ) i %= this$1._chunks.length;

				chunk = this$1._chunks[i];

				if ( chunk ) {
					chunk.createSource( 0, function (source) {
						previousSource = currentSource;
						currentSource = source;

						var gain = this$1.context.createGain();
						gain.connect( this$1._gain );
						gain.gain.setValueAtTime( 0, nextStart );
						gain.gain.setValueAtTime( 1, nextStart + OVERLAP );

						source.connect( gain );
						source.start( nextStart );

						lastStart = nextStart;
						nextStart += chunk.duration;

						gain.gain.setValueAtTime( 0, nextStart + OVERLAP );

						tick();
					}, function (err) {
						err.url = this$1.url;
						err.phonographCode = 'COULD_NOT_CREATE_SOURCE';
						this$1._fire( 'playbackerror', err );
					});
				} else {
					endGame();
				}
			};

			var tick = function () {
				if ( this$1.context.currentTime > lastStart ) {
					advance();
				} else {
					setTimeout( tick, 500 );
				}
			};

			var frame = function () {
				if ( !playing ) return;
				requestAnimationFrame( frame );

				this$1._fire( 'progress' );
			};

			tick();
			frame();
		}, function (err) {
			err.url = this$1.url;
			err.phonographCode = 'COULD_NOT_START_PLAYBACK';
			this$1._fire( 'playbackerror', err );
		});
	};

	Object.defineProperties( Clip.prototype, prototypeAccessors );

	var Clone = (function (Clip) {
		function Clone ( original ) {
			Clip.call(this, { url: original.url });
			this.original = original;
		}

		if ( Clip ) Clone.__proto__ = Clip;
		Clone.prototype = Object.create( Clip && Clip.prototype );
		Clone.prototype.constructor = Clone;

		var prototypeAccessors = { canplaythrough: {},loaded: {},_chunks: {} };

		Clone.prototype.buffer = function buffer () {
			return this.original.buffer();
		};

		Clone.prototype.clone = function clone () {
			return this.original.clone();
		};

		prototypeAccessors.canplaythrough.get = function () {
			return this.original.canplaythrough;
		};

		prototypeAccessors.canplaythrough.set = function ( _ ) { // eslint-disable-line no-unused-vars
			// noop
		};

		prototypeAccessors.loaded.get = function () {
			return this.original.loaded;
		};

		prototypeAccessors.loaded.set = function ( _ ) { // eslint-disable-line no-unused-vars
			// noop
		};

		prototypeAccessors._chunks.get = function () {
			return this.original._chunks;
		};

		prototypeAccessors._chunks.set = function ( _ ) { // eslint-disable-line no-unused-vars
			// noop
		};

		Object.defineProperties( Clone.prototype, prototypeAccessors );

		return Clone;
	}(Clip));

	var inited;

	window.addEventListener( 'touchend', init, false );

	// https://paulbakaus.com/tutorials/html5/web-audio-on-ios/
	function init () {
		if ( inited ) return;

		var context = getContext();

		// create a short empty buffer
		var buffer = context.createBuffer( 1, 1, 22050 );
		var source = context.createBufferSource();
		source.buffer = buffer;
		source.connect( context.destination );

		source.start( context.currentTime );

		setTimeout( function () {
			if ( !inited ) {
				if ( source.playbackState === source.PLAYING_STATE || source.playbackState === source.FINISHED_STATE ) {
					inited = true;
					window.removeEventListener( 'touchend', init, false );
				}
			}
		});
	}

	exports.Clip = Clip;
	exports.getContext = getContext;
	exports.init = init;

	Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=phonograph.umd.js.map