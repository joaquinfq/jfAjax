import jfAjaxRequestPost from './post';
/**
 * Maneja las peticiones `PATCH`.
 *
 *
 * @namespace jf.ajax.request
 * @class     jf.ajax.request.Patch
 * @extends   jf.ajax.request.Base
 */
export default class jfAjaxRequestPatch extends jfAjaxRequestPost
{
    /**
     * @override
     */
    method = 'PATCH';
}
