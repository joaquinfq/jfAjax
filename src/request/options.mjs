import jfAjaxRequestBase from './base';
/**
 * Maneja las peticiones `OPTIONS`.
 *
 *
 * @namespace jf.ajax.request
 * @class     jf.ajax.request.Options
 * @extends   jf.ajax.request.Base
 */
export default class jfAjaxRequestOptions extends jfAjaxRequestBase
{
    /**
     * @override
     */
    method = 'OPTIONS';
}
