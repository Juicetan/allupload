# allupload
A jQuery plugin to help facilitate file upload in a simple black-box manner.

We're all too familiar with having to perform multipart/form-data file uploads.  If you really want to build something cool, you'll want to do it asynchronously, trigger it with a custom button, and show a fancy loading gif while doing it.  This requires a hidden `input` element, `form`, and `iframe` that will perform that actual `POST`.  I hated implementing this interaction over and over again.

This plugin will encapsulate all that cumbersome interaction and give you a convenient and easy to use API to fire and forget a file upload request.  It also utilizes promises so you can easily hook into and react to changes in the upload state.  For instance, you can react to file upload success, failure, and even when a file has been chosen to upload.