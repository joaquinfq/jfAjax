import jfAjaxRequestPost from './post';
/**
 * Maneja las peticiones `PUT`.
 *
 *
 * @namespace jf.ajax.request
 * @class     jf.ajax.request.Put
 * @extends   jf.ajax.request.Base
 */
export default class jfAjaxRequestPut extends jfAjaxRequestPost
{
    /**
     * @override
     */
    method = 'PUT';
}
