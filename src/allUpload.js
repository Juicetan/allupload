;(function(window,document,Math,$,undefined){
  var guid = function(){
    var s4 = function(){
      return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
    };

    return 'g' + s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
  };

  var defaults = {
    acceptStr:'*',
    fileParamName:'file',
    formArgs:{},
    targetURL:'',
    uploadTimeout: 10500,
    multipleSelect: false
  };

  var addArgsToForm = function($form,argsObj){
    var keys = Object.keys(argsObj);

    for(var i = 0; i < keys.length; i++){
      var $input = $("<input>",{
        id: keys[i],
        name: keys[i],
        value: argsObj[keys[i]],
        type: 'hidden',
      });
      $form.append($input);
    }
  };

  var cleanupIframe = function($iframe){
    $iframe.remove();
  };

  var setupForm = function(url,fileParamName,args,acceptStr,multipleSelect){
    var def = $.Deferred();
    var $form = $('<form>', {
      action: url,
      method: 'POST',
      enctype: 'multipart/form-data',
    });

    addArgsToForm($form,args);

    var $fileInput = $("<input>",{
      id: fileParamName,
      name: fileParamName,
      type: 'file',
      value: '',
      accept: acceptStr,
      multiple: multipleSelect
    }).on('change',function(){
      var val = $(this).val();
      if(val.length) {
        def.resolve(val);
      } else{
        def.reject();
      }
    });
    $form.append($fileInput);

    return {
      $el: $form,
      fileChangePromise: def.promise()
    };
  };

  var setupIframe = function(){
    var def = $.Deferred();
    var $iframe = $("<iframe>",{
      id: guid(),
      style: 'width:0;height:0;border:0;visibility:hidden;position:absolute;',
      src:'about:blank',
    });
    $('body').append($iframe);

    $iframe.load(function(){
      var frameSrc = $(this).contents()[0].location.href;
      if(frameSrc === 'about:blank'){
        return false;
      }

      var responseText = $(this).contents();
      if(responseText){
        def.resolve(responseText);
      } else{
        def.reject(responseText);
      }
    });

    return {
      $el: $iframe,
      responsePromise: def.promise()
    };
  };

  $['allUpload'] = function(opts){
    var def = $.Deferred();
    var finished = false;
    var options = $.extend({},defaults,opts);

    var formObj = setupForm(
      options.targetURL,
      options.fileParamName,
      options.formArgs,
      options.acceptStr,
      options.multipleSelect);
    var $form = formObj.$el;
    var fileChangePromise = formObj.fileChangePromise;

    var iframeObj = setupIframe();
    var $iframe = iframeObj.$el;
    var responsePromise = iframeObj.responsePromise;

    $form.find('input[type="file"]').trigger('click');

    fileChangePromise
      .done(function(){
        def.notify();
        $iframe.contents().find('body').append($form);
        $iframe.contents().find('form').submit();

        //hacky IE fix to compensate for the lack of
        //iframe load event;
        setTimeout(function(){
          if(!finished){
            def.resolve();
          }
        },options.uploadTimeout);
      }).fail(function(){
        cleanupIframe($iframe);
        def.reject();
      });

    responsePromise
      .done(function(resp){
        def.resolve(resp);
      }).fail(function(resp){
        console.error('> file upload error',resp);
        def.reject();
      }).always(function(){
        finished = true;
        cleanupIframe($iframe);
      });

    return def.promise();
  };
})(window,document,Math,jQuery);