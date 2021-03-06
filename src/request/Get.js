import jfAjaxRequestBase from './base';
/**
 * Maneja las peticiones `GET`.
 *
 *
 * @namespace jf.ajax.request
 * @class     jf.ajax.request.Get
 * @extends   jf.ajax.request.Base
 */
export default class jfAjaxRequestGet extends jfAjaxRequestBase
{
    /**
     * @override
     */
    method = 'GET';

    /**
     * @override
     */
    _formatData()
    {
        return {
            query : this.data
        };
    }
}
