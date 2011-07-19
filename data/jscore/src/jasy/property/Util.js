/* ********************************************************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2004-2008 1&1 Internet AG, Germany, http://www.1und1.de
     2009-2010 Sebastian Werner, http://sebastian-werner.net

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Sebastian Werner (wpbasti)
     * Andreas Ecker (ecker)
     * Martin Wittemann (martinwittemann)

******************************************************************************************************************** */

/**
 * Some utilities to work with properties
 */
qx.Bootstrap.define("qx.core.property.Util",
{
  statics :
  {
    /**
     * Returns the definition of the given property. Returns null
     * if the property does not exist.
     *
     * @param clazz {Class} class to check
     * @param name {String} name of the event to check for
     * @return {Map|null} whether the object support the given event.
     */
    getPropertyDefinition : function(clazz, name)
    {
      var props;
      while (clazz)
      {
        props = clazz.$$properties;
        if (props && props[name]) {
          return props[name];
        }

        clazz = clazz.superclass;
      }

      return null;
    },


    /**
     * Whether a class has the given property
     *
     * @param clazz {Class} class to check
     * @param name {String} name of the property to check for
     * @return {Boolean} whether the class includes the given property.
     */
    hasProperty : function(clazz, name) {
      return !!this.getPropertyDefinition(clazz, name);
    },
    
        
    /**
     * Returns a list of all properties supported by the given class
     *
     * @param clazz {Class} Class to query
     * @return {String[]} List of all property names
     */
    getProperties : function(clazz)
    {
      var list = [];

      while (clazz)
      {
        if (clazz.$$properties) {
          list.push.apply(list, qx.Bootstrap.getKeys(clazz.$$properties));
        }

        clazz = clazz.superclass;
      }

      return list;
    },
        
    
    /**
     * Returns the class or one of its superclasses which contains the
     * declaration for the given property in its class definition. Returns null
     * if the property is not specified anywhere.
     *
     * @param clazz {Class} class to look for the property
     * @param name {String} name of the property
     * @return {Class | null} The class which includes the property
     */
    getByProperty : function(clazz, name)
    {
      while (clazz)
      {
        if (clazz.$$properties && clazz.$$properties[name]) {
          return clazz;
        }

        clazz = clazz.superclass;
      }

      return null;
    }   
  }
});