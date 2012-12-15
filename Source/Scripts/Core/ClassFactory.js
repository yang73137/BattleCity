var ClassFactory = {
    createClass: function (className, base, properties) {

        var newClass = function () { };
        newClass.properties = {};
        newClass.methods = newClass.prototype;
        newClass.className = className;
        newClass.base = base || {};

        if (base) {
            common.extend(true, newClass.properties, base.properties);
            common.extend(true, newClass.methods, base.methods);
        }

        if (properties) {
            for (var key in properties) {
                if (properties.hasOwnProperty(key)) {
                    if (properties[key] != null && properties[key].constructor == Function) {
                        newClass.methods[key] = properties[key];
                    }
                    else {
                        newClass.properties[key] = properties[key];
                    }
                }
            }
        }

        newClass.createNew = function (properties) {

            var newInstance = new this();
            newInstance.base = this.base.methods;
            common.extend(true, newInstance, this.properties);

            if (properties) {
                var params = {};
                for (var key in this.properties) {
                    if (properties.hasOwnProperty(key)) {
                        params[key] = properties[key];
                    }
                }
                common.extend(true, newInstance, params);
            }

            newInstance.class = this;
            newInstance.className = this.className;

            return newInstance;
        };

        newClass.addProperties = function (properties) {
            common.extend(true, this.properties, properties);
        };

        newClass.addMethods = function (methods) {
            common.extend(true, this.methods, methods);
        }

        newClass.methods.isInstancceOf = function (type) {
            var base = this.class;
            var isInstance = false;
            while (base) {
                if (base == type) {
                    isInstance = true;
                    break;
                }
                base = base.base;
            }
            return isInstance;
        };

        return newClass;
    }
};