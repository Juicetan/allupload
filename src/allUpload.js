;(function(window,document,Math,undefined){
  var guid = function(){
    var s4 = function(){
      return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
    };

    return 'g' + s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
  };
  var extend = function(destination,source){
    if(typeof $ === 'function' && typeof $.extend === 'function'){
      return $.extend(true,destination,source);
    }
    if(typeof _ === 'function' && typeof _.extend === 'function'){
      return _.extend(destination,source);
    }

    for (var property in source) {
      if (source[property] && source[property].constructor &&
          source[property].constructor === Object) {
        destination[property] = destination[property] || {};
        arguments.callee(destination[property], source[property]);
      } else {
        destination[property] = source[property];
      }
    }
    return destination;
  };
  
  var Deferred = function(){
    var def = this;
    this.promise = new Promise(function(resolve,reject){
      def.resolve = resolve;
      def.reject = reject;
    });

    this.then = this.promise.then.bind(this.promise);
    this.catch = this.promise.catch.bind(this.promise);
  };

  var defaults = {
    acceptStr:'*',
    captureType: '',
    fileParamName:'file',
    formArgs:{},
    targetURL:'',
    uploadTimeout: 10500,
    multipleSelect: false
  };

  var addArgsToForm = function(form,argsObj){
    var keys = Object.keys(argsObj);

    for(var i = 0; i < keys.length; i++){
      var input = document.createElement('input');
      input.setAttribute('id',keys[i]);
      input.setAttribute('name',keys[i]);
      input.setAttribute('value',argsObj[keys[i]]);
      input.setAttribute('type','hidden');
      form.appendChild(input);
    }
  };

  var cleanupIframe = function($iframe){
    $iframe.remove();
  };

  var setupForm = function(url,fileParamName,args,acceptStr,multipleSelect,captureType){
    var def = new Deferred();
    var form = document.createElement('form');
    form.setAttribute('action',url);
    form.setAttribute('method','POST');
    form.setAttribute('enctype','multipart/form-data');

    addArgsToForm(form,args);

    var fileInput = document.createElement('input');
    fileInput.setAttribute('id',fileParamName);
    fileInput.setAttribute('name',fileParamName);
    fileInput.setAttribute('type','file');
    fileInput.setAttribute('value','');
    fileInput.setAttribute('accept',acceptStr);
    fileInput.setAttribute('multiple',multipleSelect); 
    if(captureType){
      fileInput.setAttribute('capture',captureType); 
    }
    fileInput.addEventListener('change',function(){
      if(fileInput.value.length){
        def.resolve(fileInput.value);
      } else{
        def.reject();
      }
    });

    form.append(fileInput);

    return {
      el: form,
      fileChangePromise: def.promise
    };
  };

  var setupIframe = function(){
    var def = new Deferred();
    var iframe = document.createElement('iframe');
    iframe.setAttribute('id',guid());
    iframe.setAttribute('src','about:blank');
    iframe.style.width = '0px';
    iframe.style.height = '0px';
    iframe.style.border = '0';
    iframe.style.visibility = 'hidden';
    iframe.style.position = 'absolute';
    
    document.body.appendChild(iframe);

    iframe.addEventListener('load',function(){
      var frameWindow = iframe.contentWindow || iframe.documentWindow;
      var frameSrc = frameWindow.location.href;
      if(frameSrc === 'about:blank'){
        return false;
      }

      var iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
      var responseText = iframeDocument.children.length?iframeDocument.children[0]:"";
      if(responseText){
        def.resolve(responseText);
      } else{
        def.reject(responseText);
      }
    });

    return {
      el: iframe,
      responsePromise: def.promise
    };
  };

  window.allUpload = function(opts){
    var def = new Deferred();
    var finished = false;
    var options = extend(extend({},defaults),opts);

    var formObj = setupForm(
      options.targetURL,
      options.fileParamName,
      options.formArgs,
      options.acceptStr,
      options.multipleSelect,
      options.captureType);
    var form = formObj.el;
    var fileChangePromise = formObj.fileChangePromise;

    var iframeObj = setupIframe();
    var iframe = iframeObj.el;
    var responsePromise = iframeObj.responsePromise;

    form.querySelector('input[type="file"]').click();

    fileChangePromise
      .then(function(value){
        if(options.onfilechange && typeof options.onfilechange === 'function'){
          options.onfilechange(value);
        }
        var iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
        iframeDocument.body.appendChild(form);
        iframeDocument.querySelector('form').submit();

        //hacky IE fix to compensate for the lack of
        //iframe load event;
        setTimeout(function(){
          if(!finished){
            def.resolve();
          }
        },options.uploadTimeout);
      }).catch(function(){
        if(options.onfilechange && typeof options.onfilechange === 'function'){
          options.onfilechange(false);
        }
        cleanupIframe(iframe);
        def.reject();
      });

    responsePromise
      .then(function(resp){
        def.resolve(resp);
      }).catch(function(resp){
        console.error('> file upload error',resp);
        def.reject();
      }).then(function(){
        finished = true;
        cleanupIframe(iframe);
      });

    return def.promise;
  };
})(window,document,Math);