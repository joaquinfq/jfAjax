import jfAjaxRequestBase from './base';
/**
 * Maneja las peticiones `DELETE`.
 *
 *
 * @namespace jf.ajax.request
 * @class     jf.ajax.request.Delete
 * @extends   jf.ajax.request.Base
 */
export default class jfAjaxRequestDelete extends jfAjaxRequestBase
{
    /**
     * @override
     */
    method = 'DELETE';
}
