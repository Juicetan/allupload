# allupload
A jQuery plugin to help facilitate file upload in a simple black-box manner.

We're all too familiar with having to perform multipart/form-data file uploads.  If you really want to build something cool, you'll want to do it asynchronously, trigger it with a custom button, and show a fancy loading gif while doing it.  This requires a hidden `input` element, `form`, and `iframe` that will perform that actual `POST`.  I hated implementing this interaction over and over again.

This plugin will encapsulate all that cumbersome interaction and give you a convenient and easy to use API to fire and forget a file upload request.  It also utilizes promises so you can easily hook into and react to changes in the upload state.  For instance, you can react to file upload success, failure, and even when a file has been chosen to upload.

##Getting Started

1. Include plugin script
  ```html
  <script src="//ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
  <script src="path/to/allUpload.js"></script>
  ```

2. Trigger to choose and upload a file from disk
  ```javascript
  $.allUpload({
    targetURL: url,
    fileParamName: 'data',
    acceptStr: 'image/*',
  }).progress(function(){
    // file has been picked and upload is started; trigger uploading gif
  }).done(function(resp){
    // do cool things with uploaded file
  }
  }).fail(function(resp){
    // notify user of failure
  });
  ```

##Options
| Name | Default | Description |
| ---- | ------- | ----------- |
| acceptStr | * | Accept string which will dictate the file type filter on the default OS file picker|
| fileParamName | file | Post parameter name the server is expecting in the multipart/form-data POST request |
| formArgs | {} | Additional string parameters expected in the multipart/form-data POST request; in the form of an js Object with key value pairs |
| targetURL | '' | The respective API endpoint to upload the file |
| uploadTimeout | 10500 | Timeout threshold for fileupload in milliseconds |
| multipleSelect | false | Flag to enable multiple file selection in default OS file picker; note that server must support multiple file upload |