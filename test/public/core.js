(function($, $$){


  // --------------------------------
  //
  //  JSHint
  //
  // --------------------------------

  // module("JSHint");
  // 
  // test("JSHint", function(){
  //   var result = JSHINT(window.agilitySource, {proto:true});
  //   var errors = result ? '' : JSHINT.errors;
  //   equals(errors, '', "JSHint test");
  // });

  // --------------------------------
  //
  //  Builder
  //
  // --------------------------------

  module("Object builder");

  var validateObject = function(o){
    ok( !$.isEmptyObject(o.model), "obj.model defined");
    ok( !$.isEmptyObject(o.view), "obj.view defined");    
    ok( !$.isEmptyObject(o.controller), "obj.controller defined");    
  };

  test("No arguments", function(){
    var obj = $$(); // default object
    validateObject( obj );
    ok($.isEmptyObject(obj.model.get()), "model is empty");
  });

  test("Dummy arguments", function(){
    var obj = $$({}, {}, {}); // default object
    validateObject( obj );
    ok($.isEmptyObject(obj.model.get()), "model is empty");
  });

  test("One argument (model string)", function(){
    var obj = $$('Joe Doe');
    validateObject( obj );
    equals( obj.view.$().text(), 'Joe Doe', 'format as expected');
  });

  test("One argument (model object)", function(){
    var obj = $$({
      first: 'Joe',
      last: 'Doe'
    });
    validateObject( obj );
    equals( obj.view.$().text(), '', 'format as expected'); // lib doesn't have a default format for an arbitrary model
  });

  test("Two arguments (model, view string)", function(){
    var obj = $$('Joe Doe', '<div data-bind="text"></div>');
    validateObject( obj );
    equals( obj.view.$().text(), 'Joe Doe', 'format as expected');
  });

  test("Two arguments (model object, view string)", function(){
    var obj = $$({
      first: 'Joe',
      last: 'Doe'
    }, '<div><span data-bind="first"/><span data-bind="last"/></div>');
    validateObject( obj );
    equals( obj.view.$().text(), 'JoeDoe', 'format as expected');
  });
  
  test("Two arguments (model object, view string) with multiple attribute bindings", function(){
    var obj = $$({
      first: 'Joe',
      last: 'Doe',
      name: 'Joe Doe',
      firstColor: 'Red',
      lastColor: 'Blue'
    }, '<div><span data-bind="first, name name, firstColor firstColor"/>' +
     '<span data-bind="last, name name, lastColor lastColor"/></div>');
    validateObject( obj );
    equals( obj.view.$().text(), 'JoeDoe', 'format as expected');
    equals( obj.view.$( 'span' ).first().attr( 'name' ), 'Joe Doe', 'format as expected');
    equals( obj.view.$( 'span' ).first().attr( 'firstColor' ), 'Red', 'format as expected');
    equals( obj.view.$( 'span' ).last().attr( 'name' ), 'Joe Doe', 'format as expected');
    equals( obj.view.$( 'span' ).last().attr( 'lastColor' ), 'Blue', 'format as expected');
  });

  test("Three arguments (model string, view string, controller object)", function(){
    var obj = $$('Joe Doe', '<div data-bind="text"></div>', {
      init: function(){
        this.view.render();
      }
    });
    validateObject( obj );
    equals( obj.view.$().text(), 'Joe Doe', 'format as expected');
  });

  test("Three arguments (model object, view string, controller object)", function(){
    var obj = $$({first:'Joe', last:'Doe'}, '<div><span data-bind="first"/><span data-bind="last"/></div>', {});
    validateObject( obj );
    equals( obj.view.$().text(), 'JoeDoe', 'format as expected');
  });

  test("Three arguments (model object, view string, controller object) with multiple attribute bindings", function(){
    var obj = $$({
      first: 'Joe',
      last: 'Doe',
      name: 'Joe Doe',
      firstColor: 'Red',
      lastColor: 'Blue'
    }, '<div><span data-bind="first, name name, firstColor firstColor"/>' +
     '<span data-bind="last, name name, lastColor lastColor"/></div>',
    {});
    validateObject( obj );
    equals( obj.view.$().text(), 'JoeDoe', 'format as expected');
    equals( obj.view.$( 'span' ).first().attr( 'name' ), 'Joe Doe', 'format as expected');
    equals( obj.view.$( 'span' ).first().attr( 'firstColor' ), 'Red', 'format as expected');
    equals( obj.view.$( 'span' ).last().attr( 'name' ), 'Joe Doe', 'format as expected');
    equals( obj.view.$( 'span' ).last().attr( 'lastColor' ), 'Blue', 'format as expected');
  });
  
  test("Three arguments (model string, view object, controller object)", function(){
    var obj = $$('Joe Doe', 
      {
        format:'<div data-bind="text"></div>', 
        style:'& { float:right; display:none; }' 
      },
      {}
    );
    $$.document.append(obj); // necessary for IE
    validateObject( obj );
    equals( obj.view.$().text(), 'Joe Doe', 'format as expected');
    equals( obj.view.$().css('float'), 'right', 'style as expected');
  });
  
  test("Three arguments (model object, view object, controller object)", function(){
    var obj = $$({first:'Joe', last:'Doe'}, {format:'<div><span data-bind="first"/><span data-bind="last"/></div>', style:'& {float:right; display:none;}'}, {});
    $$.document.append(obj); // necessary for IE
    validateObject( obj );
    equals( obj.view.$().text(), 'JoeDoe', 'format as expected');
    equals( obj.view.$().css('float'), 'right', 'style as expected');
  });
  
  test("Three arguments (model object, view object, controller object) with multiple attribute bindings", function(){
    var obj = $$({
      first: 'Joe',
      last: 'Doe',
      name: 'Joe Doe',
      firstColor: 'Red',
      lastColor: 'Blue'
    }, {format:'<div><span data-bind="first, name name, firstColor firstColor"/>' +
     '<span data-bind="last, name name, lastColor lastColor"/></div>',
     style:'& {float:right; display:none;}'},
    {});
    $$.document.append(obj); // necessary for IE & Chrome
    validateObject( obj );
    equals( obj.view.$().text(), 'JoeDoe', 'format as expected');
    equals( obj.view.$( 'span' ).first().attr( 'name' ), 'Joe Doe', 'format as expected');
    equals( obj.view.$( 'span' ).first().attr( 'firstColor' ), 'Red', 'format as expected');
    equals( obj.view.$( 'span' ).last().attr( 'name' ), 'Joe Doe', 'format as expected');
    equals( obj.view.$( 'span' ).last().attr( 'lastColor' ), 'Blue', 'format as expected');
    equals( obj.view.$().css('float'), 'right', 'style as expected');
  });
  
  test("One full object argument ({model, view, controller, user_func})", function(){
    var obj = $$({
      model: {
        first: 'Joe',
        last: 'Doe'        
      },
      view: {
        format: '<div><span data-bind="first"/><span data-bind="last"/></div>',
        style: '& {float:right; display:none;}'
      },
      controller: {},
      myFunction: function(){}
    }); // obj
    $$.document.append(obj); // necessary for IE
    validateObject( obj );
    equals( typeof obj.myFunction, 'function', 'user-defined function as expected');
    equals( obj.view.$().text(), 'JoeDoe', 'format as expected');
    equals( obj.view.$().css('float'), 'right', 'style as expected');
  });
  
  test("One full object argument ({model, view, controller, user_func}) with multiple attribute bindings", function(){
    var obj = $$({
      model: {
        first: 'Joe',
        last: 'Doe',
        name: 'Joe Doe',
        firstColor: 'Red',
        lastColor: 'Blue'
      },
      view: {
        format: '<div><span data-bind="first, name name, firstColor firstColor"/>' +
                '<span data-bind="last, name name, lastColor lastColor"/></div>',
        style:'& {float:right; display:none;}'
      },
      controller: {},
      myFunction: function(){}
    });
    $$.document.append(obj); // necessary for IE & Chrome
    validateObject( obj );
    equals( typeof obj.myFunction, 'function', 'user-defined function as expected');
    equals( obj.view.$().text(), 'JoeDoe', 'format as expected');
    equals( obj.view.$( 'span' ).first().attr( 'name' ), 'Joe Doe', 'format as expected');
    equals( obj.view.$( 'span' ).first().attr( 'firstColor' ), 'Red', 'format as expected');
    equals( obj.view.$( 'span' ).last().attr( 'name' ), 'Joe Doe', 'format as expected');
    equals( obj.view.$( 'span' ).last().attr( 'lastColor' ), 'Blue', 'format as expected');
    equals( obj.view.$().css('float'), 'right', 'style as expected');
  });
  
  test("Auto-proxying", function(){
    var t = {}, t2 = {};
    var obj = $$({}, {}, {
      test: function(){
        t = this;
      }
    });    
    obj.controller.test.call({});
    equals( t, obj, 'auto-proxying obj.controller.*' );    
    // Not doing this test yet as it requires a function factory (e.g. obj.fn()) to do auto-proxying!
    // obj.fn('test2', function(){ t2 = this; });
    // obj.test2.call({});
    // equals( t2, obj, 'auto-proxying obj.*' );

    t = {}; t2 = {};
    obj = $$({}, {}, {
      test: (function(){
        var fn = function(){ t = this; };
        fn._noProxy = true;
        return fn;
      })()
    });
    var o2 = {};
    obj.controller.test.call(o2);
    equals( t, o2, '_noProxy obj.controller.*' );
    // Not doing this test yet as it requires a function factory (e.g. obj.fn()) to do auto-proxying!
    // obj.fn('test2', function(){ t2 = this; });
    // obj.test2.call(o2);
    // equals( t2, o2, '_noProxy obj.*' );
  });
  
  test("Extend controller syntax from four arguments (prototype, model, view, controller object)", function() {
    var lbl = $$({}, '<span data-bind="label"/>');
    var partial = $$({}, '<div/>', {
      'create': function() {
        var l = $$(lbl, {label: this.model.get('label')});
        this.append(l);
      },
      'myEvent': function() {
        var l = $$(lbl, {label: this.model.get('myEventLabel')});
        this.append(l);
      }
    });
    var complete = $$(partial, {}, {}, {
      '~create': function() {
        var value = $$(lbl, {label: this.model.get('value')});
        this.append(value);
      },
      '~myEvent': function() {
        var value = $$(lbl, {label: this.model.get('myEventValue')});
        this.append(value);
      }
    });
    var first = $$(complete, {label:"firstLabel", value:"firstValue"});
    var second = $$(complete, {label:"secondLabel", value:"secondValue"});
    validateObject(first);
    validateObject(second);
    equals(first.view.$('span').length, 2, 'appended both labels');
    equals(first.view.$('span').first().text(), 'firstLabel', 'executed partial create');
    equals(first.view.$('span').last().text(), 'firstValue', 'executed extended create');
    equals(second.view.$('span').length, 2, 'appended both labels');
    equals(second.view.$('span').first().text(), 'secondLabel', 'executed partial create');
    equals(second.view.$('span').last().text(), 'secondValue', 'executed extended create');
    
    first.model.set({myEventLabel: "myEventLabel", myEventValue: "myEventValue"});
    first.trigger('myEvent');
    equals(first.view.$('span').length, 4, 'appended all from myEvent chain');
    equals(first.view.$('span').eq(2).text(), 'myEventLabel', 'executed partial myEvent');
    equals(first.view.$('span').eq(3).text(), 'myEventValue', 'executed extended myEvent');
    
    var doubleExtend = $$(complete, {}, {}, {
      '~create': function() {
        var doub = $$(lbl, {label: this.model.get('doubleExtension')});
        this.append(doub);
      }
    });
    var dExtend = $$(doubleExtend, {label:"firstLabel",value:"extendedOnce",doubleExtension:"extendedTwice"});
    validateObject(dExtend);
    equals(dExtend.view.$('span').length, 3, 'appended labels from three chained create events');
    equals(dExtend.view.$('span').first().text(), 'firstLabel', 'executed first create');
    equals(dExtend.view.$('span').eq(1).text(), 'extendedOnce', 'executed second create');
    equals(dExtend.view.$('span').last().text(), 'extendedTwice', 'executed third create');
    
    var differential = $$(partial, {}, {}, {
      'create': function() {
        var value = $$(lbl, {label: this.model.get('value')});
        this.append(value);
      },
      'myEvent': function() {
        var l = $$(lbl, {label: this.model.get('myEventDifferential')});
        this.append(l);
      }
    });
    var third = $$(differential, {label:"thirdLabel",value:"thirdValue"});
    validateObject(third);
    equals(third.view.$('span').length, 1, 'only one child');
    equals(third.view.$('span').first().text(), 'thirdValue', 'initialized from overriden create');
    
    third.model.set({myEventDifferential: "myEventDifferential"});
    third.trigger('myEvent');
    equals(third.view.$('span').length, 2, 'appended via myEvent');
    equals(third.view.$('span').last().text(), 'myEventDifferential', 'executed from overrident myEvent');
    
    var nakedExtend = $$({}, '<div/>', {
      '~create': function(){
        var l = $$(lbl, {label: this.model.get('label')});
        this.append(l);
      }
    });
    var fourth = $$(nakedExtend, {label:"fourthLabel"});
    validateObject(fourth);
    equals(fourth.view.$('span').first().text(), 'fourthLabel', 'naked ~create collapsed correctly to "create"');
  });
  
  test("Extend controller syntax from single object argument ({ ..., controller: ...})", function() {
    var lbl = $$({}, '<span data-bind="label"/>');
    var partial = $$({}, '<div/>', {
      'create': function() {
        var l = $$(lbl, {label: this.model.get('label')});
        this.append(l);
      },
      'myEvent': function() {
        var l = $$(lbl, {label: this.model.get('myEventLabel')});
        this.append(l);
      }
    });
    var complete = $$(partial, {
      controller:{
        '~create': function() {
          var value = $$(lbl, {label: this.model.get('value')});
          this.append(value);
        },
        '~myEvent': function() {
          var value = $$(lbl, {label: this.model.get('myEventValue')});
          this.append(value);
        }
      }
    });
    var first = $$(complete, {label:"firstLabel", value:"firstValue"});
    var second = $$(complete, {label:"secondLabel", value:"secondValue"});
    validateObject(first);
    validateObject(second);
    equals(first.view.$('span').length, 2, 'appended both labels');
    equals(first.view.$('span').first().text(), 'firstLabel', 'executed partial create');
    equals(first.view.$('span').last().text(), 'firstValue', 'executed extended create');
    equals(second.view.$('span').length, 2, 'appended both labels');
    equals(second.view.$('span').first().text(), 'secondLabel', 'executed partial create');
    equals(second.view.$('span').last().text(), 'secondValue', 'executed extended create');
    
    first.model.set({myEventLabel: "myEventLabel", myEventValue: "myEventValue"});
    first.trigger('myEvent');
    equals(first.view.$('span').length, 4, 'appended all from myEvent chain');
    equals(first.view.$('span').eq(2).text(), 'myEventLabel', 'executed partial myEvent');
    equals(first.view.$('span').eq(3).text(), 'myEventValue', 'executed extended myEvent');
    
    var doubleExtend = $$(complete, {
      controller:{
        '~create': function() {
          var doub = $$(lbl, {label: this.model.get('doubleExtension')});
          this.append(doub);
        }
      }
    });
    var dExtend = $$(doubleExtend, {label:"firstLabel",value:"extendedOnce",doubleExtension:"extendedTwice"});
    validateObject(dExtend);
    equals(dExtend.view.$('span').length, 3, 'appended labels from three chained create events');
    equals(dExtend.view.$('span').first().text(), 'firstLabel', 'executed first create');
    equals(dExtend.view.$('span').eq(1).text(), 'extendedOnce', 'executed second create');
    equals(dExtend.view.$('span').last().text(), 'extendedTwice', 'executed third create');
    
    var differential = $$(partial, {
      controller: {
        'create': function() {
          var value = $$(lbl, {label: this.model.get('value')});
          this.append(value);
        },
        'myEvent': function() {
          var l = $$(lbl, {label: this.model.get('myEventDifferential')});
          this.append(l);
        }
      }
    });
    var third = $$(differential, {label:"thirdLabel",value:"thirdValue"});
    validateObject(third);
    equals(third.view.$('span').length, 1, 'only one child');
    equals(third.view.$('span').first().text(), 'thirdValue', 'initialized from overriden create');
    
    third.model.set({myEventDifferential: "myEventDifferential"});
    third.trigger('myEvent');
    equals(third.view.$('span').length, 2, 'appended via myEvent');
    equals(third.view.$('span').last().text(), 'myEventDifferential', 'executed from overrident myEvent');
    
    var nakedExtend = $$({
      controller: {
        '~create': function() {
          var l = $$(lbl, {label: this.model.get('label')});
          this.append(l);
        }
      }
    });
    var fourth = $$(nakedExtend, {label:"fourthLabel"});
    validateObject(fourth);
    equals(fourth.view.$('span').first().text(), 'fourthLabel', 'naked ~create collapsed correctly to "create"');
        
    var ran1 = false, ran2 = false;
    var DOMextend1 = $$({}, '<button/>', {
      'click &': function(){
        ran1 = true;
      }
    });
    var DOMextend2 = $$(DOMextend1, {}, {}, {
      '~click &': function(){
        ran2 = true;
      }
    });
    DOMextend2.view.$().click();
    ok(ran1, 'first DOM handler OK');
    ok(ran2, 'second DOM handler OK');
  });
  
  test("Object inheritance", function(){
    var objBase = $$({}, {format:'<div><span data-bind="first"/>.<span data-bind="last"/></div>', style:'& {float:right; display:none;}'});
    var objNewModel = {first:'Joe', last:'Doe'};
    var objNew = $$(objBase, objNewModel);
    $$.document.append(objNew);
    
    ok($.isEmptyObject(objBase.model.get()), "parent model untouched ("+JSON.stringify(objBase.model.get())+")");
    equals(objBase.view.$().text(), '.', "parent html untouched");
    equals(objNew.model.get('first'), objNewModel.first, "child model OK");
    equals(objNew.view.$().text(), 'Joe.Doe', "child html OK");
    ok(objNew.view.$().hasClass('agility_'+objBase._id), "child CSS class inherited OK");
    equals(objNew.view.$().css('float'), 'right', "child style OK");
    
    // this should trigger a 404 error if format is parsed to the DOM
    objBase = $$({}, "<div class='test'> <img data-bind='src path'/> </div>");
    equals(objBase.model.size(), 0, 'model is empty');
    objNew = $$(objBase, {path:'http://google.com/favicon.ico'});
    equals(objNew.view.$('img').attr('src'), 'http://google.com/favicon.ico', 'img src correctly set');
  });


  // ----------------------------------------------
  //
  //  Post-builder - Overriding default controller
  //
  // ----------------------------------------------

  module("Post-builder - Overriding default controller methods");

  // ------------------------------------
  //
  //  Post-builder - Default controller
  //
  // ------------------------------------

  module("Post-builder - Default controller");

  test("Container calls", function(){
    var obj1 = $$({}, '<div><span class="here"></span></div>');
    var obj2 = $$('hello');
    obj1.append(obj2, '.here');
    equals(obj1.view.$('.here div').html(), 'hello', 'append() appends at given selector');

    obj1 = $$({}, '<div><span></span></div>');
    obj2 = $$('hello'); // default format should have a <div> root
    obj1.append(obj2);
    equals(obj1.view.$('span').next().html(), 'hello', 'append() appends at root element');        

    obj1 = $$({}, '<div><ul/></div>');
    obj2 = $$('hello'); // default format should have a <div> root
    obj1.prepend(obj2);
    equals(obj1.view.$('ul').prev().html(), 'hello', 'prepend() prepends at root element');        

    obj1 = $$({}, '<div><ul><span/></ul></div>');
    obj2 = $$('hello'); // default format should have a <div> root
    obj1.prepend(obj2, 'ul');
    equals(obj1.view.$('ul span').prev().html(), 'hello', 'prepend() prepends at given selector');        

    obj1 = $$({}, '<div><ul><li id="a"/> <li id="b"/></ul></div>');
    obj2 = $$('hello'); // default format should have a <div> root
    obj1.before(obj2, '#b');
    equals(obj1.view.$('ul li#a').next().html(), 'hello', 'before() inserts correctly');

    obj1 = $$({}, '<div><ul><li id="a"/> <li id="b"/></ul></div>');
    obj2 = $$('hello'); // default format should have a <div> root
    obj1.after(obj2, '#a');
    equals(obj1.view.$('ul li#a').next().html(), 'hello', 'after() inserts correctly');

    obj1 = $$({}, '<div><span></span></div>');
    for (var i=0;i<10;i++) {
      obj2 = $$('hello', '<div class="test"></div>'); // default format should have a <div> root
      obj1.append(obj2, 'span');
    }
    equals(obj1.size(), 10, 'correct container size()');
    equals(obj1.view.$('.test').size(), 10, 'correct DOM size');

    var flag = false;
    var count = 0;
    obj1.each(function(){
      if (this.model.get('text') !== 'hello') flag = true;
      count++;
    });
    equals(flag, false, 'each() works');
    equals(count, 10, 'each() works');
    
    obj1.empty();
    equals(obj1.size(), 0, 'empty() works');
  });

  test("Model calls", function(){
    var t = false;
    var obj1 = $$({a:1}, '<div data-bind="text"></div>', {
      'change:text': function(){
        t = true;
      }
    });
    obj1.model.set({text:'Joe Doe'});
    equals(obj1.model.get('a'), 1, 'obj.model.set() extends by default');
    equals(obj1.view.$().text(), 'Joe Doe', 'obj.model.set() fires view change');
    equals(t, true, 'obj.model.set() fires change:var');
    obj1.model.set({text:'New Text'}, {reset:true});
    equals(obj1.model.get('a'), undefined, 'obj.model.set() resets OK');
    
    obj1.model.reset();
    equals(obj1.model.get('a'), 1, 'obj.model.reset() brings back original attribute');
    equals(obj1.model.get('text'), undefined, 'obj.model.reset() erases non-original attributes');
  });

  test("Chainable calls", function(){
    t = false;
    var obj = $$().model.set({text:'Joe Doe'}).bind('click &', function(){ t = true; }).trigger('click &');
    equals(t, true, 'chaining set(), bind(), and trigger()');
  });

  test("Two-way bindings", function(){
    var obj = $$({name:'Mary'}, "<input type='text' data-bind='name' />");
    equals(obj.view.$().val(), 'Mary', 'text input: binding properly initialized');
    obj.model.set({name:'Joe Doe'});
    equals(obj.view.$().val(), 'Joe Doe', 'text input: Model --> DOM binding OK');
    obj.view.$().val('Art Blakey').change();
    equals(obj.model.get('name'), 'Art Blakey', 'text input: DOM --> Model binding OK');

    var obj = $$({name:'Mary'}, "<input type='search' data-bind='name' />");
    equals(obj.view.$().val(), 'Mary', 'search input: binding properly initialized');
    obj.model.set({name:'Joe Doe'});
    equals(obj.view.$().val(), 'Joe Doe', 'search input: Model --> DOM binding OK');
    // can't test these synchronously as current implementation uses a 50ms timeout
    // obj.view.$().val('Joe Doee').keypress();
    // equals(obj.model.get('name'), 'Joe Doee', 'search input: DOM --> Model binding OK');

    obj = $$({a:true}, "<input type='checkbox' data-bind='a' />");
    equals(obj.view.$().prop('checked'), true, 'checkbox input: binding properly initialized');
    obj.model.set({a:false});
    equals(obj.view.$().prop("checked"), false, 'checkbox input: Model --> DOM binding OK');
    obj.view.$().prop('checked', true).change();
    equals(obj.model.get('a'), true, 'checkbox input: DOM --> Model binding OK');

    obj = $$({opt:'opt-b'}, "<div><input type='radio' name='test' data-bind='opt' value='opt-a' id='a'/> a<br/> <input type='radio' name='test' data-bind='opt' value='opt-b' id='b'/> b</div>");
    equals(obj.view.$('input#b').prop("checked"), true, 'radio input: binding properly initialized');
    obj.model.set({opt:'opt-a'});
    equals(obj.view.$('input#a').prop("checked"), true, 'radio input: Model --> DOM binding OK');
    obj.view.$('input#b').prop('checked', true).change();
    equals(obj.model.get('opt'), 'opt-b', 'radio input: DOM --> Model binding OK');

    obj = $$({opt:'opt-b'}, "<select data-bind='opt'> <option value='opt-a'/> <br/> <option value='opt-b'/> </select>");
    equals(obj.view.$().val(), 'opt-b', 'select input: binding properly initialized');
    obj.model.set({opt:'opt-a'});
    equals(obj.view.$().val(), 'opt-a', 'select input: Model --> DOM binding OK');
    obj.view.$().val('opt-b').change();
    equals(obj.model.get('opt'), 'opt-b', 'select input: DOM --> Model binding OK');
  });
  
  test("Two-way bindings with extra one-way bound attributes", function(){
    var obj = $$({name:'Mary',myAttr:'myAttr'}, "<input type='text' data-bind='name, myAttr myAttr' />");
    equals(obj.view.$().val(), 'Mary', 'text input: binding properly initialized');
    equals(obj.view.$().attr('myAttr'), 'myAttr', 'extra attribute set');
    obj.model.set({name:'Joe Doe'});
    equals(obj.view.$().val(), 'Joe Doe', 'text input: Model --> DOM binding OK');
    equals(obj.view.$().attr('myAttr'), 'myAttr', 'extra attribute set');
    obj.view.$().val('Art Blakey').change();
    equals(obj.model.get('name'), 'Art Blakey', 'text input: DOM --> Model binding OK');

    var obj = $$({name:'Mary',myAttr:'myAttr'}, "<input type='search' data-bind='name, myAttr myAttr' />");
    equals(obj.view.$().val(), 'Mary', 'search input: binding properly initialized');
    equals(obj.view.$().attr('myAttr'), 'myAttr', 'extra attribute set');
    obj.model.set({name:'Joe Doe'});
    equals(obj.view.$().val(), 'Joe Doe', 'search input: Model --> DOM binding OK');
    equals(obj.view.$().attr('myAttr'), 'myAttr', 'extra attribute set');
    // can't test these synchronously as current implementation uses a 50ms timeout
    // obj.view.$().val('Joe Doee').keypress();
    // equals(obj.model.get('name'), 'Joe Doee', 'search input: DOM --> Model binding OK');

    obj = $$({a:true,myAttr:'myAttr'}, "<input type='checkbox' data-bind='a, myAttr myAttr' />");
    equals(obj.view.$().prop('checked'), true, 'checkbox input: binding properly initialized');
    equals(obj.view.$().attr('myAttr'), 'myAttr', 'extra attribute set');
    obj.model.set({a:false});
    equals(obj.view.$().prop("checked"), false, 'checkbox input: Model --> DOM binding OK');
    equals(obj.view.$().attr('myAttr'), 'myAttr', 'extra attribute set');
    obj.view.$().prop('checked', true).change();
    equals(obj.model.get('a'), true, 'checkbox input: DOM --> Model binding OK');

    obj = $$({opt:'opt-b',myAttr:'myAttr'}, "<div><input type='radio' name='test' data-bind='opt, myAttr myAttr' value='opt-a' id='a'/> a<br/> <input type='radio' name='test' data-bind='opt' value='opt-b' id='b'/> b</div>");
    equals(obj.view.$('input#b').prop("checked"), true, 'radio input: binding properly initialized');
    equals(obj.view.$('input#a').attr('myAttr'), 'myAttr', 'extra attribute set');
    equals(obj.view.$('input#b').attr('myAttr'), null, 'no extra attribute set');
    obj.model.set({opt:'opt-a'});
    equals(obj.view.$('input#a').prop("checked"), true, 'radio input: Model --> DOM binding OK');
    equals(obj.view.$('input#a').attr('myAttr'), 'myAttr', 'extra attribute set');
    equals(obj.view.$('input#b').attr('myAttr'), null, 'no extra attribute set');
    obj.view.$('input#b').prop('checked', true).change();
    equals(obj.model.get('opt'), 'opt-b', 'radio input: DOM --> Model binding OK');

    obj = $$({opt:'opt-b',myAttr:'myAttr'}, "<select data-bind='opt, myAttr myAttr'> <option value='opt-a'/> <br/> <option value='opt-b'/> </select>");
    equals(obj.view.$().val(), 'opt-b', 'select input: binding properly initialized');
    equals(obj.view.$().attr('myAttr'), 'myAttr', 'extra attribute set');
    obj.model.set({opt:'opt-a'});
    equals(obj.view.$().val(), 'opt-a', 'select input: Model --> DOM binding OK');
    equals(obj.view.$().attr('myAttr'), 'myAttr', 'extra attribute set');
    obj.view.$().val('opt-b').change();
    equals(obj.model.get('opt'), 'opt-b', 'select input: DOM --> Model binding OK');
  });

  // ----------------------------------------------
  //
  //  Post-builder - Custom controller methods
  //
  // ----------------------------------------------

  module("Post-builder - Custom controller methods");

  test("Container events", function(){
    var o = {};
    var s = '';
    var obj1 = $$();
    var obj2 = $$({
      controller: {
        append: function(ev, $$o, selector){
          o = $$o;
          s = selector;
        }
      }
    });  
    obj2.append(obj1, 'sel');
    ok(o===obj1 && s==='sel', "append() called");
  });

  test("Model events", function(){
    var t = false;
    var obj = $$({}, {}, {
      'change': function(){
        t = true;
      }
    });
    obj.model.set({a:'hello'});
    ok(t===true, "change fired");
  });

  test("DOM events", function(){
    var t = false;
    var obj = $$('hello', '<div><button>${text}</button></div>', {
      'click button': function(event){
        t = true;
      }
    });
    obj.view.$('button').trigger('click');
    ok(t===true, "click event caught");
    
    t = false;
    obj.view.$('span').trigger('click');
    ok(t===false, "click event properly filtered selector");

    t = false;
    obj = $$('hello', '<button>${text}</button>', {
      'click &': function(event){
        t = true;
      }
    });
    obj.view.$().trigger('click');
    ok(t===true, "root click event caught");
  });

})(jQuery, agility);

