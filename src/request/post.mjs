import jfAjaxRequestBase from './base';
import queryString from 'querystring';
/**
 * Maneja las peticiones `POST`.
 *
 *
 * @namespace jf.ajax.request
 * @class     jf.ajax.request.Post
 * @extends   jf.ajax.request.Base
 */
export default class jfAjaxRequestPost extends jfAjaxRequestBase
{
    /**
     * @override
     */
    method = 'POST';

    /**
     * @override
     */
    _formatData()
    {
        let _body   = null;
        const _data = this.data;
        if (_data !== null)
        {
            let _type = (this.headers.get('Content-Type') || '').toLowerCase();
            _body     = _type.indexOf('/json') === -1
                ? queryString.stringify(_data).trim()
                : JSON.stringify(_data);
        }
        return {
            body : _body
        };
    }
}
