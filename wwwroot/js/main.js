(function(scope){
'use strict';

function F(arity, fun, wrapper) {
  wrapper.a = arity;
  wrapper.f = fun;
  return wrapper;
}

function F2(fun) {
  return F(2, fun, function(a) { return function(b) { return fun(a,b); }; })
}
function F3(fun) {
  return F(3, fun, function(a) {
    return function(b) { return function(c) { return fun(a, b, c); }; };
  });
}
function F4(fun) {
  return F(4, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return fun(a, b, c, d); }; }; };
  });
}
function F5(fun) {
  return F(5, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return fun(a, b, c, d, e); }; }; }; };
  });
}
function F6(fun) {
  return F(6, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return fun(a, b, c, d, e, f); }; }; }; }; };
  });
}
function F7(fun) {
  return F(7, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return fun(a, b, c, d, e, f, g); }; }; }; }; }; };
  });
}
function F8(fun) {
  return F(8, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) {
    return fun(a, b, c, d, e, f, g, h); }; }; }; }; }; }; };
  });
}
function F9(fun) {
  return F(9, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) { return function(i) {
    return fun(a, b, c, d, e, f, g, h, i); }; }; }; }; }; }; }; };
  });
}

function A2(fun, a, b) {
  return fun.a === 2 ? fun.f(a, b) : fun(a)(b);
}
function A3(fun, a, b, c) {
  return fun.a === 3 ? fun.f(a, b, c) : fun(a)(b)(c);
}
function A4(fun, a, b, c, d) {
  return fun.a === 4 ? fun.f(a, b, c, d) : fun(a)(b)(c)(d);
}
function A5(fun, a, b, c, d, e) {
  return fun.a === 5 ? fun.f(a, b, c, d, e) : fun(a)(b)(c)(d)(e);
}
function A6(fun, a, b, c, d, e, f) {
  return fun.a === 6 ? fun.f(a, b, c, d, e, f) : fun(a)(b)(c)(d)(e)(f);
}
function A7(fun, a, b, c, d, e, f, g) {
  return fun.a === 7 ? fun.f(a, b, c, d, e, f, g) : fun(a)(b)(c)(d)(e)(f)(g);
}
function A8(fun, a, b, c, d, e, f, g, h) {
  return fun.a === 8 ? fun.f(a, b, c, d, e, f, g, h) : fun(a)(b)(c)(d)(e)(f)(g)(h);
}
function A9(fun, a, b, c, d, e, f, g, h, i) {
  return fun.a === 9 ? fun.f(a, b, c, d, e, f, g, h, i) : fun(a)(b)(c)(d)(e)(f)(g)(h)(i);
}




// EQUALITY

function _Utils_eq(x, y)
{
	for (
		var pair, stack = [], isEqual = _Utils_eqHelp(x, y, 0, stack);
		isEqual && (pair = stack.pop());
		isEqual = _Utils_eqHelp(pair.a, pair.b, 0, stack)
		)
	{}

	return isEqual;
}

function _Utils_eqHelp(x, y, depth, stack)
{
	if (x === y)
	{
		return true;
	}

	if (typeof x !== 'object' || x === null || y === null)
	{
		typeof x === 'function' && _Debug_crash(5);
		return false;
	}

	if (depth > 100)
	{
		stack.push(_Utils_Tuple2(x,y));
		return true;
	}

	/**_UNUSED/
	if (x.$ === 'Set_elm_builtin')
	{
		x = $elm$core$Set$toList(x);
		y = $elm$core$Set$toList(y);
	}
	if (x.$ === 'RBNode_elm_builtin' || x.$ === 'RBEmpty_elm_builtin')
	{
		x = $elm$core$Dict$toList(x);
		y = $elm$core$Dict$toList(y);
	}
	//*/

	/**/
	if (x.$ < 0)
	{
		x = $elm$core$Dict$toList(x);
		y = $elm$core$Dict$toList(y);
	}
	//*/

	for (var key in x)
	{
		if (!_Utils_eqHelp(x[key], y[key], depth + 1, stack))
		{
			return false;
		}
	}
	return true;
}

var _Utils_equal = F2(_Utils_eq);
var _Utils_notEqual = F2(function(a, b) { return !_Utils_eq(a,b); });



// COMPARISONS

// Code in Generate/JavaScript.hs, Basics.js, and List.js depends on
// the particular integer values assigned to LT, EQ, and GT.

function _Utils_cmp(x, y, ord)
{
	if (typeof x !== 'object')
	{
		return x === y ? /*EQ*/ 0 : x < y ? /*LT*/ -1 : /*GT*/ 1;
	}

	/**_UNUSED/
	if (x instanceof String)
	{
		var a = x.valueOf();
		var b = y.valueOf();
		return a === b ? 0 : a < b ? -1 : 1;
	}
	//*/

	/**/
	if (typeof x.$ === 'undefined')
	//*/
	/**_UNUSED/
	if (x.$[0] === '#')
	//*/
	{
		return (ord = _Utils_cmp(x.a, y.a))
			? ord
			: (ord = _Utils_cmp(x.b, y.b))
				? ord
				: _Utils_cmp(x.c, y.c);
	}

	// traverse conses until end of a list or a mismatch
	for (; x.b && y.b && !(ord = _Utils_cmp(x.a, y.a)); x = x.b, y = y.b) {} // WHILE_CONSES
	return ord || (x.b ? /*GT*/ 1 : y.b ? /*LT*/ -1 : /*EQ*/ 0);
}

var _Utils_lt = F2(function(a, b) { return _Utils_cmp(a, b) < 0; });
var _Utils_le = F2(function(a, b) { return _Utils_cmp(a, b) < 1; });
var _Utils_gt = F2(function(a, b) { return _Utils_cmp(a, b) > 0; });
var _Utils_ge = F2(function(a, b) { return _Utils_cmp(a, b) >= 0; });

var _Utils_compare = F2(function(x, y)
{
	var n = _Utils_cmp(x, y);
	return n < 0 ? $elm$core$Basics$LT : n ? $elm$core$Basics$GT : $elm$core$Basics$EQ;
});


// COMMON VALUES

var _Utils_Tuple0 = 0;
var _Utils_Tuple0_UNUSED = { $: '#0' };

function _Utils_Tuple2(a, b) { return { a: a, b: b }; }
function _Utils_Tuple2_UNUSED(a, b) { return { $: '#2', a: a, b: b }; }

function _Utils_Tuple3(a, b, c) { return { a: a, b: b, c: c }; }
function _Utils_Tuple3_UNUSED(a, b, c) { return { $: '#3', a: a, b: b, c: c }; }

function _Utils_chr(c) { return c; }
function _Utils_chr_UNUSED(c) { return new String(c); }


// RECORDS

function _Utils_update(oldRecord, updatedFields)
{
	var newRecord = {};

	for (var key in oldRecord)
	{
		newRecord[key] = oldRecord[key];
	}

	for (var key in updatedFields)
	{
		newRecord[key] = updatedFields[key];
	}

	return newRecord;
}


// APPEND

var _Utils_append = F2(_Utils_ap);

function _Utils_ap(xs, ys)
{
	// append Strings
	if (typeof xs === 'string')
	{
		return xs + ys;
	}

	// append Lists
	if (!xs.b)
	{
		return ys;
	}
	var root = _List_Cons(xs.a, ys);
	xs = xs.b
	for (var curr = root; xs.b; xs = xs.b) // WHILE_CONS
	{
		curr = curr.b = _List_Cons(xs.a, ys);
	}
	return root;
}



var _List_Nil = { $: 0 };
var _List_Nil_UNUSED = { $: '[]' };

function _List_Cons(hd, tl) { return { $: 1, a: hd, b: tl }; }
function _List_Cons_UNUSED(hd, tl) { return { $: '::', a: hd, b: tl }; }


var _List_cons = F2(_List_Cons);

function _List_fromArray(arr)
{
	var out = _List_Nil;
	for (var i = arr.length; i--; )
	{
		out = _List_Cons(arr[i], out);
	}
	return out;
}

function _List_toArray(xs)
{
	for (var out = []; xs.b; xs = xs.b) // WHILE_CONS
	{
		out.push(xs.a);
	}
	return out;
}

var _List_map2 = F3(function(f, xs, ys)
{
	for (var arr = []; xs.b && ys.b; xs = xs.b, ys = ys.b) // WHILE_CONSES
	{
		arr.push(A2(f, xs.a, ys.a));
	}
	return _List_fromArray(arr);
});

var _List_map3 = F4(function(f, xs, ys, zs)
{
	for (var arr = []; xs.b && ys.b && zs.b; xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A3(f, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map4 = F5(function(f, ws, xs, ys, zs)
{
	for (var arr = []; ws.b && xs.b && ys.b && zs.b; ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A4(f, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map5 = F6(function(f, vs, ws, xs, ys, zs)
{
	for (var arr = []; vs.b && ws.b && xs.b && ys.b && zs.b; vs = vs.b, ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A5(f, vs.a, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_sortBy = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		return _Utils_cmp(f(a), f(b));
	}));
});

var _List_sortWith = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		var ord = A2(f, a, b);
		return ord === $elm$core$Basics$EQ ? 0 : ord === $elm$core$Basics$LT ? -1 : 1;
	}));
});



var _JsArray_empty = [];

function _JsArray_singleton(value)
{
    return [value];
}

function _JsArray_length(array)
{
    return array.length;
}

var _JsArray_initialize = F3(function(size, offset, func)
{
    var result = new Array(size);

    for (var i = 0; i < size; i++)
    {
        result[i] = func(offset + i);
    }

    return result;
});

var _JsArray_initializeFromList = F2(function (max, ls)
{
    var result = new Array(max);

    for (var i = 0; i < max && ls.b; i++)
    {
        result[i] = ls.a;
        ls = ls.b;
    }

    result.length = i;
    return _Utils_Tuple2(result, ls);
});

var _JsArray_unsafeGet = F2(function(index, array)
{
    return array[index];
});

var _JsArray_unsafeSet = F3(function(index, value, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[index] = value;
    return result;
});

var _JsArray_push = F2(function(value, array)
{
    var length = array.length;
    var result = new Array(length + 1);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[length] = value;
    return result;
});

var _JsArray_foldl = F3(function(func, acc, array)
{
    var length = array.length;

    for (var i = 0; i < length; i++)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_foldr = F3(function(func, acc, array)
{
    for (var i = array.length - 1; i >= 0; i--)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_map = F2(function(func, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = func(array[i]);
    }

    return result;
});

var _JsArray_indexedMap = F3(function(func, offset, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = A2(func, offset + i, array[i]);
    }

    return result;
});

var _JsArray_slice = F3(function(from, to, array)
{
    return array.slice(from, to);
});

var _JsArray_appendN = F3(function(n, dest, source)
{
    var destLen = dest.length;
    var itemsToCopy = n - destLen;

    if (itemsToCopy > source.length)
    {
        itemsToCopy = source.length;
    }

    var size = destLen + itemsToCopy;
    var result = new Array(size);

    for (var i = 0; i < destLen; i++)
    {
        result[i] = dest[i];
    }

    for (var i = 0; i < itemsToCopy; i++)
    {
        result[i + destLen] = source[i];
    }

    return result;
});



// LOG

var _Debug_log = F2(function(tag, value)
{
	return value;
});

var _Debug_log_UNUSED = F2(function(tag, value)
{
	console.log(tag + ': ' + _Debug_toString(value));
	return value;
});


// TODOS

function _Debug_todo(moduleName, region)
{
	return function(message) {
		_Debug_crash(8, moduleName, region, message);
	};
}

function _Debug_todoCase(moduleName, region, value)
{
	return function(message) {
		_Debug_crash(9, moduleName, region, value, message);
	};
}


// TO STRING

function _Debug_toString(value)
{
	return '<internals>';
}

function _Debug_toString_UNUSED(value)
{
	return _Debug_toAnsiString(false, value);
}

function _Debug_toAnsiString(ansi, value)
{
	if (typeof value === 'function')
	{
		return _Debug_internalColor(ansi, '<function>');
	}

	if (typeof value === 'boolean')
	{
		return _Debug_ctorColor(ansi, value ? 'True' : 'False');
	}

	if (typeof value === 'number')
	{
		return _Debug_numberColor(ansi, value + '');
	}

	if (value instanceof String)
	{
		return _Debug_charColor(ansi, "'" + _Debug_addSlashes(value, true) + "'");
	}

	if (typeof value === 'string')
	{
		return _Debug_stringColor(ansi, '"' + _Debug_addSlashes(value, false) + '"');
	}

	if (typeof value === 'object' && '$' in value)
	{
		var tag = value.$;

		if (typeof tag === 'number')
		{
			return _Debug_internalColor(ansi, '<internals>');
		}

		if (tag[0] === '#')
		{
			var output = [];
			for (var k in value)
			{
				if (k === '$') continue;
				output.push(_Debug_toAnsiString(ansi, value[k]));
			}
			return '(' + output.join(',') + ')';
		}

		if (tag === 'Set_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Set')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Set$toList(value));
		}

		if (tag === 'RBNode_elm_builtin' || tag === 'RBEmpty_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Dict')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Dict$toList(value));
		}

		if (tag === 'Array_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Array')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Array$toList(value));
		}

		if (tag === '::' || tag === '[]')
		{
			var output = '[';

			value.b && (output += _Debug_toAnsiString(ansi, value.a), value = value.b)

			for (; value.b; value = value.b) // WHILE_CONS
			{
				output += ',' + _Debug_toAnsiString(ansi, value.a);
			}
			return output + ']';
		}

		var output = '';
		for (var i in value)
		{
			if (i === '$') continue;
			var str = _Debug_toAnsiString(ansi, value[i]);
			var c0 = str[0];
			var parenless = c0 === '{' || c0 === '(' || c0 === '[' || c0 === '<' || c0 === '"' || str.indexOf(' ') < 0;
			output += ' ' + (parenless ? str : '(' + str + ')');
		}
		return _Debug_ctorColor(ansi, tag) + output;
	}

	if (typeof DataView === 'function' && value instanceof DataView)
	{
		return _Debug_stringColor(ansi, '<' + value.byteLength + ' bytes>');
	}

	if (typeof File !== 'undefined' && value instanceof File)
	{
		return _Debug_internalColor(ansi, '<' + value.name + '>');
	}

	if (typeof value === 'object')
	{
		var output = [];
		for (var key in value)
		{
			var field = key[0] === '_' ? key.slice(1) : key;
			output.push(_Debug_fadeColor(ansi, field) + ' = ' + _Debug_toAnsiString(ansi, value[key]));
		}
		if (output.length === 0)
		{
			return '{}';
		}
		return '{ ' + output.join(', ') + ' }';
	}

	return _Debug_internalColor(ansi, '<internals>');
}

function _Debug_addSlashes(str, isChar)
{
	var s = str
		.replace(/\\/g, '\\\\')
		.replace(/\n/g, '\\n')
		.replace(/\t/g, '\\t')
		.replace(/\r/g, '\\r')
		.replace(/\v/g, '\\v')
		.replace(/\0/g, '\\0');

	if (isChar)
	{
		return s.replace(/\'/g, '\\\'');
	}
	else
	{
		return s.replace(/\"/g, '\\"');
	}
}

function _Debug_ctorColor(ansi, string)
{
	return ansi ? '\x1b[96m' + string + '\x1b[0m' : string;
}

function _Debug_numberColor(ansi, string)
{
	return ansi ? '\x1b[95m' + string + '\x1b[0m' : string;
}

function _Debug_stringColor(ansi, string)
{
	return ansi ? '\x1b[93m' + string + '\x1b[0m' : string;
}

function _Debug_charColor(ansi, string)
{
	return ansi ? '\x1b[92m' + string + '\x1b[0m' : string;
}

function _Debug_fadeColor(ansi, string)
{
	return ansi ? '\x1b[37m' + string + '\x1b[0m' : string;
}

function _Debug_internalColor(ansi, string)
{
	return ansi ? '\x1b[36m' + string + '\x1b[0m' : string;
}

function _Debug_toHexDigit(n)
{
	return String.fromCharCode(n < 10 ? 48 + n : 55 + n);
}


// CRASH


function _Debug_crash(identifier)
{
	throw new Error('https://github.com/elm/core/blob/1.0.0/hints/' + identifier + '.md');
}


function _Debug_crash_UNUSED(identifier, fact1, fact2, fact3, fact4)
{
	switch(identifier)
	{
		case 0:
			throw new Error('What node should I take over? In JavaScript I need something like:\n\n    Elm.Main.init({\n        node: document.getElementById("elm-node")\n    })\n\nYou need to do this with any Browser.sandbox or Browser.element program.');

		case 1:
			throw new Error('Browser.application programs cannot handle URLs like this:\n\n    ' + document.location.href + '\n\nWhat is the root? The root of your file system? Try looking at this program with `elm reactor` or some other server.');

		case 2:
			var jsonErrorString = fact1;
			throw new Error('Problem with the flags given to your Elm program on initialization.\n\n' + jsonErrorString);

		case 3:
			var portName = fact1;
			throw new Error('There can only be one port named `' + portName + '`, but your program has multiple.');

		case 4:
			var portName = fact1;
			var problem = fact2;
			throw new Error('Trying to send an unexpected type of value through port `' + portName + '`:\n' + problem);

		case 5:
			throw new Error('Trying to use `(==)` on functions.\nThere is no way to know if functions are "the same" in the Elm sense.\nRead more about this at https://package.elm-lang.org/packages/elm/core/latest/Basics#== which describes why it is this way and what the better version will look like.');

		case 6:
			var moduleName = fact1;
			throw new Error('Your page is loading multiple Elm scripts with a module named ' + moduleName + '. Maybe a duplicate script is getting loaded accidentally? If not, rename one of them so I know which is which!');

		case 8:
			var moduleName = fact1;
			var region = fact2;
			var message = fact3;
			throw new Error('TODO in module `' + moduleName + '` ' + _Debug_regionToString(region) + '\n\n' + message);

		case 9:
			var moduleName = fact1;
			var region = fact2;
			var value = fact3;
			var message = fact4;
			throw new Error(
				'TODO in module `' + moduleName + '` from the `case` expression '
				+ _Debug_regionToString(region) + '\n\nIt received the following value:\n\n    '
				+ _Debug_toString(value).replace('\n', '\n    ')
				+ '\n\nBut the branch that handles it says:\n\n    ' + message.replace('\n', '\n    ')
			);

		case 10:
			throw new Error('Bug in https://github.com/elm/virtual-dom/issues');

		case 11:
			throw new Error('Cannot perform mod 0. Division by zero error.');
	}
}

function _Debug_regionToString(region)
{
	if (region.ab.Q === region.aj.Q)
	{
		return 'on line ' + region.ab.Q;
	}
	return 'on lines ' + region.ab.Q + ' through ' + region.aj.Q;
}



// MATH

var _Basics_add = F2(function(a, b) { return a + b; });
var _Basics_sub = F2(function(a, b) { return a - b; });
var _Basics_mul = F2(function(a, b) { return a * b; });
var _Basics_fdiv = F2(function(a, b) { return a / b; });
var _Basics_idiv = F2(function(a, b) { return (a / b) | 0; });
var _Basics_pow = F2(Math.pow);

var _Basics_remainderBy = F2(function(b, a) { return a % b; });

// https://www.microsoft.com/en-us/research/wp-content/uploads/2016/02/divmodnote-letter.pdf
var _Basics_modBy = F2(function(modulus, x)
{
	var answer = x % modulus;
	return modulus === 0
		? _Debug_crash(11)
		:
	((answer > 0 && modulus < 0) || (answer < 0 && modulus > 0))
		? answer + modulus
		: answer;
});


// TRIGONOMETRY

var _Basics_pi = Math.PI;
var _Basics_e = Math.E;
var _Basics_cos = Math.cos;
var _Basics_sin = Math.sin;
var _Basics_tan = Math.tan;
var _Basics_acos = Math.acos;
var _Basics_asin = Math.asin;
var _Basics_atan = Math.atan;
var _Basics_atan2 = F2(Math.atan2);


// MORE MATH

function _Basics_toFloat(x) { return x; }
function _Basics_truncate(n) { return n | 0; }
function _Basics_isInfinite(n) { return n === Infinity || n === -Infinity; }

var _Basics_ceiling = Math.ceil;
var _Basics_floor = Math.floor;
var _Basics_round = Math.round;
var _Basics_sqrt = Math.sqrt;
var _Basics_log = Math.log;
var _Basics_isNaN = isNaN;


// BOOLEANS

function _Basics_not(bool) { return !bool; }
var _Basics_and = F2(function(a, b) { return a && b; });
var _Basics_or  = F2(function(a, b) { return a || b; });
var _Basics_xor = F2(function(a, b) { return a !== b; });



var _String_cons = F2(function(chr, str)
{
	return chr + str;
});

function _String_uncons(string)
{
	var word = string.charCodeAt(0);
	return !isNaN(word)
		? $elm$core$Maybe$Just(
			0xD800 <= word && word <= 0xDBFF
				? _Utils_Tuple2(_Utils_chr(string[0] + string[1]), string.slice(2))
				: _Utils_Tuple2(_Utils_chr(string[0]), string.slice(1))
		)
		: $elm$core$Maybe$Nothing;
}

var _String_append = F2(function(a, b)
{
	return a + b;
});

function _String_length(str)
{
	return str.length;
}

var _String_map = F2(function(func, string)
{
	var len = string.length;
	var array = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = string.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			array[i] = func(_Utils_chr(string[i] + string[i+1]));
			i += 2;
			continue;
		}
		array[i] = func(_Utils_chr(string[i]));
		i++;
	}
	return array.join('');
});

var _String_filter = F2(function(isGood, str)
{
	var arr = [];
	var len = str.length;
	var i = 0;
	while (i < len)
	{
		var char = str[i];
		var word = str.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += str[i];
			i++;
		}

		if (isGood(_Utils_chr(char)))
		{
			arr.push(char);
		}
	}
	return arr.join('');
});

function _String_reverse(str)
{
	var len = str.length;
	var arr = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = str.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			arr[len - i] = str[i + 1];
			i++;
			arr[len - i] = str[i - 1];
			i++;
		}
		else
		{
			arr[len - i] = str[i];
			i++;
		}
	}
	return arr.join('');
}

var _String_foldl = F3(function(func, state, string)
{
	var len = string.length;
	var i = 0;
	while (i < len)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += string[i];
			i++;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_foldr = F3(function(func, state, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_split = F2(function(sep, str)
{
	return str.split(sep);
});

var _String_join = F2(function(sep, strs)
{
	return strs.join(sep);
});

var _String_slice = F3(function(start, end, str) {
	return str.slice(start, end);
});

function _String_trim(str)
{
	return str.trim();
}

function _String_trimLeft(str)
{
	return str.replace(/^\s+/, '');
}

function _String_trimRight(str)
{
	return str.replace(/\s+$/, '');
}

function _String_words(str)
{
	return _List_fromArray(str.trim().split(/\s+/g));
}

function _String_lines(str)
{
	return _List_fromArray(str.split(/\r\n|\r|\n/g));
}

function _String_toUpper(str)
{
	return str.toUpperCase();
}

function _String_toLower(str)
{
	return str.toLowerCase();
}

var _String_any = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (isGood(_Utils_chr(char)))
		{
			return true;
		}
	}
	return false;
});

var _String_all = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (!isGood(_Utils_chr(char)))
		{
			return false;
		}
	}
	return true;
});

var _String_contains = F2(function(sub, str)
{
	return str.indexOf(sub) > -1;
});

var _String_startsWith = F2(function(sub, str)
{
	return str.indexOf(sub) === 0;
});

var _String_endsWith = F2(function(sub, str)
{
	return str.length >= sub.length &&
		str.lastIndexOf(sub) === str.length - sub.length;
});

var _String_indexes = F2(function(sub, str)
{
	var subLen = sub.length;

	if (subLen < 1)
	{
		return _List_Nil;
	}

	var i = 0;
	var is = [];

	while ((i = str.indexOf(sub, i)) > -1)
	{
		is.push(i);
		i = i + subLen;
	}

	return _List_fromArray(is);
});


// TO STRING

function _String_fromNumber(number)
{
	return number + '';
}


// INT CONVERSIONS

function _String_toInt(str)
{
	var total = 0;
	var code0 = str.charCodeAt(0);
	var start = code0 == 0x2B /* + */ || code0 == 0x2D /* - */ ? 1 : 0;

	for (var i = start; i < str.length; ++i)
	{
		var code = str.charCodeAt(i);
		if (code < 0x30 || 0x39 < code)
		{
			return $elm$core$Maybe$Nothing;
		}
		total = 10 * total + code - 0x30;
	}

	return i == start
		? $elm$core$Maybe$Nothing
		: $elm$core$Maybe$Just(code0 == 0x2D ? -total : total);
}


// FLOAT CONVERSIONS

function _String_toFloat(s)
{
	// check if it is a hex, octal, or binary number
	if (s.length === 0 || /[\sxbo]/.test(s))
	{
		return $elm$core$Maybe$Nothing;
	}
	var n = +s;
	// faster isNaN check
	return n === n ? $elm$core$Maybe$Just(n) : $elm$core$Maybe$Nothing;
}

function _String_fromList(chars)
{
	return _List_toArray(chars).join('');
}




function _Char_toCode(char)
{
	var code = char.charCodeAt(0);
	if (0xD800 <= code && code <= 0xDBFF)
	{
		return (code - 0xD800) * 0x400 + char.charCodeAt(1) - 0xDC00 + 0x10000
	}
	return code;
}

function _Char_fromCode(code)
{
	return _Utils_chr(
		(code < 0 || 0x10FFFF < code)
			? '\uFFFD'
			:
		(code <= 0xFFFF)
			? String.fromCharCode(code)
			:
		(code -= 0x10000,
			String.fromCharCode(Math.floor(code / 0x400) + 0xD800, code % 0x400 + 0xDC00)
		)
	);
}

function _Char_toUpper(char)
{
	return _Utils_chr(char.toUpperCase());
}

function _Char_toLower(char)
{
	return _Utils_chr(char.toLowerCase());
}

function _Char_toLocaleUpper(char)
{
	return _Utils_chr(char.toLocaleUpperCase());
}

function _Char_toLocaleLower(char)
{
	return _Utils_chr(char.toLocaleLowerCase());
}



/**_UNUSED/
function _Json_errorToString(error)
{
	return $elm$json$Json$Decode$errorToString(error);
}
//*/


// CORE DECODERS

function _Json_succeed(msg)
{
	return {
		$: 0,
		a: msg
	};
}

function _Json_fail(msg)
{
	return {
		$: 1,
		a: msg
	};
}

function _Json_decodePrim(decoder)
{
	return { $: 2, b: decoder };
}

var _Json_decodeInt = _Json_decodePrim(function(value) {
	return (typeof value !== 'number')
		? _Json_expecting('an INT', value)
		:
	(-2147483647 < value && value < 2147483647 && (value | 0) === value)
		? $elm$core$Result$Ok(value)
		:
	(isFinite(value) && !(value % 1))
		? $elm$core$Result$Ok(value)
		: _Json_expecting('an INT', value);
});

var _Json_decodeBool = _Json_decodePrim(function(value) {
	return (typeof value === 'boolean')
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a BOOL', value);
});

var _Json_decodeFloat = _Json_decodePrim(function(value) {
	return (typeof value === 'number')
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a FLOAT', value);
});

var _Json_decodeValue = _Json_decodePrim(function(value) {
	return $elm$core$Result$Ok(_Json_wrap(value));
});

var _Json_decodeString = _Json_decodePrim(function(value) {
	return (typeof value === 'string')
		? $elm$core$Result$Ok(value)
		: (value instanceof String)
			? $elm$core$Result$Ok(value + '')
			: _Json_expecting('a STRING', value);
});

function _Json_decodeList(decoder) { return { $: 3, b: decoder }; }
function _Json_decodeArray(decoder) { return { $: 4, b: decoder }; }

function _Json_decodeNull(value) { return { $: 5, c: value }; }

var _Json_decodeField = F2(function(field, decoder)
{
	return {
		$: 6,
		d: field,
		b: decoder
	};
});

var _Json_decodeIndex = F2(function(index, decoder)
{
	return {
		$: 7,
		e: index,
		b: decoder
	};
});

function _Json_decodeKeyValuePairs(decoder)
{
	return {
		$: 8,
		b: decoder
	};
}

function _Json_mapMany(f, decoders)
{
	return {
		$: 9,
		f: f,
		g: decoders
	};
}

var _Json_andThen = F2(function(callback, decoder)
{
	return {
		$: 10,
		b: decoder,
		h: callback
	};
});

function _Json_oneOf(decoders)
{
	return {
		$: 11,
		g: decoders
	};
}


// DECODING OBJECTS

var _Json_map1 = F2(function(f, d1)
{
	return _Json_mapMany(f, [d1]);
});

var _Json_map2 = F3(function(f, d1, d2)
{
	return _Json_mapMany(f, [d1, d2]);
});

var _Json_map3 = F4(function(f, d1, d2, d3)
{
	return _Json_mapMany(f, [d1, d2, d3]);
});

var _Json_map4 = F5(function(f, d1, d2, d3, d4)
{
	return _Json_mapMany(f, [d1, d2, d3, d4]);
});

var _Json_map5 = F6(function(f, d1, d2, d3, d4, d5)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5]);
});

var _Json_map6 = F7(function(f, d1, d2, d3, d4, d5, d6)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6]);
});

var _Json_map7 = F8(function(f, d1, d2, d3, d4, d5, d6, d7)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7]);
});

var _Json_map8 = F9(function(f, d1, d2, d3, d4, d5, d6, d7, d8)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7, d8]);
});


// DECODE

var _Json_runOnString = F2(function(decoder, string)
{
	try
	{
		var value = JSON.parse(string);
		return _Json_runHelp(decoder, value);
	}
	catch (e)
	{
		return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, 'This is not valid JSON! ' + e.message, _Json_wrap(string)));
	}
});

var _Json_run = F2(function(decoder, value)
{
	return _Json_runHelp(decoder, _Json_unwrap(value));
});

function _Json_runHelp(decoder, value)
{
	switch (decoder.$)
	{
		case 2:
			return decoder.b(value);

		case 5:
			return (value === null)
				? $elm$core$Result$Ok(decoder.c)
				: _Json_expecting('null', value);

		case 3:
			if (!_Json_isArray(value))
			{
				return _Json_expecting('a LIST', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _List_fromArray);

		case 4:
			if (!_Json_isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _Json_toElmArray);

		case 6:
			var field = decoder.d;
			if (typeof value !== 'object' || value === null || !(field in value))
			{
				return _Json_expecting('an OBJECT with a field named `' + field + '`', value);
			}
			var result = _Json_runHelp(decoder.b, value[field]);
			return ($elm$core$Result$isOk(result)) ? result : $elm$core$Result$Err(A2($elm$json$Json$Decode$Field, field, result.a));

		case 7:
			var index = decoder.e;
			if (!_Json_isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			if (index >= value.length)
			{
				return _Json_expecting('a LONGER array. Need index ' + index + ' but only see ' + value.length + ' entries', value);
			}
			var result = _Json_runHelp(decoder.b, value[index]);
			return ($elm$core$Result$isOk(result)) ? result : $elm$core$Result$Err(A2($elm$json$Json$Decode$Index, index, result.a));

		case 8:
			if (typeof value !== 'object' || value === null || _Json_isArray(value))
			{
				return _Json_expecting('an OBJECT', value);
			}

			var keyValuePairs = _List_Nil;
			// TODO test perf of Object.keys and switch when support is good enough
			for (var key in value)
			{
				if (value.hasOwnProperty(key))
				{
					var result = _Json_runHelp(decoder.b, value[key]);
					if (!$elm$core$Result$isOk(result))
					{
						return $elm$core$Result$Err(A2($elm$json$Json$Decode$Field, key, result.a));
					}
					keyValuePairs = _List_Cons(_Utils_Tuple2(key, result.a), keyValuePairs);
				}
			}
			return $elm$core$Result$Ok($elm$core$List$reverse(keyValuePairs));

		case 9:
			var answer = decoder.f;
			var decoders = decoder.g;
			for (var i = 0; i < decoders.length; i++)
			{
				var result = _Json_runHelp(decoders[i], value);
				if (!$elm$core$Result$isOk(result))
				{
					return result;
				}
				answer = answer(result.a);
			}
			return $elm$core$Result$Ok(answer);

		case 10:
			var result = _Json_runHelp(decoder.b, value);
			return (!$elm$core$Result$isOk(result))
				? result
				: _Json_runHelp(decoder.h(result.a), value);

		case 11:
			var errors = _List_Nil;
			for (var temp = decoder.g; temp.b; temp = temp.b) // WHILE_CONS
			{
				var result = _Json_runHelp(temp.a, value);
				if ($elm$core$Result$isOk(result))
				{
					return result;
				}
				errors = _List_Cons(result.a, errors);
			}
			return $elm$core$Result$Err($elm$json$Json$Decode$OneOf($elm$core$List$reverse(errors)));

		case 1:
			return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, decoder.a, _Json_wrap(value)));

		case 0:
			return $elm$core$Result$Ok(decoder.a);
	}
}

function _Json_runArrayDecoder(decoder, value, toElmValue)
{
	var len = value.length;
	var array = new Array(len);
	for (var i = 0; i < len; i++)
	{
		var result = _Json_runHelp(decoder, value[i]);
		if (!$elm$core$Result$isOk(result))
		{
			return $elm$core$Result$Err(A2($elm$json$Json$Decode$Index, i, result.a));
		}
		array[i] = result.a;
	}
	return $elm$core$Result$Ok(toElmValue(array));
}

function _Json_isArray(value)
{
	return Array.isArray(value) || (typeof FileList !== 'undefined' && value instanceof FileList);
}

function _Json_toElmArray(array)
{
	return A2($elm$core$Array$initialize, array.length, function(i) { return array[i]; });
}

function _Json_expecting(type, value)
{
	return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, 'Expecting ' + type, _Json_wrap(value)));
}


// EQUALITY

function _Json_equality(x, y)
{
	if (x === y)
	{
		return true;
	}

	if (x.$ !== y.$)
	{
		return false;
	}

	switch (x.$)
	{
		case 0:
		case 1:
			return x.a === y.a;

		case 2:
			return x.b === y.b;

		case 5:
			return x.c === y.c;

		case 3:
		case 4:
		case 8:
			return _Json_equality(x.b, y.b);

		case 6:
			return x.d === y.d && _Json_equality(x.b, y.b);

		case 7:
			return x.e === y.e && _Json_equality(x.b, y.b);

		case 9:
			return x.f === y.f && _Json_listEquality(x.g, y.g);

		case 10:
			return x.h === y.h && _Json_equality(x.b, y.b);

		case 11:
			return _Json_listEquality(x.g, y.g);
	}
}

function _Json_listEquality(aDecoders, bDecoders)
{
	var len = aDecoders.length;
	if (len !== bDecoders.length)
	{
		return false;
	}
	for (var i = 0; i < len; i++)
	{
		if (!_Json_equality(aDecoders[i], bDecoders[i]))
		{
			return false;
		}
	}
	return true;
}


// ENCODE

var _Json_encode = F2(function(indentLevel, value)
{
	return JSON.stringify(_Json_unwrap(value), null, indentLevel) + '';
});

function _Json_wrap_UNUSED(value) { return { $: 0, a: value }; }
function _Json_unwrap_UNUSED(value) { return value.a; }

function _Json_wrap(value) { return value; }
function _Json_unwrap(value) { return value; }

function _Json_emptyArray() { return []; }
function _Json_emptyObject() { return {}; }

var _Json_addField = F3(function(key, value, object)
{
	object[key] = _Json_unwrap(value);
	return object;
});

function _Json_addEntry(func)
{
	return F2(function(entry, array)
	{
		array.push(_Json_unwrap(func(entry)));
		return array;
	});
}

var _Json_encodeNull = _Json_wrap(null);



// TASKS

function _Scheduler_succeed(value)
{
	return {
		$: 0,
		a: value
	};
}

function _Scheduler_fail(error)
{
	return {
		$: 1,
		a: error
	};
}

function _Scheduler_binding(callback)
{
	return {
		$: 2,
		b: callback,
		c: null
	};
}

var _Scheduler_andThen = F2(function(callback, task)
{
	return {
		$: 3,
		b: callback,
		d: task
	};
});

var _Scheduler_onError = F2(function(callback, task)
{
	return {
		$: 4,
		b: callback,
		d: task
	};
});

function _Scheduler_receive(callback)
{
	return {
		$: 5,
		b: callback
	};
}


// PROCESSES

var _Scheduler_guid = 0;

function _Scheduler_rawSpawn(task)
{
	var proc = {
		$: 0,
		e: _Scheduler_guid++,
		f: task,
		g: null,
		h: []
	};

	_Scheduler_enqueue(proc);

	return proc;
}

function _Scheduler_spawn(task)
{
	return _Scheduler_binding(function(callback) {
		callback(_Scheduler_succeed(_Scheduler_rawSpawn(task)));
	});
}

function _Scheduler_rawSend(proc, msg)
{
	proc.h.push(msg);
	_Scheduler_enqueue(proc);
}

var _Scheduler_send = F2(function(proc, msg)
{
	return _Scheduler_binding(function(callback) {
		_Scheduler_rawSend(proc, msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});

function _Scheduler_kill(proc)
{
	return _Scheduler_binding(function(callback) {
		var task = proc.f;
		if (task.$ === 2 && task.c)
		{
			task.c();
		}

		proc.f = null;

		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
}


/* STEP PROCESSES

type alias Process =
  { $ : tag
  , id : unique_id
  , root : Task
  , stack : null | { $: SUCCEED | FAIL, a: callback, b: stack }
  , mailbox : [msg]
  }

*/


var _Scheduler_working = false;
var _Scheduler_queue = [];


function _Scheduler_enqueue(proc)
{
	_Scheduler_queue.push(proc);
	if (_Scheduler_working)
	{
		return;
	}
	_Scheduler_working = true;
	while (proc = _Scheduler_queue.shift())
	{
		_Scheduler_step(proc);
	}
	_Scheduler_working = false;
}


function _Scheduler_step(proc)
{
	while (proc.f)
	{
		var rootTag = proc.f.$;
		if (rootTag === 0 || rootTag === 1)
		{
			while (proc.g && proc.g.$ !== rootTag)
			{
				proc.g = proc.g.i;
			}
			if (!proc.g)
			{
				return;
			}
			proc.f = proc.g.b(proc.f.a);
			proc.g = proc.g.i;
		}
		else if (rootTag === 2)
		{
			proc.f.c = proc.f.b(function(newRoot) {
				proc.f = newRoot;
				_Scheduler_enqueue(proc);
			});
			return;
		}
		else if (rootTag === 5)
		{
			if (proc.h.length === 0)
			{
				return;
			}
			proc.f = proc.f.b(proc.h.shift());
		}
		else // if (rootTag === 3 || rootTag === 4)
		{
			proc.g = {
				$: rootTag === 3 ? 0 : 1,
				b: proc.f.b,
				i: proc.g
			};
			proc.f = proc.f.d;
		}
	}
}



function _Process_sleep(time)
{
	return _Scheduler_binding(function(callback) {
		var id = setTimeout(function() {
			callback(_Scheduler_succeed(_Utils_Tuple0));
		}, time);

		return function() { clearTimeout(id); };
	});
}




// PROGRAMS


var _Platform_worker = F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.aS,
		impl.a0,
		impl.a$,
		function() { return function() {} }
	);
});



// INITIALIZE A PROGRAM


function _Platform_initialize(flagDecoder, args, init, update, subscriptions, stepperBuilder)
{
	var result = A2(_Json_run, flagDecoder, _Json_wrap(args ? args['flags'] : undefined));
	$elm$core$Result$isOk(result) || _Debug_crash(2 /**_UNUSED/, _Json_errorToString(result.a) /**/);
	var managers = {};
	var initPair = init(result.a);
	var model = initPair.a;
	var stepper = stepperBuilder(sendToApp, model);
	var ports = _Platform_setupEffects(managers, sendToApp);

	function sendToApp(msg, viewMetadata)
	{
		var pair = A2(update, msg, model);
		stepper(model = pair.a, viewMetadata);
		_Platform_enqueueEffects(managers, pair.b, subscriptions(model));
	}

	_Platform_enqueueEffects(managers, initPair.b, subscriptions(model));

	return ports ? { ports: ports } : {};
}



// TRACK PRELOADS
//
// This is used by code in elm/browser and elm/http
// to register any HTTP requests that are triggered by init.
//


var _Platform_preload;


function _Platform_registerPreload(url)
{
	_Platform_preload.add(url);
}



// EFFECT MANAGERS


var _Platform_effectManagers = {};


function _Platform_setupEffects(managers, sendToApp)
{
	var ports;

	// setup all necessary effect managers
	for (var key in _Platform_effectManagers)
	{
		var manager = _Platform_effectManagers[key];

		if (manager.a)
		{
			ports = ports || {};
			ports[key] = manager.a(key, sendToApp);
		}

		managers[key] = _Platform_instantiateManager(manager, sendToApp);
	}

	return ports;
}


function _Platform_createManager(init, onEffects, onSelfMsg, cmdMap, subMap)
{
	return {
		b: init,
		c: onEffects,
		d: onSelfMsg,
		e: cmdMap,
		f: subMap
	};
}


function _Platform_instantiateManager(info, sendToApp)
{
	var router = {
		g: sendToApp,
		h: undefined
	};

	var onEffects = info.c;
	var onSelfMsg = info.d;
	var cmdMap = info.e;
	var subMap = info.f;

	function loop(state)
	{
		return A2(_Scheduler_andThen, loop, _Scheduler_receive(function(msg)
		{
			var value = msg.a;

			if (msg.$ === 0)
			{
				return A3(onSelfMsg, router, value, state);
			}

			return cmdMap && subMap
				? A4(onEffects, router, value.i, value.j, state)
				: A3(onEffects, router, cmdMap ? value.i : value.j, state);
		}));
	}

	return router.h = _Scheduler_rawSpawn(A2(_Scheduler_andThen, loop, info.b));
}



// ROUTING


var _Platform_sendToApp = F2(function(router, msg)
{
	return _Scheduler_binding(function(callback)
	{
		router.g(msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});


var _Platform_sendToSelf = F2(function(router, msg)
{
	return A2(_Scheduler_send, router.h, {
		$: 0,
		a: msg
	});
});



// BAGS


function _Platform_leaf(home)
{
	return function(value)
	{
		return {
			$: 1,
			k: home,
			l: value
		};
	};
}


function _Platform_batch(list)
{
	return {
		$: 2,
		m: list
	};
}


var _Platform_map = F2(function(tagger, bag)
{
	return {
		$: 3,
		n: tagger,
		o: bag
	}
});



// PIPE BAGS INTO EFFECT MANAGERS
//
// Effects must be queued!
//
// Say your init contains a synchronous command, like Time.now or Time.here
//
//   - This will produce a batch of effects (FX_1)
//   - The synchronous task triggers the subsequent `update` call
//   - This will produce a batch of effects (FX_2)
//
// If we just start dispatching FX_2, subscriptions from FX_2 can be processed
// before subscriptions from FX_1. No good! Earlier versions of this code had
// this problem, leading to these reports:
//
//   https://github.com/elm/core/issues/980
//   https://github.com/elm/core/pull/981
//   https://github.com/elm/compiler/issues/1776
//
// The queue is necessary to avoid ordering issues for synchronous commands.


// Why use true/false here? Why not just check the length of the queue?
// The goal is to detect "are we currently dispatching effects?" If we
// are, we need to bail and let the ongoing while loop handle things.
//
// Now say the queue has 1 element. When we dequeue the final element,
// the queue will be empty, but we are still actively dispatching effects.
// So you could get queue jumping in a really tricky category of cases.
//
var _Platform_effectsQueue = [];
var _Platform_effectsActive = false;


function _Platform_enqueueEffects(managers, cmdBag, subBag)
{
	_Platform_effectsQueue.push({ p: managers, q: cmdBag, r: subBag });

	if (_Platform_effectsActive) return;

	_Platform_effectsActive = true;
	for (var fx; fx = _Platform_effectsQueue.shift(); )
	{
		_Platform_dispatchEffects(fx.p, fx.q, fx.r);
	}
	_Platform_effectsActive = false;
}


function _Platform_dispatchEffects(managers, cmdBag, subBag)
{
	var effectsDict = {};
	_Platform_gatherEffects(true, cmdBag, effectsDict, null);
	_Platform_gatherEffects(false, subBag, effectsDict, null);

	for (var home in managers)
	{
		_Scheduler_rawSend(managers[home], {
			$: 'fx',
			a: effectsDict[home] || { i: _List_Nil, j: _List_Nil }
		});
	}
}


function _Platform_gatherEffects(isCmd, bag, effectsDict, taggers)
{
	switch (bag.$)
	{
		case 1:
			var home = bag.k;
			var effect = _Platform_toEffect(isCmd, home, taggers, bag.l);
			effectsDict[home] = _Platform_insert(isCmd, effect, effectsDict[home]);
			return;

		case 2:
			for (var list = bag.m; list.b; list = list.b) // WHILE_CONS
			{
				_Platform_gatherEffects(isCmd, list.a, effectsDict, taggers);
			}
			return;

		case 3:
			_Platform_gatherEffects(isCmd, bag.o, effectsDict, {
				s: bag.n,
				t: taggers
			});
			return;
	}
}


function _Platform_toEffect(isCmd, home, taggers, value)
{
	function applyTaggers(x)
	{
		for (var temp = taggers; temp; temp = temp.t)
		{
			x = temp.s(x);
		}
		return x;
	}

	var map = isCmd
		? _Platform_effectManagers[home].e
		: _Platform_effectManagers[home].f;

	return A2(map, applyTaggers, value)
}


function _Platform_insert(isCmd, newEffect, effects)
{
	effects = effects || { i: _List_Nil, j: _List_Nil };

	isCmd
		? (effects.i = _List_Cons(newEffect, effects.i))
		: (effects.j = _List_Cons(newEffect, effects.j));

	return effects;
}



// PORTS


function _Platform_checkPortName(name)
{
	if (_Platform_effectManagers[name])
	{
		_Debug_crash(3, name)
	}
}



// OUTGOING PORTS


function _Platform_outgoingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		e: _Platform_outgoingPortMap,
		u: converter,
		a: _Platform_setupOutgoingPort
	};
	return _Platform_leaf(name);
}


var _Platform_outgoingPortMap = F2(function(tagger, value) { return value; });


function _Platform_setupOutgoingPort(name)
{
	var subs = [];
	var converter = _Platform_effectManagers[name].u;

	// CREATE MANAGER

	var init = _Process_sleep(0);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, cmdList, state)
	{
		for ( ; cmdList.b; cmdList = cmdList.b) // WHILE_CONS
		{
			// grab a separate reference to subs in case unsubscribe is called
			var currentSubs = subs;
			var value = _Json_unwrap(converter(cmdList.a));
			for (var i = 0; i < currentSubs.length; i++)
			{
				currentSubs[i](value);
			}
		}
		return init;
	});

	// PUBLIC API

	function subscribe(callback)
	{
		subs.push(callback);
	}

	function unsubscribe(callback)
	{
		// copy subs into a new array in case unsubscribe is called within a
		// subscribed callback
		subs = subs.slice();
		var index = subs.indexOf(callback);
		if (index >= 0)
		{
			subs.splice(index, 1);
		}
	}

	return {
		subscribe: subscribe,
		unsubscribe: unsubscribe
	};
}



// INCOMING PORTS


function _Platform_incomingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		f: _Platform_incomingPortMap,
		u: converter,
		a: _Platform_setupIncomingPort
	};
	return _Platform_leaf(name);
}


var _Platform_incomingPortMap = F2(function(tagger, finalTagger)
{
	return function(value)
	{
		return tagger(finalTagger(value));
	};
});


function _Platform_setupIncomingPort(name, sendToApp)
{
	var subs = _List_Nil;
	var converter = _Platform_effectManagers[name].u;

	// CREATE MANAGER

	var init = _Scheduler_succeed(null);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, subList, state)
	{
		subs = subList;
		return init;
	});

	// PUBLIC API

	function send(incomingValue)
	{
		var result = A2(_Json_run, converter, _Json_wrap(incomingValue));

		$elm$core$Result$isOk(result) || _Debug_crash(4, name, result.a);

		var value = result.a;
		for (var temp = subs; temp.b; temp = temp.b) // WHILE_CONS
		{
			sendToApp(temp.a(value));
		}
	}

	return { send: send };
}



// EXPORT ELM MODULES
//
// Have DEBUG and PROD versions so that we can (1) give nicer errors in
// debug mode and (2) not pay for the bits needed for that in prod mode.
//


function _Platform_export(exports)
{
	scope['Elm']
		? _Platform_mergeExportsProd(scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsProd(obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6)
				: _Platform_mergeExportsProd(obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}


function _Platform_export_UNUSED(exports)
{
	scope['Elm']
		? _Platform_mergeExportsDebug('Elm', scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsDebug(moduleName, obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6, moduleName)
				: _Platform_mergeExportsDebug(moduleName + '.' + name, obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}




// HELPERS


var _VirtualDom_divertHrefToApp;

var _VirtualDom_doc = typeof document !== 'undefined' ? document : {};


function _VirtualDom_appendChild(parent, child)
{
	parent.appendChild(child);
}

var _VirtualDom_init = F4(function(virtualNode, flagDecoder, debugMetadata, args)
{
	// NOTE: this function needs _Platform_export available to work

	/**/
	var node = args['node'];
	//*/
	/**_UNUSED/
	var node = args && args['node'] ? args['node'] : _Debug_crash(0);
	//*/

	node.parentNode.replaceChild(
		_VirtualDom_render(virtualNode, function() {}),
		node
	);

	return {};
});



// TEXT


function _VirtualDom_text(string)
{
	return {
		$: 0,
		a: string
	};
}



// NODE


var _VirtualDom_nodeNS = F2(function(namespace, tag)
{
	return F2(function(factList, kidList)
	{
		for (var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b) // WHILE_CONS
		{
			var kid = kidList.a;
			descendantsCount += (kid.b || 0);
			kids.push(kid);
		}
		descendantsCount += kids.length;

		return {
			$: 1,
			c: tag,
			d: _VirtualDom_organizeFacts(factList),
			e: kids,
			f: namespace,
			b: descendantsCount
		};
	});
});


var _VirtualDom_node = _VirtualDom_nodeNS(undefined);



// KEYED NODE


var _VirtualDom_keyedNodeNS = F2(function(namespace, tag)
{
	return F2(function(factList, kidList)
	{
		for (var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b) // WHILE_CONS
		{
			var kid = kidList.a;
			descendantsCount += (kid.b.b || 0);
			kids.push(kid);
		}
		descendantsCount += kids.length;

		return {
			$: 2,
			c: tag,
			d: _VirtualDom_organizeFacts(factList),
			e: kids,
			f: namespace,
			b: descendantsCount
		};
	});
});


var _VirtualDom_keyedNode = _VirtualDom_keyedNodeNS(undefined);



// CUSTOM


function _VirtualDom_custom(factList, model, render, diff)
{
	return {
		$: 3,
		d: _VirtualDom_organizeFacts(factList),
		g: model,
		h: render,
		i: diff
	};
}



// MAP


var _VirtualDom_map = F2(function(tagger, node)
{
	return {
		$: 4,
		j: tagger,
		k: node,
		b: 1 + (node.b || 0)
	};
});



// LAZY


function _VirtualDom_thunk(refs, thunk)
{
	return {
		$: 5,
		l: refs,
		m: thunk,
		k: undefined
	};
}

var _VirtualDom_lazy = F2(function(func, a)
{
	return _VirtualDom_thunk([func, a], function() {
		return func(a);
	});
});

var _VirtualDom_lazy2 = F3(function(func, a, b)
{
	return _VirtualDom_thunk([func, a, b], function() {
		return A2(func, a, b);
	});
});

var _VirtualDom_lazy3 = F4(function(func, a, b, c)
{
	return _VirtualDom_thunk([func, a, b, c], function() {
		return A3(func, a, b, c);
	});
});

var _VirtualDom_lazy4 = F5(function(func, a, b, c, d)
{
	return _VirtualDom_thunk([func, a, b, c, d], function() {
		return A4(func, a, b, c, d);
	});
});

var _VirtualDom_lazy5 = F6(function(func, a, b, c, d, e)
{
	return _VirtualDom_thunk([func, a, b, c, d, e], function() {
		return A5(func, a, b, c, d, e);
	});
});

var _VirtualDom_lazy6 = F7(function(func, a, b, c, d, e, f)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f], function() {
		return A6(func, a, b, c, d, e, f);
	});
});

var _VirtualDom_lazy7 = F8(function(func, a, b, c, d, e, f, g)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f, g], function() {
		return A7(func, a, b, c, d, e, f, g);
	});
});

var _VirtualDom_lazy8 = F9(function(func, a, b, c, d, e, f, g, h)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f, g, h], function() {
		return A8(func, a, b, c, d, e, f, g, h);
	});
});



// FACTS


var _VirtualDom_on = F2(function(key, handler)
{
	return {
		$: 'a0',
		n: key,
		o: handler
	};
});
var _VirtualDom_style = F2(function(key, value)
{
	return {
		$: 'a1',
		n: key,
		o: value
	};
});
var _VirtualDom_property = F2(function(key, value)
{
	return {
		$: 'a2',
		n: key,
		o: value
	};
});
var _VirtualDom_attribute = F2(function(key, value)
{
	return {
		$: 'a3',
		n: key,
		o: value
	};
});
var _VirtualDom_attributeNS = F3(function(namespace, key, value)
{
	return {
		$: 'a4',
		n: key,
		o: { f: namespace, o: value }
	};
});



// XSS ATTACK VECTOR CHECKS
//
// For some reason, tabs can appear in href protocols and it still works.
// So '\tjava\tSCRIPT:alert("!!!")' and 'javascript:alert("!!!")' are the same
// in practice. That is why _VirtualDom_RE_js and _VirtualDom_RE_js_html look
// so freaky.
//
// Pulling the regular expressions out to the top level gives a slight speed
// boost in small benchmarks (4-10%) but hoisting values to reduce allocation
// can be unpredictable in large programs where JIT may have a harder time with
// functions are not fully self-contained. The benefit is more that the js and
// js_html ones are so weird that I prefer to see them near each other.


var _VirtualDom_RE_script = /^script$/i;
var _VirtualDom_RE_on_formAction = /^(on|formAction$)/i;
var _VirtualDom_RE_js = /^\s*j\s*a\s*v\s*a\s*s\s*c\s*r\s*i\s*p\s*t\s*:/i;
var _VirtualDom_RE_js_html = /^\s*(j\s*a\s*v\s*a\s*s\s*c\s*r\s*i\s*p\s*t\s*:|d\s*a\s*t\s*a\s*:\s*t\s*e\s*x\s*t\s*\/\s*h\s*t\s*m\s*l\s*(,|;))/i;


function _VirtualDom_noScript(tag)
{
	return _VirtualDom_RE_script.test(tag) ? 'p' : tag;
}

function _VirtualDom_noOnOrFormAction(key)
{
	return _VirtualDom_RE_on_formAction.test(key) ? 'data-' + key : key;
}

function _VirtualDom_noInnerHtmlOrFormAction(key)
{
	return key == 'innerHTML' || key == 'formAction' ? 'data-' + key : key;
}

function _VirtualDom_noJavaScriptUri(value)
{
	return _VirtualDom_RE_js.test(value)
		? /**/''//*//**_UNUSED/'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'//*/
		: value;
}

function _VirtualDom_noJavaScriptOrHtmlUri(value)
{
	return _VirtualDom_RE_js_html.test(value)
		? /**/''//*//**_UNUSED/'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'//*/
		: value;
}

function _VirtualDom_noJavaScriptOrHtmlJson(value)
{
	return (typeof _Json_unwrap(value) === 'string' && _VirtualDom_RE_js_html.test(_Json_unwrap(value)))
		? _Json_wrap(
			/**/''//*//**_UNUSED/'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'//*/
		) : value;
}



// MAP FACTS


var _VirtualDom_mapAttribute = F2(function(func, attr)
{
	return (attr.$ === 'a0')
		? A2(_VirtualDom_on, attr.n, _VirtualDom_mapHandler(func, attr.o))
		: attr;
});

function _VirtualDom_mapHandler(func, handler)
{
	var tag = $elm$virtual_dom$VirtualDom$toHandlerInt(handler);

	// 0 = Normal
	// 1 = MayStopPropagation
	// 2 = MayPreventDefault
	// 3 = Custom

	return {
		$: handler.$,
		a:
			!tag
				? A2($elm$json$Json$Decode$map, func, handler.a)
				:
			A3($elm$json$Json$Decode$map2,
				tag < 3
					? _VirtualDom_mapEventTuple
					: _VirtualDom_mapEventRecord,
				$elm$json$Json$Decode$succeed(func),
				handler.a
			)
	};
}

var _VirtualDom_mapEventTuple = F2(function(func, tuple)
{
	return _Utils_Tuple2(func(tuple.a), tuple.b);
});

var _VirtualDom_mapEventRecord = F2(function(func, record)
{
	return {
		F: func(record.F),
		ad: record.ad,
		_: record._
	}
});



// ORGANIZE FACTS


function _VirtualDom_organizeFacts(factList)
{
	for (var facts = {}; factList.b; factList = factList.b) // WHILE_CONS
	{
		var entry = factList.a;

		var tag = entry.$;
		var key = entry.n;
		var value = entry.o;

		if (tag === 'a2')
		{
			(key === 'className')
				? _VirtualDom_addClass(facts, key, _Json_unwrap(value))
				: facts[key] = _Json_unwrap(value);

			continue;
		}

		var subFacts = facts[tag] || (facts[tag] = {});
		(tag === 'a3' && key === 'class')
			? _VirtualDom_addClass(subFacts, key, value)
			: subFacts[key] = value;
	}

	return facts;
}

function _VirtualDom_addClass(object, key, newClass)
{
	var classes = object[key];
	object[key] = classes ? classes + ' ' + newClass : newClass;
}



// RENDER


function _VirtualDom_render(vNode, eventNode)
{
	var tag = vNode.$;

	if (tag === 5)
	{
		return _VirtualDom_render(vNode.k || (vNode.k = vNode.m()), eventNode);
	}

	if (tag === 0)
	{
		return _VirtualDom_doc.createTextNode(vNode.a);
	}

	if (tag === 4)
	{
		var subNode = vNode.k;
		var tagger = vNode.j;

		while (subNode.$ === 4)
		{
			typeof tagger !== 'object'
				? tagger = [tagger, subNode.j]
				: tagger.push(subNode.j);

			subNode = subNode.k;
		}

		var subEventRoot = { j: tagger, p: eventNode };
		var domNode = _VirtualDom_render(subNode, subEventRoot);
		domNode.elm_event_node_ref = subEventRoot;
		return domNode;
	}

	if (tag === 3)
	{
		var domNode = vNode.h(vNode.g);
		_VirtualDom_applyFacts(domNode, eventNode, vNode.d);
		return domNode;
	}

	// at this point `tag` must be 1 or 2

	var domNode = vNode.f
		? _VirtualDom_doc.createElementNS(vNode.f, vNode.c)
		: _VirtualDom_doc.createElement(vNode.c);

	if (_VirtualDom_divertHrefToApp && vNode.c == 'a')
	{
		domNode.addEventListener('click', _VirtualDom_divertHrefToApp(domNode));
	}

	_VirtualDom_applyFacts(domNode, eventNode, vNode.d);

	for (var kids = vNode.e, i = 0; i < kids.length; i++)
	{
		_VirtualDom_appendChild(domNode, _VirtualDom_render(tag === 1 ? kids[i] : kids[i].b, eventNode));
	}

	return domNode;
}



// APPLY FACTS


function _VirtualDom_applyFacts(domNode, eventNode, facts)
{
	for (var key in facts)
	{
		var value = facts[key];

		key === 'a1'
			? _VirtualDom_applyStyles(domNode, value)
			:
		key === 'a0'
			? _VirtualDom_applyEvents(domNode, eventNode, value)
			:
		key === 'a3'
			? _VirtualDom_applyAttrs(domNode, value)
			:
		key === 'a4'
			? _VirtualDom_applyAttrsNS(domNode, value)
			:
		((key !== 'value' && key !== 'checked') || domNode[key] !== value) && (domNode[key] = value);
	}
}



// APPLY STYLES


function _VirtualDom_applyStyles(domNode, styles)
{
	var domNodeStyle = domNode.style;

	for (var key in styles)
	{
		domNodeStyle[key] = styles[key];
	}
}



// APPLY ATTRS


function _VirtualDom_applyAttrs(domNode, attrs)
{
	for (var key in attrs)
	{
		var value = attrs[key];
		typeof value !== 'undefined'
			? domNode.setAttribute(key, value)
			: domNode.removeAttribute(key);
	}
}



// APPLY NAMESPACED ATTRS


function _VirtualDom_applyAttrsNS(domNode, nsAttrs)
{
	for (var key in nsAttrs)
	{
		var pair = nsAttrs[key];
		var namespace = pair.f;
		var value = pair.o;

		typeof value !== 'undefined'
			? domNode.setAttributeNS(namespace, key, value)
			: domNode.removeAttributeNS(namespace, key);
	}
}



// APPLY EVENTS


function _VirtualDom_applyEvents(domNode, eventNode, events)
{
	var allCallbacks = domNode.elmFs || (domNode.elmFs = {});

	for (var key in events)
	{
		var newHandler = events[key];
		var oldCallback = allCallbacks[key];

		if (!newHandler)
		{
			domNode.removeEventListener(key, oldCallback);
			allCallbacks[key] = undefined;
			continue;
		}

		if (oldCallback)
		{
			var oldHandler = oldCallback.q;
			if (oldHandler.$ === newHandler.$)
			{
				oldCallback.q = newHandler;
				continue;
			}
			domNode.removeEventListener(key, oldCallback);
		}

		oldCallback = _VirtualDom_makeCallback(eventNode, newHandler);
		domNode.addEventListener(key, oldCallback,
			_VirtualDom_passiveSupported
			&& { passive: $elm$virtual_dom$VirtualDom$toHandlerInt(newHandler) < 2 }
		);
		allCallbacks[key] = oldCallback;
	}
}



// PASSIVE EVENTS


var _VirtualDom_passiveSupported;

try
{
	window.addEventListener('t', null, Object.defineProperty({}, 'passive', {
		get: function() { _VirtualDom_passiveSupported = true; }
	}));
}
catch(e) {}



// EVENT HANDLERS


function _VirtualDom_makeCallback(eventNode, initialHandler)
{
	function callback(event)
	{
		var handler = callback.q;
		var result = _Json_runHelp(handler.a, event);

		if (!$elm$core$Result$isOk(result))
		{
			return;
		}

		var tag = $elm$virtual_dom$VirtualDom$toHandlerInt(handler);

		// 0 = Normal
		// 1 = MayStopPropagation
		// 2 = MayPreventDefault
		// 3 = Custom

		var value = result.a;
		var message = !tag ? value : tag < 3 ? value.a : value.F;
		var stopPropagation = tag == 1 ? value.b : tag == 3 && value.ad;
		var currentEventNode = (
			stopPropagation && event.stopPropagation(),
			(tag == 2 ? value.b : tag == 3 && value._) && event.preventDefault(),
			eventNode
		);
		var tagger;
		var i;
		while (tagger = currentEventNode.j)
		{
			if (typeof tagger == 'function')
			{
				message = tagger(message);
			}
			else
			{
				for (var i = tagger.length; i--; )
				{
					message = tagger[i](message);
				}
			}
			currentEventNode = currentEventNode.p;
		}
		currentEventNode(message, stopPropagation); // stopPropagation implies isSync
	}

	callback.q = initialHandler;

	return callback;
}

function _VirtualDom_equalEvents(x, y)
{
	return x.$ == y.$ && _Json_equality(x.a, y.a);
}



// DIFF


// TODO: Should we do patches like in iOS?
//
// type Patch
//   = At Int Patch
//   | Batch (List Patch)
//   | Change ...
//
// How could it not be better?
//
function _VirtualDom_diff(x, y)
{
	var patches = [];
	_VirtualDom_diffHelp(x, y, patches, 0);
	return patches;
}


function _VirtualDom_pushPatch(patches, type, index, data)
{
	var patch = {
		$: type,
		r: index,
		s: data,
		t: undefined,
		u: undefined
	};
	patches.push(patch);
	return patch;
}


function _VirtualDom_diffHelp(x, y, patches, index)
{
	if (x === y)
	{
		return;
	}

	var xType = x.$;
	var yType = y.$;

	// Bail if you run into different types of nodes. Implies that the
	// structure has changed significantly and it's not worth a diff.
	if (xType !== yType)
	{
		if (xType === 1 && yType === 2)
		{
			y = _VirtualDom_dekey(y);
			yType = 1;
		}
		else
		{
			_VirtualDom_pushPatch(patches, 0, index, y);
			return;
		}
	}

	// Now we know that both nodes are the same $.
	switch (yType)
	{
		case 5:
			var xRefs = x.l;
			var yRefs = y.l;
			var i = xRefs.length;
			var same = i === yRefs.length;
			while (same && i--)
			{
				same = xRefs[i] === yRefs[i];
			}
			if (same)
			{
				y.k = x.k;
				return;
			}
			y.k = y.m();
			var subPatches = [];
			_VirtualDom_diffHelp(x.k, y.k, subPatches, 0);
			subPatches.length > 0 && _VirtualDom_pushPatch(patches, 1, index, subPatches);
			return;

		case 4:
			// gather nested taggers
			var xTaggers = x.j;
			var yTaggers = y.j;
			var nesting = false;

			var xSubNode = x.k;
			while (xSubNode.$ === 4)
			{
				nesting = true;

				typeof xTaggers !== 'object'
					? xTaggers = [xTaggers, xSubNode.j]
					: xTaggers.push(xSubNode.j);

				xSubNode = xSubNode.k;
			}

			var ySubNode = y.k;
			while (ySubNode.$ === 4)
			{
				nesting = true;

				typeof yTaggers !== 'object'
					? yTaggers = [yTaggers, ySubNode.j]
					: yTaggers.push(ySubNode.j);

				ySubNode = ySubNode.k;
			}

			// Just bail if different numbers of taggers. This implies the
			// structure of the virtual DOM has changed.
			if (nesting && xTaggers.length !== yTaggers.length)
			{
				_VirtualDom_pushPatch(patches, 0, index, y);
				return;
			}

			// check if taggers are "the same"
			if (nesting ? !_VirtualDom_pairwiseRefEqual(xTaggers, yTaggers) : xTaggers !== yTaggers)
			{
				_VirtualDom_pushPatch(patches, 2, index, yTaggers);
			}

			// diff everything below the taggers
			_VirtualDom_diffHelp(xSubNode, ySubNode, patches, index + 1);
			return;

		case 0:
			if (x.a !== y.a)
			{
				_VirtualDom_pushPatch(patches, 3, index, y.a);
			}
			return;

		case 1:
			_VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKids);
			return;

		case 2:
			_VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKeyedKids);
			return;

		case 3:
			if (x.h !== y.h)
			{
				_VirtualDom_pushPatch(patches, 0, index, y);
				return;
			}

			var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
			factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);

			var patch = y.i(x.g, y.g);
			patch && _VirtualDom_pushPatch(patches, 5, index, patch);

			return;
	}
}

// assumes the incoming arrays are the same length
function _VirtualDom_pairwiseRefEqual(as, bs)
{
	for (var i = 0; i < as.length; i++)
	{
		if (as[i] !== bs[i])
		{
			return false;
		}
	}

	return true;
}

function _VirtualDom_diffNodes(x, y, patches, index, diffKids)
{
	// Bail if obvious indicators have changed. Implies more serious
	// structural changes such that it's not worth it to diff.
	if (x.c !== y.c || x.f !== y.f)
	{
		_VirtualDom_pushPatch(patches, 0, index, y);
		return;
	}

	var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
	factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);

	diffKids(x, y, patches, index);
}



// DIFF FACTS


// TODO Instead of creating a new diff object, it's possible to just test if
// there *is* a diff. During the actual patch, do the diff again and make the
// modifications directly. This way, there's no new allocations. Worth it?
function _VirtualDom_diffFacts(x, y, category)
{
	var diff;

	// look for changes and removals
	for (var xKey in x)
	{
		if (xKey === 'a1' || xKey === 'a0' || xKey === 'a3' || xKey === 'a4')
		{
			var subDiff = _VirtualDom_diffFacts(x[xKey], y[xKey] || {}, xKey);
			if (subDiff)
			{
				diff = diff || {};
				diff[xKey] = subDiff;
			}
			continue;
		}

		// remove if not in the new facts
		if (!(xKey in y))
		{
			diff = diff || {};
			diff[xKey] =
				!category
					? (typeof x[xKey] === 'string' ? '' : null)
					:
				(category === 'a1')
					? ''
					:
				(category === 'a0' || category === 'a3')
					? undefined
					:
				{ f: x[xKey].f, o: undefined };

			continue;
		}

		var xValue = x[xKey];
		var yValue = y[xKey];

		// reference equal, so don't worry about it
		if (xValue === yValue && xKey !== 'value' && xKey !== 'checked'
			|| category === 'a0' && _VirtualDom_equalEvents(xValue, yValue))
		{
			continue;
		}

		diff = diff || {};
		diff[xKey] = yValue;
	}

	// add new stuff
	for (var yKey in y)
	{
		if (!(yKey in x))
		{
			diff = diff || {};
			diff[yKey] = y[yKey];
		}
	}

	return diff;
}



// DIFF KIDS


function _VirtualDom_diffKids(xParent, yParent, patches, index)
{
	var xKids = xParent.e;
	var yKids = yParent.e;

	var xLen = xKids.length;
	var yLen = yKids.length;

	// FIGURE OUT IF THERE ARE INSERTS OR REMOVALS

	if (xLen > yLen)
	{
		_VirtualDom_pushPatch(patches, 6, index, {
			v: yLen,
			i: xLen - yLen
		});
	}
	else if (xLen < yLen)
	{
		_VirtualDom_pushPatch(patches, 7, index, {
			v: xLen,
			e: yKids
		});
	}

	// PAIRWISE DIFF EVERYTHING ELSE

	for (var minLen = xLen < yLen ? xLen : yLen, i = 0; i < minLen; i++)
	{
		var xKid = xKids[i];
		_VirtualDom_diffHelp(xKid, yKids[i], patches, ++index);
		index += xKid.b || 0;
	}
}



// KEYED DIFF


function _VirtualDom_diffKeyedKids(xParent, yParent, patches, rootIndex)
{
	var localPatches = [];

	var changes = {}; // Dict String Entry
	var inserts = []; // Array { index : Int, entry : Entry }
	// type Entry = { tag : String, vnode : VNode, index : Int, data : _ }

	var xKids = xParent.e;
	var yKids = yParent.e;
	var xLen = xKids.length;
	var yLen = yKids.length;
	var xIndex = 0;
	var yIndex = 0;

	var index = rootIndex;

	while (xIndex < xLen && yIndex < yLen)
	{
		var x = xKids[xIndex];
		var y = yKids[yIndex];

		var xKey = x.a;
		var yKey = y.a;
		var xNode = x.b;
		var yNode = y.b;

		var newMatch = undefined;
		var oldMatch = undefined;

		// check if keys match

		if (xKey === yKey)
		{
			index++;
			_VirtualDom_diffHelp(xNode, yNode, localPatches, index);
			index += xNode.b || 0;

			xIndex++;
			yIndex++;
			continue;
		}

		// look ahead 1 to detect insertions and removals.

		var xNext = xKids[xIndex + 1];
		var yNext = yKids[yIndex + 1];

		if (xNext)
		{
			var xNextKey = xNext.a;
			var xNextNode = xNext.b;
			oldMatch = yKey === xNextKey;
		}

		if (yNext)
		{
			var yNextKey = yNext.a;
			var yNextNode = yNext.b;
			newMatch = xKey === yNextKey;
		}


		// swap x and y
		if (newMatch && oldMatch)
		{
			index++;
			_VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
			_VirtualDom_insertNode(changes, localPatches, xKey, yNode, yIndex, inserts);
			index += xNode.b || 0;

			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNextNode, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 2;
			continue;
		}

		// insert y
		if (newMatch)
		{
			index++;
			_VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
			_VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
			index += xNode.b || 0;

			xIndex += 1;
			yIndex += 2;
			continue;
		}

		// remove x
		if (oldMatch)
		{
			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
			index += xNode.b || 0;

			index++;
			_VirtualDom_diffHelp(xNextNode, yNode, localPatches, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 1;
			continue;
		}

		// remove x, insert y
		if (xNext && xNextKey === yNextKey)
		{
			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
			_VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
			index += xNode.b || 0;

			index++;
			_VirtualDom_diffHelp(xNextNode, yNextNode, localPatches, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 2;
			continue;
		}

		break;
	}

	// eat up any remaining nodes with removeNode and insertNode

	while (xIndex < xLen)
	{
		index++;
		var x = xKids[xIndex];
		var xNode = x.b;
		_VirtualDom_removeNode(changes, localPatches, x.a, xNode, index);
		index += xNode.b || 0;
		xIndex++;
	}

	while (yIndex < yLen)
	{
		var endInserts = endInserts || [];
		var y = yKids[yIndex];
		_VirtualDom_insertNode(changes, localPatches, y.a, y.b, undefined, endInserts);
		yIndex++;
	}

	if (localPatches.length > 0 || inserts.length > 0 || endInserts)
	{
		_VirtualDom_pushPatch(patches, 8, rootIndex, {
			w: localPatches,
			x: inserts,
			y: endInserts
		});
	}
}



// CHANGES FROM KEYED DIFF


var _VirtualDom_POSTFIX = '_elmW6BL';


function _VirtualDom_insertNode(changes, localPatches, key, vnode, yIndex, inserts)
{
	var entry = changes[key];

	// never seen this key before
	if (!entry)
	{
		entry = {
			c: 0,
			z: vnode,
			r: yIndex,
			s: undefined
		};

		inserts.push({ r: yIndex, A: entry });
		changes[key] = entry;

		return;
	}

	// this key was removed earlier, a match!
	if (entry.c === 1)
	{
		inserts.push({ r: yIndex, A: entry });

		entry.c = 2;
		var subPatches = [];
		_VirtualDom_diffHelp(entry.z, vnode, subPatches, entry.r);
		entry.r = yIndex;
		entry.s.s = {
			w: subPatches,
			A: entry
		};

		return;
	}

	// this key has already been inserted or moved, a duplicate!
	_VirtualDom_insertNode(changes, localPatches, key + _VirtualDom_POSTFIX, vnode, yIndex, inserts);
}


function _VirtualDom_removeNode(changes, localPatches, key, vnode, index)
{
	var entry = changes[key];

	// never seen this key before
	if (!entry)
	{
		var patch = _VirtualDom_pushPatch(localPatches, 9, index, undefined);

		changes[key] = {
			c: 1,
			z: vnode,
			r: index,
			s: patch
		};

		return;
	}

	// this key was inserted earlier, a match!
	if (entry.c === 0)
	{
		entry.c = 2;
		var subPatches = [];
		_VirtualDom_diffHelp(vnode, entry.z, subPatches, index);

		_VirtualDom_pushPatch(localPatches, 9, index, {
			w: subPatches,
			A: entry
		});

		return;
	}

	// this key has already been removed or moved, a duplicate!
	_VirtualDom_removeNode(changes, localPatches, key + _VirtualDom_POSTFIX, vnode, index);
}



// ADD DOM NODES
//
// Each DOM node has an "index" assigned in order of traversal. It is important
// to minimize our crawl over the actual DOM, so these indexes (along with the
// descendantsCount of virtual nodes) let us skip touching entire subtrees of
// the DOM if we know there are no patches there.


function _VirtualDom_addDomNodes(domNode, vNode, patches, eventNode)
{
	_VirtualDom_addDomNodesHelp(domNode, vNode, patches, 0, 0, vNode.b, eventNode);
}


// assumes `patches` is non-empty and indexes increase monotonically.
function _VirtualDom_addDomNodesHelp(domNode, vNode, patches, i, low, high, eventNode)
{
	var patch = patches[i];
	var index = patch.r;

	while (index === low)
	{
		var patchType = patch.$;

		if (patchType === 1)
		{
			_VirtualDom_addDomNodes(domNode, vNode.k, patch.s, eventNode);
		}
		else if (patchType === 8)
		{
			patch.t = domNode;
			patch.u = eventNode;

			var subPatches = patch.s.w;
			if (subPatches.length > 0)
			{
				_VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
			}
		}
		else if (patchType === 9)
		{
			patch.t = domNode;
			patch.u = eventNode;

			var data = patch.s;
			if (data)
			{
				data.A.s = domNode;
				var subPatches = data.w;
				if (subPatches.length > 0)
				{
					_VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
				}
			}
		}
		else
		{
			patch.t = domNode;
			patch.u = eventNode;
		}

		i++;

		if (!(patch = patches[i]) || (index = patch.r) > high)
		{
			return i;
		}
	}

	var tag = vNode.$;

	if (tag === 4)
	{
		var subNode = vNode.k;

		while (subNode.$ === 4)
		{
			subNode = subNode.k;
		}

		return _VirtualDom_addDomNodesHelp(domNode, subNode, patches, i, low + 1, high, domNode.elm_event_node_ref);
	}

	// tag must be 1 or 2 at this point

	var vKids = vNode.e;
	var childNodes = domNode.childNodes;
	for (var j = 0; j < vKids.length; j++)
	{
		low++;
		var vKid = tag === 1 ? vKids[j] : vKids[j].b;
		var nextLow = low + (vKid.b || 0);
		if (low <= index && index <= nextLow)
		{
			i = _VirtualDom_addDomNodesHelp(childNodes[j], vKid, patches, i, low, nextLow, eventNode);
			if (!(patch = patches[i]) || (index = patch.r) > high)
			{
				return i;
			}
		}
		low = nextLow;
	}
	return i;
}



// APPLY PATCHES


function _VirtualDom_applyPatches(rootDomNode, oldVirtualNode, patches, eventNode)
{
	if (patches.length === 0)
	{
		return rootDomNode;
	}

	_VirtualDom_addDomNodes(rootDomNode, oldVirtualNode, patches, eventNode);
	return _VirtualDom_applyPatchesHelp(rootDomNode, patches);
}

function _VirtualDom_applyPatchesHelp(rootDomNode, patches)
{
	for (var i = 0; i < patches.length; i++)
	{
		var patch = patches[i];
		var localDomNode = patch.t
		var newNode = _VirtualDom_applyPatch(localDomNode, patch);
		if (localDomNode === rootDomNode)
		{
			rootDomNode = newNode;
		}
	}
	return rootDomNode;
}

function _VirtualDom_applyPatch(domNode, patch)
{
	switch (patch.$)
	{
		case 0:
			return _VirtualDom_applyPatchRedraw(domNode, patch.s, patch.u);

		case 4:
			_VirtualDom_applyFacts(domNode, patch.u, patch.s);
			return domNode;

		case 3:
			domNode.replaceData(0, domNode.length, patch.s);
			return domNode;

		case 1:
			return _VirtualDom_applyPatchesHelp(domNode, patch.s);

		case 2:
			if (domNode.elm_event_node_ref)
			{
				domNode.elm_event_node_ref.j = patch.s;
			}
			else
			{
				domNode.elm_event_node_ref = { j: patch.s, p: patch.u };
			}
			return domNode;

		case 6:
			var data = patch.s;
			for (var i = 0; i < data.i; i++)
			{
				domNode.removeChild(domNode.childNodes[data.v]);
			}
			return domNode;

		case 7:
			var data = patch.s;
			var kids = data.e;
			var i = data.v;
			var theEnd = domNode.childNodes[i];
			for (; i < kids.length; i++)
			{
				domNode.insertBefore(_VirtualDom_render(kids[i], patch.u), theEnd);
			}
			return domNode;

		case 9:
			var data = patch.s;
			if (!data)
			{
				domNode.parentNode.removeChild(domNode);
				return domNode;
			}
			var entry = data.A;
			if (typeof entry.r !== 'undefined')
			{
				domNode.parentNode.removeChild(domNode);
			}
			entry.s = _VirtualDom_applyPatchesHelp(domNode, data.w);
			return domNode;

		case 8:
			return _VirtualDom_applyPatchReorder(domNode, patch);

		case 5:
			return patch.s(domNode);

		default:
			_Debug_crash(10); // 'Ran into an unknown patch!'
	}
}


function _VirtualDom_applyPatchRedraw(domNode, vNode, eventNode)
{
	var parentNode = domNode.parentNode;
	var newNode = _VirtualDom_render(vNode, eventNode);

	if (!newNode.elm_event_node_ref)
	{
		newNode.elm_event_node_ref = domNode.elm_event_node_ref;
	}

	if (parentNode && newNode !== domNode)
	{
		parentNode.replaceChild(newNode, domNode);
	}
	return newNode;
}


function _VirtualDom_applyPatchReorder(domNode, patch)
{
	var data = patch.s;

	// remove end inserts
	var frag = _VirtualDom_applyPatchReorderEndInsertsHelp(data.y, patch);

	// removals
	domNode = _VirtualDom_applyPatchesHelp(domNode, data.w);

	// inserts
	var inserts = data.x;
	for (var i = 0; i < inserts.length; i++)
	{
		var insert = inserts[i];
		var entry = insert.A;
		var node = entry.c === 2
			? entry.s
			: _VirtualDom_render(entry.z, patch.u);
		domNode.insertBefore(node, domNode.childNodes[insert.r]);
	}

	// add end inserts
	if (frag)
	{
		_VirtualDom_appendChild(domNode, frag);
	}

	return domNode;
}


function _VirtualDom_applyPatchReorderEndInsertsHelp(endInserts, patch)
{
	if (!endInserts)
	{
		return;
	}

	var frag = _VirtualDom_doc.createDocumentFragment();
	for (var i = 0; i < endInserts.length; i++)
	{
		var insert = endInserts[i];
		var entry = insert.A;
		_VirtualDom_appendChild(frag, entry.c === 2
			? entry.s
			: _VirtualDom_render(entry.z, patch.u)
		);
	}
	return frag;
}


function _VirtualDom_virtualize(node)
{
	// TEXT NODES

	if (node.nodeType === 3)
	{
		return _VirtualDom_text(node.textContent);
	}


	// WEIRD NODES

	if (node.nodeType !== 1)
	{
		return _VirtualDom_text('');
	}


	// ELEMENT NODES

	var attrList = _List_Nil;
	var attrs = node.attributes;
	for (var i = attrs.length; i--; )
	{
		var attr = attrs[i];
		var name = attr.name;
		var value = attr.value;
		attrList = _List_Cons( A2(_VirtualDom_attribute, name, value), attrList );
	}

	var tag = node.tagName.toLowerCase();
	var kidList = _List_Nil;
	var kids = node.childNodes;

	for (var i = kids.length; i--; )
	{
		kidList = _List_Cons(_VirtualDom_virtualize(kids[i]), kidList);
	}
	return A3(_VirtualDom_node, tag, attrList, kidList);
}

function _VirtualDom_dekey(keyedNode)
{
	var keyedKids = keyedNode.e;
	var len = keyedKids.length;
	var kids = new Array(len);
	for (var i = 0; i < len; i++)
	{
		kids[i] = keyedKids[i].b;
	}

	return {
		$: 1,
		c: keyedNode.c,
		d: keyedNode.d,
		e: kids,
		f: keyedNode.f,
		b: keyedNode.b
	};
}




// ELEMENT


var _Debugger_element;

var _Browser_element = _Debugger_element || F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.aS,
		impl.a0,
		impl.a$,
		function(sendToApp, initialModel) {
			var view = impl.a1;
			/**/
			var domNode = args['node'];
			//*/
			/**_UNUSED/
			var domNode = args && args['node'] ? args['node'] : _Debug_crash(0);
			//*/
			var currNode = _VirtualDom_virtualize(domNode);

			return _Browser_makeAnimator(initialModel, function(model)
			{
				var nextNode = view(model);
				var patches = _VirtualDom_diff(currNode, nextNode);
				domNode = _VirtualDom_applyPatches(domNode, currNode, patches, sendToApp);
				currNode = nextNode;
			});
		}
	);
});



// DOCUMENT


var _Debugger_document;

var _Browser_document = _Debugger_document || F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.aS,
		impl.a0,
		impl.a$,
		function(sendToApp, initialModel) {
			var divertHrefToApp = impl.aa && impl.aa(sendToApp)
			var view = impl.a1;
			var title = _VirtualDom_doc.title;
			var bodyNode = _VirtualDom_doc.body;
			var currNode = _VirtualDom_virtualize(bodyNode);
			return _Browser_makeAnimator(initialModel, function(model)
			{
				_VirtualDom_divertHrefToApp = divertHrefToApp;
				var doc = view(model);
				var nextNode = _VirtualDom_node('body')(_List_Nil)(doc.p);
				var patches = _VirtualDom_diff(currNode, nextNode);
				bodyNode = _VirtualDom_applyPatches(bodyNode, currNode, patches, sendToApp);
				currNode = nextNode;
				_VirtualDom_divertHrefToApp = 0;
				(title !== doc.t) && (_VirtualDom_doc.title = title = doc.t);
			});
		}
	);
});



// ANIMATION


var _Browser_cancelAnimationFrame =
	typeof cancelAnimationFrame !== 'undefined'
		? cancelAnimationFrame
		: function(id) { clearTimeout(id); };

var _Browser_requestAnimationFrame =
	typeof requestAnimationFrame !== 'undefined'
		? requestAnimationFrame
		: function(callback) { return setTimeout(callback, 1000 / 60); };


function _Browser_makeAnimator(model, draw)
{
	draw(model);

	var state = 0;

	function updateIfNeeded()
	{
		state = state === 1
			? 0
			: ( _Browser_requestAnimationFrame(updateIfNeeded), draw(model), 1 );
	}

	return function(nextModel, isSync)
	{
		model = nextModel;

		isSync
			? ( draw(model),
				state === 2 && (state = 1)
				)
			: ( state === 0 && _Browser_requestAnimationFrame(updateIfNeeded),
				state = 2
				);
	};
}



// APPLICATION


function _Browser_application(impl)
{
	var onUrlChange = impl.aU;
	var onUrlRequest = impl.aV;
	var key = function() { key.a(onUrlChange(_Browser_getUrl())); };

	return _Browser_document({
		aa: function(sendToApp)
		{
			key.a = sendToApp;
			_Browser_window.addEventListener('popstate', key);
			_Browser_window.navigator.userAgent.indexOf('Trident') < 0 || _Browser_window.addEventListener('hashchange', key);

			return F2(function(domNode, event)
			{
				if (!event.ctrlKey && !event.metaKey && !event.shiftKey && event.button < 1 && !domNode.target && !domNode.hasAttribute('download'))
				{
					event.preventDefault();
					var href = domNode.href;
					var curr = _Browser_getUrl();
					var next = $elm$url$Url$fromString(href).a;
					sendToApp(onUrlRequest(
						(next
							&& curr.aw === next.aw
							&& curr.an === next.an
							&& curr.at.a === next.at.a
						)
							? $elm$browser$Browser$Internal(next)
							: $elm$browser$Browser$External(href)
					));
				}
			});
		},
		aS: function(flags)
		{
			return A3(impl.aS, flags, _Browser_getUrl(), key);
		},
		a1: impl.a1,
		a0: impl.a0,
		a$: impl.a$
	});
}

function _Browser_getUrl()
{
	return $elm$url$Url$fromString(_VirtualDom_doc.location.href).a || _Debug_crash(1);
}

var _Browser_go = F2(function(key, n)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		n && history.go(n);
		key();
	}));
});

var _Browser_pushUrl = F2(function(key, url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		history.pushState({}, '', url);
		key();
	}));
});

var _Browser_replaceUrl = F2(function(key, url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		history.replaceState({}, '', url);
		key();
	}));
});



// GLOBAL EVENTS


var _Browser_fakeNode = { addEventListener: function() {}, removeEventListener: function() {} };
var _Browser_doc = typeof document !== 'undefined' ? document : _Browser_fakeNode;
var _Browser_window = typeof window !== 'undefined' ? window : _Browser_fakeNode;

var _Browser_on = F3(function(node, eventName, sendToSelf)
{
	return _Scheduler_spawn(_Scheduler_binding(function(callback)
	{
		function handler(event)	{ _Scheduler_rawSpawn(sendToSelf(event)); }
		node.addEventListener(eventName, handler, _VirtualDom_passiveSupported && { passive: true });
		return function() { node.removeEventListener(eventName, handler); };
	}));
});

var _Browser_decodeEvent = F2(function(decoder, event)
{
	var result = _Json_runHelp(decoder, event);
	return $elm$core$Result$isOk(result) ? $elm$core$Maybe$Just(result.a) : $elm$core$Maybe$Nothing;
});



// PAGE VISIBILITY


function _Browser_visibilityInfo()
{
	return (typeof _VirtualDom_doc.hidden !== 'undefined')
		? { aQ: 'hidden', aM: 'visibilitychange' }
		:
	(typeof _VirtualDom_doc.mozHidden !== 'undefined')
		? { aQ: 'mozHidden', aM: 'mozvisibilitychange' }
		:
	(typeof _VirtualDom_doc.msHidden !== 'undefined')
		? { aQ: 'msHidden', aM: 'msvisibilitychange' }
		:
	(typeof _VirtualDom_doc.webkitHidden !== 'undefined')
		? { aQ: 'webkitHidden', aM: 'webkitvisibilitychange' }
		: { aQ: 'hidden', aM: 'visibilitychange' };
}



// ANIMATION FRAMES


function _Browser_rAF()
{
	return _Scheduler_binding(function(callback)
	{
		var id = _Browser_requestAnimationFrame(function() {
			callback(_Scheduler_succeed(Date.now()));
		});

		return function() {
			_Browser_cancelAnimationFrame(id);
		};
	});
}


function _Browser_now()
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(Date.now()));
	});
}



// DOM STUFF


function _Browser_withNode(id, doStuff)
{
	return _Scheduler_binding(function(callback)
	{
		_Browser_requestAnimationFrame(function() {
			var node = document.getElementById(id);
			callback(node
				? _Scheduler_succeed(doStuff(node))
				: _Scheduler_fail($elm$browser$Browser$Dom$NotFound(id))
			);
		});
	});
}


function _Browser_withWindow(doStuff)
{
	return _Scheduler_binding(function(callback)
	{
		_Browser_requestAnimationFrame(function() {
			callback(_Scheduler_succeed(doStuff()));
		});
	});
}


// FOCUS and BLUR


var _Browser_call = F2(function(functionName, id)
{
	return _Browser_withNode(id, function(node) {
		node[functionName]();
		return _Utils_Tuple0;
	});
});



// WINDOW VIEWPORT


function _Browser_getViewport()
{
	return {
		aC: _Browser_getScene(),
		aG: {
			aI: _Browser_window.pageXOffset,
			aJ: _Browser_window.pageYOffset,
			aH: _Browser_doc.documentElement.clientWidth,
			am: _Browser_doc.documentElement.clientHeight
		}
	};
}

function _Browser_getScene()
{
	var body = _Browser_doc.body;
	var elem = _Browser_doc.documentElement;
	return {
		aH: Math.max(body.scrollWidth, body.offsetWidth, elem.scrollWidth, elem.offsetWidth, elem.clientWidth),
		am: Math.max(body.scrollHeight, body.offsetHeight, elem.scrollHeight, elem.offsetHeight, elem.clientHeight)
	};
}

var _Browser_setViewport = F2(function(x, y)
{
	return _Browser_withWindow(function()
	{
		_Browser_window.scroll(x, y);
		return _Utils_Tuple0;
	});
});



// ELEMENT VIEWPORT


function _Browser_getViewportOf(id)
{
	return _Browser_withNode(id, function(node)
	{
		return {
			aC: {
				aH: node.scrollWidth,
				am: node.scrollHeight
			},
			aG: {
				aI: node.scrollLeft,
				aJ: node.scrollTop,
				aH: node.clientWidth,
				am: node.clientHeight
			}
		};
	});
}


var _Browser_setViewportOf = F3(function(id, x, y)
{
	return _Browser_withNode(id, function(node)
	{
		node.scrollLeft = x;
		node.scrollTop = y;
		return _Utils_Tuple0;
	});
});



// ELEMENT


function _Browser_getElement(id)
{
	return _Browser_withNode(id, function(node)
	{
		var rect = node.getBoundingClientRect();
		var x = _Browser_window.pageXOffset;
		var y = _Browser_window.pageYOffset;
		return {
			aC: _Browser_getScene(),
			aG: {
				aI: x,
				aJ: y,
				aH: _Browser_doc.documentElement.clientWidth,
				am: _Browser_doc.documentElement.clientHeight
			},
			aO: {
				aI: x + rect.left,
				aJ: y + rect.top,
				aH: rect.width,
				am: rect.height
			}
		};
	});
}



// LOAD and RELOAD


function _Browser_reload(skipCache)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function(callback)
	{
		_VirtualDom_doc.location.reload(skipCache);
	}));
}

function _Browser_load(url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function(callback)
	{
		try
		{
			_Browser_window.location = url;
		}
		catch(err)
		{
			// Only Firefox can throw a NS_ERROR_MALFORMED_URI exception here.
			// Other browsers reload the page, so let's be consistent about that.
			_VirtualDom_doc.location.reload(false);
		}
	}));
}



// SEND REQUEST

var _Http_toTask = F3(function(router, toTask, request)
{
	return _Scheduler_binding(function(callback)
	{
		function done(response) {
			callback(toTask(request.e.a(response)));
		}

		var xhr = new XMLHttpRequest();
		xhr.addEventListener('error', function() { done($elm$http$Http$NetworkError_); });
		xhr.addEventListener('timeout', function() { done($elm$http$Http$Timeout_); });
		xhr.addEventListener('load', function() { done(_Http_toResponse(request.e.b, xhr)); });
		$elm$core$Maybe$isJust(request.B) && _Http_track(router, xhr, request.B.a);

		try {
			xhr.open(request.x, request.f, true);
		} catch (e) {
			return done($elm$http$Http$BadUrl_(request.f));
		}

		_Http_configureRequest(xhr, request);

		request.p.a && xhr.setRequestHeader('Content-Type', request.p.a);
		xhr.send(request.p.b);

		return function() { xhr.c = true; xhr.abort(); };
	});
});


// CONFIGURE

function _Http_configureRequest(xhr, request)
{
	for (var headers = request.w; headers.b; headers = headers.b) // WHILE_CONS
	{
		xhr.setRequestHeader(headers.a.a, headers.a.b);
	}
	xhr.timeout = request.A.a || 0;
	xhr.responseType = request.e.d;
	xhr.withCredentials = request.aK;
}


// RESPONSES

function _Http_toResponse(toBody, xhr)
{
	return A2(
		200 <= xhr.status && xhr.status < 300 ? $elm$http$Http$GoodStatus_ : $elm$http$Http$BadStatus_,
		_Http_toMetadata(xhr),
		toBody(xhr.response)
	);
}


// METADATA

function _Http_toMetadata(xhr)
{
	return {
		f: xhr.responseURL,
		c: xhr.status,
		a_: xhr.statusText,
		w: _Http_parseHeaders(xhr.getAllResponseHeaders())
	};
}


// HEADERS

function _Http_parseHeaders(rawHeaders)
{
	if (!rawHeaders)
	{
		return $elm$core$Dict$empty;
	}

	var headers = $elm$core$Dict$empty;
	var headerPairs = rawHeaders.split('\r\n');
	for (var i = headerPairs.length; i--; )
	{
		var headerPair = headerPairs[i];
		var index = headerPair.indexOf(': ');
		if (index > 0)
		{
			var key = headerPair.substring(0, index);
			var value = headerPair.substring(index + 2);

			headers = A3($elm$core$Dict$update, key, function(oldValue) {
				return $elm$core$Maybe$Just($elm$core$Maybe$isJust(oldValue)
					? value + ', ' + oldValue.a
					: value
				);
			}, headers);
		}
	}
	return headers;
}


// EXPECT

var _Http_expect = F3(function(type, toBody, toValue)
{
	return {
		$: 0,
		d: type,
		b: toBody,
		a: toValue
	};
});

var _Http_mapExpect = F2(function(func, expect)
{
	return {
		$: 0,
		d: expect.d,
		b: expect.b,
		a: function(x) { return func(expect.a(x)); }
	};
});

function _Http_toDataView(arrayBuffer)
{
	return new DataView(arrayBuffer);
}


// BODY and PARTS

var _Http_emptyBody = { $: 0 };
var _Http_pair = F2(function(a, b) { return { $: 0, a: a, b: b }; });

function _Http_toFormData(parts)
{
	for (var formData = new FormData(); parts.b; parts = parts.b) // WHILE_CONS
	{
		var part = parts.a;
		formData.append(part.a, part.b);
	}
	return formData;
}

var _Http_bytesToBlob = F2(function(mime, bytes)
{
	return new Blob([bytes], { type: mime });
});


// PROGRESS

function _Http_track(router, xhr, tracker)
{
	// TODO check out lengthComputable on loadstart event

	xhr.upload.addEventListener('progress', function(event) {
		if (xhr.c) { return; }
		_Scheduler_rawSpawn(A2($elm$core$Platform$sendToSelf, router, _Utils_Tuple2(tracker, $elm$http$Http$Sending({
			aZ: event.loaded,
			aD: event.total
		}))));
	});
	xhr.addEventListener('progress', function(event) {
		if (xhr.c) { return; }
		_Scheduler_rawSpawn(A2($elm$core$Platform$sendToSelf, router, _Utils_Tuple2(tracker, $elm$http$Http$Receiving({
			aX: event.loaded,
			aD: event.lengthComputable ? $elm$core$Maybe$Just(event.total) : $elm$core$Maybe$Nothing
		}))));
	});
}var $elm$core$Basics$EQ = 1;
var $elm$core$Basics$GT = 2;
var $elm$core$Basics$LT = 0;
var $elm$core$List$cons = _List_cons;
var $elm$core$Dict$foldr = F3(
	function (func, acc, t) {
		foldr:
		while (true) {
			if (t.$ === -2) {
				return acc;
			} else {
				var key = t.b;
				var value = t.c;
				var left = t.d;
				var right = t.e;
				var $temp$func = func,
					$temp$acc = A3(
					func,
					key,
					value,
					A3($elm$core$Dict$foldr, func, acc, right)),
					$temp$t = left;
				func = $temp$func;
				acc = $temp$acc;
				t = $temp$t;
				continue foldr;
			}
		}
	});
var $elm$core$Dict$toList = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, list) {
				return A2(
					$elm$core$List$cons,
					_Utils_Tuple2(key, value),
					list);
			}),
		_List_Nil,
		dict);
};
var $elm$core$Dict$keys = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, keyList) {
				return A2($elm$core$List$cons, key, keyList);
			}),
		_List_Nil,
		dict);
};
var $elm$core$Set$toList = function (_v0) {
	var dict = _v0;
	return $elm$core$Dict$keys(dict);
};
var $elm$core$Elm$JsArray$foldr = _JsArray_foldr;
var $elm$core$Array$foldr = F3(
	function (func, baseCase, _v0) {
		var tree = _v0.c;
		var tail = _v0.d;
		var helper = F2(
			function (node, acc) {
				if (!node.$) {
					var subTree = node.a;
					return A3($elm$core$Elm$JsArray$foldr, helper, acc, subTree);
				} else {
					var values = node.a;
					return A3($elm$core$Elm$JsArray$foldr, func, acc, values);
				}
			});
		return A3(
			$elm$core$Elm$JsArray$foldr,
			helper,
			A3($elm$core$Elm$JsArray$foldr, func, baseCase, tail),
			tree);
	});
var $elm$core$Array$toList = function (array) {
	return A3($elm$core$Array$foldr, $elm$core$List$cons, _List_Nil, array);
};
var $elm$core$Result$Err = function (a) {
	return {$: 1, a: a};
};
var $elm$json$Json$Decode$Failure = F2(
	function (a, b) {
		return {$: 3, a: a, b: b};
	});
var $elm$json$Json$Decode$Field = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $elm$json$Json$Decode$Index = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var $elm$core$Result$Ok = function (a) {
	return {$: 0, a: a};
};
var $elm$json$Json$Decode$OneOf = function (a) {
	return {$: 2, a: a};
};
var $elm$core$Basics$False = 1;
var $elm$core$Basics$add = _Basics_add;
var $elm$core$Maybe$Just = function (a) {
	return {$: 0, a: a};
};
var $elm$core$Maybe$Nothing = {$: 1};
var $elm$core$String$all = _String_all;
var $elm$core$Basics$and = _Basics_and;
var $elm$core$Basics$append = _Utils_append;
var $elm$json$Json$Encode$encode = _Json_encode;
var $elm$core$String$fromInt = _String_fromNumber;
var $elm$core$String$join = F2(
	function (sep, chunks) {
		return A2(
			_String_join,
			sep,
			_List_toArray(chunks));
	});
var $elm$core$String$split = F2(
	function (sep, string) {
		return _List_fromArray(
			A2(_String_split, sep, string));
	});
var $elm$json$Json$Decode$indent = function (str) {
	return A2(
		$elm$core$String$join,
		'\n    ',
		A2($elm$core$String$split, '\n', str));
};
var $elm$core$List$foldl = F3(
	function (func, acc, list) {
		foldl:
		while (true) {
			if (!list.b) {
				return acc;
			} else {
				var x = list.a;
				var xs = list.b;
				var $temp$func = func,
					$temp$acc = A2(func, x, acc),
					$temp$list = xs;
				func = $temp$func;
				acc = $temp$acc;
				list = $temp$list;
				continue foldl;
			}
		}
	});
var $elm$core$List$length = function (xs) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (_v0, i) {
				return i + 1;
			}),
		0,
		xs);
};
var $elm$core$List$map2 = _List_map2;
var $elm$core$Basics$le = _Utils_le;
var $elm$core$Basics$sub = _Basics_sub;
var $elm$core$List$rangeHelp = F3(
	function (lo, hi, list) {
		rangeHelp:
		while (true) {
			if (_Utils_cmp(lo, hi) < 1) {
				var $temp$lo = lo,
					$temp$hi = hi - 1,
					$temp$list = A2($elm$core$List$cons, hi, list);
				lo = $temp$lo;
				hi = $temp$hi;
				list = $temp$list;
				continue rangeHelp;
			} else {
				return list;
			}
		}
	});
var $elm$core$List$range = F2(
	function (lo, hi) {
		return A3($elm$core$List$rangeHelp, lo, hi, _List_Nil);
	});
var $elm$core$List$indexedMap = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$map2,
			f,
			A2(
				$elm$core$List$range,
				0,
				$elm$core$List$length(xs) - 1),
			xs);
	});
var $elm$core$Char$toCode = _Char_toCode;
var $elm$core$Char$isLower = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (97 <= code) && (code <= 122);
};
var $elm$core$Char$isUpper = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (code <= 90) && (65 <= code);
};
var $elm$core$Basics$or = _Basics_or;
var $elm$core$Char$isAlpha = function (_char) {
	return $elm$core$Char$isLower(_char) || $elm$core$Char$isUpper(_char);
};
var $elm$core$Char$isDigit = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (code <= 57) && (48 <= code);
};
var $elm$core$Char$isAlphaNum = function (_char) {
	return $elm$core$Char$isLower(_char) || ($elm$core$Char$isUpper(_char) || $elm$core$Char$isDigit(_char));
};
var $elm$core$List$reverse = function (list) {
	return A3($elm$core$List$foldl, $elm$core$List$cons, _List_Nil, list);
};
var $elm$core$String$uncons = _String_uncons;
var $elm$json$Json$Decode$errorOneOf = F2(
	function (i, error) {
		return '\n\n(' + ($elm$core$String$fromInt(i + 1) + (') ' + $elm$json$Json$Decode$indent(
			$elm$json$Json$Decode$errorToString(error))));
	});
var $elm$json$Json$Decode$errorToString = function (error) {
	return A2($elm$json$Json$Decode$errorToStringHelp, error, _List_Nil);
};
var $elm$json$Json$Decode$errorToStringHelp = F2(
	function (error, context) {
		errorToStringHelp:
		while (true) {
			switch (error.$) {
				case 0:
					var f = error.a;
					var err = error.b;
					var isSimple = function () {
						var _v1 = $elm$core$String$uncons(f);
						if (_v1.$ === 1) {
							return false;
						} else {
							var _v2 = _v1.a;
							var _char = _v2.a;
							var rest = _v2.b;
							return $elm$core$Char$isAlpha(_char) && A2($elm$core$String$all, $elm$core$Char$isAlphaNum, rest);
						}
					}();
					var fieldName = isSimple ? ('.' + f) : ('[\'' + (f + '\']'));
					var $temp$error = err,
						$temp$context = A2($elm$core$List$cons, fieldName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 1:
					var i = error.a;
					var err = error.b;
					var indexName = '[' + ($elm$core$String$fromInt(i) + ']');
					var $temp$error = err,
						$temp$context = A2($elm$core$List$cons, indexName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 2:
					var errors = error.a;
					if (!errors.b) {
						return 'Ran into a Json.Decode.oneOf with no possibilities' + function () {
							if (!context.b) {
								return '!';
							} else {
								return ' at json' + A2(
									$elm$core$String$join,
									'',
									$elm$core$List$reverse(context));
							}
						}();
					} else {
						if (!errors.b.b) {
							var err = errors.a;
							var $temp$error = err,
								$temp$context = context;
							error = $temp$error;
							context = $temp$context;
							continue errorToStringHelp;
						} else {
							var starter = function () {
								if (!context.b) {
									return 'Json.Decode.oneOf';
								} else {
									return 'The Json.Decode.oneOf at json' + A2(
										$elm$core$String$join,
										'',
										$elm$core$List$reverse(context));
								}
							}();
							var introduction = starter + (' failed in the following ' + ($elm$core$String$fromInt(
								$elm$core$List$length(errors)) + ' ways:'));
							return A2(
								$elm$core$String$join,
								'\n\n',
								A2(
									$elm$core$List$cons,
									introduction,
									A2($elm$core$List$indexedMap, $elm$json$Json$Decode$errorOneOf, errors)));
						}
					}
				default:
					var msg = error.a;
					var json = error.b;
					var introduction = function () {
						if (!context.b) {
							return 'Problem with the given value:\n\n';
						} else {
							return 'Problem with the value at json' + (A2(
								$elm$core$String$join,
								'',
								$elm$core$List$reverse(context)) + ':\n\n    ');
						}
					}();
					return introduction + ($elm$json$Json$Decode$indent(
						A2($elm$json$Json$Encode$encode, 4, json)) + ('\n\n' + msg));
			}
		}
	});
var $elm$core$Array$branchFactor = 32;
var $elm$core$Array$Array_elm_builtin = F4(
	function (a, b, c, d) {
		return {$: 0, a: a, b: b, c: c, d: d};
	});
var $elm$core$Elm$JsArray$empty = _JsArray_empty;
var $elm$core$Basics$ceiling = _Basics_ceiling;
var $elm$core$Basics$fdiv = _Basics_fdiv;
var $elm$core$Basics$logBase = F2(
	function (base, number) {
		return _Basics_log(number) / _Basics_log(base);
	});
var $elm$core$Basics$toFloat = _Basics_toFloat;
var $elm$core$Array$shiftStep = $elm$core$Basics$ceiling(
	A2($elm$core$Basics$logBase, 2, $elm$core$Array$branchFactor));
var $elm$core$Array$empty = A4($elm$core$Array$Array_elm_builtin, 0, $elm$core$Array$shiftStep, $elm$core$Elm$JsArray$empty, $elm$core$Elm$JsArray$empty);
var $elm$core$Elm$JsArray$initialize = _JsArray_initialize;
var $elm$core$Array$Leaf = function (a) {
	return {$: 1, a: a};
};
var $elm$core$Basics$apL = F2(
	function (f, x) {
		return f(x);
	});
var $elm$core$Basics$apR = F2(
	function (x, f) {
		return f(x);
	});
var $elm$core$Basics$eq = _Utils_equal;
var $elm$core$Basics$floor = _Basics_floor;
var $elm$core$Elm$JsArray$length = _JsArray_length;
var $elm$core$Basics$gt = _Utils_gt;
var $elm$core$Basics$max = F2(
	function (x, y) {
		return (_Utils_cmp(x, y) > 0) ? x : y;
	});
var $elm$core$Basics$mul = _Basics_mul;
var $elm$core$Array$SubTree = function (a) {
	return {$: 0, a: a};
};
var $elm$core$Elm$JsArray$initializeFromList = _JsArray_initializeFromList;
var $elm$core$Array$compressNodes = F2(
	function (nodes, acc) {
		compressNodes:
		while (true) {
			var _v0 = A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, nodes);
			var node = _v0.a;
			var remainingNodes = _v0.b;
			var newAcc = A2(
				$elm$core$List$cons,
				$elm$core$Array$SubTree(node),
				acc);
			if (!remainingNodes.b) {
				return $elm$core$List$reverse(newAcc);
			} else {
				var $temp$nodes = remainingNodes,
					$temp$acc = newAcc;
				nodes = $temp$nodes;
				acc = $temp$acc;
				continue compressNodes;
			}
		}
	});
var $elm$core$Tuple$first = function (_v0) {
	var x = _v0.a;
	return x;
};
var $elm$core$Array$treeFromBuilder = F2(
	function (nodeList, nodeListSize) {
		treeFromBuilder:
		while (true) {
			var newNodeSize = $elm$core$Basics$ceiling(nodeListSize / $elm$core$Array$branchFactor);
			if (newNodeSize === 1) {
				return A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, nodeList).a;
			} else {
				var $temp$nodeList = A2($elm$core$Array$compressNodes, nodeList, _List_Nil),
					$temp$nodeListSize = newNodeSize;
				nodeList = $temp$nodeList;
				nodeListSize = $temp$nodeListSize;
				continue treeFromBuilder;
			}
		}
	});
var $elm$core$Array$builderToArray = F2(
	function (reverseNodeList, builder) {
		if (!builder.h) {
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.k),
				$elm$core$Array$shiftStep,
				$elm$core$Elm$JsArray$empty,
				builder.k);
		} else {
			var treeLen = builder.h * $elm$core$Array$branchFactor;
			var depth = $elm$core$Basics$floor(
				A2($elm$core$Basics$logBase, $elm$core$Array$branchFactor, treeLen - 1));
			var correctNodeList = reverseNodeList ? $elm$core$List$reverse(builder.m) : builder.m;
			var tree = A2($elm$core$Array$treeFromBuilder, correctNodeList, builder.h);
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.k) + treeLen,
				A2($elm$core$Basics$max, 5, depth * $elm$core$Array$shiftStep),
				tree,
				builder.k);
		}
	});
var $elm$core$Basics$idiv = _Basics_idiv;
var $elm$core$Basics$lt = _Utils_lt;
var $elm$core$Array$initializeHelp = F5(
	function (fn, fromIndex, len, nodeList, tail) {
		initializeHelp:
		while (true) {
			if (fromIndex < 0) {
				return A2(
					$elm$core$Array$builderToArray,
					false,
					{m: nodeList, h: (len / $elm$core$Array$branchFactor) | 0, k: tail});
			} else {
				var leaf = $elm$core$Array$Leaf(
					A3($elm$core$Elm$JsArray$initialize, $elm$core$Array$branchFactor, fromIndex, fn));
				var $temp$fn = fn,
					$temp$fromIndex = fromIndex - $elm$core$Array$branchFactor,
					$temp$len = len,
					$temp$nodeList = A2($elm$core$List$cons, leaf, nodeList),
					$temp$tail = tail;
				fn = $temp$fn;
				fromIndex = $temp$fromIndex;
				len = $temp$len;
				nodeList = $temp$nodeList;
				tail = $temp$tail;
				continue initializeHelp;
			}
		}
	});
var $elm$core$Basics$remainderBy = _Basics_remainderBy;
var $elm$core$Array$initialize = F2(
	function (len, fn) {
		if (len <= 0) {
			return $elm$core$Array$empty;
		} else {
			var tailLen = len % $elm$core$Array$branchFactor;
			var tail = A3($elm$core$Elm$JsArray$initialize, tailLen, len - tailLen, fn);
			var initialFromIndex = (len - tailLen) - $elm$core$Array$branchFactor;
			return A5($elm$core$Array$initializeHelp, fn, initialFromIndex, len, _List_Nil, tail);
		}
	});
var $elm$core$Basics$True = 0;
var $elm$core$Result$isOk = function (result) {
	if (!result.$) {
		return true;
	} else {
		return false;
	}
};
var $elm$json$Json$Decode$map = _Json_map1;
var $elm$json$Json$Decode$map2 = _Json_map2;
var $elm$json$Json$Decode$succeed = _Json_succeed;
var $elm$virtual_dom$VirtualDom$toHandlerInt = function (handler) {
	switch (handler.$) {
		case 0:
			return 0;
		case 1:
			return 1;
		case 2:
			return 2;
		default:
			return 3;
	}
};
var $elm$browser$Browser$External = function (a) {
	return {$: 1, a: a};
};
var $elm$browser$Browser$Internal = function (a) {
	return {$: 0, a: a};
};
var $elm$core$Basics$identity = function (x) {
	return x;
};
var $elm$browser$Browser$Dom$NotFound = $elm$core$Basics$identity;
var $elm$url$Url$Http = 0;
var $elm$url$Url$Https = 1;
var $elm$url$Url$Url = F6(
	function (protocol, host, port_, path, query, fragment) {
		return {al: fragment, an: host, ar: path, at: port_, aw: protocol, ax: query};
	});
var $elm$core$String$contains = _String_contains;
var $elm$core$String$length = _String_length;
var $elm$core$String$slice = _String_slice;
var $elm$core$String$dropLeft = F2(
	function (n, string) {
		return (n < 1) ? string : A3(
			$elm$core$String$slice,
			n,
			$elm$core$String$length(string),
			string);
	});
var $elm$core$String$indexes = _String_indexes;
var $elm$core$String$isEmpty = function (string) {
	return string === '';
};
var $elm$core$String$left = F2(
	function (n, string) {
		return (n < 1) ? '' : A3($elm$core$String$slice, 0, n, string);
	});
var $elm$core$String$toInt = _String_toInt;
var $elm$url$Url$chompBeforePath = F5(
	function (protocol, path, params, frag, str) {
		if ($elm$core$String$isEmpty(str) || A2($elm$core$String$contains, '@', str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, ':', str);
			if (!_v0.b) {
				return $elm$core$Maybe$Just(
					A6($elm$url$Url$Url, protocol, str, $elm$core$Maybe$Nothing, path, params, frag));
			} else {
				if (!_v0.b.b) {
					var i = _v0.a;
					var _v1 = $elm$core$String$toInt(
						A2($elm$core$String$dropLeft, i + 1, str));
					if (_v1.$ === 1) {
						return $elm$core$Maybe$Nothing;
					} else {
						var port_ = _v1;
						return $elm$core$Maybe$Just(
							A6(
								$elm$url$Url$Url,
								protocol,
								A2($elm$core$String$left, i, str),
								port_,
								path,
								params,
								frag));
					}
				} else {
					return $elm$core$Maybe$Nothing;
				}
			}
		}
	});
var $elm$url$Url$chompBeforeQuery = F4(
	function (protocol, params, frag, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '/', str);
			if (!_v0.b) {
				return A5($elm$url$Url$chompBeforePath, protocol, '/', params, frag, str);
			} else {
				var i = _v0.a;
				return A5(
					$elm$url$Url$chompBeforePath,
					protocol,
					A2($elm$core$String$dropLeft, i, str),
					params,
					frag,
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$url$Url$chompBeforeFragment = F3(
	function (protocol, frag, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '?', str);
			if (!_v0.b) {
				return A4($elm$url$Url$chompBeforeQuery, protocol, $elm$core$Maybe$Nothing, frag, str);
			} else {
				var i = _v0.a;
				return A4(
					$elm$url$Url$chompBeforeQuery,
					protocol,
					$elm$core$Maybe$Just(
						A2($elm$core$String$dropLeft, i + 1, str)),
					frag,
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$url$Url$chompAfterProtocol = F2(
	function (protocol, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '#', str);
			if (!_v0.b) {
				return A3($elm$url$Url$chompBeforeFragment, protocol, $elm$core$Maybe$Nothing, str);
			} else {
				var i = _v0.a;
				return A3(
					$elm$url$Url$chompBeforeFragment,
					protocol,
					$elm$core$Maybe$Just(
						A2($elm$core$String$dropLeft, i + 1, str)),
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$core$String$startsWith = _String_startsWith;
var $elm$url$Url$fromString = function (str) {
	return A2($elm$core$String$startsWith, 'http://', str) ? A2(
		$elm$url$Url$chompAfterProtocol,
		0,
		A2($elm$core$String$dropLeft, 7, str)) : (A2($elm$core$String$startsWith, 'https://', str) ? A2(
		$elm$url$Url$chompAfterProtocol,
		1,
		A2($elm$core$String$dropLeft, 8, str)) : $elm$core$Maybe$Nothing);
};
var $elm$core$Basics$never = function (_v0) {
	never:
	while (true) {
		var nvr = _v0;
		var $temp$_v0 = nvr;
		_v0 = $temp$_v0;
		continue never;
	}
};
var $elm$core$Task$Perform = $elm$core$Basics$identity;
var $elm$core$Task$succeed = _Scheduler_succeed;
var $elm$core$Task$init = $elm$core$Task$succeed(0);
var $elm$core$List$foldrHelper = F4(
	function (fn, acc, ctr, ls) {
		if (!ls.b) {
			return acc;
		} else {
			var a = ls.a;
			var r1 = ls.b;
			if (!r1.b) {
				return A2(fn, a, acc);
			} else {
				var b = r1.a;
				var r2 = r1.b;
				if (!r2.b) {
					return A2(
						fn,
						a,
						A2(fn, b, acc));
				} else {
					var c = r2.a;
					var r3 = r2.b;
					if (!r3.b) {
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(fn, c, acc)));
					} else {
						var d = r3.a;
						var r4 = r3.b;
						var res = (ctr > 500) ? A3(
							$elm$core$List$foldl,
							fn,
							acc,
							$elm$core$List$reverse(r4)) : A4($elm$core$List$foldrHelper, fn, acc, ctr + 1, r4);
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(
									fn,
									c,
									A2(fn, d, res))));
					}
				}
			}
		}
	});
var $elm$core$List$foldr = F3(
	function (fn, acc, ls) {
		return A4($elm$core$List$foldrHelper, fn, acc, 0, ls);
	});
var $elm$core$List$map = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$foldr,
			F2(
				function (x, acc) {
					return A2(
						$elm$core$List$cons,
						f(x),
						acc);
				}),
			_List_Nil,
			xs);
	});
var $elm$core$Task$andThen = _Scheduler_andThen;
var $elm$core$Task$map = F2(
	function (func, taskA) {
		return A2(
			$elm$core$Task$andThen,
			function (a) {
				return $elm$core$Task$succeed(
					func(a));
			},
			taskA);
	});
var $elm$core$Task$map2 = F3(
	function (func, taskA, taskB) {
		return A2(
			$elm$core$Task$andThen,
			function (a) {
				return A2(
					$elm$core$Task$andThen,
					function (b) {
						return $elm$core$Task$succeed(
							A2(func, a, b));
					},
					taskB);
			},
			taskA);
	});
var $elm$core$Task$sequence = function (tasks) {
	return A3(
		$elm$core$List$foldr,
		$elm$core$Task$map2($elm$core$List$cons),
		$elm$core$Task$succeed(_List_Nil),
		tasks);
};
var $elm$core$Platform$sendToApp = _Platform_sendToApp;
var $elm$core$Task$spawnCmd = F2(
	function (router, _v0) {
		var task = _v0;
		return _Scheduler_spawn(
			A2(
				$elm$core$Task$andThen,
				$elm$core$Platform$sendToApp(router),
				task));
	});
var $elm$core$Task$onEffects = F3(
	function (router, commands, state) {
		return A2(
			$elm$core$Task$map,
			function (_v0) {
				return 0;
			},
			$elm$core$Task$sequence(
				A2(
					$elm$core$List$map,
					$elm$core$Task$spawnCmd(router),
					commands)));
	});
var $elm$core$Task$onSelfMsg = F3(
	function (_v0, _v1, _v2) {
		return $elm$core$Task$succeed(0);
	});
var $elm$core$Task$cmdMap = F2(
	function (tagger, _v0) {
		var task = _v0;
		return A2($elm$core$Task$map, tagger, task);
	});
_Platform_effectManagers['Task'] = _Platform_createManager($elm$core$Task$init, $elm$core$Task$onEffects, $elm$core$Task$onSelfMsg, $elm$core$Task$cmdMap);
var $elm$core$Task$command = _Platform_leaf('Task');
var $elm$core$Task$perform = F2(
	function (toMessage, task) {
		return $elm$core$Task$command(
			A2($elm$core$Task$map, toMessage, task));
	});
var $elm$browser$Browser$element = _Browser_element;
var $author$project$Data$authorsError = _List_fromArray(
	[
		_Utils_Tuple2('Madonna', ''),
		_Utils_Tuple2('', 'Madonna')
	]);
var $elm$core$List$head = function (list) {
	if (list.b) {
		var x = list.a;
		var xs = list.b;
		return $elm$core$Maybe$Just(x);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $author$project$Main$initialModel = {d: _List_Nil, g: _List_Nil, b: 0, R: _List_Nil};
var $elm$core$Platform$Cmd$batch = _Platform_batch;
var $elm$core$Platform$Cmd$none = $elm$core$Platform$Cmd$batch(_List_Nil);
var $author$project$Main$PostAuthorError = F4(
	function (a, b, c, d) {
		return {$: 4, a: a, b: b, c: c, d: d};
	});
var $author$project$Main$Author = F4(
	function (id, firstName, lastName, index) {
		return {l: firstName, a: id, X: index, n: lastName};
	});
var $elm$json$Json$Decode$field = _Json_decodeField;
var $elm$json$Json$Decode$int = _Json_decodeInt;
var $elm$json$Json$Decode$map4 = _Json_map4;
var $elm$json$Json$Decode$string = _Json_decodeString;
var $author$project$Main$authorDecoder = A5(
	$elm$json$Json$Decode$map4,
	$author$project$Main$Author,
	A2($elm$json$Json$Decode$field, 'id', $elm$json$Json$Decode$int),
	A2($elm$json$Json$Decode$field, 'first_name', $elm$json$Json$Decode$string),
	A2($elm$json$Json$Decode$field, 'last_name', $elm$json$Json$Decode$string),
	$elm$json$Json$Decode$succeed(0));
var $elm$http$Http$BadStatus_ = F2(
	function (a, b) {
		return {$: 3, a: a, b: b};
	});
var $elm$http$Http$BadUrl_ = function (a) {
	return {$: 0, a: a};
};
var $elm$http$Http$GoodStatus_ = F2(
	function (a, b) {
		return {$: 4, a: a, b: b};
	});
var $elm$http$Http$NetworkError_ = {$: 2};
var $elm$http$Http$Receiving = function (a) {
	return {$: 1, a: a};
};
var $elm$http$Http$Sending = function (a) {
	return {$: 0, a: a};
};
var $elm$http$Http$Timeout_ = {$: 1};
var $elm$core$Dict$RBEmpty_elm_builtin = {$: -2};
var $elm$core$Dict$empty = $elm$core$Dict$RBEmpty_elm_builtin;
var $elm$core$Maybe$isJust = function (maybe) {
	if (!maybe.$) {
		return true;
	} else {
		return false;
	}
};
var $elm$core$Platform$sendToSelf = _Platform_sendToSelf;
var $elm$core$Basics$compare = _Utils_compare;
var $elm$core$Dict$get = F2(
	function (targetKey, dict) {
		get:
		while (true) {
			if (dict.$ === -2) {
				return $elm$core$Maybe$Nothing;
			} else {
				var key = dict.b;
				var value = dict.c;
				var left = dict.d;
				var right = dict.e;
				var _v1 = A2($elm$core$Basics$compare, targetKey, key);
				switch (_v1) {
					case 0:
						var $temp$targetKey = targetKey,
							$temp$dict = left;
						targetKey = $temp$targetKey;
						dict = $temp$dict;
						continue get;
					case 1:
						return $elm$core$Maybe$Just(value);
					default:
						var $temp$targetKey = targetKey,
							$temp$dict = right;
						targetKey = $temp$targetKey;
						dict = $temp$dict;
						continue get;
				}
			}
		}
	});
var $elm$core$Dict$Black = 1;
var $elm$core$Dict$RBNode_elm_builtin = F5(
	function (a, b, c, d, e) {
		return {$: -1, a: a, b: b, c: c, d: d, e: e};
	});
var $elm$core$Dict$Red = 0;
var $elm$core$Dict$balance = F5(
	function (color, key, value, left, right) {
		if ((right.$ === -1) && (!right.a)) {
			var _v1 = right.a;
			var rK = right.b;
			var rV = right.c;
			var rLeft = right.d;
			var rRight = right.e;
			if ((left.$ === -1) && (!left.a)) {
				var _v3 = left.a;
				var lK = left.b;
				var lV = left.c;
				var lLeft = left.d;
				var lRight = left.e;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					0,
					key,
					value,
					A5($elm$core$Dict$RBNode_elm_builtin, 1, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 1, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					color,
					rK,
					rV,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, key, value, left, rLeft),
					rRight);
			}
		} else {
			if ((((left.$ === -1) && (!left.a)) && (left.d.$ === -1)) && (!left.d.a)) {
				var _v5 = left.a;
				var lK = left.b;
				var lV = left.c;
				var _v6 = left.d;
				var _v7 = _v6.a;
				var llK = _v6.b;
				var llV = _v6.c;
				var llLeft = _v6.d;
				var llRight = _v6.e;
				var lRight = left.e;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					0,
					lK,
					lV,
					A5($elm$core$Dict$RBNode_elm_builtin, 1, llK, llV, llLeft, llRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 1, key, value, lRight, right));
			} else {
				return A5($elm$core$Dict$RBNode_elm_builtin, color, key, value, left, right);
			}
		}
	});
var $elm$core$Dict$insertHelp = F3(
	function (key, value, dict) {
		if (dict.$ === -2) {
			return A5($elm$core$Dict$RBNode_elm_builtin, 0, key, value, $elm$core$Dict$RBEmpty_elm_builtin, $elm$core$Dict$RBEmpty_elm_builtin);
		} else {
			var nColor = dict.a;
			var nKey = dict.b;
			var nValue = dict.c;
			var nLeft = dict.d;
			var nRight = dict.e;
			var _v1 = A2($elm$core$Basics$compare, key, nKey);
			switch (_v1) {
				case 0:
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						A3($elm$core$Dict$insertHelp, key, value, nLeft),
						nRight);
				case 1:
					return A5($elm$core$Dict$RBNode_elm_builtin, nColor, nKey, value, nLeft, nRight);
				default:
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						nLeft,
						A3($elm$core$Dict$insertHelp, key, value, nRight));
			}
		}
	});
var $elm$core$Dict$insert = F3(
	function (key, value, dict) {
		var _v0 = A3($elm$core$Dict$insertHelp, key, value, dict);
		if ((_v0.$ === -1) && (!_v0.a)) {
			var _v1 = _v0.a;
			var k = _v0.b;
			var v = _v0.c;
			var l = _v0.d;
			var r = _v0.e;
			return A5($elm$core$Dict$RBNode_elm_builtin, 1, k, v, l, r);
		} else {
			var x = _v0;
			return x;
		}
	});
var $elm$core$Dict$getMin = function (dict) {
	getMin:
	while (true) {
		if ((dict.$ === -1) && (dict.d.$ === -1)) {
			var left = dict.d;
			var $temp$dict = left;
			dict = $temp$dict;
			continue getMin;
		} else {
			return dict;
		}
	}
};
var $elm$core$Dict$moveRedLeft = function (dict) {
	if (((dict.$ === -1) && (dict.d.$ === -1)) && (dict.e.$ === -1)) {
		if ((dict.e.d.$ === -1) && (!dict.e.d.a)) {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v1 = dict.d;
			var lClr = _v1.a;
			var lK = _v1.b;
			var lV = _v1.c;
			var lLeft = _v1.d;
			var lRight = _v1.e;
			var _v2 = dict.e;
			var rClr = _v2.a;
			var rK = _v2.b;
			var rV = _v2.c;
			var rLeft = _v2.d;
			var _v3 = rLeft.a;
			var rlK = rLeft.b;
			var rlV = rLeft.c;
			var rlL = rLeft.d;
			var rlR = rLeft.e;
			var rRight = _v2.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				0,
				rlK,
				rlV,
				A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					rlL),
				A5($elm$core$Dict$RBNode_elm_builtin, 1, rK, rV, rlR, rRight));
		} else {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v4 = dict.d;
			var lClr = _v4.a;
			var lK = _v4.b;
			var lV = _v4.c;
			var lLeft = _v4.d;
			var lRight = _v4.e;
			var _v5 = dict.e;
			var rClr = _v5.a;
			var rK = _v5.b;
			var rV = _v5.c;
			var rLeft = _v5.d;
			var rRight = _v5.e;
			if (clr === 1) {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight));
			}
		}
	} else {
		return dict;
	}
};
var $elm$core$Dict$moveRedRight = function (dict) {
	if (((dict.$ === -1) && (dict.d.$ === -1)) && (dict.e.$ === -1)) {
		if ((dict.d.d.$ === -1) && (!dict.d.d.a)) {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v1 = dict.d;
			var lClr = _v1.a;
			var lK = _v1.b;
			var lV = _v1.c;
			var _v2 = _v1.d;
			var _v3 = _v2.a;
			var llK = _v2.b;
			var llV = _v2.c;
			var llLeft = _v2.d;
			var llRight = _v2.e;
			var lRight = _v1.e;
			var _v4 = dict.e;
			var rClr = _v4.a;
			var rK = _v4.b;
			var rV = _v4.c;
			var rLeft = _v4.d;
			var rRight = _v4.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				0,
				lK,
				lV,
				A5($elm$core$Dict$RBNode_elm_builtin, 1, llK, llV, llLeft, llRight),
				A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					lRight,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight)));
		} else {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v5 = dict.d;
			var lClr = _v5.a;
			var lK = _v5.b;
			var lV = _v5.c;
			var lLeft = _v5.d;
			var lRight = _v5.e;
			var _v6 = dict.e;
			var rClr = _v6.a;
			var rK = _v6.b;
			var rV = _v6.c;
			var rLeft = _v6.d;
			var rRight = _v6.e;
			if (clr === 1) {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight));
			}
		}
	} else {
		return dict;
	}
};
var $elm$core$Dict$removeHelpPrepEQGT = F7(
	function (targetKey, dict, color, key, value, left, right) {
		if ((left.$ === -1) && (!left.a)) {
			var _v1 = left.a;
			var lK = left.b;
			var lV = left.c;
			var lLeft = left.d;
			var lRight = left.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				color,
				lK,
				lV,
				lLeft,
				A5($elm$core$Dict$RBNode_elm_builtin, 0, key, value, lRight, right));
		} else {
			_v2$2:
			while (true) {
				if ((right.$ === -1) && (right.a === 1)) {
					if (right.d.$ === -1) {
						if (right.d.a === 1) {
							var _v3 = right.a;
							var _v4 = right.d;
							var _v5 = _v4.a;
							return $elm$core$Dict$moveRedRight(dict);
						} else {
							break _v2$2;
						}
					} else {
						var _v6 = right.a;
						var _v7 = right.d;
						return $elm$core$Dict$moveRedRight(dict);
					}
				} else {
					break _v2$2;
				}
			}
			return dict;
		}
	});
var $elm$core$Dict$removeMin = function (dict) {
	if ((dict.$ === -1) && (dict.d.$ === -1)) {
		var color = dict.a;
		var key = dict.b;
		var value = dict.c;
		var left = dict.d;
		var lColor = left.a;
		var lLeft = left.d;
		var right = dict.e;
		if (lColor === 1) {
			if ((lLeft.$ === -1) && (!lLeft.a)) {
				var _v3 = lLeft.a;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					color,
					key,
					value,
					$elm$core$Dict$removeMin(left),
					right);
			} else {
				var _v4 = $elm$core$Dict$moveRedLeft(dict);
				if (_v4.$ === -1) {
					var nColor = _v4.a;
					var nKey = _v4.b;
					var nValue = _v4.c;
					var nLeft = _v4.d;
					var nRight = _v4.e;
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						$elm$core$Dict$removeMin(nLeft),
						nRight);
				} else {
					return $elm$core$Dict$RBEmpty_elm_builtin;
				}
			}
		} else {
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				color,
				key,
				value,
				$elm$core$Dict$removeMin(left),
				right);
		}
	} else {
		return $elm$core$Dict$RBEmpty_elm_builtin;
	}
};
var $elm$core$Dict$removeHelp = F2(
	function (targetKey, dict) {
		if (dict.$ === -2) {
			return $elm$core$Dict$RBEmpty_elm_builtin;
		} else {
			var color = dict.a;
			var key = dict.b;
			var value = dict.c;
			var left = dict.d;
			var right = dict.e;
			if (_Utils_cmp(targetKey, key) < 0) {
				if ((left.$ === -1) && (left.a === 1)) {
					var _v4 = left.a;
					var lLeft = left.d;
					if ((lLeft.$ === -1) && (!lLeft.a)) {
						var _v6 = lLeft.a;
						return A5(
							$elm$core$Dict$RBNode_elm_builtin,
							color,
							key,
							value,
							A2($elm$core$Dict$removeHelp, targetKey, left),
							right);
					} else {
						var _v7 = $elm$core$Dict$moveRedLeft(dict);
						if (_v7.$ === -1) {
							var nColor = _v7.a;
							var nKey = _v7.b;
							var nValue = _v7.c;
							var nLeft = _v7.d;
							var nRight = _v7.e;
							return A5(
								$elm$core$Dict$balance,
								nColor,
								nKey,
								nValue,
								A2($elm$core$Dict$removeHelp, targetKey, nLeft),
								nRight);
						} else {
							return $elm$core$Dict$RBEmpty_elm_builtin;
						}
					}
				} else {
					return A5(
						$elm$core$Dict$RBNode_elm_builtin,
						color,
						key,
						value,
						A2($elm$core$Dict$removeHelp, targetKey, left),
						right);
				}
			} else {
				return A2(
					$elm$core$Dict$removeHelpEQGT,
					targetKey,
					A7($elm$core$Dict$removeHelpPrepEQGT, targetKey, dict, color, key, value, left, right));
			}
		}
	});
var $elm$core$Dict$removeHelpEQGT = F2(
	function (targetKey, dict) {
		if (dict.$ === -1) {
			var color = dict.a;
			var key = dict.b;
			var value = dict.c;
			var left = dict.d;
			var right = dict.e;
			if (_Utils_eq(targetKey, key)) {
				var _v1 = $elm$core$Dict$getMin(right);
				if (_v1.$ === -1) {
					var minKey = _v1.b;
					var minValue = _v1.c;
					return A5(
						$elm$core$Dict$balance,
						color,
						minKey,
						minValue,
						left,
						$elm$core$Dict$removeMin(right));
				} else {
					return $elm$core$Dict$RBEmpty_elm_builtin;
				}
			} else {
				return A5(
					$elm$core$Dict$balance,
					color,
					key,
					value,
					left,
					A2($elm$core$Dict$removeHelp, targetKey, right));
			}
		} else {
			return $elm$core$Dict$RBEmpty_elm_builtin;
		}
	});
var $elm$core$Dict$remove = F2(
	function (key, dict) {
		var _v0 = A2($elm$core$Dict$removeHelp, key, dict);
		if ((_v0.$ === -1) && (!_v0.a)) {
			var _v1 = _v0.a;
			var k = _v0.b;
			var v = _v0.c;
			var l = _v0.d;
			var r = _v0.e;
			return A5($elm$core$Dict$RBNode_elm_builtin, 1, k, v, l, r);
		} else {
			var x = _v0;
			return x;
		}
	});
var $elm$core$Dict$update = F3(
	function (targetKey, alter, dictionary) {
		var _v0 = alter(
			A2($elm$core$Dict$get, targetKey, dictionary));
		if (!_v0.$) {
			var value = _v0.a;
			return A3($elm$core$Dict$insert, targetKey, value, dictionary);
		} else {
			return A2($elm$core$Dict$remove, targetKey, dictionary);
		}
	});
var $elm$core$Basics$composeR = F3(
	function (f, g, x) {
		return g(
			f(x));
	});
var $elm$http$Http$expectStringResponse = F2(
	function (toMsg, toResult) {
		return A3(
			_Http_expect,
			'',
			$elm$core$Basics$identity,
			A2($elm$core$Basics$composeR, toResult, toMsg));
	});
var $elm$json$Json$Decode$decodeString = _Json_runOnString;
var $elm$core$Result$mapError = F2(
	function (f, result) {
		if (!result.$) {
			var v = result.a;
			return $elm$core$Result$Ok(v);
		} else {
			var e = result.a;
			return $elm$core$Result$Err(
				f(e));
		}
	});
var $jzxhuang$http_extras$Http$Detailed$BadBody = F3(
	function (a, b, c) {
		return {$: 4, a: a, b: b, c: c};
	});
var $jzxhuang$http_extras$Http$Detailed$BadStatus = F2(
	function (a, b) {
		return {$: 3, a: a, b: b};
	});
var $jzxhuang$http_extras$Http$Detailed$BadUrl = function (a) {
	return {$: 0, a: a};
};
var $jzxhuang$http_extras$Http$Detailed$NetworkError = {$: 2};
var $jzxhuang$http_extras$Http$Detailed$Timeout = {$: 1};
var $jzxhuang$http_extras$Http$Detailed$resolve = F2(
	function (toResult, response) {
		switch (response.$) {
			case 0:
				var url = response.a;
				return $elm$core$Result$Err(
					$jzxhuang$http_extras$Http$Detailed$BadUrl(url));
			case 1:
				return $elm$core$Result$Err($jzxhuang$http_extras$Http$Detailed$Timeout);
			case 2:
				return $elm$core$Result$Err($jzxhuang$http_extras$Http$Detailed$NetworkError);
			case 3:
				var metadata = response.a;
				var body = response.b;
				return $elm$core$Result$Err(
					A2($jzxhuang$http_extras$Http$Detailed$BadStatus, metadata, body));
			default:
				var metadata = response.a;
				var body = response.b;
				return A2(
					$elm$core$Result$mapError,
					A2($jzxhuang$http_extras$Http$Detailed$BadBody, metadata, body),
					toResult(
						_Utils_Tuple2(metadata, body)));
		}
	});
var $jzxhuang$http_extras$Http$Detailed$responseToJson = F2(
	function (decoder, responseString) {
		return A2(
			$jzxhuang$http_extras$Http$Detailed$resolve,
			function (_v0) {
				var metadata = _v0.a;
				var body = _v0.b;
				return A2(
					$elm$core$Result$mapError,
					$elm$json$Json$Decode$errorToString,
					A2(
						$elm$json$Json$Decode$decodeString,
						A2(
							$elm$json$Json$Decode$map,
							function (res) {
								return _Utils_Tuple2(metadata, res);
							},
							decoder),
						body));
			},
			responseString);
	});
var $jzxhuang$http_extras$Http$Detailed$expectJson = F2(
	function (toMsg, decoder) {
		return A2(
			$elm$http$Http$expectStringResponse,
			toMsg,
			$jzxhuang$http_extras$Http$Detailed$responseToJson(decoder));
	});
var $elm$http$Http$jsonBody = function (value) {
	return A2(
		_Http_pair,
		'application/json',
		A2($elm$json$Json$Encode$encode, 0, value));
};
var $elm$json$Json$Encode$object = function (pairs) {
	return _Json_wrap(
		A3(
			$elm$core$List$foldl,
			F2(
				function (_v0, obj) {
					var k = _v0.a;
					var v = _v0.b;
					return A3(_Json_addField, k, v, obj);
				}),
			_Json_emptyObject(0),
			pairs));
};
var $elm$http$Http$Request = function (a) {
	return {$: 1, a: a};
};
var $elm$http$Http$State = F2(
	function (reqs, subs) {
		return {az: reqs, aE: subs};
	});
var $elm$http$Http$init = $elm$core$Task$succeed(
	A2($elm$http$Http$State, $elm$core$Dict$empty, _List_Nil));
var $elm$core$Process$kill = _Scheduler_kill;
var $elm$core$Process$spawn = _Scheduler_spawn;
var $elm$http$Http$updateReqs = F3(
	function (router, cmds, reqs) {
		updateReqs:
		while (true) {
			if (!cmds.b) {
				return $elm$core$Task$succeed(reqs);
			} else {
				var cmd = cmds.a;
				var otherCmds = cmds.b;
				if (!cmd.$) {
					var tracker = cmd.a;
					var _v2 = A2($elm$core$Dict$get, tracker, reqs);
					if (_v2.$ === 1) {
						var $temp$router = router,
							$temp$cmds = otherCmds,
							$temp$reqs = reqs;
						router = $temp$router;
						cmds = $temp$cmds;
						reqs = $temp$reqs;
						continue updateReqs;
					} else {
						var pid = _v2.a;
						return A2(
							$elm$core$Task$andThen,
							function (_v3) {
								return A3(
									$elm$http$Http$updateReqs,
									router,
									otherCmds,
									A2($elm$core$Dict$remove, tracker, reqs));
							},
							$elm$core$Process$kill(pid));
					}
				} else {
					var req = cmd.a;
					return A2(
						$elm$core$Task$andThen,
						function (pid) {
							var _v4 = req.B;
							if (_v4.$ === 1) {
								return A3($elm$http$Http$updateReqs, router, otherCmds, reqs);
							} else {
								var tracker = _v4.a;
								return A3(
									$elm$http$Http$updateReqs,
									router,
									otherCmds,
									A3($elm$core$Dict$insert, tracker, pid, reqs));
							}
						},
						$elm$core$Process$spawn(
							A3(
								_Http_toTask,
								router,
								$elm$core$Platform$sendToApp(router),
								req)));
				}
			}
		}
	});
var $elm$http$Http$onEffects = F4(
	function (router, cmds, subs, state) {
		return A2(
			$elm$core$Task$andThen,
			function (reqs) {
				return $elm$core$Task$succeed(
					A2($elm$http$Http$State, reqs, subs));
			},
			A3($elm$http$Http$updateReqs, router, cmds, state.az));
	});
var $elm$core$List$maybeCons = F3(
	function (f, mx, xs) {
		var _v0 = f(mx);
		if (!_v0.$) {
			var x = _v0.a;
			return A2($elm$core$List$cons, x, xs);
		} else {
			return xs;
		}
	});
var $elm$core$List$filterMap = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$foldr,
			$elm$core$List$maybeCons(f),
			_List_Nil,
			xs);
	});
var $elm$http$Http$maybeSend = F4(
	function (router, desiredTracker, progress, _v0) {
		var actualTracker = _v0.a;
		var toMsg = _v0.b;
		return _Utils_eq(desiredTracker, actualTracker) ? $elm$core$Maybe$Just(
			A2(
				$elm$core$Platform$sendToApp,
				router,
				toMsg(progress))) : $elm$core$Maybe$Nothing;
	});
var $elm$http$Http$onSelfMsg = F3(
	function (router, _v0, state) {
		var tracker = _v0.a;
		var progress = _v0.b;
		return A2(
			$elm$core$Task$andThen,
			function (_v1) {
				return $elm$core$Task$succeed(state);
			},
			$elm$core$Task$sequence(
				A2(
					$elm$core$List$filterMap,
					A3($elm$http$Http$maybeSend, router, tracker, progress),
					state.aE)));
	});
var $elm$http$Http$Cancel = function (a) {
	return {$: 0, a: a};
};
var $elm$http$Http$cmdMap = F2(
	function (func, cmd) {
		if (!cmd.$) {
			var tracker = cmd.a;
			return $elm$http$Http$Cancel(tracker);
		} else {
			var r = cmd.a;
			return $elm$http$Http$Request(
				{
					aK: r.aK,
					p: r.p,
					e: A2(_Http_mapExpect, func, r.e),
					w: r.w,
					x: r.x,
					A: r.A,
					B: r.B,
					f: r.f
				});
		}
	});
var $elm$http$Http$MySub = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $elm$http$Http$subMap = F2(
	function (func, _v0) {
		var tracker = _v0.a;
		var toMsg = _v0.b;
		return A2(
			$elm$http$Http$MySub,
			tracker,
			A2($elm$core$Basics$composeR, toMsg, func));
	});
_Platform_effectManagers['Http'] = _Platform_createManager($elm$http$Http$init, $elm$http$Http$onEffects, $elm$http$Http$onSelfMsg, $elm$http$Http$cmdMap, $elm$http$Http$subMap);
var $elm$http$Http$command = _Platform_leaf('Http');
var $elm$http$Http$subscription = _Platform_leaf('Http');
var $elm$http$Http$request = function (r) {
	return $elm$http$Http$command(
		$elm$http$Http$Request(
			{aK: false, p: r.p, e: r.e, w: r.w, x: r.x, A: r.A, B: r.B, f: r.f}));
};
var $elm$http$Http$post = function (r) {
	return $elm$http$Http$request(
		{p: r.p, e: r.e, w: _List_Nil, x: 'POST', A: $elm$core$Maybe$Nothing, B: $elm$core$Maybe$Nothing, f: r.f});
};
var $elm$json$Json$Encode$string = _Json_wrap;
var $author$project$Main$postAuthorError = F3(
	function (index, first, last) {
		var body = $elm$json$Json$Encode$object(
			_List_fromArray(
				[
					_Utils_Tuple2(
					'first_name',
					$elm$json$Json$Encode$string(first)),
					_Utils_Tuple2(
					'last_name',
					$elm$json$Json$Encode$string(last))
				]));
		return $elm$http$Http$post(
			{
				p: $elm$http$Http$jsonBody(body),
				e: A2(
					$jzxhuang$http_extras$Http$Detailed$expectJson,
					A3($author$project$Main$PostAuthorError, index, first, last),
					$author$project$Main$authorDecoder),
				f: '/authors'
			});
	});
var $author$project$Main$init = function (_v0) {
	return _Utils_Tuple2(
		$author$project$Main$initialModel,
		function () {
			var _v1 = $elm$core$List$head($author$project$Data$authorsError);
			if (!_v1.$) {
				var _v2 = _v1.a;
				var firstName = _v2.a;
				var lastName = _v2.b;
				return A3($author$project$Main$postAuthorError, 0, firstName, lastName);
			} else {
				return $elm$core$Platform$Cmd$none;
			}
		}());
};
var $elm$core$Platform$Sub$batch = _Platform_batch;
var $elm$core$Platform$Sub$none = $elm$core$Platform$Sub$batch(_List_Nil);
var $author$project$Main$Failure = function (a) {
	return {$: 1, a: a};
};
var $author$project$Main$Success = {$: 0};
var $author$project$Data$authorsToPost = _List_fromArray(
	[
		_Utils_Tuple2('Adam', 'Mickiewicz'),
		_Utils_Tuple2('Juliusz', 'Słowacki'),
		_Utils_Tuple2('Cyprian', 'Kamil Norwid'),
		_Utils_Tuple2('Bolesław', 'Prus'),
		_Utils_Tuple2('Eliza', 'Orzeszkowa'),
		_Utils_Tuple2('Henryk', 'Sienkiewicz'),
		_Utils_Tuple2('Stanisław', 'Wyspiański'),
		_Utils_Tuple2('Władysław', 'Reymont'),
		_Utils_Tuple2('Stefan', 'Żeromski'),
		_Utils_Tuple2('Maria', 'Konopnicka'),
		_Utils_Tuple2('Gabriela', 'Zapolska'),
		_Utils_Tuple2('Tadeusz', 'Borowski'),
		_Utils_Tuple2('Czesław', 'Miłosz'),
		_Utils_Tuple2('Wisława', 'Szymborska'),
		_Utils_Tuple2('Zbigniew', 'Herbert'),
		_Utils_Tuple2('Bruno', 'Schulz'),
		_Utils_Tuple2('Stanisław', 'Lem'),
		_Utils_Tuple2('Tadeusz', 'Różewicz'),
		_Utils_Tuple2('Olga', 'Tokarczuk'),
		_Utils_Tuple2('Dorota', 'Masłowska')
	]);
var $elm$core$Basics$negate = function (n) {
	return -n;
};
var $author$project$Data$booksError = _List_fromArray(
	[
		_Utils_Tuple3('', 1990, 5),
		_Utils_Tuple3('Nieistniejący Rok', -1500, 1),
		_Utils_Tuple3('Brak autora', 2000, 999),
		_Utils_Tuple3('', -10, 3)
	]);
var $author$project$Data$booksToPost = _List_fromArray(
	[
		_Utils_Tuple3('Balladyna', 1839, 1),
		_Utils_Tuple3('Kordian', 1834, 1),
		_Utils_Tuple3('Beniowski', 1841, 1),
		_Utils_Tuple3('Promethidion', 1851, 2),
		_Utils_Tuple3('Vade-mecum', 1866, 2),
		_Utils_Tuple3('Lalka', 1890, 3),
		_Utils_Tuple3('Emancypantki', 1893, 3),
		_Utils_Tuple3('Nad Niemnem', 1888, 4),
		_Utils_Tuple3('Marta', 1873, 4),
		_Utils_Tuple3('Quo Vadis', 1896, 5),
		_Utils_Tuple3('Potop', 1886, 5),
		_Utils_Tuple3('Krzyżacy', 1900, 5),
		_Utils_Tuple3('Wesele', 1901, 6),
		_Utils_Tuple3('Wyzwolenie', 1903, 6),
		_Utils_Tuple3('Chłopi', 1904, 7),
		_Utils_Tuple3('Ziemia obiecana', 1899, 7),
		_Utils_Tuple3('Przedwiośnie', 1924, 8),
		_Utils_Tuple3('Syzyfowe prace', 1897, 8),
		_Utils_Tuple3('Nasza szkapa', 1890, 9),
		_Utils_Tuple3('Mendel Gdański', 1890, 9),
		_Utils_Tuple3('Moralność pani Dulskiej', 1906, 10),
		_Utils_Tuple3('Kaśka Kariatyda', 1911, 10),
		_Utils_Tuple3('Opowiadania', 1947, 11),
		_Utils_Tuple3('Pożegnanie z Marią', 1948, 11),
		_Utils_Tuple3('Doliny Issy', 1955, 12),
		_Utils_Tuple3('Zniewolony umysł', 1953, 12),
		_Utils_Tuple3('Sól', 1962, 13),
		_Utils_Tuple3('Chwila', 2002, 13),
		_Utils_Tuple3('Pan Cogito', 1974, 14),
		_Utils_Tuple3('Raport z oblężonego Miasta', 1983, 14),
		_Utils_Tuple3('Sklepy cynamonowe', 1934, 15),
		_Utils_Tuple3('Sanatorium pod klepsydrą', 1937, 15),
		_Utils_Tuple3('Solaris', 1961, 16),
		_Utils_Tuple3('Bajki robotów', 1964, 16),
		_Utils_Tuple3('Głos Pana', 1968, 16),
		_Utils_Tuple3('Niepokój', 1947, 17),
		_Utils_Tuple3('Kartoteka', 1960, 17),
		_Utils_Tuple3('Prawiek i inne czasy', 1996, 18),
		_Utils_Tuple3('Bieguni', 2007, 18),
		_Utils_Tuple3('Księgi Jakubowe', 2014, 18),
		_Utils_Tuple3('Wojna polsko-ruska pod flagą biało-czerwoną', 2002, 19),
		_Utils_Tuple3('Paw królowej', 2005, 19)
	]);
var $elm$core$Basics$composeL = F3(
	function (g, f, x) {
		return g(
			f(x));
	});
var $author$project$Main$DeleteAuthorResult = F2(
	function (a, b) {
		return {$: 8, a: a, b: b};
	});
var $elm$http$Http$emptyBody = _Http_emptyBody;
var $jzxhuang$http_extras$Http$Detailed$responseToString = function (responseString) {
	return A2(
		$jzxhuang$http_extras$Http$Detailed$resolve,
		function (_v0) {
			var metadata = _v0.a;
			var body = _v0.b;
			return $elm$core$Result$Ok(
				_Utils_Tuple2(metadata, body));
		},
		responseString);
};
var $jzxhuang$http_extras$Http$Detailed$expectString = function (toMsg) {
	return A2($elm$http$Http$expectStringResponse, toMsg, $jzxhuang$http_extras$Http$Detailed$responseToString);
};
var $author$project$Main$deleteAuthor = function (id) {
	return $elm$http$Http$request(
		{
			p: $elm$http$Http$emptyBody,
			e: $jzxhuang$http_extras$Http$Detailed$expectString(
				$author$project$Main$DeleteAuthorResult(id)),
			w: _List_Nil,
			x: 'DELETE',
			A: $elm$core$Maybe$Nothing,
			B: $elm$core$Maybe$Nothing,
			f: '/authors/' + $elm$core$String$fromInt(id)
		});
};
var $author$project$Main$DeleteAuthorError = F2(
	function (a, b) {
		return {$: 9, a: a, b: b};
	});
var $author$project$Main$deleteAuthorError = function (id) {
	return $elm$http$Http$request(
		{
			p: $elm$http$Http$emptyBody,
			e: $jzxhuang$http_extras$Http$Detailed$expectString(
				$author$project$Main$DeleteAuthorError(id)),
			w: _List_Nil,
			x: 'DELETE',
			A: $elm$core$Maybe$Nothing,
			B: $elm$core$Maybe$Nothing,
			f: '/authors/' + $elm$core$String$fromInt(id)
		});
};
var $author$project$Main$DeleteBookResult = F2(
	function (a, b) {
		return {$: 19, a: a, b: b};
	});
var $author$project$Main$deleteBook = function (id) {
	return $elm$http$Http$request(
		{
			p: $elm$http$Http$emptyBody,
			e: $jzxhuang$http_extras$Http$Detailed$expectString(
				$author$project$Main$DeleteBookResult(id)),
			w: _List_Nil,
			x: 'DELETE',
			A: $elm$core$Maybe$Nothing,
			B: $elm$core$Maybe$Nothing,
			f: '/books/' + $elm$core$String$fromInt(id)
		});
};
var $author$project$Main$DeleteBookError = F2(
	function (a, b) {
		return {$: 20, a: a, b: b};
	});
var $author$project$Main$deleteBookError = function (id) {
	return $elm$http$Http$request(
		{
			p: $elm$http$Http$emptyBody,
			e: $jzxhuang$http_extras$Http$Detailed$expectString(
				$author$project$Main$DeleteBookError(id)),
			w: _List_Nil,
			x: 'DELETE',
			A: $elm$core$Maybe$Nothing,
			B: $elm$core$Maybe$Nothing,
			f: '/books/' + $elm$core$String$fromInt(id)
		});
};
var $author$project$Main$errorToString = function (err) {
	switch (err.$) {
		case 0:
			var u = err.a;
			return 'Zły URL: ' + u;
		case 1:
			return 'Przekroczono limit czasu';
		case 2:
			return 'Błąd sieci';
		case 3:
			var meta = err.a;
			return 'Zły status: ' + $elm$core$String$fromInt(meta.c);
		default:
			var b = err.b;
			return 'Błąd dekodowania: ' + b;
	}
};
var $elm$core$List$filter = F2(
	function (isGood, list) {
		return A3(
			$elm$core$List$foldr,
			F2(
				function (x, xs) {
					return isGood(x) ? A2($elm$core$List$cons, x, xs) : xs;
				}),
			_List_Nil,
			list);
	});
var $elm$core$Set$Set_elm_builtin = $elm$core$Basics$identity;
var $elm$core$Set$empty = $elm$core$Dict$empty;
var $elm$core$Set$insert = F2(
	function (key, _v0) {
		var dict = _v0;
		return A3($elm$core$Dict$insert, key, 0, dict);
	});
var $elm$core$Set$fromList = function (list) {
	return A3($elm$core$List$foldl, $elm$core$Set$insert, $elm$core$Set$empty, list);
};
var $elm$core$List$drop = F2(
	function (n, list) {
		drop:
		while (true) {
			if (n <= 0) {
				return list;
			} else {
				if (!list.b) {
					return list;
				} else {
					var x = list.a;
					var xs = list.b;
					var $temp$n = n - 1,
						$temp$list = xs;
					n = $temp$n;
					list = $temp$list;
					continue drop;
				}
			}
		}
	});
var $elm_community$list_extra$List$Extra$getAt = F2(
	function (idx, xs) {
		return (idx < 0) ? $elm$core$Maybe$Nothing : $elm$core$List$head(
			A2($elm$core$List$drop, idx, xs));
	});
var $author$project$Main$GetAuthorResult = F3(
	function (a, b, c) {
		return {$: 1, a: a, b: b, c: c};
	});
var $elm$http$Http$get = function (r) {
	return $elm$http$Http$request(
		{p: $elm$http$Http$emptyBody, e: r.e, w: _List_Nil, x: 'GET', A: $elm$core$Maybe$Nothing, B: $elm$core$Maybe$Nothing, f: r.f});
};
var $author$project$Main$getAuthor = F2(
	function (index, author) {
		return $elm$http$Http$get(
			{
				e: A2(
					$jzxhuang$http_extras$Http$Detailed$expectJson,
					A2($author$project$Main$GetAuthorResult, index, author),
					$author$project$Main$authorDecoder),
				f: '/authors/' + $elm$core$String$fromInt(author.a)
			});
	});
var $elm_community$list_extra$List$Extra$find = F2(
	function (predicate, list) {
		find:
		while (true) {
			if (!list.b) {
				return $elm$core$Maybe$Nothing;
			} else {
				var first = list.a;
				var rest = list.b;
				if (predicate(first)) {
					return $elm$core$Maybe$Just(first);
				} else {
					var $temp$predicate = predicate,
						$temp$list = rest;
					predicate = $temp$predicate;
					list = $temp$list;
					continue find;
				}
			}
		}
	});
var $author$project$Main$getAuthorByIndex = F2(
	function (index, model) {
		return A2(
			$elm_community$list_extra$List$Extra$find,
			A2(
				$elm$core$Basics$composeL,
				$elm$core$Basics$eq(index),
				function ($) {
					return $.X;
				}),
			model.d);
	});
var $author$project$Main$GetAuthorError = F2(
	function (a, b) {
		return {$: 2, a: a, b: b};
	});
var $author$project$Main$getAuthorError = function (id) {
	return $elm$http$Http$get(
		{
			e: $jzxhuang$http_extras$Http$Detailed$expectString(
				$author$project$Main$GetAuthorError(id)),
			f: '/authors/' + $elm$core$String$fromInt(id)
		});
};
var $author$project$Main$GetAuthorsResult = function (a) {
	return {$: 0, a: a};
};
var $elm$json$Json$Decode$list = _Json_decodeList;
var $author$project$Main$authorsDecoder = $elm$json$Json$Decode$list($author$project$Main$authorDecoder);
var $author$project$Main$getAuthors = $elm$http$Http$get(
	{
		e: A2($jzxhuang$http_extras$Http$Detailed$expectJson, $author$project$Main$GetAuthorsResult, $author$project$Main$authorsDecoder),
		f: '/authors'
	});
var $author$project$Main$GetBookResult = F3(
	function (a, b, c) {
		return {$: 12, a: a, b: b, c: c};
	});
var $author$project$Main$Book = F4(
	function (id, title, year, author) {
		return {j: author, a: id, t: title, u: year};
	});
var $author$project$Main$bookDecoder = A5(
	$elm$json$Json$Decode$map4,
	$author$project$Main$Book,
	A2($elm$json$Json$Decode$field, 'id', $elm$json$Json$Decode$int),
	A2($elm$json$Json$Decode$field, 'title', $elm$json$Json$Decode$string),
	A2($elm$json$Json$Decode$field, 'year', $elm$json$Json$Decode$int),
	A2($elm$json$Json$Decode$field, 'author', $author$project$Main$authorDecoder));
var $author$project$Main$getBook = F2(
	function (index, book) {
		return $elm$http$Http$get(
			{
				e: A2(
					$jzxhuang$http_extras$Http$Detailed$expectJson,
					A2($author$project$Main$GetBookResult, index, book),
					$author$project$Main$bookDecoder),
				f: '/books/' + $elm$core$String$fromInt(book.a)
			});
	});
var $author$project$Main$GetBookError = F2(
	function (a, b) {
		return {$: 13, a: a, b: b};
	});
var $author$project$Main$getBookError = function (id) {
	return $elm$http$Http$get(
		{
			e: $jzxhuang$http_extras$Http$Detailed$expectString(
				$author$project$Main$GetBookError(id)),
			f: '/books/' + $elm$core$String$fromInt(id)
		});
};
var $author$project$Main$GetBooksResult = function (a) {
	return {$: 10, a: a};
};
var $author$project$Main$booksDecoder = $elm$json$Json$Decode$list($author$project$Main$bookDecoder);
var $author$project$Main$getBooks = $elm$http$Http$get(
	{
		e: A2($jzxhuang$http_extras$Http$Detailed$expectJson, $author$project$Main$GetBooksResult, $author$project$Main$booksDecoder),
		f: '/books'
	});
var $author$project$Main$GetBooksByAuthorResult = F3(
	function (a, b, c) {
		return {$: 11, a: a, b: b, c: c};
	});
var $author$project$Main$getBooksByAuthor = F2(
	function (index, author) {
		return $elm$http$Http$get(
			{
				e: A2(
					$jzxhuang$http_extras$Http$Detailed$expectJson,
					A2($author$project$Main$GetBooksByAuthorResult, index, author),
					$author$project$Main$booksDecoder),
				f: '/books?authorId=' + $elm$core$String$fromInt(author.a)
			});
	});
var $elm_community$list_extra$List$Extra$last = function (items) {
	last:
	while (true) {
		if (!items.b) {
			return $elm$core$Maybe$Nothing;
		} else {
			if (!items.b.b) {
				var x = items.a;
				return $elm$core$Maybe$Just(x);
			} else {
				var rest = items.b;
				var $temp$items = rest;
				items = $temp$items;
				continue last;
			}
		}
	}
};
var $elm$core$Maybe$map = F2(
	function (f, maybe) {
		if (!maybe.$) {
			var value = maybe.a;
			return $elm$core$Maybe$Just(
				f(value));
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $elm$core$Basics$neq = _Utils_notEqual;
var $author$project$Main$PostAuthorResult = F4(
	function (a, b, c, d) {
		return {$: 3, a: a, b: b, c: c, d: d};
	});
var $author$project$Main$postAuthor = F3(
	function (index, first, last) {
		var body = $elm$json$Json$Encode$object(
			_List_fromArray(
				[
					_Utils_Tuple2(
					'first_name',
					$elm$json$Json$Encode$string(first)),
					_Utils_Tuple2(
					'last_name',
					$elm$json$Json$Encode$string(last))
				]));
		return $elm$http$Http$post(
			{
				p: $elm$http$Http$jsonBody(body),
				e: A2(
					$jzxhuang$http_extras$Http$Detailed$expectJson,
					A3($author$project$Main$PostAuthorResult, index, first, last),
					$author$project$Main$authorDecoder),
				f: '/authors'
			});
	});
var $author$project$Main$PostBookResult = F5(
	function (a, b, c, d, e) {
		return {$: 14, a: a, b: b, c: c, d: d, e: e};
	});
var $elm$json$Json$Encode$int = _Json_wrap;
var $author$project$Main$postBook = F4(
	function (index, title, year, author) {
		var body = $elm$json$Json$Encode$object(
			_List_fromArray(
				[
					_Utils_Tuple2(
					'title',
					$elm$json$Json$Encode$string(title)),
					_Utils_Tuple2(
					'year',
					$elm$json$Json$Encode$int(year)),
					_Utils_Tuple2(
					'authorId',
					$elm$json$Json$Encode$int(author.a))
				]));
		return $elm$http$Http$post(
			{
				p: $elm$http$Http$jsonBody(body),
				e: A2(
					$jzxhuang$http_extras$Http$Detailed$expectJson,
					A4($author$project$Main$PostBookResult, index, title, year, author),
					$author$project$Main$bookDecoder),
				f: '/books'
			});
	});
var $author$project$Main$PostBookError = F5(
	function (a, b, c, d, e) {
		return {$: 15, a: a, b: b, c: c, d: d, e: e};
	});
var $author$project$Main$postBookError = F4(
	function (index, title, year, authorId) {
		var body = $elm$json$Json$Encode$object(
			_List_fromArray(
				[
					_Utils_Tuple2(
					'title',
					$elm$json$Json$Encode$string(title)),
					_Utils_Tuple2(
					'year',
					$elm$json$Json$Encode$int(year)),
					_Utils_Tuple2(
					'authorId',
					$elm$json$Json$Encode$int(authorId))
				]));
		return $elm$http$Http$post(
			{
				p: $elm$http$Http$jsonBody(body),
				e: A2(
					$jzxhuang$http_extras$Http$Detailed$expectJson,
					A4($author$project$Main$PostBookError, index, title, year, authorId),
					$author$project$Main$bookDecoder),
				f: '/books'
			});
	});
var $elm$core$Basics$pow = _Basics_pow;
var $author$project$Main$PutAuthorResult = F4(
	function (a, b, c, d) {
		return {$: 5, a: a, b: b, c: c, d: d};
	});
var $author$project$Main$putAuthor = F3(
	function (id, first, last) {
		var body = $elm$json$Json$Encode$object(
			_List_fromArray(
				[
					_Utils_Tuple2(
					'id',
					$elm$json$Json$Encode$int(id)),
					_Utils_Tuple2(
					'first_name',
					$elm$json$Json$Encode$string(first)),
					_Utils_Tuple2(
					'last_name',
					$elm$json$Json$Encode$string(last))
				]));
		return $elm$http$Http$request(
			{
				p: $elm$http$Http$jsonBody(body),
				e: $jzxhuang$http_extras$Http$Detailed$expectString(
					A3($author$project$Main$PutAuthorResult, id, first, last)),
				w: _List_Nil,
				x: 'PUT',
				A: $elm$core$Maybe$Nothing,
				B: $elm$core$Maybe$Nothing,
				f: '/authors/' + $elm$core$String$fromInt(id)
			});
	});
var $author$project$Main$PutAuthorError400 = F5(
	function (a, b, c, d, e) {
		return {$: 7, a: a, b: b, c: c, d: d, e: e};
	});
var $author$project$Main$putAuthorError400 = F4(
	function (index, id, first, last) {
		var body = $elm$json$Json$Encode$object(
			_List_fromArray(
				[
					_Utils_Tuple2(
					'id',
					$elm$json$Json$Encode$int(id)),
					_Utils_Tuple2(
					'first_name',
					$elm$json$Json$Encode$string(first)),
					_Utils_Tuple2(
					'last_name',
					$elm$json$Json$Encode$string(last))
				]));
		return $elm$http$Http$request(
			{
				p: $elm$http$Http$jsonBody(body),
				e: $jzxhuang$http_extras$Http$Detailed$expectString(
					A4($author$project$Main$PutAuthorError400, index, id, first, last)),
				w: _List_Nil,
				x: 'PUT',
				A: $elm$core$Maybe$Nothing,
				B: $elm$core$Maybe$Nothing,
				f: '/authors/' + $elm$core$String$fromInt(id)
			});
	});
var $author$project$Main$PutAuthorError404 = F4(
	function (a, b, c, d) {
		return {$: 6, a: a, b: b, c: c, d: d};
	});
var $author$project$Main$putAuthorError404 = F3(
	function (id, first, last) {
		var body = $elm$json$Json$Encode$object(
			_List_fromArray(
				[
					_Utils_Tuple2(
					'id',
					$elm$json$Json$Encode$int(id)),
					_Utils_Tuple2(
					'first_name',
					$elm$json$Json$Encode$string(first)),
					_Utils_Tuple2(
					'last_name',
					$elm$json$Json$Encode$string(last))
				]));
		return $elm$http$Http$request(
			{
				p: $elm$http$Http$jsonBody(body),
				e: $jzxhuang$http_extras$Http$Detailed$expectString(
					A3($author$project$Main$PutAuthorError404, id, first, last)),
				w: _List_Nil,
				x: 'PUT',
				A: $elm$core$Maybe$Nothing,
				B: $elm$core$Maybe$Nothing,
				f: '/authors/' + $elm$core$String$fromInt(id)
			});
	});
var $author$project$Main$PutBookResult = F5(
	function (a, b, c, d, e) {
		return {$: 16, a: a, b: b, c: c, d: d, e: e};
	});
var $author$project$Main$putBook = F4(
	function (id, title, year, author) {
		var body = $elm$json$Json$Encode$object(
			_List_fromArray(
				[
					_Utils_Tuple2(
					'id',
					$elm$json$Json$Encode$int(id)),
					_Utils_Tuple2(
					'title',
					$elm$json$Json$Encode$string(title)),
					_Utils_Tuple2(
					'year',
					$elm$json$Json$Encode$int(year)),
					_Utils_Tuple2(
					'authorId',
					$elm$json$Json$Encode$int(author.a))
				]));
		return $elm$http$Http$request(
			{
				p: $elm$http$Http$jsonBody(body),
				e: $jzxhuang$http_extras$Http$Detailed$expectString(
					A4($author$project$Main$PutBookResult, id, title, year, author)),
				w: _List_Nil,
				x: 'PUT',
				A: $elm$core$Maybe$Nothing,
				B: $elm$core$Maybe$Nothing,
				f: '/books/' + $elm$core$String$fromInt(id)
			});
	});
var $author$project$Main$PutBookError400 = F6(
	function (a, b, c, d, e, f) {
		return {$: 18, a: a, b: b, c: c, d: d, e: e, f: f};
	});
var $author$project$Main$putBookError400 = F5(
	function (index, id, title, year, authorId) {
		var body = $elm$json$Json$Encode$object(
			_List_fromArray(
				[
					_Utils_Tuple2(
					'id',
					$elm$json$Json$Encode$int(id)),
					_Utils_Tuple2(
					'title',
					$elm$json$Json$Encode$string(title)),
					_Utils_Tuple2(
					'year',
					$elm$json$Json$Encode$int(year)),
					_Utils_Tuple2(
					'authorId',
					$elm$json$Json$Encode$int(authorId))
				]));
		return $elm$http$Http$request(
			{
				p: $elm$http$Http$jsonBody(body),
				e: $jzxhuang$http_extras$Http$Detailed$expectString(
					A5($author$project$Main$PutBookError400, index, id, title, year, authorId)),
				w: _List_Nil,
				x: 'PUT',
				A: $elm$core$Maybe$Nothing,
				B: $elm$core$Maybe$Nothing,
				f: '/books/' + $elm$core$String$fromInt(id)
			});
	});
var $author$project$Main$PutBookError404 = F5(
	function (a, b, c, d, e) {
		return {$: 17, a: a, b: b, c: c, d: d, e: e};
	});
var $author$project$Main$putBookError404 = F4(
	function (id, title, year, author) {
		var body = $elm$json$Json$Encode$object(
			_List_fromArray(
				[
					_Utils_Tuple2(
					'id',
					$elm$json$Json$Encode$int(id)),
					_Utils_Tuple2(
					'title',
					$elm$json$Json$Encode$string(title)),
					_Utils_Tuple2(
					'year',
					$elm$json$Json$Encode$int(year)),
					_Utils_Tuple2(
					'authorId',
					$elm$json$Json$Encode$int(author.a))
				]));
		return $elm$http$Http$request(
			{
				p: $elm$http$Http$jsonBody(body),
				e: $jzxhuang$http_extras$Http$Detailed$expectString(
					A4($author$project$Main$PutBookError404, id, title, year, author)),
				w: _List_Nil,
				x: 'PUT',
				A: $elm$core$Maybe$Nothing,
				B: $elm$core$Maybe$Nothing,
				f: '/books/' + $elm$core$String$fromInt(id)
			});
	});
var $elm$core$String$reverse = _String_reverse;
var $elm$core$List$sum = function (numbers) {
	return A3($elm$core$List$foldl, $elm$core$Basics$add, 0, numbers);
};
var $author$project$Main$TestStep = F2(
	function (description, status) {
		return {ai: description, ac: status};
	});
var $author$project$Main$updateStep = F3(
	function (model, description, status) {
		var updated = _Utils_ap(
			model.R,
			_List_fromArray(
				[
					A2(
					$author$project$Main$TestStep,
					description,
					$elm$core$Maybe$Just(status))
				]));
		return _Utils_update(
			model,
			{R: updated});
	});
var $elm$core$Maybe$withDefault = F2(
	function (_default, maybe) {
		if (!maybe.$) {
			var value = maybe.a;
			return value;
		} else {
			return _default;
		}
	});
var $author$project$Main$update = F2(
	function (msg, model) {
		switch (msg.$) {
			case 3:
				var index = msg.a;
				var first = msg.b;
				var last = msg.c;
				var result = msg.d;
				var desc = 'POST /authors { \"first_name\" : \"' + (first + ('\", \"last_name\" : \"' + (last + '\"}')));
				if (!result.$) {
					var _v2 = result.a;
					var meta = _v2.a;
					var author = _v2.b;
					if (meta.c === 201) {
						if (_Utils_eq(author.l, first) && _Utils_eq(author.n, last)) {
							var _v3 = function () {
								var _v4 = A2($elm_community$list_extra$List$Extra$getAt, index + 1, $author$project$Data$authorsToPost);
								if (!_v4.$) {
									var _v5 = _v4.a;
									var firstName = _v5.a;
									var lastName = _v5.b;
									return _Utils_Tuple2(
										model.b,
										A3($author$project$Main$postAuthor, index + 1, firstName, lastName));
								} else {
									return _Utils_Tuple2(
										model.b + 1,
										function () {
											var _v6 = $elm_community$list_extra$List$Extra$last(model.d);
											if (!_v6.$) {
												var a = _v6.a;
												return A3(
													$author$project$Main$putAuthor,
													a.a,
													a.l,
													_Utils_ap(a.n, a.l));
											} else {
												return $elm$core$Platform$Cmd$none;
											}
										}());
								}
							}();
							var points = _v3.a;
							var nextCmd = _v3.b;
							return _Utils_Tuple2(
								A3(
									$author$project$Main$updateStep,
									_Utils_update(
										model,
										{
											d: _Utils_ap(
												model.d,
												_List_fromArray(
													[
														_Utils_update(
														author,
														{X: index})
													])),
											b: points
										}),
									desc,
									$author$project$Main$Success),
								nextCmd);
						} else {
							return _Utils_Tuple2(
								A3(
									$author$project$Main$updateStep,
									model,
									desc,
									$author$project$Main$Failure('Złe dane: ' + (author.l + (' ' + author.n)))),
								$elm$core$Platform$Cmd$none);
						}
					} else {
						return _Utils_Tuple2(
							A3(
								$author$project$Main$updateStep,
								model,
								desc,
								$author$project$Main$Failure(
									'Zły status: ' + $elm$core$String$fromInt(meta.c))),
							$elm$core$Platform$Cmd$none);
					}
				} else {
					var err = result.a;
					return _Utils_Tuple2(
						A3(
							$author$project$Main$updateStep,
							model,
							desc,
							$author$project$Main$Failure(
								$author$project$Main$errorToString(err))),
						$elm$core$Platform$Cmd$none);
				}
			case 4:
				var index = msg.a;
				var first = msg.b;
				var last = msg.c;
				var result = msg.d;
				var desc = 'POST /authors { \"first_name\" : \"' + (first + ('\", \"last_name\" : \"' + (last + '\"}')));
				if (!result.$) {
					var _v8 = result.a;
					var meta = _v8.a;
					return _Utils_Tuple2(
						A3(
							$author$project$Main$updateStep,
							model,
							desc,
							$author$project$Main$Failure(
								'Zły status: ' + $elm$core$String$fromInt(meta.c))),
						$elm$core$Platform$Cmd$none);
				} else {
					var err = result.a;
					if (err.$ === 3) {
						var meta = err.a;
						if (meta.c === 400) {
							var _v10 = function () {
								var _v11 = A2($elm_community$list_extra$List$Extra$getAt, index + 1, $author$project$Data$authorsError);
								if (!_v11.$) {
									var _v12 = _v11.a;
									var firstName = _v12.a;
									var lastName = _v12.b;
									return _Utils_Tuple2(
										model.b,
										A3($author$project$Main$postAuthorError, index + 1, firstName, lastName));
								} else {
									return _Utils_Tuple2(
										model.b + 1,
										function () {
											var _v13 = $elm$core$List$head($author$project$Data$authorsToPost);
											if (!_v13.$) {
												var _v14 = _v13.a;
												var firstName = _v14.a;
												var lastName = _v14.b;
												return A3($author$project$Main$postAuthor, 0, firstName, lastName);
											} else {
												return $elm$core$Platform$Cmd$none;
											}
										}());
								}
							}();
							var points = _v10.a;
							var nextCmd = _v10.b;
							return _Utils_Tuple2(
								A3(
									$author$project$Main$updateStep,
									_Utils_update(
										model,
										{b: points}),
									desc,
									$author$project$Main$Success),
								nextCmd);
						} else {
							return _Utils_Tuple2(
								A3(
									$author$project$Main$updateStep,
									model,
									desc,
									$author$project$Main$Failure(
										$author$project$Main$errorToString(err))),
								$elm$core$Platform$Cmd$none);
						}
					} else {
						return _Utils_Tuple2(
							A3(
								$author$project$Main$updateStep,
								model,
								desc,
								$author$project$Main$Failure(
									$author$project$Main$errorToString(err))),
							$elm$core$Platform$Cmd$none);
					}
				}
			case 0:
				var result = msg.a;
				if (!result.$) {
					var _v16 = result.a;
					var meta = _v16.a;
					var authors = _v16.b;
					if (meta.c === 200) {
						var expected = $elm$core$Set$fromList(
							A2(
								$elm$core$List$map,
								function (author) {
									return _Utils_Tuple3(author.a, author.l, author.n);
								},
								model.d));
						var actual = $elm$core$Set$fromList(
							A2(
								$elm$core$List$map,
								function (a) {
									return _Utils_Tuple3(a.a, a.l, a.n);
								},
								authors));
						var _v17 = _Utils_eq(actual, expected) ? _Utils_Tuple2(model.b + 1, $author$project$Main$Success) : _Utils_Tuple2(
							model.b,
							$author$project$Main$Failure('Niepoprawne dane autorów w odpowiedzi'));
						var points = _v17.a;
						var status = _v17.b;
						return _Utils_Tuple2(
							A3(
								$author$project$Main$updateStep,
								_Utils_update(
									model,
									{b: points}),
								'GET /authors',
								status),
							function () {
								var _v18 = $elm$core$List$head(model.d);
								if (!_v18.$) {
									var author = _v18.a;
									return A2($author$project$Main$getAuthor, 0, author);
								} else {
									return $elm$core$Platform$Cmd$none;
								}
							}());
					} else {
						return _Utils_Tuple2(
							A3(
								$author$project$Main$updateStep,
								model,
								'GET /authors',
								$author$project$Main$Failure(
									'Zły status: ' + $elm$core$String$fromInt(meta.c))),
							$elm$core$Platform$Cmd$none);
					}
				} else {
					var err = result.a;
					return _Utils_Tuple2(
						A3(
							$author$project$Main$updateStep,
							model,
							'GET /authors',
							$author$project$Main$Failure(
								$author$project$Main$errorToString(err))),
						$elm$core$Platform$Cmd$none);
				}
			case 1:
				var index = msg.a;
				var expected = msg.b;
				var result = msg.c;
				if (!result.$) {
					var _v20 = result.a;
					var meta = _v20.a;
					var author = _v20.b;
					if (meta.c === 200) {
						if (_Utils_eq(author.l, expected.l) && _Utils_eq(author.n, expected.n)) {
							var _v21 = function () {
								var _v22 = A2($elm_community$list_extra$List$Extra$getAt, index + 1, model.d);
								if (!_v22.$) {
									var a = _v22.a;
									return _Utils_Tuple2(
										model.b,
										A2($author$project$Main$getAuthor, index + 1, a));
								} else {
									return _Utils_Tuple2(
										model.b + 1,
										$author$project$Main$getAuthorError(
											$elm$core$List$sum(
												A2(
													$elm$core$List$map,
													A2(
														$elm$core$Basics$composeL,
														$elm$core$Basics$pow(2),
														function ($) {
															return $.a;
														}),
													model.d))));
								}
							}();
							var points = _v21.a;
							var nextCmd = _v21.b;
							return _Utils_Tuple2(
								A3(
									$author$project$Main$updateStep,
									_Utils_update(
										model,
										{b: points}),
									'GET /author/' + $elm$core$String$fromInt(expected.a),
									$author$project$Main$Success),
								nextCmd);
						} else {
							return _Utils_Tuple2(
								A3(
									$author$project$Main$updateStep,
									model,
									'GET /author/' + $elm$core$String$fromInt(expected.a),
									$author$project$Main$Failure('Dane autora nie pasują')),
								$elm$core$Platform$Cmd$none);
						}
					} else {
						return _Utils_Tuple2(
							A3(
								$author$project$Main$updateStep,
								model,
								'GET /author/' + $elm$core$String$fromInt(expected.a),
								$author$project$Main$Failure(
									'Zły status: ' + $elm$core$String$fromInt(meta.c))),
							$elm$core$Platform$Cmd$none);
					}
				} else {
					var err = result.a;
					return _Utils_Tuple2(
						A3(
							$author$project$Main$updateStep,
							model,
							'GET /author/' + $elm$core$String$fromInt(expected.a),
							$author$project$Main$Failure(
								$author$project$Main$errorToString(err))),
						$elm$core$Platform$Cmd$none);
				}
			case 2:
				var id = msg.a;
				var result = msg.b;
				if (!result.$) {
					var _v24 = result.a;
					var meta = _v24.a;
					return _Utils_Tuple2(
						A3(
							$author$project$Main$updateStep,
							model,
							'GET /author/' + $elm$core$String$fromInt(id),
							$author$project$Main$Failure(
								'Zły status: ' + $elm$core$String$fromInt(meta.c))),
						$elm$core$Platform$Cmd$none);
				} else {
					var err = result.a;
					if (err.$ === 3) {
						var meta = err.a;
						if (meta.c === 404) {
							var nextCmd = function () {
								var _v26 = $elm$core$List$head($author$project$Data$booksToPost);
								if (!_v26.$) {
									var _v27 = _v26.a;
									var t = _v27.a;
									var y = _v27.b;
									var authorIndex = _v27.c;
									var _v28 = A2($author$project$Main$getAuthorByIndex, authorIndex, model);
									if (!_v28.$) {
										var a = _v28.a;
										return A4($author$project$Main$postBook, 0, t, y, a);
									} else {
										return $elm$core$Platform$Cmd$none;
									}
								} else {
									return $elm$core$Platform$Cmd$none;
								}
							}();
							return _Utils_Tuple2(
								A3(
									$author$project$Main$updateStep,
									_Utils_update(
										model,
										{b: model.b + 1}),
									'GET /author/' + $elm$core$String$fromInt(id),
									$author$project$Main$Success),
								nextCmd);
						} else {
							return _Utils_Tuple2(
								A3(
									$author$project$Main$updateStep,
									model,
									'GET /author/' + $elm$core$String$fromInt(id),
									$author$project$Main$Failure(
										$author$project$Main$errorToString(err))),
								$elm$core$Platform$Cmd$none);
						}
					} else {
						return _Utils_Tuple2(
							A3(
								$author$project$Main$updateStep,
								model,
								'GET /author/' + $elm$core$String$fromInt(id),
								$author$project$Main$Failure(
									$author$project$Main$errorToString(err))),
							$elm$core$Platform$Cmd$none);
					}
				}
			case 5:
				var id = msg.a;
				var first = msg.b;
				var last = msg.c;
				var result = msg.d;
				var desc = 'PUT /authors/' + ($elm$core$String$fromInt(id) + (' { \"first_name\" : \"' + (first + ('\", \"last_name\" : \"' + (last + '\"}')))));
				if (!result.$) {
					var _v30 = result.a;
					var meta = _v30.a;
					if (meta.c === 204) {
						var updated = A2(
							$elm$core$List$map,
							function (author) {
								return _Utils_eq(author.a, id) ? _Utils_update(
									author,
									{l: first, n: last}) : author;
							},
							model.d);
						return _Utils_Tuple2(
							A3(
								$author$project$Main$updateStep,
								_Utils_update(
									model,
									{d: updated, b: model.b + 1}),
								desc,
								$author$project$Main$Success),
							function () {
								var _v31 = $elm$core$List$head(model.d);
								if (!_v31.$) {
									var author = _v31.a;
									return A4($author$project$Main$putAuthorError400, 0, author.a, author.l, '');
								} else {
									return $elm$core$Platform$Cmd$none;
								}
							}());
					} else {
						return _Utils_Tuple2(
							A3(
								$author$project$Main$updateStep,
								model,
								desc,
								$author$project$Main$Failure(
									'Zły status: ' + $elm$core$String$fromInt(meta.c))),
							$elm$core$Platform$Cmd$none);
					}
				} else {
					var err = result.a;
					return _Utils_Tuple2(
						A3(
							$author$project$Main$updateStep,
							model,
							desc,
							$author$project$Main$Failure(
								$author$project$Main$errorToString(err))),
						$elm$core$Platform$Cmd$none);
				}
			case 7:
				var index = msg.a;
				var id = msg.b;
				var first = msg.c;
				var last = msg.d;
				var result = msg.e;
				var desc = 'PUT /authors/' + ($elm$core$String$fromInt(id) + (' { \"first_name\" : \"' + (first + ('\", \"last_name\" : \"' + (last + '\"}')))));
				if (!result.$) {
					var _v33 = result.a;
					var meta = _v33.a;
					return _Utils_Tuple2(
						A3(
							$author$project$Main$updateStep,
							model,
							desc,
							$author$project$Main$Failure(
								'Zły status: ' + $elm$core$String$fromInt(meta.c))),
						$elm$core$Platform$Cmd$none);
				} else {
					var err = result.a;
					if (err.$ === 3) {
						var meta = err.a;
						if (meta.c === 400) {
							var _v35 = function () {
								var _v36 = $elm$core$List$head(model.d);
								if (!_v36.$) {
									var author = _v36.a;
									return (!index) ? _Utils_Tuple2(
										model.b,
										A4($author$project$Main$putAuthorError400, index + 1, id, '', author.n)) : _Utils_Tuple2(
										model.b + 1,
										A3(
											$author$project$Main$putAuthorError404,
											$elm$core$List$sum(
												A2(
													$elm$core$List$map,
													A2(
														$elm$core$Basics$composeL,
														$elm$core$Basics$pow(2),
														function ($) {
															return $.a;
														}),
													model.d)),
											author.l,
											author.n));
								} else {
									return _Utils_Tuple2(model.b, $elm$core$Platform$Cmd$none);
								}
							}();
							var points = _v35.a;
							var nextCmd = _v35.b;
							return _Utils_Tuple2(
								A3(
									$author$project$Main$updateStep,
									_Utils_update(
										model,
										{b: points}),
									desc,
									$author$project$Main$Success),
								nextCmd);
						} else {
							return _Utils_Tuple2(
								A3(
									$author$project$Main$updateStep,
									model,
									desc,
									$author$project$Main$Failure(
										$author$project$Main$errorToString(err))),
								$elm$core$Platform$Cmd$none);
						}
					} else {
						return _Utils_Tuple2(
							A3(
								$author$project$Main$updateStep,
								model,
								desc,
								$author$project$Main$Failure(
									$author$project$Main$errorToString(err))),
							$elm$core$Platform$Cmd$none);
					}
				}
			case 6:
				var id = msg.a;
				var first = msg.b;
				var last = msg.c;
				var result = msg.d;
				var desc = 'PUT /authors/' + ($elm$core$String$fromInt(id) + (' { \"first_name\" : \"' + (first + ('\", \"last_name\" : \"' + (last + '\"}')))));
				if (!result.$) {
					var _v38 = result.a;
					var meta = _v38.a;
					return _Utils_Tuple2(
						A3(
							$author$project$Main$updateStep,
							model,
							desc,
							$author$project$Main$Failure(
								'Zły status: ' + $elm$core$String$fromInt(meta.c))),
						$elm$core$Platform$Cmd$none);
				} else {
					var err = result.a;
					if (err.$ === 3) {
						var meta = err.a;
						return (meta.c === 404) ? _Utils_Tuple2(
							A3(
								$author$project$Main$updateStep,
								_Utils_update(
									model,
									{b: model.b + 1}),
								desc,
								$author$project$Main$Success),
							function () {
								var _v40 = $elm$core$List$head(model.d);
								if (!_v40.$) {
									var author = _v40.a;
									return $author$project$Main$deleteAuthor(author.a);
								} else {
									return $elm$core$Platform$Cmd$none;
								}
							}()) : _Utils_Tuple2(
							A3(
								$author$project$Main$updateStep,
								model,
								desc,
								$author$project$Main$Failure(
									$author$project$Main$errorToString(err))),
							$elm$core$Platform$Cmd$none);
					} else {
						return _Utils_Tuple2(
							A3(
								$author$project$Main$updateStep,
								model,
								desc,
								$author$project$Main$Failure(
									$author$project$Main$errorToString(err))),
							$elm$core$Platform$Cmd$none);
					}
				}
			case 8:
				var id = msg.a;
				var result = msg.b;
				if (!result.$) {
					var _v42 = result.a;
					var meta = _v42.a;
					if (meta.c === 204) {
						var updated = A2(
							$elm$core$List$filter,
							A2(
								$elm$core$Basics$composeL,
								$elm$core$Basics$neq(id),
								function ($) {
									return $.a;
								}),
							model.d);
						return _Utils_Tuple2(
							A3(
								$author$project$Main$updateStep,
								_Utils_update(
									model,
									{d: updated, b: model.b + 1}),
								'DELETE /authors/' + $elm$core$String$fromInt(id),
								$author$project$Main$Success),
							$author$project$Main$deleteAuthorError(
								$elm$core$List$sum(
									A2(
										$elm$core$List$map,
										A2(
											$elm$core$Basics$composeL,
											$elm$core$Basics$pow(2),
											function ($) {
												return $.a;
											}),
										model.d))));
					} else {
						return _Utils_Tuple2(
							A3(
								$author$project$Main$updateStep,
								model,
								'DELETE /authors/' + $elm$core$String$fromInt(id),
								$author$project$Main$Failure(
									'Zły status: ' + $elm$core$String$fromInt(meta.c))),
							$elm$core$Platform$Cmd$none);
					}
				} else {
					var err = result.a;
					return _Utils_Tuple2(
						A3(
							$author$project$Main$updateStep,
							model,
							'DELETE /authors/' + $elm$core$String$fromInt(id),
							$author$project$Main$Failure(
								$author$project$Main$errorToString(err))),
						$elm$core$Platform$Cmd$none);
				}
			case 9:
				var id = msg.a;
				var result = msg.b;
				if (!result.$) {
					var _v44 = result.a;
					var meta = _v44.a;
					return _Utils_Tuple2(
						A3(
							$author$project$Main$updateStep,
							model,
							'DELETE /author/' + $elm$core$String$fromInt(id),
							$author$project$Main$Failure(
								'Zły status: ' + $elm$core$String$fromInt(meta.c))),
						$elm$core$Platform$Cmd$none);
				} else {
					var err = result.a;
					if (err.$ === 3) {
						var meta = err.a;
						return (meta.c === 404) ? _Utils_Tuple2(
							A3(
								$author$project$Main$updateStep,
								_Utils_update(
									model,
									{b: model.b + 1}),
								'DELETE /author/' + $elm$core$String$fromInt(id),
								$author$project$Main$Success),
							$author$project$Main$getAuthors) : _Utils_Tuple2(
							A3(
								$author$project$Main$updateStep,
								model,
								'DELETE /author/' + $elm$core$String$fromInt(id),
								$author$project$Main$Failure(
									$author$project$Main$errorToString(err))),
							$elm$core$Platform$Cmd$none);
					} else {
						return _Utils_Tuple2(
							A3(
								$author$project$Main$updateStep,
								model,
								'DELETE /author/' + $elm$core$String$fromInt(id),
								$author$project$Main$Failure(
									$author$project$Main$errorToString(err))),
							$elm$core$Platform$Cmd$none);
					}
				}
			case 14:
				var index = msg.a;
				var title = msg.b;
				var year = msg.c;
				var author = msg.d;
				var result = msg.e;
				var desc = 'POST /books { \"title\" : \"' + (title + ('\", \"year\" : \"' + ($elm$core$String$fromInt(year) + ('\", \"authorId\" : \"' + ($elm$core$String$fromInt(author.a) + '\"}')))));
				if (!result.$) {
					var _v47 = result.a;
					var meta = _v47.a;
					var book = _v47.b;
					if (meta.c === 201) {
						if (_Utils_eq(book.t, title) && (_Utils_eq(book.u, year) && (_Utils_eq(book.j.a, author.a) && (_Utils_eq(book.j.l, author.l) && _Utils_eq(book.j.n, author.n))))) {
							var _v48 = function () {
								var _v49 = A2($elm_community$list_extra$List$Extra$getAt, index + 1, $author$project$Data$booksToPost);
								if (!_v49.$) {
									var _v50 = _v49.a;
									var t = _v50.a;
									var y = _v50.b;
									var authorIndex = _v50.c;
									return _Utils_Tuple2(
										model.b,
										function () {
											var _v51 = A2($author$project$Main$getAuthorByIndex, authorIndex, model);
											if (!_v51.$) {
												var a = _v51.a;
												return A4($author$project$Main$postBook, index + 1, t, y, a);
											} else {
												return $elm$core$Platform$Cmd$none;
											}
										}());
								} else {
									return _Utils_Tuple2(
										model.b + 1,
										function () {
											var _v52 = $elm$core$List$head($author$project$Data$booksError);
											if (!_v52.$) {
												var _v53 = _v52.a;
												var t = _v53.a;
												var y = _v53.b;
												var authorIndex = _v53.c;
												var _v54 = A2($author$project$Main$getAuthorByIndex, authorIndex, model);
												if (!_v54.$) {
													var a = _v54.a;
													return A4($author$project$Main$postBookError, 0, t, y, a.a);
												} else {
													return A4(
														$author$project$Main$postBookError,
														0,
														t,
														y,
														$elm$core$List$sum(
															A2(
																$elm$core$List$map,
																A2(
																	$elm$core$Basics$composeL,
																	$elm$core$Basics$pow(2),
																	function ($) {
																		return $.a;
																	}),
																model.d)));
												}
											} else {
												return $elm$core$Platform$Cmd$none;
											}
										}());
								}
							}();
							var points = _v48.a;
							var nextCmd = _v48.b;
							return _Utils_Tuple2(
								A3(
									$author$project$Main$updateStep,
									_Utils_update(
										model,
										{
											g: _Utils_ap(
												model.g,
												_List_fromArray(
													[book])),
											b: points
										}),
									desc,
									$author$project$Main$Success),
								nextCmd);
						} else {
							return _Utils_Tuple2(
								A3(
									$author$project$Main$updateStep,
									model,
									desc,
									$author$project$Main$Failure(
										'Złe dane: ' + (book.t + (' ' + ($elm$core$String$fromInt(book.u) + (' (' + ($elm$core$String$fromInt(author.a) + (', ' + (author.l + (', ' + (author.n + ')'))))))))))),
								$elm$core$Platform$Cmd$none);
						}
					} else {
						return _Utils_Tuple2(
							A3(
								$author$project$Main$updateStep,
								model,
								desc,
								$author$project$Main$Failure(
									'Zły status: ' + $elm$core$String$fromInt(meta.c))),
							$elm$core$Platform$Cmd$none);
					}
				} else {
					var err = result.a;
					return _Utils_Tuple2(
						A3(
							$author$project$Main$updateStep,
							model,
							desc,
							$author$project$Main$Failure(
								$author$project$Main$errorToString(err))),
						$elm$core$Platform$Cmd$none);
				}
			case 15:
				var index = msg.a;
				var title = msg.b;
				var year = msg.c;
				var authorId = msg.d;
				var result = msg.e;
				var desc = 'POST /books { \"title\" : \"' + (title + ('\", \"year\" : \"' + ($elm$core$String$fromInt(year) + ('\", \"authorId\" : \"' + ($elm$core$String$fromInt(authorId) + '\"}')))));
				if (!result.$) {
					var _v56 = result.a;
					var meta = _v56.a;
					return _Utils_Tuple2(
						A3(
							$author$project$Main$updateStep,
							model,
							desc,
							$author$project$Main$Failure(
								'Zły status: ' + $elm$core$String$fromInt(meta.c))),
						$elm$core$Platform$Cmd$none);
				} else {
					var err = result.a;
					if (err.$ === 3) {
						var meta = err.a;
						if (meta.c === 400) {
							var _v58 = function () {
								var _v59 = A2($elm_community$list_extra$List$Extra$getAt, index + 1, $author$project$Data$booksError);
								if (!_v59.$) {
									var _v60 = _v59.a;
									var t = _v60.a;
									var y = _v60.b;
									var a = _v60.c;
									return _Utils_Tuple2(
										model.b,
										A4($author$project$Main$postBookError, index + 1, t, y, a));
								} else {
									return _Utils_Tuple2(
										model.b + 1,
										function () {
											var _v61 = $elm_community$list_extra$List$Extra$last(model.g);
											if (!_v61.$) {
												var a = _v61.a;
												return A4(
													$author$project$Main$putBook,
													a.a,
													$elm$core$String$reverse(a.t),
													a.u,
													a.j);
											} else {
												return $elm$core$Platform$Cmd$none;
											}
										}());
								}
							}();
							var points = _v58.a;
							var nextCmd = _v58.b;
							return _Utils_Tuple2(
								A3(
									$author$project$Main$updateStep,
									_Utils_update(
										model,
										{b: points}),
									desc,
									$author$project$Main$Success),
								nextCmd);
						} else {
							return _Utils_Tuple2(
								A3(
									$author$project$Main$updateStep,
									model,
									desc,
									$author$project$Main$Failure(
										$author$project$Main$errorToString(err))),
								$elm$core$Platform$Cmd$none);
						}
					} else {
						return _Utils_Tuple2(
							A3(
								$author$project$Main$updateStep,
								model,
								desc,
								$author$project$Main$Failure(
									$author$project$Main$errorToString(err))),
							$elm$core$Platform$Cmd$none);
					}
				}
			case 10:
				var result = msg.a;
				if (!result.$) {
					var _v63 = result.a;
					var meta = _v63.a;
					var books = _v63.b;
					if (meta.c === 200) {
						var expected = $elm$core$Set$fromList(
							A2(
								$elm$core$List$map,
								function (book) {
									return _Utils_Tuple2(
										_Utils_Tuple2(book.a, book.t),
										_Utils_Tuple2(book.u, book.j.a));
								},
								model.g));
						var actual = $elm$core$Set$fromList(
							A2(
								$elm$core$List$map,
								function (a) {
									return _Utils_Tuple2(
										_Utils_Tuple2(a.a, a.t),
										_Utils_Tuple2(a.u, a.j.a));
								},
								books));
						var _v64 = _Utils_eq(actual, expected) ? _Utils_Tuple2(model.b + 1, $author$project$Main$Success) : _Utils_Tuple2(
							model.b,
							$author$project$Main$Failure('Niepoprawne dane książek w odpowiedzi'));
						var points = _v64.a;
						var status = _v64.b;
						return _Utils_Tuple2(
							A3(
								$author$project$Main$updateStep,
								_Utils_update(
									model,
									{b: points}),
								'GET /books',
								status),
							function () {
								var _v65 = $elm$core$List$head(model.g);
								if (!_v65.$) {
									var book = _v65.a;
									return A2($author$project$Main$getBook, 0, book);
								} else {
									return $elm$core$Platform$Cmd$none;
								}
							}());
					} else {
						return _Utils_Tuple2(
							A3(
								$author$project$Main$updateStep,
								model,
								'GET /books',
								$author$project$Main$Failure(
									'Zły status: ' + $elm$core$String$fromInt(meta.c))),
							$elm$core$Platform$Cmd$none);
					}
				} else {
					var err = result.a;
					return _Utils_Tuple2(
						A3(
							$author$project$Main$updateStep,
							model,
							'GET /books',
							$author$project$Main$Failure(
								$author$project$Main$errorToString(err))),
						$elm$core$Platform$Cmd$none);
				}
			case 11:
				var index = msg.a;
				var author = msg.b;
				var result = msg.c;
				var desc = 'GET /books?authorId=' + $elm$core$String$fromInt(author.a);
				if (!result.$) {
					var _v67 = result.a;
					var meta = _v67.a;
					var books = _v67.b;
					if (meta.c === 200) {
						var expected = $elm$core$Set$fromList(
							A2(
								$elm$core$List$map,
								function (book) {
									return _Utils_Tuple2(
										_Utils_Tuple2(book.a, book.t),
										_Utils_Tuple2(book.u, book.j.a));
								},
								A2(
									$elm$core$List$filter,
									function (book) {
										return _Utils_eq(book.j.a, author.a);
									},
									model.g)));
						var actual = $elm$core$Set$fromList(
							A2(
								$elm$core$List$map,
								function (a) {
									return _Utils_Tuple2(
										_Utils_Tuple2(a.a, a.t),
										_Utils_Tuple2(a.u, a.j.a));
								},
								books));
						var status = _Utils_eq(actual, expected) ? $author$project$Main$Success : $author$project$Main$Failure('Niepoprawne dane książek w odpowiedzi');
						var _v68 = function () {
							var _v69 = A2($elm_community$list_extra$List$Extra$getAt, index + 1, model.d);
							if (!_v69.$) {
								var a = _v69.a;
								return _Utils_Tuple2(
									model.b,
									A2($author$project$Main$getBooksByAuthor, index + 1, a));
							} else {
								return _Utils_Tuple2(model.b + 1, $elm$core$Platform$Cmd$none);
							}
						}();
						var points = _v68.a;
						var nextCmd = _v68.b;
						return _Utils_Tuple2(
							A3(
								$author$project$Main$updateStep,
								_Utils_update(
									model,
									{b: points}),
								desc,
								status),
							nextCmd);
					} else {
						return _Utils_Tuple2(
							A3(
								$author$project$Main$updateStep,
								model,
								desc,
								$author$project$Main$Failure(
									'Zły status: ' + $elm$core$String$fromInt(meta.c))),
							$elm$core$Platform$Cmd$none);
					}
				} else {
					var err = result.a;
					return _Utils_Tuple2(
						A3(
							$author$project$Main$updateStep,
							model,
							desc,
							$author$project$Main$Failure(
								$author$project$Main$errorToString(err))),
						$elm$core$Platform$Cmd$none);
				}
			case 12:
				var index = msg.a;
				var expected = msg.b;
				var result = msg.c;
				if (!result.$) {
					var _v71 = result.a;
					var meta = _v71.a;
					var book = _v71.b;
					if (meta.c === 200) {
						if (_Utils_eq(book.t, expected.t) && (_Utils_eq(book.u, expected.u) && (_Utils_eq(book.j.a, expected.j.a) && (_Utils_eq(book.j.l, expected.j.l) && _Utils_eq(book.j.n, expected.j.n))))) {
							var _v72 = function () {
								var _v73 = A2($elm_community$list_extra$List$Extra$getAt, index + 1, model.g);
								if (!_v73.$) {
									var a = _v73.a;
									return _Utils_Tuple2(
										model.b,
										A2($author$project$Main$getBook, index + 1, a));
								} else {
									return _Utils_Tuple2(
										model.b + 1,
										$author$project$Main$getBookError(
											$elm$core$List$sum(
												A2(
													$elm$core$List$map,
													A2(
														$elm$core$Basics$composeL,
														$elm$core$Basics$pow(2),
														function ($) {
															return $.a;
														}),
													model.g))));
								}
							}();
							var points = _v72.a;
							var nextCmd = _v72.b;
							return _Utils_Tuple2(
								A3(
									$author$project$Main$updateStep,
									_Utils_update(
										model,
										{b: points}),
									'GET /book/' + $elm$core$String$fromInt(expected.a),
									$author$project$Main$Success),
								nextCmd);
						} else {
							return _Utils_Tuple2(
								A3(
									$author$project$Main$updateStep,
									model,
									'GET /book/' + $elm$core$String$fromInt(expected.a),
									$author$project$Main$Failure('Dane książki nie pasują')),
								$elm$core$Platform$Cmd$none);
						}
					} else {
						return _Utils_Tuple2(
							A3(
								$author$project$Main$updateStep,
								model,
								'GET /book/' + $elm$core$String$fromInt(expected.a),
								$author$project$Main$Failure(
									'Zły status: ' + $elm$core$String$fromInt(meta.c))),
							$elm$core$Platform$Cmd$none);
					}
				} else {
					var err = result.a;
					return _Utils_Tuple2(
						A3(
							$author$project$Main$updateStep,
							model,
							'GET /book/' + $elm$core$String$fromInt(expected.a),
							$author$project$Main$Failure(
								$author$project$Main$errorToString(err))),
						$elm$core$Platform$Cmd$none);
				}
			case 13:
				var id = msg.a;
				var result = msg.b;
				if (!result.$) {
					var _v75 = result.a;
					var meta = _v75.a;
					return _Utils_Tuple2(
						A3(
							$author$project$Main$updateStep,
							model,
							'GET /book/' + $elm$core$String$fromInt(id),
							$author$project$Main$Failure(
								'Zły status: ' + $elm$core$String$fromInt(meta.c))),
						$elm$core$Platform$Cmd$none);
				} else {
					var err = result.a;
					if (err.$ === 3) {
						var meta = err.a;
						if (meta.c === 404) {
							var nextCmd = function () {
								var _v77 = $elm$core$List$head(model.d);
								if (!_v77.$) {
									var a = _v77.a;
									return A2($author$project$Main$getBooksByAuthor, 0, a);
								} else {
									return $elm$core$Platform$Cmd$none;
								}
							}();
							return _Utils_Tuple2(
								A3(
									$author$project$Main$updateStep,
									_Utils_update(
										model,
										{b: model.b + 1}),
									'GET /book/' + $elm$core$String$fromInt(id),
									$author$project$Main$Success),
								nextCmd);
						} else {
							return _Utils_Tuple2(
								A3(
									$author$project$Main$updateStep,
									model,
									'GET /book/' + $elm$core$String$fromInt(id),
									$author$project$Main$Failure(
										$author$project$Main$errorToString(err))),
								$elm$core$Platform$Cmd$none);
						}
					} else {
						return _Utils_Tuple2(
							A3(
								$author$project$Main$updateStep,
								model,
								'GET /book/' + $elm$core$String$fromInt(id),
								$author$project$Main$Failure(
									$author$project$Main$errorToString(err))),
							$elm$core$Platform$Cmd$none);
					}
				}
			case 16:
				var id = msg.a;
				var title = msg.b;
				var year = msg.c;
				var author = msg.d;
				var result = msg.e;
				var desc = 'PUT /books/' + ($elm$core$String$fromInt(id) + (' { \"title\" : \"' + (title + ('\", \"year\" : \"' + ($elm$core$String$fromInt(year) + ('\", \"authorId\" : \"' + ($elm$core$String$fromInt(author.a) + '\"}')))))));
				if (!result.$) {
					var _v79 = result.a;
					var meta = _v79.a;
					if (meta.c === 204) {
						var updated = A2(
							$elm$core$List$map,
							function (book) {
								return _Utils_eq(book.a, id) ? _Utils_update(
									book,
									{j: author, t: title, u: year}) : book;
							},
							model.g);
						return _Utils_Tuple2(
							A3(
								$author$project$Main$updateStep,
								_Utils_update(
									model,
									{g: updated, b: model.b + 1}),
								desc,
								$author$project$Main$Success),
							function () {
								var _v80 = $elm$core$List$head(model.g);
								if (!_v80.$) {
									var book = _v80.a;
									var _v81 = $elm$core$List$head($author$project$Data$booksError);
									if (!_v81.$) {
										var _v82 = _v81.a;
										var t = _v82.a;
										var y = _v82.b;
										var a = _v82.c;
										return A5(
											$author$project$Main$putBookError400,
											0,
											book.a,
											t,
											y,
											A2(
												$elm$core$Maybe$withDefault,
												-100,
												A2(
													$elm$core$Maybe$map,
													function ($) {
														return $.a;
													},
													A2($author$project$Main$getAuthorByIndex, a, model))));
									} else {
										return $elm$core$Platform$Cmd$none;
									}
								} else {
									return $elm$core$Platform$Cmd$none;
								}
							}());
					} else {
						return _Utils_Tuple2(
							A3(
								$author$project$Main$updateStep,
								model,
								desc,
								$author$project$Main$Failure(
									'Zły status: ' + $elm$core$String$fromInt(meta.c))),
							$elm$core$Platform$Cmd$none);
					}
				} else {
					var err = result.a;
					return _Utils_Tuple2(
						A3(
							$author$project$Main$updateStep,
							model,
							desc,
							$author$project$Main$Failure(
								$author$project$Main$errorToString(err))),
						$elm$core$Platform$Cmd$none);
				}
			case 18:
				var index = msg.a;
				var id = msg.b;
				var title = msg.c;
				var year = msg.d;
				var authorId = msg.e;
				var result = msg.f;
				var desc = 'PUT /books/' + ($elm$core$String$fromInt(id) + (' { \"title\" : \"' + (title + ('\", \"year\" : \"' + ($elm$core$String$fromInt(year) + ('\", \"authorId\" : \"' + ($elm$core$String$fromInt(authorId) + '\"}')))))));
				if (!result.$) {
					var _v84 = result.a;
					var meta = _v84.a;
					return _Utils_Tuple2(
						A3(
							$author$project$Main$updateStep,
							model,
							desc,
							$author$project$Main$Failure(
								'Zły status: ' + $elm$core$String$fromInt(meta.c))),
						$elm$core$Platform$Cmd$none);
				} else {
					var err = result.a;
					if (err.$ === 3) {
						var meta = err.a;
						if (meta.c === 400) {
							var _v86 = function () {
								var _v87 = A2($elm_community$list_extra$List$Extra$getAt, index + 1, $author$project$Data$booksError);
								if (!_v87.$) {
									var _v88 = _v87.a;
									var t = _v88.a;
									var y = _v88.b;
									var a = _v88.c;
									return _Utils_Tuple2(
										model.b,
										A5(
											$author$project$Main$putBookError400,
											index + 1,
											id,
											t,
											y,
											A2(
												$elm$core$Maybe$withDefault,
												-100,
												A2(
													$elm$core$Maybe$map,
													function ($) {
														return $.a;
													},
													A2($author$project$Main$getAuthorByIndex, a, model)))));
								} else {
									return _Utils_Tuple2(
										model.b + 1,
										function () {
											var _v89 = $elm$core$List$head(model.g);
											if (!_v89.$) {
												var book = _v89.a;
												return A4(
													$author$project$Main$putBookError404,
													$elm$core$List$sum(
														A2(
															$elm$core$List$map,
															A2(
																$elm$core$Basics$composeL,
																$elm$core$Basics$pow(2),
																function ($) {
																	return $.a;
																}),
															model.g)),
													book.t,
													book.u,
													book.j);
											} else {
												return $elm$core$Platform$Cmd$none;
											}
										}());
								}
							}();
							var points = _v86.a;
							var nextCmd = _v86.b;
							return _Utils_Tuple2(
								A3(
									$author$project$Main$updateStep,
									_Utils_update(
										model,
										{b: points}),
									desc,
									$author$project$Main$Success),
								nextCmd);
						} else {
							return _Utils_Tuple2(
								A3(
									$author$project$Main$updateStep,
									model,
									desc,
									$author$project$Main$Failure(
										$author$project$Main$errorToString(err))),
								$elm$core$Platform$Cmd$none);
						}
					} else {
						return _Utils_Tuple2(
							A3(
								$author$project$Main$updateStep,
								model,
								desc,
								$author$project$Main$Failure(
									$author$project$Main$errorToString(err))),
							$elm$core$Platform$Cmd$none);
					}
				}
			case 17:
				var id = msg.a;
				var title = msg.b;
				var year = msg.c;
				var author = msg.d;
				var result = msg.e;
				var desc = 'PUT /books/' + ($elm$core$String$fromInt(id) + (' { \"title\" : \"' + (title + ('\", \"year\" : \"' + ($elm$core$String$fromInt(year) + ('\", \"authorId\" : \"' + ($elm$core$String$fromInt(author.a) + '\"}')))))));
				if (!result.$) {
					var _v91 = result.a;
					var meta = _v91.a;
					return _Utils_Tuple2(
						A3(
							$author$project$Main$updateStep,
							model,
							desc,
							$author$project$Main$Failure(
								'Zły status: ' + $elm$core$String$fromInt(meta.c))),
						$elm$core$Platform$Cmd$none);
				} else {
					var err = result.a;
					if (err.$ === 3) {
						var meta = err.a;
						return (meta.c === 404) ? _Utils_Tuple2(
							A3(
								$author$project$Main$updateStep,
								_Utils_update(
									model,
									{b: model.b + 1}),
								desc,
								$author$project$Main$Success),
							function () {
								var _v93 = $elm$core$List$head(model.g);
								if (!_v93.$) {
									var book = _v93.a;
									return $author$project$Main$deleteBook(book.a);
								} else {
									return $elm$core$Platform$Cmd$none;
								}
							}()) : _Utils_Tuple2(
							A3(
								$author$project$Main$updateStep,
								model,
								desc,
								$author$project$Main$Failure(
									$author$project$Main$errorToString(err))),
							$elm$core$Platform$Cmd$none);
					} else {
						return _Utils_Tuple2(
							A3(
								$author$project$Main$updateStep,
								model,
								desc,
								$author$project$Main$Failure(
									$author$project$Main$errorToString(err))),
							$elm$core$Platform$Cmd$none);
					}
				}
			case 19:
				var id = msg.a;
				var result = msg.b;
				if (!result.$) {
					var _v95 = result.a;
					var meta = _v95.a;
					if (meta.c === 204) {
						var updated = A2(
							$elm$core$List$filter,
							A2(
								$elm$core$Basics$composeL,
								$elm$core$Basics$neq(id),
								function ($) {
									return $.a;
								}),
							model.g);
						return _Utils_Tuple2(
							A3(
								$author$project$Main$updateStep,
								_Utils_update(
									model,
									{g: updated, b: model.b + 1}),
								'DELETE /books/' + $elm$core$String$fromInt(id),
								$author$project$Main$Success),
							$author$project$Main$deleteBookError(
								$elm$core$List$sum(
									A2(
										$elm$core$List$map,
										A2(
											$elm$core$Basics$composeL,
											$elm$core$Basics$pow(2),
											function ($) {
												return $.a;
											}),
										model.g))));
					} else {
						return _Utils_Tuple2(
							A3(
								$author$project$Main$updateStep,
								model,
								'DELETE /books/' + $elm$core$String$fromInt(id),
								$author$project$Main$Failure(
									'Zły status: ' + $elm$core$String$fromInt(meta.c))),
							$elm$core$Platform$Cmd$none);
					}
				} else {
					var err = result.a;
					return _Utils_Tuple2(
						A3(
							$author$project$Main$updateStep,
							model,
							'DELETE /books/' + $elm$core$String$fromInt(id),
							$author$project$Main$Failure(
								$author$project$Main$errorToString(err))),
						$elm$core$Platform$Cmd$none);
				}
			default:
				var id = msg.a;
				var result = msg.b;
				if (!result.$) {
					var _v97 = result.a;
					var meta = _v97.a;
					return _Utils_Tuple2(
						A3(
							$author$project$Main$updateStep,
							model,
							'DELETE /book/' + $elm$core$String$fromInt(id),
							$author$project$Main$Failure(
								'Zły status: ' + $elm$core$String$fromInt(meta.c))),
						$elm$core$Platform$Cmd$none);
				} else {
					var err = result.a;
					if (err.$ === 3) {
						var meta = err.a;
						return (meta.c === 404) ? _Utils_Tuple2(
							A3(
								$author$project$Main$updateStep,
								_Utils_update(
									model,
									{b: model.b + 1}),
								'DELETE /book/' + $elm$core$String$fromInt(id),
								$author$project$Main$Success),
							$author$project$Main$getBooks) : _Utils_Tuple2(
							A3(
								$author$project$Main$updateStep,
								model,
								'DELETE /book/' + $elm$core$String$fromInt(id),
								$author$project$Main$Failure(
									$author$project$Main$errorToString(err))),
							$elm$core$Platform$Cmd$none);
					} else {
						return _Utils_Tuple2(
							A3(
								$author$project$Main$updateStep,
								model,
								'DELETE /book/' + $elm$core$String$fromInt(id),
								$author$project$Main$Failure(
									$author$project$Main$errorToString(err))),
							$elm$core$Platform$Cmd$none);
					}
				}
		}
	});
var $elm$html$Html$div = _VirtualDom_node('div');
var $elm$core$String$fromFloat = _String_fromNumber;
var $elm$html$Html$h2 = _VirtualDom_node('h2');
var $elm$virtual_dom$VirtualDom$text = _VirtualDom_text;
var $elm$html$Html$text = $elm$virtual_dom$VirtualDom$text;
var $elm$html$Html$ul = _VirtualDom_node('ul');
var $elm$html$Html$li = _VirtualDom_node('li');
var $elm$virtual_dom$VirtualDom$style = _VirtualDom_style;
var $elm$html$Html$Attributes$style = $elm$virtual_dom$VirtualDom$style;
var $author$project$Main$viewStep = function (step) {
	var statusText = function () {
		var _v2 = step.ac;
		if (_v2.$ === 1) {
			return 'W trakcie...';
		} else {
			if (!_v2.a.$) {
				var _v3 = _v2.a;
				return '✔ Sukces';
			} else {
				var err = _v2.a.a;
				return '✘ Błąd: ' + err;
			}
		}
	}();
	var statusColor = function () {
		var _v0 = step.ac;
		if (!_v0.$) {
			if (!_v0.a.$) {
				var _v1 = _v0.a;
				return 'green';
			} else {
				return 'red';
			}
		} else {
			return 'gray';
		}
	}();
	return A2(
		$elm$html$Html$li,
		_List_fromArray(
			[
				A2($elm$html$Html$Attributes$style, 'color', statusColor)
			]),
		_List_fromArray(
			[
				$elm$html$Html$text(step.ai + (' — ' + statusText))
			]));
};
var $author$project$Main$view = function (model) {
	return A2(
		$elm$html$Html$div,
		_List_Nil,
		_List_fromArray(
			[
				A2(
				$elm$html$Html$h2,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text(
						'Wyniki testów API: ' + ($elm$core$String$fromFloat(model.b / 7) + ' / 3p.'))
					])),
				A2(
				$elm$html$Html$ul,
				_List_Nil,
				A2($elm$core$List$map, $author$project$Main$viewStep, model.R))
			]));
};
var $author$project$Main$main = $elm$browser$Browser$element(
	{
		aS: $author$project$Main$init,
		a$: function (_v0) {
			return $elm$core$Platform$Sub$none;
		},
		a0: $author$project$Main$update,
		a1: $author$project$Main$view
	});
_Platform_export({'Main':{'init':$author$project$Main$main(
	$elm$json$Json$Decode$succeed(0))(0)}});}(this));