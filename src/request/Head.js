import jfAjaxRequestBase from './base';
/**
 * Maneja las peticiones `HEAD`.
 *
 *
 * @namespace jf.ajax.request
 * @class     jf.ajax.request.Head
 * @extends   jf.ajax.request.Base
 */
export default class jfAjaxRequestHead extends jfAjaxRequestBase
{
    /**
     * @override
     */
    method = 'HEAD';
}
