Internal class for handling of dynamic properties.

<b>What's New</b>

<ul>
<li>Splitted property system for simple and multi storage properties.</li>
<li>Simple properties (which are about 66% of all properties) should be a lot faster then previously.</li>
<li>Multi properties works with a major improved inheritance and theme system.</li>
</ul>

<b>Storage changes</b>

<ul>
<li>All data is stored on a $$data object on each instance.</li>
<li>The system uses generated storage fields. There is basically no way to get information about the internal storage field from the outside. </li>
<li>This also dramatically reduces memory consumption and improved dispose time by a large extend.</li>
<li>Priorization is done using loops instead of multiple hard-coded lookups. This reduces code-size and memory footprint.</li>
</ul>

<b>Method creation</b>

<ul>
<li>No function compilation => Full Adobe AIR support, improved compiled size.</li>
<li>Property methods are created at declaration. => No more waiting for first instance.</li>
</ul>

<b>Memory consumption</b>

<ul>
<li>Themed values are accessed from the theme system when calling get() methods. This omits double storage of these values on every instance.</li>
<li>Inherited values are accessed from the parent, not copied over to every children.</li>
</ul>

<b>Functional changes</b>

<ul>
<li>No support for deferredInit anymore. This was a pretty complicated feature as it "moved" the init value from being property-specific to being instance-specific. This resulted into a lot of code and edge case handling.</li>
<li>Inheritance is sorted into priority chain: Has higher priority than init value.</li>
<li>There is no "inherit" special value anymore (was quite an edge-case). Forced inheritance not possible anymore.</li>
<li>Transform of value during set() is not supported anymore. Was not used widely and changing the stored value during set() is questionable.</li>
<li>String-based checks are not supported anymore. Just use function pointers everywhere.</li>
<li>Validation does not support function names from the member section anymore. This is basically because of members
might be overwritten and this way the validation might be modified/hacked in sub-classes which is undesirable.</li>
</ul>