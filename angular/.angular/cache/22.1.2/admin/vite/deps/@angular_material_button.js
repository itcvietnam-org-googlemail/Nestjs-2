import { $a as ɵɵdefineComponent, $n as Output, Bl as Observable, Ca as ɵɵconditionalCreate, Dr as ViewEncapsulation, En as ElementRef, Fc as PLATFORM_ID, Fl as map, Hc as SecurityContext, Hi as setClassMetadata, Hl as identity, Il as BehaviorSubject, In as Input, Jl as arrRemove, Ll as Subject, M as createComponent, Mr as afterNextRender, Nc as NgZone, O as booleanAttribute, Rl as createOperatorSubscriber, Tc as Injector, Tl as ɵɵdefineInjector, X as input, _a as ɵɵattribute, al as inject, ao as ɵɵdomElement, ar as RendererFactory2, ca as ɵɵProvidersFeature, cc as APP_ID, cn as Component, dr as Service, eo as ɵɵdefineDirective, fc as DOCUMENT, gc as EnvironmentInjector, ir as Renderer2, iu as __spreadArray, la as ɵɵadvance, lo as ɵɵdomElementEnd, ns as ɵɵprojection, oa as ɵɵInheritDefinitionFeature, ql as Subscription, qn as NgModule, ro as ɵɵdefineService, rs as ɵɵprojectionDef, rt as numberAttribute, ru as __read, sa as ɵɵNgOnChangesFeature, sc as ANIMATION_MODULE_TYPE, tn as ApplicationRef, to as ɵɵdefineNgModule, tu as __extends, uc as CSP_NONCE, uo as ɵɵdomElementStart, va as ɵɵclassMap, vc as EventEmitter, wc as InjectionToken, wn as Directive, xa as ɵɵconditional, ya as ɵɵclassProp, yl as signal, zl as operate } from "./core-Cb_oZDAC.js";
import { t as dateTimestampProvider } from "./dateTimestampProvider-BPa43ll-.js";
import { n as take, r as concat, t as takeUntil } from "./takeUntil-BmxiYPnc.js";
import { i as filter, o as of } from "./switchMap-ow7w_pV-.js";
import { n as combineLatest, t as startWith } from "./startWith-DYVcOgN9.js";
import { I as isPlatformBrowser, r as DomSanitizer } from "./platform-browser-1L5cCODI.js";
//#region ../../../node_modules/rxjs/dist/esm5/internal/scheduler/Action.js
var Action = function(_super) {
	__extends(Action, _super);
	function Action(scheduler, work) {
		return _super.call(this) || this;
	}
	Action.prototype.schedule = function(state, delay) {
		if (delay === void 0) delay = 0;
		return this;
	};
	return Action;
}(Subscription);
//#endregion
//#region ../../../node_modules/rxjs/dist/esm5/internal/scheduler/intervalProvider.js
var intervalProvider = {
	setInterval: function(handler, timeout) {
		var args = [];
		for (var _i = 2; _i < arguments.length; _i++) args[_i - 2] = arguments[_i];
		var delegate = intervalProvider.delegate;
		if (delegate === null || delegate === void 0 ? void 0 : delegate.setInterval) return delegate.setInterval.apply(delegate, __spreadArray([handler, timeout], __read(args)));
		return setInterval.apply(void 0, __spreadArray([handler, timeout], __read(args)));
	},
	clearInterval: function(handle) {
		var delegate = intervalProvider.delegate;
		return ((delegate === null || delegate === void 0 ? void 0 : delegate.clearInterval) || clearInterval)(handle);
	},
	delegate: void 0
};
//#endregion
//#region ../../../node_modules/rxjs/dist/esm5/internal/scheduler/AsyncAction.js
var AsyncAction = function(_super) {
	__extends(AsyncAction, _super);
	function AsyncAction(scheduler, work) {
		var _this = _super.call(this, scheduler, work) || this;
		_this.scheduler = scheduler;
		_this.work = work;
		_this.pending = false;
		return _this;
	}
	AsyncAction.prototype.schedule = function(state, delay) {
		var _a;
		if (delay === void 0) delay = 0;
		if (this.closed) return this;
		this.state = state;
		var id = this.id;
		var scheduler = this.scheduler;
		if (id != null) this.id = this.recycleAsyncId(scheduler, id, delay);
		this.pending = true;
		this.delay = delay;
		this.id = (_a = this.id) !== null && _a !== void 0 ? _a : this.requestAsyncId(scheduler, this.id, delay);
		return this;
	};
	AsyncAction.prototype.requestAsyncId = function(scheduler, _id, delay) {
		if (delay === void 0) delay = 0;
		return intervalProvider.setInterval(scheduler.flush.bind(scheduler, this), delay);
	};
	AsyncAction.prototype.recycleAsyncId = function(_scheduler, id, delay) {
		if (delay === void 0) delay = 0;
		if (delay != null && this.delay === delay && this.pending === false) return id;
		if (id != null) intervalProvider.clearInterval(id);
	};
	AsyncAction.prototype.execute = function(state, delay) {
		if (this.closed) return /* @__PURE__ */ new Error("executing a cancelled action");
		this.pending = false;
		var error = this._execute(state, delay);
		if (error) return error;
		else if (this.pending === false && this.id != null) this.id = this.recycleAsyncId(this.scheduler, this.id, null);
	};
	AsyncAction.prototype._execute = function(state, _delay) {
		var errored = false;
		var errorValue;
		try {
			this.work(state);
		} catch (e) {
			errored = true;
			errorValue = e ? e : /* @__PURE__ */ new Error("Scheduled action threw falsy error");
		}
		if (errored) {
			this.unsubscribe();
			return errorValue;
		}
	};
	AsyncAction.prototype.unsubscribe = function() {
		if (!this.closed) {
			var _a = this, id = _a.id, scheduler = _a.scheduler;
			var actions = scheduler.actions;
			this.work = this.state = this.scheduler = null;
			this.pending = false;
			arrRemove(actions, this);
			if (id != null) this.id = this.recycleAsyncId(scheduler, id, null);
			this.delay = null;
			_super.prototype.unsubscribe.call(this);
		}
	};
	return AsyncAction;
}(Action);
//#endregion
//#region ../../../node_modules/rxjs/dist/esm5/internal/Scheduler.js
var Scheduler = function() {
	function Scheduler(schedulerActionCtor, now) {
		if (now === void 0) now = Scheduler.now;
		this.schedulerActionCtor = schedulerActionCtor;
		this.now = now;
	}
	Scheduler.prototype.schedule = function(work, delay, state) {
		if (delay === void 0) delay = 0;
		return new this.schedulerActionCtor(this, work).schedule(state, delay);
	};
	Scheduler.now = dateTimestampProvider.now;
	return Scheduler;
}();
//#endregion
//#region ../../../node_modules/rxjs/dist/esm5/internal/scheduler/async.js
var asyncScheduler = new (function(_super) {
	__extends(AsyncScheduler, _super);
	function AsyncScheduler(SchedulerAction, now) {
		if (now === void 0) now = Scheduler.now;
		var _this = _super.call(this, SchedulerAction, now) || this;
		_this.actions = [];
		_this._active = false;
		return _this;
	}
	AsyncScheduler.prototype.flush = function(action) {
		var actions = this.actions;
		if (this._active) {
			actions.push(action);
			return;
		}
		var error;
		this._active = true;
		do
			if (error = action.execute(action.state, action.delay)) break;
		while (action = actions.shift());
		this._active = false;
		if (error) {
			while (action = actions.shift()) action.unsubscribe();
			throw error;
		}
	};
	return AsyncScheduler;
}(Scheduler))(AsyncAction);
//#endregion
//#region ../../../node_modules/rxjs/dist/esm5/internal/operators/debounceTime.js
function debounceTime(dueTime, scheduler) {
	if (scheduler === void 0) scheduler = asyncScheduler;
	return operate(function(source, subscriber) {
		var activeTask = null;
		var lastValue = null;
		var lastTime = null;
		var emit = function() {
			if (activeTask) {
				activeTask.unsubscribe();
				activeTask = null;
				var value = lastValue;
				lastValue = null;
				subscriber.next(value);
			}
		};
		function emitWhenIdle() {
			var targetTime = lastTime + dueTime;
			var now = scheduler.now();
			if (now < targetTime) {
				activeTask = this.schedule(void 0, targetTime - now);
				subscriber.add(activeTask);
				return;
			}
			emit();
		}
		source.subscribe(createOperatorSubscriber(subscriber, function(value) {
			lastValue = value;
			lastTime = scheduler.now();
			if (!activeTask) {
				activeTask = scheduler.schedule(emitWhenIdle, dueTime);
				subscriber.add(activeTask);
			}
		}, function() {
			emit();
			subscriber.complete();
		}, void 0, function() {
			lastValue = activeTask = null;
		}));
	});
}
//#endregion
//#region ../../../node_modules/rxjs/dist/esm5/internal/operators/distinctUntilChanged.js
function distinctUntilChanged(comparator, keySelector) {
	if (keySelector === void 0) keySelector = identity;
	comparator = comparator !== null && comparator !== void 0 ? comparator : defaultCompare;
	return operate(function(source, subscriber) {
		var previousKey;
		var first = true;
		source.subscribe(createOperatorSubscriber(subscriber, function(value) {
			var currentKey = keySelector(value);
			if (first || !comparator(previousKey, currentKey)) {
				first = false;
				previousKey = currentKey;
				subscriber.next(value);
			}
		}));
	});
}
function defaultCompare(a, b) {
	return a === b;
}
//#endregion
//#region ../../../node_modules/rxjs/dist/esm5/internal/operators/skip.js
function skip(count) {
	return filter(function(_, index) {
		return count <= index;
	});
}
//#endregion
//#region ../../../node_modules/@angular/cdk/fesm2022/_fake-event-detection-chunk.mjs
function isFakeMousedownFromScreenReader(event) {
	return event.buttons === 0 || event.detail === 0;
}
function isFakeTouchstartFromScreenReader(event) {
	const touch = event.touches && event.touches[0] || event.changedTouches && event.changedTouches[0];
	return !!touch && touch.identifier === -1 && (touch.radiusX == null || touch.radiusX === 1) && (touch.radiusY == null || touch.radiusY === 1);
}
//#endregion
//#region ../../../node_modules/@angular/cdk/fesm2022/_shadow-dom-chunk.mjs
var shadowDomIsSupported;
function _supportsShadowDom() {
	if (shadowDomIsSupported == null) {
		const head = typeof document !== "undefined" ? document.head : null;
		shadowDomIsSupported = !!(head && (head.createShadowRoot || head.attachShadow));
	}
	return shadowDomIsSupported;
}
function _getShadowRoot(element) {
	if (_supportsShadowDom()) {
		const rootNode = element.getRootNode ? element.getRootNode() : null;
		if (typeof ShadowRoot !== "undefined" && ShadowRoot && rootNode instanceof ShadowRoot) return rootNode;
	}
	return null;
}
function _getFocusedElementPierceShadowDom() {
	let activeElement = typeof document !== "undefined" && document ? document.activeElement : null;
	while (activeElement && activeElement.shadowRoot) {
		const newActiveElement = activeElement.shadowRoot.activeElement;
		if (newActiveElement === activeElement) break;
		else activeElement = newActiveElement;
	}
	return activeElement;
}
function _getEventTarget(event) {
	if (event.composedPath) try {
		return event.composedPath()[0];
	} catch {}
	return event.target;
}
//#endregion
//#region ../../../node_modules/@angular/cdk/fesm2022/_platform-chunk.mjs
var hasV8BreakIterator;
try {
	hasV8BreakIterator = typeof Intl !== "undefined" && Intl.v8BreakIterator;
} catch {
	hasV8BreakIterator = false;
}
var Platform = class Platform {
	_platformId = inject(PLATFORM_ID);
	isBrowser = this._platformId ? isPlatformBrowser(this._platformId) : typeof document === "object" && !!document;
	EDGE = this.isBrowser && /(edge)/i.test(navigator.userAgent);
	TRIDENT = this.isBrowser && /(msie|trident)/i.test(navigator.userAgent);
	BLINK = this.isBrowser && !!(window.chrome || hasV8BreakIterator) && typeof CSS !== "undefined" && !this.EDGE && !this.TRIDENT;
	WEBKIT = this.isBrowser && /AppleWebKit/i.test(navigator.userAgent) && !this.BLINK && !this.EDGE && !this.TRIDENT;
	IOS = this.isBrowser && /iPad|iPhone|iPod/.test(navigator.userAgent) && !("MSStream" in window);
	FIREFOX = this.isBrowser && /(firefox|minefield)/i.test(navigator.userAgent);
	ANDROID = this.isBrowser && /android/i.test(navigator.userAgent) && !this.TRIDENT;
	SAFARI = this.isBrowser && /safari/i.test(navigator.userAgent) && this.WEBKIT;
	static ɵfac = function Platform_Factory(__ngFactoryType__) {
		return new (__ngFactoryType__ || Platform)();
	};
	static ɵprov = /* @__PURE__ */ ɵɵdefineService({
		token: Platform,
		factory: Platform.ɵfac
	});
};
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(Platform, [{ type: Service }], null, null);
})();
//#endregion
//#region ../../../node_modules/@angular/cdk/fesm2022/_passive-listeners-chunk.mjs
var supportsPassiveEvents;
function supportsPassiveEventListeners() {
	if (supportsPassiveEvents == null && typeof window !== "undefined") try {
		window.addEventListener("test", null, Object.defineProperty({}, "passive", { get: () => supportsPassiveEvents = true }));
	} finally {
		supportsPassiveEvents = supportsPassiveEvents || false;
	}
	return supportsPassiveEvents;
}
function normalizePassiveListenerOptions(options) {
	return supportsPassiveEventListeners() ? options : !!options.capture;
}
//#endregion
//#region ../../../node_modules/@angular/cdk/fesm2022/_element-chunk.mjs
function coerceNumberProperty(value, fallbackValue = 0) {
	if (_isNumberValue(value)) return Number(value);
	return arguments.length === 2 ? fallbackValue : 0;
}
function _isNumberValue(value) {
	return !isNaN(parseFloat(value)) && !isNaN(Number(value));
}
function coerceElement(elementOrRef) {
	return elementOrRef instanceof ElementRef ? elementOrRef.nativeElement : elementOrRef;
}
//#endregion
//#region ../../../node_modules/@angular/cdk/fesm2022/_focus-monitor-chunk.mjs
var INPUT_MODALITY_DETECTOR_OPTIONS = new InjectionToken("cdk-input-modality-detector-options");
var INPUT_MODALITY_DETECTOR_DEFAULT_OPTIONS = { ignoreKeys: [
	18,
	17,
	224,
	91,
	16
] };
var TOUCH_BUFFER_MS = 650;
var modalityEventListenerOptions = {
	passive: true,
	capture: true
};
var InputModalityDetector = class InputModalityDetector {
	_platform = inject(Platform);
	_listenerCleanups;
	modalityDetected;
	modalityChanged;
	get mostRecentModality() {
		return this._modality.value;
	}
	_mostRecentTarget = null;
	_modality = new BehaviorSubject(null);
	_options;
	_lastTouchMs = 0;
	_onKeydown = (event) => {
		if (this._options?.ignoreKeys?.some((keyCode) => keyCode === event.keyCode)) return;
		this._modality.next("keyboard");
		this._mostRecentTarget = _getEventTarget(event);
	};
	_onMousedown = (event) => {
		if (Date.now() - this._lastTouchMs < TOUCH_BUFFER_MS) return;
		this._modality.next(isFakeMousedownFromScreenReader(event) ? "keyboard" : "mouse");
		this._mostRecentTarget = _getEventTarget(event);
	};
	_onTouchstart = (event) => {
		if (isFakeTouchstartFromScreenReader(event)) {
			this._modality.next("keyboard");
			return;
		}
		this._lastTouchMs = Date.now();
		this._modality.next("touch");
		this._mostRecentTarget = _getEventTarget(event);
	};
	constructor() {
		const ngZone = inject(NgZone);
		const document = inject(DOCUMENT);
		const options = inject(INPUT_MODALITY_DETECTOR_OPTIONS, { optional: true });
		this._options = {
			...INPUT_MODALITY_DETECTOR_DEFAULT_OPTIONS,
			...options
		};
		this.modalityDetected = this._modality.pipe(skip(1));
		this.modalityChanged = this.modalityDetected.pipe(distinctUntilChanged());
		if (this._platform.isBrowser) {
			const renderer = inject(RendererFactory2).createRenderer(null, null);
			this._listenerCleanups = ngZone.runOutsideAngular(() => {
				return [
					renderer.listen(document, "keydown", this._onKeydown, modalityEventListenerOptions),
					renderer.listen(document, "mousedown", this._onMousedown, modalityEventListenerOptions),
					renderer.listen(document, "touchstart", this._onTouchstart, modalityEventListenerOptions)
				];
			});
		}
	}
	ngOnDestroy() {
		this._modality.complete();
		this._listenerCleanups?.forEach((cleanup) => cleanup());
	}
	static ɵfac = function InputModalityDetector_Factory(__ngFactoryType__) {
		return new (__ngFactoryType__ || InputModalityDetector)();
	};
	static ɵprov = /* @__PURE__ */ ɵɵdefineService({
		token: InputModalityDetector,
		factory: InputModalityDetector.ɵfac
	});
};
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(InputModalityDetector, [{ type: Service }], () => [], null);
})();
var FocusMonitorDetectionMode;
(function(FocusMonitorDetectionMode) {
	FocusMonitorDetectionMode[FocusMonitorDetectionMode["IMMEDIATE"] = 0] = "IMMEDIATE";
	FocusMonitorDetectionMode[FocusMonitorDetectionMode["EVENTUAL"] = 1] = "EVENTUAL";
})(FocusMonitorDetectionMode || (FocusMonitorDetectionMode = {}));
var FOCUS_MONITOR_DEFAULT_OPTIONS = new InjectionToken("cdk-focus-monitor-default-options");
var captureEventListenerOptions = normalizePassiveListenerOptions({
	passive: true,
	capture: true
});
var FocusMonitor = class FocusMonitor {
	_ngZone = inject(NgZone);
	_platform = inject(Platform);
	_inputModalityDetector = inject(InputModalityDetector);
	_origin = null;
	_lastFocusOrigin = null;
	_windowFocused = false;
	_windowFocusTimeoutId;
	_originTimeoutId;
	_originFromTouchInteraction = false;
	_elementInfo = /* @__PURE__ */ new Map();
	_monitoredElementCount = 0;
	_rootNodeFocusListenerCount = /* @__PURE__ */ new Map();
	_detectionMode;
	_windowFocusListener = () => {
		this._windowFocused = true;
		this._windowFocusTimeoutId = setTimeout(() => this._windowFocused = false);
	};
	_document = inject(DOCUMENT);
	_stopInputModalityDetector = new Subject();
	constructor() {
		const options = inject(FOCUS_MONITOR_DEFAULT_OPTIONS, { optional: true });
		this._detectionMode = options?.detectionMode || FocusMonitorDetectionMode.IMMEDIATE;
	}
	_rootNodeFocusAndBlurListener = (event) => {
		const target = _getEventTarget(event);
		for (let element = target; element; element = element.parentElement) if (event.type === "focus") this._onFocus(event, element);
		else this._onBlur(event, element);
	};
	monitor(element, checkChildren = false) {
		const nativeElement = coerceElement(element);
		if (!this._platform.isBrowser || nativeElement.nodeType !== 1) return of();
		const rootNode = _getShadowRoot(nativeElement) || this._document;
		const cachedInfo = this._elementInfo.get(nativeElement);
		if (cachedInfo) {
			if (checkChildren) cachedInfo.checkChildren = true;
			return cachedInfo.subject;
		}
		const info = {
			checkChildren,
			subject: new Subject(),
			rootNode
		};
		this._elementInfo.set(nativeElement, info);
		this._registerGlobalListeners(info);
		return info.subject;
	}
	stopMonitoring(element) {
		const nativeElement = coerceElement(element);
		const elementInfo = this._elementInfo.get(nativeElement);
		if (elementInfo) {
			elementInfo.subject.complete();
			this._setClasses(nativeElement);
			this._elementInfo.delete(nativeElement);
			this._removeGlobalListeners(elementInfo);
		}
	}
	focusVia(element, origin, options) {
		const nativeElement = coerceElement(element);
		if (nativeElement === this._document.activeElement) this._getClosestElementsInfo(nativeElement).forEach(([currentElement, info]) => this._originChanged(currentElement, origin, info));
		else {
			this._setOrigin(origin);
			if (typeof nativeElement.focus === "function") nativeElement.focus(options);
		}
	}
	ngOnDestroy() {
		this._elementInfo.forEach((_info, element) => this.stopMonitoring(element));
	}
	_getWindow() {
		return this._document.defaultView || window;
	}
	_getFocusOrigin(focusEventTarget) {
		if (this._origin) if (this._originFromTouchInteraction) return this._shouldBeAttributedToTouch(focusEventTarget) ? "touch" : "program";
		else return this._origin;
		if (this._windowFocused && this._lastFocusOrigin) return this._lastFocusOrigin;
		if (focusEventTarget && this._isLastInteractionFromInputLabel(focusEventTarget)) return "mouse";
		return "program";
	}
	_shouldBeAttributedToTouch(focusEventTarget) {
		return this._detectionMode === FocusMonitorDetectionMode.EVENTUAL || !!focusEventTarget?.contains(this._inputModalityDetector._mostRecentTarget);
	}
	_setClasses(element, origin) {
		element.classList.toggle("cdk-focused", !!origin);
		element.classList.toggle("cdk-touch-focused", origin === "touch");
		element.classList.toggle("cdk-keyboard-focused", origin === "keyboard");
		element.classList.toggle("cdk-mouse-focused", origin === "mouse");
		element.classList.toggle("cdk-program-focused", origin === "program");
	}
	_setOrigin(origin, isFromInteraction = false) {
		this._ngZone.runOutsideAngular(() => {
			this._origin = origin;
			this._originFromTouchInteraction = origin === "touch" && isFromInteraction;
			if (this._detectionMode === FocusMonitorDetectionMode.IMMEDIATE) {
				clearTimeout(this._originTimeoutId);
				const ms = this._originFromTouchInteraction ? TOUCH_BUFFER_MS : 1;
				this._originTimeoutId = setTimeout(() => this._origin = null, ms);
			}
		});
	}
	_onFocus(event, element) {
		const elementInfo = this._elementInfo.get(element);
		const focusEventTarget = _getEventTarget(event);
		if (!elementInfo || !elementInfo.checkChildren && element !== focusEventTarget) return;
		this._originChanged(element, this._getFocusOrigin(focusEventTarget), elementInfo);
	}
	_onBlur(event, element) {
		const elementInfo = this._elementInfo.get(element);
		if (!elementInfo || elementInfo.checkChildren && event.relatedTarget instanceof Node && element.contains(event.relatedTarget)) return;
		this._setClasses(element);
		this._emitOrigin(elementInfo, null);
	}
	_emitOrigin(info, origin) {
		if (info.subject.observers.length) this._ngZone.run(() => info.subject.next(origin));
	}
	_registerGlobalListeners(elementInfo) {
		if (!this._platform.isBrowser) return;
		const rootNode = elementInfo.rootNode;
		const rootNodeFocusListeners = this._rootNodeFocusListenerCount.get(rootNode) || 0;
		if (!rootNodeFocusListeners) this._ngZone.runOutsideAngular(() => {
			rootNode.addEventListener("focus", this._rootNodeFocusAndBlurListener, captureEventListenerOptions);
			rootNode.addEventListener("blur", this._rootNodeFocusAndBlurListener, captureEventListenerOptions);
		});
		this._rootNodeFocusListenerCount.set(rootNode, rootNodeFocusListeners + 1);
		if (++this._monitoredElementCount === 1) {
			this._ngZone.runOutsideAngular(() => {
				this._getWindow().addEventListener("focus", this._windowFocusListener);
			});
			this._inputModalityDetector.modalityDetected.pipe(takeUntil(this._stopInputModalityDetector)).subscribe((modality) => {
				this._setOrigin(modality, true);
			});
		}
	}
	_removeGlobalListeners(elementInfo) {
		const rootNode = elementInfo.rootNode;
		if (this._rootNodeFocusListenerCount.has(rootNode)) {
			const rootNodeFocusListeners = this._rootNodeFocusListenerCount.get(rootNode);
			if (rootNodeFocusListeners > 1) this._rootNodeFocusListenerCount.set(rootNode, rootNodeFocusListeners - 1);
			else {
				rootNode.removeEventListener("focus", this._rootNodeFocusAndBlurListener, captureEventListenerOptions);
				rootNode.removeEventListener("blur", this._rootNodeFocusAndBlurListener, captureEventListenerOptions);
				this._rootNodeFocusListenerCount.delete(rootNode);
			}
		}
		if (!--this._monitoredElementCount) {
			this._getWindow().removeEventListener("focus", this._windowFocusListener);
			this._stopInputModalityDetector.next();
			clearTimeout(this._windowFocusTimeoutId);
			clearTimeout(this._originTimeoutId);
		}
	}
	_originChanged(element, origin, elementInfo) {
		this._setClasses(element, origin);
		this._emitOrigin(elementInfo, origin);
		this._lastFocusOrigin = origin;
	}
	_getClosestElementsInfo(element) {
		const results = [];
		this._elementInfo.forEach((info, currentElement) => {
			if (currentElement === element || info.checkChildren && currentElement.contains(element)) results.push([currentElement, info]);
		});
		return results;
	}
	_isLastInteractionFromInputLabel(focusEventTarget) {
		const { _mostRecentTarget: mostRecentTarget, mostRecentModality } = this._inputModalityDetector;
		if (mostRecentModality !== "mouse" || !mostRecentTarget || mostRecentTarget === focusEventTarget || focusEventTarget.nodeName !== "INPUT" && focusEventTarget.nodeName !== "TEXTAREA" || focusEventTarget.disabled) return false;
		const labels = focusEventTarget.labels;
		if (labels) {
			for (let i = 0; i < labels.length; i++) if (labels[i].contains(mostRecentTarget)) return true;
		}
		return false;
	}
	static ɵfac = function FocusMonitor_Factory(__ngFactoryType__) {
		return new (__ngFactoryType__ || FocusMonitor)();
	};
	static ɵprov = /* @__PURE__ */ ɵɵdefineService({
		token: FocusMonitor,
		factory: FocusMonitor.ɵfac
	});
};
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FocusMonitor, [{ type: Service }], () => [], null);
})();
var CdkMonitorFocus = class CdkMonitorFocus {
	_elementRef = inject(ElementRef);
	_focusMonitor = inject(FocusMonitor);
	_monitorSubscription;
	_focusOrigin = null;
	cdkFocusChange = new EventEmitter();
	get focusOrigin() {
		return this._focusOrigin;
	}
	ngAfterViewInit() {
		const element = this._elementRef.nativeElement;
		this._monitorSubscription = this._focusMonitor.monitor(element, element.nodeType === 1 && element.hasAttribute("cdkMonitorSubtreeFocus")).subscribe((origin) => {
			this._focusOrigin = origin;
			this.cdkFocusChange.emit(origin);
		});
	}
	ngOnDestroy() {
		this._focusMonitor.stopMonitoring(this._elementRef);
		this._monitorSubscription?.unsubscribe();
	}
	static ɵfac = function CdkMonitorFocus_Factory(__ngFactoryType__) {
		return new (__ngFactoryType__ || CdkMonitorFocus)();
	};
	static ɵdir = /* @__PURE__ */ ɵɵdefineDirective({
		type: CdkMonitorFocus,
		selectors: [[
			"",
			"cdkMonitorElementFocus",
			""
		], [
			"",
			"cdkMonitorSubtreeFocus",
			""
		]],
		outputs: { cdkFocusChange: "cdkFocusChange" },
		exportAs: ["cdkMonitorFocus"]
	});
};
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CdkMonitorFocus, [{
		type: Directive,
		args: [{
			selector: "[cdkMonitorElementFocus], [cdkMonitorSubtreeFocus]",
			exportAs: "cdkMonitorFocus"
		}]
	}], null, { cdkFocusChange: [{ type: Output }] });
})();
//#endregion
//#region ../../../node_modules/@angular/cdk/fesm2022/_style-loader-chunk.mjs
var appsWithLoaders = /* @__PURE__ */ new WeakMap();
var _CdkPrivateStyleLoader = class _CdkPrivateStyleLoader {
	_appRef;
	_injector = inject(Injector);
	_environmentInjector = inject(EnvironmentInjector);
	load(loader) {
		const appRef = this._appRef = this._appRef || this._injector.get(ApplicationRef);
		let data = appsWithLoaders.get(appRef);
		if (!data) {
			data = {
				loaders: /* @__PURE__ */ new Set(),
				refs: []
			};
			appsWithLoaders.set(appRef, data);
			appRef.onDestroy(() => {
				appsWithLoaders.get(appRef)?.refs.forEach((ref) => ref.destroy());
				appsWithLoaders.delete(appRef);
			});
		}
		if (!data.loaders.has(loader)) {
			data.loaders.add(loader);
			data.refs.push(createComponent(loader, { environmentInjector: this._environmentInjector }));
		}
	}
	static ɵfac = function _CdkPrivateStyleLoader_Factory(__ngFactoryType__) {
		return new (__ngFactoryType__ || _CdkPrivateStyleLoader)();
	};
	static ɵprov = /* @__PURE__ */ ɵɵdefineService({
		token: _CdkPrivateStyleLoader,
		factory: _CdkPrivateStyleLoader.ɵfac
	});
};
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(_CdkPrivateStyleLoader, [{ type: Service }], null, null);
})();
//#endregion
//#region ../../../node_modules/@angular/cdk/fesm2022/private.mjs
var _VisuallyHiddenLoader = class _VisuallyHiddenLoader {
	static ɵfac = function _VisuallyHiddenLoader_Factory(__ngFactoryType__) {
		return new (__ngFactoryType__ || _VisuallyHiddenLoader)();
	};
	static ɵcmp = /* @__PURE__ */ ɵɵdefineComponent({
		type: _VisuallyHiddenLoader,
		selectors: [["ng-component"]],
		exportAs: ["cdkVisuallyHidden"],
		decls: 0,
		vars: 0,
		template: function _VisuallyHiddenLoader_Template(rf, ctx) {},
		styles: [".cdk-visually-hidden {\n  border: 0;\n  clip: rect(0 0 0 0);\n  height: 1px;\n  margin: -1px;\n  overflow: hidden;\n  padding: 0;\n  position: absolute;\n  width: 1px;\n  white-space: nowrap;\n  outline: 0;\n  -webkit-appearance: none;\n  -moz-appearance: none;\n  left: 0;\n}\n[dir=rtl] .cdk-visually-hidden {\n  left: auto;\n  right: 0;\n}\n"],
		encapsulation: 2
	});
};
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(_VisuallyHiddenLoader, [{
		type: Component,
		args: [{
			exportAs: "cdkVisuallyHidden",
			encapsulation: ViewEncapsulation.None,
			template: "",
			styles: [".cdk-visually-hidden {\n  border: 0;\n  clip: rect(0 0 0 0);\n  height: 1px;\n  margin: -1px;\n  overflow: hidden;\n  padding: 0;\n  position: absolute;\n  width: 1px;\n  white-space: nowrap;\n  outline: 0;\n  -webkit-appearance: none;\n  -moz-appearance: none;\n  left: 0;\n}\n[dir=rtl] .cdk-visually-hidden {\n  left: auto;\n  right: 0;\n}\n"]
		}]
	}], null, null);
})();
var policy;
function getPolicy() {
	if (policy === void 0) {
		policy = null;
		if (typeof window !== "undefined") {
			const ttWindow = window;
			if (ttWindow.trustedTypes !== void 0) try {
				policy = ttWindow.trustedTypes.createPolicy("angular#components", { createHTML: (s) => s });
			} catch (error) {
				console.error(error);
			}
		}
	}
	return policy;
}
function trustedHTMLFromString(html) {
	return getPolicy()?.createHTML(html) || html;
}
function _setInnerHtml(element, html, sanitizer) {
	const cleanHtml = sanitizer.sanitize(SecurityContext.HTML, html);
	if (cleanHtml === null && (typeof ngDevMode === "undefined" || ngDevMode)) throw new Error(`Could not sanitize HTML: ${html}`);
	element.innerHTML = trustedHTMLFromString(cleanHtml || "");
}
//#endregion
//#region ../../../node_modules/@angular/cdk/fesm2022/_array-chunk.mjs
function coerceArray(value) {
	return Array.isArray(value) ? value : [value];
}
//#endregion
//#region ../../../node_modules/@angular/cdk/fesm2022/_breakpoints-observer-chunk.mjs
var mediaQueriesForWebkitCompatibility = /* @__PURE__ */ new Set();
var mediaQueryStyleNode;
var MediaMatcher = class MediaMatcher {
	_platform = inject(Platform);
	_nonce = inject(CSP_NONCE, { optional: true });
	_matchMedia;
	constructor() {
		this._matchMedia = this._platform.isBrowser && window.matchMedia ? window.matchMedia.bind(window) : noopMatchMedia;
	}
	matchMedia(query) {
		if (this._platform.WEBKIT || this._platform.BLINK) createEmptyStyleRule(query, this._nonce);
		return this._matchMedia(query);
	}
	static ɵfac = function MediaMatcher_Factory(__ngFactoryType__) {
		return new (__ngFactoryType__ || MediaMatcher)();
	};
	static ɵprov = /* @__PURE__ */ ɵɵdefineService({
		token: MediaMatcher,
		factory: MediaMatcher.ɵfac
	});
};
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MediaMatcher, [{ type: Service }], () => [], null);
})();
function createEmptyStyleRule(query, nonce) {
	if (mediaQueriesForWebkitCompatibility.has(query)) return;
	try {
		if (!mediaQueryStyleNode) {
			mediaQueryStyleNode = document.createElement("style");
			if (nonce) mediaQueryStyleNode.setAttribute("nonce", nonce);
			mediaQueryStyleNode.setAttribute("type", "text/css");
			document.head.appendChild(mediaQueryStyleNode);
		}
		if (mediaQueryStyleNode.sheet) {
			mediaQueryStyleNode.sheet.insertRule(`@media ${query.replace(/[{}]/g, "")} {body{ }}`, 0);
			mediaQueriesForWebkitCompatibility.add(query);
		}
	} catch (e) {
		console.error(e);
	}
}
function noopMatchMedia(query) {
	return {
		matches: query === "all" || query === "",
		media: query,
		addListener: () => {},
		removeListener: () => {}
	};
}
var BreakpointObserver = class BreakpointObserver {
	_mediaMatcher = inject(MediaMatcher);
	_zone = inject(NgZone);
	_queries = /* @__PURE__ */ new Map();
	_destroySubject = new Subject();
	ngOnDestroy() {
		this._destroySubject.next();
		this._destroySubject.complete();
	}
	isMatched(value) {
		return splitQueries(coerceArray(value)).some((mediaQuery) => this._registerQuery(mediaQuery).mql.matches);
	}
	observe(value) {
		let stateObservable = combineLatest(splitQueries(coerceArray(value)).map((query) => this._registerQuery(query).observable));
		stateObservable = concat(stateObservable.pipe(take(1)), stateObservable.pipe(skip(1), debounceTime(0)));
		return stateObservable.pipe(map((breakpointStates) => {
			const response = {
				matches: false,
				breakpoints: {}
			};
			breakpointStates.forEach(({ matches, query }) => {
				response.matches = response.matches || matches;
				response.breakpoints[query] = matches;
			});
			return response;
		}));
	}
	_registerQuery(query) {
		if (this._queries.has(query)) return this._queries.get(query);
		const mql = this._mediaMatcher.matchMedia(query);
		const output = {
			observable: new Observable((observer) => {
				const handler = (e) => this._zone.run(() => observer.next(e));
				mql.addListener(handler);
				return () => {
					mql.removeListener(handler);
				};
			}).pipe(startWith(mql), map(({ matches }) => ({
				query,
				matches
			})), takeUntil(this._destroySubject)),
			mql
		};
		this._queries.set(query, output);
		return output;
	}
	static ɵfac = function BreakpointObserver_Factory(__ngFactoryType__) {
		return new (__ngFactoryType__ || BreakpointObserver)();
	};
	static ɵprov = /* @__PURE__ */ ɵɵdefineService({
		token: BreakpointObserver,
		factory: BreakpointObserver.ɵfac
	});
};
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(BreakpointObserver, [{ type: Service }], null, null);
})();
function splitQueries(queries) {
	return queries.map((query) => query.split(",")).reduce((a1, a2) => a1.concat(a2)).map((query) => query.trim());
}
//#endregion
//#region ../../../node_modules/@angular/cdk/fesm2022/observers.mjs
function shouldIgnoreRecord(record) {
	if (record.type === "characterData" && record.target instanceof Comment) return true;
	if (record.type === "childList") {
		for (let i = 0; i < record.addedNodes.length; i++) if (!(record.addedNodes[i] instanceof Comment)) return false;
		for (let i = 0; i < record.removedNodes.length; i++) if (!(record.removedNodes[i] instanceof Comment)) return false;
		return true;
	}
	return false;
}
var MutationObserverFactory = class MutationObserverFactory {
	create(callback) {
		return typeof MutationObserver === "undefined" ? null : new MutationObserver(callback);
	}
	static ɵfac = function MutationObserverFactory_Factory(__ngFactoryType__) {
		return new (__ngFactoryType__ || MutationObserverFactory)();
	};
	static ɵprov = /* @__PURE__ */ ɵɵdefineService({
		token: MutationObserverFactory,
		factory: MutationObserverFactory.ɵfac
	});
};
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MutationObserverFactory, [{ type: Service }], null, null);
})();
var ContentObserver = class ContentObserver {
	_mutationObserverFactory = inject(MutationObserverFactory);
	_observedElements = /* @__PURE__ */ new Map();
	_ngZone = inject(NgZone);
	ngOnDestroy() {
		this._observedElements.forEach((_, element) => this._cleanupObserver(element));
	}
	observe(elementOrRef) {
		const element = coerceElement(elementOrRef);
		return new Observable((observer) => {
			const subscription = this._observeElement(element).pipe(map((records) => records.filter((record) => !shouldIgnoreRecord(record))), filter((records) => !!records.length)).subscribe((records) => {
				this._ngZone.run(() => {
					observer.next(records);
				});
			});
			return () => {
				subscription.unsubscribe();
				this._unobserveElement(element);
			};
		});
	}
	_observeElement(element) {
		return this._ngZone.runOutsideAngular(() => {
			if (!this._observedElements.has(element)) {
				const stream = new Subject();
				const observer = this._mutationObserverFactory.create((mutations) => stream.next(mutations));
				if (observer) observer.observe(element, {
					characterData: true,
					childList: true,
					subtree: true
				});
				this._observedElements.set(element, {
					observer,
					stream,
					count: 1
				});
			} else this._observedElements.get(element).count++;
			return this._observedElements.get(element).stream;
		});
	}
	_unobserveElement(element) {
		if (this._observedElements.has(element)) {
			this._observedElements.get(element).count--;
			if (!this._observedElements.get(element).count) this._cleanupObserver(element);
		}
	}
	_cleanupObserver(element) {
		if (this._observedElements.has(element)) {
			const { observer, stream } = this._observedElements.get(element);
			if (observer) observer.disconnect();
			stream.complete();
			this._observedElements.delete(element);
		}
	}
	static ɵfac = function ContentObserver_Factory(__ngFactoryType__) {
		return new (__ngFactoryType__ || ContentObserver)();
	};
	static ɵprov = /* @__PURE__ */ ɵɵdefineService({
		token: ContentObserver,
		factory: ContentObserver.ɵfac
	});
};
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ContentObserver, [{ type: Service }], null, null);
})();
var CdkObserveContent = class CdkObserveContent {
	_contentObserver = inject(ContentObserver);
	_elementRef = inject(ElementRef);
	event = new EventEmitter();
	get disabled() {
		return this._disabled;
	}
	set disabled(value) {
		this._disabled = value;
		this._disabled ? this._unsubscribe() : this._subscribe();
	}
	_disabled = false;
	get debounce() {
		return this._debounce;
	}
	set debounce(value) {
		this._debounce = coerceNumberProperty(value);
		this._subscribe();
	}
	_debounce;
	_currentSubscription = null;
	ngAfterContentInit() {
		if (!this._currentSubscription && !this.disabled) this._subscribe();
	}
	ngOnDestroy() {
		this._unsubscribe();
	}
	_subscribe() {
		this._unsubscribe();
		const stream = this._contentObserver.observe(this._elementRef);
		this._currentSubscription = (this.debounce ? stream.pipe(debounceTime(this.debounce)) : stream).subscribe(this.event);
	}
	_unsubscribe() {
		this._currentSubscription?.unsubscribe();
	}
	static ɵfac = function CdkObserveContent_Factory(__ngFactoryType__) {
		return new (__ngFactoryType__ || CdkObserveContent)();
	};
	static ɵdir = /* @__PURE__ */ ɵɵdefineDirective({
		type: CdkObserveContent,
		selectors: [[
			"",
			"cdkObserveContent",
			""
		]],
		inputs: {
			disabled: [
				2,
				"cdkObserveContentDisabled",
				"disabled",
				booleanAttribute
			],
			debounce: "debounce"
		},
		outputs: { event: "cdkObserveContent" },
		exportAs: ["cdkObserveContent"]
	});
};
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CdkObserveContent, [{
		type: Directive,
		args: [{
			selector: "[cdkObserveContent]",
			exportAs: "cdkObserveContent"
		}]
	}], null, {
		event: [{
			type: Output,
			args: ["cdkObserveContent"]
		}],
		disabled: [{
			type: Input,
			args: [{
				alias: "cdkObserveContentDisabled",
				transform: booleanAttribute
			}]
		}],
		debounce: [{ type: Input }]
	});
})();
var ObserversModule = class ObserversModule {
	static ɵfac = function ObserversModule_Factory(__ngFactoryType__) {
		return new (__ngFactoryType__ || ObserversModule)();
	};
	static ɵmod = /* @__PURE__ */ ɵɵdefineNgModule({
		type: ObserversModule,
		imports: [CdkObserveContent],
		exports: [CdkObserveContent]
	});
	static ɵinj = /* @__PURE__ */ ɵɵdefineInjector({ providers: [MutationObserverFactory] });
};
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ObserversModule, [{
		type: NgModule,
		args: [{
			imports: [CdkObserveContent],
			exports: [CdkObserveContent],
			providers: [MutationObserverFactory]
		}]
	}], null, null);
})();
//#endregion
//#region ../../../node_modules/@angular/cdk/fesm2022/_a11y-module-chunk.mjs
var InteractivityChecker = class InteractivityChecker {
	_platform = inject(Platform);
	isDisabled(element) {
		return element.hasAttribute("disabled");
	}
	isVisible(element) {
		return hasGeometry(element) && getComputedStyle(element).visibility === "visible";
	}
	isTabbable(element) {
		if (!this._platform.isBrowser) return false;
		const frameElement = getFrameElement(getWindow(element));
		if (frameElement) {
			if (getTabIndexValue(frameElement) === -1) return false;
			if (!this.isVisible(frameElement)) return false;
		}
		let nodeName = element.nodeName.toLowerCase();
		let tabIndexValue = getTabIndexValue(element);
		if (element.hasAttribute("contenteditable")) return tabIndexValue !== -1;
		if (nodeName === "iframe" || nodeName === "object") return false;
		if (this._platform.WEBKIT && this._platform.IOS && !isPotentiallyTabbableIOS(element)) return false;
		if (nodeName === "audio") {
			if (!element.hasAttribute("controls")) return false;
			return tabIndexValue !== -1;
		}
		if (nodeName === "video") {
			if (tabIndexValue === -1) return false;
			if (tabIndexValue !== null) return true;
			return this._platform.FIREFOX || element.hasAttribute("controls");
		}
		return element.tabIndex >= 0;
	}
	isFocusable(element, config) {
		return isPotentiallyFocusable(element) && !this.isDisabled(element) && (config?.ignoreVisibility || this.isVisible(element));
	}
	static ɵfac = function InteractivityChecker_Factory(__ngFactoryType__) {
		return new (__ngFactoryType__ || InteractivityChecker)();
	};
	static ɵprov = /* @__PURE__ */ ɵɵdefineService({
		token: InteractivityChecker,
		factory: InteractivityChecker.ɵfac
	});
};
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(InteractivityChecker, [{ type: Service }], null, null);
})();
function getFrameElement(window) {
	try {
		return window.frameElement;
	} catch {
		return null;
	}
}
function hasGeometry(element) {
	return !!(element.offsetWidth || element.offsetHeight || typeof element.getClientRects === "function" && element.getClientRects().length);
}
function isNativeFormElement(element) {
	let nodeName = element.nodeName.toLowerCase();
	return nodeName === "input" || nodeName === "select" || nodeName === "button" || nodeName === "textarea";
}
function isHiddenInput(element) {
	return isInputElement(element) && element.type == "hidden";
}
function isAnchorWithHref(element) {
	return isAnchorElement(element) && element.hasAttribute("href");
}
function isInputElement(element) {
	return element.nodeName.toLowerCase() == "input";
}
function isAnchorElement(element) {
	return element.nodeName.toLowerCase() == "a";
}
function hasValidTabIndex(element) {
	if (!element.hasAttribute("tabindex") || element.tabIndex === void 0) return false;
	let tabIndex = element.getAttribute("tabindex");
	return !!(tabIndex && !isNaN(parseInt(tabIndex, 10)));
}
function getTabIndexValue(element) {
	if (!hasValidTabIndex(element)) return null;
	const tabIndex = parseInt(element.getAttribute("tabindex") || "", 10);
	return isNaN(tabIndex) ? -1 : tabIndex;
}
function isPotentiallyTabbableIOS(element) {
	let nodeName = element.nodeName.toLowerCase();
	let inputType = nodeName === "input" && element.type;
	return inputType === "text" || inputType === "password" || nodeName === "select" || nodeName === "textarea";
}
function isPotentiallyFocusable(element) {
	if (isHiddenInput(element)) return false;
	return isNativeFormElement(element) || isAnchorWithHref(element) || element.hasAttribute("contenteditable") || hasValidTabIndex(element);
}
function getWindow(node) {
	return node.ownerDocument && node.ownerDocument.defaultView || window;
}
var FocusTrap = class {
	_element;
	_checker;
	_ngZone;
	_document;
	_injector;
	_startAnchor = null;
	_endAnchor = null;
	_hasAttached = false;
	startAnchorListener = () => this.focusLastTabbableElement();
	endAnchorListener = () => this.focusFirstTabbableElement();
	get enabled() {
		return this._enabled;
	}
	set enabled(value) {
		this._enabled = value;
		if (this._startAnchor && this._endAnchor) {
			this._toggleAnchorTabIndex(value, this._startAnchor);
			this._toggleAnchorTabIndex(value, this._endAnchor);
		}
	}
	_enabled = true;
	constructor(_element, _checker, _ngZone, _document, deferAnchors = false, _injector) {
		this._element = _element;
		this._checker = _checker;
		this._ngZone = _ngZone;
		this._document = _document;
		this._injector = _injector;
		if (!deferAnchors) this.attachAnchors();
	}
	destroy() {
		const startAnchor = this._startAnchor;
		const endAnchor = this._endAnchor;
		if (startAnchor) {
			startAnchor.removeEventListener("focus", this.startAnchorListener);
			startAnchor.remove();
		}
		if (endAnchor) {
			endAnchor.removeEventListener("focus", this.endAnchorListener);
			endAnchor.remove();
		}
		this._startAnchor = this._endAnchor = null;
		this._hasAttached = false;
	}
	attachAnchors() {
		if (this._hasAttached) return true;
		this._ngZone.runOutsideAngular(() => {
			if (!this._startAnchor) {
				this._startAnchor = this._createAnchor();
				this._startAnchor.addEventListener("focus", this.startAnchorListener);
			}
			if (!this._endAnchor) {
				this._endAnchor = this._createAnchor();
				this._endAnchor.addEventListener("focus", this.endAnchorListener);
			}
		});
		if (this._element.parentNode) {
			this._element.parentNode.insertBefore(this._startAnchor, this._element);
			this._element.parentNode.insertBefore(this._endAnchor, this._element.nextSibling);
			this._hasAttached = true;
		}
		return this._hasAttached;
	}
	focusInitialElementWhenReady(options) {
		return new Promise((resolve) => {
			this._executeOnStable(() => resolve(this.focusInitialElement(options)));
		});
	}
	focusFirstTabbableElementWhenReady(options) {
		return new Promise((resolve) => {
			this._executeOnStable(() => resolve(this.focusFirstTabbableElement(options)));
		});
	}
	focusLastTabbableElementWhenReady(options) {
		return new Promise((resolve) => {
			this._executeOnStable(() => resolve(this.focusLastTabbableElement(options)));
		});
	}
	_getRegionBoundary(bound) {
		const markers = this._element.querySelectorAll(`[cdk-focus-region-${bound}], [cdkFocusRegion${bound}], [cdk-focus-${bound}]`);
		if (typeof ngDevMode === "undefined" || ngDevMode) {
			for (let i = 0; i < markers.length; i++) if (markers[i].hasAttribute(`cdk-focus-${bound}`)) console.warn(`Found use of deprecated attribute 'cdk-focus-${bound}', use 'cdkFocusRegion${bound}' instead. The deprecated attribute will be removed in 8.0.0.`, markers[i]);
			else if (markers[i].hasAttribute(`cdk-focus-region-${bound}`)) console.warn(`Found use of deprecated attribute 'cdk-focus-region-${bound}', use 'cdkFocusRegion${bound}' instead. The deprecated attribute will be removed in 8.0.0.`, markers[i]);
		}
		if (bound == "start") return markers.length ? markers[0] : this._getFirstTabbableElement(this._element);
		return markers.length ? markers[markers.length - 1] : this._getLastTabbableElement(this._element);
	}
	focusInitialElement(options) {
		const redirectToElement = this._element.querySelector("[cdk-focus-initial], [cdkFocusInitial]");
		if (redirectToElement) {
			if ((typeof ngDevMode === "undefined" || ngDevMode) && redirectToElement.hasAttribute(`cdk-focus-initial`)) console.warn("Found use of deprecated attribute 'cdk-focus-initial', use 'cdkFocusInitial' instead. The deprecated attribute will be removed in 8.0.0", redirectToElement);
			if ((typeof ngDevMode === "undefined" || ngDevMode) && !this._checker.isFocusable(redirectToElement)) console.warn(`Element matching '[cdkFocusInitial]' is not focusable.`, redirectToElement);
			if (!this._checker.isFocusable(redirectToElement)) {
				const focusableChild = this._getFirstTabbableElement(redirectToElement);
				focusableChild?.focus(options);
				return !!focusableChild;
			}
			redirectToElement.focus(options);
			return true;
		}
		return this.focusFirstTabbableElement(options);
	}
	focusFirstTabbableElement(options) {
		const redirectToElement = this._getRegionBoundary("start");
		if (redirectToElement) redirectToElement.focus(options);
		return !!redirectToElement;
	}
	focusLastTabbableElement(options) {
		const redirectToElement = this._getRegionBoundary("end");
		if (redirectToElement) redirectToElement.focus(options);
		return !!redirectToElement;
	}
	hasAttached() {
		return this._hasAttached;
	}
	_getFirstTabbableElement(root) {
		if (this._checker.isFocusable(root) && this._checker.isTabbable(root)) return root;
		const children = root.children;
		for (let i = 0; i < children.length; i++) {
			const tabbableChild = children[i].nodeType === this._document.ELEMENT_NODE ? this._getFirstTabbableElement(children[i]) : null;
			if (tabbableChild) return tabbableChild;
		}
		return null;
	}
	_getLastTabbableElement(root) {
		if (this._checker.isFocusable(root) && this._checker.isTabbable(root)) return root;
		const children = root.children;
		for (let i = children.length - 1; i >= 0; i--) {
			const tabbableChild = children[i].nodeType === this._document.ELEMENT_NODE ? this._getLastTabbableElement(children[i]) : null;
			if (tabbableChild) return tabbableChild;
		}
		return null;
	}
	_createAnchor() {
		const anchor = this._document.createElement("div");
		this._toggleAnchorTabIndex(this._enabled, anchor);
		anchor.classList.add("cdk-visually-hidden");
		anchor.classList.add("cdk-focus-trap-anchor");
		anchor.setAttribute("aria-hidden", "true");
		return anchor;
	}
	_toggleAnchorTabIndex(isEnabled, anchor) {
		isEnabled ? anchor.setAttribute("tabindex", "0") : anchor.removeAttribute("tabindex");
	}
	toggleAnchors(enabled) {
		if (this._startAnchor && this._endAnchor) {
			this._toggleAnchorTabIndex(enabled, this._startAnchor);
			this._toggleAnchorTabIndex(enabled, this._endAnchor);
		}
	}
	_executeOnStable(fn) {
		afterNextRender(fn, { injector: this._injector });
	}
};
var FocusTrapFactory = class FocusTrapFactory {
	_checker = inject(InteractivityChecker);
	_ngZone = inject(NgZone);
	_document = inject(DOCUMENT);
	_injector = inject(Injector);
	constructor() {
		inject(_CdkPrivateStyleLoader).load(_VisuallyHiddenLoader);
	}
	create(element, deferCaptureElements = false) {
		return new FocusTrap(element, this._checker, this._ngZone, this._document, deferCaptureElements, this._injector);
	}
	static ɵfac = function FocusTrapFactory_Factory(__ngFactoryType__) {
		return new (__ngFactoryType__ || FocusTrapFactory)();
	};
	static ɵprov = /* @__PURE__ */ ɵɵdefineService({
		token: FocusTrapFactory,
		factory: FocusTrapFactory.ɵfac
	});
};
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FocusTrapFactory, [{ type: Service }], () => [], null);
})();
var CdkTrapFocus = class CdkTrapFocus {
	_elementRef = inject(ElementRef);
	_focusTrapFactory = inject(FocusTrapFactory);
	focusTrap = void 0;
	_previouslyFocusedElement = null;
	get enabled() {
		return this.focusTrap?.enabled || false;
	}
	set enabled(value) {
		if (this.focusTrap) this.focusTrap.enabled = value;
	}
	autoCapture = false;
	constructor() {
		if (inject(Platform).isBrowser) this.focusTrap = this._focusTrapFactory.create(this._elementRef.nativeElement, true);
	}
	ngOnDestroy() {
		this.focusTrap?.destroy();
		if (this._previouslyFocusedElement) {
			this._previouslyFocusedElement.focus();
			this._previouslyFocusedElement = null;
		}
	}
	ngAfterContentInit() {
		this.focusTrap?.attachAnchors();
		if (this.autoCapture) this._captureFocus();
	}
	ngDoCheck() {
		if (this.focusTrap && !this.focusTrap.hasAttached()) this.focusTrap.attachAnchors();
	}
	ngOnChanges(changes) {
		const autoCaptureChange = changes["autoCapture"];
		if (autoCaptureChange && !autoCaptureChange.firstChange && this.autoCapture && this.focusTrap?.hasAttached()) this._captureFocus();
	}
	_captureFocus() {
		this._previouslyFocusedElement = _getFocusedElementPierceShadowDom();
		this.focusTrap?.focusInitialElementWhenReady();
	}
	static ɵfac = function CdkTrapFocus_Factory(__ngFactoryType__) {
		return new (__ngFactoryType__ || CdkTrapFocus)();
	};
	static ɵdir = /* @__PURE__ */ ɵɵdefineDirective({
		type: CdkTrapFocus,
		selectors: [[
			"",
			"cdkTrapFocus",
			""
		]],
		inputs: {
			enabled: [
				2,
				"cdkTrapFocus",
				"enabled",
				booleanAttribute
			],
			autoCapture: [
				2,
				"cdkTrapFocusAutoCapture",
				"autoCapture",
				booleanAttribute
			]
		},
		exportAs: ["cdkTrapFocus"],
		features: [ɵɵNgOnChangesFeature]
	});
};
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CdkTrapFocus, [{
		type: Directive,
		args: [{
			selector: "[cdkTrapFocus]",
			exportAs: "cdkTrapFocus"
		}]
	}], () => [], {
		enabled: [{
			type: Input,
			args: [{
				alias: "cdkTrapFocus",
				transform: booleanAttribute
			}]
		}],
		autoCapture: [{
			type: Input,
			args: [{
				alias: "cdkTrapFocusAutoCapture",
				transform: booleanAttribute
			}]
		}]
	});
})();
var LIVE_ANNOUNCER_ELEMENT_TOKEN = new InjectionToken("liveAnnouncerElement", {
	providedIn: "root",
	factory: () => null
});
var LIVE_ANNOUNCER_DEFAULT_OPTIONS = new InjectionToken("LIVE_ANNOUNCER_DEFAULT_OPTIONS");
var uniqueIds = 0;
var LiveAnnouncer = class LiveAnnouncer {
	_ngZone = inject(NgZone);
	_defaultOptions = inject(LIVE_ANNOUNCER_DEFAULT_OPTIONS, { optional: true });
	_liveElement;
	_document = inject(DOCUMENT);
	_sanitizer = inject(DomSanitizer);
	_previousTimeout;
	_currentPromise;
	_currentResolve;
	constructor() {
		const elementToken = inject(LIVE_ANNOUNCER_ELEMENT_TOKEN, { optional: true });
		this._liveElement = elementToken || this._createLiveElement();
	}
	announce(message, ...args) {
		const defaultOptions = this._defaultOptions;
		let politeness;
		let duration;
		if (args.length === 1 && typeof args[0] === "number") duration = args[0];
		else [politeness, duration] = args;
		this.clear();
		clearTimeout(this._previousTimeout);
		if (!politeness) politeness = defaultOptions && defaultOptions.politeness ? defaultOptions.politeness : "polite";
		if (duration == null && defaultOptions) duration = defaultOptions.duration;
		this._liveElement.setAttribute("aria-live", politeness);
		if (this._liveElement.id) this._exposeAnnouncerToModals(this._liveElement.id);
		return this._ngZone.runOutsideAngular(() => {
			if (!this._currentPromise) this._currentPromise = new Promise((resolve) => this._currentResolve = resolve);
			clearTimeout(this._previousTimeout);
			this._previousTimeout = setTimeout(() => {
				if (!message || typeof message === "string") this._liveElement.textContent = message;
				else _setInnerHtml(this._liveElement, message, this._sanitizer);
				if (typeof duration === "number") this._previousTimeout = setTimeout(() => this.clear(), duration);
				this._currentResolve?.();
				this._currentPromise = this._currentResolve = void 0;
			}, 100);
			return this._currentPromise;
		});
	}
	clear() {
		if (this._liveElement) this._liveElement.textContent = "";
	}
	ngOnDestroy() {
		clearTimeout(this._previousTimeout);
		this._liveElement?.remove();
		this._liveElement = null;
		this._currentResolve?.();
		this._currentPromise = this._currentResolve = void 0;
	}
	_createLiveElement() {
		const elementClass = "cdk-live-announcer-element";
		const previousElements = this._document.getElementsByClassName(elementClass);
		const liveEl = this._document.createElement("div");
		for (let i = 0; i < previousElements.length; i++) previousElements[i].remove();
		liveEl.classList.add(elementClass);
		liveEl.classList.add("cdk-visually-hidden");
		liveEl.setAttribute("aria-atomic", "true");
		liveEl.setAttribute("aria-live", "polite");
		liveEl.id = `cdk-live-announcer-${uniqueIds++}`;
		this._document.body.appendChild(liveEl);
		return liveEl;
	}
	_exposeAnnouncerToModals(id) {
		const modals = this._document.querySelectorAll("body > .cdk-overlay-container [aria-modal=\"true\"]");
		for (let i = 0; i < modals.length; i++) {
			const modal = modals[i];
			const ariaOwns = modal.getAttribute("aria-owns");
			if (!ariaOwns) modal.setAttribute("aria-owns", id);
			else if (ariaOwns.indexOf(id) === -1) modal.setAttribute("aria-owns", ariaOwns + " " + id);
		}
	}
	static ɵfac = function LiveAnnouncer_Factory(__ngFactoryType__) {
		return new (__ngFactoryType__ || LiveAnnouncer)();
	};
	static ɵprov = /* @__PURE__ */ ɵɵdefineService({
		token: LiveAnnouncer,
		factory: LiveAnnouncer.ɵfac
	});
};
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(LiveAnnouncer, [{ type: Service }], () => [], null);
})();
var CdkAriaLive = class CdkAriaLive {
	_elementRef = inject(ElementRef);
	_liveAnnouncer = inject(LiveAnnouncer);
	_contentObserver = inject(ContentObserver);
	_ngZone = inject(NgZone);
	get politeness() {
		return this._politeness;
	}
	set politeness(value) {
		this._politeness = value === "off" || value === "assertive" ? value : "polite";
		if (this._politeness === "off") {
			if (this._subscription) {
				this._subscription.unsubscribe();
				this._subscription = void 0;
			}
		} else if (!this._subscription) this._subscription = this._ngZone.runOutsideAngular(() => {
			return this._contentObserver.observe(this._elementRef).subscribe(() => {
				const elementText = this._elementRef.nativeElement.textContent;
				if (elementText !== this._previousAnnouncedText) {
					this._liveAnnouncer.announce(elementText, this._politeness, this.duration);
					this._previousAnnouncedText = elementText;
				}
			});
		});
	}
	_politeness = "polite";
	duration;
	_previousAnnouncedText;
	_subscription;
	constructor() {
		inject(_CdkPrivateStyleLoader).load(_VisuallyHiddenLoader);
	}
	ngOnDestroy() {
		this._subscription?.unsubscribe();
	}
	static ɵfac = function CdkAriaLive_Factory(__ngFactoryType__) {
		return new (__ngFactoryType__ || CdkAriaLive)();
	};
	static ɵdir = /* @__PURE__ */ ɵɵdefineDirective({
		type: CdkAriaLive,
		selectors: [[
			"",
			"cdkAriaLive",
			""
		]],
		inputs: {
			politeness: [
				0,
				"cdkAriaLive",
				"politeness"
			],
			duration: [
				0,
				"cdkAriaLiveDuration",
				"duration"
			]
		},
		exportAs: ["cdkAriaLive"]
	});
};
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CdkAriaLive, [{
		type: Directive,
		args: [{
			selector: "[cdkAriaLive]",
			exportAs: "cdkAriaLive"
		}]
	}], () => [], {
		politeness: [{
			type: Input,
			args: ["cdkAriaLive"]
		}],
		duration: [{
			type: Input,
			args: ["cdkAriaLiveDuration"]
		}]
	});
})();
var HighContrastMode;
(function(HighContrastMode) {
	HighContrastMode[HighContrastMode["NONE"] = 0] = "NONE";
	HighContrastMode[HighContrastMode["BLACK_ON_WHITE"] = 1] = "BLACK_ON_WHITE";
	HighContrastMode[HighContrastMode["WHITE_ON_BLACK"] = 2] = "WHITE_ON_BLACK";
})(HighContrastMode || (HighContrastMode = {}));
var BLACK_ON_WHITE_CSS_CLASS = "cdk-high-contrast-black-on-white";
var WHITE_ON_BLACK_CSS_CLASS = "cdk-high-contrast-white-on-black";
var HIGH_CONTRAST_MODE_ACTIVE_CSS_CLASS = "cdk-high-contrast-active";
var HighContrastModeDetector = class HighContrastModeDetector {
	_platform = inject(Platform);
	_hasCheckedHighContrastMode = false;
	_document = inject(DOCUMENT);
	_breakpointSubscription;
	constructor() {
		this._breakpointSubscription = inject(BreakpointObserver).observe("(forced-colors: active)").subscribe(() => {
			if (this._hasCheckedHighContrastMode) {
				this._hasCheckedHighContrastMode = false;
				this._applyBodyHighContrastModeCssClasses();
			}
		});
	}
	getHighContrastMode() {
		if (!this._platform.isBrowser) return HighContrastMode.NONE;
		const testElement = this._document.createElement("div");
		testElement.style.backgroundColor = "rgb(1,2,3)";
		testElement.style.position = "absolute";
		this._document.body.appendChild(testElement);
		const documentWindow = this._document.defaultView || window;
		const computedStyle = documentWindow && documentWindow.getComputedStyle ? documentWindow.getComputedStyle(testElement) : null;
		const computedColor = (computedStyle && computedStyle.backgroundColor || "").replace(/ /g, "");
		testElement.remove();
		switch (computedColor) {
			case "rgb(0,0,0)":
			case "rgb(45,50,54)":
			case "rgb(32,32,32)": return HighContrastMode.WHITE_ON_BLACK;
			case "rgb(255,255,255)":
			case "rgb(255,250,239)": return HighContrastMode.BLACK_ON_WHITE;
		}
		return HighContrastMode.NONE;
	}
	ngOnDestroy() {
		this._breakpointSubscription.unsubscribe();
	}
	_applyBodyHighContrastModeCssClasses() {
		if (!this._hasCheckedHighContrastMode && this._platform.isBrowser && this._document.body) {
			const bodyClasses = this._document.body.classList;
			bodyClasses.remove(HIGH_CONTRAST_MODE_ACTIVE_CSS_CLASS, BLACK_ON_WHITE_CSS_CLASS, WHITE_ON_BLACK_CSS_CLASS);
			this._hasCheckedHighContrastMode = true;
			const mode = this.getHighContrastMode();
			if (mode === HighContrastMode.BLACK_ON_WHITE) bodyClasses.add(HIGH_CONTRAST_MODE_ACTIVE_CSS_CLASS, BLACK_ON_WHITE_CSS_CLASS);
			else if (mode === HighContrastMode.WHITE_ON_BLACK) bodyClasses.add(HIGH_CONTRAST_MODE_ACTIVE_CSS_CLASS, WHITE_ON_BLACK_CSS_CLASS);
		}
	}
	static ɵfac = function HighContrastModeDetector_Factory(__ngFactoryType__) {
		return new (__ngFactoryType__ || HighContrastModeDetector)();
	};
	static ɵprov = /* @__PURE__ */ ɵɵdefineService({
		token: HighContrastModeDetector,
		factory: HighContrastModeDetector.ɵfac
	});
};
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(HighContrastModeDetector, [{ type: Service }], () => [], null);
})();
var A11yModule = class A11yModule {
	constructor() {
		inject(HighContrastModeDetector)._applyBodyHighContrastModeCssClasses();
	}
	static ɵfac = function A11yModule_Factory(__ngFactoryType__) {
		return new (__ngFactoryType__ || A11yModule)();
	};
	static ɵmod = /* @__PURE__ */ ɵɵdefineNgModule({
		type: A11yModule,
		imports: [
			ObserversModule,
			CdkAriaLive,
			CdkTrapFocus,
			CdkMonitorFocus
		],
		exports: [
			CdkAriaLive,
			CdkTrapFocus,
			CdkMonitorFocus
		]
	});
	static ɵinj = /* @__PURE__ */ ɵɵdefineInjector({ imports: [ObserversModule] });
};
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(A11yModule, [{
		type: NgModule,
		args: [{
			imports: [
				ObserversModule,
				CdkAriaLive,
				CdkTrapFocus,
				CdkMonitorFocus
			],
			exports: [
				CdkAriaLive,
				CdkTrapFocus,
				CdkMonitorFocus
			]
		}]
	}], () => [], null);
})();
//#endregion
//#region ../../../node_modules/@angular/cdk/fesm2022/a11y.mjs
var ID_DELIMITER = " ";
function addAriaReferencedId(el, attr, id) {
	const ids = getAriaReferenceIds(el, attr);
	id = id.trim();
	if (ids.some((existingId) => existingId.trim() === id)) return;
	ids.push(id);
	el.setAttribute(attr, ids.join(ID_DELIMITER));
}
function removeAriaReferencedId(el, attr, id) {
	const ids = getAriaReferenceIds(el, attr);
	id = id.trim();
	const filteredIds = ids.filter((val) => val !== id);
	if (filteredIds.length) el.setAttribute(attr, filteredIds.join(ID_DELIMITER));
	else el.removeAttribute(attr);
}
function getAriaReferenceIds(el, attr) {
	return el.getAttribute(attr)?.match(/\S+/g) ?? [];
}
var CDK_DESCRIBEDBY_ID_PREFIX = "cdk-describedby-message";
var CDK_DESCRIBEDBY_HOST_ATTRIBUTE = "cdk-describedby-host";
var nextId = 0;
var AriaDescriber = class AriaDescriber {
	_platform = inject(Platform);
	_document = inject(DOCUMENT);
	_messageRegistry = /* @__PURE__ */ new Map();
	_messagesContainer = null;
	_id = `${nextId++}`;
	constructor() {
		inject(_CdkPrivateStyleLoader).load(_VisuallyHiddenLoader);
		this._id = inject(APP_ID) + "-" + nextId++;
	}
	describe(hostElement, message, role) {
		if (!this._canBeDescribed(hostElement, message)) return;
		const key = getKey(message, role);
		if (typeof message !== "string") {
			setMessageId(message, this._id);
			this._messageRegistry.set(key, {
				messageElement: message,
				referenceCount: 0
			});
		} else if (!this._messageRegistry.has(key)) this._createMessageElement(message, role);
		if (!this._isElementDescribedByMessage(hostElement, key)) this._addMessageReference(hostElement, key);
	}
	removeDescription(hostElement, message, role) {
		if (!message || !this._isElementNode(hostElement)) return;
		const key = getKey(message, role);
		if (this._isElementDescribedByMessage(hostElement, key)) this._removeMessageReference(hostElement, key);
		if (typeof message === "string") {
			const registeredMessage = this._messageRegistry.get(key);
			if (registeredMessage && registeredMessage.referenceCount === 0) this._deleteMessageElement(key);
		}
		if (this._messagesContainer?.childNodes.length === 0) {
			this._messagesContainer.remove();
			this._messagesContainer = null;
		}
	}
	ngOnDestroy() {
		const describedElements = this._document.querySelectorAll(`[${CDK_DESCRIBEDBY_HOST_ATTRIBUTE}="${this._id}"]`);
		for (let i = 0; i < describedElements.length; i++) {
			this._removeCdkDescribedByReferenceIds(describedElements[i]);
			describedElements[i].removeAttribute(CDK_DESCRIBEDBY_HOST_ATTRIBUTE);
		}
		this._messagesContainer?.remove();
		this._messagesContainer = null;
		this._messageRegistry.clear();
	}
	_createMessageElement(message, role) {
		const messageElement = this._document.createElement("div");
		setMessageId(messageElement, this._id);
		messageElement.textContent = message;
		if (role) messageElement.setAttribute("role", role);
		this._createMessagesContainer();
		this._messagesContainer.appendChild(messageElement);
		this._messageRegistry.set(getKey(message, role), {
			messageElement,
			referenceCount: 0
		});
	}
	_deleteMessageElement(key) {
		this._messageRegistry.get(key)?.messageElement?.remove();
		this._messageRegistry.delete(key);
	}
	_createMessagesContainer() {
		if (this._messagesContainer) return;
		const containerClassName = "cdk-describedby-message-container";
		const serverContainers = this._document.querySelectorAll(`.${containerClassName}[platform="server"]`);
		for (let i = 0; i < serverContainers.length; i++) serverContainers[i].remove();
		const messagesContainer = this._document.createElement("div");
		messagesContainer.style.visibility = "hidden";
		messagesContainer.classList.add(containerClassName);
		messagesContainer.classList.add("cdk-visually-hidden");
		if (!this._platform.isBrowser) messagesContainer.setAttribute("platform", "server");
		this._document.body.appendChild(messagesContainer);
		this._messagesContainer = messagesContainer;
	}
	_removeCdkDescribedByReferenceIds(element) {
		const originalReferenceIds = getAriaReferenceIds(element, "aria-describedby").filter((id) => id.indexOf(CDK_DESCRIBEDBY_ID_PREFIX) != 0);
		element.setAttribute("aria-describedby", originalReferenceIds.join(" "));
	}
	_addMessageReference(element, key) {
		const registeredMessage = this._messageRegistry.get(key);
		addAriaReferencedId(element, "aria-describedby", registeredMessage.messageElement.id);
		element.setAttribute(CDK_DESCRIBEDBY_HOST_ATTRIBUTE, this._id);
		registeredMessage.referenceCount++;
	}
	_removeMessageReference(element, key) {
		const registeredMessage = this._messageRegistry.get(key);
		registeredMessage.referenceCount--;
		removeAriaReferencedId(element, "aria-describedby", registeredMessage.messageElement.id);
		element.removeAttribute(CDK_DESCRIBEDBY_HOST_ATTRIBUTE);
	}
	_isElementDescribedByMessage(element, key) {
		const referenceIds = getAriaReferenceIds(element, "aria-describedby");
		const registeredMessage = this._messageRegistry.get(key);
		const messageId = registeredMessage && registeredMessage.messageElement.id;
		return !!messageId && referenceIds.indexOf(messageId) != -1;
	}
	_canBeDescribed(element, message) {
		if (!this._isElementNode(element)) return false;
		if (message && typeof message === "object") return true;
		const trimmedMessage = message == null ? "" : `${message}`.trim();
		const ariaLabel = element.getAttribute("aria-label");
		return trimmedMessage ? !ariaLabel || ariaLabel.trim() !== trimmedMessage : false;
	}
	_isElementNode(element) {
		return element.nodeType === this._document.ELEMENT_NODE;
	}
	static ɵfac = function AriaDescriber_Factory(__ngFactoryType__) {
		return new (__ngFactoryType__ || AriaDescriber)();
	};
	static ɵprov = /* @__PURE__ */ ɵɵdefineService({
		token: AriaDescriber,
		factory: AriaDescriber.ɵfac
	});
};
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AriaDescriber, [{ type: Service }], () => [], null);
})();
function getKey(message, role) {
	return typeof message === "string" ? `${role || ""}/${message}` : message;
}
function setMessageId(element, serviceId) {
	if (!element.id) element.id = `${CDK_DESCRIBEDBY_ID_PREFIX}-${serviceId}-${nextId++}`;
}
var ConfigurableFocusTrap = class extends FocusTrap {
	_focusTrapManager;
	_inertStrategy;
	get enabled() {
		return this._enabled;
	}
	set enabled(value) {
		this._enabled = value;
		if (this._enabled) this._focusTrapManager.register(this);
		else this._focusTrapManager.deregister(this);
	}
	constructor(_element, _checker, _ngZone, _document, _focusTrapManager, _inertStrategy, config, injector) {
		super(_element, _checker, _ngZone, _document, config.defer, injector);
		this._focusTrapManager = _focusTrapManager;
		this._inertStrategy = _inertStrategy;
		this._focusTrapManager.register(this);
	}
	destroy() {
		this._focusTrapManager.deregister(this);
		super.destroy();
	}
	_enable() {
		this._inertStrategy.preventFocus(this);
		this.toggleAnchors(true);
	}
	_disable() {
		this._inertStrategy.allowFocus(this);
		this.toggleAnchors(false);
	}
};
var EventListenerFocusTrapInertStrategy = class {
	_listener = null;
	preventFocus(focusTrap) {
		if (this._listener) focusTrap._document.removeEventListener("focus", this._listener, true);
		this._listener = (e) => this._trapFocus(focusTrap, e);
		focusTrap._ngZone.runOutsideAngular(() => {
			focusTrap._document.addEventListener("focus", this._listener, true);
		});
	}
	allowFocus(focusTrap) {
		if (!this._listener) return;
		focusTrap._document.removeEventListener("focus", this._listener, true);
		this._listener = null;
	}
	_trapFocus(focusTrap, event) {
		const target = event.target;
		const focusTrapRoot = focusTrap._element;
		if (target && !focusTrapRoot.contains(target) && !target.closest?.("div.cdk-overlay-pane")) setTimeout(() => {
			if (focusTrap.enabled && !focusTrapRoot.contains(focusTrap._document.activeElement)) focusTrap.focusFirstTabbableElement();
		});
	}
};
var FOCUS_TRAP_INERT_STRATEGY = new InjectionToken("FOCUS_TRAP_INERT_STRATEGY");
var FocusTrapManager = class FocusTrapManager {
	_focusTrapStack = [];
	register(focusTrap) {
		this._focusTrapStack = this._focusTrapStack.filter((ft) => ft !== focusTrap);
		let stack = this._focusTrapStack;
		if (stack.length) stack[stack.length - 1]._disable();
		stack.push(focusTrap);
		focusTrap._enable();
	}
	deregister(focusTrap) {
		focusTrap._disable();
		const stack = this._focusTrapStack;
		const i = stack.indexOf(focusTrap);
		if (i !== -1) {
			stack.splice(i, 1);
			if (stack.length) stack[stack.length - 1]._enable();
		}
	}
	static ɵfac = function FocusTrapManager_Factory(__ngFactoryType__) {
		return new (__ngFactoryType__ || FocusTrapManager)();
	};
	static ɵprov = /* @__PURE__ */ ɵɵdefineService({
		token: FocusTrapManager,
		factory: FocusTrapManager.ɵfac
	});
};
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FocusTrapManager, [{ type: Service }], null, null);
})();
var ConfigurableFocusTrapFactory = class ConfigurableFocusTrapFactory {
	_checker = inject(InteractivityChecker);
	_ngZone = inject(NgZone);
	_focusTrapManager = inject(FocusTrapManager);
	_document = inject(DOCUMENT);
	_inertStrategy;
	_injector = inject(Injector);
	constructor() {
		const inertStrategy = inject(FOCUS_TRAP_INERT_STRATEGY, { optional: true });
		this._inertStrategy = inertStrategy || new EventListenerFocusTrapInertStrategy();
	}
	create(element, config = { defer: false }) {
		return new ConfigurableFocusTrap(element, this._checker, this._ngZone, this._document, this._focusTrapManager, this._inertStrategy, config, this._injector);
	}
	static ɵfac = function ConfigurableFocusTrapFactory_Factory(__ngFactoryType__) {
		return new (__ngFactoryType__ || ConfigurableFocusTrapFactory)();
	};
	static ɵprov = /* @__PURE__ */ ɵɵdefineService({
		token: ConfigurableFocusTrapFactory,
		factory: ConfigurableFocusTrapFactory.ɵfac
	});
};
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ConfigurableFocusTrapFactory, [{ type: Service }], () => [], null);
})();
//#endregion
//#region ../../../node_modules/@angular/cdk/fesm2022/platform.mjs
var PlatformModule = class PlatformModule {
	static ɵfac = function PlatformModule_Factory(__ngFactoryType__) {
		return new (__ngFactoryType__ || PlatformModule)();
	};
	static ɵmod = /* @__PURE__ */ ɵɵdefineNgModule({ type: PlatformModule });
	static ɵinj = /* @__PURE__ */ ɵɵdefineInjector({});
};
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(PlatformModule, [{
		type: NgModule,
		args: [{}]
	}], null, null);
})();
//#endregion
//#region ../../../node_modules/@angular/cdk/fesm2022/layout.mjs
var LayoutModule = class LayoutModule {
	static ɵfac = function LayoutModule_Factory(__ngFactoryType__) {
		return new (__ngFactoryType__ || LayoutModule)();
	};
	static ɵmod = /* @__PURE__ */ ɵɵdefineNgModule({ type: LayoutModule });
	static ɵinj = /* @__PURE__ */ ɵɵdefineInjector({});
};
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(LayoutModule, [{
		type: NgModule,
		args: [{}]
	}], null, null);
})();
//#endregion
//#region ../../../node_modules/@angular/material/fesm2022/_animation-chunk.mjs
var MATERIAL_ANIMATIONS = new InjectionToken("MATERIAL_ANIMATIONS");
var reducedMotion = null;
function _getAnimationsState() {
	if (inject(MATERIAL_ANIMATIONS, { optional: true })?.animationsDisabled || inject(ANIMATION_MODULE_TYPE, { optional: true }) === "NoopAnimations") return "di-disabled";
	reducedMotion ??= inject(MediaMatcher).matchMedia("(prefers-reduced-motion)").matches;
	return reducedMotion ? "reduced-motion" : "enabled";
}
function _animationsDisabled() {
	return _getAnimationsState() !== "enabled";
}
//#endregion
//#region ../../../node_modules/@angular/material/fesm2022/_ripple-chunk.mjs
var RippleState;
(function(RippleState) {
	RippleState[RippleState["FADING_IN"] = 0] = "FADING_IN";
	RippleState[RippleState["VISIBLE"] = 1] = "VISIBLE";
	RippleState[RippleState["FADING_OUT"] = 2] = "FADING_OUT";
	RippleState[RippleState["HIDDEN"] = 3] = "HIDDEN";
})(RippleState || (RippleState = {}));
var RippleRef = class {
	_renderer;
	element;
	config;
	_animationForciblyDisabledThroughCss;
	state = RippleState.HIDDEN;
	constructor(_renderer, element, config, _animationForciblyDisabledThroughCss = false) {
		this._renderer = _renderer;
		this.element = element;
		this.config = config;
		this._animationForciblyDisabledThroughCss = _animationForciblyDisabledThroughCss;
	}
	fadeOut() {
		this._renderer.fadeOutRipple(this);
	}
};
var passiveCapturingEventOptions$1 = normalizePassiveListenerOptions({
	passive: true,
	capture: true
});
var RippleEventManager = class {
	_events = /* @__PURE__ */ new Map();
	addHandler(ngZone, name, element, handler) {
		const handlersForEvent = this._events.get(name);
		if (handlersForEvent) {
			const handlersForElement = handlersForEvent.get(element);
			if (handlersForElement) handlersForElement.add(handler);
			else handlersForEvent.set(element, /* @__PURE__ */ new Set([handler]));
		} else {
			this._events.set(name, /* @__PURE__ */ new Map([[element, /* @__PURE__ */ new Set([handler])]]));
			ngZone.runOutsideAngular(() => {
				document.addEventListener(name, this._delegateEventHandler, passiveCapturingEventOptions$1);
			});
		}
	}
	removeHandler(name, element, handler) {
		const handlersForEvent = this._events.get(name);
		if (!handlersForEvent) return;
		const handlersForElement = handlersForEvent.get(element);
		if (!handlersForElement) return;
		handlersForElement.delete(handler);
		if (handlersForElement.size === 0) handlersForEvent.delete(element);
		if (handlersForEvent.size === 0) {
			this._events.delete(name);
			document.removeEventListener(name, this._delegateEventHandler, passiveCapturingEventOptions$1);
		}
	}
	_delegateEventHandler = (event) => {
		const target = _getEventTarget(event);
		if (target) this._events.get(event.type)?.forEach((handlers, element) => {
			if (element === target || element.contains(target)) handlers.forEach((handler) => handler.handleEvent(event));
		});
	};
};
var defaultRippleAnimationConfig = {
	enterDuration: 225,
	exitDuration: 150
};
var ignoreMouseEventsTimeout = 800;
var passiveCapturingEventOptions = normalizePassiveListenerOptions({
	passive: true,
	capture: true
});
var pointerDownEvents = ["mousedown", "touchstart"];
var pointerUpEvents = [
	"mouseup",
	"mouseleave",
	"touchend",
	"touchcancel"
];
var _MatRippleStylesLoader = class _MatRippleStylesLoader {
	static ɵfac = function _MatRippleStylesLoader_Factory(__ngFactoryType__) {
		return new (__ngFactoryType__ || _MatRippleStylesLoader)();
	};
	static ɵcmp = /* @__PURE__ */ ɵɵdefineComponent({
		type: _MatRippleStylesLoader,
		selectors: [["ng-component"]],
		hostAttrs: ["mat-ripple-style-loader", ""],
		decls: 0,
		vars: 0,
		template: function _MatRippleStylesLoader_Template(rf, ctx) {},
		styles: [".mat-ripple {\n  overflow: hidden;\n  position: relative;\n}\n.mat-ripple:not(:empty) {\n  transform: translateZ(0);\n}\n\n.mat-ripple.mat-ripple-unbounded {\n  overflow: visible;\n}\n\n.mat-ripple-element {\n  position: absolute;\n  border-radius: 50%;\n  pointer-events: none;\n  transition: opacity, transform 0ms cubic-bezier(0, 0, 0.2, 1);\n  transform: scale3d(0, 0, 0);\n  background-color: var(--%NS%mat-ripple-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) 10%, transparent));\n}\n@media (forced-colors: active) {\n  .mat-ripple-element {\n    display: none;\n  }\n}\n.cdk-drag-preview .mat-ripple-element, .cdk-drag-placeholder .mat-ripple-element {\n  display: none;\n}\n"],
		encapsulation: 2
	});
};
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(_MatRippleStylesLoader, [{
		type: Component,
		args: [{
			template: "",
			encapsulation: ViewEncapsulation.None,
			host: { "mat-ripple-style-loader": "" },
			styles: [".mat-ripple {\n  overflow: hidden;\n  position: relative;\n}\n.mat-ripple:not(:empty) {\n  transform: translateZ(0);\n}\n\n.mat-ripple.mat-ripple-unbounded {\n  overflow: visible;\n}\n\n.mat-ripple-element {\n  position: absolute;\n  border-radius: 50%;\n  pointer-events: none;\n  transition: opacity, transform 0ms cubic-bezier(0, 0, 0.2, 1);\n  transform: scale3d(0, 0, 0);\n  background-color: var(--mat-ripple-color, color-mix(in srgb, var(--mat-sys-on-surface) 10%, transparent));\n}\n@media (forced-colors: active) {\n  .mat-ripple-element {\n    display: none;\n  }\n}\n.cdk-drag-preview .mat-ripple-element, .cdk-drag-placeholder .mat-ripple-element {\n  display: none;\n}\n"]
		}]
	}], null, null);
})();
var RippleRenderer = class RippleRenderer {
	_target;
	_ngZone;
	_platform;
	_containerElement;
	_triggerElement = null;
	_isPointerDown = false;
	_activeRipples = /* @__PURE__ */ new Map();
	_mostRecentTransientRipple = null;
	_lastTouchStartEvent;
	_pointerUpEventsRegistered = false;
	_containerRect = null;
	static _eventManager = new RippleEventManager();
	constructor(_target, _ngZone, elementOrElementRef, _platform, injector) {
		this._target = _target;
		this._ngZone = _ngZone;
		this._platform = _platform;
		if (_platform.isBrowser) this._containerElement = coerceElement(elementOrElementRef);
		if (injector) injector.get(_CdkPrivateStyleLoader).load(_MatRippleStylesLoader);
	}
	fadeInRipple(x, y, config = {}) {
		const containerRect = this._containerRect = this._containerRect || this._containerElement.getBoundingClientRect();
		const animationConfig = {
			...defaultRippleAnimationConfig,
			...config.animation
		};
		if (config.centered) {
			x = containerRect.left + containerRect.width / 2;
			y = containerRect.top + containerRect.height / 2;
		}
		const radius = config.radius || distanceToFurthestCorner(x, y, containerRect);
		const offsetX = x - containerRect.left;
		const offsetY = y - containerRect.top;
		const enterDuration = animationConfig.enterDuration;
		const ripple = document.createElement("div");
		ripple.classList.add("mat-ripple-element");
		ripple.style.left = `${offsetX - radius}px`;
		ripple.style.top = `${offsetY - radius}px`;
		ripple.style.height = `${radius * 2}px`;
		ripple.style.width = `${radius * 2}px`;
		if (config.color != null) ripple.style.backgroundColor = config.color;
		ripple.style.transitionDuration = `${enterDuration}ms`;
		this._containerElement.appendChild(ripple);
		const computedStyles = window.getComputedStyle(ripple);
		const userTransitionProperty = computedStyles.transitionProperty;
		const userTransitionDuration = computedStyles.transitionDuration;
		const animationForciblyDisabledThroughCss = userTransitionProperty === "none" || userTransitionDuration === "0s" || userTransitionDuration === "0s, 0s" || containerRect.width === 0 && containerRect.height === 0;
		const rippleRef = new RippleRef(this, ripple, config, animationForciblyDisabledThroughCss);
		ripple.style.transform = "scale3d(1, 1, 1)";
		rippleRef.state = RippleState.FADING_IN;
		if (!config.persistent) this._mostRecentTransientRipple = rippleRef;
		let eventListeners = null;
		if (!animationForciblyDisabledThroughCss && (enterDuration || animationConfig.exitDuration)) this._ngZone.runOutsideAngular(() => {
			const onTransitionEnd = () => {
				if (eventListeners) eventListeners.fallbackTimer = null;
				clearTimeout(fallbackTimer);
				this._finishRippleTransition(rippleRef);
			};
			const onTransitionCancel = () => this._destroyRipple(rippleRef);
			const fallbackTimer = setTimeout(onTransitionCancel, enterDuration + 100);
			ripple.addEventListener("transitionend", onTransitionEnd);
			ripple.addEventListener("transitioncancel", onTransitionCancel);
			eventListeners = {
				onTransitionEnd,
				onTransitionCancel,
				fallbackTimer
			};
		});
		this._activeRipples.set(rippleRef, eventListeners);
		if (animationForciblyDisabledThroughCss || !enterDuration) this._finishRippleTransition(rippleRef);
		return rippleRef;
	}
	fadeOutRipple(rippleRef) {
		if (rippleRef.state === RippleState.FADING_OUT || rippleRef.state === RippleState.HIDDEN) return;
		const rippleEl = rippleRef.element;
		const animationConfig = {
			...defaultRippleAnimationConfig,
			...rippleRef.config.animation
		};
		rippleEl.style.transitionDuration = `${animationConfig.exitDuration}ms`;
		rippleEl.style.opacity = "0";
		rippleRef.state = RippleState.FADING_OUT;
		if (rippleRef._animationForciblyDisabledThroughCss || !animationConfig.exitDuration) this._finishRippleTransition(rippleRef);
	}
	fadeOutAll() {
		this._getActiveRipples().forEach((ripple) => ripple.fadeOut());
	}
	fadeOutAllNonPersistent() {
		this._getActiveRipples().forEach((ripple) => {
			if (!ripple.config.persistent) ripple.fadeOut();
		});
	}
	setupTriggerEvents(elementOrElementRef) {
		const element = coerceElement(elementOrElementRef);
		if (!this._platform.isBrowser || !element || element === this._triggerElement) return;
		this._removeTriggerEvents();
		this._triggerElement = element;
		pointerDownEvents.forEach((type) => {
			RippleRenderer._eventManager.addHandler(this._ngZone, type, element, this);
		});
	}
	handleEvent(event) {
		if (event.type === "mousedown") this._onMousedown(event);
		else if (event.type === "touchstart") this._onTouchStart(event);
		else this._onPointerUp();
		if (!this._pointerUpEventsRegistered) {
			this._ngZone.runOutsideAngular(() => {
				pointerUpEvents.forEach((type) => {
					this._triggerElement.addEventListener(type, this, passiveCapturingEventOptions);
				});
			});
			this._pointerUpEventsRegistered = true;
		}
	}
	_finishRippleTransition(rippleRef) {
		if (rippleRef.state === RippleState.FADING_IN) this._startFadeOutTransition(rippleRef);
		else if (rippleRef.state === RippleState.FADING_OUT) this._destroyRipple(rippleRef);
	}
	_startFadeOutTransition(rippleRef) {
		const isMostRecentTransientRipple = rippleRef === this._mostRecentTransientRipple;
		const { persistent } = rippleRef.config;
		rippleRef.state = RippleState.VISIBLE;
		if (!persistent && (!isMostRecentTransientRipple || !this._isPointerDown)) rippleRef.fadeOut();
	}
	_destroyRipple(rippleRef) {
		const eventListeners = this._activeRipples.get(rippleRef) ?? null;
		this._activeRipples.delete(rippleRef);
		if (!this._activeRipples.size) this._containerRect = null;
		if (rippleRef === this._mostRecentTransientRipple) this._mostRecentTransientRipple = null;
		rippleRef.state = RippleState.HIDDEN;
		if (eventListeners !== null) {
			rippleRef.element.removeEventListener("transitionend", eventListeners.onTransitionEnd);
			rippleRef.element.removeEventListener("transitioncancel", eventListeners.onTransitionCancel);
			if (eventListeners.fallbackTimer !== null) clearTimeout(eventListeners.fallbackTimer);
		}
		rippleRef.element.remove();
	}
	_onMousedown(event) {
		const isFakeMousedown = isFakeMousedownFromScreenReader(event);
		const isSyntheticEvent = this._lastTouchStartEvent && Date.now() < this._lastTouchStartEvent + ignoreMouseEventsTimeout;
		if (!this._target.rippleDisabled && !isFakeMousedown && !isSyntheticEvent) {
			this._isPointerDown = true;
			this.fadeInRipple(event.clientX, event.clientY, this._target.rippleConfig);
		}
	}
	_onTouchStart(event) {
		if (!this._target.rippleDisabled && !isFakeTouchstartFromScreenReader(event)) {
			this._lastTouchStartEvent = Date.now();
			this._isPointerDown = true;
			const touches = event.changedTouches;
			if (touches) for (let i = 0; i < touches.length; i++) this.fadeInRipple(touches[i].clientX, touches[i].clientY, this._target.rippleConfig);
		}
	}
	_onPointerUp() {
		if (!this._isPointerDown) return;
		this._isPointerDown = false;
		this._getActiveRipples().forEach((ripple) => {
			const isVisible = ripple.state === RippleState.VISIBLE || ripple.config.terminateOnPointerUp && ripple.state === RippleState.FADING_IN;
			if (!ripple.config.persistent && isVisible) ripple.fadeOut();
		});
	}
	_getActiveRipples() {
		return Array.from(this._activeRipples.keys());
	}
	_removeTriggerEvents() {
		const trigger = this._triggerElement;
		if (trigger) {
			pointerDownEvents.forEach((type) => RippleRenderer._eventManager.removeHandler(type, trigger, this));
			if (this._pointerUpEventsRegistered) {
				pointerUpEvents.forEach((type) => trigger.removeEventListener(type, this, passiveCapturingEventOptions));
				this._pointerUpEventsRegistered = false;
			}
		}
	}
};
function distanceToFurthestCorner(x, y, rect) {
	const distX = Math.max(Math.abs(x - rect.left), Math.abs(x - rect.right));
	const distY = Math.max(Math.abs(y - rect.top), Math.abs(y - rect.bottom));
	return Math.sqrt(distX * distX + distY * distY);
}
var MAT_RIPPLE_GLOBAL_OPTIONS = new InjectionToken("mat-ripple-global-options");
var MatRipple = class MatRipple {
	_elementRef = inject(ElementRef);
	_animationsDisabled = _animationsDisabled();
	color;
	unbounded = false;
	centered = false;
	radius = 0;
	animation;
	get disabled() {
		return this._disabled;
	}
	set disabled(value) {
		if (value) this.fadeOutAllNonPersistent();
		this._disabled = value;
		this._setupTriggerEventsIfEnabled();
	}
	_disabled = false;
	get trigger() {
		return this._trigger || this._elementRef.nativeElement;
	}
	set trigger(trigger) {
		this._trigger = trigger;
		this._setupTriggerEventsIfEnabled();
	}
	_trigger;
	_rippleRenderer;
	_globalOptions;
	_isInitialized = false;
	constructor() {
		const ngZone = inject(NgZone);
		const platform = inject(Platform);
		const globalOptions = inject(MAT_RIPPLE_GLOBAL_OPTIONS, { optional: true });
		const injector = inject(Injector);
		this._globalOptions = globalOptions || {};
		this._rippleRenderer = new RippleRenderer(this, ngZone, this._elementRef, platform, injector);
	}
	ngOnInit() {
		this._isInitialized = true;
		this._setupTriggerEventsIfEnabled();
	}
	ngOnDestroy() {
		this._rippleRenderer._removeTriggerEvents();
	}
	fadeOutAll() {
		this._rippleRenderer.fadeOutAll();
	}
	fadeOutAllNonPersistent() {
		this._rippleRenderer.fadeOutAllNonPersistent();
	}
	get rippleConfig() {
		return {
			centered: this.centered,
			radius: this.radius,
			color: this.color,
			animation: {
				...this._globalOptions.animation,
				...this._animationsDisabled ? {
					enterDuration: 0,
					exitDuration: 0
				} : {},
				...this.animation
			},
			terminateOnPointerUp: this._globalOptions.terminateOnPointerUp
		};
	}
	get rippleDisabled() {
		return this.disabled || !!this._globalOptions.disabled;
	}
	_setupTriggerEventsIfEnabled() {
		if (!this.disabled && this._isInitialized) this._rippleRenderer.setupTriggerEvents(this.trigger);
	}
	launch(configOrX, y = 0, config) {
		if (typeof configOrX === "number") return this._rippleRenderer.fadeInRipple(configOrX, y, {
			...this.rippleConfig,
			...config
		});
		else return this._rippleRenderer.fadeInRipple(0, 0, {
			...this.rippleConfig,
			...configOrX
		});
	}
	static ɵfac = function MatRipple_Factory(__ngFactoryType__) {
		return new (__ngFactoryType__ || MatRipple)();
	};
	static ɵdir = /* @__PURE__ */ ɵɵdefineDirective({
		type: MatRipple,
		selectors: [[
			"",
			"mat-ripple",
			""
		], [
			"",
			"matRipple",
			""
		]],
		hostAttrs: [1, "mat-ripple"],
		hostVars: 2,
		hostBindings: function MatRipple_HostBindings(rf, ctx) {
			if (rf & 2) ɵɵclassProp("mat-ripple-unbounded", ctx.unbounded);
		},
		inputs: {
			color: [
				0,
				"matRippleColor",
				"color"
			],
			unbounded: [
				0,
				"matRippleUnbounded",
				"unbounded"
			],
			centered: [
				0,
				"matRippleCentered",
				"centered"
			],
			radius: [
				0,
				"matRippleRadius",
				"radius"
			],
			animation: [
				0,
				"matRippleAnimation",
				"animation"
			],
			disabled: [
				0,
				"matRippleDisabled",
				"disabled"
			],
			trigger: [
				0,
				"matRippleTrigger",
				"trigger"
			]
		},
		exportAs: ["matRipple"]
	});
};
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatRipple, [{
		type: Directive,
		args: [{
			selector: "[mat-ripple], [matRipple]",
			exportAs: "matRipple",
			host: {
				"class": "mat-ripple",
				"[class.mat-ripple-unbounded]": "unbounded"
			}
		}]
	}], () => [], {
		color: [{
			type: Input,
			args: ["matRippleColor"]
		}],
		unbounded: [{
			type: Input,
			args: ["matRippleUnbounded"]
		}],
		centered: [{
			type: Input,
			args: ["matRippleCentered"]
		}],
		radius: [{
			type: Input,
			args: ["matRippleRadius"]
		}],
		animation: [{
			type: Input,
			args: ["matRippleAnimation"]
		}],
		disabled: [{
			type: Input,
			args: ["matRippleDisabled"]
		}],
		trigger: [{
			type: Input,
			args: ["matRippleTrigger"]
		}]
	});
})();
//#endregion
//#region ../../../node_modules/@angular/material/fesm2022/_ripple-loader-chunk.mjs
var eventListenerOptions = { capture: true };
var rippleInteractionEvents = [
	"focus",
	"mousedown",
	"mouseenter",
	"touchstart"
];
var matRippleUninitialized = "mat-ripple-loader-uninitialized";
var matRippleClassName = "mat-ripple-loader-class-name";
var matRippleCentered = "mat-ripple-loader-centered";
var matRippleDisabled = "mat-ripple-loader-disabled";
var MatRippleLoader = class MatRippleLoader {
	_document = inject(DOCUMENT);
	_animationsDisabled = _animationsDisabled();
	_globalRippleOptions = inject(MAT_RIPPLE_GLOBAL_OPTIONS, { optional: true });
	_platform = inject(Platform);
	_ngZone = inject(NgZone);
	_injector = inject(Injector);
	_eventCleanups;
	_hosts = /* @__PURE__ */ new Map();
	constructor() {
		const renderer = inject(RendererFactory2).createRenderer(null, null);
		this._eventCleanups = this._ngZone.runOutsideAngular(() => rippleInteractionEvents.map((name) => renderer.listen(this._document, name, this._onInteraction, eventListenerOptions)));
	}
	ngOnDestroy() {
		const hosts = this._hosts.keys();
		for (const host of hosts) this.destroyRipple(host);
		this._eventCleanups.forEach((cleanup) => cleanup());
	}
	configureRipple(host, config) {
		host.setAttribute(matRippleUninitialized, this._globalRippleOptions?.namespace ?? "");
		if (config.className || !host.hasAttribute(matRippleClassName)) host.setAttribute(matRippleClassName, config.className || "");
		if (config.centered) host.setAttribute(matRippleCentered, "");
		if (config.disabled) host.setAttribute(matRippleDisabled, "");
	}
	setDisabled(host, disabled) {
		const ripple = this._hosts.get(host);
		if (ripple) {
			ripple.target.rippleDisabled = disabled;
			if (!disabled && !ripple.hasSetUpEvents) {
				ripple.hasSetUpEvents = true;
				ripple.renderer.setupTriggerEvents(host);
			}
		} else if (disabled) host.setAttribute(matRippleDisabled, "");
		else host.removeAttribute(matRippleDisabled);
	}
	_onInteraction = (event) => {
		const eventTarget = _getEventTarget(event);
		if (eventTarget instanceof HTMLElement) {
			const element = eventTarget.closest(`[${matRippleUninitialized}="${this._globalRippleOptions?.namespace ?? ""}"]`);
			if (element) this._createRipple(element);
		}
	};
	_createRipple(host) {
		if (!this._document || this._hosts.has(host)) return;
		host.querySelector(".mat-ripple")?.remove();
		const rippleEl = this._document.createElement("span");
		rippleEl.classList.add("mat-ripple", host.getAttribute(matRippleClassName));
		host.append(rippleEl);
		const globalOptions = this._globalRippleOptions;
		const enterDuration = this._animationsDisabled ? 0 : globalOptions?.animation?.enterDuration ?? defaultRippleAnimationConfig.enterDuration;
		const exitDuration = this._animationsDisabled ? 0 : globalOptions?.animation?.exitDuration ?? defaultRippleAnimationConfig.exitDuration;
		const target = {
			rippleDisabled: this._animationsDisabled || globalOptions?.disabled || host.hasAttribute(matRippleDisabled),
			rippleConfig: {
				centered: host.hasAttribute(matRippleCentered),
				terminateOnPointerUp: globalOptions?.terminateOnPointerUp,
				animation: {
					enterDuration,
					exitDuration
				}
			}
		};
		const renderer = new RippleRenderer(target, this._ngZone, rippleEl, this._platform, this._injector);
		const hasSetUpEvents = !target.rippleDisabled;
		if (hasSetUpEvents) renderer.setupTriggerEvents(host);
		this._hosts.set(host, {
			target,
			renderer,
			hasSetUpEvents
		});
		host.removeAttribute(matRippleUninitialized);
	}
	destroyRipple(host) {
		const ripple = this._hosts.get(host);
		if (ripple) {
			ripple.renderer._removeTriggerEvents();
			this._hosts.delete(host);
		}
	}
	static ɵfac = function MatRippleLoader_Factory(__ngFactoryType__) {
		return new (__ngFactoryType__ || MatRippleLoader)();
	};
	static ɵprov = /* @__PURE__ */ ɵɵdefineService({
		token: MatRippleLoader,
		factory: MatRippleLoader.ɵfac
	});
};
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatRippleLoader, [{ type: Service }], () => [], null);
})();
//#endregion
//#region ../../../node_modules/@angular/material/fesm2022/_structural-styles-chunk.mjs
var _StructuralStylesLoader = class _StructuralStylesLoader {
	static ɵfac = function _StructuralStylesLoader_Factory(__ngFactoryType__) {
		return new (__ngFactoryType__ || _StructuralStylesLoader)();
	};
	static ɵcmp = /* @__PURE__ */ ɵɵdefineComponent({
		type: _StructuralStylesLoader,
		selectors: [["structural-styles"]],
		decls: 0,
		vars: 0,
		template: function _StructuralStylesLoader_Template(rf, ctx) {},
		styles: [".mat-focus-indicator {\n  position: relative;\n}\n.mat-focus-indicator::before {\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  position: absolute;\n  box-sizing: border-box;\n  pointer-events: none;\n  display: var(--%NS%mat-focus-indicator-display, none);\n  border-width: var(--%NS%mat-focus-indicator-border-width, 3px);\n  border-style: var(--%NS%mat-focus-indicator-border-style, solid);\n  border-color: var(--%NS%mat-focus-indicator-border-color, transparent);\n  border-radius: var(--%NS%mat-focus-indicator-border-radius, 4px);\n}\n.mat-focus-indicator:focus-visible::before {\n  content: \"\";\n}\n\n@media (forced-colors: active) {\n  html {\n    --%NS%mat-focus-indicator-display: block;\n    --%NS%mat-focus-indicator-fallback-border-style: none;\n  }\n}\n"],
		encapsulation: 2
	});
};
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(_StructuralStylesLoader, [{
		type: Component,
		args: [{
			selector: "structural-styles",
			encapsulation: ViewEncapsulation.None,
			template: "",
			styles: [".mat-focus-indicator {\n  position: relative;\n}\n.mat-focus-indicator::before {\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  position: absolute;\n  box-sizing: border-box;\n  pointer-events: none;\n  display: var(--mat-focus-indicator-display, none);\n  border-width: var(--mat-focus-indicator-border-width, 3px);\n  border-style: var(--mat-focus-indicator-border-style, solid);\n  border-color: var(--mat-focus-indicator-border-color, transparent);\n  border-radius: var(--mat-focus-indicator-border-radius, 4px);\n}\n.mat-focus-indicator:focus-visible::before {\n  content: \"\";\n}\n\n@media (forced-colors: active) {\n  html {\n    --mat-focus-indicator-display: block;\n    --mat-focus-indicator-fallback-border-style: none;\n  }\n}\n"]
		}]
	}], null, null);
})();
//#endregion
//#region ../../../node_modules/@angular/material/fesm2022/_icon-button-chunk.mjs
var _c0$1 = ["*", [[
	"",
	"progressIndicator",
	""
]]];
var _c1$1 = ["*", "[progressIndicator]"];
function MatIconButton_Conditional_2_Template(rf, ctx) {
	if (rf & 1) {
		ɵɵdomElementStart(0, "div", 1);
		ɵɵprojection(1, 1);
		ɵɵdomElementEnd();
	}
}
var MAT_BUTTON_CONFIG = new InjectionToken("MAT_BUTTON_CONFIG");
function transformTabIndex(value) {
	return value == null ? void 0 : numberAttribute(value);
}
var MatButtonBase = class MatButtonBase {
	_elementRef = inject(ElementRef);
	_ngZone = inject(NgZone);
	_animationsDisabled = _animationsDisabled();
	_config = inject(MAT_BUTTON_CONFIG, { optional: true });
	_focusMonitor = inject(FocusMonitor);
	_cleanupClick;
	_renderer = inject(Renderer2);
	_rippleLoader = inject(MatRippleLoader);
	_isAnchor;
	_isFab = false;
	color;
	get disableRipple() {
		return this._disableRipple;
	}
	set disableRipple(value) {
		this._disableRipple = value;
		this._updateRippleDisabled();
	}
	_disableRipple = false;
	get disabled() {
		return this._disabled;
	}
	set disabled(value) {
		this._disabled = value;
		this._updateRippleDisabled();
	}
	_disabled = false;
	ariaDisabled;
	disabledInteractive;
	tabIndex;
	set _tabindex(value) {
		this.tabIndex = value;
	}
	showProgress = input(false, {
		...ngDevMode ? { debugName: "showProgress" } : {},
		transform: booleanAttribute
	});
	constructor() {
		inject(_CdkPrivateStyleLoader).load(_StructuralStylesLoader);
		const element = this._elementRef.nativeElement;
		this._isAnchor = element.tagName === "A";
		this.disabledInteractive = this._config?.disabledInteractive ?? false;
		this.color = this._config?.color ?? null;
		this._rippleLoader?.configureRipple(element, { className: "mat-mdc-button-ripple" });
	}
	ngAfterViewInit() {
		this._focusMonitor.monitor(this._elementRef, true);
		if (this._isAnchor) this._setupAsAnchor();
	}
	ngOnDestroy() {
		this._cleanupClick?.();
		this._focusMonitor.stopMonitoring(this._elementRef);
		this._rippleLoader?.destroyRipple(this._elementRef.nativeElement);
	}
	focus(origin = "program", options) {
		if (origin) this._focusMonitor.focusVia(this._elementRef.nativeElement, origin, options);
		else this._elementRef.nativeElement.focus(options);
	}
	_getAriaDisabled() {
		if (this.ariaDisabled != null) return this.ariaDisabled;
		if (this._isAnchor) return this.disabled || null;
		return this.disabled && this.disabledInteractive ? true : null;
	}
	_getDisabledAttribute() {
		return this.disabledInteractive || !this.disabled ? null : true;
	}
	_updateRippleDisabled() {
		this._rippleLoader?.setDisabled(this._elementRef.nativeElement, this.disableRipple || this.disabled);
	}
	_getTabIndex() {
		if (this._isAnchor) return this.disabled && !this.disabledInteractive ? -1 : this.tabIndex;
		return this.tabIndex;
	}
	_setupAsAnchor() {
		this._cleanupClick = this._ngZone.runOutsideAngular(() => this._renderer.listen(this._elementRef.nativeElement, "click", (event) => {
			if (this.disabled) {
				event.preventDefault();
				event.stopImmediatePropagation();
			}
		}));
	}
	static ɵfac = function MatButtonBase_Factory(__ngFactoryType__) {
		return new (__ngFactoryType__ || MatButtonBase)();
	};
	static ɵdir = /* @__PURE__ */ ɵɵdefineDirective({
		type: MatButtonBase,
		hostAttrs: [1, "mat-mdc-button-base"],
		hostVars: 15,
		hostBindings: function MatButtonBase_HostBindings(rf, ctx) {
			if (rf & 2) {
				ɵɵattribute("disabled", ctx._getDisabledAttribute())("aria-disabled", ctx._getAriaDisabled())("tabindex", ctx._getTabIndex());
				ɵɵclassMap(ctx.color ? "mat-" + ctx.color : "");
				ɵɵclassProp("mat-mdc-button-progress-indicator-shown", ctx.showProgress())("mat-mdc-button-disabled", ctx.disabled)("mat-mdc-button-disabled-interactive", ctx.disabledInteractive)("mat-unthemed", !ctx.color)("_mat-animation-noopable", ctx._animationsDisabled);
			}
		},
		inputs: {
			color: "color",
			disableRipple: [
				2,
				"disableRipple",
				"disableRipple",
				booleanAttribute
			],
			disabled: [
				2,
				"disabled",
				"disabled",
				booleanAttribute
			],
			ariaDisabled: [
				2,
				"aria-disabled",
				"ariaDisabled",
				booleanAttribute
			],
			disabledInteractive: [
				2,
				"disabledInteractive",
				"disabledInteractive",
				booleanAttribute
			],
			tabIndex: [
				2,
				"tabIndex",
				"tabIndex",
				transformTabIndex
			],
			_tabindex: [
				2,
				"tabindex",
				"_tabindex",
				transformTabIndex
			],
			showProgress: [1, "showProgress"]
		}
	});
};
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatButtonBase, [{
		type: Directive,
		args: [{ host: {
			"class": "mat-mdc-button-base",
			"[class]": "color ? \"mat-\" + color : \"\"",
			"[class.mat-mdc-button-progress-indicator-shown]": "showProgress()",
			"[attr.disabled]": "_getDisabledAttribute()",
			"[attr.aria-disabled]": "_getAriaDisabled()",
			"[attr.tabindex]": "_getTabIndex()",
			"[class.mat-mdc-button-disabled]": "disabled",
			"[class.mat-mdc-button-disabled-interactive]": "disabledInteractive",
			"[class.mat-unthemed]": "!color",
			"[class._mat-animation-noopable]": "_animationsDisabled"
		} }]
	}], () => [], {
		color: [{ type: Input }],
		disableRipple: [{
			type: Input,
			args: [{ transform: booleanAttribute }]
		}],
		disabled: [{
			type: Input,
			args: [{ transform: booleanAttribute }]
		}],
		ariaDisabled: [{
			type: Input,
			args: [{
				transform: booleanAttribute,
				alias: "aria-disabled"
			}]
		}],
		disabledInteractive: [{
			type: Input,
			args: [{ transform: booleanAttribute }]
		}],
		tabIndex: [{
			type: Input,
			args: [{ transform: transformTabIndex }]
		}],
		_tabindex: [{
			type: Input,
			args: [{
				alias: "tabindex",
				transform: transformTabIndex
			}]
		}],
		showProgress: [{
			type: Input,
			args: [{
				isSignal: true,
				alias: "showProgress",
				required: false
			}]
		}]
	});
})();
var MatIconButton = class MatIconButton extends MatButtonBase {
	constructor() {
		super();
		this._rippleLoader.configureRipple(this._elementRef.nativeElement, { centered: true });
	}
	static ɵfac = function MatIconButton_Factory(__ngFactoryType__) {
		return new (__ngFactoryType__ || MatIconButton)();
	};
	static ɵcmp = /* @__PURE__ */ ɵɵdefineComponent({
		type: MatIconButton,
		selectors: [
			[
				"button",
				"mat-icon-button",
				""
			],
			[
				"a",
				"mat-icon-button",
				""
			],
			[
				"button",
				"matIconButton",
				""
			],
			[
				"a",
				"matIconButton",
				""
			]
		],
		hostAttrs: [
			1,
			"mdc-icon-button",
			"mat-mdc-icon-button"
		],
		exportAs: ["matButton", "matAnchor"],
		features: [ɵɵInheritDefinitionFeature],
		ngContentSelectors: _c1$1,
		decls: 5,
		vars: 1,
		consts: [
			[
				1,
				"mat-mdc-button-persistent-ripple",
				"mdc-icon-button__ripple"
			],
			[1, "mat-mdc-button-progress-indicator-container"],
			[1, "mat-focus-indicator"],
			[1, "mat-mdc-button-touch-target"]
		],
		template: function MatIconButton_Template(rf, ctx) {
			if (rf & 1) {
				ɵɵprojectionDef(_c0$1);
				ɵɵdomElement(0, "span", 0);
				ɵɵprojection(1);
				ɵɵconditionalCreate(2, MatIconButton_Conditional_2_Template, 2, 0, "div", 1);
				ɵɵdomElement(3, "span", 2)(4, "span", 3);
			}
			if (rf & 2) {
				ɵɵadvance(2);
				ɵɵconditional(ctx.showProgress() ? 2 : -1);
			}
		},
		styles: [".mat-mdc-icon-button {\n  -webkit-user-select: none;\n  user-select: none;\n  display: inline-block;\n  position: relative;\n  box-sizing: border-box;\n  border: none;\n  outline: none;\n  background-color: transparent;\n  fill: currentColor;\n  text-decoration: none;\n  cursor: pointer;\n  z-index: 0;\n  overflow: visible;\n  border-radius: var(--%NS%mat-icon-button-container-shape, var(--%NS%mat-sys-corner-full, 50%));\n  flex-shrink: 0;\n  text-align: center;\n  width: var(--%NS%mat-icon-button-state-layer-size, 40px);\n  height: var(--%NS%mat-icon-button-state-layer-size, 40px);\n  padding: calc(calc(var(--%NS%mat-icon-button-state-layer-size, 40px) - var(--%NS%mat-icon-button-icon-size, 24px)) / 2);\n  font-size: var(--%NS%mat-icon-button-icon-size, 24px);\n  color: var(--%NS%mat-icon-button-icon-color, var(--%NS%mat-sys-on-surface-variant));\n  -webkit-tap-highlight-color: transparent;\n}\n.mat-mdc-icon-button .mat-mdc-button-ripple,\n.mat-mdc-icon-button .mat-mdc-button-persistent-ripple,\n.mat-mdc-icon-button .mat-mdc-button-persistent-ripple::before {\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  position: absolute;\n  pointer-events: none;\n  border-radius: inherit;\n}\n.mat-mdc-icon-button .mat-mdc-button-ripple {\n  overflow: hidden;\n}\n.mat-mdc-icon-button .mat-mdc-button-persistent-ripple::before {\n  content: \"\";\n  opacity: 0;\n}\n.mat-mdc-icon-button .mdc-button__label,\n.mat-mdc-icon-button .mat-icon {\n  z-index: 1;\n  position: relative;\n}\n.mat-mdc-icon-button .mat-focus-indicator {\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  position: absolute;\n  border-radius: inherit;\n}\n.mat-mdc-icon-button:focus-visible > .mat-focus-indicator::before {\n  content: \"\";\n  border-radius: inherit;\n}\n.mat-mdc-icon-button .mat-ripple-element {\n  background-color: var(--%NS%mat-icon-button-ripple-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface-variant) calc(var(--%NS%mat-sys-pressed-state-layer-opacity) * 100%), transparent));\n}\n.mat-mdc-icon-button .mat-mdc-button-persistent-ripple::before {\n  background-color: var(--%NS%mat-icon-button-state-layer-color, var(--%NS%mat-sys-on-surface-variant));\n}\n.mat-mdc-icon-button.mat-mdc-button-disabled .mat-mdc-button-persistent-ripple::before {\n  background-color: var(--%NS%mat-icon-button-disabled-state-layer-color, var(--%NS%mat-sys-on-surface-variant));\n}\n.mat-mdc-icon-button:hover > .mat-mdc-button-persistent-ripple::before {\n  opacity: var(--%NS%mat-icon-button-hover-state-layer-opacity, var(--%NS%mat-sys-hover-state-layer-opacity));\n}\n.mat-mdc-icon-button.cdk-program-focused > .mat-mdc-button-persistent-ripple::before, .mat-mdc-icon-button.cdk-keyboard-focused > .mat-mdc-button-persistent-ripple::before, .mat-mdc-icon-button.mat-mdc-button-disabled-interactive:focus > .mat-mdc-button-persistent-ripple::before {\n  opacity: var(--%NS%mat-icon-button-focus-state-layer-opacity, var(--%NS%mat-sys-focus-state-layer-opacity));\n}\n.mat-mdc-icon-button:active > .mat-mdc-button-persistent-ripple::before {\n  opacity: var(--%NS%mat-icon-button-pressed-state-layer-opacity, var(--%NS%mat-sys-pressed-state-layer-opacity));\n}\n.mat-mdc-icon-button .mat-mdc-button-touch-target {\n  position: absolute;\n  top: 50%;\n  height: var(--%NS%mat-icon-button-touch-target-size, 48px);\n  display: var(--%NS%mat-icon-button-touch-target-display, block);\n  left: 50%;\n  width: var(--%NS%mat-icon-button-touch-target-size, 48px);\n  transform: translate(-50%, -50%);\n}\n.mat-mdc-icon-button._mat-animation-noopable {\n  transition: none !important;\n  animation: none !important;\n}\n.mat-mdc-icon-button[disabled], .mat-mdc-icon-button.mat-mdc-button-disabled {\n  cursor: default;\n  pointer-events: none;\n  color: var(--%NS%mat-icon-button-disabled-icon-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) 38%, transparent));\n}\n.mat-mdc-icon-button.mat-mdc-button-disabled-interactive {\n  pointer-events: auto;\n}\n.mat-mdc-icon-button img,\n.mat-mdc-icon-button svg {\n  width: var(--%NS%mat-icon-button-icon-size, 24px);\n  height: var(--%NS%mat-icon-button-icon-size, 24px);\n  vertical-align: baseline;\n}\n.mat-mdc-icon-button .mat-mdc-button-progress-indicator-container .mdc-circular-progress__determinate-circle-graphic {\n  width: inherit;\n  height: inherit;\n}\n.mat-mdc-icon-button .mat-mdc-button-progress-indicator-container .mdc-circular-progress__indeterminate-circle-graphic {\n  height: 100%;\n}\n.mat-mdc-icon-button .mat-mdc-button-persistent-ripple {\n  border-radius: var(--%NS%mat-icon-button-container-shape, var(--%NS%mat-sys-corner-full, 50%));\n}\n.mat-mdc-icon-button[hidden] {\n  display: none;\n}\n.mat-mdc-icon-button.mat-unthemed:not(.mdc-ripple-upgraded):focus::before, .mat-mdc-icon-button.mat-primary:not(.mdc-ripple-upgraded):focus::before, .mat-mdc-icon-button.mat-accent:not(.mdc-ripple-upgraded):focus::before, .mat-mdc-icon-button.mat-warn:not(.mdc-ripple-upgraded):focus::before {\n  background: transparent;\n  opacity: 1;\n}\n\n.mat-mdc-button-progress-indicator-container {\n  position: absolute;\n  inset-inline-start: 0;\n  inset-block-start: 0;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  width: 100%;\n  height: 100%;\n  box-sizing: border-box;\n}\n\n.mat-mdc-button-progress-indicator-shown mat-icon {\n  visibility: hidden;\n}\n", "@media (forced-colors: active) {\n  .mat-mdc-button:not(.mdc-button--outlined),\n  .mat-mdc-unelevated-button:not(.mdc-button--outlined),\n  .mat-mdc-raised-button:not(.mdc-button--outlined),\n  .mat-mdc-outlined-button:not(.mdc-button--outlined),\n  .mat-mdc-button-base.mat-tonal-button,\n  .mat-mdc-icon-button.mat-mdc-icon-button,\n  .mat-mdc-outlined-button .mdc-button__ripple {\n    outline: solid 1px;\n  }\n}\n"],
		encapsulation: 2
	});
};
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatIconButton, [{
		type: Component,
		args: [{
			selector: `button[mat-icon-button], a[mat-icon-button], button[matIconButton], a[matIconButton]`,
			host: { "class": "mdc-icon-button mat-mdc-icon-button" },
			exportAs: "matButton, matAnchor",
			encapsulation: ViewEncapsulation.None,
			template: "<span class=\"mat-mdc-button-persistent-ripple mdc-icon-button__ripple\"></span>\n\n<ng-content></ng-content>\n\n@if (showProgress()) {\n  <div class=\"mat-mdc-button-progress-indicator-container\">\n    <ng-content select=\"[progressIndicator]\" />\n  </div>\n}\n\n<!--\n  The indicator can't be directly on the button, because MDC uses ::before for high contrast\n  indication and it can't be on the ripple, because it has a border radius and overflow: hidden.\n-->\n<span class=\"mat-focus-indicator\"></span>\n\n<span class=\"mat-mdc-button-touch-target\"></span>\n",
			styles: [".mat-mdc-icon-button {\n  -webkit-user-select: none;\n  user-select: none;\n  display: inline-block;\n  position: relative;\n  box-sizing: border-box;\n  border: none;\n  outline: none;\n  background-color: transparent;\n  fill: currentColor;\n  text-decoration: none;\n  cursor: pointer;\n  z-index: 0;\n  overflow: visible;\n  border-radius: var(--mat-icon-button-container-shape, var(--mat-sys-corner-full, 50%));\n  flex-shrink: 0;\n  text-align: center;\n  width: var(--mat-icon-button-state-layer-size, 40px);\n  height: var(--mat-icon-button-state-layer-size, 40px);\n  padding: calc(calc(var(--mat-icon-button-state-layer-size, 40px) - var(--mat-icon-button-icon-size, 24px)) / 2);\n  font-size: var(--mat-icon-button-icon-size, 24px);\n  color: var(--mat-icon-button-icon-color, var(--mat-sys-on-surface-variant));\n  -webkit-tap-highlight-color: transparent;\n}\n.mat-mdc-icon-button .mat-mdc-button-ripple,\n.mat-mdc-icon-button .mat-mdc-button-persistent-ripple,\n.mat-mdc-icon-button .mat-mdc-button-persistent-ripple::before {\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  position: absolute;\n  pointer-events: none;\n  border-radius: inherit;\n}\n.mat-mdc-icon-button .mat-mdc-button-ripple {\n  overflow: hidden;\n}\n.mat-mdc-icon-button .mat-mdc-button-persistent-ripple::before {\n  content: \"\";\n  opacity: 0;\n}\n.mat-mdc-icon-button .mdc-button__label,\n.mat-mdc-icon-button .mat-icon {\n  z-index: 1;\n  position: relative;\n}\n.mat-mdc-icon-button .mat-focus-indicator {\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  position: absolute;\n  border-radius: inherit;\n}\n.mat-mdc-icon-button:focus-visible > .mat-focus-indicator::before {\n  content: \"\";\n  border-radius: inherit;\n}\n.mat-mdc-icon-button .mat-ripple-element {\n  background-color: var(--mat-icon-button-ripple-color, color-mix(in srgb, var(--mat-sys-on-surface-variant) calc(var(--mat-sys-pressed-state-layer-opacity) * 100%), transparent));\n}\n.mat-mdc-icon-button .mat-mdc-button-persistent-ripple::before {\n  background-color: var(--mat-icon-button-state-layer-color, var(--mat-sys-on-surface-variant));\n}\n.mat-mdc-icon-button.mat-mdc-button-disabled .mat-mdc-button-persistent-ripple::before {\n  background-color: var(--mat-icon-button-disabled-state-layer-color, var(--mat-sys-on-surface-variant));\n}\n.mat-mdc-icon-button:hover > .mat-mdc-button-persistent-ripple::before {\n  opacity: var(--mat-icon-button-hover-state-layer-opacity, var(--mat-sys-hover-state-layer-opacity));\n}\n.mat-mdc-icon-button.cdk-program-focused > .mat-mdc-button-persistent-ripple::before, .mat-mdc-icon-button.cdk-keyboard-focused > .mat-mdc-button-persistent-ripple::before, .mat-mdc-icon-button.mat-mdc-button-disabled-interactive:focus > .mat-mdc-button-persistent-ripple::before {\n  opacity: var(--mat-icon-button-focus-state-layer-opacity, var(--mat-sys-focus-state-layer-opacity));\n}\n.mat-mdc-icon-button:active > .mat-mdc-button-persistent-ripple::before {\n  opacity: var(--mat-icon-button-pressed-state-layer-opacity, var(--mat-sys-pressed-state-layer-opacity));\n}\n.mat-mdc-icon-button .mat-mdc-button-touch-target {\n  position: absolute;\n  top: 50%;\n  height: var(--mat-icon-button-touch-target-size, 48px);\n  display: var(--mat-icon-button-touch-target-display, block);\n  left: 50%;\n  width: var(--mat-icon-button-touch-target-size, 48px);\n  transform: translate(-50%, -50%);\n}\n.mat-mdc-icon-button._mat-animation-noopable {\n  transition: none !important;\n  animation: none !important;\n}\n.mat-mdc-icon-button[disabled], .mat-mdc-icon-button.mat-mdc-button-disabled {\n  cursor: default;\n  pointer-events: none;\n  color: var(--mat-icon-button-disabled-icon-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));\n}\n.mat-mdc-icon-button.mat-mdc-button-disabled-interactive {\n  pointer-events: auto;\n}\n.mat-mdc-icon-button img,\n.mat-mdc-icon-button svg {\n  width: var(--mat-icon-button-icon-size, 24px);\n  height: var(--mat-icon-button-icon-size, 24px);\n  vertical-align: baseline;\n}\n.mat-mdc-icon-button .mat-mdc-button-progress-indicator-container .mdc-circular-progress__determinate-circle-graphic {\n  width: inherit;\n  height: inherit;\n}\n.mat-mdc-icon-button .mat-mdc-button-progress-indicator-container .mdc-circular-progress__indeterminate-circle-graphic {\n  height: 100%;\n}\n.mat-mdc-icon-button .mat-mdc-button-persistent-ripple {\n  border-radius: var(--mat-icon-button-container-shape, var(--mat-sys-corner-full, 50%));\n}\n.mat-mdc-icon-button[hidden] {\n  display: none;\n}\n.mat-mdc-icon-button.mat-unthemed:not(.mdc-ripple-upgraded):focus::before, .mat-mdc-icon-button.mat-primary:not(.mdc-ripple-upgraded):focus::before, .mat-mdc-icon-button.mat-accent:not(.mdc-ripple-upgraded):focus::before, .mat-mdc-icon-button.mat-warn:not(.mdc-ripple-upgraded):focus::before {\n  background: transparent;\n  opacity: 1;\n}\n\n.mat-mdc-button-progress-indicator-container {\n  position: absolute;\n  inset-inline-start: 0;\n  inset-block-start: 0;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  width: 100%;\n  height: 100%;\n  box-sizing: border-box;\n}\n\n.mat-mdc-button-progress-indicator-shown mat-icon {\n  visibility: hidden;\n}\n", "@media (forced-colors: active) {\n  .mat-mdc-button:not(.mdc-button--outlined),\n  .mat-mdc-unelevated-button:not(.mdc-button--outlined),\n  .mat-mdc-raised-button:not(.mdc-button--outlined),\n  .mat-mdc-outlined-button:not(.mdc-button--outlined),\n  .mat-mdc-button-base.mat-tonal-button,\n  .mat-mdc-icon-button.mat-mdc-icon-button,\n  .mat-mdc-outlined-button .mdc-button__ripple {\n    outline: solid 1px;\n  }\n}\n"]
		}]
	}], () => [], null);
})();
var MatIconAnchor = MatIconButton;
//#endregion
//#region ../../../node_modules/@angular/cdk/fesm2022/_directionality-chunk.mjs
var DIR_DOCUMENT = new InjectionToken("cdk-dir-doc", {
	providedIn: "root",
	factory: () => inject(DOCUMENT)
});
var RTL_LOCALE_PATTERN = /^(ar|ckb|dv|he|iw|fa|nqo|ps|sd|ug|ur|yi|.*[-_](Adlm|Arab|Hebr|Nkoo|Rohg|Thaa))(?!.*[-_](Latn|Cyrl)($|-|_))($|-|_)/i;
function _resolveDirectionality(rawValue) {
	const value = rawValue?.toLowerCase() || "";
	if (value === "auto" && typeof navigator !== "undefined" && navigator?.language) return RTL_LOCALE_PATTERN.test(navigator.language) ? "rtl" : "ltr";
	return value === "rtl" ? "rtl" : "ltr";
}
var Directionality = class Directionality {
	get value() {
		return this.valueSignal();
	}
	valueSignal = signal("ltr", ...ngDevMode ? [{ debugName: "valueSignal" }] : []);
	change = new EventEmitter();
	constructor() {
		const _document = inject(DIR_DOCUMENT, { optional: true });
		if (_document) {
			const bodyDir = _document.body ? _document.body.dir : null;
			const htmlDir = _document.documentElement ? _document.documentElement.dir : null;
			this.valueSignal.set(_resolveDirectionality(bodyDir || htmlDir || "ltr"));
		}
	}
	ngOnDestroy() {
		this.change.complete();
	}
	static ɵfac = function Directionality_Factory(__ngFactoryType__) {
		return new (__ngFactoryType__ || Directionality)();
	};
	static ɵprov = /* @__PURE__ */ ɵɵdefineService({
		token: Directionality,
		factory: Directionality.ɵfac
	});
};
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(Directionality, [{ type: Service }], () => [], null);
})();
//#endregion
//#region ../../../node_modules/@angular/cdk/fesm2022/bidi.mjs
var Dir = class Dir {
	_isInitialized = false;
	_rawDir = "";
	change = new EventEmitter();
	get dir() {
		return this.valueSignal();
	}
	set dir(value) {
		const previousValue = this.valueSignal();
		this.valueSignal.set(_resolveDirectionality(value));
		this._rawDir = value;
		if (previousValue !== this.valueSignal() && this._isInitialized) this.change.emit(this.valueSignal());
	}
	get value() {
		return this.dir;
	}
	valueSignal = signal("ltr", ...ngDevMode ? [{ debugName: "valueSignal" }] : []);
	ngAfterContentInit() {
		this._isInitialized = true;
	}
	ngOnDestroy() {
		this.change.complete();
	}
	static ɵfac = function Dir_Factory(__ngFactoryType__) {
		return new (__ngFactoryType__ || Dir)();
	};
	static ɵdir = /* @__PURE__ */ ɵɵdefineDirective({
		type: Dir,
		selectors: [[
			"",
			"dir",
			""
		]],
		hostVars: 1,
		hostBindings: function Dir_HostBindings(rf, ctx) {
			if (rf & 2) ɵɵattribute("dir", ctx._rawDir);
		},
		inputs: { dir: "dir" },
		outputs: { change: "dirChange" },
		exportAs: ["dir"],
		features: [ɵɵProvidersFeature([{
			provide: Directionality,
			useExisting: Dir
		}])]
	});
};
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(Dir, [{
		type: Directive,
		args: [{
			selector: "[dir]",
			providers: [{
				provide: Directionality,
				useExisting: Dir
			}],
			host: { "[attr.dir]": "_rawDir" },
			exportAs: "dir"
		}]
	}], null, {
		change: [{
			type: Output,
			args: ["dirChange"]
		}],
		dir: [{ type: Input }]
	});
})();
var BidiModule = class BidiModule {
	static ɵfac = function BidiModule_Factory(__ngFactoryType__) {
		return new (__ngFactoryType__ || BidiModule)();
	};
	static ɵmod = /* @__PURE__ */ ɵɵdefineNgModule({
		type: BidiModule,
		imports: [Dir],
		exports: [Dir]
	});
	static ɵinj = /* @__PURE__ */ ɵɵdefineInjector({});
};
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(BidiModule, [{
		type: NgModule,
		args: [{
			imports: [Dir],
			exports: [Dir]
		}]
	}], null, null);
})();
//#endregion
//#region ../../../node_modules/@angular/material/fesm2022/_ripple-module-chunk.mjs
var MatRippleModule = class MatRippleModule {
	static ɵfac = function MatRippleModule_Factory(__ngFactoryType__) {
		return new (__ngFactoryType__ || MatRippleModule)();
	};
	static ɵmod = /* @__PURE__ */ ɵɵdefineNgModule({
		type: MatRippleModule,
		imports: [MatRipple],
		exports: [MatRipple, BidiModule]
	});
	static ɵinj = /* @__PURE__ */ ɵɵdefineInjector({ imports: [BidiModule] });
};
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatRippleModule, [{
		type: NgModule,
		args: [{
			imports: [MatRipple],
			exports: [MatRipple, BidiModule]
		}]
	}], null, null);
})();
//#endregion
//#region ../../../node_modules/@angular/material/fesm2022/button.mjs
var _c0 = [
	[
		[
			"",
			8,
			"material-icons",
			3,
			"iconPositionEnd",
			""
		],
		[
			"mat-icon",
			3,
			"iconPositionEnd",
			""
		],
		[
			"",
			"matButtonIcon",
			"",
			3,
			"iconPositionEnd",
			""
		]
	],
	"*",
	[
		[
			"",
			"iconPositionEnd",
			"",
			8,
			"material-icons"
		],
		[
			"mat-icon",
			"iconPositionEnd",
			""
		],
		[
			"",
			"matButtonIcon",
			"",
			"iconPositionEnd",
			""
		]
	],
	[[
		"",
		"progressIndicator",
		""
	]]
];
var _c1 = [
	".material-icons:not([iconPositionEnd]), mat-icon:not([iconPositionEnd]), [matButtonIcon]:not([iconPositionEnd])",
	"*",
	".material-icons[iconPositionEnd], mat-icon[iconPositionEnd], [matButtonIcon][iconPositionEnd]",
	"[progressIndicator]"
];
function MatButton_Conditional_5_Template(rf, ctx) {
	if (rf & 1) {
		ɵɵdomElementStart(0, "div", 2);
		ɵɵprojection(1, 3);
		ɵɵdomElementEnd();
	}
}
function MatFabButton_Conditional_5_Template(rf, ctx) {
	if (rf & 1) {
		ɵɵdomElementStart(0, "div", 2);
		ɵɵprojection(1, 3);
		ɵɵdomElementEnd();
	}
}
function MatMiniFabButton_Conditional_5_Template(rf, ctx) {
	if (rf & 1) {
		ɵɵdomElementStart(0, "div", 2);
		ɵɵprojection(1, 3);
		ɵɵdomElementEnd();
	}
}
var _c2 = ".mat-mdc-fab-base {\n  -webkit-user-select: none;\n  user-select: none;\n  position: relative;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  box-sizing: border-box;\n  width: 56px;\n  height: 56px;\n  padding: 0;\n  border: none;\n  fill: currentColor;\n  text-decoration: none;\n  cursor: pointer;\n  -moz-appearance: none;\n  -webkit-appearance: none;\n  overflow: visible;\n  transition: box-shadow 280ms cubic-bezier(0.4, 0, 0.2, 1), opacity 15ms linear 30ms, transform 270ms 0ms cubic-bezier(0, 0, 0.2, 1);\n  flex-shrink: 0;\n  -webkit-tap-highlight-color: transparent;\n}\n.mat-mdc-fab-base .mat-mdc-button-ripple,\n.mat-mdc-fab-base .mat-mdc-button-persistent-ripple,\n.mat-mdc-fab-base .mat-mdc-button-persistent-ripple::before {\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  position: absolute;\n  pointer-events: none;\n  border-radius: inherit;\n}\n.mat-mdc-fab-base .mat-mdc-button-ripple {\n  overflow: hidden;\n}\n.mat-mdc-fab-base .mat-mdc-button-persistent-ripple::before {\n  content: \"\";\n  opacity: 0;\n}\n.mat-mdc-fab-base .mdc-button__label,\n.mat-mdc-fab-base .mat-icon {\n  z-index: 1;\n  position: relative;\n}\n.mat-mdc-fab-base .mat-focus-indicator {\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  position: absolute;\n}\n.mat-mdc-fab-base:focus-visible > .mat-focus-indicator::before {\n  content: \"\";\n}\n.mat-mdc-fab-base._mat-animation-noopable {\n  transition: none !important;\n  animation: none !important;\n}\n.mat-mdc-fab-base::before {\n  position: absolute;\n  box-sizing: border-box;\n  width: 100%;\n  height: 100%;\n  top: 0;\n  left: 0;\n  border: 1px solid transparent;\n  border-radius: inherit;\n  content: \"\";\n  pointer-events: none;\n}\n.mat-mdc-fab-base[hidden] {\n  display: none;\n}\n.mat-mdc-fab-base::-moz-focus-inner {\n  padding: 0;\n  border: 0;\n}\n.mat-mdc-fab-base:active, .mat-mdc-fab-base:focus {\n  outline: none;\n}\n.mat-mdc-fab-base:hover {\n  cursor: pointer;\n}\n.mat-mdc-fab-base > svg {\n  width: 100%;\n}\n.mat-mdc-fab-base .mat-icon, .mat-mdc-fab-base .material-icons {\n  transition: transform 180ms 90ms cubic-bezier(0, 0, 0.2, 1);\n  fill: currentColor;\n  will-change: transform;\n}\n.mat-mdc-fab-base .mat-focus-indicator::before {\n  margin: calc(calc(var(--%NS%mat-focus-indicator-border-width, 3px) + 2px) * -1);\n  border-radius: calc(var(--%NS%mat-fab-container-shape, var(--%NS%mat-sys-corner-large)) + calc(var(--%NS%mat-focus-indicator-border-width, 3px) + 2px));\n}\n.mat-mdc-fab-base[disabled], .mat-mdc-fab-base.mat-mdc-button-disabled {\n  cursor: default;\n  pointer-events: none;\n}\n.mat-mdc-fab-base[disabled], .mat-mdc-fab-base[disabled]:focus, .mat-mdc-fab-base.mat-mdc-button-disabled, .mat-mdc-fab-base.mat-mdc-button-disabled:focus {\n  box-shadow: none;\n}\n.mat-mdc-fab-base.mat-mdc-button-disabled-interactive {\n  pointer-events: auto;\n}\n\n.mat-mdc-fab {\n  background-color: var(--%NS%mat-fab-container-color, var(--%NS%mat-sys-primary-container));\n  border-radius: var(--%NS%mat-fab-container-shape, var(--%NS%mat-sys-corner-large));\n  color: var(--%NS%mat-fab-foreground-color, var(--%NS%mat-sys-on-primary-container, inherit));\n  box-shadow: var(--%NS%mat-fab-container-elevation-shadow, var(--%NS%mat-sys-level3));\n}\n@media (hover: hover) {\n  .mat-mdc-fab:hover {\n    box-shadow: var(--%NS%mat-fab-hover-container-elevation-shadow, var(--%NS%mat-sys-level4));\n  }\n}\n.mat-mdc-fab:focus {\n  box-shadow: var(--%NS%mat-fab-focus-container-elevation-shadow, var(--%NS%mat-sys-level3));\n}\n.mat-mdc-fab:active, .mat-mdc-fab:focus:active {\n  box-shadow: var(--%NS%mat-fab-pressed-container-elevation-shadow, var(--%NS%mat-sys-level3));\n}\n.mat-mdc-fab[disabled], .mat-mdc-fab.mat-mdc-button-disabled {\n  cursor: default;\n  pointer-events: none;\n  color: var(--%NS%mat-fab-disabled-state-foreground-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) 38%, transparent));\n  background-color: var(--%NS%mat-fab-disabled-state-container-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) 12%, transparent));\n}\n.mat-mdc-fab.mat-mdc-button-disabled-interactive {\n  pointer-events: auto;\n}\n.mat-mdc-fab .mat-mdc-button-touch-target {\n  position: absolute;\n  top: 50%;\n  height: var(--%NS%mat-fab-touch-target-size, 48px);\n  display: var(--%NS%mat-fab-touch-target-display, block);\n  left: 50%;\n  width: var(--%NS%mat-fab-touch-target-size, 48px);\n  transform: translate(-50%, -50%);\n}\n.mat-mdc-fab .mat-ripple-element {\n  background-color: var(--%NS%mat-fab-ripple-color, color-mix(in srgb, var(--%NS%mat-sys-on-primary-container) calc(var(--%NS%mat-sys-pressed-state-layer-opacity) * 100%), transparent));\n}\n.mat-mdc-fab .mat-mdc-button-persistent-ripple::before {\n  background-color: var(--%NS%mat-fab-state-layer-color, var(--%NS%mat-sys-on-primary-container));\n}\n.mat-mdc-fab.mat-mdc-button-disabled .mat-mdc-button-persistent-ripple::before {\n  background-color: var(--%NS%mat-fab-disabled-state-layer-color);\n}\n.mat-mdc-fab:hover > .mat-mdc-button-persistent-ripple::before {\n  opacity: var(--%NS%mat-fab-hover-state-layer-opacity, var(--%NS%mat-sys-hover-state-layer-opacity));\n}\n.mat-mdc-fab.cdk-program-focused > .mat-mdc-button-persistent-ripple::before, .mat-mdc-fab.cdk-keyboard-focused > .mat-mdc-button-persistent-ripple::before, .mat-mdc-fab.mat-mdc-button-disabled-interactive:focus > .mat-mdc-button-persistent-ripple::before {\n  opacity: var(--%NS%mat-fab-focus-state-layer-opacity, var(--%NS%mat-sys-focus-state-layer-opacity));\n}\n.mat-mdc-fab:active > .mat-mdc-button-persistent-ripple::before {\n  opacity: var(--%NS%mat-fab-pressed-state-layer-opacity, var(--%NS%mat-sys-pressed-state-layer-opacity));\n}\n\n.mat-mdc-mini-fab {\n  width: 40px;\n  height: 40px;\n  background-color: var(--%NS%mat-fab-small-container-color, var(--%NS%mat-sys-primary-container));\n  border-radius: var(--%NS%mat-fab-small-container-shape, var(--%NS%mat-sys-corner-medium));\n  color: var(--%NS%mat-fab-small-foreground-color, var(--%NS%mat-sys-on-primary-container, inherit));\n  box-shadow: var(--%NS%mat-fab-small-container-elevation-shadow, var(--%NS%mat-sys-level3));\n}\n@media (hover: hover) {\n  .mat-mdc-mini-fab:hover {\n    box-shadow: var(--%NS%mat-fab-small-hover-container-elevation-shadow, var(--%NS%mat-sys-level4));\n  }\n}\n.mat-mdc-mini-fab:focus {\n  box-shadow: var(--%NS%mat-fab-small-focus-container-elevation-shadow, var(--%NS%mat-sys-level3));\n}\n.mat-mdc-mini-fab:active, .mat-mdc-mini-fab:focus:active {\n  box-shadow: var(--%NS%mat-fab-small-pressed-container-elevation-shadow, var(--%NS%mat-sys-level3));\n}\n.mat-mdc-mini-fab .mat-focus-indicator::before {\n  border-radius: calc(var(--%NS%mat-fab-small-container-shape, var(--%NS%mat-sys-corner-medium)) + calc(var(--%NS%mat-focus-indicator-border-width, 3px) + 2px));\n}\n.mat-mdc-mini-fab[disabled], .mat-mdc-mini-fab.mat-mdc-button-disabled {\n  cursor: default;\n  pointer-events: none;\n  color: var(--%NS%mat-fab-small-disabled-state-foreground-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) 38%, transparent));\n  background-color: var(--%NS%mat-fab-small-disabled-state-container-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) 12%, transparent));\n}\n.mat-mdc-mini-fab.mat-mdc-button-disabled-interactive {\n  pointer-events: auto;\n}\n.mat-mdc-mini-fab .mat-mdc-button-touch-target {\n  position: absolute;\n  top: 50%;\n  height: var(--%NS%mat-fab-small-touch-target-size, 48px);\n  display: var(--%NS%mat-fab-small-touch-target-display);\n  left: 50%;\n  width: var(--%NS%mat-fab-small-touch-target-size, 48px);\n  transform: translate(-50%, -50%);\n}\n.mat-mdc-mini-fab .mat-ripple-element {\n  background-color: var(--%NS%mat-fab-small-ripple-color, color-mix(in srgb, var(--%NS%mat-sys-on-primary-container) calc(var(--%NS%mat-sys-pressed-state-layer-opacity) * 100%), transparent));\n}\n.mat-mdc-mini-fab .mat-mdc-button-persistent-ripple::before {\n  background-color: var(--%NS%mat-fab-small-state-layer-color, var(--%NS%mat-sys-on-primary-container));\n}\n.mat-mdc-mini-fab.mat-mdc-button-disabled .mat-mdc-button-persistent-ripple::before {\n  background-color: var(--%NS%mat-fab-small-disabled-state-layer-color);\n}\n.mat-mdc-mini-fab:hover > .mat-mdc-button-persistent-ripple::before {\n  opacity: var(--%NS%mat-fab-small-hover-state-layer-opacity, var(--%NS%mat-sys-hover-state-layer-opacity));\n}\n.mat-mdc-mini-fab.cdk-program-focused > .mat-mdc-button-persistent-ripple::before, .mat-mdc-mini-fab.cdk-keyboard-focused > .mat-mdc-button-persistent-ripple::before, .mat-mdc-mini-fab.mat-mdc-button-disabled-interactive:focus > .mat-mdc-button-persistent-ripple::before {\n  opacity: var(--%NS%mat-fab-small-focus-state-layer-opacity, var(--%NS%mat-sys-focus-state-layer-opacity));\n}\n.mat-mdc-mini-fab:active > .mat-mdc-button-persistent-ripple::before {\n  opacity: var(--%NS%mat-fab-small-pressed-state-layer-opacity, var(--%NS%mat-sys-pressed-state-layer-opacity));\n}\n\n.mat-mdc-extended-fab {\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  padding-left: 20px;\n  padding-right: 20px;\n  width: auto;\n  max-width: 100%;\n  line-height: normal;\n  box-shadow: var(--%NS%mat-fab-extended-container-elevation-shadow, var(--%NS%mat-sys-level3));\n  height: var(--%NS%mat-fab-extended-container-height, 56px);\n  border-radius: var(--%NS%mat-fab-extended-container-shape, var(--%NS%mat-sys-corner-large));\n  font-family: var(--%NS%mat-fab-extended-label-text-font, var(--%NS%mat-sys-label-large-font));\n  font-size: var(--%NS%mat-fab-extended-label-text-size, var(--%NS%mat-sys-label-large-size));\n  font-weight: var(--%NS%mat-fab-extended-label-text-weight, var(--%NS%mat-sys-label-large-weight));\n  letter-spacing: var(--%NS%mat-fab-extended-label-text-tracking, var(--%NS%mat-sys-label-large-tracking));\n}\n@media (hover: hover) {\n  .mat-mdc-extended-fab:hover {\n    box-shadow: var(--%NS%mat-fab-extended-hover-container-elevation-shadow, var(--%NS%mat-sys-level4));\n  }\n}\n.mat-mdc-extended-fab:focus {\n  box-shadow: var(--%NS%mat-fab-extended-focus-container-elevation-shadow, var(--%NS%mat-sys-level3));\n}\n.mat-mdc-extended-fab:active, .mat-mdc-extended-fab:focus:active {\n  box-shadow: var(--%NS%mat-fab-extended-pressed-container-elevation-shadow, var(--%NS%mat-sys-level3));\n}\n.mat-mdc-extended-fab[disabled], .mat-mdc-extended-fab.mat-mdc-button-disabled {\n  cursor: default;\n  pointer-events: none;\n}\n.mat-mdc-extended-fab[disabled], .mat-mdc-extended-fab[disabled]:focus, .mat-mdc-extended-fab.mat-mdc-button-disabled, .mat-mdc-extended-fab.mat-mdc-button-disabled:focus {\n  box-shadow: none;\n}\n.mat-mdc-extended-fab.mat-mdc-button-disabled-interactive {\n  pointer-events: auto;\n}\n[dir=rtl] .mat-mdc-extended-fab .mdc-button__label + .mat-icon, [dir=rtl] .mat-mdc-extended-fab .mdc-button__label + .material-icons,\n.mat-mdc-extended-fab > .mat-icon,\n.mat-mdc-extended-fab > .material-icons {\n  margin-left: -8px;\n  margin-right: 12px;\n}\n.mat-mdc-extended-fab .mdc-button__label + .mat-icon,\n.mat-mdc-extended-fab .mdc-button__label + .material-icons, [dir=rtl] .mat-mdc-extended-fab > .mat-icon, [dir=rtl] .mat-mdc-extended-fab > .material-icons {\n  margin-left: 12px;\n  margin-right: -8px;\n}\n.mat-mdc-extended-fab .mat-mdc-button-touch-target {\n  width: 100%;\n}\n\n.mat-mdc-button-progress-indicator-container {\n  position: absolute;\n  inset-inline-start: 0;\n  margin-block-start: 0;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  width: 100%;\n  height: 100%;\n  box-sizing: border-box;\n}\n\n.mat-mdc-button-progress-indicator-shown mat-icon,\n.mat-mdc-button-progress-indicator-shown [matButtonIcon],\n.mat-mdc-button-progress-indicator-shown .mdc-button__label {\n  visibility: hidden;\n}\n";
var APPEARANCE_CLASSES = /* @__PURE__ */ new Map([
	["text", ["mat-mdc-button"]],
	["filled", ["mdc-button--unelevated", "mat-mdc-unelevated-button"]],
	["elevated", ["mdc-button--raised", "mat-mdc-raised-button"]],
	["outlined", ["mdc-button--outlined", "mat-mdc-outlined-button"]],
	["tonal", ["mat-tonal-button"]]
]);
var MatButton = class MatButton extends MatButtonBase {
	get appearance() {
		return this._appearance;
	}
	set appearance(value) {
		this.setAppearance(value || this._config?.defaultAppearance || "text");
	}
	_appearance = null;
	constructor() {
		super();
		const inferredAppearance = _inferAppearance(this._elementRef.nativeElement);
		if (inferredAppearance) this.setAppearance(inferredAppearance);
	}
	setAppearance(appearance) {
		if (appearance === this._appearance) return;
		const classList = this._elementRef.nativeElement.classList;
		const previousClasses = this._appearance ? APPEARANCE_CLASSES.get(this._appearance) : null;
		const newClasses = APPEARANCE_CLASSES.get(appearance);
		if ((typeof ngDevMode === "undefined" || ngDevMode) && !newClasses) throw new Error(`Unsupported MatButton appearance "${appearance}"`);
		if (previousClasses) classList.remove(...previousClasses);
		classList.add(...newClasses);
		this._appearance = appearance;
	}
	static ɵfac = function MatButton_Factory(__ngFactoryType__) {
		return new (__ngFactoryType__ || MatButton)();
	};
	static ɵcmp = /* @__PURE__ */ ɵɵdefineComponent({
		type: MatButton,
		selectors: [
			[
				"button",
				"matButton",
				""
			],
			[
				"a",
				"matButton",
				""
			],
			[
				"button",
				"mat-button",
				""
			],
			[
				"button",
				"mat-raised-button",
				""
			],
			[
				"button",
				"mat-flat-button",
				""
			],
			[
				"button",
				"mat-stroked-button",
				""
			],
			[
				"a",
				"mat-button",
				""
			],
			[
				"a",
				"mat-raised-button",
				""
			],
			[
				"a",
				"mat-flat-button",
				""
			],
			[
				"a",
				"mat-stroked-button",
				""
			]
		],
		hostAttrs: [1, "mdc-button"],
		inputs: { appearance: [
			0,
			"matButton",
			"appearance"
		] },
		exportAs: ["matButton", "matAnchor"],
		features: [ɵɵInheritDefinitionFeature],
		ngContentSelectors: _c1,
		decls: 8,
		vars: 5,
		consts: [
			[1, "mat-mdc-button-persistent-ripple"],
			[1, "mdc-button__label"],
			[1, "mat-mdc-button-progress-indicator-container"],
			[1, "mat-focus-indicator"],
			[1, "mat-mdc-button-touch-target"]
		],
		template: function MatButton_Template(rf, ctx) {
			if (rf & 1) {
				ɵɵprojectionDef(_c0);
				ɵɵdomElement(0, "span", 0);
				ɵɵprojection(1);
				ɵɵdomElementStart(2, "span", 1);
				ɵɵprojection(3, 1);
				ɵɵdomElementEnd();
				ɵɵprojection(4, 2);
				ɵɵconditionalCreate(5, MatButton_Conditional_5_Template, 2, 0, "div", 2);
				ɵɵdomElement(6, "span", 3)(7, "span", 4);
			}
			if (rf & 2) {
				ɵɵclassProp("mdc-button__ripple", !ctx._isFab)("mdc-fab__ripple", ctx._isFab);
				ɵɵadvance(5);
				ɵɵconditional(ctx.showProgress() ? 5 : -1);
			}
		},
		styles: [".mat-mdc-button-base {\n  text-decoration: none;\n}\n.mat-mdc-button-base .mat-icon {\n  min-height: fit-content;\n  flex-shrink: 0;\n}\n@media (hover: none) {\n  .mat-mdc-button-base:hover > span.mat-mdc-button-persistent-ripple::before {\n    opacity: 0;\n  }\n}\n\n.mdc-button {\n  -webkit-user-select: none;\n  user-select: none;\n  position: relative;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  box-sizing: border-box;\n  min-width: 64px;\n  border: none;\n  outline: none;\n  line-height: inherit;\n  -webkit-appearance: none;\n  overflow: visible;\n  vertical-align: middle;\n  background: transparent;\n  padding: 0 8px;\n}\n.mdc-button::-moz-focus-inner {\n  padding: 0;\n  border: 0;\n}\n.mdc-button:active {\n  outline: none;\n}\n.mdc-button:hover {\n  cursor: pointer;\n}\n.mdc-button:disabled {\n  cursor: default;\n  pointer-events: none;\n}\n.mdc-button[hidden] {\n  display: none;\n}\n.mdc-button .mdc-button__label {\n  position: relative;\n}\n\n.mat-mdc-button {\n  padding: 0 var(--%NS%mat-button-text-horizontal-padding, 12px);\n  height: var(--%NS%mat-button-text-container-height, 40px);\n  font-family: var(--%NS%mat-button-text-label-text-font, var(--%NS%mat-sys-label-large-font));\n  font-size: var(--%NS%mat-button-text-label-text-size, var(--%NS%mat-sys-label-large-size));\n  letter-spacing: var(--%NS%mat-button-text-label-text-tracking, var(--%NS%mat-sys-label-large-tracking));\n  text-transform: var(--%NS%mat-button-text-label-text-transform);\n  font-weight: var(--%NS%mat-button-text-label-text-weight, var(--%NS%mat-sys-label-large-weight));\n}\n.mat-mdc-button, .mat-mdc-button .mdc-button__ripple {\n  border-radius: var(--%NS%mat-button-text-container-shape, var(--%NS%mat-sys-corner-full));\n}\n.mat-mdc-button:not(:disabled) {\n  color: var(--%NS%mat-button-text-label-text-color, var(--%NS%mat-sys-primary));\n}\n.mat-mdc-button[disabled], .mat-mdc-button.mat-mdc-button-disabled {\n  cursor: default;\n  pointer-events: none;\n  color: var(--%NS%mat-button-text-disabled-label-text-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) 38%, transparent));\n}\n.mat-mdc-button.mat-mdc-button-disabled-interactive {\n  pointer-events: auto;\n}\n.mat-mdc-button:has(.material-icons, mat-icon, [matButtonIcon]) {\n  padding: 0 var(--%NS%mat-button-text-with-icon-horizontal-padding, 16px);\n}\n.mat-mdc-button > .mat-icon {\n  margin-right: var(--%NS%mat-button-text-icon-spacing, 8px);\n  margin-left: var(--%NS%mat-button-text-icon-offset, -4px);\n}\n[dir=rtl] .mat-mdc-button > .mat-icon {\n  margin-right: var(--%NS%mat-button-text-icon-offset, -4px);\n  margin-left: var(--%NS%mat-button-text-icon-spacing, 8px);\n}\n.mat-mdc-button .mdc-button__label + .mat-icon {\n  margin-right: var(--%NS%mat-button-text-icon-offset, -4px);\n  margin-left: var(--%NS%mat-button-text-icon-spacing, 8px);\n}\n[dir=rtl] .mat-mdc-button .mdc-button__label + .mat-icon {\n  margin-right: var(--%NS%mat-button-text-icon-spacing, 8px);\n  margin-left: var(--%NS%mat-button-text-icon-offset, -4px);\n}\n.mat-mdc-button .mat-ripple-element {\n  background-color: var(--%NS%mat-button-text-ripple-color, color-mix(in srgb, var(--%NS%mat-sys-primary) calc(var(--%NS%mat-sys-pressed-state-layer-opacity) * 100%), transparent));\n}\n.mat-mdc-button .mat-mdc-button-persistent-ripple::before {\n  background-color: var(--%NS%mat-button-text-state-layer-color, var(--%NS%mat-sys-primary));\n}\n.mat-mdc-button.mat-mdc-button-disabled .mat-mdc-button-persistent-ripple::before {\n  background-color: var(--%NS%mat-button-text-disabled-state-layer-color, var(--%NS%mat-sys-on-surface-variant));\n}\n.mat-mdc-button:hover > .mat-mdc-button-persistent-ripple::before {\n  opacity: var(--%NS%mat-button-text-hover-state-layer-opacity, var(--%NS%mat-sys-hover-state-layer-opacity));\n}\n.mat-mdc-button.cdk-program-focused > .mat-mdc-button-persistent-ripple::before, .mat-mdc-button.cdk-keyboard-focused > .mat-mdc-button-persistent-ripple::before, .mat-mdc-button.mat-mdc-button-disabled-interactive:focus > .mat-mdc-button-persistent-ripple::before {\n  opacity: var(--%NS%mat-button-text-focus-state-layer-opacity, var(--%NS%mat-sys-focus-state-layer-opacity));\n}\n.mat-mdc-button:active > .mat-mdc-button-persistent-ripple::before {\n  opacity: var(--%NS%mat-button-text-pressed-state-layer-opacity, var(--%NS%mat-sys-pressed-state-layer-opacity));\n}\n.mat-mdc-button .mat-mdc-button-touch-target {\n  position: absolute;\n  top: 50%;\n  height: var(--%NS%mat-button-text-touch-target-size, 48px);\n  display: var(--%NS%mat-button-text-touch-target-display, block);\n  left: 0;\n  right: 0;\n  transform: translateY(-50%);\n}\n\n.mat-mdc-unelevated-button {\n  transition: box-shadow 280ms cubic-bezier(0.4, 0, 0.2, 1);\n  height: var(--%NS%mat-button-filled-container-height, 40px);\n  font-family: var(--%NS%mat-button-filled-label-text-font, var(--%NS%mat-sys-label-large-font));\n  font-size: var(--%NS%mat-button-filled-label-text-size, var(--%NS%mat-sys-label-large-size));\n  letter-spacing: var(--%NS%mat-button-filled-label-text-tracking, var(--%NS%mat-sys-label-large-tracking));\n  text-transform: var(--%NS%mat-button-filled-label-text-transform);\n  font-weight: var(--%NS%mat-button-filled-label-text-weight, var(--%NS%mat-sys-label-large-weight));\n  padding: 0 var(--%NS%mat-button-filled-horizontal-padding, 24px);\n}\n.mat-mdc-unelevated-button > .mat-icon {\n  margin-right: var(--%NS%mat-button-filled-icon-spacing, 8px);\n  margin-left: var(--%NS%mat-button-filled-icon-offset, -8px);\n}\n[dir=rtl] .mat-mdc-unelevated-button > .mat-icon {\n  margin-right: var(--%NS%mat-button-filled-icon-offset, -8px);\n  margin-left: var(--%NS%mat-button-filled-icon-spacing, 8px);\n}\n.mat-mdc-unelevated-button .mdc-button__label + .mat-icon {\n  margin-right: var(--%NS%mat-button-filled-icon-offset, -8px);\n  margin-left: var(--%NS%mat-button-filled-icon-spacing, 8px);\n}\n[dir=rtl] .mat-mdc-unelevated-button .mdc-button__label + .mat-icon {\n  margin-right: var(--%NS%mat-button-filled-icon-spacing, 8px);\n  margin-left: var(--%NS%mat-button-filled-icon-offset, -8px);\n}\n.mat-mdc-unelevated-button .mat-ripple-element {\n  background-color: var(--%NS%mat-button-filled-ripple-color, color-mix(in srgb, var(--%NS%mat-sys-on-primary) calc(var(--%NS%mat-sys-pressed-state-layer-opacity) * 100%), transparent));\n}\n.mat-mdc-unelevated-button .mat-mdc-button-persistent-ripple::before {\n  background-color: var(--%NS%mat-button-filled-state-layer-color, var(--%NS%mat-sys-on-primary));\n}\n.mat-mdc-unelevated-button.mat-mdc-button-disabled .mat-mdc-button-persistent-ripple::before {\n  background-color: var(--%NS%mat-button-filled-disabled-state-layer-color, var(--%NS%mat-sys-on-surface-variant));\n}\n.mat-mdc-unelevated-button:hover > .mat-mdc-button-persistent-ripple::before {\n  opacity: var(--%NS%mat-button-filled-hover-state-layer-opacity, var(--%NS%mat-sys-hover-state-layer-opacity));\n}\n.mat-mdc-unelevated-button.cdk-program-focused > .mat-mdc-button-persistent-ripple::before, .mat-mdc-unelevated-button.cdk-keyboard-focused > .mat-mdc-button-persistent-ripple::before, .mat-mdc-unelevated-button.mat-mdc-button-disabled-interactive:focus > .mat-mdc-button-persistent-ripple::before {\n  opacity: var(--%NS%mat-button-filled-focus-state-layer-opacity, var(--%NS%mat-sys-focus-state-layer-opacity));\n}\n.mat-mdc-unelevated-button:active > .mat-mdc-button-persistent-ripple::before {\n  opacity: var(--%NS%mat-button-filled-pressed-state-layer-opacity, var(--%NS%mat-sys-pressed-state-layer-opacity));\n}\n.mat-mdc-unelevated-button .mat-mdc-button-touch-target {\n  position: absolute;\n  top: 50%;\n  height: var(--%NS%mat-button-filled-touch-target-size, 48px);\n  display: var(--%NS%mat-button-filled-touch-target-display, block);\n  left: 0;\n  right: 0;\n  transform: translateY(-50%);\n}\n.mat-mdc-unelevated-button:not(:disabled) {\n  color: var(--%NS%mat-button-filled-label-text-color, var(--%NS%mat-sys-on-primary));\n  background-color: var(--%NS%mat-button-filled-container-color, var(--%NS%mat-sys-primary));\n}\n.mat-mdc-unelevated-button, .mat-mdc-unelevated-button .mdc-button__ripple {\n  border-radius: var(--%NS%mat-button-filled-container-shape, var(--%NS%mat-sys-corner-full));\n}\n.mat-mdc-unelevated-button .mat-mdc-button-progress-indicator-container {\n  --%NS%mat-progress-spinner-active-indicator-color: var(--%NS%mat-button-filled-progress-active-indicator-color, var(--%NS%mat-sys-on-primary));\n}\n.mat-mdc-unelevated-button[disabled], .mat-mdc-unelevated-button.mat-mdc-button-disabled {\n  cursor: default;\n  pointer-events: none;\n  color: var(--%NS%mat-button-filled-disabled-label-text-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) 38%, transparent));\n  background-color: var(--%NS%mat-button-filled-disabled-container-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) 12%, transparent));\n}\n.mat-mdc-unelevated-button.mat-mdc-button-disabled-interactive {\n  pointer-events: auto;\n}\n\n.mat-mdc-raised-button {\n  transition: box-shadow 280ms cubic-bezier(0.4, 0, 0.2, 1);\n  box-shadow: var(--%NS%mat-button-protected-container-elevation-shadow, var(--%NS%mat-sys-level1));\n  height: var(--%NS%mat-button-protected-container-height, 40px);\n  font-family: var(--%NS%mat-button-protected-label-text-font, var(--%NS%mat-sys-label-large-font));\n  font-size: var(--%NS%mat-button-protected-label-text-size, var(--%NS%mat-sys-label-large-size));\n  letter-spacing: var(--%NS%mat-button-protected-label-text-tracking, var(--%NS%mat-sys-label-large-tracking));\n  text-transform: var(--%NS%mat-button-protected-label-text-transform);\n  font-weight: var(--%NS%mat-button-protected-label-text-weight, var(--%NS%mat-sys-label-large-weight));\n  padding: 0 var(--%NS%mat-button-protected-horizontal-padding, 24px);\n}\n.mat-mdc-raised-button > .mat-icon {\n  margin-right: var(--%NS%mat-button-protected-icon-spacing, 8px);\n  margin-left: var(--%NS%mat-button-protected-icon-offset, -8px);\n}\n[dir=rtl] .mat-mdc-raised-button > .mat-icon {\n  margin-right: var(--%NS%mat-button-protected-icon-offset, -8px);\n  margin-left: var(--%NS%mat-button-protected-icon-spacing, 8px);\n}\n.mat-mdc-raised-button .mdc-button__label + .mat-icon {\n  margin-right: var(--%NS%mat-button-protected-icon-offset, -8px);\n  margin-left: var(--%NS%mat-button-protected-icon-spacing, 8px);\n}\n[dir=rtl] .mat-mdc-raised-button .mdc-button__label + .mat-icon {\n  margin-right: var(--%NS%mat-button-protected-icon-spacing, 8px);\n  margin-left: var(--%NS%mat-button-protected-icon-offset, -8px);\n}\n.mat-mdc-raised-button .mat-ripple-element {\n  background-color: var(--%NS%mat-button-protected-ripple-color, color-mix(in srgb, var(--%NS%mat-sys-primary) calc(var(--%NS%mat-sys-pressed-state-layer-opacity) * 100%), transparent));\n}\n.mat-mdc-raised-button .mat-mdc-button-persistent-ripple::before {\n  background-color: var(--%NS%mat-button-protected-state-layer-color, var(--%NS%mat-sys-primary));\n}\n.mat-mdc-raised-button.mat-mdc-button-disabled .mat-mdc-button-persistent-ripple::before {\n  background-color: var(--%NS%mat-button-protected-disabled-state-layer-color, var(--%NS%mat-sys-on-surface-variant));\n}\n.mat-mdc-raised-button:hover > .mat-mdc-button-persistent-ripple::before {\n  opacity: var(--%NS%mat-button-protected-hover-state-layer-opacity, var(--%NS%mat-sys-hover-state-layer-opacity));\n}\n.mat-mdc-raised-button.cdk-program-focused > .mat-mdc-button-persistent-ripple::before, .mat-mdc-raised-button.cdk-keyboard-focused > .mat-mdc-button-persistent-ripple::before, .mat-mdc-raised-button.mat-mdc-button-disabled-interactive:focus > .mat-mdc-button-persistent-ripple::before {\n  opacity: var(--%NS%mat-button-protected-focus-state-layer-opacity, var(--%NS%mat-sys-focus-state-layer-opacity));\n}\n.mat-mdc-raised-button:active > .mat-mdc-button-persistent-ripple::before {\n  opacity: var(--%NS%mat-button-protected-pressed-state-layer-opacity, var(--%NS%mat-sys-pressed-state-layer-opacity));\n}\n.mat-mdc-raised-button .mat-mdc-button-touch-target {\n  position: absolute;\n  top: 50%;\n  height: var(--%NS%mat-button-protected-touch-target-size, 48px);\n  display: var(--%NS%mat-button-protected-touch-target-display, block);\n  left: 0;\n  right: 0;\n  transform: translateY(-50%);\n}\n.mat-mdc-raised-button:not(:disabled) {\n  color: var(--%NS%mat-button-protected-label-text-color, var(--%NS%mat-sys-primary));\n  background-color: var(--%NS%mat-button-protected-container-color, var(--%NS%mat-sys-surface));\n}\n.mat-mdc-raised-button, .mat-mdc-raised-button .mdc-button__ripple {\n  border-radius: var(--%NS%mat-button-protected-container-shape, var(--%NS%mat-sys-corner-full));\n}\n@media (hover: hover) {\n  .mat-mdc-raised-button:hover {\n    box-shadow: var(--%NS%mat-button-protected-hover-container-elevation-shadow, var(--%NS%mat-sys-level2));\n  }\n}\n.mat-mdc-raised-button:focus {\n  box-shadow: var(--%NS%mat-button-protected-focus-container-elevation-shadow, var(--%NS%mat-sys-level1));\n}\n.mat-mdc-raised-button:active, .mat-mdc-raised-button:focus:active {\n  box-shadow: var(--%NS%mat-button-protected-pressed-container-elevation-shadow, var(--%NS%mat-sys-level1));\n}\n.mat-mdc-raised-button[disabled], .mat-mdc-raised-button.mat-mdc-button-disabled {\n  cursor: default;\n  pointer-events: none;\n  color: var(--%NS%mat-button-protected-disabled-label-text-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) 38%, transparent));\n  background-color: var(--%NS%mat-button-protected-disabled-container-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) 12%, transparent));\n}\n.mat-mdc-raised-button[disabled].mat-mdc-button-disabled, .mat-mdc-raised-button.mat-mdc-button-disabled.mat-mdc-button-disabled {\n  box-shadow: var(--%NS%mat-button-protected-disabled-container-elevation-shadow, var(--%NS%mat-sys-level0));\n}\n.mat-mdc-raised-button.mat-mdc-button-disabled-interactive {\n  pointer-events: auto;\n}\n\n.mat-mdc-outlined-button {\n  border-style: solid;\n  transition: border 280ms cubic-bezier(0.4, 0, 0.2, 1);\n  height: var(--%NS%mat-button-outlined-container-height, 40px);\n  font-family: var(--%NS%mat-button-outlined-label-text-font, var(--%NS%mat-sys-label-large-font));\n  font-size: var(--%NS%mat-button-outlined-label-text-size, var(--%NS%mat-sys-label-large-size));\n  letter-spacing: var(--%NS%mat-button-outlined-label-text-tracking, var(--%NS%mat-sys-label-large-tracking));\n  text-transform: var(--%NS%mat-button-outlined-label-text-transform);\n  font-weight: var(--%NS%mat-button-outlined-label-text-weight, var(--%NS%mat-sys-label-large-weight));\n  border-radius: var(--%NS%mat-button-outlined-container-shape, var(--%NS%mat-sys-corner-full));\n  border-width: var(--%NS%mat-button-outlined-outline-width, 1px);\n  padding: 0 var(--%NS%mat-button-outlined-horizontal-padding, 24px);\n}\n.mat-mdc-outlined-button > .mat-icon {\n  margin-right: var(--%NS%mat-button-outlined-icon-spacing, 8px);\n  margin-left: var(--%NS%mat-button-outlined-icon-offset, -8px);\n}\n[dir=rtl] .mat-mdc-outlined-button > .mat-icon {\n  margin-right: var(--%NS%mat-button-outlined-icon-offset, -8px);\n  margin-left: var(--%NS%mat-button-outlined-icon-spacing, 8px);\n}\n.mat-mdc-outlined-button .mdc-button__label + .mat-icon {\n  margin-right: var(--%NS%mat-button-outlined-icon-offset, -8px);\n  margin-left: var(--%NS%mat-button-outlined-icon-spacing, 8px);\n}\n[dir=rtl] .mat-mdc-outlined-button .mdc-button__label + .mat-icon {\n  margin-right: var(--%NS%mat-button-outlined-icon-spacing, 8px);\n  margin-left: var(--%NS%mat-button-outlined-icon-offset, -8px);\n}\n.mat-mdc-outlined-button .mat-ripple-element {\n  background-color: var(--%NS%mat-button-outlined-ripple-color, color-mix(in srgb, var(--%NS%mat-sys-primary) calc(var(--%NS%mat-sys-pressed-state-layer-opacity) * 100%), transparent));\n}\n.mat-mdc-outlined-button .mat-mdc-button-persistent-ripple::before {\n  background-color: var(--%NS%mat-button-outlined-state-layer-color, var(--%NS%mat-sys-primary));\n}\n.mat-mdc-outlined-button.mat-mdc-button-disabled .mat-mdc-button-persistent-ripple::before {\n  background-color: var(--%NS%mat-button-outlined-disabled-state-layer-color, var(--%NS%mat-sys-on-surface-variant));\n}\n.mat-mdc-outlined-button:hover > .mat-mdc-button-persistent-ripple::before {\n  opacity: var(--%NS%mat-button-outlined-hover-state-layer-opacity, var(--%NS%mat-sys-hover-state-layer-opacity));\n}\n.mat-mdc-outlined-button.cdk-program-focused > .mat-mdc-button-persistent-ripple::before, .mat-mdc-outlined-button.cdk-keyboard-focused > .mat-mdc-button-persistent-ripple::before, .mat-mdc-outlined-button.mat-mdc-button-disabled-interactive:focus > .mat-mdc-button-persistent-ripple::before {\n  opacity: var(--%NS%mat-button-outlined-focus-state-layer-opacity, var(--%NS%mat-sys-focus-state-layer-opacity));\n}\n.mat-mdc-outlined-button:active > .mat-mdc-button-persistent-ripple::before {\n  opacity: var(--%NS%mat-button-outlined-pressed-state-layer-opacity, var(--%NS%mat-sys-pressed-state-layer-opacity));\n}\n.mat-mdc-outlined-button .mat-mdc-button-touch-target {\n  position: absolute;\n  top: 50%;\n  height: var(--%NS%mat-button-outlined-touch-target-size, 48px);\n  display: var(--%NS%mat-button-outlined-touch-target-display, block);\n  left: 0;\n  right: 0;\n  transform: translateY(-50%);\n}\n.mat-mdc-outlined-button:not(:disabled) {\n  color: var(--%NS%mat-button-outlined-label-text-color, var(--%NS%mat-sys-primary));\n  border-color: var(--%NS%mat-button-outlined-outline-color, var(--%NS%mat-sys-outline));\n}\n.mat-mdc-outlined-button[disabled], .mat-mdc-outlined-button.mat-mdc-button-disabled {\n  cursor: default;\n  pointer-events: none;\n  color: var(--%NS%mat-button-outlined-disabled-label-text-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) 38%, transparent));\n  border-color: var(--%NS%mat-button-outlined-disabled-outline-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) 12%, transparent));\n}\n.mat-mdc-outlined-button.mat-mdc-button-disabled-interactive {\n  pointer-events: auto;\n}\n\n.mat-tonal-button {\n  transition: box-shadow 280ms cubic-bezier(0.4, 0, 0.2, 1);\n  height: var(--%NS%mat-button-tonal-container-height, 40px);\n  font-family: var(--%NS%mat-button-tonal-label-text-font, var(--%NS%mat-sys-label-large-font));\n  font-size: var(--%NS%mat-button-tonal-label-text-size, var(--%NS%mat-sys-label-large-size));\n  letter-spacing: var(--%NS%mat-button-tonal-label-text-tracking, var(--%NS%mat-sys-label-large-tracking));\n  text-transform: var(--%NS%mat-button-tonal-label-text-transform);\n  font-weight: var(--%NS%mat-button-tonal-label-text-weight, var(--%NS%mat-sys-label-large-weight));\n  padding: 0 var(--%NS%mat-button-tonal-horizontal-padding, 24px);\n}\n.mat-tonal-button:not(:disabled) {\n  color: var(--%NS%mat-button-tonal-label-text-color, var(--%NS%mat-sys-on-secondary-container));\n  background-color: var(--%NS%mat-button-tonal-container-color, var(--%NS%mat-sys-secondary-container));\n}\n.mat-tonal-button, .mat-tonal-button .mdc-button__ripple {\n  border-radius: var(--%NS%mat-button-tonal-container-shape, var(--%NS%mat-sys-corner-full));\n}\n.mat-tonal-button[disabled], .mat-tonal-button.mat-mdc-button-disabled {\n  cursor: default;\n  pointer-events: none;\n  color: var(--%NS%mat-button-tonal-disabled-label-text-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) 38%, transparent));\n  background-color: var(--%NS%mat-button-tonal-disabled-container-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) 12%, transparent));\n}\n.mat-tonal-button.mat-mdc-button-disabled-interactive {\n  pointer-events: auto;\n}\n.mat-tonal-button > .mat-icon {\n  margin-right: var(--%NS%mat-button-tonal-icon-spacing, 8px);\n  margin-left: var(--%NS%mat-button-tonal-icon-offset, -8px);\n}\n[dir=rtl] .mat-tonal-button > .mat-icon {\n  margin-right: var(--%NS%mat-button-tonal-icon-offset, -8px);\n  margin-left: var(--%NS%mat-button-tonal-icon-spacing, 8px);\n}\n.mat-tonal-button .mdc-button__label + .mat-icon {\n  margin-right: var(--%NS%mat-button-tonal-icon-offset, -8px);\n  margin-left: var(--%NS%mat-button-tonal-icon-spacing, 8px);\n}\n[dir=rtl] .mat-tonal-button .mdc-button__label + .mat-icon {\n  margin-right: var(--%NS%mat-button-tonal-icon-spacing, 8px);\n  margin-left: var(--%NS%mat-button-tonal-icon-offset, -8px);\n}\n.mat-tonal-button .mat-ripple-element {\n  background-color: var(--%NS%mat-button-tonal-ripple-color, color-mix(in srgb, var(--%NS%mat-sys-on-secondary-container) calc(var(--%NS%mat-sys-pressed-state-layer-opacity) * 100%), transparent));\n}\n.mat-tonal-button .mat-mdc-button-persistent-ripple::before {\n  background-color: var(--%NS%mat-button-tonal-state-layer-color, var(--%NS%mat-sys-on-secondary-container));\n}\n.mat-tonal-button.mat-mdc-button-disabled .mat-mdc-button-persistent-ripple::before {\n  background-color: var(--%NS%mat-button-tonal-disabled-state-layer-color, var(--%NS%mat-sys-on-surface-variant));\n}\n.mat-tonal-button:hover > .mat-mdc-button-persistent-ripple::before {\n  opacity: var(--%NS%mat-button-tonal-hover-state-layer-opacity, var(--%NS%mat-sys-hover-state-layer-opacity));\n}\n.mat-tonal-button.cdk-program-focused > .mat-mdc-button-persistent-ripple::before, .mat-tonal-button.cdk-keyboard-focused > .mat-mdc-button-persistent-ripple::before, .mat-tonal-button.mat-mdc-button-disabled-interactive:focus > .mat-mdc-button-persistent-ripple::before {\n  opacity: var(--%NS%mat-button-tonal-focus-state-layer-opacity, var(--%NS%mat-sys-focus-state-layer-opacity));\n}\n.mat-tonal-button:active > .mat-mdc-button-persistent-ripple::before {\n  opacity: var(--%NS%mat-button-tonal-pressed-state-layer-opacity, var(--%NS%mat-sys-pressed-state-layer-opacity));\n}\n.mat-tonal-button .mat-mdc-button-touch-target {\n  position: absolute;\n  top: 50%;\n  height: var(--%NS%mat-button-tonal-touch-target-size, 48px);\n  display: var(--%NS%mat-button-tonal-touch-target-display, block);\n  left: 0;\n  right: 0;\n  transform: translateY(-50%);\n}\n\n.mat-mdc-button,\n.mat-mdc-unelevated-button,\n.mat-mdc-raised-button,\n.mat-mdc-outlined-button,\n.mat-tonal-button {\n  -webkit-tap-highlight-color: transparent;\n}\n.mat-mdc-button .mat-mdc-button-ripple,\n.mat-mdc-button .mat-mdc-button-persistent-ripple,\n.mat-mdc-button .mat-mdc-button-persistent-ripple::before,\n.mat-mdc-unelevated-button .mat-mdc-button-ripple,\n.mat-mdc-unelevated-button .mat-mdc-button-persistent-ripple,\n.mat-mdc-unelevated-button .mat-mdc-button-persistent-ripple::before,\n.mat-mdc-raised-button .mat-mdc-button-ripple,\n.mat-mdc-raised-button .mat-mdc-button-persistent-ripple,\n.mat-mdc-raised-button .mat-mdc-button-persistent-ripple::before,\n.mat-mdc-outlined-button .mat-mdc-button-ripple,\n.mat-mdc-outlined-button .mat-mdc-button-persistent-ripple,\n.mat-mdc-outlined-button .mat-mdc-button-persistent-ripple::before,\n.mat-tonal-button .mat-mdc-button-ripple,\n.mat-tonal-button .mat-mdc-button-persistent-ripple,\n.mat-tonal-button .mat-mdc-button-persistent-ripple::before {\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  position: absolute;\n  pointer-events: none;\n  border-radius: inherit;\n}\n.mat-mdc-button .mat-mdc-button-ripple,\n.mat-mdc-unelevated-button .mat-mdc-button-ripple,\n.mat-mdc-raised-button .mat-mdc-button-ripple,\n.mat-mdc-outlined-button .mat-mdc-button-ripple,\n.mat-tonal-button .mat-mdc-button-ripple {\n  overflow: hidden;\n}\n.mat-mdc-button .mat-mdc-button-persistent-ripple::before,\n.mat-mdc-unelevated-button .mat-mdc-button-persistent-ripple::before,\n.mat-mdc-raised-button .mat-mdc-button-persistent-ripple::before,\n.mat-mdc-outlined-button .mat-mdc-button-persistent-ripple::before,\n.mat-tonal-button .mat-mdc-button-persistent-ripple::before {\n  content: \"\";\n  opacity: 0;\n}\n.mat-mdc-button .mdc-button__label,\n.mat-mdc-button .mat-icon,\n.mat-mdc-unelevated-button .mdc-button__label,\n.mat-mdc-unelevated-button .mat-icon,\n.mat-mdc-raised-button .mdc-button__label,\n.mat-mdc-raised-button .mat-icon,\n.mat-mdc-outlined-button .mdc-button__label,\n.mat-mdc-outlined-button .mat-icon,\n.mat-tonal-button .mdc-button__label,\n.mat-tonal-button .mat-icon {\n  z-index: 1;\n  position: relative;\n}\n.mat-mdc-button .mat-focus-indicator,\n.mat-mdc-unelevated-button .mat-focus-indicator,\n.mat-mdc-raised-button .mat-focus-indicator,\n.mat-mdc-outlined-button .mat-focus-indicator,\n.mat-tonal-button .mat-focus-indicator {\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  position: absolute;\n  border-radius: inherit;\n}\n.mat-mdc-button:focus-visible > .mat-focus-indicator::before,\n.mat-mdc-unelevated-button:focus-visible > .mat-focus-indicator::before,\n.mat-mdc-raised-button:focus-visible > .mat-focus-indicator::before,\n.mat-mdc-outlined-button:focus-visible > .mat-focus-indicator::before,\n.mat-tonal-button:focus-visible > .mat-focus-indicator::before {\n  content: \"\";\n  border-radius: inherit;\n}\n.mat-mdc-button._mat-animation-noopable,\n.mat-mdc-unelevated-button._mat-animation-noopable,\n.mat-mdc-raised-button._mat-animation-noopable,\n.mat-mdc-outlined-button._mat-animation-noopable,\n.mat-tonal-button._mat-animation-noopable {\n  transition: none !important;\n  animation: none !important;\n}\n.mat-mdc-button > .mat-icon,\n.mat-mdc-unelevated-button > .mat-icon,\n.mat-mdc-raised-button > .mat-icon,\n.mat-mdc-outlined-button > .mat-icon,\n.mat-tonal-button > .mat-icon {\n  display: inline-block;\n  position: relative;\n  vertical-align: top;\n  font-size: 1.125rem;\n  height: 1.125rem;\n  width: 1.125rem;\n}\n\n.mat-mdc-outlined-button .mat-mdc-button-ripple,\n.mat-mdc-outlined-button .mdc-button__ripple {\n  top: -1px;\n  left: -1px;\n  bottom: -1px;\n  right: -1px;\n}\n\n.mat-mdc-unelevated-button .mat-focus-indicator::before,\n.mat-tonal-button .mat-focus-indicator::before,\n.mat-mdc-raised-button .mat-focus-indicator::before {\n  margin: calc(calc(var(--%NS%mat-focus-indicator-border-width, 3px) + 2px) * -1);\n}\n\n.mat-mdc-outlined-button .mat-focus-indicator::before {\n  margin: calc(calc(var(--%NS%mat-focus-indicator-border-width, 3px) + 3px) * -1);\n}\n\n.mat-mdc-button-progress-indicator-container {\n  position: absolute;\n  inset-inline-start: 0;\n  inset-block-start: 0;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  width: 100%;\n  height: 100%;\n  box-sizing: border-box;\n}\n\n.mat-mdc-button-progress-indicator-shown mat-icon,\n.mat-mdc-button-progress-indicator-shown [matButtonIcon],\n.mat-mdc-button-progress-indicator-shown .mdc-button__label {\n  visibility: hidden;\n}\n", "@media (forced-colors: active) {\n  .mat-mdc-button:not(.mdc-button--outlined),\n  .mat-mdc-unelevated-button:not(.mdc-button--outlined),\n  .mat-mdc-raised-button:not(.mdc-button--outlined),\n  .mat-mdc-outlined-button:not(.mdc-button--outlined),\n  .mat-mdc-button-base.mat-tonal-button,\n  .mat-mdc-icon-button.mat-mdc-icon-button,\n  .mat-mdc-outlined-button .mdc-button__ripple {\n    outline: solid 1px;\n  }\n}\n"],
		encapsulation: 2
	});
};
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatButton, [{
		type: Component,
		args: [{
			selector: `
    button[matButton], a[matButton], button[mat-button], button[mat-raised-button],
    button[mat-flat-button], button[mat-stroked-button], a[mat-button], a[mat-raised-button],
    a[mat-flat-button], a[mat-stroked-button]
  `,
			host: { "class": "mdc-button" },
			exportAs: "matButton, matAnchor",
			encapsulation: ViewEncapsulation.None,
			template: "<span\n  class=\"mat-mdc-button-persistent-ripple\"\n  [class.mdc-button__ripple]=\"!_isFab\"\n  [class.mdc-fab__ripple]=\"_isFab\"\n></span>\n\n<ng-content\n  select=\".material-icons:not([iconPositionEnd]), mat-icon:not([iconPositionEnd]), [matButtonIcon]:not([iconPositionEnd])\"\n>\n</ng-content>\n\n<span class=\"mdc-button__label\"><ng-content></ng-content></span>\n\n<ng-content\n  select=\".material-icons[iconPositionEnd], mat-icon[iconPositionEnd], [matButtonIcon][iconPositionEnd]\"\n>\n</ng-content>\n\n@if (showProgress()) {\n  <div class=\"mat-mdc-button-progress-indicator-container\">\n    <ng-content select=\"[progressIndicator]\" />\n  </div>\n}\n\n<!--\n  The indicator can't be directly on the button, because MDC uses ::before for high contrast\n  indication and it can't be on the ripple, because it has a border radius and overflow: hidden.\n-->\n<span class=\"mat-focus-indicator\"></span>\n\n<span class=\"mat-mdc-button-touch-target\"></span>\n",
			styles: [".mat-mdc-button-base {\n  text-decoration: none;\n}\n.mat-mdc-button-base .mat-icon {\n  min-height: fit-content;\n  flex-shrink: 0;\n}\n@media (hover: none) {\n  .mat-mdc-button-base:hover > span.mat-mdc-button-persistent-ripple::before {\n    opacity: 0;\n  }\n}\n\n.mdc-button {\n  -webkit-user-select: none;\n  user-select: none;\n  position: relative;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  box-sizing: border-box;\n  min-width: 64px;\n  border: none;\n  outline: none;\n  line-height: inherit;\n  -webkit-appearance: none;\n  overflow: visible;\n  vertical-align: middle;\n  background: transparent;\n  padding: 0 8px;\n}\n.mdc-button::-moz-focus-inner {\n  padding: 0;\n  border: 0;\n}\n.mdc-button:active {\n  outline: none;\n}\n.mdc-button:hover {\n  cursor: pointer;\n}\n.mdc-button:disabled {\n  cursor: default;\n  pointer-events: none;\n}\n.mdc-button[hidden] {\n  display: none;\n}\n.mdc-button .mdc-button__label {\n  position: relative;\n}\n\n.mat-mdc-button {\n  padding: 0 var(--mat-button-text-horizontal-padding, 12px);\n  height: var(--mat-button-text-container-height, 40px);\n  font-family: var(--mat-button-text-label-text-font, var(--mat-sys-label-large-font));\n  font-size: var(--mat-button-text-label-text-size, var(--mat-sys-label-large-size));\n  letter-spacing: var(--mat-button-text-label-text-tracking, var(--mat-sys-label-large-tracking));\n  text-transform: var(--mat-button-text-label-text-transform);\n  font-weight: var(--mat-button-text-label-text-weight, var(--mat-sys-label-large-weight));\n}\n.mat-mdc-button, .mat-mdc-button .mdc-button__ripple {\n  border-radius: var(--mat-button-text-container-shape, var(--mat-sys-corner-full));\n}\n.mat-mdc-button:not(:disabled) {\n  color: var(--mat-button-text-label-text-color, var(--mat-sys-primary));\n}\n.mat-mdc-button[disabled], .mat-mdc-button.mat-mdc-button-disabled {\n  cursor: default;\n  pointer-events: none;\n  color: var(--mat-button-text-disabled-label-text-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));\n}\n.mat-mdc-button.mat-mdc-button-disabled-interactive {\n  pointer-events: auto;\n}\n.mat-mdc-button:has(.material-icons, mat-icon, [matButtonIcon]) {\n  padding: 0 var(--mat-button-text-with-icon-horizontal-padding, 16px);\n}\n.mat-mdc-button > .mat-icon {\n  margin-right: var(--mat-button-text-icon-spacing, 8px);\n  margin-left: var(--mat-button-text-icon-offset, -4px);\n}\n[dir=rtl] .mat-mdc-button > .mat-icon {\n  margin-right: var(--mat-button-text-icon-offset, -4px);\n  margin-left: var(--mat-button-text-icon-spacing, 8px);\n}\n.mat-mdc-button .mdc-button__label + .mat-icon {\n  margin-right: var(--mat-button-text-icon-offset, -4px);\n  margin-left: var(--mat-button-text-icon-spacing, 8px);\n}\n[dir=rtl] .mat-mdc-button .mdc-button__label + .mat-icon {\n  margin-right: var(--mat-button-text-icon-spacing, 8px);\n  margin-left: var(--mat-button-text-icon-offset, -4px);\n}\n.mat-mdc-button .mat-ripple-element {\n  background-color: var(--mat-button-text-ripple-color, color-mix(in srgb, var(--mat-sys-primary) calc(var(--mat-sys-pressed-state-layer-opacity) * 100%), transparent));\n}\n.mat-mdc-button .mat-mdc-button-persistent-ripple::before {\n  background-color: var(--mat-button-text-state-layer-color, var(--mat-sys-primary));\n}\n.mat-mdc-button.mat-mdc-button-disabled .mat-mdc-button-persistent-ripple::before {\n  background-color: var(--mat-button-text-disabled-state-layer-color, var(--mat-sys-on-surface-variant));\n}\n.mat-mdc-button:hover > .mat-mdc-button-persistent-ripple::before {\n  opacity: var(--mat-button-text-hover-state-layer-opacity, var(--mat-sys-hover-state-layer-opacity));\n}\n.mat-mdc-button.cdk-program-focused > .mat-mdc-button-persistent-ripple::before, .mat-mdc-button.cdk-keyboard-focused > .mat-mdc-button-persistent-ripple::before, .mat-mdc-button.mat-mdc-button-disabled-interactive:focus > .mat-mdc-button-persistent-ripple::before {\n  opacity: var(--mat-button-text-focus-state-layer-opacity, var(--mat-sys-focus-state-layer-opacity));\n}\n.mat-mdc-button:active > .mat-mdc-button-persistent-ripple::before {\n  opacity: var(--mat-button-text-pressed-state-layer-opacity, var(--mat-sys-pressed-state-layer-opacity));\n}\n.mat-mdc-button .mat-mdc-button-touch-target {\n  position: absolute;\n  top: 50%;\n  height: var(--mat-button-text-touch-target-size, 48px);\n  display: var(--mat-button-text-touch-target-display, block);\n  left: 0;\n  right: 0;\n  transform: translateY(-50%);\n}\n\n.mat-mdc-unelevated-button {\n  transition: box-shadow 280ms cubic-bezier(0.4, 0, 0.2, 1);\n  height: var(--mat-button-filled-container-height, 40px);\n  font-family: var(--mat-button-filled-label-text-font, var(--mat-sys-label-large-font));\n  font-size: var(--mat-button-filled-label-text-size, var(--mat-sys-label-large-size));\n  letter-spacing: var(--mat-button-filled-label-text-tracking, var(--mat-sys-label-large-tracking));\n  text-transform: var(--mat-button-filled-label-text-transform);\n  font-weight: var(--mat-button-filled-label-text-weight, var(--mat-sys-label-large-weight));\n  padding: 0 var(--mat-button-filled-horizontal-padding, 24px);\n}\n.mat-mdc-unelevated-button > .mat-icon {\n  margin-right: var(--mat-button-filled-icon-spacing, 8px);\n  margin-left: var(--mat-button-filled-icon-offset, -8px);\n}\n[dir=rtl] .mat-mdc-unelevated-button > .mat-icon {\n  margin-right: var(--mat-button-filled-icon-offset, -8px);\n  margin-left: var(--mat-button-filled-icon-spacing, 8px);\n}\n.mat-mdc-unelevated-button .mdc-button__label + .mat-icon {\n  margin-right: var(--mat-button-filled-icon-offset, -8px);\n  margin-left: var(--mat-button-filled-icon-spacing, 8px);\n}\n[dir=rtl] .mat-mdc-unelevated-button .mdc-button__label + .mat-icon {\n  margin-right: var(--mat-button-filled-icon-spacing, 8px);\n  margin-left: var(--mat-button-filled-icon-offset, -8px);\n}\n.mat-mdc-unelevated-button .mat-ripple-element {\n  background-color: var(--mat-button-filled-ripple-color, color-mix(in srgb, var(--mat-sys-on-primary) calc(var(--mat-sys-pressed-state-layer-opacity) * 100%), transparent));\n}\n.mat-mdc-unelevated-button .mat-mdc-button-persistent-ripple::before {\n  background-color: var(--mat-button-filled-state-layer-color, var(--mat-sys-on-primary));\n}\n.mat-mdc-unelevated-button.mat-mdc-button-disabled .mat-mdc-button-persistent-ripple::before {\n  background-color: var(--mat-button-filled-disabled-state-layer-color, var(--mat-sys-on-surface-variant));\n}\n.mat-mdc-unelevated-button:hover > .mat-mdc-button-persistent-ripple::before {\n  opacity: var(--mat-button-filled-hover-state-layer-opacity, var(--mat-sys-hover-state-layer-opacity));\n}\n.mat-mdc-unelevated-button.cdk-program-focused > .mat-mdc-button-persistent-ripple::before, .mat-mdc-unelevated-button.cdk-keyboard-focused > .mat-mdc-button-persistent-ripple::before, .mat-mdc-unelevated-button.mat-mdc-button-disabled-interactive:focus > .mat-mdc-button-persistent-ripple::before {\n  opacity: var(--mat-button-filled-focus-state-layer-opacity, var(--mat-sys-focus-state-layer-opacity));\n}\n.mat-mdc-unelevated-button:active > .mat-mdc-button-persistent-ripple::before {\n  opacity: var(--mat-button-filled-pressed-state-layer-opacity, var(--mat-sys-pressed-state-layer-opacity));\n}\n.mat-mdc-unelevated-button .mat-mdc-button-touch-target {\n  position: absolute;\n  top: 50%;\n  height: var(--mat-button-filled-touch-target-size, 48px);\n  display: var(--mat-button-filled-touch-target-display, block);\n  left: 0;\n  right: 0;\n  transform: translateY(-50%);\n}\n.mat-mdc-unelevated-button:not(:disabled) {\n  color: var(--mat-button-filled-label-text-color, var(--mat-sys-on-primary));\n  background-color: var(--mat-button-filled-container-color, var(--mat-sys-primary));\n}\n.mat-mdc-unelevated-button, .mat-mdc-unelevated-button .mdc-button__ripple {\n  border-radius: var(--mat-button-filled-container-shape, var(--mat-sys-corner-full));\n}\n.mat-mdc-unelevated-button .mat-mdc-button-progress-indicator-container {\n  --mat-progress-spinner-active-indicator-color: var(--mat-button-filled-progress-active-indicator-color, var(--mat-sys-on-primary));\n}\n.mat-mdc-unelevated-button[disabled], .mat-mdc-unelevated-button.mat-mdc-button-disabled {\n  cursor: default;\n  pointer-events: none;\n  color: var(--mat-button-filled-disabled-label-text-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));\n  background-color: var(--mat-button-filled-disabled-container-color, color-mix(in srgb, var(--mat-sys-on-surface) 12%, transparent));\n}\n.mat-mdc-unelevated-button.mat-mdc-button-disabled-interactive {\n  pointer-events: auto;\n}\n\n.mat-mdc-raised-button {\n  transition: box-shadow 280ms cubic-bezier(0.4, 0, 0.2, 1);\n  box-shadow: var(--mat-button-protected-container-elevation-shadow, var(--mat-sys-level1));\n  height: var(--mat-button-protected-container-height, 40px);\n  font-family: var(--mat-button-protected-label-text-font, var(--mat-sys-label-large-font));\n  font-size: var(--mat-button-protected-label-text-size, var(--mat-sys-label-large-size));\n  letter-spacing: var(--mat-button-protected-label-text-tracking, var(--mat-sys-label-large-tracking));\n  text-transform: var(--mat-button-protected-label-text-transform);\n  font-weight: var(--mat-button-protected-label-text-weight, var(--mat-sys-label-large-weight));\n  padding: 0 var(--mat-button-protected-horizontal-padding, 24px);\n}\n.mat-mdc-raised-button > .mat-icon {\n  margin-right: var(--mat-button-protected-icon-spacing, 8px);\n  margin-left: var(--mat-button-protected-icon-offset, -8px);\n}\n[dir=rtl] .mat-mdc-raised-button > .mat-icon {\n  margin-right: var(--mat-button-protected-icon-offset, -8px);\n  margin-left: var(--mat-button-protected-icon-spacing, 8px);\n}\n.mat-mdc-raised-button .mdc-button__label + .mat-icon {\n  margin-right: var(--mat-button-protected-icon-offset, -8px);\n  margin-left: var(--mat-button-protected-icon-spacing, 8px);\n}\n[dir=rtl] .mat-mdc-raised-button .mdc-button__label + .mat-icon {\n  margin-right: var(--mat-button-protected-icon-spacing, 8px);\n  margin-left: var(--mat-button-protected-icon-offset, -8px);\n}\n.mat-mdc-raised-button .mat-ripple-element {\n  background-color: var(--mat-button-protected-ripple-color, color-mix(in srgb, var(--mat-sys-primary) calc(var(--mat-sys-pressed-state-layer-opacity) * 100%), transparent));\n}\n.mat-mdc-raised-button .mat-mdc-button-persistent-ripple::before {\n  background-color: var(--mat-button-protected-state-layer-color, var(--mat-sys-primary));\n}\n.mat-mdc-raised-button.mat-mdc-button-disabled .mat-mdc-button-persistent-ripple::before {\n  background-color: var(--mat-button-protected-disabled-state-layer-color, var(--mat-sys-on-surface-variant));\n}\n.mat-mdc-raised-button:hover > .mat-mdc-button-persistent-ripple::before {\n  opacity: var(--mat-button-protected-hover-state-layer-opacity, var(--mat-sys-hover-state-layer-opacity));\n}\n.mat-mdc-raised-button.cdk-program-focused > .mat-mdc-button-persistent-ripple::before, .mat-mdc-raised-button.cdk-keyboard-focused > .mat-mdc-button-persistent-ripple::before, .mat-mdc-raised-button.mat-mdc-button-disabled-interactive:focus > .mat-mdc-button-persistent-ripple::before {\n  opacity: var(--mat-button-protected-focus-state-layer-opacity, var(--mat-sys-focus-state-layer-opacity));\n}\n.mat-mdc-raised-button:active > .mat-mdc-button-persistent-ripple::before {\n  opacity: var(--mat-button-protected-pressed-state-layer-opacity, var(--mat-sys-pressed-state-layer-opacity));\n}\n.mat-mdc-raised-button .mat-mdc-button-touch-target {\n  position: absolute;\n  top: 50%;\n  height: var(--mat-button-protected-touch-target-size, 48px);\n  display: var(--mat-button-protected-touch-target-display, block);\n  left: 0;\n  right: 0;\n  transform: translateY(-50%);\n}\n.mat-mdc-raised-button:not(:disabled) {\n  color: var(--mat-button-protected-label-text-color, var(--mat-sys-primary));\n  background-color: var(--mat-button-protected-container-color, var(--mat-sys-surface));\n}\n.mat-mdc-raised-button, .mat-mdc-raised-button .mdc-button__ripple {\n  border-radius: var(--mat-button-protected-container-shape, var(--mat-sys-corner-full));\n}\n@media (hover: hover) {\n  .mat-mdc-raised-button:hover {\n    box-shadow: var(--mat-button-protected-hover-container-elevation-shadow, var(--mat-sys-level2));\n  }\n}\n.mat-mdc-raised-button:focus {\n  box-shadow: var(--mat-button-protected-focus-container-elevation-shadow, var(--mat-sys-level1));\n}\n.mat-mdc-raised-button:active, .mat-mdc-raised-button:focus:active {\n  box-shadow: var(--mat-button-protected-pressed-container-elevation-shadow, var(--mat-sys-level1));\n}\n.mat-mdc-raised-button[disabled], .mat-mdc-raised-button.mat-mdc-button-disabled {\n  cursor: default;\n  pointer-events: none;\n  color: var(--mat-button-protected-disabled-label-text-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));\n  background-color: var(--mat-button-protected-disabled-container-color, color-mix(in srgb, var(--mat-sys-on-surface) 12%, transparent));\n}\n.mat-mdc-raised-button[disabled].mat-mdc-button-disabled, .mat-mdc-raised-button.mat-mdc-button-disabled.mat-mdc-button-disabled {\n  box-shadow: var(--mat-button-protected-disabled-container-elevation-shadow, var(--mat-sys-level0));\n}\n.mat-mdc-raised-button.mat-mdc-button-disabled-interactive {\n  pointer-events: auto;\n}\n\n.mat-mdc-outlined-button {\n  border-style: solid;\n  transition: border 280ms cubic-bezier(0.4, 0, 0.2, 1);\n  height: var(--mat-button-outlined-container-height, 40px);\n  font-family: var(--mat-button-outlined-label-text-font, var(--mat-sys-label-large-font));\n  font-size: var(--mat-button-outlined-label-text-size, var(--mat-sys-label-large-size));\n  letter-spacing: var(--mat-button-outlined-label-text-tracking, var(--mat-sys-label-large-tracking));\n  text-transform: var(--mat-button-outlined-label-text-transform);\n  font-weight: var(--mat-button-outlined-label-text-weight, var(--mat-sys-label-large-weight));\n  border-radius: var(--mat-button-outlined-container-shape, var(--mat-sys-corner-full));\n  border-width: var(--mat-button-outlined-outline-width, 1px);\n  padding: 0 var(--mat-button-outlined-horizontal-padding, 24px);\n}\n.mat-mdc-outlined-button > .mat-icon {\n  margin-right: var(--mat-button-outlined-icon-spacing, 8px);\n  margin-left: var(--mat-button-outlined-icon-offset, -8px);\n}\n[dir=rtl] .mat-mdc-outlined-button > .mat-icon {\n  margin-right: var(--mat-button-outlined-icon-offset, -8px);\n  margin-left: var(--mat-button-outlined-icon-spacing, 8px);\n}\n.mat-mdc-outlined-button .mdc-button__label + .mat-icon {\n  margin-right: var(--mat-button-outlined-icon-offset, -8px);\n  margin-left: var(--mat-button-outlined-icon-spacing, 8px);\n}\n[dir=rtl] .mat-mdc-outlined-button .mdc-button__label + .mat-icon {\n  margin-right: var(--mat-button-outlined-icon-spacing, 8px);\n  margin-left: var(--mat-button-outlined-icon-offset, -8px);\n}\n.mat-mdc-outlined-button .mat-ripple-element {\n  background-color: var(--mat-button-outlined-ripple-color, color-mix(in srgb, var(--mat-sys-primary) calc(var(--mat-sys-pressed-state-layer-opacity) * 100%), transparent));\n}\n.mat-mdc-outlined-button .mat-mdc-button-persistent-ripple::before {\n  background-color: var(--mat-button-outlined-state-layer-color, var(--mat-sys-primary));\n}\n.mat-mdc-outlined-button.mat-mdc-button-disabled .mat-mdc-button-persistent-ripple::before {\n  background-color: var(--mat-button-outlined-disabled-state-layer-color, var(--mat-sys-on-surface-variant));\n}\n.mat-mdc-outlined-button:hover > .mat-mdc-button-persistent-ripple::before {\n  opacity: var(--mat-button-outlined-hover-state-layer-opacity, var(--mat-sys-hover-state-layer-opacity));\n}\n.mat-mdc-outlined-button.cdk-program-focused > .mat-mdc-button-persistent-ripple::before, .mat-mdc-outlined-button.cdk-keyboard-focused > .mat-mdc-button-persistent-ripple::before, .mat-mdc-outlined-button.mat-mdc-button-disabled-interactive:focus > .mat-mdc-button-persistent-ripple::before {\n  opacity: var(--mat-button-outlined-focus-state-layer-opacity, var(--mat-sys-focus-state-layer-opacity));\n}\n.mat-mdc-outlined-button:active > .mat-mdc-button-persistent-ripple::before {\n  opacity: var(--mat-button-outlined-pressed-state-layer-opacity, var(--mat-sys-pressed-state-layer-opacity));\n}\n.mat-mdc-outlined-button .mat-mdc-button-touch-target {\n  position: absolute;\n  top: 50%;\n  height: var(--mat-button-outlined-touch-target-size, 48px);\n  display: var(--mat-button-outlined-touch-target-display, block);\n  left: 0;\n  right: 0;\n  transform: translateY(-50%);\n}\n.mat-mdc-outlined-button:not(:disabled) {\n  color: var(--mat-button-outlined-label-text-color, var(--mat-sys-primary));\n  border-color: var(--mat-button-outlined-outline-color, var(--mat-sys-outline));\n}\n.mat-mdc-outlined-button[disabled], .mat-mdc-outlined-button.mat-mdc-button-disabled {\n  cursor: default;\n  pointer-events: none;\n  color: var(--mat-button-outlined-disabled-label-text-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));\n  border-color: var(--mat-button-outlined-disabled-outline-color, color-mix(in srgb, var(--mat-sys-on-surface) 12%, transparent));\n}\n.mat-mdc-outlined-button.mat-mdc-button-disabled-interactive {\n  pointer-events: auto;\n}\n\n.mat-tonal-button {\n  transition: box-shadow 280ms cubic-bezier(0.4, 0, 0.2, 1);\n  height: var(--mat-button-tonal-container-height, 40px);\n  font-family: var(--mat-button-tonal-label-text-font, var(--mat-sys-label-large-font));\n  font-size: var(--mat-button-tonal-label-text-size, var(--mat-sys-label-large-size));\n  letter-spacing: var(--mat-button-tonal-label-text-tracking, var(--mat-sys-label-large-tracking));\n  text-transform: var(--mat-button-tonal-label-text-transform);\n  font-weight: var(--mat-button-tonal-label-text-weight, var(--mat-sys-label-large-weight));\n  padding: 0 var(--mat-button-tonal-horizontal-padding, 24px);\n}\n.mat-tonal-button:not(:disabled) {\n  color: var(--mat-button-tonal-label-text-color, var(--mat-sys-on-secondary-container));\n  background-color: var(--mat-button-tonal-container-color, var(--mat-sys-secondary-container));\n}\n.mat-tonal-button, .mat-tonal-button .mdc-button__ripple {\n  border-radius: var(--mat-button-tonal-container-shape, var(--mat-sys-corner-full));\n}\n.mat-tonal-button[disabled], .mat-tonal-button.mat-mdc-button-disabled {\n  cursor: default;\n  pointer-events: none;\n  color: var(--mat-button-tonal-disabled-label-text-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));\n  background-color: var(--mat-button-tonal-disabled-container-color, color-mix(in srgb, var(--mat-sys-on-surface) 12%, transparent));\n}\n.mat-tonal-button.mat-mdc-button-disabled-interactive {\n  pointer-events: auto;\n}\n.mat-tonal-button > .mat-icon {\n  margin-right: var(--mat-button-tonal-icon-spacing, 8px);\n  margin-left: var(--mat-button-tonal-icon-offset, -8px);\n}\n[dir=rtl] .mat-tonal-button > .mat-icon {\n  margin-right: var(--mat-button-tonal-icon-offset, -8px);\n  margin-left: var(--mat-button-tonal-icon-spacing, 8px);\n}\n.mat-tonal-button .mdc-button__label + .mat-icon {\n  margin-right: var(--mat-button-tonal-icon-offset, -8px);\n  margin-left: var(--mat-button-tonal-icon-spacing, 8px);\n}\n[dir=rtl] .mat-tonal-button .mdc-button__label + .mat-icon {\n  margin-right: var(--mat-button-tonal-icon-spacing, 8px);\n  margin-left: var(--mat-button-tonal-icon-offset, -8px);\n}\n.mat-tonal-button .mat-ripple-element {\n  background-color: var(--mat-button-tonal-ripple-color, color-mix(in srgb, var(--mat-sys-on-secondary-container) calc(var(--mat-sys-pressed-state-layer-opacity) * 100%), transparent));\n}\n.mat-tonal-button .mat-mdc-button-persistent-ripple::before {\n  background-color: var(--mat-button-tonal-state-layer-color, var(--mat-sys-on-secondary-container));\n}\n.mat-tonal-button.mat-mdc-button-disabled .mat-mdc-button-persistent-ripple::before {\n  background-color: var(--mat-button-tonal-disabled-state-layer-color, var(--mat-sys-on-surface-variant));\n}\n.mat-tonal-button:hover > .mat-mdc-button-persistent-ripple::before {\n  opacity: var(--mat-button-tonal-hover-state-layer-opacity, var(--mat-sys-hover-state-layer-opacity));\n}\n.mat-tonal-button.cdk-program-focused > .mat-mdc-button-persistent-ripple::before, .mat-tonal-button.cdk-keyboard-focused > .mat-mdc-button-persistent-ripple::before, .mat-tonal-button.mat-mdc-button-disabled-interactive:focus > .mat-mdc-button-persistent-ripple::before {\n  opacity: var(--mat-button-tonal-focus-state-layer-opacity, var(--mat-sys-focus-state-layer-opacity));\n}\n.mat-tonal-button:active > .mat-mdc-button-persistent-ripple::before {\n  opacity: var(--mat-button-tonal-pressed-state-layer-opacity, var(--mat-sys-pressed-state-layer-opacity));\n}\n.mat-tonal-button .mat-mdc-button-touch-target {\n  position: absolute;\n  top: 50%;\n  height: var(--mat-button-tonal-touch-target-size, 48px);\n  display: var(--mat-button-tonal-touch-target-display, block);\n  left: 0;\n  right: 0;\n  transform: translateY(-50%);\n}\n\n.mat-mdc-button,\n.mat-mdc-unelevated-button,\n.mat-mdc-raised-button,\n.mat-mdc-outlined-button,\n.mat-tonal-button {\n  -webkit-tap-highlight-color: transparent;\n}\n.mat-mdc-button .mat-mdc-button-ripple,\n.mat-mdc-button .mat-mdc-button-persistent-ripple,\n.mat-mdc-button .mat-mdc-button-persistent-ripple::before,\n.mat-mdc-unelevated-button .mat-mdc-button-ripple,\n.mat-mdc-unelevated-button .mat-mdc-button-persistent-ripple,\n.mat-mdc-unelevated-button .mat-mdc-button-persistent-ripple::before,\n.mat-mdc-raised-button .mat-mdc-button-ripple,\n.mat-mdc-raised-button .mat-mdc-button-persistent-ripple,\n.mat-mdc-raised-button .mat-mdc-button-persistent-ripple::before,\n.mat-mdc-outlined-button .mat-mdc-button-ripple,\n.mat-mdc-outlined-button .mat-mdc-button-persistent-ripple,\n.mat-mdc-outlined-button .mat-mdc-button-persistent-ripple::before,\n.mat-tonal-button .mat-mdc-button-ripple,\n.mat-tonal-button .mat-mdc-button-persistent-ripple,\n.mat-tonal-button .mat-mdc-button-persistent-ripple::before {\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  position: absolute;\n  pointer-events: none;\n  border-radius: inherit;\n}\n.mat-mdc-button .mat-mdc-button-ripple,\n.mat-mdc-unelevated-button .mat-mdc-button-ripple,\n.mat-mdc-raised-button .mat-mdc-button-ripple,\n.mat-mdc-outlined-button .mat-mdc-button-ripple,\n.mat-tonal-button .mat-mdc-button-ripple {\n  overflow: hidden;\n}\n.mat-mdc-button .mat-mdc-button-persistent-ripple::before,\n.mat-mdc-unelevated-button .mat-mdc-button-persistent-ripple::before,\n.mat-mdc-raised-button .mat-mdc-button-persistent-ripple::before,\n.mat-mdc-outlined-button .mat-mdc-button-persistent-ripple::before,\n.mat-tonal-button .mat-mdc-button-persistent-ripple::before {\n  content: \"\";\n  opacity: 0;\n}\n.mat-mdc-button .mdc-button__label,\n.mat-mdc-button .mat-icon,\n.mat-mdc-unelevated-button .mdc-button__label,\n.mat-mdc-unelevated-button .mat-icon,\n.mat-mdc-raised-button .mdc-button__label,\n.mat-mdc-raised-button .mat-icon,\n.mat-mdc-outlined-button .mdc-button__label,\n.mat-mdc-outlined-button .mat-icon,\n.mat-tonal-button .mdc-button__label,\n.mat-tonal-button .mat-icon {\n  z-index: 1;\n  position: relative;\n}\n.mat-mdc-button .mat-focus-indicator,\n.mat-mdc-unelevated-button .mat-focus-indicator,\n.mat-mdc-raised-button .mat-focus-indicator,\n.mat-mdc-outlined-button .mat-focus-indicator,\n.mat-tonal-button .mat-focus-indicator {\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  position: absolute;\n  border-radius: inherit;\n}\n.mat-mdc-button:focus-visible > .mat-focus-indicator::before,\n.mat-mdc-unelevated-button:focus-visible > .mat-focus-indicator::before,\n.mat-mdc-raised-button:focus-visible > .mat-focus-indicator::before,\n.mat-mdc-outlined-button:focus-visible > .mat-focus-indicator::before,\n.mat-tonal-button:focus-visible > .mat-focus-indicator::before {\n  content: \"\";\n  border-radius: inherit;\n}\n.mat-mdc-button._mat-animation-noopable,\n.mat-mdc-unelevated-button._mat-animation-noopable,\n.mat-mdc-raised-button._mat-animation-noopable,\n.mat-mdc-outlined-button._mat-animation-noopable,\n.mat-tonal-button._mat-animation-noopable {\n  transition: none !important;\n  animation: none !important;\n}\n.mat-mdc-button > .mat-icon,\n.mat-mdc-unelevated-button > .mat-icon,\n.mat-mdc-raised-button > .mat-icon,\n.mat-mdc-outlined-button > .mat-icon,\n.mat-tonal-button > .mat-icon {\n  display: inline-block;\n  position: relative;\n  vertical-align: top;\n  font-size: 1.125rem;\n  height: 1.125rem;\n  width: 1.125rem;\n}\n\n.mat-mdc-outlined-button .mat-mdc-button-ripple,\n.mat-mdc-outlined-button .mdc-button__ripple {\n  top: -1px;\n  left: -1px;\n  bottom: -1px;\n  right: -1px;\n}\n\n.mat-mdc-unelevated-button .mat-focus-indicator::before,\n.mat-tonal-button .mat-focus-indicator::before,\n.mat-mdc-raised-button .mat-focus-indicator::before {\n  margin: calc(calc(var(--mat-focus-indicator-border-width, 3px) + 2px) * -1);\n}\n\n.mat-mdc-outlined-button .mat-focus-indicator::before {\n  margin: calc(calc(var(--mat-focus-indicator-border-width, 3px) + 3px) * -1);\n}\n\n.mat-mdc-button-progress-indicator-container {\n  position: absolute;\n  inset-inline-start: 0;\n  inset-block-start: 0;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  width: 100%;\n  height: 100%;\n  box-sizing: border-box;\n}\n\n.mat-mdc-button-progress-indicator-shown mat-icon,\n.mat-mdc-button-progress-indicator-shown [matButtonIcon],\n.mat-mdc-button-progress-indicator-shown .mdc-button__label {\n  visibility: hidden;\n}\n", "@media (forced-colors: active) {\n  .mat-mdc-button:not(.mdc-button--outlined),\n  .mat-mdc-unelevated-button:not(.mdc-button--outlined),\n  .mat-mdc-raised-button:not(.mdc-button--outlined),\n  .mat-mdc-outlined-button:not(.mdc-button--outlined),\n  .mat-mdc-button-base.mat-tonal-button,\n  .mat-mdc-icon-button.mat-mdc-icon-button,\n  .mat-mdc-outlined-button .mdc-button__ripple {\n    outline: solid 1px;\n  }\n}\n"]
		}]
	}], () => [], { appearance: [{
		type: Input,
		args: ["matButton"]
	}] });
})();
function _inferAppearance(button) {
	if (button.hasAttribute("mat-raised-button")) return "elevated";
	if (button.hasAttribute("mat-stroked-button")) return "outlined";
	if (button.hasAttribute("mat-flat-button")) return "filled";
	if (button.hasAttribute("mat-button")) return "text";
	return null;
}
var MatAnchor = MatButton;
var MAT_FAB_DEFAULT_OPTIONS = new InjectionToken("mat-mdc-fab-default-options", {
	providedIn: "root",
	factory: () => defaults
});
var defaults = { color: "accent" };
var MatFabButton = class MatFabButton extends MatButtonBase {
	_options = inject(MAT_FAB_DEFAULT_OPTIONS, { optional: true });
	_isFab = true;
	extended = false;
	constructor() {
		super();
		this._options = this._options || defaults;
		this.color = this._options.color || defaults.color;
	}
	static ɵfac = function MatFabButton_Factory(__ngFactoryType__) {
		return new (__ngFactoryType__ || MatFabButton)();
	};
	static ɵcmp = /* @__PURE__ */ ɵɵdefineComponent({
		type: MatFabButton,
		selectors: [
			[
				"button",
				"mat-fab",
				""
			],
			[
				"a",
				"mat-fab",
				""
			],
			[
				"button",
				"matFab",
				""
			],
			[
				"a",
				"matFab",
				""
			]
		],
		hostAttrs: [
			1,
			"mdc-fab",
			"mat-mdc-fab-base",
			"mat-mdc-fab"
		],
		hostVars: 4,
		hostBindings: function MatFabButton_HostBindings(rf, ctx) {
			if (rf & 2) ɵɵclassProp("mdc-fab--extended", ctx.extended)("mat-mdc-extended-fab", ctx.extended);
		},
		inputs: { extended: [
			2,
			"extended",
			"extended",
			booleanAttribute
		] },
		exportAs: ["matButton", "matAnchor"],
		features: [ɵɵInheritDefinitionFeature],
		ngContentSelectors: _c1,
		decls: 8,
		vars: 5,
		consts: [
			[1, "mat-mdc-button-persistent-ripple"],
			[1, "mdc-button__label"],
			[1, "mat-mdc-button-progress-indicator-container"],
			[1, "mat-focus-indicator"],
			[1, "mat-mdc-button-touch-target"]
		],
		template: function MatFabButton_Template(rf, ctx) {
			if (rf & 1) {
				ɵɵprojectionDef(_c0);
				ɵɵdomElement(0, "span", 0);
				ɵɵprojection(1);
				ɵɵdomElementStart(2, "span", 1);
				ɵɵprojection(3, 1);
				ɵɵdomElementEnd();
				ɵɵprojection(4, 2);
				ɵɵconditionalCreate(5, MatFabButton_Conditional_5_Template, 2, 0, "div", 2);
				ɵɵdomElement(6, "span", 3)(7, "span", 4);
			}
			if (rf & 2) {
				ɵɵclassProp("mdc-button__ripple", !ctx._isFab)("mdc-fab__ripple", ctx._isFab);
				ɵɵadvance(5);
				ɵɵconditional(ctx.showProgress() ? 5 : -1);
			}
		},
		styles: [".mat-mdc-fab-base {\n  -webkit-user-select: none;\n  user-select: none;\n  position: relative;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  box-sizing: border-box;\n  width: 56px;\n  height: 56px;\n  padding: 0;\n  border: none;\n  fill: currentColor;\n  text-decoration: none;\n  cursor: pointer;\n  -moz-appearance: none;\n  -webkit-appearance: none;\n  overflow: visible;\n  transition: box-shadow 280ms cubic-bezier(0.4, 0, 0.2, 1), opacity 15ms linear 30ms, transform 270ms 0ms cubic-bezier(0, 0, 0.2, 1);\n  flex-shrink: 0;\n  -webkit-tap-highlight-color: transparent;\n}\n.mat-mdc-fab-base .mat-mdc-button-ripple,\n.mat-mdc-fab-base .mat-mdc-button-persistent-ripple,\n.mat-mdc-fab-base .mat-mdc-button-persistent-ripple::before {\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  position: absolute;\n  pointer-events: none;\n  border-radius: inherit;\n}\n.mat-mdc-fab-base .mat-mdc-button-ripple {\n  overflow: hidden;\n}\n.mat-mdc-fab-base .mat-mdc-button-persistent-ripple::before {\n  content: \"\";\n  opacity: 0;\n}\n.mat-mdc-fab-base .mdc-button__label,\n.mat-mdc-fab-base .mat-icon {\n  z-index: 1;\n  position: relative;\n}\n.mat-mdc-fab-base .mat-focus-indicator {\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  position: absolute;\n}\n.mat-mdc-fab-base:focus-visible > .mat-focus-indicator::before {\n  content: \"\";\n}\n.mat-mdc-fab-base._mat-animation-noopable {\n  transition: none !important;\n  animation: none !important;\n}\n.mat-mdc-fab-base::before {\n  position: absolute;\n  box-sizing: border-box;\n  width: 100%;\n  height: 100%;\n  top: 0;\n  left: 0;\n  border: 1px solid transparent;\n  border-radius: inherit;\n  content: \"\";\n  pointer-events: none;\n}\n.mat-mdc-fab-base[hidden] {\n  display: none;\n}\n.mat-mdc-fab-base::-moz-focus-inner {\n  padding: 0;\n  border: 0;\n}\n.mat-mdc-fab-base:active, .mat-mdc-fab-base:focus {\n  outline: none;\n}\n.mat-mdc-fab-base:hover {\n  cursor: pointer;\n}\n.mat-mdc-fab-base > svg {\n  width: 100%;\n}\n.mat-mdc-fab-base .mat-icon, .mat-mdc-fab-base .material-icons {\n  transition: transform 180ms 90ms cubic-bezier(0, 0, 0.2, 1);\n  fill: currentColor;\n  will-change: transform;\n}\n.mat-mdc-fab-base .mat-focus-indicator::before {\n  margin: calc(calc(var(--%NS%mat-focus-indicator-border-width, 3px) + 2px) * -1);\n  border-radius: calc(var(--%NS%mat-fab-container-shape, var(--%NS%mat-sys-corner-large)) + calc(var(--%NS%mat-focus-indicator-border-width, 3px) + 2px));\n}\n.mat-mdc-fab-base[disabled], .mat-mdc-fab-base.mat-mdc-button-disabled {\n  cursor: default;\n  pointer-events: none;\n}\n.mat-mdc-fab-base[disabled], .mat-mdc-fab-base[disabled]:focus, .mat-mdc-fab-base.mat-mdc-button-disabled, .mat-mdc-fab-base.mat-mdc-button-disabled:focus {\n  box-shadow: none;\n}\n.mat-mdc-fab-base.mat-mdc-button-disabled-interactive {\n  pointer-events: auto;\n}\n\n.mat-mdc-fab {\n  background-color: var(--%NS%mat-fab-container-color, var(--%NS%mat-sys-primary-container));\n  border-radius: var(--%NS%mat-fab-container-shape, var(--%NS%mat-sys-corner-large));\n  color: var(--%NS%mat-fab-foreground-color, var(--%NS%mat-sys-on-primary-container, inherit));\n  box-shadow: var(--%NS%mat-fab-container-elevation-shadow, var(--%NS%mat-sys-level3));\n}\n@media (hover: hover) {\n  .mat-mdc-fab:hover {\n    box-shadow: var(--%NS%mat-fab-hover-container-elevation-shadow, var(--%NS%mat-sys-level4));\n  }\n}\n.mat-mdc-fab:focus {\n  box-shadow: var(--%NS%mat-fab-focus-container-elevation-shadow, var(--%NS%mat-sys-level3));\n}\n.mat-mdc-fab:active, .mat-mdc-fab:focus:active {\n  box-shadow: var(--%NS%mat-fab-pressed-container-elevation-shadow, var(--%NS%mat-sys-level3));\n}\n.mat-mdc-fab[disabled], .mat-mdc-fab.mat-mdc-button-disabled {\n  cursor: default;\n  pointer-events: none;\n  color: var(--%NS%mat-fab-disabled-state-foreground-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) 38%, transparent));\n  background-color: var(--%NS%mat-fab-disabled-state-container-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) 12%, transparent));\n}\n.mat-mdc-fab.mat-mdc-button-disabled-interactive {\n  pointer-events: auto;\n}\n.mat-mdc-fab .mat-mdc-button-touch-target {\n  position: absolute;\n  top: 50%;\n  height: var(--%NS%mat-fab-touch-target-size, 48px);\n  display: var(--%NS%mat-fab-touch-target-display, block);\n  left: 50%;\n  width: var(--%NS%mat-fab-touch-target-size, 48px);\n  transform: translate(-50%, -50%);\n}\n.mat-mdc-fab .mat-ripple-element {\n  background-color: var(--%NS%mat-fab-ripple-color, color-mix(in srgb, var(--%NS%mat-sys-on-primary-container) calc(var(--%NS%mat-sys-pressed-state-layer-opacity) * 100%), transparent));\n}\n.mat-mdc-fab .mat-mdc-button-persistent-ripple::before {\n  background-color: var(--%NS%mat-fab-state-layer-color, var(--%NS%mat-sys-on-primary-container));\n}\n.mat-mdc-fab.mat-mdc-button-disabled .mat-mdc-button-persistent-ripple::before {\n  background-color: var(--%NS%mat-fab-disabled-state-layer-color);\n}\n.mat-mdc-fab:hover > .mat-mdc-button-persistent-ripple::before {\n  opacity: var(--%NS%mat-fab-hover-state-layer-opacity, var(--%NS%mat-sys-hover-state-layer-opacity));\n}\n.mat-mdc-fab.cdk-program-focused > .mat-mdc-button-persistent-ripple::before, .mat-mdc-fab.cdk-keyboard-focused > .mat-mdc-button-persistent-ripple::before, .mat-mdc-fab.mat-mdc-button-disabled-interactive:focus > .mat-mdc-button-persistent-ripple::before {\n  opacity: var(--%NS%mat-fab-focus-state-layer-opacity, var(--%NS%mat-sys-focus-state-layer-opacity));\n}\n.mat-mdc-fab:active > .mat-mdc-button-persistent-ripple::before {\n  opacity: var(--%NS%mat-fab-pressed-state-layer-opacity, var(--%NS%mat-sys-pressed-state-layer-opacity));\n}\n\n.mat-mdc-mini-fab {\n  width: 40px;\n  height: 40px;\n  background-color: var(--%NS%mat-fab-small-container-color, var(--%NS%mat-sys-primary-container));\n  border-radius: var(--%NS%mat-fab-small-container-shape, var(--%NS%mat-sys-corner-medium));\n  color: var(--%NS%mat-fab-small-foreground-color, var(--%NS%mat-sys-on-primary-container, inherit));\n  box-shadow: var(--%NS%mat-fab-small-container-elevation-shadow, var(--%NS%mat-sys-level3));\n}\n@media (hover: hover) {\n  .mat-mdc-mini-fab:hover {\n    box-shadow: var(--%NS%mat-fab-small-hover-container-elevation-shadow, var(--%NS%mat-sys-level4));\n  }\n}\n.mat-mdc-mini-fab:focus {\n  box-shadow: var(--%NS%mat-fab-small-focus-container-elevation-shadow, var(--%NS%mat-sys-level3));\n}\n.mat-mdc-mini-fab:active, .mat-mdc-mini-fab:focus:active {\n  box-shadow: var(--%NS%mat-fab-small-pressed-container-elevation-shadow, var(--%NS%mat-sys-level3));\n}\n.mat-mdc-mini-fab .mat-focus-indicator::before {\n  border-radius: calc(var(--%NS%mat-fab-small-container-shape, var(--%NS%mat-sys-corner-medium)) + calc(var(--%NS%mat-focus-indicator-border-width, 3px) + 2px));\n}\n.mat-mdc-mini-fab[disabled], .mat-mdc-mini-fab.mat-mdc-button-disabled {\n  cursor: default;\n  pointer-events: none;\n  color: var(--%NS%mat-fab-small-disabled-state-foreground-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) 38%, transparent));\n  background-color: var(--%NS%mat-fab-small-disabled-state-container-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) 12%, transparent));\n}\n.mat-mdc-mini-fab.mat-mdc-button-disabled-interactive {\n  pointer-events: auto;\n}\n.mat-mdc-mini-fab .mat-mdc-button-touch-target {\n  position: absolute;\n  top: 50%;\n  height: var(--%NS%mat-fab-small-touch-target-size, 48px);\n  display: var(--%NS%mat-fab-small-touch-target-display);\n  left: 50%;\n  width: var(--%NS%mat-fab-small-touch-target-size, 48px);\n  transform: translate(-50%, -50%);\n}\n.mat-mdc-mini-fab .mat-ripple-element {\n  background-color: var(--%NS%mat-fab-small-ripple-color, color-mix(in srgb, var(--%NS%mat-sys-on-primary-container) calc(var(--%NS%mat-sys-pressed-state-layer-opacity) * 100%), transparent));\n}\n.mat-mdc-mini-fab .mat-mdc-button-persistent-ripple::before {\n  background-color: var(--%NS%mat-fab-small-state-layer-color, var(--%NS%mat-sys-on-primary-container));\n}\n.mat-mdc-mini-fab.mat-mdc-button-disabled .mat-mdc-button-persistent-ripple::before {\n  background-color: var(--%NS%mat-fab-small-disabled-state-layer-color);\n}\n.mat-mdc-mini-fab:hover > .mat-mdc-button-persistent-ripple::before {\n  opacity: var(--%NS%mat-fab-small-hover-state-layer-opacity, var(--%NS%mat-sys-hover-state-layer-opacity));\n}\n.mat-mdc-mini-fab.cdk-program-focused > .mat-mdc-button-persistent-ripple::before, .mat-mdc-mini-fab.cdk-keyboard-focused > .mat-mdc-button-persistent-ripple::before, .mat-mdc-mini-fab.mat-mdc-button-disabled-interactive:focus > .mat-mdc-button-persistent-ripple::before {\n  opacity: var(--%NS%mat-fab-small-focus-state-layer-opacity, var(--%NS%mat-sys-focus-state-layer-opacity));\n}\n.mat-mdc-mini-fab:active > .mat-mdc-button-persistent-ripple::before {\n  opacity: var(--%NS%mat-fab-small-pressed-state-layer-opacity, var(--%NS%mat-sys-pressed-state-layer-opacity));\n}\n\n.mat-mdc-extended-fab {\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  padding-left: 20px;\n  padding-right: 20px;\n  width: auto;\n  max-width: 100%;\n  line-height: normal;\n  box-shadow: var(--%NS%mat-fab-extended-container-elevation-shadow, var(--%NS%mat-sys-level3));\n  height: var(--%NS%mat-fab-extended-container-height, 56px);\n  border-radius: var(--%NS%mat-fab-extended-container-shape, var(--%NS%mat-sys-corner-large));\n  font-family: var(--%NS%mat-fab-extended-label-text-font, var(--%NS%mat-sys-label-large-font));\n  font-size: var(--%NS%mat-fab-extended-label-text-size, var(--%NS%mat-sys-label-large-size));\n  font-weight: var(--%NS%mat-fab-extended-label-text-weight, var(--%NS%mat-sys-label-large-weight));\n  letter-spacing: var(--%NS%mat-fab-extended-label-text-tracking, var(--%NS%mat-sys-label-large-tracking));\n}\n@media (hover: hover) {\n  .mat-mdc-extended-fab:hover {\n    box-shadow: var(--%NS%mat-fab-extended-hover-container-elevation-shadow, var(--%NS%mat-sys-level4));\n  }\n}\n.mat-mdc-extended-fab:focus {\n  box-shadow: var(--%NS%mat-fab-extended-focus-container-elevation-shadow, var(--%NS%mat-sys-level3));\n}\n.mat-mdc-extended-fab:active, .mat-mdc-extended-fab:focus:active {\n  box-shadow: var(--%NS%mat-fab-extended-pressed-container-elevation-shadow, var(--%NS%mat-sys-level3));\n}\n.mat-mdc-extended-fab[disabled], .mat-mdc-extended-fab.mat-mdc-button-disabled {\n  cursor: default;\n  pointer-events: none;\n}\n.mat-mdc-extended-fab[disabled], .mat-mdc-extended-fab[disabled]:focus, .mat-mdc-extended-fab.mat-mdc-button-disabled, .mat-mdc-extended-fab.mat-mdc-button-disabled:focus {\n  box-shadow: none;\n}\n.mat-mdc-extended-fab.mat-mdc-button-disabled-interactive {\n  pointer-events: auto;\n}\n[dir=rtl] .mat-mdc-extended-fab .mdc-button__label + .mat-icon, [dir=rtl] .mat-mdc-extended-fab .mdc-button__label + .material-icons,\n.mat-mdc-extended-fab > .mat-icon,\n.mat-mdc-extended-fab > .material-icons {\n  margin-left: -8px;\n  margin-right: 12px;\n}\n.mat-mdc-extended-fab .mdc-button__label + .mat-icon,\n.mat-mdc-extended-fab .mdc-button__label + .material-icons, [dir=rtl] .mat-mdc-extended-fab > .mat-icon, [dir=rtl] .mat-mdc-extended-fab > .material-icons {\n  margin-left: 12px;\n  margin-right: -8px;\n}\n.mat-mdc-extended-fab .mat-mdc-button-touch-target {\n  width: 100%;\n}\n\n.mat-mdc-button-progress-indicator-container {\n  position: absolute;\n  inset-inline-start: 0;\n  margin-block-start: 0;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  width: 100%;\n  height: 100%;\n  box-sizing: border-box;\n}\n\n.mat-mdc-button-progress-indicator-shown mat-icon,\n.mat-mdc-button-progress-indicator-shown [matButtonIcon],\n.mat-mdc-button-progress-indicator-shown .mdc-button__label {\n  visibility: hidden;\n}\n"],
		encapsulation: 2
	});
};
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatFabButton, [{
		type: Component,
		args: [{
			selector: `button[mat-fab], a[mat-fab], button[matFab], a[matFab]`,
			host: {
				"class": "mdc-fab mat-mdc-fab-base mat-mdc-fab",
				"[class.mdc-fab--extended]": "extended",
				"[class.mat-mdc-extended-fab]": "extended"
			},
			exportAs: "matButton, matAnchor",
			encapsulation: ViewEncapsulation.None,
			template: "<span\n  class=\"mat-mdc-button-persistent-ripple\"\n  [class.mdc-button__ripple]=\"!_isFab\"\n  [class.mdc-fab__ripple]=\"_isFab\"\n></span>\n\n<ng-content\n  select=\".material-icons:not([iconPositionEnd]), mat-icon:not([iconPositionEnd]), [matButtonIcon]:not([iconPositionEnd])\"\n>\n</ng-content>\n\n<span class=\"mdc-button__label\"><ng-content></ng-content></span>\n\n<ng-content\n  select=\".material-icons[iconPositionEnd], mat-icon[iconPositionEnd], [matButtonIcon][iconPositionEnd]\"\n>\n</ng-content>\n\n@if (showProgress()) {\n  <div class=\"mat-mdc-button-progress-indicator-container\">\n    <ng-content select=\"[progressIndicator]\" />\n  </div>\n}\n\n<!--\n  The indicator can't be directly on the button, because MDC uses ::before for high contrast\n  indication and it can't be on the ripple, because it has a border radius and overflow: hidden.\n-->\n<span class=\"mat-focus-indicator\"></span>\n\n<span class=\"mat-mdc-button-touch-target\"></span>\n",
			styles: [".mat-mdc-fab-base {\n  -webkit-user-select: none;\n  user-select: none;\n  position: relative;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  box-sizing: border-box;\n  width: 56px;\n  height: 56px;\n  padding: 0;\n  border: none;\n  fill: currentColor;\n  text-decoration: none;\n  cursor: pointer;\n  -moz-appearance: none;\n  -webkit-appearance: none;\n  overflow: visible;\n  transition: box-shadow 280ms cubic-bezier(0.4, 0, 0.2, 1), opacity 15ms linear 30ms, transform 270ms 0ms cubic-bezier(0, 0, 0.2, 1);\n  flex-shrink: 0;\n  -webkit-tap-highlight-color: transparent;\n}\n.mat-mdc-fab-base .mat-mdc-button-ripple,\n.mat-mdc-fab-base .mat-mdc-button-persistent-ripple,\n.mat-mdc-fab-base .mat-mdc-button-persistent-ripple::before {\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  position: absolute;\n  pointer-events: none;\n  border-radius: inherit;\n}\n.mat-mdc-fab-base .mat-mdc-button-ripple {\n  overflow: hidden;\n}\n.mat-mdc-fab-base .mat-mdc-button-persistent-ripple::before {\n  content: \"\";\n  opacity: 0;\n}\n.mat-mdc-fab-base .mdc-button__label,\n.mat-mdc-fab-base .mat-icon {\n  z-index: 1;\n  position: relative;\n}\n.mat-mdc-fab-base .mat-focus-indicator {\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  position: absolute;\n}\n.mat-mdc-fab-base:focus-visible > .mat-focus-indicator::before {\n  content: \"\";\n}\n.mat-mdc-fab-base._mat-animation-noopable {\n  transition: none !important;\n  animation: none !important;\n}\n.mat-mdc-fab-base::before {\n  position: absolute;\n  box-sizing: border-box;\n  width: 100%;\n  height: 100%;\n  top: 0;\n  left: 0;\n  border: 1px solid transparent;\n  border-radius: inherit;\n  content: \"\";\n  pointer-events: none;\n}\n.mat-mdc-fab-base[hidden] {\n  display: none;\n}\n.mat-mdc-fab-base::-moz-focus-inner {\n  padding: 0;\n  border: 0;\n}\n.mat-mdc-fab-base:active, .mat-mdc-fab-base:focus {\n  outline: none;\n}\n.mat-mdc-fab-base:hover {\n  cursor: pointer;\n}\n.mat-mdc-fab-base > svg {\n  width: 100%;\n}\n.mat-mdc-fab-base .mat-icon, .mat-mdc-fab-base .material-icons {\n  transition: transform 180ms 90ms cubic-bezier(0, 0, 0.2, 1);\n  fill: currentColor;\n  will-change: transform;\n}\n.mat-mdc-fab-base .mat-focus-indicator::before {\n  margin: calc(calc(var(--mat-focus-indicator-border-width, 3px) + 2px) * -1);\n  border-radius: calc(var(--mat-fab-container-shape, var(--mat-sys-corner-large)) + calc(var(--mat-focus-indicator-border-width, 3px) + 2px));\n}\n.mat-mdc-fab-base[disabled], .mat-mdc-fab-base.mat-mdc-button-disabled {\n  cursor: default;\n  pointer-events: none;\n}\n.mat-mdc-fab-base[disabled], .mat-mdc-fab-base[disabled]:focus, .mat-mdc-fab-base.mat-mdc-button-disabled, .mat-mdc-fab-base.mat-mdc-button-disabled:focus {\n  box-shadow: none;\n}\n.mat-mdc-fab-base.mat-mdc-button-disabled-interactive {\n  pointer-events: auto;\n}\n\n.mat-mdc-fab {\n  background-color: var(--mat-fab-container-color, var(--mat-sys-primary-container));\n  border-radius: var(--mat-fab-container-shape, var(--mat-sys-corner-large));\n  color: var(--mat-fab-foreground-color, var(--mat-sys-on-primary-container, inherit));\n  box-shadow: var(--mat-fab-container-elevation-shadow, var(--mat-sys-level3));\n}\n@media (hover: hover) {\n  .mat-mdc-fab:hover {\n    box-shadow: var(--mat-fab-hover-container-elevation-shadow, var(--mat-sys-level4));\n  }\n}\n.mat-mdc-fab:focus {\n  box-shadow: var(--mat-fab-focus-container-elevation-shadow, var(--mat-sys-level3));\n}\n.mat-mdc-fab:active, .mat-mdc-fab:focus:active {\n  box-shadow: var(--mat-fab-pressed-container-elevation-shadow, var(--mat-sys-level3));\n}\n.mat-mdc-fab[disabled], .mat-mdc-fab.mat-mdc-button-disabled {\n  cursor: default;\n  pointer-events: none;\n  color: var(--mat-fab-disabled-state-foreground-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));\n  background-color: var(--mat-fab-disabled-state-container-color, color-mix(in srgb, var(--mat-sys-on-surface) 12%, transparent));\n}\n.mat-mdc-fab.mat-mdc-button-disabled-interactive {\n  pointer-events: auto;\n}\n.mat-mdc-fab .mat-mdc-button-touch-target {\n  position: absolute;\n  top: 50%;\n  height: var(--mat-fab-touch-target-size, 48px);\n  display: var(--mat-fab-touch-target-display, block);\n  left: 50%;\n  width: var(--mat-fab-touch-target-size, 48px);\n  transform: translate(-50%, -50%);\n}\n.mat-mdc-fab .mat-ripple-element {\n  background-color: var(--mat-fab-ripple-color, color-mix(in srgb, var(--mat-sys-on-primary-container) calc(var(--mat-sys-pressed-state-layer-opacity) * 100%), transparent));\n}\n.mat-mdc-fab .mat-mdc-button-persistent-ripple::before {\n  background-color: var(--mat-fab-state-layer-color, var(--mat-sys-on-primary-container));\n}\n.mat-mdc-fab.mat-mdc-button-disabled .mat-mdc-button-persistent-ripple::before {\n  background-color: var(--mat-fab-disabled-state-layer-color);\n}\n.mat-mdc-fab:hover > .mat-mdc-button-persistent-ripple::before {\n  opacity: var(--mat-fab-hover-state-layer-opacity, var(--mat-sys-hover-state-layer-opacity));\n}\n.mat-mdc-fab.cdk-program-focused > .mat-mdc-button-persistent-ripple::before, .mat-mdc-fab.cdk-keyboard-focused > .mat-mdc-button-persistent-ripple::before, .mat-mdc-fab.mat-mdc-button-disabled-interactive:focus > .mat-mdc-button-persistent-ripple::before {\n  opacity: var(--mat-fab-focus-state-layer-opacity, var(--mat-sys-focus-state-layer-opacity));\n}\n.mat-mdc-fab:active > .mat-mdc-button-persistent-ripple::before {\n  opacity: var(--mat-fab-pressed-state-layer-opacity, var(--mat-sys-pressed-state-layer-opacity));\n}\n\n.mat-mdc-mini-fab {\n  width: 40px;\n  height: 40px;\n  background-color: var(--mat-fab-small-container-color, var(--mat-sys-primary-container));\n  border-radius: var(--mat-fab-small-container-shape, var(--mat-sys-corner-medium));\n  color: var(--mat-fab-small-foreground-color, var(--mat-sys-on-primary-container, inherit));\n  box-shadow: var(--mat-fab-small-container-elevation-shadow, var(--mat-sys-level3));\n}\n@media (hover: hover) {\n  .mat-mdc-mini-fab:hover {\n    box-shadow: var(--mat-fab-small-hover-container-elevation-shadow, var(--mat-sys-level4));\n  }\n}\n.mat-mdc-mini-fab:focus {\n  box-shadow: var(--mat-fab-small-focus-container-elevation-shadow, var(--mat-sys-level3));\n}\n.mat-mdc-mini-fab:active, .mat-mdc-mini-fab:focus:active {\n  box-shadow: var(--mat-fab-small-pressed-container-elevation-shadow, var(--mat-sys-level3));\n}\n.mat-mdc-mini-fab .mat-focus-indicator::before {\n  border-radius: calc(var(--mat-fab-small-container-shape, var(--mat-sys-corner-medium)) + calc(var(--mat-focus-indicator-border-width, 3px) + 2px));\n}\n.mat-mdc-mini-fab[disabled], .mat-mdc-mini-fab.mat-mdc-button-disabled {\n  cursor: default;\n  pointer-events: none;\n  color: var(--mat-fab-small-disabled-state-foreground-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));\n  background-color: var(--mat-fab-small-disabled-state-container-color, color-mix(in srgb, var(--mat-sys-on-surface) 12%, transparent));\n}\n.mat-mdc-mini-fab.mat-mdc-button-disabled-interactive {\n  pointer-events: auto;\n}\n.mat-mdc-mini-fab .mat-mdc-button-touch-target {\n  position: absolute;\n  top: 50%;\n  height: var(--mat-fab-small-touch-target-size, 48px);\n  display: var(--mat-fab-small-touch-target-display);\n  left: 50%;\n  width: var(--mat-fab-small-touch-target-size, 48px);\n  transform: translate(-50%, -50%);\n}\n.mat-mdc-mini-fab .mat-ripple-element {\n  background-color: var(--mat-fab-small-ripple-color, color-mix(in srgb, var(--mat-sys-on-primary-container) calc(var(--mat-sys-pressed-state-layer-opacity) * 100%), transparent));\n}\n.mat-mdc-mini-fab .mat-mdc-button-persistent-ripple::before {\n  background-color: var(--mat-fab-small-state-layer-color, var(--mat-sys-on-primary-container));\n}\n.mat-mdc-mini-fab.mat-mdc-button-disabled .mat-mdc-button-persistent-ripple::before {\n  background-color: var(--mat-fab-small-disabled-state-layer-color);\n}\n.mat-mdc-mini-fab:hover > .mat-mdc-button-persistent-ripple::before {\n  opacity: var(--mat-fab-small-hover-state-layer-opacity, var(--mat-sys-hover-state-layer-opacity));\n}\n.mat-mdc-mini-fab.cdk-program-focused > .mat-mdc-button-persistent-ripple::before, .mat-mdc-mini-fab.cdk-keyboard-focused > .mat-mdc-button-persistent-ripple::before, .mat-mdc-mini-fab.mat-mdc-button-disabled-interactive:focus > .mat-mdc-button-persistent-ripple::before {\n  opacity: var(--mat-fab-small-focus-state-layer-opacity, var(--mat-sys-focus-state-layer-opacity));\n}\n.mat-mdc-mini-fab:active > .mat-mdc-button-persistent-ripple::before {\n  opacity: var(--mat-fab-small-pressed-state-layer-opacity, var(--mat-sys-pressed-state-layer-opacity));\n}\n\n.mat-mdc-extended-fab {\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  padding-left: 20px;\n  padding-right: 20px;\n  width: auto;\n  max-width: 100%;\n  line-height: normal;\n  box-shadow: var(--mat-fab-extended-container-elevation-shadow, var(--mat-sys-level3));\n  height: var(--mat-fab-extended-container-height, 56px);\n  border-radius: var(--mat-fab-extended-container-shape, var(--mat-sys-corner-large));\n  font-family: var(--mat-fab-extended-label-text-font, var(--mat-sys-label-large-font));\n  font-size: var(--mat-fab-extended-label-text-size, var(--mat-sys-label-large-size));\n  font-weight: var(--mat-fab-extended-label-text-weight, var(--mat-sys-label-large-weight));\n  letter-spacing: var(--mat-fab-extended-label-text-tracking, var(--mat-sys-label-large-tracking));\n}\n@media (hover: hover) {\n  .mat-mdc-extended-fab:hover {\n    box-shadow: var(--mat-fab-extended-hover-container-elevation-shadow, var(--mat-sys-level4));\n  }\n}\n.mat-mdc-extended-fab:focus {\n  box-shadow: var(--mat-fab-extended-focus-container-elevation-shadow, var(--mat-sys-level3));\n}\n.mat-mdc-extended-fab:active, .mat-mdc-extended-fab:focus:active {\n  box-shadow: var(--mat-fab-extended-pressed-container-elevation-shadow, var(--mat-sys-level3));\n}\n.mat-mdc-extended-fab[disabled], .mat-mdc-extended-fab.mat-mdc-button-disabled {\n  cursor: default;\n  pointer-events: none;\n}\n.mat-mdc-extended-fab[disabled], .mat-mdc-extended-fab[disabled]:focus, .mat-mdc-extended-fab.mat-mdc-button-disabled, .mat-mdc-extended-fab.mat-mdc-button-disabled:focus {\n  box-shadow: none;\n}\n.mat-mdc-extended-fab.mat-mdc-button-disabled-interactive {\n  pointer-events: auto;\n}\n[dir=rtl] .mat-mdc-extended-fab .mdc-button__label + .mat-icon, [dir=rtl] .mat-mdc-extended-fab .mdc-button__label + .material-icons,\n.mat-mdc-extended-fab > .mat-icon,\n.mat-mdc-extended-fab > .material-icons {\n  margin-left: -8px;\n  margin-right: 12px;\n}\n.mat-mdc-extended-fab .mdc-button__label + .mat-icon,\n.mat-mdc-extended-fab .mdc-button__label + .material-icons, [dir=rtl] .mat-mdc-extended-fab > .mat-icon, [dir=rtl] .mat-mdc-extended-fab > .material-icons {\n  margin-left: 12px;\n  margin-right: -8px;\n}\n.mat-mdc-extended-fab .mat-mdc-button-touch-target {\n  width: 100%;\n}\n\n.mat-mdc-button-progress-indicator-container {\n  position: absolute;\n  inset-inline-start: 0;\n  margin-block-start: 0;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  width: 100%;\n  height: 100%;\n  box-sizing: border-box;\n}\n\n.mat-mdc-button-progress-indicator-shown mat-icon,\n.mat-mdc-button-progress-indicator-shown [matButtonIcon],\n.mat-mdc-button-progress-indicator-shown .mdc-button__label {\n  visibility: hidden;\n}\n"]
		}]
	}], () => [], { extended: [{
		type: Input,
		args: [{ transform: booleanAttribute }]
	}] });
})();
var MatMiniFabButton = class MatMiniFabButton extends MatButtonBase {
	_options = inject(MAT_FAB_DEFAULT_OPTIONS, { optional: true });
	_isFab = true;
	constructor() {
		super();
		this._options = this._options || defaults;
		this.color = this._options.color || defaults.color;
	}
	static ɵfac = function MatMiniFabButton_Factory(__ngFactoryType__) {
		return new (__ngFactoryType__ || MatMiniFabButton)();
	};
	static ɵcmp = /* @__PURE__ */ ɵɵdefineComponent({
		type: MatMiniFabButton,
		selectors: [
			[
				"button",
				"mat-mini-fab",
				""
			],
			[
				"a",
				"mat-mini-fab",
				""
			],
			[
				"button",
				"matMiniFab",
				""
			],
			[
				"a",
				"matMiniFab",
				""
			]
		],
		hostAttrs: [
			1,
			"mdc-fab",
			"mat-mdc-fab-base",
			"mdc-fab--mini",
			"mat-mdc-mini-fab"
		],
		exportAs: ["matButton", "matAnchor"],
		features: [ɵɵInheritDefinitionFeature],
		ngContentSelectors: _c1,
		decls: 8,
		vars: 5,
		consts: [
			[1, "mat-mdc-button-persistent-ripple"],
			[1, "mdc-button__label"],
			[1, "mat-mdc-button-progress-indicator-container"],
			[1, "mat-focus-indicator"],
			[1, "mat-mdc-button-touch-target"]
		],
		template: function MatMiniFabButton_Template(rf, ctx) {
			if (rf & 1) {
				ɵɵprojectionDef(_c0);
				ɵɵdomElement(0, "span", 0);
				ɵɵprojection(1);
				ɵɵdomElementStart(2, "span", 1);
				ɵɵprojection(3, 1);
				ɵɵdomElementEnd();
				ɵɵprojection(4, 2);
				ɵɵconditionalCreate(5, MatMiniFabButton_Conditional_5_Template, 2, 0, "div", 2);
				ɵɵdomElement(6, "span", 3)(7, "span", 4);
			}
			if (rf & 2) {
				ɵɵclassProp("mdc-button__ripple", !ctx._isFab)("mdc-fab__ripple", ctx._isFab);
				ɵɵadvance(5);
				ɵɵconditional(ctx.showProgress() ? 5 : -1);
			}
		},
		styles: [_c2],
		encapsulation: 2
	});
};
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatMiniFabButton, [{
		type: Component,
		args: [{
			selector: `button[mat-mini-fab], a[mat-mini-fab], button[matMiniFab], a[matMiniFab]`,
			host: { "class": "mdc-fab mat-mdc-fab-base mdc-fab--mini mat-mdc-mini-fab" },
			exportAs: "matButton, matAnchor",
			encapsulation: ViewEncapsulation.None,
			template: "<span\n  class=\"mat-mdc-button-persistent-ripple\"\n  [class.mdc-button__ripple]=\"!_isFab\"\n  [class.mdc-fab__ripple]=\"_isFab\"\n></span>\n\n<ng-content\n  select=\".material-icons:not([iconPositionEnd]), mat-icon:not([iconPositionEnd]), [matButtonIcon]:not([iconPositionEnd])\"\n>\n</ng-content>\n\n<span class=\"mdc-button__label\"><ng-content></ng-content></span>\n\n<ng-content\n  select=\".material-icons[iconPositionEnd], mat-icon[iconPositionEnd], [matButtonIcon][iconPositionEnd]\"\n>\n</ng-content>\n\n@if (showProgress()) {\n  <div class=\"mat-mdc-button-progress-indicator-container\">\n    <ng-content select=\"[progressIndicator]\" />\n  </div>\n}\n\n<!--\n  The indicator can't be directly on the button, because MDC uses ::before for high contrast\n  indication and it can't be on the ripple, because it has a border radius and overflow: hidden.\n-->\n<span class=\"mat-focus-indicator\"></span>\n\n<span class=\"mat-mdc-button-touch-target\"></span>\n",
			styles: [".mat-mdc-fab-base {\n  -webkit-user-select: none;\n  user-select: none;\n  position: relative;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  box-sizing: border-box;\n  width: 56px;\n  height: 56px;\n  padding: 0;\n  border: none;\n  fill: currentColor;\n  text-decoration: none;\n  cursor: pointer;\n  -moz-appearance: none;\n  -webkit-appearance: none;\n  overflow: visible;\n  transition: box-shadow 280ms cubic-bezier(0.4, 0, 0.2, 1), opacity 15ms linear 30ms, transform 270ms 0ms cubic-bezier(0, 0, 0.2, 1);\n  flex-shrink: 0;\n  -webkit-tap-highlight-color: transparent;\n}\n.mat-mdc-fab-base .mat-mdc-button-ripple,\n.mat-mdc-fab-base .mat-mdc-button-persistent-ripple,\n.mat-mdc-fab-base .mat-mdc-button-persistent-ripple::before {\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  position: absolute;\n  pointer-events: none;\n  border-radius: inherit;\n}\n.mat-mdc-fab-base .mat-mdc-button-ripple {\n  overflow: hidden;\n}\n.mat-mdc-fab-base .mat-mdc-button-persistent-ripple::before {\n  content: \"\";\n  opacity: 0;\n}\n.mat-mdc-fab-base .mdc-button__label,\n.mat-mdc-fab-base .mat-icon {\n  z-index: 1;\n  position: relative;\n}\n.mat-mdc-fab-base .mat-focus-indicator {\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  position: absolute;\n}\n.mat-mdc-fab-base:focus-visible > .mat-focus-indicator::before {\n  content: \"\";\n}\n.mat-mdc-fab-base._mat-animation-noopable {\n  transition: none !important;\n  animation: none !important;\n}\n.mat-mdc-fab-base::before {\n  position: absolute;\n  box-sizing: border-box;\n  width: 100%;\n  height: 100%;\n  top: 0;\n  left: 0;\n  border: 1px solid transparent;\n  border-radius: inherit;\n  content: \"\";\n  pointer-events: none;\n}\n.mat-mdc-fab-base[hidden] {\n  display: none;\n}\n.mat-mdc-fab-base::-moz-focus-inner {\n  padding: 0;\n  border: 0;\n}\n.mat-mdc-fab-base:active, .mat-mdc-fab-base:focus {\n  outline: none;\n}\n.mat-mdc-fab-base:hover {\n  cursor: pointer;\n}\n.mat-mdc-fab-base > svg {\n  width: 100%;\n}\n.mat-mdc-fab-base .mat-icon, .mat-mdc-fab-base .material-icons {\n  transition: transform 180ms 90ms cubic-bezier(0, 0, 0.2, 1);\n  fill: currentColor;\n  will-change: transform;\n}\n.mat-mdc-fab-base .mat-focus-indicator::before {\n  margin: calc(calc(var(--mat-focus-indicator-border-width, 3px) + 2px) * -1);\n  border-radius: calc(var(--mat-fab-container-shape, var(--mat-sys-corner-large)) + calc(var(--mat-focus-indicator-border-width, 3px) + 2px));\n}\n.mat-mdc-fab-base[disabled], .mat-mdc-fab-base.mat-mdc-button-disabled {\n  cursor: default;\n  pointer-events: none;\n}\n.mat-mdc-fab-base[disabled], .mat-mdc-fab-base[disabled]:focus, .mat-mdc-fab-base.mat-mdc-button-disabled, .mat-mdc-fab-base.mat-mdc-button-disabled:focus {\n  box-shadow: none;\n}\n.mat-mdc-fab-base.mat-mdc-button-disabled-interactive {\n  pointer-events: auto;\n}\n\n.mat-mdc-fab {\n  background-color: var(--mat-fab-container-color, var(--mat-sys-primary-container));\n  border-radius: var(--mat-fab-container-shape, var(--mat-sys-corner-large));\n  color: var(--mat-fab-foreground-color, var(--mat-sys-on-primary-container, inherit));\n  box-shadow: var(--mat-fab-container-elevation-shadow, var(--mat-sys-level3));\n}\n@media (hover: hover) {\n  .mat-mdc-fab:hover {\n    box-shadow: var(--mat-fab-hover-container-elevation-shadow, var(--mat-sys-level4));\n  }\n}\n.mat-mdc-fab:focus {\n  box-shadow: var(--mat-fab-focus-container-elevation-shadow, var(--mat-sys-level3));\n}\n.mat-mdc-fab:active, .mat-mdc-fab:focus:active {\n  box-shadow: var(--mat-fab-pressed-container-elevation-shadow, var(--mat-sys-level3));\n}\n.mat-mdc-fab[disabled], .mat-mdc-fab.mat-mdc-button-disabled {\n  cursor: default;\n  pointer-events: none;\n  color: var(--mat-fab-disabled-state-foreground-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));\n  background-color: var(--mat-fab-disabled-state-container-color, color-mix(in srgb, var(--mat-sys-on-surface) 12%, transparent));\n}\n.mat-mdc-fab.mat-mdc-button-disabled-interactive {\n  pointer-events: auto;\n}\n.mat-mdc-fab .mat-mdc-button-touch-target {\n  position: absolute;\n  top: 50%;\n  height: var(--mat-fab-touch-target-size, 48px);\n  display: var(--mat-fab-touch-target-display, block);\n  left: 50%;\n  width: var(--mat-fab-touch-target-size, 48px);\n  transform: translate(-50%, -50%);\n}\n.mat-mdc-fab .mat-ripple-element {\n  background-color: var(--mat-fab-ripple-color, color-mix(in srgb, var(--mat-sys-on-primary-container) calc(var(--mat-sys-pressed-state-layer-opacity) * 100%), transparent));\n}\n.mat-mdc-fab .mat-mdc-button-persistent-ripple::before {\n  background-color: var(--mat-fab-state-layer-color, var(--mat-sys-on-primary-container));\n}\n.mat-mdc-fab.mat-mdc-button-disabled .mat-mdc-button-persistent-ripple::before {\n  background-color: var(--mat-fab-disabled-state-layer-color);\n}\n.mat-mdc-fab:hover > .mat-mdc-button-persistent-ripple::before {\n  opacity: var(--mat-fab-hover-state-layer-opacity, var(--mat-sys-hover-state-layer-opacity));\n}\n.mat-mdc-fab.cdk-program-focused > .mat-mdc-button-persistent-ripple::before, .mat-mdc-fab.cdk-keyboard-focused > .mat-mdc-button-persistent-ripple::before, .mat-mdc-fab.mat-mdc-button-disabled-interactive:focus > .mat-mdc-button-persistent-ripple::before {\n  opacity: var(--mat-fab-focus-state-layer-opacity, var(--mat-sys-focus-state-layer-opacity));\n}\n.mat-mdc-fab:active > .mat-mdc-button-persistent-ripple::before {\n  opacity: var(--mat-fab-pressed-state-layer-opacity, var(--mat-sys-pressed-state-layer-opacity));\n}\n\n.mat-mdc-mini-fab {\n  width: 40px;\n  height: 40px;\n  background-color: var(--mat-fab-small-container-color, var(--mat-sys-primary-container));\n  border-radius: var(--mat-fab-small-container-shape, var(--mat-sys-corner-medium));\n  color: var(--mat-fab-small-foreground-color, var(--mat-sys-on-primary-container, inherit));\n  box-shadow: var(--mat-fab-small-container-elevation-shadow, var(--mat-sys-level3));\n}\n@media (hover: hover) {\n  .mat-mdc-mini-fab:hover {\n    box-shadow: var(--mat-fab-small-hover-container-elevation-shadow, var(--mat-sys-level4));\n  }\n}\n.mat-mdc-mini-fab:focus {\n  box-shadow: var(--mat-fab-small-focus-container-elevation-shadow, var(--mat-sys-level3));\n}\n.mat-mdc-mini-fab:active, .mat-mdc-mini-fab:focus:active {\n  box-shadow: var(--mat-fab-small-pressed-container-elevation-shadow, var(--mat-sys-level3));\n}\n.mat-mdc-mini-fab .mat-focus-indicator::before {\n  border-radius: calc(var(--mat-fab-small-container-shape, var(--mat-sys-corner-medium)) + calc(var(--mat-focus-indicator-border-width, 3px) + 2px));\n}\n.mat-mdc-mini-fab[disabled], .mat-mdc-mini-fab.mat-mdc-button-disabled {\n  cursor: default;\n  pointer-events: none;\n  color: var(--mat-fab-small-disabled-state-foreground-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));\n  background-color: var(--mat-fab-small-disabled-state-container-color, color-mix(in srgb, var(--mat-sys-on-surface) 12%, transparent));\n}\n.mat-mdc-mini-fab.mat-mdc-button-disabled-interactive {\n  pointer-events: auto;\n}\n.mat-mdc-mini-fab .mat-mdc-button-touch-target {\n  position: absolute;\n  top: 50%;\n  height: var(--mat-fab-small-touch-target-size, 48px);\n  display: var(--mat-fab-small-touch-target-display);\n  left: 50%;\n  width: var(--mat-fab-small-touch-target-size, 48px);\n  transform: translate(-50%, -50%);\n}\n.mat-mdc-mini-fab .mat-ripple-element {\n  background-color: var(--mat-fab-small-ripple-color, color-mix(in srgb, var(--mat-sys-on-primary-container) calc(var(--mat-sys-pressed-state-layer-opacity) * 100%), transparent));\n}\n.mat-mdc-mini-fab .mat-mdc-button-persistent-ripple::before {\n  background-color: var(--mat-fab-small-state-layer-color, var(--mat-sys-on-primary-container));\n}\n.mat-mdc-mini-fab.mat-mdc-button-disabled .mat-mdc-button-persistent-ripple::before {\n  background-color: var(--mat-fab-small-disabled-state-layer-color);\n}\n.mat-mdc-mini-fab:hover > .mat-mdc-button-persistent-ripple::before {\n  opacity: var(--mat-fab-small-hover-state-layer-opacity, var(--mat-sys-hover-state-layer-opacity));\n}\n.mat-mdc-mini-fab.cdk-program-focused > .mat-mdc-button-persistent-ripple::before, .mat-mdc-mini-fab.cdk-keyboard-focused > .mat-mdc-button-persistent-ripple::before, .mat-mdc-mini-fab.mat-mdc-button-disabled-interactive:focus > .mat-mdc-button-persistent-ripple::before {\n  opacity: var(--mat-fab-small-focus-state-layer-opacity, var(--mat-sys-focus-state-layer-opacity));\n}\n.mat-mdc-mini-fab:active > .mat-mdc-button-persistent-ripple::before {\n  opacity: var(--mat-fab-small-pressed-state-layer-opacity, var(--mat-sys-pressed-state-layer-opacity));\n}\n\n.mat-mdc-extended-fab {\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  padding-left: 20px;\n  padding-right: 20px;\n  width: auto;\n  max-width: 100%;\n  line-height: normal;\n  box-shadow: var(--mat-fab-extended-container-elevation-shadow, var(--mat-sys-level3));\n  height: var(--mat-fab-extended-container-height, 56px);\n  border-radius: var(--mat-fab-extended-container-shape, var(--mat-sys-corner-large));\n  font-family: var(--mat-fab-extended-label-text-font, var(--mat-sys-label-large-font));\n  font-size: var(--mat-fab-extended-label-text-size, var(--mat-sys-label-large-size));\n  font-weight: var(--mat-fab-extended-label-text-weight, var(--mat-sys-label-large-weight));\n  letter-spacing: var(--mat-fab-extended-label-text-tracking, var(--mat-sys-label-large-tracking));\n}\n@media (hover: hover) {\n  .mat-mdc-extended-fab:hover {\n    box-shadow: var(--mat-fab-extended-hover-container-elevation-shadow, var(--mat-sys-level4));\n  }\n}\n.mat-mdc-extended-fab:focus {\n  box-shadow: var(--mat-fab-extended-focus-container-elevation-shadow, var(--mat-sys-level3));\n}\n.mat-mdc-extended-fab:active, .mat-mdc-extended-fab:focus:active {\n  box-shadow: var(--mat-fab-extended-pressed-container-elevation-shadow, var(--mat-sys-level3));\n}\n.mat-mdc-extended-fab[disabled], .mat-mdc-extended-fab.mat-mdc-button-disabled {\n  cursor: default;\n  pointer-events: none;\n}\n.mat-mdc-extended-fab[disabled], .mat-mdc-extended-fab[disabled]:focus, .mat-mdc-extended-fab.mat-mdc-button-disabled, .mat-mdc-extended-fab.mat-mdc-button-disabled:focus {\n  box-shadow: none;\n}\n.mat-mdc-extended-fab.mat-mdc-button-disabled-interactive {\n  pointer-events: auto;\n}\n[dir=rtl] .mat-mdc-extended-fab .mdc-button__label + .mat-icon, [dir=rtl] .mat-mdc-extended-fab .mdc-button__label + .material-icons,\n.mat-mdc-extended-fab > .mat-icon,\n.mat-mdc-extended-fab > .material-icons {\n  margin-left: -8px;\n  margin-right: 12px;\n}\n.mat-mdc-extended-fab .mdc-button__label + .mat-icon,\n.mat-mdc-extended-fab .mdc-button__label + .material-icons, [dir=rtl] .mat-mdc-extended-fab > .mat-icon, [dir=rtl] .mat-mdc-extended-fab > .material-icons {\n  margin-left: 12px;\n  margin-right: -8px;\n}\n.mat-mdc-extended-fab .mat-mdc-button-touch-target {\n  width: 100%;\n}\n\n.mat-mdc-button-progress-indicator-container {\n  position: absolute;\n  inset-inline-start: 0;\n  margin-block-start: 0;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  width: 100%;\n  height: 100%;\n  box-sizing: border-box;\n}\n\n.mat-mdc-button-progress-indicator-shown mat-icon,\n.mat-mdc-button-progress-indicator-shown [matButtonIcon],\n.mat-mdc-button-progress-indicator-shown .mdc-button__label {\n  visibility: hidden;\n}\n"]
		}]
	}], () => [], null);
})();
var MatFabAnchor = MatFabButton;
var MatMiniFabAnchor = MatMiniFabButton;
var MatButtonModule = class MatButtonModule {
	static ɵfac = function MatButtonModule_Factory(__ngFactoryType__) {
		return new (__ngFactoryType__ || MatButtonModule)();
	};
	static ɵmod = /* @__PURE__ */ ɵɵdefineNgModule({
		type: MatButtonModule,
		imports: [
			MatRippleModule,
			MatButton,
			MatMiniFabButton,
			MatIconButton,
			MatFabButton
		],
		exports: [
			BidiModule,
			MatButton,
			MatMiniFabButton,
			MatIconButton,
			MatFabButton
		]
	});
	static ɵinj = /* @__PURE__ */ ɵɵdefineInjector({ imports: [MatRippleModule, BidiModule] });
};
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatButtonModule, [{
		type: NgModule,
		args: [{
			imports: [
				MatRippleModule,
				MatButton,
				MatMiniFabButton,
				MatIconButton,
				MatFabButton
			],
			exports: [
				BidiModule,
				MatButton,
				MatMiniFabButton,
				MatIconButton,
				MatFabButton
			]
		}]
	}], null, null);
})();
//#endregion
export { MAT_BUTTON_CONFIG, MAT_FAB_DEFAULT_OPTIONS, MatAnchor, MatButton, MatButtonModule, MatFabAnchor, MatFabButton, MatIconAnchor, MatIconButton, MatMiniFabAnchor, MatMiniFabButton };
