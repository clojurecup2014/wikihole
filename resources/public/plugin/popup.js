if(typeof Math.imul == "undefined" || (Math.imul(0xffffffff,5) == 0)) {
    Math.imul = function (a, b) {
        var ah  = (a >>> 16) & 0xffff;
        var al = a & 0xffff;
        var bh  = (b >>> 16) & 0xffff;
        var bl = b & 0xffff;
        // the shift by 0 fixes the sign on the high part
        // the final |0 converts the unsigned value into a signed value
        return ((al * bl) + (((ah * bl + al * bh) << 16) >>> 0)|0);
    }
}

var CLOSURE_NO_DEPS = true;
var COMPILED = false;
var goog = goog || {};
goog.global = this;
goog.global.CLOSURE_UNCOMPILED_DEFINES;
goog.global.CLOSURE_DEFINES;
goog.isDef = function(val) {
  return val !== void 0;
};
goog.exportPath_ = function(name, opt_object, opt_objectToExportTo) {
  var parts = name.split(".");
  var cur = opt_objectToExportTo || goog.global;
  if (!(parts[0] in cur) && cur.execScript) {
    cur.execScript("var " + parts[0]);
  }
  for (var part;parts.length && (part = parts.shift());) {
    if (!parts.length && goog.isDef(opt_object)) {
      cur[part] = opt_object;
    } else {
      if (cur[part]) {
        cur = cur[part];
      } else {
        cur = cur[part] = {};
      }
    }
  }
};
goog.define = function(name, defaultValue) {
  var value = defaultValue;
  if (!COMPILED) {
    if (goog.global.CLOSURE_UNCOMPILED_DEFINES && Object.prototype.hasOwnProperty.call(goog.global.CLOSURE_UNCOMPILED_DEFINES, name)) {
      value = goog.global.CLOSURE_UNCOMPILED_DEFINES[name];
    } else {
      if (goog.global.CLOSURE_DEFINES && Object.prototype.hasOwnProperty.call(goog.global.CLOSURE_DEFINES, name)) {
        value = goog.global.CLOSURE_DEFINES[name];
      }
    }
  }
  goog.exportPath_(name, value);
};
goog.DEBUG = true;
goog.define("goog.LOCALE", "en");
goog.define("goog.TRUSTED_SITE", true);
goog.define("goog.STRICT_MODE_COMPATIBLE", false);
goog.provide = function(name) {
  if (!COMPILED) {
    if (goog.isProvided_(name)) {
      throw Error('Namespace "' + name + '" already declared.');
    }
    delete goog.implicitNamespaces_[name];
    var namespace = name;
    while (namespace = namespace.substring(0, namespace.lastIndexOf("."))) {
      if (goog.getObjectByName(namespace)) {
        break;
      }
      goog.implicitNamespaces_[namespace] = true;
    }
  }
  goog.exportPath_(name);
};
goog.setTestOnly = function(opt_message) {
  if (COMPILED && !goog.DEBUG) {
    opt_message = opt_message || "";
    throw Error("Importing test-only code into non-debug environment" + (opt_message ? ": " + opt_message : "."));
  }
};
goog.forwardDeclare = function(name) {
};
if (!COMPILED) {
  goog.isProvided_ = function(name) {
    return!goog.implicitNamespaces_[name] && goog.isDefAndNotNull(goog.getObjectByName(name));
  };
  goog.implicitNamespaces_ = {};
}
goog.getObjectByName = function(name, opt_obj) {
  var parts = name.split(".");
  var cur = opt_obj || goog.global;
  for (var part;part = parts.shift();) {
    if (goog.isDefAndNotNull(cur[part])) {
      cur = cur[part];
    } else {
      return null;
    }
  }
  return cur;
};
goog.globalize = function(obj, opt_global) {
  var global = opt_global || goog.global;
  for (var x in obj) {
    global[x] = obj[x];
  }
};
goog.addDependency = function(relPath, provides, requires) {
  if (goog.DEPENDENCIES_ENABLED) {
    var provide, require;
    var path = relPath.replace(/\\/g, "/");
    var deps = goog.dependencies_;
    for (var i = 0;provide = provides[i];i++) {
      deps.nameToPath[provide] = path;
      if (!(path in deps.pathToNames)) {
        deps.pathToNames[path] = {};
      }
      deps.pathToNames[path][provide] = true;
    }
    for (var j = 0;require = requires[j];j++) {
      if (!(path in deps.requires)) {
        deps.requires[path] = {};
      }
      deps.requires[path][require] = true;
    }
  }
};
goog.define("goog.ENABLE_DEBUG_LOADER", true);
goog.require = function(name) {
  if (!COMPILED) {
    if (goog.isProvided_(name)) {
      return;
    }
    if (goog.ENABLE_DEBUG_LOADER) {
      var path = goog.getPathFromDeps_(name);
      if (path) {
        goog.included_[path] = true;
        goog.writeScripts_();
        return;
      }
    }
    var errorMessage = "goog.require could not find: " + name;
    if (goog.global.console) {
      goog.global.console["error"](errorMessage);
    }
    throw Error(errorMessage);
  }
};
goog.basePath = "";
goog.global.CLOSURE_BASE_PATH;
goog.global.CLOSURE_NO_DEPS;
goog.global.CLOSURE_IMPORT_SCRIPT;
goog.nullFunction = function() {
};
goog.identityFunction = function(opt_returnValue, var_args) {
  return opt_returnValue;
};
goog.abstractMethod = function() {
  throw Error("unimplemented abstract method");
};
goog.addSingletonGetter = function(ctor) {
  ctor.getInstance = function() {
    if (ctor.instance_) {
      return ctor.instance_;
    }
    if (goog.DEBUG) {
      goog.instantiatedSingletons_[goog.instantiatedSingletons_.length] = ctor;
    }
    return ctor.instance_ = new ctor;
  };
};
goog.instantiatedSingletons_ = [];
goog.DEPENDENCIES_ENABLED = !COMPILED && goog.ENABLE_DEBUG_LOADER;
if (goog.DEPENDENCIES_ENABLED) {
  goog.included_ = {};
  goog.dependencies_ = {pathToNames:{}, nameToPath:{}, requires:{}, visited:{}, written:{}};
  goog.inHtmlDocument_ = function() {
    var doc = goog.global.document;
    return typeof doc != "undefined" && "write" in doc;
  };
  goog.findBasePath_ = function() {
    if (goog.global.CLOSURE_BASE_PATH) {
      goog.basePath = goog.global.CLOSURE_BASE_PATH;
      return;
    } else {
      if (!goog.inHtmlDocument_()) {
        return;
      }
    }
    var doc = goog.global.document;
    var scripts = doc.getElementsByTagName("script");
    for (var i = scripts.length - 1;i >= 0;--i) {
      var src = scripts[i].src;
      var qmark = src.lastIndexOf("?");
      var l = qmark == -1 ? src.length : qmark;
      if (src.substr(l - 7, 7) == "base.js") {
        goog.basePath = src.substr(0, l - 7);
        return;
      }
    }
  };
  goog.importScript_ = function(src) {
    var importScript = goog.global.CLOSURE_IMPORT_SCRIPT || goog.writeScriptTag_;
    if (!goog.dependencies_.written[src] && importScript(src)) {
      goog.dependencies_.written[src] = true;
    }
  };
  goog.writeScriptTag_ = function(src) {
    if (goog.inHtmlDocument_()) {
      var doc = goog.global.document;
      if (doc.readyState == "complete") {
        var isDeps = /\bdeps.js$/.test(src);
        if (isDeps) {
          return false;
        } else {
          throw Error('Cannot write "' + src + '" after document load');
        }
      }
      doc.write('\x3cscript type\x3d"text/javascript" src\x3d"' + src + '"\x3e\x3c/' + "script\x3e");
      return true;
    } else {
      return false;
    }
  };
  goog.writeScripts_ = function() {
    var scripts = [];
    var seenScript = {};
    var deps = goog.dependencies_;
    function visitNode(path) {
      if (path in deps.written) {
        return;
      }
      if (path in deps.visited) {
        if (!(path in seenScript)) {
          seenScript[path] = true;
          scripts.push(path);
        }
        return;
      }
      deps.visited[path] = true;
      if (path in deps.requires) {
        for (var requireName in deps.requires[path]) {
          if (!goog.isProvided_(requireName)) {
            if (requireName in deps.nameToPath) {
              visitNode(deps.nameToPath[requireName]);
            } else {
              throw Error("Undefined nameToPath for " + requireName);
            }
          }
        }
      }
      if (!(path in seenScript)) {
        seenScript[path] = true;
        scripts.push(path);
      }
    }
    for (var path in goog.included_) {
      if (!deps.written[path]) {
        visitNode(path);
      }
    }
    for (var i = 0;i < scripts.length;i++) {
      if (scripts[i]) {
        goog.importScript_(goog.basePath + scripts[i]);
      } else {
        throw Error("Undefined script input");
      }
    }
  };
  goog.getPathFromDeps_ = function(rule) {
    if (rule in goog.dependencies_.nameToPath) {
      return goog.dependencies_.nameToPath[rule];
    } else {
      return null;
    }
  };
  goog.findBasePath_();
  if (!goog.global.CLOSURE_NO_DEPS) {
    goog.importScript_(goog.basePath + "deps.js");
  }
}
goog.typeOf = function(value) {
  var s = typeof value;
  if (s == "object") {
    if (value) {
      if (value instanceof Array) {
        return "array";
      } else {
        if (value instanceof Object) {
          return s;
        }
      }
      var className = Object.prototype.toString.call((value));
      if (className == "[object Window]") {
        return "object";
      }
      if (className == "[object Array]" || typeof value.length == "number" && typeof value.splice != "undefined" && typeof value.propertyIsEnumerable != "undefined" && !value.propertyIsEnumerable("splice")) {
        return "array";
      }
      if (className == "[object Function]" || typeof value.call != "undefined" && typeof value.propertyIsEnumerable != "undefined" && !value.propertyIsEnumerable("call")) {
        return "function";
      }
    } else {
      return "null";
    }
  } else {
    if (s == "function" && typeof value.call == "undefined") {
      return "object";
    }
  }
  return s;
};
goog.isNull = function(val) {
  return val === null;
};
goog.isDefAndNotNull = function(val) {
  return val != null;
};
goog.isArray = function(val) {
  return goog.typeOf(val) == "array";
};
goog.isArrayLike = function(val) {
  var type = goog.typeOf(val);
  return type == "array" || type == "object" && typeof val.length == "number";
};
goog.isDateLike = function(val) {
  return goog.isObject(val) && typeof val.getFullYear == "function";
};
goog.isString = function(val) {
  return typeof val == "string";
};
goog.isBoolean = function(val) {
  return typeof val == "boolean";
};
goog.isNumber = function(val) {
  return typeof val == "number";
};
goog.isFunction = function(val) {
  return goog.typeOf(val) == "function";
};
goog.isObject = function(val) {
  var type = typeof val;
  return type == "object" && val != null || type == "function";
};
goog.getUid = function(obj) {
  return obj[goog.UID_PROPERTY_] || (obj[goog.UID_PROPERTY_] = ++goog.uidCounter_);
};
goog.hasUid = function(obj) {
  return!!obj[goog.UID_PROPERTY_];
};
goog.removeUid = function(obj) {
  if ("removeAttribute" in obj) {
    obj.removeAttribute(goog.UID_PROPERTY_);
  }
  try {
    delete obj[goog.UID_PROPERTY_];
  } catch (ex) {
  }
};
goog.UID_PROPERTY_ = "closure_uid_" + (Math.random() * 1E9 >>> 0);
goog.uidCounter_ = 0;
goog.getHashCode = goog.getUid;
goog.removeHashCode = goog.removeUid;
goog.cloneObject = function(obj) {
  var type = goog.typeOf(obj);
  if (type == "object" || type == "array") {
    if (obj.clone) {
      return obj.clone();
    }
    var clone = type == "array" ? [] : {};
    for (var key in obj) {
      clone[key] = goog.cloneObject(obj[key]);
    }
    return clone;
  }
  return obj;
};
goog.bindNative_ = function(fn, selfObj, var_args) {
  return(fn.call.apply(fn.bind, arguments));
};
goog.bindJs_ = function(fn, selfObj, var_args) {
  if (!fn) {
    throw new Error;
  }
  if (arguments.length > 2) {
    var boundArgs = Array.prototype.slice.call(arguments, 2);
    return function() {
      var newArgs = Array.prototype.slice.call(arguments);
      Array.prototype.unshift.apply(newArgs, boundArgs);
      return fn.apply(selfObj, newArgs);
    };
  } else {
    return function() {
      return fn.apply(selfObj, arguments);
    };
  }
};
goog.bind = function(fn, selfObj, var_args) {
  if (Function.prototype.bind && Function.prototype.bind.toString().indexOf("native code") != -1) {
    goog.bind = goog.bindNative_;
  } else {
    goog.bind = goog.bindJs_;
  }
  return goog.bind.apply(null, arguments);
};
goog.partial = function(fn, var_args) {
  var args = Array.prototype.slice.call(arguments, 1);
  return function() {
    var newArgs = args.slice();
    newArgs.push.apply(newArgs, arguments);
    return fn.apply(this, newArgs);
  };
};
goog.mixin = function(target, source) {
  for (var x in source) {
    target[x] = source[x];
  }
};
goog.now = goog.TRUSTED_SITE && Date.now || function() {
  return+new Date;
};
goog.globalEval = function(script) {
  if (goog.global.execScript) {
    goog.global.execScript(script, "JavaScript");
  } else {
    if (goog.global.eval) {
      if (goog.evalWorksForGlobals_ == null) {
        goog.global.eval("var _et_ \x3d 1;");
        if (typeof goog.global["_et_"] != "undefined") {
          delete goog.global["_et_"];
          goog.evalWorksForGlobals_ = true;
        } else {
          goog.evalWorksForGlobals_ = false;
        }
      }
      if (goog.evalWorksForGlobals_) {
        goog.global.eval(script);
      } else {
        var doc = goog.global.document;
        var scriptElt = doc.createElement("script");
        scriptElt.type = "text/javascript";
        scriptElt.defer = false;
        scriptElt.appendChild(doc.createTextNode(script));
        doc.body.appendChild(scriptElt);
        doc.body.removeChild(scriptElt);
      }
    } else {
      throw Error("goog.globalEval not available");
    }
  }
};
goog.evalWorksForGlobals_ = null;
goog.cssNameMapping_;
goog.cssNameMappingStyle_;
goog.getCssName = function(className, opt_modifier) {
  var getMapping = function(cssName) {
    return goog.cssNameMapping_[cssName] || cssName;
  };
  var renameByParts = function(cssName) {
    var parts = cssName.split("-");
    var mapped = [];
    for (var i = 0;i < parts.length;i++) {
      mapped.push(getMapping(parts[i]));
    }
    return mapped.join("-");
  };
  var rename;
  if (goog.cssNameMapping_) {
    rename = goog.cssNameMappingStyle_ == "BY_WHOLE" ? getMapping : renameByParts;
  } else {
    rename = function(a) {
      return a;
    };
  }
  if (opt_modifier) {
    return className + "-" + rename(opt_modifier);
  } else {
    return rename(className);
  }
};
goog.setCssNameMapping = function(mapping, opt_style) {
  goog.cssNameMapping_ = mapping;
  goog.cssNameMappingStyle_ = opt_style;
};
goog.global.CLOSURE_CSS_NAME_MAPPING;
if (!COMPILED && goog.global.CLOSURE_CSS_NAME_MAPPING) {
  goog.cssNameMapping_ = goog.global.CLOSURE_CSS_NAME_MAPPING;
}
goog.getMsg = function(str, opt_values) {
  if (opt_values) {
    str = str.replace(/\{\$([^}]+)}/g, function(match, key) {
      return key in opt_values ? opt_values[key] : match;
    });
  }
  return str;
};
goog.getMsgWithFallback = function(a, b) {
  return a;
};
goog.exportSymbol = function(publicPath, object, opt_objectToExportTo) {
  goog.exportPath_(publicPath, object, opt_objectToExportTo);
};
goog.exportProperty = function(object, publicName, symbol) {
  object[publicName] = symbol;
};
goog.inherits = function(childCtor, parentCtor) {
  function tempCtor() {
  }
  tempCtor.prototype = parentCtor.prototype;
  childCtor.superClass_ = parentCtor.prototype;
  childCtor.prototype = new tempCtor;
  childCtor.prototype.constructor = childCtor;
  childCtor.base = function(me, methodName, var_args) {
    var args = Array.prototype.slice.call(arguments, 2);
    return parentCtor.prototype[methodName].apply(me, args);
  };
};
goog.base = function(me, opt_methodName, var_args) {
  var caller = arguments.callee.caller;
  if (goog.STRICT_MODE_COMPATIBLE || goog.DEBUG && !caller) {
    throw Error("arguments.caller not defined.  goog.base() cannot be used " + "with strict mode code. See " + "http://www.ecma-international.org/ecma-262/5.1/#sec-C");
  }
  if (caller.superClass_) {
    return caller.superClass_.constructor.apply(me, Array.prototype.slice.call(arguments, 1));
  }
  var args = Array.prototype.slice.call(arguments, 2);
  var foundCaller = false;
  for (var ctor = me.constructor;ctor;ctor = ctor.superClass_ && ctor.superClass_.constructor) {
    if (ctor.prototype[opt_methodName] === caller) {
      foundCaller = true;
    } else {
      if (foundCaller) {
        return ctor.prototype[opt_methodName].apply(me, args);
      }
    }
  }
  if (me[opt_methodName] === caller) {
    return me.constructor.prototype[opt_methodName].apply(me, args);
  } else {
    throw Error("goog.base called from a method of one name " + "to a method of a different name");
  }
};
goog.scope = function(fn) {
  fn.call(goog.global);
};
if (!COMPILED) {
  goog.global["COMPILED"] = COMPILED;
}
goog.defineClass = function(superClass, def) {
  var constructor = def.constructor;
  var statics = def.statics;
  if (!constructor || constructor == Object.prototype.constructor) {
    constructor = function() {
      throw Error("cannot instantiate an interface (no constructor defined).");
    };
  }
  var cls = goog.defineClass.createSealingConstructor_(constructor, superClass);
  if (superClass) {
    goog.inherits(cls, superClass);
  }
  delete def.constructor;
  delete def.statics;
  goog.defineClass.applyProperties_(cls.prototype, def);
  if (statics != null) {
    if (statics instanceof Function) {
      statics(cls);
    } else {
      goog.defineClass.applyProperties_(cls, statics);
    }
  }
  return cls;
};
goog.defineClass.ClassDescriptor;
goog.define("goog.defineClass.SEAL_CLASS_INSTANCES", goog.DEBUG);
goog.defineClass.createSealingConstructor_ = function(ctr, superClass) {
  if (goog.defineClass.SEAL_CLASS_INSTANCES && Object.seal instanceof Function) {
    if (superClass && superClass.prototype && superClass.prototype[goog.UNSEALABLE_CONSTRUCTOR_PROPERTY_]) {
      return ctr;
    }
    var wrappedCtr = function() {
      var instance = ctr.apply(this, arguments) || this;
      if (this.constructor === wrappedCtr) {
        Object.seal(instance);
      }
      return instance;
    };
    return wrappedCtr;
  }
  return ctr;
};
goog.defineClass.OBJECT_PROTOTYPE_FIELDS_ = ["constructor", "hasOwnProperty", "isPrototypeOf", "propertyIsEnumerable", "toLocaleString", "toString", "valueOf"];
goog.defineClass.applyProperties_ = function(target, source) {
  var key;
  for (key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      target[key] = source[key];
    }
  }
  for (var i = 0;i < goog.defineClass.OBJECT_PROTOTYPE_FIELDS_.length;i++) {
    key = goog.defineClass.OBJECT_PROTOTYPE_FIELDS_[i];
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      target[key] = source[key];
    }
  }
};
goog.tagUnsealableClass = function(ctr) {
  if (!COMPILED && goog.defineClass.SEAL_CLASS_INSTANCES) {
    ctr.prototype[goog.UNSEALABLE_CONSTRUCTOR_PROPERTY_] = true;
  }
};
goog.UNSEALABLE_CONSTRUCTOR_PROPERTY_ = "goog_defineClass_legacy_unsealable";
goog.provide("goog.string");
goog.provide("goog.string.Unicode");
goog.define("goog.string.DETECT_DOUBLE_ESCAPING", false);
goog.string.Unicode = {NBSP:"\u00a0"};
goog.string.startsWith = function(str, prefix) {
  return str.lastIndexOf(prefix, 0) == 0;
};
goog.string.endsWith = function(str, suffix) {
  var l = str.length - suffix.length;
  return l >= 0 && str.indexOf(suffix, l) == l;
};
goog.string.caseInsensitiveStartsWith = function(str, prefix) {
  return goog.string.caseInsensitiveCompare(prefix, str.substr(0, prefix.length)) == 0;
};
goog.string.caseInsensitiveEndsWith = function(str, suffix) {
  return goog.string.caseInsensitiveCompare(suffix, str.substr(str.length - suffix.length, suffix.length)) == 0;
};
goog.string.caseInsensitiveEquals = function(str1, str2) {
  return str1.toLowerCase() == str2.toLowerCase();
};
goog.string.subs = function(str, var_args) {
  var splitParts = str.split("%s");
  var returnString = "";
  var subsArguments = Array.prototype.slice.call(arguments, 1);
  while (subsArguments.length && splitParts.length > 1) {
    returnString += splitParts.shift() + subsArguments.shift();
  }
  return returnString + splitParts.join("%s");
};
goog.string.collapseWhitespace = function(str) {
  return str.replace(/[\s\xa0]+/g, " ").replace(/^\s+|\s+$/g, "");
};
goog.string.isEmpty = function(str) {
  return/^[\s\xa0]*$/.test(str);
};
goog.string.isEmptySafe = function(str) {
  return goog.string.isEmpty(goog.string.makeSafe(str));
};
goog.string.isBreakingWhitespace = function(str) {
  return!/[^\t\n\r ]/.test(str);
};
goog.string.isAlpha = function(str) {
  return!/[^a-zA-Z]/.test(str);
};
goog.string.isNumeric = function(str) {
  return!/[^0-9]/.test(str);
};
goog.string.isAlphaNumeric = function(str) {
  return!/[^a-zA-Z0-9]/.test(str);
};
goog.string.isSpace = function(ch) {
  return ch == " ";
};
goog.string.isUnicodeChar = function(ch) {
  return ch.length == 1 && ch >= " " && ch <= "~" || ch >= "\u0080" && ch <= "\ufffd";
};
goog.string.stripNewlines = function(str) {
  return str.replace(/(\r\n|\r|\n)+/g, " ");
};
goog.string.canonicalizeNewlines = function(str) {
  return str.replace(/(\r\n|\r|\n)/g, "\n");
};
goog.string.normalizeWhitespace = function(str) {
  return str.replace(/\xa0|\s/g, " ");
};
goog.string.normalizeSpaces = function(str) {
  return str.replace(/\xa0|[ \t]+/g, " ");
};
goog.string.collapseBreakingSpaces = function(str) {
  return str.replace(/[\t\r\n ]+/g, " ").replace(/^[\t\r\n ]+|[\t\r\n ]+$/g, "");
};
goog.string.trim = function(str) {
  return str.replace(/^[\s\xa0]+|[\s\xa0]+$/g, "");
};
goog.string.trimLeft = function(str) {
  return str.replace(/^[\s\xa0]+/, "");
};
goog.string.trimRight = function(str) {
  return str.replace(/[\s\xa0]+$/, "");
};
goog.string.caseInsensitiveCompare = function(str1, str2) {
  var test1 = String(str1).toLowerCase();
  var test2 = String(str2).toLowerCase();
  if (test1 < test2) {
    return-1;
  } else {
    if (test1 == test2) {
      return 0;
    } else {
      return 1;
    }
  }
};
goog.string.numerateCompareRegExp_ = /(\.\d+)|(\d+)|(\D+)/g;
goog.string.numerateCompare = function(str1, str2) {
  if (str1 == str2) {
    return 0;
  }
  if (!str1) {
    return-1;
  }
  if (!str2) {
    return 1;
  }
  var tokens1 = str1.toLowerCase().match(goog.string.numerateCompareRegExp_);
  var tokens2 = str2.toLowerCase().match(goog.string.numerateCompareRegExp_);
  var count = Math.min(tokens1.length, tokens2.length);
  for (var i = 0;i < count;i++) {
    var a = tokens1[i];
    var b = tokens2[i];
    if (a != b) {
      var num1 = parseInt(a, 10);
      if (!isNaN(num1)) {
        var num2 = parseInt(b, 10);
        if (!isNaN(num2) && num1 - num2) {
          return num1 - num2;
        }
      }
      return a < b ? -1 : 1;
    }
  }
  if (tokens1.length != tokens2.length) {
    return tokens1.length - tokens2.length;
  }
  return str1 < str2 ? -1 : 1;
};
goog.string.urlEncode = function(str) {
  return encodeURIComponent(String(str));
};
goog.string.urlDecode = function(str) {
  return decodeURIComponent(str.replace(/\+/g, " "));
};
goog.string.newLineToBr = function(str, opt_xml) {
  return str.replace(/(\r\n|\r|\n)/g, opt_xml ? "\x3cbr /\x3e" : "\x3cbr\x3e");
};
goog.string.htmlEscape = function(str, opt_isLikelyToContainHtmlChars) {
  if (opt_isLikelyToContainHtmlChars) {
    str = str.replace(goog.string.AMP_RE_, "\x26amp;").replace(goog.string.LT_RE_, "\x26lt;").replace(goog.string.GT_RE_, "\x26gt;").replace(goog.string.QUOT_RE_, "\x26quot;").replace(goog.string.SINGLE_QUOTE_RE_, "\x26#39;").replace(goog.string.NULL_RE_, "\x26#0;");
    if (goog.string.DETECT_DOUBLE_ESCAPING) {
      str = str.replace(goog.string.E_RE_, "\x26#101;");
    }
    return str;
  } else {
    if (!goog.string.ALL_RE_.test(str)) {
      return str;
    }
    if (str.indexOf("\x26") != -1) {
      str = str.replace(goog.string.AMP_RE_, "\x26amp;");
    }
    if (str.indexOf("\x3c") != -1) {
      str = str.replace(goog.string.LT_RE_, "\x26lt;");
    }
    if (str.indexOf("\x3e") != -1) {
      str = str.replace(goog.string.GT_RE_, "\x26gt;");
    }
    if (str.indexOf('"') != -1) {
      str = str.replace(goog.string.QUOT_RE_, "\x26quot;");
    }
    if (str.indexOf("'") != -1) {
      str = str.replace(goog.string.SINGLE_QUOTE_RE_, "\x26#39;");
    }
    if (str.indexOf("\x00") != -1) {
      str = str.replace(goog.string.NULL_RE_, "\x26#0;");
    }
    if (goog.string.DETECT_DOUBLE_ESCAPING && str.indexOf("e") != -1) {
      str = str.replace(goog.string.E_RE_, "\x26#101;");
    }
    return str;
  }
};
goog.string.AMP_RE_ = /&/g;
goog.string.LT_RE_ = /</g;
goog.string.GT_RE_ = />/g;
goog.string.QUOT_RE_ = /"/g;
goog.string.SINGLE_QUOTE_RE_ = /'/g;
goog.string.NULL_RE_ = /\x00/g;
goog.string.E_RE_ = /e/g;
goog.string.ALL_RE_ = goog.string.DETECT_DOUBLE_ESCAPING ? /[\x00&<>"'e]/ : /[\x00&<>"']/;
goog.string.unescapeEntities = function(str) {
  if (goog.string.contains(str, "\x26")) {
    if ("document" in goog.global) {
      return goog.string.unescapeEntitiesUsingDom_(str);
    } else {
      return goog.string.unescapePureXmlEntities_(str);
    }
  }
  return str;
};
goog.string.unescapeEntitiesWithDocument = function(str, document) {
  if (goog.string.contains(str, "\x26")) {
    return goog.string.unescapeEntitiesUsingDom_(str, document);
  }
  return str;
};
goog.string.unescapeEntitiesUsingDom_ = function(str, opt_document) {
  var seen = {"\x26amp;":"\x26", "\x26lt;":"\x3c", "\x26gt;":"\x3e", "\x26quot;":'"'};
  var div;
  if (opt_document) {
    div = opt_document.createElement("div");
  } else {
    div = goog.global.document.createElement("div");
  }
  return str.replace(goog.string.HTML_ENTITY_PATTERN_, function(s, entity) {
    var value = seen[s];
    if (value) {
      return value;
    }
    if (entity.charAt(0) == "#") {
      var n = Number("0" + entity.substr(1));
      if (!isNaN(n)) {
        value = String.fromCharCode(n);
      }
    }
    if (!value) {
      div.innerHTML = s + " ";
      value = div.firstChild.nodeValue.slice(0, -1);
    }
    return seen[s] = value;
  });
};
goog.string.unescapePureXmlEntities_ = function(str) {
  return str.replace(/&([^;]+);/g, function(s, entity) {
    switch(entity) {
      case "amp":
        return "\x26";
      case "lt":
        return "\x3c";
      case "gt":
        return "\x3e";
      case "quot":
        return'"';
      default:
        if (entity.charAt(0) == "#") {
          var n = Number("0" + entity.substr(1));
          if (!isNaN(n)) {
            return String.fromCharCode(n);
          }
        }
        return s;
    }
  });
};
goog.string.HTML_ENTITY_PATTERN_ = /&([^;\s<&]+);?/g;
goog.string.whitespaceEscape = function(str, opt_xml) {
  return goog.string.newLineToBr(str.replace(/  /g, " \x26#160;"), opt_xml);
};
goog.string.preserveSpaces = function(str) {
  return str.replace(/(^|[\n ]) /g, "$1" + goog.string.Unicode.NBSP);
};
goog.string.stripQuotes = function(str, quoteChars) {
  var length = quoteChars.length;
  for (var i = 0;i < length;i++) {
    var quoteChar = length == 1 ? quoteChars : quoteChars.charAt(i);
    if (str.charAt(0) == quoteChar && str.charAt(str.length - 1) == quoteChar) {
      return str.substring(1, str.length - 1);
    }
  }
  return str;
};
goog.string.truncate = function(str, chars, opt_protectEscapedCharacters) {
  if (opt_protectEscapedCharacters) {
    str = goog.string.unescapeEntities(str);
  }
  if (str.length > chars) {
    str = str.substring(0, chars - 3) + "...";
  }
  if (opt_protectEscapedCharacters) {
    str = goog.string.htmlEscape(str);
  }
  return str;
};
goog.string.truncateMiddle = function(str, chars, opt_protectEscapedCharacters, opt_trailingChars) {
  if (opt_protectEscapedCharacters) {
    str = goog.string.unescapeEntities(str);
  }
  if (opt_trailingChars && str.length > chars) {
    if (opt_trailingChars > chars) {
      opt_trailingChars = chars;
    }
    var endPoint = str.length - opt_trailingChars;
    var startPoint = chars - opt_trailingChars;
    str = str.substring(0, startPoint) + "..." + str.substring(endPoint);
  } else {
    if (str.length > chars) {
      var half = Math.floor(chars / 2);
      var endPos = str.length - half;
      half += chars % 2;
      str = str.substring(0, half) + "..." + str.substring(endPos);
    }
  }
  if (opt_protectEscapedCharacters) {
    str = goog.string.htmlEscape(str);
  }
  return str;
};
goog.string.specialEscapeChars_ = {"\x00":"\\0", "\b":"\\b", "\f":"\\f", "\n":"\\n", "\r":"\\r", "\t":"\\t", "\x0B":"\\x0B", '"':'\\"', "\\":"\\\\"};
goog.string.jsEscapeCache_ = {"'":"\\'"};
goog.string.quote = function(s) {
  s = String(s);
  if (s.quote) {
    return s.quote();
  } else {
    var sb = ['"'];
    for (var i = 0;i < s.length;i++) {
      var ch = s.charAt(i);
      var cc = ch.charCodeAt(0);
      sb[i + 1] = goog.string.specialEscapeChars_[ch] || (cc > 31 && cc < 127 ? ch : goog.string.escapeChar(ch));
    }
    sb.push('"');
    return sb.join("");
  }
};
goog.string.escapeString = function(str) {
  var sb = [];
  for (var i = 0;i < str.length;i++) {
    sb[i] = goog.string.escapeChar(str.charAt(i));
  }
  return sb.join("");
};
goog.string.escapeChar = function(c) {
  if (c in goog.string.jsEscapeCache_) {
    return goog.string.jsEscapeCache_[c];
  }
  if (c in goog.string.specialEscapeChars_) {
    return goog.string.jsEscapeCache_[c] = goog.string.specialEscapeChars_[c];
  }
  var rv = c;
  var cc = c.charCodeAt(0);
  if (cc > 31 && cc < 127) {
    rv = c;
  } else {
    if (cc < 256) {
      rv = "\\x";
      if (cc < 16 || cc > 256) {
        rv += "0";
      }
    } else {
      rv = "\\u";
      if (cc < 4096) {
        rv += "0";
      }
    }
    rv += cc.toString(16).toUpperCase();
  }
  return goog.string.jsEscapeCache_[c] = rv;
};
goog.string.toMap = function(s) {
  var rv = {};
  for (var i = 0;i < s.length;i++) {
    rv[s.charAt(i)] = true;
  }
  return rv;
};
goog.string.contains = function(str, subString) {
  return str.indexOf(subString) != -1;
};
goog.string.caseInsensitiveContains = function(str, subString) {
  return goog.string.contains(str.toLowerCase(), subString.toLowerCase());
};
goog.string.countOf = function(s, ss) {
  return s && ss ? s.split(ss).length - 1 : 0;
};
goog.string.removeAt = function(s, index, stringLength) {
  var resultStr = s;
  if (index >= 0 && index < s.length && stringLength > 0) {
    resultStr = s.substr(0, index) + s.substr(index + stringLength, s.length - index - stringLength);
  }
  return resultStr;
};
goog.string.remove = function(s, ss) {
  var re = new RegExp(goog.string.regExpEscape(ss), "");
  return s.replace(re, "");
};
goog.string.removeAll = function(s, ss) {
  var re = new RegExp(goog.string.regExpEscape(ss), "g");
  return s.replace(re, "");
};
goog.string.regExpEscape = function(s) {
  return String(s).replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g, "\\$1").replace(/\x08/g, "\\x08");
};
goog.string.repeat = function(string, length) {
  return(new Array(length + 1)).join(string);
};
goog.string.padNumber = function(num, length, opt_precision) {
  var s = goog.isDef(opt_precision) ? num.toFixed(opt_precision) : String(num);
  var index = s.indexOf(".");
  if (index == -1) {
    index = s.length;
  }
  return goog.string.repeat("0", Math.max(0, length - index)) + s;
};
goog.string.makeSafe = function(obj) {
  return obj == null ? "" : String(obj);
};
goog.string.buildString = function(var_args) {
  return Array.prototype.join.call(arguments, "");
};
goog.string.getRandomString = function() {
  var x = 2147483648;
  return Math.floor(Math.random() * x).toString(36) + Math.abs(Math.floor(Math.random() * x) ^ goog.now()).toString(36);
};
goog.string.compareVersions = function(version1, version2) {
  var order = 0;
  var v1Subs = goog.string.trim(String(version1)).split(".");
  var v2Subs = goog.string.trim(String(version2)).split(".");
  var subCount = Math.max(v1Subs.length, v2Subs.length);
  for (var subIdx = 0;order == 0 && subIdx < subCount;subIdx++) {
    var v1Sub = v1Subs[subIdx] || "";
    var v2Sub = v2Subs[subIdx] || "";
    var v1CompParser = new RegExp("(\\d*)(\\D*)", "g");
    var v2CompParser = new RegExp("(\\d*)(\\D*)", "g");
    do {
      var v1Comp = v1CompParser.exec(v1Sub) || ["", "", ""];
      var v2Comp = v2CompParser.exec(v2Sub) || ["", "", ""];
      if (v1Comp[0].length == 0 && v2Comp[0].length == 0) {
        break;
      }
      var v1CompNum = v1Comp[1].length == 0 ? 0 : parseInt(v1Comp[1], 10);
      var v2CompNum = v2Comp[1].length == 0 ? 0 : parseInt(v2Comp[1], 10);
      order = goog.string.compareElements_(v1CompNum, v2CompNum) || goog.string.compareElements_(v1Comp[2].length == 0, v2Comp[2].length == 0) || goog.string.compareElements_(v1Comp[2], v2Comp[2]);
    } while (order == 0);
  }
  return order;
};
goog.string.compareElements_ = function(left, right) {
  if (left < right) {
    return-1;
  } else {
    if (left > right) {
      return 1;
    }
  }
  return 0;
};
goog.string.HASHCODE_MAX_ = 4294967296;
goog.string.hashCode = function(str) {
  var result = 0;
  for (var i = 0;i < str.length;++i) {
    result = 31 * result + str.charCodeAt(i);
    result %= goog.string.HASHCODE_MAX_;
  }
  return result;
};
goog.string.uniqueStringCounter_ = Math.random() * 2147483648 | 0;
goog.string.createUniqueString = function() {
  return "goog_" + goog.string.uniqueStringCounter_++;
};
goog.string.toNumber = function(str) {
  var num = Number(str);
  if (num == 0 && goog.string.isEmpty(str)) {
    return NaN;
  }
  return num;
};
goog.string.isLowerCamelCase = function(str) {
  return/^[a-z]+([A-Z][a-z]*)*$/.test(str);
};
goog.string.isUpperCamelCase = function(str) {
  return/^([A-Z][a-z]*)+$/.test(str);
};
goog.string.toCamelCase = function(str) {
  return String(str).replace(/\-([a-z])/g, function(all, match) {
    return match.toUpperCase();
  });
};
goog.string.toSelectorCase = function(str) {
  return String(str).replace(/([A-Z])/g, "-$1").toLowerCase();
};
goog.string.toTitleCase = function(str, opt_delimiters) {
  var delimiters = goog.isString(opt_delimiters) ? goog.string.regExpEscape(opt_delimiters) : "\\s";
  delimiters = delimiters ? "|[" + delimiters + "]+" : "";
  var regexp = new RegExp("(^" + delimiters + ")([a-z])", "g");
  return str.replace(regexp, function(all, p1, p2) {
    return p1 + p2.toUpperCase();
  });
};
goog.string.parseInt = function(value) {
  if (isFinite(value)) {
    value = String(value);
  }
  if (goog.isString(value)) {
    return/^\s*-?0x/i.test(value) ? parseInt(value, 16) : parseInt(value, 10);
  }
  return NaN;
};
goog.string.splitLimit = function(str, separator, limit) {
  var parts = str.split(separator);
  var returnVal = [];
  while (limit > 0 && parts.length) {
    returnVal.push(parts.shift());
    limit--;
  }
  if (parts.length) {
    returnVal.push(parts.join(separator));
  }
  return returnVal;
};
goog.provide("goog.object");
goog.object.forEach = function(obj, f, opt_obj) {
  for (var key in obj) {
    f.call(opt_obj, obj[key], key, obj);
  }
};
goog.object.filter = function(obj, f, opt_obj) {
  var res = {};
  for (var key in obj) {
    if (f.call(opt_obj, obj[key], key, obj)) {
      res[key] = obj[key];
    }
  }
  return res;
};
goog.object.map = function(obj, f, opt_obj) {
  var res = {};
  for (var key in obj) {
    res[key] = f.call(opt_obj, obj[key], key, obj);
  }
  return res;
};
goog.object.some = function(obj, f, opt_obj) {
  for (var key in obj) {
    if (f.call(opt_obj, obj[key], key, obj)) {
      return true;
    }
  }
  return false;
};
goog.object.every = function(obj, f, opt_obj) {
  for (var key in obj) {
    if (!f.call(opt_obj, obj[key], key, obj)) {
      return false;
    }
  }
  return true;
};
goog.object.getCount = function(obj) {
  var rv = 0;
  for (var key in obj) {
    rv++;
  }
  return rv;
};
goog.object.getAnyKey = function(obj) {
  for (var key in obj) {
    return key;
  }
};
goog.object.getAnyValue = function(obj) {
  for (var key in obj) {
    return obj[key];
  }
};
goog.object.contains = function(obj, val) {
  return goog.object.containsValue(obj, val);
};
goog.object.getValues = function(obj) {
  var res = [];
  var i = 0;
  for (var key in obj) {
    res[i++] = obj[key];
  }
  return res;
};
goog.object.getKeys = function(obj) {
  var res = [];
  var i = 0;
  for (var key in obj) {
    res[i++] = key;
  }
  return res;
};
goog.object.getValueByKeys = function(obj, var_args) {
  var isArrayLike = goog.isArrayLike(var_args);
  var keys = isArrayLike ? var_args : arguments;
  for (var i = isArrayLike ? 0 : 1;i < keys.length;i++) {
    obj = obj[keys[i]];
    if (!goog.isDef(obj)) {
      break;
    }
  }
  return obj;
};
goog.object.containsKey = function(obj, key) {
  return key in obj;
};
goog.object.containsValue = function(obj, val) {
  for (var key in obj) {
    if (obj[key] == val) {
      return true;
    }
  }
  return false;
};
goog.object.findKey = function(obj, f, opt_this) {
  for (var key in obj) {
    if (f.call(opt_this, obj[key], key, obj)) {
      return key;
    }
  }
  return undefined;
};
goog.object.findValue = function(obj, f, opt_this) {
  var key = goog.object.findKey(obj, f, opt_this);
  return key && obj[key];
};
goog.object.isEmpty = function(obj) {
  for (var key in obj) {
    return false;
  }
  return true;
};
goog.object.clear = function(obj) {
  for (var i in obj) {
    delete obj[i];
  }
};
goog.object.remove = function(obj, key) {
  var rv;
  if (rv = key in obj) {
    delete obj[key];
  }
  return rv;
};
goog.object.add = function(obj, key, val) {
  if (key in obj) {
    throw Error('The object already contains the key "' + key + '"');
  }
  goog.object.set(obj, key, val);
};
goog.object.get = function(obj, key, opt_val) {
  if (key in obj) {
    return obj[key];
  }
  return opt_val;
};
goog.object.set = function(obj, key, value) {
  obj[key] = value;
};
goog.object.setIfUndefined = function(obj, key, value) {
  return key in obj ? obj[key] : obj[key] = value;
};
goog.object.clone = function(obj) {
  var res = {};
  for (var key in obj) {
    res[key] = obj[key];
  }
  return res;
};
goog.object.unsafeClone = function(obj) {
  var type = goog.typeOf(obj);
  if (type == "object" || type == "array") {
    if (obj.clone) {
      return obj.clone();
    }
    var clone = type == "array" ? [] : {};
    for (var key in obj) {
      clone[key] = goog.object.unsafeClone(obj[key]);
    }
    return clone;
  }
  return obj;
};
goog.object.transpose = function(obj) {
  var transposed = {};
  for (var key in obj) {
    transposed[obj[key]] = key;
  }
  return transposed;
};
goog.object.PROTOTYPE_FIELDS_ = ["constructor", "hasOwnProperty", "isPrototypeOf", "propertyIsEnumerable", "toLocaleString", "toString", "valueOf"];
goog.object.extend = function(target, var_args) {
  var key, source;
  for (var i = 1;i < arguments.length;i++) {
    source = arguments[i];
    for (key in source) {
      target[key] = source[key];
    }
    for (var j = 0;j < goog.object.PROTOTYPE_FIELDS_.length;j++) {
      key = goog.object.PROTOTYPE_FIELDS_[j];
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }
};
goog.object.create = function(var_args) {
  var argLength = arguments.length;
  if (argLength == 1 && goog.isArray(arguments[0])) {
    return goog.object.create.apply(null, arguments[0]);
  }
  if (argLength % 2) {
    throw Error("Uneven number of arguments");
  }
  var rv = {};
  for (var i = 0;i < argLength;i += 2) {
    rv[arguments[i]] = arguments[i + 1];
  }
  return rv;
};
goog.object.createSet = function(var_args) {
  var argLength = arguments.length;
  if (argLength == 1 && goog.isArray(arguments[0])) {
    return goog.object.createSet.apply(null, arguments[0]);
  }
  var rv = {};
  for (var i = 0;i < argLength;i++) {
    rv[arguments[i]] = true;
  }
  return rv;
};
goog.object.createImmutableView = function(obj) {
  var result = obj;
  if (Object.isFrozen && !Object.isFrozen(obj)) {
    result = Object.create(obj);
    Object.freeze(result);
  }
  return result;
};
goog.object.isImmutableView = function(obj) {
  return!!Object.isFrozen && Object.isFrozen(obj);
};
goog.provide("goog.string.StringBuffer");
goog.string.StringBuffer = function(opt_a1, var_args) {
  if (opt_a1 != null) {
    this.append.apply(this, arguments);
  }
};
goog.string.StringBuffer.prototype.buffer_ = "";
goog.string.StringBuffer.prototype.set = function(s) {
  this.buffer_ = "" + s;
};
goog.string.StringBuffer.prototype.append = function(a1, opt_a2, var_args) {
  this.buffer_ += a1;
  if (opt_a2 != null) {
    for (var i = 1;i < arguments.length;i++) {
      this.buffer_ += arguments[i];
    }
  }
  return this;
};
goog.string.StringBuffer.prototype.clear = function() {
  this.buffer_ = "";
};
goog.string.StringBuffer.prototype.getLength = function() {
  return this.buffer_.length;
};
goog.string.StringBuffer.prototype.toString = function() {
  return this.buffer_;
};
goog.provide("goog.debug.Error");
goog.debug.Error = function(opt_msg) {
  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, goog.debug.Error);
  } else {
    var stack = (new Error).stack;
    if (stack) {
      this.stack = stack;
    }
  }
  if (opt_msg) {
    this.message = String(opt_msg);
  }
};
goog.inherits(goog.debug.Error, Error);
goog.debug.Error.prototype.name = "CustomError";
goog.provide("goog.dom.NodeType");
goog.dom.NodeType = {ELEMENT:1, ATTRIBUTE:2, TEXT:3, CDATA_SECTION:4, ENTITY_REFERENCE:5, ENTITY:6, PROCESSING_INSTRUCTION:7, COMMENT:8, DOCUMENT:9, DOCUMENT_TYPE:10, DOCUMENT_FRAGMENT:11, NOTATION:12};
goog.provide("goog.asserts");
goog.provide("goog.asserts.AssertionError");
goog.require("goog.debug.Error");
goog.require("goog.dom.NodeType");
goog.require("goog.string");
goog.define("goog.asserts.ENABLE_ASSERTS", goog.DEBUG);
goog.asserts.AssertionError = function(messagePattern, messageArgs) {
  messageArgs.unshift(messagePattern);
  goog.debug.Error.call(this, goog.string.subs.apply(null, messageArgs));
  messageArgs.shift();
  this.messagePattern = messagePattern;
};
goog.inherits(goog.asserts.AssertionError, goog.debug.Error);
goog.asserts.AssertionError.prototype.name = "AssertionError";
goog.asserts.DEFAULT_ERROR_HANDLER = function(e) {
  throw e;
};
goog.asserts.errorHandler_ = goog.asserts.DEFAULT_ERROR_HANDLER;
goog.asserts.doAssertFailure_ = function(defaultMessage, defaultArgs, givenMessage, givenArgs) {
  var message = "Assertion failed";
  if (givenMessage) {
    message += ": " + givenMessage;
    var args = givenArgs;
  } else {
    if (defaultMessage) {
      message += ": " + defaultMessage;
      args = defaultArgs;
    }
  }
  var e = new goog.asserts.AssertionError("" + message, args || []);
  goog.asserts.errorHandler_(e);
};
goog.asserts.setErrorHandler = function(errorHandler) {
  if (goog.asserts.ENABLE_ASSERTS) {
    goog.asserts.errorHandler_ = errorHandler;
  }
};
goog.asserts.assert = function(condition, opt_message, var_args) {
  if (goog.asserts.ENABLE_ASSERTS && !condition) {
    goog.asserts.doAssertFailure_("", null, opt_message, Array.prototype.slice.call(arguments, 2));
  }
  return condition;
};
goog.asserts.fail = function(opt_message, var_args) {
  if (goog.asserts.ENABLE_ASSERTS) {
    goog.asserts.errorHandler_(new goog.asserts.AssertionError("Failure" + (opt_message ? ": " + opt_message : ""), Array.prototype.slice.call(arguments, 1)));
  }
};
goog.asserts.assertNumber = function(value, opt_message, var_args) {
  if (goog.asserts.ENABLE_ASSERTS && !goog.isNumber(value)) {
    goog.asserts.doAssertFailure_("Expected number but got %s: %s.", [goog.typeOf(value), value], opt_message, Array.prototype.slice.call(arguments, 2));
  }
  return(value);
};
goog.asserts.assertString = function(value, opt_message, var_args) {
  if (goog.asserts.ENABLE_ASSERTS && !goog.isString(value)) {
    goog.asserts.doAssertFailure_("Expected string but got %s: %s.", [goog.typeOf(value), value], opt_message, Array.prototype.slice.call(arguments, 2));
  }
  return(value);
};
goog.asserts.assertFunction = function(value, opt_message, var_args) {
  if (goog.asserts.ENABLE_ASSERTS && !goog.isFunction(value)) {
    goog.asserts.doAssertFailure_("Expected function but got %s: %s.", [goog.typeOf(value), value], opt_message, Array.prototype.slice.call(arguments, 2));
  }
  return(value);
};
goog.asserts.assertObject = function(value, opt_message, var_args) {
  if (goog.asserts.ENABLE_ASSERTS && !goog.isObject(value)) {
    goog.asserts.doAssertFailure_("Expected object but got %s: %s.", [goog.typeOf(value), value], opt_message, Array.prototype.slice.call(arguments, 2));
  }
  return(value);
};
goog.asserts.assertArray = function(value, opt_message, var_args) {
  if (goog.asserts.ENABLE_ASSERTS && !goog.isArray(value)) {
    goog.asserts.doAssertFailure_("Expected array but got %s: %s.", [goog.typeOf(value), value], opt_message, Array.prototype.slice.call(arguments, 2));
  }
  return(value);
};
goog.asserts.assertBoolean = function(value, opt_message, var_args) {
  if (goog.asserts.ENABLE_ASSERTS && !goog.isBoolean(value)) {
    goog.asserts.doAssertFailure_("Expected boolean but got %s: %s.", [goog.typeOf(value), value], opt_message, Array.prototype.slice.call(arguments, 2));
  }
  return(value);
};
goog.asserts.assertElement = function(value, opt_message, var_args) {
  if (goog.asserts.ENABLE_ASSERTS && (!goog.isObject(value) || value.nodeType != goog.dom.NodeType.ELEMENT)) {
    goog.asserts.doAssertFailure_("Expected Element but got %s: %s.", [goog.typeOf(value), value], opt_message, Array.prototype.slice.call(arguments, 2));
  }
  return(value);
};
goog.asserts.assertInstanceof = function(value, type, opt_message, var_args) {
  if (goog.asserts.ENABLE_ASSERTS && !(value instanceof type)) {
    goog.asserts.doAssertFailure_("instanceof check failed.", null, opt_message, Array.prototype.slice.call(arguments, 3));
  }
  return value;
};
goog.asserts.assertObjectPrototypeIsIntact = function() {
  for (var key in Object.prototype) {
    goog.asserts.fail(key + " should not be enumerable in Object.prototype.");
  }
};
goog.provide("goog.array");
goog.provide("goog.array.ArrayLike");
goog.require("goog.asserts");
goog.define("goog.NATIVE_ARRAY_PROTOTYPES", goog.TRUSTED_SITE);
goog.define("goog.array.ASSUME_NATIVE_FUNCTIONS", false);
goog.array.ArrayLike;
goog.array.peek = function(array) {
  return array[array.length - 1];
};
goog.array.last = goog.array.peek;
goog.array.ARRAY_PROTOTYPE_ = Array.prototype;
goog.array.indexOf = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || goog.array.ARRAY_PROTOTYPE_.indexOf) ? function(arr, obj, opt_fromIndex) {
  goog.asserts.assert(arr.length != null);
  return goog.array.ARRAY_PROTOTYPE_.indexOf.call(arr, obj, opt_fromIndex);
} : function(arr, obj, opt_fromIndex) {
  var fromIndex = opt_fromIndex == null ? 0 : opt_fromIndex < 0 ? Math.max(0, arr.length + opt_fromIndex) : opt_fromIndex;
  if (goog.isString(arr)) {
    if (!goog.isString(obj) || obj.length != 1) {
      return-1;
    }
    return arr.indexOf(obj, fromIndex);
  }
  for (var i = fromIndex;i < arr.length;i++) {
    if (i in arr && arr[i] === obj) {
      return i;
    }
  }
  return-1;
};
goog.array.lastIndexOf = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || goog.array.ARRAY_PROTOTYPE_.lastIndexOf) ? function(arr, obj, opt_fromIndex) {
  goog.asserts.assert(arr.length != null);
  var fromIndex = opt_fromIndex == null ? arr.length - 1 : opt_fromIndex;
  return goog.array.ARRAY_PROTOTYPE_.lastIndexOf.call(arr, obj, fromIndex);
} : function(arr, obj, opt_fromIndex) {
  var fromIndex = opt_fromIndex == null ? arr.length - 1 : opt_fromIndex;
  if (fromIndex < 0) {
    fromIndex = Math.max(0, arr.length + fromIndex);
  }
  if (goog.isString(arr)) {
    if (!goog.isString(obj) || obj.length != 1) {
      return-1;
    }
    return arr.lastIndexOf(obj, fromIndex);
  }
  for (var i = fromIndex;i >= 0;i--) {
    if (i in arr && arr[i] === obj) {
      return i;
    }
  }
  return-1;
};
goog.array.forEach = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || goog.array.ARRAY_PROTOTYPE_.forEach) ? function(arr, f, opt_obj) {
  goog.asserts.assert(arr.length != null);
  goog.array.ARRAY_PROTOTYPE_.forEach.call(arr, f, opt_obj);
} : function(arr, f, opt_obj) {
  var l = arr.length;
  var arr2 = goog.isString(arr) ? arr.split("") : arr;
  for (var i = 0;i < l;i++) {
    if (i in arr2) {
      f.call(opt_obj, arr2[i], i, arr);
    }
  }
};
goog.array.forEachRight = function(arr, f, opt_obj) {
  var l = arr.length;
  var arr2 = goog.isString(arr) ? arr.split("") : arr;
  for (var i = l - 1;i >= 0;--i) {
    if (i in arr2) {
      f.call(opt_obj, arr2[i], i, arr);
    }
  }
};
goog.array.filter = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || goog.array.ARRAY_PROTOTYPE_.filter) ? function(arr, f, opt_obj) {
  goog.asserts.assert(arr.length != null);
  return goog.array.ARRAY_PROTOTYPE_.filter.call(arr, f, opt_obj);
} : function(arr, f, opt_obj) {
  var l = arr.length;
  var res = [];
  var resLength = 0;
  var arr2 = goog.isString(arr) ? arr.split("") : arr;
  for (var i = 0;i < l;i++) {
    if (i in arr2) {
      var val = arr2[i];
      if (f.call(opt_obj, val, i, arr)) {
        res[resLength++] = val;
      }
    }
  }
  return res;
};
goog.array.map = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || goog.array.ARRAY_PROTOTYPE_.map) ? function(arr, f, opt_obj) {
  goog.asserts.assert(arr.length != null);
  return goog.array.ARRAY_PROTOTYPE_.map.call(arr, f, opt_obj);
} : function(arr, f, opt_obj) {
  var l = arr.length;
  var res = new Array(l);
  var arr2 = goog.isString(arr) ? arr.split("") : arr;
  for (var i = 0;i < l;i++) {
    if (i in arr2) {
      res[i] = f.call(opt_obj, arr2[i], i, arr);
    }
  }
  return res;
};
goog.array.reduce = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || goog.array.ARRAY_PROTOTYPE_.reduce) ? function(arr, f, val, opt_obj) {
  goog.asserts.assert(arr.length != null);
  if (opt_obj) {
    f = goog.bind(f, opt_obj);
  }
  return goog.array.ARRAY_PROTOTYPE_.reduce.call(arr, f, val);
} : function(arr, f, val, opt_obj) {
  var rval = val;
  goog.array.forEach(arr, function(val, index) {
    rval = f.call(opt_obj, rval, val, index, arr);
  });
  return rval;
};
goog.array.reduceRight = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || goog.array.ARRAY_PROTOTYPE_.reduceRight) ? function(arr, f, val, opt_obj) {
  goog.asserts.assert(arr.length != null);
  if (opt_obj) {
    f = goog.bind(f, opt_obj);
  }
  return goog.array.ARRAY_PROTOTYPE_.reduceRight.call(arr, f, val);
} : function(arr, f, val, opt_obj) {
  var rval = val;
  goog.array.forEachRight(arr, function(val, index) {
    rval = f.call(opt_obj, rval, val, index, arr);
  });
  return rval;
};
goog.array.some = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || goog.array.ARRAY_PROTOTYPE_.some) ? function(arr, f, opt_obj) {
  goog.asserts.assert(arr.length != null);
  return goog.array.ARRAY_PROTOTYPE_.some.call(arr, f, opt_obj);
} : function(arr, f, opt_obj) {
  var l = arr.length;
  var arr2 = goog.isString(arr) ? arr.split("") : arr;
  for (var i = 0;i < l;i++) {
    if (i in arr2 && f.call(opt_obj, arr2[i], i, arr)) {
      return true;
    }
  }
  return false;
};
goog.array.every = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || goog.array.ARRAY_PROTOTYPE_.every) ? function(arr, f, opt_obj) {
  goog.asserts.assert(arr.length != null);
  return goog.array.ARRAY_PROTOTYPE_.every.call(arr, f, opt_obj);
} : function(arr, f, opt_obj) {
  var l = arr.length;
  var arr2 = goog.isString(arr) ? arr.split("") : arr;
  for (var i = 0;i < l;i++) {
    if (i in arr2 && !f.call(opt_obj, arr2[i], i, arr)) {
      return false;
    }
  }
  return true;
};
goog.array.count = function(arr, f, opt_obj) {
  var count = 0;
  goog.array.forEach(arr, function(element, index, arr) {
    if (f.call(opt_obj, element, index, arr)) {
      ++count;
    }
  }, opt_obj);
  return count;
};
goog.array.find = function(arr, f, opt_obj) {
  var i = goog.array.findIndex(arr, f, opt_obj);
  return i < 0 ? null : goog.isString(arr) ? arr.charAt(i) : arr[i];
};
goog.array.findIndex = function(arr, f, opt_obj) {
  var l = arr.length;
  var arr2 = goog.isString(arr) ? arr.split("") : arr;
  for (var i = 0;i < l;i++) {
    if (i in arr2 && f.call(opt_obj, arr2[i], i, arr)) {
      return i;
    }
  }
  return-1;
};
goog.array.findRight = function(arr, f, opt_obj) {
  var i = goog.array.findIndexRight(arr, f, opt_obj);
  return i < 0 ? null : goog.isString(arr) ? arr.charAt(i) : arr[i];
};
goog.array.findIndexRight = function(arr, f, opt_obj) {
  var l = arr.length;
  var arr2 = goog.isString(arr) ? arr.split("") : arr;
  for (var i = l - 1;i >= 0;i--) {
    if (i in arr2 && f.call(opt_obj, arr2[i], i, arr)) {
      return i;
    }
  }
  return-1;
};
goog.array.contains = function(arr, obj) {
  return goog.array.indexOf(arr, obj) >= 0;
};
goog.array.isEmpty = function(arr) {
  return arr.length == 0;
};
goog.array.clear = function(arr) {
  if (!goog.isArray(arr)) {
    for (var i = arr.length - 1;i >= 0;i--) {
      delete arr[i];
    }
  }
  arr.length = 0;
};
goog.array.insert = function(arr, obj) {
  if (!goog.array.contains(arr, obj)) {
    arr.push(obj);
  }
};
goog.array.insertAt = function(arr, obj, opt_i) {
  goog.array.splice(arr, opt_i, 0, obj);
};
goog.array.insertArrayAt = function(arr, elementsToAdd, opt_i) {
  goog.partial(goog.array.splice, arr, opt_i, 0).apply(null, elementsToAdd);
};
goog.array.insertBefore = function(arr, obj, opt_obj2) {
  var i;
  if (arguments.length == 2 || (i = goog.array.indexOf(arr, opt_obj2)) < 0) {
    arr.push(obj);
  } else {
    goog.array.insertAt(arr, obj, i);
  }
};
goog.array.remove = function(arr, obj) {
  var i = goog.array.indexOf(arr, obj);
  var rv;
  if (rv = i >= 0) {
    goog.array.removeAt(arr, i);
  }
  return rv;
};
goog.array.removeAt = function(arr, i) {
  goog.asserts.assert(arr.length != null);
  return goog.array.ARRAY_PROTOTYPE_.splice.call(arr, i, 1).length == 1;
};
goog.array.removeIf = function(arr, f, opt_obj) {
  var i = goog.array.findIndex(arr, f, opt_obj);
  if (i >= 0) {
    goog.array.removeAt(arr, i);
    return true;
  }
  return false;
};
goog.array.concat = function(var_args) {
  return goog.array.ARRAY_PROTOTYPE_.concat.apply(goog.array.ARRAY_PROTOTYPE_, arguments);
};
goog.array.join = function(var_args) {
  return goog.array.ARRAY_PROTOTYPE_.concat.apply(goog.array.ARRAY_PROTOTYPE_, arguments);
};
goog.array.toArray = function(object) {
  var length = object.length;
  if (length > 0) {
    var rv = new Array(length);
    for (var i = 0;i < length;i++) {
      rv[i] = object[i];
    }
    return rv;
  }
  return[];
};
goog.array.clone = goog.array.toArray;
goog.array.extend = function(arr1, var_args) {
  for (var i = 1;i < arguments.length;i++) {
    var arr2 = arguments[i];
    var isArrayLike;
    if (goog.isArray(arr2) || (isArrayLike = goog.isArrayLike(arr2)) && Object.prototype.hasOwnProperty.call(arr2, "callee")) {
      arr1.push.apply(arr1, arr2);
    } else {
      if (isArrayLike) {
        var len1 = arr1.length;
        var len2 = arr2.length;
        for (var j = 0;j < len2;j++) {
          arr1[len1 + j] = arr2[j];
        }
      } else {
        arr1.push(arr2);
      }
    }
  }
};
goog.array.splice = function(arr, index, howMany, var_args) {
  goog.asserts.assert(arr.length != null);
  return goog.array.ARRAY_PROTOTYPE_.splice.apply(arr, goog.array.slice(arguments, 1));
};
goog.array.slice = function(arr, start, opt_end) {
  goog.asserts.assert(arr.length != null);
  if (arguments.length <= 2) {
    return goog.array.ARRAY_PROTOTYPE_.slice.call(arr, start);
  } else {
    return goog.array.ARRAY_PROTOTYPE_.slice.call(arr, start, opt_end);
  }
};
goog.array.removeDuplicates = function(arr, opt_rv, opt_hashFn) {
  var returnArray = opt_rv || arr;
  var defaultHashFn = function(item) {
    return goog.isObject(current) ? "o" + goog.getUid(current) : (typeof current).charAt(0) + current;
  };
  var hashFn = opt_hashFn || defaultHashFn;
  var seen = {}, cursorInsert = 0, cursorRead = 0;
  while (cursorRead < arr.length) {
    var current = arr[cursorRead++];
    var key = hashFn(current);
    if (!Object.prototype.hasOwnProperty.call(seen, key)) {
      seen[key] = true;
      returnArray[cursorInsert++] = current;
    }
  }
  returnArray.length = cursorInsert;
};
goog.array.binarySearch = function(arr, target, opt_compareFn) {
  return goog.array.binarySearch_(arr, opt_compareFn || goog.array.defaultCompare, false, target);
};
goog.array.binarySelect = function(arr, evaluator, opt_obj) {
  return goog.array.binarySearch_(arr, evaluator, true, undefined, opt_obj);
};
goog.array.binarySearch_ = function(arr, compareFn, isEvaluator, opt_target, opt_selfObj) {
  var left = 0;
  var right = arr.length;
  var found;
  while (left < right) {
    var middle = left + right >> 1;
    var compareResult;
    if (isEvaluator) {
      compareResult = compareFn.call(opt_selfObj, arr[middle], middle, arr);
    } else {
      compareResult = compareFn(opt_target, arr[middle]);
    }
    if (compareResult > 0) {
      left = middle + 1;
    } else {
      right = middle;
      found = !compareResult;
    }
  }
  return found ? left : ~left;
};
goog.array.sort = function(arr, opt_compareFn) {
  arr.sort(opt_compareFn || goog.array.defaultCompare);
};
goog.array.stableSort = function(arr, opt_compareFn) {
  for (var i = 0;i < arr.length;i++) {
    arr[i] = {index:i, value:arr[i]};
  }
  var valueCompareFn = opt_compareFn || goog.array.defaultCompare;
  function stableCompareFn(obj1, obj2) {
    return valueCompareFn(obj1.value, obj2.value) || obj1.index - obj2.index;
  }
  goog.array.sort(arr, stableCompareFn);
  for (var i = 0;i < arr.length;i++) {
    arr[i] = arr[i].value;
  }
};
goog.array.sortObjectsByKey = function(arr, key, opt_compareFn) {
  var compare = opt_compareFn || goog.array.defaultCompare;
  goog.array.sort(arr, function(a, b) {
    return compare(a[key], b[key]);
  });
};
goog.array.isSorted = function(arr, opt_compareFn, opt_strict) {
  var compare = opt_compareFn || goog.array.defaultCompare;
  for (var i = 1;i < arr.length;i++) {
    var compareResult = compare(arr[i - 1], arr[i]);
    if (compareResult > 0 || compareResult == 0 && opt_strict) {
      return false;
    }
  }
  return true;
};
goog.array.equals = function(arr1, arr2, opt_equalsFn) {
  if (!goog.isArrayLike(arr1) || !goog.isArrayLike(arr2) || arr1.length != arr2.length) {
    return false;
  }
  var l = arr1.length;
  var equalsFn = opt_equalsFn || goog.array.defaultCompareEquality;
  for (var i = 0;i < l;i++) {
    if (!equalsFn(arr1[i], arr2[i])) {
      return false;
    }
  }
  return true;
};
goog.array.compare3 = function(arr1, arr2, opt_compareFn) {
  var compare = opt_compareFn || goog.array.defaultCompare;
  var l = Math.min(arr1.length, arr2.length);
  for (var i = 0;i < l;i++) {
    var result = compare(arr1[i], arr2[i]);
    if (result != 0) {
      return result;
    }
  }
  return goog.array.defaultCompare(arr1.length, arr2.length);
};
goog.array.defaultCompare = function(a, b) {
  return a > b ? 1 : a < b ? -1 : 0;
};
goog.array.defaultCompareEquality = function(a, b) {
  return a === b;
};
goog.array.binaryInsert = function(array, value, opt_compareFn) {
  var index = goog.array.binarySearch(array, value, opt_compareFn);
  if (index < 0) {
    goog.array.insertAt(array, value, -(index + 1));
    return true;
  }
  return false;
};
goog.array.binaryRemove = function(array, value, opt_compareFn) {
  var index = goog.array.binarySearch(array, value, opt_compareFn);
  return index >= 0 ? goog.array.removeAt(array, index) : false;
};
goog.array.bucket = function(array, sorter, opt_obj) {
  var buckets = {};
  for (var i = 0;i < array.length;i++) {
    var value = array[i];
    var key = sorter.call(opt_obj, value, i, array);
    if (goog.isDef(key)) {
      var bucket = buckets[key] || (buckets[key] = []);
      bucket.push(value);
    }
  }
  return buckets;
};
goog.array.toObject = function(arr, keyFunc, opt_obj) {
  var ret = {};
  goog.array.forEach(arr, function(element, index) {
    ret[keyFunc.call(opt_obj, element, index, arr)] = element;
  });
  return ret;
};
goog.array.range = function(startOrEnd, opt_end, opt_step) {
  var array = [];
  var start = 0;
  var end = startOrEnd;
  var step = opt_step || 1;
  if (opt_end !== undefined) {
    start = startOrEnd;
    end = opt_end;
  }
  if (step * (end - start) < 0) {
    return[];
  }
  if (step > 0) {
    for (var i = start;i < end;i += step) {
      array.push(i);
    }
  } else {
    for (var i = start;i > end;i += step) {
      array.push(i);
    }
  }
  return array;
};
goog.array.repeat = function(value, n) {
  var array = [];
  for (var i = 0;i < n;i++) {
    array[i] = value;
  }
  return array;
};
goog.array.flatten = function(var_args) {
  var result = [];
  for (var i = 0;i < arguments.length;i++) {
    var element = arguments[i];
    if (goog.isArray(element)) {
      result.push.apply(result, goog.array.flatten.apply(null, element));
    } else {
      result.push(element);
    }
  }
  return result;
};
goog.array.rotate = function(array, n) {
  goog.asserts.assert(array.length != null);
  if (array.length) {
    n %= array.length;
    if (n > 0) {
      goog.array.ARRAY_PROTOTYPE_.unshift.apply(array, array.splice(-n, n));
    } else {
      if (n < 0) {
        goog.array.ARRAY_PROTOTYPE_.push.apply(array, array.splice(0, -n));
      }
    }
  }
  return array;
};
goog.array.moveItem = function(arr, fromIndex, toIndex) {
  goog.asserts.assert(fromIndex >= 0 && fromIndex < arr.length);
  goog.asserts.assert(toIndex >= 0 && toIndex < arr.length);
  var removedItems = goog.array.ARRAY_PROTOTYPE_.splice.call(arr, fromIndex, 1);
  goog.array.ARRAY_PROTOTYPE_.splice.call(arr, toIndex, 0, removedItems[0]);
};
goog.array.zip = function(var_args) {
  if (!arguments.length) {
    return[];
  }
  var result = [];
  for (var i = 0;true;i++) {
    var value = [];
    for (var j = 0;j < arguments.length;j++) {
      var arr = arguments[j];
      if (i >= arr.length) {
        return result;
      }
      value.push(arr[i]);
    }
    result.push(value);
  }
};
goog.array.shuffle = function(arr, opt_randFn) {
  var randFn = opt_randFn || Math.random;
  for (var i = arr.length - 1;i > 0;i--) {
    var j = Math.floor(randFn() * (i + 1));
    var tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp;
  }
};
goog.provide("cljs.core");
goog.require("goog.string.StringBuffer");
goog.require("goog.array");
goog.require("goog.array");
goog.require("goog.object");
goog.require("goog.object");
goog.require("goog.string");
goog.require("goog.string");
cljs.core._STAR_clojurescript_version_STAR_ = "0.0-2356";
cljs.core._STAR_unchecked_if_STAR_ = false;
cljs.core._STAR_print_fn_STAR_ = function _STAR_print_fn_STAR_(_) {
  throw new Error("No *print-fn* fn set for evaluation environment");
};
cljs.core.set_print_fn_BANG_ = function set_print_fn_BANG_(f) {
  return cljs.core._STAR_print_fn_STAR_ = f;
};
cljs.core._STAR_flush_on_newline_STAR_ = true;
cljs.core._STAR_print_newline_STAR_ = true;
cljs.core._STAR_print_readably_STAR_ = true;
cljs.core._STAR_print_meta_STAR_ = false;
cljs.core._STAR_print_dup_STAR_ = false;
cljs.core._STAR_print_length_STAR_ = null;
cljs.core._STAR_print_level_STAR_ = null;
cljs.core.pr_opts = function pr_opts() {
  return new cljs.core.PersistentArrayMap(null, 5, [new cljs.core.Keyword(null, "flush-on-newline", "flush-on-newline", -151457939), cljs.core._STAR_flush_on_newline_STAR_, new cljs.core.Keyword(null, "readably", "readably", 1129599760), cljs.core._STAR_print_readably_STAR_, new cljs.core.Keyword(null, "meta", "meta", 1499536964), cljs.core._STAR_print_meta_STAR_, new cljs.core.Keyword(null, "dup", "dup", 556298533), cljs.core._STAR_print_dup_STAR_, new cljs.core.Keyword(null, "print-length", "print-length", 
  1931866356), cljs.core._STAR_print_length_STAR_], null);
};
cljs.core.enable_console_print_BANG_ = function enable_console_print_BANG_() {
  cljs.core._STAR_print_newline_STAR_ = false;
  return cljs.core._STAR_print_fn_STAR_ = function() {
    var G__56133__delegate = function(args) {
      return console.log.apply(console, cljs.core.into_array.call(null, args));
    };
    var G__56133 = function(var_args) {
      var args = null;
      if (arguments.length > 0) {
        args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0);
      }
      return G__56133__delegate.call(this, args);
    };
    G__56133.cljs$lang$maxFixedArity = 0;
    G__56133.cljs$lang$applyTo = function(arglist__56134) {
      var args = cljs.core.seq(arglist__56134);
      return G__56133__delegate(args);
    };
    G__56133.cljs$core$IFn$_invoke$arity$variadic = G__56133__delegate;
    return G__56133;
  }();
};
cljs.core.truth_ = function truth_(x) {
  return x != null && x !== false;
};
cljs.core.not_native = null;
cljs.core.identical_QMARK_ = function identical_QMARK_(x, y) {
  return x === y;
};
cljs.core.nil_QMARK_ = function nil_QMARK_(x) {
  return x == null;
};
cljs.core.array_QMARK_ = function array_QMARK_(x) {
  return x instanceof Array;
};
cljs.core.number_QMARK_ = function number_QMARK_(n) {
  return typeof n === "number";
};
cljs.core.not = function not(x) {
  if (cljs.core.truth_(x)) {
    return false;
  } else {
    return true;
  }
};
cljs.core.some_QMARK_ = function some_QMARK_(x) {
  return!(x == null);
};
cljs.core.object_QMARK_ = function object_QMARK_(x) {
  if (!(x == null)) {
    return x.constructor === Object;
  } else {
    return false;
  }
};
cljs.core.string_QMARK_ = function string_QMARK_(x) {
  return goog.isString(x);
};
cljs.core.native_satisfies_QMARK_ = function native_satisfies_QMARK_(p, x) {
  var x__$1 = x == null ? null : x;
  if (p[goog.typeOf(x__$1)]) {
    return true;
  } else {
    if (p["_"]) {
      return true;
    } else {
      return false;
    }
  }
};
cljs.core.is_proto_ = function is_proto_(x) {
  return x.constructor.prototype === x;
};
cljs.core._STAR_main_cli_fn_STAR_ = null;
cljs.core.type = function type(x) {
  if (x == null) {
    return null;
  } else {
    return x.constructor;
  }
};
cljs.core.missing_protocol = function missing_protocol(proto, obj) {
  var ty = cljs.core.type.call(null, obj);
  var ty__$1 = cljs.core.truth_(function() {
    var and__3627__auto__ = ty;
    if (cljs.core.truth_(and__3627__auto__)) {
      return ty.cljs$lang$type;
    } else {
      return and__3627__auto__;
    }
  }()) ? ty.cljs$lang$ctorStr : goog.typeOf(obj);
  return new Error(["No protocol method ", proto, " defined for type ", ty__$1, ": ", obj].join(""));
};
cljs.core.type__GT_str = function type__GT_str(ty) {
  var temp__4124__auto__ = ty.cljs$lang$ctorStr;
  if (cljs.core.truth_(temp__4124__auto__)) {
    var s = temp__4124__auto__;
    return s;
  } else {
    return "" + cljs.core.str.cljs$core$IFn$_invoke$arity$1(ty);
  }
};
cljs.core.make_array = function() {
  var make_array = null;
  var make_array__1 = function(size) {
    return new Array(size);
  };
  var make_array__2 = function(type, size) {
    return make_array.call(null, size);
  };
  make_array = function(type, size) {
    switch(arguments.length) {
      case 1:
        return make_array__1.call(this, type);
      case 2:
        return make_array__2.call(this, type, size);
    }
    throw new Error("Invalid arity: " + arguments.length);
  };
  make_array.cljs$core$IFn$_invoke$arity$1 = make_array__1;
  make_array.cljs$core$IFn$_invoke$arity$2 = make_array__2;
  return make_array;
}();
cljs.core.aclone = function aclone(arr) {
  var len = arr.length;
  var new_arr = new Array(len);
  var n__4508__auto___56135 = len;
  var i_56136 = 0;
  while (true) {
    if (i_56136 < n__4508__auto___56135) {
      new_arr[i_56136] = arr[i_56136];
      var G__56137 = i_56136 + 1;
      i_56136 = G__56137;
      continue;
    } else {
    }
    break;
  }
  return new_arr;
};
cljs.core.array = function array(var_args) {
  return Array.prototype.slice.call(arguments);
};
cljs.core.aget = function() {
  var aget = null;
  var aget__2 = function(array, i) {
    return array[i];
  };
  var aget__3 = function() {
    var G__56138__delegate = function(array, i, idxs) {
      return cljs.core.apply.call(null, aget, aget.call(null, array, i), idxs);
    };
    var G__56138 = function(array, i, var_args) {
      var idxs = null;
      if (arguments.length > 2) {
        idxs = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0);
      }
      return G__56138__delegate.call(this, array, i, idxs);
    };
    G__56138.cljs$lang$maxFixedArity = 2;
    G__56138.cljs$lang$applyTo = function(arglist__56139) {
      var array = cljs.core.first(arglist__56139);
      arglist__56139 = cljs.core.next(arglist__56139);
      var i = cljs.core.first(arglist__56139);
      var idxs = cljs.core.rest(arglist__56139);
      return G__56138__delegate(array, i, idxs);
    };
    G__56138.cljs$core$IFn$_invoke$arity$variadic = G__56138__delegate;
    return G__56138;
  }();
  aget = function(array, i, var_args) {
    var idxs = var_args;
    switch(arguments.length) {
      case 2:
        return aget__2.call(this, array, i);
      default:
        return aget__3.cljs$core$IFn$_invoke$arity$variadic(array, i, cljs.core.array_seq(arguments, 2));
    }
    throw new Error("Invalid arity: " + arguments.length);
  };
  aget.cljs$lang$maxFixedArity = 2;
  aget.cljs$lang$applyTo = aget__3.cljs$lang$applyTo;
  aget.cljs$core$IFn$_invoke$arity$2 = aget__2;
  aget.cljs$core$IFn$_invoke$arity$variadic = aget__3.cljs$core$IFn$_invoke$arity$variadic;
  return aget;
}();
cljs.core.aset = function() {
  var aset = null;
  var aset__3 = function(array, i, val) {
    return array[i] = val;
  };
  var aset__4 = function() {
    var G__56140__delegate = function(array, idx, idx2, idxv) {
      return cljs.core.apply.call(null, aset, array[idx], idx2, idxv);
    };
    var G__56140 = function(array, idx, idx2, var_args) {
      var idxv = null;
      if (arguments.length > 3) {
        idxv = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0);
      }
      return G__56140__delegate.call(this, array, idx, idx2, idxv);
    };
    G__56140.cljs$lang$maxFixedArity = 3;
    G__56140.cljs$lang$applyTo = function(arglist__56141) {
      var array = cljs.core.first(arglist__56141);
      arglist__56141 = cljs.core.next(arglist__56141);
      var idx = cljs.core.first(arglist__56141);
      arglist__56141 = cljs.core.next(arglist__56141);
      var idx2 = cljs.core.first(arglist__56141);
      var idxv = cljs.core.rest(arglist__56141);
      return G__56140__delegate(array, idx, idx2, idxv);
    };
    G__56140.cljs$core$IFn$_invoke$arity$variadic = G__56140__delegate;
    return G__56140;
  }();
  aset = function(array, idx, idx2, var_args) {
    var idxv = var_args;
    switch(arguments.length) {
      case 3:
        return aset__3.call(this, array, idx, idx2);
      default:
        return aset__4.cljs$core$IFn$_invoke$arity$variadic(array, idx, idx2, cljs.core.array_seq(arguments, 3));
    }
    throw new Error("Invalid arity: " + arguments.length);
  };
  aset.cljs$lang$maxFixedArity = 3;
  aset.cljs$lang$applyTo = aset__4.cljs$lang$applyTo;
  aset.cljs$core$IFn$_invoke$arity$3 = aset__3;
  aset.cljs$core$IFn$_invoke$arity$variadic = aset__4.cljs$core$IFn$_invoke$arity$variadic;
  return aset;
}();
cljs.core.alength = function alength(array) {
  return array.length;
};
cljs.core.into_array = function() {
  var into_array = null;
  var into_array__1 = function(aseq) {
    return into_array.call(null, null, aseq);
  };
  var into_array__2 = function(type, aseq) {
    return cljs.core.reduce.call(null, function(a, x) {
      a.push(x);
      return a;
    }, [], aseq);
  };
  into_array = function(type, aseq) {
    switch(arguments.length) {
      case 1:
        return into_array__1.call(this, type);
      case 2:
        return into_array__2.call(this, type, aseq);
    }
    throw new Error("Invalid arity: " + arguments.length);
  };
  into_array.cljs$core$IFn$_invoke$arity$1 = into_array__1;
  into_array.cljs$core$IFn$_invoke$arity$2 = into_array__2;
  return into_array;
}();
cljs.core.Fn = function() {
  var obj56143 = {};
  return obj56143;
}();
cljs.core.IFn = function() {
  var obj56145 = {};
  return obj56145;
}();
cljs.core._invoke = function() {
  var _invoke = null;
  var _invoke__1 = function(this$) {
    if (function() {
      var and__3627__auto__ = this$;
      if (and__3627__auto__) {
        return this$.cljs$core$IFn$_invoke$arity$1;
      } else {
        return and__3627__auto__;
      }
    }()) {
      return this$.cljs$core$IFn$_invoke$arity$1(this$);
    } else {
      var x__4275__auto__ = this$ == null ? null : this$;
      return function() {
        var or__3639__auto__ = cljs.core._invoke[goog.typeOf(x__4275__auto__)];
        if (or__3639__auto__) {
          return or__3639__auto__;
        } else {
          var or__3639__auto____$1 = cljs.core._invoke["_"];
          if (or__3639__auto____$1) {
            return or__3639__auto____$1;
          } else {
            throw cljs.core.missing_protocol.call(null, "IFn.-invoke", this$);
          }
        }
      }().call(null, this$);
    }
  };
  var _invoke__2 = function(this$, a) {
    if (function() {
      var and__3627__auto__ = this$;
      if (and__3627__auto__) {
        return this$.cljs$core$IFn$_invoke$arity$2;
      } else {
        return and__3627__auto__;
      }
    }()) {
      return this$.cljs$core$IFn$_invoke$arity$2(this$, a);
    } else {
      var x__4275__auto__ = this$ == null ? null : this$;
      return function() {
        var or__3639__auto__ = cljs.core._invoke[goog.typeOf(x__4275__auto__)];
        if (or__3639__auto__) {
          return or__3639__auto__;
        } else {
          var or__3639__auto____$1 = cljs.core._invoke["_"];
          if (or__3639__auto____$1) {
            return or__3639__auto____$1;
          } else {
            throw cljs.core.missing_protocol.call(null, "IFn.-invoke", this$);
          }
        }
      }().call(null, this$, a);
    }
  };
  var _invoke__3 = function(this$, a, b) {
    if (function() {
      var and__3627__auto__ = this$;
      if (and__3627__auto__) {
        return this$.cljs$core$IFn$_invoke$arity$3;
      } else {
        return and__3627__auto__;
      }
    }()) {
      return this$.cljs$core$IFn$_invoke$arity$3(this$, a, b);
    } else {
      var x__4275__auto__ = this$ == null ? null : this$;
      return function() {
        var or__3639__auto__ = cljs.core._invoke[goog.typeOf(x__4275__auto__)];
        if (or__3639__auto__) {
          return or__3639__auto__;
        } else {
          var or__3639__auto____$1 = cljs.core._invoke["_"];
          if (or__3639__auto____$1) {
            return or__3639__auto____$1;
          } else {
            throw cljs.core.missing_protocol.call(null, "IFn.-invoke", this$);
          }
        }
      }().call(null, this$, a, b);
    }
  };
  var _invoke__4 = function(this$, a, b, c) {
    if (function() {
      var and__3627__auto__ = this$;
      if (and__3627__auto__) {
        return this$.cljs$core$IFn$_invoke$arity$4;
      } else {
        return and__3627__auto__;
      }
    }()) {
      return this$.cljs$core$IFn$_invoke$arity$4(this$, a, b, c);
    } else {
      var x__4275__auto__ = this$ == null ? null : this$;
      return function() {
        var or__3639__auto__ = cljs.core._invoke[goog.typeOf(x__4275__auto__)];
        if (or__3639__auto__) {
          return or__3639__auto__;
        } else {
          var or__3639__auto____$1 = cljs.core._invoke["_"];
          if (or__3639__auto____$1) {
            return or__3639__auto____$1;
          } else {
            throw cljs.core.missing_protocol.call(null, "IFn.-invoke", this$);
          }
        }
      }().call(null, this$, a, b, c);
    }
  };
  var _invoke__5 = function(this$, a, b, c, d) {
    if (function() {
      var and__3627__auto__ = this$;
      if (and__3627__auto__) {
        return this$.cljs$core$IFn$_invoke$arity$5;
      } else {
        return and__3627__auto__;
      }
    }()) {
      return this$.cljs$core$IFn$_invoke$arity$5(this$, a, b, c, d);
    } else {
      var x__4275__auto__ = this$ == null ? null : this$;
      return function() {
        var or__3639__auto__ = cljs.core._invoke[goog.typeOf(x__4275__auto__)];
        if (or__3639__auto__) {
          return or__3639__auto__;
        } else {
          var or__3639__auto____$1 = cljs.core._invoke["_"];
          if (or__3639__auto____$1) {
            return or__3639__auto____$1;
          } else {
            throw cljs.core.missing_protocol.call(null, "IFn.-invoke", this$);
          }
        }
      }().call(null, this$, a, b, c, d);
    }
  };
  var _invoke__6 = function(this$, a, b, c, d, e) {
    if (function() {
      var and__3627__auto__ = this$;
      if (and__3627__auto__) {
        return this$.cljs$core$IFn$_invoke$arity$6;
      } else {
        return and__3627__auto__;
      }
    }()) {
      return this$.cljs$core$IFn$_invoke$arity$6(this$, a, b, c, d, e);
    } else {
      var x__4275__auto__ = this$ == null ? null : this$;
      return function() {
        var or__3639__auto__ = cljs.core._invoke[goog.typeOf(x__4275__auto__)];
        if (or__3639__auto__) {
          return or__3639__auto__;
        } else {
          var or__3639__auto____$1 = cljs.core._invoke["_"];
          if (or__3639__auto____$1) {
            return or__3639__auto____$1;
          } else {
            throw cljs.core.missing_protocol.call(null, "IFn.-invoke", this$);
          }
        }
      }().call(null, this$, a, b, c, d, e);
    }
  };
  var _invoke__7 = function(this$, a, b, c, d, e, f) {
    if (function() {
      var and__3627__auto__ = this$;
      if (and__3627__auto__) {
        return this$.cljs$core$IFn$_invoke$arity$7;
      } else {
        return and__3627__auto__;
      }
    }()) {
      return this$.cljs$core$IFn$_invoke$arity$7(this$, a, b, c, d, e, f);
    } else {
      var x__4275__auto__ = this$ == null ? null : this$;
      return function() {
        var or__3639__auto__ = cljs.core._invoke[goog.typeOf(x__4275__auto__)];
        if (or__3639__auto__) {
          return or__3639__auto__;
        } else {
          var or__3639__auto____$1 = cljs.core._invoke["_"];
          if (or__3639__auto____$1) {
            return or__3639__auto____$1;
          } else {
            throw cljs.core.missing_protocol.call(null, "IFn.-invoke", this$);
          }
        }
      }().call(null, this$, a, b, c, d, e, f);
    }
  };
  var _invoke__8 = function(this$, a, b, c, d, e, f, g) {
    if (function() {
      var and__3627__auto__ = this$;
      if (and__3627__auto__) {
        return this$.cljs$core$IFn$_invoke$arity$8;
      } else {
        return and__3627__auto__;
      }
    }()) {
      return this$.cljs$core$IFn$_invoke$arity$8(this$, a, b, c, d, e, f, g);
    } else {
      var x__4275__auto__ = this$ == null ? null : this$;
      return function() {
        var or__3639__auto__ = cljs.core._invoke[goog.typeOf(x__4275__auto__)];
        if (or__3639__auto__) {
          return or__3639__auto__;
        } else {
          var or__3639__auto____$1 = cljs.core._invoke["_"];
          if (or__3639__auto____$1) {
            return or__3639__auto____$1;
          } else {
            throw cljs.core.missing_protocol.call(null, "IFn.-invoke", this$);
          }
        }
      }().call(null, this$, a, b, c, d, e, f, g);
    }
  };
  var _invoke__9 = function(this$, a, b, c, d, e, f, g, h) {
    if (function() {
      var and__3627__auto__ = this$;
      if (and__3627__auto__) {
        return this$.cljs$core$IFn$_invoke$arity$9;
      } else {
        return and__3627__auto__;
      }
    }()) {
      return this$.cljs$core$IFn$_invoke$arity$9(this$, a, b, c, d, e, f, g, h);
    } else {
      var x__4275__auto__ = this$ == null ? null : this$;
      return function() {
        var or__3639__auto__ = cljs.core._invoke[goog.typeOf(x__4275__auto__)];
        if (or__3639__auto__) {
          return or__3639__auto__;
        } else {
          var or__3639__auto____$1 = cljs.core._invoke["_"];
          if (or__3639__auto____$1) {
            return or__3639__auto____$1;
          } else {
            throw cljs.core.missing_protocol.call(null, "IFn.-invoke", this$);
          }
        }
      }().call(null, this$, a, b, c, d, e, f, g, h);
    }
  };
  var _invoke__10 = function(this$, a, b, c, d, e, f, g, h, i) {
    if (function() {
      var and__3627__auto__ = this$;
      if (and__3627__auto__) {
        return this$.cljs$core$IFn$_invoke$arity$10;
      } else {
        return and__3627__auto__;
      }
    }()) {
      return this$.cljs$core$IFn$_invoke$arity$10(this$, a, b, c, d, e, f, g, h, i);
    } else {
      var x__4275__auto__ = this$ == null ? null : this$;
      return function() {
        var or__3639__auto__ = cljs.core._invoke[goog.typeOf(x__4275__auto__)];
        if (or__3639__auto__) {
          return or__3639__auto__;
        } else {
          var or__3639__auto____$1 = cljs.core._invoke["_"];
          if (or__3639__auto____$1) {
            return or__3639__auto____$1;
          } else {
            throw cljs.core.missing_protocol.call(null, "IFn.-invoke", this$);
          }
        }
      }().call(null, this$, a, b, c, d, e, f, g, h, i);
    }
  };
  var _invoke__11 = function(this$, a, b, c, d, e, f, g, h, i, j) {
    if (function() {
      var and__3627__auto__ = this$;
      if (and__3627__auto__) {
        return this$.cljs$core$IFn$_invoke$arity$11;
      } else {
        return and__3627__auto__;
      }
    }()) {
      return this$.cljs$core$IFn$_invoke$arity$11(this$, a, b, c, d, e, f, g, h, i, j);
    } else {
      var x__4275__auto__ = this$ == null ? null : this$;
      return function() {
        var or__3639__auto__ = cljs.core._invoke[goog.typeOf(x__4275__auto__)];
        if (or__3639__auto__) {
          return or__3639__auto__;
        } else {
          var or__3639__auto____$1 = cljs.core._invoke["_"];
          if (or__3639__auto____$1) {
            return or__3639__auto____$1;
          } else {
            throw cljs.core.missing_protocol.call(null, "IFn.-invoke", this$);
          }
        }
      }().call(null, this$, a, b, c, d, e, f, g, h, i, j);
    }
  };
  var _invoke__12 = function(this$, a, b, c, d, e, f, g, h, i, j, k) {
    if (function() {
      var and__3627__auto__ = this$;
      if (and__3627__auto__) {
        return this$.cljs$core$IFn$_invoke$arity$12;
      } else {
        return and__3627__auto__;
      }
    }()) {
      return this$.cljs$core$IFn$_invoke$arity$12(this$, a, b, c, d, e, f, g, h, i, j, k);
    } else {
      var x__4275__auto__ = this$ == null ? null : this$;
      return function() {
        var or__3639__auto__ = cljs.core._invoke[goog.typeOf(x__4275__auto__)];
        if (or__3639__auto__) {
          return or__3639__auto__;
        } else {
          var or__3639__auto____$1 = cljs.core._invoke["_"];
          if (or__3639__auto____$1) {
            return or__3639__auto____$1;
          } else {
            throw cljs.core.missing_protocol.call(null, "IFn.-invoke", this$);
          }
        }
      }().call(null, this$, a, b, c, d, e, f, g, h, i, j, k);
    }
  };
  var _invoke__13 = function(this$, a, b, c, d, e, f, g, h, i, j, k, l) {
    if (function() {
      var and__3627__auto__ = this$;
      if (and__3627__auto__) {
        return this$.cljs$core$IFn$_invoke$arity$13;
      } else {
        return and__3627__auto__;
      }
    }()) {
      return this$.cljs$core$IFn$_invoke$arity$13(this$, a, b, c, d, e, f, g, h, i, j, k, l);
    } else {
      var x__4275__auto__ = this$ == null ? null : this$;
      return function() {
        var or__3639__auto__ = cljs.core._invoke[goog.typeOf(x__4275__auto__)];
        if (or__3639__auto__) {
          return or__3639__auto__;
        } else {
          var or__3639__auto____$1 = cljs.core._invoke["_"];
          if (or__3639__auto____$1) {
            return or__3639__auto____$1;
          } else {
            throw cljs.core.missing_protocol.call(null, "IFn.-invoke", this$);
          }
        }
      }().call(null, this$, a, b, c, d, e, f, g, h, i, j, k, l);
    }
  };
  var _invoke__14 = function(this$, a, b, c, d, e, f, g, h, i, j, k, l, m) {
    if (function() {
      var and__3627__auto__ = this$;
      if (and__3627__auto__) {
        return this$.cljs$core$IFn$_invoke$arity$14;
      } else {
        return and__3627__auto__;
      }
    }()) {
      return this$.cljs$core$IFn$_invoke$arity$14(this$, a, b, c, d, e, f, g, h, i, j, k, l, m);
    } else {
      var x__4275__auto__ = this$ == null ? null : this$;
      return function() {
        var or__3639__auto__ = cljs.core._invoke[goog.typeOf(x__4275__auto__)];
        if (or__3639__auto__) {
          return or__3639__auto__;
        } else {
          var or__3639__auto____$1 = cljs.core._invoke["_"];
          if (or__3639__auto____$1) {
            return or__3639__auto____$1;
          } else {
            throw cljs.core.missing_protocol.call(null, "IFn.-invoke", this$);
          }
        }
      }().call(null, this$, a, b, c, d, e, f, g, h, i, j, k, l, m);
    }
  };
  var _invoke__15 = function(this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n) {
    if (function() {
      var and__3627__auto__ = this$;
      if (and__3627__auto__) {
        return this$.cljs$core$IFn$_invoke$arity$15;
      } else {
        return and__3627__auto__;
      }
    }()) {
      return this$.cljs$core$IFn$_invoke$arity$15(this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n);
    } else {
      var x__4275__auto__ = this$ == null ? null : this$;
      return function() {
        var or__3639__auto__ = cljs.core._invoke[goog.typeOf(x__4275__auto__)];
        if (or__3639__auto__) {
          return or__3639__auto__;
        } else {
          var or__3639__auto____$1 = cljs.core._invoke["_"];
          if (or__3639__auto____$1) {
            return or__3639__auto____$1;
          } else {
            throw cljs.core.missing_protocol.call(null, "IFn.-invoke", this$);
          }
        }
      }().call(null, this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n);
    }
  };
  var _invoke__16 = function(this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o) {
    if (function() {
      var and__3627__auto__ = this$;
      if (and__3627__auto__) {
        return this$.cljs$core$IFn$_invoke$arity$16;
      } else {
        return and__3627__auto__;
      }
    }()) {
      return this$.cljs$core$IFn$_invoke$arity$16(this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o);
    } else {
      var x__4275__auto__ = this$ == null ? null : this$;
      return function() {
        var or__3639__auto__ = cljs.core._invoke[goog.typeOf(x__4275__auto__)];
        if (or__3639__auto__) {
          return or__3639__auto__;
        } else {
          var or__3639__auto____$1 = cljs.core._invoke["_"];
          if (or__3639__auto____$1) {
            return or__3639__auto____$1;
          } else {
            throw cljs.core.missing_protocol.call(null, "IFn.-invoke", this$);
          }
        }
      }().call(null, this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o);
    }
  };
  var _invoke__17 = function(this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p) {
    if (function() {
      var and__3627__auto__ = this$;
      if (and__3627__auto__) {
        return this$.cljs$core$IFn$_invoke$arity$17;
      } else {
        return and__3627__auto__;
      }
    }()) {
      return this$.cljs$core$IFn$_invoke$arity$17(this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p);
    } else {
      var x__4275__auto__ = this$ == null ? null : this$;
      return function() {
        var or__3639__auto__ = cljs.core._invoke[goog.typeOf(x__4275__auto__)];
        if (or__3639__auto__) {
          return or__3639__auto__;
        } else {
          var or__3639__auto____$1 = cljs.core._invoke["_"];
          if (or__3639__auto____$1) {
            return or__3639__auto____$1;
          } else {
            throw cljs.core.missing_protocol.call(null, "IFn.-invoke", this$);
          }
        }
      }().call(null, this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p);
    }
  };
  var _invoke__18 = function(this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q) {
    if (function() {
      var and__3627__auto__ = this$;
      if (and__3627__auto__) {
        return this$.cljs$core$IFn$_invoke$arity$18;
      } else {
        return and__3627__auto__;
      }
    }()) {
      return this$.cljs$core$IFn$_invoke$arity$18(this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q);
    } else {
      var x__4275__auto__ = this$ == null ? null : this$;
      return function() {
        var or__3639__auto__ = cljs.core._invoke[goog.typeOf(x__4275__auto__)];
        if (or__3639__auto__) {
          return or__3639__auto__;
        } else {
          var or__3639__auto____$1 = cljs.core._invoke["_"];
          if (or__3639__auto____$1) {
            return or__3639__auto____$1;
          } else {
            throw cljs.core.missing_protocol.call(null, "IFn.-invoke", this$);
          }
        }
      }().call(null, this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q);
    }
  };
  var _invoke__19 = function(this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r) {
    if (function() {
      var and__3627__auto__ = this$;
      if (and__3627__auto__) {
        return this$.cljs$core$IFn$_invoke$arity$19;
      } else {
        return and__3627__auto__;
      }
    }()) {
      return this$.cljs$core$IFn$_invoke$arity$19(this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r);
    } else {
      var x__4275__auto__ = this$ == null ? null : this$;
      return function() {
        var or__3639__auto__ = cljs.core._invoke[goog.typeOf(x__4275__auto__)];
        if (or__3639__auto__) {
          return or__3639__auto__;
        } else {
          var or__3639__auto____$1 = cljs.core._invoke["_"];
          if (or__3639__auto____$1) {
            return or__3639__auto____$1;
          } else {
            throw cljs.core.missing_protocol.call(null, "IFn.-invoke", this$);
          }
        }
      }().call(null, this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r);
    }
  };
  var _invoke__20 = function(this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s) {
    if (function() {
      var and__3627__auto__ = this$;
      if (and__3627__auto__) {
        return this$.cljs$core$IFn$_invoke$arity$20;
      } else {
        return and__3627__auto__;
      }
    }()) {
      return this$.cljs$core$IFn$_invoke$arity$20(this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s);
    } else {
      var x__4275__auto__ = this$ == null ? null : this$;
      return function() {
        var or__3639__auto__ = cljs.core._invoke[goog.typeOf(x__4275__auto__)];
        if (or__3639__auto__) {
          return or__3639__auto__;
        } else {
          var or__3639__auto____$1 = cljs.core._invoke["_"];
          if (or__3639__auto____$1) {
            return or__3639__auto____$1;
          } else {
            throw cljs.core.missing_protocol.call(null, "IFn.-invoke", this$);
          }
        }
      }().call(null, this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s);
    }
  };
  var _invoke__21 = function(this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t) {
    if (function() {
      var and__3627__auto__ = this$;
      if (and__3627__auto__) {
        return this$.cljs$core$IFn$_invoke$arity$21;
      } else {
        return and__3627__auto__;
      }
    }()) {
      return this$.cljs$core$IFn$_invoke$arity$21(this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t);
    } else {
      var x__4275__auto__ = this$ == null ? null : this$;
      return function() {
        var or__3639__auto__ = cljs.core._invoke[goog.typeOf(x__4275__auto__)];
        if (or__3639__auto__) {
          return or__3639__auto__;
        } else {
          var or__3639__auto____$1 = cljs.core._invoke["_"];
          if (or__3639__auto____$1) {
            return or__3639__auto____$1;
          } else {
            throw cljs.core.missing_protocol.call(null, "IFn.-invoke", this$);
          }
        }
      }().call(null, this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t);
    }
  };
  var _invoke__22 = function(this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, rest) {
    if (function() {
      var and__3627__auto__ = this$;
      if (and__3627__auto__) {
        return this$.cljs$core$IFn$_invoke$arity$22;
      } else {
        return and__3627__auto__;
      }
    }()) {
      return this$.cljs$core$IFn$_invoke$arity$22(this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, rest);
    } else {
      var x__4275__auto__ = this$ == null ? null : this$;
      return function() {
        var or__3639__auto__ = cljs.core._invoke[goog.typeOf(x__4275__auto__)];
        if (or__3639__auto__) {
          return or__3639__auto__;
        } else {
          var or__3639__auto____$1 = cljs.core._invoke["_"];
          if (or__3639__auto____$1) {
            return or__3639__auto____$1;
          } else {
            throw cljs.core.missing_protocol.call(null, "IFn.-invoke", this$);
          }
        }
      }().call(null, this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, rest);
    }
  };
  _invoke = function(this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, rest) {
    switch(arguments.length) {
      case 1:
        return _invoke__1.call(this, this$);
      case 2:
        return _invoke__2.call(this, this$, a);
      case 3:
        return _invoke__3.call(this, this$, a, b);
      case 4:
        return _invoke__4.call(this, this$, a, b, c);
      case 5:
        return _invoke__5.call(this, this$, a, b, c, d);
      case 6:
        return _invoke__6.call(this, this$, a, b, c, d, e);
      case 7:
        return _invoke__7.call(this, this$, a, b, c, d, e, f);
      case 8:
        return _invoke__8.call(this, this$, a, b, c, d, e, f, g);
      case 9:
        return _invoke__9.call(this, this$, a, b, c, d, e, f, g, h);
      case 10:
        return _invoke__10.call(this, this$, a, b, c, d, e, f, g, h, i);
      case 11:
        return _invoke__11.call(this, this$, a, b, c, d, e, f, g, h, i, j);
      case 12:
        return _invoke__12.call(this, this$, a, b, c, d, e, f, g, h, i, j, k);
      case 13:
        return _invoke__13.call(this, this$, a, b, c, d, e, f, g, h, i, j, k, l);
      case 14:
        return _invoke__14.call(this, this$, a, b, c, d, e, f, g, h, i, j, k, l, m);
      case 15:
        return _invoke__15.call(this, this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n);
      case 16:
        return _invoke__16.call(this, this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o);
      case 17:
        return _invoke__17.call(this, this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p);
      case 18:
        return _invoke__18.call(this, this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q);
      case 19:
        return _invoke__19.call(this, this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r);
      case 20:
        return _invoke__20.call(this, this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s);
      case 21:
        return _invoke__21.call(this, this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t);
      case 22:
        return _invoke__22.call(this, this$, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, rest);
    }
    throw new Error("Invalid arity: " + arguments.length);
  };
  _invoke.cljs$core$IFn$_invoke$arity$1 = _invoke__1;
  _invoke.cljs$core$IFn$_invoke$arity$2 = _invoke__2;
  _invoke.cljs$core$IFn$_invoke$arity$3 = _invoke__3;
  _invoke.cljs$core$IFn$_invoke$arity$4 = _invoke__4;
  _invoke.cljs$core$IFn$_invoke$arity$5 = _invoke__5;
  _invoke.cljs$core$IFn$_invoke$arity$6 = _invoke__6;
  _invoke.cljs$core$IFn$_invoke$arity$7 = _invoke__7;
  _invoke.cljs$core$IFn$_invoke$arity$8 = _invoke__8;
  _invoke.cljs$core$IFn$_invoke$arity$9 = _invoke__9;
  _invoke.cljs$core$IFn$_invoke$arity$10 = _invoke__10;
  _invoke.cljs$core$IFn$_invoke$arity$11 = _invoke__11;
  _invoke.cljs$core$IFn$_invoke$arity$12 = _invoke__12;
  _invoke.cljs$core$IFn$_invoke$arity$13 = _invoke__13;
  _invoke.cljs$core$IFn$_invoke$arity$14 = _invoke__14;
  _invoke.cljs$core$IFn$_invoke$arity$15 = _invoke__15;
  _invoke.cljs$core$IFn$_invoke$arity$16 = _invoke__16;
  _invoke.cljs$core$IFn$_invoke$arity$17 = _invoke__17;
  _invoke.cljs$core$IFn$_invoke$arity$18 = _invoke__18;
  _invoke.cljs$core$IFn$_invoke$arity$19 = _invoke__19;
  _invoke.cljs$core$IFn$_invoke$arity$20 = _invoke__20;
  _invoke.cljs$core$IFn$_invoke$arity$21 = _invoke__21;
  _invoke.cljs$core$IFn$_invoke$arity$22 = _invoke__22;
  return _invoke;
}();
cljs.core.ICloneable = function() {
  var obj56147 = {};
  return obj56147;
}();
cljs.core._clone = function _clone(value) {
  if (function() {
    var and__3627__auto__ = value;
    if (and__3627__auto__) {
      return value.cljs$core$ICloneable$_clone$arity$1;
    } else {
      return and__3627__auto__;
    }
  }()) {
    return value.cljs$core$ICloneable$_clone$arity$1(value);
  } else {
    var x__4275__auto__ = value == null ? null : value;
    return function() {
      var or__3639__auto__ = cljs.core._clone[goog.typeOf(x__4275__auto__)];
      if (or__3639__auto__) {
        return or__3639__auto__;
      } else {
        var or__3639__auto____$1 = cljs.core._clone["_"];
        if (or__3639__auto____$1) {
          return or__3639__auto____$1;
        } else {
          throw cljs.core.missing_protocol.call(null, "ICloneable.-clone", value);
        }
      }
    }().call(null, value);
  }
};
cljs.core.ICounted = function() {
  var obj56149 = {};
  return obj56149;
}();
cljs.core._count = function _count(coll) {
  if (function() {
    var and__3627__auto__ = coll;
    if (and__3627__auto__) {
      return coll.cljs$core$ICounted$_count$arity$1;
    } else {
      return and__3627__auto__;
    }
  }()) {
    return coll.cljs$core$ICounted$_count$arity$1(coll);
  } else {
    var x__4275__auto__ = coll == null ? null : coll;
    return function() {
      var or__3639__auto__ = cljs.core._count[goog.typeOf(x__4275__auto__)];
      if (or__3639__auto__) {
        return or__3639__auto__;
      } else {
        var or__3639__auto____$1 = cljs.core._count["_"];
        if (or__3639__auto____$1) {
          return or__3639__auto____$1;
        } else {
          throw cljs.core.missing_protocol.call(null, "ICounted.-count", coll);
        }
      }
    }().call(null, coll);
  }
};
cljs.core.IEmptyableCollection = function() {
  var obj56151 = {};
  return obj56151;
}();
cljs.core._empty = function _empty(coll) {
  if (function() {
    var and__3627__auto__ = coll;
    if (and__3627__auto__) {
      return coll.cljs$core$IEmptyableCollection$_empty$arity$1;
    } else {
      return and__3627__auto__;
    }
  }()) {
    return coll.cljs$core$IEmptyableCollection$_empty$arity$1(coll);
  } else {
    var x__4275__auto__ = coll == null ? null : coll;
    return function() {
      var or__3639__auto__ = cljs.core._empty[goog.typeOf(x__4275__auto__)];
      if (or__3639__auto__) {
        return or__3639__auto__;
      } else {
        var or__3639__auto____$1 = cljs.core._empty["_"];
        if (or__3639__auto____$1) {
          return or__3639__auto____$1;
        } else {
          throw cljs.core.missing_protocol.call(null, "IEmptyableCollection.-empty", coll);
        }
      }
    }().call(null, coll);
  }
};
cljs.core.ICollection = function() {
  var obj56153 = {};
  return obj56153;
}();
cljs.core._conj = function _conj(coll, o) {
  if (function() {
    var and__3627__auto__ = coll;
    if (and__3627__auto__) {
      return coll.cljs$core$ICollection$_conj$arity$2;
    } else {
      return and__3627__auto__;
    }
  }()) {
    return coll.cljs$core$ICollection$_conj$arity$2(coll, o);
  } else {
    var x__4275__auto__ = coll == null ? null : coll;
    return function() {
      var or__3639__auto__ = cljs.core._conj[goog.typeOf(x__4275__auto__)];
      if (or__3639__auto__) {
        return or__3639__auto__;
      } else {
        var or__3639__auto____$1 = cljs.core._conj["_"];
        if (or__3639__auto____$1) {
          return or__3639__auto____$1;
        } else {
          throw cljs.core.missing_protocol.call(null, "ICollection.-conj", coll);
        }
      }
    }().call(null, coll, o);
  }
};
cljs.core.IIndexed = function() {
  var obj56155 = {};
  return obj56155;
}();
cljs.core._nth = function() {
  var _nth = null;
  var _nth__2 = function(coll, n) {
    if (function() {
      var and__3627__auto__ = coll;
      if (and__3627__auto__) {
        return coll.cljs$core$IIndexed$_nth$arity$2;
      } else {
        return and__3627__auto__;
      }
    }()) {
      return coll.cljs$core$IIndexed$_nth$arity$2(coll, n);
    } else {
      var x__4275__auto__ = coll == null ? null : coll;
      return function() {
        var or__3639__auto__ = cljs.core._nth[goog.typeOf(x__4275__auto__)];
        if (or__3639__auto__) {
          return or__3639__auto__;
        } else {
          var or__3639__auto____$1 = cljs.core._nth["_"];
          if (or__3639__auto____$1) {
            return or__3639__auto____$1;
          } else {
            throw cljs.core.missing_protocol.call(null, "IIndexed.-nth", coll);
          }
        }
      }().call(null, coll, n);
    }
  };
  var _nth__3 = function(coll, n, not_found) {
    if (function() {
      var and__3627__auto__ = coll;
      if (and__3627__auto__) {
        return coll.cljs$core$IIndexed$_nth$arity$3;
      } else {
        return and__3627__auto__;
      }
    }()) {
      return coll.cljs$core$IIndexed$_nth$arity$3(coll, n, not_found);
    } else {
      var x__4275__auto__ = coll == null ? null : coll;
      return function() {
        var or__3639__auto__ = cljs.core._nth[goog.typeOf(x__4275__auto__)];
        if (or__3639__auto__) {
          return or__3639__auto__;
        } else {
          var or__3639__auto____$1 = cljs.core._nth["_"];
          if (or__3639__auto____$1) {
            return or__3639__auto____$1;
          } else {
            throw cljs.core.missing_protocol.call(null, "IIndexed.-nth", coll);
          }
        }
      }().call(null, coll, n, not_found);
    }
  };
  _nth = function(coll, n, not_found) {
    switch(arguments.length) {
      case 2:
        return _nth__2.call(this, coll, n);
      case 3:
        return _nth__3.call(this, coll, n, not_found);
    }
    throw new Error("Invalid arity: " + arguments.length);
  };
  _nth.cljs$core$IFn$_invoke$arity$2 = _nth__2;
  _nth.cljs$core$IFn$_invoke$arity$3 = _nth__3;
  return _nth;
}();
cljs.core.ASeq = function() {
  var obj56157 = {};
  return obj56157;
}();
cljs.core.ISeq = function() {
  var obj56159 = {};
  return obj56159;
}();
cljs.core._first = function _first(coll) {
  if (function() {
    var and__3627__auto__ = coll;
    if (and__3627__auto__) {
      return coll.cljs$core$ISeq$_first$arity$1;
    } else {
      return and__3627__auto__;
    }
  }()) {
    return coll.cljs$core$ISeq$_first$arity$1(coll);
  } else {
    var x__4275__auto__ = coll == null ? null : coll;
    return function() {
      var or__3639__auto__ = cljs.core._first[goog.typeOf(x__4275__auto__)];
      if (or__3639__auto__) {
        return or__3639__auto__;
      } else {
        var or__3639__auto____$1 = cljs.core._first["_"];
        if (or__3639__auto____$1) {
          return or__3639__auto____$1;
        } else {
          throw cljs.core.missing_protocol.call(null, "ISeq.-first", coll);
        }
      }
    }().call(null, coll);
  }
};
cljs.core._rest = function _rest(coll) {
  if (function() {
    var and__3627__auto__ = coll;
    if (and__3627__auto__) {
      return coll.cljs$core$ISeq$_rest$arity$1;
    } else {
      return and__3627__auto__;
    }
  }()) {
    return coll.cljs$core$ISeq$_rest$arity$1(coll);
  } else {
    var x__4275__auto__ = coll == null ? null : coll;
    return function() {
      var or__3639__auto__ = cljs.core._rest[goog.typeOf(x__4275__auto__)];
      if (or__3639__auto__) {
        return or__3639__auto__;
      } else {
        var or__3639__auto____$1 = cljs.core._rest["_"];
        if (or__3639__auto____$1) {
          return or__3639__auto____$1;
        } else {
          throw cljs.core.missing_protocol.call(null, "ISeq.-rest", coll);
        }
      }
    }().call(null, coll);
  }
};
cljs.core.INext = function() {
  var obj56161 = {};
  return obj56161;
}();
cljs.core._next = function _next(coll) {
  if (function() {
    var and__3627__auto__ = coll;
    if (and__3627__auto__) {
      return coll.cljs$core$INext$_next$arity$1;
    } else {
      return and__3627__auto__;
    }
  }()) {
    return coll.cljs$core$INext$_next$arity$1(coll);
  } else {
    var x__4275__auto__ = coll == null ? null : coll;
    return function() {
      var or__3639__auto__ = cljs.core._next[goog.typeOf(x__4275__auto__)];
      if (or__3639__auto__) {
        return or__3639__auto__;
      } else {
        var or__3639__auto____$1 = cljs.core._next["_"];
        if (or__3639__auto____$1) {
          return or__3639__auto____$1;
        } else {
          throw cljs.core.missing_protocol.call(null, "INext.-next", coll);
        }
      }
    }().call(null, coll);
  }
};
cljs.core.ILookup = function() {
  var obj56163 = {};
  return obj56163;
}();
cljs.core._lookup = function() {
  var _lookup = null;
  var _lookup__2 = function(o, k) {
    if (function() {
      var and__3627__auto__ = o;
      if (and__3627__auto__) {
        return o.cljs$core$ILookup$_lookup$arity$2;
      } else {
        return and__3627__auto__;
      }
    }()) {
      return o.cljs$core$ILookup$_lookup$arity$2(o, k);
    } else {
      var x__4275__auto__ = o == null ? null : o;
      return function() {
        var or__3639__auto__ = cljs.core._lookup[goog.typeOf(x__4275__auto__)];
        if (or__3639__auto__) {
          return or__3639__auto__;
        } else {
          var or__3639__auto____$1 = cljs.core._lookup["_"];
          if (or__3639__auto____$1) {
            return or__3639__auto____$1;
          } else {
            throw cljs.core.missing_protocol.call(null, "ILookup.-lookup", o);
          }
        }
      }().call(null, o, k);
    }
  };
  var _lookup__3 = function(o, k, not_found) {
    if (function() {
      var and__3627__auto__ = o;
      if (and__3627__auto__) {
        return o.cljs$core$ILookup$_lookup$arity$3;
      } else {
        return and__3627__auto__;
      }
    }()) {
      return o.cljs$core$ILookup$_lookup$arity$3(o, k, not_found);
    } else {
      var x__4275__auto__ = o == null ? null : o;
      return function() {
        var or__3639__auto__ = cljs.core._lookup[goog.typeOf(x__4275__auto__)];
        if (or__3639__auto__) {
          return or__3639__auto__;
        } else {
          var or__3639__auto____$1 = cljs.core._lookup["_"];
          if (or__3639__auto____$1) {
            return or__3639__auto____$1;
          } else {
            throw cljs.core.missing_protocol.call(null, "ILookup.-lookup", o);
          }
        }
      }().call(null, o, k, not_found);
    }
  };
  _lookup = function(o, k, not_found) {
    switch(arguments.length) {
      case 2:
        return _lookup__2.call(this, o, k);
      case 3:
        return _lookup__3.call(this, o, k, not_found);
    }
    throw new Error("Invalid arity: " + arguments.length);
  };
  _lookup.cljs$core$IFn$_invoke$arity$2 = _lookup__2;
  _lookup.cljs$core$IFn$_invoke$arity$3 = _lookup__3;
  return _lookup;
}();
cljs.core.IAssociative = function() {
  var obj56165 = {};
  return obj56165;
}();
cljs.core._contains_key_QMARK_ = function _contains_key_QMARK_(coll, k) {
  if (function() {
    var and__3627__auto__ = coll;
    if (and__3627__auto__) {
      return coll.cljs$core$IAssociative$_contains_key_QMARK_$arity$2;
    } else {
      return and__3627__auto__;
    }
  }()) {
    return coll.cljs$core$IAssociative$_contains_key_QMARK_$arity$2(coll, k);
  } else {
    var x__4275__auto__ = coll == null ? null : coll;
    return function() {
      var or__3639__auto__ = cljs.core._contains_key_QMARK_[goog.typeOf(x__4275__auto__)];
      if (or__3639__auto__) {
        return or__3639__auto__;
      } else {
        var or__3639__auto____$1 = cljs.core._contains_key_QMARK_["_"];
        if (or__3639__auto____$1) {
          return or__3639__auto____$1;
        } else {
          throw cljs.core.missing_protocol.call(null, "IAssociative.-contains-key?", coll);
        }
      }
    }().call(null, coll, k);
  }
};
cljs.core._assoc = function _assoc(coll, k, v) {
  if (function() {
    var and__3627__auto__ = coll;
    if (and__3627__auto__) {
      return coll.cljs$core$IAssociative$_assoc$arity$3;
    } else {
      return and__3627__auto__;
    }
  }()) {
    return coll.cljs$core$IAssociative$_assoc$arity$3(coll, k, v);
  } else {
    var x__4275__auto__ = coll == null ? null : coll;
    return function() {
      var or__3639__auto__ = cljs.core._assoc[goog.typeOf(x__4275__auto__)];
      if (or__3639__auto__) {
        return or__3639__auto__;
      } else {
        var or__3639__auto____$1 = cljs.core._assoc["_"];
        if (or__3639__auto____$1) {
          return or__3639__auto____$1;
        } else {
          throw cljs.core.missing_protocol.call(null, "IAssociative.-assoc", coll);
        }
      }
    }().call(null, coll, k, v);
  }
};
cljs.core.IMap = function() {
  var obj56167 = {};
  return obj56167;
}();
cljs.core._dissoc = function _dissoc(coll, k) {
  if (function() {
    var and__3627__auto__ = coll;
    if (and__3627__auto__) {
      return coll.cljs$core$IMap$_dissoc$arity$2;
    } else {
      return and__3627__auto__;
    }
  }()) {
    return coll.cljs$core$IMap$_dissoc$arity$2(coll, k);
  } else {
    var x__4275__auto__ = coll == null ? null : coll;
    return function() {
      var or__3639__auto__ = cljs.core._dissoc[goog.typeOf(x__4275__auto__)];
      if (or__3639__auto__) {
        return or__3639__auto__;
      } else {
        var or__3639__auto____$1 = cljs.core._dissoc["_"];
        if (or__3639__auto____$1) {
          return or__3639__auto____$1;
        } else {
          throw cljs.core.missing_protocol.call(null, "IMap.-dissoc", coll);
        }
      }
    }().call(null, coll, k);
  }
};
cljs.core.IMapEntry = function() {
  var obj56169 = {};
  return obj56169;
}();
cljs.core._key = function _key(coll) {
  if (function() {
    var and__3627__auto__ = coll;
    if (and__3627__auto__) {
      return coll.cljs$core$IMapEntry$_key$arity$1;
    } else {
      return and__3627__auto__;
    }
  }()) {
    return coll.cljs$core$IMapEntry$_key$arity$1(coll);
  } else {
    var x__4275__auto__ = coll == null ? null : coll;
    return function() {
      var or__3639__auto__ = cljs.core._key[goog.typeOf(x__4275__auto__)];
      if (or__3639__auto__) {
        return or__3639__auto__;
      } else {
        var or__3639__auto____$1 = cljs.core._key["_"];
        if (or__3639__auto____$1) {
          return or__3639__auto____$1;
        } else {
          throw cljs.core.missing_protocol.call(null, "IMapEntry.-key", coll);
        }
      }
    }().call(null, coll);
  }
};
cljs.core._val = function _val(coll) {
  if (function() {
    var and__3627__auto__ = coll;
    if (and__3627__auto__) {
      return coll.cljs$core$IMapEntry$_val$arity$1;
    } else {
      return and__3627__auto__;
    }
  }()) {
    return coll.cljs$core$IMapEntry$_val$arity$1(coll);
  } else {
    var x__4275__auto__ = coll == null ? null : coll;
    return function() {
      var or__3639__auto__ = cljs.core._val[goog.typeOf(x__4275__auto__)];
      if (or__3639__auto__) {
        return or__3639__auto__;
      } else {
        var or__3639__auto____$1 = cljs.core._val["_"];
        if (or__3639__auto____$1) {
          return or__3639__auto____$1;
        } else {
          throw cljs.core.missing_protocol.call(null, "IMapEntry.-val", coll);
        }
      }
    }().call(null, coll);
  }
};
cljs.core.ISet = function() {
  var obj56171 = {};
  return obj56171;
}();
cljs.core._disjoin = function _disjoin(coll, v) {
  if (function() {
    var and__3627__auto__ = coll;
    if (and__3627__auto__) {
      return coll.cljs$core$ISet$_disjoin$arity$2;
    } else {
      return and__3627__auto__;
    }
  }()) {
    return coll.cljs$core$ISet$_disjoin$arity$2(coll, v);
  } else {
    var x__4275__auto__ = coll == null ? null : coll;
    return function() {
      var or__3639__auto__ = cljs.core._disjoin[goog.typeOf(x__4275__auto__)];
      if (or__3639__auto__) {
        return or__3639__auto__;
      } else {
        var or__3639__auto____$1 = cljs.core._disjoin["_"];
        if (or__3639__auto____$1) {
          return or__3639__auto____$1;
        } else {
          throw cljs.core.missing_protocol.call(null, "ISet.-disjoin", coll);
        }
      }
    }().call(null, coll, v);
  }
};
cljs.core.IStack = function() {
  var obj56173 = {};
  return obj56173;
}();
cljs.core._peek = function _peek(coll) {
  if (function() {
    var and__3627__auto__ = coll;
    if (and__3627__auto__) {
      return coll.cljs$core$IStack$_peek$arity$1;
    } else {
      return and__3627__auto__;
    }
  }()) {
    return coll.cljs$core$IStack$_peek$arity$1(coll);
  } else {
    var x__4275__auto__ = coll == null ? null : coll;
    return function() {
      var or__3639__auto__ = cljs.core._peek[goog.typeOf(x__4275__auto__)];
      if (or__3639__auto__) {
        return or__3639__auto__;
      } else {
        var or__3639__auto____$1 = cljs.core._peek["_"];
        if (or__3639__auto____$1) {
          return or__3639__auto____$1;
        } else {
          throw cljs.core.missing_protocol.call(null, "IStack.-peek", coll);
        }
      }
    }().call(null, coll);
  }
};
cljs.core._pop = function _pop(coll) {
  if (function() {
    var and__3627__auto__ = coll;
    if (and__3627__auto__) {
      return coll.cljs$core$IStack$_pop$arity$1;
    } else {
      return and__3627__auto__;
    }
  }()) {
    return coll.cljs$core$IStack$_pop$arity$1(coll);
  } else {
    var x__4275__auto__ = coll == null ? null : coll;
    return function() {
      var or__3639__auto__ = cljs.core._pop[goog.typeOf(x__4275__auto__)];
      if (or__3639__auto__) {
        return or__3639__auto__;
      } else {
        var or__3639__auto____$1 = cljs.core._pop["_"];
        if (or__3639__auto____$1) {
          return or__3639__auto____$1;
        } else {
          throw cljs.core.missing_protocol.call(null, "IStack.-pop", coll);
        }
      }
    }().call(null, coll);
  }
};
cljs.core.IVector = function() {
  var obj56175 = {};
  return obj56175;
}();
cljs.core._assoc_n = function _assoc_n(coll, n, val) {
  if (function() {
    var and__3627__auto__ = coll;
    if (and__3627__auto__) {
      return coll.cljs$core$IVector$_assoc_n$arity$3;
    } else {
      return and__3627__auto__;
    }
  }()) {
    return coll.cljs$core$IVector$_assoc_n$arity$3(coll, n, val);
  } else {
    var x__4275__auto__ = coll == null ? null : coll;
    return function() {
      var or__3639__auto__ = cljs.core._assoc_n[goog.typeOf(x__4275__auto__)];
      if (or__3639__auto__) {
        return or__3639__auto__;
      } else {
        var or__3639__auto____$1 = cljs.core._assoc_n["_"];
        if (or__3639__auto____$1) {
          return or__3639__auto____$1;
        } else {
          throw cljs.core.missing_protocol.call(null, "IVector.-assoc-n", coll);
        }
      }
    }().call(null, coll, n, val);
  }
};
cljs.core.IDeref = function() {
  var obj56177 = {};
  return obj56177;
}();
cljs.core._deref = function _deref(o) {
  if (function() {
    var and__3627__auto__ = o;
    if (and__3627__auto__) {
      return o.cljs$core$IDeref$_deref$arity$1;
    } else {
      return and__3627__auto__;
    }
  }()) {
    return o.cljs$core$IDeref$_deref$arity$1(o);
  } else {
    var x__4275__auto__ = o == null ? null : o;
    return function() {
      var or__3639__auto__ = cljs.core._deref[goog.typeOf(x__4275__auto__)];
      if (or__3639__auto__) {
        return or__3639__auto__;
      } else {
        var or__3639__auto____$1 = cljs.core._deref["_"];
        if (or__3639__auto____$1) {
          return or__3639__auto____$1;
        } else {
          throw cljs.core.missing_protocol.call(null, "IDeref.-deref", o);
        }
      }
    }().call(null, o);
  }
};
cljs.core.IDerefWithTimeout = function() {
  var obj56179 = {};
  return obj56179;
}();
cljs.core._deref_with_timeout = function _deref_with_timeout(o, msec, timeout_val) {
  if (function() {
    var and__3627__auto__ = o;
    if (and__3627__auto__) {
      return o.cljs$core$IDerefWithTimeout$_deref_with_timeout$arity$3;
    } else {
      return and__3627__auto__;
    }
  }()) {
    return o.cljs$core$IDerefWithTimeout$_deref_with_timeout$arity$3(o, msec, timeout_val);
  } else {
    var x__4275__auto__ = o == null ? null : o;
    return function() {
      var or__3639__auto__ = cljs.core._deref_with_timeout[goog.typeOf(x__4275__auto__)];
      if (or__3639__auto__) {
        return or__3639__auto__;
      } else {
        var or__3639__auto____$1 = cljs.core._deref_with_timeout["_"];
        if (or__3639__auto____$1) {
          return or__3639__auto____$1;
        } else {
          throw cljs.core.missing_protocol.call(null, "IDerefWithTimeout.-deref-with-timeout", o);
        }
      }
    }().call(null, o, msec, timeout_val);
  }
};
cljs.core.IMeta = function() {
  var obj56181 = {};
  return obj56181;
}();
cljs.core._meta = function _meta(o) {
  if (function() {
    var and__3627__auto__ = o;
    if (and__3627__auto__) {
      return o.cljs$core$IMeta$_meta$arity$1;
    } else {
      return and__3627__auto__;
    }
  }()) {
    return o.cljs$core$IMeta$_meta$arity$1(o);
  } else {
    var x__4275__auto__ = o == null ? null : o;
    return function() {
      var or__3639__auto__ = cljs.core._meta[goog.typeOf(x__4275__auto__)];
      if (or__3639__auto__) {
        return or__3639__auto__;
      } else {
        var or__3639__auto____$1 = cljs.core._meta["_"];
        if (or__3639__auto____$1) {
          return or__3639__auto____$1;
        } else {
          throw cljs.core.missing_protocol.call(null, "IMeta.-meta", o);
        }
      }
    }().call(null, o);
  }
};
cljs.core.IWithMeta = function() {
  var obj56183 = {};
  return obj56183;
}();
cljs.core._with_meta = function _with_meta(o, meta) {
  if (function() {
    var and__3627__auto__ = o;
    if (and__3627__auto__) {
      return o.cljs$core$IWithMeta$_with_meta$arity$2;
    } else {
      return and__3627__auto__;
    }
  }()) {
    return o.cljs$core$IWithMeta$_with_meta$arity$2(o, meta);
  } else {
    var x__4275__auto__ = o == null ? null : o;
    return function() {
      var or__3639__auto__ = cljs.core._with_meta[goog.typeOf(x__4275__auto__)];
      if (or__3639__auto__) {
        return or__3639__auto__;
      } else {
        var or__3639__auto____$1 = cljs.core._with_meta["_"];
        if (or__3639__auto____$1) {
          return or__3639__auto____$1;
        } else {
          throw cljs.core.missing_protocol.call(null, "IWithMeta.-with-meta", o);
        }
      }
    }().call(null, o, meta);
  }
};
cljs.core.IReduce = function() {
  var obj56185 = {};
  return obj56185;
}();
cljs.core._reduce = function() {
  var _reduce = null;
  var _reduce__2 = function(coll, f) {
    if (function() {
      var and__3627__auto__ = coll;
      if (and__3627__auto__) {
        return coll.cljs$core$IReduce$_reduce$arity$2;
      } else {
        return and__3627__auto__;
      }
    }()) {
      return coll.cljs$core$IReduce$_reduce$arity$2(coll, f);
    } else {
      var x__4275__auto__ = coll == null ? null : coll;
      return function() {
        var or__3639__auto__ = cljs.core._reduce[goog.typeOf(x__4275__auto__)];
        if (or__3639__auto__) {
          return or__3639__auto__;
        } else {
          var or__3639__auto____$1 = cljs.core._reduce["_"];
          if (or__3639__auto____$1) {
            return or__3639__auto____$1;
          } else {
            throw cljs.core.missing_protocol.call(null, "IReduce.-reduce", coll);
          }
        }
      }().call(null, coll, f);
    }
  };
  var _reduce__3 = function(coll, f, start) {
    if (function() {
      var and__3627__auto__ = coll;
      if (and__3627__auto__) {
        return coll.cljs$core$IReduce$_reduce$arity$3;
      } else {
        return and__3627__auto__;
      }
    }()) {
      return coll.cljs$core$IReduce$_reduce$arity$3(coll, f, start);
    } else {
      var x__4275__auto__ = coll == null ? null : coll;
      return function() {
        var or__3639__auto__ = cljs.core._reduce[goog.typeOf(x__4275__auto__)];
        if (or__3639__auto__) {
          return or__3639__auto__;
        } else {
          var or__3639__auto____$1 = cljs.core._reduce["_"];
          if (or__3639__auto____$1) {
            return or__3639__auto____$1;
          } else {
            throw cljs.core.missing_protocol.call(null, "IReduce.-reduce", coll);
          }
        }
      }().call(null, coll, f, start);
    }
  };
  _reduce = function(coll, f, start) {
    switch(arguments.length) {
      case 2:
        return _reduce__2.call(this, coll, f);
      case 3:
        return _reduce__3.call(this, coll, f, start);
    }
    throw new Error("Invalid arity: " + arguments.length);
  };
  _reduce.cljs$core$IFn$_invoke$arity$2 = _reduce__2;
  _reduce.cljs$core$IFn$_invoke$arity$3 = _reduce__3;
  return _reduce;
}();
cljs.core.IKVReduce = function() {
  var obj56187 = {};
  return obj56187;
}();
cljs.core._kv_reduce = function _kv_reduce(coll, f, init) {
  if (function() {
    var and__3627__auto__ = coll;
    if (and__3627__auto__) {
      return coll.cljs$core$IKVReduce$_kv_reduce$arity$3;
    } else {
      return and__3627__auto__;
    }
  }()) {
    return coll.cljs$core$IKVReduce$_kv_reduce$arity$3(coll, f, init);
  } else {
    var x__4275__auto__ = coll == null ? null : coll;
    return function() {
      var or__3639__auto__ = cljs.core._kv_reduce[goog.typeOf(x__4275__auto__)];
      if (or__3639__auto__) {
        return or__3639__auto__;
      } else {
        var or__3639__auto____$1 = cljs.core._kv_reduce["_"];
        if (or__3639__auto____$1) {
          return or__3639__auto____$1;
        } else {
          throw cljs.core.missing_protocol.call(null, "IKVReduce.-kv-reduce", coll);
        }
      }
    }().call(null, coll, f, init);
  }
};
cljs.core.IEquiv = function() {
  var obj56189 = {};
  return obj56189;
}();
cljs.core._equiv = function _equiv(o, other) {
  if (function() {
    var and__3627__auto__ = o;
    if (and__3627__auto__) {
      return o.cljs$core$IEquiv$_equiv$arity$2;
    } else {
      return and__3627__auto__;
    }
  }()) {
    return o.cljs$core$IEquiv$_equiv$arity$2(o, other);
  } else {
    var x__4275__auto__ = o == null ? null : o;
    return function() {
      var or__3639__auto__ = cljs.core._equiv[goog.typeOf(x__4275__auto__)];
      if (or__3639__auto__) {
        return or__3639__auto__;
      } else {
        var or__3639__auto____$1 = cljs.core._equiv["_"];
        if (or__3639__auto____$1) {
          return or__3639__auto____$1;
        } else {
          throw cljs.core.missing_protocol.call(null, "IEquiv.-equiv", o);
        }
      }
    }().call(null, o, other);
  }
};
cljs.core.IHash = function() {
  var obj56191 = {};
  return obj56191;
}();
cljs.core._hash = function _hash(o) {
  if (function() {
    var and__3627__auto__ = o;
    if (and__3627__auto__) {
      return o.cljs$core$IHash$_hash$arity$1;
    } else {
      return and__3627__auto__;
    }
  }()) {
    return o.cljs$core$IHash$_hash$arity$1(o);
  } else {
    var x__4275__auto__ = o == null ? null : o;
    return function() {
      var or__3639__auto__ = cljs.core._hash[goog.typeOf(x__4275__auto__)];
      if (or__3639__auto__) {
        return or__3639__auto__;
      } else {
        var or__3639__auto____$1 = cljs.core._hash["_"];
        if (or__3639__auto____$1) {
          return or__3639__auto____$1;
        } else {
          throw cljs.core.missing_protocol.call(null, "IHash.-hash", o);
        }
      }
    }().call(null, o);
  }
};
cljs.core.ISeqable = function() {
  var obj56193 = {};
  return obj56193;
}();
cljs.core._seq = function _seq(o) {
  if (function() {
    var and__3627__auto__ = o;
    if (and__3627__auto__) {
      return o.cljs$core$ISeqable$_seq$arity$1;
    } else {
      return and__3627__auto__;
    }
  }()) {
    return o.cljs$core$ISeqable$_seq$arity$1(o);
  } else {
    var x__4275__auto__ = o == null ? null : o;
    return function() {
      var or__3639__auto__ = cljs.core._seq[goog.typeOf(x__4275__auto__)];
      if (or__3639__auto__) {
        return or__3639__auto__;
      } else {
        var or__3639__auto____$1 = cljs.core._seq["_"];
        if (or__3639__auto____$1) {
          return or__3639__auto____$1;
        } else {
          throw cljs.core.missing_protocol.call(null, "ISeqable.-seq", o);
        }
      }
    }().call(null, o);
  }
};
cljs.core.ISequential = function() {
  var obj56195 = {};
  return obj56195;
}();
cljs.core.IList = function() {
  var obj56197 = {};
  return obj56197;
}();
cljs.core.IRecord = function() {
  var obj56199 = {};
  return obj56199;
}();
cljs.core.IReversible = function() {
  var obj56201 = {};
  return obj56201;
}();
cljs.core._rseq = function _rseq(coll) {
  if (function() {
    var and__3627__auto__ = coll;
    if (and__3627__auto__) {
      return coll.cljs$core$IReversible$_rseq$arity$1;
    } else {
      return and__3627__auto__;
    }
  }()) {
    return coll.cljs$core$IReversible$_rseq$arity$1(coll);
  } else {
    var x__4275__auto__ = coll == null ? null : coll;
    return function() {
      var or__3639__auto__ = cljs.core._rseq[goog.typeOf(x__4275__auto__)];
      if (or__3639__auto__) {
        return or__3639__auto__;
      } else {
        var or__3639__auto____$1 = cljs.core._rseq["_"];
        if (or__3639__auto____$1) {
          return or__3639__auto____$1;
        } else {
          throw cljs.core.missing_protocol.call(null, "IReversible.-rseq", coll);
        }
      }
    }().call(null, coll);
  }
};
cljs.core.ISorted = function() {
  var obj56203 = {};
  return obj56203;
}();
cljs.core._sorted_seq = function _sorted_seq(coll, ascending_QMARK_) {
  if (function() {
    var and__3627__auto__ = coll;
    if (and__3627__auto__) {
      return coll.cljs$core$ISorted$_sorted_seq$arity$2;
    } else {
      return and__3627__auto__;
    }
  }()) {
    return coll.cljs$core$ISorted$_sorted_seq$arity$2(coll, ascending_QMARK_);
  } else {
    var x__4275__auto__ = coll == null ? null : coll;
    return function() {
      var or__3639__auto__ = cljs.core._sorted_seq[goog.typeOf(x__4275__auto__)];
      if (or__3639__auto__) {
        return or__3639__auto__;
      } else {
        var or__3639__auto____$1 = cljs.core._sorted_seq["_"];
        if (or__3639__auto____$1) {
          return or__3639__auto____$1;
        } else {
          throw cljs.core.missing_protocol.call(null, "ISorted.-sorted-seq", coll);
        }
      }
    }().call(null, coll, ascending_QMARK_);
  }
};
cljs.core._sorted_seq_from = function _sorted_seq_from(coll, k, ascending_QMARK_) {
  if (function() {
    var and__3627__auto__ = coll;
    if (and__3627__auto__) {
      return coll.cljs$core$ISorted$_sorted_seq_from$arity$3;
    } else {
      return and__3627__auto__;
    }
  }()) {
    return coll.cljs$core$ISorted$_sorted_seq_from$arity$3(coll, k, ascending_QMARK_);
  } else {
    var x__4275__auto__ = coll == null ? null : coll;
    return function() {
      var or__3639__auto__ = cljs.core._sorted_seq_from[goog.typeOf(x__4275__auto__)];
      if (or__3639__auto__) {
        return or__3639__auto__;
      } else {
        var or__3639__auto____$1 = cljs.core._sorted_seq_from["_"];
        if (or__3639__auto____$1) {
          return or__3639__auto____$1;
        } else {
          throw cljs.core.missing_protocol.call(null, "ISorted.-sorted-seq-from", coll);
        }
      }
    }().call(null, coll, k, ascending_QMARK_);
  }
};
cljs.core._entry_key = function _entry_key(coll, entry) {
  if (function() {
    var and__3627__auto__ = coll;
    if (and__3627__auto__) {
      return coll.cljs$core$ISorted$_entry_key$arity$2;
    } else {
      return and__3627__auto__;
    }
  }()) {
    return coll.cljs$core$ISorted$_entry_key$arity$2(coll, entry);
  } else {
    var x__4275__auto__ = coll == null ? null : coll;
    return function() {
      var or__3639__auto__ = cljs.core._entry_key[goog.typeOf(x__4275__auto__)];
      if (or__3639__auto__) {
        return or__3639__auto__;
      } else {
        var or__3639__auto____$1 = cljs.core._entry_key["_"];
        if (or__3639__auto____$1) {
          return or__3639__auto____$1;
        } else {
          throw cljs.core.missing_protocol.call(null, "ISorted.-entry-key", coll);
        }
      }
    }().call(null, coll, entry);
  }
};
cljs.core._comparator = function _comparator(coll) {
  if (function() {
    var and__3627__auto__ = coll;
    if (and__3627__auto__) {
      return coll.cljs$core$ISorted$_comparator$arity$1;
    } else {
      return and__3627__auto__;
    }
  }()) {
    return coll.cljs$core$ISorted$_comparator$arity$1(coll);
  } else {
    var x__4275__auto__ = coll == null ? null : coll;
    return function() {
      var or__3639__auto__ = cljs.core._comparator[goog.typeOf(x__4275__auto__)];
      if (or__3639__auto__) {
        return or__3639__auto__;
      } else {
        var or__3639__auto____$1 = cljs.core._comparator["_"];
        if (or__3639__auto____$1) {
          return or__3639__auto____$1;
        } else {
          throw cljs.core.missing_protocol.call(null, "ISorted.-comparator", coll);
        }
      }
    }().call(null, coll);
  }
};
cljs.core.IWriter = function() {
  var obj56205 = {};
  return obj56205;
}();
cljs.core._write = function _write(writer, s) {
  if (function() {
    var and__3627__auto__ = writer;
    if (and__3627__auto__) {
      return writer.cljs$core$IWriter$_write$arity$2;
    } else {
      return and__3627__auto__;
    }
  }()) {
    return writer.cljs$core$IWriter$_write$arity$2(writer, s);
  } else {
    var x__4275__auto__ = writer == null ? null : writer;
    return function() {
      var or__3639__auto__ = cljs.core._write[goog.typeOf(x__4275__auto__)];
      if (or__3639__auto__) {
        return or__3639__auto__;
      } else {
        var or__3639__auto____$1 = cljs.core._write["_"];
        if (or__3639__auto____$1) {
          return or__3639__auto____$1;
        } else {
          throw cljs.core.missing_protocol.call(null, "IWriter.-write", writer);
        }
      }
    }().call(null, writer, s);
  }
};
cljs.core._flush = function _flush(writer) {
  if (function() {
    var and__3627__auto__ = writer;
    if (and__3627__auto__) {
      return writer.cljs$core$IWriter$_flush$arity$1;
    } else {
      return and__3627__auto__;
    }
  }()) {
    return writer.cljs$core$IWriter$_flush$arity$1(writer);
  } else {
    var x__4275__auto__ = writer == null ? null : writer;
    return function() {
      var or__3639__auto__ = cljs.core._flush[goog.typeOf(x__4275__auto__)];
      if (or__3639__auto__) {
        return or__3639__auto__;
      } else {
        var or__3639__auto____$1 = cljs.core._flush["_"];
        if (or__3639__auto____$1) {
          return or__3639__auto____$1;
        } else {
          throw cljs.core.missing_protocol.call(null, "IWriter.-flush", writer);
        }
      }
    }().call(null, writer);
  }
};
cljs.core.IPrintWithWriter = function() {
  var obj56207 = {};
  return obj56207;
}();
cljs.core._pr_writer = function _pr_writer(o, writer, opts) {
  if (function() {
    var and__3627__auto__ = o;
    if (and__3627__auto__) {
      return o.cljs$core$IPrintWithWriter$_pr_writer$arity$3;
    } else {
      return and__3627__auto__;
    }
  }()) {
    return o.cljs$core$IPrintWithWriter$_pr_writer$arity$3(o, writer, opts);
  } else {
    var x__4275__auto__ = o == null ? null : o;
    return function() {
      var or__3639__auto__ = cljs.core._pr_writer[goog.typeOf(x__4275__auto__)];
      if (or__3639__auto__) {
        return or__3639__auto__;
      } else {
        var or__3639__auto____$1 = cljs.core._pr_writer["_"];
        if (or__3639__auto____$1) {
          return or__3639__auto____$1;
        } else {
          throw cljs.core.missing_protocol.call(null, "IPrintWithWriter.-pr-writer", o);
        }
      }
    }().call(null, o, writer, opts);
  }
};
cljs.core.IPending = function() {
  var obj56209 = {};
  return obj56209;
}();
cljs.core._realized_QMARK_ = function _realized_QMARK_(d) {
  if (function() {
    var and__3627__auto__ = d;
    if (and__3627__auto__) {
      return d.cljs$core$IPending$_realized_QMARK_$arity$1;
    } else {
      return and__3627__auto__;
    }
  }()) {
    return d.cljs$core$IPending$_realized_QMARK_$arity$1(d);
  } else {
    var x__4275__auto__ = d == null ? null : d;
    return function() {
      var or__3639__auto__ = cljs.core._realized_QMARK_[goog.typeOf(x__4275__auto__)];
      if (or__3639__auto__) {
        return or__3639__auto__;
      } else {
        var or__3639__auto____$1 = cljs.core._realized_QMARK_["_"];
        if (or__3639__auto____$1) {
          return or__3639__auto____$1;
        } else {
          throw cljs.core.missing_protocol.call(null, "IPending.-realized?", d);
        }
      }
    }().call(null, d);
  }
};
cljs.core.IWatchable = function() {
  var obj56211 = {};
  return obj56211;
}();
cljs.core._notify_watches = function _notify_watches(this$, oldval, newval) {
  if (function() {
    var and__3627__auto__ = this$;
    if (and__3627__auto__) {
      return this$.cljs$core$IWatchable$_notify_watches$arity$3;
    } else {
      return and__3627__auto__;
    }
  }()) {
    return this$.cljs$core$IWatchable$_notify_watches$arity$3(this$, oldval, newval);
  } else {
    var x__4275__auto__ = this$ == null ? null : this$;
    return function() {
      var or__3639__auto__ = cljs.core._notify_watches[goog.typeOf(x__4275__auto__)];
      if (or__3639__auto__) {
        return or__3639__auto__;
      } else {
        var or__3639__auto____$1 = cljs.core._notify_watches["_"];
        if (or__3639__auto____$1) {
          return or__3639__auto____$1;
        } else {
          throw cljs.core.missing_protocol.call(null, "IWatchable.-notify-watches", this$);
        }
      }
    }().call(null, this$, oldval, newval);
  }
};
cljs.core._add_watch = function _add_watch(this$, key, f) {
  if (function() {
    var and__3627__auto__ = this$;
    if (and__3627__auto__) {
      return this$.cljs$core$IWatchable$_add_watch$arity$3;
    } else {
      return and__3627__auto__;
    }
  }()) {
    return this$.cljs$core$IWatchable$_add_watch$arity$3(this$, key, f);
  } else {
    var x__4275__auto__ = this$ == null ? null : this$;
    return function() {
      var or__3639__auto__ = cljs.core._add_watch[goog.typeOf(x__4275__auto__)];
      if (or__3639__auto__) {
        return or__3639__auto__;
      } else {
        var or__3639__auto____$1 = cljs.core._add_watch["_"];
        if (or__3639__auto____$1) {
          return or__3639__auto____$1;
        } else {
          throw cljs.core.missing_protocol.call(null, "IWatchable.-add-watch", this$);
        }
      }
    }().call(null, this$, key, f);
  }
};
cljs.core._remove_watch = function _remove_watch(this$, key) {
  if (function() {
    var and__3627__auto__ = this$;
    if (and__3627__auto__) {
      return this$.cljs$core$IWatchable$_remove_watch$arity$2;
    } else {
      return and__3627__auto__;
    }
  }()) {
    return this$.cljs$core$IWatchable$_remove_watch$arity$2(this$, key);
  } else {
    var x__4275__auto__ = this$ == null ? null : this$;
    return function() {
      var or__3639__auto__ = cljs.core._remove_watch[goog.typeOf(x__4275__auto__)];
      if (or__3639__auto__) {
        return or__3639__auto__;
      } else {
        var or__3639__auto____$1 = cljs.core._remove_watch["_"];
        if (or__3639__auto____$1) {
          return or__3639__auto____$1;
        } else {
          throw cljs.core.missing_protocol.call(null, "IWatchable.-remove-watch", this$);
        }
      }
    }().call(null, this$, key);
  }
};
cljs.core.IEditableCollection = function() {
  var obj56213 = {};
  return obj56213;
}();
cljs.core._as_transient = function _as_transient(coll) {
  if (function() {
    var and__3627__auto__ = coll;
    if (and__3627__auto__) {
      return coll.cljs$core$IEditableCollection$_as_transient$arity$1;
    } else {
      return and__3627__auto__;
    }
  }()) {
    return coll.cljs$core$IEditableCollection$_as_transient$arity$1(coll);
  } else {
    var x__4275__auto__ = coll == null ? null : coll;
    return function() {
      var or__3639__auto__ = cljs.core._as_transient[goog.typeOf(x__4275__auto__)];
      if (or__3639__auto__) {
        return or__3639__auto__;
      } else {
        var or__3639__auto____$1 = cljs.core._as_transient["_"];
        if (or__3639__auto____$1) {
          return or__3639__auto____$1;
        } else {
          throw cljs.core.missing_protocol.call(null, "IEditableCollection.-as-transient", coll);
        }
      }
    }().call(null, coll);
  }
};
cljs.core.ITransientCollection = function() {
  var obj56215 = {};
  return obj56215;
}();
cljs.core._conj_BANG_ = function _conj_BANG_(tcoll, val) {
  if (function() {
    var and__3627__auto__ = tcoll;
    if (and__3627__auto__) {
      return tcoll.cljs$core$ITransientCollection$_conj_BANG_$arity$2;
    } else {
      return and__3627__auto__;
    }
  }()) {
    return tcoll.cljs$core$ITransientCollection$_conj_BANG_$arity$2(tcoll, val);
  } else {
    var x__4275__auto__ = tcoll == null ? null : tcoll;
    return function() {
      var or__3639__auto__ = cljs.core._conj_BANG_[goog.typeOf(x__4275__auto__)];
      if (or__3639__auto__) {
        return or__3639__auto__;
      } else {
        var or__3639__auto____$1 = cljs.core._conj_BANG_["_"];
        if (or__3639__auto____$1) {
          return or__3639__auto____$1;
        } else {
          throw cljs.core.missing_protocol.call(null, "ITransientCollection.-conj!", tcoll);
        }
      }
    }().call(null, tcoll, val);
  }
};
cljs.core._persistent_BANG_ = function _persistent_BANG_(tcoll) {
  if (function() {
    var and__3627__auto__ = tcoll;
    if (and__3627__auto__) {
      return tcoll.cljs$core$ITransientCollection$_persistent_BANG_$arity$1;
    } else {
      return and__3627__auto__;
    }
  }()) {
    return tcoll.cljs$core$ITransientCollection$_persistent_BANG_$arity$1(tcoll);
  } else {
    var x__4275__auto__ = tcoll == null ? null : tcoll;
    return function() {
      var or__3639__auto__ = cljs.core._persistent_BANG_[goog.typeOf(x__4275__auto__)];
      if (or__3639__auto__) {
        return or__3639__auto__;
      } else {
        var or__3639__auto____$1 = cljs.core._persistent_BANG_["_"];
        if (or__3639__auto____$1) {
          return or__3639__auto____$1;
        } else {
          throw cljs.core.missing_protocol.call(null, "ITransientCollection.-persistent!", tcoll);
        }
      }
    }().call(null, tcoll);
  }
};
cljs.core.ITransientAssociative = function() {
  var obj56217 = {};
  return obj56217;
}();
cljs.core._assoc_BANG_ = function _assoc_BANG_(tcoll, key, val) {
  if (function() {
    var and__3627__auto__ = tcoll;
    if (and__3627__auto__) {
      return tcoll.cljs$core$ITransientAssociative$_assoc_BANG_$arity$3;
    } else {
      return and__3627__auto__;
    }
  }()) {
    return tcoll.cljs$core$ITransientAssociative$_assoc_BANG_$arity$3(tcoll, key, val);
  } else {
    var x__4275__auto__ = tcoll == null ? null : tcoll;
    return function() {
      var or__3639__auto__ = cljs.core._assoc_BANG_[goog.typeOf(x__4275__auto__)];
      if (or__3639__auto__) {
        return or__3639__auto__;
      } else {
        var or__3639__auto____$1 = cljs.core._assoc_BANG_["_"];
        if (or__3639__auto____$1) {
          return or__3639__auto____$1;
        } else {
          throw cljs.core.missing_protocol.call(null, "ITransientAssociative.-assoc!", tcoll);
        }
      }
    }().call(null, tcoll, key, val);
  }
};
cljs.core.ITransientMap = function() {
  var obj56219 = {};
  return obj56219;
}();
cljs.core._dissoc_BANG_ = function _dissoc_BANG_(tcoll, key) {
  if (function() {
    var and__3627__auto__ = tcoll;
    if (and__3627__auto__) {
      return tcoll.cljs$core$ITransientMap$_dissoc_BANG_$arity$2;
    } else {
      return and__3627__auto__;
    }
  }()) {
    return tcoll.cljs$core$ITransientMap$_dissoc_BANG_$arity$2(tcoll, key);
  } else {
    var x__4275__auto__ = tcoll == null ? null : tcoll;
    return function() {
      var or__3639__auto__ = cljs.core._dissoc_BANG_[goog.typeOf(x__4275__auto__)];
      if (or__3639__auto__) {
        return or__3639__auto__;
      } else {
        var or__3639__auto____$1 = cljs.core._dissoc_BANG_["_"];
        if (or__3639__auto____$1) {
          return or__3639__auto____$1;
        } else {
          throw cljs.core.missing_protocol.call(null, "ITransientMap.-dissoc!", tcoll);
        }
      }
    }().call(null, tcoll, key);
  }
};
cljs.core.ITransientVector = function() {
  var obj56221 = {};
  return obj56221;
}();
cljs.core._assoc_n_BANG_ = function _assoc_n_BANG_(tcoll, n, val) {
  if (function() {
    var and__3627__auto__ = tcoll;
    if (and__3627__auto__) {
      return tcoll.cljs$core$ITransientVector$_assoc_n_BANG_$arity$3;
    } else {
      return and__3627__auto__;
    }
  }()) {
    return tcoll.cljs$core$ITransientVector$_assoc_n_BANG_$arity$3(tcoll, n, val);
  } else {
    var x__4275__auto__ = tcoll == null ? null : tcoll;
    return function() {
      var or__3639__auto__ = cljs.core._assoc_n_BANG_[goog.typeOf(x__4275__auto__)];
      if (or__3639__auto__) {
        return or__3639__auto__;
      } else {
        var or__3639__auto____$1 = cljs.core._assoc_n_BANG_["_"];
        if (or__3639__auto____$1) {
          return or__3639__auto____$1;
        } else {
          throw cljs.core.missing_protocol.call(null, "ITransientVector.-assoc-n!", tcoll);
        }
      }
    }().call(null, tcoll, n, val);
  }
};
cljs.core._pop_BANG_ = function _pop_BANG_(tcoll) {
  if (function() {
    var and__3627__auto__ = tcoll;
    if (and__3627__auto__) {
      return tcoll.cljs$core$ITransientVector$_pop_BANG_$arity$1;
    } else {
      return and__3627__auto__;
    }
  }()) {
    return tcoll.cljs$core$ITransientVector$_pop_BANG_$arity$1(tcoll);
  } else {
    var x__4275__auto__ = tcoll == null ? null : tcoll;
    return function() {
      var or__3639__auto__ = cljs.core._pop_BANG_[goog.typeOf(x__4275__auto__)];
      if (or__3639__auto__) {
        return or__3639__auto__;
      } else {
        var or__3639__auto____$1 = cljs.core._pop_BANG_["_"];
        if (or__3639__auto____$1) {
          return or__3639__auto____$1;
        } else {
          throw cljs.core.missing_protocol.call(null, "ITransientVector.-pop!", tcoll);
        }
      }
    }().call(null, tcoll);
  }
};
cljs.core.ITransientSet = function() {
  var obj56223 = {};
  return obj56223;
}();
cljs.core._disjoin_BANG_ = function _disjoin_BANG_(tcoll, v) {
  if (function() {
    var and__3627__auto__ = tcoll;
    if (and__3627__auto__) {
      return tcoll.cljs$core$ITransientSet$_disjoin_BANG_$arity$2;
    } else {
      return and__3627__auto__;
    }
  }()) {
    return tcoll.cljs$core$ITransientSet$_disjoin_BANG_$arity$2(tcoll, v);
  } else {
    var x__4275__auto__ = tcoll == null ? null : tcoll;
    return function() {
      var or__3639__auto__ = cljs.core._disjoin_BANG_[goog.typeOf(x__4275__auto__)];
      if (or__3639__auto__) {
        return or__3639__auto__;
      } else {
        var or__3639__auto____$1 = cljs.core._disjoin_BANG_["_"];
        if (or__3639__auto____$1) {
          return or__3639__auto____$1;
        } else {
          throw cljs.core.missing_protocol.call(null, "ITransientSet.-disjoin!", tcoll);
        }
      }
    }().call(null, tcoll, v);
  }
};
cljs.core.IComparable = function() {
  var obj56225 = {};
  return obj56225;
}();
cljs.core._compare = function _compare(x, y) {
  if (function() {
    var and__3627__auto__ = x;
    if (and__3627__auto__) {
      return x.cljs$core$IComparable$_compare$arity$2;
    } else {
      return and__3627__auto__;
    }
  }()) {
    return x.cljs$core$IComparable$_compare$arity$2(x, y);
  } else {
    var x__4275__auto__ = x == null ? null : x;
    return function() {
      var or__3639__auto__ = cljs.core._compare[goog.typeOf(x__4275__auto__)];
      if (or__3639__auto__) {
        return or__3639__auto__;
      } else {
        var or__3639__auto____$1 = cljs.core._compare["_"];
        if (or__3639__auto____$1) {
          return or__3639__auto____$1;
        } else {
          throw cljs.core.missing_protocol.call(null, "IComparable.-compare", x);
        }
      }
    }().call(null, x, y);
  }
};
cljs.core.IChunk = function() {
  var obj56227 = {};
  return obj56227;
}();
cljs.core._drop_first = function _drop_first(coll) {
  if (function() {
    var and__3627__auto__ = coll;
    if (and__3627__auto__) {
      return coll.cljs$core$IChunk$_drop_first$arity$1;
    } else {
      return and__3627__auto__;
    }
  }()) {
    return coll.cljs$core$IChunk$_drop_first$arity$1(coll);
  } else {
    var x__4275__auto__ = coll == null ? null : coll;
    return function() {
      var or__3639__auto__ = cljs.core._drop_first[goog.typeOf(x__4275__auto__)];
      if (or__3639__auto__) {
        return or__3639__auto__;
      } else {
        var or__3639__auto____$1 = cljs.core._drop_first["_"];
        if (or__3639__auto____$1) {
          return or__3639__auto____$1;
        } else {
          throw cljs.core.missing_protocol.call(null, "IChunk.-drop-first", coll);
        }
      }
    }().call(null, coll);
  }
};
cljs.core.IChunkedSeq = function() {
  var obj56229 = {};
  return obj56229;
}();
cljs.core._chunked_first = function _chunked_first(coll) {
  if (function() {
    var and__3627__auto__ = coll;
    if (and__3627__auto__) {
      return coll.cljs$core$IChunkedSeq$_chunked_first$arity$1;
    } else {
      return and__3627__auto__;
    }
  }()) {
    return coll.cljs$core$IChunkedSeq$_chunked_first$arity$1(coll);
  } else {
    var x__4275__auto__ = coll == null ? null : coll;
    return function() {
      var or__3639__auto__ = cljs.core._chunked_first[goog.typeOf(x__4275__auto__)];
      if (or__3639__auto__) {
        return or__3639__auto__;
      } else {
        var or__3639__auto____$1 = cljs.core._chunked_first["_"];
        if (or__3639__auto____$1) {
          return or__3639__auto____$1;
        } else {
          throw cljs.core.missing_protocol.call(null, "IChunkedSeq.-chunked-first", coll);
        }
      }
    }().call(null, coll);
  }
};
cljs.core._chunked_rest = function _chunked_rest(coll) {
  if (function() {
    var and__3627__auto__ = coll;
    if (and__3627__auto__) {
      return coll.cljs$core$IChunkedSeq$_chunked_rest$arity$1;
    } else {
      return and__3627__auto__;
    }
  }()) {
    return coll.cljs$core$IChunkedSeq$_chunked_rest$arity$1(coll);
  } else {
    var x__4275__auto__ = coll == null ? null : coll;
    return function() {
      var or__3639__auto__ = cljs.core._chunked_rest[goog.typeOf(x__4275__auto__)];
      if (or__3639__auto__) {
        return or__3639__auto__;
      } else {
        var or__3639__auto____$1 = cljs.core._chunked_rest["_"];
        if (or__3639__auto____$1) {
          return or__3639__auto____$1;
        } else {
          throw cljs.core.missing_protocol.call(null, "IChunkedSeq.-chunked-rest", coll);
        }
      }
    }().call(null, coll);
  }
};
cljs.core.IChunkedNext = function() {
  var obj56231 = {};
  return obj56231;
}();
cljs.core._chunked_next = function _chunked_next(coll) {
  if (function() {
    var and__3627__auto__ = coll;
    if (and__3627__auto__) {
      return coll.cljs$core$IChunkedNext$_chunked_next$arity$1;
    } else {
      return and__3627__auto__;
    }
  }()) {
    return coll.cljs$core$IChunkedNext$_chunked_next$arity$1(coll);
  } else {
    var x__4275__auto__ = coll == null ? null : coll;
    return function() {
      var or__3639__auto__ = cljs.core._chunked_next[goog.typeOf(x__4275__auto__)];
      if (or__3639__auto__) {
        return or__3639__auto__;
      } else {
        var or__3639__auto____$1 = cljs.core._chunked_next["_"];
        if (or__3639__auto____$1) {
          return or__3639__auto____$1;
        } else {
          throw cljs.core.missing_protocol.call(null, "IChunkedNext.-chunked-next", coll);
        }
      }
    }().call(null, coll);
  }
};
cljs.core.INamed = function() {
  var obj56233 = {};
  return obj56233;
}();
cljs.core._name = function _name(x) {
  if (function() {
    var and__3627__auto__ = x;
    if (and__3627__auto__) {
      return x.cljs$core$INamed$_name$arity$1;
    } else {
      return and__3627__auto__;
    }
  }()) {
    return x.cljs$core$INamed$_name$arity$1(x);
  } else {
    var x__4275__auto__ = x == null ? null : x;
    return function() {
      var or__3639__auto__ = cljs.core._name[goog.typeOf(x__4275__auto__)];
      if (or__3639__auto__) {
        return or__3639__auto__;
      } else {
        var or__3639__auto____$1 = cljs.core._name["_"];
        if (or__3639__auto____$1) {
          return or__3639__auto____$1;
        } else {
          throw cljs.core.missing_protocol.call(null, "INamed.-name", x);
        }
      }
    }().call(null, x);
  }
};
cljs.core._namespace = function _namespace(x) {
  if (function() {
    var and__3627__auto__ = x;
    if (and__3627__auto__) {
      return x.cljs$core$INamed$_namespace$arity$1;
    } else {
      return and__3627__auto__;
    }
  }()) {
    return x.cljs$core$INamed$_namespace$arity$1(x);
  } else {
    var x__4275__auto__ = x == null ? null : x;
    return function() {
      var or__3639__auto__ = cljs.core._namespace[goog.typeOf(x__4275__auto__)];
      if (or__3639__auto__) {
        return or__3639__auto__;
      } else {
        var or__3639__auto____$1 = cljs.core._namespace["_"];
        if (or__3639__auto____$1) {
          return or__3639__auto____$1;
        } else {
          throw cljs.core.missing_protocol.call(null, "INamed.-namespace", x);
        }
      }
    }().call(null, x);
  }
};
cljs.core.IAtom = function() {
  var obj56235 = {};
  return obj56235;
}();
cljs.core.IReset = function() {
  var obj56237 = {};
  return obj56237;
}();
cljs.core._reset_BANG_ = function _reset_BANG_(o, new_value) {
  if (function() {
    var and__3627__auto__ = o;
    if (and__3627__auto__) {
      return o.cljs$core$IReset$_reset_BANG_$arity$2;
    } else {
      return and__3627__auto__;
    }
  }()) {
    return o.cljs$core$IReset$_reset_BANG_$arity$2(o, new_value);
  } else {
    var x__4275__auto__ = o == null ? null : o;
    return function() {
      var or__3639__auto__ = cljs.core._reset_BANG_[goog.typeOf(x__4275__auto__)];
      if (or__3639__auto__) {
        return or__3639__auto__;
      } else {
        var or__3639__auto____$1 = cljs.core._reset_BANG_["_"];
        if (or__3639__auto____$1) {
          return or__3639__auto____$1;
        } else {
          throw cljs.core.missing_protocol.call(null, "IReset.-reset!", o);
        }
      }
    }().call(null, o, new_value);
  }
};
cljs.core.ISwap = function() {
  var obj56239 = {};
  return obj56239;
}();
cljs.core._swap_BANG_ = function() {
  var _swap_BANG_ = null;
  var _swap_BANG___2 = function(o, f) {
    if (function() {
      var and__3627__auto__ = o;
      if (and__3627__auto__) {
        return o.cljs$core$ISwap$_swap_BANG_$arity$2;
      } else {
        return and__3627__auto__;
      }
    }()) {
      return o.cljs$core$ISwap$_swap_BANG_$arity$2(o, f);
    } else {
      var x__4275__auto__ = o == null ? null : o;
      return function() {
        var or__3639__auto__ = cljs.core._swap_BANG_[goog.typeOf(x__4275__auto__)];
        if (or__3639__auto__) {
          return or__3639__auto__;
        } else {
          var or__3639__auto____$1 = cljs.core._swap_BANG_["_"];
          if (or__3639__auto____$1) {
            return or__3639__auto____$1;
          } else {
            throw cljs.core.missing_protocol.call(null, "ISwap.-swap!", o);
          }
        }
      }().call(null, o, f);
    }
  };
  var _swap_BANG___3 = function(o, f, a) {
    if (function() {
      var and__3627__auto__ = o;
      if (and__3627__auto__) {
        return o.cljs$core$ISwap$_swap_BANG_$arity$3;
      } else {
        return and__3627__auto__;
      }
    }()) {
      return o.cljs$core$ISwap$_swap_BANG_$arity$3(o, f, a);
    } else {
      var x__4275__auto__ = o == null ? null : o;
      return function() {
        var or__3639__auto__ = cljs.core._swap_BANG_[goog.typeOf(x__4275__auto__)];
        if (or__3639__auto__) {
          return or__3639__auto__;
        } else {
          var or__3639__auto____$1 = cljs.core._swap_BANG_["_"];
          if (or__3639__auto____$1) {
            return or__3639__auto____$1;
          } else {
            throw cljs.core.missing_protocol.call(null, "ISwap.-swap!", o);
          }
        }
      }().call(null, o, f, a);
    }
  };
  var _swap_BANG___4 = function(o, f, a, b) {
    if (function() {
      var and__3627__auto__ = o;
      if (and__3627__auto__) {
        return o.cljs$core$ISwap$_swap_BANG_$arity$4;
      } else {
        return and__3627__auto__;
      }
    }()) {
      return o.cljs$core$ISwap$_swap_BANG_$arity$4(o, f, a, b);
    } else {
      var x__4275__auto__ = o == null ? null : o;
      return function() {
        var or__3639__auto__ = cljs.core._swap_BANG_[goog.typeOf(x__4275__auto__)];
        if (or__3639__auto__) {
          return or__3639__auto__;
        } else {
          var or__3639__auto____$1 = cljs.core._swap_BANG_["_"];
          if (or__3639__auto____$1) {
            return or__3639__auto____$1;
          } else {
            throw cljs.core.missing_protocol.call(null, "ISwap.-swap!", o);
          }
        }
      }().call(null, o, f, a, b);
    }
  };
  var _swap_BANG___5 = function(o, f, a, b, xs) {
    if (function() {
      var and__3627__auto__ = o;
      if (and__3627__auto__) {
        return o.cljs$core$ISwap$_swap_BANG_$arity$5;
      } else {
        return and__3627__auto__;
      }
    }()) {
      return o.cljs$core$ISwap$_swap_BANG_$arity$5(o, f, a, b, xs);
    } else {
      var x__4275__auto__ = o == null ? null : o;
      return function() {
        var or__3639__auto__ = cljs.core._swap_BANG_[goog.typeOf(x__4275__auto__)];
        if (or__3639__auto__) {
          return or__3639__auto__;
        } else {
          var or__3639__auto____$1 = cljs.core._swap_BANG_["_"];
          if (or__3639__auto____$1) {
            return or__3639__auto____$1;
          } else {
            throw cljs.core.missing_protocol.call(null, "ISwap.-swap!", o);
          }
        }
      }().call(null, o, f, a, b, xs);
    }
  };
  _swap_BANG_ = function(o, f, a, b, xs) {
    switch(arguments.length) {
      case 2:
        return _swap_BANG___2.call(this, o, f);
      case 3:
        return _swap_BANG___3.call(this, o, f, a);
      case 4:
        return _swap_BANG___4.call(this, o, f, a, b);
      case 5:
        return _swap_BANG___5.call(this, o, f, a, b, xs);
    }
    throw new Error("Invalid arity: " + arguments.length);
  };
  _swap_BANG_.cljs$core$IFn$_invoke$arity$2 = _swap_BANG___2;
  _swap_BANG_.cljs$core$IFn$_invoke$arity$3 = _swap_BANG___3;
  _swap_BANG_.cljs$core$IFn$_invoke$arity$4 = _swap_BANG___4;
  _swap_BANG_.cljs$core$IFn$_invoke$arity$5 = _swap_BANG___5;
  return _swap_BANG_;
}();
cljs.core.IIterable = function() {
  var obj56241 = {};
  return obj56241;
}();
cljs.core._iterator = function _iterator(coll) {
  if (function() {
    var and__3627__auto__ = coll;
    if (and__3627__auto__) {
      return coll.cljs$core$IIterable$_iterator$arity$1;
    } else {
      return and__3627__auto__;
    }
  }()) {
    return coll.cljs$core$IIterable$_iterator$arity$1(coll);
  } else {
    var x__4275__auto__ = coll == null ? null : coll;
    return function() {
      var or__3639__auto__ = cljs.core._iterator[goog.typeOf(x__4275__auto__)];
      if (or__3639__auto__) {
        return or__3639__auto__;
      } else {
        var or__3639__auto____$1 = cljs.core._iterator["_"];
        if (or__3639__auto____$1) {
          return or__3639__auto____$1;
        } else {
          throw cljs.core.missing_protocol.call(null, "IIterable.-iterator", coll);
        }
      }
    }().call(null, coll);
  }
};
cljs.core.StringBufferWriter = function(sb) {
  this.sb = sb;
  this.cljs$lang$protocol_mask$partition1$ = 0;
  this.cljs$lang$protocol_mask$partition0$ = 1073741824;
};
cljs.core.StringBufferWriter.cljs$lang$type = true;
cljs.core.StringBufferWriter.cljs$lang$ctorStr = "cljs.core/StringBufferWriter";
cljs.core.StringBufferWriter.cljs$lang$ctorPrWriter = function(this__4215__auto__, writer__4216__auto__, opt__4217__auto__) {
  return cljs.core._write.call(null, writer__4216__auto__, "cljs.core/StringBufferWriter");
};
cljs.core.StringBufferWriter.prototype.cljs$core$IWriter$_write$arity$2 = function(_, s) {
  var self__ = this;
  var ___$1 = this;
  return self__.sb.append(s);
};
cljs.core.StringBufferWriter.prototype.cljs$core$IWriter$_flush$arity$1 = function(_) {
  var self__ = this;
  var ___$1 = this;
  return null;
};
cljs.core.__GT_StringBufferWriter = function __GT_StringBufferWriter(sb) {
  return new cljs.core.StringBufferWriter(sb);
};
cljs.core.pr_str_STAR_ = function pr_str_STAR_(obj) {
  var sb = new goog.string.StringBuffer;
  var writer = new cljs.core.StringBufferWriter(sb);
  cljs.core._pr_writer.call(null, obj, writer, cljs.core.pr_opts.call(null));
  cljs.core._flush.call(null, writer);
  return "" + cljs.core.str.cljs$core$IFn$_invoke$arity$1(sb);
};
cljs.core.int_rotate_left = function int_rotate_left(x, n) {
  return x << n | x >>> -n;
};
if (typeof Math.imul !== "undefined" && !(Math.imul.call(null, 4294967295, 5) === 0)) {
  cljs.core.imul = function imul(a, b) {
    return Math.imul.call(null, a, b);
  };
} else {
  cljs.core.imul = function imul(a, b) {
    var ah = a >>> 16 & 65535;
    var al = a & 65535;
    var bh = b >>> 16 & 65535;
    var bl = b & 65535;
    return al * bl + (ah * bl + al * bh << 16 >>> 0) | 0;
  };
}
cljs.core.m3_seed = 0;
cljs.core.m3_C1 = 3432918353;
cljs.core.m3_C2 = 461845907;
cljs.core.m3_mix_K1 = function m3_mix_K1(k1) {
  return cljs.core.imul.call(null, cljs.core.int_rotate_left.call(null, cljs.core.imul.call(null, k1, cljs.core.m3_C1), 15), cljs.core.m3_C2);
};
cljs.core.m3_mix_H1 = function m3_mix_H1(h1, k1) {
  return cljs.core.imul.call(null, cljs.core.int_rotate_left.call(null, h1 ^ k1, 13), 5) + 3864292196;
};
cljs.core.m3_fmix = function m3_fmix(h1, len) {
  var h1__$1 = h1;
  var h1__$2 = h1__$1 ^ len;
  var h1__$3 = h1__$2 ^ h1__$2 >>> 16;
  var h1__$4 = cljs.core.imul.call(null, h1__$3, 2246822507);
  var h1__$5 = h1__$4 ^ h1__$4 >>> 13;
  var h1__$6 = cljs.core.imul.call(null, h1__$5, 3266489909);
  var h1__$7 = h1__$6 ^ h1__$6 >>> 16;
  return h1__$7;
};
cljs.core.m3_hash_int = function m3_hash_int(in$) {
  if (in$ === 0) {
    return in$;
  } else {
    var k1 = cljs.core.m3_mix_K1.call(null, in$);
    var h1 = cljs.core.m3_mix_H1.call(null, cljs.core.m3_seed, k1);
    return cljs.core.m3_fmix.call(null, h1, 4);
  }
};
cljs.core.m3_hash_unencoded_chars = function m3_hash_unencoded_chars(in$) {
  var h1 = function() {
    var i = 1;
    var h1 = cljs.core.m3_seed;
    while (true) {
      if (i < in$.length) {
        var G__56242 = i + 2;
        var G__56243 = cljs.core.m3_mix_H1.call(null, h1, cljs.core.m3_mix_K1.call(null, in$.charCodeAt(i - 1) | in$.charCodeAt(i) << 16));
        i = G__56242;
        h1 = G__56243;
        continue;
      } else {
        return h1;
      }
      break;
    }
  }();
  var h1__$1 = (in$.length & 1) === 1 ? h1 ^ cljs.core.m3_mix_K1.call(null, in$.charCodeAt(in$.length - 1)) : h1;
  return cljs.core.m3_fmix.call(null, h1__$1, cljs.core.imul.call(null, 2, in$.length));
};
cljs.core.string_hash_cache = function() {
  var obj56245 = {};
  return obj56245;
}();
cljs.core.string_hash_cache_count = 0;
cljs.core.hash_string_STAR_ = function hash_string_STAR_(s) {
  if (!(s == null)) {
    var len = s.length;
    if (len > 0) {
      var i = 0;
      var hash = 0;
      while (true) {
        if (i < len) {
          var G__56246 = i + 1;
          var G__56247 = cljs.core.imul.call(null, 31, hash) + s.charCodeAt(i);
          i = G__56246;
          hash = G__56247;
          continue;
        } else {
          return hash;
        }
        break;
      }
    } else {
      return 0;
    }
  } else {
    return 0;
  }
};
cljs.core.add_to_string_hash_cache = function add_to_string_hash_cache(k) {
  var h = cljs.core.hash_string_STAR_.call(null, k);
  cljs.core.string_hash_cache[k] = h;
  cljs.core.string_hash_cache_count = cljs.core.string_hash_cache_count + 1;
  return h;
};
cljs.core.hash_string = function hash_string(k) {
  if (cljs.core.string_hash_cache_count > 255) {
    cljs.core.string_hash_cache = function() {
      var obj56251 = {};
      return obj56251;
    }();
    cljs.core.string_hash_cache_count = 0;
  } else {
  }
  var h = cljs.core.string_hash_cache[k];
  if (typeof h === "number") {
    return h;
  } else {
    return cljs.core.add_to_string_hash_cache.call(null, k);
  }
};
cljs.core.hash = function hash(o) {
  if (function() {
    var G__56253 = o;
    if (G__56253) {
      var bit__4295__auto__ = G__56253.cljs$lang$protocol_mask$partition0$ & 4194304;
      if (bit__4295__auto__ || G__56253.cljs$core$IHash$) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }()) {
    return cljs.core._hash.call(null, o);
  } else {
    if (typeof o === "number") {
      return Math.floor.call(null, o) % 2147483647;
    } else {
      if (o === true) {
        return 1;
      } else {
        if (o === false) {
          return 0;
        } else {
          if (typeof o === "string") {
            return cljs.core.m3_hash_int.call(null, cljs.core.hash_string.call(null, o));
          } else {
            if (o == null) {
              return 0;
            } else {
              return cljs.core._hash.call(null, o);
            }
          }
        }
      }
    }
  }
};
cljs.core.hash_combine = function hash_combine(seed, hash) {
  return seed ^ hash + 2654435769 + (seed << 6) + (seed >> 2);
};
cljs.core.instance_QMARK_ = function instance_QMARK_(t, o) {
  return o instanceof t;
};
cljs.core.symbol_QMARK_ = function symbol_QMARK_(x) {
  return x instanceof cljs.core.Symbol;
};
cljs.core.hash_symbol = function hash_symbol(sym) {
  return cljs.core.hash_combine.call(null, cljs.core.m3_hash_unencoded_chars.call(null, sym.name), cljs.core.hash_string.call(null, sym.ns));
};
cljs.core.compare_symbols = function compare_symbols(a, b) {
  if (cljs.core.truth_(cljs.core._EQ_.call(null, a, b))) {
    return 0;
  } else {
    if (cljs.core.truth_(function() {
      var and__3627__auto__ = cljs.core.not.call(null, a.ns);
      if (and__3627__auto__) {
        return b.ns;
      } else {
        return and__3627__auto__;
      }
    }())) {
      return-1;
    } else {
      if (cljs.core.truth_(a.ns)) {
        if (cljs.core.not.call(null, b.ns)) {
          return 1;
        } else {
          var nsc = cljs.core.compare.call(null, a.ns, b.ns);
          if (nsc === 0) {
            return cljs.core.compare.call(null, a.name, b.name);
          } else {
            return nsc;
          }
        }
      } else {
        return cljs.core.compare.call(null, a.name, b.name);
      }
    }
  }
};
cljs.core.Symbol = function(ns, name, str, _hash, _meta) {
  this.ns = ns;
  this.name = name;
  this.str = str;
  this._hash = _hash;
  this._meta = _meta;
  this.cljs$lang$protocol_mask$partition0$ = 2154168321;
  this.cljs$lang$protocol_mask$partition1$ = 4096;
};
cljs.core.Symbol.cljs$lang$type = true;
cljs.core.Symbol.cljs$lang$ctorStr = "cljs.core/Symbol";
cljs.core.Symbol.cljs$lang$ctorPrWriter = function(this__4215__auto__, writer__4216__auto__, opt__4217__auto__) {
  return cljs.core._write.call(null, writer__4216__auto__, "cljs.core/Symbol");
};
cljs.core.Symbol.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(o, writer, _) {
  var self__ = this;
  var o__$1 = this;
  return cljs.core._write.call(null, writer, self__.str);
};
cljs.core.Symbol.prototype.cljs$core$INamed$_name$arity$1 = function(_) {
  var self__ = this;
  var ___$1 = this;
  return self__.name;
};
cljs.core.Symbol.prototype.cljs$core$INamed$_namespace$arity$1 = function(_) {
  var self__ = this;
  var ___$1 = this;
  return self__.ns;
};
cljs.core.Symbol.prototype.cljs$core$IHash$_hash$arity$1 = function(sym) {
  var self__ = this;
  var sym__$1 = this;
  var h__4050__auto__ = self__._hash;
  if (!(h__4050__auto__ == null)) {
    return h__4050__auto__;
  } else {
    var h__4050__auto____$1 = cljs.core.hash_symbol.call(null, sym__$1);
    self__._hash = h__4050__auto____$1;
    return h__4050__auto____$1;
  }
};
cljs.core.Symbol.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(_, new_meta) {
  var self__ = this;
  var ___$1 = this;
  return new cljs.core.Symbol(self__.ns, self__.name, self__.str, self__._hash, new_meta);
};
cljs.core.Symbol.prototype.cljs$core$IMeta$_meta$arity$1 = function(_) {
  var self__ = this;
  var ___$1 = this;
  return self__._meta;
};
cljs.core.Symbol.prototype.call = function() {
  var G__56255 = null;
  var G__56255__2 = function(self__, coll) {
    var self__ = this;
    var self____$1 = this;
    var sym = self____$1;
    return cljs.core._lookup.call(null, coll, sym, null);
  };
  var G__56255__3 = function(self__, coll, not_found) {
    var self__ = this;
    var self____$1 = this;
    var sym = self____$1;
    return cljs.core._lookup.call(null, coll, sym, not_found);
  };
  G__56255 = function(self__, coll, not_found) {
    switch(arguments.length) {
      case 2:
        return G__56255__2.call(this, self__, coll);
      case 3:
        return G__56255__3.call(this, self__, coll, not_found);
    }
    throw new Error("Invalid arity: " + arguments.length);
  };
  G__56255.cljs$core$IFn$_invoke$arity$2 = G__56255__2;
  G__56255.cljs$core$IFn$_invoke$arity$3 = G__56255__3;
  return G__56255;
}();
cljs.core.Symbol.prototype.apply = function(self__, args56254) {
  var self__ = this;
  var self____$1 = this;
  return self____$1.call.apply(self____$1, [self____$1].concat(cljs.core.aclone.call(null, args56254)));
};
cljs.core.Symbol.prototype.cljs$core$IFn$_invoke$arity$1 = function(coll) {
  var self__ = this;
  var sym = this;
  return cljs.core._lookup.call(null, coll, sym, null);
};
cljs.core.Symbol.prototype.cljs$core$IFn$_invoke$arity$2 = function(coll, not_found) {
  var self__ = this;
  var sym = this;
  return cljs.core._lookup.call(null, coll, sym, not_found);
};
cljs.core.Symbol.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(_, other) {
  var self__ = this;
  var ___$1 = this;
  if (other instanceof cljs.core.Symbol) {
    return self__.str === other.str;
  } else {
    return false;
  }
};
cljs.core.Symbol.prototype.toString = function() {
  var self__ = this;
  var _ = this;
  return self__.str;
};
cljs.core.Symbol.prototype.equiv = function(other) {
  var self__ = this;
  var this$ = this;
  return this$.cljs$core$IEquiv$_equiv$arity$2(null, other);
};
cljs.core.__GT_Symbol = function __GT_Symbol(ns, name, str, _hash, _meta) {
  return new cljs.core.Symbol(ns, name, str, _hash, _meta);
};
cljs.core.symbol = function() {
  var symbol = null;
  var symbol__1 = function(name) {
    if (name instanceof cljs.core.Symbol) {
      return name;
    } else {
      return symbol.call(null, null, name);
    }
  };
  var symbol__2 = function(ns, name) {
    var sym_str = !(ns == null) ? "" + cljs.core.str.cljs$core$IFn$_invoke$arity$1(ns) + "/" + cljs.core.str.cljs$core$IFn$_invoke$arity$1(name) : name;
    return new cljs.core.Symbol(ns, name, sym_str, null, null);
  };
  symbol = function(ns, name) {
    switch(arguments.length) {
      case 1:
        return symbol__1.call(this, ns);
      case 2:
        return symbol__2.call(this, ns, name);
    }
    throw new Error("Invalid arity: " + arguments.length);
  };
  symbol.cljs$core$IFn$_invoke$arity$1 = symbol__1;
  symbol.cljs$core$IFn$_invoke$arity$2 = symbol__2;
  return symbol;
}();
cljs.core.iterable_QMARK_ = function iterable_QMARK_(x) {
  var G__56257 = x;
  if (G__56257) {
    var bit__4302__auto__ = null;
    if (cljs.core.truth_(function() {
      var or__3639__auto__ = bit__4302__auto__;
      if (cljs.core.truth_(or__3639__auto__)) {
        return or__3639__auto__;
      } else {
        return G__56257.cljs$core$IIterable$;
      }
    }())) {
      return true;
    } else {
      if (!G__56257.cljs$lang$protocol_mask$partition$) {
        return cljs.core.native_satisfies_QMARK_.call(null, cljs.core.IIterable, G__56257);
      } else {
        return false;
      }
    }
  } else {
    return cljs.core.native_satisfies_QMARK_.call(null, cljs.core.IIterable, G__56257);
  }
};
cljs.core.clone = function clone(value) {
  return cljs.core._clone.call(null, value);
};
cljs.core.cloneable_QMARK_ = function cloneable_QMARK_(value) {
  var G__56259 = value;
  if (G__56259) {
    var bit__4302__auto__ = G__56259.cljs$lang$protocol_mask$partition1$ & 8192;
    if (bit__4302__auto__ || G__56259.cljs$core$ICloneable$) {
      return true;
    } else {
      if (!G__56259.cljs$lang$protocol_mask$partition1$) {
        return cljs.core.native_satisfies_QMARK_.call(null, cljs.core.ICloneable, G__56259);
      } else {
        return false;
      }
    }
  } else {
    return cljs.core.native_satisfies_QMARK_.call(null, cljs.core.ICloneable, G__56259);
  }
};
cljs.core.seq = function seq(coll) {
  if (coll == null) {
    return null;
  } else {
    if (function() {
      var G__56261 = coll;
      if (G__56261) {
        var bit__4295__auto__ = G__56261.cljs$lang$protocol_mask$partition0$ & 8388608;
        if (bit__4295__auto__ || G__56261.cljs$core$ISeqable$) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    }()) {
      return cljs.core._seq.call(null, coll);
    } else {
      if (coll instanceof Array) {
        if (coll.length === 0) {
          return null;
        } else {
          return new cljs.core.IndexedSeq(coll, 0);
        }
      } else {
        if (typeof coll === "string") {
          if (coll.length === 0) {
            return null;
          } else {
            return new cljs.core.IndexedSeq(coll, 0);
          }
        } else {
          if (cljs.core.native_satisfies_QMARK_.call(null, cljs.core.ISeqable, coll)) {
            return cljs.core._seq.call(null, coll);
          } else {
            throw new Error("" + cljs.core.str.cljs$core$IFn$_invoke$arity$1(coll) + " is not ISeqable");
          }
        }
      }
    }
  }
};
cljs.core.first = function first(coll) {
  if (coll == null) {
    return null;
  } else {
    if (function() {
      var G__56263 = coll;
      if (G__56263) {
        var bit__4295__auto__ = G__56263.cljs$lang$protocol_mask$partition0$ & 64;
        if (bit__4295__auto__ || G__56263.cljs$core$ISeq$) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    }()) {
      return cljs.core._first.call(null, coll);
    } else {
      var s = cljs.core.seq.call(null, coll);
      if (s == null) {
        return null;
      } else {
        return cljs.core._first.call(null, s);
      }
    }
  }
};
cljs.core.rest = function rest(coll) {
  if (!(coll == null)) {
    if (function() {
      var G__56265 = coll;
      if (G__56265) {
        var bit__4295__auto__ = G__56265.cljs$lang$protocol_mask$partition0$ & 64;
        if (bit__4295__auto__ || G__56265.cljs$core$ISeq$) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    }()) {
      return cljs.core._rest.call(null, coll);
    } else {
      var s = cljs.core.seq.call(null, coll);
      if (s) {
        return cljs.core._rest.call(null, s);
      } else {
        return cljs.core.List.EMPTY;
      }
    }
  } else {
    return cljs.core.List.EMPTY;
  }
};
cljs.core.next = function next(coll) {
  if (coll == null) {
    return null;
  } else {
    if (function() {
      var G__56267 = coll;
      if (G__56267) {
        var bit__4295__auto__ = G__56267.cljs$lang$protocol_mask$partition0$ & 128;
        if (bit__4295__auto__ || G__56267.cljs$core$INext$) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    }()) {
      return cljs.core._next.call(null, coll);
    } else {
      return cljs.core.seq.call(null, cljs.core.rest.call(null, coll));
    }
  }
};
cljs.core._EQ_ = function() {
  var _EQ_ = null;
  var _EQ___1 = function(x) {
    return true;
  };
  var _EQ___2 = function(x, y) {
    if (x == null) {
      return y == null;
    } else {
      return x === y || cljs.core._equiv.call(null, x, y);
    }
  };
  var _EQ___3 = function() {
    var G__56268__delegate = function(x, y, more) {
      while (true) {
        if (_EQ_.call(null, x, y)) {
          if (cljs.core.next.call(null, more)) {
            var G__56269 = y;
            var G__56270 = cljs.core.first.call(null, more);
            var G__56271 = cljs.core.next.call(null, more);
            x = G__56269;
            y = G__56270;
            more = G__56271;
            continue;
          } else {
            return _EQ_.call(null, y, cljs.core.first.call(null, more));
          }
        } else {
          return false;
        }
        break;
      }
    };
    var G__56268 = function(x, y, var_args) {
      var more = null;
      if (arguments.length > 2) {
        more = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0);
      }
      return G__56268__delegate.call(this, x, y, more);
    };
    G__56268.cljs$lang$maxFixedArity = 2;
    G__56268.cljs$lang$applyTo = function(arglist__56272) {
      var x = cljs.core.first(arglist__56272);
      arglist__56272 = cljs.core.next(arglist__56272);
      var y = cljs.core.first(arglist__56272);
      var more = cljs.core.rest(arglist__56272);
      return G__56268__delegate(x, y, more);
    };
    G__56268.cljs$core$IFn$_invoke$arity$variadic = G__56268__delegate;
    return G__56268;
  }();
  _EQ_ = function(x, y, var_args) {
    var more = var_args;
    switch(arguments.length) {
      case 1:
        return _EQ___1.call(this, x);
      case 2:
        return _EQ___2.call(this, x, y);
      default:
        return _EQ___3.cljs$core$IFn$_invoke$arity$variadic(x, y, cljs.core.array_seq(arguments, 2));
    }
    throw new Error("Invalid arity: " + arguments.length);
  };
  _EQ_.cljs$lang$maxFixedArity = 2;
  _EQ_.cljs$lang$applyTo = _EQ___3.cljs$lang$applyTo;
  _EQ_.cljs$core$IFn$_invoke$arity$1 = _EQ___1;
  _EQ_.cljs$core$IFn$_invoke$arity$2 = _EQ___2;
  _EQ_.cljs$core$IFn$_invoke$arity$variadic = _EQ___3.cljs$core$IFn$_invoke$arity$variadic;
  return _EQ_;
}();
cljs.core.mix_collection_hash = function mix_collection_hash(hash_basis, count) {
  var h1 = cljs.core.m3_seed;
  var k1 = cljs.core.m3_mix_K1.call(null, hash_basis);
  var h1__$1 = cljs.core.m3_mix_H1.call(null, h1, k1);
  return cljs.core.m3_fmix.call(null, h1__$1, count);
};
cljs.core.hash_ordered_coll = function hash_ordered_coll(coll) {
  var n = 0;
  var hash_code = 1;
  var coll__$1 = cljs.core.seq.call(null, coll);
  while (true) {
    if (!(coll__$1 == null)) {
      var G__56273 = n + 1;
      var G__56274 = cljs.core.imul.call(null, 31, hash_code) + cljs.core.hash.call(null, cljs.core.first.call(null, coll__$1)) | 0;
      var G__56275 = cljs.core.next.call(null, coll__$1);
      n = G__56273;
      hash_code = G__56274;
      coll__$1 = G__56275;
      continue;
    } else {
      return cljs.core.mix_collection_hash.call(null, hash_code, n);
    }
    break;
  }
};
cljs.core.hash_unordered_coll = function hash_unordered_coll(coll) {
  var n = 0;
  var hash_code = 0;
  var coll__$1 = cljs.core.seq.call(null, coll);
  while (true) {
    if (!(coll__$1 == null)) {
      var G__56276 = n + 1;
      var G__56277 = hash_code + cljs.core.hash.call(null, cljs.core.first.call(null, coll__$1)) | 0;
      var G__56278 = cljs.core.next.call(null, coll__$1);
      n = G__56276;
      hash_code = G__56277;
      coll__$1 = G__56278;
      continue;
    } else {
      return cljs.core.mix_collection_hash.call(null, hash_code, n);
    }
    break;
  }
};
cljs.core.ICounted["null"] = true;
cljs.core._count["null"] = function(_) {
  return 0;
};
Date.prototype.cljs$core$IEquiv$ = true;
Date.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(o, other) {
  var o__$1 = this;
  return other instanceof Date && o__$1.toString() === other.toString();
};
cljs.core.IEquiv["number"] = true;
cljs.core._equiv["number"] = function(x, o) {
  return x === o;
};
cljs.core.IMeta["function"] = true;
cljs.core._meta["function"] = function(_) {
  return null;
};
cljs.core.Fn["function"] = true;
cljs.core.IHash["_"] = true;
cljs.core._hash["_"] = function(o) {
  return goog.getUid(o);
};
cljs.core.inc = function inc(x) {
  return x + 1;
};
cljs.core.Reduced = function(val) {
  this.val = val;
  this.cljs$lang$protocol_mask$partition1$ = 0;
  this.cljs$lang$protocol_mask$partition0$ = 32768;
};
cljs.core.Reduced.cljs$lang$type = true;
cljs.core.Reduced.cljs$lang$ctorStr = "cljs.core/Reduced";
cljs.core.Reduced.cljs$lang$ctorPrWriter = function(this__4215__auto__, writer__4216__auto__, opt__4217__auto__) {
  return cljs.core._write.call(null, writer__4216__auto__, "cljs.core/Reduced");
};
cljs.core.Reduced.prototype.cljs$core$IDeref$_deref$arity$1 = function(o) {
  var self__ = this;
  var o__$1 = this;
  return self__.val;
};
cljs.core.__GT_Reduced = function __GT_Reduced(val) {
  return new cljs.core.Reduced(val);
};
cljs.core.reduced = function reduced(x) {
  return new cljs.core.Reduced(x);
};
cljs.core.reduced_QMARK_ = function reduced_QMARK_(r) {
  return r instanceof cljs.core.Reduced;
};
cljs.core.deref = function deref(o) {
  return cljs.core._deref.call(null, o);
};
cljs.core.ci_reduce = function() {
  var ci_reduce = null;
  var ci_reduce__2 = function(cicoll, f) {
    var cnt = cljs.core._count.call(null, cicoll);
    if (cnt === 0) {
      return f.call(null);
    } else {
      var val = cljs.core._nth.call(null, cicoll, 0);
      var n = 1;
      while (true) {
        if (n < cnt) {
          var nval = f.call(null, val, cljs.core._nth.call(null, cicoll, n));
          if (cljs.core.reduced_QMARK_.call(null, nval)) {
            return cljs.core.deref.call(null, nval);
          } else {
            var G__56279 = nval;
            var G__56280 = n + 1;
            val = G__56279;
            n = G__56280;
            continue;
          }
        } else {
          return val;
        }
        break;
      }
    }
  };
  var ci_reduce__3 = function(cicoll, f, val) {
    var cnt = cljs.core._count.call(null, cicoll);
    var val__$1 = val;
    var n = 0;
    while (true) {
      if (n < cnt) {
        var nval = f.call(null, val__$1, cljs.core._nth.call(null, cicoll, n));
        if (cljs.core.reduced_QMARK_.call(null, nval)) {
          return cljs.core.deref.call(null, nval);
        } else {
          var G__56281 = nval;
          var G__56282 = n + 1;
          val__$1 = G__56281;
          n = G__56282;
          continue;
        }
      } else {
        return val__$1;
      }
      break;
    }
  };
  var ci_reduce__4 = function(cicoll, f, val, idx) {
    var cnt = cljs.core._count.call(null, cicoll);
    var val__$1 = val;
    var n = idx;
    while (true) {
      if (n < cnt) {
        var nval = f.call(null, val__$1, cljs.core._nth.call(null, cicoll, n));
        if (cljs.core.reduced_QMARK_.call(null, nval)) {
          return cljs.core.deref.call(null, nval);
        } else {
          var G__56283 = nval;
          var G__56284 = n + 1;
          val__$1 = G__56283;
          n = G__56284;
          continue;
        }
      } else {
        return val__$1;
      }
      break;
    }
  };
  ci_reduce = function(cicoll, f, val, idx) {
    switch(arguments.length) {
      case 2:
        return ci_reduce__2.call(this, cicoll, f);
      case 3:
        return ci_reduce__3.call(this, cicoll, f, val);
      case 4:
        return ci_reduce__4.call(this, cicoll, f, val, idx);
    }
    throw new Error("Invalid arity: " + arguments.length);
  };
  ci_reduce.cljs$core$IFn$_invoke$arity$2 = ci_reduce__2;
  ci_reduce.cljs$core$IFn$_invoke$arity$3 = ci_reduce__3;
  ci_reduce.cljs$core$IFn$_invoke$arity$4 = ci_reduce__4;
  return ci_reduce;
}();
cljs.core.array_reduce = function() {
  var array_reduce = null;
  var array_reduce__2 = function(arr, f) {
    var cnt = arr.length;
    if (arr.length === 0) {
      return f.call(null);
    } else {
      var val = arr[0];
      var n = 1;
      while (true) {
        if (n < cnt) {
          var nval = f.call(null, val, arr[n]);
          if (cljs.core.reduced_QMARK_.call(null, nval)) {
            return cljs.core.deref.call(null, nval);
          } else {
            var G__56285 = nval;
            var G__56286 = n + 1;
            val = G__56285;
            n = G__56286;
            continue;
          }
        } else {
          return val;
        }
        break;
      }
    }
  };
  var array_reduce__3 = function(arr, f, val) {
    var cnt = arr.length;
    var val__$1 = val;
    var n = 0;
    while (true) {
      if (n < cnt) {
        var nval = f.call(null, val__$1, arr[n]);
        if (cljs.core.reduced_QMARK_.call(null, nval)) {
          return cljs.core.deref.call(null, nval);
        } else {
          var G__56287 = nval;
          var G__56288 = n + 1;
          val__$1 = G__56287;
          n = G__56288;
          continue;
        }
      } else {
        return val__$1;
      }
      break;
    }
  };
  var array_reduce__4 = function(arr, f, val, idx) {
    var cnt = arr.length;
    var val__$1 = val;
    var n = idx;
    while (true) {
      if (n < cnt) {
        var nval = f.call(null, val__$1, arr[n]);
        if (cljs.core.reduced_QMARK_.call(null, nval)) {
          return cljs.core.deref.call(null, nval);
        } else {
          var G__56289 = nval;
          var G__56290 = n + 1;
          val__$1 = G__56289;
          n = G__56290;
          continue;
        }
      } else {
        return val__$1;
      }
      break;
    }
  };
  array_reduce = function(arr, f, val, idx) {
    switch(arguments.length) {
      case 2:
        return array_reduce__2.call(this, arr, f);
      case 3:
        return array_reduce__3.call(this, arr, f, val);
      case 4:
        return array_reduce__4.call(this, arr, f, val, idx);
    }
    throw new Error("Invalid arity: " + arguments.length);
  };
  array_reduce.cljs$core$IFn$_invoke$arity$2 = array_reduce__2;
  array_reduce.cljs$core$IFn$_invoke$arity$3 = array_reduce__3;
  array_reduce.cljs$core$IFn$_invoke$arity$4 = array_reduce__4;
  return array_reduce;
}();
cljs.core.counted_QMARK_ = function counted_QMARK_(x) {
  var G__56292 = x;
  if (G__56292) {
    var bit__4302__auto__ = G__56292.cljs$lang$protocol_mask$partition0$ & 2;
    if (bit__4302__auto__ || G__56292.cljs$core$ICounted$) {
      return true;
    } else {
      if (!G__56292.cljs$lang$protocol_mask$partition0$) {
        return cljs.core.native_satisfies_QMARK_.call(null, cljs.core.ICounted, G__56292);
      } else {
        return false;
      }
    }
  } else {
    return cljs.core.native_satisfies_QMARK_.call(null, cljs.core.ICounted, G__56292);
  }
};
cljs.core.indexed_QMARK_ = function indexed_QMARK_(x) {
  var G__56294 = x;
  if (G__56294) {
    var bit__4302__auto__ = G__56294.cljs$lang$protocol_mask$partition0$ & 16;
    if (bit__4302__auto__ || G__56294.cljs$core$IIndexed$) {
      return true;
    } else {
      if (!G__56294.cljs$lang$protocol_mask$partition0$) {
        return cljs.core.native_satisfies_QMARK_.call(null, cljs.core.IIndexed, G__56294);
      } else {
        return false;
      }
    }
  } else {
    return cljs.core.native_satisfies_QMARK_.call(null, cljs.core.IIndexed, G__56294);
  }
};
cljs.core.IndexedSeq = function(arr, i) {
  this.arr = arr;
  this.i = i;
  this.cljs$lang$protocol_mask$partition0$ = 166199550;
  this.cljs$lang$protocol_mask$partition1$ = 8192;
};
cljs.core.IndexedSeq.cljs$lang$type = true;
cljs.core.IndexedSeq.cljs$lang$ctorStr = "cljs.core/IndexedSeq";
cljs.core.IndexedSeq.cljs$lang$ctorPrWriter = function(this__4215__auto__, writer__4216__auto__, opt__4217__auto__) {
  return cljs.core._write.call(null, writer__4216__auto__, "cljs.core/IndexedSeq");
};
cljs.core.IndexedSeq.prototype.toString = function() {
  var self__ = this;
  var coll = this;
  return cljs.core.pr_str_STAR_.call(null, coll);
};
cljs.core.IndexedSeq.prototype.equiv = function(other) {
  var self__ = this;
  var this$ = this;
  return this$.cljs$core$IEquiv$_equiv$arity$2(null, other);
};
cljs.core.IndexedSeq.prototype.cljs$core$IIndexed$_nth$arity$2 = function(coll, n) {
  var self__ = this;
  var coll__$1 = this;
  var i__$1 = n + self__.i;
  if (i__$1 < self__.arr.length) {
    return self__.arr[i__$1];
  } else {
    return null;
  }
};
cljs.core.IndexedSeq.prototype.cljs$core$IIndexed$_nth$arity$3 = function(coll, n, not_found) {
  var self__ = this;
  var coll__$1 = this;
  var i__$1 = n + self__.i;
  if (i__$1 < self__.arr.length) {
    return self__.arr[i__$1];
  } else {
    return not_found;
  }
};
cljs.core.IndexedSeq.prototype.cljs$core$ICloneable$_clone$arity$1 = function(_) {
  var self__ = this;
  var ___$1 = this;
  return new cljs.core.IndexedSeq(self__.arr, self__.i);
};
cljs.core.IndexedSeq.prototype.cljs$core$INext$_next$arity$1 = function(_) {
  var self__ = this;
  var ___$1 = this;
  if (self__.i + 1 < self__.arr.length) {
    return new cljs.core.IndexedSeq(self__.arr, self__.i + 1);
  } else {
    return null;
  }
};
cljs.core.IndexedSeq.prototype.cljs$core$ICounted$_count$arity$1 = function(_) {
  var self__ = this;
  var ___$1 = this;
  return self__.arr.length - self__.i;
};
cljs.core.IndexedSeq.prototype.cljs$core$IReversible$_rseq$arity$1 = function(coll) {
  var self__ = this;
  var coll__$1 = this;
  var c = cljs.core._count.call(null, coll__$1);
  if (c > 0) {
    return new cljs.core.RSeq(coll__$1, c - 1, null);
  } else {
    return null;
  }
};
cljs.core.IndexedSeq.prototype.cljs$core$IHash$_hash$arity$1 = function(coll) {
  var self__ = this;
  var coll__$1 = this;
  return cljs.core.hash_ordered_coll.call(null, coll__$1);
};
cljs.core.IndexedSeq.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(coll, other) {
  var self__ = this;
  var coll__$1 = this;
  return cljs.core.equiv_sequential.call(null, coll__$1, other);
};
cljs.core.IndexedSeq.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(coll) {
  var self__ = this;
  var coll__$1 = this;
  return cljs.core.List.EMPTY;
};
cljs.core.IndexedSeq.prototype.cljs$core$IReduce$_reduce$arity$2 = function(coll, f) {
  var self__ = this;
  var coll__$1 = this;
  return cljs.core.array_reduce.call(null, self__.arr, f, self__.arr[self__.i], self__.i + 1);
};
cljs.core.IndexedSeq.prototype.cljs$core$IReduce$_reduce$arity$3 = function(coll, f, start) {
  var self__ = this;
  var coll__$1 = this;
  return cljs.core.array_reduce.call(null, self__.arr, f, start, self__.i);
};
cljs.core.IndexedSeq.prototype.cljs$core$ISeq$_first$arity$1 = function(_) {
  var self__ = this;
  var ___$1 = this;
  return self__.arr[self__.i];
};
cljs.core.IndexedSeq.prototype.cljs$core$ISeq$_rest$arity$1 = function(_) {
  var self__ = this;
  var ___$1 = this;
  if (self__.i + 1 < self__.arr.length) {
    return new cljs.core.IndexedSeq(self__.arr, self__.i + 1);
  } else {
    return cljs.core.List.EMPTY;
  }
};
cljs.core.IndexedSeq.prototype.cljs$core$ISeqable$_seq$arity$1 = function(this$) {
  var self__ = this;
  var this$__$1 = this;
  return this$__$1;
};
cljs.core.IndexedSeq.prototype.cljs$core$ICollection$_conj$arity$2 = function(coll, o) {
  var self__ = this;
  var coll__$1 = this;
  return cljs.core.cons.call(null, o, coll__$1);
};
cljs.core.__GT_IndexedSeq = function __GT_IndexedSeq(arr, i) {
  return new cljs.core.IndexedSeq(arr, i);
};
cljs.core.prim_seq = function() {
  var prim_seq = null;
  var prim_seq__1 = function(prim) {
    return prim_seq.call(null, prim, 0);
  };
  var prim_seq__2 = function(prim, i) {
    if (i < prim.length) {
      return new cljs.core.IndexedSeq(prim, i);
    } else {
      return null;
    }
  };
  prim_seq = function(prim, i) {
    switch(arguments.length) {
      case 1:
        return prim_seq__1.call(this, prim);
      case 2:
        return prim_seq__2.call(this, prim, i);
    }
    throw new Error("Invalid arity: " + arguments.length);
  };
  prim_seq.cljs$core$IFn$_invoke$arity$1 = prim_seq__1;
  prim_seq.cljs$core$IFn$_invoke$arity$2 = prim_seq__2;
  return prim_seq;
}();
cljs.core.array_seq = function() {
  var array_seq = null;
  var array_seq__1 = function(array) {
    return cljs.core.prim_seq.call(null, array, 0);
  };
  var array_seq__2 = function(array, i) {
    return cljs.core.prim_seq.call(null, array, i);
  };
  array_seq = function(array, i) {
    switch(arguments.length) {
      case 1:
        return array_seq__1.call(this, array);
      case 2:
        return array_seq__2.call(this, array, i);
    }
    throw new Error("Invalid arity: " + arguments.length);
  };
  array_seq.cljs$core$IFn$_invoke$arity$1 = array_seq__1;
  array_seq.cljs$core$IFn$_invoke$arity$2 = array_seq__2;
  return array_seq;
}();
cljs.core.RSeq = function(ci, i, meta) {
  this.ci = ci;
  this.i = i;
  this.meta = meta;
  this.cljs$lang$protocol_mask$partition0$ = 32374990;
  this.cljs$lang$protocol_mask$partition1$ = 8192;
};
cljs.core.RSeq.cljs$lang$type = true;
cljs.core.RSeq.cljs$lang$ctorStr = "cljs.core/RSeq";
cljs.core.RSeq.cljs$lang$ctorPrWriter = function(this__4215__auto__, writer__4216__auto__, opt__4217__auto__) {
  return cljs.core._write.call(null, writer__4216__auto__, "cljs.core/RSeq");
};
cljs.core.RSeq.prototype.toString = function() {
  var self__ = this;
  var coll = this;
  return cljs.core.pr_str_STAR_.call(null, coll);
};
cljs.core.RSeq.prototype.equiv = function(other) {
  var self__ = this;
  var this$ = this;
  return this$.cljs$core$IEquiv$_equiv$arity$2(null, other);
};
cljs.core.RSeq.prototype.cljs$core$IMeta$_meta$arity$1 = function(coll) {
  var self__ = this;
  var coll__$1 = this;
  return self__.meta;
};
cljs.core.RSeq.prototype.cljs$core$ICloneable$_clone$arity$1 = function(_) {
  var self__ = this;
  var ___$1 = this;
  return new cljs.core.RSeq(self__.ci, self__.i, self__.meta);
};
cljs.core.RSeq.prototype.cljs$core$INext$_next$arity$1 = function(coll) {
  var self__ = this;
  var coll__$1 = this;
  if (self__.i > 0) {
    return new cljs.core.RSeq(self__.ci, self__.i - 1, null);
  } else {
    return null;
  }
};
cljs.core.RSeq.prototype.cljs$core$ICounted$_count$arity$1 = function(coll) {
  var self__ = this;
  var coll__$1 = this;
  return self__.i + 1;
};
cljs.core.RSeq.prototype.cljs$core$IHash$_hash$arity$1 = function(coll) {
  var self__ = this;
  var coll__$1 = this;
  return cljs.core.hash_ordered_coll.call(null, coll__$1);
};
cljs.core.RSeq.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(coll, other) {
  var self__ = this;
  var coll__$1 = this;
  return cljs.core.equiv_sequential.call(null, coll__$1, other);
};
cljs.core.RSeq.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(coll) {
  var self__ = this;
  var coll__$1 = this;
  return cljs.core.with_meta.call(null, cljs.core.List.EMPTY, self__.meta);
};
cljs.core.RSeq.prototype.cljs$core$IReduce$_reduce$arity$2 = function(col, f) {
  var self__ = this;
  var col__$1 = this;
  return cljs.core.seq_reduce.call(null, f, col__$1);
};
cljs.core.RSeq.prototype.cljs$core$IReduce$_reduce$arity$3 = function(col, f, start) {
  var self__ = this;
  var col__$1 = this;
  return cljs.core.seq_reduce.call(null, f, start, col__$1);
};
cljs.core.RSeq.prototype.cljs$core$ISeq$_first$arity$1 = function(coll) {
  var self__ = this;
  var coll__$1 = this;
  return cljs.core._nth.call(null, self__.ci, self__.i);
};
cljs.core.RSeq.prototype.cljs$core$ISeq$_rest$arity$1 = function(coll) {
  var self__ = this;
  var coll__$1 = this;
  if (self__.i > 0) {
    return new cljs.core.RSeq(self__.ci, self__.i - 1, null);
  } else {
    return cljs.core.List.EMPTY;
  }
};
cljs.core.RSeq.prototype.cljs$core$ISeqable$_seq$arity$1 = function(coll) {
  var self__ = this;
  var coll__$1 = this;
  return coll__$1;
};
cljs.core.RSeq.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(coll, new_meta) {
  var self__ = this;
  var coll__$1 = this;
  return new cljs.core.RSeq(self__.ci, self__.i, new_meta);
};
cljs.core.RSeq.prototype.cljs$core$ICollection$_conj$arity$2 = function(coll, o) {
  var self__ = this;
  var coll__$1 = this;
  return cljs.core.cons.call(null, o, coll__$1);
};
cljs.core.__GT_RSeq = function __GT_RSeq(ci, i, meta) {
  return new cljs.core.RSeq(ci, i, meta);
};
cljs.core.second = function second(coll) {
  return cljs.core.first.call(null, cljs.core.next.call(null, coll));
};
cljs.core.ffirst = function ffirst(coll) {
  return cljs.core.first.call(null, cljs.core.first.call(null, coll));
};
cljs.core.nfirst = function nfirst(coll) {
  return cljs.core.next.call(null, cljs.core.first.call(null, coll));
};
cljs.core.fnext = function fnext(coll) {
  return cljs.core.first.call(null, cljs.core.next.call(null, coll));
};
cljs.core.nnext = function nnext(coll) {
  return cljs.core.next.call(null, cljs.core.next.call(null, coll));
};
cljs.core.last = function last(s) {
  while (true) {
    var sn = cljs.core.next.call(null, s);
    if (!(sn == null)) {
      var G__56295 = sn;
      s = G__56295;
      continue;
    } else {
      return cljs.core.first.call(null, s);
    }
    break;
  }
};
cljs.core.IEquiv["_"] = true;
cljs.core._equiv["_"] = function(x, o) {
  return x === o;
};
cljs.core.conj = function() {
  var conj = null;
  var conj__0 = function() {
    return cljs.core.PersistentVector.EMPTY;
  };
  var conj__1 = function(coll) {
    return coll;
  };
  var conj__2 = function(coll, x) {
    if (!(coll == null)) {
      return cljs.core._conj.call(null, coll, x);
    } else {
      return cljs.core._conj.call(null, cljs.core.List.EMPTY, x);
    }
  };
  var conj__3 = function() {
    var G__56296__delegate = function(coll, x, xs) {
      while (true) {
        if (cljs.core.truth_(xs)) {
          var G__56297 = conj.call(null, coll, x);
          var G__56298 = cljs.core.first.call(null, xs);
          var G__56299 = cljs.core.next.call(null, xs);
          coll = G__56297;
          x = G__56298;
          xs = G__56299;
          continue;
        } else {
          return conj.call(null, coll, x);
        }
        break;
      }
    };
    var G__56296 = function(coll, x, var_args) {
      var xs = null;
      if (arguments.length > 2) {
        xs = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0);
      }
      return G__56296__delegate.call(this, coll, x, xs);
    };
    G__56296.cljs$lang$maxFixedArity = 2;
    G__56296.cljs$lang$applyTo = function(arglist__56300) {
      var coll = cljs.core.first(arglist__56300);
      arglist__56300 = cljs.core.next(arglist__56300);
      var x = cljs.core.first(arglist__56300);
      var xs = cljs.core.rest(arglist__56300);
      return G__56296__delegate(coll, x, xs);
    };
    G__56296.cljs$core$IFn$_invoke$arity$variadic = G__56296__delegate;
    return G__56296;
  }();
  conj = function(coll, x, var_args) {
    var xs = var_args;
    switch(arguments.length) {
      case 0:
        return conj__0.call(this);
      case 1:
        return conj__1.call(this, coll);
      case 2:
        return conj__2.call(this, coll, x);
      default:
        return conj__3.cljs$core$IFn$_invoke$arity$variadic(coll, x, cljs.core.array_seq(arguments, 2));
    }
    throw new Error("Invalid arity: " + arguments.length);
  };
  conj.cljs$lang$maxFixedArity = 2;
  conj.cljs$lang$applyTo = conj__3.cljs$lang$applyTo;
  conj.cljs$core$IFn$_invoke$arity$0 = conj__0;
  conj.cljs$core$IFn$_invoke$arity$1 = conj__1;
  conj.cljs$core$IFn$_invoke$arity$2 = conj__2;
  conj.cljs$core$IFn$_invoke$arity$variadic = conj__3.cljs$core$IFn$_invoke$arity$variadic;
  return conj;
}();
cljs.core.empty = function empty(coll) {
  if (coll == null) {
    return null;
  } else {
    return cljs.core._empty.call(null, coll);
  }
};
cljs.core.accumulating_seq_count = function accumulating_seq_count(coll) {
  var s = cljs.core.seq.call(null, coll);
  var acc = 0;
  while (true) {
    if (cljs.core.counted_QMARK_.call(null, s)) {
      return acc + cljs.core._count.call(null, s);
    } else {
      var G__56301 = cljs.core.next.call(null, s);
      var G__56302 = acc + 1;
      s = G__56301;
      acc = G__56302;
      continue;
    }
    break;
  }
};
cljs.core.count = function count(coll) {
  if (!(coll == null)) {
    if (function() {
      var G__56304 = coll;
      if (G__56304) {
        var bit__4295__auto__ = G__56304.cljs$lang$protocol_mask$partition0$ & 2;
        if (bit__4295__auto__ || G__56304.cljs$core$ICounted$) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    }()) {
      return cljs.core._count.call(null, coll);
    } else {
      if (coll instanceof Array) {
        return coll.length;
      } else {
        if (typeof coll === "string") {
          return coll.length;
        } else {
          if (cljs.core.native_satisfies_QMARK_.call(null, cljs.core.ICounted, coll)) {
            return cljs.core._count.call(null, coll);
          } else {
            return cljs.core.accumulating_seq_count.call(null, coll);
          }
        }
      }
    }
  } else {
    return 0;
  }
};
cljs.core.linear_traversal_nth = function() {
  var linear_traversal_nth = null;
  var linear_traversal_nth__2 = function(coll, n) {
    while (true) {
      if (coll == null) {
        throw new Error("Index out of bounds");
      } else {
        if (n === 0) {
          if (cljs.core.seq.call(null, coll)) {
            return cljs.core.first.call(null, coll);
          } else {
            throw new Error("Index out of bounds");
          }
        } else {
          if (cljs.core.indexed_QMARK_.call(null, coll)) {
            return cljs.core._nth.call(null, coll, n);
          } else {
            if (cljs.core.seq.call(null, coll)) {
              var G__56305 = cljs.core.next.call(null, coll);
              var G__56306 = n - 1;
              coll = G__56305;
              n = G__56306;
              continue;
            } else {
              throw new Error("Index out of bounds");
            }
          }
        }
      }
      break;
    }
  };
  var linear_traversal_nth__3 = function(coll, n, not_found) {
    while (true) {
      if (coll == null) {
        return not_found;
      } else {
        if (n === 0) {
          if (cljs.core.seq.call(null, coll)) {
            return cljs.core.first.call(null, coll);
          } else {
            return not_found;
          }
        } else {
          if (cljs.core.indexed_QMARK_.call(null, coll)) {
            return cljs.core._nth.call(null, coll, n, not_found);
          } else {
            if (cljs.core.seq.call(null, coll)) {
              var G__56307 = cljs.core.next.call(null, coll);
              var G__56308 = n - 1;
              var G__56309 = not_found;
              coll = G__56307;
              n = G__56308;
              not_found = G__56309;
              continue;
            } else {
              return not_found;
            }
          }
        }
      }
      break;
    }
  };
  linear_traversal_nth = function(coll, n, not_found) {
    switch(arguments.length) {
      case 2:
        return linear_traversal_nth__2.call(this, coll, n);
      case 3:
        return linear_traversal_nth__3.call(this, coll, n, not_found);
    }
    throw new Error("Invalid arity: " + arguments.length);
  };
  linear_traversal_nth.cljs$core$IFn$_invoke$arity$2 = linear_traversal_nth__2;
  linear_traversal_nth.cljs$core$IFn$_invoke$arity$3 = linear_traversal_nth__3;
  return linear_traversal_nth;
}();
cljs.core.nth = function() {
  var nth = null;
  var nth__2 = function(coll, n) {
    if (!(typeof n === "number")) {
      throw new Error("index argument to nth must be a number");
    } else {
      if (coll == null) {
        return coll;
      } else {
        if (function() {
          var G__56314 = coll;
          if (G__56314) {
            var bit__4295__auto__ = G__56314.cljs$lang$protocol_mask$partition0$ & 16;
            if (bit__4295__auto__ || G__56314.cljs$core$IIndexed$) {
              return true;
            } else {
              return false;
            }
          } else {
            return false;
          }
        }()) {
          return cljs.core._nth.call(null, coll, n);
        } else {
          if (coll instanceof Array) {
            if (n < coll.length) {
              return coll[n];
            } else {
              return null;
            }
          } else {
            if (typeof coll === "string") {
              if (n < coll.length) {
                return coll[n];
              } else {
                return null;
              }
            } else {
              if (cljs.core.native_satisfies_QMARK_.call(null, cljs.core.IIndexed, coll)) {
                return cljs.core._nth.call(null, coll, n);
              } else {
                if (function() {
                  var G__56315 = coll;
                  if (G__56315) {
                    var bit__4302__auto__ = G__56315.cljs$lang$protocol_mask$partition0$ & 64;
                    if (bit__4302__auto__ || G__56315.cljs$core$ISeq$) {
                      return true;
                    } else {
                      if (!G__56315.cljs$lang$protocol_mask$partition0$) {
                        return cljs.core.native_satisfies_QMARK_.call(null, cljs.core.ISeq, G__56315);
                      } else {
                        return false;
                      }
                    }
                  } else {
                    return cljs.core.native_satisfies_QMARK_.call(null, cljs.core.ISeq, G__56315);
                  }
                }()) {
                  return cljs.core.linear_traversal_nth.call(null, coll, n);
                } else {
                  throw new Error("nth not supported on this type " + cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs.core.type__GT_str.call(null, cljs.core.type.call(null, coll))));
                }
              }
            }
          }
        }
      }
    }
  };
  var nth__3 = function(coll, n, not_found) {
    if (!(typeof n === "number")) {
      throw new Error("index argument to nth must be a number.");
    } else {
      if (coll == null) {
        return not_found;
      } else {
        if (function() {
          var G__56316 = coll;
          if (G__56316) {
            var bit__4295__auto__ = G__56316.cljs$lang$protocol_mask$partition0$ & 16;
            if (bit__4295__auto__ || G__56316.cljs$core$IIndexed$) {
              return true;
            } else {
              return false;
            }
          } else {
            return false;
          }
        }()) {
          return cljs.core._nth.call(null, coll, n, not_found);
        } else {
          if (coll instanceof Array) {
            if (n < coll.length) {
              return coll[n];
            } else {
              return not_found;
            }
          } else {
            if (typeof coll === "string") {
              if (n < coll.length) {
                return coll[n];
              } else {
                return not_found;
              }
            } else {
              if (cljs.core.native_satisfies_QMARK_.call(null, cljs.core.IIndexed, coll)) {
                return cljs.core._nth.call(null, coll, n);
              } else {
                if (function() {
                  var G__56317 = coll;
                  if (G__56317) {
                    var bit__4302__auto__ = G__56317.cljs$lang$protocol_mask$partition0$ & 64;
                    if (bit__4302__auto__ || G__56317.cljs$core$ISeq$) {
                      return true;
                    } else {
                      if (!G__56317.cljs$lang$protocol_mask$partition0$) {
                        return cljs.core.native_satisfies_QMARK_.call(null, cljs.core.ISeq, G__56317);
                      } else {
                        return false;
                      }
                    }
                  } else {
                    return cljs.core.native_satisfies_QMARK_.call(null, cljs.core.ISeq, G__56317);
                  }
                }()) {
                  return cljs.core.linear_traversal_nth.call(null, coll, n, not_found);
                } else {
                  throw new Error("nth not supported on this type " + cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs.core.type__GT_str.call(null, cljs.core.type.call(null, coll))));
                }
              }
            }
          }
        }
      }
    }
  };
  nth = function(coll, n, not_found) {
    switch(arguments.length) {
      case 2:
        return nth__2.call(this, coll, n);
      case 3:
        return nth__3.call(this, coll, n, not_found);
    }
    throw new Error("Invalid arity: " + arguments.length);
  };
  nth.cljs$core$IFn$_invoke$arity$2 = nth__2;
  nth.cljs$core$IFn$_invoke$arity$3 = nth__3;
  return nth;
}();
cljs.core.get = function() {
  var get = null;
  var get__2 = function(o, k) {
    if (o == null) {
      return null;
    } else {
      if (function() {
        var G__56320 = o;
        if (G__56320) {
          var bit__4295__auto__ = G__56320.cljs$lang$protocol_mask$partition0$ & 256;
          if (bit__4295__auto__ || G__56320.cljs$core$ILookup$) {
            return true;
          } else {
            return false;
          }
        } else {
          return false;
        }
      }()) {
        return cljs.core._lookup.call(null, o, k);
      } else {
        if (o instanceof Array) {
          if (k < o.length) {
            return o[k];
          } else {
            return null;
          }
        } else {
          if (typeof o === "string") {
            if (k < o.length) {
              return o[k];
            } else {
              return null;
            }
          } else {
            if (cljs.core.native_satisfies_QMARK_.call(null, cljs.core.ILookup, o)) {
              return cljs.core._lookup.call(null, o, k);
            } else {
              return null;
            }
          }
        }
      }
    }
  };
  var get__3 = function(o, k, not_found) {
    if (!(o == null)) {
      if (function() {
        var G__56321 = o;
        if (G__56321) {
          var bit__4295__auto__ = G__56321.cljs$lang$protocol_mask$partition0$ & 256;
          if (bit__4295__auto__ || G__56321.cljs$core$ILookup$) {
            return true;
          } else {
            return false;
          }
        } else {
          return false;
        }
      }()) {
        return cljs.core._lookup.call(null, o, k, not_found);
      } else {
        if (o instanceof Array) {
          if (k < o.length) {
            return o[k];
          } else {
            return not_found;
          }
        } else {
          if (typeof o === "string") {
            if (k < o.length) {
              return o[k];
            } else {
              return not_found;
            }
          } else {
            if (cljs.core.native_satisfies_QMARK_.call(null, cljs.core.ILookup, o)) {
              return cljs.core._lookup.call(null, o, k, not_found);
            } else {
              return not_found;
            }
          }
        }
      }
    } else {
      return not_found;
    }
  };
  get = function(o, k, not_found) {
    switch(arguments.length) {
      case 2:
        return get__2.call(this, o, k);
      case 3:
        return get__3.call(this, o, k, not_found);
    }
    throw new Error("Invalid arity: " + arguments.length);
  };
  get.cljs$core$IFn$_invoke$arity$2 = get__2;
  get.cljs$core$IFn$_invoke$arity$3 = get__3;
  return get;
}();
cljs.core.assoc = function() {
  var assoc = null;
  var assoc__3 = function(coll, k, v) {
    if (!(coll == null)) {
      return cljs.core._assoc.call(null, coll, k, v);
    } else {
      return cljs.core.PersistentHashMap.fromArrays([k], [v]);
    }
  };
  var assoc__4 = function() {
    var G__56322__delegate = function(coll, k, v, kvs) {
      while (true) {
        var ret = assoc.call(null, coll, k, v);
        if (cljs.core.truth_(kvs)) {
          var G__56323 = ret;
          var G__56324 = cljs.core.first.call(null, kvs);
          var G__56325 = cljs.core.second.call(null, kvs);
          var G__56326 = cljs.core.nnext.call(null, kvs);
          coll = G__56323;
          k = G__56324;
          v = G__56325;
          kvs = G__56326;
          continue;
        } else {
          return ret;
        }
        break;
      }
    };
    var G__56322 = function(coll, k, v, var_args) {
      var kvs = null;
      if (arguments.length > 3) {
        kvs = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0);
      }
      return G__56322__delegate.call(this, coll, k, v, kvs);
    };
    G__56322.cljs$lang$maxFixedArity = 3;
    G__56322.cljs$lang$applyTo = function(arglist__56327) {
      var coll = cljs.core.first(arglist__56327);
      arglist__56327 = cljs.core.next(arglist__56327);
      var k = cljs.core.first(arglist__56327);
      arglist__56327 = cljs.core.next(arglist__56327);
      var v = cljs.core.first(arglist__56327);
      var kvs = cljs.core.rest(arglist__56327);
      return G__56322__delegate(coll, k, v, kvs);
    };
    G__56322.cljs$core$IFn$_invoke$arity$variadic = G__56322__delegate;
    return G__56322;
  }();
  assoc = function(coll, k, v, var_args) {
    var kvs = var_args;
    switch(arguments.length) {
      case 3:
        return assoc__3.call(this, coll, k, v);
      default:
        return assoc__4.cljs$core$IFn$_invoke$arity$variadic(coll, k, v, cljs.core.array_seq(arguments, 3));
    }
    throw new Error("Invalid arity: " + arguments.length);
  };
  assoc.cljs$lang$maxFixedArity = 3;
  assoc.cljs$lang$applyTo = assoc__4.cljs$lang$applyTo;
  assoc.cljs$core$IFn$_invoke$arity$3 = assoc__3;
  assoc.cljs$core$IFn$_invoke$arity$variadic = assoc__4.cljs$core$IFn$_invoke$arity$variadic;
  return assoc;
}();
cljs.core.dissoc = function() {
  var dissoc = null;
  var dissoc__1 = function(coll) {
    return coll;
  };
  var dissoc__2 = function(coll, k) {
    if (coll == null) {
      return null;
    } else {
      return cljs.core._dissoc.call(null, coll, k);
    }
  };
  var dissoc__3 = function() {
    var G__56328__delegate = function(coll, k, ks) {
      while (true) {
        if (coll == null) {
          return null;
        } else {
          var ret = dissoc.call(null, coll, k);
          if (cljs.core.truth_(ks)) {
            var G__56329 = ret;
            var G__56330 = cljs.core.first.call(null, ks);
            var G__56331 = cljs.core.next.call(null, ks);
            coll = G__56329;
            k = G__56330;
            ks = G__56331;
            continue;
          } else {
            return ret;
          }
        }
        break;
      }
    };
    var G__56328 = function(coll, k, var_args) {
      var ks = null;
      if (arguments.length > 2) {
        ks = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0);
      }
      return G__56328__delegate.call(this, coll, k, ks);
    };
    G__56328.cljs$lang$maxFixedArity = 2;
    G__56328.cljs$lang$applyTo = function(arglist__56332) {
      var coll = cljs.core.first(arglist__56332);
      arglist__56332 = cljs.core.next(arglist__56332);
      var k = cljs.core.first(arglist__56332);
      var ks = cljs.core.rest(arglist__56332);
      return G__56328__delegate(coll, k, ks);
    };
    G__56328.cljs$core$IFn$_invoke$arity$variadic = G__56328__delegate;
    return G__56328;
  }();
  dissoc = function(coll, k, var_args) {
    var ks = var_args;
    switch(arguments.length) {
      case 1:
        return dissoc__1.call(this, coll);
      case 2:
        return dissoc__2.call(this, coll, k);
      default:
        return dissoc__3.cljs$core$IFn$_invoke$arity$variadic(coll, k, cljs.core.array_seq(arguments, 2));
    }
    throw new Error("Invalid arity: " + arguments.length);
  };
  dissoc.cljs$lang$maxFixedArity = 2;
  dissoc.cljs$lang$applyTo = dissoc__3.cljs$lang$applyTo;
  dissoc.cljs$core$IFn$_invoke$arity$1 = dissoc__1;
  dissoc.cljs$core$IFn$_invoke$arity$2 = dissoc__2;
  dissoc.cljs$core$IFn$_invoke$arity$variadic = dissoc__3.cljs$core$IFn$_invoke$arity$variadic;
  return dissoc;
}();
cljs.core.fn_QMARK_ = function fn_QMARK_(f) {
  var or__3639__auto__ = goog.isFunction(f);
  if (or__3639__auto__) {
    return or__3639__auto__;
  } else {
    var G__56336 = f;
    if (G__56336) {
      var bit__4302__auto__ = null;
      if (cljs.core.truth_(function() {
        var or__3639__auto____$1 = bit__4302__auto__;
        if (cljs.core.truth_(or__3639__auto____$1)) {
          return or__3639__auto____$1;
        } else {
          return G__56336.cljs$core$Fn$;
        }
      }())) {
        return true;
      } else {
        if (!G__56336.cljs$lang$protocol_mask$partition$) {
          return cljs.core.native_satisfies_QMARK_.call(null, cljs.core.Fn, G__56336);
        } else {
          return false;
        }
      }
    } else {
      return cljs.core.native_satisfies_QMARK_.call(null, cljs.core.Fn, G__56336);
    }
  }
};
cljs.core.MetaFn = function(afn, meta) {
  this.afn = afn;
  this.meta = meta;
  this.cljs$lang$protocol_mask$partition1$ = 0;
  this.cljs$lang$protocol_mask$partition0$ = 393217;
};
cljs.core.MetaFn.cljs$lang$type = true;
cljs.core.MetaFn.cljs$lang$ctorStr = "cljs.core/MetaFn";
cljs.core.MetaFn.cljs$lang$ctorPrWriter = function(this__4215__auto__, writer__4216__auto__, opt__4217__auto__) {
  return cljs.core._write.call(null, writer__4216__auto__, "cljs.core/MetaFn");
};
cljs.core.MetaFn.prototype.call = function() {
  var G__56338 = null;
  var G__56338__1 = function(self__) {
    var self__ = this;
    var self____$1 = this;
    var _ = self____$1;
    return self__.afn.call(null);
  };
  var G__56338__2 = function(self__, a) {
    var self__ = this;
    var self____$1 = this;
    var _ = self____$1;
    return self__.afn.call(null, a);
  };
  var G__56338__3 = function(self__, a, b) {
    var self__ = this;
    var self____$1 = this;
    var _ = self____$1;
    return self__.afn.call(null, a, b);
  };
  var G__56338__4 = function(self__, a, b, c) {
    var self__ = this;
    var self____$1 = this;
    var _ = self____$1;
    return self__.afn.call(null, a, b, c);
  };
  var G__56338__5 = function(self__, a, b, c, d) {
    var self__ = this;
    var self____$1 = this;
    var _ = self____$1;
    return self__.afn.call(null, a, b, c, d);
  };
  var G__56338__6 = function(self__, a, b, c, d, e) {
    var self__ = this;
    var self____$1 = this;
    var _ = self____$1;
    return self__.afn.call(null, a, b, c, d, e);
  };
  var G__56338__7 = function(self__, a, b, c, d, e, f) {
    var self__ = this;
    var self____$1 = this;
    var _ = self____$1;
    return self__.afn.call(null, a, b, c, d, e, f);
  };
  var G__56338__8 = function(self__, a, b, c, d, e, f, g) {
    var self__ = this;
    var self____$1 = this;
    var _ = self____$1;
    return self__.afn.call(null, a, b, c, d, e, f, g);
  };
  var G__56338__9 = function(self__, a, b, c, d, e, f, g, h) {
    var self__ = this;
    var self____$1 = this;
    var _ = self____$1;
    return self__.afn.call(null, a, b, c, d, e, f, g, h);
  };
  var G__56338__10 = function(self__, a, b, c, d, e, f, g, h, i) {
    var self__ = this;
    var self____$1 = this;
    var _ = self____$1;
    return self__.afn.call(null, a, b, c, d, e, f, g, h, i);
  };
  var G__56338__11 = function(self__, a, b, c, d, e, f, g, h, i, j) {
    var self__ = this;
    var self____$1 = this;
    var _ = self____$1;
    return self__.afn.call(null, a, b, c, d, e, f, g, h, i, j);
  };
  var G__56338__12 = function(self__, a, b, c, d, e, f, g, h, i, j, k) {
    var self__ = this;
    var self____$1 = this;
    var _ = self____$1;
    return self__.afn.call(null, a, b, c, d, e, f, g, h, i, j, k);
  };
  var G__56338__13 = function(self__, a, b, c, d, e, f, g, h, i, j, k, l) {
    var self__ = this;
    var self____$1 = this;
    var _ = self____$1;
    return self__.afn.call(null, a, b, c, d, e, f, g, h, i, j, k, l);
  };
  var G__56338__14 = function(self__, a, b, c, d, e, f, g, h, i, j, k, l, m) {
    var self__ = this;
    var self____$1 = this;
    var _ = self____$1;
    return self__.afn.call(null, a, b, c, d, e, f, g, h, i, j, k, l, m);
  };
  var G__56338__15 = function(self__, a, b, c, d, e, f, g, h, i, j, k, l, m, n) {
    var self__ = this;
    var self____$1 = this;
    var _ = self____$1;
    return self__.afn.call(null, a, b, c, d, e, f, g, h, i, j, k, l, m, n);
  };
  var G__56338__16 = function(self__, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o) {
    var self__ = this;
    var self____$1 = this;
    var _ = self____$1;
    return self__.afn.call(null, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o);
  };
  var G__56338__17 = function(self__, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p) {
    var self__ = this;
    var self____$1 = this;
    var _ = self____$1;
    return self__.afn.call(null, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p);
  };
  var G__56338__18 = function(self__, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q) {
    var self__ = this;
    var self____$1 = this;
    var _ = self____$1;
    return self__.afn.call(null, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q);
  };
  var G__56338__19 = function(self__, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r) {
    var self__ = this;
    var self____$1 = this;
    var _ = self____$1;
    return self__.afn.call(null, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r);
  };
  var G__56338__20 = function(self__, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s) {
    var self__ = this;
    var self____$1 = this;
    var _ = self____$1;
    return self__.afn.call(null, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s);
  };
  var G__56338__21 = function(self__, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t) {
    var self__ = this;
    var self____$1 = this;
    var _ = self____$1;
    return self__.afn.call(null, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t);
  };
  var G__56338__22 = function(self__, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, rest) {
    var self__ = this;
    var self____$1 = this;
    var _ = self____$1;
    return cljs.core.apply.call(null, self__.afn, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, rest);
  };
  G__56338 = function(self__, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, rest) {
    switch(arguments.length) {
      case 1:
        return G__56338__1.call(this, self__);
      case 2:
        return G__56338__2.call(this, self__, a);
      case 3:
        return G__56338__3.call(this, self__, a, b);
      case 4:
        return G__56338__4.call(this, self__, a, b, c);
      case 5:
        return G__56338__5.call(this, self__, a, b, c, d);
      case 6:
        return G__56338__6.call(this, self__, a, b, c, d, e);
      case 7:
        return G__56338__7.call(this, self__, a, b, c, d, e, f);
      case 8:
        return G__56338__8.call(this, self__, a, b, c, d, e, f, g);
      case 9:
        return G__56338__9.call(this, self__, a, b, c, d, e, f, g, h);
      case 10:
        return G__56338__10.call(this, self__, a, b, c, d, e, f, g, h, i);
      case 11:
        return G__56338__11.call(this, self__, a, b, c, d, e, f, g, h, i, j);
      case 12:
        return G__56338__12.call(this, self__, a, b, c, d, e, f, g, h, i, j, k);
      case 13:
        return G__56338__13.call(this, self__, a, b, c, d, e, f, g, h, i, j, k, l);
      case 14:
        return G__56338__14.call(this, self__, a, b, c, d, e, f, g, h, i, j, k, l, m);
      case 15:
        return G__56338__15.call(this, self__, a, b, c, d, e, f, g, h, i, j, k, l, m, n);
      case 16:
        return G__56338__16.call(this, self__, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o);
      case 17:
        return G__56338__17.call(this, self__, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p);
      case 18:
        return G__56338__18.call(this, self__, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q);
      case 19:
        return G__56338__19.call(this, self__, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r);
      case 20:
        return G__56338__20.call(this, self__, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s);
      case 21:
        return G__56338__21.call(this, self__, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t);
      case 22:
        return G__56338__22.call(this, self__, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, rest);
    }
    throw new Error("Invalid arity: " + arguments.length);
  };
  G__56338.cljs$core$IFn$_invoke$arity$1 = G__56338__1;
  G__56338.cljs$core$IFn$_invoke$arity$2 = G__56338__2;
  G__56338.cljs$core$IFn$_invoke$arity$3 = G__56338__3;
  G__56338.cljs$core$IFn$_invoke$arity$4 = G__56338__4;
  G__56338.cljs$core$IFn$_invoke$arity$5 = G__56338__5;
  G__56338.cljs$core$IFn$_invoke$arity$6 = G__56338__6;
  G__56338.cljs$core$IFn$_invoke$arity$7 = G__56338__7;
  G__56338.cljs$core$IFn$_invoke$arity$8 = G__56338__8;
  G__56338.cljs$core$IFn$_invoke$arity$9 = G__56338__9;
  G__56338.cljs$core$IFn$_invoke$arity$10 = G__56338__10;
  G__56338.cljs$core$IFn$_invoke$arity$11 = G__56338__11;
  G__56338.cljs$core$IFn$_invoke$arity$12 = G__56338__12;
  G__56338.cljs$core$IFn$_invoke$arity$13 = G__56338__13;
  G__56338.cljs$core$IFn$_invoke$arity$14 = G__56338__14;
  G__56338.cljs$core$IFn$_invoke$arity$15 = G__56338__15;
  G__56338.cljs$core$IFn$_invoke$arity$16 = G__56338__16;
  G__56338.cljs$core$IFn$_invoke$arity$17 = G__56338__17;
  G__56338.cljs$core$IFn$_invoke$arity$18 = G__56338__18;
  G__56338.cljs$core$IFn$_invoke$arity$19 = G__56338__19;
  G__56338.cljs$core$IFn$_invoke$arity$20 = G__56338__20;
  G__56338.cljs$core$IFn$_invoke$arity$21 = G__56338__21;
  G__56338.cljs$core$IFn$_invoke$arity$22 = G__56338__22;
  return G__56338;
}();
cljs.core.MetaFn.prototype.apply = function(self__, args56337) {
  var self__ = this;
  var self____$1 = this;
  return self____$1.call.apply(self____$1, [self____$1].concat(cljs.core.aclone.call(null, args56337)));
};
cljs.core.MetaFn.prototype.cljs$core$IFn$_invoke$arity$0 = function() {
  var self__ = this;
  var _ = this;
  return self__.afn.call(null);
};
cljs.core.MetaFn.prototype.cljs$core$IFn$_invoke$arity$1 = function(a) {
  var self__ = this;
  var _ = this;
  return self__.afn.call(null, a);
};
cljs.core.MetaFn.prototype.cljs$core$IFn$_invoke$arity$2 = function(a, b) {
  var self__ = this;
  var _ = this;
  return self__.afn.call(null, a, b);
};
cljs.core.MetaFn.prototype.cljs$core$IFn$_invoke$arity$3 = function(a, b, c) {
  var self__ = this;
  var _ = this;
  return self__.afn.call(null, a, b, c);
};
cljs.core.MetaFn.prototype.cljs$core$IFn$_invoke$arity$4 = function(a, b, c, d) {
  var self__ = this;
  var _ = this;
  return self__.afn.call(null, a, b, c, d);
};
cljs.core.MetaFn.prototype.cljs$core$IFn$_invoke$arity$5 = function(a, b, c, d, e) {
  var self__ = this;
  var _ = this;
  return self__.afn.call(null, a, b, c, d, e);
};
cljs.core.MetaFn.prototype.cljs$core$IFn$_invoke$arity$6 = function(a, b, c, d, e, f) {
  var self__ = this;
  var _ = this;
  return self__.afn.call(null, a, b, c, d, e, f);
};
cljs.core.MetaFn.prototype.cljs$core$IFn$_invoke$arity$7 = function(a, b, c, d, e, f, g) {
  var self__ = this;
  var _ = this;
  return self__.afn.call(null, a, b, c, d, e, f, g);
};
cljs.core.MetaFn.prototype.cljs$core$IFn$_invoke$arity$8 = function(a, b, c, d, e, f, g, h) {
  var self__ = this;
  var _ = this;
  return self__.afn.call(null, a, b, c, d, e, f, g, h);
};
cljs.core.MetaFn.prototype.cljs$core$IFn$_invoke$arity$9 = function(a, b, c, d, e, f, g, h, i) {
  var self__ = this;
  var _ = this;
  return self__.afn.call(null, a, b, c, d, e, f, g, h, i);
};
cljs.core.MetaFn.prototype.cljs$core$IFn$_invoke$arity$10 = function(a, b, c, d, e, f, g, h, i, j) {
  var self__ = this;
  var _ = this;
  return self__.afn.call(null, a, b, c, d, e, f, g, h, i, j);
};
cljs.core.MetaFn.prototype.cljs$core$IFn$_invoke$arity$11 = function(a, b, c, d, e, f, g, h, i, j, k) {
  var self__ = this;
  var _ = this;
  return self__.afn.call(null, a, b, c, d, e, f, g, h, i, j, k);
};
cljs.core.MetaFn.prototype.cljs$core$IFn$_invoke$arity$12 = function(a, b, c, d, e, f, g, h, i, j, k, l) {
  var self__ = this;
  var _ = this;
  return self__.afn.call(null, a, b, c, d, e, f, g, h, i, j, k, l);
};
cljs.core.MetaFn.prototype.cljs$core$IFn$_invoke$arity$13 = function(a, b, c, d, e, f, g, h, i, j, k, l, m) {
  var self__ = this;
  var _ = this;
  return self__.afn.call(null, a, b, c, d, e, f, g, h, i, j, k, l, m);
};
cljs.core.MetaFn.prototype.cljs$core$IFn$_invoke$arity$14 = function(a, b, c, d, e, f, g, h, i, j, k, l, m, n) {
  var self__ = this;
  var _ = this;
  return self__.afn.call(null, a, b, c, d, e, f, g, h, i, j, k, l, m, n);
};
cljs.core.MetaFn.prototype.cljs$core$IFn$_invoke$arity$15 = function(a, b, c, d, e, f, g, h, i, j, k, l, m, n, o) {
  var self__ = this;
  var _ = this;
  return self__.afn.call(null, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o);
};
cljs.core.MetaFn.prototype.cljs$core$IFn$_invoke$arity$16 = function(a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p) {
  var self__ = this;
  var _ = this;
  return self__.afn.call(null, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p);
};
cljs.core.MetaFn.prototype.cljs$core$IFn$_invoke$arity$17 = function(a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q) {
  var self__ = this;
  var _ = this;
  return self__.afn.call(null, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q);
};
cljs.core.MetaFn.prototype.cljs$core$IFn$_invoke$arity$18 = function(a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r) {
  var self__ = this;
  var _ = this;
  return self__.afn.call(null, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r);
};
cljs.core.MetaFn.prototype.cljs$core$IFn$_invoke$arity$19 = function(a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s) {
  var self__ = this;
  var _ = this;
  return self__.afn.call(null, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s);
};
cljs.core.MetaFn.prototype.cljs$core$IFn$_invoke$arity$20 = function(a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t) {
  var self__ = this;
  var _ = this;
  return self__.afn.call(null, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t);
};
cljs.core.MetaFn.prototype.cljs$core$IFn$_invoke$arity$21 = function(a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, rest) {
  var self__ = this;
  var _ = this;
  return cljs.core.apply.call(null, self__.afn, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, rest);
};
cljs.core.MetaFn.prototype.cljs$core$Fn$ = true;
cljs.core.MetaFn.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(_, new_meta) {
  var self__ = this;
  var ___$1 = this;
  return new cljs.core.MetaFn(self__.afn, new_meta);
};
cljs.core.MetaFn.prototype.cljs$core$IMeta$_meta$arity$1 = function(_) {
  var self__ = this;
  var ___$1 = this;
  return self__.meta;
};
cljs.core.__GT_MetaFn = function __GT_MetaFn(afn, meta) {
  return new cljs.core.MetaFn(afn, meta);
};
cljs.core.with_meta = function with_meta(o, meta) {
  if (cljs.core.fn_QMARK_.call(null, o) && !function() {
    var G__56342 = o;
    if (G__56342) {
      var bit__4302__auto__ = G__56342.cljs$lang$protocol_mask$partition0$ & 262144;
      if (bit__4302__auto__ || G__56342.cljs$core$IWithMeta$) {
        return true;
      } else {
        if (!G__56342.cljs$lang$protocol_mask$partition0$) {
          return cljs.core.native_satisfies_QMARK_.call(null, cljs.core.IWithMeta, G__56342);
        } else {
          return false;
        }
      }
    } else {
      return cljs.core.native_satisfies_QMARK_.call(null, cljs.core.IWithMeta, G__56342);
    }
  }()) {
    return new cljs.core.MetaFn(o, meta);
  } else {
    if (o == null) {
      return null;
    } else {
      return cljs.core._with_meta.call(null, o, meta);
    }
  }
};
cljs.core.meta = function meta(o) {
  if (function() {
    var and__3627__auto__ = !(o == null);
    if (and__3627__auto__) {
      var G__56346 = o;
      if (G__56346) {
        var bit__4302__auto__ = G__56346.cljs$lang$protocol_mask$partition0$ & 131072;
        if (bit__4302__auto__ || G__56346.cljs$core$IMeta$) {
          return true;
        } else {
          if (!G__56346.cljs$lang$protocol_mask$partition0$) {
            return cljs.core.native_satisfies_QMARK_.call(null, cljs.core.IMeta, G__56346);
          } else {
            return false;
          }
        }
      } else {
        return cljs.core.native_satisfies_QMARK_.call(null, cljs.core.IMeta, G__56346);
      }
    } else {
      return and__3627__auto__;
    }
  }()) {
    return cljs.core._meta.call(null, o);
  } else {
    return null;
  }
};
cljs.core.peek = function peek(coll) {
  if (coll == null) {
    return null;
  } else {
    return cljs.core._peek.call(null, coll);
  }
};
cljs.core.pop = function pop(coll) {
  if (coll == null) {
    return null;
  } else {
    return cljs.core._pop.call(null, coll);
  }
};
cljs.core.disj = function() {
  var disj = null;
  var disj__1 = function(coll) {
    return coll;
  };
  var disj__2 = function(coll, k) {
    if (coll == null) {
      return null;
    } else {
      return cljs.core._disjoin.call(null, coll, k);
    }
  };
  var disj__3 = function() {
    var G__56347__delegate = function(coll, k, ks) {
      while (true) {
        if (coll == null) {
          return null;
        } else {
          var ret = disj.call(null, coll, k);
          if (cljs.core.truth_(ks)) {
            var G__56348 = ret;
            var G__56349 = cljs.core.first.call(null, ks);
            var G__56350 = cljs.core.next.call(null, ks);
            coll = G__56348;
            k = G__56349;
            ks = G__56350;
            continue;
          } else {
            return ret;
          }
        }
        break;
      }
    };
    var G__56347 = function(coll, k, var_args) {
      var ks = null;
      if (arguments.length > 2) {
        ks = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0);
      }
      return G__56347__delegate.call(this, coll, k, ks);
    };
    G__56347.cljs$lang$maxFixedArity = 2;
    G__56347.cljs$lang$applyTo = function(arglist__56351) {
      var coll = cljs.core.first(arglist__56351);
      arglist__56351 = cljs.core.next(arglist__56351);
      var k = cljs.core.first(arglist__56351);
      var ks = cljs.core.rest(arglist__56351);
      return G__56347__delegate(coll, k, ks);
    };
    G__56347.cljs$core$IFn$_invoke$arity$variadic = G__56347__delegate;
    return G__56347;
  }();
  disj = function(coll, k, var_args) {
    var ks = var_args;
    switch(arguments.length) {
      case 1:
        return disj__1.call(this, coll);
      case 2:
        return disj__2.call(this, coll, k);
      default:
        return disj__3.cljs$core$IFn$_invoke$arity$variadic(coll, k, cljs.core.array_seq(arguments, 2));
    }
    throw new Error("Invalid arity: " + arguments.length);
  };
  disj.cljs$lang$maxFixedArity = 2;
  disj.cljs$lang$applyTo = disj__3.cljs$lang$applyTo;
  disj.cljs$core$IFn$_invoke$arity$1 = disj__1;
  disj.cljs$core$IFn$_invoke$arity$2 = disj__2;
  disj.cljs$core$IFn$_invoke$arity$variadic = disj__3.cljs$core$IFn$_invoke$arity$variadic;
  return disj;
}();
cljs.core.empty_QMARK_ = function empty_QMARK_(coll) {
  return coll == null || cljs.core.not.call(null, cljs.core.seq.call(null, coll));
};
cljs.core.coll_QMARK_ = function coll_QMARK_(x) {
  if (x == null) {
    return false;
  } else {
    var G__56353 = x;
    if (G__56353) {
      var bit__4302__auto__ = G__56353.cljs$lang$protocol_mask$partition0$ & 8;
      if (bit__4302__auto__ || G__56353.cljs$core$ICollection$) {
        return true;
      } else {
        if (!G__56353.cljs$lang$protocol_mask$partition0$) {
          return cljs.core.native_satisfies_QMARK_.call(null, cljs.core.ICollection, G__56353);
        } else {
          return false;
        }
      }
    } else {
      return cljs.core.native_satisfies_QMARK_.call(null, cljs.core.ICollection, G__56353);
    }
  }
};
cljs.core.set_QMARK_ = function set_QMARK_(x) {
  if (x == null) {
    return false;
  } else {
    var G__56355 = x;
    if (G__56355) {
      var bit__4302__auto__ = G__56355.cljs$lang$protocol_mask$partition0$ & 4096;
      if (bit__4302__auto__ || G__56355.cljs$core$ISet$) {
        return true;
      } else {
        if (!G__56355.cljs$lang$protocol_mask$partition0$) {
          return cljs.core.native_satisfies_QMARK_.call(null, cljs.core.ISet, G__56355);
        } else {
          return false;
        }
      }
    } else {
      return cljs.core.native_satisfies_QMARK_.call(null, cljs.core.ISet, G__56355);
    }
  }
};
cljs.core.associative_QMARK_ = function associative_QMARK_(x) {
  var G__56357 = x;
  if (G__56357) {
    var bit__4302__auto__ = G__56357.cljs$lang$protocol_mask$partition0$ & 512;
    if (bit__4302__auto__ || G__56357.cljs$core$IAssociative$) {
      return true;
    } else {
      if (!G__56357.cljs$lang$protocol_mask$partition0$) {
        return cljs.core.native_satisfies_QMARK_.call(null, cljs.core.IAssociative, G__56357);
      } else {
        return false;
      }
    }
  } else {
    return cljs.core.native_satisfies_QMARK_.call(null, cljs.core.IAssociative, G__56357);
  }
};
cljs.core.sequential_QMARK_ = function sequential_QMARK_(x) {
  var G__56359 = x;
  if (G__56359) {
    var bit__4302__auto__ = G__56359.cljs$lang$protocol_mask$partition0$ & 16777216;
    if (bit__4302__auto__ || G__56359.cljs$core$ISequential$) {
      return true;
    } else {
      if (!G__56359.cljs$lang$protocol_mask$partition0$) {
        return cljs.core.native_satisfies_QMARK_.call(null, cljs.core.ISequential, G__56359);
      } else {
        return false;
      }
    }
  } else {
    return cljs.core.native_satisfies_QMARK_.call(null, cljs.core.ISequential, G__56359);
  }
};
cljs.core.sorted_QMARK_ = function sorted_QMARK_(x) {
  var G__56361 = x;
  if (G__56361) {
    var bit__4302__auto__ = G__56361.cljs$lang$protocol_mask$partition0$ & 268435456;
    if (bit__4302__auto__ || G__56361.cljs$core$ISorted$) {
      return true;
    } else {
      if (!G__56361.cljs$lang$protocol_mask$partition0$) {
        return cljs.core.native_satisfies_QMARK_.call(null, cljs.core.ISorted, G__56361);
      } else {
        return false;
      }
    }
  } else {
    return cljs.core.native_satisfies_QMARK_.call(null, cljs.core.ISorted, G__56361);
  }
};
cljs.core.reduceable_QMARK_ = function reduceable_QMARK_(x) {
  var G__56363 = x;
  if (G__56363) {
    var bit__4302__auto__ = G__56363.cljs$lang$protocol_mask$partition0$ & 524288;
    if (bit__4302__auto__ || G__56363.cljs$core$IReduce$) {
      return true;
    } else {
      if (!G__56363.cljs$lang$protocol_mask$partition0$) {
        return cljs.core.native_satisfies_QMARK_.call(null, cljs.core.IReduce, G__56363);
      } else {
        return false;
      }
    }
  } else {
    return cljs.core.native_satisfies_QMARK_.call(null, cljs.core.IReduce, G__56363);
  }
};
cljs.core.map_QMARK_ = function map_QMARK_(x) {
  if (x == null) {
    return false;
  } else {
    var G__56365 = x;
    if (G__56365) {
      var bit__4302__auto__ = G__56365.cljs$lang$protocol_mask$partition0$ & 1024;
      if (bit__4302__auto__ || G__56365.cljs$core$IMap$) {
        return true;
      } else {
        if (!G__56365.cljs$lang$protocol_mask$partition0$) {
          return cljs.core.native_satisfies_QMARK_.call(null, cljs.core.IMap, G__56365);
        } else {
          return false;
        }
      }
    } else {
      return cljs.core.native_satisfies_QMARK_.call(null, cljs.core.IMap, G__56365);
    }
  }
};
cljs.core.vector_QMARK_ = function vector_QMARK_(x) {
  var G__56367 = x;
  if (G__56367) {
    var bit__4302__auto__ = G__56367.cljs$lang$protocol_mask$partition0$ & 16384;
    if (bit__4302__auto__ || G__56367.cljs$core$IVector$) {
      return true;
    } else {
      if (!G__56367.cljs$lang$protocol_mask$partition0$) {
        return cljs.core.native_satisfies_QMARK_.call(null, cljs.core.IVector, G__56367);
      } else {
        return false;
      }
    }
  } else {
    return cljs.core.native_satisfies_QMARK_.call(null, cljs.core.IVector, G__56367);
  }
};
cljs.core.chunked_seq_QMARK_ = function chunked_seq_QMARK_(x) {
  var G__56369 = x;
  if (G__56369) {
    var bit__4295__auto__ = G__56369.cljs$lang$protocol_mask$partition1$ & 512;
    if (bit__4295__auto__ || G__56369.cljs$core$IChunkedSeq$) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
};
cljs.core.js_obj = function() {
  var js_obj = null;
  var js_obj__0 = function() {
    var obj56373 = {};
    return obj56373;
  };
  var js_obj__1 = function() {
    var G__56374__delegate = function(keyvals) {
      return cljs.core.apply.call(null, goog.object.create, keyvals);
    };
    var G__56374 = function(var_args) {
      var keyvals = null;
      if (arguments.length > 0) {
        keyvals = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0);
      }
      return G__56374__delegate.call(this, keyvals);
    };
    G__56374.cljs$lang$maxFixedArity = 0;
    G__56374.cljs$lang$applyTo = function(arglist__56375) {
      var keyvals = cljs.core.seq(arglist__56375);
      return G__56374__delegate(keyvals);
    };
    G__56374.cljs$core$IFn$_invoke$arity$variadic = G__56374__delegate;
    return G__56374;
  }();
  js_obj = function(var_args) {
    var keyvals = var_args;
    switch(arguments.length) {
      case 0:
        return js_obj__0.call(this);
      default:
        return js_obj__1.cljs$core$IFn$_invoke$arity$variadic(cljs.core.array_seq(arguments, 0));
    }
    throw new Error("Invalid arity: " + arguments.length);
  };
  js_obj.cljs$lang$maxFixedArity = 0;
  js_obj.cljs$lang$applyTo = js_obj__1.cljs$lang$applyTo;
  js_obj.cljs$core$IFn$_invoke$arity$0 = js_obj__0;
  js_obj.cljs$core$IFn$_invoke$arity$variadic = js_obj__1.cljs$core$IFn$_invoke$arity$variadic;
  return js_obj;
}();
cljs.core.js_keys = function js_keys(obj) {
  var keys = [];
  goog.object.forEach(obj, function(keys) {
    return function(val, key, obj__$1) {
      return keys.push(key);
    };
  }(keys));
  return keys;
};
cljs.core.js_delete = function js_delete(obj, key) {
  return delete obj[key];
};
cljs.core.array_copy = function array_copy(from, i, to, j, len) {
  var i__$1 = i;
  var j__$1 = j;
  var len__$1 = len;
  while (true) {
    if (len__$1 === 0) {
      return to;
    } else {
      to[j__$1] = from[i__$1];
      var G__56376 = i__$1 + 1;
      var G__56377 = j__$1 + 1;
      var G__56378 = len__$1 - 1;
      i__$1 = G__56376;
      j__$1 = G__56377;
      len__$1 = G__56378;
      continue;
    }
    break;
  }
};
cljs.core.array_copy_downward = function array_copy_downward(from, i, to, j, len) {
  var i__$1 = i + (len - 1);
  var j__$1 = j + (len - 1);
  var len__$1 = len;
  while (true) {
    if (len__$1 === 0) {
      return to;
    } else {
      to[j__$1] = from[i__$1];
      var G__56379 = i__$1 - 1;
      var G__56380 = j__$1 - 1;
      var G__56381 = len__$1 - 1;
      i__$1 = G__56379;
      j__$1 = G__56380;
      len__$1 = G__56381;
      continue;
    }
    break;
  }
};
cljs.core.lookup_sentinel = function() {
  var obj56383 = {};
  return obj56383;
}();
cljs.core.false_QMARK_ = function false_QMARK_(x) {
  return x === false;
};
cljs.core.true_QMARK_ = function true_QMARK_(x) {
  return x === true;
};
cljs.core.undefined_QMARK_ = function undefined_QMARK_(x) {
  return void 0 === x;
};
cljs.core.seq_QMARK_ = function seq_QMARK_(s) {
  if (s == null) {
    return false;
  } else {
    var G__56385 = s;
    if (G__56385) {
      var bit__4302__auto__ = G__56385.cljs$lang$protocol_mask$partition0$ & 64;
      if (bit__4302__auto__ || G__56385.cljs$core$ISeq$) {
        return true;
      } else {
        if (!G__56385.cljs$lang$protocol_mask$partition0$) {
          return cljs.core.native_satisfies_QMARK_.call(null, cljs.core.ISeq, G__56385);
        } else {
          return false;
        }
      }
    } else {
      return cljs.core.native_satisfies_QMARK_.call(null, cljs.core.ISeq, G__56385);
    }
  }
};
cljs.core.seqable_QMARK_ = function seqable_QMARK_(s) {
  var G__56387 = s;
  if (G__56387) {
    var bit__4302__auto__ = G__56387.cljs$lang$protocol_mask$partition0$ & 8388608;
    if (bit__4302__auto__ || G__56387.cljs$core$ISeqable$) {
      return true;
    } else {
      if (!G__56387.cljs$lang$protocol_mask$partition0$) {
        return cljs.core.native_satisfies_QMARK_.call(null, cljs.core.ISeqable, G__56387);
      } else {
        return false;
      }
    }
  } else {
    return cljs.core.native_satisfies_QMARK_.call(null, cljs.core.ISeqable, G__56387);
  }
};
cljs.core.boolean$ = function boolean$(x) {
  if (cljs.core.truth_(x)) {
    return true;
  } else {
    return false;
  }
};
cljs.core.ifn_QMARK_ = function ifn_QMARK_(f) {
  var or__3639__auto__ = cljs.core.fn_QMARK_.call(null, f);
  if (or__3639__auto__) {
    return or__3639__auto__;
  } else {
    var G__56391 = f;
    if (G__56391) {
      var bit__4302__auto__ = G__56391.cljs$lang$protocol_mask$partition0$ & 1;
      if (bit__4302__auto__ || G__56391.cljs$core$IFn$) {
        return true;
      } else {
        if (!G__56391.cljs$lang$protocol_mask$partition0$) {
          return cljs.core.native_satisfies_QMARK_.call(null, cljs.core.IFn, G__56391);
        } else {
          return false;
        }
      }
    } else {
      return cljs.core.native_satisfies_QMARK_.call(null, cljs.core.IFn, G__56391);
    }
  }
};
cljs.core.integer_QMARK_ = function integer_QMARK_(n) {
  return typeof n === "number" && !isNaN(n) && !(n === Infinity) && parseFloat(n) === parseInt(n, 10);
};
cljs.core.contains_QMARK_ = function contains_QMARK_(coll, v) {
  if (cljs.core.get.call(null, coll, v, cljs.core.lookup_sentinel) === cljs.core.lookup_sentinel) {
    return false;
  } else {
    return true;
  }
};
cljs.core.find = function find(coll, k) {
  if (!(coll == null) && cljs.core.associative_QMARK_.call(null, coll) && cljs.core.contains_QMARK_.call(null, coll, k)) {
    return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [k, cljs.core.get.call(null, coll, k)], null);
  } else {
    return null;
  }
};
cljs.core.distinct_QMARK_ = function() {
  var distinct_QMARK_ = null;
  var distinct_QMARK___1 = function(x) {
    return true;
  };
  var distinct_QMARK___2 = function(x, y) {
    return!cljs.core._EQ_.call(null, x, y);
  };
  var distinct_QMARK___3 = function() {
    var G__56392__delegate = function(x, y, more) {
      if (!cljs.core._EQ_.call(null, x, y)) {
        var s = cljs.core.PersistentHashSet.fromArray([x, y], true);
        var xs = more;
        while (true) {
          var x__$1 = cljs.core.first.call(null, xs);
          var etc = cljs.core.next.call(null, xs);
          if (cljs.core.truth_(xs)) {
            if (cljs.core.contains_QMARK_.call(null, s, x__$1)) {
              return false;
            } else {
              var G__56393 = cljs.core.conj.call(null, s, x__$1);
              var G__56394 = etc;
              s = G__56393;
              xs = G__56394;
              continue;
            }
          } else {
            return true;
          }
          break;
        }
      } else {
        return false;
      }
    };
    var G__56392 = function(x, y, var_args) {
      var more = null;
      if (arguments.length > 2) {
        more = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0);
      }
      return G__56392__delegate.call(this, x, y, more);
    };
    G__56392.cljs$lang$maxFixedArity = 2;
    G__56392.cljs$lang$applyTo = function(arglist__56395) {
      var x = cljs.core.first(arglist__56395);
      arglist__56395 = cljs.core.next(arglist__56395);
      var y = cljs.core.first(arglist__56395);
      var more = cljs.core.rest(arglist__56395);
      return G__56392__delegate(x, y, more);
    };
    G__56392.cljs$core$IFn$_invoke$arity$variadic = G__56392__delegate;
    return G__56392;
  }();
  distinct_QMARK_ = function(x, y, var_args) {
    var more = var_args;
    switch(arguments.length) {
      case 1:
        return distinct_QMARK___1.call(this, x);
      case 2:
        return distinct_QMARK___2.call(this, x, y);
      default:
        return distinct_QMARK___3.cljs$core$IFn$_invoke$arity$variadic(x, y, cljs.core.array_seq(arguments, 2));
    }
    throw new Error("Invalid arity: " + arguments.length);
  };
  distinct_QMARK_.cljs$lang$maxFixedArity = 2;
  distinct_QMARK_.cljs$lang$applyTo = distinct_QMARK___3.cljs$lang$applyTo;
  distinct_QMARK_.cljs$core$IFn$_invoke$arity$1 = distinct_QMARK___1;
  distinct_QMARK_.cljs$core$IFn$_invoke$arity$2 = distinct_QMARK___2;
  distinct_QMARK_.cljs$core$IFn$_invoke$arity$variadic = distinct_QMARK___3.cljs$core$IFn$_invoke$arity$variadic;
  return distinct_QMARK_;
}();
cljs.core.sequence = function sequence(coll) {
  if (cljs.core.seq_QMARK_.call(null, coll)) {
    return coll;
  } else {
    var or__3639__auto__ = cljs.core.seq.call(null, coll);
    if (or__3639__auto__) {
      return or__3639__auto__;
    } else {
      return cljs.core.List.EMPTY;
    }
  }
};
cljs.core.compare = function compare(x, y) {
  if (x === y) {
    return 0;
  } else {
    if (x == null) {
      return-1;
    } else {
      if (y == null) {
        return 1;
      } else {
        if (cljs.core.type.call(null, x) === cljs.core.type.call(null, y)) {
          if (function() {
            var G__56397 = x;
            if (G__56397) {
              var bit__4295__auto__ = G__56397.cljs$lang$protocol_mask$partition1$ & 2048;
              if (bit__4295__auto__ || G__56397.cljs$core$IComparable$) {
                return true;
              } else {
                return false;
              }
            } else {
              return false;
            }
          }()) {
            return cljs.core._compare.call(null, x, y);
          } else {
            return goog.array.defaultCompare(x, y);
          }
        } else {
          throw new Error("compare on non-nil objects of different types");
        }
      }
    }
  }
};
cljs.core.compare_indexed = function() {
  var compare_indexed = null;
  var compare_indexed__2 = function(xs, ys) {
    var xl = cljs.core.count.call(null, xs);
    var yl = cljs.core.count.call(null, ys);
    if (xl < yl) {
      return-1;
    } else {
      if (xl > yl) {
        return 1;
      } else {
        return compare_indexed.call(null, xs, ys, xl, 0);
      }
    }
  };
  var compare_indexed__4 = function(xs, ys, len, n) {
    while (true) {
      var d = cljs.core.compare.call(null, cljs.core.nth.call(null, xs, n), cljs.core.nth.call(null, ys, n));
      if (d === 0 && n + 1 < len) {
        var G__56398 = xs;
        var G__56399 = ys;
        var G__56400 = len;
        var G__56401 = n + 1;
        xs = G__56398;
        ys = G__56399;
        len = G__56400;
        n = G__56401;
        continue;
      } else {
        return d;
      }
      break;
    }
  };
  compare_indexed = function(xs, ys, len, n) {
    switch(arguments.length) {
      case 2:
        return compare_indexed__2.call(this, xs, ys);
      case 4:
        return compare_indexed__4.call(this, xs, ys, len, n);
    }
    throw new Error("Invalid arity: " + arguments.length);
  };
  compare_indexed.cljs$core$IFn$_invoke$arity$2 = compare_indexed__2;
  compare_indexed.cljs$core$IFn$_invoke$arity$4 = compare_indexed__4;
  return compare_indexed;
}();
cljs.core.fn__GT_comparator = function fn__GT_comparator(f) {
  if (cljs.core._EQ_.call(null, f, cljs.core.compare)) {
    return cljs.core.compare;
  } else {
    return function(x, y) {
      var r = f.call(null, x, y);
      if (typeof r === "number") {
        return r;
      } else {
        if (cljs.core.truth_(r)) {
          return-1;
        } else {
          if (cljs.core.truth_(f.call(null, y, x))) {
            return 1;
          } else {
            return 0;
          }
        }
      }
    };
  }
};
cljs.core.sort = function() {
  var sort = null;
  var sort__1 = function(coll) {
    return sort.call(null, cljs.core.compare, coll);
  };
  var sort__2 = function(comp, coll) {
    if (cljs.core.seq.call(null, coll)) {
      var a = cljs.core.to_array.call(null, coll);
      goog.array.stableSort(a, cljs.core.fn__GT_comparator.call(null, comp));
      return cljs.core.seq.call(null, a);
    } else {
      return cljs.core.List.EMPTY;
    }
  };
  sort = function(comp, coll) {
    switch(arguments.length) {
      case 1:
        return sort__1.call(this, comp);
      case 2:
        return sort__2.call(this, comp, coll);
    }
    throw new Error("Invalid arity: " + arguments.length);
  };
  sort.cljs$core$IFn$_invoke$arity$1 = sort__1;
  sort.cljs$core$IFn$_invoke$arity$2 = sort__2;
  return sort;
}();
cljs.core.sort_by = function() {
  var sort_by = null;
  var sort_by__2 = function(keyfn, coll) {
    return sort_by.call(null, keyfn, cljs.core.compare, coll);
  };
  var sort_by__3 = function(keyfn, comp, coll) {
    return cljs.core.sort.call(null, function(x, y) {
      return cljs.core.fn__GT_comparator.call(null, comp).call(null, keyfn.call(null, x), keyfn.call(null, y));
    }, coll);
  };
  sort_by = function(keyfn, comp, coll) {
    switch(arguments.length) {
      case 2:
        return sort_by__2.call(this, keyfn, comp);
      case 3:
        return sort_by__3.call(this, keyfn, comp, coll);
    }
    throw new Error("Invalid arity: " + arguments.length);
  };
  sort_by.cljs$core$IFn$_invoke$arity$2 = sort_by__2;
  sort_by.cljs$core$IFn$_invoke$arity$3 = sort_by__3;
  return sort_by;
}();
cljs.core.seq_reduce = function() {
  var seq_reduce = null;
  var seq_reduce__2 = function(f, coll) {
    var temp__4124__auto__ = cljs.core.seq.call(null, coll);
    if (temp__4124__auto__) {
      var s = temp__4124__auto__;
      return cljs.core.reduce.call(null, f, cljs.core.first.call(null, s), cljs.core.next.call(null, s));
    } else {
      return f.call(null);
    }
  };
  var seq_reduce__3 = function(f, val, coll) {
    var val__$1 = val;
    var coll__$1 = cljs.core.seq.call(null, coll);
    while (true) {
      if (coll__$1) {
        var nval = f.call(null, val__$1, cljs.core.first.call(null, coll__$1));
        if (cljs.core.reduced_QMARK_.call(null, nval)) {
          return cljs.core.deref.call(null, nval);
        } else {
          var G__56402 = nval;
          var G__56403 = cljs.core.next.call(null, coll__$1);
          val__$1 = G__56402;
          coll__$1 = G__56403;
          continue;
        }
      } else {
        return val__$1;
      }
      break;
    }
  };
  seq_reduce = function(f, val, coll) {
    switch(arguments.length) {
      case 2:
        return seq_reduce__2.call(this, f, val);
      case 3:
        return seq_reduce__3.call(this, f, val, coll);
    }
    throw new Error("Invalid arity: " + arguments.length);
  };
  seq_reduce.cljs$core$IFn$_invoke$arity$2 = seq_reduce__2;
  seq_reduce.cljs$core$IFn$_invoke$arity$3 = seq_reduce__3;
  return seq_reduce;
}();
cljs.core.shuffle = function shuffle(coll) {
  var a = cljs.core.to_array.call(null, coll);
  goog.array.shuffle(a);
  return cljs.core.vec.call(null, a);
};
cljs.core.reduce = function() {
  var reduce = null;
  var reduce__2 = function(f, coll) {
    if (function() {
      var G__56406 = coll;
      if (G__56406) {
        var bit__4295__auto__ = G__56406.cljs$lang$protocol_mask$partition0$ & 524288;
        if (bit__4295__auto__ || G__56406.cljs$core$IReduce$) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    }()) {
      return cljs.core._reduce.call(null, coll, f);
    } else {
      if (coll instanceof Array) {
        return cljs.core.array_reduce.call(null, coll, f);
      } else {
        if (typeof coll === "string") {
          return cljs.core.array_reduce.call(null, coll, f);
        } else {
          if (cljs.core.native_satisfies_QMARK_.call(null, cljs.core.IReduce, coll)) {
            return cljs.core._reduce.call(null, coll, f);
          } else {
            return cljs.core.seq_reduce.call(null, f, coll);
          }
        }
      }
    }
  };
  var reduce__3 = function(f, val, coll) {
    if (function() {
      var G__56407 = coll;
      if (G__56407) {
        var bit__4295__auto__ = G__56407.cljs$lang$protocol_mask$partition0$ & 524288;
        if (bit__4295__auto__ || G__56407.cljs$core$IReduce$) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    }()) {
      return cljs.core._reduce.call(null, coll, f, val);
    } else {
      if (coll instanceof Array) {
        return cljs.core.array_reduce.call(null, coll, f, val);
      } else {
        if (typeof coll === "string") {
          return cljs.core.array_reduce.call(null, coll, f, val);
        } else {
          if (cljs.core.native_satisfies_QMARK_.call(null, cljs.core.IReduce, coll)) {
            return cljs.core._reduce.call(null, coll, f, val);
          } else {
            return cljs.core.seq_reduce.call(null, f, val, coll);
          }
        }
      }
    }
  };
  reduce = function(f, val, coll) {
    switch(arguments.length) {
      case 2:
        return reduce__2.call(this, f, val);
      case 3:
        return reduce__3.call(this, f, val, coll);
    }
    throw new Error("Invalid arity: " + arguments.length);
  };
  reduce.cljs$core$IFn$_invoke$arity$2 = reduce__2;
  reduce.cljs$core$IFn$_invoke$arity$3 = reduce__3;
  return reduce;
}();
cljs.core.reduce_kv = function reduce_kv(f, init, coll) {
  if (!(coll == null)) {
    return cljs.core._kv_reduce.call(null, coll, f, init);
  } else {
    return init;
  }
};
cljs.core.identity = function identity(x) {
  return x;
};
cljs.core.completing = function() {
  var completing = null;
  var completing__1 = function(f) {
    return completing.call(null, f, cljs.core.identity);
  };
  var completing__2 = function(f, cf) {
    return function() {
      var G__56408 = null;
      var G__56408__0 = function() {
        return f.call(null);
      };
      var G__56408__1 = function(x) {
        return cf.call(null, x);
      };
      var G__56408__2 = function(x, y) {
        return f.call(null, x, y);
      };
      G__56408 = function(x, y) {
        switch(arguments.length) {
          case 0:
            return G__56408__0.call(this);
          case 1:
            return G__56408__1.call(this, x);
          case 2:
            return G__56408__2.call(this, x, y);
        }
        throw new Error("Invalid arity: " + arguments.length);
      };
      G__56408.cljs$core$IFn$_invoke$arity$0 = G__56408__0;
      G__56408.cljs$core$IFn$_invoke$arity$1 = G__56408__1;
      G__56408.cljs$core$IFn$_invoke$arity$2 = G__56408__2;
      return G__56408;
    }();
  };
  completing = function(f, cf) {
    switch(arguments.length) {
      case 1:
        return completing__1.call(this, f);
      case 2:
        return completing__2.call(this, f, cf);
    }
    throw new Error("Invalid arity: " + arguments.length);
  };
  completing.cljs$core$IFn$_invoke$arity$1 = completing__1;
  completing.cljs$core$IFn$_invoke$arity$2 = completing__2;
  return completing;
}();
cljs.core.transduce = function() {
  var transduce = null;
  var transduce__3 = function(xform, f, coll) {
    return transduce.call(null, xform, f, f.call(null), coll);
  };
  var transduce__4 = function(xform, f, init, coll) {
    var f__$1 = xform.call(null, f);
    var ret = cljs.core.reduce.call(null, f__$1, init, coll);
    return f__$1.call(null, ret);
  };
  transduce = function(xform, f, init, coll) {
    switch(arguments.length) {
      case 3:
        return transduce__3.call(this, xform, f, init);
      case 4:
        return transduce__4.call(this, xform, f, init, coll);
    }
    throw new Error("Invalid arity: " + arguments.length);
  };
  transduce.cljs$core$IFn$_invoke$arity$3 = transduce__3;
  transduce.cljs$core$IFn$_invoke$arity$4 = transduce__4;
  return transduce;
}();
cljs.core._PLUS_ = function() {
  var _PLUS_ = null;
  var _PLUS___0 = function() {
    return 0;
  };
  var _PLUS___1 = function(x) {
    return x;
  };
  var _PLUS___2 = function(x, y) {
    return x + y;
  };
  var _PLUS___3 = function() {
    var G__56409__delegate = function(x, y, more) {
      return cljs.core.reduce.call(null, _PLUS_, x + y, more);
    };
    var G__56409 = function(x, y, var_args) {
      var more = null;
      if (arguments.length > 2) {
        more = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0);
      }
      return G__56409__delegate.call(this, x, y, more);
    };
    G__56409.cljs$lang$maxFixedArity = 2;
    G__56409.cljs$lang$applyTo = function(arglist__56410) {
      var x = cljs.core.first(arglist__56410);
      arglist__56410 = cljs.core.next(arglist__56410);
      var y = cljs.core.first(arglist__56410);
      var more = cljs.core.rest(arglist__56410);
      return G__56409__delegate(x, y, more);
    };
    G__56409.cljs$core$IFn$_invoke$arity$variadic = G__56409__delegate;
    return G__56409;
  }();
  _PLUS_ = function(x, y, var_args) {
    var more = var_args;
    switch(arguments.length) {
      case 0:
        return _PLUS___0.call(this);
      case 1:
        return _PLUS___1.call(this, x);
      case 2:
        return _PLUS___2.call(this, x, y);
      default:
        return _PLUS___3.cljs$core$IFn$_invoke$arity$variadic(x, y, cljs.core.array_seq(arguments, 2));
    }
    throw new Error("Invalid arity: " + arguments.length);
  };
  _PLUS_.cljs$lang$maxFixedArity = 2;
  _PLUS_.cljs$lang$applyTo = _PLUS___3.cljs$lang$applyTo;
  _PLUS_.cljs$core$IFn$_invoke$arity$0 = _PLUS___0;
  _PLUS_.cljs$core$IFn$_invoke$arity$1 = _PLUS___1;
  _PLUS_.cljs$core$IFn$_invoke$arity$2 = _PLUS___2;
  _PLUS_.cljs$core$IFn$_invoke$arity$variadic = _PLUS___3.cljs$core$IFn$_invoke$arity$variadic;
  return _PLUS_;
}();
cljs.core._ = function() {
  var _ = null;
  var ___1 = function(x) {
    return-x;
  };
  var ___2 = function(x, y) {
    return x - y;
  };
  var ___3 = function() {
    var G__56411__delegate = function(x, y, more) {
      return cljs.core.reduce.call(null, _, x - y, more);
    };
    var G__56411 = function(x, y, var_args) {
      var more = null;
      if (arguments.length > 2) {
        more = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0);
      }
      return G__56411__delegate.call(this, x, y, more);
    };
    G__56411.cljs$lang$maxFixedArity = 2;
    G__56411.cljs$lang$applyTo = function(arglist__56412) {
      var x = cljs.core.first(arglist__56412);
      arglist__56412 = cljs.core.next(arglist__56412);
      var y = cljs.core.first(arglist__56412);
      var more = cljs.core.rest(arglist__56412);
      return G__56411__delegate(x, y, more);
    };
    G__56411.cljs$core$IFn$_invoke$arity$variadic = G__56411__delegate;
    return G__56411;
  }();
  _ = function(x, y, var_args) {
    var more = var_args;
    switch(arguments.length) {
      case 1:
        return ___1.call(this, x);
      case 2:
        return ___2.call(this, x, y);
      default:
        return ___3.cljs$core$IFn$_invoke$arity$variadic(x, y, cljs.core.array_seq(arguments, 2));
    }
    throw new Error("Invalid arity: " + arguments.length);
  };
  _.cljs$lang$maxFixedArity = 2;
  _.cljs$lang$applyTo = ___3.cljs$lang$applyTo;
  _.cljs$core$IFn$_invoke$arity$1 = ___1;
  _.cljs$core$IFn$_invoke$arity$2 = ___2;
  _.cljs$core$IFn$_invoke$arity$variadic = ___3.cljs$core$IFn$_invoke$arity$variadic;
  return _;
}();
cljs.core._STAR_ = function() {
  var _STAR_ = null;
  var _STAR___0 = function() {
    return 1;
  };
  var _STAR___1 = function(x) {
    return x;
  };
  var _STAR___2 = function(x, y) {
    return x * y;
  };
  var _STAR___3 = function() {
    var G__56413__delegate = function(x, y, more) {
      return cljs.core.reduce.call(null, _STAR_, x * y, more);
    };
    var G__56413 = function(x, y, var_args) {
      var more = null;
      if (arguments.length > 2) {
        more = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0);
      }
      return G__56413__delegate.call(this, x, y, more);
    };
    G__56413.cljs$lang$maxFixedArity = 2;
    G__56413.cljs$lang$applyTo = function(arglist__56414) {
      var x = cljs.core.first(arglist__56414);
      arglist__56414 = cljs.core.next(arglist__56414);
      var y = cljs.core.first(arglist__56414);
      var more = cljs.core.rest(arglist__56414);
      return G__56413__delegate(x, y, more);
    };
    G__56413.cljs$core$IFn$_invoke$arity$variadic = G__56413__delegate;
    return G__56413;
  }();
  _STAR_ = function(x, y, var_args) {
    var more = var_args;
    switch(arguments.length) {
      case 0:
        return _STAR___0.call(this);
      case 1:
        return _STAR___1.call(this, x);
      case 2:
        return _STAR___2.call(this, x, y);
      default:
        return _STAR___3.cljs$core$IFn$_invoke$arity$variadic(x, y, cljs.core.array_seq(arguments, 2));
    }
    throw new Error("Invalid arity: " + arguments.length);
  };
  _STAR_.cljs$lang$maxFixedArity = 2;
  _STAR_.cljs$lang$applyTo = _STAR___3.cljs$lang$applyTo;
  _STAR_.cljs$core$IFn$_invoke$arity$0 = _STAR___0;
  _STAR_.cljs$core$IFn$_invoke$arity$1 = _STAR___1;
  _STAR_.cljs$core$IFn$_invoke$arity$2 = _STAR___2;
  _STAR_.cljs$core$IFn$_invoke$arity$variadic = _STAR___3.cljs$core$IFn$_invoke$arity$variadic;
  return _STAR_;
}();
cljs.core._SLASH_ = function() {
  var _SLASH_ = null;
  var _SLASH___1 = function(x) {
    return _SLASH_.call(null, 1, x);
  };
  var _SLASH___2 = function(x, y) {
    return x / y;
  };
  var _SLASH___3 = function() {
    var G__56415__delegate = function(x, y, more) {
      return cljs.core.reduce.call(null, _SLASH_, _SLASH_.call(null, x, y), more);
    };
    var G__56415 = function(x, y, var_args) {
      var more = null;
      if (arguments.length > 2) {
        more = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0);
      }
      return G__56415__delegate.call(this, x, y, more);
    };
    G__56415.cljs$lang$maxFixedArity = 2;
    G__56415.cljs$lang$applyTo = function(arglist__56416) {
      var x = cljs.core.first(arglist__56416);
      arglist__56416 = cljs.core.next(arglist__56416);
      var y = cljs.core.first(arglist__56416);
      var more = cljs.core.rest(arglist__56416);
      return G__56415__delegate(x, y, more);
    };
    G__56415.cljs$core$IFn$_invoke$arity$variadic = G__56415__delegate;
    return G__56415;
  }();
  _SLASH_ = function(x, y, var_args) {
    var more = var_args;
    switch(arguments.length) {
      case 1:
        return _SLASH___1.call(this, x);
      case 2:
        return _SLASH___2.call(this, x, y);
      default:
        return _SLASH___3.cljs$core$IFn$_invoke$arity$variadic(x, y, cljs.core.array_seq(arguments, 2));
    }
    throw new Error("Invalid arity: " + arguments.length);
  };
  _SLASH_.cljs$lang$maxFixedArity = 2;
  _SLASH_.cljs$lang$applyTo = _SLASH___3.cljs$lang$applyTo;
  _SLASH_.cljs$core$IFn$_invoke$arity$1 = _SLASH___1;
  _SLASH_.cljs$core$IFn$_invoke$arity$2 = _SLASH___2;
  _SLASH_.cljs$core$IFn$_invoke$arity$variadic = _SLASH___3.cljs$core$IFn$_invoke$arity$variadic;
  return _SLASH_;
}();
cljs.core._LT_ = function() {
  var _LT_ = null;
  var _LT___1 = function(x) {
    return true;
  };
  var _LT___2 = function(x, y) {
    return x < y;
  };
  var _LT___3 = function() {
    var G__56417__delegate = function(x, y, more) {
      while (true) {
        if (x < y) {
          if (cljs.core.next.call(null, more)) {
            var G__56418 = y;
            var G__56419 = cljs.core.first.call(null, more);
            var G__56420 = cljs.core.next.call(null, more);
            x = G__56418;
            y = G__56419;
            more = G__56420;
            continue;
          } else {
            return y < cljs.core.first.call(null, more);
          }
        } else {
          return false;
        }
        break;
      }
    };
    var G__56417 = function(x, y, var_args) {
      var more = null;
      if (arguments.length > 2) {
        more = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0);
      }
      return G__56417__delegate.call(this, x, y, more);
    };
    G__56417.cljs$lang$maxFixedArity = 2;
    G__56417.cljs$lang$applyTo = function(arglist__56421) {
      var x = cljs.core.first(arglist__56421);
      arglist__56421 = cljs.core.next(arglist__56421);
      var y = cljs.core.first(arglist__56421);
      var more = cljs.core.rest(arglist__56421);
      return G__56417__delegate(x, y, more);
    };
    G__56417.cljs$core$IFn$_invoke$arity$variadic = G__56417__delegate;
    return G__56417;
  }();
  _LT_ = function(x, y, var_args) {
    var more = var_args;
    switch(arguments.length) {
      case 1:
        return _LT___1.call(this, x);
      case 2:
        return _LT___2.call(this, x, y);
      default:
        return _LT___3.cljs$core$IFn$_invoke$arity$variadic(x, y, cljs.core.array_seq(arguments, 2));
    }
    throw new Error("Invalid arity: " + arguments.length);
  };
  _LT_.cljs$lang$maxFixedArity = 2;
  _LT_.cljs$lang$applyTo = _LT___3.cljs$lang$applyTo;
  _LT_.cljs$core$IFn$_invoke$arity$1 = _LT___1;
  _LT_.cljs$core$IFn$_invoke$arity$2 = _LT___2;
  _LT_.cljs$core$IFn$_invoke$arity$variadic = _LT___3.cljs$core$IFn$_invoke$arity$variadic;
  return _LT_;
}();
cljs.core._LT__EQ_ = function() {
  var _LT__EQ_ = null;
  var _LT__EQ___1 = function(x) {
    return true;
  };
  var _LT__EQ___2 = function(x, y) {
    return x <= y;
  };
  var _LT__EQ___3 = function() {
    var G__56422__delegate = function(x, y, more) {
      while (true) {
        if (x <= y) {
          if (cljs.core.next.call(null, more)) {
            var G__56423 = y;
            var G__56424 = cljs.core.first.call(null, more);
            var G__56425 = cljs.core.next.call(null, more);
            x = G__56423;
            y = G__56424;
            more = G__56425;
            continue;
          } else {
            return y <= cljs.core.first.call(null, more);
          }
        } else {
          return false;
        }
        break;
      }
    };
    var G__56422 = function(x, y, var_args) {
      var more = null;
      if (arguments.length > 2) {
        more = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0);
      }
      return G__56422__delegate.call(this, x, y, more);
    };
    G__56422.cljs$lang$maxFixedArity = 2;
    G__56422.cljs$lang$applyTo = function(arglist__56426) {
      var x = cljs.core.first(arglist__56426);
      arglist__56426 = cljs.core.next(arglist__56426);
      var y = cljs.core.first(arglist__56426);
      var more = cljs.core.rest(arglist__56426);
      return G__56422__delegate(x, y, more);
    };
    G__56422.cljs$core$IFn$_invoke$arity$variadic = G__56422__delegate;
    return G__56422;
  }();
  _LT__EQ_ = function(x, y, var_args) {
    var more = var_args;
    switch(arguments.length) {
      case 1:
        return _LT__EQ___1.call(this, x);
      case 2:
        return _LT__EQ___2.call(this, x, y);
      default:
        return _LT__EQ___3.cljs$core$IFn$_invoke$arity$variadic(x, y, cljs.core.array_seq(arguments, 2));
    }
    throw new Error("Invalid arity: " + arguments.length);
  };
  _LT__EQ_.cljs$lang$maxFixedArity = 2;
  _LT__EQ_.cljs$lang$applyTo = _LT__EQ___3.cljs$lang$applyTo;
  _LT__EQ_.cljs$core$IFn$_invoke$arity$1 = _LT__EQ___1;
  _LT__EQ_.cljs$core$IFn$_invoke$arity$2 = _LT__EQ___2;
  _LT__EQ_.cljs$core$IFn$_invoke$arity$variadic = _LT__EQ___3.cljs$core$IFn$_invoke$arity$variadic;
  return _LT__EQ_;
}();
cljs.core._GT_ = function() {
  var _GT_ = null;
  var _GT___1 = function(x) {
    return true;
  };
  var _GT___2 = function(x, y) {
    return x > y;
  };
  var _GT___3 = function() {
    var G__56427__delegate = function(x, y, more) {
      while (true) {
        if (x > y) {
          if (cljs.core.next.call(null, more)) {
            var G__56428 = y;
            var G__56429 = cljs.core.first.call(null, more);
            var G__56430 = cljs.core.next.call(null, more);
            x = G__56428;
            y = G__56429;
            more = G__56430;
            continue;
          } else {
            return y > cljs.core.first.call(null, more);
          }
        } else {
          return false;
        }
        break;
      }
    };
    var G__56427 = function(x, y, var_args) {
      var more = null;
      if (arguments.length > 2) {
        more = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0);
      }
      return G__56427__delegate.call(this, x, y, more);
    };
    G__56427.cljs$lang$maxFixedArity = 2;
    G__56427.cljs$lang$applyTo = function(arglist__56431) {
      var x = cljs.core.first(arglist__56431);
      arglist__56431 = cljs.core.next(arglist__56431);
      var y = cljs.core.first(arglist__56431);
      var more = cljs.core.rest(arglist__56431);
      return G__56427__delegate(x, y, more);
    };
    G__56427.cljs$core$IFn$_invoke$arity$variadic = G__56427__delegate;
    return G__56427;
  }();
  _GT_ = function(x, y, var_args) {
    var more = var_args;
    switch(arguments.length) {
      case 1:
        return _GT___1.call(this, x);
      case 2:
        return _GT___2.call(this, x, y);
      default:
        return _GT___3.cljs$core$IFn$_invoke$arity$variadic(x, y, cljs.core.array_seq(arguments, 2));
    }
    throw new Error("Invalid arity: " + arguments.length);
  };
  _GT_.cljs$lang$maxFixedArity = 2;
  _GT_.cljs$lang$applyTo = _GT___3.cljs$lang$applyTo;
  _GT_.cljs$core$IFn$_invoke$arity$1 = _GT___1;
  _GT_.cljs$core$IFn$_invoke$arity$2 = _GT___2;
  _GT_.cljs$core$IFn$_invoke$arity$variadic = _GT___3.cljs$core$IFn$_invoke$arity$variadic;
  return _GT_;
}();
cljs.core._GT__EQ_ = function() {
  var _GT__EQ_ = null;
  var _GT__EQ___1 = function(x) {
    return true;
  };
  var _GT__EQ___2 = function(x, y) {
    return x >= y;
  };
  var _GT__EQ___3 = function() {
    var G__56432__delegate = function(x, y, more) {
      while (true) {
        if (x >= y) {
          if (cljs.core.next.call(null, more)) {
            var G__56433 = y;
            var G__56434 = cljs.core.first.call(null, more);
            var G__56435 = cljs.core.next.call(null, more);
            x = G__56433;
            y = G__56434;
            more = G__56435;
            continue;
          } else {
            return y >= cljs.core.first.call(null, more);
          }
        } else {
          return false;
        }
        break;
      }
    };
    var G__56432 = function(x, y, var_args) {
      var more = null;
      if (arguments.length > 2) {
        more = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0);
      }
      return G__56432__delegate.call(this, x, y, more);
    };
    G__56432.cljs$lang$maxFixedArity = 2;
    G__56432.cljs$lang$applyTo = function(arglist__56436) {
      var x = cljs.core.first(arglist__56436);
      arglist__56436 = cljs.core.next(arglist__56436);
      var y = cljs.core.first(arglist__56436);
      var more = cljs.core.rest(arglist__56436);
      return G__56432__delegate(x, y, more);
    };
    G__56432.cljs$core$IFn$_invoke$arity$variadic = G__56432__delegate;
    return G__56432;
  }();
  _GT__EQ_ = function(x, y, var_args) {
    var more = var_args;
    switch(arguments.length) {
      case 1:
        return _GT__EQ___1.call(this, x);
      case 2:
        return _GT__EQ___2.call(this, x, y);
      default:
        return _GT__EQ___3.cljs$core$IFn$_invoke$arity$variadic(x, y, cljs.core.array_seq(arguments, 2));
    }
    throw new Error("Invalid arity: " + arguments.length);
  };
  _GT__EQ_.cljs$lang$maxFixedArity = 2;
  _GT__EQ_.cljs$lang$applyTo = _GT__EQ___3.cljs$lang$applyTo;
  _GT__EQ_.cljs$core$IFn$_invoke$arity$1 = _GT__EQ___1;
  _GT__EQ_.cljs$core$IFn$_invoke$arity$2 = _GT__EQ___2;
  _GT__EQ_.cljs$core$IFn$_invoke$arity$variadic = _GT__EQ___3.cljs$core$IFn$_invoke$arity$variadic;
  return _GT__EQ_;
}();
cljs.core.dec = function dec(x) {
  return x - 1;
};
cljs.core.max = function() {
  var max = null;
  var max__1 = function(x) {
    return x;
  };
  var max__2 = function(x, y) {
    var x__3946__auto__ = x;
    var y__3947__auto__ = y;
    return x__3946__auto__ > y__3947__auto__ ? x__3946__auto__ : y__3947__auto__;
  };
  var max__3 = function() {
    var G__56437__delegate = function(x, y, more) {
      return cljs.core.reduce.call(null, max, function() {
        var x__3946__auto__ = x;
        var y__3947__auto__ = y;
        return x__3946__auto__ > y__3947__auto__ ? x__3946__auto__ : y__3947__auto__;
      }(), more);
    };
    var G__56437 = function(x, y, var_args) {
      var more = null;
      if (arguments.length > 2) {
        more = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0);
      }
      return G__56437__delegate.call(this, x, y, more);
    };
    G__56437.cljs$lang$maxFixedArity = 2;
    G__56437.cljs$lang$applyTo = function(arglist__56438) {
      var x = cljs.core.first(arglist__56438);
      arglist__56438 = cljs.core.next(arglist__56438);
      var y = cljs.core.first(arglist__56438);
      var more = cljs.core.rest(arglist__56438);
      return G__56437__delegate(x, y, more);
    };
    G__56437.cljs$core$IFn$_invoke$arity$variadic = G__56437__delegate;
    return G__56437;
  }();
  max = function(x, y, var_args) {
    var more = var_args;
    switch(arguments.length) {
      case 1:
        return max__1.call(this, x);
      case 2:
        return max__2.call(this, x, y);
      default:
        return max__3.cljs$core$IFn$_invoke$arity$variadic(x, y, cljs.core.array_seq(arguments, 2));
    }
    throw new Error("Invalid arity: " + arguments.length);
  };
  max.cljs$lang$maxFixedArity = 2;
  max.cljs$lang$applyTo = max__3.cljs$lang$applyTo;
  max.cljs$core$IFn$_invoke$arity$1 = max__1;
  max.cljs$core$IFn$_invoke$arity$2 = max__2;
  max.cljs$core$IFn$_invoke$arity$variadic = max__3.cljs$core$IFn$_invoke$arity$variadic;
  return max;
}();
cljs.core.min = function() {
  var min = null;
  var min__1 = function(x) {
    return x;
  };
  var min__2 = function(x, y) {
    var x__3953__auto__ = x;
    var y__3954__auto__ = y;
    return x__3953__auto__ < y__3954__auto__ ? x__3953__auto__ : y__3954__auto__;
  };
  var min__3 = function() {
    var G__56439__delegate = function(x, y, more) {
      return cljs.core.reduce.call(null, min, function() {
        var x__3953__auto__ = x;
        var y__3954__auto__ = y;
        return x__3953__auto__ < y__3954__auto__ ? x__3953__auto__ : y__3954__auto__;
      }(), more);
    };
    var G__56439 = function(x, y, var_args) {
      var more = null;
      if (arguments.length > 2) {
        more = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0);
      }
      return G__56439__delegate.call(this, x, y, more);
    };
    G__56439.cljs$lang$maxFixedArity = 2;
    G__56439.cljs$lang$applyTo = function(arglist__56440) {
      var x = cljs.core.first(arglist__56440);
      arglist__56440 = cljs.core.next(arglist__56440);
      var y = cljs.core.first(arglist__56440);
      var more = cljs.core.rest(arglist__56440);
      return G__56439__delegate(x, y, more);
    };
    G__56439.cljs$core$IFn$_invoke$arity$variadic = G__56439__delegate;
    return G__56439;
  }();
  min = function(x, y, var_args) {
    var more = var_args;
    switch(arguments.length) {
      case 1:
        return min__1.call(this, x);
      case 2:
        return min__2.call(this, x, y);
      default:
        return min__3.cljs$core$IFn$_invoke$arity$variadic(x, y, cljs.core.array_seq(arguments, 2));
    }
    throw new Error("Invalid arity: " + arguments.length);
  };
  min.cljs$lang$maxFixedArity = 2;
  min.cljs$lang$applyTo = min__3.cljs$lang$applyTo;
  min.cljs$core$IFn$_invoke$arity$1 = min__1;
  min.cljs$core$IFn$_invoke$arity$2 = min__2;
  min.cljs$core$IFn$_invoke$arity$variadic = min__3.cljs$core$IFn$_invoke$arity$variadic;
  return min;
}();
cljs.core.byte$ = function byte$(x) {
  return x;
};
cljs.core.char$ = function char$(x) {
  if (typeof x === "number") {
    return String.fromCharCode(x);
  } else {
    if (typeof x === "string" && x.length === 1) {
      return x;
    } else {
      throw new Error("Argument to char must be a character or number");
    }
  }
};
cljs.core.short$ = function short$(x) {
  return x;
};
cljs.core.float$ = function float$(x) {
  return x;
};
cljs.core.double$ = function double$(x) {
  return x;
};
cljs.core.unchecked_byte = function unchecked_byte(x) {
  return x;
};
cljs.core.unchecked_char = function unchecked_char(x) {
  return x;
};
cljs.core.unchecked_short = function unchecked_short(x) {
  return x;
};
cljs.core.unchecked_float = function unchecked_float(x) {
  return x;
};
cljs.core.unchecked_double = function unchecked_double(x) {
  return x;
};
cljs.core.unchecked_add = function() {
  var unchecked_add = null;
  var unchecked_add__0 = function() {
    return 0;
  };
  var unchecked_add__1 = function(x) {
    return x;
  };
  var unchecked_add__2 = function(x, y) {
    return x + y;
  };
  var unchecked_add__3 = function() {
    var G__56441__delegate = function(x, y, more) {
      return cljs.core.reduce.call(null, unchecked_add, x + y, more);
    };
    var G__56441 = function(x, y, var_args) {
      var more = null;
      if (arguments.length > 2) {
        more = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0);
      }
      return G__56441__delegate.call(this, x, y, more);
    };
    G__56441.cljs$lang$maxFixedArity = 2;
    G__56441.cljs$lang$applyTo = function(arglist__56442) {
      var x = cljs.core.first(arglist__56442);
      arglist__56442 = cljs.core.next(arglist__56442);
      var y = cljs.core.first(arglist__56442);
      var more = cljs.core.rest(arglist__56442);
      return G__56441__delegate(x, y, more);
    };
    G__56441.cljs$core$IFn$_invoke$arity$variadic = G__56441__delegate;
    return G__56441;
  }();
  unchecked_add = function(x, y, var_args) {
    var more = var_args;
    switch(arguments.length) {
      case 0:
        return unchecked_add__0.call(this);
      case 1:
        return unchecked_add__1.call(this, x);
      case 2:
        return unchecked_add__2.call(this, x, y);
      default:
        return unchecked_add__3.cljs$core$IFn$_invoke$arity$variadic(x, y, cljs.core.array_seq(arguments, 2));
    }
    throw new Error("Invalid arity: " + arguments.length);
  };
  unchecked_add.cljs$lang$maxFixedArity = 2;
  unchecked_add.cljs$lang$applyTo = unchecked_add__3.cljs$lang$applyTo;
  unchecked_add.cljs$core$IFn$_invoke$arity$0 = unchecked_add__0;
  unchecked_add.cljs$core$IFn$_invoke$arity$1 = unchecked_add__1;
  unchecked_add.cljs$core$IFn$_invoke$arity$2 = unchecked_add__2;
  unchecked_add.cljs$core$IFn$_invoke$arity$variadic = unchecked_add__3.cljs$core$IFn$_invoke$arity$variadic;
  return unchecked_add;
}();
cljs.core.unchecked_add_int = function() {
  var unchecked_add_int = null;
  var unchecked_add_int__0 = function() {
    return 0;
  };
  var unchecked_add_int__1 = function(x) {
    return x;
  };
  var unchecked_add_int__2 = function(x, y) {
    return x + y;
  };
  var unchecked_add_int__3 = function() {
    var G__56443__delegate = function(x, y, more) {
      return cljs.core.reduce.call(null, unchecked_add_int, x + y, more);
    };
    var G__56443 = function(x, y, var_args) {
      var more = null;
      if (arguments.length > 2) {
        more = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0);
      }
      return G__56443__delegate.call(this, x, y, more);
    };
    G__56443.cljs$lang$maxFixedArity = 2;
    G__56443.cljs$lang$applyTo = function(arglist__56444) {
      var x = cljs.core.first(arglist__56444);
      arglist__56444 = cljs.core.next(arglist__56444);
      var y = cljs.core.first(arglist__56444);
      var more = cljs.core.rest(arglist__56444);
      return G__56443__delegate(x, y, more);
    };
    G__56443.cljs$core$IFn$_invoke$arity$variadic = G__56443__delegate;
    return G__56443;
  }();
  unchecked_add_int = function(x, y, var_args) {
    var more = var_args;
    switch(arguments.length) {
      case 0:
        return unchecked_add_int__0.call(this);
      case 1:
        return unchecked_add_int__1.call(this, x);
      case 2:
        return unchecked_add_int__2.call(this, x, y);
      default:
        return unchecked_add_int__3.cljs$core$IFn$_invoke$arity$variadic(x, y, cljs.core.array_seq(arguments, 2));
    }
    throw new Error("Invalid arity: " + arguments.length);
  };
  unchecked_add_int.cljs$lang$maxFixedArity = 2;
  unchecked_add_int.cljs$lang$applyTo = unchecked_add_int__3.cljs$lang$applyTo;
  unchecked_add_int.cljs$core$IFn$_invoke$arity$0 = unchecked_add_int__0;
  unchecked_add_int.cljs$core$IFn$_invoke$arity$1 = unchecked_add_int__1;
  unchecked_add_int.cljs$core$IFn$_invoke$arity$2 = unchecked_add_int__2;
  unchecked_add_int.cljs$core$IFn$_invoke$arity$variadic = unchecked_add_int__3.cljs$core$IFn$_invoke$arity$variadic;
  return unchecked_add_int;
}();
cljs.core.unchecked_dec = function unchecked_dec(x) {
  return x - 1;
};
cljs.core.unchecked_dec_int = function unchecked_dec_int(x) {
  return x - 1;
};
cljs.core.unchecked_divide_int = function() {
  var unchecked_divide_int = null;
  var unchecked_divide_int__1 = function(x) {
    return unchecked_divide_int.call(null, 1, x);
  };
  var unchecked_divide_int__2 = function(x, y) {
    return x / y;
  };
  var unchecked_divide_int__3 = function() {
    var G__56445__delegate = function(x, y, more) {
      return cljs.core.reduce.call(null, unchecked_divide_int, unchecked_divide_int.call(null, x, y), more);
    };
    var G__56445 = function(x, y, var_args) {
      var more = null;
      if (arguments.length > 2) {
        more = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0);
      }
      return G__56445__delegate.call(this, x, y, more);
    };
    G__56445.cljs$lang$maxFixedArity = 2;
    G__56445.cljs$lang$applyTo = function(arglist__56446) {
      var x = cljs.core.first(arglist__56446);
      arglist__56446 = cljs.core.next(arglist__56446);
      var y = cljs.core.first(arglist__56446);
      var more = cljs.core.rest(arglist__56446);
      return G__56445__delegate(x, y, more);
    };
    G__56445.cljs$core$IFn$_invoke$arity$variadic = G__56445__delegate;
    return G__56445;
  }();
  unchecked_divide_int = function(x, y, var_args) {
    var more = var_args;
    switch(arguments.length) {
      case 1:
        return unchecked_divide_int__1.call(this, x);
      case 2:
        return unchecked_divide_int__2.call(this, x, y);
      default:
        return unchecked_divide_int__3.cljs$core$IFn$_invoke$arity$variadic(x, y, cljs.core.array_seq(arguments, 2));
    }
    throw new Error("Invalid arity: " + arguments.length);
  };
  unchecked_divide_int.cljs$lang$maxFixedArity = 2;
  unchecked_divide_int.cljs$lang$applyTo = unchecked_divide_int__3.cljs$lang$applyTo;
  unchecked_divide_int.cljs$core$IFn$_invoke$arity$1 = unchecked_divide_int__1;
  unchecked_divide_int.cljs$core$IFn$_invoke$arity$2 = unchecked_divide_int__2;
  unchecked_divide_int.cljs$core$IFn$_invoke$arity$variadic = unchecked_divide_int__3.cljs$core$IFn$_invoke$arity$variadic;
  return unchecked_divide_int;
}();
cljs.core.unchecked_inc = function unchecked_inc(x) {
  return x + 1;
};
cljs.core.unchecked_inc_int = function unchecked_inc_int(x) {
  return x + 1;
};
cljs.core.unchecked_multiply = function() {
  var unchecked_multiply = null;
  var unchecked_multiply__0 = function() {
    return 1;
  };
  var unchecked_multiply__1 = function(x) {
    return x;
  };
  var unchecked_multiply__2 = function(x, y) {
    return x * y;
  };
  var unchecked_multiply__3 = function() {
    var G__56447__delegate = function(x, y, more) {
      return cljs.core.reduce.call(null, unchecked_multiply, x * y, more);
    };
    var G__56447 = function(x, y, var_args) {
      var more = null;
      if (arguments.length > 2) {
        more = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0);
      }
      return G__56447__delegate.call(this, x, y, more);
    };
    G__56447.cljs$lang$maxFixedArity = 2;
    G__56447.cljs$lang$applyTo = function(arglist__56448) {
      var x = cljs.core.first(arglist__56448);
      arglist__56448 = cljs.core.next(arglist__56448);
      var y = cljs.core.first(arglist__56448);
      var more = cljs.core.rest(arglist__56448);
      return G__56447__delegate(x, y, more);
    };
    G__56447.cljs$core$IFn$_invoke$arity$variadic = G__56447__delegate;
    return G__56447;
  }();
  unchecked_multiply = function(x, y, var_args) {
    var more = var_args;
    switch(arguments.length) {
      case 0:
        return unchecked_multiply__0.call(this);
      case 1:
        return unchecked_multiply__1.call(this, x);
      case 2:
        return unchecked_multiply__2.call(this, x, y);
      default:
        return unchecked_multiply__3.cljs$core$IFn$_invoke$arity$variadic(x, y, cljs.core.array_seq(arguments, 2));
    }
    throw new Error("Invalid arity: " + arguments.length);
  };
  unchecked_multiply.cljs$lang$maxFixedArity = 2;
  unchecked_multiply.cljs$lang$applyTo = unchecked_multiply__3.cljs$lang$applyTo;
  unchecked_multiply.cljs$core$IFn$_invoke$arity$0 = unchecked_multiply__0;
  unchecked_multiply.cljs$core$IFn$_invoke$arity$1 = unchecked_multiply__1;
  unchecked_multiply.cljs$core$IFn$_invoke$arity$2 = unchecked_multiply__2;
  unchecked_multiply.cljs$core$IFn$_invoke$arity$variadic = unchecked_multiply__3.cljs$core$IFn$_invoke$arity$variadic;
  return unchecked_multiply;
}();
cljs.core.unchecked_multiply_int = function() {
  var unchecked_multiply_int = null;
  var unchecked_multiply_int__0 = function() {
    return 1;
  };
  var unchecked_multiply_int__1 = function(x) {
    return x;
  };
  var unchecked_multiply_int__2 = function(x, y) {
    return x * y;
  };
  var unchecked_multiply_int__3 = function() {
    var G__56449__delegate = function(x, y, more) {
      return cljs.core.reduce.call(null, unchecked_multiply_int, x * y, more);
    };
    var G__56449 = function(x, y, var_args) {
      var more = null;
      if (arguments.length > 2) {
        more = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0);
      }
      return G__56449__delegate.call(this, x, y, more);
    };
    G__56449.cljs$lang$maxFixedArity = 2;
    G__56449.cljs$lang$applyTo = function(arglist__56450) {
      var x = cljs.core.first(arglist__56450);
      arglist__56450 = cljs.core.next(arglist__56450);
      var y = cljs.core.first(arglist__56450);
      var more = cljs.core.rest(arglist__56450);
      return G__56449__delegate(x, y, more);
    };
    G__56449.cljs$core$IFn$_invoke$arity$variadic = G__56449__delegate;
    return G__56449;
  }();
  unchecked_multiply_int = function(x, y, var_args) {
    var more = var_args;
    switch(arguments.length) {
      case 0:
        return unchecked_multiply_int__0.call(this);
      case 1:
        return unchecked_multiply_int__1.call(this, x);
      case 2:
        return unchecked_multiply_int__2.call(this, x, y);
      default:
        return unchecked_multiply_int__3.cljs$core$IFn$_invoke$arity$variadic(x, y, cljs.core.array_seq(arguments, 2));
    }
    throw new Error("Invalid arity: " + arguments.length);
  };
  unchecked_multiply_int.cljs$lang$maxFixedArity = 2;
  unchecked_multiply_int.cljs$lang$applyTo = unchecked_multiply_int__3.cljs$lang$applyTo;
  unchecked_multiply_int.cljs$core$IFn$_invoke$arity$0 = unchecked_multiply_int__0;
  unchecked_multiply_int.cljs$core$IFn$_invoke$arity$1 = unchecked_multiply_int__1;
  unchecked_multiply_int.cljs$core$IFn$_invoke$arity$2 = unchecked_multiply_int__2;
  unchecked_multiply_int.cljs$core$IFn$_invoke$arity$variadic = unchecked_multiply_int__3.cljs$core$IFn$_invoke$arity$variadic;
  return unchecked_multiply_int;
}();
cljs.core.unchecked_negate = function unchecked_negate(x) {
  return-x;
};
cljs.core.unchecked_negate_int = function unchecked_negate_int(x) {
  return-x;
};
cljs.core.unchecked_remainder_int = function unchecked_remainder_int(x, n) {
  return cljs.core.mod.call(null, x, n);
};
cljs.core.unchecked_subtract = function() {
  var unchecked_subtract = null;
  var unchecked_subtract__1 = function(x) {
    return-x;
  };
  var unchecked_subtract__2 = function(x, y) {
    return x - y;
  };
  var unchecked_subtract__3 = function() {
    var G__56451__delegate = function(x, y, more) {
      return cljs.core.reduce.call(null, unchecked_subtract, x - y, more);
    };
    var G__56451 = function(x, y, var_args) {
      var more = null;
      if (arguments.length > 2) {
        more = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0);
      }
      return G__56451__delegate.call(this, x, y, more);
    };
    G__56451.cljs$lang$maxFixedArity = 2;
    G__56451.cljs$lang$applyTo = function(arglist__56452) {
      var x = cljs.core.first(arglist__56452);
      arglist__56452 = cljs.core.next(arglist__56452);
      var y = cljs.core.first(arglist__56452);
      var more = cljs.core.rest(arglist__56452);
      return G__56451__delegate(x, y, more);
    };
    G__56451.cljs$core$IFn$_invoke$arity$variadic = G__56451__delegate;
    return G__56451;
  }();
  unchecked_subtract = function(x, y, var_args) {
    var more = var_args;
    switch(arguments.length) {
      case 1:
        return unchecked_subtract__1.call(this, x);
      case 2:
        return unchecked_subtract__2.call(this, x, y);
      default:
        return unchecked_subtract__3.cljs$core$IFn$_invoke$arity$variadic(x, y, cljs.core.array_seq(arguments, 2));
    }
    throw new Error("Invalid arity: " + arguments.length);
  };
  unchecked_subtract.cljs$lang$maxFixedArity = 2;
  unchecked_subtract.cljs$lang$applyTo = unchecked_subtract__3.cljs$lang$applyTo;
  unchecked_subtract.cljs$core$IFn$_invoke$arity$1 = unchecked_subtract__1;
  unchecked_subtract.cljs$core$IFn$_invoke$arity$2 = unchecked_subtract__2;
  unchecked_subtract.cljs$core$IFn$_invoke$arity$variadic = unchecked_subtract__3.cljs$core$IFn$_invoke$arity$variadic;
  return unchecked_subtract;
}();
cljs.core.unchecked_subtract_int = function() {
  var unchecked_subtract_int = null;
  var unchecked_subtract_int__1 = function(x) {
    return-x;
  };
  var unchecked_subtract_int__2 = function(x, y) {
    return x - y;
  };
  var unchecked_subtract_int__3 = function() {
    var G__56453__delegate = function(x, y, more) {
      return cljs.core.reduce.call(null, unchecked_subtract_int, x - y, more);
    };
    var G__56453 = function(x, y, var_args) {
      var more = null;
      if (arguments.length > 2) {
        more = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0);
      }
      return G__56453__delegate.call(this, x, y, more);
    };
    G__56453.cljs$lang$maxFixedArity = 2;
    G__56453.cljs$lang$applyTo = function(arglist__56454) {
      var x = cljs.core.first(arglist__56454);
      arglist__56454 = cljs.core.next(arglist__56454);
      var y = cljs.core.first(arglist__56454);
      var more = cljs.core.rest(arglist__56454);
      return G__56453__delegate(x, y, more);
    };
    G__56453.cljs$core$IFn$_invoke$arity$variadic = G__56453__delegate;
    return G__56453;
  }();
  unchecked_subtract_int = function(x, y, var_args) {
    var more = var_args;
    switch(arguments.length) {
      case 1:
        return unchecked_subtract_int__1.call(this, x);
      case 2:
        return unchecked_subtract_int__2.call(this, x, y);
      default:
        return unchecked_subtract_int__3.cljs$core$IFn$_invoke$arity$variadic(x, y, cljs.core.array_seq(arguments, 2));
    }
    throw new Error("Invalid arity: " + arguments.length);
  };
  unchecked_subtract_int.cljs$lang$maxFixedArity = 2;
  unchecked_subtract_int.cljs$lang$applyTo = unchecked_subtract_int__3.cljs$lang$applyTo;
  unchecked_subtract_int.cljs$core$IFn$_invoke$arity$1 = unchecked_subtract_int__1;
  unchecked_subtract_int.cljs$core$IFn$_invoke$arity$2 = unchecked_subtract_int__2;
  unchecked_subtract_int.cljs$core$IFn$_invoke$arity$variadic = unchecked_subtract_int__3.cljs$core$IFn$_invoke$arity$variadic;
  return unchecked_subtract_int;
}();
cljs.core.fix = function fix(q) {
  if (q >= 0) {
    return Math.floor.call(null, q);
  } else {
    return Math.ceil.call(null, q);
  }
};
cljs.core.int$ = function int$(x) {
  return x | 0;
};
cljs.core.unchecked_int = function unchecked_int(x) {
  return cljs.core.fix.call(null, x);
};
cljs.core.long$ = function long$(x) {
  return cljs.core.fix.call(null, x);
};
cljs.core.unchecked_long = function unchecked_long(x) {
  return cljs.core.fix.call(null, x);
};
cljs.core.booleans = function booleans(x) {
  return x;
};
cljs.core.bytes = function bytes(x) {
  return x;
};
cljs.core.chars = function chars(x) {
  return x;
};
cljs.core.shorts = function shorts(x) {
  return x;
};
cljs.core.ints = function ints(x) {
  return x;
};
cljs.core.floats = function floats(x) {
  return x;
};
cljs.core.doubles = function doubles(x) {
  return x;
};
cljs.core.longs = function longs(x) {
  return x;
};
cljs.core.js_mod = function js_mod(n, d) {
  return n % d;
};
cljs.core.mod = function mod(n, d) {
  return(n % d + d) % d;
};
cljs.core.quot = function quot(n, d) {
  var rem = n % d;
  return cljs.core.fix.call(null, (n - rem) / d);
};
cljs.core.rem = function rem(n, d) {
  var q = cljs.core.quot.call(null, n, d);
  return n - d * q;
};
cljs.core.rand = function() {
  var rand = null;
  var rand__0 = function() {
    return Math.random.call(null);
  };
  var rand__1 = function(n) {
    return n * rand.call(null);
  };
  rand = function(n) {
    switch(arguments.length) {
      case 0:
        return rand__0.call(this);
      case 1:
        return rand__1.call(this, n);
    }
    throw new Error("Invalid arity: " + arguments.length);
  };
  rand.cljs$core$IFn$_invoke$arity$0 = rand__0;
  rand.cljs$core$IFn$_invoke$arity$1 = rand__1;
  return rand;
}();
cljs.core.rand_int = function rand_int(n) {
  return cljs.core.fix.call(null, cljs.core.rand.call(null, n));
};
cljs.core.bit_xor = function bit_xor(x, y) {
  return x ^ y;
};
cljs.core.bit_and = function bit_and(x, y) {
  return x & y;
};
cljs.core.bit_or = function bit_or(x, y) {
  return x | y;
};
cljs.core.bit_and_not = function bit_and_not(x, y) {
  return x & ~y;
};
cljs.core.bit_clear = function bit_clear(x, n) {
  return x & ~(1 << n);
};
cljs.core.bit_flip = function bit_flip(x, n) {
  return x ^ 1 << n;
};
cljs.core.bit_not = function bit_not(x) {
  return~x;
};
cljs.core.bit_set = function bit_set(x, n) {
  return x | 1 << n;
};
cljs.core.bit_test = function bit_test(x, n) {
  return(x & 1 << n) != 0;
};
cljs.core.bit_shift_left = function bit_shift_left(x, n) {
  return x << n;
};
cljs.core.bit_shift_right = function bit_shift_right(x, n) {
  return x >> n;
};
cljs.core.bit_shift_right_zero_fill = function bit_shift_right_zero_fill(x, n) {
  return x >>> n;
};
cljs.core.unsigned_bit_shift_right = function unsigned_bit_shift_right(x, n) {
  return x >>> n;
};
cljs.core.bit_count = function bit_count(v) {
  var v__$1 = v - (v >> 1 & 1431655765);
  var v__$2 = (v__$1 & 858993459) + (v__$1 >> 2 & 858993459);
  return(v__$2 + (v__$2 >> 4) & 252645135) * 16843009 >> 24;
};
cljs.core._EQ__EQ_ = function() {
  var _EQ__EQ_ = null;
  var _EQ__EQ___1 = function(x) {
    return true;
  };
  var _EQ__EQ___2 = function(x, y) {
    return cljs.core._equiv.call(null, x, y);
  };
  var _EQ__EQ___3 = function() {
    var G__56455__delegate = function(x, y, more) {
      while (true) {
        if (_EQ__EQ_.call(null, x, y)) {
          if (cljs.core.next.call(null, more)) {
            var G__56456 = y;
            var G__56457 = cljs.core.first.call(null, more);
            var G__56458 = cljs.core.next.call(null, more);
            x = G__56456;
            y = G__56457;
            more = G__56458;
            continue;
          } else {
            return _EQ__EQ_.call(null, y, cljs.core.first.call(null, more));
          }
        } else {
          return false;
        }
        break;
      }
    };
    var G__56455 = function(x, y, var_args) {
      var more = null;
      if (arguments.length > 2) {
        more = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0);
      }
      return G__56455__delegate.call(this, x, y, more);
    };
    G__56455.cljs$lang$maxFixedArity = 2;
    G__56455.cljs$lang$applyTo = function(arglist__56459) {
      var x = cljs.core.first(arglist__56459);
      arglist__56459 = cljs.core.next(arglist__56459);
      var y = cljs.core.first(arglist__56459);
      var more = cljs.core.rest(arglist__56459);
      return G__56455__delegate(x, y, more);
    };
    G__56455.cljs$core$IFn$_invoke$arity$variadic = G__56455__delegate;
    return G__56455;
  }();
  _EQ__EQ_ = function(x, y, var_args) {
    var more = var_args;
    switch(arguments.length) {
      case 1:
        return _EQ__EQ___1.call(this, x);
      case 2:
        return _EQ__EQ___2.call(this, x, y);
      default:
        return _EQ__EQ___3.cljs$core$IFn$_invoke$arity$variadic(x, y, cljs.core.array_seq(arguments, 2));
    }
    throw new Error("Invalid arity: " + arguments.length);
  };
  _EQ__EQ_.cljs$lang$maxFixedArity = 2;
  _EQ__EQ_.cljs$lang$applyTo = _EQ__EQ___3.cljs$lang$applyTo;
  _EQ__EQ_.cljs$core$IFn$_invoke$arity$1 = _EQ__EQ___1;
  _EQ__EQ_.cljs$core$IFn$_invoke$arity$2 = _EQ__EQ___2;
  _EQ__EQ_.cljs$core$IFn$_invoke$arity$variadic = _EQ__EQ___3.cljs$core$IFn$_invoke$arity$variadic;
  return _EQ__EQ_;
}();
cljs.core.pos_QMARK_ = function pos_QMARK_(n) {
  return n > 0;
};
cljs.core.zero_QMARK_ = function zero_QMARK_(n) {
  return n === 0;
};
cljs.core.neg_QMARK_ = function neg_QMARK_(x) {
  return x < 0;
};
cljs.core.nthnext = function nthnext(coll, n) {
  var n__$1 = n;
  var xs = cljs.core.seq.call(null, coll);
  while (true) {
    if (xs && n__$1 > 0) {
      var G__56460 = n__$1 - 1;
      var G__56461 = cljs.core.next.call(null, xs);
      n__$1 = G__56460;
      xs = G__56461;
      continue;
    } else {
      return xs;
    }
    break;
  }
};
cljs.core.str = function() {
  var str = null;
  var str__0 = function() {
    return "";
  };
  var str__1 = function(x) {
    if (x == null) {
      return "";
    } else {
      return "" + x;
    }
  };
  var str__2 = function() {
    var G__56462__delegate = function(x, ys) {
      var sb = new goog.string.StringBuffer(str.call(null, x));
      var more = ys;
      while (true) {
        if (cljs.core.truth_(more)) {
          var G__56463 = sb.append(str.call(null, cljs.core.first.call(null, more)));
          var G__56464 = cljs.core.next.call(null, more);
          sb = G__56463;
          more = G__56464;
          continue;
        } else {
          return sb.toString();
        }
        break;
      }
    };
    var G__56462 = function(x, var_args) {
      var ys = null;
      if (arguments.length > 1) {
        ys = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0);
      }
      return G__56462__delegate.call(this, x, ys);
    };
    G__56462.cljs$lang$maxFixedArity = 1;
    G__56462.cljs$lang$applyTo = function(arglist__56465) {
      var x = cljs.core.first(arglist__56465);
      var ys = cljs.core.rest(arglist__56465);
      return G__56462__delegate(x, ys);
    };
    G__56462.cljs$core$IFn$_invoke$arity$variadic = G__56462__delegate;
    return G__56462;
  }();
  str = function(x, var_args) {
    var ys = var_args;
    switch(arguments.length) {
      case 0:
        return str__0.call(this);
      case 1:
        return str__1.call(this, x);
      default:
        return str__2.cljs$core$IFn$_invoke$arity$variadic(x, cljs.core.array_seq(arguments, 1));
    }
    throw new Error("Invalid arity: " + arguments.length);
  };
  str.cljs$lang$maxFixedArity = 1;
  str.cljs$lang$applyTo = str__2.cljs$lang$applyTo;
  str.cljs$core$IFn$_invoke$arity$0 = str__0;
  str.cljs$core$IFn$_invoke$arity$1 = str__1;
  str.cljs$core$IFn$_invoke$arity$variadic = str__2.cljs$core$IFn$_invoke$arity$variadic;
  return str;
}();
cljs.core.subs = function() {
  var subs = null;
  var subs__2 = function(s, start) {
    return s.substring(start);
  };
  var subs__3 = function(s, start, end) {
    return s.substring(start, end);
  };
  subs = function(s, start, end) {
    switch(arguments.length) {
      case 2:
        return subs__2.call(this, s, start);
      case 3:
        return subs__3.call(this, s, start, end);
    }
    throw new Error("Invalid arity: " + arguments.length);
  };
  subs.cljs$core$IFn$_invoke$arity$2 = subs__2;
  subs.cljs$core$IFn$_invoke$arity$3 = subs__3;
  return subs;
}();
cljs.core.equiv_sequential = function equiv_sequential(x, y) {
  return cljs.core.boolean$.call(null, cljs.core.sequential_QMARK_.call(null, y) ? cljs.core.counted_QMARK_.call(null, x) && cljs.core.counted_QMARK_.call(null, y) && !(cljs.core.count.call(null, x) === cljs.core.count.call(null, y)) ? false : function() {
    var xs = cljs.core.seq.call(null, x);
    var ys = cljs.core.seq.call(null, y);
    while (true) {
      if (xs == null) {
        return ys == null;
      } else {
        if (ys == null) {
          return false;
        } else {
          if (cljs.core._EQ_.call(null, cljs.core.first.call(null, xs), cljs.core.first.call(null, ys))) {
            var G__56466 = cljs.core.next.call(null, xs);
            var G__56467 = cljs.core.next.call(null, ys);
            xs = G__56466;
            ys = G__56467;
            continue;
          } else {
            return false;
          }
        }
      }
      break;
    }
  }() : null);
};
cljs.core.hash_coll = function hash_coll(coll) {
  if (cljs.core.seq.call(null, coll)) {
    var res = cljs.core.hash.call(null, cljs.core.first.call(null, coll));
    var s = cljs.core.next.call(null, coll);
    while (true) {
      if (s == null) {
        return res;
      } else {
        var G__56468 = cljs.core.hash_combine.call(null, res, cljs.core.hash.call(null, cljs.core.first.call(null, s)));
        var G__56469 = cljs.core.next.call(null, s);
        res = G__56468;
        s = G__56469;
        continue;
      }
      break;
    }
  } else {
    return 0;
  }
};
cljs.core.hash_imap = function hash_imap(m) {
  var h = 0;
  var s = cljs.core.seq.call(null, m);
  while (true) {
    if (s) {
      var e = cljs.core.first.call(null, s);
      var G__56470 = (h + (cljs.core.hash.call(null, cljs.core.key.call(null, e)) ^ cljs.core.hash.call(null, cljs.core.val.call(null, e)))) % 4503599627370496;
      var G__56471 = cljs.core.next.call(null, s);
      h = G__56470;
      s = G__56471;
      continue;
    } else {
      return h;
    }
    break;
  }
};
cljs.core.hash_iset = function hash_iset(s) {
  var h = 0;
  var s__$1 = cljs.core.seq.call(null, s);
  while (true) {
    if (s__$1) {
      var e = cljs.core.first.call(null, s__$1);
      var G__56472 = (h + cljs.core.hash.call(null, e)) % 4503599627370496;
      var G__56473 = cljs.core.next.call(null, s__$1);
      h = G__56472;
      s__$1 = G__56473;
      continue;
    } else {
      return h;
    }
    break;
  }
};
cljs.core.extend_object_BANG_ = function extend_object_BANG_(obj, fn_map) {
  var seq__56480_56486 = cljs.core.seq.call(null, fn_map);
  var chunk__56481_56487 = null;
  var count__56482_56488 = 0;
  var i__56483_56489 = 0;
  while (true) {
    if (i__56483_56489 < count__56482_56488) {
      var vec__56484_56490 = cljs.core._nth.call(null, chunk__56481_56487, i__56483_56489);
      var key_name_56491 = cljs.core.nth.call(null, vec__56484_56490, 0, null);
      var f_56492 = cljs.core.nth.call(null, vec__56484_56490, 1, null);
      var str_name_56493 = cljs.core.name.call(null, key_name_56491);
      obj[str_name_56493] = f_56492;
      var G__56494 = seq__56480_56486;
      var G__56495 = chunk__56481_56487;
      var G__56496 = count__56482_56488;
      var G__56497 = i__56483_56489 + 1;
      seq__56480_56486 = G__56494;
      chunk__56481_56487 = G__56495;
      count__56482_56488 = G__56496;
      i__56483_56489 = G__56497;
      continue;
    } else {
      var temp__4126__auto___56498 = cljs.core.seq.call(null, seq__56480_56486);
      if (temp__4126__auto___56498) {
        var seq__56480_56499__$1 = temp__4126__auto___56498;
        if (cljs.core.chunked_seq_QMARK_.call(null, seq__56480_56499__$1)) {
          var c__4408__auto___56500 = cljs.core.chunk_first.call(null, seq__56480_56499__$1);
          var G__56501 = cljs.core.chunk_rest.call(null, seq__56480_56499__$1);
          var G__56502 = c__4408__auto___56500;
          var G__56503 = cljs.core.count.call(null, c__4408__auto___56500);
          var G__56504 = 0;
          seq__56480_56486 = G__56501;
          chunk__56481_56487 = G__56502;
          count__56482_56488 = G__56503;
          i__56483_56489 = G__56504;
          continue;
        } else {
          var vec__56485_56505 = cljs.core.first.call(null, seq__56480_56499__$1);
          var key_name_56506 = cljs.core.nth.call(null, vec__56485_56505, 0, null);
          var f_56507 = cljs.core.nth.call(null, vec__56485_56505, 1, null);
          var str_name_56508 = cljs.core.name.call(null, key_name_56506);
          obj[str_name_56508] = f_56507;
          var G__56509 = cljs.core.next.call(null, seq__56480_56499__$1);
          var G__56510 = null;
          var G__56511 = 0;
          var G__56512 = 0;
          seq__56480_56486 = G__56509;
          chunk__56481_56487 = G__56510;
          count__56482_56488 = G__56511;
          i__56483_56489 = G__56512;
          continue;
        }
      } else {
      }
    }
    break;
  }
  return obj;
};
cljs.core.List = function(meta, first, rest, count, __hash) {
  this.meta = meta;
  this.first = first;
  this.rest = rest;
  this.count = count;
  this.__hash = __hash;
  this.cljs$lang$protocol_mask$partition0$ = 65937646;
  this.cljs$lang$protocol_mask$partition1$ = 8192;
};
cljs.core.List.cljs$lang$type = true;
cljs.core.List.cljs$lang$ctorStr = "cljs.core/List";
cljs.core.List.cljs$lang$ctorPrWriter = function(this__4215__auto__, writer__4216__auto__, opt__4217__auto__) {
  return cljs.core._write.call(null, writer__4216__auto__, "cljs.core/List");
};
cljs.core.List.prototype.toString = function() {
  var self__ = this;
  var coll = this;
  return cljs.core.pr_str_STAR_.call(null, coll);
};
cljs.core.List.prototype.equiv = function(other) {
  var self__ = this;
  var this$ = this;
  return this$.cljs$core$IEquiv$_equiv$arity$2(null, other);
};
cljs.core.List.prototype.cljs$core$IMeta$_meta$arity$1 = function(coll) {
  var self__ = this;
  var coll__$1 = this;
  return self__.meta;
};
cljs.core.List.prototype.cljs$core$ICloneable$_clone$arity$1 = function(_) {
  var self__ = this;
  var ___$1 = this;
  return new cljs.core.List(self__.meta, self__.first, self__.rest, self__.count, self__.__hash);
};
cljs.core.List.prototype.cljs$core$INext$_next$arity$1 = function(coll) {
  var self__ = this;
  var coll__$1 = this;
  if (self__.count === 1) {
    return null;
  } else {
    return self__.rest;
  }
};
cljs.core.List.prototype.cljs$core$ICounted$_count$arity$1 = function(coll) {
  var self__ = this;
  var coll__$1 = this;
  return self__.count;
};
cljs.core.List.prototype.cljs$core$IStack$_peek$arity$1 = function(coll) {
  var self__ = this;
  var coll__$1 = this;
  return self__.first;
};
cljs.core.List.prototype.cljs$core$IStack$_pop$arity$1 = function(coll) {
  var self__ = this;
  var coll__$1 = this;
  return cljs.core._rest.call(null, coll__$1);
};
cljs.core.List.prototype.cljs$core$IHash$_hash$arity$1 = function(coll) {
  var self__ = this;
  var coll__$1 = this;
  var h__4050__auto__ = self__.__hash;
  if (!(h__4050__auto__ == null)) {
    return h__4050__auto__;
  } else {
    var h__4050__auto____$1 = cljs.core.hash_ordered_coll.call(null, coll__$1);
    self__.__hash = h__4050__auto____$1;
    return h__4050__auto____$1;
  }
};
cljs.core.List.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(coll, other) {
  var self__ = this;
  var coll__$1 = this;
  return cljs.core.equiv_sequential.call(null, coll__$1, other);
};
cljs.core.List.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(coll) {
  var self__ = this;
  var coll__$1 = this;
  return cljs.core.List.EMPTY;
};
cljs.core.List.prototype.cljs$core$IReduce$_reduce$arity$2 = function(coll, f) {
  var self__ = this;
  var coll__$1 = this;
  return cljs.core.seq_reduce.call(null, f, coll__$1);
};
cljs.core.List.prototype.cljs$core$IReduce$_reduce$arity$3 = function(coll, f, start) {
  var self__ = this;
  var coll__$1 = this;
  return cljs.core.seq_reduce.call(null, f, start, coll__$1);
};
cljs.core.List.prototype.cljs$core$ISeq$_first$arity$1 = function(coll) {
  var self__ = this;
  var coll__$1 = this;
  return self__.first;
};
cljs.core.List.prototype.cljs$core$ISeq$_rest$arity$1 = function(coll) {
  var self__ = this;
  var coll__$1 = this;
  if (self__.count === 1) {
    return cljs.core.List.EMPTY;
  } else {
    return self__.rest;
  }
};
cljs.core.List.prototype.cljs$core$ISeqable$_seq$arity$1 = function(coll) {
  var self__ = this;
  var coll__$1 = this;
  return coll__$1;
};
cljs.core.List.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(coll, meta__$1) {
  var self__ = this;
  var coll__$1 = this;
  return new cljs.core.List(meta__$1, self__.first, self__.rest, self__.count, self__.__hash);
};
cljs.core.List.prototype.cljs$core$ICollection$_conj$arity$2 = function(coll, o) {
  var self__ = this;
  var coll__$1 = this;
  return new cljs.core.List(self__.meta, o, coll__$1, self__.count + 1, null);
};
cljs.core.__GT_List = function __GT_List(meta, first, rest, count, __hash) {
  return new cljs.core.List(meta, first, rest, count, __hash);
};
cljs.core.EmptyList = function(meta) {
  this.meta = meta;
  this.cljs$lang$protocol_mask$partition0$ = 65937614;
  this.cljs$lang$protocol_mask$partition1$ = 8192;
};
cljs.core.EmptyList.cljs$lang$type = true;
cljs.core.EmptyList.cljs$lang$ctorStr = "cljs.core/EmptyList";
cljs.core.EmptyList.cljs$lang$ctorPrWriter = function(this__4215__auto__, writer__4216__auto__, opt__4217__auto__) {
  return cljs.core._write.call(null, writer__4216__auto__, "cljs.core/EmptyList");
};
cljs.core.EmptyList.prototype.toString = function() {
  var self__ = this;
  var coll = this;
  return cljs.core.pr_str_STAR_.call(null, coll);
};
cljs.core.EmptyList.prototype.equiv = function(other) {
  var self__ = this;
  var this$ = this;
  return this$.cljs$core$IEquiv$_equiv$arity$2(null, other);
};
cljs.core.EmptyList.prototype.cljs$core$IMeta$_meta$arity$1 = function(coll) {
  var self__ = this;
  var coll__$1 = this;
  return self__.meta;
};
cljs.core.EmptyList.prototype.cljs$core$ICloneable$_clone$arity$1 = function(_) {
  var self__ = this;
  var ___$1 = this;
  return new cljs.core.EmptyList(self__.meta);
};
cljs.core.EmptyList.prototype.cljs$core$INext$_next$arity$1 = function(coll) {
  var self__ = this;
  var coll__$1 = this;
  return null;
};
cljs.core.EmptyList.prototype.cljs$core$ICounted$_count$arity$1 = function(coll) {
  var self__ = this;
  var coll__$1 = this;
  return 0;
};
cljs.core.EmptyList.prototype.cljs$core$IStack$_peek$arity$1 = function(coll) {
  var self__ = this;
  var coll__$1 = this;
  return null;
};
cljs.core.EmptyList.prototype.cljs$core$IStack$_pop$arity$1 = function(coll) {
  var self__ = this;
  var coll__$1 = this;
  throw new Error("Can't pop empty list");
};
cljs.core.EmptyList.prototype.cljs$core$IHash$_hash$arity$1 = function(coll) {
  var self__ = this;
  var coll__$1 = this;
  return 0;
};
cljs.core.EmptyList.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(coll, other) {
  var self__ = this;
  var coll__$1 = this;
  return cljs.core.equiv_sequential.call(null, coll__$1, other);
};
cljs.core.EmptyList.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(coll) {
  var self__ = this;
  var coll__$1 = this;
  return coll__$1;
};
cljs.core.EmptyList.prototype.cljs$core$IReduce$_reduce$arity$2 = function(coll, f) {
  var self__ = this;
  var coll__$1 = this;
  return cljs.core.seq_reduce.call(null, f, coll__$1);
};
cljs.core.EmptyList.prototype.cljs$core$IReduce$_reduce$arity$3 = function(coll, f, start) {
  var self__ = this;
  var coll__$1 = this;
  return cljs.core.seq_reduce.call(null, f, start, coll__$1);
};
cljs.core.EmptyList.prototype.cljs$core$ISeq$_first$arity$1 = function(coll) {
  var self__ = this;
  var coll__$1 = this;
  return null;
};
cljs.core.EmptyList.prototype.cljs$core$ISeq$_rest$arity$1 = function(coll) {
  var self__ = this;
  var coll__$1 = this;
  return cljs.core.List.EMPTY;
};
cljs.core.EmptyList.prototype.cljs$core$ISeqable$_seq$arity$1 = function(coll) {
  var self__ = this;
  var coll__$1 = this;
  return null;
};
cljs.core.EmptyList.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(coll, meta__$1) {
  var self__ = this;
  var coll__$1 = this;
  return new cljs.core.EmptyList(meta__$1);
};
cljs.core.EmptyList.prototype.cljs$core$ICollection$_conj$arity$2 = function(coll, o) {
  var self__ = this;
  var coll__$1 = this;
  return new cljs.core.List(self__.meta, o, null, 1, null);
};
cljs.core.__GT_EmptyList = function __GT_EmptyList(meta) {
  return new cljs.core.EmptyList(meta);
};
cljs.core.List.EMPTY = new cljs.core.EmptyList(null);
cljs.core.reversible_QMARK_ = function reversible_QMARK_(coll) {
  var G__56514 = coll;
  if (G__56514) {
    var bit__4302__auto__ = G__56514.cljs$lang$protocol_mask$partition0$ & 134217728;
    if (bit__4302__auto__ || G__56514.cljs$core$IReversible$) {
      return true;
    } else {
      if (!G__56514.cljs$lang$protocol_mask$partition0$) {
        return cljs.core.native_satisfies_QMARK_.call(null, cljs.core.IReversible, G__56514);
      } else {
        return false;
      }
    }
  } else {
    return cljs.core.native_satisfies_QMARK_.call(null, cljs.core.IReversible, G__56514);
  }
};
cljs.core.rseq = function rseq(coll) {
  return cljs.core._rseq.call(null, coll);
};
cljs.core.reverse = function reverse(coll) {
  if (cljs.core.reversible_QMARK_.call(null, coll)) {
    return cljs.core.rseq.call(null, coll);
  } else {
    return cljs.core.reduce.call(null, cljs.core.conj, cljs.core.List.EMPTY, coll);
  }
};
cljs.core.list = function() {
  var list__delegate = function(xs) {
    var arr = xs instanceof cljs.core.IndexedSeq && xs.i === 0 ? xs.arr : function() {
      var arr = [];
      var xs__$1 = xs;
      while (true) {
        if (!(xs__$1 == null)) {
          arr.push(cljs.core._first.call(null, xs__$1));
          var G__56515 = cljs.core._next.call(null, xs__$1);
          xs__$1 = G__56515;
          continue;
        } else {
          return arr;
        }
        break;
      }
    }();
    var i = arr.length;
    var r = cljs.core.List.EMPTY;
    while (true) {
      if (i > 0) {
        var G__56516 = i - 1;
        var G__56517 = cljs.core._conj.call(null, r, arr[i - 1]);
        i = G__56516;
        r = G__56517;
        continue;
      } else {
        return r;
      }
      break;
    }
  };
  var list = function(var_args) {
    var xs = null;
    if (arguments.length > 0) {
      xs = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0);
    }
    return list__delegate.call(this, xs);
  };
  list.cljs$lang$maxFixedArity = 0;
  list.cljs$lang$applyTo = function(arglist__56518) {
    var xs = cljs.core.seq(arglist__56518);
    return list__delegate(xs);
  };
  list.cljs$core$IFn$_invoke$arity$variadic = list__delegate;
  return list;
}();
cljs.core.Cons = function(meta, first, rest, __hash) {
  this.meta = meta;
  this.first = first;
  this.rest = rest;
  this.__hash = __hash;
  this.cljs$lang$protocol_mask$partition0$ = 65929452;
  this.cljs$lang$protocol_mask$partition1$ = 8192;
};
cljs.core.Cons.cljs$lang$type = true;
cljs.core.Cons.cljs$lang$ctorStr = "cljs.core/Cons";
cljs.core.Cons.cljs$lang$ctorPrWriter = function(this__4215__auto__, writer__4216__auto__, opt__4217__auto__) {
  return cljs.core._write.call(null, writer__4216__auto__, "cljs.core/Cons");
};
cljs.core.Cons.prototype.toString = function() {
  var self__ = this;
  var coll = this;
  return cljs.core.pr_str_STAR_.call(null, coll);
};
cljs.core.Cons.prototype.equiv = function(other) {
  var self__ = this;
  var this$ = this;
  return this$.cljs$core$IEquiv$_equiv$arity$2(null, other);
};
cljs.core.Cons.prototype.cljs$core$IMeta$_meta$arity$1 = function(coll) {
  var self__ = this;
  var coll__$1 = this;
  return self__.meta;
};
cljs.core.Cons.prototype.cljs$core$ICloneable$_clone$arity$1 = function(_) {
  var self__ = this;
  var ___$1 = this;
  return new cljs.core.Cons(self__.meta, self__.first, self__.rest, self__.__hash);
};
cljs.core.Cons.prototype.cljs$core$INext$_next$arity$1 = function(coll) {
  var self__ = this;
  var coll__$1 = this;
  if (self__.rest == null) {
    return null;
  } else {
    return cljs.core.seq.call(null, self__.rest);
  }
};
cljs.core.Cons.prototype.cljs$core$IHash$_hash$arity$1 = function(coll) {
  var self__ = this;
  var coll__$1 = this;
  var h__4050__auto__ = self__.__hash;
  if (!(h__4050__auto__ == null)) {
    return h__4050__auto__;
  } else {
    var h__4050__auto____$1 = cljs.core.hash_ordered_coll.call(null, coll__$1);
    self__.__hash = h__4050__auto____$1;
    return h__4050__auto____$1;
  }
};
cljs.core.Cons.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(coll, other) {
  var self__ = this;
  var coll__$1 = this;
  return cljs.core.equiv_sequential.call(null, coll__$1, other);
};
cljs.core.Cons.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(coll) {
  var self__ = this;
  var coll__$1 = this;
  return cljs.core.with_meta.call(null, cljs.core.List.EMPTY, self__.meta);
};
cljs.core.Cons.prototype.cljs$core$IReduce$_reduce$arity$2 = function(coll, f) {
  var self__ = this;
  var coll__$1 = this;
  return cljs.core.seq_reduce.call(null, f, coll__$1);
};
cljs.core.Cons.prototype.cljs$core$IReduce$_reduce$arity$3 = function(coll, f, start) {
  var self__ = this;
  var coll__$1 = this;
  return cljs.core.seq_reduce.call(null, f, start, coll__$1);
};
cljs.core.Cons.prototype.cljs$core$ISeq$_first$arity$1 = function(coll) {
  var self__ = this;
  var coll__$1 = this;
  return self__.first;
};
cljs.core.Cons.prototype.cljs$core$ISeq$_rest$arity$1 = function(coll) {
  var self__ = this;
  var coll__$1 = this;
  if (self__.rest == null) {
    return cljs.core.List.EMPTY;
  } else {
    return self__.rest;
  }
};
cljs.core.Cons.prototype.cljs$core$ISeqable$_seq$arity$1 = function(coll) {
  var self__ = this;
  var coll__$1 = this;
  return coll__$1;
};
cljs.core.Cons.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(coll, meta__$1) {
  var self__ = this;
  var coll__$1 = this;
  return new cljs.core.Cons(meta__$1, self__.first, self__.rest, self__.__hash);
};
cljs.core.Cons.prototype.cljs$core$ICollection$_conj$arity$2 = function(coll, o) {
  var self__ = this;
  var coll__$1 = this;
  return new cljs.core.Cons(null, o, coll__$1, self__.__hash);
};
cljs.core.__GT_Cons = function __GT_Cons(meta, first, rest, __hash) {
  return new cljs.core.Cons(meta, first, rest, __hash);
};
cljs.core.cons = function cons(x, coll) {
  if (function() {
    var or__3639__auto__ = coll == null;
    if (or__3639__auto__) {
      return or__3639__auto__;
    } else {
      var G__56522 = coll;
      if (G__56522) {
        var bit__4295__auto__ = G__56522.cljs$lang$protocol_mask$partition0$ & 64;
        if (bit__4295__auto__ || G__56522.cljs$core$ISeq$) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    }
  }()) {
    return new cljs.core.Cons(null, x, coll, null);
  } else {
    return new cljs.core.Cons(null, x, cljs.core.seq.call(null, coll), null);
  }
};
cljs.core.list_QMARK_ = function list_QMARK_(x) {
  var G__56524 = x;
  if (G__56524) {
    var bit__4302__auto__ = G__56524.cljs$lang$protocol_mask$partition0$ & 33554432;
    if (bit__4302__auto__ || G__56524.cljs$core$IList$) {
      return true;
    } else {
      if (!G__56524.cljs$lang$protocol_mask$partition0$) {
        return cljs.core.native_satisfies_QMARK_.call(null, cljs.core.IList, G__56524);
      } else {
        return false;
      }
    }
  } else {
    return cljs.core.native_satisfies_QMARK_.call(null, cljs.core.IList, G__56524);
  }
};
cljs.core.hash_keyword = function hash_keyword(k) {
  return cljs.core.hash_symbol.call(null, k) + 2654435769 | 0;
};
cljs.core.Keyword = function(ns, name, fqn, _hash) {
  this.ns = ns;
  this.name = name;
  this.fqn = fqn;
  this._hash = _hash;
  this.cljs$lang$protocol_mask$partition0$ = 2153775105;
  this.cljs$lang$protocol_mask$partition1$ = 4096;
};
cljs.core.Keyword.cljs$lang$type = true;
cljs.core.Keyword.cljs$lang$ctorStr = "cljs.core/Keyword";
cljs.core.Keyword.cljs$lang$ctorPrWriter = function(this__4215__auto__, writer__4216__auto__, opt__4217__auto__) {
  return cljs.core._write.call(null, writer__4216__auto__, "cljs.core/Keyword");
};
cljs.core.Keyword.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(o, writer, _) {
  var self__ = this;
  var o__$1 = this;
  return cljs.core._write.call(null, writer, ":" + cljs.core.str.cljs$core$IFn$_invoke$arity$1(self__.fqn));
};
cljs.core.Keyword.prototype.cljs$core$INamed$_name$arity$1 = function(_) {
  var self__ = this;
  var ___$1 = this;
  return self__.name;
};
cljs.core.Keyword.prototype.cljs$core$INamed$_namespace$arity$1 = function(_) {
  var self__ = this;
  var ___$1 = this;
  return self__.ns;
};
cljs.core.Keyword.prototype.cljs$core$IHash$_hash$arity$1 = function(this$) {
  var self__ = this;
  var this$__$1 = this;
  var h__4050__auto__ = self__._hash;
  if (!(h__4050__auto__ == null)) {
    return h__4050__auto__;
  } else {
    var h__4050__auto____$1 = cljs.core.hash_keyword.call(null, this$__$1);
    self__._hash = h__4050__auto____$1;
    return h__4050__auto____$1;
  }
};
cljs.core.Keyword.prototype.call = function() {
  var G__56526 = null;
  var G__56526__2 = function(self__, coll) {
    var self__ = this;
    var self____$1 = this;
    var kw = self____$1;
    return cljs.core.get.call(null, coll, kw);
  };
  var G__56526__3 = function(self__, coll, not_found) {
    var self__ = this;
    var self____$1 = this;
    var kw = self____$1;
    return cljs.core.get.call(null, coll, kw, not_found);
  };
  G__56526 = function(self__, coll, not_found) {
    switch(arguments.length) {
      case 2:
        return G__56526__2.call(this, self__, coll);
      case 3:
        return G__56526__3.call(this, self__, coll, not_found);
    }
    throw new Error("Invalid arity: " + arguments.length);
  };
  G__56526.cljs$core$IFn$_invoke$arity$2 = G__56526__2;
  G__56526.cljs$core$IFn$_invoke$arity$3 = G__56526__3;
  return G__56526;
}();
cljs.core.Keyword.prototype.apply = function(self__, args56525) {
  var self__ = this;
  var self____$1 = this;
  return self____$1.call.apply(self____$1, [self____$1].concat(cljs.core.aclone.call(null, args56525)));
};
cljs.core.Keyword.prototype.cljs$core$IFn$_invoke$arity$1 = function(coll) {
  var self__ = this;
  var kw = this;
  return cljs.core.get.call(null, coll, kw);
};
cljs.core.Keyword.prototype.cljs$core$IFn$_invoke$arity$2 = function(coll, not_found) {
  var self__ = this;
  var kw = this;
  return cljs.core.get.call(null, coll, kw, not_found);
};
cljs.core.Keyword.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(_, other) {
  var self__ = this;
  var ___$1 = this;
  if (other instanceof cljs.core.Keyword) {
    return self__.fqn === other.fqn;
  } else {
    return false;
  }
};
cljs.core.Keyword.prototype.toString = function() {
  var self__ = this;
  var _ = this;
  return ":" + cljs.core.str.cljs$core$IFn$_invoke$arity$1(self__.fqn);
};
cljs.core.Keyword.prototype.equiv = function(other) {
  var self__ = this;
  var this$ = this;
  return this$.cljs$core$IEquiv$_equiv$arity$2(null, other);
};
cljs.core.__GT_Keyword = function __GT_Keyword(ns, name, fqn, _hash) {
  return new cljs.core.Keyword(ns, name, fqn, _hash);
};
cljs.core.keyword_QMARK_ = function keyword_QMARK_(x) {
  return x instanceof cljs.core.Keyword;
};
cljs.core.keyword_identical_QMARK_ = function keyword_identical_QMARK_(x, y) {
  if (x === y) {
    return true;
  } else {
    if (x instanceof cljs.core.Keyword && y instanceof cljs.core.Keyword) {
      return x.fqn === y.fqn;
    } else {
      return false;
    }
  }
};
cljs.core.namespace = function namespace(x) {
  if (function() {
    var G__56528 = x;
    if (G__56528) {
      var bit__4295__auto__ = G__56528.cljs$lang$protocol_mask$partition1$ & 4096;
      if (bit__4295__auto__ || G__56528.cljs$core$INamed$) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }()) {
    return cljs.core._namespace.call(null, x);
  } else {
    throw new Error("Doesn't support namespace: " + cljs.core.str.cljs$core$IFn$_invoke$arity$1(x));
  }
};
cljs.core.keyword = function() {
  var keyword = null;
  var keyword__1 = function(name) {
    if (name instanceof cljs.core.Keyword) {
      return name;
    } else {
      if (name instanceof cljs.core.Symbol) {
        return new cljs.core.Keyword(cljs.core.namespace.call(null, name), cljs.core.name.call(null, name), name.str, null);
      } else {
        if (typeof name === "string") {
          var parts = name.split("/");
          if (parts.length === 2) {
            return new cljs.core.Keyword(parts[0], parts[1], name, null);
          } else {
            return new cljs.core.Keyword(null, parts[0], name, null);
          }
        } else {
          return null;
        }
      }
    }
  };
  var keyword__2 = function(ns, name) {
    return new cljs.core.Keyword(ns, name, "" + cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs.core.truth_(ns) ? "" + cljs.core.str.cljs$core$IFn$_invoke$arity$1(ns) + "/" : null) + cljs.core.str.cljs$core$IFn$_invoke$arity$1(name), null);
  };
  keyword = function(ns, name) {
    switch(arguments.length) {
      case 1:
        return keyword__1.call(this, ns);
      case 2:
        return keyword__2.call(this, ns, name);
    }
    throw new Error("Invalid arity: " + arguments.length);
  };
  keyword.cljs$core$IFn$_invoke$arity$1 = keyword__1;
  keyword.cljs$core$IFn$_invoke$arity$2 = keyword__2;
  return keyword;
}();
cljs.core.LazySeq = function(meta, fn, s, __hash) {
  this.meta = meta;
  this.fn = fn;
  this.s = s;
  this.__hash = __hash;
  this.cljs$lang$protocol_mask$partition1$ = 0;
  this.cljs$lang$protocol_mask$partition0$ = 32374988;
};
cljs.core.LazySeq.cljs$lang$type = true;
cljs.core.LazySeq.cljs$lang$ctorStr = "cljs.core/LazySeq";
cljs.core.LazySeq.cljs$lang$ctorPrWriter = function(this__4215__auto__, writer__4216__auto__, opt__4217__auto__) {
  return cljs.core._write.call(null, writer__4216__auto__, "cljs.core/LazySeq");
};
cljs.core.LazySeq.prototype.toString = function() {
  var self__ = this;
  var coll = this;
  return cljs.core.pr_str_STAR_.call(null, coll);
};
cljs.core.LazySeq.prototype.equiv = function(other) {
  var self__ = this;
  var this$ = this;
  return this$.cljs$core$IEquiv$_equiv$arity$2(null, other);
};
cljs.core.LazySeq.prototype.sval = function() {
  var self__ = this;
  var coll = this;
  if (self__.fn == null) {
    return self__.s;
  } else {
    self__.s = self__.fn.call(null);
    self__.fn = null;
    return self__.s;
  }
};
cljs.core.LazySeq.prototype.cljs$core$IMeta$_meta$arity$1 = function(coll) {
  var self__ = this;
  var coll__$1 = this;
  return self__.meta;
};
cljs.core.LazySeq.prototype.cljs$core$INext$_next$arity$1 = function(coll) {
  var self__ = this;
  var coll__$1 = this;
  cljs.core._seq.call(null, coll__$1);
  if (self__.s == null) {
    return null;
  } else {
    return cljs.core.next.call(null, self__.s);
  }
};
cljs.core.LazySeq.prototype.cljs$core$IHash$_hash$arity$1 = function(coll) {
  var self__ = this;
  var coll__$1 = this;
  var h__4050__auto__ = self__.__hash;
  if (!(h__4050__auto__ == null)) {
    return h__4050__auto__;
  } else {
    var h__4050__auto____$1 = cljs.core.hash_ordered_coll.call(null, coll__$1);
    self__.__hash = h__4050__auto____$1;
    return h__4050__auto____$1;
  }
};
cljs.core.LazySeq.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(coll, other) {
  var self__ = this;
  var coll__$1 = this;
  return cljs.core.equiv_sequential.call(null, coll__$1, other);
};
cljs.core.LazySeq.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(coll) {
  var self__ = this;
  var coll__$1 = this;
  return cljs.core.with_meta.call(null, cljs.core.List.EMPTY, self__.meta);
};
cljs.core.LazySeq.prototype.cljs$core$IReduce$_reduce$arity$2 = function(coll, f) {
  var self__ = this;
  var coll__$1 = this;
  return cljs.core.seq_reduce.call(null, f, coll__$1);
};
cljs.core.LazySeq.prototype.cljs$core$IReduce$_reduce$arity$3 = function(coll, f, start) {
  var self__ = this;
  var coll__$1 = this;
  return cljs.core.seq_reduce.call(null, f, start, coll__$1);
};
cljs.core.LazySeq.prototype.cljs$core$ISeq$_first$arity$1 = function(coll) {
  var self__ = this;
  var coll__$1 = this;
  cljs.core._seq.call(null, coll__$1);
  if (self__.s == null) {
    return null;
  } else {
    return cljs.core.first.call(null, self__.s);
  }
};
cljs.core.LazySeq.prototype.cljs$core$ISeq$_rest$arity$1 = function(coll) {
  var self__ = this;
  var coll__$1 = this;
  cljs.core._seq.call(null, coll__$1);
  if (!(self__.s == null)) {
    return cljs.core.rest.call(null, self__.s);
  } else {
    return cljs.core.List.EMPTY;
  }
};
cljs.core.LazySeq.prototype.cljs$core$ISeqable$_seq$arity$1 = function(coll) {
  var self__ = this;
  var coll__$1 = this;
  coll__$1.sval();
  if (self__.s == null) {
    return null;
  } else {
    var ls = self__.s;
    while (true) {
      if (ls instanceof cljs.core.LazySeq) {
        var G__56529 = ls.sval();
        ls = G__56529;
        continue;
      } else {
        self__.s = ls;
        return cljs.core.seq.call(null, self__.s);
      }
      break;
    }
  }
};
cljs.core.LazySeq.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(coll, meta__$1) {
  var self__ = this;
  var coll__$1 = this;
  return new cljs.core.LazySeq(meta__$1, self__.fn, self__.s, self__.__hash);
};
cljs.core.LazySeq.prototype.cljs$core$ICollection$_conj$arity$2 = function(coll, o) {
  var self__ = this;
  var coll__$1 = this;
  return cljs.core.cons.call(null, o, coll__$1);
};
cljs.core.__GT_LazySeq = function __GT_LazySeq(meta, fn, s, __hash) {
  return new cljs.core.LazySeq(meta, fn, s, __hash);
};
cljs.core.ChunkBuffer = function(buf, end) {
  this.buf = buf;
  this.end = end;
  this.cljs$lang$protocol_mask$partition1$ = 0;
  this.cljs$lang$protocol_mask$partition0$ = 2;
};
cljs.core.ChunkBuffer.cljs$lang$type = true;
cljs.core.ChunkBuffer.cljs$lang$ctorStr = "cljs.core/ChunkBuffer";
cljs.core.ChunkBuffer.cljs$lang$ctorPrWriter = function(this__4215__auto__, writer__4216__auto__, opt__4217__auto__) {
  return cljs.core._write.call(null, writer__4216__auto__, "cljs.core/ChunkBuffer");
};
cljs.core.ChunkBuffer.prototype.cljs$core$ICounted$_count$arity$1 = function(_) {
  var self__ = this;
  var ___$1 = this;
  return self__.end;
};
cljs.core.ChunkBuffer.prototype.add = function(o) {
  var self__ = this;
  var _ = this;
  self__.buf[self__.end] = o;
  return self__.end = self__.end + 1;
};
cljs.core.ChunkBuffer.prototype.chunk = function(o) {
  var self__ = this;
  var _ = this;
  var ret = new cljs.core.ArrayChunk(self__.buf, 0, self__.end);
  self__.buf = null;
  return ret;
};
cljs.core.__GT_ChunkBuffer = function __GT_ChunkBuffer(buf, end) {
  return new cljs.core.ChunkBuffer(buf, end);
};
cljs.core.chunk_buffer = function chunk_buffer(capacity) {
  return new cljs.core.ChunkBuffer(new Array(capacity), 0);
};
cljs.core.ArrayChunk = function(arr, off, end) {
  this.arr = arr;
  this.off = off;
  this.end = end;
  this.cljs$lang$protocol_mask$partition1$ = 0;
  this.cljs$lang$protocol_mask$partition0$ = 524306;
};
cljs.core.ArrayChunk.cljs$lang$type = true;
cljs.core.ArrayChunk.cljs$lang$ctorStr = "cljs.core/ArrayChunk";
cljs.core.ArrayChunk.cljs$lang$ctorPrWriter = function(this__4215__auto__, writer__4216__auto__, opt__4217__auto__) {
  return cljs.core._write.call(null, writer__4216__auto__, "cljs.core/ArrayChunk");
};
cljs.core.ArrayChunk.prototype.cljs$core$IReduce$_reduce$arity$2 = function(coll, f) {
  var self__ = this;
  var coll__$1 = this;
  return cljs.core.array_reduce.call(null, self__.arr, f, self__.arr[self__.off], self__.off + 1);
};
cljs.core.ArrayChunk.prototype.cljs$core$IReduce$_reduce$arity$3 = function(coll, f, start) {
  var self__ = this;
  var coll__$1 = this;
  return cljs.core.array_reduce.call(null, self__.arr, f, start, self__.off);
};
cljs.core.ArrayChunk.prototype.cljs$core$IChunk$ = true;
cljs.core.ArrayChunk.prototype.cljs$core$IChunk$_drop_first$arity$1 = function(coll) {
  var self__ = this;
  var coll__$1 = this;
  if (self__.off === self__.end) {
    throw new Error("-drop-first of empty chunk");
  } else {
    return new cljs.core.ArrayChunk(self__.arr, self__.off + 1, self__.end);
  }
};
cljs.core.ArrayChunk.prototype.cljs$core$IIndexed$_nth$arity$2 = function(coll, i) {
  var self__ = this;
  var coll__$1 = this;
  return self__.arr[self__.off + i];
};
cljs.core.ArrayChunk.prototype.cljs$core$IIndexed$_nth$arity$3 = function(coll, i, not_found) {
  var self__ = this;
  var coll__$1 = this;
  if (i >= 0 && i < self__.end - self__.off) {
    return self__.arr[self__.off + i];
  } else {
    return not_found;
  }
};
cljs.core.ArrayChunk.prototype.cljs$core$ICounted$_count$arity$1 = function(_) {
  var self__ = this;
  var ___$1 = this;
  return self__.end - self__.off;
};
cljs.core.__GT_ArrayChunk = function __GT_ArrayChunk(arr, off, end) {
  return new cljs.core.ArrayChunk(arr, off, end);
};
cljs.core.array_chunk = function() {
  var array_chunk = null;
  var array_chunk__1 = function(arr) {
    return new cljs.core.ArrayChunk(arr, 0, arr.length);
  };
  var array_chunk__2 = function(arr, off) {
    return new cljs.core.ArrayChunk(arr, off, arr.length);
  };
  var array_chunk__3 = function(arr, off, end) {
    return new cljs.core.ArrayChunk(arr, off, end);
  };
  array_chunk = function(arr, off, end) {
    switch(arguments.length) {
      case 1:
        return array_chunk__1.call(this, arr);
      case 2:
        return array_chunk__2.call(this, arr, off);
      case 3:
        return array_chunk__3.call(this, arr, off, end);
    }
    throw new Error("Invalid arity: " + arguments.length);
  };
  array_chunk.cljs$core$IFn$_invoke$arity$1 = array_chunk__1;
  array_chunk.cljs$core$IFn$_invoke$arity$2 = array_chunk__2;
  array_chunk.cljs$core$IFn$_invoke$arity$3 = array_chunk__3;
  return array_chunk;
}();
cljs.core.ChunkedCons = function(chunk, more, meta, __hash) {
  this.chunk = chunk;
  this.more = more;
  this.meta = meta;
  this.__hash = __hash;
  this.cljs$lang$protocol_mask$partition0$ = 31850732;
  this.cljs$lang$protocol_mask$partition1$ = 1536;
};
cljs.core.ChunkedCons.cljs$lang$type = true;
cljs.core.ChunkedCons.cljs$lang$ctorStr = "cljs.core/ChunkedCons";
cljs.core.ChunkedCons.cljs$lang$ctorPrWriter = function(this__4215__auto__, writer__4216__auto__, opt__4217__auto__) {
  return cljs.core._write.call(null, writer__4216__auto__, "cljs.core/ChunkedCons");
};
cljs.core.ChunkedCons.prototype.toString = function() {
  var self__ = this;
  var coll = this;
  return cljs.core.pr_str_STAR_.call(null, coll);
};
cljs.core.ChunkedCons.prototype.equiv = function(other) {
  var self__ = this;
  var this$ = this;
  return this$.cljs$core$IEquiv$_equiv$arity$2(null, other);
};
cljs.core.ChunkedCons.prototype.cljs$core$IMeta$_meta$arity$1 = function(coll) {
  var self__ = this;
  var coll__$1 = this;
  return self__.meta;
};
cljs.core.ChunkedCons.prototype.cljs$core$INext$_next$arity$1 = function(coll) {
  var self__ = this;
  var coll__$1 = this;
  if (cljs.core._count.call(null, self__.chunk) > 1) {
    return new cljs.core.ChunkedCons(cljs.core._drop_first.call(null, self__.chunk), self__.more, self__.meta, null);
  } else {
    var more__$1 = cljs.core._seq.call(null, self__.more);
    if (more__$1 == null) {
      return null;
    } else {
      return more__$1;
    }
  }
};
cljs.core.ChunkedCons.prototype.cljs$core$IHash$_hash$arity$1 = function(coll) {
  var self__ = this;
  var coll__$1 = this;
  var h__4050__auto__ = self__.__hash;
  if (!(h__4050__auto__ == null)) {
    return h__4050__auto__;
  } else {
    var h__4050__auto____$1 = cljs.core.hash_ordered_coll.call(null, coll__$1);
    self__.__hash = h__4050__auto____$1;
    return h__4050__auto____$1;
  }
};
cljs.core.ChunkedCons.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(coll, other) {
  var self__ = this;
  var coll__$1 = this;
  return cljs.core.equiv_sequential.call(null, coll__$1, other);
};
cljs.core.ChunkedCons.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(coll) {
  var self__ = this;
  var coll__$1 = this;
  return cljs.core.with_meta.call(null, cljs.core.List.EMPTY, self__.meta);
};
cljs.core.ChunkedCons.prototype.cljs$core$ISeq$_first$arity$1 = function(coll) {
  var self__ = this;
  var coll__$1 = this;
  return cljs.core._nth.call(null, self__.chunk, 0);
};
cljs.core.ChunkedCons.prototype.cljs$core$ISeq$_rest$arity$1 = function(coll) {
  var self__ = this;
  var coll__$1 = this;
  if (cljs.core._count.call(null, self__.chunk) > 1) {
    return new cljs.core.ChunkedCons(cljs.core._drop_first.call(null, self__.chunk), self__.more, self__.meta, null);
  } else {
    if (self__.more == null) {
      return cljs.core.List.EMPTY;
    } else {
      return self__.more;
    }
  }
};
cljs.core.ChunkedCons.prototype.cljs$core$ISeqable$_seq$arity$1 = function(coll) {
  var self__ = this;
  var coll__$1 = this;
  return coll__$1;
};
cljs.core.ChunkedCons.prototype.cljs$core$IChunkedSeq$_chunked_first$arity$1 = function(coll) {
  var self__ = this;
  var coll__$1 = this;
  return self__.chunk;
};
cljs.core.ChunkedCons.prototype.cljs$core$IChunkedSeq$_chunked_rest$arity$1 = function(coll) {
  var self__ = this;
  var coll__$1 = this;
  if (self__.more == null) {
    return cljs.core.List.EMPTY;
  } else {
    return self__.more;
  }
};
cljs.core.ChunkedCons.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(coll, m) {
  var self__ = this;
  var coll__$1 = this;
  return new cljs.core.ChunkedCons(self__.chunk, self__.more, m, self__.__hash);
};
cljs.core.ChunkedCons.prototype.cljs$core$ICollection$_conj$arity$2 = function(this$, o) {
  var self__ = this;
  var this$__$1 = this;
  return cljs.core.cons.call(null, o, this$__$1);
};
cljs.core.ChunkedCons.prototype.cljs$core$IChunkedNext$_chunked_next$arity$1 = function(coll) {
  var self__ = this;
  var coll__$1 = this;
  if (self__.more == null) {
    return null;
  } else {
    return self__.more;
  }
};
cljs.core.__GT_ChunkedCons = function __GT_ChunkedCons(chunk, more, meta, __hash) {
  return new cljs.core.ChunkedCons(chunk, more, meta, __hash);
};
cljs.core.chunk_cons = function chunk_cons(chunk, rest) {
  if (cljs.core._count.call(null, chunk) === 0) {
    return rest;
  } else {
    return new cljs.core.ChunkedCons(chunk, rest, null, null);
  }
};
cljs.core.chunk_append = function chunk_append(b, x) {
  return b.add(x);
};
cljs.core.chunk = function chunk(b) {
  return b.chunk();
};
cljs.core.chunk_first = function chunk_first(s) {
  return cljs.core._chunked_first.call(null, s);
};
cljs.core.chunk_rest = function chunk_rest(s) {
  return cljs.core._chunked_rest.call(null, s);
};
cljs.core.chunk_next = function chunk_next(s) {
  if (function() {
    var G__56531 = s;
    if (G__56531) {
      var bit__4295__auto__ = G__56531.cljs$lang$protocol_mask$partition1$ & 1024;
      if (bit__4295__auto__ || G__56531.cljs$core$IChunkedNext$) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }()) {
    return cljs.core._chunked_next.call(null, s);
  } else {
    return cljs.core.seq.call(null, cljs.core._chunked_rest.call(null, s));
  }
};
cljs.core.to_array = function to_array(s) {
  var ary = [];
  var s__$1 = s;
  while (true) {
    if (cljs.core.seq.call(null, s__$1)) {
      ary.push(cljs.core.first.call(null, s__$1));
      var G__56532 = cljs.core.next.call(null, s__$1);
      s__$1 = G__56532;
      continue;
    } else {
      return ary;
    }
    break;
  }
};
cljs.core.to_array_2d = function to_array_2d(coll) {
  var ret = new Array(cljs.core.count.call(null, coll));
  var i_56533 = 0;
  var xs_56534 = cljs.core.seq.call(null, coll);
  while (true) {
    if (xs_56534) {
      ret[i_56533] = cljs.core.to_array.call(null, cljs.core.first.call(null, xs_56534));
      var G__56535 = i_56533 + 1;
      var G__56536 = cljs.core.next.call(null, xs_56534);
      i_56533 = G__56535;
      xs_56534 = G__56536;
      continue;
    } else {
    }
    break;
  }
  return ret;
};
cljs.core.int_array = function() {
  var int_array = null;
  var int_array__1 = function(size_or_seq) {
    if (typeof size_or_seq === "number") {
      return int_array.call(null, size_or_seq, null);
    } else {
      return cljs.core.into_array.call(null, size_or_seq);
    }
  };
  var int_array__2 = function(size, init_val_or_seq) {
    var a = new Array(size);
    if (cljs.core.seq_QMARK_.call(null, init_val_or_seq)) {
      var s = cljs.core.seq.call(null, init_val_or_seq);
      var i = 0;
      var s__$1 = s;
      while (true) {
        if (s__$1 && i < size) {
          a[i] = cljs.core.first.call(null, s__$1);
          var G__56537 = i + 1;
          var G__56538 = cljs.core.next.call(null, s__$1);
          i = G__56537;
          s__$1 = G__56538;
          continue;
        } else {
          return a;
        }
        break;
      }
    } else {
      var n__4508__auto___56539 = size;
      var i_56540 = 0;
      while (true) {
        if (i_56540 < n__4508__auto___56539) {
          a[i_56540] = init_val_or_seq;
          var G__56541 = i_56540 + 1;
          i_56540 = G__56541;
          continue;
        } else {
        }
        break;
      }
      return a;
    }
  };
  int_array = function(size, init_val_or_seq) {
    switch(arguments.length) {
      case 1:
        return int_array__1.call(this, size);
      case 2:
        return int_array__2.call(this, size, init_val_or_seq);
    }
    throw new Error("Invalid arity: " + arguments.length);
  };
  int_array.cljs$core$IFn$_invoke$arity$1 = int_array__1;
  int_array.cljs$core$IFn$_invoke$arity$2 = int_array__2;
  return int_array;
}();
cljs.core.long_array = function() {
  var long_array = null;
  var long_array__1 = function(size_or_seq) {
    if (typeof size_or_seq === "number") {
      return long_array.call(null, size_or_seq, null);
    } else {
      return cljs.core.into_array.call(null, size_or_seq);
    }
  };
  var long_array__2 = function(size, init_val_or_seq) {
    var a = new Array(size);
    if (cljs.core.seq_QMARK_.call(null, init_val_or_seq)) {
      var s = cljs.core.seq.call(null, init_val_or_seq);
      var i = 0;
      var s__$1 = s;
      while (true) {
        if (s__$1 && i < size) {
          a[i] = cljs.core.first.call(null, s__$1);
          var G__56542 = i + 1;
          var G__56543 = cljs.core.next.call(null, s__$1);
          i = G__56542;
          s__$1 = G__56543;
          continue;
        } else {
          return a;
        }
        break;
      }
    } else {
      var n__4508__auto___56544 = size;
      var i_56545 = 0;
      while (true) {
        if (i_56545 < n__4508__auto___56544) {
          a[i_56545] = init_val_or_seq;
          var G__56546 = i_56545 + 1;
          i_56545 = G__56546;
          continue;
        } else {
        }
        break;
      }
      return a;
    }
  };
  long_array = function(size, init_val_or_seq) {
    switch(arguments.length) {
      case 1:
        return long_array__1.call(this, size);
      case 2:
        return long_array__2.call(this, size, init_val_or_seq);
    }
    throw new Error("Invalid arity: " + arguments.length);
  };
  long_array.cljs$core$IFn$_invoke$arity$1 = long_array__1;
  long_array.cljs$core$IFn$_invoke$arity$2 = long_array__2;
  return long_array;
}();
cljs.core.double_array = function() {
  var double_array = null;
  var double_array__1 = function(size_or_seq) {
    if (typeof size_or_seq === "number") {
      return double_array.call(null, size_or_seq, null);
    } else {
      return cljs.core.into_array.call(null, size_or_seq);
    }
  };
  var double_array__2 = function(size, init_val_or_seq) {
    var a = new Array(size);
    if (cljs.core.seq_QMARK_.call(null, init_val_or_seq)) {
      var s = cljs.core.seq.call(null, init_val_or_seq);
      var i = 0;
      var s__$1 = s;
      while (true) {
        if (s__$1 && i < size) {
          a[i] = cljs.core.first.call(null, s__$1);
          var G__56547 = i + 1;
          var G__56548 = cljs.core.next.call(null, s__$1);
          i = G__56547;
          s__$1 = G__56548;
          continue;
        } else {
          return a;
        }
        break;
      }
    } else {
      var n__4508__auto___56549 = size;
      var i_56550 = 0;
      while (true) {
        if (i_56550 < n__4508__auto___56549) {
          a[i_56550] = init_val_or_seq;
          var G__56551 = i_56550 + 1;
          i_56550 = G__56551;
          continue;
        } else {
        }
        break;
      }
      return a;
    }
  };
  double_array = function(size, init_val_or_seq) {
    switch(arguments.length) {
      case 1:
        return double_array__1.call(this, size);
      case 2:
        return double_array__2.call(this, size, init_val_or_seq);
    }
    throw new Error("Invalid arity: " + arguments.length);
  };
  double_array.cljs$core$IFn$_invoke$arity$1 = double_array__1;
  double_array.cljs$core$IFn$_invoke$arity$2 = double_array__2;
  return double_array;
}();
cljs.core.object_array = function() {
  var object_array = null;
  var object_array__1 = function(size_or_seq) {
    if (typeof size_or_seq === "number") {
      return object_array.call(null, size_or_seq, null);
    } else {
      return cljs.core.into_array.call(null, size_or_seq);
    }
  };
  var object_array__2 = function(size, init_val_or_seq) {
    var a = new Array(size);
    if (cljs.core.seq_QMARK_.call(null, init_val_or_seq)) {
      var s = cljs.core.seq.call(null, init_val_or_seq);
      var i = 0;
      var s__$1 = s;
      while (true) {
        if (s__$1 && i < size) {
          a[i] = cljs.core.first.call(null, s__$1);
          var G__56552 = i + 1;
          var G__56553 = cljs.core.next.call(null, s__$1);
          i = G__56552;
          s__$1 = G__56553;
          continue;
        } else {
          return a;
        }
        break;
      }
    } else {
      var n__4508__auto___56554 = size;
      var i_56555 = 0;
      while (true) {
        if (i_56555 < n__4508__auto___56554) {
          a[i_56555] = init_val_or_seq;
          var G__56556 = i_56555 + 1;
          i_56555 = G__56556;
          continue;
        } else {
        }
        break;
      }
      return a;
    }
  };
  object_array = function(size, init_val_or_seq) {
    switch(arguments.length) {
      case 1:
        return object_array__1.call(this, size);
      case 2:
        return object_array__2.call(this, size, init_val_or_seq);
    }
    throw new Error("Invalid arity: " + arguments.length);
  };
  object_array.cljs$core$IFn$_invoke$arity$1 = object_array__1;
  object_array.cljs$core$IFn$_invoke$arity$2 = object_array__2;
  return object_array;
}();
cljs.core.bounded_count = function bounded_count(s, n) {
  if (cljs.core.counted_QMARK_.call(null, s)) {
    return cljs.core.count.call(null, s);
  } else {
    var s__$1 = s;
    var i = n;
    var sum = 0;
    while (true) {
      if (i > 0 && cljs.core.seq.call(null, s__$1)) {
        var G__56557 = cljs.core.next.call(null, s__$1);
        var G__56558 = i - 1;
        var G__56559 = sum + 1;
        s__$1 = G__56557;
        i = G__56558;
        sum = G__56559;
        continue;
      } else {
        return sum;
      }
      break;
    }
  }
};
cljs.core.spread = function spread(arglist) {
  if (arglist == null) {
    return null;
  } else {
    if (cljs.core.next.call(null, arglist) == null) {
      return cljs.core.seq.call(null, cljs.core.first.call(null, arglist));
    } else {
      return cljs.core.cons.call(null, cljs.core.first.call(null, arglist), spread.call(null, cljs.core.next.call(null, arglist)));
    }
  }
};
cljs.core.concat = function() {
  var concat = null;
  var concat__0 = function() {
    return new cljs.core.LazySeq(null, function() {
      return null;
    }, null, null);
  };
  var concat__1 = function(x) {
    return new cljs.core.LazySeq(null, function() {
      return x;
    }, null, null);
  };
  var concat__2 = function(x, y) {
    return new cljs.core.LazySeq(null, function() {
      var s = cljs.core.seq.call(null, x);
      if (s) {
        if (cljs.core.chunked_seq_QMARK_.call(null, s)) {
          return cljs.core.chunk_cons.call(null, cljs.core.chunk_first.call(null, s), concat.call(null, cljs.core.chunk_rest.call(null, s), y));
        } else {
          return cljs.core.cons.call(null, cljs.core.first.call(null, s), concat.call(null, cljs.core.rest.call(null, s), y));
        }
      } else {
        return y;
      }
    }, null, null);
  };
  var concat__3 = function() {
    var G__56560__delegate = function(x, y, zs) {
      var cat = function cat(xys, zs__$1) {
        return new cljs.core.LazySeq(null, function() {
          var xys__$1 = cljs.core.seq.call(null, xys);
          if (xys__$1) {
            if (cljs.core.chunked_seq_QMARK_.call(null, xys__$1)) {
              return cljs.core.chunk_cons.call(null, cljs.core.chunk_first.call(null, xys__$1), cat.call(null, cljs.core.chunk_rest.call(null, xys__$1), zs__$1));
            } else {
              return cljs.core.cons.call(null, cljs.core.first.call(null, xys__$1), cat.call(null, cljs.core.rest.call(null, xys__$1), zs__$1));
            }
          } else {
            if (cljs.core.truth_(zs__$1)) {
              return cat.call(null, cljs.core.first.call(null, zs__$1), cljs.core.next.call(null, zs__$1));
            } else {
              return null;
            }
          }
        }, null, null);
      };
      return cat.call(null, concat.call(null, x, y), zs);
    };
    var G__56560 = function(x, y, var_args) {
      var zs = null;
      if (arguments.length > 2) {
        zs = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0);
      }
      return G__56560__delegate.call(this, x, y, zs);
    };
    G__56560.cljs$lang$maxFixedArity = 2;
    G__56560.cljs$lang$applyTo = function(arglist__56561) {
      var x = cljs.core.first(arglist__56561);
      arglist__56561 = cljs.core.next(arglist__56561);
      var y = cljs.core.first(arglist__56561);
      var zs = cljs.core.rest(arglist__56561);
      return G__56560__delegate(x, y, zs);
    };
    G__56560.cljs$core$IFn$_invoke$arity$variadic = G__56560__delegate;
    return G__56560;
  }();
  concat = function(x, y, var_args) {
    var zs = var_args;
    switch(arguments.length) {
      case 0:
        return concat__0.call(this);
      case 1:
        return concat__1.call(this, x);
      case 2:
        return concat__2.call(this, x, y);
      default:
        return concat__3.cljs$core$IFn$_invoke$arity$variadic(x, y, cljs.core.array_seq(arguments, 2));
    }
    throw new Error("Invalid arity: " + arguments.length);
  };
  concat.cljs$lang$maxFixedArity = 2;
  concat.cljs$lang$applyTo = concat__3.cljs$lang$applyTo;
  concat.cljs$core$IFn$_invoke$arity$0 = concat__0;
  concat.cljs$core$IFn$_invoke$arity$1 = concat__1;
  concat.cljs$core$IFn$_invoke$arity$2 = concat__2;
  concat.cljs$core$IFn$_invoke$arity$variadic = concat__3.cljs$core$IFn$_invoke$arity$variadic;
  return concat;
}();
cljs.core.list_STAR_ = function() {
  var list_STAR_ = null;
  var list_STAR___1 = function(args) {
    return cljs.core.seq.call(null, args);
  };
  var list_STAR___2 = function(a, args) {
    return cljs.core.cons.call(null, a, args);
  };
  var list_STAR___3 = function(a, b, args) {
    return cljs.core.cons.call(null, a, cljs.core.cons.call(null, b, args));
  };
  var list_STAR___4 = function(a, b, c, args) {
    return cljs.core.cons.call(null, a, cljs.core.cons.call(null, b, cljs.core.cons.call(null, c, args)));
  };
  var list_STAR___5 = function() {
    var G__56562__delegate = function(a, b, c, d, more) {
      return cljs.core.cons.call(null, a, cljs.core.cons.call(null, b, cljs.core.cons.call(null, c, cljs.core.cons.call(null, d, cljs.core.spread.call(null, more)))));
    };
    var G__56562 = function(a, b, c, d, var_args) {
      var more = null;
      if (arguments.length > 4) {
        more = cljs.core.array_seq(Array.prototype.slice.call(arguments, 4), 0);
      }
      return G__56562__delegate.call(this, a, b, c, d, more);
    };
    G__56562.cljs$lang$maxFixedArity = 4;
    G__56562.cljs$lang$applyTo = function(arglist__56563) {
      var a = cljs.core.first(arglist__56563);
      arglist__56563 = cljs.core.next(arglist__56563);
      var b = cljs.core.first(arglist__56563);
      arglist__56563 = cljs.core.next(arglist__56563);
      var c = cljs.core.first(arglist__56563);
      arglist__56563 = cljs.core.next(arglist__56563);
      var d = cljs.core.first(arglist__56563);
      var more = cljs.core.rest(arglist__56563);
      return G__56562__delegate(a, b, c, d, more);
    };
    G__56562.cljs$core$IFn$_invoke$arity$variadic = G__56562__delegate;
    return G__56562;
  }();
  list_STAR_ = function(a, b, c, d, var_args) {
    var more = var_args;
    switch(arguments.length) {
      case 1:
        return list_STAR___1.call(this, a);
      case 2:
        return list_STAR___2.call(this, a, b);
      case 3:
        return list_STAR___3.call(this, a, b, c);
      case 4:
        return list_STAR___4.call(this, a, b, c, d);
      default:
        return list_STAR___5.cljs$core$IFn$_invoke$arity$variadic(a, b, c, d, cljs.core.array_seq(arguments, 4));
    }
    throw new Error("Invalid arity: " + arguments.length);
  };
  list_STAR_.cljs$lang$maxFixedArity = 4;
  list_STAR_.cljs$lang$applyTo = list_STAR___5.cljs$lang$applyTo;
  list_STAR_.cljs$core$IFn$_invoke$arity$1 = list_STAR___1;
  list_STAR_.cljs$core$IFn$_invoke$arity$2 = list_STAR___2;
  list_STAR_.cljs$core$IFn$_invoke$arity$3 = list_STAR___3;
  list_STAR_.cljs$core$IFn$_invoke$arity$4 = list_STAR___4;
  list_STAR_.cljs$core$IFn$_invoke$arity$variadic = list_STAR___5.cljs$core$IFn$_invoke$arity$variadic;
  return list_STAR_;
}();
cljs.core.transient$ = function transient$(coll) {
  return cljs.core._as_transient.call(null, coll);
};
cljs.core.persistent_BANG_ = function persistent_BANG_(tcoll) {
  return cljs.core._persistent_BANG_.call(null, tcoll);
};
cljs.core.conj_BANG_ = function() {
  var conj_BANG_ = null;
  var conj_BANG___0 = function() {
    return cljs.core.transient$.call(null, cljs.core.PersistentVector.EMPTY);
  };
  var conj_BANG___1 = function(coll) {
    return coll;
  };
  var conj_BANG___2 = function(tcoll, val) {
    return cljs.core._conj_BANG_.call(null, tcoll, val);
  };
  var conj_BANG___3 = function() {
    var G__56564__delegate = function(tcoll, val, vals) {
      while (true) {
        var ntcoll = cljs.core._conj_BANG_.call(null, tcoll, val);
        if (cljs.core.truth_(vals)) {
          var G__56565 = ntcoll;
          var G__56566 = cljs.core.first.call(null, vals);
          var G__56567 = cljs.core.next.call(null, vals);
          tcoll = G__56565;
          val = G__56566;
          vals = G__56567;
          continue;
        } else {
          return ntcoll;
        }
        break;
      }
    };
    var G__56564 = function(tcoll, val, var_args) {
      var vals = null;
      if (arguments.length > 2) {
        vals = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0);
      }
      return G__56564__delegate.call(this, tcoll, val, vals);
    };
    G__56564.cljs$lang$maxFixedArity = 2;
    G__56564.cljs$lang$applyTo = function(arglist__56568) {
      var tcoll = cljs.core.first(arglist__56568);
      arglist__56568 = cljs.core.next(arglist__56568);
      var val = cljs.core.first(arglist__56568);
      var vals = cljs.core.rest(arglist__56568);
      return G__56564__delegate(tcoll, val, vals);
    };
    G__56564.cljs$core$IFn$_invoke$arity$variadic = G__56564__delegate;
    return G__56564;
  }();
  conj_BANG_ = function(tcoll, val, var_args) {
    var vals = var_args;
    switch(arguments.length) {
      case 0:
        return conj_BANG___0.call(this);
      case 1:
        return conj_BANG___1.call(this, tcoll);
      case 2:
        return conj_BANG___2.call(this, tcoll, val);
      default:
        return conj_BANG___3.cljs$core$IFn$_invoke$arity$variadic(tcoll, val, cljs.core.array_seq(arguments, 2));
    }
    throw new Error("Invalid arity: " + arguments.length);
  };
  conj_BANG_.cljs$lang$maxFixedArity = 2;
  conj_BANG_.cljs$lang$applyTo = conj_BANG___3.cljs$lang$applyTo;
  conj_BANG_.cljs$core$IFn$_invoke$arity$0 = conj_BANG___0;
  conj_BANG_.cljs$core$IFn$_invoke$arity$1 = conj_BANG___1;
  conj_BANG_.cljs$core$IFn$_invoke$arity$2 = conj_BANG___2;
  conj_BANG_.cljs$core$IFn$_invoke$arity$variadic = conj_BANG___3.cljs$core$IFn$_invoke$arity$variadic;
  return conj_BANG_;
}();
cljs.core.assoc_BANG_ = function() {
  var assoc_BANG_ = null;
  var assoc_BANG___3 = function(tcoll, key, val) {
    return cljs.core._assoc_BANG_.call(null, tcoll, key, val);
  };
  var assoc_BANG___4 = function() {
    var G__56569__delegate = function(tcoll, key, val, kvs) {
      while (true) {
        var ntcoll = cljs.core._assoc_BANG_.call(null, tcoll, key, val);
        if (cljs.core.truth_(kvs)) {
          var G__56570 = ntcoll;
          var G__56571 = cljs.core.first.call(null, kvs);
          var G__56572 = cljs.core.second.call(null, kvs);
          var G__56573 = cljs.core.nnext.call(null, kvs);
          tcoll = G__56570;
          key = G__56571;
          val = G__56572;
          kvs = G__56573;
          continue;
        } else {
          return ntcoll;
        }
        break;
      }
    };
    var G__56569 = function(tcoll, key, val, var_args) {
      var kvs = null;
      if (arguments.length > 3) {
        kvs = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0);
      }
      return G__56569__delegate.call(this, tcoll, key, val, kvs);
    };
    G__56569.cljs$lang$maxFixedArity = 3;
    G__56569.cljs$lang$applyTo = function(arglist__56574) {
      var tcoll = cljs.core.first(arglist__56574);
      arglist__56574 = cljs.core.next(arglist__56574);
      var key = cljs.core.first(arglist__56574);
      arglist__56574 = cljs.core.next(arglist__56574);
      var val = cljs.core.first(arglist__56574);
      var kvs = cljs.core.rest(arglist__56574);
      return G__56569__delegate(tcoll, key, val, kvs);
    };
    G__56569.cljs$core$IFn$_invoke$arity$variadic = G__56569__delegate;
    return G__56569;
  }();
  assoc_BANG_ = function(tcoll, key, val, var_args) {
    var kvs = var_args;
    switch(arguments.length) {
      case 3:
        return assoc_BANG___3.call(this, tcoll, key, val);
      default:
        return assoc_BANG___4.cljs$core$IFn$_invoke$arity$variadic(tcoll, key, val, cljs.core.array_seq(arguments, 3));
    }
    throw new Error("Invalid arity: " + arguments.length);
  };
  assoc_BANG_.cljs$lang$maxFixedArity = 3;
  assoc_BANG_.cljs$lang$applyTo = assoc_BANG___4.cljs$lang$applyTo;
  assoc_BANG_.cljs$core$IFn$_invoke$arity$3 = assoc_BANG___3;
  assoc_BANG_.cljs$core$IFn$_invoke$arity$variadic = assoc_BANG___4.cljs$core$IFn$_invoke$arity$variadic;
  return assoc_BANG_;
}();
cljs.core.dissoc_BANG_ = function() {
  var dissoc_BANG_ = null;
  var dissoc_BANG___2 = function(tcoll, key) {
    return cljs.core._dissoc_BANG_.call(null, tcoll, key);
  };
  var dissoc_BANG___3 = function() {
    var G__56575__delegate = function(tcoll, key, ks) {
      while (true) {
        var ntcoll = cljs.core._dissoc_BANG_.call(null, tcoll, key);
        if (cljs.core.truth_(ks)) {
          var G__56576 = ntcoll;
          var G__56577 = cljs.core.first.call(null, ks);
          var G__56578 = cljs.core.next.call(null, ks);
          tcoll = G__56576;
          key = G__56577;
          ks = G__56578;
          continue;
        } else {
          return ntcoll;
        }
        break;
      }
    };
    var G__56575 = function(tcoll, key, var_args) {
      var ks = null;
      if (arguments.length > 2) {
        ks = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0);
      }
      return G__56575__delegate.call(this, tcoll, key, ks);
    };
    G__56575.cljs$lang$maxFixedArity = 2;
    G__56575.cljs$lang$applyTo = function(arglist__56579) {
      var tcoll = cljs.core.first(arglist__56579);
      arglist__56579 = cljs.core.next(arglist__56579);
      var key = cljs.core.first(arglist__56579);
      var ks = cljs.core.rest(arglist__56579);
      return G__56575__delegate(tcoll, key, ks);
    };
    G__56575.cljs$core$IFn$_invoke$arity$variadic = G__56575__delegate;
    return G__56575;
  }();
  dissoc_BANG_ = function(tcoll, key, var_args) {
    var ks = var_args;
    switch(arguments.length) {
      case 2:
        return dissoc_BANG___2.call(this, tcoll, key);
      default:
        return dissoc_BANG___3.cljs$core$IFn$_invoke$arity$variadic(tcoll, key, cljs.core.array_seq(arguments, 2));
    }
    throw new Error("Invalid arity: " + arguments.length);
  };
  dissoc_BANG_.cljs$lang$maxFixedArity = 2;
  dissoc_BANG_.cljs$lang$applyTo = dissoc_BANG___3.cljs$lang$applyTo;
  dissoc_BANG_.cljs$core$IFn$_invoke$arity$2 = dissoc_BANG___2;
  dissoc_BANG_.cljs$core$IFn$_invoke$arity$variadic = dissoc_BANG___3.cljs$core$IFn$_invoke$arity$variadic;
  return dissoc_BANG_;
}();
cljs.core.pop_BANG_ = function pop_BANG_(tcoll) {
  return cljs.core._pop_BANG_.call(null, tcoll);
};
cljs.core.disj_BANG_ = function() {
  var disj_BANG_ = null;
  var disj_BANG___2 = function(tcoll, val) {
    return cljs.core._disjoin_BANG_.call(null, tcoll, val);
  };
  var disj_BANG___3 = function() {
    var G__56580__delegate = function(tcoll, val, vals) {
      while (true) {
        var ntcoll = cljs.core._disjoin_BANG_.call(null, tcoll, val);
        if (cljs.core.truth_(vals)) {
          var G__56581 = ntcoll;
          var G__56582 = cljs.core.first.call(null, vals);
          var G__56583 = cljs.core.next.call(null, vals);
          tcoll = G__56581;
          val = G__56582;
          vals = G__56583;
          continue;
        } else {
          return ntcoll;
        }
        break;
      }
    };
    var G__56580 = function(tcoll, val, var_args) {
      var vals = null;
      if (arguments.length > 2) {
        vals = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0);
      }
      return G__56580__delegate.call(this, tcoll, val, vals);
    };
    G__56580.cljs$lang$maxFixedArity = 2;
    G__56580.cljs$lang$applyTo = function(arglist__56584) {
      var tcoll = cljs.core.first(arglist__56584);
      arglist__56584 = cljs.core.next(arglist__56584);
      var val = cljs.core.first(arglist__56584);
      var vals = cljs.core.rest(arglist__56584);
      return G__56580__delegate(tcoll, val, vals);
    };
    G__56580.cljs$core$IFn$_invoke$arity$variadic = G__56580__delegate;
    return G__56580;
  }();
  disj_BANG_ = function(tcoll, val, var_args) {
    var vals = var_args;
    switch(arguments.length) {
      case 2:
        return disj_BANG___2.call(this, tcoll, val);
      default:
        return disj_BANG___3.cljs$core$IFn$_invoke$arity$variadic(tcoll, val, cljs.core.array_seq(arguments, 2));
    }
    throw new Error("Invalid arity: " + arguments.length);
  };
  disj_BANG_.cljs$lang$maxFixedArity = 2;
  disj_BANG_.cljs$lang$applyTo = disj_BANG___3.cljs$lang$applyTo;
  disj_BANG_.cljs$core$IFn$_invoke$arity$2 = disj_BANG___2;
  disj_BANG_.cljs$core$IFn$_invoke$arity$variadic = disj_BANG___3.cljs$core$IFn$_invoke$arity$variadic;
  return disj_BANG_;
}();
cljs.core.apply_to = function apply_to(f, argc, args) {
  var args__$1 = cljs.core.seq.call(null, args);
  if (argc === 0) {
    return f.call(null);
  } else {
    var a4552 = cljs.core._first.call(null, args__$1);
    var args__$2 = cljs.core._rest.call(null, args__$1);
    if (argc === 1) {
      if (f.cljs$core$IFn$_invoke$arity$1) {
        return f.cljs$core$IFn$_invoke$arity$1(a4552);
      } else {
        return f.call(null, a4552);
      }
    } else {
      var b4553 = cljs.core._first.call(null, args__$2);
      var args__$3 = cljs.core._rest.call(null, args__$2);
      if (argc === 2) {
        if (f.cljs$core$IFn$_invoke$arity$2) {
          return f.cljs$core$IFn$_invoke$arity$2(a4552, b4553);
        } else {
          return f.call(null, a4552, b4553);
        }
      } else {
        var c4554 = cljs.core._first.call(null, args__$3);
        var args__$4 = cljs.core._rest.call(null, args__$3);
        if (argc === 3) {
          if (f.cljs$core$IFn$_invoke$arity$3) {
            return f.cljs$core$IFn$_invoke$arity$3(a4552, b4553, c4554);
          } else {
            return f.call(null, a4552, b4553, c4554);
          }
        } else {
          var d4555 = cljs.core._first.call(null, args__$4);
          var args__$5 = cljs.core._rest.call(null, args__$4);
          if (argc === 4) {
            if (f.cljs$core$IFn$_invoke$arity$4) {
              return f.cljs$core$IFn$_invoke$arity$4(a4552, b4553, c4554, d4555);
            } else {
              return f.call(null, a4552, b4553, c4554, d4555);
            }
          } else {
            var e4556 = cljs.core._first.call(null, args__$5);
            var args__$6 = cljs.core._rest.call(null, args__$5);
            if (argc === 5) {
              if (f.cljs$core$IFn$_invoke$arity$5) {
                return f.cljs$core$IFn$_invoke$arity$5(a4552, b4553, c4554, d4555, e4556);
              } else {
                return f.call(null, a4552, b4553, c4554, d4555, e4556);
              }
            } else {
              var f4557 = cljs.core._first.call(null, args__$6);
              var args__$7 = cljs.core._rest.call(null, args__$6);
              if (argc === 6) {
                if (f.cljs$core$IFn$_invoke$arity$6) {
                  return f.cljs$core$IFn$_invoke$arity$6(a4552, b4553, c4554, d4555, e4556, f4557);
                } else {
                  return f.call(null, a4552, b4553, c4554, d4555, e4556, f4557);
                }
              } else {
                var g4558 = cljs.core._first.call(null, args__$7);
                var args__$8 = cljs.core._rest.call(null, args__$7);
                if (argc === 7) {
                  if (f.cljs$core$IFn$_invoke$arity$7) {
                    return f.cljs$core$IFn$_invoke$arity$7(a4552, b4553, c4554, d4555, e4556, f4557, g4558);
                  } else {
                    return f.call(null, a4552, b4553, c4554, d4555, e4556, f4557, g4558);
                  }
                } else {
                  var h4559 = cljs.core._first.call(null, args__$8);
                  var args__$9 = cljs.core._rest.call(null, args__$8);
                  if (argc === 8) {
                    if (f.cljs$core$IFn$_invoke$arity$8) {
                      return f.cljs$core$IFn$_invoke$arity$8(a4552, b4553, c4554, d4555, e4556, f4557, g4558, h4559);
                    } else {
                      return f.call(null, a4552, b4553, c4554, d4555, e4556, f4557, g4558, h4559);
                    }
                  } else {
                    var i4560 = cljs.core._first.call(null, args__$9);
                    var args__$10 = cljs.core._rest.call(null, args__$9);
                    if (argc === 9) {
                      if (f.cljs$core$IFn$_invoke$arity$9) {
                        return f.cljs$core$IFn$_invoke$arity$9(a4552, b4553, c4554, d4555, e4556, f4557, g4558, h4559, i4560);
                      } else {
                        return f.call(null, a4552, b4553, c4554, d4555, e4556, f4557, g4558, h4559, i4560);
                      }
                    } else {
                      var j4561 = cljs.core._first.call(null, args__$10);
                      var args__$11 = cljs.core._rest.call(null, args__$10);
                      if (argc === 10) {
                        if (f.cljs$core$IFn$_invoke$arity$10) {
                          return f.cljs$core$IFn$_invoke$arity$10(a4552, b4553, c4554, d4555, e4556, f4557, g4558, h4559, i4560, j4561);
                        } else {
                          return f.call(null, a4552, b4553, c4554, d4555, e4556, f4557, g4558, h4559, i4560, j4561);
                        }
                      } else {
                        var k4562 = cljs.core._first.call(null, args__$11);
                        var args__$12 = cljs.core._rest.call(null, args__$11);
                        if (argc === 11) {
                          if (f.cljs$core$IFn$_invoke$arity$11) {
                            return f.cljs$core$IFn$_invoke$arity$11(a4552, b4553, c4554, d4555, e4556, f4557, g4558, h4559, i4560, j4561, k4562);
                          } else {
                            return f.call(null, a4552, b4553, c4554, d4555, e4556, f4557, g4558, h4559, i4560, j4561, k4562);
                          }
                        } else {
                          var l4563 = cljs.core._first.call(null, args__$12);
                          var args__$13 = cljs.core._rest.call(null, args__$12);
                          if (argc === 12) {
                            if (f.cljs$core$IFn$_invoke$arity$12) {
                              return f.cljs$core$IFn$_invoke$arity$12(a4552, b4553, c4554, d4555, e4556, f4557, g4558, h4559, i4560, j4561, k4562, l4563);
                            } else {
                              return f.call(null, a4552, b4553, c4554, d4555, e4556, f4557, g4558, h4559, i4560, j4561, k4562, l4563);
                            }
                          } else {
                            var m4564 = cljs.core._first.call(null, args__$13);
                            var args__$14 = cljs.core._rest.call(null, args__$13);
                            if (argc === 13) {
                              if (f.cljs$core$IFn$_invoke$arity$13) {
                                return f.cljs$core$IFn$_invoke$arity$13(a4552, b4553, c4554, d4555, e4556, f4557, g4558, h4559, i4560, j4561, k4562, l4563, m4564);
                              } else {
                                return f.call(null, a4552, b4553, c4554, d4555, e4556, f4557, g4558, h4559, i4560, j4561, k4562, l4563, m4564);
                              }
                            } else {
                              var n4565 = cljs.core._first.call(null, args__$14);
                              var args__$15 = cljs.core._rest.call(null, args__$14);
                              if (argc === 14) {
                                if (f.cljs$core$IFn$_invoke$arity$14) {
                                  return f.cljs$core$IFn$_invoke$arity$14(a4552, b4553, c4554, d4555, e4556, f4557, g4558, h4559, i4560, j4561, k4562, l4563, m4564, n4565);
                                } else {
                                  return f.call(null, a4552, b4553, c4554, d4555, e4556, f4557, g4558, h4559, i4560, j4561, k4562, l4563, m4564, n4565);
                                }
                              } else {
                                var o4566 = cljs.core._first.call(null, args__$15);
                                var args__$16 = cljs.core._rest.call(null, args__$15);
                                if (argc === 15) {
                                  if (f.cljs$core$IFn$_invoke$arity$15) {
                                    return f.cljs$core$IFn$_invoke$arity$15(a4552, b4553, c4554, d4555, e4556, f4557, g4558, h4559, i4560, j4561, k4562, l4563, m4564, n4565, o4566);
                                  } else {
                                    return f.call(null, a4552, b4553, c4554, d4555, e4556, f4557, g4558, h4559, i4560, j4561, k4562, l4563, m4564, n4565, o4566);
                                  }
                                } else {
                                  var p4567 = cljs.core._first.call(null, args__$16);
                                  var args__$17 = cljs.core._rest.call(null, args__$16);
                                  if (argc === 16) {
                                    if (f.cljs$core$IFn$_invoke$arity$16) {
                                      return f.cljs$core$IFn$_invoke$arity$16(a4552, b4553, c4554, d4555, e4556, f4557, g4558, h4559, i4560, j4561, k4562, l4563, m4564, n4565, o4566, p4567);
                                    } else {
                                      return f.call(null, a4552, b4553, c4554, d4555, e4556, f4557, g4558, h4559, i4560, j4561, k4562, l4563, m4564, n4565, o4566, p4567);
                                    }
                                  } else {
                                    var q4568 = cljs.core._first.call(null, args__$17);
                                    var args__$18 = cljs.core._rest.call(null, args__$17);
                                    if (argc === 17) {
                                      if (f.cljs$core$IFn$_invoke$arity$17) {
                                        return f.cljs$core$IFn$_invoke$arity$17(a4552, b4553, c4554, d4555, e4556, f4557, g4558, h4559, i4560, j4561, k4562, l4563, m4564, n4565, o4566, p4567, q4568);
                                      } else {
                                        return f.call(null, a4552, b4553, c4554, d4555, e4556, f4557, g4558, h4559, i4560, j4561, k4562, l4563, m4564, n4565, o4566, p4567, q4568);
                                      }
                                    } else {
                                      var r4569 = cljs.core._first.call(null, args__$18);
                                      var args__$19 = cljs.core._rest.call(null, args__$18);
                                      if (argc === 18) {
                                        if (f.cljs$core$IFn$_invoke$arity$18) {
                                          return f.cljs$core$IFn$_invoke$arity$18(a4552, b4553, c4554, d4555, e4556, f4557, g4558, h4559, i4560, j4561, k4562, l4563, m4564, n4565, o4566, p4567, q4568, r4569);
                                        } else {
                                          return f.call(null, a4552, b4553, c4554, d4555, e4556, f4557, g4558, h4559, i4560, j4561, k4562, l4563, m4564, n4565, o4566, p4567, q4568, r4569);
                                        }
                                      } else {
                                        var s4570 = cljs.core._first.call(null, args__$19);
                                        var args__$20 = cljs.core._rest.call(null, args__$19);
                                        if (argc === 19) {
                                          if (f.cljs$core$IFn$_invoke$arity$19) {
                                            return f.cljs$core$IFn$_invoke$arity$19(a4552, b4553, c4554, d4555, e4556, f4557, g4558, h4559, i4560, j4561, k4562, l4563, m4564, n4565, o4566, p4567, q4568, r4569, s4570);
                                          } else {
                                            return f.call(null, a4552, b4553, c4554, d4555, e4556, f4557, g4558, h4559, i4560, j4561, k4562, l4563, m4564, n4565, o4566, p4567, q4568, r4569, s4570);
                                          }
                                        } else {
                                          var t4571 = cljs.core._first.call(null, args__$20);
                                          var args__$21 = cljs.core._rest.call(null, args__$20);
                                          if (argc === 20) {
                                            if (f.cljs$core$IFn$_invoke$arity$20) {
                                              return f.cljs$core$IFn$_invoke$arity$20(a4552, b4553, c4554, d4555, e4556, f4557, g4558, h4559, i4560, j4561, k4562, l4563, m4564, n4565, o4566, p4567, q4568, r4569, s4570, t4571);
                                            } else {
                                              return f.call(null, a4552, b4553, c4554, d4555, e4556, f4557, g4558, h4559, i4560, j4561, k4562, l4563, m4564, n4565, o4566, p4567, q4568, r4569, s4570, t4571);
                                            }
                                          } else {
                                            throw new Error("Only up to 20 arguments supported on functions");
                                          }
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
};
cljs.core.apply = function() {
  var apply = null;
  var apply__2 = function(f, args) {
    var fixed_arity = f.cljs$lang$maxFixedArity;
    if (f.cljs$lang$applyTo) {
      var bc = cljs.core.bounded_count.call(null, args, fixed_arity + 1);
      if (bc <= fixed_arity) {
        return cljs.core.apply_to.call(null, f, bc, args);
      } else {
        return f.cljs$lang$applyTo(args);
      }
    } else {
      return f.apply(f, cljs.core.to_array.call(null, args));
    }
  };
  var apply__3 = function(f, x, args) {
    var arglist = cljs.core.list_STAR_.call(null, x, args);
    var fixed_arity = f.cljs$lang$maxFixedArity;
    if (f.cljs$lang$applyTo) {
      var bc = cljs.core.bounded_count.call(null, arglist, fixed_arity + 1);
      if (bc <= fixed_arity) {
        return cljs.core.apply_to.call(null, f, bc, arglist);
      } else {
        return f.cljs$lang$applyTo(arglist);
      }
    } else {
      return f.apply(f, cljs.core.to_array.call(null, arglist));
    }
  };
  var apply__4 = function(f, x, y, args) {
    var arglist = cljs.core.list_STAR_.call(null, x, y, args);
    var fixed_arity = f.cljs$lang$maxFixedArity;
    if (f.cljs$lang$applyTo) {
      var bc = cljs.core.bounded_count.call(null, arglist, fixed_arity + 1);
      if (bc <= fixed_arity) {
        return cljs.core.apply_to.call(null, f, bc, arglist);
      } else {
        return f.cljs$lang$applyTo(arglist);
      }
    } else {
      return f.apply(f, cljs.core.to_array.call(null, arglist));
    }
  };
  var apply__5 = function(f, x, y, z, args) {
    var arglist = cljs.core.list_STAR_.call(null, x, y, z, args);
    var fixed_arity = f.cljs$lang$maxFixedArity;
    if (f.cljs$lang$applyTo) {
      var bc = cljs.core.bounded_count.call(null, arglist, fixed_arity + 1);
      if (bc <= fixed_arity) {
        return cljs.core.apply_to.call(null, f, bc, arglist);
      } else {
        return f.cljs$lang$applyTo(arglist);
      }
    } else {
      return f.apply(f, cljs.core.to_array.call(null, arglist));
    }
  };
  var apply__6 = function() {
    var G__56585__delegate = function(f, a, b, c, d, args) {
      var arglist = cljs.core.cons.call(null, a, cljs.core.cons.call(null, b, cljs.core.cons.call(null, c, cljs.core.cons.call(null, d, cljs.core.spread.call(null, args)))));
      var fixed_arity = f.cljs$lang$maxFixedArity;
      if (f.cljs$lang$applyTo) {
        var bc = cljs.core.bounded_count.call(null, arglist, fixed_arity + 1);
        if (bc <= fixed_arity) {
          return cljs.core.apply_to.call(null, f, bc, arglist);
        } else {
          return f.cljs$lang$applyTo(arglist);
        }
      } else {
        return f.apply(f, cljs.core.to_array.call(null, arglist));
      }
    };
    var G__56585 = function(f, a, b, c, d, var_args) {
      var args = null;
      if (arguments.length > 5) {
        args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 5), 0);
      }
      return G__56585__delegate.call(this, f, a, b, c, d, args);
    };
    G__56585.cljs$lang$maxFixedArity = 5;
    G__56585.cljs$lang$applyTo = function(arglist__56586) {
      var f = cljs.core.first(arglist__56586);
      arglist__56586 = cljs.core.next(arglist__56586);
      var a = cljs.core.first(arglist__56586);
      arglist__56586 = cljs.core.next(arglist__56586);
      var b = cljs.core.first(arglist__56586);
      arglist__56586 = cljs.core.next(arglist__56586);
      var c = cljs.core.first(arglist__56586);
      arglist__56586 = cljs.core.next(arglist__56586);
      var d = cljs.core.first(arglist__56586);
      var args = cljs.core.rest(arglist__56586);
      return G__56585__delegate(f, a, b, c, d, args);
    };
    G__56585.cljs$core$IFn$_invoke$arity$variadic = G__56585__delegate;
    return G__56585;
  }();
  apply = function(f, a, b, c, d, var_args) {
    var args = var_args;
    switch(arguments.length) {
      case 2:
        return apply__2.call(this, f, a);
      case 3:
        return apply__3.call(this, f, a, b);
      case 4:
        return apply__4.call(this, f, a, b, c);
      case 5:
        return apply__5.call(this, f, a, b, c, d);
      default:
        return apply__6.cljs$core$IFn$_invoke$arity$variadic(f, a, b, c, d, cljs.core.array_seq(arguments, 5));
    }
    throw new Error("Invalid arity: " + arguments.length);
  };
  apply.cljs$lang$maxFixedArity = 5;
  apply.cljs$lang$applyTo = apply__6.cljs$lang$applyTo;
  apply.cljs$core$IFn$_invoke$arity$2 = apply__2;
  apply.cljs$core$IFn$_invoke$arity$3 = apply__3;
  apply.cljs$core$IFn$_invoke$arity$4 = apply__4;
  apply.cljs$core$IFn$_invoke$arity$5 = apply__5;
  apply.cljs$core$IFn$_invoke$arity$variadic = apply__6.cljs$core$IFn$_invoke$arity$variadic;
  return apply;
}();
cljs.core.vary_meta = function() {
  var vary_meta = null;
  var vary_meta__2 = function(obj, f) {
    return cljs.core.with_meta.call(null, obj, f.call(null, cljs.core.meta.call(null, obj)));
  };
  var vary_meta__3 = function(obj, f, a) {
    return cljs.core.with_meta.call(null, obj, f.call(null, cljs.core.meta.call(null, obj), a));
  };
  var vary_meta__4 = function(obj, f, a, b) {
    return cljs.core.with_meta.call(null, obj, f.call(null, cljs.core.meta.call(null, obj), a, b));
  };
  var vary_meta__5 = function(obj, f, a, b, c) {
    return cljs.core.with_meta.call(null, obj, f.call(null, cljs.core.meta.call(null, obj), a, b, c));
  };
  var vary_meta__6 = function(obj, f, a, b, c, d) {
    return cljs.core.with_meta.call(null, obj, f.call(null, cljs.core.meta.call(null, obj), a, b, c, d));
  };
  var vary_meta__7 = function() {
    var G__56587__delegate = function(obj, f, a, b, c, d, args) {
      return cljs.core.with_meta.call(null, obj, cljs.core.apply.call(null, f, cljs.core.meta.call(null, obj), a, b, c, d, args));
    };
    var G__56587 = function(obj, f, a, b, c, d, var_args) {
      var args = null;
      if (arguments.length > 6) {
        args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 6), 0);
      }
      return G__56587__delegate.call(this, obj, f, a, b, c, d, args);
    };
    G__56587.cljs$lang$maxFixedArity = 6;
    G__56587.cljs$lang$applyTo = function(arglist__56588) {
      var obj = cljs.core.first(arglist__56588);
      arglist__56588 = cljs.core.next(arglist__56588);
      var f = cljs.core.first(arglist__56588);
      arglist__56588 = cljs.core.next(arglist__56588);
      var a = cljs.core.first(arglist__56588);
      arglist__56588 = cljs.core.next(arglist__56588);
      var b = cljs.core.first(arglist__56588);
      arglist__56588 = cljs.core.next(arglist__56588);
      var c = cljs.core.first(arglist__56588);
      arglist__56588 = cljs.core.next(arglist__56588);
      var d = cljs.core.first(arglist__56588);
      var args = cljs.core.rest(arglist__56588);
      return G__56587__delegate(obj, f, a, b, c, d, args);
    };
    G__56587.cljs$core$IFn$_invoke$arity$variadic = G__56587__delegate;
    return G__56587;
  }();
  vary_meta = function(obj, f, a, b, c, d, var_args) {
    var args = var_args;
    switch(arguments.length) {
      case 2:
        return vary_meta__2.call(this, obj, f);
      case 3:
        return vary_meta__3.call(this, obj, f, a);
      case 4:
        return vary_meta__4.call(this, obj, f, a, b);
      case 5:
        return vary_meta__5.call(this, obj, f, a, b, c);
      case 6:
        return vary_meta__6.call(this, obj, f, a, b, c, d);
      default:
        return vary_meta__7.cljs$core$IFn$_invoke$arity$variadic(obj, f, a, b, c, d, cljs.core.array_seq(arguments, 6));
    }
    throw new Error("Invalid arity: " + arguments.length);
  };
  vary_meta.cljs$lang$maxFixedArity = 6;
  vary_meta.cljs$lang$applyTo = vary_meta__7.cljs$lang$applyTo;
  vary_meta.cljs$core$IFn$_invoke$arity$2 = vary_meta__2;
  vary_meta.cljs$core$IFn$_invoke$arity$3 = vary_meta__3;
  vary_meta.cljs$core$IFn$_invoke$arity$4 = vary_meta__4;
  vary_meta.cljs$core$IFn$_invoke$arity$5 = vary_meta__5;
  vary_meta.cljs$core$IFn$_invoke$arity$6 = vary_meta__6;
  vary_meta.cljs$core$IFn$_invoke$arity$variadic = vary_meta__7.cljs$core$IFn$_invoke$arity$variadic;
  return vary_meta;
}();
cljs.core.not_EQ_ = function() {
  var not_EQ_ = null;
  var not_EQ___1 = function(x) {
    return false;
  };
  var not_EQ___2 = function(x, y) {
    return!cljs.core._EQ_.call(null, x, y);
  };
  var not_EQ___3 = function() {
    var G__56589__delegate = function(x, y, more) {
      return cljs.core.not.call(null, cljs.core.apply.call(null, cljs.core._EQ_, x, y, more));
    };
    var G__56589 = function(x, y, var_args) {
      var more = null;
      if (arguments.length > 2) {
        more = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0);
      }
      return G__56589__delegate.call(this, x, y, more);
    };
    G__56589.cljs$lang$maxFixedArity = 2;
    G__56589.cljs$lang$applyTo = function(arglist__56590) {
      var x = cljs.core.first(arglist__56590);
      arglist__56590 = cljs.core.next(arglist__56590);
      var y = cljs.core.first(arglist__56590);
      var more = cljs.core.rest(arglist__56590);
      return G__56589__delegate(x, y, more);
    };
    G__56589.cljs$core$IFn$_invoke$arity$variadic = G__56589__delegate;
    return G__56589;
  }();
  not_EQ_ = function(x, y, var_args) {
    var more = var_args;
    switch(arguments.length) {
      case 1:
        return not_EQ___1.call(this, x);
      case 2:
        return not_EQ___2.call(this, x, y);
      default:
        return not_EQ___3.cljs$core$IFn$_invoke$arity$variadic(x, y, cljs.core.array_seq(arguments, 2));
    }
    throw new Error("Invalid arity: " + arguments.length);
  };
  not_EQ_.cljs$lang$maxFixedArity = 2;
  not_EQ_.cljs$lang$applyTo = not_EQ___3.cljs$lang$applyTo;
  not_EQ_.cljs$core$IFn$_invoke$arity$1 = not_EQ___1;
  not_EQ_.cljs$core$IFn$_invoke$arity$2 = not_EQ___2;
  not_EQ_.cljs$core$IFn$_invoke$arity$variadic = not_EQ___3.cljs$core$IFn$_invoke$arity$variadic;
  return not_EQ_;
}();
cljs.core.not_empty = function not_empty(coll) {
  if (cljs.core.seq.call(null, coll)) {
    return coll;
  } else {
    return null;
  }
};
cljs.core.nil_iter = function nil_iter() {
  if (typeof cljs.core.t56594 !== "undefined") {
  } else {
    cljs.core.t56594 = function(nil_iter, meta56595) {
      this.nil_iter = nil_iter;
      this.meta56595 = meta56595;
      this.cljs$lang$protocol_mask$partition1$ = 0;
      this.cljs$lang$protocol_mask$partition0$ = 393216;
    };
    cljs.core.t56594.cljs$lang$type = true;
    cljs.core.t56594.cljs$lang$ctorStr = "cljs.core/t56594";
    cljs.core.t56594.cljs$lang$ctorPrWriter = function(this__4215__auto__, writer__4216__auto__, opt__4217__auto__) {
      return cljs.core._write.call(null, writer__4216__auto__, "cljs.core/t56594");
    };
    cljs.core.t56594.prototype.hasNext = function() {
      var self__ = this;
      var _ = this;
      return false;
    };
    cljs.core.t56594.prototype.next = function() {
      var self__ = this;
      var _ = this;
      return new Error("No such element");
    };
    cljs.core.t56594.prototype.remove = function() {
      var self__ = this;
      var _ = this;
      return new Error("Unsupported operation");
    };
    cljs.core.t56594.prototype.cljs$core$IMeta$_meta$arity$1 = function(_56596) {
      var self__ = this;
      var _56596__$1 = this;
      return self__.meta56595;
    };
    cljs.core.t56594.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(_56596, meta56595__$1) {
      var self__ = this;
      var _56596__$1 = this;
      return new cljs.core.t56594(self__.nil_iter, meta56595__$1);
    };
    cljs.core.__GT_t56594 = function __GT_t56594(nil_iter__$1, meta56595) {
      return new cljs.core.t56594(nil_iter__$1, meta56595);
    };
  }
  return new cljs.core.t56594(nil_iter, null);
};
cljs.core.StringIter = function(s, i) {
  this.s = s;
  this.i = i;
};
cljs.core.StringIter.cljs$lang$type = true;
cljs.core.StringIter.cljs$lang$ctorStr = "cljs.core/StringIter";
cljs.core.StringIter.cljs$lang$ctorPrWriter = function(this__4215__auto__, writer__4216__auto__, opt__4217__auto__) {
  return cljs.core._write.call(null, writer__4216__auto__, "cljs.core/StringIter");
};
cljs.core.StringIter.prototype.hasNext = function() {
  var self__ = this;
  var _ = this;
  return self__.i < self__.s.length;
};
cljs.core.StringIter.prototype.next = function() {
  var self__ = this;
  var _ = this;
  var ret = self__.s.charAt(self__.i);
  self__.i = self__.i + 1;
  return ret;
};
cljs.core.StringIter.prototype.remove = function() {
  var self__ = this;
  var _ = this;
  return new Error("Unsupported operation");
};
cljs.core.__GT_StringIter = function __GT_StringIter(s, i) {
  return new cljs.core.StringIter(s, i);
};
cljs.core.string_iter = function string_iter(x) {
  return new cljs.core.StringIter(x, 0);
};
cljs.core.ArrayIter = function(arr, i) {
  this.arr = arr;
  this.i = i;
};
cljs.core.ArrayIter.cljs$lang$type = true;
cljs.core.ArrayIter.cljs$lang$ctorStr = "cljs.core/ArrayIter";
cljs.core.ArrayIter.cljs$lang$ctorPrWriter = function(this__4215__auto__, writer__4216__auto__, opt__4217__auto__) {
  return cljs.core._write.call(null, writer__4216__auto__, "cljs.core/ArrayIter");
};
cljs.core.ArrayIter.prototype.hasNext = function() {
  var self__ = this;
  var _ = this;
  return self__.i < self__.arr.length;
};
cljs.core.ArrayIter.prototype.next = function() {
  var self__ = this;
  var _ = this;
  var ret = self__.arr[self__.i];
  self__.i = self__.i + 1;
  return ret;
};
cljs.core.ArrayIter.prototype.remove = function() {
  var self__ = this;
  var _ = this;
  return new Error("Unsupported operation");
};
cljs.core.__GT_ArrayIter = function __GT_ArrayIter(arr, i) {
  return new cljs.core.ArrayIter(arr, i);
};
cljs.core.array_iter = function array_iter(x) {
  return new cljs.core.ArrayIter(x, 0);
};
cljs.core.INIT = {};
cljs.core.START = {};
cljs.core.SeqIter = function(_seq, _next) {
  this._seq = _seq;
  this._next = _next;
};
cljs.core.SeqIter.cljs$lang$type = true;
cljs.core.SeqIter.cljs$lang$ctorStr = "cljs.core/SeqIter";
cljs.core.SeqIter.cljs$lang$ctorPrWriter = function(this__4215__auto__, writer__4216__auto__, opt__4217__auto__) {
  return cljs.core._write.call(null, writer__4216__auto__, "cljs.core/SeqIter");
};
cljs.core.SeqIter.prototype.hasNext = function() {
  var self__ = this;
  var _ = this;
  if (self__._seq === cljs.core.INIT) {
    self__._seq = cljs.core.START;
    self__._next = cljs.core.seq.call(null, self__._next);
  } else {
    if (self__._seq === self__._next) {
      self__._next = cljs.core.next.call(null, self__._seq);
    } else {
    }
  }
  return!(self__._next == null);
};
cljs.core.SeqIter.prototype.next = function() {
  var self__ = this;
  var this$ = this;
  if (cljs.core.not.call(null, this$.hasNext())) {
    throw new Error("No such element");
  } else {
    self__._seq = self__._next;
    return cljs.core.first.call(null, self__._next);
  }
};
cljs.core.SeqIter.prototype.remove = function() {
  var self__ = this;
  var _ = this;
  return new Error("Unsupported operation");
};
cljs.core.__GT_SeqIter = function __GT_SeqIter(_seq, _next) {
  return new cljs.core.SeqIter(_seq, _next);
};
cljs.core.seq_iter = function seq_iter(coll) {
  return new cljs.core.SeqIter(cljs.core.INIT, coll);
};
cljs.core.iter = function iter(coll) {
  if (coll == null) {
    return cljs.core.nil_iter.call(null);
  } else {
    if (typeof coll === "string") {
      return cljs.core.string_iter.call(null, coll);
    } else {
      if (coll instanceof Array) {
        return cljs.core.array_iter.call(null, coll);
      } else {
        if (cljs.core.iterable_QMARK_.call(null, coll)) {
          return cljs.core._iterator.call(null, coll);
        } else {
          if (cljs.core.seqable_QMARK_.call(null, coll)) {
            return cljs.core.seq_iter.call(null, coll);
          } else {
            throw new Error("Cannot create iterator from " + cljs.core.str.cljs$core$IFn$_invoke$arity$1(coll));
          }
        }
      }
    }
  }
};
cljs.core.lazy_transformer = function lazy_transformer(stepper) {
  return new cljs.core.LazyTransformer(stepper, null, null, null);
};
cljs.core.Stepper = function(xform, iter) {
  this.xform = xform;
  this.iter = iter;
};
cljs.core.Stepper.cljs$lang$type = true;
cljs.core.Stepper.cljs$lang$ctorStr = "cljs.core/Stepper";
cljs.core.Stepper.cljs$lang$ctorPrWriter = function(this__4215__auto__, writer__4216__auto__, opt__4217__auto__) {
  return cljs.core._write.call(null, writer__4216__auto__, "cljs.core/Stepper");
};
cljs.core.Stepper.prototype.step = function(lt) {
  var self__ = this;
  var this$ = this;
  while (true) {
    if (cljs.core.truth_(function() {
      var and__3627__auto__ = !(lt.stepper == null);
      if (and__3627__auto__) {
        return self__.iter.hasNext();
      } else {
        return and__3627__auto__;
      }
    }())) {
      if (cljs.core.reduced_QMARK_.call(null, self__.xform.call(null, lt, self__.iter.next()))) {
        if (lt.rest == null) {
        } else {
          lt.rest.stepper = null;
        }
      } else {
        continue;
      }
    } else {
    }
    break;
  }
  if (lt.stepper == null) {
    return null;
  } else {
    return self__.xform.call(null, lt);
  }
};
cljs.core.__GT_Stepper = function __GT_Stepper(xform, iter) {
  return new cljs.core.Stepper(xform, iter);
};
cljs.core.stepper = function stepper(xform, iter) {
  var stepfn = function() {
    var stepfn = null;
    var stepfn__1 = function(result) {
      var lt = cljs.core.reduced_QMARK_.call(null, result) ? cljs.core.deref.call(null, result) : result;
      lt.stepper = null;
      return result;
    };
    var stepfn__2 = function(result, input) {
      var lt = result;
      lt.first = input;
      lt.rest = cljs.core.lazy_transformer.call(null, lt.stepper);
      lt.stepper = null;
      return lt.rest;
    };
    stepfn = function(result, input) {
      switch(arguments.length) {
        case 1:
          return stepfn__1.call(this, result);
        case 2:
          return stepfn__2.call(this, result, input);
      }
      throw new Error("Invalid arity: " + arguments.length);
    };
    stepfn.cljs$core$IFn$_invoke$arity$1 = stepfn__1;
    stepfn.cljs$core$IFn$_invoke$arity$2 = stepfn__2;
    return stepfn;
  }();
  return new cljs.core.Stepper(xform.call(null, stepfn), iter);
};
cljs.core.MultiStepper = function(xform, iters, nexts) {
  this.xform = xform;
  this.iters = iters;
  this.nexts = nexts;
};
cljs.core.MultiStepper.cljs$lang$type = true;
cljs.core.MultiStepper.cljs$lang$ctorStr = "cljs.core/MultiStepper";
cljs.core.MultiStepper.cljs$lang$ctorPrWriter = function(this__4215__auto__, writer__4216__auto__, opt__4217__auto__) {
  return cljs.core._write.call(null, writer__4216__auto__, "cljs.core/MultiStepper");
};
cljs.core.MultiStepper.prototype.hasNext = function() {
  var self__ = this;
  var _ = this;
  var iters__$1 = cljs.core.seq.call(null, self__.iters);
  while (true) {
    if (!(iters__$1 == null)) {
      var iter = cljs.core.first.call(null, iters__$1);
      if (cljs.core.not.call(null, iter.hasNext())) {
        return false;
      } else {
        var G__56597 = cljs.core.next.call(null, iters__$1);
        iters__$1 = G__56597;
        continue;
      }
    } else {
      return true;
    }
    break;
  }
};
cljs.core.MultiStepper.prototype.next = function() {
  var self__ = this;
  var _ = this;
  var n__4508__auto___56598 = self__.iters.length;
  var i_56599 = 0;
  while (true) {
    if (i_56599 < n__4508__auto___56598) {
      self__.nexts[i_56599] = self__.iters[i_56599].next();
      var G__56600 = i_56599 + 1;
      i_56599 = G__56600;
      continue;
    } else {
    }
    break;
  }
  return cljs.core.prim_seq.call(null, self__.nexts, 0);
};
cljs.core.MultiStepper.prototype.step = function(lt) {
  var self__ = this;
  var this$ = this;
  while (true) {
    if (cljs.core.truth_(function() {
      var and__3627__auto__ = !(lt.stepper == null);
      if (and__3627__auto__) {
        return this$.hasNext();
      } else {
        return and__3627__auto__;
      }
    }())) {
      if (cljs.core.reduced_QMARK_.call(null, cljs.core.apply.call(null, self__.xform, cljs.core.cons.call(null, lt, this$.next())))) {
        if (lt.rest == null) {
        } else {
          lt.rest.stepper = null;
        }
      } else {
        continue;
      }
    } else {
    }
    break;
  }
  if (lt.stepper == null) {
    return null;
  } else {
    return self__.xform.call(null, lt);
  }
};
cljs.core.__GT_MultiStepper = function __GT_MultiStepper(xform, iters, nexts) {
  return new cljs.core.MultiStepper(xform, iters, nexts);
};
cljs.core.multi_stepper = function() {
  var multi_stepper = null;
  var multi_stepper__2 = function(xform, iters) {
    return multi_stepper.call(null, xform, iters, new Array(iters.length));
  };
  var multi_stepper__3 = function(xform, iters, nexts) {
    var stepfn = function() {
      var stepfn = null;
      var stepfn__1 = function(result) {
        var lt = cljs.core.reduced_QMARK_.call(null, result) ? cljs.core.deref.call(null, result) : result;
        lt.stepper = null;
        return lt;
      };
      var stepfn__2 = function(result, input) {
        var lt = result;
        lt.first = input;
        lt.rest = cljs.core.lazy_transformer.call(null, lt.stepper);
        lt.stepper = null;
        return lt.rest;
      };
      stepfn = function(result, input) {
        switch(arguments.length) {
          case 1:
            return stepfn__1.call(this, result);
          case 2:
            return stepfn__2.call(this, result, input);
        }
        throw new Error("Invalid arity: " + arguments.length);
      };
      stepfn.cljs$core$IFn$_invoke$arity$1 = stepfn__1;
      stepfn.cljs$core$IFn$_invoke$arity$2 = stepfn__2;
      return stepfn;
    }();
    return new cljs.core.MultiStepper(xform.call(null, stepfn), iters, nexts);
  };
  multi_stepper = function(xform, iters, nexts) {
    switch(arguments.length) {
      case 2:
        return multi_stepper__2.call(this, xform, iters);
      case 3:
        return multi_stepper__3.call(this, xform, iters, nexts);
    }
    throw new Error("Invalid arity: " + arguments.length);
  };
  multi_stepper.cljs$core$IFn$_invoke$arity$2 = multi_stepper__2;
  multi_stepper.cljs$core$IFn$_invoke$arity$3 = multi_stepper__3;
  return multi_stepper;
}();
cljs.core.LazyTransformer = function(stepper, first, rest, meta) {
  this.stepper = stepper;
  this.first = first;
  this.rest = rest;
  this.meta = meta;
  this.cljs$lang$protocol_mask$partition1$ = 0;
  this.cljs$lang$protocol_mask$partition0$ = 31719628;
};
cljs.core.LazyTransformer.cljs$lang$type = true;
cljs.core.LazyTransformer.cljs$lang$ctorStr = "cljs.core/LazyTransformer";
cljs.core.LazyTransformer.cljs$lang$ctorPrWriter = function(this__4215__auto__, writer__4216__auto__, opt__4217__auto__) {
  return cljs.core._write.call(null, writer__4216__auto__, "cljs.core/LazyTransformer");
};
cljs.core.LazyTransformer.prototype.cljs$core$INext$_next$arity$1 = function(this$) {
  var self__ = this;
  var this$__$1 = this;
  if (self__.stepper == null) {
  } else {
    cljs.core._seq.call(null, this$__$1);
  }
  if (self__.rest == null) {
    return null;
  } else {
    return cljs.core._seq.call(null, self__.rest);
  }
};
cljs.core.LazyTransformer.prototype.cljs$core$ISeq$_first$arity$1 = function(this$) {
  var self__ = this;
  var this$__$1 = this;
  if (self__.stepper == null) {
  } else {
    cljs.core._seq.call(null, this$__$1);
  }
  if (self__.rest == null) {
    return null;
  } else {
    return self__.first;
  }
};
cljs.core.LazyTransformer.prototype.cljs$core$ISeq$_rest$arity$1 = function(this$) {
  var self__ = this;
  var this$__$1 = this;
  if (self__.stepper == null) {
  } else {
    cljs.core._seq.call(null, this$__$1);
  }
  if (self__.rest == null) {
    return cljs.core.List.EMPTY;
  } else {
    return self__.rest;
  }
};
cljs.core.LazyTransformer.prototype.cljs$core$ISeqable$_seq$arity$1 = function(this$) {
  var self__ = this;
  var this$__$1 = this;
  if (self__.stepper == null) {
  } else {
    self__.stepper.step(this$__$1);
  }
  if (self__.rest == null) {
    return null;
  } else {
    return this$__$1;
  }
};
cljs.core.LazyTransformer.prototype.cljs$core$IHash$_hash$arity$1 = function(this$) {
  var self__ = this;
  var this$__$1 = this;
  return cljs.core.hash_ordered_coll.call(null, this$__$1);
};
cljs.core.LazyTransformer.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(this$, other) {
  var self__ = this;
  var this$__$1 = this;
  var s = cljs.core._seq.call(null, this$__$1);
  if (!(s == null)) {
    return cljs.core.equiv_sequential.call(null, this$__$1, other);
  } else {
    return cljs.core.sequential_QMARK_.call(null, other) && cljs.core.seq.call(null, other) == null;
  }
};
cljs.core.LazyTransformer.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(this$) {
  var self__ = this;
  var this$__$1 = this;
  return cljs.core.List.EMPTY;
};
cljs.core.LazyTransformer.prototype.cljs$core$ICollection$_conj$arity$2 = function(this$, o) {
  var self__ = this;
  var this$__$1 = this;
  return cljs.core.cons.call(null, o, cljs.core._seq.call(null, this$__$1));
};
cljs.core.LazyTransformer.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(this$, new_meta) {
  var self__ = this;
  var this$__$1 = this;
  return new cljs.core.LazyTransformer(self__.stepper, self__.first, self__.rest, new_meta);
};
cljs.core.__GT_LazyTransformer = function __GT_LazyTransformer(stepper, first, rest, meta) {
  return new cljs.core.LazyTransformer(stepper, first, rest, meta);
};
cljs.core.LazyTransformer.create = function(xform, coll) {
  return new cljs.core.LazyTransformer(cljs.core.stepper.call(null, xform, cljs.core.iter.call(null, coll)), null, null, null);
};
cljs.core.LazyTransformer.createMulti = function(xform, colls) {
  var iters = [];
  var seq__56601_56605 = cljs.core.seq.call(null, colls);
  var chunk__56602_56606 = null;
  var count__56603_56607 = 0;
  var i__56604_56608 = 0;
  while (true) {
    if (i__56604_56608 < count__56603_56607) {
      var coll_56609 = cljs.core._nth.call(null, chunk__56602_56606, i__56604_56608);
      iters.push(cljs.core.iter.call(null, coll_56609));
      var G__56610 = seq__56601_56605;
      var G__56611 = chunk__56602_56606;
      var G__56612 = count__56603_56607;
      var G__56613 = i__56604_56608 + 1;
      seq__56601_56605 = G__56610;
      chunk__56602_56606 = G__56611;
      count__56603_56607 = G__56612;
      i__56604_56608 = G__56613;
      continue;
    } else {
      var temp__4126__auto___56614 = cljs.core.seq.call(null, seq__56601_56605);
      if (temp__4126__auto___56614) {
        var seq__56601_56615__$1 = temp__4126__auto___56614;
        if (cljs.core.chunked_seq_QMARK_.call(null, seq__56601_56615__$1)) {
          var c__4408__auto___56616 = cljs.core.chunk_first.call(null, seq__56601_56615__$1);
          var G__56617 = cljs.core.chunk_rest.call(null, seq__56601_56615__$1);
          var G__56618 = c__4408__auto___56616;
          var G__56619 = cljs.core.count.call(null, c__4408__auto___56616);
          var G__56620 = 0;
          seq__56601_56605 = G__56617;
          chunk__56602_56606 = G__56618;
          count__56603_56607 = G__56619;
          i__56604_56608 = G__56620;
          continue;
        } else {
          var coll_56621 = cljs.core.first.call(null, seq__56601_56615__$1);
          iters.push(cljs.core.iter.call(null, coll_56621));
          var G__56622 = cljs.core.next.call(null, seq__56601_56615__$1);
          var G__56623 = null;
          var G__56624 = 0;
          var G__56625 = 0;
          seq__56601_56605 = G__56622;
          chunk__56602_56606 = G__56623;
          count__56603_56607 = G__56624;
          i__56604_56608 = G__56625;
          continue;
        }
      } else {
      }
    }
    break;
  }
  return new cljs.core.LazyTransformer(cljs.core.multi_stepper.call(null, xform, iters, new Array(iters.length)), null, null, null);
};
cljs.core.sequence = function() {
  var sequence = null;
  var sequence__1 = function(coll) {
    if (cljs.core.seq_QMARK_.call(null, coll)) {
      return coll;
    } else {
      var or__3639__auto__ = cljs.core.seq.call(null, coll);
      if (or__3639__auto__) {
        return or__3639__auto__;
      } else {
        return cljs.core.List.EMPTY;
      }
    }
  };
  var sequence__2 = function(xform, coll) {
    return cljs.core.LazyTransformer.create(xform, coll);
  };
  var sequence__3 = function() {
    var G__56626__delegate = function(xform, coll, colls) {
      return cljs.core.LazyTransformer.createMulti(xform, cljs.core.to_array.call(null, cljs.core.cons.call(null, coll, colls)));
    };
    var G__56626 = function(xform, coll, var_args) {
      var colls = null;
      if (arguments.length > 2) {
        colls = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0);
      }
      return G__56626__delegate.call(this, xform, coll, colls);
    };
    G__56626.cljs$lang$maxFixedArity = 2;
    G__56626.cljs$lang$applyTo = function(arglist__56627) {
      var xform = cljs.core.first(arglist__56627);
      arglist__56627 = cljs.core.next(arglist__56627);
      var coll = cljs.core.first(arglist__56627);
      var colls = cljs.core.rest(arglist__56627);
      return G__56626__delegate(xform, coll, colls);
    };
    G__56626.cljs$core$IFn$_invoke$arity$variadic = G__56626__delegate;
    return G__56626;
  }();
  sequence = function(xform, coll, var_args) {
    var colls = var_args;
    switch(arguments.length) {
      case 1:
        return sequence__1.call(this, xform);
      case 2:
        return sequence__2.call(this, xform, coll);
      default:
        return sequence__3.cljs$core$IFn$_invoke$arity$variadic(xform, coll, cljs.core.array_seq(arguments, 2));
    }
    throw new Error("Invalid arity: " + arguments.length);
  };
  sequence.cljs$lang$maxFixedArity = 2;
  sequence.cljs$lang$applyTo = sequence__3.cljs$lang$applyTo;
  sequence.cljs$core$IFn$_invoke$arity$1 = sequence__1;
  sequence.cljs$core$IFn$_invoke$arity$2 = sequence__2;
  sequence.cljs$core$IFn$_invoke$arity$variadic = sequence__3.cljs$core$IFn$_invoke$arity$variadic;
  return sequence;
}();
cljs.core.every_QMARK_ = function every_QMARK_(pred, coll) {
  while (true) {
    if (cljs.core.seq.call(null, coll) == null) {
      return true;
    } else {
      if (cljs.core.truth_(pred.call(null, cljs.core.first.call(null, coll)))) {
        var G__56628 = pred;
        var G__56629 = cljs.core.next.call(null, coll);
        pred = G__56628;
        coll = G__56629;
        continue;
      } else {
        return false;
      }
    }
    break;
  }
};
cljs.core.not_every_QMARK_ = function not_every_QMARK_(pred, coll) {
  return!cljs.core.every_QMARK_.call(null, pred, coll);
};
cljs.core.some = function some(pred, coll) {
  while (true) {
    if (cljs.core.seq.call(null, coll)) {
      var or__3639__auto__ = pred.call(null, cljs.core.first.call(null, coll));
      if (cljs.core.truth_(or__3639__auto__)) {
        return or__3639__auto__;
      } else {
        var G__56630 = pred;
        var G__56631 = cljs.core.next.call(null, coll);
        pred = G__56630;
        coll = G__56631;
        continue;
      }
    } else {
      return null;
    }
    break;
  }
};
cljs.core.not_any_QMARK_ = function not_any_QMARK_(pred, coll) {
  return cljs.core.not.call(null, cljs.core.some.call(null, pred, coll));
};
cljs.core.even_QMARK_ = function even_QMARK_(n) {
  if (cljs.core.integer_QMARK_.call(null, n)) {
    return(n & 1) === 0;
  } else {
    throw new Error("Argument must be an integer: " + cljs.core.str.cljs$core$IFn$_invoke$arity$1(n));
  }
};
cljs.core.odd_QMARK_ = function odd_QMARK_(n) {
  return!cljs.core.even_QMARK_.call(null, n);
};
cljs.core.complement = function complement(f) {
  return function() {
    var G__56632 = null;
    var G__56632__0 = function() {
      return cljs.core.not.call(null, f.call(null));
    };
    var G__56632__1 = function(x) {
      return cljs.core.not.call(null, f.call(null, x));
    };
    var G__56632__2 = function(x, y) {
      return cljs.core.not.call(null, f.call(null, x, y));
    };
    var G__56632__3 = function() {
      var G__56633__delegate = function(x, y, zs) {
        return cljs.core.not.call(null, cljs.core.apply.call(null, f, x, y, zs));
      };
      var G__56633 = function(x, y, var_args) {
        var zs = null;
        if (arguments.length > 2) {
          zs = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0);
        }
        return G__56633__delegate.call(this, x, y, zs);
      };
      G__56633.cljs$lang$maxFixedArity = 2;
      G__56633.cljs$lang$applyTo = function(arglist__56634) {
        var x = cljs.core.first(arglist__56634);
        arglist__56634 = cljs.core.next(arglist__56634);
        var y = cljs.core.first(arglist__56634);
        var zs = cljs.core.rest(arglist__56634);
        return G__56633__delegate(x, y, zs);
      };
      G__56633.cljs$core$IFn$_invoke$arity$variadic = G__56633__delegate;
      return G__56633;
    }();
    G__56632 = function(x, y, var_args) {
      var zs = var_args;
      switch(arguments.length) {
        case 0:
          return G__56632__0.call(this);
        case 1:
          return G__56632__1.call(this, x);
        case 2:
          return G__56632__2.call(this, x, y);
        default:
          return G__56632__3.cljs$core$IFn$_invoke$arity$variadic(x, y, cljs.core.array_seq(arguments, 2));
      }
      throw new Error("Invalid arity: " + arguments.length);
    };
    G__56632.cljs$lang$maxFixedArity = 2;
    G__56632.cljs$lang$applyTo = G__56632__3.cljs$lang$applyTo;
    G__56632.cljs$core$IFn$_invoke$arity$0 = G__56632__0;
    G__56632.cljs$core$IFn$_invoke$arity$1 = G__56632__1;
    G__56632.cljs$core$IFn$_invoke$arity$2 = G__56632__2;
    G__56632.cljs$core$IFn$_invoke$arity$variadic = G__56632__3.cljs$core$IFn$_invoke$arity$variadic;
    return G__56632;
  }();
};
cljs.core.constantly = function constantly(x) {
  return function() {
    var G__56635__delegate = function(args) {
      return x;
    };
    var G__56635 = function(var_args) {
      var args = null;
      if (arguments.length > 0) {
        args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0);
      }
      return G__56635__delegate.call(this, args);
    };
    G__56635.cljs$lang$maxFixedArity = 0;
    G__56635.cljs$lang$applyTo = function(arglist__56636) {
      var args = cljs.core.seq(arglist__56636);
      return G__56635__delegate(args);
    };
    G__56635.cljs$core$IFn$_invoke$arity$variadic = G__56635__delegate;
    return G__56635;
  }();
};
cljs.core.comp = function() {
  var comp = null;
  var comp__0 = function() {
    return cljs.core.identity;
  };
  var comp__1 = function(f) {
    return f;
  };
  var comp__2 = function(f, g) {
    return function() {
      var G__56637 = null;
      var G__56637__0 = function() {
        return f.call(null, g.call(null));
      };
      var G__56637__1 = function(x) {
        return f.call(null, g.call(null, x));
      };
      var G__56637__2 = function(x, y) {
        return f.call(null, g.call(null, x, y));
      };
      var G__56637__3 = function(x, y, z) {
        return f.call(null, g.call(null, x, y, z));
      };
      var G__56637__4 = function() {
        var G__56638__delegate = function(x, y, z, args) {
          return f.call(null, cljs.core.apply.call(null, g, x, y, z, args));
        };
        var G__56638 = function(x, y, z, var_args) {
          var args = null;
          if (arguments.length > 3) {
            args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0);
          }
          return G__56638__delegate.call(this, x, y, z, args);
        };
        G__56638.cljs$lang$maxFixedArity = 3;
        G__56638.cljs$lang$applyTo = function(arglist__56639) {
          var x = cljs.core.first(arglist__56639);
          arglist__56639 = cljs.core.next(arglist__56639);
          var y = cljs.core.first(arglist__56639);
          arglist__56639 = cljs.core.next(arglist__56639);
          var z = cljs.core.first(arglist__56639);
          var args = cljs.core.rest(arglist__56639);
          return G__56638__delegate(x, y, z, args);
        };
        G__56638.cljs$core$IFn$_invoke$arity$variadic = G__56638__delegate;
        return G__56638;
      }();
      G__56637 = function(x, y, z, var_args) {
        var args = var_args;
        switch(arguments.length) {
          case 0:
            return G__56637__0.call(this);
          case 1:
            return G__56637__1.call(this, x);
          case 2:
            return G__56637__2.call(this, x, y);
          case 3:
            return G__56637__3.call(this, x, y, z);
          default:
            return G__56637__4.cljs$core$IFn$_invoke$arity$variadic(x, y, z, cljs.core.array_seq(arguments, 3));
        }
        throw new Error("Invalid arity: " + arguments.length);
      };
      G__56637.cljs$lang$maxFixedArity = 3;
      G__56637.cljs$lang$applyTo = G__56637__4.cljs$lang$applyTo;
      G__56637.cljs$core$IFn$_invoke$arity$0 = G__56637__0;
      G__56637.cljs$core$IFn$_invoke$arity$1 = G__56637__1;
      G__56637.cljs$core$IFn$_invoke$arity$2 = G__56637__2;
      G__56637.cljs$core$IFn$_invoke$arity$3 = G__56637__3;
      G__56637.cljs$core$IFn$_invoke$arity$variadic = G__56637__4.cljs$core$IFn$_invoke$arity$variadic;
      return G__56637;
    }();
  };
  var comp__3 = function(f, g, h) {
    return function() {
      var G__56640 = null;
      var G__56640__0 = function() {
        return f.call(null, g.call(null, h.call(null)));
      };
      var G__56640__1 = function(x) {
        return f.call(null, g.call(null, h.call(null, x)));
      };
      var G__56640__2 = function(x, y) {
        return f.call(null, g.call(null, h.call(null, x, y)));
      };
      var G__56640__3 = function(x, y, z) {
        return f.call(null, g.call(null, h.call(null, x, y, z)));
      };
      var G__56640__4 = function() {
        var G__56641__delegate = function(x, y, z, args) {
          return f.call(null, g.call(null, cljs.core.apply.call(null, h, x, y, z, args)));
        };
        var G__56641 = function(x, y, z, var_args) {
          var args = null;
          if (arguments.length > 3) {
            args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0);
          }
          return G__56641__delegate.call(this, x, y, z, args);
        };
        G__56641.cljs$lang$maxFixedArity = 3;
        G__56641.cljs$lang$applyTo = function(arglist__56642) {
          var x = cljs.core.first(arglist__56642);
          arglist__56642 = cljs.core.next(arglist__56642);
          var y = cljs.core.first(arglist__56642);
          arglist__56642 = cljs.core.next(arglist__56642);
          var z = cljs.core.first(arglist__56642);
          var args = cljs.core.rest(arglist__56642);
          return G__56641__delegate(x, y, z, args);
        };
        G__56641.cljs$core$IFn$_invoke$arity$variadic = G__56641__delegate;
        return G__56641;
      }();
      G__56640 = function(x, y, z, var_args) {
        var args = var_args;
        switch(arguments.length) {
          case 0:
            return G__56640__0.call(this);
          case 1:
            return G__56640__1.call(this, x);
          case 2:
            return G__56640__2.call(this, x, y);
          case 3:
            return G__56640__3.call(this, x, y, z);
          default:
            return G__56640__4.cljs$core$IFn$_invoke$arity$variadic(x, y, z, cljs.core.array_seq(arguments, 3));
        }
        throw new Error("Invalid arity: " + arguments.length);
      };
      G__56640.cljs$lang$maxFixedArity = 3;
      G__56640.cljs$lang$applyTo = G__56640__4.cljs$lang$applyTo;
      G__56640.cljs$core$IFn$_invoke$arity$0 = G__56640__0;
      G__56640.cljs$core$IFn$_invoke$arity$1 = G__56640__1;
      G__56640.cljs$core$IFn$_invoke$arity$2 = G__56640__2;
      G__56640.cljs$core$IFn$_invoke$arity$3 = G__56640__3;
      G__56640.cljs$core$IFn$_invoke$arity$variadic = G__56640__4.cljs$core$IFn$_invoke$arity$variadic;
      return G__56640;
    }();
  };
  var comp__4 = function() {
    var G__56643__delegate = function(f1, f2, f3, fs) {
      var fs__$1 = cljs.core.reverse.call(null, cljs.core.list_STAR_.call(null, f1, f2, f3, fs));
      return function(fs__$1) {
        return function() {
          var G__56644__delegate = function(args) {
            var ret = cljs.core.apply.call(null, cljs.core.first.call(null, fs__$1), args);
            var fs__$2 = cljs.core.next.call(null, fs__$1);
            while (true) {
              if (fs__$2) {
                var G__56645 = cljs.core.first.call(null, fs__$2).call(null, ret);
                var G__56646 = cljs.core.next.call(null, fs__$2);
                ret = G__56645;
                fs__$2 = G__56646;
                continue;
              } else {
                return ret;
              }
              break;
            }
          };
          var G__56644 = function(var_args) {
            var args = null;
            if (arguments.length > 0) {
              args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0);
            }
            return G__56644__delegate.call(this, args);
          };
          G__56644.cljs$lang$maxFixedArity = 0;
          G__56644.cljs$lang$applyTo = function(arglist__56647) {
            var args = cljs.core.seq(arglist__56647);
            return G__56644__delegate(args);
          };
          G__56644.cljs$core$IFn$_invoke$arity$variadic = G__56644__delegate;
          return G__56644;
        }();
      }(fs__$1);
    };
    var G__56643 = function(f1, f2, f3, var_args) {
      var fs = null;
      if (arguments.length > 3) {
        fs = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0);
      }
      return G__56643__delegate.call(this, f1, f2, f3, fs);
    };
    G__56643.cljs$lang$maxFixedArity = 3;
    G__56643.cljs$lang$applyTo = function(arglist__56648) {
      var f1 = cljs.core.first(arglist__56648);
      arglist__56648 = cljs.core.next(arglist__56648);
      var f2 = cljs.core.first(arglist__56648);
      arglist__56648 = cljs.core.next(arglist__56648);
      var f3 = cljs.core.first(arglist__56648);
      var fs = cljs.core.rest(arglist__56648);
      return G__56643__delegate(f1, f2, f3, fs);
    };
    G__56643.cljs$core$IFn$_invoke$arity$variadic = G__56643__delegate;
    return G__56643;
  }();
  comp = function(f1, f2, f3, var_args) {
    var fs = var_args;
    switch(arguments.length) {
      case 0:
        return comp__0.call(this);
      case 1:
        return comp__1.call(this, f1);
      case 2:
        return comp__2.call(this, f1, f2);
      case 3:
        return comp__3.call(this, f1, f2, f3);
      default:
        return comp__4.cljs$core$IFn$_invoke$arity$variadic(f1, f2, f3, cljs.core.array_seq(arguments, 3));
    }
    throw new Error("Invalid arity: " + arguments.length);
  };
  comp.cljs$lang$maxFixedArity = 3;
  comp.cljs$lang$applyTo = comp__4.cljs$lang$applyTo;
  comp.cljs$core$IFn$_invoke$arity$0 = comp__0;
  comp.cljs$core$IFn$_invoke$arity$1 = comp__1;
  comp.cljs$core$IFn$_invoke$arity$2 = comp__2;
  comp.cljs$core$IFn$_invoke$arity$3 = comp__3;
  comp.cljs$core$IFn$_invoke$arity$variadic = comp__4.cljs$core$IFn$_invoke$arity$variadic;
  return comp;
}();
cljs.core.partial = function() {
  var partial = null;
  var partial__1 = function(f) {
    return f;
  };
  var partial__2 = function(f, arg1) {
    return function() {
      var G__56649__delegate = function(args) {
        return cljs.core.apply.call(null, f, arg1, args);
      };
      var G__56649 = function(var_args) {
        var args = null;
        if (arguments.length > 0) {
          args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0);
        }
        return G__56649__delegate.call(this, args);
      };
      G__56649.cljs$lang$maxFixedArity = 0;
      G__56649.cljs$lang$applyTo = function(arglist__56650) {
        var args = cljs.core.seq(arglist__56650);
        return G__56649__delegate(args);
      };
      G__56649.cljs$core$IFn$_invoke$arity$variadic = G__56649__delegate;
      return G__56649;
    }();
  };
  var partial__3 = function(f, arg1, arg2) {
    return function() {
      var G__56651__delegate = function(args) {
        return cljs.core.apply.call(null, f, arg1, arg2, args);
      };
      var G__56651 = function(var_args) {
        var args = null;
        if (arguments.length > 0) {
          args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0);
        }
        return G__56651__delegate.call(this, args);
      };
      G__56651.cljs$lang$maxFixedArity = 0;
      G__56651.cljs$lang$applyTo = function(arglist__56652) {
        var args = cljs.core.seq(arglist__56652);
        return G__56651__delegate(args);
      };
      G__56651.cljs$core$IFn$_invoke$arity$variadic = G__56651__delegate;
      return G__56651;
    }();
  };
  var partial__4 = function(f, arg1, arg2, arg3) {
    return function() {
      var G__56653__delegate = function(args) {
        return cljs.core.apply.call(null, f, arg1, arg2, arg3, args);
      };
      var G__56653 = function(var_args) {
        var args = null;
        if (arguments.length > 0) {
          args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0);
        }
        return G__56653__delegate.call(this, args);
      };
      G__56653.cljs$lang$maxFixedArity = 0;
      G__56653.cljs$lang$applyTo = function(arglist__56654) {
        var args = cljs.core.seq(arglist__56654);
        return G__56653__delegate(args);
      };
      G__56653.cljs$core$IFn$_invoke$arity$variadic = G__56653__delegate;
      return G__56653;
    }();
  };
  var partial__5 = function() {
    var G__56655__delegate = function(f, arg1, arg2, arg3, more) {
      return function() {
        var G__56656__delegate = function(args) {
          return cljs.core.apply.call(null, f, arg1, arg2, arg3, cljs.core.concat.call(null, more, args));
        };
        var G__56656 = function(var_args) {
          var args = null;
          if (arguments.length > 0) {
            args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0);
          }
          return G__56656__delegate.call(this, args);
        };
        G__56656.cljs$lang$maxFixedArity = 0;
        G__56656.cljs$lang$applyTo = function(arglist__56657) {
          var args = cljs.core.seq(arglist__56657);
          return G__56656__delegate(args);
        };
        G__56656.cljs$core$IFn$_invoke$arity$variadic = G__56656__delegate;
        return G__56656;
      }();
    };
    var G__56655 = function(f, arg1, arg2, arg3, var_args) {
      var more = null;
      if (arguments.length > 4) {
        more = cljs.core.array_seq(Array.prototype.slice.call(arguments, 4), 0);
      }
      return G__56655__delegate.call(this, f, arg1, arg2, arg3, more);
    };
    G__56655.cljs$lang$maxFixedArity = 4;
    G__56655.cljs$lang$applyTo = function(arglist__56658) {
      var f = cljs.core.first(arglist__56658);
      arglist__56658 = cljs.core.next(arglist__56658);
      var arg1 = cljs.core.first(arglist__56658);
      arglist__56658 = cljs.core.next(arglist__56658);
      var arg2 = cljs.core.first(arglist__56658);
      arglist__56658 = cljs.core.next(arglist__56658);
      var arg3 = cljs.core.first(arglist__56658);
      var more = cljs.core.rest(arglist__56658);
      return G__56655__delegate(f, arg1, arg2, arg3, more);
    };
    G__56655.cljs$core$IFn$_invoke$arity$variadic = G__56655__delegate;
    return G__56655;
  }();
  partial = function(f, arg1, arg2, arg3, var_args) {
    var more = var_args;
    switch(arguments.length) {
      case 1:
        return partial__1.call(this, f);
      case 2:
        return partial__2.call(this, f, arg1);
      case 3:
        return partial__3.call(this, f, arg1, arg2);
      case 4:
        return partial__4.call(this, f, arg1, arg2, arg3);
      default:
        return partial__5.cljs$core$IFn$_invoke$arity$variadic(f, arg1, arg2, arg3, cljs.core.array_seq(arguments, 4));
    }
    throw new Error("Invalid arity: " + arguments.length);
  };
  partial.cljs$lang$maxFixedArity = 4;
  partial.cljs$lang$applyTo = partial__5.cljs$lang$applyTo;
  partial.cljs$core$IFn$_invoke$arity$1 = partial__1;
  partial.cljs$core$IFn$_invoke$arity$2 = partial__2;
  partial.cljs$core$IFn$_invoke$arity$3 = partial__3;
  partial.cljs$core$IFn$_invoke$arity$4 = partial__4;
  partial.cljs$core$IFn$_invoke$arity$variadic = partial__5.cljs$core$IFn$_invoke$arity$variadic;
  return partial;
}();
cljs.core.fnil = function() {
  var fnil = null;
  var fnil__2 = function(f, x) {
    return function() {
      var G__56659 = null;
      var G__56659__1 = function(a) {
        return f.call(null, a == null ? x : a);
      };
      var G__56659__2 = function(a, b) {
        return f.call(null, a == null ? x : a, b);
      };
      var G__56659__3 = function(a, b, c) {
        return f.call(null, a == null ? x : a, b, c);
      };
      var G__56659__4 = function() {
        var G__56660__delegate = function(a, b, c, ds) {
          return cljs.core.apply.call(null, f, a == null ? x : a, b, c, ds);
        };
        var G__56660 = function(a, b, c, var_args) {
          var ds = null;
          if (arguments.length > 3) {
            ds = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0);
          }
          return G__56660__delegate.call(this, a, b, c, ds);
        };
        G__56660.cljs$lang$maxFixedArity = 3;
        G__56660.cljs$lang$applyTo = function(arglist__56661) {
          var a = cljs.core.first(arglist__56661);
          arglist__56661 = cljs.core.next(arglist__56661);
          var b = cljs.core.first(arglist__56661);
          arglist__56661 = cljs.core.next(arglist__56661);
          var c = cljs.core.first(arglist__56661);
          var ds = cljs.core.rest(arglist__56661);
          return G__56660__delegate(a, b, c, ds);
        };
        G__56660.cljs$core$IFn$_invoke$arity$variadic = G__56660__delegate;
        return G__56660;
      }();
      G__56659 = function(a, b, c, var_args) {
        var ds = var_args;
        switch(arguments.length) {
          case 1:
            return G__56659__1.call(this, a);
          case 2:
            return G__56659__2.call(this, a, b);
          case 3:
            return G__56659__3.call(this, a, b, c);
          default:
            return G__56659__4.cljs$core$IFn$_invoke$arity$variadic(a, b, c, cljs.core.array_seq(arguments, 3));
        }
        throw new Error("Invalid arity: " + arguments.length);
      };
      G__56659.cljs$lang$maxFixedArity = 3;
      G__56659.cljs$lang$applyTo = G__56659__4.cljs$lang$applyTo;
      G__56659.cljs$core$IFn$_invoke$arity$1 = G__56659__1;
      G__56659.cljs$core$IFn$_invoke$arity$2 = G__56659__2;
      G__56659.cljs$core$IFn$_invoke$arity$3 = G__56659__3;
      G__56659.cljs$core$IFn$_invoke$arity$variadic = G__56659__4.cljs$core$IFn$_invoke$arity$variadic;
      return G__56659;
    }();
  };
  var fnil__3 = function(f, x, y) {
    return function() {
      var G__56662 = null;
      var G__56662__2 = function(a, b) {
        return f.call(null, a == null ? x : a, b == null ? y : b);
      };
      var G__56662__3 = function(a, b, c) {
        return f.call(null, a == null ? x : a, b == null ? y : b, c);
      };
      var G__56662__4 = function() {
        var G__56663__delegate = function(a, b, c, ds) {
          return cljs.core.apply.call(null, f, a == null ? x : a, b == null ? y : b, c, ds);
        };
        var G__56663 = function(a, b, c, var_args) {
          var ds = null;
          if (arguments.length > 3) {
            ds = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0);
          }
          return G__56663__delegate.call(this, a, b, c, ds);
        };
        G__56663.cljs$lang$maxFixedArity = 3;
        G__56663.cljs$lang$applyTo = function(arglist__56664) {
          var a = cljs.core.first(arglist__56664);
          arglist__56664 = cljs.core.next(arglist__56664);
          var b = cljs.core.first(arglist__56664);
          arglist__56664 = cljs.core.next(arglist__56664);
          var c = cljs.core.first(arglist__56664);
          var ds = cljs.core.rest(arglist__56664);
          return G__56663__delegate(a, b, c, ds);
        };
        G__56663.cljs$core$IFn$_invoke$arity$variadic = G__56663__delegate;
        return G__56663;
      }();
      G__56662 = function(a, b, c, var_args) {
        var ds = var_args;
        switch(arguments.length) {
          case 2:
            return G__56662__2.call(this, a, b);
          case 3:
            return G__56662__3.call(this, a, b, c);
          default:
            return G__56662__4.cljs$core$IFn$_invoke$arity$variadic(a, b, c, cljs.core.array_seq(arguments, 3));
        }
        throw new Error("Invalid arity: " + arguments.length);
      };
      G__56662.cljs$lang$maxFixedArity = 3;
      G__56662.cljs$lang$applyTo = G__56662__4.cljs$lang$applyTo;
      G__56662.cljs$core$IFn$_invoke$arity$2 = G__56662__2;
      G__56662.cljs$core$IFn$_invoke$arity$3 = G__56662__3;
      G__56662.cljs$core$IFn$_invoke$arity$variadic = G__56662__4.cljs$core$IFn$_invoke$arity$variadic;
      return G__56662;
    }();
  };
  var fnil__4 = function(f, x, y, z) {
    return function() {
      var G__56665 = null;
      var G__56665__2 = function(a, b) {
        return f.call(null, a == null ? x : a, b == null ? y : b);
      };
      var G__56665__3 = function(a, b, c) {
        return f.call(null, a == null ? x : a, b == null ? y : b, c == null ? z : c);
      };
      var G__56665__4 = function() {
        var G__56666__delegate = function(a, b, c, ds) {
          return cljs.core.apply.call(null, f, a == null ? x : a, b == null ? y : b, c == null ? z : c, ds);
        };
        var G__56666 = function(a, b, c, var_args) {
          var ds = null;
          if (arguments.length > 3) {
            ds = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0);
          }
          return G__56666__delegate.call(this, a, b, c, ds);
        };
        G__56666.cljs$lang$maxFixedArity = 3;
        G__56666.cljs$lang$applyTo = function(arglist__56667) {
          var a = cljs.core.first(arglist__56667);
          arglist__56667 = cljs.core.next(arglist__56667);
          var b = cljs.core.first(arglist__56667);
          arglist__56667 = cljs.core.next(arglist__56667);
          var c = cljs.core.first(arglist__56667);
          var ds = cljs.core.rest(arglist__56667);
          return G__56666__delegate(a, b, c, ds);
        };
        G__56666.cljs$core$IFn$_invoke$arity$variadic = G__56666__delegate;
        return G__56666;
      }();
      G__56665 = function(a, b, c, var_args) {
        var ds = var_args;
        switch(arguments.length) {
          case 2:
            return G__56665__2.call(this, a, b);
          case 3:
            return G__56665__3.call(this, a, b, c);
          default:
            return G__56665__4.cljs$core$IFn$_invoke$arity$variadic(a, b, c, cljs.core.array_seq(arguments, 3));
        }
        throw new Error("Invalid arity: " + arguments.length);
      };
      G__56665.cljs$lang$maxFixedArity = 3;
      G__56665.cljs$lang$applyTo = G__56665__4.cljs$lang$applyTo;
      G__56665.cljs$core$IFn$_invoke$arity$2 = G__56665__2;
      G__56665.cljs$core$IFn$_invoke$arity$3 = G__56665__3;
      G__56665.cljs$core$IFn$_invoke$arity$variadic = G__56665__4.cljs$core$IFn$_invoke$arity$variadic;
      return G__56665;
    }();
  };
  fnil = function(f, x, y, z) {
    switch(arguments.length) {
      case 2:
        return fnil__2.call(this, f, x);
      case 3:
        return fnil__3.call(this, f, x, y);
      case 4:
        return fnil__4.call(this, f, x, y, z);
    }
    throw new Error("Invalid arity: " + arguments.length);
  };
  fnil.cljs$core$IFn$_invoke$arity$2 = fnil__2;
  fnil.cljs$core$IFn$_invoke$arity$3 = fnil__3;
  fnil.cljs$core$IFn$_invoke$arity$4 = fnil__4;
  return fnil;
}();
cljs.core.map_indexed = function map_indexed(f, coll) {
  var mapi = function mapi(idx, coll__$1) {
    return new cljs.core.LazySeq(null, function() {
      var temp__4126__auto__ = cljs.core.seq.call(null, coll__$1);
      if (temp__4126__auto__) {
        var s = temp__4126__auto__;
        if (cljs.core.chunked_seq_QMARK_.call(null, s)) {
          var c = cljs.core.chunk_first.call(null, s);
          var size = cljs.core.count.call(null, c);
          var b = cljs.core.chunk_buffer.call(null, size);
          var n__4508__auto___56668 = size;
          var i_56669 = 0;
          while (true) {
            if (i_56669 < n__4508__auto___56668) {
              cljs.core.chunk_append.call(null, b, f.call(null, idx + i_56669, cljs.core._nth.call(null, c, i_56669)));
              var G__56670 = i_56669 + 1;
              i_56669 = G__56670;
              continue;
            } else {
            }
            break;
          }
          return cljs.core.chunk_cons.call(null, cljs.core.chunk.call(null, b), mapi.call(null, idx + size, cljs.core.chunk_rest.call(null, s)));
        } else {
          return cljs.core.cons.call(null, f.call(null, idx, cljs.core.first.call(null, s)), mapi.call(null, idx + 1, cljs.core.rest.call(null, s)));
        }
      } else {
        return null;
      }
    }, null, null);
  };
  return mapi.call(null, 0, coll);
};
cljs.core.keep = function() {
  var keep = null;
  var keep__1 = function(f) {
    return function(f1) {
      return function() {
        var G__56671 = null;
        var G__56671__0 = function() {
          return f1.call(null);
        };
        var G__56671__1 = function(result) {
          return f1.call(null, result);
        };
        var G__56671__2 = function(result, input) {
          var v = f.call(null, input);
          if (v == null) {
            return result;
          } else {
            return f1.call(null, result, v);
          }
        };
        G__56671 = function(result, input) {
          switch(arguments.length) {
            case 0:
              return G__56671__0.call(this);
            case 1:
              return G__56671__1.call(this, result);
            case 2:
              return G__56671__2.call(this, result, input);
          }
          throw new Error("Invalid arity: " + arguments.length);
        };
        G__56671.cljs$core$IFn$_invoke$arity$0 = G__56671__0;
        G__56671.cljs$core$IFn$_invoke$arity$1 = G__56671__1;
        G__56671.cljs$core$IFn$_invoke$arity$2 = G__56671__2;
        return G__56671;
      }();
    };
  };
  var keep__2 = function(f, coll) {
    return new cljs.core.LazySeq(null, function() {
      var temp__4126__auto__ = cljs.core.seq.call(null, coll);
      if (temp__4126__auto__) {
        var s = temp__4126__auto__;
        if (cljs.core.chunked_seq_QMARK_.call(null, s)) {
          var c = cljs.core.chunk_first.call(null, s);
          var size = cljs.core.count.call(null, c);
          var b = cljs.core.chunk_buffer.call(null, size);
          var n__4508__auto___56672 = size;
          var i_56673 = 0;
          while (true) {
            if (i_56673 < n__4508__auto___56672) {
              var x_56674 = f.call(null, cljs.core._nth.call(null, c, i_56673));
              if (x_56674 == null) {
              } else {
                cljs.core.chunk_append.call(null, b, x_56674);
              }
              var G__56675 = i_56673 + 1;
              i_56673 = G__56675;
              continue;
            } else {
            }
            break;
          }
          return cljs.core.chunk_cons.call(null, cljs.core.chunk.call(null, b), keep.call(null, f, cljs.core.chunk_rest.call(null, s)));
        } else {
          var x = f.call(null, cljs.core.first.call(null, s));
          if (x == null) {
            return keep.call(null, f, cljs.core.rest.call(null, s));
          } else {
            return cljs.core.cons.call(null, x, keep.call(null, f, cljs.core.rest.call(null, s)));
          }
        }
      } else {
        return null;
      }
    }, null, null);
  };
  keep = function(f, coll) {
    switch(arguments.length) {
      case 1:
        return keep__1.call(this, f);
      case 2:
        return keep__2.call(this, f, coll);
    }
    throw new Error("Invalid arity: " + arguments.length);
  };
  keep.cljs$core$IFn$_invoke$arity$1 = keep__1;
  keep.cljs$core$IFn$_invoke$arity$2 = keep__2;
  return keep;
}();
cljs.core.Atom = function(state, meta, validator, watches) {
  this.state = state;
  this.meta = meta;
  this.validator = validator;
  this.watches = watches;
  this.cljs$lang$protocol_mask$partition0$ = 6455296;
  this.cljs$lang$protocol_mask$partition1$ = 16386;
};
cljs.core.Atom.cljs$lang$type = true;
cljs.core.Atom.cljs$lang$ctorStr = "cljs.core/Atom";
cljs.core.Atom.cljs$lang$ctorPrWriter = function(this__4215__auto__, writer__4216__auto__, opt__4217__auto__) {
  return cljs.core._write.call(null, writer__4216__auto__, "cljs.core/Atom");
};
cljs.core.Atom.prototype.cljs$core$IHash$_hash$arity$1 = function(this$) {
  var self__ = this;
  var this$__$1 = this;
  return goog.getUid(this$__$1);
};
cljs.core.Atom.prototype.cljs$core$IWatchable$_notify_watches$arity$3 = function(this$, oldval, newval) {
  var self__ = this;
  var this$__$1 = this;
  var seq__56676 = cljs.core.seq.call(null, self__.watches);
  var chunk__56677 = null;
  var count__56678 = 0;
  var i__56679 = 0;
  while (true) {
    if (i__56679 < count__56678) {
      var vec__56680 = cljs.core._nth.call(null, chunk__56677, i__56679);
      var key = cljs.core.nth.call(null, vec__56680, 0, null);
      var f = cljs.core.nth.call(null, vec__56680, 1, null);
      f.call(null, key, this$__$1, oldval, newval);
      var G__56682 = seq__56676;
      var G__56683 = chunk__56677;
      var G__56684 = count__56678;
      var G__56685 = i__56679 + 1;
      seq__56676 = G__56682;
      chunk__56677 = G__56683;
      count__56678 = G__56684;
      i__56679 = G__56685;
      continue;
    } else {
      var temp__4126__auto__ = cljs.core.seq.call(null, seq__56676);
      if (temp__4126__auto__) {
        var seq__56676__$1 = temp__4126__auto__;
        if (cljs.core.chunked_seq_QMARK_.call(null, seq__56676__$1)) {
          var c__4408__auto__ = cljs.core.chunk_first.call(null, seq__56676__$1);
          var G__56686 = cljs.core.chunk_rest.call(null, seq__56676__$1);
          var G__56687 = c__4408__auto__;
          var G__56688 = cljs.core.count.call(null, c__4408__auto__);
          var G__56689 = 0;
          seq__56676 = G__56686;
          chunk__56677 = G__56687;
          count__56678 = G__56688;
          i__56679 = G__56689;
          continue;
        } else {
          var vec__56681 = cljs.core.first.call(null, seq__56676__$1);
          var key = cljs.core.nth.call(null, vec__56681, 0, null);
          var f = cljs.core.nth.call(null, vec__56681, 1, null);
          f.call(null, key, this$__$1, oldval, newval);
          var G__56690 = cljs.core.next.call(null, seq__56676__$1);
          var G__56691 = null;
          var G__56692 = 0;
          var G__56693 = 0;
          seq__56676 = G__56690;
          chunk__56677 = G__56691;
          count__56678 = G__56692;
          i__56679 = G__56693;
          continue;
        }
      } else {
        return null;
      }
    }
    break;
  }
};
cljs.core.Atom.prototype.cljs$core$IWatchable$_add_watch$arity$3 = function(this$, key, f) {
  var self__ = this;
  var this$__$1 = this;
  this$__$1.watches = cljs.core.assoc.call(null, self__.watches, key, f);
  return this$__$1;
};
cljs.core.Atom.prototype.cljs$core$IWatchable$_remove_watch$arity$2 = function(this$, key) {
  var self__ = this;
  var this$__$1 = this;
  return this$__$1.watches = cljs.core.dissoc.call(null, self__.watches, key);
};
cljs.core.Atom.prototype.cljs$core$IMeta$_meta$arity$1 = function(_) {
  var self__ = this;
  var ___$1 = this;
  return self__.meta;
};
cljs.core.Atom.prototype.cljs$core$IDeref$_deref$arity$1 = function(_) {
  var self__ = this;
  var ___$1 = this;
  return self__.state;
};
cljs.core.Atom.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(o, other) {
  var self__ = this;
  var o__$1 = this;
  return o__$1 === other;
};
cljs.core.Atom.prototype.equiv = function(other) {
  var self__ = this;
  var this$ = this;
  return this$.cljs$core$IEquiv$_equiv$arity$2(null, other);
};
cljs.core.__GT_Atom = function __GT_Atom(state, meta, validator, watches) {
  return new cljs.core.Atom(state, meta, validator, watches);
};
cljs.core.atom = function() {
  var atom = null;
  var atom__1 = function(x) {
    return new cljs.core.Atom(x, null, null, null);
  };
  var atom__2 = function() {
    var G__56697__delegate = function(x, p__56694) {
      var map__56696 = p__56694;
      var map__56696__$1 = cljs.core.seq_QMARK_.call(null, map__56696) ? cljs.core.apply.call(null, cljs.core.hash_map, map__56696) : map__56696;
      var validator = cljs.core.get.call(null, map__56696__$1, new cljs.core.Keyword(null, "validator", "validator", -1966190681));
      var meta = cljs.core.get.call(null, map__56696__$1, new cljs.core.Keyword(null, "meta", "meta", 1499536964));
      return new cljs.core.Atom(x, meta, validator, null);
    };
    var G__56697 = function(x, var_args) {
      var p__56694 = null;
      if (arguments.length > 1) {
        p__56694 = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0);
      }
      return G__56697__delegate.call(this, x, p__56694);
    };
    G__56697.cljs$lang$maxFixedArity = 1;
    G__56697.cljs$lang$applyTo = function(arglist__56698) {
      var x = cljs.core.first(arglist__56698);
      var p__56694 = cljs.core.rest(arglist__56698);
      return G__56697__delegate(x, p__56694);
    };
    G__56697.cljs$core$IFn$_invoke$arity$variadic = G__56697__delegate;
    return G__56697;
  }();
  atom = function(x, var_args) {
    var p__56694 = var_args;
    switch(arguments.length) {
      case 1:
        return atom__1.call(this, x);
      default:
        return atom__2.cljs$core$IFn$_invoke$arity$variadic(x, cljs.core.array_seq(arguments, 1));
    }
    throw new Error("Invalid arity: " + arguments.length);
  };
  atom.cljs$lang$maxFixedArity = 1;
  atom.cljs$lang$applyTo = atom__2.cljs$lang$applyTo;
  atom.cljs$core$IFn$_invoke$arity$1 = atom__1;
  atom.cljs$core$IFn$_invoke$arity$variadic = atom__2.cljs$core$IFn$_invoke$arity$variadic;
  return atom;
}();
cljs.core.reset_BANG_ = function reset_BANG_(a, new_value) {
  if (a instanceof cljs.core.Atom) {
    var validate = a.validator;
    if (validate == null) {
    } else {
      if (cljs.core.truth_(validate.call(null, new_value))) {
      } else {
        throw new Error("Assert failed: Validator rejected reference state\n" + cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs.core.pr_str.call(null, cljs.core.list(new cljs.core.Symbol(null, "validate", "validate", 1439230700, null), new cljs.core.Symbol(null, "new-value", "new-value", -1567397401, null)))));
      }
    }
    var old_value = a.state;
    a.state = new_value;
    if (a.watches == null) {
    } else {
      cljs.core._notify_watches.call(null, a, old_value, new_value);
    }
    return new_value;
  } else {
    return cljs.core._reset_BANG_.call(null, a, new_value);
  }
};
cljs.core.swap_BANG_ = function() {
  var swap_BANG_ = null;
  var swap_BANG___2 = function(a, f) {
    if (a instanceof cljs.core.Atom) {
      return cljs.core.reset_BANG_.call(null, a, f.call(null, a.state));
    } else {
      return cljs.core._swap_BANG_.call(null, a, f);
    }
  };
  var swap_BANG___3 = function(a, f, x) {
    if (a instanceof cljs.core.Atom) {
      return cljs.core.reset_BANG_.call(null, a, f.call(null, a.state, x));
    } else {
      return cljs.core._swap_BANG_.call(null, a, f, x);
    }
  };
  var swap_BANG___4 = function(a, f, x, y) {
    if (a instanceof cljs.core.Atom) {
      return cljs.core.reset_BANG_.call(null, a, f.call(null, a.state, x, y));
    } else {
      return cljs.core._swap_BANG_.call(null, a, f, x, y);
    }
  };
  var swap_BANG___5 = function() {
    var G__56699__delegate = function(a, f, x, y, more) {
      if (a instanceof cljs.core.Atom) {
        return cljs.core.reset_BANG_.call(null, a, cljs.core.apply.call(null, f, a.state, x, y, more));
      } else {
        return cljs.core._swap_BANG_.call(null, a, f, x, y, more);
      }
    };
    var G__56699 = function(a, f, x, y, var_args) {
      var more = null;
      if (arguments.length > 4) {
        more = cljs.core.array_seq(Array.prototype.slice.call(arguments, 4), 0);
      }
      return G__56699__delegate.call(this, a, f, x, y, more);
    };
    G__56699.cljs$lang$maxFixedArity = 4;
    G__56699.cljs$lang$applyTo = function(arglist__56700) {
      var a = cljs.core.first(arglist__56700);
      arglist__56700 = cljs.core.next(arglist__56700);
      var f = cljs.core.first(arglist__56700);
      arglist__56700 = cljs.core.next(arglist__56700);
      var x = cljs.core.first(arglist__56700);
      arglist__56700 = cljs.core.next(arglist__56700);
      var y = cljs.core.first(arglist__56700);
      var more = cljs.core.rest(arglist__56700);
      return G__56699__delegate(a, f, x, y, more);
    };
    G__56699.cljs$core$IFn$_invoke$arity$variadic = G__56699__delegate;
    return G__56699;
  }();
  swap_BANG_ = function(a, f, x, y, var_args) {
    var more = var_args;
    switch(arguments.length) {
      case 2:
        return swap_BANG___2.call(this, a, f);
      case 3:
        return swap_BANG___3.call(this, a, f, x);
      case 4:
        return swap_BANG___4.call(this, a, f, x, y);
      default:
        return swap_BANG___5.cljs$core$IFn$_invoke$arity$variadic(a, f, x, y, cljs.core.array_seq(arguments, 4));
    }
    throw new Error("Invalid arity: " + arguments.length);
  };
  swap_BANG_.cljs$lang$maxFixedArity = 4;
  swap_BANG_.cljs$lang$applyTo = swap_BANG___5.cljs$lang$applyTo;
  swap_BANG_.cljs$core$IFn$_invoke$arity$2 = swap_BANG___2;
  swap_BANG_.cljs$core$IFn$_invoke$arity$3 = swap_BANG___3;
  swap_BANG_.cljs$core$IFn$_invoke$arity$4 = swap_BANG___4;
  swap_BANG_.cljs$core$IFn$_invoke$arity$variadic = swap_BANG___5.cljs$core$IFn$_invoke$arity$variadic;
  return swap_BANG_;
}();
cljs.core.compare_and_set_BANG_ = function compare_and_set_BANG_(a, oldval, newval) {
  if (cljs.core._EQ_.call(null, a.state, oldval)) {
    cljs.core.reset_BANG_.call(null, a, newval);
    return true;
  } else {
    return false;
  }
};
cljs.core.set_validator_BANG_ = function set_validator_BANG_(iref, val) {
  return iref.validator = val;
};
cljs.core.get_validator = function get_validator(iref) {
  return iref.validator;
};
cljs.core.keep_indexed = function() {
  var keep_indexed = null;
  var keep_indexed__1 = function(f) {
    return function(f1) {
      var ia = cljs.core.atom.call(null, -1);
      return function(ia) {
        return function() {
          var G__56701 = null;
          var G__56701__0 = function() {
            return f1.call(null);
          };
          var G__56701__1 = function(result) {
            return f1.call(null, result);
          };
          var G__56701__2 = function(result, input) {
            var i = cljs.core.swap_BANG_.call(null, ia, cljs.core.inc);
            var v = f.call(null, i, input);
            if (v == null) {
              return result;
            } else {
              return f1.call(null, result, v);
            }
          };
          G__56701 = function(result, input) {
            switch(arguments.length) {
              case 0:
                return G__56701__0.call(this);
              case 1:
                return G__56701__1.call(this, result);
              case 2:
                return G__56701__2.call(this, result, input);
            }
            throw new Error("Invalid arity: " + arguments.length);
          };
          G__56701.cljs$core$IFn$_invoke$arity$0 = G__56701__0;
          G__56701.cljs$core$IFn$_invoke$arity$1 = G__56701__1;
          G__56701.cljs$core$IFn$_invoke$arity$2 = G__56701__2;
          return G__56701;
        }();
      }(ia);
    };
  };
  var keep_indexed__2 = function(f, coll) {
    var keepi = function keepi(idx, coll__$1) {
      return new cljs.core.LazySeq(null, function() {
        var temp__4126__auto__ = cljs.core.seq.call(null, coll__$1);
        if (temp__4126__auto__) {
          var s = temp__4126__auto__;
          if (cljs.core.chunked_seq_QMARK_.call(null, s)) {
            var c = cljs.core.chunk_first.call(null, s);
            var size = cljs.core.count.call(null, c);
            var b = cljs.core.chunk_buffer.call(null, size);
            var n__4508__auto___56702 = size;
            var i_56703 = 0;
            while (true) {
              if (i_56703 < n__4508__auto___56702) {
                var x_56704 = f.call(null, idx + i_56703, cljs.core._nth.call(null, c, i_56703));
                if (x_56704 == null) {
                } else {
                  cljs.core.chunk_append.call(null, b, x_56704);
                }
                var G__56705 = i_56703 + 1;
                i_56703 = G__56705;
                continue;
              } else {
              }
              break;
            }
            return cljs.core.chunk_cons.call(null, cljs.core.chunk.call(null, b), keepi.call(null, idx + size, cljs.core.chunk_rest.call(null, s)));
          } else {
            var x = f.call(null, idx, cljs.core.first.call(null, s));
            if (x == null) {
              return keepi.call(null, idx + 1, cljs.core.rest.call(null, s));
            } else {
              return cljs.core.cons.call(null, x, keepi.call(null, idx + 1, cljs.core.rest.call(null, s)));
            }
          }
        } else {
          return null;
        }
      }, null, null);
    };
    return keepi.call(null, 0, coll);
  };
  keep_indexed = function(f, coll) {
    switch(arguments.length) {
      case 1:
        return keep_indexed__1.call(this, f);
      case 2:
        return keep_indexed__2.call(this, f, coll);
    }
    throw new Error("Invalid arity: " + arguments.length);
  };
  keep_indexed.cljs$core$IFn$_invoke$arity$1 = keep_indexed__1;
  keep_indexed.cljs$core$IFn$_invoke$arity$2 = keep_indexed__2;
  return keep_indexed;
}();
cljs.core.every_pred = function() {
  var every_pred = null;
  var every_pred__1 = function(p) {
    return function() {
      var ep1 = null;
      var ep1__0 = function() {
        return true;
      };
      var ep1__1 = function(x) {
        return cljs.core.boolean$.call(null, p.call(null, x));
      };
      var ep1__2 = function(x, y) {
        return cljs.core.boolean$.call(null, function() {
          var and__3627__auto__ = p.call(null, x);
          if (cljs.core.truth_(and__3627__auto__)) {
            return p.call(null, y);
          } else {
            return and__3627__auto__;
          }
        }());
      };
      var ep1__3 = function(x, y, z) {
        return cljs.core.boolean$.call(null, function() {
          var and__3627__auto__ = p.call(null, x);
          if (cljs.core.truth_(and__3627__auto__)) {
            var and__3627__auto____$1 = p.call(null, y);
            if (cljs.core.truth_(and__3627__auto____$1)) {
              return p.call(null, z);
            } else {
              return and__3627__auto____$1;
            }
          } else {
            return and__3627__auto__;
          }
        }());
      };
      var ep1__4 = function() {
        var G__56712__delegate = function(x, y, z, args) {
          return cljs.core.boolean$.call(null, ep1.call(null, x, y, z) && cljs.core.every_QMARK_.call(null, p, args));
        };
        var G__56712 = function(x, y, z, var_args) {
          var args = null;
          if (arguments.length > 3) {
            args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0);
          }
          return G__56712__delegate.call(this, x, y, z, args);
        };
        G__56712.cljs$lang$maxFixedArity = 3;
        G__56712.cljs$lang$applyTo = function(arglist__56713) {
          var x = cljs.core.first(arglist__56713);
          arglist__56713 = cljs.core.next(arglist__56713);
          var y = cljs.core.first(arglist__56713);
          arglist__56713 = cljs.core.next(arglist__56713);
          var z = cljs.core.first(arglist__56713);
          var args = cljs.core.rest(arglist__56713);
          return G__56712__delegate(x, y, z, args);
        };
        G__56712.cljs$core$IFn$_invoke$arity$variadic = G__56712__delegate;
        return G__56712;
      }();
      ep1 = function(x, y, z, var_args) {
        var args = var_args;
        switch(arguments.length) {
          case 0:
            return ep1__0.call(this);
          case 1:
            return ep1__1.call(this, x);
          case 2:
            return ep1__2.call(this, x, y);
          case 3:
            return ep1__3.call(this, x, y, z);
          default:
            return ep1__4.cljs$core$IFn$_invoke$arity$variadic(x, y, z, cljs.core.array_seq(arguments, 3));
        }
        throw new Error("Invalid arity: " + arguments.length);
      };
      ep1.cljs$lang$maxFixedArity = 3;
      ep1.cljs$lang$applyTo = ep1__4.cljs$lang$applyTo;
      ep1.cljs$core$IFn$_invoke$arity$0 = ep1__0;
      ep1.cljs$core$IFn$_invoke$arity$1 = ep1__1;
      ep1.cljs$core$IFn$_invoke$arity$2 = ep1__2;
      ep1.cljs$core$IFn$_invoke$arity$3 = ep1__3;
      ep1.cljs$core$IFn$_invoke$arity$variadic = ep1__4.cljs$core$IFn$_invoke$arity$variadic;
      return ep1;
    }();
  };
  var every_pred__2 = function(p1, p2) {
    return function() {
      var ep2 = null;
      var ep2__0 = function() {
        return true;
      };
      var ep2__1 = function(x) {
        return cljs.core.boolean$.call(null, function() {
          var and__3627__auto__ = p1.call(null, x);
          if (cljs.core.truth_(and__3627__auto__)) {
            return p2.call(null, x);
          } else {
            return and__3627__auto__;
          }
        }());
      };
      var ep2__2 = function(x, y) {
        return cljs.core.boolean$.call(null, function() {
          var and__3627__auto__ = p1.call(null, x);
          if (cljs.core.truth_(and__3627__auto__)) {
            var and__3627__auto____$1 = p1.call(null, y);
            if (cljs.core.truth_(and__3627__auto____$1)) {
              var and__3627__auto____$2 = p2.call(null, x);
              if (cljs.core.truth_(and__3627__auto____$2)) {
                return p2.call(null, y);
              } else {
                return and__3627__auto____$2;
              }
            } else {
              return and__3627__auto____$1;
            }
          } else {
            return and__3627__auto__;
          }
        }());
      };
      var ep2__3 = function(x, y, z) {
        return cljs.core.boolean$.call(null, function() {
          var and__3627__auto__ = p1.call(null, x);
          if (cljs.core.truth_(and__3627__auto__)) {
            var and__3627__auto____$1 = p1.call(null, y);
            if (cljs.core.truth_(and__3627__auto____$1)) {
              var and__3627__auto____$2 = p1.call(null, z);
              if (cljs.core.truth_(and__3627__auto____$2)) {
                var and__3627__auto____$3 = p2.call(null, x);
                if (cljs.core.truth_(and__3627__auto____$3)) {
                  var and__3627__auto____$4 = p2.call(null, y);
                  if (cljs.core.truth_(and__3627__auto____$4)) {
                    return p2.call(null, z);
                  } else {
                    return and__3627__auto____$4;
                  }
                } else {
                  return and__3627__auto____$3;
                }
              } else {
                return and__3627__auto____$2;
              }
            } else {
              return and__3627__auto____$1;
            }
          } else {
            return and__3627__auto__;
          }
        }());
      };
      var ep2__4 = function() {
        var G__56714__delegate = function(x, y, z, args) {
          return cljs.core.boolean$.call(null, ep2.call(null, x, y, z) && cljs.core.every_QMARK_.call(null, function(p1__56706_SHARP_) {
            var and__3627__auto__ = p1.call(null, p1__56706_SHARP_);
            if (cljs.core.truth_(and__3627__auto__)) {
              return p2.call(null, p1__56706_SHARP_);
            } else {
              return and__3627__auto__;
            }
          }, args));
        };
        var G__56714 = function(x, y, z, var_args) {
          var args = null;
          if (arguments.length > 3) {
            args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0);
          }
          return G__56714__delegate.call(this, x, y, z, args);
        };
        G__56714.cljs$lang$maxFixedArity = 3;
        G__56714.cljs$lang$applyTo = function(arglist__56715) {
          var x = cljs.core.first(arglist__56715);
          arglist__56715 = cljs.core.next(arglist__56715);
          var y = cljs.core.first(arglist__56715);
          arglist__56715 = cljs.core.next(arglist__56715);
          var z = cljs.core.first(arglist__56715);
          var args = cljs.core.rest(arglist__56715);
          return G__56714__delegate(x, y, z, args);
        };
        G__56714.cljs$core$IFn$_invoke$arity$variadic = G__56714__delegate;
        return G__56714;
      }();
      ep2 = function(x, y, z, var_args) {
        var args = var_args;
        switch(arguments.length) {
          case 0:
            return ep2__0.call(this);
          case 1:
            return ep2__1.call(this, x);
          case 2:
            return ep2__2.call(this, x, y);
          case 3:
            return ep2__3.call(this, x, y, z);
          default:
            return ep2__4.cljs$core$IFn$_invoke$arity$variadic(x, y, z, cljs.core.array_seq(arguments, 3));
        }
        throw new Error("Invalid arity: " + arguments.length);
      };
      ep2.cljs$lang$maxFixedArity = 3;
      ep2.cljs$lang$applyTo = ep2__4.cljs$lang$applyTo;
      ep2.cljs$core$IFn$_invoke$arity$0 = ep2__0;
      ep2.cljs$core$IFn$_invoke$arity$1 = ep2__1;
      ep2.cljs$core$IFn$_invoke$arity$2 = ep2__2;
      ep2.cljs$core$IFn$_invoke$arity$3 = ep2__3;
      ep2.cljs$core$IFn$_invoke$arity$variadic = ep2__4.cljs$core$IFn$_invoke$arity$variadic;
      return ep2;
    }();
  };
  var every_pred__3 = function(p1, p2, p3) {
    return function() {
      var ep3 = null;
      var ep3__0 = function() {
        return true;
      };
      var ep3__1 = function(x) {
        return cljs.core.boolean$.call(null, function() {
          var and__3627__auto__ = p1.call(null, x);
          if (cljs.core.truth_(and__3627__auto__)) {
            var and__3627__auto____$1 = p2.call(null, x);
            if (cljs.core.truth_(and__3627__auto____$1)) {
              return p3.call(null, x);
            } else {
              return and__3627__auto____$1;
            }
          } else {
            return and__3627__auto__;
          }
        }());
      };
      var ep3__2 = function(x, y) {
        return cljs.core.boolean$.call(null, function() {
          var and__3627__auto__ = p1.call(null, x);
          if (cljs.core.truth_(and__3627__auto__)) {
            var and__3627__auto____$1 = p2.call(null, x);
            if (cljs.core.truth_(and__3627__auto____$1)) {
              var and__3627__auto____$2 = p3.call(null, x);
              if (cljs.core.truth_(and__3627__auto____$2)) {
                var and__3627__auto____$3 = p1.call(null, y);
                if (cljs.core.truth_(and__3627__auto____$3)) {
                  var and__3627__auto____$4 = p2.call(null, y);
                  if (cljs.core.truth_(and__3627__auto____$4)) {
                    return p3.call(null, y);
                  } else {
                    return and__3627__auto____$4;
                  }
                } else {
                  return and__3627__auto____$3;
                }
              } else {
                return and__3627__auto____$2;
              }
            } else {
              return and__3627__auto____$1;
            }
          } else {
            return and__3627__auto__;
          }
        }());
      };
      var ep3__3 = function(x, y, z) {
        return cljs.core.boolean$.call(null, function() {
          var and__3627__auto__ = p1.call(null, x);
          if (cljs.core.truth_(and__3627__auto__)) {
            var and__3627__auto____$1 = p2.call(null, x);
            if (cljs.core.truth_(and__3627__auto____$1)) {
              var and__3627__auto____$2 = p3.call(null, x);
              if (cljs.core.truth_(and__3627__auto____$2)) {
                var and__3627__auto____$3 = p1.call(null, y);
                if (cljs.core.truth_(and__3627__auto____$3)) {
                  var and__3627__auto____$4 = p2.call(null, y);
                  if (cljs.core.truth_(and__3627__auto____$4)) {
                    var and__3627__auto____$5 = p3.call(null, y);
                    if (cljs.core.truth_(and__3627__auto____$5)) {
                      var and__3627__auto____$6 = p1.call(null, z);
                      if (cljs.core.truth_(and__3627__auto____$6)) {
                        var and__3627__auto____$7 = p2.call(null, z);
                        if (cljs.core.truth_(and__3627__auto____$7)) {
                          return p3.call(null, z);
                        } else {
                          return and__3627__auto____$7;
                        }
                      } else {
                        return and__3627__auto____$6;
                      }
                    } else {
                      return and__3627__auto____$5;
                    }
                  } else {
                    return and__3627__auto____$4;
                  }
                } else {
                  return and__3627__auto____$3;
                }
              } else {
                return and__3627__auto____$2;
              }
            } else {
              return and__3627__auto____$1;
            }
          } else {
            return and__3627__auto__;
          }
        }());
      };
      var ep3__4 = function() {
        var G__56716__delegate = function(x, y, z, args) {
          return cljs.core.boolean$.call(null, ep3.call(null, x, y, z) && cljs.core.every_QMARK_.call(null, function(p1__56707_SHARP_) {
            var and__3627__auto__ = p1.call(null, p1__56707_SHARP_);
            if (cljs.core.truth_(and__3627__auto__)) {
              var and__3627__auto____$1 = p2.call(null, p1__56707_SHARP_);
              if (cljs.core.truth_(and__3627__auto____$1)) {
                return p3.call(null, p1__56707_SHARP_);
              } else {
                return and__3627__auto____$1;
              }
            } else {
              return and__3627__auto__;
            }
          }, args));
        };
        var G__56716 = function(x, y, z, var_args) {
          var args = null;
          if (arguments.length > 3) {
            args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0);
          }
          return G__56716__delegate.call(this, x, y, z, args);
        };
        G__56716.cljs$lang$maxFixedArity = 3;
        G__56716.cljs$lang$applyTo = function(arglist__56717) {
          var x = cljs.core.first(arglist__56717);
          arglist__56717 = cljs.core.next(arglist__56717);
          var y = cljs.core.first(arglist__56717);
          arglist__56717 = cljs.core.next(arglist__56717);
          var z = cljs.core.first(arglist__56717);
          var args = cljs.core.rest(arglist__56717);
          return G__56716__delegate(x, y, z, args);
        };
        G__56716.cljs$core$IFn$_invoke$arity$variadic = G__56716__delegate;
        return G__56716;
      }();
      ep3 = function(x, y, z, var_args) {
        var args = var_args;
        switch(arguments.length) {
          case 0:
            return ep3__0.call(this);
          case 1:
            return ep3__1.call(this, x);
          case 2:
            return ep3__2.call(this, x, y);
          case 3:
            return ep3__3.call(this, x, y, z);
          default:
            return ep3__4.cljs$core$IFn$_invoke$arity$variadic(x, y, z, cljs.core.array_seq(arguments, 3));
        }
        throw new Error("Invalid arity: " + arguments.length);
      };
      ep3.cljs$lang$maxFixedArity = 3;
      ep3.cljs$lang$applyTo = ep3__4.cljs$lang$applyTo;
      ep3.cljs$core$IFn$_invoke$arity$0 = ep3__0;
      ep3.cljs$core$IFn$_invoke$arity$1 = ep3__1;
      ep3.cljs$core$IFn$_invoke$arity$2 = ep3__2;
      ep3.cljs$core$IFn$_invoke$arity$3 = ep3__3;
      ep3.cljs$core$IFn$_invoke$arity$variadic = ep3__4.cljs$core$IFn$_invoke$arity$variadic;
      return ep3;
    }();
  };
  var every_pred__4 = function() {
    var G__56718__delegate = function(p1, p2, p3, ps) {
      var ps__$1 = cljs.core.list_STAR_.call(null, p1, p2, p3, ps);
      return function(ps__$1) {
        return function() {
          var epn = null;
          var epn__0 = function() {
            return true;
          };
          var epn__1 = function(x) {
            return cljs.core.every_QMARK_.call(null, function(ps__$1) {
              return function(p1__56708_SHARP_) {
                return p1__56708_SHARP_.call(null, x);
              };
            }(ps__$1), ps__$1);
          };
          var epn__2 = function(x, y) {
            return cljs.core.every_QMARK_.call(null, function(ps__$1) {
              return function(p1__56709_SHARP_) {
                var and__3627__auto__ = p1__56709_SHARP_.call(null, x);
                if (cljs.core.truth_(and__3627__auto__)) {
                  return p1__56709_SHARP_.call(null, y);
                } else {
                  return and__3627__auto__;
                }
              };
            }(ps__$1), ps__$1);
          };
          var epn__3 = function(x, y, z) {
            return cljs.core.every_QMARK_.call(null, function(ps__$1) {
              return function(p1__56710_SHARP_) {
                var and__3627__auto__ = p1__56710_SHARP_.call(null, x);
                if (cljs.core.truth_(and__3627__auto__)) {
                  var and__3627__auto____$1 = p1__56710_SHARP_.call(null, y);
                  if (cljs.core.truth_(and__3627__auto____$1)) {
                    return p1__56710_SHARP_.call(null, z);
                  } else {
                    return and__3627__auto____$1;
                  }
                } else {
                  return and__3627__auto__;
                }
              };
            }(ps__$1), ps__$1);
          };
          var epn__4 = function() {
            var G__56719__delegate = function(x, y, z, args) {
              return cljs.core.boolean$.call(null, epn.call(null, x, y, z) && cljs.core.every_QMARK_.call(null, function(ps__$1) {
                return function(p1__56711_SHARP_) {
                  return cljs.core.every_QMARK_.call(null, p1__56711_SHARP_, args);
                };
              }(ps__$1), ps__$1));
            };
            var G__56719 = function(x, y, z, var_args) {
              var args = null;
              if (arguments.length > 3) {
                args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0);
              }
              return G__56719__delegate.call(this, x, y, z, args);
            };
            G__56719.cljs$lang$maxFixedArity = 3;
            G__56719.cljs$lang$applyTo = function(arglist__56720) {
              var x = cljs.core.first(arglist__56720);
              arglist__56720 = cljs.core.next(arglist__56720);
              var y = cljs.core.first(arglist__56720);
              arglist__56720 = cljs.core.next(arglist__56720);
              var z = cljs.core.first(arglist__56720);
              var args = cljs.core.rest(arglist__56720);
              return G__56719__delegate(x, y, z, args);
            };
            G__56719.cljs$core$IFn$_invoke$arity$variadic = G__56719__delegate;
            return G__56719;
          }();
          epn = function(x, y, z, var_args) {
            var args = var_args;
            switch(arguments.length) {
              case 0:
                return epn__0.call(this);
              case 1:
                return epn__1.call(this, x);
              case 2:
                return epn__2.call(this, x, y);
              case 3:
                return epn__3.call(this, x, y, z);
              default:
                return epn__4.cljs$core$IFn$_invoke$arity$variadic(x, y, z, cljs.core.array_seq(arguments, 3));
            }
            throw new Error("Invalid arity: " + arguments.length);
          };
          epn.cljs$lang$maxFixedArity = 3;
          epn.cljs$lang$applyTo = epn__4.cljs$lang$applyTo;
          epn.cljs$core$IFn$_invoke$arity$0 = epn__0;
          epn.cljs$core$IFn$_invoke$arity$1 = epn__1;
          epn.cljs$core$IFn$_invoke$arity$2 = epn__2;
          epn.cljs$core$IFn$_invoke$arity$3 = epn__3;
          epn.cljs$core$IFn$_invoke$arity$variadic = epn__4.cljs$core$IFn$_invoke$arity$variadic;
          return epn;
        }();
      }(ps__$1);
    };
    var G__56718 = function(p1, p2, p3, var_args) {
      var ps = null;
      if (arguments.length > 3) {
        ps = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0);
      }
      return G__56718__delegate.call(this, p1, p2, p3, ps);
    };
    G__56718.cljs$lang$maxFixedArity = 3;
    G__56718.cljs$lang$applyTo = function(arglist__56721) {
      var p1 = cljs.core.first(arglist__56721);
      arglist__56721 = cljs.core.next(arglist__56721);
      var p2 = cljs.core.first(arglist__56721);
      arglist__56721 = cljs.core.next(arglist__56721);
      var p3 = cljs.core.first(arglist__56721);
      var ps = cljs.core.rest(arglist__56721);
      return G__56718__delegate(p1, p2, p3, ps);
    };
    G__56718.cljs$core$IFn$_invoke$arity$variadic = G__56718__delegate;
    return G__56718;
  }();
  every_pred = function(p1, p2, p3, var_args) {
    var ps = var_args;
    switch(arguments.length) {
      case 1:
        return every_pred__1.call(this, p1);
      case 2:
        return every_pred__2.call(this, p1, p2);
      case 3:
        return every_pred__3.call(this, p1, p2, p3);
      default:
        return every_pred__4.cljs$core$IFn$_invoke$arity$variadic(p1, p2, p3, cljs.core.array_seq(arguments, 3));
    }
    throw new Error("Invalid arity: " + arguments.length);
  };
  every_pred.cljs$lang$maxFixedArity = 3;
  every_pred.cljs$lang$applyTo = every_pred__4.cljs$lang$applyTo;
  every_pred.cljs$core$IFn$_invoke$arity$1 = every_pred__1;
  every_pred.cljs$core$IFn$_invoke$arity$2 = every_pred__2;
  every_pred.cljs$core$IFn$_invoke$arity$3 = every_pred__3;
  every_pred.cljs$core$IFn$_invoke$arity$variadic = every_pred__4.cljs$core$IFn$_invoke$arity$variadic;
  return every_pred;
}();
cljs.core.some_fn = function() {
  var some_fn = null;
  var some_fn__1 = function(p) {
    return function() {
      var sp1 = null;
      var sp1__0 = function() {
        return null;
      };
      var sp1__1 = function(x) {
        return p.call(null, x);
      };
      var sp1__2 = function(x, y) {
        var or__3639__auto__ = p.call(null, x);
        if (cljs.core.truth_(or__3639__auto__)) {
          return or__3639__auto__;
        } else {
          return p.call(null, y);
        }
      };
      var sp1__3 = function(x, y, z) {
        var or__3639__auto__ = p.call(null, x);
        if (cljs.core.truth_(or__3639__auto__)) {
          return or__3639__auto__;
        } else {
          var or__3639__auto____$1 = p.call(null, y);
          if (cljs.core.truth_(or__3639__auto____$1)) {
            return or__3639__auto____$1;
          } else {
            return p.call(null, z);
          }
        }
      };
      var sp1__4 = function() {
        var G__56728__delegate = function(x, y, z, args) {
          var or__3639__auto__ = sp1.call(null, x, y, z);
          if (cljs.core.truth_(or__3639__auto__)) {
            return or__3639__auto__;
          } else {
            return cljs.core.some.call(null, p, args);
          }
        };
        var G__56728 = function(x, y, z, var_args) {
          var args = null;
          if (arguments.length > 3) {
            args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0);
          }
          return G__56728__delegate.call(this, x, y, z, args);
        };
        G__56728.cljs$lang$maxFixedArity = 3;
        G__56728.cljs$lang$applyTo = function(arglist__56729) {
          var x = cljs.core.first(arglist__56729);
          arglist__56729 = cljs.core.next(arglist__56729);
          var y = cljs.core.first(arglist__56729);
          arglist__56729 = cljs.core.next(arglist__56729);
          var z = cljs.core.first(arglist__56729);
          var args = cljs.core.rest(arglist__56729);
          return G__56728__delegate(x, y, z, args);
        };
        G__56728.cljs$core$IFn$_invoke$arity$variadic = G__56728__delegate;
        return G__56728;
      }();
      sp1 = function(x, y, z, var_args) {
        var args = var_args;
        switch(arguments.length) {
          case 0:
            return sp1__0.call(this);
          case 1:
            return sp1__1.call(this, x);
          case 2:
            return sp1__2.call(this, x, y);
          case 3:
            return sp1__3.call(this, x, y, z);
          default:
            return sp1__4.cljs$core$IFn$_invoke$arity$variadic(x, y, z, cljs.core.array_seq(arguments, 3));
        }
        throw new Error("Invalid arity: " + arguments.length);
      };
      sp1.cljs$lang$maxFixedArity = 3;
      sp1.cljs$lang$applyTo = sp1__4.cljs$lang$applyTo;
      sp1.cljs$core$IFn$_invoke$arity$0 = sp1__0;
      sp1.cljs$core$IFn$_invoke$arity$1 = sp1__1;
      sp1.cljs$core$IFn$_invoke$arity$2 = sp1__2;
      sp1.cljs$core$IFn$_invoke$arity$3 = sp1__3;
      sp1.cljs$core$IFn$_invoke$arity$variadic = sp1__4.cljs$core$IFn$_invoke$arity$variadic;
      return sp1;
    }();
  };
  var some_fn__2 = function(p1, p2) {
    return function() {
      var sp2 = null;
      var sp2__0 = function() {
        return null;
      };
      var sp2__1 = function(x) {
        var or__3639__auto__ = p1.call(null, x);
        if (cljs.core.truth_(or__3639__auto__)) {
          return or__3639__auto__;
        } else {
          return p2.call(null, x);
        }
      };
      var sp2__2 = function(x, y) {
        var or__3639__auto__ = p1.call(null, x);
        if (cljs.core.truth_(or__3639__auto__)) {
          return or__3639__auto__;
        } else {
          var or__3639__auto____$1 = p1.call(null, y);
          if (cljs.core.truth_(or__3639__auto____$1)) {
            return or__3639__auto____$1;
          } else {
            var or__3639__auto____$2 = p2.call(null, x);
            if (cljs.core.truth_(or__3639__auto____$2)) {
              return or__3639__auto____$2;
            } else {
              return p2.call(null, y);
            }
          }
        }
      };
      var sp2__3 = function(x, y, z) {
        var or__3639__auto__ = p1.call(null, x);
        if (cljs.core.truth_(or__3639__auto__)) {
          return or__3639__auto__;
        } else {
          var or__3639__auto____$1 = p1.call(null, y);
          if (cljs.core.truth_(or__3639__auto____$1)) {
            return or__3639__auto____$1;
          } else {
            var or__3639__auto____$2 = p1.call(null, z);
            if (cljs.core.truth_(or__3639__auto____$2)) {
              return or__3639__auto____$2;
            } else {
              var or__3639__auto____$3 = p2.call(null, x);
              if (cljs.core.truth_(or__3639__auto____$3)) {
                return or__3639__auto____$3;
              } else {
                var or__3639__auto____$4 = p2.call(null, y);
                if (cljs.core.truth_(or__3639__auto____$4)) {
                  return or__3639__auto____$4;
                } else {
                  return p2.call(null, z);
                }
              }
            }
          }
        }
      };
      var sp2__4 = function() {
        var G__56730__delegate = function(x, y, z, args) {
          var or__3639__auto__ = sp2.call(null, x, y, z);
          if (cljs.core.truth_(or__3639__auto__)) {
            return or__3639__auto__;
          } else {
            return cljs.core.some.call(null, function(or__3639__auto__) {
              return function(p1__56722_SHARP_) {
                var or__3639__auto____$1 = p1.call(null, p1__56722_SHARP_);
                if (cljs.core.truth_(or__3639__auto____$1)) {
                  return or__3639__auto____$1;
                } else {
                  return p2.call(null, p1__56722_SHARP_);
                }
              };
            }(or__3639__auto__), args);
          }
        };
        var G__56730 = function(x, y, z, var_args) {
          var args = null;
          if (arguments.length > 3) {
            args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0);
          }
          return G__56730__delegate.call(this, x, y, z, args);
        };
        G__56730.cljs$lang$maxFixedArity = 3;
        G__56730.cljs$lang$applyTo = function(arglist__56731) {
          var x = cljs.core.first(arglist__56731);
          arglist__56731 = cljs.core.next(arglist__56731);
          var y = cljs.core.first(arglist__56731);
          arglist__56731 = cljs.core.next(arglist__56731);
          var z = cljs.core.first(arglist__56731);
          var args = cljs.core.rest(arglist__56731);
          return G__56730__delegate(x, y, z, args);
        };
        G__56730.cljs$core$IFn$_invoke$arity$variadic = G__56730__delegate;
        return G__56730;
      }();
      sp2 = function(x, y, z, var_args) {
        var args = var_args;
        switch(arguments.length) {
          case 0:
            return sp2__0.call(this);
          case 1:
            return sp2__1.call(this, x);
          case 2:
            return sp2__2.call(this, x, y);
          case 3:
            return sp2__3.call(this, x, y, z);
          default:
            return sp2__4.cljs$core$IFn$_invoke$arity$variadic(x, y, z, cljs.core.array_seq(arguments, 3));
        }
        throw new Error("Invalid arity: " + arguments.length);
      };
      sp2.cljs$lang$maxFixedArity = 3;
      sp2.cljs$lang$applyTo = sp2__4.cljs$lang$applyTo;
      sp2.cljs$core$IFn$_invoke$arity$0 = sp2__0;
      sp2.cljs$core$IFn$_invoke$arity$1 = sp2__1;
      sp2.cljs$core$IFn$_invoke$arity$2 = sp2__2;
      sp2.cljs$core$IFn$_invoke$arity$3 = sp2__3;
      sp2.cljs$core$IFn$_invoke$arity$variadic = sp2__4.cljs$core$IFn$_invoke$arity$variadic;
      return sp2;
    }();
  };
  var some_fn__3 = function(p1, p2, p3) {
    return function() {
      var sp3 = null;
      var sp3__0 = function() {
        return null;
      };
      var sp3__1 = function(x) {
        var or__3639__auto__ = p1.call(null, x);
        if (cljs.core.truth_(or__3639__auto__)) {
          return or__3639__auto__;
        } else {
          var or__3639__auto____$1 = p2.call(null, x);
          if (cljs.core.truth_(or__3639__auto____$1)) {
            return or__3639__auto____$1;
          } else {
            return p3.call(null, x);
          }
        }
      };
      var sp3__2 = function(x, y) {
        var or__3639__auto__ = p1.call(null, x);
        if (cljs.core.truth_(or__3639__auto__)) {
          return or__3639__auto__;
        } else {
          var or__3639__auto____$1 = p2.call(null, x);
          if (cljs.core.truth_(or__3639__auto____$1)) {
            return or__3639__auto____$1;
          } else {
            var or__3639__auto____$2 = p3.call(null, x);
            if (cljs.core.truth_(or__3639__auto____$2)) {
              return or__3639__auto____$2;
            } else {
              var or__3639__auto____$3 = p1.call(null, y);
              if (cljs.core.truth_(or__3639__auto____$3)) {
                return or__3639__auto____$3;
              } else {
                var or__3639__auto____$4 = p2.call(null, y);
                if (cljs.core.truth_(or__3639__auto____$4)) {
                  return or__3639__auto____$4;
                } else {
                  return p3.call(null, y);
                }
              }
            }
          }
        }
      };
      var sp3__3 = function(x, y, z) {
        var or__3639__auto__ = p1.call(null, x);
        if (cljs.core.truth_(or__3639__auto__)) {
          return or__3639__auto__;
        } else {
          var or__3639__auto____$1 = p2.call(null, x);
          if (cljs.core.truth_(or__3639__auto____$1)) {
            return or__3639__auto____$1;
          } else {
            var or__3639__auto____$2 = p3.call(null, x);
            if (cljs.core.truth_(or__3639__auto____$2)) {
              return or__3639__auto____$2;
            } else {
              var or__3639__auto____$3 = p1.call(null, y);
              if (cljs.core.truth_(or__3639__auto____$3)) {
                return or__3639__auto____$3;
              } else {
                var or__3639__auto____$4 = p2.call(null, y);
                if (cljs.core.truth_(or__3639__auto____$4)) {
                  return or__3639__auto____$4;
                } else {
                  var or__3639__auto____$5 = p3.call(null, y);
                  if (cljs.core.truth_(or__3639__auto____$5)) {
                    return or__3639__auto____$5;
                  } else {
                    var or__3639__auto____$6 = p1.call(null, z);
                    if (cljs.core.truth_(or__3639__auto____$6)) {
                      return or__3639__auto____$6;
                    } else {
                      var or__3639__auto____$7 = p2.call(null, z);
                      if (cljs.core.truth_(or__3639__auto____$7)) {
                        return or__3639__auto____$7;
                      } else {
                        return p3.call(null, z);
                      }
                    }
                  }
                }
              }
            }
          }
        }
      };
      var sp3__4 = function() {
        var G__56732__delegate = function(x, y, z, args) {
          var or__3639__auto__ = sp3.call(null, x, y, z);
          if (cljs.core.truth_(or__3639__auto__)) {
            return or__3639__auto__;
          } else {
            return cljs.core.some.call(null, function(or__3639__auto__) {
              return function(p1__56723_SHARP_) {
                var or__3639__auto____$1 = p1.call(null, p1__56723_SHARP_);
                if (cljs.core.truth_(or__3639__auto____$1)) {
                  return or__3639__auto____$1;
                } else {
                  var or__3639__auto____$2 = p2.call(null, p1__56723_SHARP_);
                  if (cljs.core.truth_(or__3639__auto____$2)) {
                    return or__3639__auto____$2;
                  } else {
                    return p3.call(null, p1__56723_SHARP_);
                  }
                }
              };
            }(or__3639__auto__), args);
          }
        };
        var G__56732 = function(x, y, z, var_args) {
          var args = null;
          if (arguments.length > 3) {
            args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0);
          }
          return G__56732__delegate.call(this, x, y, z, args);
        };
        G__56732.cljs$lang$maxFixedArity = 3;
        G__56732.cljs$lang$applyTo = function(arglist__56733) {
          var x = cljs.core.first(arglist__56733);
          arglist__56733 = cljs.core.next(arglist__56733);
          var y = cljs.core.first(arglist__56733);
          arglist__56733 = cljs.core.next(arglist__56733);
          var z = cljs.core.first(arglist__56733);
          var args = cljs.core.rest(arglist__56733);
          return G__56732__delegate(x, y, z, args);
        };
        G__56732.cljs$core$IFn$_invoke$arity$variadic = G__56732__delegate;
        return G__56732;
      }();
      sp3 = function(x, y, z, var_args) {
        var args = var_args;
        switch(arguments.length) {
          case 0:
            return sp3__0.call(this);
          case 1:
            return sp3__1.call(this, x);
          case 2:
            return sp3__2.call(this, x, y);
          case 3:
            return sp3__3.call(this, x, y, z);
          default:
            return sp3__4.cljs$core$IFn$_invoke$arity$variadic(x, y, z, cljs.core.array_seq(arguments, 3));
        }
        throw new Error("Invalid arity: " + arguments.length);
      };
      sp3.cljs$lang$maxFixedArity = 3;
      sp3.cljs$lang$applyTo = sp3__4.cljs$lang$applyTo;
      sp3.cljs$core$IFn$_invoke$arity$0 = sp3__0;
      sp3.cljs$core$IFn$_invoke$arity$1 = sp3__1;
      sp3.cljs$core$IFn$_invoke$arity$2 = sp3__2;
      sp3.cljs$core$IFn$_invoke$arity$3 = sp3__3;
      sp3.cljs$core$IFn$_invoke$arity$variadic = sp3__4.cljs$core$IFn$_invoke$arity$variadic;
      return sp3;
    }();
  };
  var some_fn__4 = function() {
    var G__56734__delegate = function(p1, p2, p3, ps) {
      var ps__$1 = cljs.core.list_STAR_.call(null, p1, p2, p3, ps);
      return function(ps__$1) {
        return function() {
          var spn = null;
          var spn__0 = function() {
            return null;
          };
          var spn__1 = function(x) {
            return cljs.core.some.call(null, function(ps__$1) {
              return function(p1__56724_SHARP_) {
                return p1__56724_SHARP_.call(null, x);
              };
            }(ps__$1), ps__$1);
          };
          var spn__2 = function(x, y) {
            return cljs.core.some.call(null, function(ps__$1) {
              return function(p1__56725_SHARP_) {
                var or__3639__auto__ = p1__56725_SHARP_.call(null, x);
                if (cljs.core.truth_(or__3639__auto__)) {
                  return or__3639__auto__;
                } else {
                  return p1__56725_SHARP_.call(null, y);
                }
              };
            }(ps__$1), ps__$1);
          };
          var spn__3 = function(x, y, z) {
            return cljs.core.some.call(null, function(ps__$1) {
              return function(p1__56726_SHARP_) {
                var or__3639__auto__ = p1__56726_SHARP_.call(null, x);
                if (cljs.core.truth_(or__3639__auto__)) {
                  return or__3639__auto__;
                } else {
                  var or__3639__auto____$1 = p1__56726_SHARP_.call(null, y);
                  if (cljs.core.truth_(or__3639__auto____$1)) {
                    return or__3639__auto____$1;
                  } else {
                    return p1__56726_SHARP_.call(null, z);
                  }
                }
              };
            }(ps__$1), ps__$1);
          };
          var spn__4 = function() {
            var G__56735__delegate = function(x, y, z, args) {
              var or__3639__auto__ = spn.call(null, x, y, z);
              if (cljs.core.truth_(or__3639__auto__)) {
                return or__3639__auto__;
              } else {
                return cljs.core.some.call(null, function(or__3639__auto__, ps__$1) {
                  return function(p1__56727_SHARP_) {
                    return cljs.core.some.call(null, p1__56727_SHARP_, args);
                  };
                }(or__3639__auto__, ps__$1), ps__$1);
              }
            };
            var G__56735 = function(x, y, z, var_args) {
              var args = null;
              if (arguments.length > 3) {
                args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0);
              }
              return G__56735__delegate.call(this, x, y, z, args);
            };
            G__56735.cljs$lang$maxFixedArity = 3;
            G__56735.cljs$lang$applyTo = function(arglist__56736) {
              var x = cljs.core.first(arglist__56736);
              arglist__56736 = cljs.core.next(arglist__56736);
              var y = cljs.core.first(arglist__56736);
              arglist__56736 = cljs.core.next(arglist__56736);
              var z = cljs.core.first(arglist__56736);
              var args = cljs.core.rest(arglist__56736);
              return G__56735__delegate(x, y, z, args);
            };
            G__56735.cljs$core$IFn$_invoke$arity$variadic = G__56735__delegate;
            return G__56735;
          }();
          spn = function(x, y, z, var_args) {
            var args = var_args;
            switch(arguments.length) {
              case 0:
                return spn__0.call(this);
              case 1:
                return spn__1.call(this, x);
              case 2:
                return spn__2.call(this, x, y);
              case 3:
                return spn__3.call(this, x, y, z);
              default:
                return spn__4.cljs$core$IFn$_invoke$arity$variadic(x, y, z, cljs.core.array_seq(arguments, 3));
            }
            throw new Error("Invalid arity: " + arguments.length);
          };
          spn.cljs$lang$maxFixedArity = 3;
          spn.cljs$lang$applyTo = spn__4.cljs$lang$applyTo;
          spn.cljs$core$IFn$_invoke$arity$0 = spn__0;
          spn.cljs$core$IFn$_invoke$arity$1 = spn__1;
          spn.cljs$core$IFn$_invoke$arity$2 = spn__2;
          spn.cljs$core$IFn$_invoke$arity$3 = spn__3;
          spn.cljs$core$IFn$_invoke$arity$variadic = spn__4.cljs$core$IFn$_invoke$arity$variadic;
          return spn;
        }();
      }(ps__$1);
    };
    var G__56734 = function(p1, p2, p3, var_args) {
      var ps = null;
      if (arguments.length > 3) {
        ps = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0);
      }
      return G__56734__delegate.call(this, p1, p2, p3, ps);
    };
    G__56734.cljs$lang$maxFixedArity = 3;
    G__56734.cljs$lang$applyTo = function(arglist__56737) {
      var p1 = cljs.core.first(arglist__56737);
      arglist__56737 = cljs.core.next(arglist__56737);
      var p2 = cljs.core.first(arglist__56737);
      arglist__56737 = cljs.core.next(arglist__56737);
      var p3 = cljs.core.first(arglist__56737);
      var ps = cljs.core.rest(arglist__56737);
      return G__56734__delegate(p1, p2, p3, ps);
    };
    G__56734.cljs$core$IFn$_invoke$arity$variadic = G__56734__delegate;
    return G__56734;
  }();
  some_fn = function(p1, p2, p3, var_args) {
    var ps = var_args;
    switch(arguments.length) {
      case 1:
        return some_fn__1.call(this, p1);
      case 2:
        return some_fn__2.call(this, p1, p2);
      case 3:
        return some_fn__3.call(this, p1, p2, p3);
      default:
        return some_fn__4.cljs$core$IFn$_invoke$arity$variadic(p1, p2, p3, cljs.core.array_seq(arguments, 3));
    }
    throw new Error("Invalid arity: " + arguments.length);
  };
  some_fn.cljs$lang$maxFixedArity = 3;
  some_fn.cljs$lang$applyTo = some_fn__4.cljs$lang$applyTo;
  some_fn.cljs$core$IFn$_invoke$arity$1 = some_fn__1;
  some_fn.cljs$core$IFn$_invoke$arity$2 = some_fn__2;
  some_fn.cljs$core$IFn$_invoke$arity$3 = some_fn__3;
  some_fn.cljs$core$IFn$_invoke$arity$variadic = some_fn__4.cljs$core$IFn$_invoke$arity$variadic;
  return some_fn;
}();
cljs.core.map = function() {
  var map = null;
  var map__1 = function(f) {
    return function(f1) {
      return function() {
        var G__56739 = null;
        var G__56739__0 = function() {
          return f1.call(null);
        };
        var G__56739__1 = function(result) {
          return f1.call(null, result);
        };
        var G__56739__2 = function(result, input) {
          return f1.call(null, result, f.call(null, input));
        };
        var G__56739__3 = function() {
          var G__56740__delegate = function(result, input, inputs) {
            return f1.call(null, result, cljs.core.apply.call(null, f, input, inputs));
          };
          var G__56740 = function(result, input, var_args) {
            var inputs = null;
            if (arguments.length > 2) {
              inputs = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0);
            }
            return G__56740__delegate.call(this, result, input, inputs);
          };
          G__56740.cljs$lang$maxFixedArity = 2;
          G__56740.cljs$lang$applyTo = function(arglist__56741) {
            var result = cljs.core.first(arglist__56741);
            arglist__56741 = cljs.core.next(arglist__56741);
            var input = cljs.core.first(arglist__56741);
            var inputs = cljs.core.rest(arglist__56741);
            return G__56740__delegate(result, input, inputs);
          };
          G__56740.cljs$core$IFn$_invoke$arity$variadic = G__56740__delegate;
          return G__56740;
        }();
        G__56739 = function(result, input, var_args) {
          var inputs = var_args;
          switch(arguments.length) {
            case 0:
              return G__56739__0.call(this);
            case 1:
              return G__56739__1.call(this, result);
            case 2:
              return G__56739__2.call(this, result, input);
            default:
              return G__56739__3.cljs$core$IFn$_invoke$arity$variadic(result, input, cljs.core.array_seq(arguments, 2));
          }
          throw new Error("Invalid arity: " + arguments.length);
        };
        G__56739.cljs$lang$maxFixedArity = 2;
        G__56739.cljs$lang$applyTo = G__56739__3.cljs$lang$applyTo;
        G__56739.cljs$core$IFn$_invoke$arity$0 = G__56739__0;
        G__56739.cljs$core$IFn$_invoke$arity$1 = G__56739__1;
        G__56739.cljs$core$IFn$_invoke$arity$2 = G__56739__2;
        G__56739.cljs$core$IFn$_invoke$arity$variadic = G__56739__3.cljs$core$IFn$_invoke$arity$variadic;
        return G__56739;
      }();
    };
  };
  var map__2 = function(f, coll) {
    return new cljs.core.LazySeq(null, function() {
      var temp__4126__auto__ = cljs.core.seq.call(null, coll);
      if (temp__4126__auto__) {
        var s = temp__4126__auto__;
        if (cljs.core.chunked_seq_QMARK_.call(null, s)) {
          var c = cljs.core.chunk_first.call(null, s);
          var size = cljs.core.count.call(null, c);
          var b = cljs.core.chunk_buffer.call(null, size);
          var n__4508__auto___56742 = size;
          var i_56743 = 0;
          while (true) {
            if (i_56743 < n__4508__auto___56742) {
              cljs.core.chunk_append.call(null, b, f.call(null, cljs.core._nth.call(null, c, i_56743)));
              var G__56744 = i_56743 + 1;
              i_56743 = G__56744;
              continue;
            } else {
            }
            break;
          }
          return cljs.core.chunk_cons.call(null, cljs.core.chunk.call(null, b), map.call(null, f, cljs.core.chunk_rest.call(null, s)));
        } else {
          return cljs.core.cons.call(null, f.call(null, cljs.core.first.call(null, s)), map.call(null, f, cljs.core.rest.call(null, s)));
        }
      } else {
        return null;
      }
    }, null, null);
  };
  var map__3 = function(f, c1, c2) {
    return new cljs.core.LazySeq(null, function() {
      var s1 = cljs.core.seq.call(null, c1);
      var s2 = cljs.core.seq.call(null, c2);
      if (s1 && s2) {
        return cljs.core.cons.call(null, f.call(null, cljs.core.first.call(null, s1), cljs.core.first.call(null, s2)), map.call(null, f, cljs.core.rest.call(null, s1), cljs.core.rest.call(null, s2)));
      } else {
        return null;
      }
    }, null, null);
  };
  var map__4 = function(f, c1, c2, c3) {
    return new cljs.core.LazySeq(null, function() {
      var s1 = cljs.core.seq.call(null, c1);
      var s2 = cljs.core.seq.call(null, c2);
      var s3 = cljs.core.seq.call(null, c3);
      if (s1 && s2 && s3) {
        return cljs.core.cons.call(null, f.call(null, cljs.core.first.call(null, s1), cljs.core.first.call(null, s2), cljs.core.first.call(null, s3)), map.call(null, f, cljs.core.rest.call(null, s1), cljs.core.rest.call(null, s2), cljs.core.rest.call(null, s3)));
      } else {
        return null;
      }
    }, null, null);
  };
  var map__5 = function() {
    var G__56745__delegate = function(f, c1, c2, c3, colls) {
      var step = function step(cs) {
        return new cljs.core.LazySeq(null, function() {
          var ss = map.call(null, cljs.core.seq, cs);
          if (cljs.core.every_QMARK_.call(null, cljs.core.identity, ss)) {
            return cljs.core.cons.call(null, map.call(null, cljs.core.first, ss), step.call(null, map.call(null, cljs.core.rest, ss)));
          } else {
            return null;
          }
        }, null, null);
      };
      return map.call(null, function(step) {
        return function(p1__56738_SHARP_) {
          return cljs.core.apply.call(null, f, p1__56738_SHARP_);
        };
      }(step), step.call(null, cljs.core.conj.call(null, colls, c3, c2, c1)));
    };
    var G__56745 = function(f, c1, c2, c3, var_args) {
      var colls = null;
      if (arguments.length > 4) {
        colls = cljs.core.array_seq(Array.prototype.slice.call(arguments, 4), 0);
      }
      return G__56745__delegate.call(this, f, c1, c2, c3, colls);
    };
    G__56745.cljs$lang$maxFixedArity = 4;
    G__56745.cljs$lang$applyTo = function(arglist__56746) {
      var f = cljs.core.first(arglist__56746);
      arglist__56746 = cljs.core.next(arglist__56746);
      var c1 = cljs.core.first(arglist__56746);
      arglist__56746 = cljs.core.next(arglist__56746);
      var c2 = cljs.core.first(arglist__56746);
      arglist__56746 = cljs.core.next(arglist__56746);
      var c3 = cljs.core.first(arglist__56746);
      var colls = cljs.core.rest(arglist__56746);
      return G__56745__delegate(f, c1, c2, c3, colls);
    };
    G__56745.cljs$core$IFn$_invoke$arity$variadic = G__56745__delegate;
    return G__56745;
  }();
  map = function(f, c1, c2, c3, var_args) {
    var colls = var_args;
    switch(arguments.length) {
      case 1:
        return map__1.call(this, f);
      case 2:
        return map__2.call(this, f, c1);
      case 3:
        return map__3.call(this, f, c1, c2);
      case 4:
        return map__4.call(this, f, c1, c2, c3);
      default:
        return map__5.cljs$core$IFn$_invoke$arity$variadic(f, c1, c2, c3, cljs.core.array_seq(arguments, 4));
    }
    throw new Error("Invalid arity: " + arguments.length);
  };
  map.cljs$lang$maxFixedArity = 4;
  map.cljs$lang$applyTo = map__5.cljs$lang$applyTo;
  map.cljs$core$IFn$_invoke$arity$1 = map__1;
  map.cljs$core$IFn$_invoke$arity$2 = map__2;
  map.cljs$core$IFn$_invoke$arity$3 = map__3;
  map.cljs$core$IFn$_invoke$arity$4 = map__4;
  map.cljs$core$IFn$_invoke$arity$variadic = map__5.cljs$core$IFn$_invoke$arity$variadic;
  return map;
}();
cljs.core.take = function() {
  var take = null;
  var take__1 = function(n) {
    return function(f1) {
      var na = cljs.core.atom.call(null, n);
      return function(na) {
        return function() {
          var G__56747 = null;
          var G__56747__0 = function() {
            return f1.call(null);
          };
          var G__56747__1 = function(result) {
            return f1.call(null, result);
          };
          var G__56747__2 = function(result, input) {
            var n__$1 = cljs.core.deref.call(null, na);
            var nn = cljs.core.swap_BANG_.call(null, na, cljs.core.dec);
            var result__$1 = n__$1 > 0 ? f1.call(null, result, input) : result;
            if (!(nn > 0)) {
              return cljs.core.reduced.call(null, result__$1);
            } else {
              return result__$1;
            }
          };
          G__56747 = function(result, input) {
            switch(arguments.length) {
              case 0:
                return G__56747__0.call(this);
              case 1:
                return G__56747__1.call(this, result);
              case 2:
                return G__56747__2.call(this, result, input);
            }
            throw new Error("Invalid arity: " + arguments.length);
          };
          G__56747.cljs$core$IFn$_invoke$arity$0 = G__56747__0;
          G__56747.cljs$core$IFn$_invoke$arity$1 = G__56747__1;
          G__56747.cljs$core$IFn$_invoke$arity$2 = G__56747__2;
          return G__56747;
        }();
      }(na);
    };
  };
  var take__2 = function(n, coll) {
    return new cljs.core.LazySeq(null, function() {
      if (n > 0) {
        var temp__4126__auto__ = cljs.core.seq.call(null, coll);
        if (temp__4126__auto__) {
          var s = temp__4126__auto__;
          return cljs.core.cons.call(null, cljs.core.first.call(null, s), take.call(null, n - 1, cljs.core.rest.call(null, s)));
        } else {
          return null;
        }
      } else {
        return null;
      }
    }, null, null);
  };
  take = function(n, coll) {
    switch(arguments.length) {
      case 1:
        return take__1.call(this, n);
      case 2:
        return take__2.call(this, n, coll);
    }
    throw new Error("Invalid arity: " + arguments.length);
  };
  take.cljs$core$IFn$_invoke$arity$1 = take__1;
  take.cljs$core$IFn$_invoke$arity$2 = take__2;
  return take;
}();
cljs.core.drop = function() {
  var drop = null;
  var drop__1 = function(n) {
    return function(f1) {
      var na = cljs.core.atom.call(null, n);
      return function(na) {
        return function() {
          var G__56748 = null;
          var G__56748__0 = function() {
            return f1.call(null);
          };
          var G__56748__1 = function(result) {
            return f1.call(null, result);
          };
          var G__56748__2 = function(result, input) {
            var n__$1 = cljs.core.deref.call(null, na);
            cljs.core.swap_BANG_.call(null, na, cljs.core.dec);
            if (n__$1 > 0) {
              return result;
            } else {
              return f1.call(null, result, input);
            }
          };
          G__56748 = function(result, input) {
            switch(arguments.length) {
              case 0:
                return G__56748__0.call(this);
              case 1:
                return G__56748__1.call(this, result);
              case 2:
                return G__56748__2.call(this, result, input);
            }
            throw new Error("Invalid arity: " + arguments.length);
          };
          G__56748.cljs$core$IFn$_invoke$arity$0 = G__56748__0;
          G__56748.cljs$core$IFn$_invoke$arity$1 = G__56748__1;
          G__56748.cljs$core$IFn$_invoke$arity$2 = G__56748__2;
          return G__56748;
        }();
      }(na);
    };
  };
  var drop__2 = function(n, coll) {
    var step = function(n__$1, coll__$1) {
      while (true) {
        var s = cljs.core.seq.call(null, coll__$1);
        if (n__$1 > 0 && s) {
          var G__56749 = n__$1 - 1;
          var G__56750 = cljs.core.rest.call(null, s);
          n__$1 = G__56749;
          coll__$1 = G__56750;
          continue;
        } else {
          return s;
        }
        break;
      }
    };
    return new cljs.core.LazySeq(null, function(step) {
      return function() {
        return step.call(null, n, coll);
      };
    }(step), null, null);
  };
  drop = function(n, coll) {
    switch(arguments.length) {
      case 1:
        return drop__1.call(this, n);
      case 2:
        return drop__2.call(this, n, coll);
    }
    throw new Error("Invalid arity: " + arguments.length);
  };
  drop.cljs$core$IFn$_invoke$arity$1 = drop__1;
  drop.cljs$core$IFn$_invoke$arity$2 = drop__2;
  return drop;
}();
cljs.core.drop_last = function() {
  var drop_last = null;
  var drop_last__1 = function(s) {
    return drop_last.call(null, 1, s);
  };
  var drop_last__2 = function(n, s) {
    return cljs.core.map.call(null, function(x, _) {
      return x;
    }, s, cljs.core.drop.call(null, n, s));
  };
  drop_last = function(n, s) {
    switch(arguments.length) {
      case 1:
        return drop_last__1.call(this, n);
      case 2:
        return drop_last__2.call(this, n, s);
    }
    throw new Error("Invalid arity: " + arguments.length);
  };
  drop_last.cljs$core$IFn$_invoke$arity$1 = drop_last__1;
  drop_last.cljs$core$IFn$_invoke$arity$2 = drop_last__2;
  return drop_last;
}();
cljs.core.take_last = function take_last(n, coll) {
  var s = cljs.core.seq.call(null, coll);
  var lead = cljs.core.seq.call(null, cljs.core.drop.call(null, n, coll));
  while (true) {
    if (lead) {
      var G__56751 = cljs.core.next.call(null, s);
      var G__56752 = cljs.core.next.call(null, lead);
      s = G__56751;
      lead = G__56752;
      continue;
    } else {
      return s;
    }
    break;
  }
};
cljs.core.drop_while = function() {
  var drop_while = null;
  var drop_while__1 = function(pred) {
    return function(f1) {
      var da = cljs.core.atom.call(null, true);
      return function(da) {
        return function() {
          var G__56753 = null;
          var G__56753__0 = function() {
            return f1.call(null);
          };
          var G__56753__1 = function(result) {
            return f1.call(null, result);
          };
          var G__56753__2 = function(result, input) {
            var drop_QMARK_ = cljs.core.deref.call(null, da);
            if (cljs.core.truth_(function() {
              var and__3627__auto__ = drop_QMARK_;
              if (cljs.core.truth_(and__3627__auto__)) {
                return pred.call(null, input);
              } else {
                return and__3627__auto__;
              }
            }())) {
              return result;
            } else {
              cljs.core.reset_BANG_.call(null, da, null);
              return f1.call(null, result, input);
            }
          };
          G__56753 = function(result, input) {
            switch(arguments.length) {
              case 0:
                return G__56753__0.call(this);
              case 1:
                return G__56753__1.call(this, result);
              case 2:
                return G__56753__2.call(this, result, input);
            }
            throw new Error("Invalid arity: " + arguments.length);
          };
          G__56753.cljs$core$IFn$_invoke$arity$0 = G__56753__0;
          G__56753.cljs$core$IFn$_invoke$arity$1 = G__56753__1;
          G__56753.cljs$core$IFn$_invoke$arity$2 = G__56753__2;
          return G__56753;
        }();
      }(da);
    };
  };
  var drop_while__2 = function(pred, coll) {
    var step = function(pred__$1, coll__$1) {
      while (true) {
        var s = cljs.core.seq.call(null, coll__$1);
        if (cljs.core.truth_(function() {
          var and__3627__auto__ = s;
          if (and__3627__auto__) {
            return pred__$1.call(null, cljs.core.first.call(null, s));
          } else {
            return and__3627__auto__;
          }
        }())) {
          var G__56754 = pred__$1;
          var G__56755 = cljs.core.rest.call(null, s);
          pred__$1 = G__56754;
          coll__$1 = G__56755;
          continue;
        } else {
          return s;
        }
        break;
      }
    };
    return new cljs.core.LazySeq(null, function(step) {
      return function() {
        return step.call(null, pred, coll);
      };
    }(step), null, null);
  };
  drop_while = function(pred, coll) {
    switch(arguments.length) {
      case 1:
        return drop_while__1.call(this, pred);
      case 2:
        return drop_while__2.call(this, pred, coll);
    }
    throw new Error("Invalid arity: " + arguments.length);
  };
  drop_while.cljs$core$IFn$_invoke$arity$1 = drop_while__1;
  drop_while.cljs$core$IFn$_invoke$arity$2 = drop_while__2;
  return drop_while;
}();
cljs.core.cycle = function cycle(coll) {
  return new cljs.core.LazySeq(null, function() {
    var temp__4126__auto__ = cljs.core.seq.call(null, coll);
    if (temp__4126__auto__) {
      var s = temp__4126__auto__;
      return cljs.core.concat.call(null, s, cycle.call(null, s));
    } else {
      return null;
    }
  }, null, null);
};
cljs.core.split_at = function split_at(n, coll) {
  return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.take.call(null, n, coll), cljs.core.drop.call(null, n, coll)], null);
};
cljs.core.repeat = function() {
  var repeat = null;
  var repeat__1 = function(x) {
    return new cljs.core.LazySeq(null, function() {
      return cljs.core.cons.call(null, x, repeat.call(null, x));
    }, null, null);
  };
  var repeat__2 = function(n, x) {
    return cljs.core.take.call(null, n, repeat.call(null, x));
  };
  repeat = function(n, x) {
    switch(arguments.length) {
      case 1:
        return repeat__1.call(this, n);
      case 2:
        return repeat__2.call(this, n, x);
    }
    throw new Error("Invalid arity: " + arguments.length);
  };
  repeat.cljs$core$IFn$_invoke$arity$1 = repeat__1;
  repeat.cljs$core$IFn$_invoke$arity$2 = repeat__2;
  return repeat;
}();
cljs.core.replicate = function replicate(n, x) {
  return cljs.core.take.call(null, n, cljs.core.repeat.call(null, x));
};
cljs.core.repeatedly = function() {
  var repeatedly = null;
  var repeatedly__1 = function(f) {
    return new cljs.core.LazySeq(null, function() {
      return cljs.core.cons.call(null, f.call(null), repeatedly.call(null, f));
    }, null, null);
  };
  var repeatedly__2 = function(n, f) {
    return cljs.core.take.call(null, n, repeatedly.call(null, f));
  };
  repeatedly = function(n, f) {
    switch(arguments.length) {
      case 1:
        return repeatedly__1.call(this, n);
      case 2:
        return repeatedly__2.call(this, n, f);
    }
    throw new Error("Invalid arity: " + arguments.length);
  };
  repeatedly.cljs$core$IFn$_invoke$arity$1 = repeatedly__1;
  repeatedly.cljs$core$IFn$_invoke$arity$2 = repeatedly__2;
  return repeatedly;
}();
cljs.core.iterate = function iterate(f, x) {
  return cljs.core.cons.call(null, x, new cljs.core.LazySeq(null, function() {
    return iterate.call(null, f, f.call(null, x));
  }, null, null));
};
cljs.core.interleave = function() {
  var interleave = null;
  var interleave__2 = function(c1, c2) {
    return new cljs.core.LazySeq(null, function() {
      var s1 = cljs.core.seq.call(null, c1);
      var s2 = cljs.core.seq.call(null, c2);
      if (s1 && s2) {
        return cljs.core.cons.call(null, cljs.core.first.call(null, s1), cljs.core.cons.call(null, cljs.core.first.call(null, s2), interleave.call(null, cljs.core.rest.call(null, s1), cljs.core.rest.call(null, s2))));
      } else {
        return null;
      }
    }, null, null);
  };
  var interleave__3 = function() {
    var G__56756__delegate = function(c1, c2, colls) {
      return new cljs.core.LazySeq(null, function() {
        var ss = cljs.core.map.call(null, cljs.core.seq, cljs.core.conj.call(null, colls, c2, c1));
        if (cljs.core.every_QMARK_.call(null, cljs.core.identity, ss)) {
          return cljs.core.concat.call(null, cljs.core.map.call(null, cljs.core.first, ss), cljs.core.apply.call(null, interleave, cljs.core.map.call(null, cljs.core.rest, ss)));
        } else {
          return null;
        }
      }, null, null);
    };
    var G__56756 = function(c1, c2, var_args) {
      var colls = null;
      if (arguments.length > 2) {
        colls = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0);
      }
      return G__56756__delegate.call(this, c1, c2, colls);
    };
    G__56756.cljs$lang$maxFixedArity = 2;
    G__56756.cljs$lang$applyTo = function(arglist__56757) {
      var c1 = cljs.core.first(arglist__56757);
      arglist__56757 = cljs.core.next(arglist__56757);
      var c2 = cljs.core.first(arglist__56757);
      var colls = cljs.core.rest(arglist__56757);
      return G__56756__delegate(c1, c2, colls);
    };
    G__56756.cljs$core$IFn$_invoke$arity$variadic = G__56756__delegate;
    return G__56756;
  }();
  interleave = function(c1, c2, var_args) {
    var colls = var_args;
    switch(arguments.length) {
      case 2:
        return interleave__2.call(this, c1, c2);
      default:
        return interleave__3.cljs$core$IFn$_invoke$arity$variadic(c1, c2, cljs.core.array_seq(arguments, 2));
    }
    throw new Error("Invalid arity: " + arguments.length);
  };
  interleave.cljs$lang$maxFixedArity = 2;
  interleave.cljs$lang$applyTo = interleave__3.cljs$lang$applyTo;
  interleave.cljs$core$IFn$_invoke$arity$2 = interleave__2;
  interleave.cljs$core$IFn$_invoke$arity$variadic = interleave__3.cljs$core$IFn$_invoke$arity$variadic;
  return interleave;
}();
cljs.core.interpose = function interpose(sep, coll) {
  return cljs.core.drop.call(null, 1, cljs.core.interleave.call(null, cljs.core.repeat.call(null, sep), coll));
};
cljs.core.flatten1 = function flatten1(colls) {
  var cat = function cat(coll, colls__$1) {
    return new cljs.core.LazySeq(null, function() {
      var temp__4124__auto__ = cljs.core.seq.call(null, coll);
      if (temp__4124__auto__) {
        var coll__$1 = temp__4124__auto__;
        return cljs.core.cons.call(null, cljs.core.first.call(null, coll__$1), cat.call(null, cljs.core.rest.call(null, coll__$1), colls__$1));
      } else {
        if (cljs.core.seq.call(null, colls__$1)) {
          return cat.call(null, cljs.core.first.call(null, colls__$1), cljs.core.rest.call(null, colls__$1));
        } else {
          return null;
        }
      }
    }, null, null);
  };
  return cat.call(null, null, colls);
};
cljs.core.mapcat = function() {
  var mapcat = null;
  var mapcat__1 = function(f) {
    return cljs.core.comp.call(null, cljs.core.map.call(null, f), cljs.core.cat);
  };
  var mapcat__2 = function() {
    var G__56758__delegate = function(f, colls) {
      return cljs.core.apply.call(null, cljs.core.concat, cljs.core.apply.call(null, cljs.core.map, f, colls));
    };
    var G__56758 = function(f, var_args) {
      var colls = null;
      if (arguments.length > 1) {
        colls = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0);
      }
      return G__56758__delegate.call(this, f, colls);
    };
    G__56758.cljs$lang$maxFixedArity = 1;
    G__56758.cljs$lang$applyTo = function(arglist__56759) {
      var f = cljs.core.first(arglist__56759);
      var colls = cljs.core.rest(arglist__56759);
      return G__56758__delegate(f, colls);
    };
    G__56758.cljs$core$IFn$_invoke$arity$variadic = G__56758__delegate;
    return G__56758;
  }();
  mapcat = function(f, var_args) {
    var colls = var_args;
    switch(arguments.length) {
      case 1:
        return mapcat__1.call(this, f);
      default:
        return mapcat__2.cljs$core$IFn$_invoke$arity$variadic(f, cljs.core.array_seq(arguments, 1));
    }
    throw new Error("Invalid arity: " + arguments.length);
  };
  mapcat.cljs$lang$maxFixedArity = 1;
  mapcat.cljs$lang$applyTo = mapcat__2.cljs$lang$applyTo;
  mapcat.cljs$core$IFn$_invoke$arity$1 = mapcat__1;
  mapcat.cljs$core$IFn$_invoke$arity$variadic = mapcat__2.cljs$core$IFn$_invoke$arity$variadic;
  return mapcat;
}();
cljs.core.filter = function() {
  var filter = null;
  var filter__1 = function(pred) {
    return function(f1) {
      return function() {
        var G__56760 = null;
        var G__56760__0 = function() {
          return f1.call(null);
        };
        var G__56760__1 = function(result) {
          return f1.call(null, result);
        };
        var G__56760__2 = function(result, input) {
          if (cljs.core.truth_(pred.call(null, input))) {
            return f1.call(null, result, input);
          } else {
            return result;
          }
        };
        G__56760 = function(result, input) {
          switch(arguments.length) {
            case 0:
              return G__56760__0.call(this);
            case 1:
              return G__56760__1.call(this, result);
            case 2:
              return G__56760__2.call(this, result, input);
          }
          throw new Error("Invalid arity: " + arguments.length);
        };
        G__56760.cljs$core$IFn$_invoke$arity$0 = G__56760__0;
        G__56760.cljs$core$IFn$_invoke$arity$1 = G__56760__1;
        G__56760.cljs$core$IFn$_invoke$arity$2 = G__56760__2;
        return G__56760;
      }();
    };
  };
  var filter__2 = function(pred, coll) {
    return new cljs.core.LazySeq(null, function() {
      var temp__4126__auto__ = cljs.core.seq.call(null, coll);
      if (temp__4126__auto__) {
        var s = temp__4126__auto__;
        if (cljs.core.chunked_seq_QMARK_.call(null, s)) {
          var c = cljs.core.chunk_first.call(null, s);
          var size = cljs.core.count.call(null, c);
          var b = cljs.core.chunk_buffer.call(null, size);
          var n__4508__auto___56761 = size;
          var i_56762 = 0;
          while (true) {
            if (i_56762 < n__4508__auto___56761) {
              if (cljs.core.truth_(pred.call(null, cljs.core._nth.call(null, c, i_56762)))) {
                cljs.core.chunk_append.call(null, b, cljs.core._nth.call(null, c, i_56762));
              } else {
              }
              var G__56763 = i_56762 + 1;
              i_56762 = G__56763;
              continue;
            } else {
            }
            break;
          }
          return cljs.core.chunk_cons.call(null, cljs.core.chunk.call(null, b), filter.call(null, pred, cljs.core.chunk_rest.call(null, s)));
        } else {
          var f = cljs.core.first.call(null, s);
          var r = cljs.core.rest.call(null, s);
          if (cljs.core.truth_(pred.call(null, f))) {
            return cljs.core.cons.call(null, f, filter.call(null, pred, r));
          } else {
            return filter.call(null, pred, r);
          }
        }
      } else {
        return null;
      }
    }, null, null);
  };
  filter = function(pred, coll) {
    switch(arguments.length) {
      case 1:
        return filter__1.call(this, pred);
      case 2:
        return filter__2.call(this, pred, coll);
    }
    throw new Error("Invalid arity: " + arguments.length);
  };
  filter.cljs$core$IFn$_invoke$arity$1 = filter__1;
  filter.cljs$core$IFn$_invoke$arity$2 = filter__2;
  return filter;
}();
cljs.core.remove = function() {
  var remove = null;
  var remove__1 = function(pred) {
    return cljs.core.filter.call(null, cljs.core.complement.call(null, pred));
  };
  var remove__2 = function(pred, coll) {
    return cljs.core.filter.call(null, cljs.core.complement.call(null, pred), coll);
  };
  remove = function(pred, coll) {
    switch(arguments.length) {
      case 1:
        return remove__1.call(this, pred);
      case 2:
        return remove__2.call(this, pred, coll);
    }
    throw new Error("Invalid arity: " + arguments.length);
  };
  remove.cljs$core$IFn$_invoke$arity$1 = remove__1;
  remove.cljs$core$IFn$_invoke$arity$2 = remove__2;
  return remove;
}();
cljs.core.tree_seq = function tree_seq(branch_QMARK_, children, root) {
  var walk = function walk(node) {
    return new cljs.core.LazySeq(null, function() {
      return cljs.core.cons.call(null, node, cljs.core.truth_(branch_QMARK_.call(null, node)) ? cljs.core.mapcat.call(null, walk, children.call(null, node)) : null);
    }, null, null);
  };
  return walk.call(null, root);
};
cljs.core.flatten = function flatten(x) {
  return cljs.core.filter.call(null, function(p1__56764_SHARP_) {
    return!cljs.core.sequential_QMARK_.call(null, p1__56764_SHARP_);
  }, cljs.core.rest.call(null, cljs.core.tree_seq.call(null, cljs.core.sequential_QMARK_, cljs.core.seq, x)));
};
cljs.core.into = function() {
  var into = null;
  var into__2 = function(to, from) {
    if (!(to == null)) {
      if (function() {
        var G__56767 = to;
        if (G__56767) {
          var bit__4295__auto__ = G__56767.cljs$lang$protocol_mask$partition1$ & 4;
          if (bit__4295__auto__ || G__56767.cljs$core$IEditableCollection$) {
            return true;
          } else {
            return false;
          }
        } else {
          return false;
        }
      }()) {
        return cljs.core.with_meta.call(null, cljs.core.persistent_BANG_.call(null, cljs.core.reduce.call(null, cljs.core._conj_BANG_, cljs.core.transient$.call(null, to), from)), cljs.core.meta.call(null, to));
      } else {
        return cljs.core.reduce.call(null, cljs.core._conj, to, from);
      }
    } else {
      return cljs.core.reduce.call(null, cljs.core.conj, cljs.core.List.EMPTY, from);
    }
  };
  var into__3 = function(to, xform, from) {
    if (function() {
      var G__56768 = to;
      if (G__56768) {
        var bit__4295__auto__ = G__56768.cljs$lang$protocol_mask$partition1$ & 4;
        if (bit__4295__auto__ || G__56768.cljs$core$IEditableCollection$) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    }()) {
      return cljs.core.with_meta.call(null, cljs.core.persistent_BANG_.call(null, cljs.core.transduce.call(null, xform, cljs.core.conj_BANG_, cljs.core.transient$.call(null, to), from)), cljs.core.meta.call(null, to));
    } else {
      return cljs.core.transduce.call(null, xform, cljs.core.conj, to, from);
    }
  };
  into = function(to, xform, from) {
    switch(arguments.length) {
      case 2:
        return into__2.call(this, to, xform);
      case 3:
        return into__3.call(this, to, xform, from);
    }
    throw new Error("Invalid arity: " + arguments.length);
  };
  into.cljs$core$IFn$_invoke$arity$2 = into__2;
  into.cljs$core$IFn$_invoke$arity$3 = into__3;
  return into;
}();
cljs.core.mapv = function() {
  var mapv = null;
  var mapv__2 = function(f, coll) {
    return cljs.core.persistent_BANG_.call(null, cljs.core.reduce.call(null, function(v, o) {
      return cljs.core.conj_BANG_.call(null, v, f.call(null, o));
    }, cljs.core.transient$.call(null, cljs.core.PersistentVector.EMPTY), coll));
  };
  var mapv__3 = function(f, c1, c2) {
    return cljs.core.into.call(null, cljs.core.PersistentVector.EMPTY, cljs.core.map.call(null, f, c1, c2));
  };
  var mapv__4 = function(f, c1, c2, c3) {
    return cljs.core.into.call(null, cljs.core.PersistentVector.EMPTY, cljs.core.map.call(null, f, c1, c2, c3));
  };
  var mapv__5 = function() {
    var G__56769__delegate = function(f, c1, c2, c3, colls) {
      return cljs.core.into.call(null, cljs.core.PersistentVector.EMPTY, cljs.core.apply.call(null, cljs.core.map, f, c1, c2, c3, colls));
    };
    var G__56769 = function(f, c1, c2, c3, var_args) {
      var colls = null;
      if (arguments.length > 4) {
        colls = cljs.core.array_seq(Array.prototype.slice.call(arguments, 4), 0);
      }
      return G__56769__delegate.call(this, f, c1, c2, c3, colls);
    };
    G__56769.cljs$lang$maxFixedArity = 4;
    G__56769.cljs$lang$applyTo = function(arglist__56770) {
      var f = cljs.core.first(arglist__56770);
      arglist__56770 = cljs.core.next(arglist__56770);
      var c1 = cljs.core.first(arglist__56770);
      arglist__56770 = cljs.core.next(arglist__56770);
      var c2 = cljs.core.first(arglist__56770);
      arglist__56770 = cljs.core.next(arglist__56770);
      var c3 = cljs.core.first(arglist__56770);
      var colls = cljs.core.rest(arglist__56770);
      return G__56769__delegate(f, c1, c2, c3, colls);
    };
    G__56769.cljs$core$IFn$_invoke$arity$variadic = G__56769__delegate;
    return G__56769;
  }();
  mapv = function(f, c1, c2, c3, var_args) {
    var colls = var_args;
    switch(arguments.length) {
      case 2:
        return mapv__2.call(this, f, c1);
      case 3:
        return mapv__3.call(this, f, c1, c2);
      case 4:
        return mapv__4.call(this, f, c1, c2, c3);
      default:
        return mapv__5.cljs$core$IFn$_invoke$arity$variadic(f, c1, c2, c3, cljs.core.array_seq(arguments, 4));
    }
    throw new Error("Invalid arity: " + arguments.length);
  };
  mapv.cljs$lang$maxFixedArity = 4;
  mapv.cljs$lang$applyTo = mapv__5.cljs$lang$applyTo;
  mapv.cljs$core$IFn$_invoke$arity$2 = mapv__2;
  mapv.cljs$core$IFn$_invoke$arity$3 = mapv__3;
  mapv.cljs$core$IFn$_invoke$arity$4 = mapv__4;
  mapv.cljs$core$IFn$_invoke$arity$variadic = mapv__5.cljs$core$IFn$_invoke$arity$variadic;
  return mapv;
}();
cljs.core.filterv = function filterv(pred, coll) {
  return cljs.core.persistent_BANG_.call(null, cljs.core.reduce.call(null, function(v, o) {
    if (cljs.core.truth_(pred.call(null, o))) {
      return cljs.core.conj_BANG_.call(null, v, o);
    } else {
      return v;
    }
  }, cljs.core.transient$.call(null, cljs.core.PersistentVector.EMPTY), coll));
};
cljs.core.partition = function() {
  var partition = null;
  var partition__2 = function(n, coll) {
    return partition.call(null, n, n, coll);
  };
  var partition__3 = function(n, step, coll) {
    return new cljs.core.LazySeq(null, function() {
      var temp__4126__auto__ = cljs.core.seq.call(null, coll);
      if (temp__4126__auto__) {
        var s = temp__4126__auto__;
        var p = cljs.core.take.call(null, n, s);
        if (n === cljs.core.count.call(null, p)) {
          return cljs.core.cons.call(null, p, partition.call(null, n, step, cljs.core.drop.call(null, step, s)));
        } else {
          return null;
        }
      } else {
        return null;
      }
    }, null, null);
  };
  var partition__4 = function(n, step, pad, coll) {
    return new cljs.core.LazySeq(null, function() {
      var temp__4126__auto__ = cljs.core.seq.call(null, coll);
      if (temp__4126__auto__) {
        var s = temp__4126__auto__;
        var p = cljs.core.take.call(null, n, s);
        if (n === cljs.core.count.call(null, p)) {
          return cljs.core.cons.call(null, p, partition.call(null, n, step, pad, cljs.core.drop.call(null, step, s)));
        } else {
          return cljs.core._conj.call(null, cljs.core.List.EMPTY, cljs.core.take.call(null, n, cljs.core.concat.call(null, p, pad)));
        }
      } else {
        return null;
      }
    }, null, null);
  };
  partition = function(n, step, pad, coll) {
    switch(arguments.length) {
      case 2:
        return partition__2.call(this, n, step);
      case 3:
        return partition__3.call(this, n, step, pad);
      case 4:
        return partition__4.call(this, n, step, pad, coll);
    }
    throw new Error("Invalid arity: " + arguments.length);
  };
  partition.cljs$core$IFn$_invoke$arity$2 = partition__2;
  partition.cljs$core$IFn$_invoke$arity$3 = partition__3;
  partition.cljs$core$IFn$_invoke$arity$4 = partition__4;
  return partition;
}();
cljs.core.get_in = function() {
  var get_in = null;
  var get_in__2 = function(m, ks) {
    return get_in.call(null, m, ks, null);
  };
  var get_in__3 = function(m, ks, not_found) {
    var sentinel = cljs.core.lookup_sentinel;
    var m__$1 = m;
    var ks__$1 = cljs.core.seq.call(null, ks);
    while (true) {
      if (ks__$1) {
        if (!function() {
          var G__56772 = m__$1;
          if (G__56772) {
            var bit__4302__auto__ = G__56772.cljs$lang$protocol_mask$partition0$ & 256;
            if (bit__4302__auto__ || G__56772.cljs$core$ILookup$) {
              return true;
            } else {
              if (!G__56772.cljs$lang$protocol_mask$partition0$) {
                return cljs.core.native_satisfies_QMARK_.call(null, cljs.core.ILookup, G__56772);
              } else {
                return false;
              }
            }
          } else {
            return cljs.core.native_satisfies_QMARK_.call(null, cljs.core.ILookup, G__56772);
          }
        }()) {
          return not_found;
        } else {
          var m__$2 = cljs.core.get.call(null, m__$1, cljs.core.first.call(null, ks__$1), sentinel);
          if (sentinel === m__$2) {
            return not_found;
          } else {
            var G__56773 = sentinel;
            var G__56774 = m__$2;
            var G__56775 = cljs.core.next.call(null, ks__$1);
            sentinel = G__56773;
            m__$1 = G__56774;
            ks__$1 = G__56775;
            continue;
          }
        }
      } else {
        return m__$1;
      }
      break;
    }
  };
  get_in = function(m, ks, not_found) {
    switch(arguments.length) {
      case 2:
        return get_in__2.call(this, m, ks);
      case 3:
        return get_in__3.call(this, m, ks, not_found);
    }
    throw new Error("Invalid arity: " + arguments.length);
  };
  get_in.cljs$core$IFn$_invoke$arity$2 = get_in__2;
  get_in.cljs$core$IFn$_invoke$arity$3 = get_in__3;
  return get_in;
}();
cljs.core.assoc_in = function assoc_in(m, p__56776, v) {
  var vec__56778 = p__56776;
  var k = cljs.core.nth.call(null, vec__56778, 0, null);
  var ks = cljs.core.nthnext.call(null, vec__56778, 1);
  if (ks) {
    return cljs.core.assoc.call(null, m, k, assoc_in.call(null, cljs.core.get.call(null, m, k), ks, v));
  } else {
    return cljs.core.assoc.call(null, m, k, v);
  }
};
cljs.core.update_in = function() {
  var update_in = null;
  var update_in__3 = function(m, p__56779, f) {
    var vec__56789 = p__56779;
    var k = cljs.core.nth.call(null, vec__56789, 0, null);
    var ks = cljs.core.nthnext.call(null, vec__56789, 1);
    if (ks) {
      return cljs.core.assoc.call(null, m, k, update_in.call(null, cljs.core.get.call(null, m, k), ks, f));
    } else {
      return cljs.core.assoc.call(null, m, k, f.call(null, cljs.core.get.call(null, m, k)));
    }
  };
  var update_in__4 = function(m, p__56780, f, a) {
    var vec__56790 = p__56780;
    var k = cljs.core.nth.call(null, vec__56790, 0, null);
    var ks = cljs.core.nthnext.call(null, vec__56790, 1);
    if (ks) {
      return cljs.core.assoc.call(null, m, k, update_in.call(null, cljs.core.get.call(null, m, k), ks, f, a));
    } else {
      return cljs.core.assoc.call(null, m, k, f.call(null, cljs.core.get.call(null, m, k), a));
    }
  };
  var update_in__5 = function(m, p__56781, f, a, b) {
    var vec__56791 = p__56781;
    var k = cljs.core.nth.call(null, vec__56791, 0, null);
    var ks = cljs.core.nthnext.call(null, vec__56791, 1);
    if (ks) {
      return cljs.core.assoc.call(null, m, k, update_in.call(null, cljs.core.get.call(null, m, k), ks, f, a, b));
    } else {
      return cljs.core.assoc.call(null, m, k, f.call(null, cljs.core.get.call(null, m, k), a, b));
    }
  };
  var update_in__6 = function(m, p__56782, f, a, b, c) {
    var vec__56792 = p__56782;
    var k = cljs.core.nth.call(null, vec__56792, 0, null);
    var ks = cljs.core.nthnext.call(null, vec__56792, 1);
    if (ks) {
      return cljs.core.assoc.call(null, m, k, update_in.call(null, cljs.core.get.call(null, m, k), ks, f, a, b, c));
    } else {
      return cljs.core.assoc.call(null, m, k, f.call(null, cljs.core.get.call(null, m, k), a, b, c));
    }
  };
  var update_in__7 = function() {
    var G__56794__delegate = function(m, p__56783, f, a, b, c, args) {
      var vec__56793 = p__56783;
      var k = cljs.core.nth.call(null, vec__56793, 0, null);
      var ks = cljs.core.nthnext.call(null, vec__56793, 1);
      if (ks) {
        return cljs.core.assoc.call(null, m, k, cljs.core.apply.call(null, update_in, cljs.core.get.call(null, m, k), ks, f, a, b, c, args));
      } else {
        return cljs.core.assoc.call(null, m, k, cljs.core.apply.call(null, f, cljs.core.get.call(null, m, k), a, b, c, args));
      }
    };
    var G__56794 = function(m, p__56783, f, a, b, c, var_args) {
      var args = null;
      if (arguments.length > 6) {
        args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 6), 0);
      }
      return G__56794__delegate.call(this, m, p__56783, f, a, b, c, args);
    };
    G__56794.cljs$lang$maxFixedArity = 6;
    G__56794.cljs$lang$applyTo = function(arglist__56795) {
      var m = cljs.core.first(arglist__56795);
      arglist__56795 = cljs.core.next(arglist__56795);
      var p__56783 = cljs.core.first(arglist__56795);
      arglist__56795 = cljs.core.next(arglist__56795);
      var f = cljs.core.first(arglist__56795);
      arglist__56795 = cljs.core.next(arglist__56795);
      var a = cljs.core.first(arglist__56795);
      arglist__56795 = cljs.core.next(arglist__56795);
      var b = cljs.core.first(arglist__56795);
      arglist__56795 = cljs.core.next(arglist__56795);
      var c = cljs.core.first(arglist__56795);
      var args = cljs.core.rest(arglist__56795);
      return G__56794__delegate(m, p__56783, f, a, b, c, args);
    };
    G__56794.cljs$core$IFn$_invoke$arity$variadic = G__56794__delegate;
    return G__56794;
  }();
  update_in = function(m, p__56783, f, a, b, c, var_args) {
    var args = var_args;
    switch(arguments.length) {
      case 3:
        return update_in__3.call(this, m, p__56783, f);
      case 4:
        return update_in__4.call(this, m, p__56783, f, a);
      case 5:
        return update_in__5.call(this, m, p__56783, f, a, b);
      case 6:
        return update_in__6.call(this, m, p__56783, f, a, b, c);
      default:
        return update_in__7.cljs$core$IFn$_invoke$arity$variadic(m, p__56783, f, a, b, c, cljs.core.array_seq(arguments, 6));
    }
    throw new Error("Invalid arity: " + arguments.length);
  };
  update_in.cljs$lang$maxFixedArity = 6;
  update_in.cljs$lang$applyTo = update_in__7.cljs$lang$applyTo;
  update_in.cljs$core$IFn$_invoke$arity$3 = update_in__3;
  update_in.cljs$core$IFn$_invoke$arity$4 = update_in__4;
  update_in.cljs$core$IFn$_invoke$arity$5 = update_in__5;
  update_in.cljs$core$IFn$_invoke$arity$6 = update_in__6;
  update_in.cljs$core$IFn$_invoke$arity$variadic = update_in__7.cljs$core$IFn$_invoke$arity$variadic;
  return update_in;
}();
cljs.core.VectorNode = function(edit, arr) {
  this.edit = edit;
  this.arr = arr;
};
cljs.core.VectorNode.cljs$lang$type = true;
cljs.core.VectorNode.cljs$lang$ctorStr = "cljs.core/VectorNode";
cljs.core.VectorNode.cljs$lang$ctorPrWriter = function(this__4218__auto__, writer__4219__auto__, opts__4220__auto__) {
  return cljs.core._write.call(null, writer__4219__auto__, "cljs.core/VectorNode");
};
cljs.core.__GT_VectorNode = function __GT_VectorNode(edit, arr) {
  return new cljs.core.VectorNode(edit, arr);
};
cljs.core.pv_fresh_node = function pv_fresh_node(edit) {
  return new cljs.core.VectorNode(edit, [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null]);
};
cljs.core.pv_aget = function pv_aget(node, idx) {
  return node.arr[idx];
};
cljs.core.pv_aset = function pv_aset(node, idx, val) {
  return node.arr[idx] = val;
};
cljs.core.pv_clone_node = function pv_clone_node(node) {
  return new cljs.core.VectorNode(node.edit, cljs.core.aclone.call(null, node.arr));
};
cljs.core.tail_off = function tail_off(pv) {
  var cnt = pv.cnt;
  if (cnt < 32) {
    return 0;
  } else {
    return cnt - 1 >>> 5 << 5;
  }
};
cljs.core.new_path = function new_path(edit, level, node) {
  var ll = level;
  var ret = node;
  while (true) {
    if (ll === 0) {
      return ret;
    } else {
      var embed = ret;
      var r = cljs.core.pv_fresh_node.call(null, edit);
      var _ = cljs.core.pv_aset.call(null, r, 0, embed);
      var G__56796 = ll - 5;
      var G__56797 = r;
      ll = G__56796;
      ret = G__56797;
      continue;
    }
    break;
  }
};
cljs.core.push_tail = function push_tail(pv, level, parent, tailnode) {
  var ret = cljs.core.pv_clone_node.call(null, parent);
  var subidx = pv.cnt - 1 >>> level & 31;
  if (5 === level) {
    cljs.core.pv_aset.call(null, ret, subidx, tailnode);
    return ret;
  } else {
    var child = cljs.core.pv_aget.call(null, parent, subidx);
    if (!(child == null)) {
      var node_to_insert = push_tail.call(null, pv, level - 5, child, tailnode);
      cljs.core.pv_aset.call(null, ret, subidx, node_to_insert);
      return ret;
    } else {
      var node_to_insert = cljs.core.new_path.call(null, null, level - 5, tailnode);
      cljs.core.pv_aset.call(null, ret, subidx, node_to_insert);
      return ret;
    }
  }
};
cljs.core.vector_index_out_of_bounds = function vector_index_out_of_bounds(i, cnt) {
  throw new Error("No item " + cljs.core.str.cljs$core$IFn$_invoke$arity$1(i) + " in vector of length " + cljs.core.str.cljs$core$IFn$_invoke$arity$1(cnt));
};
cljs.core.first_array_for_longvec = function first_array_for_longvec(pv) {
  var node = pv.root;
  var level = pv.shift;
  while (true) {
    if (level > 0) {
      var G__56798 = cljs.core.pv_aget.call(null, node, 0);
      var G__56799 = level - 5;
      node = G__56798;
      level = G__56799;
      continue;
    } else {
      return node.arr;
    }
    break;
  }
};
cljs.core.unchecked_array_for = function unchecked_array_for(pv, i) {
  if (i >= cljs.core.tail_off.call(null, pv)) {
    return pv.tail;
  } else {
    var node = pv.root;
    var level = pv.shift;
    while (true) {
      if (level > 0) {
        var G__56800 = cljs.core.pv_aget.call(null, node, i >>> level & 31);
        var G__56801 = level - 5;
        node = G__56800;
        level = G__56801;
        continue;
      } else {
        return node.arr;
      }
      break;
    }
  }
};
cljs.core.array_for = function array_for(pv, i) {
  if (0 <= i && i < pv.cnt) {
    return cljs.core.unchecked_array_for.call(null, pv, i);
  } else {
    return cljs.core.vector_index_out_of_bounds.call(null, i, pv.cnt);
  }
};
cljs.core.do_assoc = function do_assoc(pv, level, node, i, val) {
  var ret = cljs.core.pv_clone_node.call(null, node);
  if (level === 0) {
    cljs.core.pv_aset.call(null, ret, i & 31, val);
    return ret;
  } else {
    var subidx = i >>> level & 31;
    cljs.core.pv_aset.call(null, ret, subidx, do_assoc.call(null, pv, level - 5, cljs.core.pv_aget.call(null, node, subidx), i, val));
    return ret;
  }
};
cljs.core.pop_tail = function pop_tail(pv, level, node) {
  var subidx = pv.cnt - 2 >>> level & 31;
  if (level > 5) {
    var new_child = pop_tail.call(null, pv, level - 5, cljs.core.pv_aget.call(null, node, subidx));
    if (new_child == null && subidx === 0) {
      return null;
    } else {
      var ret = cljs.core.pv_clone_node.call(null, node);
      cljs.core.pv_aset.call(null, ret, subidx, new_child);
      return ret;
    }
  } else {
    if (subidx === 0) {
      return null;
    } else {
      var ret = cljs.core.pv_clone_node.call(null, node);
      cljs.core.pv_aset.call(null, ret, subidx, null);
      return ret;
    }
  }
};
cljs.core.PersistentVector = function(meta, cnt, shift, root, tail, __hash) {
  this.meta = meta;
  this.cnt = cnt;
  this.shift = shift;
  this.root = root;
  this.tail = tail;
  this.__hash = __hash;
  this.cljs$lang$protocol_mask$partition0$ = 167668511;
  this.cljs$lang$protocol_mask$partition1$ = 8196;
};
cljs.core.PersistentVector.cljs$lang$type = true;
cljs.core.PersistentVector.cljs$lang$ctorStr = "cljs.core/PersistentVector";
cljs.core.PersistentVector.cljs$lang$ctorPrWriter = function(this__4215__auto__, writer__4216__auto__, opt__4217__auto__) {
  return cljs.core._write.call(null, writer__4216__auto__, "cljs.core/PersistentVector");
};
cljs.core.PersistentVector.prototype.toString = function() {
  var self__ = this;
  var coll = this;
  return cljs.core.pr_str_STAR_.call(null, coll);
};
cljs.core.PersistentVector.prototype.equiv = function(other) {
  var self__ = this;
  var this$ = this;
  return this$.cljs$core$IEquiv$_equiv$arity$2(null, other);
};
cljs.core.PersistentVector.prototype.cljs$core$ILookup$_lookup$arity$2 = function(coll, k) {
  var self__ = this;
  var coll__$1 = this;
  return cljs.core._lookup.call(null, coll__$1, k, null);
};
cljs.core.PersistentVector.prototype.cljs$core$ILookup$_lookup$arity$3 = function(coll, k, not_found) {
  var self__ = this;
  var coll__$1 = this;
  if (typeof k === "number") {
    return cljs.core._nth.call(null, coll__$1, k, not_found);
  } else {
    return not_found;
  }
};
cljs.core.PersistentVector.prototype.cljs$core$IKVReduce$_kv_reduce$arity$3 = function(v, f, init) {
  var self__ = this;
  var v__$1 = this;
  var i = 0;
  var init__$1 = init;
  while (true) {
    if (i < self__.cnt) {
      var arr = cljs.core.unchecked_array_for.call(null, v__$1, i);
      var len = arr.length;
      var init__$2 = function() {
        var j = 0;
        var init__$2 = init__$1;
        while (true) {
          if (j < len) {
            var init__$3 = f.call(null, init__$2, j + i, arr[j]);
            if (cljs.core.reduced_QMARK_.call(null, init__$3)) {
              return init__$3;
            } else {
              var G__56803 = j + 1;
              var G__56804 = init__$3;
              j = G__56803;
              init__$2 = G__56804;
              continue;
            }
          } else {
            return init__$2;
          }
          break;
        }
      }();
      if (cljs.core.reduced_QMARK_.call(null, init__$2)) {
        return cljs.core.deref.call(null, init__$2);
      } else {
        var G__56805 = i + len;
        var G__56806 = init__$2;
        i = G__56805;
        init__$1 = G__56806;
        continue;
      }
    } else {
      return init__$1;
    }
    break;
  }
};
cljs.core.PersistentVector.prototype.cljs$core$IIndexed$_nth$arity$2 = function(coll, n) {
  var self__ = this;
  var coll__$1 = this;
  return cljs.core.array_for.call(null, coll__$1, n)[n & 31];
};
cljs.core.PersistentVector.prototype.cljs$core$IIndexed$_nth$arity$3 = function(coll, n, not_found) {
  var self__ = this;
  var coll__$1 = this;
  if (0 <= n && n < self__.cnt) {
    return cljs.core.unchecked_array_for.call(null, coll__$1, n)[n & 31];
  } else {
    return not_found;
  }
};
cljs.core.PersistentVector.prototype.cljs$core$IVector$_assoc_n$arity$3 = function(coll, n, val) {
  var self__ = this;
  var coll__$1 = this;
  if (0 <= n && n < self__.cnt) {
    if (cljs.core.tail_off.call(null, coll__$1) <= n) {
      var new_tail = cljs.core.aclone.call(null, self__.tail);
      new_tail[n & 31] = val;
      return new cljs.core.PersistentVector(self__.meta, self__.cnt, self__.shift, self__.root, new_tail, null);
    } else {
      return new cljs.core.PersistentVector(self__.meta, self__.cnt, self__.shift, cljs.core.do_assoc.call(null, coll__$1, self__.shift, self__.root, n, val), self__.tail, null);
    }
  } else {
    if (n === self__.cnt) {
      return cljs.core._conj.call(null, coll__$1, val);
    } else {
      throw new Error("Index " + cljs.core.str.cljs$core$IFn$_invoke$arity$1(n) + " out of bounds  [0," + cljs.core.str.cljs$core$IFn$_invoke$arity$1(self__.cnt) + "]");
    }
  }
};
cljs.core.PersistentVector.prototype.cljs$core$IMeta$_meta$arity$1 = function(coll) {
  var self__ = this;
  var coll__$1 = this;
  return self__.meta;
};
cljs.core.PersistentVector.prototype.cljs$core$ICloneable$_clone$arity$1 = function(_) {
  var self__ = this;
  var ___$1 = this;
  return new cljs.core.PersistentVector(self__.meta, self__.cnt, self__.shift, self__.root, self__.tail, self__.__hash);
};
cljs.core.PersistentVector.prototype.cljs$core$ICounted$_count$arity$1 = function(coll) {
  var self__ = this;
  var coll__$1 = this;
  return self__.cnt;
};
cljs.core.PersistentVector.prototype.cljs$core$IMapEntry$_key$arity$1 = function(coll) {
  var self__ = this;
  var coll__$1 = this;
  return cljs.core._nth.call(null, coll__$1, 0);
};
cljs.core.PersistentVector.prototype.cljs$core$IMapEntry$_val$arity$1 = function(coll) {
  var self__ = this;
  var coll__$1 = this;
  return cljs.core._nth.call(null, coll__$1, 1);
};
cljs.core.PersistentVector.prototype.cljs$core$IStack$_peek$arity$1 = function(coll) {
  var self__ = this;
  var coll__$1 = this;
  if (self__.cnt > 0) {
    return cljs.core._nth.call(null, coll__$1, self__.cnt - 1);
  } else {
    return null;
  }
};
cljs.core.PersistentVector.prototype.cljs$core$IStack$_pop$arity$1 = function(coll) {
  var self__ = this;
  var coll__$1 = this;
  if (self__.cnt === 0) {
    throw new Error("Can't pop empty vector");
  } else {
    if (1 === self__.cnt) {
      return cljs.core._with_meta.call(null, cljs.core.PersistentVector.EMPTY, self__.meta);
    } else {
      if (1 < self__.cnt - cljs.core.tail_off.call(null, coll__$1)) {
        return new cljs.core.PersistentVector(self__.meta, self__.cnt - 1, self__.shift, self__.root, self__.tail.slice(0, -1), null);
      } else {
        var new_tail = cljs.core.unchecked_array_for.call(null, coll__$1, self__.cnt - 2);
        var nr = cljs.core.pop_tail.call(null, coll__$1, self__.shift, self__.root);
        var new_root = nr == null ? cljs.core.PersistentVector.EMPTY_NODE : nr;
        var cnt_1 = self__.cnt - 1;
        if (5 < self__.shift && cljs.core.pv_aget.call(null, new_root, 1) == null) {
          return new cljs.core.PersistentVector(self__.meta, cnt_1, self__.shift - 5, cljs.core.pv_aget.call(null, new_root, 0), new_tail, null);
        } else {
          return new cljs.core.PersistentVector(self__.meta, cnt_1, self__.shift, new_root, new_tail, null);
        }
      }
    }
  }
};
cljs.core.PersistentVector.prototype.cljs$core$IReversible$_rseq$arity$1 = function(coll) {
  var self__ = this;
  var coll__$1 = this;
  if (self__.cnt > 0) {
    return new cljs.core.RSeq(coll__$1, self__.cnt - 1, null);
  } else {
    return null;
  }
};
cljs.core.PersistentVector.prototype.cljs$core$IHash$_hash$arity$1 = function(coll) {
  var self__ = this;
  var coll__$1 = this;
  var h__4050__auto__ = self__.__hash;
  if (!(h__4050__auto__ == null)) {
    return h__4050__auto__;
  } else {
    var h__4050__auto____$1 = cljs.core.hash_ordered_coll.call(null, coll__$1);
    self__.__hash = h__4050__auto____$1;
    return h__4050__auto____$1;
  }
};
cljs.core.PersistentVector.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(coll, other) {
  var self__ = this;
  var coll__$1 = this;
  return cljs.core.equiv_sequential.call(null, coll__$1, other);
};
cljs.core.PersistentVector.prototype.cljs$core$IEditableCollection$_as_transient$arity$1 = function(coll) {
  var self__ = this;
  var coll__$1 = this;
  return new cljs.core.TransientVector(self__.cnt, self__.shift, cljs.core.tv_editable_root.call(null, self__.root), cljs.core.tv_editable_tail.call(null, self__.tail));
};
cljs.core.PersistentVector.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(coll) {
  var self__ = this;
  var coll__$1 = this;
  return cljs.core.with_meta.call(null, cljs.core.PersistentVector.EMPTY, self__.meta);
};
cljs.core.PersistentVector.prototype.cljs$core$IReduce$_reduce$arity$2 = function(v, f) {
  var self__ = this;
  var v__$1 = this;
  return cljs.core.ci_reduce.call(null, v__$1, f);
};
cljs.core.PersistentVector.prototype.cljs$core$IReduce$_reduce$arity$3 = function(v, f, init) {
  var self__ = this;
  var v__$1 = this;
  var i = 0;
  var init__$1 = init;
  while (true) {
    if (i < self__.cnt) {
      var arr = cljs.core.unchecked_array_for.call(null, v__$1, i);
      var len = arr.length;
      var init__$2 = function() {
        var j = 0;
        var init__$2 = init__$1;
        while (true) {
          if (j < len) {
            var init__$3 = f.call(null, init__$2, arr[j]);
            if (cljs.core.reduced_QMARK_.call(null, init__$3)) {
              return init__$3;
            } else {
              var G__56807 = j + 1;
              var G__56808 = init__$3;
              j = G__56807;
              init__$2 = G__56808;
              continue;
            }
          } else {
            return init__$2;
          }
          break;
        }
      }();
      if (cljs.core.reduced_QMARK_.call(null, init__$2)) {
        return cljs.core.deref.call(null, init__$2);
      } else {
        var G__56809 = i + len;
        var G__56810 = init__$2;
        i = G__56809;
        init__$1 = G__56810;
        continue;
      }
    } else {
      return init__$1;
    }
    break;
  }
};
cljs.core.PersistentVector.prototype.cljs$core$IAssociative$_assoc$arity$3 = function(coll, k, v) {
  var self__ = this;
  var coll__$1 = this;
  if (typeof k === "number") {
    return cljs.core._assoc_n.call(null, coll__$1, k, v);
  } else {
    throw new Error("Vector's key for assoc must be a number.");
  }
};
cljs.core.PersistentVector.prototype.cljs$core$ISeqable$_seq$arity$1 = function(coll) {
  var self__ = this;
  var coll__$1 = this;
  if (self__.cnt === 0) {
    return null;
  } else {
    if (self__.cnt <= 32) {
      return new cljs.core.IndexedSeq(self__.tail, 0);
    } else {
      return cljs.core.chunked_seq.call(null, coll__$1, cljs.core.first_array_for_longvec.call(null, coll__$1), 0, 0);
    }
  }
};
cljs.core.PersistentVector.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(coll, meta__$1) {
  var self__ = this;
  var coll__$1 = this;
  return new cljs.core.PersistentVector(meta__$1, self__.cnt, self__.shift, self__.root, self__.tail, self__.__hash);
};
cljs.core.PersistentVector.prototype.cljs$core$ICollection$_conj$arity$2 = function(coll, o) {
  var self__ = this;
  var coll__$1 = this;
  if (self__.cnt - cljs.core.tail_off.call(null, coll__$1) < 32) {
    var len = self__.tail.length;
    var new_tail = new Array(len + 1);
    var n__4508__auto___56811 = len;
    var i_56812 = 0;
    while (true) {
      if (i_56812 < n__4508__auto___56811) {
        new_tail[i_56812] = self__.tail[i_56812];
        var G__56813 = i_56812 + 1;
        i_56812 = G__56813;
        continue;
      } else {
      }
      break;
    }
    new_tail[len] = o;
    return new cljs.core.PersistentVector(self__.meta, self__.cnt + 1, self__.shift, self__.root, new_tail, null);
  } else {
    var root_overflow_QMARK_ = self__.cnt >>> 5 > 1 << self__.shift;
    var new_shift = root_overflow_QMARK_ ? self__.shift + 5 : self__.shift;
    var new_root = root_overflow_QMARK_ ? function() {
      var n_r = cljs.core.pv_fresh_node.call(null, null);
      cljs.core.pv_aset.call(null, n_r, 0, self__.root);
      cljs.core.pv_aset.call(null, n_r, 1, cljs.core.new_path.call(null, null, self__.shift, new cljs.core.VectorNode(null, self__.tail)));
      return n_r;
    }() : cljs.core.push_tail.call(null, coll__$1, self__.shift, self__.root, new cljs.core.VectorNode(null, self__.tail));
    return new cljs.core.PersistentVector(self__.meta, self__.cnt + 1, new_shift, new_root, [o], null);
  }
};
cljs.core.PersistentVector.prototype.call = function() {
  var G__56814 = null;
  var G__56814__2 = function(self__, k) {
    var self__ = this;
    var self____$1 = this;
    var coll = self____$1;
    return coll.cljs$core$IIndexed$_nth$arity$2(null, k);
  };
  var G__56814__3 = function(self__, k, not_found) {
    var self__ = this;
    var self____$1 = this;
    var coll = self____$1;
    return coll.cljs$core$IIndexed$_nth$arity$3(null, k, not_found);
  };
  G__56814 = function(self__, k, not_found) {
    switch(arguments.length) {
      case 2:
        return G__56814__2.call(this, self__, k);
      case 3:
        return G__56814__3.call(this, self__, k, not_found);
    }
    throw new Error("Invalid arity: " + arguments.length);
  };
  G__56814.cljs$core$IFn$_invoke$arity$2 = G__56814__2;
  G__56814.cljs$core$IFn$_invoke$arity$3 = G__56814__3;
  return G__56814;
}();
cljs.core.PersistentVector.prototype.apply = function(self__, args56802) {
  var self__ = this;
  var self____$1 = this;
  return self____$1.call.apply(self____$1, [self____$1].concat(cljs.core.aclone.call(null, args56802)));
};
cljs.core.PersistentVector.prototype.cljs$core$IFn$_invoke$arity$1 = function(k) {
  var self__ = this;
  var coll = this;
  return coll.cljs$core$IIndexed$_nth$arity$2(null, k);
};
cljs.core.PersistentVector.prototype.cljs$core$IFn$_invoke$arity$2 = function(k, not_found) {
  var self__ = this;
  var coll = this;
  return coll.cljs$core$IIndexed$_nth$arity$3(null, k, not_found);
};
cljs.core.__GT_PersistentVector = function __GT_PersistentVector(meta, cnt, shift, root, tail, __hash) {
  return new cljs.core.PersistentVector(meta, cnt, shift, root, tail, __hash);
};
cljs.core.PersistentVector.EMPTY_NODE = new cljs.core.VectorNode(null, [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null]);
cljs.core.PersistentVector.EMPTY = new cljs.core.PersistentVector(null, 0, 5, cljs.core.PersistentVector.EMPTY_NODE, [], 0);
cljs.core.PersistentVector.fromArray = function(xs, no_clone) {
  var l = xs.length;
  var xs__$1 = no_clone ? xs : cljs.core.aclone.call(null, xs);
  if (l < 32) {
    return new cljs.core.PersistentVector(null, l, 5, cljs.core.PersistentVector.EMPTY_NODE, xs__$1, null);
  } else {
    var node = xs__$1.slice(0, 32);
    var v = new cljs.core.PersistentVector(null, 32, 5, cljs.core.PersistentVector.EMPTY_NODE, node, null);
    var i = 32;
    var out = cljs.core._as_transient.call(null, v);
    while (true) {
      if (i < l) {
        var G__56815 = i + 1;
        var G__56816 = cljs.core.conj_BANG_.call(null, out, xs__$1[i]);
        i = G__56815;
        out = G__56816;
        continue;
      } else {
        return cljs.core.persistent_BANG_.call(null, out);
      }
      break;
    }
  }
};
cljs.core.vec = function vec(coll) {
  return cljs.core._persistent_BANG_.call(null, cljs.core.reduce.call(null, cljs.core._conj_BANG_, cljs.core._as_transient.call(null, cljs.core.PersistentVector.EMPTY), coll));
};
cljs.core.vector = function() {
  var vector__delegate = function(args) {
    if (args instanceof cljs.core.IndexedSeq && args.i === 0) {
      return cljs.core.PersistentVector.fromArray(args.arr, true);
    } else {
      return cljs.core.vec.call(null, args);
    }
  };
  var vector = function(var_args) {
    var args = null;
    if (arguments.length > 0) {
      args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0);
    }
    return vector__delegate.call(this, args);
  };
  vector.cljs$lang$maxFixedArity = 0;
  vector.cljs$lang$applyTo = function(arglist__56817) {
    var args = cljs.core.seq(arglist__56817);
    return vector__delegate(args);
  };
  vector.cljs$core$IFn$_invoke$arity$variadic = vector__delegate;
  return vector;
}();
cljs.core.ChunkedSeq = function(vec, node, i, off, meta, __hash) {
  this.vec = vec;
  this.node = node;
  this.i = i;
  this.off = off;
  this.meta = meta;
  this.__hash = __hash;
  this.cljs$lang$protocol_mask$partition0$ = 32375020;
  this.cljs$lang$protocol_mask$partition1$ = 1536;
};
cljs.core.ChunkedSeq.cljs$lang$type = true;
cljs.core.ChunkedSeq.cljs$lang$ctorStr = "cljs.core/ChunkedSeq";
cljs.core.ChunkedSeq.cljs$lang$ctorPrWriter = function(this__4215__auto__, writer__4216__auto__, opt__4217__auto__) {
  return cljs.core._write.call(null, writer__4216__auto__, "cljs.core/ChunkedSeq");
};
cljs.core.ChunkedSeq.prototype.toString = function() {
  var self__ = this;
  var coll = this;
  return cljs.core.pr_str_STAR_.call(null, coll);
};
cljs.core.ChunkedSeq.prototype.equiv = function(other) {
  var self__ = this;
  var this$ = this;
  return this$.cljs$core$IEquiv$_equiv$arity$2(null, other);
};
cljs.core.ChunkedSeq.prototype.cljs$core$IMeta$_meta$arity$1 = function(coll) {
  var self__ = this;
  var coll__$1 = this;
  return self__.meta;
};
cljs.core.ChunkedSeq.prototype.cljs$core$INext$_next$arity$1 = function(coll) {
  var self__ = this;
  var coll__$1 = this;
  if (self__.off + 1 < self__.node.length) {
    var s = cljs.core.chunked_seq.call(null, self__.vec, self__.node, self__.i, self__.off + 1);
    if (s == null) {
      return null;
    } else {
      return s;
    }
  } else {
    return cljs.core._chunked_next.call(null, coll__$1);
  }
};
cljs.core.ChunkedSeq.prototype.cljs$core$IHash$_hash$arity$1 = function(coll) {
  var self__ = this;
  var coll__$1 = this;
  var h__4050__auto__ = self__.__hash;
  if (!(h__4050__auto__ == null)) {
    return h__4050__auto__;
  } else {
    var h__4050__auto____$1 = cljs.core.hash_ordered_coll.call(null, coll__$1);
    self__.__hash = h__4050__auto____$1;
    return h__4050__auto____$1;
  }
};
cljs.core.ChunkedSeq.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(coll, other) {
  var self__ = this;
  var coll__$1 = this;
  return cljs.core.equiv_sequential.call(null, coll__$1, other);
};
cljs.core.ChunkedSeq.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(coll) {
  var self__ = this;
  var coll__$1 = this;
  return cljs.core.with_meta.call(null, cljs.core.PersistentVector.EMPTY, self__.meta);
};
cljs.core.ChunkedSeq.prototype.cljs$core$IReduce$_reduce$arity$2 = function(coll, f) {
  var self__ = this;
  var coll__$1 = this;
  return cljs.core.ci_reduce.call(null, cljs.core.subvec.call(null, self__.vec, self__.i + self__.off, cljs.core.count.call(null, self__.vec)), f);
};
cljs.core.ChunkedSeq.prototype.cljs$core$IReduce$_reduce$arity$3 = function(coll, f, start) {
  var self__ = this;
  var coll__$1 = this;
  return cljs.core.ci_reduce.call(null, cljs.core.subvec.call(null, self__.vec, self__.i + self__.off, cljs.core.count.call(null, self__.vec)), f, start);
};
cljs.core.ChunkedSeq.prototype.cljs$core$ISeq$_first$arity$1 = function(coll) {
  var self__ = this;
  var coll__$1 = this;
  return self__.node[self__.off];
};
cljs.core.ChunkedSeq.prototype.cljs$core$ISeq$_rest$arity$1 = function(coll) {
  var self__ = this;
  var coll__$1 = this;
  if (self__.off + 1 < self__.node.length) {
    var s = cljs.core.chunked_seq.call(null, self__.vec, self__.node, self__.i, self__.off + 1);
    if (s == null) {
      return cljs.core.List.EMPTY;
    } else {
      return s;
    }
  } else {
    return cljs.core._chunked_rest.call(null, coll__$1);
  }
};
cljs.core.ChunkedSeq.prototype.cljs$core$ISeqable$_seq$arity$1 = function(coll) {
  var self__ = this;
  var coll__$1 = this;
  return coll__$1;
};
cljs.core.ChunkedSeq.prototype.cljs$core$IChunkedSeq$_chunked_first$arity$1 = function(coll) {
  var self__ = this;
  var coll__$1 = this;
  return cljs.core.array_chunk.call(null, self__.node, self__.off);
};
cljs.core.ChunkedSeq.prototype.cljs$core$IChunkedSeq$_chunked_rest$arity$1 = function(coll) {
  var self__ = this;
  var coll__$1 = this;
  var end = self__.i + self__.node.length;
  if (end < cljs.core._count.call(null, self__.vec)) {
    return cljs.core.chunked_seq.call(null, self__.vec, cljs.core.unchecked_array_for.call(null, self__.vec, end), end, 0);
  } else {
    return cljs.core.List.EMPTY;
  }
};
cljs.core.ChunkedSeq.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(coll, m) {
  var self__ = this;
  var coll__$1 = this;
  return cljs.core.chunked_seq.call(null, self__.vec, self__.node, self__.i, self__.off, m);
};
cljs.core.ChunkedSeq.prototype.cljs$core$ICollection$_conj$arity$2 = function(coll, o) {
  var self__ = this;
  var coll__$1 = this;
  return cljs.core.cons.call(null, o, coll__$1);
};
cljs.core.ChunkedSeq.prototype.cljs$core$IChunkedNext$_chunked_next$arity$1 = function(coll) {
  var self__ = this;
  var coll__$1 = this;
  var end = self__.i + self__.node.length;
  if (end < cljs.core._count.call(null, self__.vec)) {
    return cljs.core.chunked_seq.call(null, self__.vec, cljs.core.unchecked_array_for.call(null, self__.vec, end), end, 0);
  } else {
    return null;
  }
};
cljs.core.__GT_ChunkedSeq = function __GT_ChunkedSeq(vec, node, i, off, meta, __hash) {
  return new cljs.core.ChunkedSeq(vec, node, i, off, meta, __hash);
};
cljs.core.chunked_seq = function() {
  var chunked_seq = null;
  var chunked_seq__3 = function(vec, i, off) {
    return new cljs.core.ChunkedSeq(vec, cljs.core.array_for.call(null, vec, i), i, off, null, null);
  };
  var chunked_seq__4 = function(vec, node, i, off) {
    return new cljs.core.ChunkedSeq(vec, node, i, off, null, null);
  };
  var chunked_seq__5 = function(vec, node, i, off, meta) {
    return new cljs.core.ChunkedSeq(vec, node, i, off, meta, null);
  };
  chunked_seq = function(vec, node, i, off, meta) {
    switch(arguments.length) {
      case 3:
        return chunked_seq__3.call(this, vec, node, i);
      case 4:
        return chunked_seq__4.call(this, vec, node, i, off);
      case 5:
        return chunked_seq__5.call(this, vec, node, i, off, meta);
    }
    throw new Error("Invalid arity: " + arguments.length);
  };
  chunked_seq.cljs$core$IFn$_invoke$arity$3 = chunked_seq__3;
  chunked_seq.cljs$core$IFn$_invoke$arity$4 = chunked_seq__4;
  chunked_seq.cljs$core$IFn$_invoke$arity$5 = chunked_seq__5;
  return chunked_seq;
}();
cljs.core.Subvec = function(meta, v, start, end, __hash) {
  this.meta = meta;
  this.v = v;
  this.start = start;
  this.end = end;
  this.__hash = __hash;
  this.cljs$lang$protocol_mask$partition0$ = 166617887;
  this.cljs$lang$protocol_mask$partition1$ = 8192;
};
cljs.core.Subvec.cljs$lang$type = true;
cljs.core.Subvec.cljs$lang$ctorStr = "cljs.core/Subvec";
cljs.core.Subvec.cljs$lang$ctorPrWriter = function(this__4215__auto__, writer__4216__auto__, opt__4217__auto__) {
  return cljs.core._write.call(null, writer__4216__auto__, "cljs.core/Subvec");
};
cljs.core.Subvec.prototype.toString = function() {
  var self__ = this;
  var coll = this;
  return cljs.core.pr_str_STAR_.call(null, coll);
};
cljs.core.Subvec.prototype.equiv = function(other) {
  var self__ = this;
  var this$ = this;
  return this$.cljs$core$IEquiv$_equiv$arity$2(null, other);
};
cljs.core.Subvec.prototype.cljs$core$ILookup$_lookup$arity$2 = function(coll, k) {
  var self__ = this;
  var coll__$1 = this;
  return cljs.core._lookup.call(null, coll__$1, k, null);
};
cljs.core.Subvec.prototype.cljs$core$ILookup$_lookup$arity$3 = function(coll, k, not_found) {
  var self__ = this;
  var coll__$1 = this;
  if (typeof k === "number") {
    return cljs.core._nth.call(null, coll__$1, k, not_found);
  } else {
    return not_found;
  }
};
cljs.core.Subvec.prototype.cljs$core$IIndexed$_nth$arity$2 = function(coll, n) {
  var self__ = this;
  var coll__$1 = this;
  if (n < 0 || self__.end <= self__.start + n) {
    return cljs.core.vector_index_out_of_bounds.call(null, n, self__.end - self__.start);
  } else {
    return cljs.core._nth.call(null, self__.v, self__.start + n);
  }
};
cljs.core.Subvec.prototype.cljs$core$IIndexed$_nth$arity$3 = function(coll, n, not_found) {
  var self__ = this;
  var coll__$1 = this;
  if (n < 0 || self__.end <= self__.start + n) {
    return not_found;
  } else {
    return cljs.core._nth.call(null, self__.v, self__.start + n, not_found);
  }
};
cljs.core.Subvec.prototype.cljs$core$IVector$_assoc_n$arity$3 = function(coll, n, val) {
  var self__ = this;
  var coll__$1 = this;
  var v_pos = self__.start + n;
  return cljs.core.build_subvec.call(null, self__.meta, cljs.core.assoc.call(null, self__.v, v_pos, val), self__.start, function() {
    var x__3946__auto__ = self__.end;
    var y__3947__auto__ = v_pos + 1;
    return x__3946__auto__ > y__3947__auto__ ? x__3946__auto__ : y__3947__auto__;
  }(), null);
};
cljs.core.Subvec.prototype.cljs$core$IMeta$_meta$arity$1 = function(coll) {
  var self__ = this;
  var coll__$1 = this;
  return self__.meta;
};
cljs.core.Subvec.prototype.cljs$core$ICloneable$_clone$arity$1 = function(_) {
  var self__ = this;
  var ___$1 = this;
  return new cljs.core.Subvec(self__.meta, self__.v, self__.start, self__.end, self__.__hash);
};
cljs.core.Subvec.prototype.cljs$core$ICounted$_count$arity$1 = function(coll) {
  var self__ = this;
  var coll__$1 = this;
  return self__.end - self__.start;
};
cljs.core.Subvec.prototype.cljs$core$IStack$_peek$arity$1 = function(coll) {
  var self__ = this;
  var coll__$1 = this;
  return cljs.core._nth.call(null, self__.v, self__.end - 1);
};
cljs.core.Subvec.prototype.cljs$core$IStack$_pop$arity$1 = function(coll) {
  var self__ = this;
  var coll__$1 = this;
  if (self__.start === self__.end) {
    throw new Error("Can't pop empty vector");
  } else {
    return cljs.core.build_subvec.call(null, self__.meta, self__.v, self__.start, self__.end - 1, null);
  }
};
cljs.core.Subvec.prototype.cljs$core$IReversible$_rseq$arity$1 = function(coll) {
  var self__ = this;
  var coll__$1 = this;
  if (!(self__.start === self__.end)) {
    return new cljs.core.RSeq(coll__$1, self__.end - self__.start - 1, null);
  } else {
    return null;
  }
};
cljs.core.Subvec.prototype.cljs$core$IHash$_hash$arity$1 = function(coll) {
  var self__ = this;
  var coll__$1 = this;
  var h__4050__auto__ = self__.__hash;
  if (!(h__4050__auto__ == null)) {
    return h__4050__auto__;
  } else {
    var h__4050__auto____$1 = cljs.core.hash_ordered_coll.call(null, coll__$1);
    self__.__hash = h__4050__auto____$1;
    return h__4050__auto____$1;
  }
};
cljs.core.Subvec.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(coll, other) {
  var self__ = this;
  var coll__$1 = this;
  return cljs.core.equiv_sequential.call(null, coll__$1, other);
};
cljs.core.Subvec.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(coll) {
  var self__ = this;
  var coll__$1 = this;
  return cljs.core.with_meta.call(null, cljs.core.PersistentVector.EMPTY, self__.meta);
};
cljs.core.Subvec.prototype.cljs$core$IReduce$_reduce$arity$2 = function(coll, f) {
  var self__ = this;
  var coll__$1 = this;
  return cljs.core.ci_reduce.call(null, coll__$1, f);
};
cljs.core.Subvec.prototype.cljs$core$IReduce$_reduce$arity$3 = function(coll, f, start__$1) {
  var self__ = this;
  var coll__$1 = this;
  return cljs.core.ci_reduce.call(null, coll__$1, f, start__$1);
};
cljs.core.Subvec.prototype.cljs$core$IAssociative$_assoc$arity$3 = function(coll, key, val) {
  var self__ = this;
  var coll__$1 = this;
  if (typeof key === "number") {
    return cljs.core._assoc_n.call(null, coll__$1, key, val);
  } else {
    throw new Error("Subvec's key for assoc must be a number.");
  }
};
cljs.core.Subvec.prototype.cljs$core$ISeqable$_seq$arity$1 = function(coll) {
  var self__ = this;
  var coll__$1 = this;
  var subvec_seq = function(coll__$1) {
    return function subvec_seq(i) {
      if (i === self__.end) {
        return null;
      } else {
        return cljs.core.cons.call(null, cljs.core._nth.call(null, self__.v, i), new cljs.core.LazySeq(null, function(coll__$1) {
          return function() {
            return subvec_seq.call(null, i + 1);
          };
        }(coll__$1), null, null));
      }
    };
  }(coll__$1);
  return subvec_seq.call(null, self__.start);
};
cljs.core.Subvec.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(coll, meta__$1) {
  var self__ = this;
  var coll__$1 = this;
  return cljs.core.build_subvec.call(null, meta__$1, self__.v, self__.start, self__.end, self__.__hash);
};
cljs.core.Subvec.prototype.cljs$core$ICollection$_conj$arity$2 = function(coll, o) {
  var self__ = this;
  var coll__$1 = this;
  return cljs.core.build_subvec.call(null, self__.meta, cljs.core._assoc_n.call(null, self__.v, self__.end, o), self__.start, self__.end + 1, null);
};
cljs.core.Subvec.prototype.call = function() {
  var G__56819 = null;
  var G__56819__2 = function(self__, k) {
    var self__ = this;
    var self____$1 = this;
    var coll = self____$1;
    return coll.cljs$core$IIndexed$_nth$arity$2(null, k);
  };
  var G__56819__3 = function(self__, k, not_found) {
    var self__ = this;
    var self____$1 = this;
    var coll = self____$1;
    return coll.cljs$core$IIndexed$_nth$arity$3(null, k, not_found);
  };
  G__56819 = function(self__, k, not_found) {
    switch(arguments.length) {
      case 2:
        return G__56819__2.call(this, self__, k);
      case 3:
        return G__56819__3.call(this, self__, k, not_found);
    }
    throw new Error("Invalid arity: " + arguments.length);
  };
  G__56819.cljs$core$IFn$_invoke$arity$2 = G__56819__2;
  G__56819.cljs$core$IFn$_invoke$arity$3 = G__56819__3;
  return G__56819;
}();
cljs.core.Subvec.prototype.apply = function(self__, args56818) {
  var self__ = this;
  var self____$1 = this;
  return self____$1.call.apply(self____$1, [self____$1].concat(cljs.core.aclone.call(null, args56818)));
};
cljs.core.Subvec.prototype.cljs$core$IFn$_invoke$arity$1 = function(k) {
  var self__ = this;
  var coll = this;
  return coll.cljs$core$IIndexed$_nth$arity$2(null, k);
};
cljs.core.Subvec.prototype.cljs$core$IFn$_invoke$arity$2 = function(k, not_found) {
  var self__ = this;
  var coll = this;
  return coll.cljs$core$IIndexed$_nth$arity$3(null, k, not_found);
};
cljs.core.__GT_Subvec = function __GT_Subvec(meta, v, start, end, __hash) {
  return new cljs.core.Subvec(meta, v, start, end, __hash);
};
cljs.core.build_subvec = function build_subvec(meta, v, start, end, __hash) {
  while (true) {
    if (v instanceof cljs.core.Subvec) {
      var G__56820 = meta;
      var G__56821 = v.v;
      var G__56822 = v.start + start;
      var G__56823 = v.start + end;
      var G__56824 = __hash;
      meta = G__56820;
      v = G__56821;
      start = G__56822;
      end = G__56823;
      __hash = G__56824;
      continue;
    } else {
      var c = cljs.core.count.call(null, v);
      if (start < 0 || end < 0 || start > c || end > c) {
        throw new Error("Index out of bounds");
      } else {
      }
      return new cljs.core.Subvec(meta, v, start, end, __hash);
    }
    break;
  }
};
cljs.core.subvec = function() {
  var subvec = null;
  var subvec__2 = function(v, start) {
    return subvec.call(null, v, start, cljs.core.count.call(null, v));
  };
  var subvec__3 = function(v, start, end) {
    return cljs.core.build_subvec.call(null, null, v, start, end, null);
  };
  subvec = function(v, start, end) {
    switch(arguments.length) {
      case 2:
        return subvec__2.call(this, v, start);
      case 3:
        return subvec__3.call(this, v, start, end);
    }
    throw new Error("Invalid arity: " + arguments.length);
  };
  subvec.cljs$core$IFn$_invoke$arity$2 = subvec__2;
  subvec.cljs$core$IFn$_invoke$arity$3 = subvec__3;
  return subvec;
}();
cljs.core.tv_ensure_editable = function tv_ensure_editable(edit, node) {
  if (edit === node.edit) {
    return node;
  } else {
    return new cljs.core.VectorNode(edit, cljs.core.aclone.call(null, node.arr));
  }
};
cljs.core.tv_editable_root = function tv_editable_root(node) {
  return new cljs.core.VectorNode(function() {
    var obj56828 = {};
    return obj56828;
  }(), cljs.core.aclone.call(null, node.arr));
};
cljs.core.tv_editable_tail = function tv_editable_tail(tl) {
  var ret = [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null];
  cljs.core.array_copy.call(null, tl, 0, ret, 0, tl.length);
  return ret;
};
cljs.core.tv_push_tail = function tv_push_tail(tv, level, parent, tail_node) {
  var ret = cljs.core.tv_ensure_editable.call(null, tv.root.edit, parent);
  var subidx = tv.cnt - 1 >>> level & 31;
  cljs.core.pv_aset.call(null, ret, subidx, level === 5 ? tail_node : function() {
    var child = cljs.core.pv_aget.call(null, ret, subidx);
    if (!(child == null)) {
      return tv_push_tail.call(null, tv, level - 5, child, tail_node);
    } else {
      return cljs.core.new_path.call(null, tv.root.edit, level - 5, tail_node);
    }
  }());
  return ret;
};
cljs.core.tv_pop_tail = function tv_pop_tail(tv, level, node) {
  var node__$1 = cljs.core.tv_ensure_editable.call(null, tv.root.edit, node);
  var subidx = tv.cnt - 2 >>> level & 31;
  if (level > 5) {
    var new_child = tv_pop_tail.call(null, tv, level - 5, cljs.core.pv_aget.call(null, node__$1, subidx));
    if (new_child == null && subidx === 0) {
      return null;
    } else {
      cljs.core.pv_aset.call(null, node__$1, subidx, new_child);
      return node__$1;
    }
  } else {
    if (subidx === 0) {
      return null;
    } else {
      cljs.core.pv_aset.call(null, node__$1, subidx, null);
      return node__$1;
    }
  }
};
cljs.core.unchecked_editable_array_for = function unchecked_editable_array_for(tv, i) {
  if (i >= cljs.core.tail_off.call(null, tv)) {
    return tv.tail;
  } else {
    var root = tv.root;
    var node = root;
    var level = tv.shift;
    while (true) {
      if (level > 0) {
        var G__56829 = cljs.core.tv_ensure_editable.call(null, root.edit, cljs.core.pv_aget.call(null, node, i >>> level & 31));
        var G__56830 = level - 5;
        node = G__56829;
        level = G__56830;
        continue;
      } else {
        return node.arr;
      }
      break;
    }
  }
};
cljs.core.TransientVector = function(cnt, shift, root, tail) {
  this.cnt = cnt;
  this.shift = shift;
  this.root = root;
  this.tail = tail;
  this.cljs$lang$protocol_mask$partition0$ = 275;
  this.cljs$lang$protocol_mask$partition1$ = 88;
};
cljs.core.TransientVector.cljs$lang$type = true;
cljs.core.TransientVector.cljs$lang$ctorStr = "cljs.core/TransientVector";
cljs.core.TransientVector.cljs$lang$ctorPrWriter = function(this__4215__auto__, writer__4216__auto__, opt__4217__auto__) {
  return cljs.core._write.call(null, writer__4216__auto__, "cljs.core/TransientVector");
};
cljs.core.TransientVector.prototype.call = function() {
  var G__56832 = null;
  var G__56832__2 = function(self__, k) {
    var self__ = this;
    var self____$1 = this;
    var coll = self____$1;
    return coll.cljs$core$ILookup$_lookup$arity$2(null, k);
  };
  var G__56832__3 = function(self__, k, not_found) {
    var self__ = this;
    var self____$1 = this;
    var coll = self____$1;
    return coll.cljs$core$ILookup$_lookup$arity$3(null, k, not_found);
  };
  G__56832 = function(self__, k, not_found) {
    switch(arguments.length) {
      case 2:
        return G__56832__2.call(this, self__, k);
      case 3:
        return G__56832__3.call(this, self__, k, not_found);
    }
    throw new Error("Invalid arity: " + arguments.length);
  };
  G__56832.cljs$core$IFn$_invoke$arity$2 = G__56832__2;
  G__56832.cljs$core$IFn$_invoke$arity$3 = G__56832__3;
  return G__56832;
}();
cljs.core.TransientVector.prototype.apply = function(self__, args56831) {
  var self__ = this;
  var self____$1 = this;
  return self____$1.call.apply(self____$1, [self____$1].concat(cljs.core.aclone.call(null, args56831)));
};
cljs.core.TransientVector.prototype.cljs$core$IFn$_invoke$arity$1 = function(k) {
  var self__ = this;
  var coll = this;
  return coll.cljs$core$ILookup$_lookup$arity$2(null, k);
};
cljs.core.TransientVector.prototype.cljs$core$IFn$_invoke$arity$2 = function(k, not_found) {
  var self__ = this;
  var coll = this;
  return coll.cljs$core$ILookup$_lookup$arity$3(null, k, not_found);
};
cljs.core.TransientVector.prototype.cljs$core$ILookup$_lookup$arity$2 = function(coll, k) {
  var self__ = this;
  var coll__$1 = this;
  return cljs.core._lookup.call(null, coll__$1, k, null);
};
cljs.core.TransientVector.prototype.cljs$core$ILookup$_lookup$arity$3 = function(coll, k, not_found) {
  var self__ = this;
  var coll__$1 = this;
  if (typeof k === "number") {
    return cljs.core._nth.call(null, coll__$1, k, not_found);
  } else {
    return not_found;
  }
};
cljs.core.TransientVector.prototype.cljs$core$IIndexed$_nth$arity$2 = function(coll, n) {
  var self__ = this;
  var coll__$1 = this;
  if (self__.root.edit) {
    return cljs.core.array_for.call(null, coll__$1, n)[n & 31];
  } else {
    throw new Error("nth after persistent!");
  }
};
cljs.core.TransientVector.prototype.cljs$core$IIndexed$_nth$arity$3 = function(coll, n, not_found) {
  var self__ = this;
  var coll__$1 = this;
  if (0 <= n && n < self__.cnt) {
    return cljs.core._nth.call(null, coll__$1, n);
  } else {
    return not_found;
  }
};
cljs.core.TransientVector.prototype.cljs$core$ICounted$_count$arity$1 = function(coll) {
  var self__ = this;
  var coll__$1 = this;
  if (self__.root.edit) {
    return self__.cnt;
  } else {
    throw new Error("count after persistent!");
  }
};
cljs.core.TransientVector.prototype.cljs$core$ITransientVector$_assoc_n_BANG_$arity$3 = function(tcoll, n, val) {
  var self__ = this;
  var tcoll__$1 = this;
  if (self__.root.edit) {
    if (0 <= n && n < self__.cnt) {
      if (cljs.core.tail_off.call(null, tcoll__$1) <= n) {
        self__.tail[n & 31] = val;
        return tcoll__$1;
      } else {
        var new_root = function(tcoll__$1) {
          return function go(level, node) {
            var node__$1 = cljs.core.tv_ensure_editable.call(null, self__.root.edit, node);
            if (level === 0) {
              cljs.core.pv_aset.call(null, node__$1, n & 31, val);
              return node__$1;
            } else {
              var subidx = n >>> level & 31;
              cljs.core.pv_aset.call(null, node__$1, subidx, go.call(null, level - 5, cljs.core.pv_aget.call(null, node__$1, subidx)));
              return node__$1;
            }
          };
        }(tcoll__$1).call(null, self__.shift, self__.root);
        self__.root = new_root;
        return tcoll__$1;
      }
    } else {
      if (n === self__.cnt) {
        return cljs.core._conj_BANG_.call(null, tcoll__$1, val);
      } else {
        throw new Error("Index " + cljs.core.str.cljs$core$IFn$_invoke$arity$1(n) + " out of bounds for TransientVector of length" + cljs.core.str.cljs$core$IFn$_invoke$arity$1(self__.cnt));
      }
    }
  } else {
    throw new Error("assoc! after persistent!");
  }
};
cljs.core.TransientVector.prototype.cljs$core$ITransientVector$_pop_BANG_$arity$1 = function(tcoll) {
  var self__ = this;
  var tcoll__$1 = this;
  if (self__.root.edit) {
    if (self__.cnt === 0) {
      throw new Error("Can't pop empty vector");
    } else {
      if (1 === self__.cnt) {
        self__.cnt = 0;
        return tcoll__$1;
      } else {
        if ((self__.cnt - 1 & 31) > 0) {
          self__.cnt = self__.cnt - 1;
          return tcoll__$1;
        } else {
          var new_tail = cljs.core.unchecked_editable_array_for.call(null, tcoll__$1, self__.cnt - 2);
          var new_root = function() {
            var nr = cljs.core.tv_pop_tail.call(null, tcoll__$1, self__.shift, self__.root);
            if (!(nr == null)) {
              return nr;
            } else {
              return new cljs.core.VectorNode(self__.root.edit, [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null]);
            }
          }();
          if (5 < self__.shift && cljs.core.pv_aget.call(null, new_root, 1) == null) {
            var new_root__$1 = cljs.core.tv_ensure_editable.call(null, self__.root.edit, cljs.core.pv_aget.call(null, new_root, 0));
            self__.root = new_root__$1;
            self__.shift = self__.shift - 5;
            self__.cnt = self__.cnt - 1;
            self__.tail = new_tail;
            return tcoll__$1;
          } else {
            self__.root = new_root;
            self__.cnt = self__.cnt - 1;
            self__.tail = new_tail;
            return tcoll__$1;
          }
        }
      }
    }
  } else {
    throw new Error("pop! after persistent!");
  }
};
cljs.core.TransientVector.prototype.cljs$core$ITransientAssociative$_assoc_BANG_$arity$3 = function(tcoll, key, val) {
  var self__ = this;
  var tcoll__$1 = this;
  if (typeof key === "number") {
    return cljs.core._assoc_n_BANG_.call(null, tcoll__$1, key, val);
  } else {
    throw new Error("TransientVector's key for assoc! must be a number.");
  }
};
cljs.core.TransientVector.prototype.cljs$core$ITransientCollection$_conj_BANG_$arity$2 = function(tcoll, o) {
  var self__ = this;
  var tcoll__$1 = this;
  if (self__.root.edit) {
    if (self__.cnt - cljs.core.tail_off.call(null, tcoll__$1) < 32) {
      self__.tail[self__.cnt & 31] = o;
      self__.cnt = self__.cnt + 1;
      return tcoll__$1;
    } else {
      var tail_node = new cljs.core.VectorNode(self__.root.edit, self__.tail);
      var new_tail = [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null];
      new_tail[0] = o;
      self__.tail = new_tail;
      if (self__.cnt >>> 5 > 1 << self__.shift) {
        var new_root_array = [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null];
        var new_shift = self__.shift + 5;
        new_root_array[0] = self__.root;
        new_root_array[1] = cljs.core.new_path.call(null, self__.root.edit, self__.shift, tail_node);
        self__.root = new cljs.core.VectorNode(self__.root.edit, new_root_array);
        self__.shift = new_shift;
        self__.cnt = self__.cnt + 1;
        return tcoll__$1;
      } else {
        var new_root = cljs.core.tv_push_tail.call(null, tcoll__$1, self__.shift, self__.root, tail_node);
        self__.root = new_root;
        self__.cnt = self__.cnt + 1;
        return tcoll__$1;
      }
    }
  } else {
    throw new Error("conj! after persistent!");
  }
};
cljs.core.TransientVector.prototype.cljs$core$ITransientCollection$_persistent_BANG_$arity$1 = function(tcoll) {
  var self__ = this;
  var tcoll__$1 = this;
  if (self__.root.edit) {
    self__.root.edit = null;
    var len = self__.cnt - cljs.core.tail_off.call(null, tcoll__$1);
    var trimmed_tail = new Array(len);
    cljs.core.array_copy.call(null, self__.tail, 0, trimmed_tail, 0, len);
    return new cljs.core.PersistentVector(null, self__.cnt, self__.shift, self__.root, trimmed_tail, null);
  } else {
    throw new Error("persistent! called twice");
  }
};
cljs.core.__GT_TransientVector = function __GT_TransientVector(cnt, shift, root, tail) {
  return new cljs.core.TransientVector(cnt, shift, root, tail);
};
cljs.core.PersistentQueueSeq = function(meta, front, rear, __hash) {
  this.meta = meta;
  this.front = front;
  this.rear = rear;
  this.__hash = __hash;
  this.cljs$lang$protocol_mask$partition1$ = 0;
  this.cljs$lang$protocol_mask$partition0$ = 31850572;
};
cljs.core.PersistentQueueSeq.cljs$lang$type = true;
cljs.core.PersistentQueueSeq.cljs$lang$ctorStr = "cljs.core/PersistentQueueSeq";
cljs.core.PersistentQueueSeq.cljs$lang$ctorPrWriter = function(this__4215__auto__, writer__4216__auto__, opt__4217__auto__) {
  return cljs.core._write.call(null, writer__4216__auto__, "cljs.core/PersistentQueueSeq");
};
cljs.core.PersistentQueueSeq.prototype.toString = function() {
  var self__ = this;
  var coll = this;
  return cljs.core.pr_str_STAR_.call(null, coll);
};
cljs.core.PersistentQueueSeq.prototype.equiv = function(other) {
  var self__ = this;
  var this$ = this;
  return this$.cljs$core$IEquiv$_equiv$arity$2(null, other);
};
cljs.core.PersistentQueueSeq.prototype.cljs$core$IMeta$_meta$arity$1 = function(coll) {
  var self__ = this;
  var coll__$1 = this;
  return self__.meta;
};
cljs.core.PersistentQueueSeq.prototype.cljs$core$IHash$_hash$arity$1 = function(coll) {
  var self__ = this;
  var coll__$1 = this;
  var h__4050__auto__ = self__.__hash;
  if (!(h__4050__auto__ == null)) {
    return h__4050__auto__;
  } else {
    var h__4050__auto____$1 = cljs.core.hash_ordered_coll.call(null, coll__$1);
    self__.__hash = h__4050__auto____$1;
    return h__4050__auto____$1;
  }
};
cljs.core.PersistentQueueSeq.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(coll, other) {
  var self__ = this;
  var coll__$1 = this;
  return cljs.core.equiv_sequential.call(null, coll__$1, other);
};
cljs.core.PersistentQueueSeq.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(coll) {
  var self__ = this;
  var coll__$1 = this;
  return cljs.core.with_meta.call(null, cljs.core.List.EMPTY, self__.meta);
};
cljs.core.PersistentQueueSeq.prototype.cljs$core$ISeq$_first$arity$1 = function(coll) {
  var self__ = this;
  var coll__$1 = this;
  return cljs.core.first.call(null, self__.front);
};
cljs.core.PersistentQueueSeq.prototype.cljs$core$ISeq$_rest$arity$1 = function(coll) {
  var self__ = this;
  var coll__$1 = this;
  var temp__4124__auto__ = cljs.core.next.call(null, self__.front);
  if (temp__4124__auto__) {
    var f1 = temp__4124__auto__;
    return new cljs.core.PersistentQueueSeq(self__.meta, f1, self__.rear, null);
  } else {
    if (self__.rear == null) {
      return cljs.core._empty.call(null, coll__$1);
    } else {
      return new cljs.core.PersistentQueueSeq(self__.meta, self__.rear, null, null);
    }
  }
};
cljs.core.PersistentQueueSeq.prototype.cljs$core$ISeqable$_seq$arity$1 = function(coll) {
  var self__ = this;
  var coll__$1 = this;
  return coll__$1;
};
cljs.core.PersistentQueueSeq.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(coll, meta__$1) {
  var self__ = this;
  var coll__$1 = this;
  return new cljs.core.PersistentQueueSeq(meta__$1, self__.front, self__.rear, self__.__hash);
};
cljs.core.PersistentQueueSeq.prototype.cljs$core$ICollection$_conj$arity$2 = function(coll, o) {
  var self__ = this;
  var coll__$1 = this;
  return cljs.core.cons.call(null, o, coll__$1);
};
cljs.core.__GT_PersistentQueueSeq = function __GT_PersistentQueueSeq(meta, front, rear, __hash) {
  return new cljs.core.PersistentQueueSeq(meta, front, rear, __hash);
};
cljs.core.PersistentQueue = function(meta, count, front, rear, __hash) {
  this.meta = meta;
  this.count = count;
  this.front = front;
  this.rear = rear;
  this.__hash = __hash;
  this.cljs$lang$protocol_mask$partition0$ = 31858766;
  this.cljs$lang$protocol_mask$partition1$ = 8192;
};
cljs.core.PersistentQueue.cljs$lang$type = true;
cljs.core.PersistentQueue.cljs$lang$ctorStr = "cljs.core/PersistentQueue";
cljs.core.PersistentQueue.cljs$lang$ctorPrWriter = function(this__4215__auto__, writer__4216__auto__, opt__4217__auto__) {
  return cljs.core._write.call(null, writer__4216__auto__, "cljs.core/PersistentQueue");
};
cljs.core.PersistentQueue.prototype.toString = function() {
  var self__ = this;
  var coll = this;
  return cljs.core.pr_str_STAR_.call(null, coll);
};
cljs.core.PersistentQueue.prototype.equiv = function(other) {
  var self__ = this;
  var this$ = this;
  return this$.cljs$core$IEquiv$_equiv$arity$2(null, other);
};
cljs.core.PersistentQueue.prototype.cljs$core$IMeta$_meta$arity$1 = function(coll) {
  var self__ = this;
  var coll__$1 = this;
  return self__.meta;
};
cljs.core.PersistentQueue.prototype.cljs$core$ICloneable$_clone$arity$1 = function(coll) {
  var self__ = this;
  var coll__$1 = this;
  return new cljs.core.PersistentQueue(self__.meta, self__.count, self__.front, self__.rear, self__.__hash);
};
cljs.core.PersistentQueue.prototype.cljs$core$ICounted$_count$arity$1 = function(coll) {
  var self__ = this;
  var coll__$1 = this;
  return self__.count;
};
cljs.core.PersistentQueue.prototype.cljs$core$IStack$_peek$arity$1 = function(coll) {
  var self__ = this;
  var coll__$1 = this;
  return cljs.core.first.call(null, self__.front);
};
cljs.core.PersistentQueue.prototype.cljs$core$IStack$_pop$arity$1 = function(coll) {
  var self__ = this;
  var coll__$1 = this;
  if (cljs.core.truth_(self__.front)) {
    var temp__4124__auto__ = cljs.core.next.call(null, self__.front);
    if (temp__4124__auto__) {
      var f1 = temp__4124__auto__;
      return new cljs.core.PersistentQueue(self__.meta, self__.count - 1, f1, self__.rear, null);
    } else {
      return new cljs.core.PersistentQueue(self__.meta, self__.count - 1, cljs.core.seq.call(null, self__.rear), cljs.core.PersistentVector.EMPTY, null);
    }
  } else {
    return coll__$1;
  }
};
cljs.core.PersistentQueue.prototype.cljs$core$IHash$_hash$arity$1 = function(coll) {
  var self__ = this;
  var coll__$1 = this;
  var h__4050__auto__ = self__.__hash;
  if (!(h__4050__auto__ == null)) {
    return h__4050__auto__;
  } else {
    var h__4050__auto____$1 = cljs.core.hash_ordered_coll.call(null, coll__$1);
    self__.__hash = h__4050__auto____$1;
    return h__4050__auto____$1;
  }
};
cljs.core.PersistentQueue.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(coll, other) {
  var self__ = this;
  var coll__$1 = this;
  return cljs.core.equiv_sequential.call(null, coll__$1, other);
};
cljs.core.PersistentQueue.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(coll) {
  var self__ = this;
  var coll__$1 = this;
  return cljs.core.PersistentQueue.EMPTY;
};
cljs.core.PersistentQueue.prototype.cljs$core$ISeq$_first$arity$1 = function(coll) {
  var self__ = this;
  var coll__$1 = this;
  return cljs.core.first.call(null, self__.front);
};
cljs.core.PersistentQueue.prototype.cljs$core$ISeq$_rest$arity$1 = function(coll) {
  var self__ = this;
  var coll__$1 = this;
  return cljs.core.rest.call(null, cljs.core.seq.call(null, coll__$1));
};
cljs.core.PersistentQueue.prototype.cljs$core$ISeqable$_seq$arity$1 = function(coll) {
  var self__ = this;
  var coll__$1 = this;
  var rear__$1 = cljs.core.seq.call(null, self__.rear);
  if (cljs.core.truth_(function() {
    var or__3639__auto__ = self__.front;
    if (cljs.core.truth_(or__3639__auto__)) {
      return or__3639__auto__;
    } else {
      return rear__$1;
    }
  }())) {
    return new cljs.core.PersistentQueueSeq(null, self__.front, cljs.core.seq.call(null, rear__$1), null);
  } else {
    return null;
  }
};
cljs.core.PersistentQueue.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(coll, meta__$1) {
  var self__ = this;
  var coll__$1 = this;
  return new cljs.core.PersistentQueue(meta__$1, self__.count, self__.front, self__.rear, self__.__hash);
};
cljs.core.PersistentQueue.prototype.cljs$core$ICollection$_conj$arity$2 = function(coll, o) {
  var self__ = this;
  var coll__$1 = this;
  if (cljs.core.truth_(self__.front)) {
    return new cljs.core.PersistentQueue(self__.meta, self__.count + 1, self__.front, cljs.core.conj.call(null, function() {
      var or__3639__auto__ = self__.rear;
      if (cljs.core.truth_(or__3639__auto__)) {
        return or__3639__auto__;
      } else {
        return cljs.core.PersistentVector.EMPTY;
      }
    }(), o), null);
  } else {
    return new cljs.core.PersistentQueue(self__.meta, self__.count + 1, cljs.core.conj.call(null, self__.front, o), cljs.core.PersistentVector.EMPTY, null);
  }
};
cljs.core.__GT_PersistentQueue = function __GT_PersistentQueue(meta, count, front, rear, __hash) {
  return new cljs.core.PersistentQueue(meta, count, front, rear, __hash);
};
cljs.core.PersistentQueue.EMPTY = new cljs.core.PersistentQueue(null, 0, null, cljs.core.PersistentVector.EMPTY, 0);
cljs.core.NeverEquiv = function() {
  this.cljs$lang$protocol_mask$partition1$ = 0;
  this.cljs$lang$protocol_mask$partition0$ = 2097152;
};
cljs.core.NeverEquiv.cljs$lang$type = true;
cljs.core.NeverEquiv.cljs$lang$ctorStr = "cljs.core/NeverEquiv";
cljs.core.NeverEquiv.cljs$lang$ctorPrWriter = function(this__4215__auto__, writer__4216__auto__, opt__4217__auto__) {
  return cljs.core._write.call(null, writer__4216__auto__, "cljs.core/NeverEquiv");
};
cljs.core.NeverEquiv.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(o, other) {
  var self__ = this;
  var o__$1 = this;
  return false;
};
cljs.core.NeverEquiv.prototype.equiv = function(other) {
  var self__ = this;
  var this$ = this;
  return this$.cljs$core$IEquiv$_equiv$arity$2(null, other);
};
cljs.core.__GT_NeverEquiv = function __GT_NeverEquiv() {
  return new cljs.core.NeverEquiv;
};
cljs.core.never_equiv = new cljs.core.NeverEquiv;
cljs.core.equiv_map = function equiv_map(x, y) {
  return cljs.core.boolean$.call(null, cljs.core.map_QMARK_.call(null, y) ? cljs.core.count.call(null, x) === cljs.core.count.call(null, y) ? cljs.core.every_QMARK_.call(null, cljs.core.identity, cljs.core.map.call(null, function(xkv) {
    return cljs.core._EQ_.call(null, cljs.core.get.call(null, y, cljs.core.first.call(null, xkv), cljs.core.never_equiv), cljs.core.second.call(null, xkv));
  }, x)) : null : null);
};
cljs.core.scan_array = function scan_array(incr, k, array) {
  var len = array.length;
  var i = 0;
  while (true) {
    if (i < len) {
      if (k === array[i]) {
        return i;
      } else {
        var G__56833 = i + incr;
        i = G__56833;
        continue;
      }
    } else {
      return null;
    }
    break;
  }
};
cljs.core.obj_map_compare_keys = function obj_map_compare_keys(a, b) {
  var a__$1 = cljs.core.hash.call(null, a);
  var b__$1 = cljs.core.hash.call(null, b);
  if (a__$1 < b__$1) {
    return-1;
  } else {
    if (a__$1 > b__$1) {
      return 1;
    } else {
      return 0;
    }
  }
};
cljs.core.obj_map__GT_hash_map = function obj_map__GT_hash_map(m, k, v) {
  var ks = m.keys;
  var len = ks.length;
  var so = m.strobj;
  var mm = cljs.core.meta.call(null, m);
  var i = 0;
  var out = cljs.core.transient$.call(null, cljs.core.PersistentHashMap.EMPTY);
  while (true) {
    if (i < len) {
      var k__$1 = ks[i];
      var G__56834 = i + 1;
      var G__56835 = cljs.core.assoc_BANG_.call(null, out, k__$1, so[k__$1]);
      i = G__56834;
      out = G__56835;
      continue;
    } else {
      return cljs.core.with_meta.call(null, cljs.core.persistent_BANG_.call(null, cljs.core.assoc_BANG_.call(null, out, k, v)), mm);
    }
    break;
  }
};
cljs.core.obj_clone = function obj_clone(obj, ks) {
  var new_obj = function() {
    var obj56839 = {};
    return obj56839;
  }();
  var l = ks.length;
  var i_56840 = 0;
  while (true) {
    if (i_56840 < l) {
      var k_56841 = ks[i_56840];
      new_obj[k_56841] = obj[k_56841];
      var G__56842 = i_56840 + 1;
      i_56840 = G__56842;
      continue;
    } else {
    }
    break;
  }
  return new_obj;
};
cljs.core.ObjMap = function(meta, keys, strobj, update_count, __hash) {
  this.meta = meta;
  this.keys = keys;
  this.strobj = strobj;
  this.update_count = update_count;
  this.__hash = __hash;
  this.cljs$lang$protocol_mask$partition0$ = 16123663;
  this.cljs$lang$protocol_mask$partition1$ = 4;
};
cljs.core.ObjMap.cljs$lang$type = true;
cljs.core.ObjMap.cljs$lang$ctorStr = "cljs.core/ObjMap";
cljs.core.ObjMap.cljs$lang$ctorPrWriter = function(this__4215__auto__, writer__4216__auto__, opt__4217__auto__) {
  return cljs.core._write.call(null, writer__4216__auto__, "cljs.core/ObjMap");
};
cljs.core.ObjMap.prototype.toString = function() {
  var self__ = this;
  var coll = this;
  return cljs.core.pr_str_STAR_.call(null, coll);
};
cljs.core.ObjMap.prototype.equiv = function(other) {
  var self__ = this;
  var this$ = this;
  return this$.cljs$core$IEquiv$_equiv$arity$2(null, other);
};
cljs.core.ObjMap.prototype.cljs$core$ILookup$_lookup$arity$2 = function(coll, k) {
  var self__ = this;
  var coll__$1 = this;
  return cljs.core._lookup.call(null, coll__$1, k, null);
};
cljs.core.ObjMap.prototype.cljs$core$ILookup$_lookup$arity$3 = function(coll, k, not_found) {
  var self__ = this;
  var coll__$1 = this;
  if (goog.isString(k) && !(cljs.core.scan_array.call(null, 1, k, self__.keys) == null)) {
    return self__.strobj[k];
  } else {
    return not_found;
  }
};
cljs.core.ObjMap.prototype.cljs$core$IKVReduce$_kv_reduce$arity$3 = function(coll, f, init) {
  var self__ = this;
  var coll__$1 = this;
  var len = self__.keys.length;
  var keys__$1 = self__.keys.sort(cljs.core.obj_map_compare_keys);
  var init__$1 = init;
  while (true) {
    if (cljs.core.seq.call(null, keys__$1)) {
      var k = cljs.core.first.call(null, keys__$1);
      var init__$2 = f.call(null, init__$1, k, self__.strobj[k]);
      if (cljs.core.reduced_QMARK_.call(null, init__$2)) {
        return cljs.core.deref.call(null, init__$2);
      } else {
        var G__56845 = cljs.core.rest.call(null, keys__$1);
        var G__56846 = init__$2;
        keys__$1 = G__56845;
        init__$1 = G__56846;
        continue;
      }
    } else {
      return init__$1;
    }
    break;
  }
};
cljs.core.ObjMap.prototype.cljs$core$IMeta$_meta$arity$1 = function(coll) {
  var self__ = this;
  var coll__$1 = this;
  return self__.meta;
};
cljs.core.ObjMap.prototype.cljs$core$ICounted$_count$arity$1 = function(coll) {
  var self__ = this;
  var coll__$1 = this;
  return self__.keys.length;
};
cljs.core.ObjMap.prototype.cljs$core$IHash$_hash$arity$1 = function(coll) {
  var self__ = this;
  var coll__$1 = this;
  var h__4050__auto__ = self__.__hash;
  if (!(h__4050__auto__ == null)) {
    return h__4050__auto__;
  } else {
    var h__4050__auto____$1 = cljs.core.hash_unordered_coll.call(null, coll__$1);
    self__.__hash = h__4050__auto____$1;
    return h__4050__auto____$1;
  }
};
cljs.core.ObjMap.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(coll, other) {
  var self__ = this;
  var coll__$1 = this;
  return cljs.core.equiv_map.call(null, coll__$1, other);
};
cljs.core.ObjMap.prototype.cljs$core$IEditableCollection$_as_transient$arity$1 = function(coll) {
  var self__ = this;
  var coll__$1 = this;
  return cljs.core.transient$.call(null, cljs.core.into.call(null, cljs.core.PersistentHashMap.EMPTY, coll__$1));
};
cljs.core.ObjMap.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(coll) {
  var self__ = this;
  var coll__$1 = this;
  return cljs.core.with_meta.call(null, cljs.core.ObjMap.EMPTY, self__.meta);
};
cljs.core.ObjMap.prototype.cljs$core$IMap$_dissoc$arity$2 = function(coll, k) {
  var self__ = this;
  var coll__$1 = this;
  if (goog.isString(k) && !(cljs.core.scan_array.call(null, 1, k, self__.keys) == null)) {
    var new_keys = cljs.core.aclone.call(null, self__.keys);
    var new_strobj = cljs.core.obj_clone.call(null, self__.strobj, self__.keys);
    new_keys.splice(cljs.core.scan_array.call(null, 1, k, new_keys), 1);
    delete new_strobj[k];
    return new cljs.core.ObjMap(self__.meta, new_keys, new_strobj, self__.update_count + 1, null);
  } else {
    return coll__$1;
  }
};
cljs.core.ObjMap.prototype.cljs$core$IAssociative$_assoc$arity$3 = function(coll, k, v) {
  var self__ = this;
  var coll__$1 = this;
  if (goog.isString(k)) {
    if (self__.update_count > cljs.core.ObjMap.HASHMAP_THRESHOLD || self__.keys.length >= cljs.core.ObjMap.HASHMAP_THRESHOLD) {
      return cljs.core.obj_map__GT_hash_map.call(null, coll__$1, k, v);
    } else {
      if (!(cljs.core.scan_array.call(null, 1, k, self__.keys) == null)) {
        var new_strobj = cljs.core.obj_clone.call(null, self__.strobj, self__.keys);
        new_strobj[k] = v;
        return new cljs.core.ObjMap(self__.meta, self__.keys, new_strobj, self__.update_count + 1, null);
      } else {
        var new_strobj = cljs.core.obj_clone.call(null, self__.strobj, self__.keys);
        var new_keys = cljs.core.aclone.call(null, self__.keys);
        new_strobj[k] = v;
        new_keys.push(k);
        return new cljs.core.ObjMap(self__.meta, new_keys, new_strobj, self__.update_count + 1, null);
      }
    }
  } else {
    return cljs.core.obj_map__GT_hash_map.call(null, coll__$1, k, v);
  }
};
cljs.core.ObjMap.prototype.cljs$core$IAssociative$_contains_key_QMARK_$arity$2 = function(coll, k) {
  var self__ = this;
  var coll__$1 = this;
  if (goog.isString(k) && !(cljs.core.scan_array.call(null, 1, k, self__.keys) == null)) {
    return true;
  } else {
    return false;
  }
};
cljs.core.ObjMap.prototype.cljs$core$ISeqable$_seq$arity$1 = function(coll) {
  var self__ = this;
  var coll__$1 = this;
  if (self__.keys.length > 0) {
    return cljs.core.map.call(null, function(coll__$1) {
      return function(p1__56843_SHARP_) {
        return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [p1__56843_SHARP_, self__.strobj[p1__56843_SHARP_]], null);
      };
    }(coll__$1), self__.keys.sort(cljs.core.obj_map_compare_keys));
  } else {
    return null;
  }
};
cljs.core.ObjMap.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(coll, meta__$1) {
  var self__ = this;
  var coll__$1 = this;
  return new cljs.core.ObjMap(meta__$1, self__.keys, self__.strobj, self__.update_count, self__.__hash);
};
cljs.core.ObjMap.prototype.cljs$core$ICollection$_conj$arity$2 = function(coll, entry) {
  var self__ = this;
  var coll__$1 = this;
  if (cljs.core.vector_QMARK_.call(null, entry)) {
    return cljs.core._assoc.call(null, coll__$1, cljs.core._nth.call(null, entry, 0), cljs.core._nth.call(null, entry, 1));
  } else {
    return cljs.core.reduce.call(null, cljs.core._conj, coll__$1, entry);
  }
};
cljs.core.ObjMap.prototype.call = function() {
  var G__56847 = null;
  var G__56847__2 = function(self__, k) {
    var self__ = this;
    var self____$1 = this;
    var coll = self____$1;
    return coll.cljs$core$ILookup$_lookup$arity$2(null, k);
  };
  var G__56847__3 = function(self__, k, not_found) {
    var self__ = this;
    var self____$1 = this;
    var coll = self____$1;
    return coll.cljs$core$ILookup$_lookup$arity$3(null, k, not_found);
  };
  G__56847 = function(self__, k, not_found) {
    switch(arguments.length) {
      case 2:
        return G__56847__2.call(this, self__, k);
      case 3:
        return G__56847__3.call(this, self__, k, not_found);
    }
    throw new Error("Invalid arity: " + arguments.length);
  };
  G__56847.cljs$core$IFn$_invoke$arity$2 = G__56847__2;
  G__56847.cljs$core$IFn$_invoke$arity$3 = G__56847__3;
  return G__56847;
}();
cljs.core.ObjMap.prototype.apply = function(self__, args56844) {
  var self__ = this;
  var self____$1 = this;
  return self____$1.call.apply(self____$1, [self____$1].concat(cljs.core.aclone.call(null, args56844)));
};
cljs.core.ObjMap.prototype.cljs$core$IFn$_invoke$arity$1 = function(k) {
  var self__ = this;
  var coll = this;
  return coll.cljs$core$ILookup$_lookup$arity$2(null, k);
};
cljs.core.ObjMap.prototype.cljs$core$IFn$_invoke$arity$2 = function(k, not_found) {
  var self__ = this;
  var coll = this;
  return coll.cljs$core$ILookup$_lookup$arity$3(null, k, not_found);
};
cljs.core.__GT_ObjMap = function __GT_ObjMap(meta, keys, strobj, update_count, __hash) {
  return new cljs.core.ObjMap(meta, keys, strobj, update_count, __hash);
};
cljs.core.ObjMap.EMPTY = new cljs.core.ObjMap(null, [], function() {
  var obj56849 = {};
  return obj56849;
}(), 0, 0);
cljs.core.ObjMap.HASHMAP_THRESHOLD = 8;
cljs.core.ObjMap.fromObject = function(ks, obj) {
  return new cljs.core.ObjMap(null, ks, obj, 0, null);
};
cljs.core.Iterator = function(s) {
  this.s = s;
};
cljs.core.Iterator.cljs$lang$type = true;
cljs.core.Iterator.cljs$lang$ctorStr = "cljs.core/Iterator";
cljs.core.Iterator.cljs$lang$ctorPrWriter = function(this__4215__auto__, writer__4216__auto__, opt__4217__auto__) {
  return cljs.core._write.call(null, writer__4216__auto__, "cljs.core/Iterator");
};
cljs.core.Iterator.prototype.next = function() {
  var self__ = this;
  var _ = this;
  if (!(self__.s == null)) {
    var x = cljs.core.first.call(null, self__.s);
    self__.s = cljs.core.next.call(null, self__.s);
    return{"done":false, "value":x};
  } else {
    return{"done":true, "value":null};
  }
};
cljs.core.__GT_Iterator = function __GT_Iterator(s) {
  return new cljs.core.Iterator(s);
};
cljs.core.iterator = function iterator(coll) {
  return new cljs.core.Iterator(cljs.core.seq.call(null, coll));
};
cljs.core.EntriesIterator = function(s) {
  this.s = s;
};
cljs.core.EntriesIterator.cljs$lang$type = true;
cljs.core.EntriesIterator.cljs$lang$ctorStr = "cljs.core/EntriesIterator";
cljs.core.EntriesIterator.cljs$lang$ctorPrWriter = function(this__4215__auto__, writer__4216__auto__, opt__4217__auto__) {
  return cljs.core._write.call(null, writer__4216__auto__, "cljs.core/EntriesIterator");
};
cljs.core.EntriesIterator.prototype.next = function() {
  var self__ = this;
  var _ = this;
  if (!(self__.s == null)) {
    var vec__56850 = cljs.core.first.call(null, self__.s);
    var k = cljs.core.nth.call(null, vec__56850, 0, null);
    var v = cljs.core.nth.call(null, vec__56850, 1, null);
    self__.s = cljs.core.next.call(null, self__.s);
    return{"done":false, "value":[k, v]};
  } else {
    return{"done":true, "value":null};
  }
};
cljs.core.__GT_EntriesIterator = function __GT_EntriesIterator(s) {
  return new cljs.core.EntriesIterator(s);
};
cljs.core.entries_iterator = function entries_iterator(coll) {
  return new cljs.core.EntriesIterator(cljs.core.seq.call(null, coll));
};
cljs.core.SetEntriesIterator = function(s) {
  this.s = s;
};
cljs.core.SetEntriesIterator.cljs$lang$type = true;
cljs.core.SetEntriesIterator.cljs$lang$ctorStr = "cljs.core/SetEntriesIterator";
cljs.core.SetEntriesIterator.cljs$lang$ctorPrWriter = function(this__4215__auto__, writer__4216__auto__, opt__4217__auto__) {
  return cljs.core._write.call(null, writer__4216__auto__, "cljs.core/SetEntriesIterator");
};
cljs.core.SetEntriesIterator.prototype.next = function() {
  var self__ = this;
  var _ = this;
  if (!(self__.s == null)) {
    var x = cljs.core.first.call(null, self__.s);
    self__.s = cljs.core.next.call(null, self__.s);
    return{"done":false, "value":[x, x]};
  } else {
    return{"done":true, "value":null};
  }
};
cljs.core.__GT_SetEntriesIterator = function __GT_SetEntriesIterator(s) {
  return new cljs.core.SetEntriesIterator(s);
};
cljs.core.set_entries_iterator = function set_entries_iterator(coll) {
  return new cljs.core.SetEntriesIterator(cljs.core.seq.call(null, coll));
};
cljs.core.array_map_index_of_nil_QMARK_ = function array_map_index_of_nil_QMARK_(arr, m, k) {
  var len = arr.length;
  var i = 0;
  while (true) {
    if (len <= i) {
      return-1;
    } else {
      if (arr[i] == null) {
        return i;
      } else {
        var G__56851 = i + 2;
        i = G__56851;
        continue;
      }
    }
    break;
  }
};
cljs.core.array_map_index_of_keyword_QMARK_ = function array_map_index_of_keyword_QMARK_(arr, m, k) {
  var len = arr.length;
  var kstr = k.fqn;
  var i = 0;
  while (true) {
    if (len <= i) {
      return-1;
    } else {
      if (function() {
        var k_SINGLEQUOTE_ = arr[i];
        return k_SINGLEQUOTE_ instanceof cljs.core.Keyword && kstr === k_SINGLEQUOTE_.fqn;
      }()) {
        return i;
      } else {
        var G__56852 = i + 2;
        i = G__56852;
        continue;
      }
    }
    break;
  }
};
cljs.core.array_map_index_of_symbol_QMARK_ = function array_map_index_of_symbol_QMARK_(arr, m, k) {
  var len = arr.length;
  var kstr = k.str;
  var i = 0;
  while (true) {
    if (len <= i) {
      return-1;
    } else {
      if (function() {
        var k_SINGLEQUOTE_ = arr[i];
        return k_SINGLEQUOTE_ instanceof cljs.core.Symbol && kstr === k_SINGLEQUOTE_.str;
      }()) {
        return i;
      } else {
        var G__56853 = i + 2;
        i = G__56853;
        continue;
      }
    }
    break;
  }
};
cljs.core.array_map_index_of_identical_QMARK_ = function array_map_index_of_identical_QMARK_(arr, m, k) {
  var len = arr.length;
  var i = 0;
  while (true) {
    if (len <= i) {
      return-1;
    } else {
      if (k === arr[i]) {
        return i;
      } else {
        var G__56854 = i + 2;
        i = G__56854;
        continue;
      }
    }
    break;
  }
};
cljs.core.array_map_index_of_equiv_QMARK_ = function array_map_index_of_equiv_QMARK_(arr, m, k) {
  var len = arr.length;
  var i = 0;
  while (true) {
    if (len <= i) {
      return-1;
    } else {
      if (cljs.core._EQ_.call(null, k, arr[i])) {
        return i;
      } else {
        var G__56855 = i + 2;
        i = G__56855;
        continue;
      }
    }
    break;
  }
};
cljs.core.array_map_index_of = function array_map_index_of(m, k) {
  var arr = m.arr;
  if (k instanceof cljs.core.Keyword) {
    return cljs.core.array_map_index_of_keyword_QMARK_.call(null, arr, m, k);
  } else {
    if (goog.isString(k) || typeof k === "number") {
      return cljs.core.array_map_index_of_identical_QMARK_.call(null, arr, m, k);
    } else {
      if (k instanceof cljs.core.Symbol) {
        return cljs.core.array_map_index_of_symbol_QMARK_.call(null, arr, m, k);
      } else {
        if (k == null) {
          return cljs.core.array_map_index_of_nil_QMARK_.call(null, arr, m, k);
        } else {
          return cljs.core.array_map_index_of_equiv_QMARK_.call(null, arr, m, k);
        }
      }
    }
  }
};
cljs.core.array_map_extend_kv = function array_map_extend_kv(m, k, v) {
  var arr = m.arr;
  var l = arr.length;
  var narr = new Array(l + 2);
  var i_56856 = 0;
  while (true) {
    if (i_56856 < l) {
      narr[i_56856] = arr[i_56856];
      var G__56857 = i_56856 + 1;
      i_56856 = G__56857;
      continue;
    } else {
    }
    break;
  }
  narr[l] = k;
  narr[l + 1] = v;
  return narr;
};
cljs.core.PersistentArrayMapSeq = function(arr, i, _meta) {
  this.arr = arr;
  this.i = i;
  this._meta = _meta;
  this.cljs$lang$protocol_mask$partition1$ = 0;
  this.cljs$lang$protocol_mask$partition0$ = 32374990;
};
cljs.core.PersistentArrayMapSeq.cljs$lang$type = true;
cljs.core.PersistentArrayMapSeq.cljs$lang$ctorStr = "cljs.core/PersistentArrayMapSeq";
cljs.core.PersistentArrayMapSeq.cljs$lang$ctorPrWriter = function(this__4215__auto__, writer__4216__auto__, opt__4217__auto__) {
  return cljs.core._write.call(null, writer__4216__auto__, "cljs.core/PersistentArrayMapSeq");
};
cljs.core.PersistentArrayMapSeq.prototype.toString = function() {
  var self__ = this;
  var coll = this;
  return cljs.core.pr_str_STAR_.call(null, coll);
};
cljs.core.PersistentArrayMapSeq.prototype.equiv = function(other) {
  var self__ = this;
  var this$ = this;
  return this$.cljs$core$IEquiv$_equiv$arity$2(null, other);
};
cljs.core.PersistentArrayMapSeq.prototype.cljs$core$IMeta$_meta$arity$1 = function(coll) {
  var self__ = this;
  var coll__$1 = this;
  return self__._meta;
};
cljs.core.PersistentArrayMapSeq.prototype.cljs$core$INext$_next$arity$1 = function(coll) {
  var self__ = this;
  var coll__$1 = this;
  if (self__.i < self__.arr.length - 2) {
    return new cljs.core.PersistentArrayMapSeq(self__.arr, self__.i + 2, self__._meta);
  } else {
    return null;
  }
};
cljs.core.PersistentArrayMapSeq.prototype.cljs$core$ICounted$_count$arity$1 = function(coll) {
  var self__ = this;
  var coll__$1 = this;
  return(self__.arr.length - self__.i) / 2;
};
cljs.core.PersistentArrayMapSeq.prototype.cljs$core$IHash$_hash$arity$1 = function(coll) {
  var self__ = this;
  var coll__$1 = this;
  return cljs.core.hash_ordered_coll.call(null, coll__$1);
};
cljs.core.PersistentArrayMapSeq.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(coll, other) {
  var self__ = this;
  var coll__$1 = this;
  return cljs.core.equiv_sequential.call(null, coll__$1, other);
};
cljs.core.PersistentArrayMapSeq.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(coll) {
  var self__ = this;
  var coll__$1 = this;
  return cljs.core.with_meta.call(null, cljs.core.List.EMPTY, self__._meta);
};
cljs.core.PersistentArrayMapSeq.prototype.cljs$core$IReduce$_reduce$arity$2 = function(coll, f) {
  var self__ = this;
  var coll__$1 = this;
  return cljs.core.seq_reduce.call(null, f, coll__$1);
};
cljs.core.PersistentArrayMapSeq.prototype.cljs$core$IReduce$_reduce$arity$3 = function(coll, f, start) {
  var self__ = this;
  var coll__$1 = this;
  return cljs.core.seq_reduce.call(null, f, start, coll__$1);
};
cljs.core.PersistentArrayMapSeq.prototype.cljs$core$ISeq$_first$arity$1 = function(coll) {
  var self__ = this;
  var coll__$1 = this;
  return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [self__.arr[self__.i], self__.arr[self__.i + 1]], null);
};
cljs.core.PersistentArrayMapSeq.prototype.cljs$core$ISeq$_rest$arity$1 = function(coll) {
  var self__ = this;
  var coll__$1 = this;
  if (self__.i < self__.arr.length - 2) {
    return new cljs.core.PersistentArrayMapSeq(self__.arr, self__.i + 2, self__._meta);
  } else {
    return cljs.core.List.EMPTY;
  }
};
cljs.core.PersistentArrayMapSeq.prototype.cljs$core$ISeqable$_seq$arity$1 = function(coll) {
  var self__ = this;
  var coll__$1 = this;
  return coll__$1;
};
cljs.core.PersistentArrayMapSeq.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(coll, new_meta) {
  var self__ = this;
  var coll__$1 = this;
  return new cljs.core.PersistentArrayMapSeq(self__.arr, self__.i, new_meta);
};
cljs.core.PersistentArrayMapSeq.prototype.cljs$core$ICollection$_conj$arity$2 = function(coll, o) {
  var self__ = this;
  var coll__$1 = this;
  return cljs.core.cons.call(null, o, coll__$1);
};
cljs.core.__GT_PersistentArrayMapSeq = function __GT_PersistentArrayMapSeq(arr, i, _meta) {
  return new cljs.core.PersistentArrayMapSeq(arr, i, _meta);
};
cljs.core.persistent_array_map_seq = function persistent_array_map_seq(arr, i, _meta) {
  if (i <= arr.length - 2) {
    return new cljs.core.PersistentArrayMapSeq(arr, i, _meta);
  } else {
    return null;
  }
};
cljs.core.PersistentArrayMap = function(meta, cnt, arr, __hash) {
  this.meta = meta;
  this.cnt = cnt;
  this.arr = arr;
  this.__hash = __hash;
  this.cljs$lang$protocol_mask$partition0$ = 16647951;
  this.cljs$lang$protocol_mask$partition1$ = 8196;
};
cljs.core.PersistentArrayMap.cljs$lang$type = true;
cljs.core.PersistentArrayMap.cljs$lang$ctorStr = "cljs.core/PersistentArrayMap";
cljs.core.PersistentArrayMap.cljs$lang$ctorPrWriter = function(this__4215__auto__, writer__4216__auto__, opt__4217__auto__) {
  return cljs.core._write.call(null, writer__4216__auto__, "cljs.core/PersistentArrayMap");
};
cljs.core.PersistentArrayMap.prototype.toString = function() {
  var self__ = this;
  var coll = this;
  return cljs.core.pr_str_STAR_.call(null, coll);
};
cljs.core.PersistentArrayMap.prototype.equiv = function(other) {
  var self__ = this;
  var this$ = this;
  return this$.cljs$core$IEquiv$_equiv$arity$2(null, other);
};
cljs.core.PersistentArrayMap.prototype.keys = function() {
  var self__ = this;
  var coll = this;
  return cljs.core.iterator.call(null, cljs.core.keys.call(null, coll));
};
cljs.core.PersistentArrayMap.prototype.entries = function() {
  var self__ = this;
  var coll = this;
  return cljs.core.entries_iterator.call(null, cljs.core.seq.call(null, coll));
};
cljs.core.PersistentArrayMap.prototype.values = function() {
  var self__ = this;
  var coll = this;
  return cljs.core.iterator.call(null, cljs.core.vals.call(null, coll));
};
cljs.core.PersistentArrayMap.prototype.has = function(k) {
  var self__ = this;
  var coll = this;
  return cljs.core.contains_QMARK_.call(null, coll, k);
};
cljs.core.PersistentArrayMap.prototype.get = function(k) {
  var self__ = this;
  var coll = this;
  return coll.cljs$core$ILookup$_lookup$arity$2(null, k);
};
cljs.core.PersistentArrayMap.prototype.forEach = function(f) {
  var self__ = this;
  var coll = this;
  var seq__56859 = cljs.core.seq.call(null, coll);
  var chunk__56860 = null;
  var count__56861 = 0;
  var i__56862 = 0;
  while (true) {
    if (i__56862 < count__56861) {
      var vec__56863 = cljs.core._nth.call(null, chunk__56860, i__56862);
      var k = cljs.core.nth.call(null, vec__56863, 0, null);
      var v = cljs.core.nth.call(null, vec__56863, 1, null);
      f.call(null, v, k);
      var G__56868 = seq__56859;
      var G__56869 = chunk__56860;
      var G__56870 = count__56861;
      var G__56871 = i__56862 + 1;
      seq__56859 = G__56868;
      chunk__56860 = G__56869;
      count__56861 = G__56870;
      i__56862 = G__56871;
      continue;
    } else {
      var temp__4126__auto__ = cljs.core.seq.call(null, seq__56859);
      if (temp__4126__auto__) {
        var seq__56859__$1 = temp__4126__auto__;
        if (cljs.core.chunked_seq_QMARK_.call(null, seq__56859__$1)) {
          var c__4408__auto__ = cljs.core.chunk_first.call(null, seq__56859__$1);
          var G__56872 = cljs.core.chunk_rest.call(null, seq__56859__$1);
          var G__56873 = c__4408__auto__;
          var G__56874 = cljs.core.count.call(null, c__4408__auto__);
          var G__56875 = 0;
          seq__56859 = G__56872;
          chunk__56860 = G__56873;
          count__56861 = G__56874;
          i__56862 = G__56875;
          continue;
        } else {
          var vec__56864 = cljs.core.first.call(null, seq__56859__$1);
          var k = cljs.core.nth.call(null, vec__56864, 0, null);
          var v = cljs.core.nth.call(null, vec__56864, 1, null);
          f.call(null, v, k);
          var G__56876 = cljs.core.next.call(null, seq__56859__$1);
          var G__56877 = null;
          var G__56878 = 0;
          var G__56879 = 0;
          seq__56859 = G__56876;
          chunk__56860 = G__56877;
          count__56861 = G__56878;
          i__56862 = G__56879;
          continue;
        }
      } else {
        return null;
      }
    }
    break;
  }
};
cljs.core.PersistentArrayMap.prototype.cljs$core$ILookup$_lookup$arity$2 = function(coll, k) {
  var self__ = this;
  var coll__$1 = this;
  return cljs.core._lookup.call(null, coll__$1, k, null);
};
cljs.core.PersistentArrayMap.prototype.cljs$core$ILookup$_lookup$arity$3 = function(coll, k, not_found) {
  var self__ = this;
  var coll__$1 = this;
  var idx = cljs.core.array_map_index_of.call(null, coll__$1, k);
  if (idx === -1) {
    return not_found;
  } else {
    return self__.arr[idx + 1];
  }
};
cljs.core.PersistentArrayMap.prototype.cljs$core$IKVReduce$_kv_reduce$arity$3 = function(coll, f, init) {
  var self__ = this;
  var coll__$1 = this;
  var len = self__.arr.length;
  var i = 0;
  var init__$1 = init;
  while (true) {
    if (i < len) {
      var init__$2 = f.call(null, init__$1, self__.arr[i], self__.arr[i + 1]);
      if (cljs.core.reduced_QMARK_.call(null, init__$2)) {
        return cljs.core.deref.call(null, init__$2);
      } else {
        var G__56880 = i + 2;
        var G__56881 = init__$2;
        i = G__56880;
        init__$1 = G__56881;
        continue;
      }
    } else {
      return init__$1;
    }
    break;
  }
};
cljs.core.PersistentArrayMap.prototype.cljs$core$IMeta$_meta$arity$1 = function(coll) {
  var self__ = this;
  var coll__$1 = this;
  return self__.meta;
};
cljs.core.PersistentArrayMap.prototype.cljs$core$ICloneable$_clone$arity$1 = function(_) {
  var self__ = this;
  var ___$1 = this;
  return new cljs.core.PersistentArrayMap(self__.meta, self__.cnt, self__.arr, self__.__hash);
};
cljs.core.PersistentArrayMap.prototype.cljs$core$ICounted$_count$arity$1 = function(coll) {
  var self__ = this;
  var coll__$1 = this;
  return self__.cnt;
};
cljs.core.PersistentArrayMap.prototype.cljs$core$IHash$_hash$arity$1 = function(coll) {
  var self__ = this;
  var coll__$1 = this;
  var h__4050__auto__ = self__.__hash;
  if (!(h__4050__auto__ == null)) {
    return h__4050__auto__;
  } else {
    var h__4050__auto____$1 = cljs.core.hash_unordered_coll.call(null, coll__$1);
    self__.__hash = h__4050__auto____$1;
    return h__4050__auto____$1;
  }
};
cljs.core.PersistentArrayMap.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(coll, other) {
  var self__ = this;
  var coll__$1 = this;
  return cljs.core.equiv_map.call(null, coll__$1, other);
};
cljs.core.PersistentArrayMap.prototype.cljs$core$IEditableCollection$_as_transient$arity$1 = function(coll) {
  var self__ = this;
  var coll__$1 = this;
  return new cljs.core.TransientArrayMap(function() {
    var obj56866 = {};
    return obj56866;
  }(), self__.arr.length, cljs.core.aclone.call(null, self__.arr));
};
cljs.core.PersistentArrayMap.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(coll) {
  var self__ = this;
  var coll__$1 = this;
  return cljs.core._with_meta.call(null, cljs.core.PersistentArrayMap.EMPTY, self__.meta);
};
cljs.core.PersistentArrayMap.prototype.cljs$core$IReduce$_reduce$arity$2 = function(coll, f) {
  var self__ = this;
  var coll__$1 = this;
  return cljs.core.seq_reduce.call(null, f, coll__$1);
};
cljs.core.PersistentArrayMap.prototype.cljs$core$IReduce$_reduce$arity$3 = function(coll, f, start) {
  var self__ = this;
  var coll__$1 = this;
  return cljs.core.seq_reduce.call(null, f, start, coll__$1);
};
cljs.core.PersistentArrayMap.prototype.cljs$core$IMap$_dissoc$arity$2 = function(coll, k) {
  var self__ = this;
  var coll__$1 = this;
  var idx = cljs.core.array_map_index_of.call(null, coll__$1, k);
  if (idx >= 0) {
    var len = self__.arr.length;
    var new_len = len - 2;
    if (new_len === 0) {
      return cljs.core._empty.call(null, coll__$1);
    } else {
      var new_arr = new Array(new_len);
      var s = 0;
      var d = 0;
      while (true) {
        if (s >= len) {
          return new cljs.core.PersistentArrayMap(self__.meta, self__.cnt - 1, new_arr, null);
        } else {
          if (cljs.core._EQ_.call(null, k, self__.arr[s])) {
            var G__56882 = s + 2;
            var G__56883 = d;
            s = G__56882;
            d = G__56883;
            continue;
          } else {
            new_arr[d] = self__.arr[s];
            new_arr[d + 1] = self__.arr[s + 1];
            var G__56884 = s + 2;
            var G__56885 = d + 2;
            s = G__56884;
            d = G__56885;
            continue;
          }
        }
        break;
      }
    }
  } else {
    return coll__$1;
  }
};
cljs.core.PersistentArrayMap.prototype.cljs$core$IAssociative$_assoc$arity$3 = function(coll, k, v) {
  var self__ = this;
  var coll__$1 = this;
  var idx = cljs.core.array_map_index_of.call(null, coll__$1, k);
  if (idx === -1) {
    if (self__.cnt < cljs.core.PersistentArrayMap.HASHMAP_THRESHOLD) {
      var arr__$1 = cljs.core.array_map_extend_kv.call(null, coll__$1, k, v);
      return new cljs.core.PersistentArrayMap(self__.meta, self__.cnt + 1, arr__$1, null);
    } else {
      return cljs.core._with_meta.call(null, cljs.core._assoc.call(null, cljs.core.into.call(null, cljs.core.PersistentHashMap.EMPTY, coll__$1), k, v), self__.meta);
    }
  } else {
    if (v === self__.arr[idx + 1]) {
      return coll__$1;
    } else {
      var arr__$1 = function() {
        var G__56867 = cljs.core.aclone.call(null, self__.arr);
        G__56867[idx + 1] = v;
        return G__56867;
      }();
      return new cljs.core.PersistentArrayMap(self__.meta, self__.cnt, arr__$1, null);
    }
  }
};
cljs.core.PersistentArrayMap.prototype.cljs$core$IAssociative$_contains_key_QMARK_$arity$2 = function(coll, k) {
  var self__ = this;
  var coll__$1 = this;
  return!(cljs.core.array_map_index_of.call(null, coll__$1, k) === -1);
};
cljs.core.PersistentArrayMap.prototype.cljs$core$ISeqable$_seq$arity$1 = function(coll) {
  var self__ = this;
  var coll__$1 = this;
  return cljs.core.persistent_array_map_seq.call(null, self__.arr, 0, null);
};
cljs.core.PersistentArrayMap.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(coll, meta__$1) {
  var self__ = this;
  var coll__$1 = this;
  return new cljs.core.PersistentArrayMap(meta__$1, self__.cnt, self__.arr, self__.__hash);
};
cljs.core.PersistentArrayMap.prototype.cljs$core$ICollection$_conj$arity$2 = function(coll, entry) {
  var self__ = this;
  var coll__$1 = this;
  if (cljs.core.vector_QMARK_.call(null, entry)) {
    return cljs.core._assoc.call(null, coll__$1, cljs.core._nth.call(null, entry, 0), cljs.core._nth.call(null, entry, 1));
  } else {
    var ret = coll__$1;
    var es = cljs.core.seq.call(null, entry);
    while (true) {
      if (es == null) {
        return ret;
      } else {
        var e = cljs.core.first.call(null, es);
        if (cljs.core.vector_QMARK_.call(null, e)) {
          var G__56886 = cljs.core._assoc.call(null, ret, cljs.core._nth.call(null, e, 0), cljs.core._nth.call(null, e, 1));
          var G__56887 = cljs.core.next.call(null, es);
          ret = G__56886;
          es = G__56887;
          continue;
        } else {
          throw new Error("conj on a map takes map entries or seqables of map entries");
        }
      }
      break;
    }
  }
};
cljs.core.PersistentArrayMap.prototype.call = function() {
  var G__56888 = null;
  var G__56888__2 = function(self__, k) {
    var self__ = this;
    var self____$1 = this;
    var coll = self____$1;
    return coll.cljs$core$ILookup$_lookup$arity$2(null, k);
  };
  var G__56888__3 = function(self__, k, not_found) {
    var self__ = this;
    var self____$1 = this;
    var coll = self____$1;
    return coll.cljs$core$ILookup$_lookup$arity$3(null, k, not_found);
  };
  G__56888 = function(self__, k, not_found) {
    switch(arguments.length) {
      case 2:
        return G__56888__2.call(this, self__, k);
      case 3:
        return G__56888__3.call(this, self__, k, not_found);
    }
    throw new Error("Invalid arity: " + arguments.length);
  };
  G__56888.cljs$core$IFn$_invoke$arity$2 = G__56888__2;
  G__56888.cljs$core$IFn$_invoke$arity$3 = G__56888__3;
  return G__56888;
}();
cljs.core.PersistentArrayMap.prototype.apply = function(self__, args56858) {
  var self__ = this;
  var self____$1 = this;
  return self____$1.call.apply(self____$1, [self____$1].concat(cljs.core.aclone.call(null, args56858)));
};
cljs.core.PersistentArrayMap.prototype.cljs$core$IFn$_invoke$arity$1 = function(k) {
  var self__ = this;
  var coll = this;
  return coll.cljs$core$ILookup$_lookup$arity$2(null, k);
};
cljs.core.PersistentArrayMap.prototype.cljs$core$IFn$_invoke$arity$2 = function(k, not_found) {
  var self__ = this;
  var coll = this;
  return coll.cljs$core$ILookup$_lookup$arity$3(null, k, not_found);
};
cljs.core.__GT_PersistentArrayMap = function __GT_PersistentArrayMap(meta, cnt, arr, __hash) {
  return new cljs.core.PersistentArrayMap(meta, cnt, arr, __hash);
};
cljs.core.PersistentArrayMap.EMPTY = new cljs.core.PersistentArrayMap(null, 0, [], null);
cljs.core.PersistentArrayMap.HASHMAP_THRESHOLD = 8;
cljs.core.PersistentArrayMap.fromArray = function(arr, no_clone, no_check) {
  var arr__$1 = no_clone ? arr : cljs.core.aclone.call(null, arr);
  if (no_check) {
    var cnt = arr__$1.length / 2;
    return new cljs.core.PersistentArrayMap(null, cnt, arr__$1, null);
  } else {
    var len = arr__$1.length;
    var i = 0;
    var ret = cljs.core.transient$.call(null, cljs.core.PersistentArrayMap.EMPTY);
    while (true) {
      if (i < len) {
        var G__56889 = i + 2;
        var G__56890 = cljs.core._assoc_BANG_.call(null, ret, arr__$1[i], arr__$1[i + 1]);
        i = G__56889;
        ret = G__56890;
        continue;
      } else {
        return cljs.core._persistent_BANG_.call(null, ret);
      }
      break;
    }
  }
};
cljs.core.TransientArrayMap = function(editable_QMARK_, len, arr) {
  this.editable_QMARK_ = editable_QMARK_;
  this.len = len;
  this.arr = arr;
  this.cljs$lang$protocol_mask$partition1$ = 56;
  this.cljs$lang$protocol_mask$partition0$ = 258;
};
cljs.core.TransientArrayMap.cljs$lang$type = true;
cljs.core.TransientArrayMap.cljs$lang$ctorStr = "cljs.core/TransientArrayMap";
cljs.core.TransientArrayMap.cljs$lang$ctorPrWriter = function(this__4215__auto__, writer__4216__auto__, opt__4217__auto__) {
  return cljs.core._write.call(null, writer__4216__auto__, "cljs.core/TransientArrayMap");
};
cljs.core.TransientArrayMap.prototype.cljs$core$ITransientMap$_dissoc_BANG_$arity$2 = function(tcoll, key) {
  var self__ = this;
  var tcoll__$1 = this;
  if (cljs.core.truth_(self__.editable_QMARK_)) {
    var idx = cljs.core.array_map_index_of.call(null, tcoll__$1, key);
    if (idx >= 0) {
      self__.arr[idx] = self__.arr[self__.len - 2];
      self__.arr[idx + 1] = self__.arr[self__.len - 1];
      var G__56891_56893 = self__.arr;
      G__56891_56893.pop();
      G__56891_56893.pop();
      self__.len = self__.len - 2;
    } else {
    }
    return tcoll__$1;
  } else {
    throw new Error("dissoc! after persistent!");
  }
};
cljs.core.TransientArrayMap.prototype.cljs$core$ITransientAssociative$_assoc_BANG_$arity$3 = function(tcoll, key, val) {
  var self__ = this;
  var tcoll__$1 = this;
  if (cljs.core.truth_(self__.editable_QMARK_)) {
    var idx = cljs.core.array_map_index_of.call(null, tcoll__$1, key);
    if (idx === -1) {
      if (self__.len + 2 <= 2 * cljs.core.PersistentArrayMap.HASHMAP_THRESHOLD) {
        self__.len = self__.len + 2;
        self__.arr.push(key);
        self__.arr.push(val);
        return tcoll__$1;
      } else {
        return cljs.core.assoc_BANG_.call(null, cljs.core.array__GT_transient_hash_map.call(null, self__.len, self__.arr), key, val);
      }
    } else {
      if (val === self__.arr[idx + 1]) {
        return tcoll__$1;
      } else {
        self__.arr[idx + 1] = val;
        return tcoll__$1;
      }
    }
  } else {
    throw new Error("assoc! after persistent!");
  }
};
cljs.core.TransientArrayMap.prototype.cljs$core$ITransientCollection$_conj_BANG_$arity$2 = function(tcoll, o) {
  var self__ = this;
  var tcoll__$1 = this;
  if (cljs.core.truth_(self__.editable_QMARK_)) {
    if (function() {
      var G__56892 = o;
      if (G__56892) {
        var bit__4302__auto__ = G__56892.cljs$lang$protocol_mask$partition0$ & 2048;
        if (bit__4302__auto__ || G__56892.cljs$core$IMapEntry$) {
          return true;
        } else {
          if (!G__56892.cljs$lang$protocol_mask$partition0$) {
            return cljs.core.native_satisfies_QMARK_.call(null, cljs.core.IMapEntry, G__56892);
          } else {
            return false;
          }
        }
      } else {
        return cljs.core.native_satisfies_QMARK_.call(null, cljs.core.IMapEntry, G__56892);
      }
    }()) {
      return cljs.core._assoc_BANG_.call(null, tcoll__$1, cljs.core.key.call(null, o), cljs.core.val.call(null, o));
    } else {
      var es = cljs.core.seq.call(null, o);
      var tcoll__$2 = tcoll__$1;
      while (true) {
        var temp__4124__auto__ = cljs.core.first.call(null, es);
        if (cljs.core.truth_(temp__4124__auto__)) {
          var e = temp__4124__auto__;
          var G__56894 = cljs.core.next.call(null, es);
          var G__56895 = cljs.core._assoc_BANG_.call(null, tcoll__$2, cljs.core.key.call(null, e), cljs.core.val.call(null, e));
          es = G__56894;
          tcoll__$2 = G__56895;
          continue;
        } else {
          return tcoll__$2;
        }
        break;
      }
    }
  } else {
    throw new Error("conj! after persistent!");
  }
};
cljs.core.TransientArrayMap.prototype.cljs$core$ITransientCollection$_persistent_BANG_$arity$1 = function(tcoll) {
  var self__ = this;
  var tcoll__$1 = this;
  if (cljs.core.truth_(self__.editable_QMARK_)) {
    self__.editable_QMARK_ = false;
    return new cljs.core.PersistentArrayMap(null, cljs.core.quot.call(null, self__.len, 2), self__.arr, null);
  } else {
    throw new Error("persistent! called twice");
  }
};
cljs.core.TransientArrayMap.prototype.cljs$core$ILookup$_lookup$arity$2 = function(tcoll, k) {
  var self__ = this;
  var tcoll__$1 = this;
  return cljs.core._lookup.call(null, tcoll__$1, k, null);
};
cljs.core.TransientArrayMap.prototype.cljs$core$ILookup$_lookup$arity$3 = function(tcoll, k, not_found) {
  var self__ = this;
  var tcoll__$1 = this;
  if (cljs.core.truth_(self__.editable_QMARK_)) {
    var idx = cljs.core.array_map_index_of.call(null, tcoll__$1, k);
    if (idx === -1) {
      return not_found;
    } else {
      return self__.arr[idx + 1];
    }
  } else {
    throw new Error("lookup after persistent!");
  }
};
cljs.core.TransientArrayMap.prototype.cljs$core$ICounted$_count$arity$1 = function(tcoll) {
  var self__ = this;
  var tcoll__$1 = this;
  if (cljs.core.truth_(self__.editable_QMARK_)) {
    return cljs.core.quot.call(null, self__.len, 2);
  } else {
    throw new Error("count after persistent!");
  }
};
cljs.core.__GT_TransientArrayMap = function __GT_TransientArrayMap(editable_QMARK_, len, arr) {
  return new cljs.core.TransientArrayMap(editable_QMARK_, len, arr);
};
cljs.core.array__GT_transient_hash_map = function array__GT_transient_hash_map(len, arr) {
  var out = cljs.core.transient$.call(null, cljs.core.PersistentHashMap.EMPTY);
  var i = 0;
  while (true) {
    if (i < len) {
      var G__56896 = cljs.core.assoc_BANG_.call(null, out, arr[i], arr[i + 1]);
      var G__56897 = i + 2;
      out = G__56896;
      i = G__56897;
      continue;
    } else {
      return out;
    }
    break;
  }
};
cljs.core.Box = function(val) {
  this.val = val;
};
cljs.core.Box.cljs$lang$type = true;
cljs.core.Box.cljs$lang$ctorStr = "cljs.core/Box";
cljs.core.Box.cljs$lang$ctorPrWriter = function(this__4218__auto__, writer__4219__auto__, opts__4220__auto__) {
  return cljs.core._write.call(null, writer__4219__auto__, "cljs.core/Box");
};
cljs.core.__GT_Box = function __GT_Box(val) {
  return new cljs.core.Box(val);
};
cljs.core.key_test = function key_test(key, other) {
  if (key === other) {
    return true;
  } else {
    if (cljs.core.keyword_identical_QMARK_.call(null, key, other)) {
      return true;
    } else {
      return cljs.core._EQ_.call(null, key, other);
    }
  }
};
cljs.core.mask = function mask(hash, shift) {
  return hash >>> shift & 31;
};
cljs.core.clone_and_set = function() {
  var clone_and_set = null;
  var clone_and_set__3 = function(arr, i, a) {
    var G__56900 = cljs.core.aclone.call(null, arr);
    G__56900[i] = a;
    return G__56900;
  };
  var clone_and_set__5 = function(arr, i, a, j, b) {
    var G__56901 = cljs.core.aclone.call(null, arr);
    G__56901[i] = a;
    G__56901[j] = b;
    return G__56901;
  };
  clone_and_set = function(arr, i, a, j, b) {
    switch(arguments.length) {
      case 3:
        return clone_and_set__3.call(this, arr, i, a);
      case 5:
        return clone_and_set__5.call(this, arr, i, a, j, b);
    }
    throw new Error("Invalid arity: " + arguments.length);
  };
  clone_and_set.cljs$core$IFn$_invoke$arity$3 = clone_and_set__3;
  clone_and_set.cljs$core$IFn$_invoke$arity$5 = clone_and_set__5;
  return clone_and_set;
}();
cljs.core.remove_pair = function remove_pair(arr, i) {
  var new_arr = new Array(arr.length - 2);
  cljs.core.array_copy.call(null, arr, 0, new_arr, 0, 2 * i);
  cljs.core.array_copy.call(null, arr, 2 * (i + 1), new_arr, 2 * i, new_arr.length - 2 * i);
  return new_arr;
};
cljs.core.bitmap_indexed_node_index = function bitmap_indexed_node_index(bitmap, bit) {
  return cljs.core.bit_count.call(null, bitmap & bit - 1);
};
cljs.core.bitpos = function bitpos(hash, shift) {
  return 1 << (hash >>> shift & 31);
};
cljs.core.edit_and_set = function() {
  var edit_and_set = null;
  var edit_and_set__4 = function(inode, edit, i, a) {
    var editable = inode.ensure_editable(edit);
    editable.arr[i] = a;
    return editable;
  };
  var edit_and_set__6 = function(inode, edit, i, a, j, b) {
    var editable = inode.ensure_editable(edit);
    editable.arr[i] = a;
    editable.arr[j] = b;
    return editable;
  };
  edit_and_set = function(inode, edit, i, a, j, b) {
    switch(arguments.length) {
      case 4:
        return edit_and_set__4.call(this, inode, edit, i, a);
      case 6:
        return edit_and_set__6.call(this, inode, edit, i, a, j, b);
    }
    throw new Error("Invalid arity: " + arguments.length);
  };
  edit_and_set.cljs$core$IFn$_invoke$arity$4 = edit_and_set__4;
  edit_and_set.cljs$core$IFn$_invoke$arity$6 = edit_and_set__6;
  return edit_and_set;
}();
cljs.core.inode_kv_reduce = function inode_kv_reduce(arr, f, init) {
  var len = arr.length;
  var i = 0;
  var init__$1 = init;
  while (true) {
    if (i < len) {
      var init__$2 = function() {
        var k = arr[i];
        if (!(k == null)) {
          return f.call(null, init__$1, k, arr[i + 1]);
        } else {
          var node = arr[i + 1];
          if (!(node == null)) {
            return node.kv_reduce(f, init__$1);
          } else {
            return init__$1;
          }
        }
      }();
      if (cljs.core.reduced_QMARK_.call(null, init__$2)) {
        return cljs.core.deref.call(null, init__$2);
      } else {
        var G__56902 = i + 2;
        var G__56903 = init__$2;
        i = G__56902;
        init__$1 = G__56903;
        continue;
      }
    } else {
      return init__$1;
    }
    break;
  }
};
cljs.core.BitmapIndexedNode = function(edit, bitmap, arr) {
  this.edit = edit;
  this.bitmap = bitmap;
  this.arr = arr;
};
cljs.core.BitmapIndexedNode.cljs$lang$type = true;
cljs.core.BitmapIndexedNode.cljs$lang$ctorStr = "cljs.core/BitmapIndexedNode";
cljs.core.BitmapIndexedNode.cljs$lang$ctorPrWriter = function(this__4215__auto__, writer__4216__auto__, opt__4217__auto__) {
  return cljs.core._write.call(null, writer__4216__auto__, "cljs.core/BitmapIndexedNode");
};
cljs.core.BitmapIndexedNode.prototype.ensure_editable = function(e) {
  var self__ = this;
  var inode = this;
  if (e === self__.edit) {
    return inode;
  } else {
    var n = cljs.core.bit_count.call(null, self__.bitmap);
    var new_arr = new Array(n < 0 ? 4 : 2 * (n + 1));
    cljs.core.array_copy.call(null, self__.arr, 0, new_arr, 0, 2 * n);
    return new cljs.core.BitmapIndexedNode(e, self__.bitmap, new_arr);
  }
};
cljs.core.BitmapIndexedNode.prototype.inode_without_BANG_ = function(edit__$1, shift, hash, key, removed_leaf_QMARK_) {
  var self__ = this;
  var inode = this;
  var bit = 1 << (hash >>> shift & 31);
  if ((self__.bitmap & bit) === 0) {
    return inode;
  } else {
    var idx = cljs.core.bitmap_indexed_node_index.call(null, self__.bitmap, bit);
    var key_or_nil = self__.arr[2 * idx];
    var val_or_node = self__.arr[2 * idx + 1];
    if (key_or_nil == null) {
      var n = val_or_node.inode_without_BANG_(edit__$1, shift + 5, hash, key, removed_leaf_QMARK_);
      if (n === val_or_node) {
        return inode;
      } else {
        if (!(n == null)) {
          return cljs.core.edit_and_set.call(null, inode, edit__$1, 2 * idx + 1, n);
        } else {
          if (self__.bitmap === bit) {
            return null;
          } else {
            return inode.edit_and_remove_pair(edit__$1, bit, idx);
          }
        }
      }
    } else {
      if (cljs.core.key_test.call(null, key, key_or_nil)) {
        removed_leaf_QMARK_[0] = true;
        return inode.edit_and_remove_pair(edit__$1, bit, idx);
      } else {
        return inode;
      }
    }
  }
};
cljs.core.BitmapIndexedNode.prototype.edit_and_remove_pair = function(e, bit, i) {
  var self__ = this;
  var inode = this;
  if (self__.bitmap === bit) {
    return null;
  } else {
    var editable = inode.ensure_editable(e);
    var earr = editable.arr;
    var len = earr.length;
    editable.bitmap = bit ^ editable.bitmap;
    cljs.core.array_copy.call(null, earr, 2 * (i + 1), earr, 2 * i, len - 2 * (i + 1));
    earr[len - 2] = null;
    earr[len - 1] = null;
    return editable;
  }
};
cljs.core.BitmapIndexedNode.prototype.inode_seq = function() {
  var self__ = this;
  var inode = this;
  return cljs.core.create_inode_seq.call(null, self__.arr);
};
cljs.core.BitmapIndexedNode.prototype.kv_reduce = function(f, init) {
  var self__ = this;
  var inode = this;
  return cljs.core.inode_kv_reduce.call(null, self__.arr, f, init);
};
cljs.core.BitmapIndexedNode.prototype.inode_lookup = function(shift, hash, key, not_found) {
  var self__ = this;
  var inode = this;
  var bit = 1 << (hash >>> shift & 31);
  if ((self__.bitmap & bit) === 0) {
    return not_found;
  } else {
    var idx = cljs.core.bitmap_indexed_node_index.call(null, self__.bitmap, bit);
    var key_or_nil = self__.arr[2 * idx];
    var val_or_node = self__.arr[2 * idx + 1];
    if (key_or_nil == null) {
      return val_or_node.inode_lookup(shift + 5, hash, key, not_found);
    } else {
      if (cljs.core.key_test.call(null, key, key_or_nil)) {
        return val_or_node;
      } else {
        return not_found;
      }
    }
  }
};
cljs.core.BitmapIndexedNode.prototype.inode_assoc_BANG_ = function(edit__$1, shift, hash, key, val, added_leaf_QMARK_) {
  var self__ = this;
  var inode = this;
  var bit = 1 << (hash >>> shift & 31);
  var idx = cljs.core.bitmap_indexed_node_index.call(null, self__.bitmap, bit);
  if ((self__.bitmap & bit) === 0) {
    var n = cljs.core.bit_count.call(null, self__.bitmap);
    if (2 * n < self__.arr.length) {
      var editable = inode.ensure_editable(edit__$1);
      var earr = editable.arr;
      added_leaf_QMARK_.val = true;
      cljs.core.array_copy_downward.call(null, earr, 2 * idx, earr, 2 * (idx + 1), 2 * (n - idx));
      earr[2 * idx] = key;
      earr[2 * idx + 1] = val;
      editable.bitmap = editable.bitmap | bit;
      return editable;
    } else {
      if (n >= 16) {
        var nodes = [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null];
        var jdx = hash >>> shift & 31;
        nodes[jdx] = cljs.core.BitmapIndexedNode.EMPTY.inode_assoc_BANG_(edit__$1, shift + 5, hash, key, val, added_leaf_QMARK_);
        var i_56904 = 0;
        var j_56905 = 0;
        while (true) {
          if (i_56904 < 32) {
            if ((self__.bitmap >>> i_56904 & 1) === 0) {
              var G__56906 = i_56904 + 1;
              var G__56907 = j_56905;
              i_56904 = G__56906;
              j_56905 = G__56907;
              continue;
            } else {
              nodes[i_56904] = !(self__.arr[j_56905] == null) ? cljs.core.BitmapIndexedNode.EMPTY.inode_assoc_BANG_(edit__$1, shift + 5, cljs.core.hash.call(null, self__.arr[j_56905]), self__.arr[j_56905], self__.arr[j_56905 + 1], added_leaf_QMARK_) : self__.arr[j_56905 + 1];
              var G__56908 = i_56904 + 1;
              var G__56909 = j_56905 + 2;
              i_56904 = G__56908;
              j_56905 = G__56909;
              continue;
            }
          } else {
          }
          break;
        }
        return new cljs.core.ArrayNode(edit__$1, n + 1, nodes);
      } else {
        var new_arr = new Array(2 * (n + 4));
        cljs.core.array_copy.call(null, self__.arr, 0, new_arr, 0, 2 * idx);
        new_arr[2 * idx] = key;
        new_arr[2 * idx + 1] = val;
        cljs.core.array_copy.call(null, self__.arr, 2 * idx, new_arr, 2 * (idx + 1), 2 * (n - idx));
        added_leaf_QMARK_.val = true;
        var editable = inode.ensure_editable(edit__$1);
        editable.arr = new_arr;
        editable.bitmap = editable.bitmap | bit;
        return editable;
      }
    }
  } else {
    var key_or_nil = self__.arr[2 * idx];
    var val_or_node = self__.arr[2 * idx + 1];
    if (key_or_nil == null) {
      var n = val_or_node.inode_assoc_BANG_(edit__$1, shift + 5, hash, key, val, added_leaf_QMARK_);
      if (n === val_or_node) {
        return inode;
      } else {
        return cljs.core.edit_and_set.call(null, inode, edit__$1, 2 * idx + 1, n);
      }
    } else {
      if (cljs.core.key_test.call(null, key, key_or_nil)) {
        if (val === val_or_node) {
          return inode;
        } else {
          return cljs.core.edit_and_set.call(null, inode, edit__$1, 2 * idx + 1, val);
        }
      } else {
        added_leaf_QMARK_.val = true;
        return cljs.core.edit_and_set.call(null, inode, edit__$1, 2 * idx, null, 2 * idx + 1, cljs.core.create_node.call(null, edit__$1, shift + 5, key_or_nil, val_or_node, hash, key, val));
      }
    }
  }
};
cljs.core.BitmapIndexedNode.prototype.inode_assoc = function(shift, hash, key, val, added_leaf_QMARK_) {
  var self__ = this;
  var inode = this;
  var bit = 1 << (hash >>> shift & 31);
  var idx = cljs.core.bitmap_indexed_node_index.call(null, self__.bitmap, bit);
  if ((self__.bitmap & bit) === 0) {
    var n = cljs.core.bit_count.call(null, self__.bitmap);
    if (n >= 16) {
      var nodes = [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null];
      var jdx = hash >>> shift & 31;
      nodes[jdx] = cljs.core.BitmapIndexedNode.EMPTY.inode_assoc(shift + 5, hash, key, val, added_leaf_QMARK_);
      var i_56910 = 0;
      var j_56911 = 0;
      while (true) {
        if (i_56910 < 32) {
          if ((self__.bitmap >>> i_56910 & 1) === 0) {
            var G__56912 = i_56910 + 1;
            var G__56913 = j_56911;
            i_56910 = G__56912;
            j_56911 = G__56913;
            continue;
          } else {
            nodes[i_56910] = !(self__.arr[j_56911] == null) ? cljs.core.BitmapIndexedNode.EMPTY.inode_assoc(shift + 5, cljs.core.hash.call(null, self__.arr[j_56911]), self__.arr[j_56911], self__.arr[j_56911 + 1], added_leaf_QMARK_) : self__.arr[j_56911 + 1];
            var G__56914 = i_56910 + 1;
            var G__56915 = j_56911 + 2;
            i_56910 = G__56914;
            j_56911 = G__56915;
            continue;
          }
        } else {
        }
        break;
      }
      return new cljs.core.ArrayNode(null, n + 1, nodes);
    } else {
      var new_arr = new Array(2 * (n + 1));
      cljs.core.array_copy.call(null, self__.arr, 0, new_arr, 0, 2 * idx);
      new_arr[2 * idx] = key;
      new_arr[2 * idx + 1] = val;
      cljs.core.array_copy.call(null, self__.arr, 2 * idx, new_arr, 2 * (idx + 1), 2 * (n - idx));
      added_leaf_QMARK_.val = true;
      return new cljs.core.BitmapIndexedNode(null, self__.bitmap | bit, new_arr);
    }
  } else {
    var key_or_nil = self__.arr[2 * idx];
    var val_or_node = self__.arr[2 * idx + 1];
    if (key_or_nil == null) {
      var n = val_or_node.inode_assoc(shift + 5, hash, key, val, added_leaf_QMARK_);
      if (n === val_or_node) {
        return inode;
      } else {
        return new cljs.core.BitmapIndexedNode(null, self__.bitmap, cljs.core.clone_and_set.call(null, self__.arr, 2 * idx + 1, n));
      }
    } else {
      if (cljs.core.key_test.call(null, key, key_or_nil)) {
        if (val === val_or_node) {
          return inode;
        } else {
          return new cljs.core.BitmapIndexedNode(null, self__.bitmap, cljs.core.clone_and_set.call(null, self__.arr, 2 * idx + 1, val));
        }
      } else {
        added_leaf_QMARK_.val = true;
        return new cljs.core.BitmapIndexedNode(null, self__.bitmap, cljs.core.clone_and_set.call(null, self__.arr, 2 * idx, null, 2 * idx + 1, cljs.core.create_node.call(null, shift + 5, key_or_nil, val_or_node, hash, key, val)));
      }
    }
  }
};
cljs.core.BitmapIndexedNode.prototype.inode_find = function(shift, hash, key, not_found) {
  var self__ = this;
  var inode = this;
  var bit = 1 << (hash >>> shift & 31);
  if ((self__.bitmap & bit) === 0) {
    return not_found;
  } else {
    var idx = cljs.core.bitmap_indexed_node_index.call(null, self__.bitmap, bit);
    var key_or_nil = self__.arr[2 * idx];
    var val_or_node = self__.arr[2 * idx + 1];
    if (key_or_nil == null) {
      return val_or_node.inode_find(shift + 5, hash, key, not_found);
    } else {
      if (cljs.core.key_test.call(null, key, key_or_nil)) {
        return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [key_or_nil, val_or_node], null);
      } else {
        return not_found;
      }
    }
  }
};
cljs.core.BitmapIndexedNode.prototype.inode_without = function(shift, hash, key) {
  var self__ = this;
  var inode = this;
  var bit = 1 << (hash >>> shift & 31);
  if ((self__.bitmap & bit) === 0) {
    return inode;
  } else {
    var idx = cljs.core.bitmap_indexed_node_index.call(null, self__.bitmap, bit);
    var key_or_nil = self__.arr[2 * idx];
    var val_or_node = self__.arr[2 * idx + 1];
    if (key_or_nil == null) {
      var n = val_or_node.inode_without(shift + 5, hash, key);
      if (n === val_or_node) {
        return inode;
      } else {
        if (!(n == null)) {
          return new cljs.core.BitmapIndexedNode(null, self__.bitmap, cljs.core.clone_and_set.call(null, self__.arr, 2 * idx + 1, n));
        } else {
          if (self__.bitmap === bit) {
            return null;
          } else {
            return new cljs.core.BitmapIndexedNode(null, self__.bitmap ^ bit, cljs.core.remove_pair.call(null, self__.arr, idx));
          }
        }
      }
    } else {
      if (cljs.core.key_test.call(null, key, key_or_nil)) {
        return new cljs.core.BitmapIndexedNode(null, self__.bitmap ^ bit, cljs.core.remove_pair.call(null, self__.arr, idx));
      } else {
        return inode;
      }
    }
  }
};
cljs.core.__GT_BitmapIndexedNode = function __GT_BitmapIndexedNode(edit, bitmap, arr) {
  return new cljs.core.BitmapIndexedNode(edit, bitmap, arr);
};
cljs.core.BitmapIndexedNode.EMPTY = new cljs.core.BitmapIndexedNode(null, 0, []);
cljs.core.pack_array_node = function pack_array_node(array_node, edit, idx) {
  var arr = array_node.arr;
  var len = arr.length;
  var new_arr = new Array(2 * (array_node.cnt - 1));
  var i = 0;
  var j = 1;
  var bitmap = 0;
  while (true) {
    if (i < len) {
      if (!(i === idx) && !(arr[i] == null)) {
        new_arr[j] = arr[i];
        var G__56916 = i + 1;
        var G__56917 = j + 2;
        var G__56918 = bitmap | 1 << i;
        i = G__56916;
        j = G__56917;
        bitmap = G__56918;
        continue;
      } else {
        var G__56919 = i + 1;
        var G__56920 = j;
        var G__56921 = bitmap;
        i = G__56919;
        j = G__56920;
        bitmap = G__56921;
        continue;
      }
    } else {
      return new cljs.core.BitmapIndexedNode(edit, bitmap, new_arr);
    }
    break;
  }
};
cljs.core.ArrayNode = function(edit, cnt, arr) {
  this.edit = edit;
  this.cnt = cnt;
  this.arr = arr;
};
cljs.core.ArrayNode.cljs$lang$type = true;
cljs.core.ArrayNode.cljs$lang$ctorStr = "cljs.core/ArrayNode";
cljs.core.ArrayNode.cljs$lang$ctorPrWriter = function(this__4215__auto__, writer__4216__auto__, opt__4217__auto__) {
  return cljs.core._write.call(null, writer__4216__auto__, "cljs.core/ArrayNode");
};
cljs.core.ArrayNode.prototype.ensure_editable = function(e) {
  var self__ = this;
  var inode = this;
  if (e === self__.edit) {
    return inode;
  } else {
    return new cljs.core.ArrayNode(e, self__.cnt, cljs.core.aclone.call(null, self__.arr));
  }
};
cljs.core.ArrayNode.prototype.inode_without_BANG_ = function(edit__$1, shift, hash, key, removed_leaf_QMARK_) {
  var self__ = this;
  var inode = this;
  var idx = hash >>> shift & 31;
  var node = self__.arr[idx];
  if (node == null) {
    return inode;
  } else {
    var n = node.inode_without_BANG_(edit__$1, shift + 5, hash, key, removed_leaf_QMARK_);
    if (n === node) {
      return inode;
    } else {
      if (n == null) {
        if (self__.cnt <= 8) {
          return cljs.core.pack_array_node.call(null, inode, edit__$1, idx);
        } else {
          var editable = cljs.core.edit_and_set.call(null, inode, edit__$1, idx, n);
          editable.cnt = editable.cnt - 1;
          return editable;
        }
      } else {
        return cljs.core.edit_and_set.call(null, inode, edit__$1, idx, n);
      }
    }
  }
};
cljs.core.ArrayNode.prototype.inode_seq = function() {
  var self__ = this;
  var inode = this;
  return cljs.core.create_array_node_seq.call(null, self__.arr);
};
cljs.core.ArrayNode.prototype.kv_reduce = function(f, init) {
  var self__ = this;
  var inode = this;
  var len = self__.arr.length;
  var i = 0;
  var init__$1 = init;
  while (true) {
    if (i < len) {
      var node = self__.arr[i];
      if (!(node == null)) {
        var init__$2 = node.kv_reduce(f, init__$1);
        if (cljs.core.reduced_QMARK_.call(null, init__$2)) {
          return cljs.core.deref.call(null, init__$2);
        } else {
          var G__56922 = i + 1;
          var G__56923 = init__$2;
          i = G__56922;
          init__$1 = G__56923;
          continue;
        }
      } else {
        var G__56924 = i + 1;
        var G__56925 = init__$1;
        i = G__56924;
        init__$1 = G__56925;
        continue;
      }
    } else {
      return init__$1;
    }
    break;
  }
};
cljs.core.ArrayNode.prototype.inode_lookup = function(shift, hash, key, not_found) {
  var self__ = this;
  var inode = this;
  var idx = hash >>> shift & 31;
  var node = self__.arr[idx];
  if (!(node == null)) {
    return node.inode_lookup(shift + 5, hash, key, not_found);
  } else {
    return not_found;
  }
};
cljs.core.ArrayNode.prototype.inode_assoc_BANG_ = function(edit__$1, shift, hash, key, val, added_leaf_QMARK_) {
  var self__ = this;
  var inode = this;
  var idx = hash >>> shift & 31;
  var node = self__.arr[idx];
  if (node == null) {
    var editable = cljs.core.edit_and_set.call(null, inode, edit__$1, idx, cljs.core.BitmapIndexedNode.EMPTY.inode_assoc_BANG_(edit__$1, shift + 5, hash, key, val, added_leaf_QMARK_));
    editable.cnt = editable.cnt + 1;
    return editable;
  } else {
    var n = node.inode_assoc_BANG_(edit__$1, shift + 5, hash, key, val, added_leaf_QMARK_);
    if (n === node) {
      return inode;
    } else {
      return cljs.core.edit_and_set.call(null, inode, edit__$1, idx, n);
    }
  }
};
cljs.core.ArrayNode.prototype.inode_assoc = function(shift, hash, key, val, added_leaf_QMARK_) {
  var self__ = this;
  var inode = this;
  var idx = hash >>> shift & 31;
  var node = self__.arr[idx];
  if (node == null) {
    return new cljs.core.ArrayNode(null, self__.cnt + 1, cljs.core.clone_and_set.call(null, self__.arr, idx, cljs.core.BitmapIndexedNode.EMPTY.inode_assoc(shift + 5, hash, key, val, added_leaf_QMARK_)));
  } else {
    var n = node.inode_assoc(shift + 5, hash, key, val, added_leaf_QMARK_);
    if (n === node) {
      return inode;
    } else {
      return new cljs.core.ArrayNode(null, self__.cnt, cljs.core.clone_and_set.call(null, self__.arr, idx, n));
    }
  }
};
cljs.core.ArrayNode.prototype.inode_find = function(shift, hash, key, not_found) {
  var self__ = this;
  var inode = this;
  var idx = hash >>> shift & 31;
  var node = self__.arr[idx];
  if (!(node == null)) {
    return node.inode_find(shift + 5, hash, key, not_found);
  } else {
    return not_found;
  }
};
cljs.core.ArrayNode.prototype.inode_without = function(shift, hash, key) {
  var self__ = this;
  var inode = this;
  var idx = hash >>> shift & 31;
  var node = self__.arr[idx];
  if (!(node == null)) {
    var n = node.inode_without(shift + 5, hash, key);
    if (n === node) {
      return inode;
    } else {
      if (n == null) {
        if (self__.cnt <= 8) {
          return cljs.core.pack_array_node.call(null, inode, null, idx);
        } else {
          return new cljs.core.ArrayNode(null, self__.cnt - 1, cljs.core.clone_and_set.call(null, self__.arr, idx, n));
        }
      } else {
        return new cljs.core.ArrayNode(null, self__.cnt, cljs.core.clone_and_set.call(null, self__.arr, idx, n));
      }
    }
  } else {
    return inode;
  }
};
cljs.core.__GT_ArrayNode = function __GT_ArrayNode(edit, cnt, arr) {
  return new cljs.core.ArrayNode(edit, cnt, arr);
};
cljs.core.hash_collision_node_find_index = function hash_collision_node_find_index(arr, cnt, key) {
  var lim = 2 * cnt;
  var i = 0;
  while (true) {
    if (i < lim) {
      if (cljs.core.key_test.call(null, key, arr[i])) {
        return i;
      } else {
        var G__56926 = i + 2;
        i = G__56926;
        continue;
      }
    } else {
      return-1;
    }
    break;
  }
};
cljs.core.HashCollisionNode = function(edit, collision_hash, cnt, arr) {
  this.edit = edit;
  this.collision_hash = collision_hash;
  this.cnt = cnt;
  this.arr = arr;
};
cljs.core.HashCollisionNode.cljs$lang$type = true;
cljs.core.HashCollisionNode.cljs$lang$ctorStr = "cljs.core/HashCollisionNode";
cljs.core.HashCollisionNode.cljs$lang$ctorPrWriter = function(this__4215__auto__, writer__4216__auto__, opt__4217__auto__) {
  return cljs.core._write.call(null, writer__4216__auto__, "cljs.core/HashCollisionNode");
};
cljs.core.HashCollisionNode.prototype.ensure_editable = function(e) {
  var self__ = this;
  var inode = this;
  if (e === self__.edit) {
    return inode;
  } else {
    var new_arr = new Array(2 * (self__.cnt + 1));
    cljs.core.array_copy.call(null, self__.arr, 0, new_arr, 0, 2 * self__.cnt);
    return new cljs.core.HashCollisionNode(e, self__.collision_hash, self__.cnt, new_arr);
  }
};
cljs.core.HashCollisionNode.prototype.inode_without_BANG_ = function(edit__$1, shift, hash, key, removed_leaf_QMARK_) {
  var self__ = this;
  var inode = this;
  var idx = cljs.core.hash_collision_node_find_index.call(null, self__.arr, self__.cnt, key);
  if (idx === -1) {
    return inode;
  } else {
    removed_leaf_QMARK_[0] = true;
    if (self__.cnt === 1) {
      return null;
    } else {
      var editable = inode.ensure_editable(edit__$1);
      var earr = editable.arr;
      earr[idx] = earr[2 * self__.cnt - 2];
      earr[idx + 1] = earr[2 * self__.cnt - 1];
      earr[2 * self__.cnt - 1] = null;
      earr[2 * self__.cnt - 2] = null;
      editable.cnt = editable.cnt - 1;
      return editable;
    }
  }
};
cljs.core.HashCollisionNode.prototype.inode_seq = function() {
  var self__ = this;
  var inode = this;
  return cljs.core.create_inode_seq.call(null, self__.arr);
};
cljs.core.HashCollisionNode.prototype.kv_reduce = function(f, init) {
  var self__ = this;
  var inode = this;
  return cljs.core.inode_kv_reduce.call(null, self__.arr, f, init);
};
cljs.core.HashCollisionNode.prototype.inode_lookup = function(shift, hash, key, not_found) {
  var self__ = this;
  var inode = this;
  var idx = cljs.core.hash_collision_node_find_index.call(null, self__.arr, self__.cnt, key);
  if (idx < 0) {
    return not_found;
  } else {
    if (cljs.core.key_test.call(null, key, self__.arr[idx])) {
      return self__.arr[idx + 1];
    } else {
      return not_found;
    }
  }
};
cljs.core.HashCollisionNode.prototype.inode_assoc_BANG_ = function(edit__$1, shift, hash, key, val, added_leaf_QMARK_) {
  var self__ = this;
  var inode = this;
  if (hash === self__.collision_hash) {
    var idx = cljs.core.hash_collision_node_find_index.call(null, self__.arr, self__.cnt, key);
    if (idx === -1) {
      if (self__.arr.length > 2 * self__.cnt) {
        var editable = cljs.core.edit_and_set.call(null, inode, edit__$1, 2 * self__.cnt, key, 2 * self__.cnt + 1, val);
        added_leaf_QMARK_.val = true;
        editable.cnt = editable.cnt + 1;
        return editable;
      } else {
        var len = self__.arr.length;
        var new_arr = new Array(len + 2);
        cljs.core.array_copy.call(null, self__.arr, 0, new_arr, 0, len);
        new_arr[len] = key;
        new_arr[len + 1] = val;
        added_leaf_QMARK_.val = true;
        return inode.ensure_editable_array(edit__$1, self__.cnt + 1, new_arr);
      }
    } else {
      if (self__.arr[idx + 1] === val) {
        return inode;
      } else {
        return cljs.core.edit_and_set.call(null, inode, edit__$1, idx + 1, val);
      }
    }
  } else {
    return(new cljs.core.BitmapIndexedNode(edit__$1, 1 << (self__.collision_hash >>> shift & 31), [null, inode, null, null])).inode_assoc_BANG_(edit__$1, shift, hash, key, val, added_leaf_QMARK_);
  }
};
cljs.core.HashCollisionNode.prototype.inode_assoc = function(shift, hash, key, val, added_leaf_QMARK_) {
  var self__ = this;
  var inode = this;
  if (hash === self__.collision_hash) {
    var idx = cljs.core.hash_collision_node_find_index.call(null, self__.arr, self__.cnt, key);
    if (idx === -1) {
      var len = 2 * self__.cnt;
      var new_arr = new Array(len + 2);
      cljs.core.array_copy.call(null, self__.arr, 0, new_arr, 0, len);
      new_arr[len] = key;
      new_arr[len + 1] = val;
      added_leaf_QMARK_.val = true;
      return new cljs.core.HashCollisionNode(null, self__.collision_hash, self__.cnt + 1, new_arr);
    } else {
      if (cljs.core._EQ_.call(null, self__.arr[idx], val)) {
        return inode;
      } else {
        return new cljs.core.HashCollisionNode(null, self__.collision_hash, self__.cnt, cljs.core.clone_and_set.call(null, self__.arr, idx + 1, val));
      }
    }
  } else {
    return(new cljs.core.BitmapIndexedNode(null, 1 << (self__.collision_hash >>> shift & 31), [null, inode])).inode_assoc(shift, hash, key, val, added_leaf_QMARK_);
  }
};
cljs.core.HashCollisionNode.prototype.ensure_editable_array = function(e, count, array) {
  var self__ = this;
  var inode = this;
  if (e === self__.edit) {
    self__.arr = array;
    self__.cnt = count;
    return inode;
  } else {
    return new cljs.core.HashCollisionNode(self__.edit, self__.collision_hash, count, array);
  }
};
cljs.core.HashCollisionNode.prototype.inode_find = function(shift, hash, key, not_found) {
  var self__ = this;
  var inode = this;
  var idx = cljs.core.hash_collision_node_find_index.call(null, self__.arr, self__.cnt, key);
  if (idx < 0) {
    return not_found;
  } else {
    if (cljs.core.key_test.call(null, key, self__.arr[idx])) {
      return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [self__.arr[idx], self__.arr[idx + 1]], null);
    } else {
      return not_found;
    }
  }
};
cljs.core.HashCollisionNode.prototype.inode_without = function(shift, hash, key) {
  var self__ = this;
  var inode = this;
  var idx = cljs.core.hash_collision_node_find_index.call(null, self__.arr, self__.cnt, key);
  if (idx === -1) {
    return inode;
  } else {
    if (self__.cnt === 1) {
      return null;
    } else {
      return new cljs.core.HashCollisionNode(null, self__.collision_hash, self__.cnt - 1, cljs.core.remove_pair.call(null, self__.arr, cljs.core.quot.call(null, idx, 2)));
    }
  }
};
cljs.core.__GT_HashCollisionNode = function __GT_HashCollisionNode(edit, collision_hash, cnt, arr) {
  return new cljs.core.HashCollisionNode(edit, collision_hash, cnt, arr);
};
cljs.core.create_node = function() {
  var create_node = null;
  var create_node__6 = function(shift, key1, val1, key2hash, key2, val2) {
    var key1hash = cljs.core.hash.call(null, key1);
    if (key1hash === key2hash) {
      return new cljs.core.HashCollisionNode(null, key1hash, 2, [key1, val1, key2, val2]);
    } else {
      var added_leaf_QMARK_ = new cljs.core.Box(false);
      return cljs.core.BitmapIndexedNode.EMPTY.inode_assoc(shift, key1hash, key1, val1, added_leaf_QMARK_).inode_assoc(shift, key2hash, key2, val2, added_leaf_QMARK_);
    }
  };
  var create_node__7 = function(edit, shift, key1, val1, key2hash, key2, val2) {
    var key1hash = cljs.core.hash.call(null, key1);
    if (key1hash === key2hash) {
      return new cljs.core.HashCollisionNode(null, key1hash, 2, [key1, val1, key2, val2]);
    } else {
      var added_leaf_QMARK_ = new cljs.core.Box(false);
      return cljs.core.BitmapIndexedNode.EMPTY.inode_assoc_BANG_(edit, shift, key1hash, key1, val1, added_leaf_QMARK_).inode_assoc_BANG_(edit, shift, key2hash, key2, val2, added_leaf_QMARK_);
    }
  };
  create_node = function(edit, shift, key1, val1, key2hash, key2, val2) {
    switch(arguments.length) {
      case 6:
        return create_node__6.call(this, edit, shift, key1, val1, key2hash, key2);
      case 7:
        return create_node__7.call(this, edit, shift, key1, val1, key2hash, key2, val2);
    }
    throw new Error("Invalid arity: " + arguments.length);
  };
  create_node.cljs$core$IFn$_invoke$arity$6 = create_node__6;
  create_node.cljs$core$IFn$_invoke$arity$7 = create_node__7;
  return create_node;
}();
cljs.core.NodeSeq = function(meta, nodes, i, s, __hash) {
  this.meta = meta;
  this.nodes = nodes;
  this.i = i;
  this.s = s;
  this.__hash = __hash;
  this.cljs$lang$protocol_mask$partition1$ = 0;
  this.cljs$lang$protocol_mask$partition0$ = 32374860;
};
cljs.core.NodeSeq.cljs$lang$type = true;
cljs.core.NodeSeq.cljs$lang$ctorStr = "cljs.core/NodeSeq";
cljs.core.NodeSeq.cljs$lang$ctorPrWriter = function(this__4215__auto__, writer__4216__auto__, opt__4217__auto__) {
  return cljs.core._write.call(null, writer__4216__auto__, "cljs.core/NodeSeq");
};
cljs.core.NodeSeq.prototype.toString = function() {
  var self__ = this;
  var coll = this;
  return cljs.core.pr_str_STAR_.call(null, coll);
};
cljs.core.NodeSeq.prototype.equiv = function(other) {
  var self__ = this;
  var this$ = this;
  return this$.cljs$core$IEquiv$_equiv$arity$2(null, other);
};
cljs.core.NodeSeq.prototype.cljs$core$IMeta$_meta$arity$1 = function(coll) {
  var self__ = this;
  var coll__$1 = this;
  return self__.meta;
};
cljs.core.NodeSeq.prototype.cljs$core$IHash$_hash$arity$1 = function(coll) {
  var self__ = this;
  var coll__$1 = this;
  var h__4050__auto__ = self__.__hash;
  if (!(h__4050__auto__ == null)) {
    return h__4050__auto__;
  } else {
    var h__4050__auto____$1 = cljs.core.hash_ordered_coll.call(null, coll__$1);
    self__.__hash = h__4050__auto____$1;
    return h__4050__auto____$1;
  }
};
cljs.core.NodeSeq.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(coll, other) {
  var self__ = this;
  var coll__$1 = this;
  return cljs.core.equiv_sequential.call(null, coll__$1, other);
};
cljs.core.NodeSeq.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(coll) {
  var self__ = this;
  var coll__$1 = this;
  return cljs.core.with_meta.call(null, cljs.core.List.EMPTY, self__.meta);
};
cljs.core.NodeSeq.prototype.cljs$core$IReduce$_reduce$arity$2 = function(coll, f) {
  var self__ = this;
  var coll__$1 = this;
  return cljs.core.seq_reduce.call(null, f, coll__$1);
};
cljs.core.NodeSeq.prototype.cljs$core$IReduce$_reduce$arity$3 = function(coll, f, start) {
  var self__ = this;
  var coll__$1 = this;
  return cljs.core.seq_reduce.call(null, f, start, coll__$1);
};
cljs.core.NodeSeq.prototype.cljs$core$ISeq$_first$arity$1 = function(coll) {
  var self__ = this;
  var coll__$1 = this;
  if (self__.s == null) {
    return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [self__.nodes[self__.i], self__.nodes[self__.i + 1]], null);
  } else {
    return cljs.core.first.call(null, self__.s);
  }
};
cljs.core.NodeSeq.prototype.cljs$core$ISeq$_rest$arity$1 = function(coll) {
  var self__ = this;
  var coll__$1 = this;
  if (self__.s == null) {
    return cljs.core.create_inode_seq.call(null, self__.nodes, self__.i + 2, null);
  } else {
    return cljs.core.create_inode_seq.call(null, self__.nodes, self__.i, cljs.core.next.call(null, self__.s));
  }
};
cljs.core.NodeSeq.prototype.cljs$core$ISeqable$_seq$arity$1 = function(this$) {
  var self__ = this;
  var this$__$1 = this;
  return this$__$1;
};
cljs.core.NodeSeq.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(coll, meta__$1) {
  var self__ = this;
  var coll__$1 = this;
  return new cljs.core.NodeSeq(meta__$1, self__.nodes, self__.i, self__.s, self__.__hash);
};
cljs.core.NodeSeq.prototype.cljs$core$ICollection$_conj$arity$2 = function(coll, o) {
  var self__ = this;
  var coll__$1 = this;
  return cljs.core.cons.call(null, o, coll__$1);
};
cljs.core.__GT_NodeSeq = function __GT_NodeSeq(meta, nodes, i, s, __hash) {
  return new cljs.core.NodeSeq(meta, nodes, i, s, __hash);
};
cljs.core.create_inode_seq = function() {
  var create_inode_seq = null;
  var create_inode_seq__1 = function(nodes) {
    return create_inode_seq.call(null, nodes, 0, null);
  };
  var create_inode_seq__3 = function(nodes, i, s) {
    if (s == null) {
      var len = nodes.length;
      var j = i;
      while (true) {
        if (j < len) {
          if (!(nodes[j] == null)) {
            return new cljs.core.NodeSeq(null, nodes, j, null, null);
          } else {
            var temp__4124__auto__ = nodes[j + 1];
            if (cljs.core.truth_(temp__4124__auto__)) {
              var node = temp__4124__auto__;
              var temp__4124__auto____$1 = node.inode_seq();
              if (cljs.core.truth_(temp__4124__auto____$1)) {
                var node_seq = temp__4124__auto____$1;
                return new cljs.core.NodeSeq(null, nodes, j + 2, node_seq, null);
              } else {
                var G__56927 = j + 2;
                j = G__56927;
                continue;
              }
            } else {
              var G__56928 = j + 2;
              j = G__56928;
              continue;
            }
          }
        } else {
          return null;
        }
        break;
      }
    } else {
      return new cljs.core.NodeSeq(null, nodes, i, s, null);
    }
  };
  create_inode_seq = function(nodes, i, s) {
    switch(arguments.length) {
      case 1:
        return create_inode_seq__1.call(this, nodes);
      case 3:
        return create_inode_seq__3.call(this, nodes, i, s);
    }
    throw new Error("Invalid arity: " + arguments.length);
  };
  create_inode_seq.cljs$core$IFn$_invoke$arity$1 = create_inode_seq__1;
  create_inode_seq.cljs$core$IFn$_invoke$arity$3 = create_inode_seq__3;
  return create_inode_seq;
}();
cljs.core.ArrayNodeSeq = function(meta, nodes, i, s, __hash) {
  this.meta = meta;
  this.nodes = nodes;
  this.i = i;
  this.s = s;
  this.__hash = __hash;
  this.cljs$lang$protocol_mask$partition1$ = 0;
  this.cljs$lang$protocol_mask$partition0$ = 32374860;
};
cljs.core.ArrayNodeSeq.cljs$lang$type = true;
cljs.core.ArrayNodeSeq.cljs$lang$ctorStr = "cljs.core/ArrayNodeSeq";
cljs.core.ArrayNodeSeq.cljs$lang$ctorPrWriter = function(this__4215__auto__, writer__4216__auto__, opt__4217__auto__) {
  return cljs.core._write.call(null, writer__4216__auto__, "cljs.core/ArrayNodeSeq");
};
cljs.core.ArrayNodeSeq.prototype.toString = function() {
  var self__ = this;
  var coll = this;
  return cljs.core.pr_str_STAR_.call(null, coll);
};
cljs.core.ArrayNodeSeq.prototype.equiv = function(other) {
  var self__ = this;
  var this$ = this;
  return this$.cljs$core$IEquiv$_equiv$arity$2(null, other);
};
cljs.core.ArrayNodeSeq.prototype.cljs$core$IMeta$_meta$arity$1 = function(coll) {
  var self__ = this;
  var coll__$1 = this;
  return self__.meta;
};
cljs.core.ArrayNodeSeq.prototype.cljs$core$IHash$_hash$arity$1 = function(coll) {
  var self__ = this;
  var coll__$1 = this;
  var h__4050__auto__ = self__.__hash;
  if (!(h__4050__auto__ == null)) {
    return h__4050__auto__;
  } else {
    var h__4050__auto____$1 = cljs.core.hash_ordered_coll.call(null, coll__$1);
    self__.__hash = h__4050__auto____$1;
    return h__4050__auto____$1;
  }
};
cljs.core.ArrayNodeSeq.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(coll, other) {
  var self__ = this;
  var coll__$1 = this;
  return cljs.core.equiv_sequential.call(null, coll__$1, other);
};
cljs.core.ArrayNodeSeq.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(coll) {
  var self__ = this;
  var coll__$1 = this;
  return cljs.core.with_meta.call(null, cljs.core.List.EMPTY, self__.meta);
};
cljs.core.ArrayNodeSeq.prototype.cljs$core$IReduce$_reduce$arity$2 = function(coll, f) {
  var self__ = this;
  var coll__$1 = this;
  return cljs.core.seq_reduce.call(null, f, coll__$1);
};
cljs.core.ArrayNodeSeq.prototype.cljs$core$IReduce$_reduce$arity$3 = function(coll, f, start) {
  var self__ = this;
  var coll__$1 = this;
  return cljs.core.seq_reduce.call(null, f, start, coll__$1);
};
cljs.core.ArrayNodeSeq.prototype.cljs$core$ISeq$_first$arity$1 = function(coll) {
  var self__ = this;
  var coll__$1 = this;
  return cljs.core.first.call(null, self__.s);
};
cljs.core.ArrayNodeSeq.prototype.cljs$core$ISeq$_rest$arity$1 = function(coll) {
  var self__ = this;
  var coll__$1 = this;
  return cljs.core.create_array_node_seq.call(null, null, self__.nodes, self__.i, cljs.core.next.call(null, self__.s));
};
cljs.core.ArrayNodeSeq.prototype.cljs$core$ISeqable$_seq$arity$1 = function(this$) {
  var self__ = this;
  var this$__$1 = this;
  return this$__$1;
};
cljs.core.ArrayNodeSeq.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(coll, meta__$1) {
  var self__ = this;
  var coll__$1 = this;
  return new cljs.core.ArrayNodeSeq(meta__$1, self__.nodes, self__.i, self__.s, self__.__hash);
};
cljs.core.ArrayNodeSeq.prototype.cljs$core$ICollection$_conj$arity$2 = function(coll, o) {
  var self__ = this;
  var coll__$1 = this;
  return cljs.core.cons.call(null, o, coll__$1);
};
cljs.core.__GT_ArrayNodeSeq = function __GT_ArrayNodeSeq(meta, nodes, i, s, __hash) {
  return new cljs.core.ArrayNodeSeq(meta, nodes, i, s, __hash);
};
cljs.core.create_array_node_seq = function() {
  var create_array_node_seq = null;
  var create_array_node_seq__1 = function(nodes) {
    return create_array_node_seq.call(null, null, nodes, 0, null);
  };
  var create_array_node_seq__4 = function(meta, nodes, i, s) {
    if (s == null) {
      var len = nodes.length;
      var j = i;
      while (true) {
        if (j < len) {
          var temp__4124__auto__ = nodes[j];
          if (cljs.core.truth_(temp__4124__auto__)) {
            var nj = temp__4124__auto__;
            var temp__4124__auto____$1 = nj.inode_seq();
            if (cljs.core.truth_(temp__4124__auto____$1)) {
              var ns = temp__4124__auto____$1;
              return new cljs.core.ArrayNodeSeq(meta, nodes, j + 1, ns, null);
            } else {
              var G__56929 = j + 1;
              j = G__56929;
              continue;
            }
          } else {
            var G__56930 = j + 1;
            j = G__56930;
            continue;
          }
        } else {
          return null;
        }
        break;
      }
    } else {
      return new cljs.core.ArrayNodeSeq(meta, nodes, i, s, null);
    }
  };
  create_array_node_seq = function(meta, nodes, i, s) {
    switch(arguments.length) {
      case 1:
        return create_array_node_seq__1.call(this, meta);
      case 4:
        return create_array_node_seq__4.call(this, meta, nodes, i, s);
    }
    throw new Error("Invalid arity: " + arguments.length);
  };
  create_array_node_seq.cljs$core$IFn$_invoke$arity$1 = create_array_node_seq__1;
  create_array_node_seq.cljs$core$IFn$_invoke$arity$4 = create_array_node_seq__4;
  return create_array_node_seq;
}();
cljs.core.PersistentHashMap = function(meta, cnt, root, has_nil_QMARK_, nil_val, __hash) {
  this.meta = meta;
  this.cnt = cnt;
  this.root = root;
  this.has_nil_QMARK_ = has_nil_QMARK_;
  this.nil_val = nil_val;
  this.__hash = __hash;
  this.cljs$lang$protocol_mask$partition0$ = 16123663;
  this.cljs$lang$protocol_mask$partition1$ = 8196;
};
cljs.core.PersistentHashMap.cljs$lang$type = true;
cljs.core.PersistentHashMap.cljs$lang$ctorStr = "cljs.core/PersistentHashMap";
cljs.core.PersistentHashMap.cljs$lang$ctorPrWriter = function(this__4215__auto__, writer__4216__auto__, opt__4217__auto__) {
  return cljs.core._write.call(null, writer__4216__auto__, "cljs.core/PersistentHashMap");
};
cljs.core.PersistentHashMap.prototype.toString = function() {
  var self__ = this;
  var coll = this;
  return cljs.core.pr_str_STAR_.call(null, coll);
};
cljs.core.PersistentHashMap.prototype.equiv = function(other) {
  var self__ = this;
  var this$ = this;
  return this$.cljs$core$IEquiv$_equiv$arity$2(null, other);
};
cljs.core.PersistentHashMap.prototype.keys = function() {
  var self__ = this;
  var coll = this;
  return cljs.core.iterator.call(null, cljs.core.keys.call(null, coll));
};
cljs.core.PersistentHashMap.prototype.entries = function() {
  var self__ = this;
  var coll = this;
  return cljs.core.entries_iterator.call(null, cljs.core.seq.call(null, coll));
};
cljs.core.PersistentHashMap.prototype.values = function() {
  var self__ = this;
  var coll = this;
  return cljs.core.iterator.call(null, cljs.core.vals.call(null, coll));
};
cljs.core.PersistentHashMap.prototype.has = function(k) {
  var self__ = this;
  var coll = this;
  return cljs.core.contains_QMARK_.call(null, coll, k);
};
cljs.core.PersistentHashMap.prototype.get = function(k) {
  var self__ = this;
  var coll = this;
  return coll.cljs$core$ILookup$_lookup$arity$2(null, k);
};
cljs.core.PersistentHashMap.prototype.forEach = function(f) {
  var self__ = this;
  var coll = this;
  var seq__56932 = cljs.core.seq.call(null, coll);
  var chunk__56933 = null;
  var count__56934 = 0;
  var i__56935 = 0;
  while (true) {
    if (i__56935 < count__56934) {
      var vec__56936 = cljs.core._nth.call(null, chunk__56933, i__56935);
      var k = cljs.core.nth.call(null, vec__56936, 0, null);
      var v = cljs.core.nth.call(null, vec__56936, 1, null);
      f.call(null, v, k);
      var G__56940 = seq__56932;
      var G__56941 = chunk__56933;
      var G__56942 = count__56934;
      var G__56943 = i__56935 + 1;
      seq__56932 = G__56940;
      chunk__56933 = G__56941;
      count__56934 = G__56942;
      i__56935 = G__56943;
      continue;
    } else {
      var temp__4126__auto__ = cljs.core.seq.call(null, seq__56932);
      if (temp__4126__auto__) {
        var seq__56932__$1 = temp__4126__auto__;
        if (cljs.core.chunked_seq_QMARK_.call(null, seq__56932__$1)) {
          var c__4408__auto__ = cljs.core.chunk_first.call(null, seq__56932__$1);
          var G__56944 = cljs.core.chunk_rest.call(null, seq__56932__$1);
          var G__56945 = c__4408__auto__;
          var G__56946 = cljs.core.count.call(null, c__4408__auto__);
          var G__56947 = 0;
          seq__56932 = G__56944;
          chunk__56933 = G__56945;
          count__56934 = G__56946;
          i__56935 = G__56947;
          continue;
        } else {
          var vec__56937 = cljs.core.first.call(null, seq__56932__$1);
          var k = cljs.core.nth.call(null, vec__56937, 0, null);
          var v = cljs.core.nth.call(null, vec__56937, 1, null);
          f.call(null, v, k);
          var G__56948 = cljs.core.next.call(null, seq__56932__$1);
          var G__56949 = null;
          var G__56950 = 0;
          var G__56951 = 0;
          seq__56932 = G__56948;
          chunk__56933 = G__56949;
          count__56934 = G__56950;
          i__56935 = G__56951;
          continue;
        }
      } else {
        return null;
      }
    }
    break;
  }
};
cljs.core.PersistentHashMap.prototype.cljs$core$ILookup$_lookup$arity$2 = function(coll, k) {
  var self__ = this;
  var coll__$1 = this;
  return cljs.core._lookup.call(null, coll__$1, k, null);
};
cljs.core.PersistentHashMap.prototype.cljs$core$ILookup$_lookup$arity$3 = function(coll, k, not_found) {
  var self__ = this;
  var coll__$1 = this;
  if (k == null) {
    if (self__.has_nil_QMARK_) {
      return self__.nil_val;
    } else {
      return not_found;
    }
  } else {
    if (self__.root == null) {
      return not_found;
    } else {
      return self__.root.inode_lookup(0, cljs.core.hash.call(null, k), k, not_found);
    }
  }
};
cljs.core.PersistentHashMap.prototype.cljs$core$IKVReduce$_kv_reduce$arity$3 = function(coll, f, init) {
  var self__ = this;
  var coll__$1 = this;
  var init__$1 = self__.has_nil_QMARK_ ? f.call(null, init, null, self__.nil_val) : init;
  if (cljs.core.reduced_QMARK_.call(null, init__$1)) {
    return cljs.core.deref.call(null, init__$1);
  } else {
    if (!(self__.root == null)) {
      return self__.root.kv_reduce(f, init__$1);
    } else {
      return init__$1;
    }
  }
};
cljs.core.PersistentHashMap.prototype.cljs$core$IMeta$_meta$arity$1 = function(coll) {
  var self__ = this;
  var coll__$1 = this;
  return self__.meta;
};
cljs.core.PersistentHashMap.prototype.cljs$core$ICloneable$_clone$arity$1 = function(_) {
  var self__ = this;
  var ___$1 = this;
  return new cljs.core.PersistentHashMap(self__.meta, self__.cnt, self__.root, self__.has_nil_QMARK_, self__.nil_val, self__.__hash);
};
cljs.core.PersistentHashMap.prototype.cljs$core$ICounted$_count$arity$1 = function(coll) {
  var self__ = this;
  var coll__$1 = this;
  return self__.cnt;
};
cljs.core.PersistentHashMap.prototype.cljs$core$IHash$_hash$arity$1 = function(coll) {
  var self__ = this;
  var coll__$1 = this;
  var h__4050__auto__ = self__.__hash;
  if (!(h__4050__auto__ == null)) {
    return h__4050__auto__;
  } else {
    var h__4050__auto____$1 = cljs.core.hash_unordered_coll.call(null, coll__$1);
    self__.__hash = h__4050__auto____$1;
    return h__4050__auto____$1;
  }
};
cljs.core.PersistentHashMap.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(coll, other) {
  var self__ = this;
  var coll__$1 = this;
  return cljs.core.equiv_map.call(null, coll__$1, other);
};
cljs.core.PersistentHashMap.prototype.cljs$core$IEditableCollection$_as_transient$arity$1 = function(coll) {
  var self__ = this;
  var coll__$1 = this;
  return new cljs.core.TransientHashMap(function() {
    var obj56939 = {};
    return obj56939;
  }(), self__.root, self__.cnt, self__.has_nil_QMARK_, self__.nil_val);
};
cljs.core.PersistentHashMap.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(coll) {
  var self__ = this;
  var coll__$1 = this;
  return cljs.core._with_meta.call(null, cljs.core.PersistentHashMap.EMPTY, self__.meta);
};
cljs.core.PersistentHashMap.prototype.cljs$core$IMap$_dissoc$arity$2 = function(coll, k) {
  var self__ = this;
  var coll__$1 = this;
  if (k == null) {
    if (self__.has_nil_QMARK_) {
      return new cljs.core.PersistentHashMap(self__.meta, self__.cnt - 1, self__.root, false, null, null);
    } else {
      return coll__$1;
    }
  } else {
    if (self__.root == null) {
      return coll__$1;
    } else {
      var new_root = self__.root.inode_without(0, cljs.core.hash.call(null, k), k);
      if (new_root === self__.root) {
        return coll__$1;
      } else {
        return new cljs.core.PersistentHashMap(self__.meta, self__.cnt - 1, new_root, self__.has_nil_QMARK_, self__.nil_val, null);
      }
    }
  }
};
cljs.core.PersistentHashMap.prototype.cljs$core$IAssociative$_assoc$arity$3 = function(coll, k, v) {
  var self__ = this;
  var coll__$1 = this;
  if (k == null) {
    if (self__.has_nil_QMARK_ && v === self__.nil_val) {
      return coll__$1;
    } else {
      return new cljs.core.PersistentHashMap(self__.meta, self__.has_nil_QMARK_ ? self__.cnt : self__.cnt + 1, self__.root, true, v, null);
    }
  } else {
    var added_leaf_QMARK_ = new cljs.core.Box(false);
    var new_root = (self__.root == null ? cljs.core.BitmapIndexedNode.EMPTY : self__.root).inode_assoc(0, cljs.core.hash.call(null, k), k, v, added_leaf_QMARK_);
    if (new_root === self__.root) {
      return coll__$1;
    } else {
      return new cljs.core.PersistentHashMap(self__.meta, added_leaf_QMARK_.val ? self__.cnt + 1 : self__.cnt, new_root, self__.has_nil_QMARK_, self__.nil_val, null);
    }
  }
};
cljs.core.PersistentHashMap.prototype.cljs$core$IAssociative$_contains_key_QMARK_$arity$2 = function(coll, k) {
  var self__ = this;
  var coll__$1 = this;
  if (k == null) {
    return self__.has_nil_QMARK_;
  } else {
    if (self__.root == null) {
      return false;
    } else {
      return!(self__.root.inode_lookup(0, cljs.core.hash.call(null, k), k, cljs.core.lookup_sentinel) === cljs.core.lookup_sentinel);
    }
  }
};
cljs.core.PersistentHashMap.prototype.cljs$core$ISeqable$_seq$arity$1 = function(coll) {
  var self__ = this;
  var coll__$1 = this;
  if (self__.cnt > 0) {
    var s = !(self__.root == null) ? self__.root.inode_seq() : null;
    if (self__.has_nil_QMARK_) {
      return cljs.core.cons.call(null, new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [null, self__.nil_val], null), s);
    } else {
      return s;
    }
  } else {
    return null;
  }
};
cljs.core.PersistentHashMap.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(coll, meta__$1) {
  var self__ = this;
  var coll__$1 = this;
  return new cljs.core.PersistentHashMap(meta__$1, self__.cnt, self__.root, self__.has_nil_QMARK_, self__.nil_val, self__.__hash);
};
cljs.core.PersistentHashMap.prototype.cljs$core$ICollection$_conj$arity$2 = function(coll, entry) {
  var self__ = this;
  var coll__$1 = this;
  if (cljs.core.vector_QMARK_.call(null, entry)) {
    return cljs.core._assoc.call(null, coll__$1, cljs.core._nth.call(null, entry, 0), cljs.core._nth.call(null, entry, 1));
  } else {
    var ret = coll__$1;
    var es = cljs.core.seq.call(null, entry);
    while (true) {
      if (es == null) {
        return ret;
      } else {
        var e = cljs.core.first.call(null, es);
        if (cljs.core.vector_QMARK_.call(null, e)) {
          var G__56952 = cljs.core._assoc.call(null, ret, cljs.core._nth.call(null, e, 0), cljs.core._nth.call(null, e, 1));
          var G__56953 = cljs.core.next.call(null, es);
          ret = G__56952;
          es = G__56953;
          continue;
        } else {
          throw new Error("conj on a map takes map entries or seqables of map entries");
        }
      }
      break;
    }
  }
};
cljs.core.PersistentHashMap.prototype.call = function() {
  var G__56954 = null;
  var G__56954__2 = function(self__, k) {
    var self__ = this;
    var self____$1 = this;
    var coll = self____$1;
    return coll.cljs$core$ILookup$_lookup$arity$2(null, k);
  };
  var G__56954__3 = function(self__, k, not_found) {
    var self__ = this;
    var self____$1 = this;
    var coll = self____$1;
    return coll.cljs$core$ILookup$_lookup$arity$3(null, k, not_found);
  };
  G__56954 = function(self__, k, not_found) {
    switch(arguments.length) {
      case 2:
        return G__56954__2.call(this, self__, k);
      case 3:
        return G__56954__3.call(this, self__, k, not_found);
    }
    throw new Error("Invalid arity: " + arguments.length);
  };
  G__56954.cljs$core$IFn$_invoke$arity$2 = G__56954__2;
  G__56954.cljs$core$IFn$_invoke$arity$3 = G__56954__3;
  return G__56954;
}();
cljs.core.PersistentHashMap.prototype.apply = function(self__, args56931) {
  var self__ = this;
  var self____$1 = this;
  return self____$1.call.apply(self____$1, [self____$1].concat(cljs.core.aclone.call(null, args56931)));
};
cljs.core.PersistentHashMap.prototype.cljs$core$IFn$_invoke$arity$1 = function(k) {
  var self__ = this;
  var coll = this;
  return coll.cljs$core$ILookup$_lookup$arity$2(null, k);
};
cljs.core.PersistentHashMap.prototype.cljs$core$IFn$_invoke$arity$2 = function(k, not_found) {
  var self__ = this;
  var coll = this;
  return coll.cljs$core$ILookup$_lookup$arity$3(null, k, not_found);
};
cljs.core.__GT_PersistentHashMap = function __GT_PersistentHashMap(meta, cnt, root, has_nil_QMARK_, nil_val, __hash) {
  return new cljs.core.PersistentHashMap(meta, cnt, root, has_nil_QMARK_, nil_val, __hash);
};
cljs.core.PersistentHashMap.EMPTY = new cljs.core.PersistentHashMap(null, 0, null, false, null, 0);
cljs.core.PersistentHashMap.fromArrays = function(ks, vs) {
  var len = ks.length;
  var i = 0;
  var out = cljs.core.transient$.call(null, cljs.core.PersistentHashMap.EMPTY);
  while (true) {
    if (i < len) {
      var G__56955 = i + 1;
      var G__56956 = cljs.core._assoc_BANG_.call(null, out, ks[i], vs[i]);
      i = G__56955;
      out = G__56956;
      continue;
    } else {
      return cljs.core.persistent_BANG_.call(null, out);
    }
    break;
  }
};
cljs.core.TransientHashMap = function(edit, root, count, has_nil_QMARK_, nil_val) {
  this.edit = edit;
  this.root = root;
  this.count = count;
  this.has_nil_QMARK_ = has_nil_QMARK_;
  this.nil_val = nil_val;
  this.cljs$lang$protocol_mask$partition1$ = 56;
  this.cljs$lang$protocol_mask$partition0$ = 258;
};
cljs.core.TransientHashMap.cljs$lang$type = true;
cljs.core.TransientHashMap.cljs$lang$ctorStr = "cljs.core/TransientHashMap";
cljs.core.TransientHashMap.cljs$lang$ctorPrWriter = function(this__4215__auto__, writer__4216__auto__, opt__4217__auto__) {
  return cljs.core._write.call(null, writer__4216__auto__, "cljs.core/TransientHashMap");
};
cljs.core.TransientHashMap.prototype.cljs$core$ITransientMap$_dissoc_BANG_$arity$2 = function(tcoll, key) {
  var self__ = this;
  var tcoll__$1 = this;
  return tcoll__$1.without_BANG_(key);
};
cljs.core.TransientHashMap.prototype.cljs$core$ITransientAssociative$_assoc_BANG_$arity$3 = function(tcoll, key, val) {
  var self__ = this;
  var tcoll__$1 = this;
  return tcoll__$1.assoc_BANG_(key, val);
};
cljs.core.TransientHashMap.prototype.cljs$core$ITransientCollection$_conj_BANG_$arity$2 = function(tcoll, val) {
  var self__ = this;
  var tcoll__$1 = this;
  return tcoll__$1.conj_BANG_(val);
};
cljs.core.TransientHashMap.prototype.cljs$core$ITransientCollection$_persistent_BANG_$arity$1 = function(tcoll) {
  var self__ = this;
  var tcoll__$1 = this;
  return tcoll__$1.persistent_BANG_();
};
cljs.core.TransientHashMap.prototype.cljs$core$ILookup$_lookup$arity$2 = function(tcoll, k) {
  var self__ = this;
  var tcoll__$1 = this;
  if (k == null) {
    if (self__.has_nil_QMARK_) {
      return self__.nil_val;
    } else {
      return null;
    }
  } else {
    if (self__.root == null) {
      return null;
    } else {
      return self__.root.inode_lookup(0, cljs.core.hash.call(null, k), k);
    }
  }
};
cljs.core.TransientHashMap.prototype.cljs$core$ILookup$_lookup$arity$3 = function(tcoll, k, not_found) {
  var self__ = this;
  var tcoll__$1 = this;
  if (k == null) {
    if (self__.has_nil_QMARK_) {
      return self__.nil_val;
    } else {
      return not_found;
    }
  } else {
    if (self__.root == null) {
      return not_found;
    } else {
      return self__.root.inode_lookup(0, cljs.core.hash.call(null, k), k, not_found);
    }
  }
};
cljs.core.TransientHashMap.prototype.cljs$core$ICounted$_count$arity$1 = function(coll) {
  var self__ = this;
  var coll__$1 = this;
  if (self__.edit) {
    return self__.count;
  } else {
    throw new Error("count after persistent!");
  }
};
cljs.core.TransientHashMap.prototype.conj_BANG_ = function(o) {
  var self__ = this;
  var tcoll = this;
  if (self__.edit) {
    if (function() {
      var G__56957 = o;
      if (G__56957) {
        var bit__4302__auto__ = G__56957.cljs$lang$protocol_mask$partition0$ & 2048;
        if (bit__4302__auto__ || G__56957.cljs$core$IMapEntry$) {
          return true;
        } else {
          if (!G__56957.cljs$lang$protocol_mask$partition0$) {
            return cljs.core.native_satisfies_QMARK_.call(null, cljs.core.IMapEntry, G__56957);
          } else {
            return false;
          }
        }
      } else {
        return cljs.core.native_satisfies_QMARK_.call(null, cljs.core.IMapEntry, G__56957);
      }
    }()) {
      return tcoll.assoc_BANG_(cljs.core.key.call(null, o), cljs.core.val.call(null, o));
    } else {
      var es = cljs.core.seq.call(null, o);
      var tcoll__$1 = tcoll;
      while (true) {
        var temp__4124__auto__ = cljs.core.first.call(null, es);
        if (cljs.core.truth_(temp__4124__auto__)) {
          var e = temp__4124__auto__;
          var G__56958 = cljs.core.next.call(null, es);
          var G__56959 = tcoll__$1.assoc_BANG_(cljs.core.key.call(null, e), cljs.core.val.call(null, e));
          es = G__56958;
          tcoll__$1 = G__56959;
          continue;
        } else {
          return tcoll__$1;
        }
        break;
      }
    }
  } else {
    throw new Error("conj! after persistent");
  }
};
cljs.core.TransientHashMap.prototype.assoc_BANG_ = function(k, v) {
  var self__ = this;
  var tcoll = this;
  if (self__.edit) {
    if (k == null) {
      if (self__.nil_val === v) {
      } else {
        self__.nil_val = v;
      }
      if (self__.has_nil_QMARK_) {
      } else {
        self__.count = self__.count + 1;
        self__.has_nil_QMARK_ = true;
      }
      return tcoll;
    } else {
      var added_leaf_QMARK_ = new cljs.core.Box(false);
      var node = (self__.root == null ? cljs.core.BitmapIndexedNode.EMPTY : self__.root).inode_assoc_BANG_(self__.edit, 0, cljs.core.hash.call(null, k), k, v, added_leaf_QMARK_);
      if (node === self__.root) {
      } else {
        self__.root = node;
      }
      if (added_leaf_QMARK_.val) {
        self__.count = self__.count + 1;
      } else {
      }
      return tcoll;
    }
  } else {
    throw new Error("assoc! after persistent!");
  }
};
cljs.core.TransientHashMap.prototype.without_BANG_ = function(k) {
  var self__ = this;
  var tcoll = this;
  if (self__.edit) {
    if (k == null) {
      if (self__.has_nil_QMARK_) {
        self__.has_nil_QMARK_ = false;
        self__.nil_val = null;
        self__.count = self__.count - 1;
        return tcoll;
      } else {
        return tcoll;
      }
    } else {
      if (self__.root == null) {
        return tcoll;
      } else {
        var removed_leaf_QMARK_ = new cljs.core.Box(false);
        var node = self__.root.inode_without_BANG_(self__.edit, 0, cljs.core.hash.call(null, k), k, removed_leaf_QMARK_);
        if (node === self__.root) {
        } else {
          self__.root = node;
        }
        if (cljs.core.truth_(removed_leaf_QMARK_[0])) {
          self__.count = self__.count - 1;
        } else {
        }
        return tcoll;
      }
    }
  } else {
    throw new Error("dissoc! after persistent!");
  }
};
cljs.core.TransientHashMap.prototype.persistent_BANG_ = function() {
  var self__ = this;
  var tcoll = this;
  if (self__.edit) {
    self__.edit = null;
    return new cljs.core.PersistentHashMap(null, self__.count, self__.root, self__.has_nil_QMARK_, self__.nil_val, null);
  } else {
    throw new Error("persistent! called twice");
  }
};
cljs.core.__GT_TransientHashMap = function __GT_TransientHashMap(edit, root, count, has_nil_QMARK_, nil_val) {
  return new cljs.core.TransientHashMap(edit, root, count, has_nil_QMARK_, nil_val);
};
cljs.core.tree_map_seq_push = function tree_map_seq_push(node, stack, ascending_QMARK_) {
  var t = node;
  var stack__$1 = stack;
  while (true) {
    if (!(t == null)) {
      var G__56960 = ascending_QMARK_ ? t.left : t.right;
      var G__56961 = cljs.core.conj.call(null, stack__$1, t);
      t = G__56960;
      stack__$1 = G__56961;
      continue;
    } else {
      return stack__$1;
    }
    break;
  }
};
cljs.core.PersistentTreeMapSeq = function(meta, stack, ascending_QMARK_, cnt, __hash) {
  this.meta = meta;
  this.stack = stack;
  this.ascending_QMARK_ = ascending_QMARK_;
  this.cnt = cnt;
  this.__hash = __hash;
  this.cljs$lang$protocol_mask$partition1$ = 0;
  this.cljs$lang$protocol_mask$partition0$ = 32374862;
};
cljs.core.PersistentTreeMapSeq.cljs$lang$type = true;
cljs.core.PersistentTreeMapSeq.cljs$lang$ctorStr = "cljs.core/PersistentTreeMapSeq";
cljs.core.PersistentTreeMapSeq.cljs$lang$ctorPrWriter = function(this__4215__auto__, writer__4216__auto__, opt__4217__auto__) {
  return cljs.core._write.call(null, writer__4216__auto__, "cljs.core/PersistentTreeMapSeq");
};
cljs.core.PersistentTreeMapSeq.prototype.toString = function() {
  var self__ = this;
  var coll = this;
  return cljs.core.pr_str_STAR_.call(null, coll);
};
cljs.core.PersistentTreeMapSeq.prototype.equiv = function(other) {
  var self__ = this;
  var this$ = this;
  return this$.cljs$core$IEquiv$_equiv$arity$2(null, other);
};
cljs.core.PersistentTreeMapSeq.prototype.cljs$core$IMeta$_meta$arity$1 = function(coll) {
  var self__ = this;
  var coll__$1 = this;
  return self__.meta;
};
cljs.core.PersistentTreeMapSeq.prototype.cljs$core$ICounted$_count$arity$1 = function(coll) {
  var self__ = this;
  var coll__$1 = this;
  if (self__.cnt < 0) {
    return cljs.core.count.call(null, cljs.core.next.call(null, coll__$1)) + 1;
  } else {
    return self__.cnt;
  }
};
cljs.core.PersistentTreeMapSeq.prototype.cljs$core$IHash$_hash$arity$1 = function(coll) {
  var self__ = this;
  var coll__$1 = this;
  var h__4050__auto__ = self__.__hash;
  if (!(h__4050__auto__ == null)) {
    return h__4050__auto__;
  } else {
    var h__4050__auto____$1 = cljs.core.hash_ordered_coll.call(null, coll__$1);
    self__.__hash = h__4050__auto____$1;
    return h__4050__auto____$1;
  }
};
cljs.core.PersistentTreeMapSeq.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(coll, other) {
  var self__ = this;
  var coll__$1 = this;
  return cljs.core.equiv_sequential.call(null, coll__$1, other);
};
cljs.core.PersistentTreeMapSeq.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(coll) {
  var self__ = this;
  var coll__$1 = this;
  return cljs.core.with_meta.call(null, cljs.core.List.EMPTY, self__.meta);
};
cljs.core.PersistentTreeMapSeq.prototype.cljs$core$IReduce$_reduce$arity$2 = function(coll, f) {
  var self__ = this;
  var coll__$1 = this;
  return cljs.core.seq_reduce.call(null, f, coll__$1);
};
cljs.core.PersistentTreeMapSeq.prototype.cljs$core$IReduce$_reduce$arity$3 = function(coll, f, start) {
  var self__ = this;
  var coll__$1 = this;
  return cljs.core.seq_reduce.call(null, f, start, coll__$1);
};
cljs.core.PersistentTreeMapSeq.prototype.cljs$core$ISeq$_first$arity$1 = function(this$) {
  var self__ = this;
  var this$__$1 = this;
  return cljs.core.peek.call(null, self__.stack);
};
cljs.core.PersistentTreeMapSeq.prototype.cljs$core$ISeq$_rest$arity$1 = function(this$) {
  var self__ = this;
  var this$__$1 = this;
  var t = cljs.core.first.call(null, self__.stack);
  var next_stack = cljs.core.tree_map_seq_push.call(null, self__.ascending_QMARK_ ? t.right : t.left, cljs.core.next.call(null, self__.stack), self__.ascending_QMARK_);
  if (!(next_stack == null)) {
    return new cljs.core.PersistentTreeMapSeq(null, next_stack, self__.ascending_QMARK_, self__.cnt - 1, null);
  } else {
    return cljs.core.List.EMPTY;
  }
};
cljs.core.PersistentTreeMapSeq.prototype.cljs$core$ISeqable$_seq$arity$1 = function(this$) {
  var self__ = this;
  var this$__$1 = this;
  return this$__$1;
};
cljs.core.PersistentTreeMapSeq.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(coll, meta__$1) {
  var self__ = this;
  var coll__$1 = this;
  return new cljs.core.PersistentTreeMapSeq(meta__$1, self__.stack, self__.ascending_QMARK_, self__.cnt, self__.__hash);
};
cljs.core.PersistentTreeMapSeq.prototype.cljs$core$ICollection$_conj$arity$2 = function(coll, o) {
  var self__ = this;
  var coll__$1 = this;
  return cljs.core.cons.call(null, o, coll__$1);
};
cljs.core.__GT_PersistentTreeMapSeq = function __GT_PersistentTreeMapSeq(meta, stack, ascending_QMARK_, cnt, __hash) {
  return new cljs.core.PersistentTreeMapSeq(meta, stack, ascending_QMARK_, cnt, __hash);
};
cljs.core.create_tree_map_seq = function create_tree_map_seq(tree, ascending_QMARK_, cnt) {
  return new cljs.core.PersistentTreeMapSeq(null, cljs.core.tree_map_seq_push.call(null, tree, null, ascending_QMARK_), ascending_QMARK_, cnt, null);
};
cljs.core.balance_left = function balance_left(key, val, ins, right) {
  if (ins instanceof cljs.core.RedNode) {
    if (ins.left instanceof cljs.core.RedNode) {
      return new cljs.core.RedNode(ins.key, ins.val, ins.left.blacken(), new cljs.core.BlackNode(key, val, ins.right, right, null), null);
    } else {
      if (ins.right instanceof cljs.core.RedNode) {
        return new cljs.core.RedNode(ins.right.key, ins.right.val, new cljs.core.BlackNode(ins.key, ins.val, ins.left, ins.right.left, null), new cljs.core.BlackNode(key, val, ins.right.right, right, null), null);
      } else {
        return new cljs.core.BlackNode(key, val, ins, right, null);
      }
    }
  } else {
    return new cljs.core.BlackNode(key, val, ins, right, null);
  }
};
cljs.core.balance_right = function balance_right(key, val, left, ins) {
  if (ins instanceof cljs.core.RedNode) {
    if (ins.right instanceof cljs.core.RedNode) {
      return new cljs.core.RedNode(ins.key, ins.val, new cljs.core.BlackNode(key, val, left, ins.left, null), ins.right.blacken(), null);
    } else {
      if (ins.left instanceof cljs.core.RedNode) {
        return new cljs.core.RedNode(ins.left.key, ins.left.val, new cljs.core.BlackNode(key, val, left, ins.left.left, null), new cljs.core.BlackNode(ins.key, ins.val, ins.left.right, ins.right, null), null);
      } else {
        return new cljs.core.BlackNode(key, val, left, ins, null);
      }
    }
  } else {
    return new cljs.core.BlackNode(key, val, left, ins, null);
  }
};
cljs.core.balance_left_del = function balance_left_del(key, val, del, right) {
  if (del instanceof cljs.core.RedNode) {
    return new cljs.core.RedNode(key, val, del.blacken(), right, null);
  } else {
    if (right instanceof cljs.core.BlackNode) {
      return cljs.core.balance_right.call(null, key, val, del, right.redden());
    } else {
      if (right instanceof cljs.core.RedNode && right.left instanceof cljs.core.BlackNode) {
        return new cljs.core.RedNode(right.left.key, right.left.val, new cljs.core.BlackNode(key, val, del, right.left.left, null), cljs.core.balance_right.call(null, right.key, right.val, right.left.right, right.right.redden()), null);
      } else {
        throw new Error("red-black tree invariant violation");
      }
    }
  }
};
cljs.core.balance_right_del = function balance_right_del(key, val, left, del) {
  if (del instanceof cljs.core.RedNode) {
    return new cljs.core.RedNode(key, val, left, del.blacken(), null);
  } else {
    if (left instanceof cljs.core.BlackNode) {
      return cljs.core.balance_left.call(null, key, val, left.redden(), del);
    } else {
      if (left instanceof cljs.core.RedNode && left.right instanceof cljs.core.BlackNode) {
        return new cljs.core.RedNode(left.right.key, left.right.val, cljs.core.balance_left.call(null, left.key, left.val, left.left.redden(), left.right.left), new cljs.core.BlackNode(key, val, left.right.right, del, null), null);
      } else {
        throw new Error("red-black tree invariant violation");
      }
    }
  }
};
cljs.core.tree_map_kv_reduce = function tree_map_kv_reduce(node, f, init) {
  var init__$1 = !(node.left == null) ? tree_map_kv_reduce.call(null, node.left, f, init) : init;
  if (cljs.core.reduced_QMARK_.call(null, init__$1)) {
    return cljs.core.deref.call(null, init__$1);
  } else {
    var init__$2 = f.call(null, init__$1, node.key, node.val);
    if (cljs.core.reduced_QMARK_.call(null, init__$2)) {
      return cljs.core.deref.call(null, init__$2);
    } else {
      var init__$3 = !(node.right == null) ? tree_map_kv_reduce.call(null, node.right, f, init__$2) : init__$2;
      if (cljs.core.reduced_QMARK_.call(null, init__$3)) {
        return cljs.core.deref.call(null, init__$3);
      } else {
        return init__$3;
      }
    }
  }
};
cljs.core.BlackNode = function(key, val, left, right, __hash) {
  this.key = key;
  this.val = val;
  this.left = left;
  this.right = right;
  this.__hash = __hash;
  this.cljs$lang$protocol_mask$partition1$ = 0;
  this.cljs$lang$protocol_mask$partition0$ = 32402207;
};
cljs.core.BlackNode.cljs$lang$type = true;
cljs.core.BlackNode.cljs$lang$ctorStr = "cljs.core/BlackNode";
cljs.core.BlackNode.cljs$lang$ctorPrWriter = function(this__4215__auto__, writer__4216__auto__, opt__4217__auto__) {
  return cljs.core._write.call(null, writer__4216__auto__, "cljs.core/BlackNode");
};
cljs.core.BlackNode.prototype.add_right = function(ins) {
  var self__ = this;
  var node = this;
  return ins.balance_right(node);
};
cljs.core.BlackNode.prototype.redden = function() {
  var self__ = this;
  var node = this;
  return new cljs.core.RedNode(self__.key, self__.val, self__.left, self__.right, null);
};
cljs.core.BlackNode.prototype.blacken = function() {
  var self__ = this;
  var node = this;
  return node;
};
cljs.core.BlackNode.prototype.add_left = function(ins) {
  var self__ = this;
  var node = this;
  return ins.balance_left(node);
};
cljs.core.BlackNode.prototype.replace = function(key__$1, val__$1, left__$1, right__$1) {
  var self__ = this;
  var node = this;
  return new cljs.core.BlackNode(key__$1, val__$1, left__$1, right__$1, null);
};
cljs.core.BlackNode.prototype.balance_left = function(parent) {
  var self__ = this;
  var node = this;
  return new cljs.core.BlackNode(parent.key, parent.val, node, parent.right, null);
};
cljs.core.BlackNode.prototype.balance_right = function(parent) {
  var self__ = this;
  var node = this;
  return new cljs.core.BlackNode(parent.key, parent.val, parent.left, node, null);
};
cljs.core.BlackNode.prototype.remove_left = function(del) {
  var self__ = this;
  var node = this;
  return cljs.core.balance_left_del.call(null, self__.key, self__.val, del, self__.right);
};
cljs.core.BlackNode.prototype.kv_reduce = function(f, init) {
  var self__ = this;
  var node = this;
  return cljs.core.tree_map_kv_reduce.call(null, node, f, init);
};
cljs.core.BlackNode.prototype.remove_right = function(del) {
  var self__ = this;
  var node = this;
  return cljs.core.balance_right_del.call(null, self__.key, self__.val, self__.left, del);
};
cljs.core.BlackNode.prototype.cljs$core$ILookup$_lookup$arity$2 = function(node, k) {
  var self__ = this;
  var node__$1 = this;
  return cljs.core._nth.call(null, node__$1, k, null);
};
cljs.core.BlackNode.prototype.cljs$core$ILookup$_lookup$arity$3 = function(node, k, not_found) {
  var self__ = this;
  var node__$1 = this;
  return cljs.core._nth.call(null, node__$1, k, not_found);
};
cljs.core.BlackNode.prototype.cljs$core$IIndexed$_nth$arity$2 = function(node, n) {
  var self__ = this;
  var node__$1 = this;
  if (n === 0) {
    return self__.key;
  } else {
    if (n === 1) {
      return self__.val;
    } else {
      return null;
    }
  }
};
cljs.core.BlackNode.prototype.cljs$core$IIndexed$_nth$arity$3 = function(node, n, not_found) {
  var self__ = this;
  var node__$1 = this;
  if (n === 0) {
    return self__.key;
  } else {
    if (n === 1) {
      return self__.val;
    } else {
      return not_found;
    }
  }
};
cljs.core.BlackNode.prototype.cljs$core$IVector$_assoc_n$arity$3 = function(node, n, v) {
  var self__ = this;
  var node__$1 = this;
  return(new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [self__.key, self__.val], null)).cljs$core$IVector$_assoc_n$arity$3(null, n, v);
};
cljs.core.BlackNode.prototype.cljs$core$IMeta$_meta$arity$1 = function(node) {
  var self__ = this;
  var node__$1 = this;
  return null;
};
cljs.core.BlackNode.prototype.cljs$core$ICounted$_count$arity$1 = function(node) {
  var self__ = this;
  var node__$1 = this;
  return 2;
};
cljs.core.BlackNode.prototype.cljs$core$IMapEntry$_key$arity$1 = function(node) {
  var self__ = this;
  var node__$1 = this;
  return self__.key;
};
cljs.core.BlackNode.prototype.cljs$core$IMapEntry$_val$arity$1 = function(node) {
  var self__ = this;
  var node__$1 = this;
  return self__.val;
};
cljs.core.BlackNode.prototype.cljs$core$IStack$_peek$arity$1 = function(node) {
  var self__ = this;
  var node__$1 = this;
  return self__.val;
};
cljs.core.BlackNode.prototype.cljs$core$IStack$_pop$arity$1 = function(node) {
  var self__ = this;
  var node__$1 = this;
  return new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [self__.key], null);
};
cljs.core.BlackNode.prototype.cljs$core$IHash$_hash$arity$1 = function(coll) {
  var self__ = this;
  var coll__$1 = this;
  var h__4050__auto__ = self__.__hash;
  if (!(h__4050__auto__ == null)) {
    return h__4050__auto__;
  } else {
    var h__4050__auto____$1 = cljs.core.hash_ordered_coll.call(null, coll__$1);
    self__.__hash = h__4050__auto____$1;
    return h__4050__auto____$1;
  }
};
cljs.core.BlackNode.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(coll, other) {
  var self__ = this;
  var coll__$1 = this;
  return cljs.core.equiv_sequential.call(null, coll__$1, other);
};
cljs.core.BlackNode.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(node) {
  var self__ = this;
  var node__$1 = this;
  return cljs.core.PersistentVector.EMPTY;
};
cljs.core.BlackNode.prototype.cljs$core$IReduce$_reduce$arity$2 = function(node, f) {
  var self__ = this;
  var node__$1 = this;
  return cljs.core.ci_reduce.call(null, node__$1, f);
};
cljs.core.BlackNode.prototype.cljs$core$IReduce$_reduce$arity$3 = function(node, f, start) {
  var self__ = this;
  var node__$1 = this;
  return cljs.core.ci_reduce.call(null, node__$1, f, start);
};
cljs.core.BlackNode.prototype.cljs$core$IAssociative$_assoc$arity$3 = function(node, k, v) {
  var self__ = this;
  var node__$1 = this;
  return cljs.core.assoc.call(null, new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [self__.key, self__.val], null), k, v);
};
cljs.core.BlackNode.prototype.cljs$core$ISeqable$_seq$arity$1 = function(node) {
  var self__ = this;
  var node__$1 = this;
  return cljs.core._conj.call(null, cljs.core._conj.call(null, cljs.core.List.EMPTY, self__.val), self__.key);
};
cljs.core.BlackNode.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(node, meta) {
  var self__ = this;
  var node__$1 = this;
  return cljs.core.with_meta.call(null, new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [self__.key, self__.val], null), meta);
};
cljs.core.BlackNode.prototype.cljs$core$ICollection$_conj$arity$2 = function(node, o) {
  var self__ = this;
  var node__$1 = this;
  return new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [self__.key, self__.val, o], null);
};
cljs.core.BlackNode.prototype.call = function() {
  var G__56963 = null;
  var G__56963__2 = function(self__, k) {
    var self__ = this;
    var self____$1 = this;
    var node = self____$1;
    return node.cljs$core$ILookup$_lookup$arity$2(null, k);
  };
  var G__56963__3 = function(self__, k, not_found) {
    var self__ = this;
    var self____$1 = this;
    var node = self____$1;
    return node.cljs$core$ILookup$_lookup$arity$3(null, k, not_found);
  };
  G__56963 = function(self__, k, not_found) {
    switch(arguments.length) {
      case 2:
        return G__56963__2.call(this, self__, k);
      case 3:
        return G__56963__3.call(this, self__, k, not_found);
    }
    throw new Error("Invalid arity: " + arguments.length);
  };
  G__56963.cljs$core$IFn$_invoke$arity$2 = G__56963__2;
  G__56963.cljs$core$IFn$_invoke$arity$3 = G__56963__3;
  return G__56963;
}();
cljs.core.BlackNode.prototype.apply = function(self__, args56962) {
  var self__ = this;
  var self____$1 = this;
  return self____$1.call.apply(self____$1, [self____$1].concat(cljs.core.aclone.call(null, args56962)));
};
cljs.core.BlackNode.prototype.cljs$core$IFn$_invoke$arity$1 = function(k) {
  var self__ = this;
  var node = this;
  return node.cljs$core$ILookup$_lookup$arity$2(null, k);
};
cljs.core.BlackNode.prototype.cljs$core$IFn$_invoke$arity$2 = function(k, not_found) {
  var self__ = this;
  var node = this;
  return node.cljs$core$ILookup$_lookup$arity$3(null, k, not_found);
};
cljs.core.__GT_BlackNode = function __GT_BlackNode(key, val, left, right, __hash) {
  return new cljs.core.BlackNode(key, val, left, right, __hash);
};
cljs.core.RedNode = function(key, val, left, right, __hash) {
  this.key = key;
  this.val = val;
  this.left = left;
  this.right = right;
  this.__hash = __hash;
  this.cljs$lang$protocol_mask$partition1$ = 0;
  this.cljs$lang$protocol_mask$partition0$ = 32402207;
};
cljs.core.RedNode.cljs$lang$type = true;
cljs.core.RedNode.cljs$lang$ctorStr = "cljs.core/RedNode";
cljs.core.RedNode.cljs$lang$ctorPrWriter = function(this__4215__auto__, writer__4216__auto__, opt__4217__auto__) {
  return cljs.core._write.call(null, writer__4216__auto__, "cljs.core/RedNode");
};
cljs.core.RedNode.prototype.add_right = function(ins) {
  var self__ = this;
  var node = this;
  return new cljs.core.RedNode(self__.key, self__.val, self__.left, ins, null);
};
cljs.core.RedNode.prototype.redden = function() {
  var self__ = this;
  var node = this;
  throw new Error("red-black tree invariant violation");
};
cljs.core.RedNode.prototype.blacken = function() {
  var self__ = this;
  var node = this;
  return new cljs.core.BlackNode(self__.key, self__.val, self__.left, self__.right, null);
};
cljs.core.RedNode.prototype.add_left = function(ins) {
  var self__ = this;
  var node = this;
  return new cljs.core.RedNode(self__.key, self__.val, ins, self__.right, null);
};
cljs.core.RedNode.prototype.replace = function(key__$1, val__$1, left__$1, right__$1) {
  var self__ = this;
  var node = this;
  return new cljs.core.RedNode(key__$1, val__$1, left__$1, right__$1, null);
};
cljs.core.RedNode.prototype.balance_left = function(parent) {
  var self__ = this;
  var node = this;
  if (self__.left instanceof cljs.core.RedNode) {
    return new cljs.core.RedNode(self__.key, self__.val, self__.left.blacken(), new cljs.core.BlackNode(parent.key, parent.val, self__.right, parent.right, null), null);
  } else {
    if (self__.right instanceof cljs.core.RedNode) {
      return new cljs.core.RedNode(self__.right.key, self__.right.val, new cljs.core.BlackNode(self__.key, self__.val, self__.left, self__.right.left, null), new cljs.core.BlackNode(parent.key, parent.val, self__.right.right, parent.right, null), null);
    } else {
      return new cljs.core.BlackNode(parent.key, parent.val, node, parent.right, null);
    }
  }
};
cljs.core.RedNode.prototype.balance_right = function(parent) {
  var self__ = this;
  var node = this;
  if (self__.right instanceof cljs.core.RedNode) {
    return new cljs.core.RedNode(self__.key, self__.val, new cljs.core.BlackNode(parent.key, parent.val, parent.left, self__.left, null), self__.right.blacken(), null);
  } else {
    if (self__.left instanceof cljs.core.RedNode) {
      return new cljs.core.RedNode(self__.left.key, self__.left.val, new cljs.core.BlackNode(parent.key, parent.val, parent.left, self__.left.left, null), new cljs.core.BlackNode(self__.key, self__.val, self__.left.right, self__.right, null), null);
    } else {
      return new cljs.core.BlackNode(parent.key, parent.val, parent.left, node, null);
    }
  }
};
cljs.core.RedNode.prototype.remove_left = function(del) {
  var self__ = this;
  var node = this;
  return new cljs.core.RedNode(self__.key, self__.val, del, self__.right, null);
};
cljs.core.RedNode.prototype.kv_reduce = function(f, init) {
  var self__ = this;
  var node = this;
  return cljs.core.tree_map_kv_reduce.call(null, node, f, init);
};
cljs.core.RedNode.prototype.remove_right = function(del) {
  var self__ = this;
  var node = this;
  return new cljs.core.RedNode(self__.key, self__.val, self__.left, del, null);
};
cljs.core.RedNode.prototype.cljs$core$ILookup$_lookup$arity$2 = function(node, k) {
  var self__ = this;
  var node__$1 = this;
  return cljs.core._nth.call(null, node__$1, k, null);
};
cljs.core.RedNode.prototype.cljs$core$ILookup$_lookup$arity$3 = function(node, k, not_found) {
  var self__ = this;
  var node__$1 = this;
  return cljs.core._nth.call(null, node__$1, k, not_found);
};
cljs.core.RedNode.prototype.cljs$core$IIndexed$_nth$arity$2 = function(node, n) {
  var self__ = this;
  var node__$1 = this;
  if (n === 0) {
    return self__.key;
  } else {
    if (n === 1) {
      return self__.val;
    } else {
      return null;
    }
  }
};
cljs.core.RedNode.prototype.cljs$core$IIndexed$_nth$arity$3 = function(node, n, not_found) {
  var self__ = this;
  var node__$1 = this;
  if (n === 0) {
    return self__.key;
  } else {
    if (n === 1) {
      return self__.val;
    } else {
      return not_found;
    }
  }
};
cljs.core.RedNode.prototype.cljs$core$IVector$_assoc_n$arity$3 = function(node, n, v) {
  var self__ = this;
  var node__$1 = this;
  return(new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [self__.key, self__.val], null)).cljs$core$IVector$_assoc_n$arity$3(null, n, v);
};
cljs.core.RedNode.prototype.cljs$core$IMeta$_meta$arity$1 = function(node) {
  var self__ = this;
  var node__$1 = this;
  return null;
};
cljs.core.RedNode.prototype.cljs$core$ICounted$_count$arity$1 = function(node) {
  var self__ = this;
  var node__$1 = this;
  return 2;
};
cljs.core.RedNode.prototype.cljs$core$IMapEntry$_key$arity$1 = function(node) {
  var self__ = this;
  var node__$1 = this;
  return self__.key;
};
cljs.core.RedNode.prototype.cljs$core$IMapEntry$_val$arity$1 = function(node) {
  var self__ = this;
  var node__$1 = this;
  return self__.val;
};
cljs.core.RedNode.prototype.cljs$core$IStack$_peek$arity$1 = function(node) {
  var self__ = this;
  var node__$1 = this;
  return self__.val;
};
cljs.core.RedNode.prototype.cljs$core$IStack$_pop$arity$1 = function(node) {
  var self__ = this;
  var node__$1 = this;
  return new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [self__.key], null);
};
cljs.core.RedNode.prototype.cljs$core$IHash$_hash$arity$1 = function(coll) {
  var self__ = this;
  var coll__$1 = this;
  var h__4050__auto__ = self__.__hash;
  if (!(h__4050__auto__ == null)) {
    return h__4050__auto__;
  } else {
    var h__4050__auto____$1 = cljs.core.hash_ordered_coll.call(null, coll__$1);
    self__.__hash = h__4050__auto____$1;
    return h__4050__auto____$1;
  }
};
cljs.core.RedNode.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(coll, other) {
  var self__ = this;
  var coll__$1 = this;
  return cljs.core.equiv_sequential.call(null, coll__$1, other);
};
cljs.core.RedNode.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(node) {
  var self__ = this;
  var node__$1 = this;
  return cljs.core.PersistentVector.EMPTY;
};
cljs.core.RedNode.prototype.cljs$core$IReduce$_reduce$arity$2 = function(node, f) {
  var self__ = this;
  var node__$1 = this;
  return cljs.core.ci_reduce.call(null, node__$1, f);
};
cljs.core.RedNode.prototype.cljs$core$IReduce$_reduce$arity$3 = function(node, f, start) {
  var self__ = this;
  var node__$1 = this;
  return cljs.core.ci_reduce.call(null, node__$1, f, start);
};
cljs.core.RedNode.prototype.cljs$core$IAssociative$_assoc$arity$3 = function(node, k, v) {
  var self__ = this;
  var node__$1 = this;
  return cljs.core.assoc.call(null, new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [self__.key, self__.val], null), k, v);
};
cljs.core.RedNode.prototype.cljs$core$ISeqable$_seq$arity$1 = function(node) {
  var self__ = this;
  var node__$1 = this;
  return cljs.core._conj.call(null, cljs.core._conj.call(null, cljs.core.List.EMPTY, self__.val), self__.key);
};
cljs.core.RedNode.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(node, meta) {
  var self__ = this;
  var node__$1 = this;
  return cljs.core.with_meta.call(null, new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [self__.key, self__.val], null), meta);
};
cljs.core.RedNode.prototype.cljs$core$ICollection$_conj$arity$2 = function(node, o) {
  var self__ = this;
  var node__$1 = this;
  return new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [self__.key, self__.val, o], null);
};
cljs.core.RedNode.prototype.call = function() {
  var G__56965 = null;
  var G__56965__2 = function(self__, k) {
    var self__ = this;
    var self____$1 = this;
    var node = self____$1;
    return node.cljs$core$ILookup$_lookup$arity$2(null, k);
  };
  var G__56965__3 = function(self__, k, not_found) {
    var self__ = this;
    var self____$1 = this;
    var node = self____$1;
    return node.cljs$core$ILookup$_lookup$arity$3(null, k, not_found);
  };
  G__56965 = function(self__, k, not_found) {
    switch(arguments.length) {
      case 2:
        return G__56965__2.call(this, self__, k);
      case 3:
        return G__56965__3.call(this, self__, k, not_found);
    }
    throw new Error("Invalid arity: " + arguments.length);
  };
  G__56965.cljs$core$IFn$_invoke$arity$2 = G__56965__2;
  G__56965.cljs$core$IFn$_invoke$arity$3 = G__56965__3;
  return G__56965;
}();
cljs.core.RedNode.prototype.apply = function(self__, args56964) {
  var self__ = this;
  var self____$1 = this;
  return self____$1.call.apply(self____$1, [self____$1].concat(cljs.core.aclone.call(null, args56964)));
};
cljs.core.RedNode.prototype.cljs$core$IFn$_invoke$arity$1 = function(k) {
  var self__ = this;
  var node = this;
  return node.cljs$core$ILookup$_lookup$arity$2(null, k);
};
cljs.core.RedNode.prototype.cljs$core$IFn$_invoke$arity$2 = function(k, not_found) {
  var self__ = this;
  var node = this;
  return node.cljs$core$ILookup$_lookup$arity$3(null, k, not_found);
};
cljs.core.__GT_RedNode = function __GT_RedNode(key, val, left, right, __hash) {
  return new cljs.core.RedNode(key, val, left, right, __hash);
};
cljs.core.tree_map_add = function tree_map_add(comp, tree, k, v, found) {
  if (tree == null) {
    return new cljs.core.RedNode(k, v, null, null, null);
  } else {
    var c = comp.call(null, k, tree.key);
    if (c === 0) {
      found[0] = tree;
      return null;
    } else {
      if (c < 0) {
        var ins = tree_map_add.call(null, comp, tree.left, k, v, found);
        if (!(ins == null)) {
          return tree.add_left(ins);
        } else {
          return null;
        }
      } else {
        var ins = tree_map_add.call(null, comp, tree.right, k, v, found);
        if (!(ins == null)) {
          return tree.add_right(ins);
        } else {
          return null;
        }
      }
    }
  }
};
cljs.core.tree_map_append = function tree_map_append(left, right) {
  if (left == null) {
    return right;
  } else {
    if (right == null) {
      return left;
    } else {
      if (left instanceof cljs.core.RedNode) {
        if (right instanceof cljs.core.RedNode) {
          var app = tree_map_append.call(null, left.right, right.left);
          if (app instanceof cljs.core.RedNode) {
            return new cljs.core.RedNode(app.key, app.val, new cljs.core.RedNode(left.key, left.val, left.left, app.left, null), new cljs.core.RedNode(right.key, right.val, app.right, right.right, null), null);
          } else {
            return new cljs.core.RedNode(left.key, left.val, left.left, new cljs.core.RedNode(right.key, right.val, app, right.right, null), null);
          }
        } else {
          return new cljs.core.RedNode(left.key, left.val, left.left, tree_map_append.call(null, left.right, right), null);
        }
      } else {
        if (right instanceof cljs.core.RedNode) {
          return new cljs.core.RedNode(right.key, right.val, tree_map_append.call(null, left, right.left), right.right, null);
        } else {
          var app = tree_map_append.call(null, left.right, right.left);
          if (app instanceof cljs.core.RedNode) {
            return new cljs.core.RedNode(app.key, app.val, new cljs.core.BlackNode(left.key, left.val, left.left, app.left, null), new cljs.core.BlackNode(right.key, right.val, app.right, right.right, null), null);
          } else {
            return cljs.core.balance_left_del.call(null, left.key, left.val, left.left, new cljs.core.BlackNode(right.key, right.val, app, right.right, null));
          }
        }
      }
    }
  }
};
cljs.core.tree_map_remove = function tree_map_remove(comp, tree, k, found) {
  if (!(tree == null)) {
    var c = comp.call(null, k, tree.key);
    if (c === 0) {
      found[0] = tree;
      return cljs.core.tree_map_append.call(null, tree.left, tree.right);
    } else {
      if (c < 0) {
        var del = tree_map_remove.call(null, comp, tree.left, k, found);
        if (!(del == null) || !(found[0] == null)) {
          if (tree.left instanceof cljs.core.BlackNode) {
            return cljs.core.balance_left_del.call(null, tree.key, tree.val, del, tree.right);
          } else {
            return new cljs.core.RedNode(tree.key, tree.val, del, tree.right, null);
          }
        } else {
          return null;
        }
      } else {
        var del = tree_map_remove.call(null, comp, tree.right, k, found);
        if (!(del == null) || !(found[0] == null)) {
          if (tree.right instanceof cljs.core.BlackNode) {
            return cljs.core.balance_right_del.call(null, tree.key, tree.val, tree.left, del);
          } else {
            return new cljs.core.RedNode(tree.key, tree.val, tree.left, del, null);
          }
        } else {
          return null;
        }
      }
    }
  } else {
    return null;
  }
};
cljs.core.tree_map_replace = function tree_map_replace(comp, tree, k, v) {
  var tk = tree.key;
  var c = comp.call(null, k, tk);
  if (c === 0) {
    return tree.replace(tk, v, tree.left, tree.right);
  } else {
    if (c < 0) {
      return tree.replace(tk, tree.val, tree_map_replace.call(null, comp, tree.left, k, v), tree.right);
    } else {
      return tree.replace(tk, tree.val, tree.left, tree_map_replace.call(null, comp, tree.right, k, v));
    }
  }
};
cljs.core.PersistentTreeMap = function(comp, tree, cnt, meta, __hash) {
  this.comp = comp;
  this.tree = tree;
  this.cnt = cnt;
  this.meta = meta;
  this.__hash = __hash;
  this.cljs$lang$protocol_mask$partition0$ = 418776847;
  this.cljs$lang$protocol_mask$partition1$ = 8192;
};
cljs.core.PersistentTreeMap.cljs$lang$type = true;
cljs.core.PersistentTreeMap.cljs$lang$ctorStr = "cljs.core/PersistentTreeMap";
cljs.core.PersistentTreeMap.cljs$lang$ctorPrWriter = function(this__4215__auto__, writer__4216__auto__, opt__4217__auto__) {
  return cljs.core._write.call(null, writer__4216__auto__, "cljs.core/PersistentTreeMap");
};
cljs.core.PersistentTreeMap.prototype.forEach = function(f) {
  var self__ = this;
  var coll = this;
  var seq__56967 = cljs.core.seq.call(null, coll);
  var chunk__56968 = null;
  var count__56969 = 0;
  var i__56970 = 0;
  while (true) {
    if (i__56970 < count__56969) {
      var vec__56971 = cljs.core._nth.call(null, chunk__56968, i__56970);
      var k = cljs.core.nth.call(null, vec__56971, 0, null);
      var v = cljs.core.nth.call(null, vec__56971, 1, null);
      f.call(null, v, k);
      var G__56973 = seq__56967;
      var G__56974 = chunk__56968;
      var G__56975 = count__56969;
      var G__56976 = i__56970 + 1;
      seq__56967 = G__56973;
      chunk__56968 = G__56974;
      count__56969 = G__56975;
      i__56970 = G__56976;
      continue;
    } else {
      var temp__4126__auto__ = cljs.core.seq.call(null, seq__56967);
      if (temp__4126__auto__) {
        var seq__56967__$1 = temp__4126__auto__;
        if (cljs.core.chunked_seq_QMARK_.call(null, seq__56967__$1)) {
          var c__4408__auto__ = cljs.core.chunk_first.call(null, seq__56967__$1);
          var G__56977 = cljs.core.chunk_rest.call(null, seq__56967__$1);
          var G__56978 = c__4408__auto__;
          var G__56979 = cljs.core.count.call(null, c__4408__auto__);
          var G__56980 = 0;
          seq__56967 = G__56977;
          chunk__56968 = G__56978;
          count__56969 = G__56979;
          i__56970 = G__56980;
          continue;
        } else {
          var vec__56972 = cljs.core.first.call(null, seq__56967__$1);
          var k = cljs.core.nth.call(null, vec__56972, 0, null);
          var v = cljs.core.nth.call(null, vec__56972, 1, null);
          f.call(null, v, k);
          var G__56981 = cljs.core.next.call(null, seq__56967__$1);
          var G__56982 = null;
          var G__56983 = 0;
          var G__56984 = 0;
          seq__56967 = G__56981;
          chunk__56968 = G__56982;
          count__56969 = G__56983;
          i__56970 = G__56984;
          continue;
        }
      } else {
        return null;
      }
    }
    break;
  }
};
cljs.core.PersistentTreeMap.prototype.get = function(k) {
  var self__ = this;
  var coll = this;
  return coll.cljs$core$ILookup$_lookup$arity$2(null, k);
};
cljs.core.PersistentTreeMap.prototype.entries = function() {
  var self__ = this;
  var coll = this;
  return cljs.core.entries_iterator.call(null, cljs.core.seq.call(null, coll));
};
cljs.core.PersistentTreeMap.prototype.toString = function() {
  var self__ = this;
  var coll = this;
  return cljs.core.pr_str_STAR_.call(null, coll);
};
cljs.core.PersistentTreeMap.prototype.keys = function() {
  var self__ = this;
  var coll = this;
  return cljs.core.iterator.call(null, cljs.core.keys.call(null, coll));
};
cljs.core.PersistentTreeMap.prototype.values = function() {
  var self__ = this;
  var coll = this;
  return cljs.core.iterator.call(null, cljs.core.vals.call(null, coll));
};
cljs.core.PersistentTreeMap.prototype.equiv = function(other) {
  var self__ = this;
  var this$ = this;
  return this$.cljs$core$IEquiv$_equiv$arity$2(null, other);
};
cljs.core.PersistentTreeMap.prototype.entry_at = function(k) {
  var self__ = this;
  var coll = this;
  var t = self__.tree;
  while (true) {
    if (!(t == null)) {
      var c = self__.comp.call(null, k, t.key);
      if (c === 0) {
        return t;
      } else {
        if (c < 0) {
          var G__56985 = t.left;
          t = G__56985;
          continue;
        } else {
          var G__56986 = t.right;
          t = G__56986;
          continue;
        }
      }
    } else {
      return null;
    }
    break;
  }
};
cljs.core.PersistentTreeMap.prototype.has = function(k) {
  var self__ = this;
  var coll = this;
  return cljs.core.contains_QMARK_.call(null, coll, k);
};
cljs.core.PersistentTreeMap.prototype.cljs$core$ILookup$_lookup$arity$2 = function(coll, k) {
  var self__ = this;
  var coll__$1 = this;
  return cljs.core._lookup.call(null, coll__$1, k, null);
};
cljs.core.PersistentTreeMap.prototype.cljs$core$ILookup$_lookup$arity$3 = function(coll, k, not_found) {
  var self__ = this;
  var coll__$1 = this;
  var n = coll__$1.entry_at(k);
  if (!(n == null)) {
    return n.val;
  } else {
    return not_found;
  }
};
cljs.core.PersistentTreeMap.prototype.cljs$core$IKVReduce$_kv_reduce$arity$3 = function(coll, f, init) {
  var self__ = this;
  var coll__$1 = this;
  if (!(self__.tree == null)) {
    return cljs.core.tree_map_kv_reduce.call(null, self__.tree, f, init);
  } else {
    return init;
  }
};
cljs.core.PersistentTreeMap.prototype.cljs$core$IMeta$_meta$arity$1 = function(coll) {
  var self__ = this;
  var coll__$1 = this;
  return self__.meta;
};
cljs.core.PersistentTreeMap.prototype.cljs$core$ICloneable$_clone$arity$1 = function(_) {
  var self__ = this;
  var ___$1 = this;
  return new cljs.core.PersistentTreeMap(self__.comp, self__.tree, self__.cnt, self__.meta, self__.__hash);
};
cljs.core.PersistentTreeMap.prototype.cljs$core$ICounted$_count$arity$1 = function(coll) {
  var self__ = this;
  var coll__$1 = this;
  return self__.cnt;
};
cljs.core.PersistentTreeMap.prototype.cljs$core$IReversible$_rseq$arity$1 = function(coll) {
  var self__ = this;
  var coll__$1 = this;
  if (self__.cnt > 0) {
    return cljs.core.create_tree_map_seq.call(null, self__.tree, false, self__.cnt);
  } else {
    return null;
  }
};
cljs.core.PersistentTreeMap.prototype.cljs$core$IHash$_hash$arity$1 = function(coll) {
  var self__ = this;
  var coll__$1 = this;
  var h__4050__auto__ = self__.__hash;
  if (!(h__4050__auto__ == null)) {
    return h__4050__auto__;
  } else {
    var h__4050__auto____$1 = cljs.core.hash_unordered_coll.call(null, coll__$1);
    self__.__hash = h__4050__auto____$1;
    return h__4050__auto____$1;
  }
};
cljs.core.PersistentTreeMap.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(coll, other) {
  var self__ = this;
  var coll__$1 = this;
  return cljs.core.equiv_map.call(null, coll__$1, other);
};
cljs.core.PersistentTreeMap.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(coll) {
  var self__ = this;
  var coll__$1 = this;
  return cljs.core.with_meta.call(null, cljs.core.PersistentTreeMap.EMPTY, self__.meta);
};
cljs.core.PersistentTreeMap.prototype.cljs$core$IMap$_dissoc$arity$2 = function(coll, k) {
  var self__ = this;
  var coll__$1 = this;
  var found = [null];
  var t = cljs.core.tree_map_remove.call(null, self__.comp, self__.tree, k, found);
  if (t == null) {
    if (cljs.core.nth.call(null, found, 0) == null) {
      return coll__$1;
    } else {
      return new cljs.core.PersistentTreeMap(self__.comp, null, 0, self__.meta, null);
    }
  } else {
    return new cljs.core.PersistentTreeMap(self__.comp, t.blacken(), self__.cnt - 1, self__.meta, null);
  }
};
cljs.core.PersistentTreeMap.prototype.cljs$core$IAssociative$_assoc$arity$3 = function(coll, k, v) {
  var self__ = this;
  var coll__$1 = this;
  var found = [null];
  var t = cljs.core.tree_map_add.call(null, self__.comp, self__.tree, k, v, found);
  if (t == null) {
    var found_node = cljs.core.nth.call(null, found, 0);
    if (cljs.core._EQ_.call(null, v, found_node.val)) {
      return coll__$1;
    } else {
      return new cljs.core.PersistentTreeMap(self__.comp, cljs.core.tree_map_replace.call(null, self__.comp, self__.tree, k, v), self__.cnt, self__.meta, null);
    }
  } else {
    return new cljs.core.PersistentTreeMap(self__.comp, t.blacken(), self__.cnt + 1, self__.meta, null);
  }
};
cljs.core.PersistentTreeMap.prototype.cljs$core$IAssociative$_contains_key_QMARK_$arity$2 = function(coll, k) {
  var self__ = this;
  var coll__$1 = this;
  return!(coll__$1.entry_at(k) == null);
};
cljs.core.PersistentTreeMap.prototype.cljs$core$ISeqable$_seq$arity$1 = function(coll) {
  var self__ = this;
  var coll__$1 = this;
  if (self__.cnt > 0) {
    return cljs.core.create_tree_map_seq.call(null, self__.tree, true, self__.cnt);
  } else {
    return null;
  }
};
cljs.core.PersistentTreeMap.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(coll, meta__$1) {
  var self__ = this;
  var coll__$1 = this;
  return new cljs.core.PersistentTreeMap(self__.comp, self__.tree, self__.cnt, meta__$1, self__.__hash);
};
cljs.core.PersistentTreeMap.prototype.cljs$core$ICollection$_conj$arity$2 = function(coll, entry) {
  var self__ = this;
  var coll__$1 = this;
  if (cljs.core.vector_QMARK_.call(null, entry)) {
    return cljs.core._assoc.call(null, coll__$1, cljs.core._nth.call(null, entry, 0), cljs.core._nth.call(null, entry, 1));
  } else {
    var ret = coll__$1;
    var es = cljs.core.seq.call(null, entry);
    while (true) {
      if (es == null) {
        return ret;
      } else {
        var e = cljs.core.first.call(null, es);
        if (cljs.core.vector_QMARK_.call(null, e)) {
          var G__56987 = cljs.core._assoc.call(null, ret, cljs.core._nth.call(null, e, 0), cljs.core._nth.call(null, e, 1));
          var G__56988 = cljs.core.next.call(null, es);
          ret = G__56987;
          es = G__56988;
          continue;
        } else {
          throw new Error("conj on a map takes map entries or seqables of map entries");
        }
      }
      break;
    }
  }
};
cljs.core.PersistentTreeMap.prototype.call = function() {
  var G__56989 = null;
  var G__56989__2 = function(self__, k) {
    var self__ = this;
    var self____$1 = this;
    var coll = self____$1;
    return coll.cljs$core$ILookup$_lookup$arity$2(null, k);
  };
  var G__56989__3 = function(self__, k, not_found) {
    var self__ = this;
    var self____$1 = this;
    var coll = self____$1;
    return coll.cljs$core$ILookup$_lookup$arity$3(null, k, not_found);
  };
  G__56989 = function(self__, k, not_found) {
    switch(arguments.length) {
      case 2:
        return G__56989__2.call(this, self__, k);
      case 3:
        return G__56989__3.call(this, self__, k, not_found);
    }
    throw new Error("Invalid arity: " + arguments.length);
  };
  G__56989.cljs$core$IFn$_invoke$arity$2 = G__56989__2;
  G__56989.cljs$core$IFn$_invoke$arity$3 = G__56989__3;
  return G__56989;
}();
cljs.core.PersistentTreeMap.prototype.apply = function(self__, args56966) {
  var self__ = this;
  var self____$1 = this;
  return self____$1.call.apply(self____$1, [self____$1].concat(cljs.core.aclone.call(null, args56966)));
};
cljs.core.PersistentTreeMap.prototype.cljs$core$IFn$_invoke$arity$1 = function(k) {
  var self__ = this;
  var coll = this;
  return coll.cljs$core$ILookup$_lookup$arity$2(null, k);
};
cljs.core.PersistentTreeMap.prototype.cljs$core$IFn$_invoke$arity$2 = function(k, not_found) {
  var self__ = this;
  var coll = this;
  return coll.cljs$core$ILookup$_lookup$arity$3(null, k, not_found);
};
cljs.core.PersistentTreeMap.prototype.cljs$core$ISorted$_sorted_seq$arity$2 = function(coll, ascending_QMARK_) {
  var self__ = this;
  var coll__$1 = this;
  if (self__.cnt > 0) {
    return cljs.core.create_tree_map_seq.call(null, self__.tree, ascending_QMARK_, self__.cnt);
  } else {
    return null;
  }
};
cljs.core.PersistentTreeMap.prototype.cljs$core$ISorted$_sorted_seq_from$arity$3 = function(coll, k, ascending_QMARK_) {
  var self__ = this;
  var coll__$1 = this;
  if (self__.cnt > 0) {
    var stack = null;
    var t = self__.tree;
    while (true) {
      if (!(t == null)) {
        var c = self__.comp.call(null, k, t.key);
        if (c === 0) {
          return new cljs.core.PersistentTreeMapSeq(null, cljs.core.conj.call(null, stack, t), ascending_QMARK_, -1, null);
        } else {
          if (cljs.core.truth_(ascending_QMARK_)) {
            if (c < 0) {
              var G__56990 = cljs.core.conj.call(null, stack, t);
              var G__56991 = t.left;
              stack = G__56990;
              t = G__56991;
              continue;
            } else {
              var G__56992 = stack;
              var G__56993 = t.right;
              stack = G__56992;
              t = G__56993;
              continue;
            }
          } else {
            if (c > 0) {
              var G__56994 = cljs.core.conj.call(null, stack, t);
              var G__56995 = t.right;
              stack = G__56994;
              t = G__56995;
              continue;
            } else {
              var G__56996 = stack;
              var G__56997 = t.left;
              stack = G__56996;
              t = G__56997;
              continue;
            }
          }
        }
      } else {
        if (stack == null) {
          return null;
        } else {
          return new cljs.core.PersistentTreeMapSeq(null, stack, ascending_QMARK_, -1, null);
        }
      }
      break;
    }
  } else {
    return null;
  }
};
cljs.core.PersistentTreeMap.prototype.cljs$core$ISorted$_entry_key$arity$2 = function(coll, entry) {
  var self__ = this;
  var coll__$1 = this;
  return cljs.core.key.call(null, entry);
};
cljs.core.PersistentTreeMap.prototype.cljs$core$ISorted$_comparator$arity$1 = function(coll) {
  var self__ = this;
  var coll__$1 = this;
  return self__.comp;
};
cljs.core.__GT_PersistentTreeMap = function __GT_PersistentTreeMap(comp, tree, cnt, meta, __hash) {
  return new cljs.core.PersistentTreeMap(comp, tree, cnt, meta, __hash);
};
cljs.core.PersistentTreeMap.EMPTY = new cljs.core.PersistentTreeMap(cljs.core.compare, null, 0, null, 0);
cljs.core.hash_map = function() {
  var hash_map__delegate = function(keyvals) {
    var in$ = cljs.core.seq.call(null, keyvals);
    var out = cljs.core.transient$.call(null, cljs.core.PersistentHashMap.EMPTY);
    while (true) {
      if (in$) {
        var G__56998 = cljs.core.nnext.call(null, in$);
        var G__56999 = cljs.core.assoc_BANG_.call(null, out, cljs.core.first.call(null, in$), cljs.core.second.call(null, in$));
        in$ = G__56998;
        out = G__56999;
        continue;
      } else {
        return cljs.core.persistent_BANG_.call(null, out);
      }
      break;
    }
  };
  var hash_map = function(var_args) {
    var keyvals = null;
    if (arguments.length > 0) {
      keyvals = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0);
    }
    return hash_map__delegate.call(this, keyvals);
  };
  hash_map.cljs$lang$maxFixedArity = 0;
  hash_map.cljs$lang$applyTo = function(arglist__57000) {
    var keyvals = cljs.core.seq(arglist__57000);
    return hash_map__delegate(keyvals);
  };
  hash_map.cljs$core$IFn$_invoke$arity$variadic = hash_map__delegate;
  return hash_map;
}();
cljs.core.array_map = function() {
  var array_map__delegate = function(keyvals) {
    return new cljs.core.PersistentArrayMap(null, cljs.core.quot.call(null, cljs.core.count.call(null, keyvals), 2), cljs.core.apply.call(null, cljs.core.array, keyvals), null);
  };
  var array_map = function(var_args) {
    var keyvals = null;
    if (arguments.length > 0) {
      keyvals = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0);
    }
    return array_map__delegate.call(this, keyvals);
  };
  array_map.cljs$lang$maxFixedArity = 0;
  array_map.cljs$lang$applyTo = function(arglist__57001) {
    var keyvals = cljs.core.seq(arglist__57001);
    return array_map__delegate(keyvals);
  };
  array_map.cljs$core$IFn$_invoke$arity$variadic = array_map__delegate;
  return array_map;
}();
cljs.core.obj_map = function() {
  var obj_map__delegate = function(keyvals) {
    var ks = [];
    var obj = function() {
      var obj57005 = {};
      return obj57005;
    }();
    var kvs = cljs.core.seq.call(null, keyvals);
    while (true) {
      if (kvs) {
        ks.push(cljs.core.first.call(null, kvs));
        obj[cljs.core.first.call(null, kvs)] = cljs.core.second.call(null, kvs);
        var G__57006 = cljs.core.nnext.call(null, kvs);
        kvs = G__57006;
        continue;
      } else {
        return cljs.core.ObjMap.fromObject(ks, obj);
      }
      break;
    }
  };
  var obj_map = function(var_args) {
    var keyvals = null;
    if (arguments.length > 0) {
      keyvals = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0);
    }
    return obj_map__delegate.call(this, keyvals);
  };
  obj_map.cljs$lang$maxFixedArity = 0;
  obj_map.cljs$lang$applyTo = function(arglist__57007) {
    var keyvals = cljs.core.seq(arglist__57007);
    return obj_map__delegate(keyvals);
  };
  obj_map.cljs$core$IFn$_invoke$arity$variadic = obj_map__delegate;
  return obj_map;
}();
cljs.core.sorted_map = function() {
  var sorted_map__delegate = function(keyvals) {
    var in$ = cljs.core.seq.call(null, keyvals);
    var out = cljs.core.PersistentTreeMap.EMPTY;
    while (true) {
      if (in$) {
        var G__57008 = cljs.core.nnext.call(null, in$);
        var G__57009 = cljs.core.assoc.call(null, out, cljs.core.first.call(null, in$), cljs.core.second.call(null, in$));
        in$ = G__57008;
        out = G__57009;
        continue;
      } else {
        return out;
      }
      break;
    }
  };
  var sorted_map = function(var_args) {
    var keyvals = null;
    if (arguments.length > 0) {
      keyvals = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0);
    }
    return sorted_map__delegate.call(this, keyvals);
  };
  sorted_map.cljs$lang$maxFixedArity = 0;
  sorted_map.cljs$lang$applyTo = function(arglist__57010) {
    var keyvals = cljs.core.seq(arglist__57010);
    return sorted_map__delegate(keyvals);
  };
  sorted_map.cljs$core$IFn$_invoke$arity$variadic = sorted_map__delegate;
  return sorted_map;
}();
cljs.core.sorted_map_by = function() {
  var sorted_map_by__delegate = function(comparator, keyvals) {
    var in$ = cljs.core.seq.call(null, keyvals);
    var out = new cljs.core.PersistentTreeMap(cljs.core.fn__GT_comparator.call(null, comparator), null, 0, null, 0);
    while (true) {
      if (in$) {
        var G__57011 = cljs.core.nnext.call(null, in$);
        var G__57012 = cljs.core.assoc.call(null, out, cljs.core.first.call(null, in$), cljs.core.second.call(null, in$));
        in$ = G__57011;
        out = G__57012;
        continue;
      } else {
        return out;
      }
      break;
    }
  };
  var sorted_map_by = function(comparator, var_args) {
    var keyvals = null;
    if (arguments.length > 1) {
      keyvals = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0);
    }
    return sorted_map_by__delegate.call(this, comparator, keyvals);
  };
  sorted_map_by.cljs$lang$maxFixedArity = 1;
  sorted_map_by.cljs$lang$applyTo = function(arglist__57013) {
    var comparator = cljs.core.first(arglist__57013);
    var keyvals = cljs.core.rest(arglist__57013);
    return sorted_map_by__delegate(comparator, keyvals);
  };
  sorted_map_by.cljs$core$IFn$_invoke$arity$variadic = sorted_map_by__delegate;
  return sorted_map_by;
}();
cljs.core.KeySeq = function(mseq, _meta) {
  this.mseq = mseq;
  this._meta = _meta;
  this.cljs$lang$protocol_mask$partition1$ = 0;
  this.cljs$lang$protocol_mask$partition0$ = 32374988;
};
cljs.core.KeySeq.cljs$lang$type = true;
cljs.core.KeySeq.cljs$lang$ctorStr = "cljs.core/KeySeq";
cljs.core.KeySeq.cljs$lang$ctorPrWriter = function(this__4215__auto__, writer__4216__auto__, opt__4217__auto__) {
  return cljs.core._write.call(null, writer__4216__auto__, "cljs.core/KeySeq");
};
cljs.core.KeySeq.prototype.toString = function() {
  var self__ = this;
  var coll = this;
  return cljs.core.pr_str_STAR_.call(null, coll);
};
cljs.core.KeySeq.prototype.equiv = function(other) {
  var self__ = this;
  var this$ = this;
  return this$.cljs$core$IEquiv$_equiv$arity$2(null, other);
};
cljs.core.KeySeq.prototype.cljs$core$IMeta$_meta$arity$1 = function(coll) {
  var self__ = this;
  var coll__$1 = this;
  return self__._meta;
};
cljs.core.KeySeq.prototype.cljs$core$INext$_next$arity$1 = function(coll) {
  var self__ = this;
  var coll__$1 = this;
  var nseq = function() {
    var G__57014 = self__.mseq;
    if (G__57014) {
      var bit__4302__auto__ = G__57014.cljs$lang$protocol_mask$partition0$ & 128;
      if (bit__4302__auto__ || G__57014.cljs$core$INext$) {
        return true;
      } else {
        if (!G__57014.cljs$lang$protocol_mask$partition0$) {
          return cljs.core.native_satisfies_QMARK_.call(null, cljs.core.INext, G__57014);
        } else {
          return false;
        }
      }
    } else {
      return cljs.core.native_satisfies_QMARK_.call(null, cljs.core.INext, G__57014);
    }
  }() ? cljs.core._next.call(null, self__.mseq) : cljs.core.next.call(null, self__.mseq);
  if (nseq == null) {
    return null;
  } else {
    return new cljs.core.KeySeq(nseq, self__._meta);
  }
};
cljs.core.KeySeq.prototype.cljs$core$IHash$_hash$arity$1 = function(coll) {
  var self__ = this;
  var coll__$1 = this;
  return cljs.core.hash_ordered_coll.call(null, coll__$1);
};
cljs.core.KeySeq.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(coll, other) {
  var self__ = this;
  var coll__$1 = this;
  return cljs.core.equiv_sequential.call(null, coll__$1, other);
};
cljs.core.KeySeq.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(coll) {
  var self__ = this;
  var coll__$1 = this;
  return cljs.core.with_meta.call(null, cljs.core.List.EMPTY, self__._meta);
};
cljs.core.KeySeq.prototype.cljs$core$IReduce$_reduce$arity$2 = function(coll, f) {
  var self__ = this;
  var coll__$1 = this;
  return cljs.core.seq_reduce.call(null, f, coll__$1);
};
cljs.core.KeySeq.prototype.cljs$core$IReduce$_reduce$arity$3 = function(coll, f, start) {
  var self__ = this;
  var coll__$1 = this;
  return cljs.core.seq_reduce.call(null, f, start, coll__$1);
};
cljs.core.KeySeq.prototype.cljs$core$ISeq$_first$arity$1 = function(coll) {
  var self__ = this;
  var coll__$1 = this;
  var me = cljs.core._first.call(null, self__.mseq);
  return cljs.core._key.call(null, me);
};
cljs.core.KeySeq.prototype.cljs$core$ISeq$_rest$arity$1 = function(coll) {
  var self__ = this;
  var coll__$1 = this;
  var nseq = function() {
    var G__57015 = self__.mseq;
    if (G__57015) {
      var bit__4302__auto__ = G__57015.cljs$lang$protocol_mask$partition0$ & 128;
      if (bit__4302__auto__ || G__57015.cljs$core$INext$) {
        return true;
      } else {
        if (!G__57015.cljs$lang$protocol_mask$partition0$) {
          return cljs.core.native_satisfies_QMARK_.call(null, cljs.core.INext, G__57015);
        } else {
          return false;
        }
      }
    } else {
      return cljs.core.native_satisfies_QMARK_.call(null, cljs.core.INext, G__57015);
    }
  }() ? cljs.core._next.call(null, self__.mseq) : cljs.core.next.call(null, self__.mseq);
  if (!(nseq == null)) {
    return new cljs.core.KeySeq(nseq, self__._meta);
  } else {
    return cljs.core.List.EMPTY;
  }
};
cljs.core.KeySeq.prototype.cljs$core$ISeqable$_seq$arity$1 = function(coll) {
  var self__ = this;
  var coll__$1 = this;
  return coll__$1;
};
cljs.core.KeySeq.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(coll, new_meta) {
  var self__ = this;
  var coll__$1 = this;
  return new cljs.core.KeySeq(self__.mseq, new_meta);
};
cljs.core.KeySeq.prototype.cljs$core$ICollection$_conj$arity$2 = function(coll, o) {
  var self__ = this;
  var coll__$1 = this;
  return cljs.core.cons.call(null, o, coll__$1);
};
cljs.core.__GT_KeySeq = function __GT_KeySeq(mseq, _meta) {
  return new cljs.core.KeySeq(mseq, _meta);
};
cljs.core.keys = function keys(hash_map) {
  var temp__4126__auto__ = cljs.core.seq.call(null, hash_map);
  if (temp__4126__auto__) {
    var mseq = temp__4126__auto__;
    return new cljs.core.KeySeq(mseq, null);
  } else {
    return null;
  }
};
cljs.core.key = function key(map_entry) {
  return cljs.core._key.call(null, map_entry);
};
cljs.core.ValSeq = function(mseq, _meta) {
  this.mseq = mseq;
  this._meta = _meta;
  this.cljs$lang$protocol_mask$partition1$ = 0;
  this.cljs$lang$protocol_mask$partition0$ = 32374988;
};
cljs.core.ValSeq.cljs$lang$type = true;
cljs.core.ValSeq.cljs$lang$ctorStr = "cljs.core/ValSeq";
cljs.core.ValSeq.cljs$lang$ctorPrWriter = function(this__4215__auto__, writer__4216__auto__, opt__4217__auto__) {
  return cljs.core._write.call(null, writer__4216__auto__, "cljs.core/ValSeq");
};
cljs.core.ValSeq.prototype.toString = function() {
  var self__ = this;
  var coll = this;
  return cljs.core.pr_str_STAR_.call(null, coll);
};
cljs.core.ValSeq.prototype.equiv = function(other) {
  var self__ = this;
  var this$ = this;
  return this$.cljs$core$IEquiv$_equiv$arity$2(null, other);
};
cljs.core.ValSeq.prototype.cljs$core$IMeta$_meta$arity$1 = function(coll) {
  var self__ = this;
  var coll__$1 = this;
  return self__._meta;
};
cljs.core.ValSeq.prototype.cljs$core$INext$_next$arity$1 = function(coll) {
  var self__ = this;
  var coll__$1 = this;
  var nseq = function() {
    var G__57016 = self__.mseq;
    if (G__57016) {
      var bit__4302__auto__ = G__57016.cljs$lang$protocol_mask$partition0$ & 128;
      if (bit__4302__auto__ || G__57016.cljs$core$INext$) {
        return true;
      } else {
        if (!G__57016.cljs$lang$protocol_mask$partition0$) {
          return cljs.core.native_satisfies_QMARK_.call(null, cljs.core.INext, G__57016);
        } else {
          return false;
        }
      }
    } else {
      return cljs.core.native_satisfies_QMARK_.call(null, cljs.core.INext, G__57016);
    }
  }() ? cljs.core._next.call(null, self__.mseq) : cljs.core.next.call(null, self__.mseq);
  if (nseq == null) {
    return null;
  } else {
    return new cljs.core.ValSeq(nseq, self__._meta);
  }
};
cljs.core.ValSeq.prototype.cljs$core$IHash$_hash$arity$1 = function(coll) {
  var self__ = this;
  var coll__$1 = this;
  return cljs.core.hash_ordered_coll.call(null, coll__$1);
};
cljs.core.ValSeq.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(coll, other) {
  var self__ = this;
  var coll__$1 = this;
  return cljs.core.equiv_sequential.call(null, coll__$1, other);
};
cljs.core.ValSeq.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(coll) {
  var self__ = this;
  var coll__$1 = this;
  return cljs.core.with_meta.call(null, cljs.core.List.EMPTY, self__._meta);
};
cljs.core.ValSeq.prototype.cljs$core$IReduce$_reduce$arity$2 = function(coll, f) {
  var self__ = this;
  var coll__$1 = this;
  return cljs.core.seq_reduce.call(null, f, coll__$1);
};
cljs.core.ValSeq.prototype.cljs$core$IReduce$_reduce$arity$3 = function(coll, f, start) {
  var self__ = this;
  var coll__$1 = this;
  return cljs.core.seq_reduce.call(null, f, start, coll__$1);
};
cljs.core.ValSeq.prototype.cljs$core$ISeq$_first$arity$1 = function(coll) {
  var self__ = this;
  var coll__$1 = this;
  var me = cljs.core._first.call(null, self__.mseq);
  return cljs.core._val.call(null, me);
};
cljs.core.ValSeq.prototype.cljs$core$ISeq$_rest$arity$1 = function(coll) {
  var self__ = this;
  var coll__$1 = this;
  var nseq = function() {
    var G__57017 = self__.mseq;
    if (G__57017) {
      var bit__4302__auto__ = G__57017.cljs$lang$protocol_mask$partition0$ & 128;
      if (bit__4302__auto__ || G__57017.cljs$core$INext$) {
        return true;
      } else {
        if (!G__57017.cljs$lang$protocol_mask$partition0$) {
          return cljs.core.native_satisfies_QMARK_.call(null, cljs.core.INext, G__57017);
        } else {
          return false;
        }
      }
    } else {
      return cljs.core.native_satisfies_QMARK_.call(null, cljs.core.INext, G__57017);
    }
  }() ? cljs.core._next.call(null, self__.mseq) : cljs.core.next.call(null, self__.mseq);
  if (!(nseq == null)) {
    return new cljs.core.ValSeq(nseq, self__._meta);
  } else {
    return cljs.core.List.EMPTY;
  }
};
cljs.core.ValSeq.prototype.cljs$core$ISeqable$_seq$arity$1 = function(coll) {
  var self__ = this;
  var coll__$1 = this;
  return coll__$1;
};
cljs.core.ValSeq.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(coll, new_meta) {
  var self__ = this;
  var coll__$1 = this;
  return new cljs.core.ValSeq(self__.mseq, new_meta);
};
cljs.core.ValSeq.prototype.cljs$core$ICollection$_conj$arity$2 = function(coll, o) {
  var self__ = this;
  var coll__$1 = this;
  return cljs.core.cons.call(null, o, coll__$1);
};
cljs.core.__GT_ValSeq = function __GT_ValSeq(mseq, _meta) {
  return new cljs.core.ValSeq(mseq, _meta);
};
cljs.core.vals = function vals(hash_map) {
  var temp__4126__auto__ = cljs.core.seq.call(null, hash_map);
  if (temp__4126__auto__) {
    var mseq = temp__4126__auto__;
    return new cljs.core.ValSeq(mseq, null);
  } else {
    return null;
  }
};
cljs.core.val = function val(map_entry) {
  return cljs.core._val.call(null, map_entry);
};
cljs.core.merge = function() {
  var merge__delegate = function(maps) {
    if (cljs.core.truth_(cljs.core.some.call(null, cljs.core.identity, maps))) {
      return cljs.core.reduce.call(null, function(p1__57018_SHARP_, p2__57019_SHARP_) {
        return cljs.core.conj.call(null, function() {
          var or__3639__auto__ = p1__57018_SHARP_;
          if (cljs.core.truth_(or__3639__auto__)) {
            return or__3639__auto__;
          } else {
            return cljs.core.PersistentArrayMap.EMPTY;
          }
        }(), p2__57019_SHARP_);
      }, maps);
    } else {
      return null;
    }
  };
  var merge = function(var_args) {
    var maps = null;
    if (arguments.length > 0) {
      maps = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0);
    }
    return merge__delegate.call(this, maps);
  };
  merge.cljs$lang$maxFixedArity = 0;
  merge.cljs$lang$applyTo = function(arglist__57020) {
    var maps = cljs.core.seq(arglist__57020);
    return merge__delegate(maps);
  };
  merge.cljs$core$IFn$_invoke$arity$variadic = merge__delegate;
  return merge;
}();
cljs.core.merge_with = function() {
  var merge_with__delegate = function(f, maps) {
    if (cljs.core.truth_(cljs.core.some.call(null, cljs.core.identity, maps))) {
      var merge_entry = function(m, e) {
        var k = cljs.core.first.call(null, e);
        var v = cljs.core.second.call(null, e);
        if (cljs.core.contains_QMARK_.call(null, m, k)) {
          return cljs.core.assoc.call(null, m, k, f.call(null, cljs.core.get.call(null, m, k), v));
        } else {
          return cljs.core.assoc.call(null, m, k, v);
        }
      };
      var merge2 = function(merge_entry) {
        return function(m1, m2) {
          return cljs.core.reduce.call(null, merge_entry, function() {
            var or__3639__auto__ = m1;
            if (cljs.core.truth_(or__3639__auto__)) {
              return or__3639__auto__;
            } else {
              return cljs.core.PersistentArrayMap.EMPTY;
            }
          }(), cljs.core.seq.call(null, m2));
        };
      }(merge_entry);
      return cljs.core.reduce.call(null, merge2, maps);
    } else {
      return null;
    }
  };
  var merge_with = function(f, var_args) {
    var maps = null;
    if (arguments.length > 1) {
      maps = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0);
    }
    return merge_with__delegate.call(this, f, maps);
  };
  merge_with.cljs$lang$maxFixedArity = 1;
  merge_with.cljs$lang$applyTo = function(arglist__57021) {
    var f = cljs.core.first(arglist__57021);
    var maps = cljs.core.rest(arglist__57021);
    return merge_with__delegate(f, maps);
  };
  merge_with.cljs$core$IFn$_invoke$arity$variadic = merge_with__delegate;
  return merge_with;
}();
cljs.core.select_keys = function select_keys(map, keyseq) {
  var ret = cljs.core.PersistentArrayMap.EMPTY;
  var keys = cljs.core.seq.call(null, keyseq);
  while (true) {
    if (keys) {
      var key = cljs.core.first.call(null, keys);
      var entry = cljs.core.get.call(null, map, key, new cljs.core.Keyword("cljs.core", "not-found", "cljs.core/not-found", -1572889185));
      var G__57022 = cljs.core.not_EQ_.call(null, entry, new cljs.core.Keyword("cljs.core", "not-found", "cljs.core/not-found", -1572889185)) ? cljs.core.assoc.call(null, ret, key, entry) : ret;
      var G__57023 = cljs.core.next.call(null, keys);
      ret = G__57022;
      keys = G__57023;
      continue;
    } else {
      return ret;
    }
    break;
  }
};
cljs.core.PersistentHashSet = function(meta, hash_map, __hash) {
  this.meta = meta;
  this.hash_map = hash_map;
  this.__hash = __hash;
  this.cljs$lang$protocol_mask$partition0$ = 15077647;
  this.cljs$lang$protocol_mask$partition1$ = 8196;
};
cljs.core.PersistentHashSet.cljs$lang$type = true;
cljs.core.PersistentHashSet.cljs$lang$ctorStr = "cljs.core/PersistentHashSet";
cljs.core.PersistentHashSet.cljs$lang$ctorPrWriter = function(this__4215__auto__, writer__4216__auto__, opt__4217__auto__) {
  return cljs.core._write.call(null, writer__4216__auto__, "cljs.core/PersistentHashSet");
};
cljs.core.PersistentHashSet.prototype.toString = function() {
  var self__ = this;
  var coll = this;
  return cljs.core.pr_str_STAR_.call(null, coll);
};
cljs.core.PersistentHashSet.prototype.equiv = function(other) {
  var self__ = this;
  var this$ = this;
  return this$.cljs$core$IEquiv$_equiv$arity$2(null, other);
};
cljs.core.PersistentHashSet.prototype.keys = function() {
  var self__ = this;
  var coll = this;
  return cljs.core.iterator.call(null, cljs.core.seq.call(null, coll));
};
cljs.core.PersistentHashSet.prototype.entries = function() {
  var self__ = this;
  var coll = this;
  return cljs.core.set_entries_iterator.call(null, cljs.core.seq.call(null, coll));
};
cljs.core.PersistentHashSet.prototype.values = function() {
  var self__ = this;
  var coll = this;
  return cljs.core.iterator.call(null, cljs.core.seq.call(null, coll));
};
cljs.core.PersistentHashSet.prototype.has = function(k) {
  var self__ = this;
  var coll = this;
  return cljs.core.contains_QMARK_.call(null, coll, k);
};
cljs.core.PersistentHashSet.prototype.forEach = function(f) {
  var self__ = this;
  var coll = this;
  var seq__57026 = cljs.core.seq.call(null, coll);
  var chunk__57027 = null;
  var count__57028 = 0;
  var i__57029 = 0;
  while (true) {
    if (i__57029 < count__57028) {
      var vec__57030 = cljs.core._nth.call(null, chunk__57027, i__57029);
      var k = cljs.core.nth.call(null, vec__57030, 0, null);
      var v = cljs.core.nth.call(null, vec__57030, 1, null);
      f.call(null, v, k);
      var G__57032 = seq__57026;
      var G__57033 = chunk__57027;
      var G__57034 = count__57028;
      var G__57035 = i__57029 + 1;
      seq__57026 = G__57032;
      chunk__57027 = G__57033;
      count__57028 = G__57034;
      i__57029 = G__57035;
      continue;
    } else {
      var temp__4126__auto__ = cljs.core.seq.call(null, seq__57026);
      if (temp__4126__auto__) {
        var seq__57026__$1 = temp__4126__auto__;
        if (cljs.core.chunked_seq_QMARK_.call(null, seq__57026__$1)) {
          var c__4408__auto__ = cljs.core.chunk_first.call(null, seq__57026__$1);
          var G__57036 = cljs.core.chunk_rest.call(null, seq__57026__$1);
          var G__57037 = c__4408__auto__;
          var G__57038 = cljs.core.count.call(null, c__4408__auto__);
          var G__57039 = 0;
          seq__57026 = G__57036;
          chunk__57027 = G__57037;
          count__57028 = G__57038;
          i__57029 = G__57039;
          continue;
        } else {
          var vec__57031 = cljs.core.first.call(null, seq__57026__$1);
          var k = cljs.core.nth.call(null, vec__57031, 0, null);
          var v = cljs.core.nth.call(null, vec__57031, 1, null);
          f.call(null, v, k);
          var G__57040 = cljs.core.next.call(null, seq__57026__$1);
          var G__57041 = null;
          var G__57042 = 0;
          var G__57043 = 0;
          seq__57026 = G__57040;
          chunk__57027 = G__57041;
          count__57028 = G__57042;
          i__57029 = G__57043;
          continue;
        }
      } else {
        return null;
      }
    }
    break;
  }
};
cljs.core.PersistentHashSet.prototype.cljs$core$ILookup$_lookup$arity$2 = function(coll, v) {
  var self__ = this;
  var coll__$1 = this;
  return cljs.core._lookup.call(null, coll__$1, v, null);
};
cljs.core.PersistentHashSet.prototype.cljs$core$ILookup$_lookup$arity$3 = function(coll, v, not_found) {
  var self__ = this;
  var coll__$1 = this;
  if (cljs.core._contains_key_QMARK_.call(null, self__.hash_map, v)) {
    return v;
  } else {
    return not_found;
  }
};
cljs.core.PersistentHashSet.prototype.cljs$core$IMeta$_meta$arity$1 = function(coll) {
  var self__ = this;
  var coll__$1 = this;
  return self__.meta;
};
cljs.core.PersistentHashSet.prototype.cljs$core$ICloneable$_clone$arity$1 = function(_) {
  var self__ = this;
  var ___$1 = this;
  return new cljs.core.PersistentHashSet(self__.meta, self__.hash_map, self__.__hash);
};
cljs.core.PersistentHashSet.prototype.cljs$core$ICounted$_count$arity$1 = function(coll) {
  var self__ = this;
  var coll__$1 = this;
  return cljs.core._count.call(null, self__.hash_map);
};
cljs.core.PersistentHashSet.prototype.cljs$core$IHash$_hash$arity$1 = function(coll) {
  var self__ = this;
  var coll__$1 = this;
  var h__4050__auto__ = self__.__hash;
  if (!(h__4050__auto__ == null)) {
    return h__4050__auto__;
  } else {
    var h__4050__auto____$1 = cljs.core.hash_unordered_coll.call(null, coll__$1);
    self__.__hash = h__4050__auto____$1;
    return h__4050__auto____$1;
  }
};
cljs.core.PersistentHashSet.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(coll, other) {
  var self__ = this;
  var coll__$1 = this;
  return cljs.core.set_QMARK_.call(null, other) && cljs.core.count.call(null, coll__$1) === cljs.core.count.call(null, other) && cljs.core.every_QMARK_.call(null, function(coll__$1) {
    return function(p1__57024_SHARP_) {
      return cljs.core.contains_QMARK_.call(null, coll__$1, p1__57024_SHARP_);
    };
  }(coll__$1), other);
};
cljs.core.PersistentHashSet.prototype.cljs$core$IEditableCollection$_as_transient$arity$1 = function(coll) {
  var self__ = this;
  var coll__$1 = this;
  return new cljs.core.TransientHashSet(cljs.core._as_transient.call(null, self__.hash_map));
};
cljs.core.PersistentHashSet.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(coll) {
  var self__ = this;
  var coll__$1 = this;
  return cljs.core.with_meta.call(null, cljs.core.PersistentHashSet.EMPTY, self__.meta);
};
cljs.core.PersistentHashSet.prototype.cljs$core$ISet$_disjoin$arity$2 = function(coll, v) {
  var self__ = this;
  var coll__$1 = this;
  return new cljs.core.PersistentHashSet(self__.meta, cljs.core._dissoc.call(null, self__.hash_map, v), null);
};
cljs.core.PersistentHashSet.prototype.cljs$core$ISeqable$_seq$arity$1 = function(coll) {
  var self__ = this;
  var coll__$1 = this;
  return cljs.core.keys.call(null, self__.hash_map);
};
cljs.core.PersistentHashSet.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(coll, meta__$1) {
  var self__ = this;
  var coll__$1 = this;
  return new cljs.core.PersistentHashSet(meta__$1, self__.hash_map, self__.__hash);
};
cljs.core.PersistentHashSet.prototype.cljs$core$ICollection$_conj$arity$2 = function(coll, o) {
  var self__ = this;
  var coll__$1 = this;
  return new cljs.core.PersistentHashSet(self__.meta, cljs.core.assoc.call(null, self__.hash_map, o, null), null);
};
cljs.core.PersistentHashSet.prototype.call = function() {
  var G__57044 = null;
  var G__57044__2 = function(self__, k) {
    var self__ = this;
    var self____$1 = this;
    var coll = self____$1;
    return coll.cljs$core$ILookup$_lookup$arity$2(null, k);
  };
  var G__57044__3 = function(self__, k, not_found) {
    var self__ = this;
    var self____$1 = this;
    var coll = self____$1;
    return coll.cljs$core$ILookup$_lookup$arity$3(null, k, not_found);
  };
  G__57044 = function(self__, k, not_found) {
    switch(arguments.length) {
      case 2:
        return G__57044__2.call(this, self__, k);
      case 3:
        return G__57044__3.call(this, self__, k, not_found);
    }
    throw new Error("Invalid arity: " + arguments.length);
  };
  G__57044.cljs$core$IFn$_invoke$arity$2 = G__57044__2;
  G__57044.cljs$core$IFn$_invoke$arity$3 = G__57044__3;
  return G__57044;
}();
cljs.core.PersistentHashSet.prototype.apply = function(self__, args57025) {
  var self__ = this;
  var self____$1 = this;
  return self____$1.call.apply(self____$1, [self____$1].concat(cljs.core.aclone.call(null, args57025)));
};
cljs.core.PersistentHashSet.prototype.cljs$core$IFn$_invoke$arity$1 = function(k) {
  var self__ = this;
  var coll = this;
  return coll.cljs$core$ILookup$_lookup$arity$2(null, k);
};
cljs.core.PersistentHashSet.prototype.cljs$core$IFn$_invoke$arity$2 = function(k, not_found) {
  var self__ = this;
  var coll = this;
  return coll.cljs$core$ILookup$_lookup$arity$3(null, k, not_found);
};
cljs.core.__GT_PersistentHashSet = function __GT_PersistentHashSet(meta, hash_map, __hash) {
  return new cljs.core.PersistentHashSet(meta, hash_map, __hash);
};
cljs.core.PersistentHashSet.EMPTY = new cljs.core.PersistentHashSet(null, cljs.core.PersistentArrayMap.EMPTY, 0);
cljs.core.PersistentHashSet.fromArray = function(items, no_clone) {
  var len = items.length;
  if (len <= cljs.core.PersistentArrayMap.HASHMAP_THRESHOLD) {
    var arr = no_clone ? items : cljs.core.aclone.call(null, items);
    var i = 0;
    var out = cljs.core.transient$.call(null, cljs.core.PersistentArrayMap.EMPTY);
    while (true) {
      if (i < len) {
        var G__57045 = i + 1;
        var G__57046 = cljs.core._assoc_BANG_.call(null, out, items[i], null);
        i = G__57045;
        out = G__57046;
        continue;
      } else {
        return new cljs.core.PersistentHashSet(null, cljs.core._persistent_BANG_.call(null, out), null);
      }
      break;
    }
  } else {
    var i = 0;
    var out = cljs.core.transient$.call(null, cljs.core.PersistentHashSet.EMPTY);
    while (true) {
      if (i < len) {
        var G__57047 = i + 1;
        var G__57048 = cljs.core._conj_BANG_.call(null, out, items[i]);
        i = G__57047;
        out = G__57048;
        continue;
      } else {
        return cljs.core._persistent_BANG_.call(null, out);
      }
      break;
    }
  }
};
cljs.core.TransientHashSet = function(transient_map) {
  this.transient_map = transient_map;
  this.cljs$lang$protocol_mask$partition0$ = 259;
  this.cljs$lang$protocol_mask$partition1$ = 136;
};
cljs.core.TransientHashSet.cljs$lang$type = true;
cljs.core.TransientHashSet.cljs$lang$ctorStr = "cljs.core/TransientHashSet";
cljs.core.TransientHashSet.cljs$lang$ctorPrWriter = function(this__4215__auto__, writer__4216__auto__, opt__4217__auto__) {
  return cljs.core._write.call(null, writer__4216__auto__, "cljs.core/TransientHashSet");
};
cljs.core.TransientHashSet.prototype.call = function() {
  var G__57050 = null;
  var G__57050__2 = function(self__, k) {
    var self__ = this;
    var self____$1 = this;
    var tcoll = self____$1;
    if (cljs.core._lookup.call(null, self__.transient_map, k, cljs.core.lookup_sentinel) === cljs.core.lookup_sentinel) {
      return null;
    } else {
      return k;
    }
  };
  var G__57050__3 = function(self__, k, not_found) {
    var self__ = this;
    var self____$1 = this;
    var tcoll = self____$1;
    if (cljs.core._lookup.call(null, self__.transient_map, k, cljs.core.lookup_sentinel) === cljs.core.lookup_sentinel) {
      return not_found;
    } else {
      return k;
    }
  };
  G__57050 = function(self__, k, not_found) {
    switch(arguments.length) {
      case 2:
        return G__57050__2.call(this, self__, k);
      case 3:
        return G__57050__3.call(this, self__, k, not_found);
    }
    throw new Error("Invalid arity: " + arguments.length);
  };
  G__57050.cljs$core$IFn$_invoke$arity$2 = G__57050__2;
  G__57050.cljs$core$IFn$_invoke$arity$3 = G__57050__3;
  return G__57050;
}();
cljs.core.TransientHashSet.prototype.apply = function(self__, args57049) {
  var self__ = this;
  var self____$1 = this;
  return self____$1.call.apply(self____$1, [self____$1].concat(cljs.core.aclone.call(null, args57049)));
};
cljs.core.TransientHashSet.prototype.cljs$core$IFn$_invoke$arity$1 = function(k) {
  var self__ = this;
  var tcoll = this;
  if (cljs.core._lookup.call(null, self__.transient_map, k, cljs.core.lookup_sentinel) === cljs.core.lookup_sentinel) {
    return null;
  } else {
    return k;
  }
};
cljs.core.TransientHashSet.prototype.cljs$core$IFn$_invoke$arity$2 = function(k, not_found) {
  var self__ = this;
  var tcoll = this;
  if (cljs.core._lookup.call(null, self__.transient_map, k, cljs.core.lookup_sentinel) === cljs.core.lookup_sentinel) {
    return not_found;
  } else {
    return k;
  }
};
cljs.core.TransientHashSet.prototype.cljs$core$ILookup$_lookup$arity$2 = function(tcoll, v) {
  var self__ = this;
  var tcoll__$1 = this;
  return cljs.core._lookup.call(null, tcoll__$1, v, null);
};
cljs.core.TransientHashSet.prototype.cljs$core$ILookup$_lookup$arity$3 = function(tcoll, v, not_found) {
  var self__ = this;
  var tcoll__$1 = this;
  if (cljs.core._lookup.call(null, self__.transient_map, v, cljs.core.lookup_sentinel) === cljs.core.lookup_sentinel) {
    return not_found;
  } else {
    return v;
  }
};
cljs.core.TransientHashSet.prototype.cljs$core$ICounted$_count$arity$1 = function(tcoll) {
  var self__ = this;
  var tcoll__$1 = this;
  return cljs.core.count.call(null, self__.transient_map);
};
cljs.core.TransientHashSet.prototype.cljs$core$ITransientSet$_disjoin_BANG_$arity$2 = function(tcoll, v) {
  var self__ = this;
  var tcoll__$1 = this;
  self__.transient_map = cljs.core.dissoc_BANG_.call(null, self__.transient_map, v);
  return tcoll__$1;
};
cljs.core.TransientHashSet.prototype.cljs$core$ITransientCollection$_conj_BANG_$arity$2 = function(tcoll, o) {
  var self__ = this;
  var tcoll__$1 = this;
  self__.transient_map = cljs.core.assoc_BANG_.call(null, self__.transient_map, o, null);
  return tcoll__$1;
};
cljs.core.TransientHashSet.prototype.cljs$core$ITransientCollection$_persistent_BANG_$arity$1 = function(tcoll) {
  var self__ = this;
  var tcoll__$1 = this;
  return new cljs.core.PersistentHashSet(null, cljs.core.persistent_BANG_.call(null, self__.transient_map), null);
};
cljs.core.__GT_TransientHashSet = function __GT_TransientHashSet(transient_map) {
  return new cljs.core.TransientHashSet(transient_map);
};
cljs.core.PersistentTreeSet = function(meta, tree_map, __hash) {
  this.meta = meta;
  this.tree_map = tree_map;
  this.__hash = __hash;
  this.cljs$lang$protocol_mask$partition0$ = 417730831;
  this.cljs$lang$protocol_mask$partition1$ = 8192;
};
cljs.core.PersistentTreeSet.cljs$lang$type = true;
cljs.core.PersistentTreeSet.cljs$lang$ctorStr = "cljs.core/PersistentTreeSet";
cljs.core.PersistentTreeSet.cljs$lang$ctorPrWriter = function(this__4215__auto__, writer__4216__auto__, opt__4217__auto__) {
  return cljs.core._write.call(null, writer__4216__auto__, "cljs.core/PersistentTreeSet");
};
cljs.core.PersistentTreeSet.prototype.toString = function() {
  var self__ = this;
  var coll = this;
  return cljs.core.pr_str_STAR_.call(null, coll);
};
cljs.core.PersistentTreeSet.prototype.equiv = function(other) {
  var self__ = this;
  var this$ = this;
  return this$.cljs$core$IEquiv$_equiv$arity$2(null, other);
};
cljs.core.PersistentTreeSet.prototype.keys = function() {
  var self__ = this;
  var coll = this;
  return cljs.core.iterator.call(null, cljs.core.seq.call(null, coll));
};
cljs.core.PersistentTreeSet.prototype.entries = function() {
  var self__ = this;
  var coll = this;
  return cljs.core.set_entries_iterator.call(null, cljs.core.seq.call(null, coll));
};
cljs.core.PersistentTreeSet.prototype.values = function() {
  var self__ = this;
  var coll = this;
  return cljs.core.iterator.call(null, cljs.core.seq.call(null, coll));
};
cljs.core.PersistentTreeSet.prototype.has = function(k) {
  var self__ = this;
  var coll = this;
  return cljs.core.contains_QMARK_.call(null, coll, k);
};
cljs.core.PersistentTreeSet.prototype.forEach = function(f) {
  var self__ = this;
  var coll = this;
  var seq__57053 = cljs.core.seq.call(null, coll);
  var chunk__57054 = null;
  var count__57055 = 0;
  var i__57056 = 0;
  while (true) {
    if (i__57056 < count__57055) {
      var vec__57057 = cljs.core._nth.call(null, chunk__57054, i__57056);
      var k = cljs.core.nth.call(null, vec__57057, 0, null);
      var v = cljs.core.nth.call(null, vec__57057, 1, null);
      f.call(null, v, k);
      var G__57059 = seq__57053;
      var G__57060 = chunk__57054;
      var G__57061 = count__57055;
      var G__57062 = i__57056 + 1;
      seq__57053 = G__57059;
      chunk__57054 = G__57060;
      count__57055 = G__57061;
      i__57056 = G__57062;
      continue;
    } else {
      var temp__4126__auto__ = cljs.core.seq.call(null, seq__57053);
      if (temp__4126__auto__) {
        var seq__57053__$1 = temp__4126__auto__;
        if (cljs.core.chunked_seq_QMARK_.call(null, seq__57053__$1)) {
          var c__4408__auto__ = cljs.core.chunk_first.call(null, seq__57053__$1);
          var G__57063 = cljs.core.chunk_rest.call(null, seq__57053__$1);
          var G__57064 = c__4408__auto__;
          var G__57065 = cljs.core.count.call(null, c__4408__auto__);
          var G__57066 = 0;
          seq__57053 = G__57063;
          chunk__57054 = G__57064;
          count__57055 = G__57065;
          i__57056 = G__57066;
          continue;
        } else {
          var vec__57058 = cljs.core.first.call(null, seq__57053__$1);
          var k = cljs.core.nth.call(null, vec__57058, 0, null);
          var v = cljs.core.nth.call(null, vec__57058, 1, null);
          f.call(null, v, k);
          var G__57067 = cljs.core.next.call(null, seq__57053__$1);
          var G__57068 = null;
          var G__57069 = 0;
          var G__57070 = 0;
          seq__57053 = G__57067;
          chunk__57054 = G__57068;
          count__57055 = G__57069;
          i__57056 = G__57070;
          continue;
        }
      } else {
        return null;
      }
    }
    break;
  }
};
cljs.core.PersistentTreeSet.prototype.cljs$core$ILookup$_lookup$arity$2 = function(coll, v) {
  var self__ = this;
  var coll__$1 = this;
  return cljs.core._lookup.call(null, coll__$1, v, null);
};
cljs.core.PersistentTreeSet.prototype.cljs$core$ILookup$_lookup$arity$3 = function(coll, v, not_found) {
  var self__ = this;
  var coll__$1 = this;
  var n = self__.tree_map.entry_at(v);
  if (!(n == null)) {
    return n.key;
  } else {
    return not_found;
  }
};
cljs.core.PersistentTreeSet.prototype.cljs$core$IMeta$_meta$arity$1 = function(coll) {
  var self__ = this;
  var coll__$1 = this;
  return self__.meta;
};
cljs.core.PersistentTreeSet.prototype.cljs$core$ICloneable$_clone$arity$1 = function(_) {
  var self__ = this;
  var ___$1 = this;
  return new cljs.core.PersistentTreeSet(self__.meta, self__.tree_map, self__.__hash);
};
cljs.core.PersistentTreeSet.prototype.cljs$core$ICounted$_count$arity$1 = function(coll) {
  var self__ = this;
  var coll__$1 = this;
  return cljs.core.count.call(null, self__.tree_map);
};
cljs.core.PersistentTreeSet.prototype.cljs$core$IReversible$_rseq$arity$1 = function(coll) {
  var self__ = this;
  var coll__$1 = this;
  if (cljs.core.count.call(null, self__.tree_map) > 0) {
    return cljs.core.map.call(null, cljs.core.key, cljs.core.rseq.call(null, self__.tree_map));
  } else {
    return null;
  }
};
cljs.core.PersistentTreeSet.prototype.cljs$core$IHash$_hash$arity$1 = function(coll) {
  var self__ = this;
  var coll__$1 = this;
  var h__4050__auto__ = self__.__hash;
  if (!(h__4050__auto__ == null)) {
    return h__4050__auto__;
  } else {
    var h__4050__auto____$1 = cljs.core.hash_unordered_coll.call(null, coll__$1);
    self__.__hash = h__4050__auto____$1;
    return h__4050__auto____$1;
  }
};
cljs.core.PersistentTreeSet.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(coll, other) {
  var self__ = this;
  var coll__$1 = this;
  return cljs.core.set_QMARK_.call(null, other) && cljs.core.count.call(null, coll__$1) === cljs.core.count.call(null, other) && cljs.core.every_QMARK_.call(null, function(coll__$1) {
    return function(p1__57051_SHARP_) {
      return cljs.core.contains_QMARK_.call(null, coll__$1, p1__57051_SHARP_);
    };
  }(coll__$1), other);
};
cljs.core.PersistentTreeSet.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(coll) {
  var self__ = this;
  var coll__$1 = this;
  return cljs.core.with_meta.call(null, cljs.core.PersistentTreeSet.EMPTY, self__.meta);
};
cljs.core.PersistentTreeSet.prototype.cljs$core$ISet$_disjoin$arity$2 = function(coll, v) {
  var self__ = this;
  var coll__$1 = this;
  return new cljs.core.PersistentTreeSet(self__.meta, cljs.core.dissoc.call(null, self__.tree_map, v), null);
};
cljs.core.PersistentTreeSet.prototype.cljs$core$ISeqable$_seq$arity$1 = function(coll) {
  var self__ = this;
  var coll__$1 = this;
  return cljs.core.keys.call(null, self__.tree_map);
};
cljs.core.PersistentTreeSet.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(coll, meta__$1) {
  var self__ = this;
  var coll__$1 = this;
  return new cljs.core.PersistentTreeSet(meta__$1, self__.tree_map, self__.__hash);
};
cljs.core.PersistentTreeSet.prototype.cljs$core$ICollection$_conj$arity$2 = function(coll, o) {
  var self__ = this;
  var coll__$1 = this;
  return new cljs.core.PersistentTreeSet(self__.meta, cljs.core.assoc.call(null, self__.tree_map, o, null), null);
};
cljs.core.PersistentTreeSet.prototype.call = function() {
  var G__57071 = null;
  var G__57071__2 = function(self__, k) {
    var self__ = this;
    var self____$1 = this;
    var coll = self____$1;
    return coll.cljs$core$ILookup$_lookup$arity$2(null, k);
  };
  var G__57071__3 = function(self__, k, not_found) {
    var self__ = this;
    var self____$1 = this;
    var coll = self____$1;
    return coll.cljs$core$ILookup$_lookup$arity$3(null, k, not_found);
  };
  G__57071 = function(self__, k, not_found) {
    switch(arguments.length) {
      case 2:
        return G__57071__2.call(this, self__, k);
      case 3:
        return G__57071__3.call(this, self__, k, not_found);
    }
    throw new Error("Invalid arity: " + arguments.length);
  };
  G__57071.cljs$core$IFn$_invoke$arity$2 = G__57071__2;
  G__57071.cljs$core$IFn$_invoke$arity$3 = G__57071__3;
  return G__57071;
}();
cljs.core.PersistentTreeSet.prototype.apply = function(self__, args57052) {
  var self__ = this;
  var self____$1 = this;
  return self____$1.call.apply(self____$1, [self____$1].concat(cljs.core.aclone.call(null, args57052)));
};
cljs.core.PersistentTreeSet.prototype.cljs$core$IFn$_invoke$arity$1 = function(k) {
  var self__ = this;
  var coll = this;
  return coll.cljs$core$ILookup$_lookup$arity$2(null, k);
};
cljs.core.PersistentTreeSet.prototype.cljs$core$IFn$_invoke$arity$2 = function(k, not_found) {
  var self__ = this;
  var coll = this;
  return coll.cljs$core$ILookup$_lookup$arity$3(null, k, not_found);
};
cljs.core.PersistentTreeSet.prototype.cljs$core$ISorted$_sorted_seq$arity$2 = function(coll, ascending_QMARK_) {
  var self__ = this;
  var coll__$1 = this;
  return cljs.core.map.call(null, cljs.core.key, cljs.core._sorted_seq.call(null, self__.tree_map, ascending_QMARK_));
};
cljs.core.PersistentTreeSet.prototype.cljs$core$ISorted$_sorted_seq_from$arity$3 = function(coll, k, ascending_QMARK_) {
  var self__ = this;
  var coll__$1 = this;
  return cljs.core.map.call(null, cljs.core.key, cljs.core._sorted_seq_from.call(null, self__.tree_map, k, ascending_QMARK_));
};
cljs.core.PersistentTreeSet.prototype.cljs$core$ISorted$_entry_key$arity$2 = function(coll, entry) {
  var self__ = this;
  var coll__$1 = this;
  return entry;
};
cljs.core.PersistentTreeSet.prototype.cljs$core$ISorted$_comparator$arity$1 = function(coll) {
  var self__ = this;
  var coll__$1 = this;
  return cljs.core._comparator.call(null, self__.tree_map);
};
cljs.core.__GT_PersistentTreeSet = function __GT_PersistentTreeSet(meta, tree_map, __hash) {
  return new cljs.core.PersistentTreeSet(meta, tree_map, __hash);
};
cljs.core.PersistentTreeSet.EMPTY = new cljs.core.PersistentTreeSet(null, cljs.core.PersistentTreeMap.EMPTY, 0);
cljs.core.set_from_indexed_seq = function set_from_indexed_seq(iseq) {
  var arr = iseq.arr;
  var ret = function() {
    var a__4502__auto__ = arr;
    var i = 0;
    var res = cljs.core._as_transient.call(null, cljs.core.PersistentHashSet.EMPTY);
    while (true) {
      if (i < a__4502__auto__.length) {
        var G__57072 = i + 1;
        var G__57073 = cljs.core._conj_BANG_.call(null, res, arr[i]);
        i = G__57072;
        res = G__57073;
        continue;
      } else {
        return res;
      }
      break;
    }
  }();
  return cljs.core._persistent_BANG_.call(null, ret);
};
cljs.core.set = function set(coll) {
  var in$ = cljs.core.seq.call(null, coll);
  if (in$ == null) {
    return cljs.core.PersistentHashSet.EMPTY;
  } else {
    if (in$ instanceof cljs.core.IndexedSeq && in$.i === 0) {
      return cljs.core.set_from_indexed_seq.call(null, in$);
    } else {
      var in$__$1 = in$;
      var out = cljs.core._as_transient.call(null, cljs.core.PersistentHashSet.EMPTY);
      while (true) {
        if (!(in$__$1 == null)) {
          var G__57074 = cljs.core._next.call(null, in$__$1);
          var G__57075 = cljs.core._conj_BANG_.call(null, out, cljs.core._first.call(null, in$__$1));
          in$__$1 = G__57074;
          out = G__57075;
          continue;
        } else {
          return cljs.core._persistent_BANG_.call(null, out);
        }
        break;
      }
    }
  }
};
cljs.core.hash_set = function() {
  var hash_set = null;
  var hash_set__0 = function() {
    return cljs.core.PersistentHashSet.EMPTY;
  };
  var hash_set__1 = function() {
    var G__57076__delegate = function(keys) {
      return cljs.core.set.call(null, keys);
    };
    var G__57076 = function(var_args) {
      var keys = null;
      if (arguments.length > 0) {
        keys = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0);
      }
      return G__57076__delegate.call(this, keys);
    };
    G__57076.cljs$lang$maxFixedArity = 0;
    G__57076.cljs$lang$applyTo = function(arglist__57077) {
      var keys = cljs.core.seq(arglist__57077);
      return G__57076__delegate(keys);
    };
    G__57076.cljs$core$IFn$_invoke$arity$variadic = G__57076__delegate;
    return G__57076;
  }();
  hash_set = function(var_args) {
    var keys = var_args;
    switch(arguments.length) {
      case 0:
        return hash_set__0.call(this);
      default:
        return hash_set__1.cljs$core$IFn$_invoke$arity$variadic(cljs.core.array_seq(arguments, 0));
    }
    throw new Error("Invalid arity: " + arguments.length);
  };
  hash_set.cljs$lang$maxFixedArity = 0;
  hash_set.cljs$lang$applyTo = hash_set__1.cljs$lang$applyTo;
  hash_set.cljs$core$IFn$_invoke$arity$0 = hash_set__0;
  hash_set.cljs$core$IFn$_invoke$arity$variadic = hash_set__1.cljs$core$IFn$_invoke$arity$variadic;
  return hash_set;
}();
cljs.core.sorted_set = function() {
  var sorted_set__delegate = function(keys) {
    return cljs.core.reduce.call(null, cljs.core._conj, cljs.core.PersistentTreeSet.EMPTY, keys);
  };
  var sorted_set = function(var_args) {
    var keys = null;
    if (arguments.length > 0) {
      keys = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0);
    }
    return sorted_set__delegate.call(this, keys);
  };
  sorted_set.cljs$lang$maxFixedArity = 0;
  sorted_set.cljs$lang$applyTo = function(arglist__57078) {
    var keys = cljs.core.seq(arglist__57078);
    return sorted_set__delegate(keys);
  };
  sorted_set.cljs$core$IFn$_invoke$arity$variadic = sorted_set__delegate;
  return sorted_set;
}();
cljs.core.sorted_set_by = function() {
  var sorted_set_by__delegate = function(comparator, keys) {
    return cljs.core.reduce.call(null, cljs.core._conj, new cljs.core.PersistentTreeSet(null, cljs.core.sorted_map_by.call(null, comparator), 0), keys);
  };
  var sorted_set_by = function(comparator, var_args) {
    var keys = null;
    if (arguments.length > 1) {
      keys = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0);
    }
    return sorted_set_by__delegate.call(this, comparator, keys);
  };
  sorted_set_by.cljs$lang$maxFixedArity = 1;
  sorted_set_by.cljs$lang$applyTo = function(arglist__57079) {
    var comparator = cljs.core.first(arglist__57079);
    var keys = cljs.core.rest(arglist__57079);
    return sorted_set_by__delegate(comparator, keys);
  };
  sorted_set_by.cljs$core$IFn$_invoke$arity$variadic = sorted_set_by__delegate;
  return sorted_set_by;
}();
cljs.core.replace = function() {
  var replace = null;
  var replace__1 = function(smap) {
    return cljs.core.map.call(null, function(p1__57080_SHARP_) {
      var temp__4124__auto__ = cljs.core.find.call(null, smap, p1__57080_SHARP_);
      if (cljs.core.truth_(temp__4124__auto__)) {
        var e = temp__4124__auto__;
        return cljs.core.val.call(null, e);
      } else {
        return p1__57080_SHARP_;
      }
    });
  };
  var replace__2 = function(smap, coll) {
    if (cljs.core.vector_QMARK_.call(null, coll)) {
      var n = cljs.core.count.call(null, coll);
      return cljs.core.reduce.call(null, function(n) {
        return function(v, i) {
          var temp__4124__auto__ = cljs.core.find.call(null, smap, cljs.core.nth.call(null, v, i));
          if (cljs.core.truth_(temp__4124__auto__)) {
            var e = temp__4124__auto__;
            return cljs.core.assoc.call(null, v, i, cljs.core.second.call(null, e));
          } else {
            return v;
          }
        };
      }(n), coll, cljs.core.take.call(null, n, cljs.core.iterate.call(null, cljs.core.inc, 0)));
    } else {
      return cljs.core.map.call(null, function(p1__57081_SHARP_) {
        var temp__4124__auto__ = cljs.core.find.call(null, smap, p1__57081_SHARP_);
        if (cljs.core.truth_(temp__4124__auto__)) {
          var e = temp__4124__auto__;
          return cljs.core.second.call(null, e);
        } else {
          return p1__57081_SHARP_;
        }
      }, coll);
    }
  };
  replace = function(smap, coll) {
    switch(arguments.length) {
      case 1:
        return replace__1.call(this, smap);
      case 2:
        return replace__2.call(this, smap, coll);
    }
    throw new Error("Invalid arity: " + arguments.length);
  };
  replace.cljs$core$IFn$_invoke$arity$1 = replace__1;
  replace.cljs$core$IFn$_invoke$arity$2 = replace__2;
  return replace;
}();
cljs.core.distinct = function distinct(coll) {
  var step = function step(xs, seen) {
    return new cljs.core.LazySeq(null, function() {
      return function(p__57088, seen__$1) {
        while (true) {
          var vec__57089 = p__57088;
          var f = cljs.core.nth.call(null, vec__57089, 0, null);
          var xs__$1 = vec__57089;
          var temp__4126__auto__ = cljs.core.seq.call(null, xs__$1);
          if (temp__4126__auto__) {
            var s = temp__4126__auto__;
            if (cljs.core.contains_QMARK_.call(null, seen__$1, f)) {
              var G__57090 = cljs.core.rest.call(null, s);
              var G__57091 = seen__$1;
              p__57088 = G__57090;
              seen__$1 = G__57091;
              continue;
            } else {
              return cljs.core.cons.call(null, f, step.call(null, cljs.core.rest.call(null, s), cljs.core.conj.call(null, seen__$1, f)));
            }
          } else {
            return null;
          }
          break;
        }
      }.call(null, xs, seen);
    }, null, null);
  };
  return step.call(null, coll, cljs.core.PersistentHashSet.EMPTY);
};
cljs.core.butlast = function butlast(s) {
  var ret = cljs.core.PersistentVector.EMPTY;
  var s__$1 = s;
  while (true) {
    if (cljs.core.next.call(null, s__$1)) {
      var G__57092 = cljs.core.conj.call(null, ret, cljs.core.first.call(null, s__$1));
      var G__57093 = cljs.core.next.call(null, s__$1);
      ret = G__57092;
      s__$1 = G__57093;
      continue;
    } else {
      return cljs.core.seq.call(null, ret);
    }
    break;
  }
};
cljs.core.name = function name(x) {
  if (function() {
    var G__57095 = x;
    if (G__57095) {
      var bit__4295__auto__ = G__57095.cljs$lang$protocol_mask$partition1$ & 4096;
      if (bit__4295__auto__ || G__57095.cljs$core$INamed$) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }()) {
    return cljs.core._name.call(null, x);
  } else {
    if (typeof x === "string") {
      return x;
    } else {
      throw new Error("Doesn't support name: " + cljs.core.str.cljs$core$IFn$_invoke$arity$1(x));
    }
  }
};
cljs.core.zipmap = function zipmap(keys, vals) {
  var map = cljs.core.transient$.call(null, cljs.core.PersistentArrayMap.EMPTY);
  var ks = cljs.core.seq.call(null, keys);
  var vs = cljs.core.seq.call(null, vals);
  while (true) {
    if (ks && vs) {
      var G__57096 = cljs.core.assoc_BANG_.call(null, map, cljs.core.first.call(null, ks), cljs.core.first.call(null, vs));
      var G__57097 = cljs.core.next.call(null, ks);
      var G__57098 = cljs.core.next.call(null, vs);
      map = G__57096;
      ks = G__57097;
      vs = G__57098;
      continue;
    } else {
      return cljs.core.persistent_BANG_.call(null, map);
    }
    break;
  }
};
cljs.core.max_key = function() {
  var max_key = null;
  var max_key__2 = function(k, x) {
    return x;
  };
  var max_key__3 = function(k, x, y) {
    if (k.call(null, x) > k.call(null, y)) {
      return x;
    } else {
      return y;
    }
  };
  var max_key__4 = function() {
    var G__57101__delegate = function(k, x, y, more) {
      return cljs.core.reduce.call(null, function(p1__57099_SHARP_, p2__57100_SHARP_) {
        return max_key.call(null, k, p1__57099_SHARP_, p2__57100_SHARP_);
      }, max_key.call(null, k, x, y), more);
    };
    var G__57101 = function(k, x, y, var_args) {
      var more = null;
      if (arguments.length > 3) {
        more = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0);
      }
      return G__57101__delegate.call(this, k, x, y, more);
    };
    G__57101.cljs$lang$maxFixedArity = 3;
    G__57101.cljs$lang$applyTo = function(arglist__57102) {
      var k = cljs.core.first(arglist__57102);
      arglist__57102 = cljs.core.next(arglist__57102);
      var x = cljs.core.first(arglist__57102);
      arglist__57102 = cljs.core.next(arglist__57102);
      var y = cljs.core.first(arglist__57102);
      var more = cljs.core.rest(arglist__57102);
      return G__57101__delegate(k, x, y, more);
    };
    G__57101.cljs$core$IFn$_invoke$arity$variadic = G__57101__delegate;
    return G__57101;
  }();
  max_key = function(k, x, y, var_args) {
    var more = var_args;
    switch(arguments.length) {
      case 2:
        return max_key__2.call(this, k, x);
      case 3:
        return max_key__3.call(this, k, x, y);
      default:
        return max_key__4.cljs$core$IFn$_invoke$arity$variadic(k, x, y, cljs.core.array_seq(arguments, 3));
    }
    throw new Error("Invalid arity: " + arguments.length);
  };
  max_key.cljs$lang$maxFixedArity = 3;
  max_key.cljs$lang$applyTo = max_key__4.cljs$lang$applyTo;
  max_key.cljs$core$IFn$_invoke$arity$2 = max_key__2;
  max_key.cljs$core$IFn$_invoke$arity$3 = max_key__3;
  max_key.cljs$core$IFn$_invoke$arity$variadic = max_key__4.cljs$core$IFn$_invoke$arity$variadic;
  return max_key;
}();
cljs.core.min_key = function() {
  var min_key = null;
  var min_key__2 = function(k, x) {
    return x;
  };
  var min_key__3 = function(k, x, y) {
    if (k.call(null, x) < k.call(null, y)) {
      return x;
    } else {
      return y;
    }
  };
  var min_key__4 = function() {
    var G__57105__delegate = function(k, x, y, more) {
      return cljs.core.reduce.call(null, function(p1__57103_SHARP_, p2__57104_SHARP_) {
        return min_key.call(null, k, p1__57103_SHARP_, p2__57104_SHARP_);
      }, min_key.call(null, k, x, y), more);
    };
    var G__57105 = function(k, x, y, var_args) {
      var more = null;
      if (arguments.length > 3) {
        more = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0);
      }
      return G__57105__delegate.call(this, k, x, y, more);
    };
    G__57105.cljs$lang$maxFixedArity = 3;
    G__57105.cljs$lang$applyTo = function(arglist__57106) {
      var k = cljs.core.first(arglist__57106);
      arglist__57106 = cljs.core.next(arglist__57106);
      var x = cljs.core.first(arglist__57106);
      arglist__57106 = cljs.core.next(arglist__57106);
      var y = cljs.core.first(arglist__57106);
      var more = cljs.core.rest(arglist__57106);
      return G__57105__delegate(k, x, y, more);
    };
    G__57105.cljs$core$IFn$_invoke$arity$variadic = G__57105__delegate;
    return G__57105;
  }();
  min_key = function(k, x, y, var_args) {
    var more = var_args;
    switch(arguments.length) {
      case 2:
        return min_key__2.call(this, k, x);
      case 3:
        return min_key__3.call(this, k, x, y);
      default:
        return min_key__4.cljs$core$IFn$_invoke$arity$variadic(k, x, y, cljs.core.array_seq(arguments, 3));
    }
    throw new Error("Invalid arity: " + arguments.length);
  };
  min_key.cljs$lang$maxFixedArity = 3;
  min_key.cljs$lang$applyTo = min_key__4.cljs$lang$applyTo;
  min_key.cljs$core$IFn$_invoke$arity$2 = min_key__2;
  min_key.cljs$core$IFn$_invoke$arity$3 = min_key__3;
  min_key.cljs$core$IFn$_invoke$arity$variadic = min_key__4.cljs$core$IFn$_invoke$arity$variadic;
  return min_key;
}();
cljs.core.ArrayList = function(arr) {
  this.arr = arr;
};
cljs.core.ArrayList.cljs$lang$type = true;
cljs.core.ArrayList.cljs$lang$ctorStr = "cljs.core/ArrayList";
cljs.core.ArrayList.cljs$lang$ctorPrWriter = function(this__4215__auto__, writer__4216__auto__, opt__4217__auto__) {
  return cljs.core._write.call(null, writer__4216__auto__, "cljs.core/ArrayList");
};
cljs.core.ArrayList.prototype.add = function(x) {
  var self__ = this;
  var _ = this;
  return self__.arr.push(x);
};
cljs.core.ArrayList.prototype.size = function() {
  var self__ = this;
  var _ = this;
  return self__.arr.length;
};
cljs.core.ArrayList.prototype.clear = function() {
  var self__ = this;
  var _ = this;
  return self__.arr = [];
};
cljs.core.ArrayList.prototype.isEmpty = function() {
  var self__ = this;
  var _ = this;
  return self__.arr.length === 0;
};
cljs.core.ArrayList.prototype.toArray = function() {
  var self__ = this;
  var _ = this;
  return self__.arr;
};
cljs.core.__GT_ArrayList = function __GT_ArrayList(arr) {
  return new cljs.core.ArrayList(arr);
};
cljs.core.array_list = function array_list() {
  return new cljs.core.ArrayList([]);
};
cljs.core.partition_all = function() {
  var partition_all = null;
  var partition_all__1 = function(n) {
    return function(f1) {
      var a = cljs.core.array_list.call(null);
      return function(a) {
        return function() {
          var G__57107 = null;
          var G__57107__0 = function() {
            return f1.call(null);
          };
          var G__57107__1 = function(result) {
            var result__$1 = cljs.core.truth_(a.isEmpty()) ? result : function() {
              var v = cljs.core.vec.call(null, a.toArray());
              a.clear();
              return f1.call(null, result, v);
            }();
            return f1.call(null, result__$1);
          };
          var G__57107__2 = function(result, input) {
            a.add(input);
            if (n === a.size()) {
              var v = cljs.core.vec.call(null, a.toArray());
              a.clear();
              return f1.call(null, result, v);
            } else {
              return result;
            }
          };
          G__57107 = function(result, input) {
            switch(arguments.length) {
              case 0:
                return G__57107__0.call(this);
              case 1:
                return G__57107__1.call(this, result);
              case 2:
                return G__57107__2.call(this, result, input);
            }
            throw new Error("Invalid arity: " + arguments.length);
          };
          G__57107.cljs$core$IFn$_invoke$arity$0 = G__57107__0;
          G__57107.cljs$core$IFn$_invoke$arity$1 = G__57107__1;
          G__57107.cljs$core$IFn$_invoke$arity$2 = G__57107__2;
          return G__57107;
        }();
      }(a);
    };
  };
  var partition_all__2 = function(n, coll) {
    return partition_all.call(null, n, n, coll);
  };
  var partition_all__3 = function(n, step, coll) {
    return new cljs.core.LazySeq(null, function() {
      var temp__4126__auto__ = cljs.core.seq.call(null, coll);
      if (temp__4126__auto__) {
        var s = temp__4126__auto__;
        return cljs.core.cons.call(null, cljs.core.take.call(null, n, s), partition_all.call(null, n, step, cljs.core.drop.call(null, step, s)));
      } else {
        return null;
      }
    }, null, null);
  };
  partition_all = function(n, step, coll) {
    switch(arguments.length) {
      case 1:
        return partition_all__1.call(this, n);
      case 2:
        return partition_all__2.call(this, n, step);
      case 3:
        return partition_all__3.call(this, n, step, coll);
    }
    throw new Error("Invalid arity: " + arguments.length);
  };
  partition_all.cljs$core$IFn$_invoke$arity$1 = partition_all__1;
  partition_all.cljs$core$IFn$_invoke$arity$2 = partition_all__2;
  partition_all.cljs$core$IFn$_invoke$arity$3 = partition_all__3;
  return partition_all;
}();
cljs.core.take_while = function() {
  var take_while = null;
  var take_while__1 = function(pred) {
    return function(f1) {
      return function() {
        var G__57108 = null;
        var G__57108__0 = function() {
          return f1.call(null);
        };
        var G__57108__1 = function(result) {
          return f1.call(null, result);
        };
        var G__57108__2 = function(result, input) {
          if (cljs.core.truth_(pred.call(null, input))) {
            return f1.call(null, result, input);
          } else {
            return cljs.core.reduced.call(null, result);
          }
        };
        G__57108 = function(result, input) {
          switch(arguments.length) {
            case 0:
              return G__57108__0.call(this);
            case 1:
              return G__57108__1.call(this, result);
            case 2:
              return G__57108__2.call(this, result, input);
          }
          throw new Error("Invalid arity: " + arguments.length);
        };
        G__57108.cljs$core$IFn$_invoke$arity$0 = G__57108__0;
        G__57108.cljs$core$IFn$_invoke$arity$1 = G__57108__1;
        G__57108.cljs$core$IFn$_invoke$arity$2 = G__57108__2;
        return G__57108;
      }();
    };
  };
  var take_while__2 = function(pred, coll) {
    return new cljs.core.LazySeq(null, function() {
      var temp__4126__auto__ = cljs.core.seq.call(null, coll);
      if (temp__4126__auto__) {
        var s = temp__4126__auto__;
        if (cljs.core.truth_(pred.call(null, cljs.core.first.call(null, s)))) {
          return cljs.core.cons.call(null, cljs.core.first.call(null, s), take_while.call(null, pred, cljs.core.rest.call(null, s)));
        } else {
          return null;
        }
      } else {
        return null;
      }
    }, null, null);
  };
  take_while = function(pred, coll) {
    switch(arguments.length) {
      case 1:
        return take_while__1.call(this, pred);
      case 2:
        return take_while__2.call(this, pred, coll);
    }
    throw new Error("Invalid arity: " + arguments.length);
  };
  take_while.cljs$core$IFn$_invoke$arity$1 = take_while__1;
  take_while.cljs$core$IFn$_invoke$arity$2 = take_while__2;
  return take_while;
}();
cljs.core.mk_bound_fn = function mk_bound_fn(sc, test, key) {
  return function(e) {
    var comp = cljs.core._comparator.call(null, sc);
    return test.call(null, comp.call(null, cljs.core._entry_key.call(null, sc, e), key), 0);
  };
};
cljs.core.subseq = function() {
  var subseq = null;
  var subseq__3 = function(sc, test, key) {
    var include = cljs.core.mk_bound_fn.call(null, sc, test, key);
    if (cljs.core.truth_(cljs.core.PersistentHashSet.fromArray([cljs.core._GT_, cljs.core._GT__EQ_], true).call(null, test))) {
      var temp__4126__auto__ = cljs.core._sorted_seq_from.call(null, sc, key, true);
      if (cljs.core.truth_(temp__4126__auto__)) {
        var vec__57111 = temp__4126__auto__;
        var e = cljs.core.nth.call(null, vec__57111, 0, null);
        var s = vec__57111;
        if (cljs.core.truth_(include.call(null, e))) {
          return s;
        } else {
          return cljs.core.next.call(null, s);
        }
      } else {
        return null;
      }
    } else {
      return cljs.core.take_while.call(null, include, cljs.core._sorted_seq.call(null, sc, true));
    }
  };
  var subseq__5 = function(sc, start_test, start_key, end_test, end_key) {
    var temp__4126__auto__ = cljs.core._sorted_seq_from.call(null, sc, start_key, true);
    if (cljs.core.truth_(temp__4126__auto__)) {
      var vec__57112 = temp__4126__auto__;
      var e = cljs.core.nth.call(null, vec__57112, 0, null);
      var s = vec__57112;
      return cljs.core.take_while.call(null, cljs.core.mk_bound_fn.call(null, sc, end_test, end_key), cljs.core.truth_(cljs.core.mk_bound_fn.call(null, sc, start_test, start_key).call(null, e)) ? s : cljs.core.next.call(null, s));
    } else {
      return null;
    }
  };
  subseq = function(sc, start_test, start_key, end_test, end_key) {
    switch(arguments.length) {
      case 3:
        return subseq__3.call(this, sc, start_test, start_key);
      case 5:
        return subseq__5.call(this, sc, start_test, start_key, end_test, end_key);
    }
    throw new Error("Invalid arity: " + arguments.length);
  };
  subseq.cljs$core$IFn$_invoke$arity$3 = subseq__3;
  subseq.cljs$core$IFn$_invoke$arity$5 = subseq__5;
  return subseq;
}();
cljs.core.rsubseq = function() {
  var rsubseq = null;
  var rsubseq__3 = function(sc, test, key) {
    var include = cljs.core.mk_bound_fn.call(null, sc, test, key);
    if (cljs.core.truth_(cljs.core.PersistentHashSet.fromArray([cljs.core._LT_, cljs.core._LT__EQ_], true).call(null, test))) {
      var temp__4126__auto__ = cljs.core._sorted_seq_from.call(null, sc, key, false);
      if (cljs.core.truth_(temp__4126__auto__)) {
        var vec__57115 = temp__4126__auto__;
        var e = cljs.core.nth.call(null, vec__57115, 0, null);
        var s = vec__57115;
        if (cljs.core.truth_(include.call(null, e))) {
          return s;
        } else {
          return cljs.core.next.call(null, s);
        }
      } else {
        return null;
      }
    } else {
      return cljs.core.take_while.call(null, include, cljs.core._sorted_seq.call(null, sc, false));
    }
  };
  var rsubseq__5 = function(sc, start_test, start_key, end_test, end_key) {
    var temp__4126__auto__ = cljs.core._sorted_seq_from.call(null, sc, end_key, false);
    if (cljs.core.truth_(temp__4126__auto__)) {
      var vec__57116 = temp__4126__auto__;
      var e = cljs.core.nth.call(null, vec__57116, 0, null);
      var s = vec__57116;
      return cljs.core.take_while.call(null, cljs.core.mk_bound_fn.call(null, sc, start_test, start_key), cljs.core.truth_(cljs.core.mk_bound_fn.call(null, sc, end_test, end_key).call(null, e)) ? s : cljs.core.next.call(null, s));
    } else {
      return null;
    }
  };
  rsubseq = function(sc, start_test, start_key, end_test, end_key) {
    switch(arguments.length) {
      case 3:
        return rsubseq__3.call(this, sc, start_test, start_key);
      case 5:
        return rsubseq__5.call(this, sc, start_test, start_key, end_test, end_key);
    }
    throw new Error("Invalid arity: " + arguments.length);
  };
  rsubseq.cljs$core$IFn$_invoke$arity$3 = rsubseq__3;
  rsubseq.cljs$core$IFn$_invoke$arity$5 = rsubseq__5;
  return rsubseq;
}();
cljs.core.Range = function(meta, start, end, step, __hash) {
  this.meta = meta;
  this.start = start;
  this.end = end;
  this.step = step;
  this.__hash = __hash;
  this.cljs$lang$protocol_mask$partition0$ = 32375006;
  this.cljs$lang$protocol_mask$partition1$ = 8192;
};
cljs.core.Range.cljs$lang$type = true;
cljs.core.Range.cljs$lang$ctorStr = "cljs.core/Range";
cljs.core.Range.cljs$lang$ctorPrWriter = function(this__4215__auto__, writer__4216__auto__, opt__4217__auto__) {
  return cljs.core._write.call(null, writer__4216__auto__, "cljs.core/Range");
};
cljs.core.Range.prototype.toString = function() {
  var self__ = this;
  var coll = this;
  return cljs.core.pr_str_STAR_.call(null, coll);
};
cljs.core.Range.prototype.equiv = function(other) {
  var self__ = this;
  var this$ = this;
  return this$.cljs$core$IEquiv$_equiv$arity$2(null, other);
};
cljs.core.Range.prototype.cljs$core$IIndexed$_nth$arity$2 = function(rng, n) {
  var self__ = this;
  var rng__$1 = this;
  if (n < cljs.core._count.call(null, rng__$1)) {
    return self__.start + n * self__.step;
  } else {
    if (self__.start > self__.end && self__.step === 0) {
      return self__.start;
    } else {
      throw new Error("Index out of bounds");
    }
  }
};
cljs.core.Range.prototype.cljs$core$IIndexed$_nth$arity$3 = function(rng, n, not_found) {
  var self__ = this;
  var rng__$1 = this;
  if (n < cljs.core._count.call(null, rng__$1)) {
    return self__.start + n * self__.step;
  } else {
    if (self__.start > self__.end && self__.step === 0) {
      return self__.start;
    } else {
      return not_found;
    }
  }
};
cljs.core.Range.prototype.cljs$core$IMeta$_meta$arity$1 = function(rng) {
  var self__ = this;
  var rng__$1 = this;
  return self__.meta;
};
cljs.core.Range.prototype.cljs$core$ICloneable$_clone$arity$1 = function(_) {
  var self__ = this;
  var ___$1 = this;
  return new cljs.core.Range(self__.meta, self__.start, self__.end, self__.step, self__.__hash);
};
cljs.core.Range.prototype.cljs$core$INext$_next$arity$1 = function(rng) {
  var self__ = this;
  var rng__$1 = this;
  if (self__.step > 0) {
    if (self__.start + self__.step < self__.end) {
      return new cljs.core.Range(self__.meta, self__.start + self__.step, self__.end, self__.step, null);
    } else {
      return null;
    }
  } else {
    if (self__.start + self__.step > self__.end) {
      return new cljs.core.Range(self__.meta, self__.start + self__.step, self__.end, self__.step, null);
    } else {
      return null;
    }
  }
};
cljs.core.Range.prototype.cljs$core$ICounted$_count$arity$1 = function(rng) {
  var self__ = this;
  var rng__$1 = this;
  if (cljs.core.not.call(null, cljs.core._seq.call(null, rng__$1))) {
    return 0;
  } else {
    return Math.ceil.call(null, (self__.end - self__.start) / self__.step);
  }
};
cljs.core.Range.prototype.cljs$core$IHash$_hash$arity$1 = function(rng) {
  var self__ = this;
  var rng__$1 = this;
  var h__4050__auto__ = self__.__hash;
  if (!(h__4050__auto__ == null)) {
    return h__4050__auto__;
  } else {
    var h__4050__auto____$1 = cljs.core.hash_ordered_coll.call(null, rng__$1);
    self__.__hash = h__4050__auto____$1;
    return h__4050__auto____$1;
  }
};
cljs.core.Range.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(rng, other) {
  var self__ = this;
  var rng__$1 = this;
  return cljs.core.equiv_sequential.call(null, rng__$1, other);
};
cljs.core.Range.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(rng) {
  var self__ = this;
  var rng__$1 = this;
  return cljs.core.with_meta.call(null, cljs.core.List.EMPTY, self__.meta);
};
cljs.core.Range.prototype.cljs$core$IReduce$_reduce$arity$2 = function(rng, f) {
  var self__ = this;
  var rng__$1 = this;
  return cljs.core.ci_reduce.call(null, rng__$1, f);
};
cljs.core.Range.prototype.cljs$core$IReduce$_reduce$arity$3 = function(rng, f, s) {
  var self__ = this;
  var rng__$1 = this;
  return cljs.core.ci_reduce.call(null, rng__$1, f, s);
};
cljs.core.Range.prototype.cljs$core$ISeq$_first$arity$1 = function(rng) {
  var self__ = this;
  var rng__$1 = this;
  if (cljs.core._seq.call(null, rng__$1) == null) {
    return null;
  } else {
    return self__.start;
  }
};
cljs.core.Range.prototype.cljs$core$ISeq$_rest$arity$1 = function(rng) {
  var self__ = this;
  var rng__$1 = this;
  if (!(cljs.core._seq.call(null, rng__$1) == null)) {
    return new cljs.core.Range(self__.meta, self__.start + self__.step, self__.end, self__.step, null);
  } else {
    return cljs.core.List.EMPTY;
  }
};
cljs.core.Range.prototype.cljs$core$ISeqable$_seq$arity$1 = function(rng) {
  var self__ = this;
  var rng__$1 = this;
  if (self__.step > 0) {
    if (self__.start < self__.end) {
      return rng__$1;
    } else {
      return null;
    }
  } else {
    if (self__.start > self__.end) {
      return rng__$1;
    } else {
      return null;
    }
  }
};
cljs.core.Range.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(rng, meta__$1) {
  var self__ = this;
  var rng__$1 = this;
  return new cljs.core.Range(meta__$1, self__.start, self__.end, self__.step, self__.__hash);
};
cljs.core.Range.prototype.cljs$core$ICollection$_conj$arity$2 = function(rng, o) {
  var self__ = this;
  var rng__$1 = this;
  return cljs.core.cons.call(null, o, rng__$1);
};
cljs.core.__GT_Range = function __GT_Range(meta, start, end, step, __hash) {
  return new cljs.core.Range(meta, start, end, step, __hash);
};
cljs.core.range = function() {
  var range = null;
  var range__0 = function() {
    return range.call(null, 0, Number.MAX_VALUE, 1);
  };
  var range__1 = function(end) {
    return range.call(null, 0, end, 1);
  };
  var range__2 = function(start, end) {
    return range.call(null, start, end, 1);
  };
  var range__3 = function(start, end, step) {
    return new cljs.core.Range(null, start, end, step, null);
  };
  range = function(start, end, step) {
    switch(arguments.length) {
      case 0:
        return range__0.call(this);
      case 1:
        return range__1.call(this, start);
      case 2:
        return range__2.call(this, start, end);
      case 3:
        return range__3.call(this, start, end, step);
    }
    throw new Error("Invalid arity: " + arguments.length);
  };
  range.cljs$core$IFn$_invoke$arity$0 = range__0;
  range.cljs$core$IFn$_invoke$arity$1 = range__1;
  range.cljs$core$IFn$_invoke$arity$2 = range__2;
  range.cljs$core$IFn$_invoke$arity$3 = range__3;
  return range;
}();
cljs.core.take_nth = function() {
  var take_nth = null;
  var take_nth__1 = function(n) {
    return function(f1) {
      var ia = cljs.core.atom.call(null, -1);
      return function(ia) {
        return function() {
          var G__57117 = null;
          var G__57117__0 = function() {
            return f1.call(null);
          };
          var G__57117__1 = function(result) {
            return f1.call(null, result);
          };
          var G__57117__2 = function(result, input) {
            var i = cljs.core.swap_BANG_.call(null, ia, cljs.core.inc);
            if (cljs.core.rem.call(null, i, n) === 0) {
              return f1.call(null, result, input);
            } else {
              return result;
            }
          };
          G__57117 = function(result, input) {
            switch(arguments.length) {
              case 0:
                return G__57117__0.call(this);
              case 1:
                return G__57117__1.call(this, result);
              case 2:
                return G__57117__2.call(this, result, input);
            }
            throw new Error("Invalid arity: " + arguments.length);
          };
          G__57117.cljs$core$IFn$_invoke$arity$0 = G__57117__0;
          G__57117.cljs$core$IFn$_invoke$arity$1 = G__57117__1;
          G__57117.cljs$core$IFn$_invoke$arity$2 = G__57117__2;
          return G__57117;
        }();
      }(ia);
    };
  };
  var take_nth__2 = function(n, coll) {
    return new cljs.core.LazySeq(null, function() {
      var temp__4126__auto__ = cljs.core.seq.call(null, coll);
      if (temp__4126__auto__) {
        var s = temp__4126__auto__;
        return cljs.core.cons.call(null, cljs.core.first.call(null, s), take_nth.call(null, n, cljs.core.drop.call(null, n, s)));
      } else {
        return null;
      }
    }, null, null);
  };
  take_nth = function(n, coll) {
    switch(arguments.length) {
      case 1:
        return take_nth__1.call(this, n);
      case 2:
        return take_nth__2.call(this, n, coll);
    }
    throw new Error("Invalid arity: " + arguments.length);
  };
  take_nth.cljs$core$IFn$_invoke$arity$1 = take_nth__1;
  take_nth.cljs$core$IFn$_invoke$arity$2 = take_nth__2;
  return take_nth;
}();
cljs.core.split_with = function split_with(pred, coll) {
  return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.take_while.call(null, pred, coll), cljs.core.drop_while.call(null, pred, coll)], null);
};
cljs.core.partition_by = function() {
  var partition_by = null;
  var partition_by__1 = function(f) {
    return function(f1) {
      var a = cljs.core.array_list.call(null);
      var pa = cljs.core.atom.call(null, new cljs.core.Keyword("cljs.core", "none", "cljs.core/none", 926646439));
      return function(a, pa) {
        return function() {
          var G__57119 = null;
          var G__57119__0 = function() {
            return f1.call(null);
          };
          var G__57119__1 = function(result) {
            var result__$1 = cljs.core.truth_(a.isEmpty()) ? result : function() {
              var v = cljs.core.vec.call(null, a.toArray());
              a.clear();
              return f1.call(null, result, v);
            }();
            return f1.call(null, result__$1);
          };
          var G__57119__2 = function(result, input) {
            var pval = cljs.core.deref.call(null, pa);
            var val = f.call(null, input);
            cljs.core.reset_BANG_.call(null, pa, val);
            if (cljs.core.keyword_identical_QMARK_.call(null, pval, new cljs.core.Keyword("cljs.core", "none", "cljs.core/none", 926646439)) || cljs.core._EQ_.call(null, val, pval)) {
              a.add(input);
              return result;
            } else {
              var v = cljs.core.vec.call(null, a.toArray());
              a.clear();
              var ret = f1.call(null, result, v);
              if (cljs.core.reduced_QMARK_.call(null, ret)) {
              } else {
                a.add(input);
              }
              return ret;
            }
          };
          G__57119 = function(result, input) {
            switch(arguments.length) {
              case 0:
                return G__57119__0.call(this);
              case 1:
                return G__57119__1.call(this, result);
              case 2:
                return G__57119__2.call(this, result, input);
            }
            throw new Error("Invalid arity: " + arguments.length);
          };
          G__57119.cljs$core$IFn$_invoke$arity$0 = G__57119__0;
          G__57119.cljs$core$IFn$_invoke$arity$1 = G__57119__1;
          G__57119.cljs$core$IFn$_invoke$arity$2 = G__57119__2;
          return G__57119;
        }();
      }(a, pa);
    };
  };
  var partition_by__2 = function(f, coll) {
    return new cljs.core.LazySeq(null, function() {
      var temp__4126__auto__ = cljs.core.seq.call(null, coll);
      if (temp__4126__auto__) {
        var s = temp__4126__auto__;
        var fst = cljs.core.first.call(null, s);
        var fv = f.call(null, fst);
        var run = cljs.core.cons.call(null, fst, cljs.core.take_while.call(null, function(fst, fv, s, temp__4126__auto__) {
          return function(p1__57118_SHARP_) {
            return cljs.core._EQ_.call(null, fv, f.call(null, p1__57118_SHARP_));
          };
        }(fst, fv, s, temp__4126__auto__), cljs.core.next.call(null, s)));
        return cljs.core.cons.call(null, run, partition_by.call(null, f, cljs.core.seq.call(null, cljs.core.drop.call(null, cljs.core.count.call(null, run), s))));
      } else {
        return null;
      }
    }, null, null);
  };
  partition_by = function(f, coll) {
    switch(arguments.length) {
      case 1:
        return partition_by__1.call(this, f);
      case 2:
        return partition_by__2.call(this, f, coll);
    }
    throw new Error("Invalid arity: " + arguments.length);
  };
  partition_by.cljs$core$IFn$_invoke$arity$1 = partition_by__1;
  partition_by.cljs$core$IFn$_invoke$arity$2 = partition_by__2;
  return partition_by;
}();
cljs.core.frequencies = function frequencies(coll) {
  return cljs.core.persistent_BANG_.call(null, cljs.core.reduce.call(null, function(counts, x) {
    return cljs.core.assoc_BANG_.call(null, counts, x, cljs.core.get.call(null, counts, x, 0) + 1);
  }, cljs.core.transient$.call(null, cljs.core.PersistentArrayMap.EMPTY), coll));
};
cljs.core.reductions = function() {
  var reductions = null;
  var reductions__2 = function(f, coll) {
    return new cljs.core.LazySeq(null, function() {
      var temp__4124__auto__ = cljs.core.seq.call(null, coll);
      if (temp__4124__auto__) {
        var s = temp__4124__auto__;
        return reductions.call(null, f, cljs.core.first.call(null, s), cljs.core.rest.call(null, s));
      } else {
        return cljs.core._conj.call(null, cljs.core.List.EMPTY, f.call(null));
      }
    }, null, null);
  };
  var reductions__3 = function(f, init, coll) {
    return cljs.core.cons.call(null, init, new cljs.core.LazySeq(null, function() {
      var temp__4126__auto__ = cljs.core.seq.call(null, coll);
      if (temp__4126__auto__) {
        var s = temp__4126__auto__;
        return reductions.call(null, f, f.call(null, init, cljs.core.first.call(null, s)), cljs.core.rest.call(null, s));
      } else {
        return null;
      }
    }, null, null));
  };
  reductions = function(f, init, coll) {
    switch(arguments.length) {
      case 2:
        return reductions__2.call(this, f, init);
      case 3:
        return reductions__3.call(this, f, init, coll);
    }
    throw new Error("Invalid arity: " + arguments.length);
  };
  reductions.cljs$core$IFn$_invoke$arity$2 = reductions__2;
  reductions.cljs$core$IFn$_invoke$arity$3 = reductions__3;
  return reductions;
}();
cljs.core.juxt = function() {
  var juxt = null;
  var juxt__1 = function(f) {
    return function() {
      var G__57130 = null;
      var G__57130__0 = function() {
        return new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [f.call(null)], null);
      };
      var G__57130__1 = function(x) {
        return new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [f.call(null, x)], null);
      };
      var G__57130__2 = function(x, y) {
        return new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [f.call(null, x, y)], null);
      };
      var G__57130__3 = function(x, y, z) {
        return new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [f.call(null, x, y, z)], null);
      };
      var G__57130__4 = function() {
        var G__57131__delegate = function(x, y, z, args) {
          return new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.apply.call(null, f, x, y, z, args)], null);
        };
        var G__57131 = function(x, y, z, var_args) {
          var args = null;
          if (arguments.length > 3) {
            args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0);
          }
          return G__57131__delegate.call(this, x, y, z, args);
        };
        G__57131.cljs$lang$maxFixedArity = 3;
        G__57131.cljs$lang$applyTo = function(arglist__57132) {
          var x = cljs.core.first(arglist__57132);
          arglist__57132 = cljs.core.next(arglist__57132);
          var y = cljs.core.first(arglist__57132);
          arglist__57132 = cljs.core.next(arglist__57132);
          var z = cljs.core.first(arglist__57132);
          var args = cljs.core.rest(arglist__57132);
          return G__57131__delegate(x, y, z, args);
        };
        G__57131.cljs$core$IFn$_invoke$arity$variadic = G__57131__delegate;
        return G__57131;
      }();
      G__57130 = function(x, y, z, var_args) {
        var args = var_args;
        switch(arguments.length) {
          case 0:
            return G__57130__0.call(this);
          case 1:
            return G__57130__1.call(this, x);
          case 2:
            return G__57130__2.call(this, x, y);
          case 3:
            return G__57130__3.call(this, x, y, z);
          default:
            return G__57130__4.cljs$core$IFn$_invoke$arity$variadic(x, y, z, cljs.core.array_seq(arguments, 3));
        }
        throw new Error("Invalid arity: " + arguments.length);
      };
      G__57130.cljs$lang$maxFixedArity = 3;
      G__57130.cljs$lang$applyTo = G__57130__4.cljs$lang$applyTo;
      G__57130.cljs$core$IFn$_invoke$arity$0 = G__57130__0;
      G__57130.cljs$core$IFn$_invoke$arity$1 = G__57130__1;
      G__57130.cljs$core$IFn$_invoke$arity$2 = G__57130__2;
      G__57130.cljs$core$IFn$_invoke$arity$3 = G__57130__3;
      G__57130.cljs$core$IFn$_invoke$arity$variadic = G__57130__4.cljs$core$IFn$_invoke$arity$variadic;
      return G__57130;
    }();
  };
  var juxt__2 = function(f, g) {
    return function() {
      var G__57133 = null;
      var G__57133__0 = function() {
        return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [f.call(null), g.call(null)], null);
      };
      var G__57133__1 = function(x) {
        return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [f.call(null, x), g.call(null, x)], null);
      };
      var G__57133__2 = function(x, y) {
        return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [f.call(null, x, y), g.call(null, x, y)], null);
      };
      var G__57133__3 = function(x, y, z) {
        return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [f.call(null, x, y, z), g.call(null, x, y, z)], null);
      };
      var G__57133__4 = function() {
        var G__57134__delegate = function(x, y, z, args) {
          return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.apply.call(null, f, x, y, z, args), cljs.core.apply.call(null, g, x, y, z, args)], null);
        };
        var G__57134 = function(x, y, z, var_args) {
          var args = null;
          if (arguments.length > 3) {
            args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0);
          }
          return G__57134__delegate.call(this, x, y, z, args);
        };
        G__57134.cljs$lang$maxFixedArity = 3;
        G__57134.cljs$lang$applyTo = function(arglist__57135) {
          var x = cljs.core.first(arglist__57135);
          arglist__57135 = cljs.core.next(arglist__57135);
          var y = cljs.core.first(arglist__57135);
          arglist__57135 = cljs.core.next(arglist__57135);
          var z = cljs.core.first(arglist__57135);
          var args = cljs.core.rest(arglist__57135);
          return G__57134__delegate(x, y, z, args);
        };
        G__57134.cljs$core$IFn$_invoke$arity$variadic = G__57134__delegate;
        return G__57134;
      }();
      G__57133 = function(x, y, z, var_args) {
        var args = var_args;
        switch(arguments.length) {
          case 0:
            return G__57133__0.call(this);
          case 1:
            return G__57133__1.call(this, x);
          case 2:
            return G__57133__2.call(this, x, y);
          case 3:
            return G__57133__3.call(this, x, y, z);
          default:
            return G__57133__4.cljs$core$IFn$_invoke$arity$variadic(x, y, z, cljs.core.array_seq(arguments, 3));
        }
        throw new Error("Invalid arity: " + arguments.length);
      };
      G__57133.cljs$lang$maxFixedArity = 3;
      G__57133.cljs$lang$applyTo = G__57133__4.cljs$lang$applyTo;
      G__57133.cljs$core$IFn$_invoke$arity$0 = G__57133__0;
      G__57133.cljs$core$IFn$_invoke$arity$1 = G__57133__1;
      G__57133.cljs$core$IFn$_invoke$arity$2 = G__57133__2;
      G__57133.cljs$core$IFn$_invoke$arity$3 = G__57133__3;
      G__57133.cljs$core$IFn$_invoke$arity$variadic = G__57133__4.cljs$core$IFn$_invoke$arity$variadic;
      return G__57133;
    }();
  };
  var juxt__3 = function(f, g, h) {
    return function() {
      var G__57136 = null;
      var G__57136__0 = function() {
        return new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [f.call(null), g.call(null), h.call(null)], null);
      };
      var G__57136__1 = function(x) {
        return new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [f.call(null, x), g.call(null, x), h.call(null, x)], null);
      };
      var G__57136__2 = function(x, y) {
        return new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [f.call(null, x, y), g.call(null, x, y), h.call(null, x, y)], null);
      };
      var G__57136__3 = function(x, y, z) {
        return new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [f.call(null, x, y, z), g.call(null, x, y, z), h.call(null, x, y, z)], null);
      };
      var G__57136__4 = function() {
        var G__57137__delegate = function(x, y, z, args) {
          return new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.apply.call(null, f, x, y, z, args), cljs.core.apply.call(null, g, x, y, z, args), cljs.core.apply.call(null, h, x, y, z, args)], null);
        };
        var G__57137 = function(x, y, z, var_args) {
          var args = null;
          if (arguments.length > 3) {
            args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0);
          }
          return G__57137__delegate.call(this, x, y, z, args);
        };
        G__57137.cljs$lang$maxFixedArity = 3;
        G__57137.cljs$lang$applyTo = function(arglist__57138) {
          var x = cljs.core.first(arglist__57138);
          arglist__57138 = cljs.core.next(arglist__57138);
          var y = cljs.core.first(arglist__57138);
          arglist__57138 = cljs.core.next(arglist__57138);
          var z = cljs.core.first(arglist__57138);
          var args = cljs.core.rest(arglist__57138);
          return G__57137__delegate(x, y, z, args);
        };
        G__57137.cljs$core$IFn$_invoke$arity$variadic = G__57137__delegate;
        return G__57137;
      }();
      G__57136 = function(x, y, z, var_args) {
        var args = var_args;
        switch(arguments.length) {
          case 0:
            return G__57136__0.call(this);
          case 1:
            return G__57136__1.call(this, x);
          case 2:
            return G__57136__2.call(this, x, y);
          case 3:
            return G__57136__3.call(this, x, y, z);
          default:
            return G__57136__4.cljs$core$IFn$_invoke$arity$variadic(x, y, z, cljs.core.array_seq(arguments, 3));
        }
        throw new Error("Invalid arity: " + arguments.length);
      };
      G__57136.cljs$lang$maxFixedArity = 3;
      G__57136.cljs$lang$applyTo = G__57136__4.cljs$lang$applyTo;
      G__57136.cljs$core$IFn$_invoke$arity$0 = G__57136__0;
      G__57136.cljs$core$IFn$_invoke$arity$1 = G__57136__1;
      G__57136.cljs$core$IFn$_invoke$arity$2 = G__57136__2;
      G__57136.cljs$core$IFn$_invoke$arity$3 = G__57136__3;
      G__57136.cljs$core$IFn$_invoke$arity$variadic = G__57136__4.cljs$core$IFn$_invoke$arity$variadic;
      return G__57136;
    }();
  };
  var juxt__4 = function() {
    var G__57139__delegate = function(f, g, h, fs) {
      var fs__$1 = cljs.core.list_STAR_.call(null, f, g, h, fs);
      return function(fs__$1) {
        return function() {
          var G__57140 = null;
          var G__57140__0 = function() {
            return cljs.core.reduce.call(null, function(fs__$1) {
              return function(p1__57120_SHARP_, p2__57121_SHARP_) {
                return cljs.core.conj.call(null, p1__57120_SHARP_, p2__57121_SHARP_.call(null));
              };
            }(fs__$1), cljs.core.PersistentVector.EMPTY, fs__$1);
          };
          var G__57140__1 = function(x) {
            return cljs.core.reduce.call(null, function(fs__$1) {
              return function(p1__57122_SHARP_, p2__57123_SHARP_) {
                return cljs.core.conj.call(null, p1__57122_SHARP_, p2__57123_SHARP_.call(null, x));
              };
            }(fs__$1), cljs.core.PersistentVector.EMPTY, fs__$1);
          };
          var G__57140__2 = function(x, y) {
            return cljs.core.reduce.call(null, function(fs__$1) {
              return function(p1__57124_SHARP_, p2__57125_SHARP_) {
                return cljs.core.conj.call(null, p1__57124_SHARP_, p2__57125_SHARP_.call(null, x, y));
              };
            }(fs__$1), cljs.core.PersistentVector.EMPTY, fs__$1);
          };
          var G__57140__3 = function(x, y, z) {
            return cljs.core.reduce.call(null, function(fs__$1) {
              return function(p1__57126_SHARP_, p2__57127_SHARP_) {
                return cljs.core.conj.call(null, p1__57126_SHARP_, p2__57127_SHARP_.call(null, x, y, z));
              };
            }(fs__$1), cljs.core.PersistentVector.EMPTY, fs__$1);
          };
          var G__57140__4 = function() {
            var G__57141__delegate = function(x, y, z, args) {
              return cljs.core.reduce.call(null, function(fs__$1) {
                return function(p1__57128_SHARP_, p2__57129_SHARP_) {
                  return cljs.core.conj.call(null, p1__57128_SHARP_, cljs.core.apply.call(null, p2__57129_SHARP_, x, y, z, args));
                };
              }(fs__$1), cljs.core.PersistentVector.EMPTY, fs__$1);
            };
            var G__57141 = function(x, y, z, var_args) {
              var args = null;
              if (arguments.length > 3) {
                args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0);
              }
              return G__57141__delegate.call(this, x, y, z, args);
            };
            G__57141.cljs$lang$maxFixedArity = 3;
            G__57141.cljs$lang$applyTo = function(arglist__57142) {
              var x = cljs.core.first(arglist__57142);
              arglist__57142 = cljs.core.next(arglist__57142);
              var y = cljs.core.first(arglist__57142);
              arglist__57142 = cljs.core.next(arglist__57142);
              var z = cljs.core.first(arglist__57142);
              var args = cljs.core.rest(arglist__57142);
              return G__57141__delegate(x, y, z, args);
            };
            G__57141.cljs$core$IFn$_invoke$arity$variadic = G__57141__delegate;
            return G__57141;
          }();
          G__57140 = function(x, y, z, var_args) {
            var args = var_args;
            switch(arguments.length) {
              case 0:
                return G__57140__0.call(this);
              case 1:
                return G__57140__1.call(this, x);
              case 2:
                return G__57140__2.call(this, x, y);
              case 3:
                return G__57140__3.call(this, x, y, z);
              default:
                return G__57140__4.cljs$core$IFn$_invoke$arity$variadic(x, y, z, cljs.core.array_seq(arguments, 3));
            }
            throw new Error("Invalid arity: " + arguments.length);
          };
          G__57140.cljs$lang$maxFixedArity = 3;
          G__57140.cljs$lang$applyTo = G__57140__4.cljs$lang$applyTo;
          G__57140.cljs$core$IFn$_invoke$arity$0 = G__57140__0;
          G__57140.cljs$core$IFn$_invoke$arity$1 = G__57140__1;
          G__57140.cljs$core$IFn$_invoke$arity$2 = G__57140__2;
          G__57140.cljs$core$IFn$_invoke$arity$3 = G__57140__3;
          G__57140.cljs$core$IFn$_invoke$arity$variadic = G__57140__4.cljs$core$IFn$_invoke$arity$variadic;
          return G__57140;
        }();
      }(fs__$1);
    };
    var G__57139 = function(f, g, h, var_args) {
      var fs = null;
      if (arguments.length > 3) {
        fs = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0);
      }
      return G__57139__delegate.call(this, f, g, h, fs);
    };
    G__57139.cljs$lang$maxFixedArity = 3;
    G__57139.cljs$lang$applyTo = function(arglist__57143) {
      var f = cljs.core.first(arglist__57143);
      arglist__57143 = cljs.core.next(arglist__57143);
      var g = cljs.core.first(arglist__57143);
      arglist__57143 = cljs.core.next(arglist__57143);
      var h = cljs.core.first(arglist__57143);
      var fs = cljs.core.rest(arglist__57143);
      return G__57139__delegate(f, g, h, fs);
    };
    G__57139.cljs$core$IFn$_invoke$arity$variadic = G__57139__delegate;
    return G__57139;
  }();
  juxt = function(f, g, h, var_args) {
    var fs = var_args;
    switch(arguments.length) {
      case 1:
        return juxt__1.call(this, f);
      case 2:
        return juxt__2.call(this, f, g);
      case 3:
        return juxt__3.call(this, f, g, h);
      default:
        return juxt__4.cljs$core$IFn$_invoke$arity$variadic(f, g, h, cljs.core.array_seq(arguments, 3));
    }
    throw new Error("Invalid arity: " + arguments.length);
  };
  juxt.cljs$lang$maxFixedArity = 3;
  juxt.cljs$lang$applyTo = juxt__4.cljs$lang$applyTo;
  juxt.cljs$core$IFn$_invoke$arity$1 = juxt__1;
  juxt.cljs$core$IFn$_invoke$arity$2 = juxt__2;
  juxt.cljs$core$IFn$_invoke$arity$3 = juxt__3;
  juxt.cljs$core$IFn$_invoke$arity$variadic = juxt__4.cljs$core$IFn$_invoke$arity$variadic;
  return juxt;
}();
cljs.core.dorun = function() {
  var dorun = null;
  var dorun__1 = function(coll) {
    while (true) {
      if (cljs.core.seq.call(null, coll)) {
        var G__57144 = cljs.core.next.call(null, coll);
        coll = G__57144;
        continue;
      } else {
        return null;
      }
      break;
    }
  };
  var dorun__2 = function(n, coll) {
    while (true) {
      if (cljs.core.seq.call(null, coll) && n > 0) {
        var G__57145 = n - 1;
        var G__57146 = cljs.core.next.call(null, coll);
        n = G__57145;
        coll = G__57146;
        continue;
      } else {
        return null;
      }
      break;
    }
  };
  dorun = function(n, coll) {
    switch(arguments.length) {
      case 1:
        return dorun__1.call(this, n);
      case 2:
        return dorun__2.call(this, n, coll);
    }
    throw new Error("Invalid arity: " + arguments.length);
  };
  dorun.cljs$core$IFn$_invoke$arity$1 = dorun__1;
  dorun.cljs$core$IFn$_invoke$arity$2 = dorun__2;
  return dorun;
}();
cljs.core.doall = function() {
  var doall = null;
  var doall__1 = function(coll) {
    cljs.core.dorun.call(null, coll);
    return coll;
  };
  var doall__2 = function(n, coll) {
    cljs.core.dorun.call(null, n, coll);
    return coll;
  };
  doall = function(n, coll) {
    switch(arguments.length) {
      case 1:
        return doall__1.call(this, n);
      case 2:
        return doall__2.call(this, n, coll);
    }
    throw new Error("Invalid arity: " + arguments.length);
  };
  doall.cljs$core$IFn$_invoke$arity$1 = doall__1;
  doall.cljs$core$IFn$_invoke$arity$2 = doall__2;
  return doall;
}();
cljs.core.regexp_QMARK_ = function regexp_QMARK_(o) {
  return o instanceof RegExp;
};
cljs.core.re_matches = function re_matches(re, s) {
  if (typeof s === "string") {
    var matches = re.exec(s);
    if (cljs.core._EQ_.call(null, cljs.core.first.call(null, matches), s)) {
      if (cljs.core.count.call(null, matches) === 1) {
        return cljs.core.first.call(null, matches);
      } else {
        return cljs.core.vec.call(null, matches);
      }
    } else {
      return null;
    }
  } else {
    throw new TypeError("re-matches must match against a string.");
  }
};
cljs.core.re_find = function re_find(re, s) {
  if (typeof s === "string") {
    var matches = re.exec(s);
    if (matches == null) {
      return null;
    } else {
      if (cljs.core.count.call(null, matches) === 1) {
        return cljs.core.first.call(null, matches);
      } else {
        return cljs.core.vec.call(null, matches);
      }
    }
  } else {
    throw new TypeError("re-find must match against a string.");
  }
};
cljs.core.re_seq = function re_seq(re, s) {
  var match_data = cljs.core.re_find.call(null, re, s);
  var match_idx = s.search(re);
  var match_str = cljs.core.coll_QMARK_.call(null, match_data) ? cljs.core.first.call(null, match_data) : match_data;
  var post_match = cljs.core.subs.call(null, s, match_idx + cljs.core.count.call(null, match_str));
  if (cljs.core.truth_(match_data)) {
    return new cljs.core.LazySeq(null, function(match_data, match_idx, match_str, post_match) {
      return function() {
        return cljs.core.cons.call(null, match_data, cljs.core.seq.call(null, post_match) ? re_seq.call(null, re, post_match) : null);
      };
    }(match_data, match_idx, match_str, post_match), null, null);
  } else {
    return null;
  }
};
cljs.core.re_pattern = function re_pattern(s) {
  var vec__57148 = cljs.core.re_find.call(null, /^(?:\(\?([idmsux]*)\))?(.*)/, s);
  var _ = cljs.core.nth.call(null, vec__57148, 0, null);
  var flags = cljs.core.nth.call(null, vec__57148, 1, null);
  var pattern = cljs.core.nth.call(null, vec__57148, 2, null);
  return new RegExp(pattern, flags);
};
cljs.core.pr_sequential_writer = function pr_sequential_writer(writer, print_one, begin, sep, end, opts, coll) {
  var _STAR_print_level_STAR_57150 = cljs.core._STAR_print_level_STAR_;
  try {
    cljs.core._STAR_print_level_STAR_ = cljs.core._STAR_print_level_STAR_ == null ? null : cljs.core._STAR_print_level_STAR_ - 1;
    if (!(cljs.core._STAR_print_level_STAR_ == null) && cljs.core._STAR_print_level_STAR_ < 0) {
      return cljs.core._write.call(null, writer, "#");
    } else {
      cljs.core._write.call(null, writer, begin);
      if (cljs.core.seq.call(null, coll)) {
        print_one.call(null, cljs.core.first.call(null, coll), writer, opts);
      } else {
      }
      var coll_57151__$1 = cljs.core.next.call(null, coll);
      var n_57152 = (new cljs.core.Keyword(null, "print-length", "print-length", 1931866356)).cljs$core$IFn$_invoke$arity$1(opts) - 1;
      while (true) {
        if (coll_57151__$1 && (n_57152 == null || !(n_57152 === 0))) {
          cljs.core._write.call(null, writer, sep);
          print_one.call(null, cljs.core.first.call(null, coll_57151__$1), writer, opts);
          var G__57153 = cljs.core.next.call(null, coll_57151__$1);
          var G__57154 = n_57152 - 1;
          coll_57151__$1 = G__57153;
          n_57152 = G__57154;
          continue;
        } else {
          if (cljs.core.seq.call(null, coll_57151__$1) && n_57152 === 0) {
            cljs.core._write.call(null, writer, sep);
            cljs.core._write.call(null, writer, "...");
          } else {
          }
        }
        break;
      }
      return cljs.core._write.call(null, writer, end);
    }
  } finally {
    cljs.core._STAR_print_level_STAR_ = _STAR_print_level_STAR_57150;
  }
};
cljs.core.write_all = function() {
  var write_all__delegate = function(writer, ss) {
    var seq__57159 = cljs.core.seq.call(null, ss);
    var chunk__57160 = null;
    var count__57161 = 0;
    var i__57162 = 0;
    while (true) {
      if (i__57162 < count__57161) {
        var s = cljs.core._nth.call(null, chunk__57160, i__57162);
        cljs.core._write.call(null, writer, s);
        var G__57163 = seq__57159;
        var G__57164 = chunk__57160;
        var G__57165 = count__57161;
        var G__57166 = i__57162 + 1;
        seq__57159 = G__57163;
        chunk__57160 = G__57164;
        count__57161 = G__57165;
        i__57162 = G__57166;
        continue;
      } else {
        var temp__4126__auto__ = cljs.core.seq.call(null, seq__57159);
        if (temp__4126__auto__) {
          var seq__57159__$1 = temp__4126__auto__;
          if (cljs.core.chunked_seq_QMARK_.call(null, seq__57159__$1)) {
            var c__4408__auto__ = cljs.core.chunk_first.call(null, seq__57159__$1);
            var G__57167 = cljs.core.chunk_rest.call(null, seq__57159__$1);
            var G__57168 = c__4408__auto__;
            var G__57169 = cljs.core.count.call(null, c__4408__auto__);
            var G__57170 = 0;
            seq__57159 = G__57167;
            chunk__57160 = G__57168;
            count__57161 = G__57169;
            i__57162 = G__57170;
            continue;
          } else {
            var s = cljs.core.first.call(null, seq__57159__$1);
            cljs.core._write.call(null, writer, s);
            var G__57171 = cljs.core.next.call(null, seq__57159__$1);
            var G__57172 = null;
            var G__57173 = 0;
            var G__57174 = 0;
            seq__57159 = G__57171;
            chunk__57160 = G__57172;
            count__57161 = G__57173;
            i__57162 = G__57174;
            continue;
          }
        } else {
          return null;
        }
      }
      break;
    }
  };
  var write_all = function(writer, var_args) {
    var ss = null;
    if (arguments.length > 1) {
      ss = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0);
    }
    return write_all__delegate.call(this, writer, ss);
  };
  write_all.cljs$lang$maxFixedArity = 1;
  write_all.cljs$lang$applyTo = function(arglist__57175) {
    var writer = cljs.core.first(arglist__57175);
    var ss = cljs.core.rest(arglist__57175);
    return write_all__delegate(writer, ss);
  };
  write_all.cljs$core$IFn$_invoke$arity$variadic = write_all__delegate;
  return write_all;
}();
cljs.core.string_print = function string_print(x) {
  cljs.core._STAR_print_fn_STAR_.call(null, x);
  return null;
};
cljs.core.flush = function flush() {
  return null;
};
cljs.core.char_escapes = function() {
  var obj57177 = {'"':'\\"', "\\":"\\\\", "\b":"\\b", "\f":"\\f", "\n":"\\n", "\r":"\\r", "\t":"\\t"};
  return obj57177;
}();
cljs.core.quote_string = function quote_string(s) {
  return'"' + cljs.core.str.cljs$core$IFn$_invoke$arity$1(s.replace(RegExp('[\\\\"\b\f\n\r\t]', "g"), function(match) {
    return cljs.core.char_escapes[match];
  })) + '"';
};
cljs.core.pr_writer = function pr_writer(obj, writer, opts) {
  if (obj == null) {
    return cljs.core._write.call(null, writer, "nil");
  } else {
    if (void 0 === obj) {
      return cljs.core._write.call(null, writer, "#\x3cundefined\x3e");
    } else {
      if (cljs.core.truth_(function() {
        var and__3627__auto__ = cljs.core.get.call(null, opts, new cljs.core.Keyword(null, "meta", "meta", 1499536964));
        if (cljs.core.truth_(and__3627__auto__)) {
          var and__3627__auto____$1 = function() {
            var G__57183 = obj;
            if (G__57183) {
              var bit__4302__auto__ = G__57183.cljs$lang$protocol_mask$partition0$ & 131072;
              if (bit__4302__auto__ || G__57183.cljs$core$IMeta$) {
                return true;
              } else {
                if (!G__57183.cljs$lang$protocol_mask$partition0$) {
                  return cljs.core.native_satisfies_QMARK_.call(null, cljs.core.IMeta, G__57183);
                } else {
                  return false;
                }
              }
            } else {
              return cljs.core.native_satisfies_QMARK_.call(null, cljs.core.IMeta, G__57183);
            }
          }();
          if (and__3627__auto____$1) {
            return cljs.core.meta.call(null, obj);
          } else {
            return and__3627__auto____$1;
          }
        } else {
          return and__3627__auto__;
        }
      }())) {
        cljs.core._write.call(null, writer, "^");
        pr_writer.call(null, cljs.core.meta.call(null, obj), writer, opts);
        cljs.core._write.call(null, writer, " ");
      } else {
      }
      if (obj == null) {
        return cljs.core._write.call(null, writer, "nil");
      } else {
        if (obj.cljs$lang$type) {
          return obj.cljs$lang$ctorPrWriter(obj, writer, opts);
        } else {
          if (function() {
            var G__57184 = obj;
            if (G__57184) {
              var bit__4295__auto__ = G__57184.cljs$lang$protocol_mask$partition0$ & 2147483648;
              if (bit__4295__auto__ || G__57184.cljs$core$IPrintWithWriter$) {
                return true;
              } else {
                return false;
              }
            } else {
              return false;
            }
          }()) {
            return cljs.core._pr_writer.call(null, obj, writer, opts);
          } else {
            if (cljs.core.type.call(null, obj) === Boolean || typeof obj === "number") {
              return cljs.core._write.call(null, writer, "" + cljs.core.str.cljs$core$IFn$_invoke$arity$1(obj));
            } else {
              if (cljs.core.object_QMARK_.call(null, obj)) {
                cljs.core._write.call(null, writer, "#js ");
                return cljs.core.print_map.call(null, cljs.core.map.call(null, function(k) {
                  return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.keyword.call(null, k), obj[k]], null);
                }, cljs.core.js_keys.call(null, obj)), pr_writer, writer, opts);
              } else {
                if (obj instanceof Array) {
                  return cljs.core.pr_sequential_writer.call(null, writer, pr_writer, "#js [", " ", "]", opts, obj);
                } else {
                  if (goog.isString(obj)) {
                    if (cljs.core.truth_((new cljs.core.Keyword(null, "readably", "readably", 1129599760)).cljs$core$IFn$_invoke$arity$1(opts))) {
                      return cljs.core._write.call(null, writer, cljs.core.quote_string.call(null, obj));
                    } else {
                      return cljs.core._write.call(null, writer, obj);
                    }
                  } else {
                    if (cljs.core.fn_QMARK_.call(null, obj)) {
                      return cljs.core.write_all.call(null, writer, "#\x3c", "" + cljs.core.str.cljs$core$IFn$_invoke$arity$1(obj), "\x3e");
                    } else {
                      if (obj instanceof Date) {
                        var normalize = function(n, len) {
                          var ns = "" + cljs.core.str.cljs$core$IFn$_invoke$arity$1(n);
                          while (true) {
                            if (cljs.core.count.call(null, ns) < len) {
                              var G__57186 = "0" + cljs.core.str.cljs$core$IFn$_invoke$arity$1(ns);
                              ns = G__57186;
                              continue;
                            } else {
                              return ns;
                            }
                            break;
                          }
                        };
                        return cljs.core.write_all.call(null, writer, '#inst "', "" + cljs.core.str.cljs$core$IFn$_invoke$arity$1(obj.getUTCFullYear()), "-", normalize.call(null, obj.getUTCMonth() + 1, 2), "-", normalize.call(null, obj.getUTCDate(), 2), "T", normalize.call(null, obj.getUTCHours(), 2), ":", normalize.call(null, obj.getUTCMinutes(), 2), ":", normalize.call(null, obj.getUTCSeconds(), 2), ".", normalize.call(null, obj.getUTCMilliseconds(), 3), "-", '00:00"');
                      } else {
                        if (cljs.core.regexp_QMARK_.call(null, obj)) {
                          return cljs.core.write_all.call(null, writer, '#"', obj.source, '"');
                        } else {
                          if (function() {
                            var G__57185 = obj;
                            if (G__57185) {
                              var bit__4302__auto__ = G__57185.cljs$lang$protocol_mask$partition0$ & 2147483648;
                              if (bit__4302__auto__ || G__57185.cljs$core$IPrintWithWriter$) {
                                return true;
                              } else {
                                if (!G__57185.cljs$lang$protocol_mask$partition0$) {
                                  return cljs.core.native_satisfies_QMARK_.call(null, cljs.core.IPrintWithWriter, G__57185);
                                } else {
                                  return false;
                                }
                              }
                            } else {
                              return cljs.core.native_satisfies_QMARK_.call(null, cljs.core.IPrintWithWriter, G__57185);
                            }
                          }()) {
                            return cljs.core._pr_writer.call(null, obj, writer, opts);
                          } else {
                            return cljs.core.write_all.call(null, writer, "#\x3c", "" + cljs.core.str.cljs$core$IFn$_invoke$arity$1(obj), "\x3e");
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
};
cljs.core.pr_seq_writer = function pr_seq_writer(objs, writer, opts) {
  cljs.core.pr_writer.call(null, cljs.core.first.call(null, objs), writer, opts);
  var seq__57191 = cljs.core.seq.call(null, cljs.core.next.call(null, objs));
  var chunk__57192 = null;
  var count__57193 = 0;
  var i__57194 = 0;
  while (true) {
    if (i__57194 < count__57193) {
      var obj = cljs.core._nth.call(null, chunk__57192, i__57194);
      cljs.core._write.call(null, writer, " ");
      cljs.core.pr_writer.call(null, obj, writer, opts);
      var G__57195 = seq__57191;
      var G__57196 = chunk__57192;
      var G__57197 = count__57193;
      var G__57198 = i__57194 + 1;
      seq__57191 = G__57195;
      chunk__57192 = G__57196;
      count__57193 = G__57197;
      i__57194 = G__57198;
      continue;
    } else {
      var temp__4126__auto__ = cljs.core.seq.call(null, seq__57191);
      if (temp__4126__auto__) {
        var seq__57191__$1 = temp__4126__auto__;
        if (cljs.core.chunked_seq_QMARK_.call(null, seq__57191__$1)) {
          var c__4408__auto__ = cljs.core.chunk_first.call(null, seq__57191__$1);
          var G__57199 = cljs.core.chunk_rest.call(null, seq__57191__$1);
          var G__57200 = c__4408__auto__;
          var G__57201 = cljs.core.count.call(null, c__4408__auto__);
          var G__57202 = 0;
          seq__57191 = G__57199;
          chunk__57192 = G__57200;
          count__57193 = G__57201;
          i__57194 = G__57202;
          continue;
        } else {
          var obj = cljs.core.first.call(null, seq__57191__$1);
          cljs.core._write.call(null, writer, " ");
          cljs.core.pr_writer.call(null, obj, writer, opts);
          var G__57203 = cljs.core.next.call(null, seq__57191__$1);
          var G__57204 = null;
          var G__57205 = 0;
          var G__57206 = 0;
          seq__57191 = G__57203;
          chunk__57192 = G__57204;
          count__57193 = G__57205;
          i__57194 = G__57206;
          continue;
        }
      } else {
        return null;
      }
    }
    break;
  }
};
cljs.core.pr_sb_with_opts = function pr_sb_with_opts(objs, opts) {
  var sb = new goog.string.StringBuffer;
  var writer = new cljs.core.StringBufferWriter(sb);
  cljs.core.pr_seq_writer.call(null, objs, writer, opts);
  cljs.core._flush.call(null, writer);
  return sb;
};
cljs.core.pr_str_with_opts = function pr_str_with_opts(objs, opts) {
  if (cljs.core.empty_QMARK_.call(null, objs)) {
    return "";
  } else {
    return "" + cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs.core.pr_sb_with_opts.call(null, objs, opts));
  }
};
cljs.core.prn_str_with_opts = function prn_str_with_opts(objs, opts) {
  if (cljs.core.empty_QMARK_.call(null, objs)) {
    return "\n";
  } else {
    var sb = cljs.core.pr_sb_with_opts.call(null, objs, opts);
    sb.append("\n");
    return "" + cljs.core.str.cljs$core$IFn$_invoke$arity$1(sb);
  }
};
cljs.core.pr_with_opts = function pr_with_opts(objs, opts) {
  return cljs.core.string_print.call(null, cljs.core.pr_str_with_opts.call(null, objs, opts));
};
cljs.core.newline = function newline(opts) {
  cljs.core.string_print.call(null, "\n");
  if (cljs.core.truth_(cljs.core.get.call(null, opts, new cljs.core.Keyword(null, "flush-on-newline", "flush-on-newline", -151457939)))) {
    return cljs.core.flush.call(null);
  } else {
    return null;
  }
};
cljs.core.pr_str = function() {
  var pr_str__delegate = function(objs) {
    return cljs.core.pr_str_with_opts.call(null, objs, cljs.core.pr_opts.call(null));
  };
  var pr_str = function(var_args) {
    var objs = null;
    if (arguments.length > 0) {
      objs = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0);
    }
    return pr_str__delegate.call(this, objs);
  };
  pr_str.cljs$lang$maxFixedArity = 0;
  pr_str.cljs$lang$applyTo = function(arglist__57207) {
    var objs = cljs.core.seq(arglist__57207);
    return pr_str__delegate(objs);
  };
  pr_str.cljs$core$IFn$_invoke$arity$variadic = pr_str__delegate;
  return pr_str;
}();
cljs.core.prn_str = function() {
  var prn_str__delegate = function(objs) {
    return cljs.core.prn_str_with_opts.call(null, objs, cljs.core.pr_opts.call(null));
  };
  var prn_str = function(var_args) {
    var objs = null;
    if (arguments.length > 0) {
      objs = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0);
    }
    return prn_str__delegate.call(this, objs);
  };
  prn_str.cljs$lang$maxFixedArity = 0;
  prn_str.cljs$lang$applyTo = function(arglist__57208) {
    var objs = cljs.core.seq(arglist__57208);
    return prn_str__delegate(objs);
  };
  prn_str.cljs$core$IFn$_invoke$arity$variadic = prn_str__delegate;
  return prn_str;
}();
cljs.core.pr = function() {
  var pr__delegate = function(objs) {
    return cljs.core.pr_with_opts.call(null, objs, cljs.core.pr_opts.call(null));
  };
  var pr = function(var_args) {
    var objs = null;
    if (arguments.length > 0) {
      objs = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0);
    }
    return pr__delegate.call(this, objs);
  };
  pr.cljs$lang$maxFixedArity = 0;
  pr.cljs$lang$applyTo = function(arglist__57209) {
    var objs = cljs.core.seq(arglist__57209);
    return pr__delegate(objs);
  };
  pr.cljs$core$IFn$_invoke$arity$variadic = pr__delegate;
  return pr;
}();
cljs.core.print = function() {
  var cljs_core_print__delegate = function(objs) {
    return cljs.core.pr_with_opts.call(null, objs, cljs.core.assoc.call(null, cljs.core.pr_opts.call(null), new cljs.core.Keyword(null, "readably", "readably", 1129599760), false));
  };
  var cljs_core_print = function(var_args) {
    var objs = null;
    if (arguments.length > 0) {
      objs = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0);
    }
    return cljs_core_print__delegate.call(this, objs);
  };
  cljs_core_print.cljs$lang$maxFixedArity = 0;
  cljs_core_print.cljs$lang$applyTo = function(arglist__57210) {
    var objs = cljs.core.seq(arglist__57210);
    return cljs_core_print__delegate(objs);
  };
  cljs_core_print.cljs$core$IFn$_invoke$arity$variadic = cljs_core_print__delegate;
  return cljs_core_print;
}();
cljs.core.print_str = function() {
  var print_str__delegate = function(objs) {
    return cljs.core.pr_str_with_opts.call(null, objs, cljs.core.assoc.call(null, cljs.core.pr_opts.call(null), new cljs.core.Keyword(null, "readably", "readably", 1129599760), false));
  };
  var print_str = function(var_args) {
    var objs = null;
    if (arguments.length > 0) {
      objs = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0);
    }
    return print_str__delegate.call(this, objs);
  };
  print_str.cljs$lang$maxFixedArity = 0;
  print_str.cljs$lang$applyTo = function(arglist__57211) {
    var objs = cljs.core.seq(arglist__57211);
    return print_str__delegate(objs);
  };
  print_str.cljs$core$IFn$_invoke$arity$variadic = print_str__delegate;
  return print_str;
}();
cljs.core.println = function() {
  var println__delegate = function(objs) {
    cljs.core.pr_with_opts.call(null, objs, cljs.core.assoc.call(null, cljs.core.pr_opts.call(null), new cljs.core.Keyword(null, "readably", "readably", 1129599760), false));
    if (cljs.core.truth_(cljs.core._STAR_print_newline_STAR_)) {
      return cljs.core.newline.call(null, cljs.core.pr_opts.call(null));
    } else {
      return null;
    }
  };
  var println = function(var_args) {
    var objs = null;
    if (arguments.length > 0) {
      objs = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0);
    }
    return println__delegate.call(this, objs);
  };
  println.cljs$lang$maxFixedArity = 0;
  println.cljs$lang$applyTo = function(arglist__57212) {
    var objs = cljs.core.seq(arglist__57212);
    return println__delegate(objs);
  };
  println.cljs$core$IFn$_invoke$arity$variadic = println__delegate;
  return println;
}();
cljs.core.println_str = function() {
  var println_str__delegate = function(objs) {
    return cljs.core.prn_str_with_opts.call(null, objs, cljs.core.assoc.call(null, cljs.core.pr_opts.call(null), new cljs.core.Keyword(null, "readably", "readably", 1129599760), false));
  };
  var println_str = function(var_args) {
    var objs = null;
    if (arguments.length > 0) {
      objs = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0);
    }
    return println_str__delegate.call(this, objs);
  };
  println_str.cljs$lang$maxFixedArity = 0;
  println_str.cljs$lang$applyTo = function(arglist__57213) {
    var objs = cljs.core.seq(arglist__57213);
    return println_str__delegate(objs);
  };
  println_str.cljs$core$IFn$_invoke$arity$variadic = println_str__delegate;
  return println_str;
}();
cljs.core.prn = function() {
  var prn__delegate = function(objs) {
    cljs.core.pr_with_opts.call(null, objs, cljs.core.pr_opts.call(null));
    if (cljs.core.truth_(cljs.core._STAR_print_newline_STAR_)) {
      return cljs.core.newline.call(null, cljs.core.pr_opts.call(null));
    } else {
      return null;
    }
  };
  var prn = function(var_args) {
    var objs = null;
    if (arguments.length > 0) {
      objs = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0);
    }
    return prn__delegate.call(this, objs);
  };
  prn.cljs$lang$maxFixedArity = 0;
  prn.cljs$lang$applyTo = function(arglist__57214) {
    var objs = cljs.core.seq(arglist__57214);
    return prn__delegate(objs);
  };
  prn.cljs$core$IFn$_invoke$arity$variadic = prn__delegate;
  return prn;
}();
cljs.core.print_map = function print_map(m, print_one, writer, opts) {
  return cljs.core.pr_sequential_writer.call(null, writer, function(e, w, opts__$1) {
    print_one.call(null, cljs.core.key.call(null, e), w, opts__$1);
    cljs.core._write.call(null, w, " ");
    return print_one.call(null, cljs.core.val.call(null, e), w, opts__$1);
  }, "{", ", ", "}", opts, cljs.core.seq.call(null, m));
};
cljs.core.IndexedSeq.prototype.cljs$core$IPrintWithWriter$ = true;
cljs.core.IndexedSeq.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(coll, writer, opts) {
  var coll__$1 = this;
  return cljs.core.pr_sequential_writer.call(null, writer, cljs.core.pr_writer, "(", " ", ")", opts, coll__$1);
};
cljs.core.LazySeq.prototype.cljs$core$IPrintWithWriter$ = true;
cljs.core.LazySeq.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(coll, writer, opts) {
  var coll__$1 = this;
  return cljs.core.pr_sequential_writer.call(null, writer, cljs.core.pr_writer, "(", " ", ")", opts, coll__$1);
};
cljs.core.PersistentTreeMapSeq.prototype.cljs$core$IPrintWithWriter$ = true;
cljs.core.PersistentTreeMapSeq.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(coll, writer, opts) {
  var coll__$1 = this;
  return cljs.core.pr_sequential_writer.call(null, writer, cljs.core.pr_writer, "(", " ", ")", opts, coll__$1);
};
cljs.core.NodeSeq.prototype.cljs$core$IPrintWithWriter$ = true;
cljs.core.NodeSeq.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(coll, writer, opts) {
  var coll__$1 = this;
  return cljs.core.pr_sequential_writer.call(null, writer, cljs.core.pr_writer, "(", " ", ")", opts, coll__$1);
};
cljs.core.BlackNode.prototype.cljs$core$IPrintWithWriter$ = true;
cljs.core.BlackNode.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(coll, writer, opts) {
  var coll__$1 = this;
  return cljs.core.pr_sequential_writer.call(null, writer, cljs.core.pr_writer, "[", " ", "]", opts, coll__$1);
};
cljs.core.PersistentArrayMapSeq.prototype.cljs$core$IPrintWithWriter$ = true;
cljs.core.PersistentArrayMapSeq.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(coll, writer, opts) {
  var coll__$1 = this;
  return cljs.core.pr_sequential_writer.call(null, writer, cljs.core.pr_writer, "(", " ", ")", opts, coll__$1);
};
cljs.core.PersistentTreeSet.prototype.cljs$core$IPrintWithWriter$ = true;
cljs.core.PersistentTreeSet.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(coll, writer, opts) {
  var coll__$1 = this;
  return cljs.core.pr_sequential_writer.call(null, writer, cljs.core.pr_writer, "#{", " ", "}", opts, coll__$1);
};
cljs.core.ChunkedSeq.prototype.cljs$core$IPrintWithWriter$ = true;
cljs.core.ChunkedSeq.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(coll, writer, opts) {
  var coll__$1 = this;
  return cljs.core.pr_sequential_writer.call(null, writer, cljs.core.pr_writer, "(", " ", ")", opts, coll__$1);
};
cljs.core.ObjMap.prototype.cljs$core$IPrintWithWriter$ = true;
cljs.core.ObjMap.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(coll, writer, opts) {
  var coll__$1 = this;
  return cljs.core.print_map.call(null, coll__$1, cljs.core.pr_writer, writer, opts);
};
cljs.core.Cons.prototype.cljs$core$IPrintWithWriter$ = true;
cljs.core.Cons.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(coll, writer, opts) {
  var coll__$1 = this;
  return cljs.core.pr_sequential_writer.call(null, writer, cljs.core.pr_writer, "(", " ", ")", opts, coll__$1);
};
cljs.core.RSeq.prototype.cljs$core$IPrintWithWriter$ = true;
cljs.core.RSeq.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(coll, writer, opts) {
  var coll__$1 = this;
  return cljs.core.pr_sequential_writer.call(null, writer, cljs.core.pr_writer, "(", " ", ")", opts, coll__$1);
};
cljs.core.PersistentHashMap.prototype.cljs$core$IPrintWithWriter$ = true;
cljs.core.PersistentHashMap.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(coll, writer, opts) {
  var coll__$1 = this;
  return cljs.core.print_map.call(null, coll__$1, cljs.core.pr_writer, writer, opts);
};
cljs.core.ArrayNodeSeq.prototype.cljs$core$IPrintWithWriter$ = true;
cljs.core.ArrayNodeSeq.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(coll, writer, opts) {
  var coll__$1 = this;
  return cljs.core.pr_sequential_writer.call(null, writer, cljs.core.pr_writer, "(", " ", ")", opts, coll__$1);
};
cljs.core.Subvec.prototype.cljs$core$IPrintWithWriter$ = true;
cljs.core.Subvec.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(coll, writer, opts) {
  var coll__$1 = this;
  return cljs.core.pr_sequential_writer.call(null, writer, cljs.core.pr_writer, "[", " ", "]", opts, coll__$1);
};
cljs.core.PersistentTreeMap.prototype.cljs$core$IPrintWithWriter$ = true;
cljs.core.PersistentTreeMap.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(coll, writer, opts) {
  var coll__$1 = this;
  return cljs.core.print_map.call(null, coll__$1, cljs.core.pr_writer, writer, opts);
};
cljs.core.PersistentHashSet.prototype.cljs$core$IPrintWithWriter$ = true;
cljs.core.PersistentHashSet.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(coll, writer, opts) {
  var coll__$1 = this;
  return cljs.core.pr_sequential_writer.call(null, writer, cljs.core.pr_writer, "#{", " ", "}", opts, coll__$1);
};
cljs.core.ChunkedCons.prototype.cljs$core$IPrintWithWriter$ = true;
cljs.core.ChunkedCons.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(coll, writer, opts) {
  var coll__$1 = this;
  return cljs.core.pr_sequential_writer.call(null, writer, cljs.core.pr_writer, "(", " ", ")", opts, coll__$1);
};
cljs.core.Atom.prototype.cljs$core$IPrintWithWriter$ = true;
cljs.core.Atom.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(a, writer, opts) {
  var a__$1 = this;
  cljs.core._write.call(null, writer, "#\x3cAtom: ");
  cljs.core.pr_writer.call(null, a__$1.state, writer, opts);
  return cljs.core._write.call(null, writer, "\x3e");
};
cljs.core.ValSeq.prototype.cljs$core$IPrintWithWriter$ = true;
cljs.core.ValSeq.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(coll, writer, opts) {
  var coll__$1 = this;
  return cljs.core.pr_sequential_writer.call(null, writer, cljs.core.pr_writer, "(", " ", ")", opts, coll__$1);
};
cljs.core.RedNode.prototype.cljs$core$IPrintWithWriter$ = true;
cljs.core.RedNode.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(coll, writer, opts) {
  var coll__$1 = this;
  return cljs.core.pr_sequential_writer.call(null, writer, cljs.core.pr_writer, "[", " ", "]", opts, coll__$1);
};
cljs.core.PersistentVector.prototype.cljs$core$IPrintWithWriter$ = true;
cljs.core.PersistentVector.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(coll, writer, opts) {
  var coll__$1 = this;
  return cljs.core.pr_sequential_writer.call(null, writer, cljs.core.pr_writer, "[", " ", "]", opts, coll__$1);
};
cljs.core.PersistentQueueSeq.prototype.cljs$core$IPrintWithWriter$ = true;
cljs.core.PersistentQueueSeq.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(coll, writer, opts) {
  var coll__$1 = this;
  return cljs.core.pr_sequential_writer.call(null, writer, cljs.core.pr_writer, "(", " ", ")", opts, coll__$1);
};
cljs.core.EmptyList.prototype.cljs$core$IPrintWithWriter$ = true;
cljs.core.EmptyList.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(coll, writer, opts) {
  var coll__$1 = this;
  return cljs.core._write.call(null, writer, "()");
};
cljs.core.LazyTransformer.prototype.cljs$core$IPrintWithWriter$ = true;
cljs.core.LazyTransformer.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(coll, writer, opts) {
  var coll__$1 = this;
  return cljs.core.pr_sequential_writer.call(null, writer, cljs.core.pr_writer, "(", " ", ")", opts, coll__$1);
};
cljs.core.PersistentQueue.prototype.cljs$core$IPrintWithWriter$ = true;
cljs.core.PersistentQueue.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(coll, writer, opts) {
  var coll__$1 = this;
  return cljs.core.pr_sequential_writer.call(null, writer, cljs.core.pr_writer, "#queue [", " ", "]", opts, cljs.core.seq.call(null, coll__$1));
};
cljs.core.PersistentArrayMap.prototype.cljs$core$IPrintWithWriter$ = true;
cljs.core.PersistentArrayMap.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(coll, writer, opts) {
  var coll__$1 = this;
  return cljs.core.print_map.call(null, coll__$1, cljs.core.pr_writer, writer, opts);
};
cljs.core.Range.prototype.cljs$core$IPrintWithWriter$ = true;
cljs.core.Range.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(coll, writer, opts) {
  var coll__$1 = this;
  return cljs.core.pr_sequential_writer.call(null, writer, cljs.core.pr_writer, "(", " ", ")", opts, coll__$1);
};
cljs.core.KeySeq.prototype.cljs$core$IPrintWithWriter$ = true;
cljs.core.KeySeq.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(coll, writer, opts) {
  var coll__$1 = this;
  return cljs.core.pr_sequential_writer.call(null, writer, cljs.core.pr_writer, "(", " ", ")", opts, coll__$1);
};
cljs.core.List.prototype.cljs$core$IPrintWithWriter$ = true;
cljs.core.List.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(coll, writer, opts) {
  var coll__$1 = this;
  return cljs.core.pr_sequential_writer.call(null, writer, cljs.core.pr_writer, "(", " ", ")", opts, coll__$1);
};
cljs.core.PersistentVector.prototype.cljs$core$IComparable$ = true;
cljs.core.PersistentVector.prototype.cljs$core$IComparable$_compare$arity$2 = function(x, y) {
  var x__$1 = this;
  return cljs.core.compare_indexed.call(null, x__$1, y);
};
cljs.core.Subvec.prototype.cljs$core$IComparable$ = true;
cljs.core.Subvec.prototype.cljs$core$IComparable$_compare$arity$2 = function(x, y) {
  var x__$1 = this;
  return cljs.core.compare_indexed.call(null, x__$1, y);
};
cljs.core.Keyword.prototype.cljs$core$IComparable$ = true;
cljs.core.Keyword.prototype.cljs$core$IComparable$_compare$arity$2 = function(x, y) {
  var x__$1 = this;
  return cljs.core.compare_symbols.call(null, x__$1, y);
};
cljs.core.Symbol.prototype.cljs$core$IComparable$ = true;
cljs.core.Symbol.prototype.cljs$core$IComparable$_compare$arity$2 = function(x, y) {
  var x__$1 = this;
  return cljs.core.compare_symbols.call(null, x__$1, y);
};
cljs.core.alter_meta_BANG_ = function() {
  var alter_meta_BANG___delegate = function(iref, f, args) {
    return iref.meta = cljs.core.apply.call(null, f, iref.meta, args);
  };
  var alter_meta_BANG_ = function(iref, f, var_args) {
    var args = null;
    if (arguments.length > 2) {
      args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0);
    }
    return alter_meta_BANG___delegate.call(this, iref, f, args);
  };
  alter_meta_BANG_.cljs$lang$maxFixedArity = 2;
  alter_meta_BANG_.cljs$lang$applyTo = function(arglist__57215) {
    var iref = cljs.core.first(arglist__57215);
    arglist__57215 = cljs.core.next(arglist__57215);
    var f = cljs.core.first(arglist__57215);
    var args = cljs.core.rest(arglist__57215);
    return alter_meta_BANG___delegate(iref, f, args);
  };
  alter_meta_BANG_.cljs$core$IFn$_invoke$arity$variadic = alter_meta_BANG___delegate;
  return alter_meta_BANG_;
}();
cljs.core.reset_meta_BANG_ = function reset_meta_BANG_(iref, m) {
  return iref.meta = m;
};
cljs.core.add_watch = function add_watch(iref, key, f) {
  return cljs.core._add_watch.call(null, iref, key, f);
};
cljs.core.remove_watch = function remove_watch(iref, key) {
  return cljs.core._remove_watch.call(null, iref, key);
};
cljs.core.gensym_counter = null;
cljs.core.gensym = function() {
  var gensym = null;
  var gensym__0 = function() {
    return gensym.call(null, "G__");
  };
  var gensym__1 = function(prefix_string) {
    if (cljs.core.gensym_counter == null) {
      cljs.core.gensym_counter = cljs.core.atom.call(null, 0);
    } else {
    }
    return cljs.core.symbol.call(null, "" + cljs.core.str.cljs$core$IFn$_invoke$arity$1(prefix_string) + cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs.core.swap_BANG_.call(null, cljs.core.gensym_counter, cljs.core.inc)));
  };
  gensym = function(prefix_string) {
    switch(arguments.length) {
      case 0:
        return gensym__0.call(this);
      case 1:
        return gensym__1.call(this, prefix_string);
    }
    throw new Error("Invalid arity: " + arguments.length);
  };
  gensym.cljs$core$IFn$_invoke$arity$0 = gensym__0;
  gensym.cljs$core$IFn$_invoke$arity$1 = gensym__1;
  return gensym;
}();
cljs.core.fixture1 = 1;
cljs.core.fixture2 = 2;
cljs.core.Delay = function(f, value) {
  this.f = f;
  this.value = value;
  this.cljs$lang$protocol_mask$partition1$ = 1;
  this.cljs$lang$protocol_mask$partition0$ = 32768;
};
cljs.core.Delay.cljs$lang$type = true;
cljs.core.Delay.cljs$lang$ctorStr = "cljs.core/Delay";
cljs.core.Delay.cljs$lang$ctorPrWriter = function(this__4215__auto__, writer__4216__auto__, opt__4217__auto__) {
  return cljs.core._write.call(null, writer__4216__auto__, "cljs.core/Delay");
};
cljs.core.Delay.prototype.cljs$core$IPending$_realized_QMARK_$arity$1 = function(d) {
  var self__ = this;
  var d__$1 = this;
  return cljs.core.not.call(null, self__.f);
};
cljs.core.Delay.prototype.cljs$core$IDeref$_deref$arity$1 = function(_) {
  var self__ = this;
  var ___$1 = this;
  if (cljs.core.truth_(self__.f)) {
    self__.value = self__.f.call(null);
    self__.f = null;
  } else {
  }
  return self__.value;
};
cljs.core.__GT_Delay = function __GT_Delay(f, value) {
  return new cljs.core.Delay(f, value);
};
cljs.core.delay_QMARK_ = function delay_QMARK_(x) {
  return x instanceof cljs.core.Delay;
};
cljs.core.force = function force(x) {
  if (cljs.core.delay_QMARK_.call(null, x)) {
    return cljs.core.deref.call(null, x);
  } else {
    return x;
  }
};
cljs.core.realized_QMARK_ = function realized_QMARK_(d) {
  return cljs.core._realized_QMARK_.call(null, d);
};
cljs.core.preserving_reduced = function preserving_reduced(f1) {
  return function(p1__57216_SHARP_, p2__57217_SHARP_) {
    var ret = f1.call(null, p1__57216_SHARP_, p2__57217_SHARP_);
    if (cljs.core.reduced_QMARK_.call(null, ret)) {
      return cljs.core.reduced.call(null, ret);
    } else {
      return ret;
    }
  };
};
cljs.core.cat = function cat(f1) {
  var rf1 = cljs.core.preserving_reduced.call(null, f1);
  return function(rf1) {
    return function() {
      var G__57218 = null;
      var G__57218__0 = function() {
        return f1.call(null);
      };
      var G__57218__1 = function(result) {
        return f1.call(null, result);
      };
      var G__57218__2 = function(result, input) {
        return cljs.core.reduce.call(null, rf1, result, input);
      };
      G__57218 = function(result, input) {
        switch(arguments.length) {
          case 0:
            return G__57218__0.call(this);
          case 1:
            return G__57218__1.call(this, result);
          case 2:
            return G__57218__2.call(this, result, input);
        }
        throw new Error("Invalid arity: " + arguments.length);
      };
      G__57218.cljs$core$IFn$_invoke$arity$0 = G__57218__0;
      G__57218.cljs$core$IFn$_invoke$arity$1 = G__57218__1;
      G__57218.cljs$core$IFn$_invoke$arity$2 = G__57218__2;
      return G__57218;
    }();
  }(rf1);
};
cljs.core.dedupe = function() {
  var dedupe = null;
  var dedupe__0 = function() {
    return function(f1) {
      var pa = cljs.core.atom.call(null, new cljs.core.Keyword("cljs.core", "none", "cljs.core/none", 926646439));
      return function(pa) {
        return function() {
          var G__57219 = null;
          var G__57219__0 = function() {
            return f1.call(null);
          };
          var G__57219__1 = function(result) {
            return f1.call(null, result);
          };
          var G__57219__2 = function(result, input) {
            var prior = cljs.core.deref.call(null, pa);
            cljs.core.reset_BANG_.call(null, pa, input);
            if (cljs.core._EQ_.call(null, prior, input)) {
              return result;
            } else {
              return f1.call(null, result, input);
            }
          };
          G__57219 = function(result, input) {
            switch(arguments.length) {
              case 0:
                return G__57219__0.call(this);
              case 1:
                return G__57219__1.call(this, result);
              case 2:
                return G__57219__2.call(this, result, input);
            }
            throw new Error("Invalid arity: " + arguments.length);
          };
          G__57219.cljs$core$IFn$_invoke$arity$0 = G__57219__0;
          G__57219.cljs$core$IFn$_invoke$arity$1 = G__57219__1;
          G__57219.cljs$core$IFn$_invoke$arity$2 = G__57219__2;
          return G__57219;
        }();
      }(pa);
    };
  };
  var dedupe__1 = function(coll) {
    return cljs.core.sequence.call(null, dedupe.call(null), coll);
  };
  dedupe = function(coll) {
    switch(arguments.length) {
      case 0:
        return dedupe__0.call(this);
      case 1:
        return dedupe__1.call(this, coll);
    }
    throw new Error("Invalid arity: " + arguments.length);
  };
  dedupe.cljs$core$IFn$_invoke$arity$0 = dedupe__0;
  dedupe.cljs$core$IFn$_invoke$arity$1 = dedupe__1;
  return dedupe;
}();
cljs.core.random_sample = function() {
  var random_sample = null;
  var random_sample__1 = function(prob) {
    return cljs.core.filter.call(null, function(_) {
      return cljs.core.rand.call(null) < prob;
    });
  };
  var random_sample__2 = function(prob, coll) {
    return cljs.core.filter.call(null, function(_) {
      return cljs.core.rand.call(null) < prob;
    }, coll);
  };
  random_sample = function(prob, coll) {
    switch(arguments.length) {
      case 1:
        return random_sample__1.call(this, prob);
      case 2:
        return random_sample__2.call(this, prob, coll);
    }
    throw new Error("Invalid arity: " + arguments.length);
  };
  random_sample.cljs$core$IFn$_invoke$arity$1 = random_sample__1;
  random_sample.cljs$core$IFn$_invoke$arity$2 = random_sample__2;
  return random_sample;
}();
cljs.core.Iteration = function(xform, coll) {
  this.xform = xform;
  this.coll = coll;
  this.cljs$lang$protocol_mask$partition1$ = 0;
  this.cljs$lang$protocol_mask$partition0$ = 2173173760;
};
cljs.core.Iteration.cljs$lang$type = true;
cljs.core.Iteration.cljs$lang$ctorStr = "cljs.core/Iteration";
cljs.core.Iteration.cljs$lang$ctorPrWriter = function(this__4215__auto__, writer__4216__auto__, opt__4217__auto__) {
  return cljs.core._write.call(null, writer__4216__auto__, "cljs.core/Iteration");
};
cljs.core.Iteration.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(coll__$1, writer, opts) {
  var self__ = this;
  var coll__$2 = this;
  return cljs.core.pr_sequential_writer.call(null, writer, cljs.core.pr_writer, "(", " ", ")", opts, coll__$2);
};
cljs.core.Iteration.prototype.cljs$core$IReduce$_reduce$arity$3 = function(_, f, init) {
  var self__ = this;
  var ___$1 = this;
  return cljs.core.transduce.call(null, self__.xform, f, init, self__.coll);
};
cljs.core.Iteration.prototype.cljs$core$ISeqable$_seq$arity$1 = function(_) {
  var self__ = this;
  var ___$1 = this;
  return cljs.core.seq.call(null, cljs.core.sequence.call(null, self__.xform, self__.coll));
};
cljs.core.__GT_Iteration = function __GT_Iteration(xform, coll) {
  return new cljs.core.Iteration(xform, coll);
};
cljs.core.iteration = function iteration(xform, coll) {
  return new cljs.core.Iteration(xform, coll);
};
cljs.core.run_BANG_ = function run_BANG_(proc, coll) {
  return cljs.core.reduce.call(null, function(p1__57221_SHARP_, p2__57220_SHARP_) {
    return proc.call(null, p2__57220_SHARP_);
  }, null, coll);
};
cljs.core.IEncodeJS = function() {
  var obj57223 = {};
  return obj57223;
}();
cljs.core._clj__GT_js = function _clj__GT_js(x) {
  if (function() {
    var and__3627__auto__ = x;
    if (and__3627__auto__) {
      return x.cljs$core$IEncodeJS$_clj__GT_js$arity$1;
    } else {
      return and__3627__auto__;
    }
  }()) {
    return x.cljs$core$IEncodeJS$_clj__GT_js$arity$1(x);
  } else {
    var x__4275__auto__ = x == null ? null : x;
    return function() {
      var or__3639__auto__ = cljs.core._clj__GT_js[goog.typeOf(x__4275__auto__)];
      if (or__3639__auto__) {
        return or__3639__auto__;
      } else {
        var or__3639__auto____$1 = cljs.core._clj__GT_js["_"];
        if (or__3639__auto____$1) {
          return or__3639__auto____$1;
        } else {
          throw cljs.core.missing_protocol.call(null, "IEncodeJS.-clj-\x3ejs", x);
        }
      }
    }().call(null, x);
  }
};
cljs.core._key__GT_js = function _key__GT_js(x) {
  if (function() {
    var and__3627__auto__ = x;
    if (and__3627__auto__) {
      return x.cljs$core$IEncodeJS$_key__GT_js$arity$1;
    } else {
      return and__3627__auto__;
    }
  }()) {
    return x.cljs$core$IEncodeJS$_key__GT_js$arity$1(x);
  } else {
    var x__4275__auto__ = x == null ? null : x;
    return function() {
      var or__3639__auto__ = cljs.core._key__GT_js[goog.typeOf(x__4275__auto__)];
      if (or__3639__auto__) {
        return or__3639__auto__;
      } else {
        var or__3639__auto____$1 = cljs.core._key__GT_js["_"];
        if (or__3639__auto____$1) {
          return or__3639__auto____$1;
        } else {
          throw cljs.core.missing_protocol.call(null, "IEncodeJS.-key-\x3ejs", x);
        }
      }
    }().call(null, x);
  }
};
cljs.core.key__GT_js = function key__GT_js(k) {
  if (function() {
    var G__57225 = k;
    if (G__57225) {
      var bit__4302__auto__ = null;
      if (cljs.core.truth_(function() {
        var or__3639__auto__ = bit__4302__auto__;
        if (cljs.core.truth_(or__3639__auto__)) {
          return or__3639__auto__;
        } else {
          return G__57225.cljs$core$IEncodeJS$;
        }
      }())) {
        return true;
      } else {
        if (!G__57225.cljs$lang$protocol_mask$partition$) {
          return cljs.core.native_satisfies_QMARK_.call(null, cljs.core.IEncodeJS, G__57225);
        } else {
          return false;
        }
      }
    } else {
      return cljs.core.native_satisfies_QMARK_.call(null, cljs.core.IEncodeJS, G__57225);
    }
  }()) {
    return cljs.core._clj__GT_js.call(null, k);
  } else {
    if (typeof k === "string" || typeof k === "number" || k instanceof cljs.core.Keyword || k instanceof cljs.core.Symbol) {
      return cljs.core.clj__GT_js.call(null, k);
    } else {
      return cljs.core.pr_str.call(null, k);
    }
  }
};
cljs.core.clj__GT_js = function clj__GT_js(x) {
  if (x == null) {
    return null;
  } else {
    if (function() {
      var G__57239 = x;
      if (G__57239) {
        var bit__4302__auto__ = null;
        if (cljs.core.truth_(function() {
          var or__3639__auto__ = bit__4302__auto__;
          if (cljs.core.truth_(or__3639__auto__)) {
            return or__3639__auto__;
          } else {
            return G__57239.cljs$core$IEncodeJS$;
          }
        }())) {
          return true;
        } else {
          if (!G__57239.cljs$lang$protocol_mask$partition$) {
            return cljs.core.native_satisfies_QMARK_.call(null, cljs.core.IEncodeJS, G__57239);
          } else {
            return false;
          }
        }
      } else {
        return cljs.core.native_satisfies_QMARK_.call(null, cljs.core.IEncodeJS, G__57239);
      }
    }()) {
      return cljs.core._clj__GT_js.call(null, x);
    } else {
      if (x instanceof cljs.core.Keyword) {
        return cljs.core.name.call(null, x);
      } else {
        if (x instanceof cljs.core.Symbol) {
          return "" + cljs.core.str.cljs$core$IFn$_invoke$arity$1(x);
        } else {
          if (cljs.core.map_QMARK_.call(null, x)) {
            var m = function() {
              var obj57241 = {};
              return obj57241;
            }();
            var seq__57242_57252 = cljs.core.seq.call(null, x);
            var chunk__57243_57253 = null;
            var count__57244_57254 = 0;
            var i__57245_57255 = 0;
            while (true) {
              if (i__57245_57255 < count__57244_57254) {
                var vec__57246_57256 = cljs.core._nth.call(null, chunk__57243_57253, i__57245_57255);
                var k_57257 = cljs.core.nth.call(null, vec__57246_57256, 0, null);
                var v_57258 = cljs.core.nth.call(null, vec__57246_57256, 1, null);
                m[cljs.core.key__GT_js.call(null, k_57257)] = clj__GT_js.call(null, v_57258);
                var G__57259 = seq__57242_57252;
                var G__57260 = chunk__57243_57253;
                var G__57261 = count__57244_57254;
                var G__57262 = i__57245_57255 + 1;
                seq__57242_57252 = G__57259;
                chunk__57243_57253 = G__57260;
                count__57244_57254 = G__57261;
                i__57245_57255 = G__57262;
                continue;
              } else {
                var temp__4126__auto___57263 = cljs.core.seq.call(null, seq__57242_57252);
                if (temp__4126__auto___57263) {
                  var seq__57242_57264__$1 = temp__4126__auto___57263;
                  if (cljs.core.chunked_seq_QMARK_.call(null, seq__57242_57264__$1)) {
                    var c__4408__auto___57265 = cljs.core.chunk_first.call(null, seq__57242_57264__$1);
                    var G__57266 = cljs.core.chunk_rest.call(null, seq__57242_57264__$1);
                    var G__57267 = c__4408__auto___57265;
                    var G__57268 = cljs.core.count.call(null, c__4408__auto___57265);
                    var G__57269 = 0;
                    seq__57242_57252 = G__57266;
                    chunk__57243_57253 = G__57267;
                    count__57244_57254 = G__57268;
                    i__57245_57255 = G__57269;
                    continue;
                  } else {
                    var vec__57247_57270 = cljs.core.first.call(null, seq__57242_57264__$1);
                    var k_57271 = cljs.core.nth.call(null, vec__57247_57270, 0, null);
                    var v_57272 = cljs.core.nth.call(null, vec__57247_57270, 1, null);
                    m[cljs.core.key__GT_js.call(null, k_57271)] = clj__GT_js.call(null, v_57272);
                    var G__57273 = cljs.core.next.call(null, seq__57242_57264__$1);
                    var G__57274 = null;
                    var G__57275 = 0;
                    var G__57276 = 0;
                    seq__57242_57252 = G__57273;
                    chunk__57243_57253 = G__57274;
                    count__57244_57254 = G__57275;
                    i__57245_57255 = G__57276;
                    continue;
                  }
                } else {
                }
              }
              break;
            }
            return m;
          } else {
            if (cljs.core.coll_QMARK_.call(null, x)) {
              var arr = [];
              var seq__57248_57277 = cljs.core.seq.call(null, cljs.core.map.call(null, clj__GT_js, x));
              var chunk__57249_57278 = null;
              var count__57250_57279 = 0;
              var i__57251_57280 = 0;
              while (true) {
                if (i__57251_57280 < count__57250_57279) {
                  var x_57281__$1 = cljs.core._nth.call(null, chunk__57249_57278, i__57251_57280);
                  arr.push(x_57281__$1);
                  var G__57282 = seq__57248_57277;
                  var G__57283 = chunk__57249_57278;
                  var G__57284 = count__57250_57279;
                  var G__57285 = i__57251_57280 + 1;
                  seq__57248_57277 = G__57282;
                  chunk__57249_57278 = G__57283;
                  count__57250_57279 = G__57284;
                  i__57251_57280 = G__57285;
                  continue;
                } else {
                  var temp__4126__auto___57286 = cljs.core.seq.call(null, seq__57248_57277);
                  if (temp__4126__auto___57286) {
                    var seq__57248_57287__$1 = temp__4126__auto___57286;
                    if (cljs.core.chunked_seq_QMARK_.call(null, seq__57248_57287__$1)) {
                      var c__4408__auto___57288 = cljs.core.chunk_first.call(null, seq__57248_57287__$1);
                      var G__57289 = cljs.core.chunk_rest.call(null, seq__57248_57287__$1);
                      var G__57290 = c__4408__auto___57288;
                      var G__57291 = cljs.core.count.call(null, c__4408__auto___57288);
                      var G__57292 = 0;
                      seq__57248_57277 = G__57289;
                      chunk__57249_57278 = G__57290;
                      count__57250_57279 = G__57291;
                      i__57251_57280 = G__57292;
                      continue;
                    } else {
                      var x_57293__$1 = cljs.core.first.call(null, seq__57248_57287__$1);
                      arr.push(x_57293__$1);
                      var G__57294 = cljs.core.next.call(null, seq__57248_57287__$1);
                      var G__57295 = null;
                      var G__57296 = 0;
                      var G__57297 = 0;
                      seq__57248_57277 = G__57294;
                      chunk__57249_57278 = G__57295;
                      count__57250_57279 = G__57296;
                      i__57251_57280 = G__57297;
                      continue;
                    }
                  } else {
                  }
                }
                break;
              }
              return arr;
            } else {
              return x;
            }
          }
        }
      }
    }
  }
};
cljs.core.IEncodeClojure = function() {
  var obj57299 = {};
  return obj57299;
}();
cljs.core._js__GT_clj = function _js__GT_clj(x, options) {
  if (function() {
    var and__3627__auto__ = x;
    if (and__3627__auto__) {
      return x.cljs$core$IEncodeClojure$_js__GT_clj$arity$2;
    } else {
      return and__3627__auto__;
    }
  }()) {
    return x.cljs$core$IEncodeClojure$_js__GT_clj$arity$2(x, options);
  } else {
    var x__4275__auto__ = x == null ? null : x;
    return function() {
      var or__3639__auto__ = cljs.core._js__GT_clj[goog.typeOf(x__4275__auto__)];
      if (or__3639__auto__) {
        return or__3639__auto__;
      } else {
        var or__3639__auto____$1 = cljs.core._js__GT_clj["_"];
        if (or__3639__auto____$1) {
          return or__3639__auto____$1;
        } else {
          throw cljs.core.missing_protocol.call(null, "IEncodeClojure.-js-\x3eclj", x);
        }
      }
    }().call(null, x, options);
  }
};
cljs.core.js__GT_clj = function() {
  var js__GT_clj = null;
  var js__GT_clj__1 = function(x) {
    return js__GT_clj.call(null, x, new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null, "keywordize-keys", "keywordize-keys", 1310784252), false], null));
  };
  var js__GT_clj__2 = function() {
    var G__57320__delegate = function(x, opts) {
      if (function() {
        var G__57310 = x;
        if (G__57310) {
          var bit__4302__auto__ = null;
          if (cljs.core.truth_(function() {
            var or__3639__auto__ = bit__4302__auto__;
            if (cljs.core.truth_(or__3639__auto__)) {
              return or__3639__auto__;
            } else {
              return G__57310.cljs$core$IEncodeClojure$;
            }
          }())) {
            return true;
          } else {
            if (!G__57310.cljs$lang$protocol_mask$partition$) {
              return cljs.core.native_satisfies_QMARK_.call(null, cljs.core.IEncodeClojure, G__57310);
            } else {
              return false;
            }
          }
        } else {
          return cljs.core.native_satisfies_QMARK_.call(null, cljs.core.IEncodeClojure, G__57310);
        }
      }()) {
        return cljs.core._js__GT_clj.call(null, x, cljs.core.apply.call(null, cljs.core.array_map, opts));
      } else {
        if (cljs.core.seq.call(null, opts)) {
          var map__57311 = opts;
          var map__57311__$1 = cljs.core.seq_QMARK_.call(null, map__57311) ? cljs.core.apply.call(null, cljs.core.hash_map, map__57311) : map__57311;
          var keywordize_keys = cljs.core.get.call(null, map__57311__$1, new cljs.core.Keyword(null, "keywordize-keys", "keywordize-keys", 1310784252));
          var keyfn = cljs.core.truth_(keywordize_keys) ? cljs.core.keyword : cljs.core.str;
          var f = function(map__57311, map__57311__$1, keywordize_keys, keyfn) {
            return function thisfn(x__$1) {
              if (cljs.core.seq_QMARK_.call(null, x__$1)) {
                return cljs.core.doall.call(null, cljs.core.map.call(null, thisfn, x__$1));
              } else {
                if (cljs.core.coll_QMARK_.call(null, x__$1)) {
                  return cljs.core.into.call(null, cljs.core.empty.call(null, x__$1), cljs.core.map.call(null, thisfn, x__$1));
                } else {
                  if (x__$1 instanceof Array) {
                    return cljs.core.vec.call(null, cljs.core.map.call(null, thisfn, x__$1));
                  } else {
                    if (cljs.core.type.call(null, x__$1) === Object) {
                      return cljs.core.into.call(null, cljs.core.PersistentArrayMap.EMPTY, function() {
                        var iter__4377__auto__ = function(map__57311, map__57311__$1, keywordize_keys, keyfn) {
                          return function iter__57316(s__57317) {
                            return new cljs.core.LazySeq(null, function(map__57311, map__57311__$1, keywordize_keys, keyfn) {
                              return function() {
                                var s__57317__$1 = s__57317;
                                while (true) {
                                  var temp__4126__auto__ = cljs.core.seq.call(null, s__57317__$1);
                                  if (temp__4126__auto__) {
                                    var s__57317__$2 = temp__4126__auto__;
                                    if (cljs.core.chunked_seq_QMARK_.call(null, s__57317__$2)) {
                                      var c__4375__auto__ = cljs.core.chunk_first.call(null, s__57317__$2);
                                      var size__4376__auto__ = cljs.core.count.call(null, c__4375__auto__);
                                      var b__57319 = cljs.core.chunk_buffer.call(null, size__4376__auto__);
                                      if (function() {
                                        var i__57318 = 0;
                                        while (true) {
                                          if (i__57318 < size__4376__auto__) {
                                            var k = cljs.core._nth.call(null, c__4375__auto__, i__57318);
                                            cljs.core.chunk_append.call(null, b__57319, new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [keyfn.call(null, k), thisfn.call(null, x__$1[k])], null));
                                            var G__57321 = i__57318 + 1;
                                            i__57318 = G__57321;
                                            continue;
                                          } else {
                                            return true;
                                          }
                                          break;
                                        }
                                      }()) {
                                        return cljs.core.chunk_cons.call(null, cljs.core.chunk.call(null, b__57319), iter__57316.call(null, cljs.core.chunk_rest.call(null, s__57317__$2)));
                                      } else {
                                        return cljs.core.chunk_cons.call(null, cljs.core.chunk.call(null, b__57319), null);
                                      }
                                    } else {
                                      var k = cljs.core.first.call(null, s__57317__$2);
                                      return cljs.core.cons.call(null, new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [keyfn.call(null, k), thisfn.call(null, x__$1[k])], null), iter__57316.call(null, cljs.core.rest.call(null, s__57317__$2)));
                                    }
                                  } else {
                                    return null;
                                  }
                                  break;
                                }
                              };
                            }(map__57311, map__57311__$1, keywordize_keys, keyfn), null, null);
                          };
                        }(map__57311, map__57311__$1, keywordize_keys, keyfn);
                        return iter__4377__auto__.call(null, cljs.core.js_keys.call(null, x__$1));
                      }());
                    } else {
                      return x__$1;
                    }
                  }
                }
              }
            };
          }(map__57311, map__57311__$1, keywordize_keys, keyfn);
          return f.call(null, x);
        } else {
          return null;
        }
      }
    };
    var G__57320 = function(x, var_args) {
      var opts = null;
      if (arguments.length > 1) {
        opts = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0);
      }
      return G__57320__delegate.call(this, x, opts);
    };
    G__57320.cljs$lang$maxFixedArity = 1;
    G__57320.cljs$lang$applyTo = function(arglist__57322) {
      var x = cljs.core.first(arglist__57322);
      var opts = cljs.core.rest(arglist__57322);
      return G__57320__delegate(x, opts);
    };
    G__57320.cljs$core$IFn$_invoke$arity$variadic = G__57320__delegate;
    return G__57320;
  }();
  js__GT_clj = function(x, var_args) {
    var opts = var_args;
    switch(arguments.length) {
      case 1:
        return js__GT_clj__1.call(this, x);
      default:
        return js__GT_clj__2.cljs$core$IFn$_invoke$arity$variadic(x, cljs.core.array_seq(arguments, 1));
    }
    throw new Error("Invalid arity: " + arguments.length);
  };
  js__GT_clj.cljs$lang$maxFixedArity = 1;
  js__GT_clj.cljs$lang$applyTo = js__GT_clj__2.cljs$lang$applyTo;
  js__GT_clj.cljs$core$IFn$_invoke$arity$1 = js__GT_clj__1;
  js__GT_clj.cljs$core$IFn$_invoke$arity$variadic = js__GT_clj__2.cljs$core$IFn$_invoke$arity$variadic;
  return js__GT_clj;
}();
cljs.core.memoize = function memoize(f) {
  var mem = cljs.core.atom.call(null, cljs.core.PersistentArrayMap.EMPTY);
  return function(mem) {
    return function() {
      var G__57323__delegate = function(args) {
        var v = cljs.core.get.call(null, cljs.core.deref.call(null, mem), args, cljs.core.lookup_sentinel);
        if (v === cljs.core.lookup_sentinel) {
          var ret = cljs.core.apply.call(null, f, args);
          cljs.core.swap_BANG_.call(null, mem, cljs.core.assoc, args, ret);
          return ret;
        } else {
          return v;
        }
      };
      var G__57323 = function(var_args) {
        var args = null;
        if (arguments.length > 0) {
          args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0);
        }
        return G__57323__delegate.call(this, args);
      };
      G__57323.cljs$lang$maxFixedArity = 0;
      G__57323.cljs$lang$applyTo = function(arglist__57324) {
        var args = cljs.core.seq(arglist__57324);
        return G__57323__delegate(args);
      };
      G__57323.cljs$core$IFn$_invoke$arity$variadic = G__57323__delegate;
      return G__57323;
    }();
  }(mem);
};
cljs.core.trampoline = function() {
  var trampoline = null;
  var trampoline__1 = function(f) {
    while (true) {
      var ret = f.call(null);
      if (cljs.core.fn_QMARK_.call(null, ret)) {
        var G__57325 = ret;
        f = G__57325;
        continue;
      } else {
        return ret;
      }
      break;
    }
  };
  var trampoline__2 = function() {
    var G__57326__delegate = function(f, args) {
      return trampoline.call(null, function() {
        return cljs.core.apply.call(null, f, args);
      });
    };
    var G__57326 = function(f, var_args) {
      var args = null;
      if (arguments.length > 1) {
        args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0);
      }
      return G__57326__delegate.call(this, f, args);
    };
    G__57326.cljs$lang$maxFixedArity = 1;
    G__57326.cljs$lang$applyTo = function(arglist__57327) {
      var f = cljs.core.first(arglist__57327);
      var args = cljs.core.rest(arglist__57327);
      return G__57326__delegate(f, args);
    };
    G__57326.cljs$core$IFn$_invoke$arity$variadic = G__57326__delegate;
    return G__57326;
  }();
  trampoline = function(f, var_args) {
    var args = var_args;
    switch(arguments.length) {
      case 1:
        return trampoline__1.call(this, f);
      default:
        return trampoline__2.cljs$core$IFn$_invoke$arity$variadic(f, cljs.core.array_seq(arguments, 1));
    }
    throw new Error("Invalid arity: " + arguments.length);
  };
  trampoline.cljs$lang$maxFixedArity = 1;
  trampoline.cljs$lang$applyTo = trampoline__2.cljs$lang$applyTo;
  trampoline.cljs$core$IFn$_invoke$arity$1 = trampoline__1;
  trampoline.cljs$core$IFn$_invoke$arity$variadic = trampoline__2.cljs$core$IFn$_invoke$arity$variadic;
  return trampoline;
}();
cljs.core.rand = function() {
  var rand = null;
  var rand__0 = function() {
    return rand.call(null, 1);
  };
  var rand__1 = function(n) {
    return Math.random.call(null) * n;
  };
  rand = function(n) {
    switch(arguments.length) {
      case 0:
        return rand__0.call(this);
      case 1:
        return rand__1.call(this, n);
    }
    throw new Error("Invalid arity: " + arguments.length);
  };
  rand.cljs$core$IFn$_invoke$arity$0 = rand__0;
  rand.cljs$core$IFn$_invoke$arity$1 = rand__1;
  return rand;
}();
cljs.core.rand_int = function rand_int(n) {
  return Math.floor.call(null, Math.random.call(null) * n);
};
cljs.core.rand_nth = function rand_nth(coll) {
  return cljs.core.nth.call(null, coll, cljs.core.rand_int.call(null, cljs.core.count.call(null, coll)));
};
cljs.core.group_by = function group_by(f, coll) {
  return cljs.core.persistent_BANG_.call(null, cljs.core.reduce.call(null, function(ret, x) {
    var k = f.call(null, x);
    return cljs.core.assoc_BANG_.call(null, ret, k, cljs.core.conj.call(null, cljs.core.get.call(null, ret, k, cljs.core.PersistentVector.EMPTY), x));
  }, cljs.core.transient$.call(null, cljs.core.PersistentArrayMap.EMPTY), coll));
};
cljs.core.make_hierarchy = function make_hierarchy() {
  return new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null, "parents", "parents", -2027538891), cljs.core.PersistentArrayMap.EMPTY, new cljs.core.Keyword(null, "descendants", "descendants", 1824886031), cljs.core.PersistentArrayMap.EMPTY, new cljs.core.Keyword(null, "ancestors", "ancestors", -776045424), cljs.core.PersistentArrayMap.EMPTY], null);
};
cljs.core._global_hierarchy = null;
cljs.core.get_global_hierarchy = function get_global_hierarchy() {
  if (cljs.core._global_hierarchy == null) {
    cljs.core._global_hierarchy = cljs.core.atom.call(null, cljs.core.make_hierarchy.call(null));
  } else {
  }
  return cljs.core._global_hierarchy;
};
cljs.core.swap_global_hierarchy_BANG_ = function() {
  var swap_global_hierarchy_BANG___delegate = function(f, args) {
    return cljs.core.apply.call(null, cljs.core.swap_BANG_, cljs.core.get_global_hierarchy.call(null), f, args);
  };
  var swap_global_hierarchy_BANG_ = function(f, var_args) {
    var args = null;
    if (arguments.length > 1) {
      args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0);
    }
    return swap_global_hierarchy_BANG___delegate.call(this, f, args);
  };
  swap_global_hierarchy_BANG_.cljs$lang$maxFixedArity = 1;
  swap_global_hierarchy_BANG_.cljs$lang$applyTo = function(arglist__57328) {
    var f = cljs.core.first(arglist__57328);
    var args = cljs.core.rest(arglist__57328);
    return swap_global_hierarchy_BANG___delegate(f, args);
  };
  swap_global_hierarchy_BANG_.cljs$core$IFn$_invoke$arity$variadic = swap_global_hierarchy_BANG___delegate;
  return swap_global_hierarchy_BANG_;
}();
cljs.core.isa_QMARK_ = function() {
  var isa_QMARK_ = null;
  var isa_QMARK___2 = function(child, parent) {
    return isa_QMARK_.call(null, cljs.core.deref.call(null, cljs.core.get_global_hierarchy.call(null)), child, parent);
  };
  var isa_QMARK___3 = function(h, child, parent) {
    var or__3639__auto__ = cljs.core._EQ_.call(null, child, parent);
    if (or__3639__auto__) {
      return or__3639__auto__;
    } else {
      var or__3639__auto____$1 = cljs.core.contains_QMARK_.call(null, (new cljs.core.Keyword(null, "ancestors", "ancestors", -776045424)).cljs$core$IFn$_invoke$arity$1(h).call(null, child), parent);
      if (or__3639__auto____$1) {
        return or__3639__auto____$1;
      } else {
        var and__3627__auto__ = cljs.core.vector_QMARK_.call(null, parent);
        if (and__3627__auto__) {
          var and__3627__auto____$1 = cljs.core.vector_QMARK_.call(null, child);
          if (and__3627__auto____$1) {
            var and__3627__auto____$2 = cljs.core.count.call(null, parent) === cljs.core.count.call(null, child);
            if (and__3627__auto____$2) {
              var ret = true;
              var i = 0;
              while (true) {
                if (!ret || i === cljs.core.count.call(null, parent)) {
                  return ret;
                } else {
                  var G__57329 = isa_QMARK_.call(null, h, child.call(null, i), parent.call(null, i));
                  var G__57330 = i + 1;
                  ret = G__57329;
                  i = G__57330;
                  continue;
                }
                break;
              }
            } else {
              return and__3627__auto____$2;
            }
          } else {
            return and__3627__auto____$1;
          }
        } else {
          return and__3627__auto__;
        }
      }
    }
  };
  isa_QMARK_ = function(h, child, parent) {
    switch(arguments.length) {
      case 2:
        return isa_QMARK___2.call(this, h, child);
      case 3:
        return isa_QMARK___3.call(this, h, child, parent);
    }
    throw new Error("Invalid arity: " + arguments.length);
  };
  isa_QMARK_.cljs$core$IFn$_invoke$arity$2 = isa_QMARK___2;
  isa_QMARK_.cljs$core$IFn$_invoke$arity$3 = isa_QMARK___3;
  return isa_QMARK_;
}();
cljs.core.parents = function() {
  var parents = null;
  var parents__1 = function(tag) {
    return parents.call(null, cljs.core.deref.call(null, cljs.core.get_global_hierarchy.call(null)), tag);
  };
  var parents__2 = function(h, tag) {
    return cljs.core.not_empty.call(null, cljs.core.get.call(null, (new cljs.core.Keyword(null, "parents", "parents", -2027538891)).cljs$core$IFn$_invoke$arity$1(h), tag));
  };
  parents = function(h, tag) {
    switch(arguments.length) {
      case 1:
        return parents__1.call(this, h);
      case 2:
        return parents__2.call(this, h, tag);
    }
    throw new Error("Invalid arity: " + arguments.length);
  };
  parents.cljs$core$IFn$_invoke$arity$1 = parents__1;
  parents.cljs$core$IFn$_invoke$arity$2 = parents__2;
  return parents;
}();
cljs.core.ancestors = function() {
  var ancestors = null;
  var ancestors__1 = function(tag) {
    return ancestors.call(null, cljs.core.deref.call(null, cljs.core.get_global_hierarchy.call(null)), tag);
  };
  var ancestors__2 = function(h, tag) {
    return cljs.core.not_empty.call(null, cljs.core.get.call(null, (new cljs.core.Keyword(null, "ancestors", "ancestors", -776045424)).cljs$core$IFn$_invoke$arity$1(h), tag));
  };
  ancestors = function(h, tag) {
    switch(arguments.length) {
      case 1:
        return ancestors__1.call(this, h);
      case 2:
        return ancestors__2.call(this, h, tag);
    }
    throw new Error("Invalid arity: " + arguments.length);
  };
  ancestors.cljs$core$IFn$_invoke$arity$1 = ancestors__1;
  ancestors.cljs$core$IFn$_invoke$arity$2 = ancestors__2;
  return ancestors;
}();
cljs.core.descendants = function() {
  var descendants = null;
  var descendants__1 = function(tag) {
    return descendants.call(null, cljs.core.deref.call(null, cljs.core.get_global_hierarchy.call(null)), tag);
  };
  var descendants__2 = function(h, tag) {
    return cljs.core.not_empty.call(null, cljs.core.get.call(null, (new cljs.core.Keyword(null, "descendants", "descendants", 1824886031)).cljs$core$IFn$_invoke$arity$1(h), tag));
  };
  descendants = function(h, tag) {
    switch(arguments.length) {
      case 1:
        return descendants__1.call(this, h);
      case 2:
        return descendants__2.call(this, h, tag);
    }
    throw new Error("Invalid arity: " + arguments.length);
  };
  descendants.cljs$core$IFn$_invoke$arity$1 = descendants__1;
  descendants.cljs$core$IFn$_invoke$arity$2 = descendants__2;
  return descendants;
}();
cljs.core.derive = function() {
  var derive = null;
  var derive__2 = function(tag, parent) {
    if (cljs.core.truth_(cljs.core.namespace.call(null, parent))) {
    } else {
      throw new Error("Assert failed: " + cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs.core.pr_str.call(null, cljs.core.list(new cljs.core.Symbol(null, "namespace", "namespace", 1263021155, null), new cljs.core.Symbol(null, "parent", "parent", 761652748, null)))));
    }
    cljs.core.swap_global_hierarchy_BANG_.call(null, derive, tag, parent);
    return null;
  };
  var derive__3 = function(h, tag, parent) {
    if (cljs.core.not_EQ_.call(null, tag, parent)) {
    } else {
      throw new Error("Assert failed: " + cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs.core.pr_str.call(null, cljs.core.list(new cljs.core.Symbol(null, "not\x3d", "not\x3d", 1466536204, null), new cljs.core.Symbol(null, "tag", "tag", 350170304, null), new cljs.core.Symbol(null, "parent", "parent", 761652748, null)))));
    }
    var tp = (new cljs.core.Keyword(null, "parents", "parents", -2027538891)).cljs$core$IFn$_invoke$arity$1(h);
    var td = (new cljs.core.Keyword(null, "descendants", "descendants", 1824886031)).cljs$core$IFn$_invoke$arity$1(h);
    var ta = (new cljs.core.Keyword(null, "ancestors", "ancestors", -776045424)).cljs$core$IFn$_invoke$arity$1(h);
    var tf = function(tp, td, ta) {
      return function(m, source, sources, target, targets) {
        return cljs.core.reduce.call(null, function(tp, td, ta) {
          return function(ret, k) {
            return cljs.core.assoc.call(null, ret, k, cljs.core.reduce.call(null, cljs.core.conj, cljs.core.get.call(null, targets, k, cljs.core.PersistentHashSet.EMPTY), cljs.core.cons.call(null, target, targets.call(null, target))));
          };
        }(tp, td, ta), m, cljs.core.cons.call(null, source, sources.call(null, source)));
      };
    }(tp, td, ta);
    var or__3639__auto__ = cljs.core.contains_QMARK_.call(null, tp.call(null, tag), parent) ? null : function() {
      if (cljs.core.contains_QMARK_.call(null, ta.call(null, tag), parent)) {
        throw new Error("" + cljs.core.str.cljs$core$IFn$_invoke$arity$1(tag) + "already has" + cljs.core.str.cljs$core$IFn$_invoke$arity$1(parent) + "as ancestor");
      } else {
      }
      if (cljs.core.contains_QMARK_.call(null, ta.call(null, parent), tag)) {
        throw new Error("Cyclic derivation:" + cljs.core.str.cljs$core$IFn$_invoke$arity$1(parent) + "has" + cljs.core.str.cljs$core$IFn$_invoke$arity$1(tag) + "as ancestor");
      } else {
      }
      return new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null, "parents", "parents", -2027538891), cljs.core.assoc.call(null, (new cljs.core.Keyword(null, "parents", "parents", -2027538891)).cljs$core$IFn$_invoke$arity$1(h), tag, cljs.core.conj.call(null, cljs.core.get.call(null, tp, tag, cljs.core.PersistentHashSet.EMPTY), parent)), new cljs.core.Keyword(null, "ancestors", "ancestors", -776045424), tf.call(null, (new cljs.core.Keyword(null, "ancestors", "ancestors", -776045424)).cljs$core$IFn$_invoke$arity$1(h), 
      tag, td, parent, ta), new cljs.core.Keyword(null, "descendants", "descendants", 1824886031), tf.call(null, (new cljs.core.Keyword(null, "descendants", "descendants", 1824886031)).cljs$core$IFn$_invoke$arity$1(h), parent, ta, tag, td)], null);
    }();
    if (cljs.core.truth_(or__3639__auto__)) {
      return or__3639__auto__;
    } else {
      return h;
    }
  };
  derive = function(h, tag, parent) {
    switch(arguments.length) {
      case 2:
        return derive__2.call(this, h, tag);
      case 3:
        return derive__3.call(this, h, tag, parent);
    }
    throw new Error("Invalid arity: " + arguments.length);
  };
  derive.cljs$core$IFn$_invoke$arity$2 = derive__2;
  derive.cljs$core$IFn$_invoke$arity$3 = derive__3;
  return derive;
}();
cljs.core.underive = function() {
  var underive = null;
  var underive__2 = function(tag, parent) {
    cljs.core.swap_global_hierarchy_BANG_.call(null, underive, tag, parent);
    return null;
  };
  var underive__3 = function(h, tag, parent) {
    var parentMap = (new cljs.core.Keyword(null, "parents", "parents", -2027538891)).cljs$core$IFn$_invoke$arity$1(h);
    var childsParents = cljs.core.truth_(parentMap.call(null, tag)) ? cljs.core.disj.call(null, parentMap.call(null, tag), parent) : cljs.core.PersistentHashSet.EMPTY;
    var newParents = cljs.core.truth_(cljs.core.not_empty.call(null, childsParents)) ? cljs.core.assoc.call(null, parentMap, tag, childsParents) : cljs.core.dissoc.call(null, parentMap, tag);
    var deriv_seq = cljs.core.flatten.call(null, cljs.core.map.call(null, function(parentMap, childsParents, newParents) {
      return function(p1__57331_SHARP_) {
        return cljs.core.cons.call(null, cljs.core.first.call(null, p1__57331_SHARP_), cljs.core.interpose.call(null, cljs.core.first.call(null, p1__57331_SHARP_), cljs.core.second.call(null, p1__57331_SHARP_)));
      };
    }(parentMap, childsParents, newParents), cljs.core.seq.call(null, newParents)));
    if (cljs.core.contains_QMARK_.call(null, parentMap.call(null, tag), parent)) {
      return cljs.core.reduce.call(null, function(parentMap, childsParents, newParents, deriv_seq) {
        return function(p1__57332_SHARP_, p2__57333_SHARP_) {
          return cljs.core.apply.call(null, cljs.core.derive, p1__57332_SHARP_, p2__57333_SHARP_);
        };
      }(parentMap, childsParents, newParents, deriv_seq), cljs.core.make_hierarchy.call(null), cljs.core.partition.call(null, 2, deriv_seq));
    } else {
      return h;
    }
  };
  underive = function(h, tag, parent) {
    switch(arguments.length) {
      case 2:
        return underive__2.call(this, h, tag);
      case 3:
        return underive__3.call(this, h, tag, parent);
    }
    throw new Error("Invalid arity: " + arguments.length);
  };
  underive.cljs$core$IFn$_invoke$arity$2 = underive__2;
  underive.cljs$core$IFn$_invoke$arity$3 = underive__3;
  return underive;
}();
cljs.core.reset_cache = function reset_cache(method_cache, method_table, cached_hierarchy, hierarchy) {
  cljs.core.swap_BANG_.call(null, method_cache, function(_) {
    return cljs.core.deref.call(null, method_table);
  });
  return cljs.core.swap_BANG_.call(null, cached_hierarchy, function(_) {
    return cljs.core.deref.call(null, hierarchy);
  });
};
cljs.core.prefers_STAR_ = function prefers_STAR_(x, y, prefer_table) {
  var xprefs = cljs.core.deref.call(null, prefer_table).call(null, x);
  var or__3639__auto__ = cljs.core.truth_(function() {
    var and__3627__auto__ = xprefs;
    if (cljs.core.truth_(and__3627__auto__)) {
      return xprefs.call(null, y);
    } else {
      return and__3627__auto__;
    }
  }()) ? true : null;
  if (cljs.core.truth_(or__3639__auto__)) {
    return or__3639__auto__;
  } else {
    var or__3639__auto____$1 = function() {
      var ps = cljs.core.parents.call(null, y);
      while (true) {
        if (cljs.core.count.call(null, ps) > 0) {
          if (cljs.core.truth_(prefers_STAR_.call(null, x, cljs.core.first.call(null, ps), prefer_table))) {
          } else {
          }
          var G__57334 = cljs.core.rest.call(null, ps);
          ps = G__57334;
          continue;
        } else {
          return null;
        }
        break;
      }
    }();
    if (cljs.core.truth_(or__3639__auto____$1)) {
      return or__3639__auto____$1;
    } else {
      var or__3639__auto____$2 = function() {
        var ps = cljs.core.parents.call(null, x);
        while (true) {
          if (cljs.core.count.call(null, ps) > 0) {
            if (cljs.core.truth_(prefers_STAR_.call(null, cljs.core.first.call(null, ps), y, prefer_table))) {
            } else {
            }
            var G__57335 = cljs.core.rest.call(null, ps);
            ps = G__57335;
            continue;
          } else {
            return null;
          }
          break;
        }
      }();
      if (cljs.core.truth_(or__3639__auto____$2)) {
        return or__3639__auto____$2;
      } else {
        return false;
      }
    }
  }
};
cljs.core.dominates = function dominates(x, y, prefer_table) {
  var or__3639__auto__ = cljs.core.prefers_STAR_.call(null, x, y, prefer_table);
  if (cljs.core.truth_(or__3639__auto__)) {
    return or__3639__auto__;
  } else {
    return cljs.core.isa_QMARK_.call(null, x, y);
  }
};
cljs.core.find_and_cache_best_method = function find_and_cache_best_method(name, dispatch_val, hierarchy, method_table, prefer_table, method_cache, cached_hierarchy) {
  var best_entry = cljs.core.reduce.call(null, function(be, p__57338) {
    var vec__57339 = p__57338;
    var k = cljs.core.nth.call(null, vec__57339, 0, null);
    var _ = cljs.core.nth.call(null, vec__57339, 1, null);
    var e = vec__57339;
    if (cljs.core.isa_QMARK_.call(null, cljs.core.deref.call(null, hierarchy), dispatch_val, k)) {
      var be2 = cljs.core.truth_(function() {
        var or__3639__auto__ = be == null;
        if (or__3639__auto__) {
          return or__3639__auto__;
        } else {
          return cljs.core.dominates.call(null, k, cljs.core.first.call(null, be), prefer_table);
        }
      }()) ? e : be;
      if (cljs.core.truth_(cljs.core.dominates.call(null, cljs.core.first.call(null, be2), k, prefer_table))) {
      } else {
        throw new Error("Multiple methods in multimethod '" + cljs.core.str.cljs$core$IFn$_invoke$arity$1(name) + "' match dispatch value: " + cljs.core.str.cljs$core$IFn$_invoke$arity$1(dispatch_val) + " -\x3e " + cljs.core.str.cljs$core$IFn$_invoke$arity$1(k) + " and " + cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs.core.first.call(null, be2)) + ", and neither is preferred");
      }
      return be2;
    } else {
      return be;
    }
  }, null, cljs.core.deref.call(null, method_table));
  if (cljs.core.truth_(best_entry)) {
    if (cljs.core._EQ_.call(null, cljs.core.deref.call(null, cached_hierarchy), cljs.core.deref.call(null, hierarchy))) {
      cljs.core.swap_BANG_.call(null, method_cache, cljs.core.assoc, dispatch_val, cljs.core.second.call(null, best_entry));
      return cljs.core.second.call(null, best_entry);
    } else {
      cljs.core.reset_cache.call(null, method_cache, method_table, cached_hierarchy, hierarchy);
      return find_and_cache_best_method.call(null, name, dispatch_val, hierarchy, method_table, prefer_table, method_cache, cached_hierarchy);
    }
  } else {
    return null;
  }
};
cljs.core.IMultiFn = function() {
  var obj57341 = {};
  return obj57341;
}();
cljs.core._reset = function _reset(mf) {
  if (function() {
    var and__3627__auto__ = mf;
    if (and__3627__auto__) {
      return mf.cljs$core$IMultiFn$_reset$arity$1;
    } else {
      return and__3627__auto__;
    }
  }()) {
    return mf.cljs$core$IMultiFn$_reset$arity$1(mf);
  } else {
    var x__4275__auto__ = mf == null ? null : mf;
    return function() {
      var or__3639__auto__ = cljs.core._reset[goog.typeOf(x__4275__auto__)];
      if (or__3639__auto__) {
        return or__3639__auto__;
      } else {
        var or__3639__auto____$1 = cljs.core._reset["_"];
        if (or__3639__auto____$1) {
          return or__3639__auto____$1;
        } else {
          throw cljs.core.missing_protocol.call(null, "IMultiFn.-reset", mf);
        }
      }
    }().call(null, mf);
  }
};
cljs.core._add_method = function _add_method(mf, dispatch_val, method) {
  if (function() {
    var and__3627__auto__ = mf;
    if (and__3627__auto__) {
      return mf.cljs$core$IMultiFn$_add_method$arity$3;
    } else {
      return and__3627__auto__;
    }
  }()) {
    return mf.cljs$core$IMultiFn$_add_method$arity$3(mf, dispatch_val, method);
  } else {
    var x__4275__auto__ = mf == null ? null : mf;
    return function() {
      var or__3639__auto__ = cljs.core._add_method[goog.typeOf(x__4275__auto__)];
      if (or__3639__auto__) {
        return or__3639__auto__;
      } else {
        var or__3639__auto____$1 = cljs.core._add_method["_"];
        if (or__3639__auto____$1) {
          return or__3639__auto____$1;
        } else {
          throw cljs.core.missing_protocol.call(null, "IMultiFn.-add-method", mf);
        }
      }
    }().call(null, mf, dispatch_val, method);
  }
};
cljs.core._remove_method = function _remove_method(mf, dispatch_val) {
  if (function() {
    var and__3627__auto__ = mf;
    if (and__3627__auto__) {
      return mf.cljs$core$IMultiFn$_remove_method$arity$2;
    } else {
      return and__3627__auto__;
    }
  }()) {
    return mf.cljs$core$IMultiFn$_remove_method$arity$2(mf, dispatch_val);
  } else {
    var x__4275__auto__ = mf == null ? null : mf;
    return function() {
      var or__3639__auto__ = cljs.core._remove_method[goog.typeOf(x__4275__auto__)];
      if (or__3639__auto__) {
        return or__3639__auto__;
      } else {
        var or__3639__auto____$1 = cljs.core._remove_method["_"];
        if (or__3639__auto____$1) {
          return or__3639__auto____$1;
        } else {
          throw cljs.core.missing_protocol.call(null, "IMultiFn.-remove-method", mf);
        }
      }
    }().call(null, mf, dispatch_val);
  }
};
cljs.core._prefer_method = function _prefer_method(mf, dispatch_val, dispatch_val_y) {
  if (function() {
    var and__3627__auto__ = mf;
    if (and__3627__auto__) {
      return mf.cljs$core$IMultiFn$_prefer_method$arity$3;
    } else {
      return and__3627__auto__;
    }
  }()) {
    return mf.cljs$core$IMultiFn$_prefer_method$arity$3(mf, dispatch_val, dispatch_val_y);
  } else {
    var x__4275__auto__ = mf == null ? null : mf;
    return function() {
      var or__3639__auto__ = cljs.core._prefer_method[goog.typeOf(x__4275__auto__)];
      if (or__3639__auto__) {
        return or__3639__auto__;
      } else {
        var or__3639__auto____$1 = cljs.core._prefer_method["_"];
        if (or__3639__auto____$1) {
          return or__3639__auto____$1;
        } else {
          throw cljs.core.missing_protocol.call(null, "IMultiFn.-prefer-method", mf);
        }
      }
    }().call(null, mf, dispatch_val, dispatch_val_y);
  }
};
cljs.core._get_method = function _get_method(mf, dispatch_val) {
  if (function() {
    var and__3627__auto__ = mf;
    if (and__3627__auto__) {
      return mf.cljs$core$IMultiFn$_get_method$arity$2;
    } else {
      return and__3627__auto__;
    }
  }()) {
    return mf.cljs$core$IMultiFn$_get_method$arity$2(mf, dispatch_val);
  } else {
    var x__4275__auto__ = mf == null ? null : mf;
    return function() {
      var or__3639__auto__ = cljs.core._get_method[goog.typeOf(x__4275__auto__)];
      if (or__3639__auto__) {
        return or__3639__auto__;
      } else {
        var or__3639__auto____$1 = cljs.core._get_method["_"];
        if (or__3639__auto____$1) {
          return or__3639__auto____$1;
        } else {
          throw cljs.core.missing_protocol.call(null, "IMultiFn.-get-method", mf);
        }
      }
    }().call(null, mf, dispatch_val);
  }
};
cljs.core._methods = function _methods(mf) {
  if (function() {
    var and__3627__auto__ = mf;
    if (and__3627__auto__) {
      return mf.cljs$core$IMultiFn$_methods$arity$1;
    } else {
      return and__3627__auto__;
    }
  }()) {
    return mf.cljs$core$IMultiFn$_methods$arity$1(mf);
  } else {
    var x__4275__auto__ = mf == null ? null : mf;
    return function() {
      var or__3639__auto__ = cljs.core._methods[goog.typeOf(x__4275__auto__)];
      if (or__3639__auto__) {
        return or__3639__auto__;
      } else {
        var or__3639__auto____$1 = cljs.core._methods["_"];
        if (or__3639__auto____$1) {
          return or__3639__auto____$1;
        } else {
          throw cljs.core.missing_protocol.call(null, "IMultiFn.-methods", mf);
        }
      }
    }().call(null, mf);
  }
};
cljs.core._prefers = function _prefers(mf) {
  if (function() {
    var and__3627__auto__ = mf;
    if (and__3627__auto__) {
      return mf.cljs$core$IMultiFn$_prefers$arity$1;
    } else {
      return and__3627__auto__;
    }
  }()) {
    return mf.cljs$core$IMultiFn$_prefers$arity$1(mf);
  } else {
    var x__4275__auto__ = mf == null ? null : mf;
    return function() {
      var or__3639__auto__ = cljs.core._prefers[goog.typeOf(x__4275__auto__)];
      if (or__3639__auto__) {
        return or__3639__auto__;
      } else {
        var or__3639__auto____$1 = cljs.core._prefers["_"];
        if (or__3639__auto____$1) {
          return or__3639__auto____$1;
        } else {
          throw cljs.core.missing_protocol.call(null, "IMultiFn.-prefers", mf);
        }
      }
    }().call(null, mf);
  }
};
cljs.core.throw_no_method_error = function throw_no_method_error(name, dispatch_val) {
  throw new Error("No method in multimethod '" + cljs.core.str.cljs$core$IFn$_invoke$arity$1(name) + "' for dispatch value: " + cljs.core.str.cljs$core$IFn$_invoke$arity$1(dispatch_val));
};
cljs.core.MultiFn = function(name, dispatch_fn, default_dispatch_val, hierarchy, method_table, prefer_table, method_cache, cached_hierarchy) {
  this.name = name;
  this.dispatch_fn = dispatch_fn;
  this.default_dispatch_val = default_dispatch_val;
  this.hierarchy = hierarchy;
  this.method_table = method_table;
  this.prefer_table = prefer_table;
  this.method_cache = method_cache;
  this.cached_hierarchy = cached_hierarchy;
  this.cljs$lang$protocol_mask$partition0$ = 4194305;
  this.cljs$lang$protocol_mask$partition1$ = 256;
};
cljs.core.MultiFn.cljs$lang$type = true;
cljs.core.MultiFn.cljs$lang$ctorStr = "cljs.core/MultiFn";
cljs.core.MultiFn.cljs$lang$ctorPrWriter = function(this__4215__auto__, writer__4216__auto__, opt__4217__auto__) {
  return cljs.core._write.call(null, writer__4216__auto__, "cljs.core/MultiFn");
};
cljs.core.MultiFn.prototype.cljs$core$IHash$_hash$arity$1 = function(this$) {
  var self__ = this;
  var this$__$1 = this;
  return goog.getUid(this$__$1);
};
cljs.core.MultiFn.prototype.cljs$core$IMultiFn$_reset$arity$1 = function(mf) {
  var self__ = this;
  var mf__$1 = this;
  cljs.core.swap_BANG_.call(null, self__.method_table, function(mf__$1) {
    return function(mf__$2) {
      return cljs.core.PersistentArrayMap.EMPTY;
    };
  }(mf__$1));
  cljs.core.swap_BANG_.call(null, self__.method_cache, function(mf__$1) {
    return function(mf__$2) {
      return cljs.core.PersistentArrayMap.EMPTY;
    };
  }(mf__$1));
  cljs.core.swap_BANG_.call(null, self__.prefer_table, function(mf__$1) {
    return function(mf__$2) {
      return cljs.core.PersistentArrayMap.EMPTY;
    };
  }(mf__$1));
  cljs.core.swap_BANG_.call(null, self__.cached_hierarchy, function(mf__$1) {
    return function(mf__$2) {
      return null;
    };
  }(mf__$1));
  return mf__$1;
};
cljs.core.MultiFn.prototype.cljs$core$IMultiFn$_add_method$arity$3 = function(mf, dispatch_val, method) {
  var self__ = this;
  var mf__$1 = this;
  cljs.core.swap_BANG_.call(null, self__.method_table, cljs.core.assoc, dispatch_val, method);
  cljs.core.reset_cache.call(null, self__.method_cache, self__.method_table, self__.cached_hierarchy, self__.hierarchy);
  return mf__$1;
};
cljs.core.MultiFn.prototype.cljs$core$IMultiFn$_remove_method$arity$2 = function(mf, dispatch_val) {
  var self__ = this;
  var mf__$1 = this;
  cljs.core.swap_BANG_.call(null, self__.method_table, cljs.core.dissoc, dispatch_val);
  cljs.core.reset_cache.call(null, self__.method_cache, self__.method_table, self__.cached_hierarchy, self__.hierarchy);
  return mf__$1;
};
cljs.core.MultiFn.prototype.cljs$core$IMultiFn$_get_method$arity$2 = function(mf, dispatch_val) {
  var self__ = this;
  var mf__$1 = this;
  if (cljs.core._EQ_.call(null, cljs.core.deref.call(null, self__.cached_hierarchy), cljs.core.deref.call(null, self__.hierarchy))) {
  } else {
    cljs.core.reset_cache.call(null, self__.method_cache, self__.method_table, self__.cached_hierarchy, self__.hierarchy);
  }
  var temp__4124__auto__ = cljs.core.deref.call(null, self__.method_cache).call(null, dispatch_val);
  if (cljs.core.truth_(temp__4124__auto__)) {
    var target_fn = temp__4124__auto__;
    return target_fn;
  } else {
    var temp__4124__auto____$1 = cljs.core.find_and_cache_best_method.call(null, self__.name, dispatch_val, self__.hierarchy, self__.method_table, self__.prefer_table, self__.method_cache, self__.cached_hierarchy);
    if (cljs.core.truth_(temp__4124__auto____$1)) {
      var target_fn = temp__4124__auto____$1;
      return target_fn;
    } else {
      return cljs.core.deref.call(null, self__.method_table).call(null, self__.default_dispatch_val);
    }
  }
};
cljs.core.MultiFn.prototype.cljs$core$IMultiFn$_prefer_method$arity$3 = function(mf, dispatch_val_x, dispatch_val_y) {
  var self__ = this;
  var mf__$1 = this;
  if (cljs.core.truth_(cljs.core.prefers_STAR_.call(null, dispatch_val_x, dispatch_val_y, self__.prefer_table))) {
    throw new Error("Preference conflict in multimethod '" + cljs.core.str.cljs$core$IFn$_invoke$arity$1(self__.name) + "': " + cljs.core.str.cljs$core$IFn$_invoke$arity$1(dispatch_val_y) + " is already preferred to " + cljs.core.str.cljs$core$IFn$_invoke$arity$1(dispatch_val_x));
  } else {
  }
  cljs.core.swap_BANG_.call(null, self__.prefer_table, function(mf__$1) {
    return function(old) {
      return cljs.core.assoc.call(null, old, dispatch_val_x, cljs.core.conj.call(null, cljs.core.get.call(null, old, dispatch_val_x, cljs.core.PersistentHashSet.EMPTY), dispatch_val_y));
    };
  }(mf__$1));
  return cljs.core.reset_cache.call(null, self__.method_cache, self__.method_table, self__.cached_hierarchy, self__.hierarchy);
};
cljs.core.MultiFn.prototype.cljs$core$IMultiFn$_methods$arity$1 = function(mf) {
  var self__ = this;
  var mf__$1 = this;
  return cljs.core.deref.call(null, self__.method_table);
};
cljs.core.MultiFn.prototype.cljs$core$IMultiFn$_prefers$arity$1 = function(mf) {
  var self__ = this;
  var mf__$1 = this;
  return cljs.core.deref.call(null, self__.prefer_table);
};
cljs.core.MultiFn.prototype.call = function() {
  var G__57343 = null;
  var G__57343__2 = function(self__, a) {
    var self__ = this;
    var self____$1 = this;
    var mf = self____$1;
    var dispatch_val = self__.dispatch_fn.call(null, a);
    var target_fn = mf.cljs$core$IMultiFn$_get_method$arity$2(null, dispatch_val);
    if (cljs.core.truth_(target_fn)) {
    } else {
      cljs.core.throw_no_method_error.call(null, self__.name, dispatch_val);
    }
    return target_fn.call(null, a);
  };
  var G__57343__3 = function(self__, a, b) {
    var self__ = this;
    var self____$1 = this;
    var mf = self____$1;
    var dispatch_val = self__.dispatch_fn.call(null, a, b);
    var target_fn = mf.cljs$core$IMultiFn$_get_method$arity$2(null, dispatch_val);
    if (cljs.core.truth_(target_fn)) {
    } else {
      cljs.core.throw_no_method_error.call(null, self__.name, dispatch_val);
    }
    return target_fn.call(null, a, b);
  };
  var G__57343__4 = function(self__, a, b, c) {
    var self__ = this;
    var self____$1 = this;
    var mf = self____$1;
    var dispatch_val = self__.dispatch_fn.call(null, a, b, c);
    var target_fn = mf.cljs$core$IMultiFn$_get_method$arity$2(null, dispatch_val);
    if (cljs.core.truth_(target_fn)) {
    } else {
      cljs.core.throw_no_method_error.call(null, self__.name, dispatch_val);
    }
    return target_fn.call(null, a, b, c);
  };
  var G__57343__5 = function(self__, a, b, c, d) {
    var self__ = this;
    var self____$1 = this;
    var mf = self____$1;
    var dispatch_val = self__.dispatch_fn.call(null, a, b, c, d);
    var target_fn = mf.cljs$core$IMultiFn$_get_method$arity$2(null, dispatch_val);
    if (cljs.core.truth_(target_fn)) {
    } else {
      cljs.core.throw_no_method_error.call(null, self__.name, dispatch_val);
    }
    return target_fn.call(null, a, b, c, d);
  };
  var G__57343__6 = function(self__, a, b, c, d, e) {
    var self__ = this;
    var self____$1 = this;
    var mf = self____$1;
    var dispatch_val = self__.dispatch_fn.call(null, a, b, c, d, e);
    var target_fn = mf.cljs$core$IMultiFn$_get_method$arity$2(null, dispatch_val);
    if (cljs.core.truth_(target_fn)) {
    } else {
      cljs.core.throw_no_method_error.call(null, self__.name, dispatch_val);
    }
    return target_fn.call(null, a, b, c, d, e);
  };
  var G__57343__7 = function(self__, a, b, c, d, e, f) {
    var self__ = this;
    var self____$1 = this;
    var mf = self____$1;
    var dispatch_val = self__.dispatch_fn.call(null, a, b, c, d, e, f);
    var target_fn = mf.cljs$core$IMultiFn$_get_method$arity$2(null, dispatch_val);
    if (cljs.core.truth_(target_fn)) {
    } else {
      cljs.core.throw_no_method_error.call(null, self__.name, dispatch_val);
    }
    return target_fn.call(null, a, b, c, d, e, f);
  };
  var G__57343__8 = function(self__, a, b, c, d, e, f, g) {
    var self__ = this;
    var self____$1 = this;
    var mf = self____$1;
    var dispatch_val = self__.dispatch_fn.call(null, a, b, c, d, e, f, g);
    var target_fn = mf.cljs$core$IMultiFn$_get_method$arity$2(null, dispatch_val);
    if (cljs.core.truth_(target_fn)) {
    } else {
      cljs.core.throw_no_method_error.call(null, self__.name, dispatch_val);
    }
    return target_fn.call(null, a, b, c, d, e, f, g);
  };
  var G__57343__9 = function(self__, a, b, c, d, e, f, g, h) {
    var self__ = this;
    var self____$1 = this;
    var mf = self____$1;
    var dispatch_val = self__.dispatch_fn.call(null, a, b, c, d, e, f, g, h);
    var target_fn = mf.cljs$core$IMultiFn$_get_method$arity$2(null, dispatch_val);
    if (cljs.core.truth_(target_fn)) {
    } else {
      cljs.core.throw_no_method_error.call(null, self__.name, dispatch_val);
    }
    return target_fn.call(null, a, b, c, d, e, f, g, h);
  };
  var G__57343__10 = function(self__, a, b, c, d, e, f, g, h, i) {
    var self__ = this;
    var self____$1 = this;
    var mf = self____$1;
    var dispatch_val = self__.dispatch_fn.call(null, a, b, c, d, e, f, g, h, i);
    var target_fn = mf.cljs$core$IMultiFn$_get_method$arity$2(null, dispatch_val);
    if (cljs.core.truth_(target_fn)) {
    } else {
      cljs.core.throw_no_method_error.call(null, self__.name, dispatch_val);
    }
    return target_fn.call(null, a, b, c, d, e, f, g, h, i);
  };
  var G__57343__11 = function(self__, a, b, c, d, e, f, g, h, i, j) {
    var self__ = this;
    var self____$1 = this;
    var mf = self____$1;
    var dispatch_val = self__.dispatch_fn.call(null, a, b, c, d, e, f, g, h, i, j);
    var target_fn = mf.cljs$core$IMultiFn$_get_method$arity$2(null, dispatch_val);
    if (cljs.core.truth_(target_fn)) {
    } else {
      cljs.core.throw_no_method_error.call(null, self__.name, dispatch_val);
    }
    return target_fn.call(null, a, b, c, d, e, f, g, h, i, j);
  };
  var G__57343__12 = function(self__, a, b, c, d, e, f, g, h, i, j, k) {
    var self__ = this;
    var self____$1 = this;
    var mf = self____$1;
    var dispatch_val = self__.dispatch_fn.call(null, a, b, c, d, e, f, g, h, i, j, k);
    var target_fn = mf.cljs$core$IMultiFn$_get_method$arity$2(null, dispatch_val);
    if (cljs.core.truth_(target_fn)) {
    } else {
      cljs.core.throw_no_method_error.call(null, self__.name, dispatch_val);
    }
    return target_fn.call(null, a, b, c, d, e, f, g, h, i, j, k);
  };
  var G__57343__13 = function(self__, a, b, c, d, e, f, g, h, i, j, k, l) {
    var self__ = this;
    var self____$1 = this;
    var mf = self____$1;
    var dispatch_val = self__.dispatch_fn.call(null, a, b, c, d, e, f, g, h, i, j, k, l);
    var target_fn = mf.cljs$core$IMultiFn$_get_method$arity$2(null, dispatch_val);
    if (cljs.core.truth_(target_fn)) {
    } else {
      cljs.core.throw_no_method_error.call(null, self__.name, dispatch_val);
    }
    return target_fn.call(null, a, b, c, d, e, f, g, h, i, j, k, l);
  };
  var G__57343__14 = function(self__, a, b, c, d, e, f, g, h, i, j, k, l, m) {
    var self__ = this;
    var self____$1 = this;
    var mf = self____$1;
    var dispatch_val = self__.dispatch_fn.call(null, a, b, c, d, e, f, g, h, i, j, k, l, m);
    var target_fn = mf.cljs$core$IMultiFn$_get_method$arity$2(null, dispatch_val);
    if (cljs.core.truth_(target_fn)) {
    } else {
      cljs.core.throw_no_method_error.call(null, self__.name, dispatch_val);
    }
    return target_fn.call(null, a, b, c, d, e, f, g, h, i, j, k, l, m);
  };
  var G__57343__15 = function(self__, a, b, c, d, e, f, g, h, i, j, k, l, m, n) {
    var self__ = this;
    var self____$1 = this;
    var mf = self____$1;
    var dispatch_val = self__.dispatch_fn.call(null, a, b, c, d, e, f, g, h, i, j, k, l, m, n);
    var target_fn = mf.cljs$core$IMultiFn$_get_method$arity$2(null, dispatch_val);
    if (cljs.core.truth_(target_fn)) {
    } else {
      cljs.core.throw_no_method_error.call(null, self__.name, dispatch_val);
    }
    return target_fn.call(null, a, b, c, d, e, f, g, h, i, j, k, l, m, n);
  };
  var G__57343__16 = function(self__, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o) {
    var self__ = this;
    var self____$1 = this;
    var mf = self____$1;
    var dispatch_val = self__.dispatch_fn.call(null, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o);
    var target_fn = mf.cljs$core$IMultiFn$_get_method$arity$2(null, dispatch_val);
    if (cljs.core.truth_(target_fn)) {
    } else {
      cljs.core.throw_no_method_error.call(null, self__.name, dispatch_val);
    }
    return target_fn.call(null, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o);
  };
  var G__57343__17 = function(self__, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p) {
    var self__ = this;
    var self____$1 = this;
    var mf = self____$1;
    var dispatch_val = self__.dispatch_fn.call(null, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p);
    var target_fn = mf.cljs$core$IMultiFn$_get_method$arity$2(null, dispatch_val);
    if (cljs.core.truth_(target_fn)) {
    } else {
      cljs.core.throw_no_method_error.call(null, self__.name, dispatch_val);
    }
    return target_fn.call(null, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p);
  };
  var G__57343__18 = function(self__, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q) {
    var self__ = this;
    var self____$1 = this;
    var mf = self____$1;
    var dispatch_val = self__.dispatch_fn.call(null, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q);
    var target_fn = mf.cljs$core$IMultiFn$_get_method$arity$2(null, dispatch_val);
    if (cljs.core.truth_(target_fn)) {
    } else {
      cljs.core.throw_no_method_error.call(null, self__.name, dispatch_val);
    }
    return target_fn.call(null, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q);
  };
  var G__57343__19 = function(self__, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r) {
    var self__ = this;
    var self____$1 = this;
    var mf = self____$1;
    var dispatch_val = self__.dispatch_fn.call(null, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r);
    var target_fn = mf.cljs$core$IMultiFn$_get_method$arity$2(null, dispatch_val);
    if (cljs.core.truth_(target_fn)) {
    } else {
      cljs.core.throw_no_method_error.call(null, self__.name, dispatch_val);
    }
    return target_fn.call(null, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r);
  };
  var G__57343__20 = function(self__, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s) {
    var self__ = this;
    var self____$1 = this;
    var mf = self____$1;
    var dispatch_val = self__.dispatch_fn.call(null, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s);
    var target_fn = mf.cljs$core$IMultiFn$_get_method$arity$2(null, dispatch_val);
    if (cljs.core.truth_(target_fn)) {
    } else {
      cljs.core.throw_no_method_error.call(null, self__.name, dispatch_val);
    }
    return target_fn.call(null, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s);
  };
  var G__57343__21 = function(self__, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t) {
    var self__ = this;
    var self____$1 = this;
    var mf = self____$1;
    var dispatch_val = self__.dispatch_fn.call(null, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t);
    var target_fn = mf.cljs$core$IMultiFn$_get_method$arity$2(null, dispatch_val);
    if (cljs.core.truth_(target_fn)) {
    } else {
      cljs.core.throw_no_method_error.call(null, self__.name, dispatch_val);
    }
    return target_fn.call(null, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t);
  };
  var G__57343__22 = function(self__, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, rest) {
    var self__ = this;
    var self____$1 = this;
    var mf = self____$1;
    var dispatch_val = cljs.core.apply.call(null, self__.dispatch_fn, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, rest);
    var target_fn = mf.cljs$core$IMultiFn$_get_method$arity$2(null, dispatch_val);
    if (cljs.core.truth_(target_fn)) {
    } else {
      cljs.core.throw_no_method_error.call(null, self__.name, dispatch_val);
    }
    return cljs.core.apply.call(null, target_fn, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, rest);
  };
  G__57343 = function(self__, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, rest) {
    switch(arguments.length) {
      case 2:
        return G__57343__2.call(this, self__, a);
      case 3:
        return G__57343__3.call(this, self__, a, b);
      case 4:
        return G__57343__4.call(this, self__, a, b, c);
      case 5:
        return G__57343__5.call(this, self__, a, b, c, d);
      case 6:
        return G__57343__6.call(this, self__, a, b, c, d, e);
      case 7:
        return G__57343__7.call(this, self__, a, b, c, d, e, f);
      case 8:
        return G__57343__8.call(this, self__, a, b, c, d, e, f, g);
      case 9:
        return G__57343__9.call(this, self__, a, b, c, d, e, f, g, h);
      case 10:
        return G__57343__10.call(this, self__, a, b, c, d, e, f, g, h, i);
      case 11:
        return G__57343__11.call(this, self__, a, b, c, d, e, f, g, h, i, j);
      case 12:
        return G__57343__12.call(this, self__, a, b, c, d, e, f, g, h, i, j, k);
      case 13:
        return G__57343__13.call(this, self__, a, b, c, d, e, f, g, h, i, j, k, l);
      case 14:
        return G__57343__14.call(this, self__, a, b, c, d, e, f, g, h, i, j, k, l, m);
      case 15:
        return G__57343__15.call(this, self__, a, b, c, d, e, f, g, h, i, j, k, l, m, n);
      case 16:
        return G__57343__16.call(this, self__, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o);
      case 17:
        return G__57343__17.call(this, self__, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p);
      case 18:
        return G__57343__18.call(this, self__, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q);
      case 19:
        return G__57343__19.call(this, self__, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r);
      case 20:
        return G__57343__20.call(this, self__, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s);
      case 21:
        return G__57343__21.call(this, self__, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t);
      case 22:
        return G__57343__22.call(this, self__, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, rest);
    }
    throw new Error("Invalid arity: " + arguments.length);
  };
  G__57343.cljs$core$IFn$_invoke$arity$2 = G__57343__2;
  G__57343.cljs$core$IFn$_invoke$arity$3 = G__57343__3;
  G__57343.cljs$core$IFn$_invoke$arity$4 = G__57343__4;
  G__57343.cljs$core$IFn$_invoke$arity$5 = G__57343__5;
  G__57343.cljs$core$IFn$_invoke$arity$6 = G__57343__6;
  G__57343.cljs$core$IFn$_invoke$arity$7 = G__57343__7;
  G__57343.cljs$core$IFn$_invoke$arity$8 = G__57343__8;
  G__57343.cljs$core$IFn$_invoke$arity$9 = G__57343__9;
  G__57343.cljs$core$IFn$_invoke$arity$10 = G__57343__10;
  G__57343.cljs$core$IFn$_invoke$arity$11 = G__57343__11;
  G__57343.cljs$core$IFn$_invoke$arity$12 = G__57343__12;
  G__57343.cljs$core$IFn$_invoke$arity$13 = G__57343__13;
  G__57343.cljs$core$IFn$_invoke$arity$14 = G__57343__14;
  G__57343.cljs$core$IFn$_invoke$arity$15 = G__57343__15;
  G__57343.cljs$core$IFn$_invoke$arity$16 = G__57343__16;
  G__57343.cljs$core$IFn$_invoke$arity$17 = G__57343__17;
  G__57343.cljs$core$IFn$_invoke$arity$18 = G__57343__18;
  G__57343.cljs$core$IFn$_invoke$arity$19 = G__57343__19;
  G__57343.cljs$core$IFn$_invoke$arity$20 = G__57343__20;
  G__57343.cljs$core$IFn$_invoke$arity$21 = G__57343__21;
  G__57343.cljs$core$IFn$_invoke$arity$22 = G__57343__22;
  return G__57343;
}();
cljs.core.MultiFn.prototype.apply = function(self__, args57342) {
  var self__ = this;
  var self____$1 = this;
  return self____$1.call.apply(self____$1, [self____$1].concat(cljs.core.aclone.call(null, args57342)));
};
cljs.core.MultiFn.prototype.cljs$core$IFn$_invoke$arity$1 = function(a) {
  var self__ = this;
  var mf = this;
  var dispatch_val = self__.dispatch_fn.call(null, a);
  var target_fn = mf.cljs$core$IMultiFn$_get_method$arity$2(null, dispatch_val);
  if (cljs.core.truth_(target_fn)) {
  } else {
    cljs.core.throw_no_method_error.call(null, self__.name, dispatch_val);
  }
  return target_fn.call(null, a);
};
cljs.core.MultiFn.prototype.cljs$core$IFn$_invoke$arity$2 = function(a, b) {
  var self__ = this;
  var mf = this;
  var dispatch_val = self__.dispatch_fn.call(null, a, b);
  var target_fn = mf.cljs$core$IMultiFn$_get_method$arity$2(null, dispatch_val);
  if (cljs.core.truth_(target_fn)) {
  } else {
    cljs.core.throw_no_method_error.call(null, self__.name, dispatch_val);
  }
  return target_fn.call(null, a, b);
};
cljs.core.MultiFn.prototype.cljs$core$IFn$_invoke$arity$3 = function(a, b, c) {
  var self__ = this;
  var mf = this;
  var dispatch_val = self__.dispatch_fn.call(null, a, b, c);
  var target_fn = mf.cljs$core$IMultiFn$_get_method$arity$2(null, dispatch_val);
  if (cljs.core.truth_(target_fn)) {
  } else {
    cljs.core.throw_no_method_error.call(null, self__.name, dispatch_val);
  }
  return target_fn.call(null, a, b, c);
};
cljs.core.MultiFn.prototype.cljs$core$IFn$_invoke$arity$4 = function(a, b, c, d) {
  var self__ = this;
  var mf = this;
  var dispatch_val = self__.dispatch_fn.call(null, a, b, c, d);
  var target_fn = mf.cljs$core$IMultiFn$_get_method$arity$2(null, dispatch_val);
  if (cljs.core.truth_(target_fn)) {
  } else {
    cljs.core.throw_no_method_error.call(null, self__.name, dispatch_val);
  }
  return target_fn.call(null, a, b, c, d);
};
cljs.core.MultiFn.prototype.cljs$core$IFn$_invoke$arity$5 = function(a, b, c, d, e) {
  var self__ = this;
  var mf = this;
  var dispatch_val = self__.dispatch_fn.call(null, a, b, c, d, e);
  var target_fn = mf.cljs$core$IMultiFn$_get_method$arity$2(null, dispatch_val);
  if (cljs.core.truth_(target_fn)) {
  } else {
    cljs.core.throw_no_method_error.call(null, self__.name, dispatch_val);
  }
  return target_fn.call(null, a, b, c, d, e);
};
cljs.core.MultiFn.prototype.cljs$core$IFn$_invoke$arity$6 = function(a, b, c, d, e, f) {
  var self__ = this;
  var mf = this;
  var dispatch_val = self__.dispatch_fn.call(null, a, b, c, d, e, f);
  var target_fn = mf.cljs$core$IMultiFn$_get_method$arity$2(null, dispatch_val);
  if (cljs.core.truth_(target_fn)) {
  } else {
    cljs.core.throw_no_method_error.call(null, self__.name, dispatch_val);
  }
  return target_fn.call(null, a, b, c, d, e, f);
};
cljs.core.MultiFn.prototype.cljs$core$IFn$_invoke$arity$7 = function(a, b, c, d, e, f, g) {
  var self__ = this;
  var mf = this;
  var dispatch_val = self__.dispatch_fn.call(null, a, b, c, d, e, f, g);
  var target_fn = mf.cljs$core$IMultiFn$_get_method$arity$2(null, dispatch_val);
  if (cljs.core.truth_(target_fn)) {
  } else {
    cljs.core.throw_no_method_error.call(null, self__.name, dispatch_val);
  }
  return target_fn.call(null, a, b, c, d, e, f, g);
};
cljs.core.MultiFn.prototype.cljs$core$IFn$_invoke$arity$8 = function(a, b, c, d, e, f, g, h) {
  var self__ = this;
  var mf = this;
  var dispatch_val = self__.dispatch_fn.call(null, a, b, c, d, e, f, g, h);
  var target_fn = mf.cljs$core$IMultiFn$_get_method$arity$2(null, dispatch_val);
  if (cljs.core.truth_(target_fn)) {
  } else {
    cljs.core.throw_no_method_error.call(null, self__.name, dispatch_val);
  }
  return target_fn.call(null, a, b, c, d, e, f, g, h);
};
cljs.core.MultiFn.prototype.cljs$core$IFn$_invoke$arity$9 = function(a, b, c, d, e, f, g, h, i) {
  var self__ = this;
  var mf = this;
  var dispatch_val = self__.dispatch_fn.call(null, a, b, c, d, e, f, g, h, i);
  var target_fn = mf.cljs$core$IMultiFn$_get_method$arity$2(null, dispatch_val);
  if (cljs.core.truth_(target_fn)) {
  } else {
    cljs.core.throw_no_method_error.call(null, self__.name, dispatch_val);
  }
  return target_fn.call(null, a, b, c, d, e, f, g, h, i);
};
cljs.core.MultiFn.prototype.cljs$core$IFn$_invoke$arity$10 = function(a, b, c, d, e, f, g, h, i, j) {
  var self__ = this;
  var mf = this;
  var dispatch_val = self__.dispatch_fn.call(null, a, b, c, d, e, f, g, h, i, j);
  var target_fn = mf.cljs$core$IMultiFn$_get_method$arity$2(null, dispatch_val);
  if (cljs.core.truth_(target_fn)) {
  } else {
    cljs.core.throw_no_method_error.call(null, self__.name, dispatch_val);
  }
  return target_fn.call(null, a, b, c, d, e, f, g, h, i, j);
};
cljs.core.MultiFn.prototype.cljs$core$IFn$_invoke$arity$11 = function(a, b, c, d, e, f, g, h, i, j, k) {
  var self__ = this;
  var mf = this;
  var dispatch_val = self__.dispatch_fn.call(null, a, b, c, d, e, f, g, h, i, j, k);
  var target_fn = mf.cljs$core$IMultiFn$_get_method$arity$2(null, dispatch_val);
  if (cljs.core.truth_(target_fn)) {
  } else {
    cljs.core.throw_no_method_error.call(null, self__.name, dispatch_val);
  }
  return target_fn.call(null, a, b, c, d, e, f, g, h, i, j, k);
};
cljs.core.MultiFn.prototype.cljs$core$IFn$_invoke$arity$12 = function(a, b, c, d, e, f, g, h, i, j, k, l) {
  var self__ = this;
  var mf = this;
  var dispatch_val = self__.dispatch_fn.call(null, a, b, c, d, e, f, g, h, i, j, k, l);
  var target_fn = mf.cljs$core$IMultiFn$_get_method$arity$2(null, dispatch_val);
  if (cljs.core.truth_(target_fn)) {
  } else {
    cljs.core.throw_no_method_error.call(null, self__.name, dispatch_val);
  }
  return target_fn.call(null, a, b, c, d, e, f, g, h, i, j, k, l);
};
cljs.core.MultiFn.prototype.cljs$core$IFn$_invoke$arity$13 = function(a, b, c, d, e, f, g, h, i, j, k, l, m) {
  var self__ = this;
  var mf = this;
  var dispatch_val = self__.dispatch_fn.call(null, a, b, c, d, e, f, g, h, i, j, k, l, m);
  var target_fn = mf.cljs$core$IMultiFn$_get_method$arity$2(null, dispatch_val);
  if (cljs.core.truth_(target_fn)) {
  } else {
    cljs.core.throw_no_method_error.call(null, self__.name, dispatch_val);
  }
  return target_fn.call(null, a, b, c, d, e, f, g, h, i, j, k, l, m);
};
cljs.core.MultiFn.prototype.cljs$core$IFn$_invoke$arity$14 = function(a, b, c, d, e, f, g, h, i, j, k, l, m, n) {
  var self__ = this;
  var mf = this;
  var dispatch_val = self__.dispatch_fn.call(null, a, b, c, d, e, f, g, h, i, j, k, l, m, n);
  var target_fn = mf.cljs$core$IMultiFn$_get_method$arity$2(null, dispatch_val);
  if (cljs.core.truth_(target_fn)) {
  } else {
    cljs.core.throw_no_method_error.call(null, self__.name, dispatch_val);
  }
  return target_fn.call(null, a, b, c, d, e, f, g, h, i, j, k, l, m, n);
};
cljs.core.MultiFn.prototype.cljs$core$IFn$_invoke$arity$15 = function(a, b, c, d, e, f, g, h, i, j, k, l, m, n, o) {
  var self__ = this;
  var mf = this;
  var dispatch_val = self__.dispatch_fn.call(null, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o);
  var target_fn = mf.cljs$core$IMultiFn$_get_method$arity$2(null, dispatch_val);
  if (cljs.core.truth_(target_fn)) {
  } else {
    cljs.core.throw_no_method_error.call(null, self__.name, dispatch_val);
  }
  return target_fn.call(null, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o);
};
cljs.core.MultiFn.prototype.cljs$core$IFn$_invoke$arity$16 = function(a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p) {
  var self__ = this;
  var mf = this;
  var dispatch_val = self__.dispatch_fn.call(null, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p);
  var target_fn = mf.cljs$core$IMultiFn$_get_method$arity$2(null, dispatch_val);
  if (cljs.core.truth_(target_fn)) {
  } else {
    cljs.core.throw_no_method_error.call(null, self__.name, dispatch_val);
  }
  return target_fn.call(null, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p);
};
cljs.core.MultiFn.prototype.cljs$core$IFn$_invoke$arity$17 = function(a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q) {
  var self__ = this;
  var mf = this;
  var dispatch_val = self__.dispatch_fn.call(null, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q);
  var target_fn = mf.cljs$core$IMultiFn$_get_method$arity$2(null, dispatch_val);
  if (cljs.core.truth_(target_fn)) {
  } else {
    cljs.core.throw_no_method_error.call(null, self__.name, dispatch_val);
  }
  return target_fn.call(null, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q);
};
cljs.core.MultiFn.prototype.cljs$core$IFn$_invoke$arity$18 = function(a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r) {
  var self__ = this;
  var mf = this;
  var dispatch_val = self__.dispatch_fn.call(null, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r);
  var target_fn = mf.cljs$core$IMultiFn$_get_method$arity$2(null, dispatch_val);
  if (cljs.core.truth_(target_fn)) {
  } else {
    cljs.core.throw_no_method_error.call(null, self__.name, dispatch_val);
  }
  return target_fn.call(null, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r);
};
cljs.core.MultiFn.prototype.cljs$core$IFn$_invoke$arity$19 = function(a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s) {
  var self__ = this;
  var mf = this;
  var dispatch_val = self__.dispatch_fn.call(null, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s);
  var target_fn = mf.cljs$core$IMultiFn$_get_method$arity$2(null, dispatch_val);
  if (cljs.core.truth_(target_fn)) {
  } else {
    cljs.core.throw_no_method_error.call(null, self__.name, dispatch_val);
  }
  return target_fn.call(null, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s);
};
cljs.core.MultiFn.prototype.cljs$core$IFn$_invoke$arity$20 = function(a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t) {
  var self__ = this;
  var mf = this;
  var dispatch_val = self__.dispatch_fn.call(null, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t);
  var target_fn = mf.cljs$core$IMultiFn$_get_method$arity$2(null, dispatch_val);
  if (cljs.core.truth_(target_fn)) {
  } else {
    cljs.core.throw_no_method_error.call(null, self__.name, dispatch_val);
  }
  return target_fn.call(null, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t);
};
cljs.core.MultiFn.prototype.cljs$core$IFn$_invoke$arity$21 = function(a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, rest) {
  var self__ = this;
  var mf = this;
  var dispatch_val = cljs.core.apply.call(null, self__.dispatch_fn, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, rest);
  var target_fn = mf.cljs$core$IMultiFn$_get_method$arity$2(null, dispatch_val);
  if (cljs.core.truth_(target_fn)) {
  } else {
    cljs.core.throw_no_method_error.call(null, self__.name, dispatch_val);
  }
  return cljs.core.apply.call(null, target_fn, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, rest);
};
cljs.core.__GT_MultiFn = function __GT_MultiFn(name, dispatch_fn, default_dispatch_val, hierarchy, method_table, prefer_table, method_cache, cached_hierarchy) {
  return new cljs.core.MultiFn(name, dispatch_fn, default_dispatch_val, hierarchy, method_table, prefer_table, method_cache, cached_hierarchy);
};
cljs.core.remove_all_methods = function remove_all_methods(multifn) {
  return cljs.core._reset.call(null, multifn);
};
cljs.core.remove_method = function remove_method(multifn, dispatch_val) {
  return cljs.core._remove_method.call(null, multifn, dispatch_val);
};
cljs.core.prefer_method = function prefer_method(multifn, dispatch_val_x, dispatch_val_y) {
  return cljs.core._prefer_method.call(null, multifn, dispatch_val_x, dispatch_val_y);
};
cljs.core.methods$ = function methods$(multifn) {
  return cljs.core._methods.call(null, multifn);
};
cljs.core.get_method = function get_method(multifn, dispatch_val) {
  return cljs.core._get_method.call(null, multifn, dispatch_val);
};
cljs.core.prefers = function prefers(multifn) {
  return cljs.core._prefers.call(null, multifn);
};
cljs.core.UUID = function(uuid) {
  this.uuid = uuid;
  this.cljs$lang$protocol_mask$partition1$ = 0;
  this.cljs$lang$protocol_mask$partition0$ = 2153775104;
};
cljs.core.UUID.cljs$lang$type = true;
cljs.core.UUID.cljs$lang$ctorStr = "cljs.core/UUID";
cljs.core.UUID.cljs$lang$ctorPrWriter = function(this__4215__auto__, writer__4216__auto__, opt__4217__auto__) {
  return cljs.core._write.call(null, writer__4216__auto__, "cljs.core/UUID");
};
cljs.core.UUID.prototype.cljs$core$IHash$_hash$arity$1 = function(this$) {
  var self__ = this;
  var this$__$1 = this;
  return goog.string.hashCode(cljs.core.pr_str.call(null, this$__$1));
};
cljs.core.UUID.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(_, writer, ___$1) {
  var self__ = this;
  var ___$2 = this;
  return cljs.core._write.call(null, writer, '#uuid "' + cljs.core.str.cljs$core$IFn$_invoke$arity$1(self__.uuid) + '"');
};
cljs.core.UUID.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(_, other) {
  var self__ = this;
  var ___$1 = this;
  return other instanceof cljs.core.UUID && self__.uuid === other.uuid;
};
cljs.core.UUID.prototype.toString = function() {
  var self__ = this;
  var _ = this;
  return self__.uuid;
};
cljs.core.UUID.prototype.equiv = function(other) {
  var self__ = this;
  var this$ = this;
  return this$.cljs$core$IEquiv$_equiv$arity$2(null, other);
};
cljs.core.__GT_UUID = function __GT_UUID(uuid) {
  return new cljs.core.UUID(uuid);
};
cljs.core.ExceptionInfo = function(message, data, cause) {
  this.message = message;
  this.data = data;
  this.cause = cause;
};
cljs.core.ExceptionInfo.cljs$lang$type = true;
cljs.core.ExceptionInfo.cljs$lang$ctorStr = "cljs.core/ExceptionInfo";
cljs.core.ExceptionInfo.cljs$lang$ctorPrWriter = function(this__4218__auto__, writer__4219__auto__, opts__4220__auto__) {
  return cljs.core._write.call(null, writer__4219__auto__, "cljs.core/ExceptionInfo");
};
cljs.core.__GT_ExceptionInfo = function __GT_ExceptionInfo(message, data, cause) {
  return new cljs.core.ExceptionInfo(message, data, cause);
};
cljs.core.ExceptionInfo.prototype = new Error;
cljs.core.ExceptionInfo.prototype.constructor = cljs.core.ExceptionInfo;
cljs.core.ex_info = function() {
  var ex_info = null;
  var ex_info__2 = function(msg, map) {
    return new cljs.core.ExceptionInfo(msg, map, null);
  };
  var ex_info__3 = function(msg, map, cause) {
    return new cljs.core.ExceptionInfo(msg, map, cause);
  };
  ex_info = function(msg, map, cause) {
    switch(arguments.length) {
      case 2:
        return ex_info__2.call(this, msg, map);
      case 3:
        return ex_info__3.call(this, msg, map, cause);
    }
    throw new Error("Invalid arity: " + arguments.length);
  };
  ex_info.cljs$core$IFn$_invoke$arity$2 = ex_info__2;
  ex_info.cljs$core$IFn$_invoke$arity$3 = ex_info__3;
  return ex_info;
}();
cljs.core.ex_data = function ex_data(ex) {
  if (ex instanceof cljs.core.ExceptionInfo) {
    return ex.data;
  } else {
    return null;
  }
};
cljs.core.ex_message = function ex_message(ex) {
  if (ex instanceof Error) {
    return ex.message;
  } else {
    return null;
  }
};
cljs.core.ex_cause = function ex_cause(ex) {
  if (ex instanceof cljs.core.ExceptionInfo) {
    return ex.cause;
  } else {
    return null;
  }
};
cljs.core.comparator = function comparator(pred) {
  return function(x, y) {
    if (cljs.core.truth_(pred.call(null, x, y))) {
      return-1;
    } else {
      if (cljs.core.truth_(pred.call(null, y, x))) {
        return 1;
      } else {
        return 0;
      }
    }
  };
};
cljs.core.special_symbol_QMARK_ = function special_symbol_QMARK_(x) {
  return cljs.core.contains_QMARK_.call(null, new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 19, [new cljs.core.Symbol(null, "\x26", "\x26", -2144855648, null), null, new cljs.core.Symbol(null, "defrecord*", "defrecord*", -1936366207, null), null, new cljs.core.Symbol(null, "try", "try", -1273693247, null), null, new cljs.core.Symbol(null, "loop*", "loop*", 615029416, null), null, new cljs.core.Symbol(null, "do", "do", 1686842252, null), null, new cljs.core.Symbol(null, 
  "letfn*", "letfn*", -110097810, null), null, new cljs.core.Symbol(null, "if", "if", 1181717262, null), null, new cljs.core.Symbol(null, "new", "new", -444906321, null), null, new cljs.core.Symbol(null, "ns", "ns", 2082130287, null), null, new cljs.core.Symbol(null, "deftype*", "deftype*", 962659890, null), null, new cljs.core.Symbol(null, "let*", "let*", 1920721458, null), null, new cljs.core.Symbol(null, "js*", "js*", -1134233646, null), null, new cljs.core.Symbol(null, "fn*", "fn*", -752876845, 
  null), null, new cljs.core.Symbol(null, "recur", "recur", 1202958259, null), null, new cljs.core.Symbol(null, "set!", "set!", 250714521, null), null, new cljs.core.Symbol(null, ".", ".", 1975675962, null), null, new cljs.core.Symbol(null, "quote", "quote", 1377916282, null), null, new cljs.core.Symbol(null, "throw", "throw", 595905694, null), null, new cljs.core.Symbol(null, "def", "def", 597100991, null), null], null), null), x);
};
goog.provide("wikihole.pluginjs");
goog.require("cljs.core");
wikihole.pluginjs.paramStr = "userId\x3d0";
cljs.core.enable_console_print_BANG_.call(null);
wikihole.pluginjs.wiki_title = "Wikipedia, the free encyclopedia";
wikihole.pluginjs.days_ago = function days_ago(days) {
  return(new Date).getTime() - 1E3 * 60 * 60 * 24 * days;
};
wikihole.pluginjs.search_object = function search_object(days) {
  var obj56091 = {"text":" - " + cljs.core.str.cljs$core$IFn$_invoke$arity$1(wikihole.pluginjs.wiki_title), "startTime":wikihole.pluginjs.days_ago.call(null, days)};
  return obj56091;
};
wikihole.pluginjs.clean_title = function clean_title(unclean_title) {
  return unclean_title.replace(" - " + cljs.core.str.cljs$core$IFn$_invoke$arity$1(wikihole.pluginjs.wiki_title), "");
};
wikihole.pluginjs.process_history = function process_history(hist) {
  var visits = [];
  var seq__56100_56108 = cljs.core.seq.call(null, hist);
  var chunk__56101_56109 = null;
  var count__56102_56110 = 0;
  var i__56103_56111 = 0;
  while (true) {
    if (i__56103_56111 < count__56102_56110) {
      var itm_56112 = cljs.core._nth.call(null, chunk__56101_56109, i__56103_56111);
      if (!cljs.core._EQ_.call(null, itm_56112.title, wikihole.pluginjs.wiki_title)) {
        document.getElementById("output").innerHTML = document.getElementById("output").innerHTML + ("\x3cli\x3e" + cljs.core.str.cljs$core$IFn$_invoke$arity$1(wikihole.pluginjs.clean_title.call(null, itm_56112.title)) + "\x3c/li\x3e");
        visits.push(function() {
          var obj56105 = {"time_visited":itm_56112.lastVisitTime, "url":itm_56112.url};
          return obj56105;
        }());
      } else {
      }
      var G__56113 = seq__56100_56108;
      var G__56114 = chunk__56101_56109;
      var G__56115 = count__56102_56110;
      var G__56116 = i__56103_56111 + 1;
      seq__56100_56108 = G__56113;
      chunk__56101_56109 = G__56114;
      count__56102_56110 = G__56115;
      i__56103_56111 = G__56116;
      continue;
    } else {
      var temp__4126__auto___56117 = cljs.core.seq.call(null, seq__56100_56108);
      if (temp__4126__auto___56117) {
        var seq__56100_56118__$1 = temp__4126__auto___56117;
        if (cljs.core.chunked_seq_QMARK_.call(null, seq__56100_56118__$1)) {
          var c__4408__auto___56119 = cljs.core.chunk_first.call(null, seq__56100_56118__$1);
          var G__56120 = cljs.core.chunk_rest.call(null, seq__56100_56118__$1);
          var G__56121 = c__4408__auto___56119;
          var G__56122 = cljs.core.count.call(null, c__4408__auto___56119);
          var G__56123 = 0;
          seq__56100_56108 = G__56120;
          chunk__56101_56109 = G__56121;
          count__56102_56110 = G__56122;
          i__56103_56111 = G__56123;
          continue;
        } else {
          var itm_56124 = cljs.core.first.call(null, seq__56100_56118__$1);
          if (!cljs.core._EQ_.call(null, itm_56124.title, wikihole.pluginjs.wiki_title)) {
            document.getElementById("output").innerHTML = document.getElementById("output").innerHTML + ("\x3cli\x3e" + cljs.core.str.cljs$core$IFn$_invoke$arity$1(wikihole.pluginjs.clean_title.call(null, itm_56124.title)) + "\x3c/li\x3e");
            visits.push(function() {
              var obj56107 = {"time_visited":itm_56124.lastVisitTime, "url":itm_56124.url};
              return obj56107;
            }());
          } else {
          }
          var G__56125 = cljs.core.next.call(null, seq__56100_56118__$1);
          var G__56126 = null;
          var G__56127 = 0;
          var G__56128 = 0;
          seq__56100_56108 = G__56125;
          chunk__56101_56109 = G__56126;
          count__56102_56110 = G__56127;
          i__56103_56111 = G__56128;
          continue;
        }
      } else {
      }
    }
    break;
  }
  return wikihole.pluginjs.send_visits.call(null, visits);
};
wikihole.pluginjs.send_visits = function send_visits(visits) {
  var http = new XMLHttpRequest;
  http.open("POST", "http://localhost:3000/user/1/trip", true);
  http.setRequestHeader("Content-Type", "application/json");
  return http.send(JSON.stringify(function() {
    var obj56132 = {"trip":visits};
    return obj56132;
  }()));
};
wikihole.pluginjs.collect_data = function collect_data() {
  var days_ago = parseInt(document.getElementById("num-days").value);
  if (cljs.core.truth_(function() {
    var and__3627__auto__ = chrome;
    if (cljs.core.truth_(and__3627__auto__)) {
      var and__3627__auto____$1 = chrome.history;
      if (cljs.core.truth_(and__3627__auto____$1)) {
        return typeof days_ago === "number" && days_ago > 0;
      } else {
        return and__3627__auto____$1;
      }
    } else {
      return and__3627__auto__;
    }
  }())) {
    return chrome.history.search(wikihole.pluginjs.search_object.call(null, days_ago), wikihole.pluginjs.process_history);
  } else {
    return null;
  }
};
wikihole.pluginjs.init = function init() {
  if (cljs.core.truth_(function() {
    var and__3627__auto__ = function() {
      var and__3627__auto__ = document;
      if (cljs.core.truth_(and__3627__auto__)) {
        return document.getElementById;
      } else {
        return and__3627__auto__;
      }
    }();
    if (cljs.core.truth_(and__3627__auto__)) {
      return wikihole.pluginjs.collect_data;
    } else {
      return and__3627__auto__;
    }
  }())) {
    var btn = document.getElementById("send-data");
    return btn.onclick = wikihole.pluginjs.collect_data;
  } else {
    return null;
  }
};
window.onload = wikihole.pluginjs.init;
