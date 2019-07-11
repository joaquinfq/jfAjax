import jfHttpHeaders from 'jf-http-headers';
import jfObject from '@jf/object';
/**
 * Maneja la respuesta de una petición.
 *
 *
 * @namespace jf.ajax.response
 * @class     jf.ajax.response.Default
 * @extends   jf.Object
 */
export default class jfAjaxResponseDefault extends jfObject
{
    /**
     * Encabezados recibidos del servidor.
     *
     * @property headers
     * @type     {null|jf.HttpHeaders}
     */
    headers  = null;
    /**
     * Respuesta recibida del servidor.
     *
     * @property response
     * @type     {String|Document|Object}
     */
    response = null;
    /**
     * Objeto usado para realizar la petición.
     *
     * @property xhr
     * @type     {null|XMLHttpRequest}
     */
    xhr      = null;

    /**
     * Constructor de la clase.
     *
     * @constructor
     */
    constructor()
    {
        super();
        this.headers = new jfHttpHeaders();
    }

    /**
     * Devuelve el código de respuesta del servidor.
     *
     * @method getCode
     *
     * @return {Number} Valor que corresponde con código de estado devuelto o -1 si no se ha recibido todavía.
     */
    getCode()
    {
        let _xhr = this.xhr;
        return this.isReady()
            ? _xhr.status
            : -1;
    }

    /**
     * Devuelve la información de ayuda a depurar la respuesta.
     *
     * @method getInfo
     *
     * @return {String} Información de la respuesta.
     */
    getInfo()
    {
        let _xhr = this.xhr;
        return _xhr
            ? `HTTP/X.Y ${this.getCode()}\n${this.headers}\n\n${_xhr.responseText}`
            : '';
    }

    /**
     * Devuelve los errores devueltos por el servidor.
     * Cada error es un objeto y las clases hijas deberán devolver
     * los errores con el siguiente formato:
     *
     * - description : Descripción del error
     * - status      : Código de la respuesta.
     * - type        : Indica el tipo de error.
     *
     * @method getErrors
     *
     * @return {Object[]} Devuelve un listado de errores encontrados durante la obtención de la respuesta.
     */
    getErrors()
    {
        const _error = {
            description : 'Error',
            status      : this.getCode(),
            type        : 'error'
        };
        //------------------------------------------------------------------------------
        // Intentamos colocar en la descripción alguna información recibida.
        //------------------------------------------------------------------------------
        const _response = this.getResponse();
        if (_response && typeof _response === 'object')
        {
            for (let _prop of ['message', 'error', 'info'])
            {
                if (typeof _response[_prop] === 'string')
                {
                    _error.description = _response[_prop];
                    break;
                }
            }
        }
        return [_error];
    }

    /**
     * Devuelve la respuesta obtenida.
     *
     * @method getResponse
     *
     * @return {Document|String|Object} Respuesta obtenida del servidor.
     */
    getResponse()
    {
        let _response = this.response;
        if (_response === null && this.isReady())
        {
            let _xhr     = this.xhr;
            let _headers = this.headers;
            if (!Object.keys(_headers.headers).length)
            {
                const _responseHeaders = _xhr.getAllResponseHeaders();
                if (_responseHeaders)
                {
                    _headers.parse(_responseHeaders.split('\r\n'));
                }
            }
            let _type = (_headers.get('Content-Type') || '').toLowerCase().split(';').shift().trim();
            switch (_type)
            {
                case 'application/json':
                    try
                    {
                        _response = JSON.parse(_xhr.responseText);
                    }
                    catch (e)
                    {
                        _response = {};
                    }
                    break;
                case 'application/xml':
                case 'text/xml':
                    _response = _xhr.responseXML;
                    break;
                case 'text/html':
                    try
                    {
                        _response = (new DOMParser()).parseFromString(_xhr.responseText, _type) || _xhr.responseText;
                    }
                    catch (e)
                    {
                        _response = _xhr.responseText;
                    }
                    break;
                default:
                    _response = _xhr.responseText;
                    break;
            }
            this.response = _response;
        }
        return _response;
    }

    /**
     * Indica si la respuesta está lista para ser leída.
     *
     * @method isReady
     *
     * @return {Boolean} `true` si ha finalizado la petición y puede leerse la respuesta.
     */
    isReady()
    {
        let _xhr = this.xhr;
        return _xhr !== null && _xhr.readyState === _xhr.constructor.DONE;
    }

    /**
     * Indica si la petición se ha realizado exitosamente.
     *
     * @method isSuccess
     *
     * @return {Boolean} `true` si la petición ha finalizado correctamente (estados `2XX` y `304`).
     */
    isSuccess()
    {
        let _code = this.getCode();
        return _code >= 200 && _code < 300 || _code === 304;
    }
}
