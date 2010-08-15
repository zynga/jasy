/**
 * Class documentation
 */
qx.Class.define("my.custom.Class",
{
  /**
   * @param
   */
  construct : function(x) {

  },


  /* *********************************************
     MEMBERS
  ********************************************* */
   
  members :
  {
    /**
     * A really nice method
     */
    method : function(/** Object */ param1, /** String */ param2, /** my.other.Class */ param3)
    {
      // multi line
      // single comments
      doSomething();
      
      /* detected as a section */
      blockElem1();
      blockElem2();
      blockElem3();
      /* detected as a block */
      doElse();
            
      var complex = 1 * 2 * 3; // inline attached to previous statement
      var simple = 1 * 2;
    }
  }
});
