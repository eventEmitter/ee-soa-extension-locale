(function(){
    'use strict';


    const nunjucks = require('nunjucks');

    /**
     * Extension for nunjucks to allow asynchronous locale integration.
     *
     * The template syntax looks as follows:
     * {% locale "say.hello.to", username=user.name %}
     *
     * {@link{http://mozilla.github.io/nunjucks/api.html#custom-tags}}
     */
    module.exports = class LocaleExtension {


        constructor(locales, defaultLanguage, languageKey) {
            this.tags = ['locale'];
            this.locales = locales;
            this.languageKey = languageKey || 'language';
            this.defaultLanguage = defaultLanguage || 'en';
        }



        parse(parser, nodes, lexer) {
            // locale tag
            const tok = parser.nextToken();
            const args = parser.parseSignature(null, true);
            parser.advanceAfterBlockEnd(tok.value);
            return new nodes.CallExtension(this, 'run', args);
        }



        run(context, key, userLanguage, parameters) {
            const language = (typeof userLanguage === 'string' && userLanguage.length === 2) ? userLanguage: (context.lookup(this.languageKey) || this.defaultLanguage);
            const localized = this.locales.get((key && key.val ? key.val : key), language, parameters);
            return new nunjucks.runtime.SafeString(localized !== undefined && localized.length ? localized : key);
        }
    };
})();
