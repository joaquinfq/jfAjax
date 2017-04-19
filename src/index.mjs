import jfAjaxRequestBase from './request/base';
import jfAjaxRequestDelete from './request/delete';
import jfAjaxRequestGet from './request/get';
import jfAjaxRequestHead from './request/head';
import jfAjaxRequestOptions from './request/options';
import jfAjaxRequestPatch from './request/patch';
import jfAjaxRequestPost from './request/post';
import jfAjaxRequestPut from './request/put';
import jfAjaxResponseDefault from './response/default';
/**
 * Exportamos las clases.
 */
export const request  = {
    Base    : jfAjaxRequestBase,
    Delete  : jfAjaxRequestDelete,
    Get     : jfAjaxRequestGet,
    Head    : jfAjaxRequestHead,
    Options : jfAjaxRequestOptions,
    Patch   : jfAjaxRequestPatch,
    Post    : jfAjaxRequestPost,
    Put     : jfAjaxRequestPut
};
export const response = {
    Default : jfAjaxResponseDefault
};
