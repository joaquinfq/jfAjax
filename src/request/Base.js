import jfAjaxResponseDefault from '../response/default';
import jfChrono from '@jf/chrono';
import jfHttpHeaders from 'jf-http-headers';
import jfObject from '@jf/object';
import jfTpl from '@jf/tpl';
import url from 'url';
/**
 * Clase base para realizar peticiones a los servidores.
 *
 *
 * @namespace jf.ajax.request
 * @class     jf.ajax.request.Base
 * @extends   jf.Object
 */
export default class jfAjaxRequestBase extends jfObject
{
    /**
     * Cronómetro para medir la duración de las petición para
     * realizar pruebas de rendimiento o enviar estadísticas.
     *
     * @property chrono
     * @type     {null|jf.Chrono}
     */
    chrono    = null;
    /**
     * Opciones a enviar al servidor.
     * Se verifican primero en la URL y se reemplazan y el resto se
     * envían como datos según el método de la petición.
     *
     * @property data
     * @type     {Object|null}
     */
    data      = null;
    /**
     * Activa/desactiva el modo debug.
     * En modo debug todos los encabezados y el cuerpo tanto de las
     * petición como de la respuesta se muestran en la consola.
     *
     * @property debug
     * @type     {Boolean}
     */
    debug     = false;
    /**
     * Encabezados a enviar al servidor.
     *
     * @property headers
     * @type     {null|jf.HttpHeaders}
     */
    headers   = null;
    /**
     * Indica si el navegador tiene alguna conexión activa para realizar peticiones.
     *
     * @property isOnline
     * @type     {Boolean}
     */
    isOnline  = true;
    /**
     * Idioma de la petición.
     * Se usa principalmente para los encabezados `Accept-Language`
     * y `Content-Language`.
     *
     * @property language
     * @type     {String}
     */
    language  = 'es';
    /**
     * Método de la petición.
     *
     * @property method
     * @type     {String}
     */
    method    = '';
    /**
     * Manejador de la respuesta.
     *
     * @property response
     * @type     {null|jf.ajax.response.Base}
     */
    response  = null;
    /**
     * URL de la petición.
     *
     * @property url
     * @type     {String|Url}
     */
    url       = '';
    /**
     * Instancia usada para realizar la petición.
     * Se puede usar cualquier clase que implemente los métodos de XMLHttpRequest
     *
     * @property xhr
     * @type     {XMLHttpRequest|null}
     *
     * @see      https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest
     */
    xhr       = null;
    /**
     * Configuración a aplicar a `this.xhr` cuando se construya.
     * Se pueden especificar atributos tales como withCredentials, timeout, etc.
     *
     * @property xhrConfig
     * @type     {Object}
     */
    xhrConfig = {};

    /**
     * Constructor de la clase.
     *
     * @param {Object} config Configuración a aplicar a la instancia.
     *
     * @constructor
     */
    constructor(config = {})
    {
        super();
        this.isOnline = (typeof window === 'undefined' || window.navigator.onLine) === true;
        this.setProperties(config);
        const _lang  = this.language || 'es';
        this.headers = new jfHttpHeaders(
            Object.assign(
                {
                    'Accept'           : 'application/json, text/javascript, */*; q=0.01',
                    'Accept-Language'  : _lang,
                    'Content-Language' : _lang,
                    'Content-Type'     : 'application/json'
                },
                config.headers || {}
            )
        );
        if (config.xhr)
        {
            this.setXhr(config.xhr);
        }
    }

    /**
     * Analiza la URL y asigna los valores de los parámetro que deben
     * enviarse como parte de la URL y que se haya especificado en la
     * propiedad <em>data</em> al crear el objeto.
     *
     * @method _getUrl
     *
     * @param {Object?} query Parámetros a agregar a la URL.
     *
     * @return {Url} Objeto con la información de la URL.
     *
     * @protected
     */
    _buildUrl(query)
    {
        let _url = this.url;
        if (typeof _url === 'string')
        {
            _url = url.parse(
                jfTpl(
                    {
                        context : this.data,
                        delKeys : true,
                        tpl     : _url
                    }
                ),
                true
            );
        }
        if (query)
        {
            Object.assign(_url.query, query);
        }
        return _url;
    }

    /**
     * Construye los datos a enviar al servidor a partir de los valores
     * almacenados en la propieda `data`.
     * Devuelve las siguientes claves opcionales:
     *
     * * `body` : El contenido que debe enviarse como cuerpo de la respuesta o null
     *            si no se va a enviar contenido.
     * * `query`: Datos que se enviarán como parte de la URL en un objeto.
     *
     * @method _formatData
     *
     * @return {Object} Datos formateados.
     *
     * @protected
     */
    _formatData()
    {
        return {
            body  : null,
            query : {}
        };
    }

    /**
     * Devuelve la instancia usada para realizar la petición.
     * Si no ha sido creada, se construye.
     *
     * Si se desea usar otra clase en vez de `XMLHttpRequest` se debe
     * llamar el método `setXhr` con una instancia que implemente la
     * interfaz de `XMLHttpRequest` o pasarla en la propiedad `xhr`
     * al construir la instancia.
     *
     * @method getHxr
     *
     * @return {XMLHttpRequest} Objeto a usar para realizar la petición.
     */
    getXhr()
    {
        let _xhr = this.xhr;
        if (!_xhr)
        {
            if (typeof window !== 'undefined' && window.XMLHttpRequest !== undefined)
            {
                _xhr = new XMLHttpRequest();
                this.setXhr(_xhr);
            }
            else
            {
                throw new Error('XMLHttpRequest === undefined && !this.xhr');
            }
        }
        return _xhr;
    }

    /**
     * Muestra información por pantalla.
     * Puede ser sobrescrito por clases hijas para cambiar el comportamiento.
     *
     * @method log
     */
    log()
    {
        // eslint-disable-next-line no-console
        console.log(...arguments);
    }

    /**
     * Callback llamado cuando se aborta la petición.
     *
     * @method _onRequestAbort
     *
     * @param {Event} e Evento recibido.
     *
     * @protected
     */
    _onRequestAbort(e)
    {
        this.emit(
            'req-abort',
            {
                event   : e,
                request : this
            }
        );
    }

    /**
     * Callback llamado cada vez que cambia el estado de la petición.
     *
     * @method _onRequestLoad
     *
     * @param {Event} e Evento recibido.
     *
     * @protected
     */
    _onRequestLoad(e)
    {
        this.chrono.stop();
        this.emit(
            'req-load',
            {
                event   : e,
                request : this
            }
        );
        let _response = this.response;
        if (_response.isSuccess())
        {
            this._onRequestSuccess(e);
        }
        else
        {
            this._onRequestError(e);
        }
    }

    /**
     * Dispara el evento especificado asignando el tiempo transcurrido.
     *
     * @method _onRequestEnd
     *
     * @param {Event} e Evento recibido.
     *
     * @protected
     */
    _onRequestEnd(e)
    {
        const _response = this.response;
        if (this.debug && typeof console === 'object')
        {
            console.groupCollapsed('jfAjax - Response: %s %s', this.method, url.parse(this.url).pathname);
            console.log('\n%s\n\n', _response.getInfo());
            console.groupEnd();
        }
        this.emit(
            'req-end',
            {
                event    : e,
                request  : this,
                response : _response.getResponse()
            }
        );
    }

    /**
     * Callback ejecutado cuando la petición finaliza en error.
     *
     * @method _onRequestError
     *
     * @param {Event} e Evento recibido.
     *
     * @protected
     */
    _onRequestError(e)
    {
        this.emit(
            'req-error',
            {
                event   : e,
                errors  : this.response.getErrors(),
                request : this
            }
        );
    }

    /**
     * Callback ejecutado cuando la petición finaliza en exitosamente.
     * Si no pide clave de operaciones avanza al siguiente paso.
     * Si el servidor devuelve un aviso, se muestra.
     *
     * @method _onRequestSuccess
     *
     * @param {Event} e Evento recibido.
     *
     * @protected
     */
    _onRequestSuccess(e)
    {
        this.emit(
            'req-success',
            {
                event    : e,
                request  : this,
                response : this.response.getResponse()
            }
        );
    }

    /**
     * Envía la petición al servidor.
     *
     * @method send
     */
    send()
    {
        if (this.isOnline)
        {
            let _xhr = this.getXhr();
            //------------------------------------------------------------------------------
            // Nos aseguramos que haya un manejador de la respuesta.
            //------------------------------------------------------------------------------
            let _response = this.response;
            if (!(_response instanceof jfAjaxResponseDefault))
            {
                _response = this.response = new jfAjaxResponseDefault();
            }
            _response.xhr = _xhr;
            //------------------------------------------------------------------------------
            // Construimos la URL para abrir la petición.
            //------------------------------------------------------------------------------
            const _data = this._formatData();
            let _url    = this._buildUrl(_data.query);
            _xhr.open(this.method, url.format(_url));
            //------------------------------------------------------------------------------
            // Agregamos las cabeceras que se hayan configurado.
            // A partir de aquí no se pueden agregar más cabeceras.
            //------------------------------------------------------------------------------
            let _headers = this.headers;
            for (let _header of _headers)
            {
                _xhr.setRequestHeader(_header, _headers.get(_header));
            }
            //------------------------------------------------------------------------------
            // Realizamos la petición.
            //------------------------------------------------------------------------------
            const _body = _data.body || null;
            if (this.debug && typeof console === 'object')
            {
                console.groupCollapsed('jfAjax -- Request: %s %s', this.method, _url.pathname);
                console.log('%s %s\nHost: %s\n%s\n\n%s', this.method, _url.pathname, _url.host, '' + _headers, _body || '');
                console.groupEnd();
            }
            this.chrono = new jfChrono('now');
            _xhr.send(_body);
        }
        else
        {
            this.log('Offline');
        }
    }

    /**
     * Asigna la instancia a usar para realizar la petición.
     * Debe implementar los métodos de XMLHttpRequest.
     *
     * @method setXhr
     *
     * @param {XMLHttpRequest} xhr Instancia del manejador de la petición.
     */
    setXhr(xhr)
    {
        xhr.addEventListener('abort', (e) => this._onRequestAbort(e));
        xhr.addEventListener('error', (e) => this._onRequestError(e));
        xhr.addEventListener('load', (e) => this._onRequestLoad(e));
        xhr.addEventListener('loadend', (e) => this._onRequestEnd(e));
        Object.assign(xhr, this.xhrConfig);
        this.xhr = xhr;
    }
}
