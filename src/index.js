const JfAjaxRequestBase     = require('./request/Base.js');
const JfAjaxRequestDelete   = require('./request/Delete.js');
const JfAjaxRequestGet      = require('./request/Get.js');
const JfAjaxRequestHead     = require('./request/Head.js');
const JfAjaxRequestOptions  = require('./request/Options.js');
const JfAjaxRequestPatch    = require('./request/Patch.js');
const JfAjaxRequestPost     = require('./request/Post.js');
const JfAjaxRequestPut      = require('./request/Put.js');
const JfAjaxResponseDefault = require('./response/Default.js');
/**
 * OOP library for sending AJAX requests
 *
 * @author  Joaquín Fernández
 * @module  @jf&#x2F;ajax
 * @created 2019-07-11T10:44:16.960Z
 * @version 0.3.0
 */
module.exports = {
    request : {
        Base : JfAjaxRequestBase,
        Delete : JfAjaxRequestDelete,
        Get : JfAjaxRequestGet,
        Head : JfAjaxRequestHead,
        Options : JfAjaxRequestOptions,
        Patch : JfAjaxRequestPatch,
        Post : JfAjaxRequestPost,
        Put : JfAjaxRequestPut
    },
    response : {
        Default : JfAjaxResponseDefault
    }
};
