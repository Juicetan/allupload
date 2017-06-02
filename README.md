# allupload
A vanilla JavaScript plugin to help facilitate file upload in a simple black-box manner.

We're all too familiar with having to perform multipart/form-data file uploads.  If you really want to build something cool, you'll want to do it asynchronously, trigger it with a custom button, and show a fancy loading gif while doing it.  This requires a hidden `input` element, `form`, and `iframe` that will perform that actual `POST`.  I hated implementing this interaction over and over again.

This plugin will encapsulate all that cumbersome interaction and give you a convenient and easy to use API to fire and forget a file upload request.  It also utilizes native ES6 Promises so you can easily hook into and react to changes in the upload state.  For instance, you can react to file upload success, failure, and even when a file has been chosen to upload.

## Compatibility

To align with current standards this plugin utilizes the new [ES6 Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) [(spec)]

To maintain compatibility until all browsers catch up, it is recommended to include the polyfill below by default.

* Promise Polyfill: [stefanpenner/es6-promise](https://github.com/stefanpenner/es6-promise)

## Getting Started

1. Fetch the plugin

  The plugin is available using the [Node Package Manager(npm)](https://www.npmjs.com/package/allupload)
    ```shell
    $ npm install allupload --save
    ```

1. Include plugin script
  
  ```html
  <script src="node_modules/allupload/src/allUpload.js"></script>
  ```

2. Trigger to choose and upload a file from disk

  ```javascript
  allUpload({
    targetURL: url,
    fileParamName: 'data',
    acceptStr: 'image/*',
    onfilechange: function(systemFilePath){
      // file has been picked and upload is started; trigger uploading gif
    }
  }).then(function(resp){
    // do cool things with uploaded file
    // if API outputs JSON
    try {
      var body = resp.querySelector('body').innerText;
      var json = JSON.parse(body);
    } catch(exception) {
      // invalid JSON
    }
  }).catch(function(resp){
    // notify user of failure
  });
  ```

## Options

| Name | Default | Description |
| ---- | ------- | ----------- |
| acceptStr | * | Accept string which will dictate the file type filter on the default OS file picker|
| fileParamName | file | Post parameter name the server is expecting in the multipart/form-data POST request |
| formArgs | {} | Additional string parameters expected in the multipart/form-data POST request; in the form of an js Object with key value pairs |
| targetURL | '' | The respective API endpoint to upload the file |
| uploadTimeout | 10500 | Timeout threshold for fileupload in milliseconds |
| multipleSelect | false | Flag to enable multiple file selection in default OS file picker; note that server must support multiple file upload |
| captureType | '' | HTML5 capture type that can be used to initiate camera image upload on mobile |
| isResponseInQueryString | false | Often times you will be required to upload a file to a cross origin domain.  This means that browser security will prevent you from reading the contents of the Iframe what will contain your file upload response.  To circumvent this some file upload APIs will respond with a 302 and redirect your Iframe to a URL and write the response as query parameters.  You can now safely read the response of your file upload.  This flag will force allUpload to read the response from the URL of the Iframe as opposed to retrieving the response from the body of the Iframe. |
